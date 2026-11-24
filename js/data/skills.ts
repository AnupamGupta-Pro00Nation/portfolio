export interface Skill {
  name: string;
  level: number;
  category: string;
}

export const skills: Skill[] = [
  // Web Application Security & Pentesting
  { name: "Web Application Security (OWASP Top 10)", level: 92, category: "Web Security" },
  { name: "Penetration Testing & Reconnaissance", level: 90, category: "Web Security" },
  { name: "Vulnerability Assessment", level: 88, category: "Web Security" },
  { name: "Burp Suite & Web Proxies", level: 86, category: "Web Security" },

  // Defensive & Detection Engineering
  { name: "Detection Engineering & MTTD Analytics", level: 90, category: "Defensive Security" },
  { name: "Threat Intelligence & Incident Response", level: 85, category: "Defensive Security" },
  { name: "Splunk (SIEM Log Telemetry)", level: 86, category: "Defensive Security" },
  { name: "Wazuh & Volatility (Memory Forensics)", level: 82, category: "Defensive Security" },
  { name: "Digital Forensics & Triage", level: 84, category: "Defensive Security" },

  // Network & Systems Security
  { name: "Packet Analysis & libpcap", level: 88, category: "Network Security" },
  { name: "Network Security & Protocols (TCP/IP)", level: 88, category: "Network Security" },
  { name: "Wireshark Packet Dissection", level: 88, category: "Network Security" },
  { name: "Wi-Fi Security Assessment & Aircrack-ng", level: 82, category: "Network Security" },

  // Offensive Security & Exploitation
  { name: "Metasploit Framework", level: 86, category: "Offensive Security" },
  { name: "Nmap Network Scanning (NSE)", level: 92, category: "Offensive Security" },
  { name: "Reverse Shells & Privilege Escalation", level: 84, category: "Offensive Security" },

  // Programming & Systems (Core: Java 1st preference, then Python, then C)
  { name: "Java (Core & Security Architecture)", level: 92, category: "Programming" },
  { name: "Python (Security Scripting & Automation)", level: 88, category: "Programming" },
  { name: "C (Systems & Socket Programming)", level: 85, category: "Programming" },
  { name: "JavaScript / ES6", level: 82, category: "Programming" },
  { name: "HTML5 / CSS3", level: 85, category: "Programming" },

  // Development & Platforms
  { name: "Spring Boot (REST APIs)", level: 88, category: "Platforms & Dev" },
  { name: "React & Modern Web UI", level: 84, category: "Platforms & Dev" },
  { name: "Git & GitHub Version Control", level: 90, category: "Platforms & Dev" },
  { name: "Oracle VirtualBox Sandboxing", level: 90, category: "Platforms & Dev" },
  { name: "Kali Linux Administration", level: 92, category: "Platforms & Dev" },
  { name: "Vercel & Render Cloud Hosting", level: 88, category: "Platforms & Dev" }
];
