import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script, createContext } from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(resolve(root, 'src/client.js'), 'utf8');
const manifest = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
const ID = 'dsh-theme-lulu-journal';
const ATTRIBUTE = 'data-lulu';
const CONVERSATION = '[data-slot="main"] [data-phase]:has(> [data-conversation-content])';
const SIDEBAR = '[data-slot="sidebar"]';
const LOGO = '[data-slot="sidebar"] .wtg9ga_root:not(.wtg9ga_collapsed) .wtg9ga_logoRow';
let passed = 0;
function check(name, fn) {
  fn();
  passed += 1;
  console.log(`PASS ${name}`);
}

// These tests protect the native DOM and lifecycle boundary. A real DSH visual
// and pointer-interaction pass is still needed to assess the rendered design.
function fixture() {
  const frames = new Map();
  const mutations = [];
  const resizes = [];
  const listeners = new Map();
  const effects = [];
  let frameId = 0;
  let module;
  let paletteReleased = false;
  class Style {
    constructor(owner) { this.owner = owner; this.values = new Map(); }
    getPropertyValue(name) { return this.values.get(name)?.value || ''; }
    getPropertyPriority(name) { return this.values.get(name)?.priority || ''; }
    setProperty(name, value, priority = '') {
      if (this.owner.native) {
        assert.ok(['conversation', 'replacement-conversation', 'logo'].includes(this.owner.name));
        assert.ok(['--lulu-scale', '--lulu-pane-width'].includes(name), `native style must not change: ${name}`);
      }
      this.values.set(name, { value: String(value), priority });
    }
    removeProperty(name) {
      if (this.owner.native) assert.ok(['--lulu-scale', '--lulu-pane-width'].includes(name));
      const previous = this.getPropertyValue(name);
      this.values.delete(name);
      return previous;
    }
  }
  class Element {
    constructor(name, native = false) {
      this.name = name;
      this.native = native;
      this.parentElement = null;
      this.children = [];
      this.attributes = new Map();
      this.dataset = {};
      this.style = new Style(this);
      this.bounds = { width: 1234, height: 1003 };
      this._text = '';
    }
    get isConnected() { return this === doc || Boolean(this.parentElement?.isConnected); }
    get textContent() { assert.ok(!this.native, 'native conversation text must never be read'); return this._text; }
    set textContent(value) { assert.ok(!this.native, 'native conversation text must never be replaced'); this._text = value; }
    get innerHTML() { throw new Error('Native markup inspection is not required by a theme.'); }
    set innerHTML(value) { throw new Error('A theme cannot replace native markup.'); }
    getAttribute(name) { return this.attributes.get(name) ?? null; }
    setAttribute(name, value) {
      if (this.native) assert.ok(name === ATTRIBUTE || name === 'data-lulu-art', `unexpected native attribute ${name}`);
      this.attributes.set(name, String(value));
    }
    removeAttribute(name) {
      if (this.native) assert.ok(name === ATTRIBUTE || name === 'data-lulu-art');
      this.attributes.delete(name);
    }
    prepend(child) {
      assert.equal(child.name, 'div');
      assert.ok(!child.native);
      if (!this.native) { child.parentElement = this; this.children.unshift(child); return; }
      assert.ok(Object.hasOwn(child.dataset, 'luluOwned'));
      assert.ok(['conversation', 'replacement-conversation', 'logo'].includes(this.name));
      child.parentElement = this;
      this.children.unshift(child);
    }
    appendChild(child) {
      assert.equal(this, head);
      assert.equal(child.name, 'style');
      child.parentElement = this;
      this.children.push(child);
    }
    remove() {
      assert.ok(!this.native, 'native controls/messages cannot be removed');
      if (this.parentElement) this.parentElement.children = this.parentElement.children.filter(child => child !== this);
      this.parentElement = null;
    }
    getBoundingClientRect() { return { ...this.bounds }; }
  }
  const doc = new Element('document', true);
  const native = (parent, name) => {
    const node = new Element(name, true);
    node.parentElement = parent;
    parent.children.push(node);
    return node;
  };
  const head = native(doc, 'head');
  const body = native(doc, 'body');
  const app = native(body, 'app');
  const sidebar = native(app, 'sidebar');
  const logo = native(sidebar, 'logo');
  logo.bounds = { width: 216, height: 78 };
  const resizer = native(sidebar, 'resizer');
  const main = native(app, 'main');
  const conversation = native(main, 'conversation');
  const header = native(conversation, 'header');
  const messages = native(conversation, 'messages');
  messages._text = 'native chat sentinel';
  const composer = native(conversation, 'composer');
  const roots = [conversation];
  let visibleLogo = logo;
  body.attributes.set(ATTRIBUTE, 'previous');
  conversation.style.values.set('--lulu-scale', { value: '.91', priority: 'important' });
  conversation.style.values.set('--lulu-pane-width', { value: '999px', priority: '' });
  conversation.attributes.set('data-lulu-art', 'previous-mode');
  const document = {
    head, body,
    createElement: name => {
      assert.ok(['style', 'div'].includes(name));
      return new Element(name);
    },
    getElementById: id => { assert.equal(id, 'root'); return app; },
    querySelectorAll: selector => { assert.equal(selector, CONVERSATION); return [...roots]; },
    querySelector: selector => {
      if (selector === SIDEBAR) return sidebar;
      if (selector === LOGO) return visibleLogo;
      throw new Error(`Unexpected selector: ${selector}`);
    }
  };
  class Mutations {
    constructor(callback) { this.callback = callback; this.active = false; mutations.push(this); }
    observe(target, options) { assert.equal(target, app); assert.equal(options.subtree, true); this.active = true; }
    disconnect() { this.active = false; }
  }
  class Resizes {
    constructor(callback) { this.callback = callback; this.observed = new Set(); resizes.push(this); }
    observe(target) { this.observed.add(target); }
    unobserve(target) { this.observed.delete(target); }
    disconnect() { this.observed.clear(); }
  }
  const window = {
    __ModuleLoader__: { load: declaration => { assert.equal(declaration.id, ID); module = declaration.factory(name => { assert.equal(name, 'react'); return {createElement(){}}; }); } },
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: (name, fn) => { assert.equal(listeners.get(name), fn); listeners.delete(name); }
  };
  const forbidden = () => { throw new Error('Theme must not access network or persisted application data.'); };
  new Script(source, { filename: 'src/client.js' }).runInContext(createContext({
    window, document, MutationObserver: Mutations, ResizeObserver: Resizes,
    requestAnimationFrame: callback => { frames.set(++frameId, callback); return frameId; },
    cancelAnimationFrame: id => frames.delete(id),
    fetch: forbidden, localStorage: { getItem: forbidden, setItem: forbidden },
    console
  }));
  module.apply({
    slots: {inject(){}, register(){}},
    effect: callback => effects.push(callback()),
    theme: {
      overrideTokens: (id, tokens) => {
        assert.equal(id, ID);
        assert.equal(tokens['--dsw-specific-sidebar-fill'].light, '#fde8e4');
        assert.ok(tokens['--dsw-specific-sidebar-fill'].dark);
        return () => { paletteReleased = true; };
      }
    }
  });
  const flush = () => {
    const queue = [...frames.values()];
    frames.clear();
    for (const callback of queue) callback();
  };
  const resize = (width, height = 1003) => {
    roots[0].bounds = { width, height };
    resizes[0].callback([{ target: sidebar }]);
    flush();
  };
  const nativeSnapshot = () => [resizer, header, messages, composer].map(node => ({
    name: node.name, parent: node.parentElement.name, text: node._text, attrs: [...node.attributes]
  }));
  const initialNative = nativeSnapshot();
  return {
    body, head, roots, sidebar, logo, conversation, mutations, resizes, frames, listeners,
    resize, flush, nativeSnapshot, initialNative,
    withoutConversation() {
      roots.splice(0);
      mutations[0].callback([{ type: 'childList' }]);
      flush();
    },
    hideLogo() { visibleLogo = null; mutations[0].callback([{ type: 'attributes', attributeName: 'data-sidebar-collapsed' }]); flush(); },
    replaceConversation() {
      roots.splice(0, 1, native(main, 'replacement-conversation'));
      main.children = main.children.filter(node => node !== conversation);
      conversation.parentElement = null;
      mutations[0].callback([{ type: 'childList' }]);
      flush();
      return roots[0];
    },
    cleanup() { effects.reverse().forEach(dispose => dispose?.()); },
    get paletteReleased() { return paletteReleased; }
  };
}

check('mounting adds only inert art and leaves native controls and messages intact', () => {
  const h = fixture();
  assert.equal(h.body.getAttribute(ATTRIBUTE), '1');
  assert.equal(h.head.children.length, 1);
  const art = h.conversation.children.filter(node => !node.native);
  assert.deepEqual(art.map(node => node.className).sort(), ['lulu-room']);
  assert.equal(h.logo.children.length, 1);
  for (const node of [...art, ...h.logo.children]) {
    assert.equal(node.getAttribute('aria-hidden'), 'true');
    assert.equal(node.style.getPropertyValue('pointer-events'), 'none');
  }
  assert.equal(h.conversation.getAttribute('data-lulu-art'), 'wide');
  assert.equal(h.conversation.style.getPropertyValue('--lulu-scale'), '0.99111');
  assert.deepEqual(h.nativeSnapshot(), h.initialNative);
  h.cleanup();
});

check('sidebar resize notifications adapt artwork without altering native sidebar geometry', () => {
  const h = fixture();
  assert.ok(h.resizes[0].observed.has(h.sidebar));
  assert.ok(h.resizes[0].observed.has(h.conversation));
  h.resize(700);
  assert.equal(h.conversation.getAttribute('data-lulu-art'), 'compact');
  assert.ok(Number(h.conversation.style.getPropertyValue('--lulu-scale')) < .6);
  assert.equal(h.conversation.style.getPropertyValue('--lulu-pane-width'), '700.00px');
  h.resize(1200);
  assert.equal(h.conversation.getAttribute('data-lulu-art'), 'wide');
  assert.equal(h.sidebar.style.values.size, 0, 'native sidebar inline geometry remains untouched');
  assert.deepEqual(h.nativeSnapshot(), h.initialNative);
  h.cleanup();
});

check('sidebar branding fits the actual logo row even outside a conversation', () => {
  const h = fixture();
  const fits = () => assert.ok(Number(h.logo.style.getPropertyValue('--lulu-scale')) * 235 <= h.logo.bounds.width - 11.99);
  fits();
  h.withoutConversation();
  fits();
  h.logo.bounds.width = 180;
  h.resizes[0].callback([{ target: h.sidebar }]);
  h.flush();
  fits();
  assert.ok(Number(h.logo.style.getPropertyValue('--lulu-scale')) >= .65);
  h.cleanup();
});

check('conversation replacement and sidebar collapse release stale art and observations', () => {
  const h = fixture();
  const replacement = h.replaceConversation();
  assert.equal(h.conversation.children.filter(node => !node.native).length, 0);
  assert.equal(h.conversation.style.getPropertyValue('--lulu-scale'), '.91');
  assert.equal(h.conversation.style.getPropertyPriority('--lulu-scale'), 'important');
  assert.equal(h.conversation.getAttribute('data-lulu-art'), 'previous-mode');
  assert.ok(!h.resizes[0].observed.has(h.conversation));
  assert.ok(h.resizes[0].observed.has(replacement));
  h.hideLogo();
  assert.equal(h.logo.children.length, 0);
  assert.equal(h.logo.style.getPropertyValue('--lulu-scale'), '');
  h.cleanup();
  assert.equal(replacement.style.getPropertyValue('--lulu-scale'), '');
  assert.equal(replacement.getAttribute('data-lulu-art'), null);
});

check('disposal restores prior values and cancels every owned listener/observer/frame/layer', () => {
  const h = fixture();
  h.mutations[0].callback([{ type: 'childList' }]);
  assert.ok(h.frames.size > 0);
  h.cleanup();
  assert.ok(h.paletteReleased);
  assert.equal(h.body.getAttribute(ATTRIBUTE), 'previous');
  assert.equal(h.head.children.length, 0);
  assert.equal(h.conversation.children.filter(node => !node.native).length, 0);
  assert.equal(h.conversation.style.getPropertyValue('--lulu-scale'), '.91');
  assert.equal(h.conversation.style.getPropertyPriority('--lulu-scale'), 'important');
  assert.equal(h.conversation.style.getPropertyValue('--lulu-pane-width'), '999px');
  assert.equal(h.conversation.getAttribute('data-lulu-art'), 'previous-mode');
  assert.equal(h.logo.style.values.size, 0);
  assert.equal(h.listeners.size, 0);
  assert.equal(h.frames.size, 0);
  assert.equal(h.resizes[0].observed.size, 0);
  assert.ok(h.mutations.every(observer => !observer.active));
  h.resizes[0].callback([]);
  h.mutations[0].callback([{ type: 'childList' }]);
  assert.equal(h.frames.size, 0, 'late observer callbacks cannot remount disposed artwork');
  assert.deepEqual(h.nativeSnapshot(), h.initialNative);
});

if (!process.argv.includes('--source-only')) {
  const [bundle, css, patch] = await Promise.all([
    readFile(resolve(root, 'lib/client.js'), 'utf8'),
    readFile(resolve(root, 'src/theme.css'), 'utf8'),
    readFile(resolve(root, 'cordis.patch.yml'), 'utf8')
  ]);
  const assets = {};
  for (const [key, file] of Object.entries({ source: 'brand-mark.png', clean: 'journal-right.png', photo: 'sidebar-photo.png' })) {
    const bytes = await readFile(resolve(root, 'assets', file));
    assert.ok(bytes.readUInt32BE(16) > 0);
    assert.ok(bytes.readUInt32BE(20) > 0);
    assets[key] = `data:image/png;base64,${bytes.toString('base64')}`;
  }
  check('distribution exactly embeds the current approved assets, source, and CSS', () => {
    assert.equal(bundle, source.replace('/*__LULU_ASSETS__*/ {}', () => JSON.stringify(assets))
      .replace('/*__LULU_CSS__*/ ""', () => JSON.stringify(css)));
    assert.ok(!bundle.includes('/*__LULU_'));
    new Script(bundle, { filename: 'lib/client.js' });
  });
  for (const path of [manifest.main, manifest.exports['./client'], manifest.icon, manifest.dsh.bundle.patch, 'locale/en.json', 'locale/zh.json']) {
    await access(resolve(root, path));
  }
  const icon = await readFile(resolve(root, manifest.icon));
  check('manifest and Cordis patch resolve all theme entry points', () => {
    assert.equal(manifest.name, ID);
    assert.match(patch, /name:\s*dsh-theme-lulu-journal(?:\s|$)/);
    assert.equal(manifest.dsh.client.platform, 'web');
    assert.equal(manifest.dsh.client.immediately, true);
    assert.ok(icon.byteLength <= 256 * 1024, 'plugin icon must fit the DSH metadata 256 KiB limit');
  });
}
console.log(`Verified ${passed} theme checks.`);
