import { store } from '../lib/store.js';

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.lastHoverTime = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playSynth(type) {
    const state = store.getState();
    if (!state.soundOn) return;

    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    switch (type) {
      case 'click': {
        // Punchy, satisfying tactile cyber click
        const osc = this.ctx.createOscillator();
        const oscSub = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, now);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.035);

        oscSub.type = 'sine';
        oscSub.frequency.setValueAtTime(140, now);
        oscSub.frequency.exponentialRampToValueAtTime(60, now + 0.035);

        osc.connect(filter);
        oscSub.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);

        osc.start(now);
        oscSub.start(now);
        osc.stop(now + 0.038);
        oscSub.stop(now + 0.038);
        break;
      }

      case 'hover': {
        // Catchy futuristic cyber shimmer ping
        const currentTimeMs = Date.now();
        if (currentTimeMs - this.lastHoverTime < 50) return;
        this.lastHoverTime = currentTimeMs;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1100, now);
        osc.frequency.exponentialRampToValueAtTime(1750, now + 0.025);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.028);

        osc.start(now);
        osc.stop(now + 0.028);
        break;
      }

      case 'type': {
        // Crisp high-tech mechanical keyboard click
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, now);
        filter.Q.setValueAtTime(2.0, now);

        osc.type = 'triangle';
        const pitch = 320 + Math.random() * 120;
        osc.frequency.setValueAtTime(pitch, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.025);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

        osc.start(now);
        osc.stop(now + 0.025);
        break;
      }

      case 'alert': {
        // High-tech sci-fi security alert pulse
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(680, now);
        osc.frequency.setValueAtTime(440, now + 0.09);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.start(now);
        osc.stop(now + 0.28);
        break;
      }

      case 'scan': {
        // Tactical sonar radar sweep
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(1280, now + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        gain.gain.setValueAtTime(0.11, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

        osc.start(now);
        osc.stop(now + 0.26);
        break;
      }

      case 'warp':
      case 'launch': {
        // Catchy sci-fi system initialization / portal sound
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.exponentialRampToValueAtTime(3200, now + 0.35);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.start(now);
        osc.stop(now + 0.45);
        break;
      }

      case 'success': {
        // Uplifting 4-tone cyber chord arpeggio (C5 -> E5 -> G5 -> C6)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.055);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          gain.gain.setValueAtTime(0.12, now + idx * 0.055);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.055 + 0.25);

          osc.start(now + idx * 0.055);
          osc.stop(now + idx * 0.055 + 0.25);
        });
        break;
      }
    }
  }
}

export const useAudio = new AudioEngine();
export const initAudioContext = () => useAudio.init();
export const playSound = (type) => useAudio.playSynth(type);
