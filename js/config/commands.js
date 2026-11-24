import { projects } from '../data/projects.js?v=2.2.0';
import { experience } from '../data/experience.js?v=2.2.0';
import { certifications } from '../data/certifications.js?v=2.2.0';
import { skills } from '../data/skills.js?v=2.2.0';
import { socials } from '../data/socials.js?v=2.2.0';
import { achievements } from '../data/achievements.js?v=2.2.0';
import { profile } from '../data/profile.js?v=2.2.0';
import { store } from '../lib/store.js';
import { playSound } from '../hooks/useAudio.js';
import { probeEndpoint, getGitHubLiveStats } from '../utils/liveStatus.js?v=2.2.0';

export const commands = {
  help: {
    description: "Display a list of available command utilities.",
    exec: () => {
      const commandList = Object.keys(commands).map(cmd => {
        return `  <span class="text-accent">${cmd.padEnd(16)}</span> - ${commands[cmd].description}`;
      }).join('\n');
      return `Anupam Gupta // Cybersecurity Portfolio Shell [v4.2]:\n\n${commandList}\n\nTip: Try typing 'whoami', 'projects', 'nids', 'resume', or 'nmap'`;
    }
  },

  whoami: {
    description: "Print current active candidate background and focus areas.",
    exec: () => {
      return `
[CANDIDATE IDENTIFICATION]
------------------------------------------------------------
NAME: Anupam Gupta
EDUCATION: B.Tech in Computer Science and Engineering (Cybersecurity), GLA University (2024 – 2028 Expected)
PRIMARY FOCUS: Web Application Penetration Testing (OWASP Top 10) & Purple Teaming (PurpleLoop)
EXPERIENCE: Former WAPT & CTF Developing Intern @ CyberCell Headquarters, Lucknow (UP Police)
TOOL STACK: Java (Spring Boot), Python, C (libpcap), React, Burp Suite Pro, Kali Linux, Nmap, Splunk, Wazuh, Wireshark
AVAILABILITY: Open to cybersecurity internships and opportunities
`;
    }
  },

  about: {
    description: "Display professional profile details for Anupam Gupta.",
    exec: () => {
      return `
[PROFESSIONAL BACKGROUND — ANUPAM GUPTA]
------------------------------------------------------------
NAME: ${profile.name}
TITLE: ${profile.title}
CURRENT: ${profile.currentRole}
LOCATION: ${profile.location}

${profile.bio.join('\n\n')}
`;
    }
  },

  skills: {
    description: "Print a report of technical skill competencies.",
    exec: () => {
      const skillsList = skills.map(s => {
        const barLength = 20;
        const filledLength = Math.round((s.level / 100) * barLength);
        const bar = '█'.repeat(filledLength) + ' '.repeat(barLength - filledLength);
        return `${s.name.padEnd(32)} [${bar}] ${s.level}% (${s.category})`;
      }).join('\n');
      return `\n[VERIFIED COMPETENCY REPORT]\n------------------------------------------------------------\n${skillsList}`;
    }
  },

  projects: {
    description: "List all documented security repositories and tools.",
    exec: () => {
      const list = projects.map(p => {
        return `- <span class="text-accent">${p.title}</span>
  ID: <span class="text-primary">${p.id}</span> | Category: <span class="text-muted">${p.category}</span>
  Summary: <span class="text-muted">${p.summary}</span>`;
      }).join('\n\n');
      return `VERIFIED SECURITY REPOSITORIES & SYSTEMS:\n\n${list}\n\nType 'details [project-id]' to inspect highlights and architecture.`;
    }
  },

  details: {
    description: "Inspect project highlights. Usage: details [project-id]",
    exec: (args) => {
      if (!args || args.length === 0) {
        return `<span class="text-alert">ERROR: Missing project ID. Usage: details [project-id]</span>\nAvailable: purpleloop, network-intrusion-detection, cyber-home-lab, future-trace, password-checker`;
      }
      const targetId = args[0];
      const p = projects.find(item => item.id === targetId);
      if (!p) {
        return `<span class="text-alert">ERROR: Target '${targetId}' not found. Available: purpleloop, network-intrusion-detection, cyber-home-lab, future-trace, password-checker</span>`;
      }
      return `
------------------------------------------------------------
PROJECT: ${p.title}
CATEGORY: ${p.category}
GITHUB: ${p.github}
------------------------------------------------------------
${p.summary}

KEY HIGHLIGHTS:
${p.highlights.map(h => `• ${h}`).join('\n')}

TECHNOLOGIES:
${p.technologies.join(', ')}
------------------------------------------------------------
`;
    }
  },

  decrypt: {
    description: "Alias for 'details'. Usage: decrypt [project-id]",
    exec: (args) => commands.details.exec(args)
  },

  nids: {
    description: "Run Anupam's pure C Advanced-NIDS engine. Usage: nids [--help]",
    exec: async (args, terminal) => {
      if (args && (args[0] === '--help' || args[0] === '-h')) {
        return `
Advanced Network Intrusion Detection System (NIDS) for Windows
Repository: https://github.com/AnupamGupta-Pro00Nation/Advanced-NIDS
Written in Pure C using Npcap / WinPcap SDK

Usage: nids.exe [options]
Options:
  --interface <name>     Bind to specific network interface (\Device\NPF_...)
  --port-threshold <n>   Max destination ports per source IP (Default: 10)
  --syn-threshold <n>    Max SYN packets without ACK (Default: 50)
  --icmp-threshold <n>   Max ICMP Echo packets per sec (Default: 100)
  --help                 Show this help message
`;
      }

      terminal.writeLine(`[nids.exe] Initializing Advanced-NIDS (Pure C on Windows)...`, 'info');
      terminal.writeLine(`[capture.c] Querying Npcap packet driver...`, 'info');
      playSound('scan');
      await terminal.sleep(700);

      terminal.writeLine(`Available network interfaces:`, 'info');
      terminal.writeLine(`  [0] \\Device\\NPF_{12345678-1234-1234-1234-123456789012} (Intel 82579LM Ethernet)`, 'info');
      terminal.writeLine(`  [1] \\Device\\NPF_{87654321-4321-4321-4321-210987654321} (Qualcomm QCA6174 Wi-Fi)`, 'info');
      await terminal.sleep(600);

      terminal.writeLine(`[main.c] Selected interface [0]. Starting multithreaded capture & processing...`, 'success');
      terminal.writeLine(`[detection.c] Initialized sliding window thresholds (Port: 10, SYN: 50, ICMP: 100)`, 'info');
      await terminal.sleep(700);

      const packets = [
        { type: "TCP SYN", src: "192.168.1.105:49152", dst: "192.168.1.1:80", flag: "[SYN]", alert: "Normal connection handshake", isAttack: false },
        { type: "TCP SYN", src: "10.0.4.15:61201", dst: "192.168.1.1:22", flag: "[SYN]", alert: "Normal SSH session init", isAttack: false },
        { type: "TCP SCAN", src: "185.220.101.5:44321", dst: "192.168.1.1:PORTS[1-1024]", flag: "[SYN]", alert: "[SECURITY ALERT] Stealth TCP SYN Port Sweep identified! (detection.c)", isAttack: true },
        { type: "SYN FLOOD", src: "203.0.113.42:RANDOM", dst: "192.168.1.1:80", flag: "[SYN]", alert: "[CRITICAL ALERT] SYN Flood DoS: 820 SYN pkts/sec! Mitigating socket pool exhaustion.", isAttack: true },
        { type: "ICMP ECHO", src: "198.51.100.12", dst: "192.168.1.1", flag: "[ECHO_REQ]", alert: "[SECURITY ALERT] Excessive ICMP Echo flood rate detected (detection.c)", isAttack: true }
      ];

      for (const pkt of packets) {
        if (pkt.isAttack) {
          playSound('alert');
          terminal.writeLine(`[PACKET INGEST] ${pkt.type} | ${pkt.src} -> ${pkt.dst} ${pkt.flag}`, 'error');
          terminal.writeLine(`  ↳ <span class="text-alert">${pkt.alert}</span>`, 'error');
          terminal.writeLine(`  ↳ [logger.c] Appended incident telemetry to alerts.log`, 'info');
        } else {
          playSound('type');
          terminal.writeLine(`[PACKET INGEST] ${pkt.type} | ${pkt.src} -> ${pkt.dst} ${pkt.flag}`, 'info');
          terminal.writeLine(`  ↳ <span class="text-success">${pkt.alert}</span>`, 'info');
        }
        await terminal.sleep(650);
      }

      playSound('success');
      return `
[nids.exe] Execution completed. 
GitHub Repository: https://github.com/AnupamGupta-Pro00Nation/Advanced-NIDS
Type 'cat alerts.log' to view logged security incidents.
`;
    }
  },

  'cat': {
    description: "Display content of simulated files. Usage: cat alerts.log",
    exec: (args) => {
      const target = args && args[0] ? args[0].toLowerCase() : '';
      if (target === 'alerts.log') {
        return `
============================================================
           ADVANCED-NIDS AUDIT LOG // alerts.log
============================================================
[2026-10-28 00:14:10] [ALERT] PortScanDetected   | Src: 185.220.101.5   | Dst: 192.168.1.1:1-1024  | HitCount: 14 unique ports
[2026-10-28 00:14:11] [ALERT] SYNFloodDetected   | Src: 203.0.113.42    | Dst: 192.168.1.1:80      | Rate: 820 pkts/s (Threshold: 50)
[2026-10-28 00:14:12] [ALERT] ICMPFloodDetected  | Src: 198.51.100.12   | Dst: 192.168.1.1         | Rate: 135 pkts/s (Threshold: 100)
============================================================
Status: Buffered write complete. 3 threat entries recorded.
`;
      }
      return `<span class="text-alert">cat: ${args && args[0] ? args[0] : 'file'}: No such file. Try 'cat alerts.log'</span>`;
    }
  },

  resume: {
    description: "Print Anupam's professional resume credentials and education.",
    exec: () => {
      const timeline = experience.map(exp => {
        return `* <span class="text-accent">${exp.role}</span> at <span class="text-success">${exp.organization}</span> (${exp.period})\n` +
          exp.logs.map(log => `  - ${log}`).join('\n');
      }).join('\n\n');

      const certs = certifications.map(c => `  - [${c.code}] ${c.name} (${c.issuer}, ${c.date})`).join('\n');

      return `
============================================================
              ANUPAM GUPTA — CYBERSECURITY RESUME
============================================================
Location: ${profile.location}
Email: ${profile.email}
GitHub: ${profile.github}
LinkedIn: ${profile.linkedin}

EDUCATION:
------------------------------------------------------------
* B.Tech in Computer Science and Engineering (Cybersecurity), GLA University, Mathura
  Expected: 2028 | Specialization: Cybersecurity

EXPERIENCE & INTERNSHIPS:
------------------------------------------------------------
${timeline}

CERTIFICATIONS:
------------------------------------------------------------
${certs}
`;
    }
  },

  certs: {
    description: "Display verified industry certifications and credentials.",
    exec: () => {
      const list = certifications.map(c => {
        return `[${c.status}] <span class="text-accent">${c.name}</span>
  Issuer: ${c.issuer} | Date: ${c.date} | Ref: <span class="text-muted">${c.hash}</span>
  Document: <a href="${c.fileUrl}" target="_blank" class="text-primary">${c.fileUrl} ↗</a>`;
      }).join('\n\n');
      return `\nVERIFIED CERTIFICATIONS VAULT:\n------------------------------------------------------------\n${list}\n\nCREDLY VERIFICATION: https://credly.com/users/anupam-gupta.8e0a3913\nAvailable Proofs: shadow-fox-internship.pdf, pentest-showdown.pdf, drif-speaker.png`;
    }
  },

  achievements: {
    description: "List key achievements, speaker sessions, and CTF competitions.",
    exec: () => {
      const list = achievements.map(a => {
        return `* <span class="text-accent">${a.title}</span> (${a.date})
  Organization: ${a.organization}
  Details: ${a.description}`;
      }).join('\n\n');
      return `\nACHIEVEMENTS & CO-CURRICULAR HIGHLIGHTS:\n------------------------------------------------------------\n${list}`;
    }
  },

  contact: {
    description: "Display direct communication channels and social links.",
    exec: () => {
      const socialsList = socials.map(s => {
        return `  - ${s.platform.toUpperCase().padEnd(16)}: <a href="${s.url}" target="_blank" class="text-accent" style="text-decoration: underline;">${s.displayValue}</a>`;
      }).join('\n');
      return `\nDIRECT CONTACT CHANNELS:\n------------------------------------------------------------\n${socialsList}\nDirect Phone: +91 8381982462\nEmail: guptaanupam552@gmail.com`;
    }
  },

  socials: {
    description: "Display direct communication channels and social profiles.",
    exec: (args, terminal) => commands.contact.exec(args, terminal)
  },

  social: {
    description: "Alias for socials. Display communication channels.",
    exec: (args, terminal) => commands.contact.exec(args, terminal)
  },

  dossier: {
    description: "Open ShadowFox internship certificate (PDF).",
    exec: () => {
      window.open('./assets/certificates/shadow-fox-internship.pdf', '_blank');
      return `Opening ShadowFox internship certificate in a new tab...\nDirect Link: <a href="./assets/certificates/shadow-fox-internship.pdf" target="_blank" class="text-primary">View Certificate (PDF) ↗</a>`;
    }
  },

  clear: {
    description: "Purge active console output logs.",
    exec: () => {
      return '__CLEAR__';
    }
  },

  'sudo': {
    description: "Execute a command with root privileges. Usage: sudo [command]",
    exec: async (args, terminal) => {
      if (!args || args.length === 0) {
        return `<span class="text-alert">sudo: a command is required. Try 'sudo hire-anupam'</span>`;
      }

      const subCmd = args[0].toLowerCase();
      if (subCmd === 'hire-anupam') {
        terminal.writeLine(`[sudo] password for visitor:`, 'info');
        await terminal.sleep(1000);
        terminal.writeLine(`••••••••`, 'info');
        playSound('click');
        await terminal.sleep(500);
        
        terminal.writeLine(`[SUCCESS] Access token granted: HIRING_MANAGER_LEVEL_1`, 'success');
        playSound('success');
        await terminal.sleep(600);

        terminal.writeLine(`Validating candidate credentials for Anupam Gupta...`, 'info');
        await terminal.sleep(800);

        const tasks = [
          "Verifying WAPT engagement history at CyberCell HQ...",
          "Checking C/libpcap NIDS multithreaded test coverage...",
          "Validating Fortinet, Linux Foundation, and Palo Alto certificates...",
          "Confirming active leadership in Cyberonites Club, GLA University...",
          "Dispatching direct email to guptaanupam552@gmail.com..."
        ];

        for (const task of tasks) {
          terminal.writeLine(`[~] ${task}`, 'info');
          playSound('type');
          await terminal.sleep(600);
        }

        terminal.writeLine(`\n[+] Candidate Evaluation: OUTSTANDING! Ready for interview.`, 'success');
        playSound('success');
        
        return `
============================================================
              AUTOMATED HIRING ASSESSMENT:
   Anupam Gupta is an exceptional cybersecurity talent.
   Email: guptaanupam552@gmail.com | Phone: +91 8381982462
============================================================
`;
      }

      return `<span class="text-alert">sudo: permission denied for '${subCmd}'. Try 'sudo hire-anupam'</span>`;
    }
  },

  nmap: {
    description: "Simulate active network port scan. Usage: nmap [target]",
    exec: async (args, terminal) => {
      const target = args[0] || "192.168.1.100 (HomeLab Target)";
      terminal.writeLine(`Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC`, 'info');
      playSound('scan');
      await terminal.sleep(1000);

      terminal.writeLine(`Nmap scan report for ${target}`, 'info');
      await terminal.sleep(600);
      terminal.writeLine(`Host is up (0.008s latency).`, 'success');
      await terminal.sleep(500);

      terminal.writeLine(`Scanning ${target} [Discovered open ports on Metasploitable sandbox]...`, 'info');
      playSound('scan');
      await terminal.sleep(1200);

      terminal.writeLine(`PORT     STATE SERVICE      VERSION`, 'info');
      await terminal.sleep(200);
      terminal.writeLine(`21/tcp   open  ftp          vsftpd 2.3.4 (Backdoor vulnerable - CVE-2011-2523)`, 'alert');
      await terminal.sleep(200);
      terminal.writeLine(`22/tcp   open  ssh          OpenSSH 4.7p1 Debian`, 'success');
      await terminal.sleep(200);
      terminal.writeLine(`80/tcp   open  http         Apache httpd 2.2.8 ((Ubuntu) DAV/2)`, 'success');
      await terminal.sleep(200);
      terminal.writeLine(`445/tcp  open  netbios-ssn  Samba smbd 3.X - 4.X`, 'warning');
      await terminal.sleep(200);
      terminal.writeLine(`3306/tcp open  mysql        MySQL 5.0.51a-3ubuntu5`, 'success');
      await terminal.sleep(200);

      playSound('success');
      return `\nNmap done: 1 target host scanned. Identified 5 open services in virtualized pentest sandbox.`;
    }
  },

  sqlmap: {
    description: "Simulate SQL injection testing. Usage: sqlmap [url]",
    exec: async (args, terminal) => {
      const target = args[0] || "http://test-lab.local/vuln.php?id=1";
      terminal.writeLine(`sqlmap/1.7#stable - automatic SQL injection testing tool`, 'info');
      await terminal.sleep(700);

      terminal.writeLine(`[INFO] testing connection to the target URL: ${target}`, 'info');
      await terminal.sleep(800);
      terminal.writeLine(`[INFO] testing parameter 'id' for SQL injection vectors...`, 'info');
      await terminal.sleep(800);

      terminal.writeLine(`[INFO] GET parameter 'id' is vulnerable: error-based & boolean-blind detected`, 'alert');
      playSound('alert');
      await terminal.sleep(800);

      terminal.writeLine(`[INFO] OWASP Top 10 A03:2021-Injection validation succeeded`, 'success');
      playSound('success');
      await terminal.sleep(600);

      return `
[REMEDIATION RECOMMENDATION]
- Enforce parameterized prepared statements (e.g. PDO / PreparedStatement).
- Apply strict input whitelisting and regex sanitization.
- Restrict database user execution privileges.
`;
    }
  },

  gobuster: {
    description: "Simulate web directory discovery. Usage: gobuster [url]",
    exec: async (args, terminal) => {
      const target = args[0] || "http://sandbox-web.local";
      terminal.writeLine(`Gobuster v3.5 (OWASP Recon Mode)`, 'info');
      terminal.writeLine(`[+] Target:    ${target}`, 'info');
      terminal.writeLine(`[+] Wordlist:  common_web_paths.txt (4,614 paths)`, 'info');
      await terminal.sleep(1000);

      const paths = [
        { path: "/index.html", status: 200, size: "1.2KB" },
        { path: "/admin", status: 403, size: "320B" },
        { path: "/portal/login.php", status: 200, size: "4.5KB" },
        { path: "/api/v1/health", status: 200, size: "84B" },
        { path: "/.git/HEAD", status: 404, size: "180B" },
        { path: "/backup.zip", status: 404, size: "180B" }
      ];

      for (const p of paths) {
        let col = 'success';
        if (p.status === 403) col = 'warning';
        if (p.status === 404) col = 'error';
        
        terminal.writeLine(`Found: ${p.path.padEnd(22)} (Status: <span class="text-${col}">${p.status}</span>) [${p.size}]`, 'info');
        playSound('type');
        await terminal.sleep(400);
      }

      playSound('success');
      return `\nDirectory sweep complete: Target enumerated for potential authorization bypasses.`;
    }
  },

  simulate: {
    description: "Run PurpleLoop SSH brute-force attack & MTTD detection simulation.",
    exec: async (args, terminal) => {
      terminal.writeLine(`[PURPLELOOP SIM] Initializing Adversary Simulation Pipeline...`, 'info');
      terminal.writeLine(`[CONFIG] Attack Vector: SSH Brute-Force (Hydra) | Target: 192.168.1.10:22`, 'info');
      terminal.writeLine(`[CONFIG] Detector: BruteForceDetector (Sliding Window: >4 fails/5s)`, 'info');
      playSound('scan');
      await terminal.sleep(700);

      terminal.writeLine(`Starting attack stream from 192.168.1.105... MTTD timer started.`, 'warning');
      const startMs = Date.now();

      const attempts = [
        { delay: 500, user: 'root', port: 42812 },
        { delay: 550, user: 'admin', port: 42814 },
        { delay: 600, user: 'ubuntu', port: 42816 },
        { delay: 550, user: 'deploy', port: 42818 },
        { delay: 500, user: 'operator', port: 42820 }
      ];

      for (let i = 0; i < attempts.length; i++) {
        await terminal.sleep(attempts[i].delay);
        const elapsed = ((Date.now() - startMs) / 1000).toFixed(2);
        playSound('type');
        terminal.writeLine(`[T+${elapsed}s] [AUTH_FAIL] Failed password for ${attempts[i].user} from 192.168.1.105 port ${attempts[i].port} ssh2 (Attempt ${i + 1}/5)`, 'error');
      }

      const mttd = ((Date.now() - startMs) / 1000).toFixed(2);
      playSound('alert');
      await terminal.sleep(150);
      playSound('success');

      terminal.writeLine(`------------------------------------------------------------`, 'dim');
      terminal.writeLine(`🚨 [DETECTION ALERT] BruteForceDetector: threshold exceeded`, 'alert');
      terminal.writeLine(`↳ Rule Fired: >4 failed authentication attempts in 5.0s window`, 'warning');
      terminal.writeLine(`↳ Mean Time to Detect (MTTD): <span class="text-success" style="font-weight: bold;">${mttd}s</span> (Stopwatch stopped)`, 'success');
      terminal.writeLine(`↳ Automated Action: IP 192.168.1.105 blacklisted, webhook notification pushed`, 'success');

      store.addLog(`PURPLELOOP_SIM: BruteForceDetector triggered. MTTD = ${mttd}s`, 'alert');

      return `[SIMULATION COMPLETE] PurpleLoop adversary-to-defense loop verified with MTTD = ${mttd}s.`;
    }
  },

  scan: {
    description: "Run Advanced-NIDS packet stream analysis & heuristic rule detection.",
    exec: async (args, terminal) => {
      terminal.writeLine(`[ADVANCED-NIDS] Initializing raw packet stream (C / libpcap engine)...`, 'info');
      terminal.writeLine(`[CONFIG] Monitoring promiscuous ring buffer | sliding-window heuristic`, 'info');
      playSound('scan');
      await terminal.sleep(700);

      terminal.writeLine(`[STREAM] Ingesting baseline frames...`, 'info');
      terminal.writeLine(`  → 192.168.1.45:51204 -> 142.250.190.46:443 [TLS] (1420 bytes)`, 'info');
      terminal.writeLine(`  → 192.168.1.45:58912 -> 1.1.1.1:53 [DNS UDP] (74 bytes)`, 'info');
      await terminal.sleep(600);

      terminal.writeLine(`[INJECTION] Injecting Stealth TCP SYN Port Sweep (185.220.101.5)...`, 'warning');
      playSound('type');
      const scanPorts = [21, 22, 25, 80, 110, 143, 443, 3306, 8080, 8443, 9000];
      for (const p of scanPorts) {
        terminal.writeLine(`  [SYN] 185.220.101.5 -> 192.168.1.1:${p}`, 'error');
        await terminal.sleep(80);
      }

      playSound('alert');
      terminal.writeLine(`🚨 [ALERTS.LOG] [ALERT] PortScanDetected | Src: 185.220.101.5 | Dst: 192.168.1.1:1-1024`, 'alert');
      terminal.writeLine(`  ↳ Rule Fired: Rule 101 [STEALTH_PORT_SCAN] — Unique dest ports from single host exceeded threshold (11 > 10 in 1.0s). Frame dropped.`, 'warning');
      await terminal.sleep(500);

      terminal.writeLine(`[INJECTION] Injecting SYN Flood DoS (203.0.113.42 -> 192.168.1.1:80)...`, 'warning');
      for (let i = 0; i < 6; i++) {
        terminal.writeLine(`  [SYN] 203.0.113.42:${12000 + i * 111} -> 192.168.1.1:80`, 'error');
        await terminal.sleep(60);
      }

      playSound('alert');
      terminal.writeLine(`🚨 [ALERTS.LOG] [ALERT] SYNFloodDetected | Src: 203.0.113.42 | Dst: 192.168.1.1:80 | Rate: 840 pkts/s`, 'alert');
      terminal.writeLine(`  ↳ Rule Fired: Rule 204 [TCP_SYN_FLOOD] — Half-open SYN rate without ACK exceeded safety baseline (>50 pkts/s). Engaged SYN cookies.`, 'warning');

      playSound('success');
      return `[SCAN COMPLETE] Advanced-NIDS packet stream & heuristic alert rules evaluated with zero frame loss.`;
    }
  },

  status: {
    description: "Check live reachability of PurpleLoop platform & external telemetry.",
    exec: async (args, terminal) => {
      terminal.writeLine(`[HEALTH CHECK] Probing live deployment endpoints from client browser...`, 'info');
      playSound('scan');
      await terminal.sleep(500);

      terminal.writeLine(`[PROBING] https://purpleloop-weld.vercel.app (Frontend)...`, 'info');
      const appReachable = await probeEndpoint('https://purpleloop-weld.vercel.app', 4000);
      terminal.writeLine(`  ↳ Status: ${appReachable ? '<span class="text-success">[REACHABLE // LIVE]</span>' : '<span class="text-muted">[COULD NOT VERIFY / SLEEPING]</span>'}`, appReachable ? 'success' : 'info');
      await terminal.sleep(300);

      terminal.writeLine(`[PROBING] https://purpleloop-api.onrender.com (Backend API)...`, 'info');
      const apiReachable = await probeEndpoint('https://purpleloop-api.onrender.com', 4000);
      terminal.writeLine(`  ↳ Status: ${apiReachable ? '<span class="text-success">[REACHABLE // ONLINE]</span>' : '<span class="text-muted">[COULD NOT VERIFY / SLEEPING]</span>'}`, apiReachable ? 'success' : 'info');
      await terminal.sleep(300);

      terminal.writeLine(`[PROBING] GitHub API (User: AnupamGupta-Pro00Nation)...`, 'info');
      const ghStats = await getGitHubLiveStats('AnupamGupta-Pro00Nation');
      if (ghStats) {
        terminal.writeLine(`  ↳ Status: <span class="text-success">[CONNECTED]</span> Public Repos: ${ghStats.publicRepos} | Followers: ${ghStats.followers}`, 'success');
      } else {
        terminal.writeLine(`  ↳ Status: <span class="text-muted">[RATE LIMIT OR OFFLINE]</span>`, 'info');
      }

      playSound('success');
      return `Live status check complete. (Never displays fake online: green = reachable, grey = unverified).`;
    }
  }
};
