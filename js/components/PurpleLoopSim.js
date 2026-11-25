// js/components/PurpleLoopSim.js
// PurpleLoop Hero Project Demo: Client-Side SSH Brute-Force & MTTD Detection Simulation

import { playSound } from '../hooks/useAudio.js';
import { store } from '../lib/store.js';

export class PurpleLoopSim {
  constructor(containerId = 'purpleloop-sim-mount') {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    this.isRunning = false;
    this.isDetected = false;
    this.startTime = 0;
    this.timerInterval = null;
    this.timeouts = [];
    this.finalMTTD = null;

    if (this.container) {
      this.render();
      this.bindEvents();
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="pl-sim-container bracket-card" style="margin-top: 1.25rem; background: rgba(5, 8, 14, 0.95); border: 1.5px solid var(--clr-border); padding: 1.25rem; position: relative;">
        <!-- Top Status & MTTD Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid var(--clr-border); padding-bottom: 0.75rem; margin-bottom: 0.85rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="status-beacon pulsing" id="pl-sim-beacon" style="width: 8px; height: 8px; border-radius: 50%; background: var(--clr-primary); display: inline-block;"></span>
            <span style="font-family: var(--font-header); font-size: 0.85rem; color: var(--clr-primary); letter-spacing: 0.04em;">
              PURPLELOOP LIVE SIMULATION // ADVERSARY STREAM & MTTD
            </span>
          </div>
          <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
            <div style="font-family: var(--font-mono); font-size: 0.78rem; background: rgba(124, 124, 244, 0.08); border: 1px solid var(--clr-border); padding: 0.25rem 0.65rem; border-radius: 3px;">
              <span style="color: var(--clr-text-muted);">MTTD TIMER:</span>
              <strong id="pl-sim-timer" style="color: var(--clr-primary); margin-left: 0.35rem; font-size: 0.95rem;">0.00s</strong>
            </div>
            <span id="pl-sim-badge" class="tech-label" style="font-size: 0.65rem; font-family: var(--font-mono); background: rgba(255,255,255,0.05); color: var(--clr-text-muted);">
              STANDBY
            </span>
          </div>
        </div>

        <!-- Target & Parameter Specs -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.5rem; margin-bottom: 0.85rem; font-family: var(--font-mono); font-size: 0.7rem; color: var(--clr-text-muted);">
          <div style="background: rgba(255,255,255,0.02); padding: 0.4rem 0.6rem; border: 1px solid var(--clr-border);">
            <span style="display: block; color: var(--clr-text-dim); font-size: 0.6rem;">SIMULATED ATTACK</span>
            <span style="color: var(--clr-alert);">SSH Brute-Force (Hydra)</span>
          </div>
          <div style="background: rgba(255,255,255,0.02); padding: 0.4rem 0.6rem; border: 1px solid var(--clr-border);">
            <span style="display: block; color: var(--clr-text-dim); font-size: 0.6rem;">TARGET SUBSYSTEM</span>
            <span style="color: var(--clr-text-bright);">sshd:22 (Auth Daemon)</span>
          </div>
          <div style="background: rgba(255,255,255,0.02); padding: 0.4rem 0.6rem; border: 1px solid var(--clr-border);">
            <span style="display: block; color: var(--clr-text-dim); font-size: 0.6rem;">DETECTION RULE</span>
            <span style="color: var(--clr-accent);">BruteForceDetector (>4/5s)</span>
          </div>
          <div style="background: rgba(255,255,255,0.02); padding: 0.4rem 0.6rem; border: 1px solid var(--clr-border);">
            <span style="display: block; color: var(--clr-text-dim); font-size: 0.6rem;">SOURCE IP</span>
            <span style="color: var(--clr-primary);">192.168.1.105</span>
          </div>
        </div>

        <!-- Detection Banner (Visible when alert fires) -->
        <div id="pl-sim-alert-banner" style="display: none; margin-bottom: 0.85rem; padding: 0.75rem 1rem; background: rgba(255, 42, 109, 0.12); border: 1.5px solid var(--clr-alert); border-radius: 4px; animation: banner-flash 0.5s ease;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span style="font-size: 1.1rem;">🚨</span>
              <div>
                <strong style="color: var(--clr-alert); font-family: var(--font-header); font-size: 0.85rem; display: block;">
                  DETECTION TRIGGERED: BruteForceDetector: threshold exceeded
                </strong>
                <span id="pl-sim-alert-details" style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--clr-text-bright);">
                  5 failed logins from 192.168.1.105 in 3.42s -> IP blacklisted & SIEM alert logged.
                </span>
              </div>
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--clr-success); background: rgba(0,255,102,0.1); border: 1px solid var(--clr-success); padding: 0.3rem 0.7rem; border-radius: 3px;">
              FINAL MTTD: <strong id="pl-sim-alert-mttd">3.42s</strong>
            </div>
          </div>
        </div>

        <!-- Live Log Console -->
        <div id="pl-sim-console" style="background: #020408; border: 1px solid var(--clr-border); border-radius: 3px; padding: 0.85rem; font-family: var(--font-mono); font-size: 0.72rem; height: 180px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 1rem; scroll-behavior: smooth;" role="log" aria-live="polite">
          <span style="color: var(--clr-text-muted);">
            [SIMULATION READY] Click "RUN ATTACK SIMULATION" to stream adversary login traffic and measure real-time MTTD...
          </span>
        </div>

        <!-- Controls Toolbar -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
          <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
            <button id="pl-sim-start-btn" class="cyber-btn cyber-btn-primary" tabindex="0" role="button" aria-label="Run Attack Simulation" style="padding: 0.5rem 1.2rem; font-size: 0.75rem;">
              <span>▶ RUN ATTACK SIMULATION</span>
            </button>
            <button id="pl-sim-stop-btn" class="cyber-btn cyber-btn-outline" tabindex="0" role="button" aria-label="Stop Simulation" disabled style="padding: 0.5rem 1rem; font-size: 0.75rem;">
              <span>⏹ STOP</span>
            </button>
            <button id="pl-sim-reset-btn" class="cyber-btn cyber-btn-outline" tabindex="0" role="button" aria-label="Reset Simulation" style="padding: 0.5rem 1rem; font-size: 0.75rem;">
              <span>↺ RESET</span>
            </button>
          </div>
          <span style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--clr-text-dim);">
            Pure client-side simulation // User-controlled
          </span>
        </div>
      </div>
    `;

    this.consoleEl = this.container.querySelector('#pl-sim-console');
    this.timerEl = this.container.querySelector('#pl-sim-timer');
    this.badgeEl = this.container.querySelector('#pl-sim-badge');
    this.beaconEl = this.container.querySelector('#pl-sim-beacon');
    this.alertBannerEl = this.container.querySelector('#pl-sim-alert-banner');
    this.alertMttdEl = this.container.querySelector('#pl-sim-alert-mttd');
    this.alertDetailsEl = this.container.querySelector('#pl-sim-alert-details');
    this.startBtn = this.container.querySelector('#pl-sim-start-btn');
    this.stopBtn = this.container.querySelector('#pl-sim-stop-btn');
    this.resetBtn = this.container.querySelector('#pl-sim-reset-btn');
  }

  bindEvents() {
    if (!this.startBtn) return;

    const handleStart = () => this.start();
    const handleStop = () => this.stop();
    const handleReset = () => this.reset();

    this.startBtn.addEventListener('click', handleStart);
    this.startBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleStart(); }
    });

    this.stopBtn.addEventListener('click', handleStop);
    this.stopBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleStop(); }
    });

    this.resetBtn.addEventListener('click', handleReset);
    this.resetBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleReset(); }
    });
  }

  log(message, type = 'normal') {
    if (!this.consoleEl) return;
    const line = document.createElement('div');
    line.style.lineHeight = '1.45';

    if (type === 'error') {
      line.style.color = 'var(--clr-alert)';
    } else if (type === 'warn') {
      line.style.color = 'var(--clr-accent)';
    } else if (type === 'success') {
      line.style.color = 'var(--clr-success)';
      line.style.fontWeight = 'bold';
    } else if (type === 'dim') {
      line.style.color = 'var(--clr-text-dim)';
    } else {
      line.style.color = 'var(--clr-text-muted)';
    }

    line.innerHTML = message;
    this.consoleEl.appendChild(line);
    this.consoleEl.scrollTop = this.consoleEl.scrollHeight;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.isDetected = false;
    this.clearPending();

    playSound('click');

    // UI state
    this.startBtn.disabled = true;
    this.stopBtn.disabled = false;
    this.badgeEl.textContent = 'ATTACK ACTIVE';
    this.badgeEl.className = 'tech-label text-alert pulsing';
    this.beaconEl.style.background = 'var(--clr-alert)';
    this.alertBannerEl.style.display = 'none';

    // Clear console for fresh run
    this.consoleEl.innerHTML = '';
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
    this.log(`[${nowStr}] [SIM_INIT] Starting SSH adversary credential-stuffing sequence...`, 'warn');
    this.log(`[${nowStr}] [MONITOR] Detector 'BruteForceDetector' listening on sliding window: threshold = 5 attempts / 5.0s`, 'dim');

    // Start MTTD Stopwatch
    this.startTime = performance.now();
    this.timerInterval = setInterval(() => {
      if (!this.isRunning || this.isDetected) return;
      const elapsedSec = ((performance.now() - this.startTime) / 1000).toFixed(2);
      if (this.timerEl) {
        this.timerEl.textContent = `${elapsedSec}s`;
      }
    }, 40);

    // Stream simulated failed login attempts
    const attempts = [
      { delay: 520, user: 'root', port: 42812, pass: 'admin123' },
      { delay: 1240, user: 'admin', port: 42814, pass: 'password' },
      { delay: 1980, user: 'ubuntu', port: 42816, pass: 'ubuntu' },
      { delay: 2710, user: 'deploy', port: 42818, pass: 'toor' },
      { delay: 3450, user: 'operator', port: 42820, pass: '123456' }
    ];

    attempts.forEach((att, idx) => {
      const t = setTimeout(() => {
        if (!this.isRunning) return;
        playSound('type');
        const timeOffset = ((performance.now() - this.startTime) / 1000).toFixed(2);
        this.log(`[T+${timeOffset}s] [AUTH_FAIL] Failed password for ${att.user} from 192.168.1.105 port ${att.port} ssh2 (Attempt ${idx + 1}/5)`, 'error');

        // On 5th attempt, trigger detection!
        if (idx === attempts.length - 1) {
          const detectionTimer = setTimeout(() => {
            if (!this.isRunning) return;
            this.fireDetection();
          }, 120);
          this.timeouts.push(detectionTimer);
        }
      }, att.delay);
      this.timeouts.push(t);
    });
  }

  fireDetection() {
    this.isDetected = true;
    this.isRunning = false;
    clearInterval(this.timerInterval);

    const mttd = ((performance.now() - this.startTime) / 1000).toFixed(2);
    this.finalMTTD = mttd;

    // Freeze timer display
    if (this.timerEl) {
      this.timerEl.textContent = `${mttd}s`;
      this.timerEl.style.color = 'var(--clr-success)';
    }

    // Audio cues
    playSound('alert');
    setTimeout(() => playSound('success'), 200);

    // Banner and logs
    if (this.alertBannerEl) {
      this.alertBannerEl.style.display = 'block';
      this.alertMttdEl.textContent = `${mttd}s`;
      this.alertDetailsEl.textContent = `5 failed logins from 192.168.1.105 in ${mttd}s -> IP blacklisted & SIEM alert logged.`;
    }

    this.log(`--------------------------------------------------------------------------------`, 'dim');
    this.log(`🚨 [DETECTION ALERT] BruteForceDetector: threshold exceeded`, 'error');
    this.log(`↳ Source IP: 192.168.1.105 | Target: sshd:22 | Events: 5 fails in ${mttd}s`, 'warn');
    this.log(`↳ Mean Time to Detect (MTTD): <span style="color: var(--clr-success); font-size: 0.85rem; font-weight: bold;">${mttd}s</span>`, 'success');
    this.log(`↳ Mitigation Action: iptables DROP 192.168.1.105/32 engaged. Session terminated.`, 'success');
    this.log(`[STATUS] Detection pipeline test passed with zero alert loss.`, 'success');

    // Update controls
    this.startBtn.disabled = false;
    this.stopBtn.disabled = true;
    this.badgeEl.textContent = `DETECTED (${mttd}s)`;
    this.badgeEl.className = 'tech-label text-success';
    this.beaconEl.style.background = 'var(--clr-success)';

    // Telemetry log
    store.addLog(`PURPLELOOP_SIM: BruteForceDetector triggered. MTTD = ${mttd}s`, 'alert');
  }

  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.clearPending();

    playSound('click');

    const elapsed = ((performance.now() - this.startTime) / 1000).toFixed(2);
    this.log(`[STOPPED] Simulation halted by operator at T+${elapsed}s.`, 'dim');

    this.startBtn.disabled = false;
    this.stopBtn.disabled = true;
    this.badgeEl.textContent = 'STOPPED';
    this.badgeEl.className = 'tech-label text-dim';
    this.beaconEl.style.background = 'var(--clr-text-dim)';
  }

  reset() {
    this.isRunning = false;
    this.isDetected = false;
    this.clearPending();
    playSound('click');

    if (this.timerEl) {
      this.timerEl.textContent = '0.00s';
      this.timerEl.style.color = 'var(--clr-primary)';
    }

    if (this.alertBannerEl) {
      this.alertBannerEl.style.display = 'none';
    }

    if (this.consoleEl) {
      this.consoleEl.innerHTML = `
        <span style="color: var(--clr-text-muted);">
          [SIMULATION READY] Click "RUN ATTACK SIMULATION" to stream adversary login traffic and measure real-time MTTD...
        </span>
      `;
    }

    this.startBtn.disabled = false;
    this.stopBtn.disabled = true;
    this.badgeEl.textContent = 'STANDBY';
    this.badgeEl.className = 'tech-label';
    this.beaconEl.style.background = 'var(--clr-primary)';
  }

  clearPending() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.timeouts.forEach(t => clearTimeout(t));
    this.timeouts = [];
  }

  destroy() {
    this.clearPending();
  }
}
