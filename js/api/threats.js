import { store } from '../lib/store.js';

export class ThreatsSimulator {
  constructor() {
    this.timer = null;
    this.threatIPs = [
      "185.190.140.23", "203.0.113.5", "198.51.100.82", "45.22.190.1", 
      "88.208.2.14", "109.244.11.16", "23.4.155.80", "141.101.120.30"
    ];
    this.events = [
      { text: "NETWORK_AUDIT: TCP SYN scan detected & throttled from [IP]", type: "alert" },
      { text: "AUTH_MONITOR: Repeated failed authentication attempt logged for [IP]", type: "alert" },
      { text: "NIDS_TELEMETRY: Sliding-window packet heuristic inspection running. 0 drops", type: "success" },
      { text: "AUDIT_PIPELINE: OWASP Top 10 automated vulnerability check completed", type: "success" },
      { text: "HOST_INTEGRITY: System memory telemetry normal. Kernel hooks verified", type: "system" },
      { text: "SIEM_INGEST: Splunk event correlation forwarder heartbeat active", type: "system" }
    ];
  }

  start() {
    // Generate an event every 5 to 10 seconds
    const loop = () => {
      const delay = 4000 + Math.random() * 6000;
      this.timer = setTimeout(() => {
        this.generateEvent();
        this.updateSystemMetrics();
        loop();
      }, delay);
    };
    loop();
  }

  stop() {
    if (this.timer) clearTimeout(this.timer);
  }

  generateEvent() {
    const randomEvent = this.events[Math.floor(Math.random() * this.events.length)];
    const randomIP = this.threatIPs[Math.floor(Math.random() * this.threatIPs.length)];
    const text = randomEvent.text.replace("[IP]", randomIP);
    
    // Add log to store
    store.addLog(text, randomEvent.type);

    // Dispatch global event for visual feedback
    window.dispatchEvent(new CustomEvent('threat-detected', { detail: { text, type: randomEvent.type } }));
  }

  updateSystemMetrics() {
    // Randomize loads slightly for active dashboard feeling
    const cpu = (5 + Math.random() * 15).toFixed(1) + "%";
    const ram = (4.0 + Math.random() * 0.5).toFixed(1) + "GB / 16GB";

    store.setState({
      metrics: { cpu, ram }
    });
  }
}

export const threatsSimulator = new ThreatsSimulator();
export const startThreatMonitoring = () => threatsSimulator.start();
export const stopThreatMonitoring = () => threatsSimulator.stop();
