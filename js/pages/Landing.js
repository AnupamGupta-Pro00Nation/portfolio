import { playSound } from '../hooks/useAudio.js';
import { store } from '../lib/store.js';
import { toast } from '../components/Toast.js';

export class LandingPage {
  constructor(mountId) {
    this.container = document.getElementById(mountId);
    if (!this.container) return;
    this.animationId = null;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="landing-gateway-wrapper">
        <canvas id="landing-radar-canvas" class="landing-radar-canvas"></canvas>
        
        <div class="landing-gateway-card">
          <!-- System Status Bar -->
          <div class="gateway-top-bar">
            <div class="gateway-badge">
              <span class="status-beacon pulsing"></span>
              <span class="gateway-tag">ACCESS GATEWAY // SEC_OPS</span>
            </div>
            <div class="gateway-protocol">PROTOCOL: SHA-256 • TLS 1.3</div>
          </div>

          <!-- Main Identity Display -->
          <div class="gateway-hero">
            <div class="gateway-pretitle">[ AUTHORIZED VISITOR CLEARANCE ]</div>
            <h1 class="gateway-title glitch-hover" data-text="ANUPAM GUPTA">ANUPAM GUPTA</h1>
            <div class="gateway-subtitle">
              PURPLE TEAMING • WEB APPLICATION SECURITY • VULNERABILITY ASSESSMENT
            </div>
            <p class="gateway-bio">
              Final-year Computer Science undergraduate at GLA University specializing in Web Application Penetration Testing (OWASP Top 10) and low-level pure C Network Intrusion Detection (Npcap). Ex-WAPT & CTF Intern at CyberCell HQ Lucknow (UP Police).
            </p>
          </div>

          <!-- Interactive Security Scanner & Diagnostic Deck -->
          <div class="gateway-scanner-box" id="gateway-scanner-trigger" title="Click to run interactive security diagnostic handshake">
            <div class="scanner-header">
              <div class="scanner-title-group">
                <span class="scanner-icon">⚡</span>
                <span class="scanner-label">INTERACTIVE SECURITY HANDSHAKE</span>
              </div>
              <span class="scanner-action-hint">[ CLICK TO EXECUTE SCAN ]</span>
            </div>
            <div class="scanner-progress-bar">
              <div class="scanner-progress-fill" id="scanner-progress-fill"></div>
            </div>
            <div class="scanner-terminal" id="scanner-terminal-log">
              > System ready. Click to initialize cryptographic telemetry check...
            </div>
          </div>

          <!-- Gateway Action CTAs -->
          <div class="gateway-actions">
            <a href="#/dashboard" class="cyber-btn cyber-btn-primary gateway-enter-btn" id="btn-enter-portfolio">
              <span>ENTER PORTFOLIO // DASHBOARD →</span>
            </a>
            <button class="cyber-btn cyber-btn-outline" id="btn-landing-resume">
              <span>VIEW RESUME (PDF) ↗</span>
            </button>
            <a href="#/sandbox" class="cyber-btn cyber-btn-outline" id="btn-landing-sandbox">
              <span>LIVE C-NIDS SANDBOX ↗</span>
            </a>
            <a href="#/terminal" class="cyber-btn cyber-btn-outline" id="btn-landing-terminal">
              <span>INTERACTIVE TERMINAL ↗</span>
            </a>
          </div>

          <!-- Quick Navigation Tip -->
          <div class="gateway-footer-tip">
            <span>PRESS <kbd class="cyber-kbd">ENTER</kbd> OR <kbd class="cyber-kbd">SPACE</kbd> TO ENTER</span>
            <span>•</span>
            <span>LOCATION: JHANSI / MATHURA, INDIA</span>
            <span>•</span>
            <span class="text-success">READY FOR ROLES</span>
          </div>
        </div>
      </div>
    `;

    this.initRadarCanvas();
    this.bindEvents();
  }

  initRadarCanvas() {
    const canvas = this.container.querySelector('#landing-radar-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
    let height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;

    const onResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Mouse coordinates
    let mouse = { x: width / 2, y: height / 2, active: false };
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });
    canvas.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    // Radar & Nodes simulation
    let angle = 0;
    const targets = [];
    for (let i = 0; i < 24; i++) {
      targets.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 2 + Math.random() * 2,
        alpha: 0.2 + Math.random() * 0.6,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulseVal: Math.random() * Math.PI
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Grid Background
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.035)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Radar Concentric Circles around center
      const centerX = width / 2;
      const centerY = height / 2;
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.06)';
      for (let r = 80; r < Math.max(width, height) / 1.5; r += 100) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 3. Sweeping Radar Beam
      angle += 0.02;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      const gradient = ctx.createLinearGradient(0, 0, 300, 300);
      gradient.addColorStop(0, 'rgba(0, 255, 159, 0.22)');
      gradient.addColorStop(1, 'rgba(0, 255, 159, 0.0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 400, 0, Math.PI / 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 4. Interactive Crosshairs when mouse moves
      if (mouse.active) {
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 22, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(mouse.x - 30, mouse.y);
        ctx.lineTo(mouse.x + 30, mouse.y);
        ctx.moveTo(mouse.x, mouse.y - 30);
        ctx.lineTo(mouse.x, mouse.y + 30);
        ctx.stroke();
      }

      // 5. Blinking Target Nodes
      targets.forEach(t => {
        t.pulseVal += t.pulseSpeed;
        const currentAlpha = t.alpha * (0.6 + 0.4 * Math.sin(t.pulseVal));
        ctx.fillStyle = `rgba(0, 255, 159, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      this.animationId = requestAnimationFrame(draw);
    };

    draw();
  }

  bindEvents() {
    // 1. Enter button click sound & warp
    const enterBtn = this.container.querySelector('#btn-enter-portfolio');
    if (enterBtn) {
      enterBtn.addEventListener('click', (e) => {
        playSound('launch');
        store.addLog("GATEWAY: Access granted. Initializing main dashboard view.", "success");
      });
    }

    // 2. Resume button
    const resumeBtn = this.container.querySelector('#btn-landing-resume');
    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => {
        playSound('click');
        toast.show("Opening Anupam Gupta's Official Resume (PDF)...", "success");
        window.open('./assets/Anupam_Gupta_Resume.pdf', '_blank');
      });
    }

    // 3. Interactive Security Diagnostic Scanner
    const scannerBox = this.container.querySelector('#gateway-scanner-trigger');
    const fillBar = this.container.querySelector('#scanner-progress-fill');
    const logEl = this.container.querySelector('#scanner-terminal-log');

    let scanning = false;
    if (scannerBox && fillBar && logEl) {
      scannerBox.addEventListener('click', () => {
        if (scanning) return;
        scanning = true;
        playSound('scan');

        const logs = [
          "INITIALIZING: Security perimeter audit...",
          "VERIFYING: OWASP Top 10 Dynamic Fuzzing Engine [OK]",
          "DISSECTING: Pure C Multithreaded NIDS Frames [0 LOSS]",
          "CHECKING: Splunk SIEM Telemetry & Incident Forwarders [SYNCED]",
          "CALCULATING: Shannon Entropy Cryptographic Kernel [64-BIT OK]",
          "AUTHENTICATION COMPLETE: Full Access Clearance Granted!"
        ];

        let step = 0;
        fillBar.style.width = '0%';

        const interval = setInterval(() => {
          step++;
          fillBar.style.width = `${(step / logs.length) * 100}%`;
          logEl.textContent = `> ${logs[step - 1]}`;
          playSound(step === logs.length ? 'success' : 'type');

          if (step >= logs.length) {
            clearInterval(interval);
            scanning = false;
            toast.show("Security Handshake Complete! Welcome to Anupam's Portfolio.", "success");
          }
        }, 320);
      });
    }

    // 4. Keyboard Navigation: Space / Enter to enter
    this.keyHandler = (e) => {
      if (store.getState().activeView !== 'landing') return;
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
        e.preventDefault();
        playSound('launch');
        window.location.hash = '#/dashboard';
      }
    };
    window.addEventListener('keydown', this.keyHandler);
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.keyHandler) {
      window.removeEventListener('keydown', this.keyHandler);
    }
  }
}

