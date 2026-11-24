import { playSound } from '../hooks/useAudio.js';

export class ScanCard {
  static bind(cardElement) {
    if (!cardElement) return;

    cardElement.addEventListener('mouseenter', () => {
      playSound('hover');
      
      // Flash threat label on entering card
      const label = cardElement.querySelector('.tech-label');
      if (label) {
        label.style.animation = 'none';
        // force reflow
        void label.offsetWidth;
        label.style.animation = 'crt-flicker-anim 0.3s infinite';
        setTimeout(() => {
          label.style.animation = '';
        }, 600);
      }
    });
  }

  static bindAll() {
    document.querySelectorAll('.cyber-panel').forEach(card => {
      ScanCard.bind(card);
    });
  }
}
