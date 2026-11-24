import { store } from '../lib/store.js';

export class MatrixRain {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.columns = [];
    this.fontSize = 14;
    this.active = true;
    this.mouseX = -1000;
    this.mouseY = -1000;

    this.initCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    window.addEventListener('mousemove', (e) => this.trackMouse(e));

    // Listen to theme change to update colors dynamically
    store.subscribe(() => this.updateColorPalette());
    this.updateColorPalette();
  }

  initCanvas() {
    this.resizeCanvas();
    this.animate();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    const colCount = Math.floor(this.canvas.width / this.fontSize);
    this.columns = [];
    for (let i = 0; i < colCount; i++) {
      this.columns.push({
        y: Math.random() * -100,
        speed: 1 + Math.random() * 3,
        chars: this.generateRandomChars()
      });
    }
  }

  generateRandomChars() {
    // Binary, Hex, Katakana
    const charset = '0123456789ABCDEFabcdef日ハミヒーウシナモヌルヱ';
    return charset.split('');
  }

  trackMouse(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  updateColorPalette() {
    const theme = store.getState().theme;
    if (theme === 'amber') {
      this.primaryColor = 'rgba(255, 176, 0, ';
      this.glowColor = 'rgba(255, 200, 50, ';
    } else if (theme === 'cyan') {
      this.primaryColor = 'rgba(0, 229, 255, ';
      this.glowColor = 'rgba(100, 240, 255, ';
    } else {
      // Default Matrix Green
      this.primaryColor = 'rgba(0, 255, 102, ';
      this.glowColor = 'rgba(150, 255, 200, ';
    }
  }

  animate() {
    if (!this.active) return;

    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.ctx.fillStyle = 'rgba(3, 7, 18, 0.95)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      return;
    }
    
    // Draw fade overlay to create trailing effect
    this.ctx.fillStyle = 'rgba(3, 7, 18, 0.08)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = `${this.fontSize}px var(--font-mono)`;

    for (let i = 0; i < this.columns.length; i++) {
      const col = this.columns[i];
      const x = i * this.fontSize;
      const y = col.y;

      // Select random character from pre-generated set
      const charIndex = Math.floor(Math.random() * col.chars.length);
      const char = col.chars[charIndex];

      // Calculate distance to mouse for interactive hover reaction
      const dx = x - this.mouseX;
      const dy = y - this.mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Make characters close to the cursor glow brighter or disperse
      if (dist < 80) {
        this.ctx.fillStyle = `${this.glowColor}1)`;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = `${this.glowColor}0.8)`;
      } else {
        this.ctx.fillStyle = `${this.primaryColor}0.35)`;
        this.ctx.shadowBlur = 0;
      }

      this.ctx.fillText(char, x, y);

      // Reset when drop reaches bottom
      if (y > this.canvas.height && Math.random() > 0.975) {
        col.y = Math.random() * -50;
        col.speed = 1 + Math.random() * 3;
      } else {
        col.y += col.speed;
      }
    }

    requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.active = false;
  }
}
