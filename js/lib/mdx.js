export class MDXCompiler {
  static compile(mdText) {
    if (!mdText) return '';
    let html = mdText;

    // Remove block comments
    html = html.replace(/<!--[\s\S]*?-->/g, '');

    // Parse blockquotes
    html = html.replace(/^\>\s+(.*)$/gim, '<blockquote>$1</blockquote>');

    // Parse Headers
    html = html.replace(/^### (.*)$/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*)$/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*)$/gim, '<h1>$1</h1>');

    // Parse Bold and Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Parse lists
    html = html.replace(/^\-\s+(.*)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
    // Clean nested ul tags
    html = html.replace(/<\/ul>\s*<ul>/g, '');

    // Parse Code blocks
    html = html.replace(/```([\w-]*)\n([\s\S]*?)\n```/g, (match, lang, code) => {
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `<pre class="code-block language-${lang}"><code class="crt-flicker">${escapedCode}</code></pre>`;
    });

    // Parse Inline Code
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // Parse links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // MDX Component translation - CyberButton:
    // Translate <CyberButton href="url">Text</CyberButton> into standard HTML tags
    html = html.replace(/<CyberButton\s+href="([^"]+)"\s*(.*?)>([\s\S]*?)<\/CyberButton>/gi, (match, href, attrs, text) => {
      return `<a href="${href}" class="cyber-btn" ${attrs} data-sound="click">
        <span class="cyber-btn-cut-top-left"></span>
        <span class="cyber-btn-content">${text}</span>
        <span class="cyber-btn-cut-bottom-right"></span>
      </a>`;
    });

    // Translate static <CyberButton>
    html = html.replace(/<CyberButton\s*(.*?)>([\s\S]*?)<\/CyberButton>/gi, (match, attrs, text) => {
      return `<button class="cyber-btn" ${attrs} data-sound="click">
        <span class="cyber-btn-cut-top-left"></span>
        <span class="cyber-btn-content">${text}</span>
        <span class="cyber-btn-cut-bottom-right"></span>
      </button>`;
    });

    // MDX Component translation - ScanCard:
    // Translate <ScanCard title="title" threat="THREAT">Body</ScanCard>
    html = html.replace(/<ScanCard\s+title="([^"]+)"\s+threat="([^"]+)"\s*(.*?)>([\s\S]*?)<\/ScanCard>/gi, (match, title, threat, attrs, body) => {
      let threatClass = 'text-success';
      if (threat.toLowerCase() === 'high') threatClass = 'text-warning';
      if (threat.toLowerCase() === 'critical') threatClass = 'text-alert';
      
      return `
      <div class="cyber-panel scanner-sweep" ${attrs}>
        <div class="cyber-decal-top-left"></div>
        <div class="cyber-panel-header">
          <h3>${title}</h3>
          <span class="tech-label ${threatClass}">${threat}</span>
        </div>
        <div class="cyber-panel-body">
          ${body}
        </div>
        <div class="cyber-decal-bottom-right"></div>
      </div>
      `;
    });

    // Translate <DecryptText> tag:
    html = html.replace(/<DecryptText\s+target="([^"]+)"\s*(.*?)><\/DecryptText>/gi, (match, target, attrs) => {
      return `<span class="decrypt-trigger-text" data-target="${target}" ${attrs}>${target.replace(/./g, '#')}</span>`;
    });

    // Clear excessive newlines inside lists/paragraphs (but preserve standard spacing)
    html = html.replace(/\n\n/g, '<br>');

    return html;
  }
}
