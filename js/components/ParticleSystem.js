import { store } from '../lib/store.js';

export class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.active = true;
    this.maxParticles = window.innerWidth < 768 ? 45 : 85;
    this.connectionDist = 130;
    
    // Mouse coords
    this.mouse = { x: -1000, y: -1000, radius: 160 };

    this.onResize = () => this.resize();
    this.onMouseMove = (e) => this.trackMouse(e);
    this.onMouseOut = () => this.resetMouse();
    this.onClick = () => this.shockwave();

    this.init();
    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseout', this.onMouseOut);
    window.addEventListener('click', this.onClick);

    // Sync theme colors
    this.unsubscribeStore = store.subscribe(() => this.updateColors());
    this.updateColors();
  }

  init() {
    this.resize();
    this.generateParticles();
    this.animate();
  }

  resize() {
    if (!this.canvas || !this.canvas.parentElement) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width || window.innerWidth;
    this.canvas.height = rect.height || 520;
  }

  generateParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        size: 1.2 + Math.random() * 2,
        baseAlpha: 0.2 + Math.random() * 0.35
      });
    }
  }

  trackMouse(e) {
    const bounds = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - bounds.left;
    this.mouse.y = e.clientY - bounds.top;
  }

  resetMouse() {
    this.mouse.x = -1000;
    this.mouse.y = -1000;
  }

  shockwave() {
    for (const p of this.particles) {
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 220 && dist > 0) {
        const force = (220 - dist) / 220;
        p.vx += (dx / dist) * force * 5;
        p.vy += (dy / dist) * force * 5;
      }
    }
  }

  updateColors() {
    const theme = store.getState().theme;
    if (theme === 'amber') {
      this.colorRGB = '255, 183, 0';
    } else if (theme === 'cyan') {
      this.colorRGB = '0, 243, 255';
    } else {
      // Default Matrix Green
      this.colorRGB = '0, 255, 102';
    }
  }

  animate() {
    if (!this.active) return;

    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Natural drag / velocity dampening
      p.vx *= 0.985;
      p.vy *= 0.985;

      // Maintain min speed
      if (Math.abs(p.vx) < 0.2) p.vx += (Math.random() - 0.5) * 0.3;
      if (Math.abs(p.vy) < 0.2) p.vy += (Math.random() - 0.5) * 0.3;

      // Shift position
      p.x += p.vx;
      p.y += p.vy;

      // Wrap boundaries
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      // Antigravity / Mouse attraction & soft repel physics
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.mouse.radius && dist > 0) {
        const force = (this.mouse.radius - dist) / this.mouse.radius;
        // Subtle gravitational orbit pull
        p.x += (dx / dist) * force * 1.6;
        p.y += (dy / dist) * force * 1.6;
      }

      // Draw particle dot
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${this.colorRGB}, ${p.baseAlpha})`;
      this.ctx.fill();

      // Check connections with other particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const cdx = p.x - p2.x;
        const cdy = p.y - p2.y;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

        if (cdist < this.connectionDist) {
          const alpha = (1 - cdist / this.connectionDist) * 0.22;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(${this.colorRGB}, ${alpha})`;
          this.ctx.lineWidth = 0.6;
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.active = false;
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseout', this.onMouseOut);
    window.removeEventListener('click', this.onClick);
    if (this.unsubscribeStore) this.unsubscribeStore();
  }
}
