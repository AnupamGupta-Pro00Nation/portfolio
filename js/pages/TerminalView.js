import { TerminalComponent } from '../components/Terminal.js';
import { DecryptText } from '../components/DecryptText.js';
import { useIntersection } from '../hooks/useIntersection.js';

export class TerminalViewPage {
  constructor(mountId) {
    this.container = document.getElementById(mountId);
    if (!this.container) return;
    this.terminal = null;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--clr-border); padding-bottom: 1rem;">
        <div>
          <h1 style="font-size: 1.8rem; margin-bottom: 0.25rem;" class="crt-flicker">
            <DecryptText target="ROOT TERMINAL INTERFACE"></DecryptText>
          </h1>
          <p style="font-size: 0.8rem; color: var(--clr-text-muted);">
            Direct terminal connection to public file records, project details, and diagnostics databases.
          </p>
        </div>
        <span class="tech-label text-success">TTY1 // ESTABLISHED</span>
      </div>

      <div style="height: calc(100vh - var(--header-height) - var(--dock-height) - 130px);" id="main-terminal-mount">
        <!-- Terminal elements mounted here -->
      </div>
    `;

    // Instantiate interactive terminal shell
    this.terminal = new TerminalComponent('main-terminal-mount');

    DecryptText.bindAll();
    useIntersection.observeAll('.decrypt-trigger-text');
  }

  focusTerminal() {
    if (this.terminal && this.terminal.inputField) {
      this.terminal.inputField.focus();
    }
  }
}
