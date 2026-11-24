import { playSound } from '../hooks/useAudio.js';

export class CyberButton {
  static bind(buttonElement) {
    if (!buttonElement) return;

    buttonElement.addEventListener('mouseenter', () => {
      playSound('hover');
    });

    buttonElement.addEventListener('click', (e) => {
      playSound('click');
      
      // Perform visual glitch flicker
      const content = buttonElement.querySelector('.cyber-btn-content');
      if (content) {
        const originalText = content.textContent;
        content.classList.add('flickering');
        
        let counter = 0;
        const glitchInterval = setInterval(() => {
          content.textContent = Math.random().toString(36).substring(2, 7).toUpperCase();
          counter++;
          if (counter > 3) {
            clearInterval(glitchInterval);
            content.textContent = originalText;
            content.classList.remove('flickering');
          }
        }, 50);
      }
    });
  }

  static bindAll() {
    // Bind all buttons containing the .cyber-btn class
    document.querySelectorAll('.cyber-btn').forEach(btn => {
      CyberButton.bind(btn);
    });

    // Also bind any buttons playing native sounds
    document.querySelectorAll('[data-sound="click"]').forEach(btn => {
      btn.addEventListener('click', () => playSound('click'));
      btn.addEventListener('mouseenter', () => playSound('hover'));
    });
  }
}
