import { playSound } from '../hooks/useAudio.js';

class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    if (typeof document === 'undefined') return;
    let el = document.getElementById('cyber-toast-container');
    if (!el) {
      el = document.createElement('div');
      el.id = 'cyber-toast-container';
      el.className = 'cyber-toast-container';
      document.body.appendChild(el);
    }
    this.container = el;
  }

  show(message, type = 'info', duration = 3200) {
    if (!this.container) this.init();
    if (!this.container) return;

    const toast = document.createElement('div');
    toast.className = `cyber-toast cyber-toast-${type}`;

    let icon = '✦';
    if (type === 'success') icon = '✓';
    if (type === 'error' || type === 'alert') icon = '⚠';
    if (type === 'copy') icon = '📋';

    toast.innerHTML = `
      <div class="toast-bracket-left">[</div>
      <div class="toast-content">
        <span class="toast-tag">${type.toUpperCase()}</span>
        <span class="toast-msg">${icon} ${message}</span>
      </div>
      <div class="toast-bracket-right">]</div>
    `;

    this.container.appendChild(toast);

    if (type === 'alert' || type === 'error') {
      playSound('alert');
    } else {
      playSound('success');
    }

    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 300);
    }, duration);
  }
}

export const toast = new ToastManager();

