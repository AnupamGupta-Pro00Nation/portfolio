import { store } from '../lib/store.js';

export class HashRouter {
  constructor() {
    this.routes = {
      '#/dashboard': 'dashboard',
      '#/terminal': 'terminal',
      '#/sandbox': 'sandbox'
    };

    window.addEventListener('hashchange', () => this.handleRouting());
    // Initial call
    this.handleRouting();
  }

  handleRouting() {
    const rawHash = window.location.hash || '';
    let view = this.routes[rawHash];

    // If no route matches hash, default to dashboard
    if (!view) {
      if (rawHash.startsWith('#/sandbox')) {
        view = 'sandbox';
      } else if (rawHash.startsWith('#/terminal')) {
        view = 'terminal';
      } else {
        view = 'dashboard';
      }
    }

    // Update global state
    store.setState({ activeView: view });

    // Update active class in DOM pages
    document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById(`view-${view}`);
    if (targetPage) {
      targetPage.classList.add('active');
    }

    // Update top glass-navbar selection states
    document.querySelectorAll('.nav-link-item, .mobile-nav-item').forEach(item => item.classList.remove('active'));
    const desktopItem = document.getElementById(`nav-item-${view}`);
    if (desktopItem) {
      desktopItem.classList.add('active');
    }
    const mobileItem = document.getElementById(`mob-item-${view}`);
    if (mobileItem) {
      mobileItem.classList.add('active');
    }

    // Dispatch router change event
    window.dispatchEvent(new CustomEvent('route-change', { detail: { view } }));
  }

  static navigate(hash) {
    window.location.hash = hash;
  }
}
