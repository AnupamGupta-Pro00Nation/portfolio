export interface Project {
  id: string;
  title: string;
  category: string;
  github: string;
  liveUrl?: string;
  period?: string;
  summary: string;
  highlights: string[];
  technologies: string[];
}

export const projects: Project[] = [
  {
    id: "purpleloop",
    title: "PurpleLoop — Purple Teaming & Detection Engineering Platform",
    category: "Purple Teaming & Detection Engineering",
    github: "https://github.com/AnupamGupta-Pro00Nation/purpleloop",
    liveUrl: "https://purpleloop-weld.vercel.app",
    period: "2026 – Present",
    summary: "A purple teaming and detection engineering platform that links controlled attack simulations to defensive detection. Synthetic events feed detectors that raise alerts; dashboard tracks detection metrics including MTTD. Brute-force detector groups failed logins by IP with a configurable threshold.",
    highlights: [
      "Simulated Attack-to-Defense Pipeline: Links controlled adversary attack simulations to real-time defensive detection pipelines, generating synthetic event feeds to audit detector sensitivity.",
      "Automated Alerting & Metric Tracking: Real-time dashboard tracks security operations performance indicators, calculating Mean Time to Detect (MTTD) across various threat categories.",
      "Configurable Heuristic Detection: Features a brute-force detector that aggregates and groups failed authentication events by IP address with customizable threshold parameters.",
      "Full-Stack Architecture: Built with Java and Spring Boot on the backend providing high-throughput REST APIs, coupled with a responsive React dashboard deployed on Vercel."
    ],
    technologies: ["Java", "Spring Boot", "React", "REST API", "Detection Engineering", "Vercel / Render"]
  },
  {
    id: "network-intrusion-detection",
    title: "Advanced Network Intrusion Detection System (NIDS)",
    category: "Systems & Network Security",
    github: "https://github.com/AnupamGupta-Pro00Nation/Advanced-NIDS",
    period: "Feb 2026",
    summary: "C-based NIDS using libpcap for real-time packet capture and manual parsing of Ethernet, IPv4, TCP and UDP headers; threshold detection for port scans and SYN, HTTP and ICMP floods; multithreaded processing with timestamped alert logging.",
    highlights: [
      "Hand-Crafted Packet Dissection: Manual pointer arithmetic decoding Ethernet, IPv4, TCP (SYN, ACK, FIN, RST, PSH, URG), UDP, and ICMP frame headers without external decoding dependencies.",
      "Thread-Safe Producer-Consumer Architecture: Decoupled high-speed packet capture from analysis workers using mutexes and event primitives to guarantee zero packet drops under heavy network load.",
      "Heuristic Sliding-Window Detection: Real-time algorithms to identify and mitigate TCP SYN floods, stealth port sweeps, HTTP floods, and ICMP flood attacks.",
      "Production Alert Logging: Structured logging pipeline outputting real-time timestamped anomaly alerts with microsecond precision."
    ],
    technologies: ["C", "libpcap / Npcap", "Linux", "TCP/IP Protocol Stack", "Multithreading", "Raw Socket Parsing"]
  },
  {
    id: "cyber-home-lab",
    title: "Cybersecurity Home Lab",
    category: "Offensive Security & Monitoring",
    github: "https://github.com/AnupamGupta-Pro00Nation/Cybersecurity-Home-Lab",
    period: "Mar 2026",
    summary: "Virtualized penetration testing lab simulating attack-and-defense scenarios; reconnaissance and exploitation with Nmap and Metasploit (5+ CVEs exploited); log and security event analysis in Splunk.",
    highlights: [
      "Isolated Virtual Network Architecture: Designed segmented host-only networking in Oracle VirtualBox to simulate realistic corporate attack surfaces safely.",
      "Reconnaissance & Service Fingerprinting: Utilized Nmap Scripting Engine (NSE) for port enumeration, banner grabbing, and identifying outdated daemon vulnerabilities.",
      "Controlled Exploitation: Exploited known CVEs (5+ exploited) using the Metasploit Framework to gain shell access and document privilege escalation vectors.",
      "SIEM Log Telemetry & Correlation: Ingested system event feeds and authentication logs directly into Splunk Enterprise to build threat detection alerts and correlate multi-stage adversary tactics."
    ],
    technologies: ["Oracle VirtualBox", "Kali Linux", "Metasploitable", "Nmap", "Metasploit", "Splunk SIEM"]
  },
  {
    id: "password-checker",
    title: "Client-Side Cryptographic Password Strength & Entropy Evaluator",
    category: "Application Security & Cryptography",
    github: "https://github.com/AnupamGupta-Pro00Nation/Password_Strength_Checker",
    period: "2025",
    summary: "A privacy-first security auditing tool that computes mathematical Shannon entropy directly in the client browser, providing users with instant feedback on brute-force resilience without ever sending credentials across the network.",
    highlights: [
      "Mathematical Shannon Entropy Scoring: Computes bits of information entropy in real-time to quantify brute-force resistance against modern GPU dictionary attacks.",
      "Zero-Transmission Architecture: Operates entirely client-side, guaranteeing that passwords and passphrase fragments are never transmitted or logged.",
      "Multi-Vector Pattern Penalties: Accounts for character space diversity while penalizing sequential patterns, repeated characters, and dictionary patterns.",
      "Clear Crack-Time Projections: Translates raw entropy math into intuitive estimated crack-time thresholds and actionable guidance for end users."
    ],
    technologies: ["JavaScript (ES6)", "Shannon Entropy Math", "Client-Side Cryptography", "HTML5 / CSS3"]
  }
];
