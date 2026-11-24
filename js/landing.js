// js/landing.js - Standalone Interactive Cyber Gateway Logic

class LandingAudioEngine {
  constructor() {
    this.ctx = null;
    this.soundOn = true;
    this.ambientOsc = null;
    this.ambientGain = null;
    this.lastHover = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!this.soundOn) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const sub = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, now);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);

    sub.type = 'sine';
    sub.frequency.setValueAtTime(160, now);
    sub.frequency.exponentialRampToValueAtTime(50, now + 0.04);

    osc.connect(filter);
    sub.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.start(now);
    sub.start(now);
    osc.stop(now + 0.04);
    sub.stop(now + 0.04);
  }

  playHover() {
    if (!this.soundOn) return;
    const nowMs = Date.now();
    if (nowMs - this.lastHover < 45) return;
    this.lastHover = nowMs;

    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1150, now);
    osc.frequency.exponentialRampToValueAtTime(1850, now + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  playKeypress(freq = 360) {
    if (!this.soundOn) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(850, now);
    filter.Q.setValueAtTime(2.5, now);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq + Math.random() * 80, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.03);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  playScanStep() {
    if (!this.soundOn) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600 + Math.random() * 400, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  playSuccessChord() {
    if (!this.soundOn) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 4-tone ascending cyber chime
    const chords = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    chords.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + idx * 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      gain.gain.setValueAtTime(0.14, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.35);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.35);
    });
  }

  playWarpLaunch() {
    if (!this.soundOn) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(4200, now + 0.45);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.45);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.start(now);
    osc.stop(now + 0.55);
  }

  playNeutralize() {
    if (!this.soundOn) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.start(now);
    osc.stop(now + 0.14);
  }
}

const audio = new LandingAudioEngine();

// Matrix Rain Canvas in deep background
function initMatrixRain() {
  const canvas = document.getElementById('landing-matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const chars = '0123456789ABCDEF<>/*&%$#@!+-=~';
  const fontSize = 14;
  const columns = Math.floor(width / fontSize);
  const drops = Array(columns).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(7, 9, 14, 0.12)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#00ff66';
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(draw, 45);
}

// 3D-feeling Interactive Radar & Constellation Canvas
function initInteractiveCanvas() {
  const canvas = document.getElementById('landing-interactive-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: width / 2, y: height / 2, active: false };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  // Nodes
  const numNodes = window.innerWidth < 768 ? 35 : 75;
  const nodes = [];
  for (let i = 0; i < numNodes; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.9,
      vy: (Math.random() - 0.5) * 0.9,
      radius: 1.5 + Math.random() * 2,
      baseAlpha: 0.2 + Math.random() * 0.6
    });
  }

  let radarAngle = 0;

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Radar concentric circles
    const centerX = width / 2;
    const centerY = height / 2;
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let r = 120; r < Math.max(width, height); r += 160) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Rotating Radar Sweep
    radarAngle += 0.012;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(radarAngle);
    const grad = ctx.createLinearGradient(0, 0, 450, 450);
    grad.addColorStop(0, 'rgba(0, 243, 255, 0.12)');
    grad.addColorStop(1, 'rgba(0, 243, 255, 0.0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 500, 0, Math.PI / 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Update and draw nodes
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0) node.x = width;
      if (node.x > width) node.x = 0;
      if (node.y < 0) node.y = height;
      if (node.y > height) node.y = 0;

      // Mouse attraction / deflection
      const dx = mouse.x - node.x;
      const dy = mouse.y - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        node.x -= (dx / dist) * 1.5;
        node.y -= (dy / dist) * 1.5;
      }

      ctx.fillStyle = `rgba(0, 255, 159, ${node.baseAlpha})`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Connecting laser lines between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          const alpha = (1 - dist / 110) * 0.18;
          ctx.strokeStyle = `rgba(0, 243, 255, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Interactive cursor targeting reticle
    if (mouse.active) {
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 20, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(mouse.x - 28, mouse.y);
      ctx.lineTo(mouse.x + 28, mouse.y);
      ctx.moveTo(mouse.x, mouse.y - 28);
      ctx.lineTo(mouse.x, mouse.y + 28);
      ctx.stroke();
    }

    requestAnimationFrame(render);
  }

  render();
}

// Interactive Tabs, Biometric Handshake, Cipher, and Transitions
document.addEventListener('DOMContentLoaded', () => {
  initMatrixRain();
  initInteractiveCanvas();

  // 1. First interaction unlocks audio
  document.body.addEventListener('click', () => {
    audio.init();
  }, { once: true });

  // 2. Sound Toggle
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      audio.soundOn = !audio.soundOn;
      soundBtn.classList.toggle('muted', !audio.soundOn);
      soundBtn.innerHTML = audio.soundOn 
        ? `<span>🔊</span> <span>SOUND: ACTIVE</span>`
        : `<span>🔇</span> <span>SOUND: MUTED</span>`;
      if (audio.soundOn) audio.playClick();
    });
  }

  // 3. Theme Palettes
  document.querySelectorAll('.theme-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      document.documentElement.setAttribute('data-theme', theme);
      document.querySelectorAll('.theme-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      audio.playClick();
    });
  });

  // 4. Tab Switching
  const tabButtons = document.querySelectorAll('.int-tab-btn');
  const panels = document.querySelectorAll('.int-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabTarget = btn.dataset.tab;
      tabButtons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(`panel-${tabTarget}`);
      if (targetPanel) targetPanel.classList.add('active');

      audio.playClick();
    });
    btn.addEventListener('mouseenter', () => audio.playHover());
  });

  // 5. Biometric Scanner Handshake
  const scannerPad = document.getElementById('biometric-scanner-pad');
  const scanFill = document.getElementById('scan-progress-fill');
  const terminalLog = document.getElementById('scan-terminal-log');
  let isScanning = false;

  const credentialsAudit = [
    "INITIALIZING: Cryptographic visitor handshake...",
    "VERIFYING: OWASP Top 10 Dynamic Fuzzing Engine [OK]",
    "DISSECTING: Pure C Multithreaded NIDS Packet Dissector [ONLINE]",
    "AUDITING: CyberCell HQ Lucknow Internship Records [VERIFIED]",
    "CALCULATING: Real-Time Shannon Entropy Math [READY]",
    "ACCESS GRANTED: Security clearance Level 5 unlocked!"
  ];

  if (scannerPad && scanFill && terminalLog) {
    scannerPad.addEventListener('click', () => {
      if (isScanning) return;
      isScanning = true;
      scannerPad.classList.add('scanning');
      audio.playClick();

      let step = 0;
      scanFill.style.width = '0%';

      const interval = setInterval(() => {
        step++;
        scanFill.style.width = `${(step / credentialsAudit.length) * 100}%`;
        terminalLog.innerHTML = `<span style="color: var(--clr-primary);">></span> ${credentialsAudit[step - 1]}`;
        
        if (step === credentialsAudit.length) {
          clearInterval(interval);
          isScanning = false;
          scannerPad.classList.remove('scanning');
          audio.playSuccessChord();
          
          // Pulse the main Enter button
          const enterBtn = document.getElementById('btn-enter-portfolio');
          if (enterBtn) {
            enterBtn.style.animation = 'pulse-beacon 1.2s infinite alternate';
          }
        } else {
          audio.playScanStep();
        }
      }, 350);
    });

    scannerPad.addEventListener('mouseenter', () => audio.playHover());
  }

  // 6. Live Shannon Entropy Cipher Tester
  const cipherInput = document.getElementById('cipher-test-input');
  const entropyVal = document.getElementById('entropy-score-val');
  const poolSizeVal = document.getElementById('pool-size-val');
  const crackTimeVal = document.getElementById('crack-time-val');

  if (cipherInput && entropyVal && poolSizeVal && crackTimeVal) {
    function calcShannonEntropy(str) {
      if (!str) return 0;
      const len = str.length;
      const freq = {};
      for (const char of str) freq[char] = (freq[char] || 0) + 1;
      let entropy = 0;
      for (const char in freq) {
        const p = freq[char] / len;
        entropy -= p * Math.log2(p);
      }
      return (entropy * len).toFixed(1);
    }

    cipherInput.addEventListener('input', (e) => {
      const val = e.target.value;
      const entropy = calcShannonEntropy(val);
      entropyVal.textContent = `${entropy} bits`;

      let pool = 0;
      if (/[a-z]/.test(val)) pool += 26;
      if (/[A-Z]/.test(val)) pool += 26;
      if (/[0-9]/.test(val)) pool += 10;
      if (/[^a-zA-Z0-9]/.test(val)) pool += 33;
      poolSizeVal.textContent = pool > 0 ? `${pool} chars` : '0';

      // Estimate time
      if (val.length === 0) {
        crackTimeVal.textContent = 'Instant';
      } else if (entropy < 30) {
        crackTimeVal.textContent = '< 1 Second';
        crackTimeVal.style.color = 'var(--clr-alert)';
      } else if (entropy < 50) {
        crackTimeVal.textContent = '~3.5 Hours';
        crackTimeVal.style.color = 'var(--clr-warning)';
      } else if (entropy < 70) {
        crackTimeVal.textContent = '~180 Years';
        crackTimeVal.style.color = 'var(--clr-primary)';
      } else {
        crackTimeVal.textContent = 'Centuries+';
        crackTimeVal.style.color = 'var(--clr-success)';
      }

      audio.playKeypress(320 + Math.min(val.length * 20, 600));
    });
  }

  // 7. Simulated Threat Neutralizer
  document.querySelectorAll('.threat-neutralize-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.threat-card-item');
      if (card) {
        audio.playNeutralize();
        btn.textContent = "NEUTRALIZED ✓";
        btn.style.color = "var(--clr-success)";
        btn.style.borderColor = "var(--clr-success)";
        card.style.background = "rgba(0, 255, 159, 0.08)";
        card.style.borderColor = "var(--clr-success)";
        setTimeout(() => {
          card.style.opacity = '0.35';
        }, 300);
      }
    });
    btn.addEventListener('mouseenter', () => audio.playHover());
  });

  // 8. Launch Warp Transition to portfolio.html
  const warpOverlay = document.getElementById('warp-overlay');
  const enterBtn = document.getElementById('btn-enter-portfolio');

  function triggerPortfolioEntry() {
    audio.playWarpLaunch();
    if (warpOverlay) warpOverlay.classList.add('active');

    setTimeout(() => {
      window.location.href = 'portfolio.html';
    }, 420);
  }

  if (enterBtn) {
    enterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerPortfolioEntry();
    });
    enterBtn.addEventListener('mouseenter', () => audio.playHover());
  }

  // Also bind hover to all secondary buttons
  document.querySelectorAll('.btn-secondary-action').forEach(b => {
    b.addEventListener('mouseenter', () => audio.playHover());
    b.addEventListener('click', () => audio.playClick());
  });

  // 9. Keyboard shortcut: Press ENTER or SPACE to enter portfolio
  window.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerPortfolioEntry();
    }
  });
});

