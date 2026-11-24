class GlobalStore {
  constructor() {
    this.state = {
      theme: localStorage.getItem('cs-theme') || 'green',
      soundOn: localStorage.getItem('cs-sound') !== 'false',
      activeView: 'dashboard',
      logs: [
        { time: this.getTimestamp(), text: "SYS_INIT: Decryption keys generated successfully.", type: "system" },
        { time: this.getTimestamp(), text: "SYS_INIT: CRT shaders linked.", type: "system" },
        { time: this.getTimestamp(), text: "SYS_INIT: Firewalls active.", type: "success" }
      ],
      alertLevel: 'normal',
      metrics: {
        cpu: "08.2%",
        ram: "4.2GB / 16GB"
      }
    };
    this.listeners = [];
  }

  getTimestamp() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}.${String(d.getMilliseconds()).padStart(3, '0')}`;
  }

  getState() {
    return this.state;
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    if (newState.theme) {
      localStorage.setItem('cs-theme', this.state.theme);
      document.documentElement.setAttribute('data-theme', this.state.theme);
    }
    if (newState.soundOn !== undefined) {
      localStorage.setItem('cs-sound', this.state.soundOn);
    }
    if (newState.alertLevel) {
      document.body.setAttribute('data-alert-level', this.state.alertLevel);
    }
    this.listeners.forEach(listener => listener(this.state));
  }

  subscribe(listener) {
    this.listeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  addLog(text, type = 'system') {
    const newLog = {
      time: this.getTimestamp(),
      text,
      type
    };
    const updatedLogs = [newLog, ...this.state.logs].slice(0, 50);
    this.setState({ logs: updatedLogs });
  }
}

export const store = new GlobalStore();
// Initialize HTML attributes
document.documentElement.setAttribute('data-theme', store.state.theme);
document.body.setAttribute('data-alert-level', store.state.alertLevel);
