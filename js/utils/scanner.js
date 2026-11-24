export const MOCK_HOSTS = [
  { ip: "10.0.4.1", id: "aegis-scanner", label: "Project AEGIS Network Scanner", ports: [80, 443, 8080] },
  { ip: "10.0.4.2", id: "zero-trust-auth", label: "ZERO-TRUST Identity Shield", ports: [22, 443] },
  { ip: "10.0.4.3", id: "kernel-sandbox", label: "Kernel Exploit Sandbox", ports: [5000, 80] },
  { ip: "10.0.4.4", id: "cyber-hex-viewer", label: "Hex Decryptor Converter", ports: [443] }
];

export function getScanLatency(port) {
  // Return simulated micro-seconds latency based on port ranges
  if (port === 22) return 45 + Math.random() * 20;
  if (port === 80) return 12 + Math.random() * 8;
  if (port === 443) return 8 + Math.random() * 5;
  return 80 + Math.random() * 50;
}
