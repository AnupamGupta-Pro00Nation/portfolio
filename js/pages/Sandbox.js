import { DecryptText } from '../components/DecryptText.js';
import { CyberButton } from '../components/CyberButton.js';
import { HexViewer } from '../components/HexViewer.js';
import { useIntersection } from '../hooks/useIntersection.js';
import { playSound } from '../hooks/useAudio.js';
import { store } from '../lib/store.js';
import { calculateEntropy, rot13, formatTimeSpan } from '../utils/crypto.js';
import { toast } from '../components/Toast.js';

export class SandboxPage {
  constructor(mountId) {
    this.container = document.getElementById(mountId);
    if (!this.container) return;
    
    // Tools State
    this.scanRunning = false;
    this.nidsRunning = false;
    this.cryptoMode = 'encode';
    this.cryptoCipher = 'base64';

    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div style="margin-bottom: 2rem; border-bottom: 1px solid var(--clr-border); padding-bottom: 1rem;">
        <h1 style="font-size: 1.8rem; margin-bottom: 0.25rem;" class="crt-flicker">
          <DecryptText target="SECURITY LAB SANDBOX & TOOLS"></DecryptText>
        </h1>
        <p style="font-size: 0.8rem; color: var(--clr-text-muted);">
          Interactive laboratories showcasing Anupam's pure C Advanced-NIDS, virtualized pentest home lab, password Shannon entropy evaluation, and cryptographic ciphers.
        </p>
      </div>

      <!-- Sandbox Grid Layout -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">

        <!-- Widget 1: ADVANCED-NIDS (Pure C / Npcap / WinPcap Windows Engine) -->
        <section class="cyber-panel" style="grid-column: span 2; border: 1px solid rgba(var(--clr-primary-rgb), 0.35);">
          <div class="cyber-decal-top-left"></div>
          <div class="cyber-panel-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <h3 style="color: var(--clr-primary);">ADVANCED-NIDS: PURE C PACKET INSPECTION & DETECTION ENGINE</h3>
              <span style="font-size: 0.65rem; color: var(--clr-text-muted); font-family: var(--font-mono);">
                Npcap / WinPcap SDK • Windows Multithreading (Mutex/Events) • Producer-Consumer Queue
              </span>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <span class="tech-label text-success" id="nids-engine-status">ENGINE: STANDBY</span>
              <a href="https://github.com/AnupamGupta-Pro00Nation/Advanced-NIDS" target="_blank" rel="noopener noreferrer" class="tech-label text-accent" style="text-decoration: none;">
                GITHUB REPO ↗
              </a>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 360px 1fr; gap: 1.5rem; min-height: 290px;">
            <div style="display: flex; flex-direction: column; justify-content: space-between; gap: 1rem;">
              <div style="font-size: 0.78rem; color: var(--clr-text-muted); display: flex; flex-direction: column; gap: 0.75rem;">
                <p>
                  Direct interactive simulation of Anupam's <strong>nids.exe</strong> compiled with MinGW/MSVC. Evaluates Ethernet, IPv4, TCP (SYN/ACK/RST/FIN/PSH/URG), UDP, and ICMP headers using pointer arithmetic.
                </p>
                
                <!-- Interface Selector -->
                <div style="display: flex; flex-direction: column; gap: 0.3rem;">
                  <label style="font-size: 0.6rem; color: var(--clr-text-muted);">MONITORED INTERFACE (--interface)</label>
                  <select id="nids-interface-select" style="background: var(--clr-bg-primary); border: 1px solid var(--clr-border); color: var(--clr-text-bright); font-family: var(--font-mono); padding: 0.4rem; font-size: 0.7rem; border-radius: 2px; outline: none;">
                    <option value="eth0">[0] \\Device\\NPF_{Intel 82579LM Gigabit Ethernet}</option>
                    <option value="wlan0">[1] \\Device\\NPF_{Qualcomm QCA6174 802.11ac Wi-Fi}</option>
                    <option value="vbox0">[2] \\Device\\NPF_{VirtualBox Host-Only Ethernet Adapter}</option>
                  </select>
                </div>

                <!-- Attack Vector Selector -->
                <div style="display: flex; flex-direction: column; gap: 0.3rem;">
                  <label style="font-size: 0.6rem; color: var(--clr-text-muted);">SIMULATED ATTACK VECTOR</label>
                  <select id="nids-traffic-select" style="background: var(--clr-bg-primary); border: 1px solid var(--clr-border); color: var(--clr-primary); font-family: var(--font-mono); padding: 0.4rem; font-size: 0.7rem; border-radius: 2px; outline: none;">
                    <option value="syn_flood">SYN Flood Attack (Exceeds --syn-threshold)</option>
                    <option value="port_scan">Stealth TCP SYN Port Sweep (Exceeds --port-threshold)</option>
                    <option value="icmp_flood">ICMP Ping Flood (Exceeds --icmp-threshold)</option>
                    <option value="legit_traffic">Legitimate HTTPS / TLS Handshake (Normal)</option>
                  </select>
                </div>

                <!-- Threshold Configs Display -->
                <div style="display: flex; justify-content: space-between; font-size: 0.65rem; color: var(--clr-text-dim); background: var(--clr-bg-primary); padding: 0.4rem; border: 1px solid var(--clr-border); border-radius: 2px;">
                  <span>PORT: 10/host</span>
                  <span>SYN: 50/host</span>
                  <span>ICMP: 100/host</span>
                </div>
              </div>

              <div>
                <button id="nids-inject-btn" class="cyber-btn" data-sound="click" style="width: 100%;">
                  <span class="cyber-btn-cut-top-left"></span>
                  <span class="cyber-btn-content" style="width: 100%; text-align: center;">RUN PACKET SIMULATION</span>
                  <span class="cyber-btn-cut-bottom-right"></span>
                </button>
              </div>
            </div>

            <!-- NIDS Dual Console: Terminal + alerts.log -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.65rem; font-family: var(--font-mono); color: var(--clr-text-muted);">
                <span>STDOUT & REALTIME PACKET LOG</span>
                <span style="color: var(--clr-accent);">OUTPUT: alerts.log</span>
              </div>
              <div style="background: #020408; border: 1px solid var(--clr-border); border-radius: var(--border-radius); padding: 0.85rem; font-family: var(--font-mono); font-size: 0.72rem; overflow-y: auto; display: flex; flex-direction: column; gap: 0.35rem; height: 260px;" id="nids-console">
                <span class="text-muted">[nids.exe] Waiting for packet stream... Click "RUN NIDS.EXE" to execute capture thread.</span>
              </div>
            </div>
          </div>
          <div class="cyber-decal-bottom-right"></div>
        </section>

        <!-- Widget 2: Network & Pentest Lab Port Scanner -->
        <section class="cyber-panel scanner-sweep" style="grid-column: span 2;">
          <div class="cyber-decal-top-left"></div>
          <div class="cyber-panel-header">
            <h3>PENTEST HOME LAB & PORT ENUMERATION SCANNER</h3>
            <span class="tech-label text-accent" id="scanner-status">READY FOR SCAN</span>
          </div>
          
          <div style="display: grid; grid-template-columns: 320px 1fr; gap: 1.5rem; min-height: 240px;">
            <div style="display: flex; flex-direction: column; justify-content: space-between;">
              <div style="font-size: 0.8rem; color: var(--clr-text-muted); display: flex; flex-direction: column; gap: 0.75rem;">
                <p>Simulate active Nmap reconnaissance against Anupam's virtualized Cybersecurity Home Lab (Oracle VirtualBox, Kali Linux, Metasploitable, Splunk SIEM).</p>
                <div style="display: flex; flex-direction: column; gap: 0.3rem;">
                  <label style="font-size: 0.6rem; color: var(--clr-text-muted);">TARGET SUBNET</label>
                  <input type="text" id="scanner-ip-range" value="192.168.56.0/24 (Host-Only Virtual Network)" disabled style="background: var(--clr-bg-primary); border: 1px solid var(--clr-border); color: var(--clr-primary); font-family: var(--font-mono); padding: 0.4rem; font-size: 0.75rem; border-radius: 2px;" />
                </div>
              </div>
              <div style="margin-top: 1rem;">
                <button id="start-scan-btn" class="cyber-btn" data-sound="click">
                  <span class="cyber-btn-cut-top-left"></span>
                  <span class="cyber-btn-content" style="width: 100%; text-align: center;">START NETWORK RECON SCAN</span>
                  <span class="cyber-btn-cut-bottom-right"></span>
                </button>
              </div>
            </div>

            <!-- Console Log Output -->
            <div style="background: #020408; border: 1px solid var(--clr-border); border-radius: var(--border-radius); padding: 1rem; font-family: var(--font-mono); font-size: 0.75rem; overflow-y: auto; display: flex; flex-direction: column; gap: 0.4rem; max-height: 240px;" id="scanner-console">
              <span class="text-muted">[READY] Click "START NETWORK RECON SCAN" to simulate mapping active lab hosts and daemons...</span>
            </div>
          </div>
          <div class="cyber-decal-bottom-right"></div>
        </section>

        <!-- Widget 3: Password Complexity & Shannon Entropy Analyzer -->
        <section class="cyber-panel">
          <div class="cyber-decal-top-left"></div>
          <div class="cyber-panel-header">
            <h3>SHANNON ENTROPY & PASSWORD AUDITOR</h3>
          </div>
          <div style="display: flex; flex-direction: column; gap: 1rem; min-height: 280px;">
            <p style="font-size: 0.8rem; color: var(--clr-text-muted);">
              Based on Anupam's Password Strength Checker project. Calculates information entropy bits and models cracking feasibility across GPU/ASIC arrays.
            </p>
            <div style="display: flex; flex-direction: column; gap: 0.4rem;">
              <label style="font-size: 0.65rem; color: var(--clr-text-muted);">TEST PASSPHRASE</label>
              <input type="text" id="entropy-input" placeholder="Type a test password here..." autocomplete="off" style="background: var(--clr-bg-primary); border: 1px solid var(--clr-border); color: var(--clr-text-bright); font-family: var(--font-mono); font-size: 0.8rem; padding: 0.6rem; border-radius: var(--border-radius); outline: none;" />
            </div>

            <!-- Strength indicators -->
            <div id="entropy-results" style="display: none; flex-direction: column; gap: 0.6rem; font-size: 0.75rem; padding: 0.75rem; border: 1px solid var(--clr-border); background-color: var(--clr-bg-primary); border-radius: var(--border-radius);">
              <div style="display: flex; justify-content: space-between;">
                <span>SHANNON ENTROPY:</span>
                <span class="text-accent" id="entropy-bits">0.0 bits</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>STRENGTH STATUS:</span>
                <span id="entropy-strength" class="text-success">WEAK</span>
              </div>
              <div style="border-top: 1px solid var(--clr-border); margin: 0.25rem 0;"></div>
              <div style="display: flex; justify-content: space-between;">
                <span>GPU CLUSTER ESTIMATED TIME:</span>
                <span class="text-warning" id="entropy-gpu-time">0.0s</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>ASIC ARRAY ESTIMATED TIME:</span>
                <span class="text-alert" id="entropy-asic-time">0.0s</span>
              </div>
            </div>
          </div>
          <div class="cyber-decal-bottom-right"></div>
        </section>

        <!-- Widget 4: Cryptography & Hex Decoder -->
        <section class="cyber-panel">
          <div class="cyber-decal-top-left"></div>
          <div class="cyber-panel-header">
            <h3>CRYPTOGRAPHIC CIPHER & ENCODER</h3>
          </div>
          <div style="display: flex; flex-direction: column; gap: 1rem; min-height: 280px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
              <!-- Encode / Decode Toggle -->
              <div style="display: flex; border: 1px solid var(--clr-border); border-radius: var(--border-radius); overflow: hidden;">
                <button class="crypto-action-btn active" data-val="encode" style="background: rgba(var(--clr-primary-rgb), 0.1); border: none; color: var(--clr-primary); font-family: var(--font-header); font-size: 0.65rem; padding: 0.4rem 0.8rem; cursor: pointer;">ENCODE</button>
                <button class="crypto-action-btn" data-val="decode" style="background: transparent; border: none; color: var(--clr-text-muted); font-family: var(--font-header); font-size: 0.65rem; padding: 0.4rem 0.8rem; cursor: pointer; border-left: 1px solid var(--clr-border);">DECODE</button>
              </div>
              <!-- Cipher Select -->
              <select id="cipher-select" style="background: var(--clr-bg-primary); border: 1px solid var(--clr-border); color: var(--clr-primary); font-family: var(--font-header); font-size: 0.65rem; padding: 0.3rem 0.5rem; outline: none; border-radius: var(--border-radius);">
                <option value="base64">BASE64</option>
                <option value="rot13">ROT13</option>
                <option value="hex">HEX BYTES</option>
              </select>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.4rem; flex: 1;">
              <label style="font-size: 0.65rem; color: var(--clr-text-muted);">INPUT STRING / PAYLOAD</label>
              <textarea id="crypto-input" placeholder="Enter plaintext or encoded strings here..." style="flex: 1; background: var(--clr-bg-primary); border: 1px solid var(--clr-border); color: var(--clr-text-bright); font-family: var(--font-mono); font-size: 0.75rem; padding: 0.5rem; outline: none; border-radius: var(--border-radius); resize: none; min-height: 60px;"></textarea>
            </div>

            <!-- Hex Viewer output display -->
            <div style="display: flex; flex-direction: column; gap: 0.4rem;">
              <label style="font-size: 0.65rem; color: var(--clr-text-muted);">TRANSFORMED OUTPUT</label>
              <div id="crypto-output" style="max-height: 120px; overflow-y: auto;">
                <pre class="hex-viewer-console">[OUTPUT TERMINAL WAITING]</pre>
              </div>
            </div>
          </div>
          <div class="cyber-decal-bottom-right"></div>
        </section>

      </div>
    `;

    DecryptText.bindAll();
    CyberButton.bindAll();
    useIntersection.observeAll('.decrypt-trigger-text');
  }

  bindEvents() {
    // --- 1. ADVANCED-NIDS Live Simulator (Pure C Engine) ---
    const nidsBtn = this.container.querySelector('#nids-inject-btn');
    const nidsConsole = this.container.querySelector('#nids-console');
    const trafficSelect = this.container.querySelector('#nids-traffic-select');
    const ifaceSelect = this.container.querySelector('#nids-interface-select');
    const nidsStatus = this.container.querySelector('#nids-engine-status');

    if (nidsBtn && nidsConsole && trafficSelect) {
      nidsBtn.addEventListener('click', () => {
        if (this.nidsRunning) return;
        this.nidsRunning = true;
        nidsBtn.disabled = true;
        nidsBtn.style.opacity = '0.5';
        nidsConsole.innerHTML = '';
        if (nidsStatus) {
          nidsStatus.textContent = "CAPTURE_THREAD: RUNNING";
          nidsStatus.className = "tech-label text-warning";
        }

        const mode = trafficSelect.value;
        const selectedIface = ifaceSelect ? ifaceSelect.value : 'eth0';
        playSound('scan');

        const logNids = (text, type = '') => {
          const el = document.createElement('span');
          el.className = type;
          el.innerHTML = text;
          nidsConsole.appendChild(el);
          nidsConsole.scrollTop = nidsConsole.scrollHeight;
        };

        logNids(`[nids.exe] Initializing WinPcap/Npcap driver on ${selectedIface}...`, 'text-accent');
        logNids(`[capture.c] Created worker threads: [Thread_Capture: TID 0x1A4F] [Thread_Process: TID 0x1B82]`, 'text-bright');
        logNids(`[detection.c] Sliding window armed: PortThreshold=10, SYNThreshold=50, ICMPThreshold=100`, 'text-muted');

        let sequence = [];
        if (mode === 'syn_flood') {
          sequence = [
            { text: "[parser.c] IPv4 Packet: 192.168.1.100:49201 -> 10.0.4.1:80 | TCP Flags: [SYN] | Seq=0x28A1", col: "text-muted" },
            { text: "[parser.c] IPv4 Packet: 192.168.1.101:49202 -> 10.0.4.1:80 | TCP Flags: [SYN] | Seq=0x34C2", col: "text-muted" },
            { text: "[parser.c] IPv4 Packet: 192.168.1.102:49203 -> 10.0.4.1:80 | TCP Flags: [SYN] | Seq=0x41E0", col: "text-muted" },
            { text: "[detection.c] Tracking unacknowledged half-open TCP connections in sliding window...", col: "text-warning" },
            { text: "[logger.c -> alerts.log] <strong>[CRITICAL ALERT] [2026-10-28 00:12:04] ATTACK_DETECTED: SYN Flood Attack from 192.168.1.100-105! Rate: 82 SYN/sec > Threshold(50)</strong>", col: "text-alert" }
          ];
        } else if (mode === 'port_scan') {
          sequence = [
            { text: "[parser.c] IPv4 Packet: 45.33.32.156:52101 -> 10.0.4.1:21  | TCP Flags: [SYN] (FTP)", col: "text-muted" },
            { text: "[parser.c] IPv4 Packet: 45.33.32.156:52102 -> 10.0.4.1:22  | TCP Flags: [SYN] (SSH)", col: "text-muted" },
            { text: "[parser.c] IPv4 Packet: 45.33.32.156:52103 -> 10.0.4.1:23  | TCP Flags: [SYN] (Telnet)", col: "text-muted" },
            { text: "[parser.c] IPv4 Packet: 45.33.32.156:52104 -> 10.0.4.1:25  | TCP Flags: [SYN] (SMTP)", col: "text-muted" },
            { text: "[parser.c] IPv4 Packet: 45.33.32.156:52105 -> 10.0.4.1:80  | TCP Flags: [SYN] (HTTP)", col: "text-muted" },
            { text: "[detection.c] Unique destination ports hit by 45.33.32.156 = 12 (Threshold: 10)", col: "text-warning" },
            { text: "[logger.c -> alerts.log] <strong>[SECURITY ALERT] [2026-10-28 00:12:05] ATTACK_DETECTED: Stealth TCP SYN Port Scan from 45.33.32.156 across ports 21-80</strong>", col: "text-alert" }
          ];
        } else if (mode === 'icmp_flood') {
          sequence = [
            { text: "[parser.c] ICMP Packet: 203.0.113.88 -> 10.0.4.1 | Type: 8 (Echo Request) | Code: 0 | Len: 1024 bytes", col: "text-muted" },
            { text: "[parser.c] ICMP Packet: 203.0.113.88 -> 10.0.4.1 | Type: 8 (Echo Request) | Code: 0 | Len: 1024 bytes", col: "text-muted" },
            { text: "[detection.c] ICMP packet count from 203.0.113.88 reached 140 pkts/sec (Threshold: 100)", col: "text-warning" },
            { text: "[logger.c -> alerts.log] <strong>[CRITICAL ALERT] [2026-10-28 00:12:06] ATTACK_DETECTED: ICMP Ping Flood DoS from 203.0.113.88! Malicious echo requests dropped</strong>", col: "text-alert" }
          ];
        } else {
          sequence = [
            { text: "[parser.c] IPv4 Packet: 192.168.1.45:51201 -> 10.0.4.1:443 | TCP Flags: [SYN] | Seq=0x1102", col: "text-muted" },
            { text: "[parser.c] IPv4 Packet: 10.0.4.1:443 -> 192.168.1.45:51201 | TCP Flags: [SYN, ACK] | Ack=0x1103", col: "text-muted" },
            { text: "[parser.c] IPv4 Packet: 192.168.1.45:51201 -> 10.0.4.1:443 | TCP Flags: [ACK] | Handshake established", col: "text-muted" },
            { text: "[parser.c] TLS 1.3 Client Hello validated. Cipher suite: TLS_AES_256_GCM_SHA384", col: "text-success" },
            { text: "[detection.c] <strong>[NORMAL TRAFFIC] Session clean. Zero anomaly thresholds triggered.</strong>", col: "text-success" }
          ];
        }

        let step = 0;
        const interval = setInterval(() => {
          if (step >= sequence.length) {
            clearInterval(interval);
            nidsBtn.disabled = false;
            nidsBtn.style.opacity = '1';
            this.nidsRunning = false;
            if (nidsStatus) {
              nidsStatus.textContent = "ENGINE: ACTIVE";
              nidsStatus.className = "tech-label text-success";
            }
            logNids(`[main.c] Processing queue flushed. Written to alerts.log.`, 'text-accent');
            playSound('success');
            return;
          }

          const item = sequence[step];
          logNids(item.text, item.col);
          if (item.col === 'text-alert') {
            playSound('alert');
          } else {
            playSound('type');
          }
          step++;
        }, 600);
      });
    }

    // --- 2. Pentest Lab Port Scanner ---
    const scanBtn = this.container.querySelector('#start-scan-btn');
    const scannerConsole = this.container.querySelector('#scanner-console');
    const headerStatus = this.container.querySelector('#scanner-status');

    if (scanBtn) {
      scanBtn.addEventListener('click', () => {
        if (this.scanRunning) return;
        this.scanRunning = true;
        scanBtn.disabled = true;
        scanBtn.style.opacity = '0.5';
        scannerConsole.innerHTML = '';
        if (headerStatus) {
          headerStatus.textContent = "RADAR_SCANNING";
          headerStatus.className = "tech-label text-warning";
        }

        const hosts = [
          { 
            ip: "192.168.56.101", 
            label: "Metasploitable 2 Target (VirtualBox VM)", 
            ports: [
              { port: 21, svc: "vsftpd 2.3.4 (Backdoor Vulnerable - CVE-2011-2523)", alert: true },
              { port: 22, svc: "OpenSSH 4.7p1", alert: false },
              { port: 80, svc: "Apache httpd 2.2.8 (OWASP Mutillidae)", alert: false },
              { port: 445, svc: "Samba 3.0.20-Debian (usermap script exploit)", alert: true },
              { port: 3306, svc: "MySQL 5.0.51a", alert: false }
            ] 
          },
          { 
            ip: "192.168.56.102", 
            label: "Splunk SIEM Enterprise Node", 
            ports: [
              { port: 8000, svc: "Splunk Web GUI", alert: false },
              { port: 9997, svc: "Splunk Forwarder Receiver", alert: false }
            ] 
          },
          { 
            ip: "192.168.56.1", 
            label: "Advanced-NIDS Sensor Node (Npcap)", 
            ports: [
              { port: 22, svc: "SSH Remote Management", alert: false },
              { port: 8080, svc: "NIDS Web Telemetry Forwarder", alert: false }
            ] 
          }
        ];

        let hostIndex = 0;
        let portIndex = 0;
        
        const logLine = (text, type = '') => {
          const l = document.createElement('span');
          l.className = type;
          l.innerHTML = text;
          scannerConsole.appendChild(l);
          scannerConsole.scrollTop = scannerConsole.scrollHeight;
        };

        logLine(`[+] INITIATING PENTEST HOME LAB RECONNAISSANCE (Nmap Engine)...`, 'text-accent');
        playSound('scan');

        this.scanLoop = setInterval(() => {
          if (hostIndex >= hosts.length) {
            clearInterval(this.scanLoop);
            this.scanLoop = null;
            logLine(`[+] RECONNAISSANCE COMPLETE. All target VMs active. Telemetry sent to Splunk.`, 'text-success');
            playSound('success');
            
            if (headerStatus) {
              headerStatus.textContent = "RADAR_MAPPED";
              headerStatus.className = "tech-label text-success";
            }
            scanBtn.disabled = false;
            scanBtn.style.opacity = '1';
            this.scanRunning = false;
            return;
          }

          const host = hosts[hostIndex];
          const pObj = host.ports[portIndex];

          if (portIndex === 0) {
            logLine(`[~] Pinging ${host.ip} [${host.label}]...`, 'text-bright');
            playSound('hover');
          }

          setTimeout(() => {
            if (pObj.alert) {
              logLine(`  -> Port ${pObj.port}/tcp: <span class="text-alert">OPEN</span> [${pObj.svc}]`, 'text-alert');
              playSound('alert');
            } else {
              logLine(`  -> Port ${pObj.port}/tcp: <span class="text-success">OPEN</span> [${pObj.svc}]`, 'text-muted');
              playSound('type');
            }
          }, 100);

          portIndex++;
          if (portIndex >= host.ports.length) {
            portIndex = 0;
            hostIndex++;
          }
        }, 550);
      });
    }

    // --- 3. Entropy Estimator ---
    const entropyInput = this.container.querySelector('#entropy-input');
    const resultsPanel = this.container.querySelector('#entropy-results');
    const bitsSpan = this.container.querySelector('#entropy-bits');
    const strengthSpan = this.container.querySelector('#entropy-strength');
    const gpuTimeSpan = this.container.querySelector('#entropy-gpu-time');
    const asicTimeSpan = this.container.querySelector('#entropy-asic-time');

    if (entropyInput) {
      entropyInput.addEventListener('input', () => {
        const val = entropyInput.value;
        if (!val) {
          resultsPanel.style.display = 'none';
          return;
        }

        resultsPanel.style.display = 'flex';
        playSound('type');

        const entropy = this.calculateEntropy(val);
        bitsSpan.textContent = `${entropy.toFixed(2)} bits`;

        let strength = 'VERY WEAK';
        let strengthClass = 'text-alert';
        if (entropy > 65 && val.length >= 12) {
          strength = 'VERY STRONG / CRYPTOGRAPHICALLY SOUND';
          strengthClass = 'text-success';
        } else if (entropy > 45 && val.length >= 8) {
          strength = 'STRONG';
          strengthClass = 'text-success';
        } else if (entropy > 30) {
          strength = 'MODERATE';
          strengthClass = 'text-warning';
        }
        
        strengthSpan.textContent = strength;
        strengthSpan.className = strengthClass;

        const combinations = Math.pow(2, entropy);
        const gpuSpeed = 10000000000;
        const gpuSeconds = combinations / gpuSpeed;
        gpuTimeSpan.textContent = this.formatTimeSpan(gpuSeconds);

        const asicSpeed = 100000000000000;
        const asicSeconds = combinations / asicSpeed;
        asicTimeSpan.textContent = this.formatTimeSpan(asicSeconds);
      });
    }

    // --- 4. Cipher Module ---
    const cryptoInput = this.container.querySelector('#crypto-input');
    const cryptoOutput = this.container.querySelector('#crypto-output');
    const cipherSelect = this.container.querySelector('#cipher-select');
    const actionBtns = this.container.querySelectorAll('.crypto-action-btn');

    const updateCrypto = () => {
      const text = cryptoInput.value;
      if (!text) {
        cryptoOutput.innerHTML = `<pre class="hex-viewer-console">[OUTPUT TERMINAL WAITING]</pre>`;
        return;
      }

      let resultText = '';
      if (this.cryptoMode === 'encode') {
        if (this.cryptoCipher === 'base64') {
          resultText = btoa(text);
        } else if (this.cryptoCipher === 'rot13') {
          resultText = this.rot13(text);
        } else if (this.cryptoCipher === 'hex') {
          resultText = Array.from(new TextEncoder().encode(text)).map(b => b.toString(16).padStart(2, '0')).join(' ');
        }
      } else {
        try {
          if (this.cryptoCipher === 'base64') {
            resultText = atob(text);
          } else if (this.cryptoCipher === 'rot13') {
            resultText = this.rot13(text);
          } else if (this.cryptoCipher === 'hex') {
            const hexParts = text.trim().split(/\s+/);
            resultText = new TextDecoder().decode(new Uint8Array(hexParts.map(h => parseInt(h, 16))));
          }
        } catch (e) {
          resultText = `[!] DECRYPTION_ERROR: Invalid input for selected cipher (${e.message})`;
        }
      }

      cryptoOutput.innerHTML = HexViewer.render(resultText);
    };

    if (cryptoInput && cipherSelect) {
      cryptoInput.addEventListener('input', () => {
        playSound('type');
        updateCrypto();
      });
      cipherSelect.addEventListener('change', () => {
        this.cryptoCipher = cipherSelect.value;
        playSound('click');
        updateCrypto();
      });
    }

    actionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        actionBtns.forEach(b => {
          b.classList.remove('active');
          b.style.background = 'transparent';
          b.style.color = 'var(--clr-text-muted)';
        });
        btn.classList.add('active');
        btn.style.background = 'rgba(var(--clr-primary-rgb), 0.1)';
        btn.style.color = 'var(--clr-primary)';
        
        this.cryptoMode = btn.dataset.val;
        playSound('click');
        updateCrypto();
      });
    });
  }

  calculateEntropy(str) {
    return calculateEntropy(str);
  }

  formatTimeSpan(seconds) {
    return formatTimeSpan(seconds);
  }

  rot13(str) {
    return rot13(str);
  }

  destroy() {
    if (this.scanLoop) {
      clearInterval(this.scanLoop);
      this.scanLoop = null;
    }
  }
}
