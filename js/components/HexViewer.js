export class HexViewer {
  static render(textBlock) {
    if (!textBlock) return '';
    const bytes = new TextEncoder().encode(textBlock);
    let output = '';
    const bytesPerRow = 16;

    for (let i = 0; i < bytes.length; i += bytesPerRow) {
      // Offset hex: e.g., 00000010
      const offset = i.toString(16).padStart(8, '0');
      
      // Hex representation
      let hexPart = '';
      let asciiPart = '';
      
      for (let j = 0; j < bytesPerRow; j++) {
        if (i + j < bytes.length) {
          const byte = bytes[i + j];
          hexPart += byte.toString(16).padStart(2, '0') + ' ';
          // ASCII part: only printable chars
          asciiPart += (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.';
        } else {
          hexPart += '   '; // Padding
        }
      }

      output += `<span class="hex-offset">${offset}</span>  <span class="hex-bytes">${hexPart}</span>  <span class="hex-ascii">|${asciiPart}|</span>\n`;
    }

    return `<pre class="hex-viewer-console">${output}</pre>`;
  }
}
