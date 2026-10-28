/** 噜噜 · 桃粉手账. Native controls, inert artwork, scoped disposable theme. */
window.__ModuleLoader__.load({
  id: 'dsh-theme-lulu-journal',
  factory: (require) => {
    const React = require('react');
    const ART = /*__LULU_ASSETS__*/ {};
    const CSS = /*__LULU_CSS__*/ "";
    const ID = 'dsh-theme-lulu-journal';
    const ATTRIBUTE = 'data-lulu';
    const CONVERSATION = '[data-slot="main"] [data-phase]:has(> [data-conversation-content])';
    const SIDEBAR = '[data-slot="sidebar"]';
    const LOGO = '[data-slot="sidebar"] .wtg9ga_root:not(.wtg9ga_collapsed) .wtg9ga_logoRow';

    // The native theme service resolves light/dark/system and returns a disposer.
    const palette = {
      '--dsw-alias-bg-base': ['#fffdfb', '#2c2224'],
      '--dsw-alias-bg-layer-1': ['#fffaf7', '#37292c'],
      '--dsw-alias-bg-layer-2': ['#fff1eb', '#423034'],
      '--dsw-alias-bg-layer-3': ['#fce5df', '#513b40'],
      '--dsw-alias-bg-overlay': ['#fffaf7', '#3c2c30'],
      '--dsw-alias-bg-module-platform': ['#fffdfb', '#2c2224'],
      '--dsw-alias-bg-multi-select': ['#ffd9df', '#68434c'],
      '--dsw-alias-bg-skeleton': ['#f4e1dd', '#4b363c'],
      '--dsw-alias-label-primary': ['#593b39', '#ffede8'],
      '--dsw-alias-label-primary-bluish': ['#593b39', '#ffede8'],
      '--dsw-alias-label-secondary': ['#8b6864', '#e7c7c4'],
      '--dsw-alias-label-tertiary': ['#a47e77', '#cda6a4'],
      '--dsw-alias-label-caption': ['#a68d89', '#bc9799'],
      '--dsw-alias-label-dimmed': ['#c6aaa4', '#99777b'],
      '--dsw-alias-border-l1': ['#f3b8b9', '#975d6c'],
      '--dsw-alias-border-l2': ['#ffdad1', '#78515b'],
      '--dsw-alias-border-l3': ['#f9e1d9', '#573d45'],
      '--dsw-alias-border-l4': ['#f2b5b7', '#956273'],
      '--dsw-alias-border-l2-darkmode-thin': ['#ffdad1', '#78515b'],
      '--dsw-alias-brand-primary': ['#cd7e82', '#f5a3b1'],
      '--dsw-alias-brand-text': ['#ffffff', '#37222b'],
      '--dsw-alias-brand-primary-invert': ['#f5a3b1', '#cd7e82'],
      '--dsw-alias-button-primary-fill': ['#cd7e82', '#ed9aaa'],
      '--dsw-alias-button-primary-hover': ['#b96770', '#ffb2c0'],
      '--dsw-alias-button-primary-dimmed': ['#f5bdc3', '#9c626f'],
      '--dsw-alias-button-info-fill': ['#f59bab', '#ed9aaa'],
      '--dsw-alias-button-info-hover': ['#ed8c9e', '#ffb2c0'],
      '--dsw-alias-button-elevated-fill': ['#fffaf7', '#403035'],
      '--dsw-alias-button-floating-fill': ['#fffaf7', '#403035'],
      '--dsw-alias-button-floating-hover': ['#ffe5e3', '#5b3f48'],
      '--dsw-alias-button-tool-bar-fill': ['#fff5ef', '#403035'],
      '--dsw-alias-button-tool-bar-hover': ['#ffe4df', '#5b3f48'],
      '--dsw-alias-button-ghost-active-border': ['#cd7e82', '#ed9aaa'],
      '--dsw-alias-button-ghost-active-fill': ['#ffe5e3', '#68434c'],
      '--dsw-alias-button-ghost-active-hover': ['#ffd2d6', '#7b515e'],
      '--dsw-alias-state-business-primary': ['#d47480', '#f5a3b1'],
      '--dsw-alias-state-business-tertiary': ['#ffe5e3', '#68434c'],
      '--dsw-alias-interactive-bg-hover': ['#ffe7e1', '#543940'],
      '--dsw-alias-interactive-bg-active': ['#ffd4d8', '#6c4651'],
      '--dsw-alias-interactive-bg-hover-solid': ['#ffe7e1', '#543940'],
      '--dsw-alias-interactive-bg-hover-accent': ['#ffdcdf', '#68434c'],
      '--dsw-alias-markdown-code-block': ['#faf0ec', '#34272c'],
      '--dsw-alias-markdown-code-block-banner': ['#f3e0dc', '#4e3840'],
      '--dsw-alias-markdown-inline-code': ['#f9e7e3', '#593d48'],
      '--dsw-alias-markdown-citation': ['#fcf0ec', '#45323a'],
      '--dsw-alias-separator-primary': ['#f5d7cb', '#6e4854'],
      '--dsw-alias-scrollbar-bg-l1': ['#eab4b4', '#93616e'],
      '--dsw-alias-scrollbar-bg-l2': ['#f0c9c6', '#805360'],
      '--dsw-alias-scrollbar-hover-l1': ['#d98a98', '#c8889c'],
      '--dsw-alias-scrollbar-hover-l2': ['#e5a2ac', '#b1778a'],
      '--dsw-specific-sidebar-fill': ['#fde8e4', '#3c2b2d'],
      '--dsw-specific-sidebar-nav-item-active': ['#ffd4d8', '#6c4651'],
      '--dsw-specific-sidebar-nav-item-active-accent': ['#f7bec8', '#7d5160'],
      '--dsw-specific-sidebar-nav-item-hover': ['#ffe3dc', '#563b41'],
      '--dsw-specific-bubble': ['#fff0eb', '#63424b'],
      '--dsw-specific-bubble-highlight': ['#f9c8cf', '#7d5262'],
      '--dsw-specific-input-major': ['#fffdfb', '#382a30'],
      '--dsw-specific-login-input': ['#fffdfb', '#382a30'],
      '--dsw-specific-menu': ['#fffaf7', '#403036'],
      '--dsw-specific-selector': ['#fff5ef', '#593c47'],
      '--dsw-specific-tip': ['#fff3e7', '#5c4544']
    };
    const tokens = Object.fromEntries(Object.entries(palette).map(([key, [light, dark]]) => [key, { light, dark }]));

    function SidebarPhoto({wide}) {
      return wide ? React.createElement('div', {className:'lulu-sidebar-photo','aria-hidden':true}) : null;
    }
    function apply(ctx) {
      ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({name:'sidebar.footer.action',id:'lulu-sidebar-photo',order:15},SidebarPhoto));
      ctx.effect(() => ctx.theme.overrideTokens(ID, tokens), 'lulu: native palette');
      ctx.effect(() => {
        const body = document.body;
        const previousBodyAttribute = body.getAttribute(ATTRIBUTE);
        const style = document.createElement('style');
        style.dataset.plugin = ID;
        // Large PNGs exceed Chromium's custom-property substitution limit.
        // Keep image URLs in direct declarations; never store them in CSS vars.
        style.textContent = CSS
          + `\nbody[${ATTRIBUTE}] .lulu-room {background-image:url(${JSON.stringify(ART.clean)})}`
          + `\nbody[${ATTRIBUTE}] .lulu-brand {background-image:url(${JSON.stringify(ART.source)})}`;
        style.textContent += '\nbody[' + ATTRIBUTE + '] .lulu-sidebar-photo{background-image:url(' + JSON.stringify(ART.photo) + ')}';
        document.head.appendChild(style);
        body.setAttribute(ATTRIBUTE, '1');

        const mounted = new Map();
        const observed = new Set();
        let frame = 0;
        let disposed = false;

        const rememberProperty = (element, name) => ({
          value: element.style.getPropertyValue(name),
          priority: element.style.getPropertyPriority(name)
        });
        const restoreProperty = (element, name, previous, written) => {
          // Do not overwrite changes made by a later layer after this one.
          if (element.style.getPropertyValue(name) !== written) return;
          if (previous.value) element.style.setProperty(name, previous.value, previous.priority);
          else element.style.removeProperty(name);
        };
        const make = (className, parent) => {
          const node = document.createElement('div');
          node.className = className;
          node.setAttribute('aria-hidden', 'true');
          node.dataset.luluOwned = '';
          node.style.setProperty('pointer-events', 'none');
          if (className === 'lulu-brand') {
            const caption = document.createElement('div');
            caption.className = 'lulu-wordmark';
            const small = document.createElement('div');
            small.className = 'lulu-brand-caption'; small.textContent = 'DeepSeek Harness';
            const title = document.createElement('div');
            title.className = 'lulu-brand-title'; title.textContent = '噜噜';
            caption.prepend(title); caption.prepend(small); node.prepend(caption);
          }
          parent.prepend(node);
          return node;
        };
        const mount = (element, role) => {
          const state = {
            role,
            nodes: (role === 'logo' ? ['lulu-brand'] : ['lulu-room'])
              .map(name => make(name, element)),
            scale: rememberProperty(element, '--lulu-scale'),
            width: role === 'conversation' ? rememberProperty(element, '--lulu-pane-width') : null,
            art: role === 'conversation' ? element.getAttribute('data-lulu-art') : null,
            writtenScale: null,
            writtenWidth: null,
            writtenArt: null
          };
          mounted.set(element, state);
          return state;
        };
        const unmount = (element, state) => {
          state.nodes.forEach(node => node.remove());
          restoreProperty(element, '--lulu-scale', state.scale, state.writtenScale);
          if (state.role === 'conversation') {
            restoreProperty(element, '--lulu-pane-width', state.width, state.writtenWidth);
            if (element.getAttribute('data-lulu-art') === state.writtenArt) {
              if (state.art === null) element.removeAttribute('data-lulu-art');
              else element.setAttribute('data-lulu-art', state.art);
            }
          }
          mounted.delete(element);
        };
        const setProperty = (element, name, value) => {
          if (element.style.getPropertyValue(name) !== value) element.style.setProperty(name, value);
        };
        const schedule = () => {
          if (!disposed && !frame) frame = requestAnimationFrame(update);
        };
        const resizes = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
        function update() {
          frame = 0;
          if (disposed) return;
          const roots = [...document.querySelectorAll(CONVERSATION)];
          const sidebar = document.querySelector(SIDEBAR);
          const logo = document.querySelector(LOGO);
          const targets = new Set([...roots, ...(logo ? [logo] : [])]);
          for (const [element, state] of mounted) {
            if (!element.isConnected || !targets.has(element)) unmount(element, state);
          }

          let brandScale = '1.00000';
          for (const element of roots) {
            const state = mounted.get(element) || mount(element, 'conversation');
            const bounds = element.getBoundingClientRect();
            const mode = bounds.width >= 900
              ? 'wide' : 'compact';
            // Fill the pane height in the illustrated layout. A wider sidebar
            // crops only the empty left margin rather than the character's feet.
            const scale = Math.max(.55, Math.min(1.35, bounds.height / 1012,
              mode === 'wide' ? Infinity : bounds.width / 1234));
            state.writtenScale = scale.toFixed(5);
            state.writtenWidth = `${bounds.width.toFixed(2)}px`;
            state.writtenArt = mode;
            setProperty(element, '--lulu-scale', state.writtenScale);
            setProperty(element, '--lulu-pane-width', state.writtenWidth);
            if (element.getAttribute('data-lulu-art') !== mode) element.setAttribute('data-lulu-art', mode);
            brandScale = state.writtenScale;
          }
          if (logo) {
            const state = mounted.get(logo) || mount(logo, 'logo');
            const availableBrandScale = (logo.getBoundingClientRect().width - 12) / 235;
            state.writtenScale = Math.max(.65, Math.min(1.12, availableBrandScale)).toFixed(5);
            setProperty(logo, '--lulu-scale', state.writtenScale);
          }

          // Observe the actual native panes: dragging the sidebar updates art
          // immediately without changing its width, grid, handle, or storage.
          const nextObserved = new Set([...roots, ...(sidebar ? [sidebar] : [])]);
          for (const element of observed) if (!nextObserved.has(element)) {
            resizes?.unobserve(element);
            observed.delete(element);
          }
          for (const element of nextObserved) if (!observed.has(element)) {
            resizes?.observe(element);
            observed.add(element);
          }
        }
        const mutations = new MutationObserver(records => {
          if (records.some(record => record.type === 'childList' || record.attributeName === 'data-sidebar-collapsed')) schedule();
        });
        mutations.observe(document.getElementById('root') || body, {
          childList: true, subtree: true, attributes: true, attributeFilter: ['data-sidebar-collapsed']
        });
        window.addEventListener('resize', schedule);
        update();

        return () => {
          disposed = true;
          mutations.disconnect();
          resizes?.disconnect();
          observed.clear();
          window.removeEventListener('resize', schedule);
          if (frame) cancelAnimationFrame(frame);
          frame = 0;
          for (const [element, state] of mounted) unmount(element, state);
          style.remove();
          if (body.getAttribute(ATTRIBUTE) === '1') {
            if (previousBodyAttribute === null) body.removeAttribute(ATTRIBUTE);
            else body.setAttribute(ATTRIBUTE, previousBodyAttribute);
          }
        };
      }, 'lulu: scoped artwork and responsive native layout');
    }
    return { inject: ['theme', 'slots'], apply };
  }
});
