import { playSound } from '../hooks/useAudio.js';

export class DecryptText {
  static init(element) {
    const targetText = element.dataset.target || element.textContent;
    const chars = '!@#$%^&*()_+{}|:<>?-=[]\\;\',./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const duration = parseInt(element.dataset.duration) || 800;
    const intervalTime = 30;
    const steps = Math.floor(duration / intervalTime);
    let currentStep = 0;

    element.textContent = '';
    
    const interval = setInterval(() => {
      let result = '';
      for (let i = 0; i < targetText.length; i++) {
        // If current index is solved, render actual char
        const solvedIndexLimit = Math.floor((currentStep / steps) * targetText.length);
        
        if (i < solvedIndexLimit) {
          result += targetText[i];
        } else if (targetText[i] === ' ') {
          result += ' ';
        } else {
          // Render random hacker char
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      
      element.textContent = result;
      
      // Play a quick typing pop frequency synth
      if (Math.random() > 0.4) {
        playSound('type');
      }

      currentStep++;
      if (currentStep > steps) {
        clearInterval(interval);
        element.textContent = targetText; // Ensure full resolution
      }
    }, intervalTime);
  }

  static bindAll() {
    // Bind auto-decrypt triggers that listen to scroll intersection events
    document.querySelectorAll('.decrypt-trigger-text').forEach(el => {
      el.addEventListener('visible', () => {
        DecryptText.init(el);
      });
    });
  }
}
