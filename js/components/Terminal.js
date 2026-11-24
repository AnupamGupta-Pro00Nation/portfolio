import { commands } from '../config/commands.js?v=2.2.0';
import { MDXCompiler } from '../lib/mdx.js';
import { playSound } from '../hooks/useAudio.js';
import { CyberButton } from './CyberButton.js';
import { DecryptText } from './DecryptText.js';

export class TerminalComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.history = [];
    this.historyIndex = -1;

    this.renderSkeleton();
    this.outputArea = this.container.querySelector('.terminal-output');
    this.inputField = this.container.querySelector('.terminal-input');
    
    this.bindEvents();
    this.printWelcomeMessage();
  }

  renderSkeleton() {
    this.container.innerHTML = `
      <div class="terminal-container">
        <div class="terminal-header">
          <div class="terminal-header-dots">
            <span class="terminal-dot close"></span>
            <span class="terminal-dot minimize"></span>
            <span class="terminal-dot maximize"></span>
          </div>
          <span style="font-family: var(--font-header);">anupam@portfolio: ~ (Terminal Console v4.2)</span>
          <span>SSH: 127.0.0.1</span>
        </div>
        <div class="terminal-output"></div>
        <div class="terminal-input-line">
          <span class="terminal-prompt">anupam@portfolio:~$</span>
          <input type="text" class="terminal-input" autocomplete="off" spellcheck="false" aria-label="Terminal command prompt input" autofocus />
        </div>
      </div>
    `;
  }

  bindEvents() {
    this.container.addEventListener('click', () => {
      this.inputField.focus();
    });

    this.inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const value = this.inputField.value.trim();
        if (value) {
          this.execute(value);
        }
        this.inputField.value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.history.length > 0) {
          if (this.historyIndex === -1) {
            this.historyIndex = this.history.length - 1;
          } else if (this.historyIndex > 0) {
            this.historyIndex--;
          }
          this.inputField.value = this.history[this.historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex !== -1) {
          if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.inputField.value = this.history[this.historyIndex];
          } else {
            this.historyIndex = -1;
            this.inputField.value = '';
          }
        }
      } else {
        // Play small keypress sound
        playSound('type');
      }
    });
  }

  printWelcomeMessage() {
    this.writeLine(`Welcome to Anupam Gupta's Interactive Portfolio Terminal [v4.2]
B.Tech CSE (Cybersecurity) @ GLA University | WAPT Intern at CyberCell HQ Lucknow

Type '<span class="text-accent">help</span>' for a list of available command utilities.
Quick commands: '<span class="text-primary">whoami</span>', '<span class="text-primary">projects</span>', '<span class="text-primary">experience</span>', '<span class="text-primary">skills</span>', '<span class="text-primary">certs</span>', '<span class="text-primary">contact</span>'
`, 'info');
  }

  writeLine(text, type = '') {
    const line = document.createElement('div');
    line.className = `terminal-line ${type}`;
    
    // Process text via MDX Compiler to allow buttons / tags in terminal output
    line.innerHTML = MDXCompiler.compile(text);
    
    this.outputArea.appendChild(line);
    this.outputArea.scrollTop = this.outputArea.scrollHeight;

    // Bind custom buttons / decryptions in line
    CyberButton.bindAll();
    DecryptText.bindAll();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async execute(commandString) {
    this.history.push(commandString);
    this.historyIndex = -1;

    // Write original command
    this.writeLine(`anupam@portfolio:~$ ${commandString}`, 'command');

    const parts = commandString.split(/\s+/);
    const cmdName = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (commands[cmdName]) {
      this.inputField.disabled = true;
      const inputLine = this.container.querySelector('.terminal-input-line');
      if (inputLine) inputLine.classList.add('terminal-busy');
      try {
        const output = await commands[cmdName].exec(args, this);
        if (output === '__CLEAR__') {
          this.outputArea.innerHTML = '';
        } else if (output !== undefined && output !== null) {
          this.writeLine(output);
        }
      } catch (err) {
        this.writeLine(`ERROR: Execution failed. Details: ${err.message}`, 'error');
        playSound('alert');
      } finally {
        this.inputField.disabled = false;
        if (inputLine) inputLine.classList.remove('terminal-busy');
        this.inputField.focus();
      }
    } else {
      this.writeLine(`Command '${cmdName}' not recognized. Type 'help' for support.`, 'error');
      playSound('alert');
    }
  }
}
