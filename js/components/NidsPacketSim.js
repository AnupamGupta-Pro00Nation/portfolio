// js/components/NidsPacketSim.js
// Advanced-NIDS Project Demo: Mini Packet-Stream Simulator & alerts.log Panel

import { playSound } from '../hooks/useAudio.js';
import { store } from '../lib/store.js';

export class NidsPacketSim {
  constructor(containerId = 'nids-sim-mount') {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    this.isRunning = true;
    this.streamTimer = null;
    this.packetCount = 0;
    this.activeAttack = null;
    this.timeouts = [];

    if (this.container) {
      this.render();
      this.bindEvents();
      this.initObserver();
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="nids-sim-container bracket-card" style="margin-top: 1.25rem; background: rgba(5, 8, 14, 0.95); border: 1.5px solid var(--clr-border); padding: 1.25rem; position: relative;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid var(--clr-border); padding-bottom: 0.75rem; margin-bottom: 0.85rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="status-beacon pulsing" id="nids-stream-beacon" style="width: 8px; height: 8px; border-radius: 50%; background: var(--clr-primary); display: inline-block;"></span>
            <span style="font-family: var(--font-header); font-size: 0.85rem; color: var(--clr-primary); letter-spacing: 0.04em;">
              ADVANCED-NIDS PACKET STREAM & HEURISTIC ENGINE (C/LIBPCAP)
            </span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem; font-family: var(--font-mono); font-size: 0.7rem;">
            <span style="color: var(--clr-text-muted);">PKTS INGESTED: <strong id="nids-pkt-counter" style="color: var(--clr-text-bright);">0</strong></span>
            <span class="tech-label text-success" id="nids-engine-badge" style="font-size: 0.62rem;">PROMISCUOUS HOOK: ACTIVE</span>
          </div>
        </div>

        <!-- Packet Flow Conveyor Pipeline -->
        <div style="margin-bottom: 0.85rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; font-family: var(--font-mono); font-size: 0.68rem; color: var(--clr-text-muted);">
            <span>LIVE PCAP RING BUFFER // RAW ETHERNET & IP FRAMES</span>
            <span style="color: var(--clr-accent);">WINPCAP / NPCAP ZERO-COPY HOOK</span>
          </div>
          <div id="nids-packet-pipeline" style="display: flex; gap: 0.5rem; overflow-x: hidden; background: #020408; border: 1px solid var(--clr-border); padding: 0.65rem; border-radius: 3px; min-height: 64px; align-items: center;" role="region" aria-label="Animated packet stream pipeline">
            <!-- Dynamic packet chips glide here -->
            <span style="color: var(--clr-text-dim); font-family: var(--font-mono); font-size: 0.7rem; margin: auto;">Initializing packet ingestion loop...</span>
          </div>
        </div>

        <!-- Injection Controls Toolbar -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem;">
          <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
            <button id="nids-inject-scan-btn" class="cyber-btn cyber-btn-outline" tabindex="0" role="button" aria-label="Inject Port Scan Attack" style="padding: 0.45rem 1rem; font-size: 0.72rem;">
              <span>⚡ INJECT PORT SCAN</span>
            </button>
            <button id="nids-inject-syn-btn" class="cyber-btn cyber-btn-outline" tabindex="0" role="button" aria-label="Inject SYN Flood Attack" style="padding: 0.45rem 1rem; font-size: 0.72rem;">
              <span>💥 INJECT SYN FLOOD</span>
            </button>
            <button id="nids-clear-log-btn" class="cyber-btn cyber-btn-outline" tabindex="0" role="button" aria-label="Clear Alerts Log" style="padding: 0.45rem 0.85rem; font-size: 0.72rem;">
              <span>CLEAR ALERTS.LOG</span>
            </button>
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--clr-text-dim);">
            Sliding-Window Heuristic: Ports &gt;10/s | SYN &gt;50/s
          </div>
        </div>

        <!-- Alert Log Panel (Styled like alerts.log) -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; font-family: var(--font-mono); font-size: 0.68rem;">
            <span style="color: var(--clr-text-bright); font-weight: 700;">AUDIT TRAIL // alerts.log</span>
            <span style="color: var(--clr-alert);">OUTPUT STREAM: /var/log/nids/alerts.log</span>
          </div>
          <div id="nids-alerts-console" style="background: #010204; border: 1px solid rgba(var(--clr-primary-rgb), 0.25); border-radius: 3px; padding: 0.85rem; font-family: var(--font-mono); font-size: 0.72rem; height: 160px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.4rem; box-shadow: inset 0 0 16px rgba(0,0,0,0.8);" role="log" aria-live="polite">
            <div style="color: var(--clr-text-dim);">[alerts.log] Monitoring live raw packet ring buffer... Injected anomaly events will append below.</div>
          </div>
        </div>
      </div>
    `;

    this.pipelineEl = this.container.querySelector('#nids-packet-pipeline');
    this.alertsConsoleEl = this.container.querySelector('#nids-alerts-console');
    this.pktCounterEl = this.container.querySelector('#nids-pkt-counter');
    this.scanBtn = this.container.querySelector('#nids-inject-scan-btn');
    this.synBtn = this.container.querySelector('#nids-inject-syn-btn');
    this.clearBtn = this.container.querySelector('#nids-clear-log-btn');
    this.beaconEl = this.container.querySelector('#nids-stream-beacon');
  }

  bindEvents() {
    if (!this.scanBtn) return;

    const handleScan = () => this.injectPortScan();
    const handleSyn = () => this.injectSynFlood();
    const handleClear = () => this.clearAlerts();

    this.scanBtn.addEventListener('click', handleScan);
    this.scanBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleScan(); }
    });

    this.synBtn.addEventListener('click', handleSyn);
    this.synBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSyn(); }
    });

    this.clearBtn.addEventListener('click', handleClear);
    this.clearBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClear(); }
    });
  }

  initObserver() {
    // Lazy-load packet stream animation only when in view
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.startStream();
          } else {
            this.pauseStream();
          }
        });
      }, { threshold: 0.1 });

      this.observer.observe(this.container);
    } else {
      this.startStream();
    }
  }

  startStream() {
    if (this.streamTimer) return;
    this.streamTimer = setInterval(() => {
      if (!this.activeAttack) {
        this.emitNormalPacket();
      }
    }, 1600);
    // Initial packet
    this.emitNormalPacket();
  }

  pauseStream() {
    if (this.streamTimer) {
      clearInterval(this.streamTimer);
      this.streamTimer = null;
    }
  }

  emitNormalPacket() {
    if (!this.pipelineEl) return;
    const baselines = [
      { proto: 'TLS', flag: '[ACK]', src: '192.168.1.45:51204', dst: '142.250.190.46:443', len: 1420 },
      { proto: 'DNS', flag: '[UDP]', src: '192.168.1.45:58912', dst: '1.1.1.1:53', len: 74 },
      { proto: 'HTTPS', flag: '[TLSv1.3]', src: '192.168.1.45:52110', dst: '151.101.65.140:443', len: 864 },
      { proto: 'TCP', flag: '[SYN,ACK]', src: '140.82.121.4:443', dst: '192.168.1.45:49152', len: 66 },
      { proto: 'ICMP', flag: '[ECHO_REQ]', src: '192.168.1.45', dst: '8.8.8.8', len: 64 }
    ];

    const pkt = baselines[Math.floor(Math.random() * baselines.length)];
    this.pushPacketToPipeline(pkt, 'normal');
  }

  pushPacketToPipeline(pkt, category = 'normal') {
    if (!this.pipelineEl) return;
    this.packetCount++;
    if (this.pktCounterEl) this.pktCounterEl.textContent = this.packetCount;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const chip = document.createElement('div');
    chip.className = 'nids-pkt-chip';
    chip.style.flex = '0 0 auto';
    chip.style.fontFamily = 'var(--font-mono)';
    chip.style.fontSize = '0.62rem';
    chip.style.padding = '0.3rem 0.55rem';
    chip.style.borderRadius = '3px';
    chip.style.border = '1px solid';
    chip.style.display = 'flex';
    chip.style.flexDirection = 'column';
    chip.style.gap = '0.15rem';

    if (category === 'scan') {
      chip.style.background = 'rgba(255, 176, 0, 0.15)';
      chip.style.borderColor = 'var(--clr-accent)';
      chip.style.color = 'var(--clr-accent)';
    } else if (category === 'flood') {
      chip.style.background = 'rgba(255, 42, 109, 0.2)';
      chip.style.borderColor = 'var(--clr-alert)';
      chip.style.color = 'var(--clr-alert)';
    } else {
      chip.style.background = 'rgba(0, 243, 255, 0.05)';
      chip.style.borderColor = 'rgba(0, 243, 255, 0.25)';
      chip.style.color = 'var(--clr-text-bright)';
    }

    if (!prefersReducedMotion) {
      chip.style.animation = 'pkt-slide-in 0.3s ease';
    }

    chip.innerHTML = `
      <div style="display: flex; justify-content: space-between; gap: 0.4rem;">
        <strong>${pkt.proto} ${pkt.flag}</strong>
        <span style="opacity: 0.6;">${pkt.len}B</span>
      </div>
      <div style="font-size: 0.58rem; color: var(--clr-text-muted);">
        ${pkt.src} → ${pkt.dst}
      </div>
    `;

    // Keep max 7 chips in pipeline
    while (this.pipelineEl.children.length >= 7) {
      this.pipelineEl.removeChild(this.pipelineEl.firstElementChild);
    }

    this.pipelineEl.appendChild(chip);
  }

  injectPortScan() {
    if (this.activeAttack) return;
    this.activeAttack = 'port_scan';
    this.scanBtn.disabled = true;
    this.beaconEl.style.background = 'var(--clr-accent)';
    playSound('scan');

    const scanPorts = [21, 22, 23, 25, 80, 110, 143, 443, 3306, 8080, 8443, 9000];
    const srcIp = '185.220.101.5';
    let count = 0;

    const interval = setInterval(() => {
      if (count >= scanPorts.length) {
        clearInterval(interval);
        this.activeAttack = null;
        this.scanBtn.disabled = false;
        this.beaconEl.style.background = 'var(--clr-primary)';
        return;
      }

      const port = scanPorts[count];
      this.pushPacketToPipeline({
        proto: 'TCP',
        flag: '[SYN]',
        src: `${srcIp}:${48000 + count}`,
        dst: `192.168.1.1:${port}`,
        len: 60
      }, 'scan');

      count++;

      // When threshold (10 unique ports) is exceeded, raise alert!
      if (count === 11) {
        this.logAlert({
          type: 'PortScanDetected',
          src: srcIp,
          dst: '192.168.1.1:1-1024',
          metric: '12 unique ports in 0.8s (Threshold: 10)',
          rule: 'Rule 101 [STEALTH_PORT_SCAN]',
          explanation: 'Unique destination ports from single host exceeded sliding-window threshold (12 > 10). Frame dropped & IP flagged.'
        });
      }
    }, 85);
  }

  injectSynFlood() {
    if (this.activeAttack) return;
    this.activeAttack = 'syn_flood';
    this.synBtn.disabled = true;
    this.beaconEl.style.background = 'var(--clr-alert)';
    playSound('alert');

    const srcIp = '203.0.113.42';
    let count = 0;
    const total = 14;

    const interval = setInterval(() => {
      if (count >= total) {
        clearInterval(interval);
        this.activeAttack = null;
        this.synBtn.disabled = false;
        this.beaconEl.style.background = 'var(--clr-primary)';
        return;
      }

      this.pushPacketToPipeline({
        proto: 'TCP',
        flag: '[SYN]',
        src: `${srcIp}:${Math.floor(10000 + Math.random() * 50000)}`,
        dst: '192.168.1.1:80',
        len: 54
      }, 'flood');

      count++;

      // Trigger flood alert
      if (count === 8) {
        this.logAlert({
          type: 'SYNFloodDetected',
          src: srcIp,
          dst: '192.168.1.1:80',
          metric: 'Rate: 840 pkts/s (Threshold: 50 pkts/s)',
          rule: 'Rule 204 [TCP_SYN_FLOOD]',
          explanation: 'Inbound TCP SYN rate without ACK exceeded threshold baseline (>50 pkts/s). Engaged SYN cookie validation & throttled source.'
        });
      }
    }, 65);
  }

  logAlert(alert) {
    if (!this.alertsConsoleEl) return;
    playSound('alert');

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const entry = document.createElement('div');
    entry.style.lineHeight = '1.45';
    entry.style.borderLeft = '2px solid var(--clr-alert)';
    entry.style.paddingLeft = '0.5rem';
    entry.style.marginBottom = '0.35rem';

    entry.innerHTML = `
      <div style="color: var(--clr-alert); font-weight: bold;">
        [${now}] [ALERT] ${alert.type} | Src: ${alert.src} | Dst: ${alert.dst} | ${alert.metric}
      </div>
      <div style="color: var(--clr-accent); font-size: 0.68rem;">
        ↳ <strong>Rule Fired:</strong> ${alert.rule} — ${alert.explanation}
      </div>
    `;

    this.alertsConsoleEl.appendChild(entry);
    this.alertsConsoleEl.scrollTop = this.alertsConsoleEl.scrollHeight;

    store.addLog(`NIDS_ALERT: ${alert.type} triggered by rule ${alert.rule}`, 'alert');
  }

  clearAlerts() {
    playSound('click');
    if (this.alertsConsoleEl) {
      this.alertsConsoleEl.innerHTML = `
        <div style="color: var(--clr-text-dim);">[alerts.log] Log buffer cleared by operator. Continuous capture active.</div>
      `;
    }
  }

  destroy() {
    this.pauseStream();
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
