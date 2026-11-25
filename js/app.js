import { store } from './lib/store.js';
import { HashRouter } from './router/index.js';
import { playSound, initAudioContext } from './hooks/useAudio.js';
import { startThreatMonitoring } from './api/threats.js';
import { navLinks } from './data/navigation.js?v=3.0.0';
import { DashboardPage } from './pages/Dashboard.js?v=3.0.0';
import { TerminalViewPage } from './pages/TerminalView.js?v=3.0.0';
import { SandboxPage } from './pages/Sandbox.js?v=3.0.0';

class Application {
  constructor() {
    this.currentViewInstance = null;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    this.bindThemeControls();
    this.bindAudioControls();
    this.bindUIBindings();
    this.bindNavbarControls();
    this.renderNavigation();

    this.subscribeToStore();

    window.addEventListener('route-change', (e) => this.handleViewChange(e.detail.view));
    this.router = new HashRouter();

    startThreatMonitoring();

    document.body.addEventListener('click', () => {
      initAudioContext();
    }, { once: true });

    store.addLog("PORTFOLIO_INIT: Core modules loaded. Telemetry active.", "success");
  }

  bindThemeControls() {
    const btnGroup = document.getElementById('theme-btn-group');
    if (!btnGroup) return;

    // Sync active state with the stored theme (dark/light)
    btnGroup.querySelectorAll('.theme-select-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.val === store.getState().theme);
    });

    btnGroup.querySelectorAll('.theme-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.val;
        store.setState({ theme });

        // Update active class
        btnGroup.querySelectorAll('.theme-select-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        playSound('click');
      });
    });
  }

  bindAudioControls() {
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (!audioBtn) return;

    audioBtn.addEventListener('click', () => {
      initAudioContext();
      const nextSoundState = !store.getState().soundOn;
      store.setState({ soundOn: nextSoundState });

      audioBtn.textContent = nextSoundState ? "SOUND ON" : "SOUND MUTED";
      audioBtn.classList.toggle('muted', !nextSoundState);
      
      if (nextSoundState) {
        playSound('success');
      }
    });
  }

  bindNavbarControls() {
    const navbar = document.getElementById('main-navbar');
    const scrollContainer = document.querySelector('.main-content-panel');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDropdown = document.getElementById('mobile-dropdown');

    if (!navbar) return;

    // 1. Blur and scrolled shadow on scroll (support both container & window scrolling)
    const onScroll = () => {
      const scrollTop = (scrollContainer ? scrollContainer.scrollTop : 0) || window.scrollY || document.documentElement.scrollTop;
      if (scrollTop > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      this.scrollSpy();
    };

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', onScroll);
    }
    window.addEventListener('scroll', onScroll);

    // 2. Mobile Menu Trigger Animation
    if (mobileMenuBtn && mobileDropdown) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileDropdown.classList.toggle('active');
        playSound('click');
      });

      // Close menu on link click
      mobileDropdown.querySelectorAll('a').forEach(lnk => {
        lnk.addEventListener('click', () => {
          mobileMenuBtn.classList.remove('active');
          mobileDropdown.classList.remove('active');
        });
      });
    }

    // 2b. Tactical Telemetry Slide-Out Drawer Controls
    const telemetryBtn = document.getElementById('telemetry-toggle-btn');
    const telemetryDrawer = document.getElementById('telemetry-drawer');
    const telemetryBackdrop = document.getElementById('telemetry-backdrop');
    const telemetryCloseBtn = document.getElementById('telemetry-close-btn');

    const toggleTelemetry = (forceState) => {
      if (!telemetryDrawer) return;
      const isOpen = forceState !== undefined ? forceState : !telemetryDrawer.classList.contains('drawer-open');
      telemetryDrawer.classList.toggle('drawer-open', isOpen);
      if (telemetryBackdrop) telemetryBackdrop.classList.toggle('active', isOpen);
      playSound('click');
    };

    if (telemetryBtn) telemetryBtn.addEventListener('click', () => toggleTelemetry());
    if (telemetryCloseBtn) telemetryCloseBtn.addEventListener('click', () => toggleTelemetry(false));
    if (telemetryBackdrop) telemetryBackdrop.addEventListener('click', () => toggleTelemetry(false));

    // 3. Smooth Scroll handler for section links
    document.body.addEventListener('click', (e) => {
      const scrollLink = e.target.closest('.scroll-link');
      if (scrollLink) {
        e.preventDefault();
        const targetId = scrollLink.getAttribute('href');
        if (!targetId || !targetId.startsWith('#')) return;

        // Close mobile dropdown if open
        if (mobileMenuBtn && mobileDropdown) {
          mobileMenuBtn.classList.remove('active');
          mobileDropdown.classList.remove('active');
        }
        
        // If not in dashboard, go to dashboard first
        if (store.getState().activeView !== 'dashboard') {
          window.location.hash = '#/dashboard';
          // Wait for view mount to execute scroll
          setTimeout(() => this.smoothScrollTo(targetId), 250);
        } else {
          this.smoothScrollTo(targetId);
        }
        playSound('click');
      }
    });
  }

  smoothScrollTo(targetId, retries = 5) {
    const scrollContainer = document.querySelector('.main-content-panel');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      if (scrollContainer && scrollContainer.scrollHeight > scrollContainer.clientHeight) {
        const containerRect = scrollContainer.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        const targetTop = targetRect.top - containerRect.top + scrollContainer.scrollTop - 24;
        
        scrollContainer.scrollTo({
          top: Math.max(0, targetTop),
          behavior: 'smooth'
        });
      } else {
        const targetRect = targetElement.getBoundingClientRect();
        const absoluteTop = targetRect.top + window.scrollY - 80;
        window.scrollTo({
          top: Math.max(0, absoluteTop),
          behavior: 'smooth'
        });
      }
    } else if (retries > 0) {
      setTimeout(() => this.smoothScrollTo(targetId, retries - 1), 100);
    }
  }

  scrollSpy() {
    const sections = ['#hero-section', '#skills-section', '#projects-section', '#experience-section', '#certifications-section', '#contact-section'];
    const scrollContainer = document.querySelector('.main-content-panel');
    
    const isContainerScroll = scrollContainer && (scrollContainer.scrollHeight > scrollContainer.clientHeight);
    const containerTop = isContainerScroll ? scrollContainer.getBoundingClientRect().top : 70;
    let currentActive = null;

    for (const id of sections) {
      const el = document.querySelector(id);
      if (el) {
        const bounds = el.getBoundingClientRect();
        // Check if the element falls inside viewport threshold
        if (bounds.top - containerTop < 180 && bounds.bottom - containerTop > 50) {
          currentActive = id;
        }
      }
    }

    // Toggle active highlights on scroll links
    document.querySelectorAll('.nav-link-item, .mobile-nav-item').forEach(lnk => {
      if (lnk.getAttribute('href') === currentActive) {
        lnk.classList.add('active');
      } else if (lnk.classList.contains('scroll-link')) {
        lnk.classList.remove('active');
      }
    });
  }

  bindUIBindings() {
    // System IP simulation
    const ipDisplay = document.getElementById('sys-ip-display');
    if (ipDisplay) {
      // Simulate random remote connection IP
      fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => {
          if (data.ip) {
            ipDisplay.textContent = data.ip;
            store.addLog(`REMOTE_IP: Authenticated host location: ${data.ip}`, "success");
          }
        })
        .catch(() => {
          // Fallback to random private Class-C
          const randomPrivateIP = `192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*254) + 1}`;
          ipDisplay.textContent = randomPrivateIP;
        });
    }

    // Interactive button sounds
    document.body.addEventListener('click', (e) => {
      // Find closest element with href or specific tags
      const target = e.target.closest('a, button, [role="button"]');
      if (target && !target.dataset.sound) {
        playSound('click');
      }
    });
  }

  subscribeToStore() {
    // Render side threat logs list on store log updates
    const threatFeed = document.getElementById('live-threat-feed');
    const cpuVal = document.getElementById('cpu-load-val');
    const ramVal = document.getElementById('ram-load-val');
    const threatIndicator = document.getElementById('threat-indicator');
    
    let lastLogCount = 0;

    store.subscribe((state) => {
      // Update system specs metrics
      if (cpuVal) cpuVal.textContent = state.metrics.cpu;
      if (ramVal) ramVal.textContent = state.metrics.ram;

      // Update threat level visual indicator
      if (threatIndicator) {
        if (state.alertLevel === 'breach') {
          threatIndicator.textContent = "LEVEL_5 (BREACHED)";
          threatIndicator.className = "text-alert";
        } else {
          threatIndicator.textContent = "LEVEL_0 (SAFE)";
          threatIndicator.className = "text-success";
        }
      }

      // Render threat logs feed
      if (threatFeed && state.logs.length !== lastLogCount) {
        lastLogCount = state.logs.length;
        threatFeed.innerHTML = state.logs.map(log => {
          let lineClass = 'text-muted';
          if (log.type === 'alert') lineClass = 'text-alert';
          if (log.type === 'success') lineClass = 'text-success';
          return `
            <div style="border-bottom: 1px solid rgba(255,255,255,0.02); padding-bottom: 0.2rem; line-height: 1.3;">
              <span style="font-size: 0.6rem; color: var(--clr-text-dim);">[${log.time}]</span>
              <span class="${lineClass}">${log.text}</span>
            </div>
          `;
        }).join('');
        threatFeed.scrollTop = 0; // Keep newest logs at the top
      }
    });

    // Check custom dashboard signals from widgets
    window.addEventListener('threat-detected', (e) => {
      // Flash a red scan sweep outline if critical alert is fired
      if (e.detail.type === 'alert' && store.getState().soundOn) {
        playSound('alert');
      }
    });
  }

  renderNavigation() {
    const desktopLinks = document.querySelector('.nav-links');
    const mobileLinks = document.querySelector('.mobile-nav-list');
    if (!desktopLinks || !mobileLinks) return;

    // Render Desktop Links
    desktopLinks.innerHTML = navLinks.map(link => {
      const cls = link.type === 'scroll' ? 'nav-link-item scroll-link' : 'nav-link-item';
      const idAttr = link.activeId ? `id="${link.activeId}"` : '';
      return `<li><a href="${link.href}" class="${cls}" ${idAttr}>${link.label}</a></li>`;
    }).join('');

    // Render Mobile Links
    mobileLinks.innerHTML = navLinks.map(link => {
      const cls = link.type === 'scroll' ? 'mobile-nav-item scroll-link' : 'mobile-nav-item';
      const idAttr = link.activeId ? `id="${link.activeId.replace('nav-item', 'mob-item')}"` : '';
      return `<li><a href="${link.href}" class="${cls}" ${idAttr}>${link.label}</a></li>`;
    }).join('');
    
    // Re-run scrollSpy to ensure active highlights are set
    this.scrollSpy();
  }

  handleViewChange(view) {
    // Avoid re-rendering if the active view is already loaded (e.g. clicking internal scroll anchors)
    if (this.currentView === view && this.currentViewInstance) {
      return;
    }
    this.currentView = view;

    playSound('click');

    // Clean old listeners
    if (this.currentViewInstance && typeof this.currentViewInstance.destroy === 'function') {
      try {
        this.currentViewInstance.destroy();
      } catch (err) {
        console.warn('Error destroying view instance:', err);
      }
    }
    this.currentViewInstance = null;

    // Direct synchronous instantiation of views
    try {
      if (view === 'terminal') {
        this.currentViewInstance = new TerminalViewPage('view-terminal');
        setTimeout(() => this.currentViewInstance.focusTerminal(), 100);
      } else if (view === 'sandbox') {
        this.currentViewInstance = new SandboxPage('view-sandbox');
      } else {
        // Default to dashboard
        this.currentViewInstance = new DashboardPage('view-dashboard');
      }
    } catch (err) {
      console.error(`Failed to load view for: ${view}`, err);
    }
  }
}

// Start application
new Application();
