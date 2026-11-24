export function calculateEntropy(str) {
  const len = str.length;
  if (len === 0) return 0;
  
  const freq = {};
  for (let i = 0; i < len; i++) {
    const c = str[i];
    freq[c] = (freq[c] || 0) + 1;
  }
  
  let entropy = 0;
  for (const c in freq) {
    const p = freq[c] / len;
    entropy -= p * Math.log2(p);
  }
  return entropy * len;
}

export function rot13(str) {
  return str.replace(/[a-zA-Z]/g, (c) => {
    return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
  });
}

export function formatTimeSpan(seconds) {
  if (seconds < 0.001) return "< 1 millisecond";
  if (seconds < 1) return `${(seconds * 1000).toFixed(0)} ms`;
  if (seconds < 60) return `${seconds.toFixed(2)}s`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${minutes.toFixed(1)} mins`;
  const hours = minutes / 60;
  if (hours < 24) return `${hours.toFixed(1)} hrs`;
  const days = hours / 24;
  if (days < 365) return `${days.toFixed(1)} days`;
  const years = days / 365;
  if (years < 1000000) return `${years.toFixed(0)} years`;
  return `${(years / 1000000).toFixed(0)}M years`;
}
