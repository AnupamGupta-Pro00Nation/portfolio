import { projects } from '../data/projects.js?v=3.0.0';
import { experience } from '../data/experience.js?v=3.0.0';
import { certifications, proofDocuments } from '../data/certifications.js?v=3.0.0';
import { achievements } from '../data/achievements.js?v=3.0.0';
import { profile } from '../data/profile.js?v=3.0.0';
import { MDXCompiler } from '../lib/mdx.js';
import { DecryptText } from '../components/DecryptText.js';
import { CyberButton } from '../components/CyberButton.js';
import { ScanCard } from '../components/ScanCard.js';
import { ParticleSystem } from '../components/ParticleSystem.js';
import { useIntersection } from '../hooks/useIntersection.js';
import { toast } from '../components/Toast.js';
import { playSound } from '../hooks/useAudio.js';
import { store } from '../lib/store.js';
import { PurpleLoopSim } from '../components/PurpleLoopSim.js?v=3.0.0';
import { NidsPacketSim } from '../components/NidsPacketSim.js?v=3.0.0';
import { checkPurpleLoopStatus, getGitHubLiveStats } from '../utils/liveStatus.js?v=3.0.0';

export class DashboardPage {
  constructor(mountId) {
    this.container = document.getElementById(mountId);
    if (!this.container) return;
    this.render();
  }

  render() {
    // 1. Core Competency Cards (Executive Professional Phrasing)
    const competencies = [
      {
        title: "Web Application Penetration Testing (WAPT)",
        badge: "Offensive Security",
        badgeClass: "text-success",
        desc: "Authorized security assessments adhering to OWASP Top 10 standards. Practical experience uncovering injection vectors, auditing broken access controls, testing authentication workflows, and evaluating API endpoints to protect sensitive user data.",
        tech: ["OWASP Top 10", "Burp Suite Pro", "SQL Injection", "XSS & CSRF", "Broken Access Control", "Dynamic Fuzzing"],
        icon: "🛡️"
      },
      {
        title: "Purple Teaming & Detection Engineering",
        badge: "Purple Teaming",
        badgeClass: "text-accent",
        desc: "Engineered PurpleLoop, linking controlled adversary simulations directly to defensive detectors. Generates synthetic security event feeds, raises automated alerts, groups IP brute-force attacks, and computes Mean Time to Detect (MTTD).",
        tech: ["Java", "Spring Boot", "React", "REST APIs", "MTTD Analytics", "Alert Rule Automation"],
        icon: "🔁"
      },
      {
        title: "Low-Level Network Intrusion Detection (C & libpcap)",
        badge: "Systems & Detection",
        badgeClass: "text-primary",
        desc: "Engineered a high-performance Network Intrusion Detection System in pure C on Windows & Linux. Hand-crafted pointer arithmetic parses Ethernet, IPv4, TCP, UDP, and ICMP frame headers with multithreaded queues for zero packet loss.",
        tech: ["Pure C", "libpcap / Npcap", "Packet Dissection", "Multithreaded Queues", "SYN Flood Detection", "Port Scan Sweeps"],
        icon: "⚡"
      },
      {
        title: "SIEM Telemetry & Virtualized Attack Labs",
        badge: "Security Operations",
        badgeClass: "text-warning",
        desc: "Hands-on vulnerability assessment across segmented attack-and-defense networks in Oracle VirtualBox. Deployed Metasploit, Nmap, Splunk Enterprise SIEM log ingestion, and memory forensics triage using Volatility & Wazuh.",
        tech: ["Splunk SIEM", "Metasploit", "Nmap NSE", "Memory Forensics", "Volatility", "Wazuh"],
        icon: "🔍"
      }
    ];

    const competenciesHTML = competencies.map(comp => `
      <div class="bracket-card spotlight tilt-card" style="display: flex; flex-direction: column; justify-content: space-between; min-height: 220px;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <span style="font-size: 0.65rem; font-family: var(--font-mono); color: var(--clr-text-muted);">${comp.icon} SPECIALIZATION</span>
            <span class="tech-label ${comp.badgeClass}" style="font-size: 0.6rem;">${comp.badge}</span>
          </div>
          <h3 style="font-size: 1.05rem; color: var(--clr-text-bright); font-family: var(--font-header); margin-bottom: 0.6rem; letter-spacing: 0.02em;">
            ${comp.title}
          </h3>
          <p style="font-size: 0.82rem; color: var(--clr-text-muted); line-height: 1.55; margin-bottom: 1rem;">
            ${comp.desc}
          </p>
        </div>
        <div style="border-top: 1px solid var(--clr-border); padding-top: 0.75rem;">
          <div class="tech-list" style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
            ${comp.tech.map(t => `<span class="tech-label" style="font-size: 0.62rem; font-family: var(--font-mono);">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');

    // 2. Featured Projects (Authentic, Professional Engineering Format)
    const projectsHTML = projects.map((p, idx) => {
      const isPurpleLoop = p.id === 'purpleloop';
      const isNids = p.id === 'network-intrusion-detection';
      return `
      <div class="bracket-card spotlight tilt-card${idx === 0 ? ' featured-card' : ''}" style="margin-bottom: 1.75rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.85rem; border-bottom: 1px solid var(--clr-border); padding-bottom: 0.65rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--clr-primary); font-weight: 700;">[ PROJECT 0${idx + 1} ]</span>
            ${isPurpleLoop ? `
            <span id="purpleloop-live-status-dot" class="status-beacon-live" title="Live status fetched from visitor browser">
              <span class="beacon-dot beacon-checking"></span>
              <span id="purpleloop-live-status-text" class="beacon-label" style="font-size: 0.68rem; color: var(--clr-text-muted);">CHECKING LIVE STATUS...</span>
            </span>
            ` : `
            <span class="status-beacon pulsing" style="width: 7px; height: 7px; border-radius: 50%; background: var(--clr-success); display: inline-block;"></span>
            <span style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--clr-success); letter-spacing: 0.04em;">VERIFIED REPOSITORY</span>
            `}
            ${isPurpleLoop ? `<span id="purpleloop-gh-meta" style="display: none; font-size: 0.65rem; font-family: var(--font-mono); color: var(--clr-accent);"></span>` : ''}
            ${isNids ? `<span id="nids-gh-meta" style="display: none; font-size: 0.65rem; font-family: var(--font-mono); color: var(--clr-accent);"></span>` : ''}
          </div>
          <span class="tech-label text-accent" style="font-size: 0.62rem;">${p.category}</span>
        </div>

        <h3 style="font-size: 1.2rem; color: var(--clr-text-bright); font-family: var(--font-header); margin-bottom: 0.6rem;">
          ${p.title}
        </h3>

        <p style="font-size: 0.85rem; color: var(--clr-text-muted); line-height: 1.6; margin-bottom: 1rem;">
          ${p.summary}
        </p>

        <div style="margin-bottom: 1.25rem;">
          <h4 style="font-size: 0.72rem; color: var(--clr-text-bright); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
            Key Engineering Highlights:
          </h4>
          <ul style="list-style: square; margin-left: 1.25rem; font-size: 0.8rem; color: var(--clr-text-muted); display: flex; flex-direction: column; gap: 0.4rem; line-height: 1.5;">
            ${p.highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
        </div>

        <div style="border-top: 1px solid var(--clr-border); padding-top: 0.85rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
          <div class="tech-list" style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
            ${p.technologies.map(t => `<span class="tech-label" style="font-family: var(--font-mono); font-size: 0.62rem;">${t}</span>`).join('')}
          </div>
          <div style="display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap;">
            <a href="${p.github}" target="_blank" rel="noopener noreferrer" class="cyber-btn cyber-btn-outline" style="padding: 0.45rem 1rem; font-size: 0.72rem; text-decoration: none;">
              VIEW REPOSITORY ↗
            </a>
            ${p.liveUrl ? `
            <a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="cyber-btn cyber-btn-primary" style="padding: 0.45rem 1rem; font-size: 0.72rem; text-decoration: none;">
              LIVE PLATFORM ↗
            </a>
            ` : ''}
            ${isNids ? `
            <a href="#/sandbox" class="cyber-btn cyber-btn-primary" style="padding: 0.45rem 1rem; font-size: 0.72rem; text-decoration: none;">
              LIVE SIMULATION ↗
            </a>
            ` : ''}
          </div>
        </div>

        ${isPurpleLoop ? `
        <!-- PurpleLoop Live Simulation Model (Hero Project Demo) -->
        <div id="purpleloop-sim-mount"></div>
        ` : ''}

        ${isNids ? `
        <!-- Advanced-NIDS Live Packet-Stream Simulator & alerts.log Panel -->
        <div id="nids-sim-mount"></div>
        ` : ''}
      </div>
      `;
    }).join('');

    // 3. Professional Experience Timeline
    const experienceHTML = experience.map(exp => {
      return `
      <div class="timeline-item" style="position: relative; padding-left: 2rem; border-left: 2px solid var(--clr-border); margin-bottom: 2rem;">
        <span class="timeline-badge" style="position: absolute; left: -6px; top: 0; width: 10px; height: 10px; border-radius: 50%; background-color: var(--clr-primary); box-shadow: var(--clr-primary-glow);"></span>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
          <div>
            <h3 style="font-size: 1.05rem; color: var(--clr-primary); font-family: var(--font-header);">${exp.role}</h3>
            <span style="font-size: 0.82rem; color: var(--clr-text-bright);">${exp.organization}</span>
          </div>
          <div style="text-align: right;">
            <span class="tech-label" style="background-color: transparent; border: 1px solid var(--clr-border); font-size: 0.68rem;">${exp.period}</span>
            <span style="display: block; font-size: 0.62rem; color: var(--clr-success); margin-top: 0.2rem; font-family: var(--font-mono);">${exp.status}</span>
          </div>
        </div>
        <ul style="list-style: square; margin-left: 1.25rem; font-size: 0.82rem; color: var(--clr-text-muted); display: flex; flex-direction: column; gap: 0.45rem; line-height: 1.55;">
          ${exp.logs.map(log => `<li>${log}</li>`).join('')}
        </ul>
      </div>
      `;
    }).join('');

    // 4. Credentials & Verified Certifications
    const credentialsHTML = certifications.map(cred => {
      const isPdf = cred.fileType === 'pdf';
      const cleanId = cred.hash.replace(/^(Credential ID:\s*|Certified:\s*|Credential:\s*)/i, '');
      return `
      <div class="cert-card spotlight">
        <div>
          <div class="cert-badge-row">
            <span class="cert-code">${cred.code}</span>
            <span class="cert-verified-pill">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              ${cred.status}
            </span>
          </div>
          <h4 class="cert-title">${cred.name}</h4>
          <div class="cert-issuer">
            <span>ISSUER:</span> <strong style="color: var(--clr-text-bright);">${cred.issuer}</strong>
            <span style="opacity: 0.4;">//</span>
            <span>${cred.date}</span>
          </div>
          <p class="cert-desc">${cred.description}</p>
        </div>
        <div>
          <div class="cert-meta-row">
            <span class="cert-meta-label">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              CREDENTIAL ID:
            </span>
            <span class="cert-meta-val">${cleanId}</span>
          </div>
          <div class="cert-actions">
            <a href="${cred.fileUrl}" target="_blank" rel="noopener noreferrer" class="cert-btn-primary" title="Open official ${cred.name}">
              VIEW ${isPdf ? 'PDF' : 'IMAGE'} ↗
            </a>
            <button class="cert-btn-secondary" data-cert-modal="${cred.fileUrl}" data-cert-title="${cred.name}" data-cert-type="${cred.fileType}" title="Quick Preview document">
              PREVIEW
            </button>
          </div>
        </div>
      </div>
      `;
    }).join('');

    const proofsList = Object.values(proofDocuments || {});
    const proofDocumentsHTML = proofsList.map(proof => {
      const isPdf = proof.fileType === 'pdf';
      return `
      <a href="${proof.fileUrl}" target="_blank" rel="noopener noreferrer" class="proof-item">
        <div>
          <div class="proof-title">${proof.title}</div>
          <div class="proof-issuer">${proof.issuer}</div>
        </div>
        <span class="tech-label text-accent" style="font-size: 0.6rem; padding: 0.2rem 0.5rem; text-decoration: none;">
          ${isPdf ? 'VIEW PDF ↗' : 'VIEW IMAGE ↗'}
        </span>
      </a>
      `;
    }).join('');

    const achievementsHTML = achievements.map(ach => {
      return `
      <div class="award-card spotlight">
        <div class="award-header">
          <span class="award-date">${ach.date}</span>
          <span class="award-badge">HONOR</span>
        </div>
        <h4 class="award-title">${ach.title}</h4>
        <p class="award-desc">${ach.description}</p>
        <span class="award-org">@ ${ach.organization}</span>
      </div>
      `;
    }).join('');

    // Master Professional Template
    const rawTemplate = `
    <!-- Hero Section (Executive Cyber Architecture) -->
    <section class="hero-section" id="hero-section">
      <canvas id="hero-canvas"></canvas>
      
      <div class="hero-content">
        <!-- Professional Availability Badge -->
        <div class="hero-uplink-pill">
          <span class="status-beacon"></span>
          <span class="uplink-tag">OPEN TO OPPORTUNITIES</span>
          <span class="uplink-status">GLA UNIVERSITY • CYBERCELL HQ LUCKNOW</span>
        </div>

        <!-- Name -->
        <h1 class="hero-name">ANUPAM GUPTA</h1>

        <!-- Executive Subtitle -->
        <div class="hero-role-bracket">
          Cybersecurity • Web Application Penetration Testing • Purple Teaming • Vulnerability Assessment
        </div>

        <!-- Dynamic Typing Line -->
        <div class="hero-typed" id="hero-typed-text"></div>

        <!-- Professional Value Proposition -->
        <p class="hero-bio">
          B.Tech Computer Science (Cybersecurity) student at GLA University specializing in web application penetration testing, vulnerability assessment, and digital forensics. Former WAPT intern at CyberCell Headquarters, Uttar Pradesh Police, testing live government web applications against the OWASP Top 10. Builds security tooling, including PurpleLoop (purple teaming and detection engineering in Java & Spring Boot) and a C-based network intrusion detection system.
        </p>

        <!-- Executive Action CTAs -->
        <div class="hero-cta">
          <a href="#contact-section" class="cyber-btn cyber-btn-primary scroll-link">
            <span>LET'S CONNECT</span>
          </a>
          <a href="#projects-section" class="cyber-btn cyber-btn-outline scroll-link">
            <span>VIEW PROJECTS</span>
          </a>
          <a href="#/sandbox" class="cyber-btn cyber-btn-outline">
            <span>INTERACTIVE LABS ↗</span>
          </a>
          <button id="hero-download-dossier" class="cyber-btn cyber-btn-outline">
            <span>DOWNLOAD RESUME (PDF)</span>
          </button>
        </div>

        <!-- Technical Environment Terminal Window -->
        <div class="hero-terminal-deck">
          <div class="terminal-dots">
            <span class="dot dot-red"></span>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
            <span class="terminal-title">anupam@portfolio:~$ (Quick Technical Snapshot)</span>
          </div>
          <div class="terminal-body">
            <div style="margin-bottom: 0.35rem;">
              <span class="term-prompt">anupam@dev:~$</span> <span class="term-cmd">whoami</span>
            </div>
            <span class="term-output">> Anupam Gupta — Cybersecurity & Purple Teaming @ GLA University ('28 Expected)</span>
            
            <div style="margin-bottom: 0.35rem;">
              <span class="term-prompt">anupam@dev:~$</span> <span class="term-cmd">cat focus-areas.txt</span>
            </div>
            <span class="term-output" style="color: var(--clr-success);">> WAPT (OWASP Top 10) • Purple Teaming (PurpleLoop) • Core: Java (1st), Python, C • Splunk SIEM</span>
            
            <div>
              <span class="term-prompt">anupam@dev:~$</span> <span class="term-cmd">check-status --availability</span>
            </div>
            <span class="term-output" style="color: var(--clr-primary);">> [ACTIVE] Open to cybersecurity internships & opportunities</span>
          </div>
        </div>

      </div>
    </section>

    <!-- SECTION 1: CORE TECHNICAL COMPETENCIES -->
    <section id="skills-section" style="margin-bottom: 4rem;">
      <div style="text-align: center; margin-bottom: 2rem;">
        <h2 style="font-size: 1.8rem; color: var(--clr-primary); font-family: var(--font-header); letter-spacing: 0.05em; margin-bottom: 0.5rem;">
          <DecryptText target="AREAS OF EXPERTISE"></DecryptText>
        </h2>
        <p style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--clr-text-muted); max-width: 680px; margin: 0 auto;">
          Practical offensive security methodologies, secure architecture in Java, Python scripting, and low-level C network systems.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
        ${competenciesHTML}
      </div>
    </section>

    <!-- SECTION 2: FEATURED PROJECTS & RESEARCH -->
    <section id="projects-section" style="margin-bottom: 4rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid var(--clr-border); padding-bottom: 1rem; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 style="font-size: 1.8rem; color: var(--clr-primary); font-family: var(--font-header); letter-spacing: 0.05em; margin-bottom: 0.3rem;">
            <DecryptText target="FEATURED PROJECTS & SYSTEMS"></DecryptText>
          </h2>
          <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--clr-text-muted);">
            AUTHENTIC OPEN-SOURCE REPOSITORIES & SYSTEMS IMPLEMENTATIONS
          </span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
          <div id="gh-live-stats-bar" style="display: none; font-family: var(--font-mono); font-size: 0.72rem; color: var(--clr-text-bright); background: rgba(124, 124, 244, 0.06); border: 1px solid var(--clr-border); padding: 0.4rem 0.8rem; border-radius: 3px; align-items: center; gap: 0.6rem;"></div>
          <a href="https://github.com/AnupamGupta-Pro00Nation" target="_blank" rel="noopener noreferrer" class="cyber-btn cyber-btn-outline" style="padding: 0.45rem 1rem; font-size: 0.72rem; text-decoration: none;">
            GITHUB PROFILE ↗
          </a>
        </div>
      </div>

      <div>
        ${projectsHTML}
      </div>
    </section>

    <!-- SECTION 3: INTERACTIVE LAB SANDBOX -->
    <section id="sandbox-bridge" style="margin-bottom: 4rem;">
      <div class="bracket-card" style="background: radial-gradient(circle at 80% 50%, rgba(var(--clr-primary-rgb), 0.08) 0%, rgba(8, 12, 20, 0.95) 70%); border: 1.5px solid var(--clr-primary); box-shadow: var(--cyber-glow); padding: 2.5rem 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;">
          <div style="max-width: 720px;">
            <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.75rem;">
              <span class="status-beacon pulsing" style="width: 8px; height: 8px; border-radius: 50%; background: var(--clr-success); display: inline-block;"></span>
              <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--clr-success); font-weight: 700;">INTERACTIVE SECURITY SANDBOX ONLINE</span>
            </div>
            <h3 style="font-size: 1.45rem; color: var(--clr-text-bright); font-family: var(--font-header); margin-bottom: 0.75rem;">
              TEST LIVE PACKET INJECTION, SHANNON ENTROPY & CIPHERS
            </h3>
            <p style="font-size: 0.85rem; color: var(--clr-text-muted); line-height: 1.6;">
              Test the in-browser emulation of Anupam's pure C <strong>Advanced-NIDS packet injection engine</strong>, evaluate mathematical Shannon entropy for passphrase resistance, perform simulated port sweeps, and encode/decode real-time ciphers.
            </p>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <a href="#/sandbox" class="cyber-btn cyber-btn-primary" style="font-size: 0.85rem; text-decoration: none; padding: 1rem 1.8rem;">
              OPEN SECURITY SANDBOX ↗
            </a>
            <a href="#/terminal" class="cyber-btn cyber-btn-outline" style="font-size: 0.75rem; text-decoration: none; text-align: center;">
              OPEN TERMINAL CONSOLE
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 4: PROFESSIONAL EXPERIENCE TIMELINE -->
    <section id="experience-section" style="margin-bottom: 4rem;">
      <div style="border-bottom: 1px solid var(--clr-border); padding-bottom: 1rem; margin-bottom: 2rem;">
        <h2 style="font-size: 1.8rem; color: var(--clr-primary); font-family: var(--font-header); letter-spacing: 0.05em; margin-bottom: 0.3rem;">
          <DecryptText target="PROFESSIONAL EXPERIENCE & INTERNSHIPS"></DecryptText>
        </h2>
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--clr-text-muted);">
          HANDS-ON PENETRATION TESTING ENGAGEMENTS, SECURITY OPERATIONS & TECHNICAL LEADERSHIP
        </span>
      </div>

      <div style="max-width: 900px;">
        ${experienceHTML}
      </div>
    </section>

    <!-- SECTION 5: CERTIFICATIONS & OFFICIAL PROOFS -->
    <section id="certifications-section" style="margin-bottom: 4rem;">
      <div style="border-bottom: 1px solid var(--clr-border); padding-bottom: 1rem; margin-bottom: 2.25rem;">
        <h2 style="font-size: 1.8rem; color: var(--clr-primary); font-family: var(--font-header); letter-spacing: 0.05em; margin-bottom: 0.35rem;">
          <DecryptText target="CERTIFICATIONS & MERIT RECOGNITION"></DecryptText>
        </h2>
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--clr-text-muted); letter-spacing: 0.04em;">
          INDUSTRY VENDOR CREDENTIALS, ACADEMIC RECORD & MERIT RECOGNITION
        </span>
      </div>

      <div class="credentials-deck-grid">
        <!-- Left: Vendor Certifications -->
        <div>
          <h3 style="font-size: 1.1rem; color: var(--clr-primary); font-family: var(--font-header); margin-bottom: 0.85rem; display: flex; align-items: center; gap: 0.5rem; letter-spacing: 0.04em;">
            <span style="width: 4px; height: 18px; background: var(--clr-primary); display: inline-block;"></span>
            INDUSTRY CERTIFICATIONS
          </h3>
          <div style="margin-bottom: 1.25rem; background: rgba(0, 255, 102, 0.04); border: 1px solid var(--clr-border); padding: 0.6rem 0.85rem; border-radius: 4px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
            <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--clr-text-muted);">
              <span class="status-beacon pulsing" style="width: 6px; height: 6px; border-radius: 50%; background: var(--clr-success); display: inline-block; margin-right: 0.4rem;"></span>
              DIGITALLY VERIFIED CREDENTIALS
            </div>
            <a href="https://credly.com/users/anupam-gupta.8e0a3913" target="_blank" rel="noopener noreferrer" style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--clr-primary); text-decoration: underline;">
              VERIFY ON CREDLY ↗
            </a>
          </div>
          <div>
            ${credentialsHTML}
          </div>
        </div>

        <!-- Right: Awards & Official Proofs -->
        <div>
          <h3 style="font-size: 1.1rem; color: var(--clr-accent); font-family: var(--font-header); margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem; letter-spacing: 0.04em;">
            <span style="width: 4px; height: 18px; background: var(--clr-accent); display: inline-block;"></span>
            AWARDS & HONORS
          </h3>
          <div style="margin-bottom: 2.25rem;">
            ${achievementsHTML}
          </div>

          <h3 style="font-size: 1.1rem; color: var(--clr-success); font-family: var(--font-header); margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem; letter-spacing: 0.04em;">
            <span style="width: 4px; height: 18px; background: var(--clr-success); display: inline-block;"></span>
            VERIFIED PROOF DOCUMENTS
          </h3>
          <div style="display: flex; flex-direction: column; gap: 0.65rem;">
            ${proofDocumentsHTML}
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 6: CONTACT & COLLABORATION -->
    <section id="contact-section" style="margin-bottom: 4rem;">
      <div style="text-align: center; margin-bottom: 2.5rem;">
        <h2 style="font-size: 2rem; color: var(--clr-primary); font-family: var(--font-header); letter-spacing: 0.05em; margin-bottom: 0.5rem;">
          <DecryptText target="LET'S CONNECT & COLLABORATE"></DecryptText>
        </h2>
        <p style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--clr-text-muted); max-width: 650px; margin: 0 auto;">
          I am actively exploring cybersecurity internships, penetration testing opportunities, and security collaborations. Reach out directly or leave a message below.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; max-width: 1050px; margin: 0 auto;">
        
        <!-- Left Column: Direct Channels with 1-Click Copy -->
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          
          <!-- Email Card -->
          <div class="bracket-card copy-trigger" data-copy="guptaanupam552@gmail.com" style="cursor: pointer;" title="Click to copy email address">
            <div style="font-size: 0.65rem; color: var(--clr-primary); font-family: var(--font-mono); margin-bottom: 0.35rem; display: flex; justify-content: space-between;">
              <span>PRIMARY EMAIL ADDRESS</span>
              <span class="tech-label text-accent" style="font-size: 0.55rem;">CLICK TO COPY</span>
            </div>
            <div style="font-size: 1rem; color: var(--clr-text-bright); font-family: var(--font-mono); font-weight: 700;">
              guptaanupam552@gmail.com
            </div>
            <span style="font-size: 0.65rem; color: var(--clr-text-muted); display: block; margin-top: 0.3rem;">Direct inbox for career opportunities and professional inquiries</span>
          </div>

          <!-- Phone Card -->
          <div class="bracket-card copy-trigger" data-copy="+918381982462" style="cursor: pointer;" title="Click to copy phone number">
            <div style="font-size: 0.65rem; color: var(--clr-success); font-family: var(--font-mono); margin-bottom: 0.35rem; display: flex; justify-content: space-between;">
              <span>DIRECT PHONE & WHATSAPP</span>
              <span class="tech-label text-success" style="font-size: 0.55rem;">CLICK TO COPY</span>
            </div>
            <div style="font-size: 1rem; color: var(--clr-text-bright); font-family: var(--font-mono); font-weight: 700;">
              +91 8381982462
            </div>
            <span style="font-size: 0.65rem; color: var(--clr-text-muted); display: block; margin-top: 0.3rem;">Direct cellular voice call & WhatsApp messaging</span>
          </div>

          <!-- Location & Base -->
          <div class="bracket-card">
            <div style="font-size: 0.65rem; color: var(--clr-accent); font-family: var(--font-mono); margin-bottom: 0.35rem; display: flex; justify-content: space-between;">
              <span>CURRENT LOCATION</span>
              <span class="tech-label text-accent" style="font-size: 0.55rem;">INDIA (IST)</span>
            </div>
            <div style="font-size: 1rem; color: var(--clr-text-bright); font-family: var(--font-mono); font-weight: 700;">
              Jhansi / Mathura, UP, India
            </div>
            <span style="font-size: 0.65rem; color: var(--clr-text-muted); display: block; margin-top: 0.3rem;">Available for remote contracts & open to relocation</span>
          </div>

          <!-- External Networks -->
          <div style="display: flex; gap: 1rem;">
            <a href="https://www.linkedin.com/in/anupam-gupta-9294a234a/" target="_blank" rel="noopener noreferrer" class="bracket-card" style="flex: 1; text-decoration: none; text-align: center; padding: 0.85rem;">
              <span style="font-size: 0.65rem; color: var(--clr-text-muted); display: block; margin-bottom: 0.2rem;">PROFESSIONAL NETWORK</span>
              <span style="font-family: var(--font-header); font-size: 0.85rem; color: var(--clr-primary);">LINKEDIN ↗</span>
            </a>
            <a href="https://github.com/AnupamGupta-Pro00Nation" target="_blank" rel="noopener noreferrer" class="bracket-card" style="flex: 1; text-decoration: none; text-align: center; padding: 0.85rem;">
              <span style="font-size: 0.65rem; color: var(--clr-text-muted); display: block; margin-bottom: 0.2rem;">OPEN-SOURCE REPOSITORIES</span>
              <span style="font-family: var(--font-header); font-size: 0.85rem; color: var(--clr-primary);">GITHUB ↗</span>
            </a>
          </div>

        </div>

        <!-- Right Column: Professional Contact Form -->
        <div class="bracket-card" style="border-top: 2px solid var(--clr-primary);">
          <div style="border-bottom: 1px solid var(--clr-border); padding-bottom: 0.75rem; margin-bottom: 1.25rem;">
            <h3 style="font-size: 1.05rem; color: var(--clr-primary); font-family: var(--font-header);">
              SEND A DIRECT MESSAGE
            </h3>
            <span style="font-size: 0.68rem; color: var(--clr-text-muted); font-family: var(--font-mono);">Responses typically sent within 24 hours</span>
          </div>

          <form id="secure-contact-form" style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
              <label style="font-size: 0.68rem; color: var(--clr-text-muted); font-family: var(--font-mono); display: block; margin-bottom: 0.3rem;">
                YOUR FULL NAME
              </label>
              <input type="text" id="contact-name" required placeholder="e.g. John Doe / Technical Recruiter" style="width: 100%; background: rgba(6, 9, 14, 0.9); border: 1px solid var(--clr-border); color: var(--clr-text-bright); font-family: var(--font-mono); padding: 0.65rem; font-size: 0.8rem; border-radius: 2px; outline: none;" />
            </div>

            <div>
              <label style="font-size: 0.68rem; color: var(--clr-text-muted); font-family: var(--font-mono); display: block; margin-bottom: 0.3rem;">
                YOUR EMAIL ADDRESS
              </label>
              <input type="email" id="contact-email" required placeholder="name@company.com" style="width: 100%; background: rgba(6, 9, 14, 0.9); border: 1px solid var(--clr-border); color: var(--clr-text-bright); font-family: var(--font-mono); padding: 0.65rem; font-size: 0.8rem; border-radius: 2px; outline: none;" />
            </div>

            <div>
              <label style="font-size: 0.68rem; color: var(--clr-text-muted); font-family: var(--font-mono); display: block; margin-bottom: 0.3rem;">
                MESSAGE / OPPORTUNITY DETAILS
              </label>
              <textarea id="contact-message" required rows="4" placeholder="Brief outline of the role, project, or pentesting scope..." style="width: 100%; background: rgba(6, 9, 14, 0.9); border: 1px solid var(--clr-border); color: var(--clr-text-bright); font-family: var(--font-mono); padding: 0.65rem; font-size: 0.8rem; border-radius: 2px; outline: none; resize: vertical;"></textarea>
            </div>

            <button type="submit" id="contact-submit-btn" class="cyber-btn cyber-btn-primary" style="width: 100%; padding: 0.95rem; font-size: 0.85rem; letter-spacing: 0.05em;">
              <span>SEND MESSAGE →</span>
            </button>
            <div style="font-size: 0.68rem; color: var(--clr-text-muted); font-family: var(--font-mono); text-align: center; margin-top: 0.65rem; display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
              <span class="status-beacon" style="width: 5px; height: 5px; border-radius: 50%; background: var(--clr-success); display: inline-block;"></span>
              <span>Direct delivery to <a href="mailto:guptaanupam552@gmail.com" style="color: var(--clr-primary); text-decoration: underline;">guptaanupam552@gmail.com</a></span>
            </div>
          </form>
        </div>

      </div>
    </section>

    <!-- SECTION 7: FOOTER -->
    <footer style="border-top: 1px solid var(--clr-border); padding: 2.5rem 0 1rem 0; margin-top: 4rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
      <div>
        <div style="font-family: var(--font-header); font-size: 1rem; color: var(--clr-primary); font-weight: 700; margin-bottom: 0.3rem;">
          ANUPAM GUPTA // CYBERSECURITY & SYSTEMS
        </div>
        <p style="font-size: 0.75rem; color: var(--clr-text-muted); font-family: var(--font-mono);">
          © 2026 Anupam Gupta. Handcrafted with vanilla JavaScript, modern CSS & Web Audio API.
        </p>
      </div>

      <div style="display: flex; align-items: center; gap: 1rem;">
        <div style="font-size: 0.7rem; font-family: var(--font-mono); color: var(--clr-success); display: flex; align-items: center; gap: 0.4rem;">
          <span class="status-beacon" style="width: 6px; height: 6px; border-radius: 50%; background: var(--clr-success); display: inline-block;"></span>
          <span>OPEN FOR HIRE • GLA UNIVERSITY</span>
        </div>
        <button id="footer-top-btn" class="cyber-btn cyber-btn-outline" style="padding: 0.35rem 0.75rem; font-size: 0.68rem;">
          TOP ↑
        </button>
      </div>
    </footer>

    <!-- Document Preview Modal -->
    <div class="cert-modal-backdrop" id="cert-preview-modal" aria-hidden="true">
      <div class="cert-modal-window">
        <div class="cert-modal-header">
          <div class="cert-modal-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span id="cert-modal-title-text">VERIFIED CREDENTIAL DOCUMENT</span>
          </div>
          <button class="cert-modal-close" id="cert-modal-close-btn" title="Close Preview">&times;</button>
        </div>
        <div class="cert-modal-body" id="cert-modal-body-container"></div>
        <div class="cert-modal-footer">
          <span id="cert-modal-status">AUTHENTICITY VERIFIED // OFFICIAL CREDENTIAL PROOF</span>
          <a href="#" target="_blank" rel="noopener noreferrer" id="cert-modal-external-link" class="cert-btn-primary" style="flex: 0 0 auto; padding: 0.4rem 0.9rem;">
            OPEN FULL DOCUMENT ↗
          </a>
        </div>
      </div>
    </div>
    `;

    // Compile template using MDX
    this.container.innerHTML = MDXCompiler.compile(rawTemplate);

    // Initialize Particle Canvas on Hero Section (Antigravity Physics)
    this.particles = new ParticleSystem('hero-canvas');

    // Initialize Typing Animation with authentic titles
    const typedTextEl = this.container.querySelector('#hero-typed-text');
    if (typedTextEl) {
      const phrases = [
        "PURPLELOOP: PURPLE TEAMING & DETECTION ENGINEERING",
        "WEB APPLICATION PENETRATION TESTING (OWASP TOP 10)",
        "TOP 3% GLOBALLY ON TRYHACKME",
        "PURE C & LIBPCAP NETWORK INTRUSION DETECTION",
        "EX-WAPT & CTF INTERN @ CYBERCELL HQ LUCKNOW",
        "CORE LANGUAGES: JAVA (1ST PREFERENCE) • PYTHON • C",
        "ACTIVELY INTERVIEWING FOR CYBERSECURITY ROLES"
      ];
      let phraseIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
      
      const type = () => {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
          typedTextEl.textContent = currentPhrase.substring(0, charIndex - 1) + "_";
          charIndex--;
        } else {
          typedTextEl.textContent = currentPhrase.substring(0, charIndex + 1) + "_";
          charIndex++;
        }

        let speed = isDeleting ? 25 : 60;

        if (!isDeleting && charIndex === currentPhrase.length) {
          speed = 2200;
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          speed = 350;
        }

        setTimeout(type, speed);
      };
      
      type();
    }

    // Bind Certificate Quick View modal
    const modal = this.container.querySelector('#cert-preview-modal');
    const modalTitle = this.container.querySelector('#cert-modal-title-text');
    const modalBody = this.container.querySelector('#cert-modal-body-container');
    const modalExternalLink = this.container.querySelector('#cert-modal-external-link');
    const modalCloseBtn = this.container.querySelector('#cert-modal-close-btn');

    if (modal) {
      const openModal = (url, title, type) => {
        modalTitle.textContent = title || "VERIFIED CREDENTIAL";
        modalExternalLink.href = url;
        if (type === 'image') {
          modalBody.innerHTML = `<img src="${url}" alt="${title}" style="max-height: 100%; max-width: 100%; object-fit: contain; padding: 1.5rem;" />`;
        } else {
          modalBody.innerHTML = `<iframe src="${url}#toolbar=1" type="application/pdf" style="width: 100%; height: 100%; border: none;"></iframe>`;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        playSound('click');
      };

      const closeModal = () => {
        modal.classList.remove('active');
        modalBody.innerHTML = '';
        document.body.style.overflow = '';
      };

      this.container.querySelectorAll('[data-cert-modal]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const url = btn.getAttribute('data-cert-modal');
          const title = btn.getAttribute('data-cert-title');
          const type = btn.getAttribute('data-cert-type');
          openModal(url, title, type);
        });
      });

      if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
      });
    }

    // 1-Click Clipboard Copy bindings with Toast feedback
    this.container.querySelectorAll('.copy-trigger').forEach(card => {
      card.addEventListener('click', () => {
        const textToCopy = card.getAttribute('data-copy');
        if (textToCopy) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            toast.show(`Copied to clipboard: ${textToCopy}`, 'copy');
          }).catch(() => {
            toast.show(`Failed to copy to clipboard`, 'alert');
          });
        }
      });
    });

    // Resume Download button
    const dossierBtn = this.container.querySelector('#hero-download-dossier');
    if (dossierBtn) {
      dossierBtn.addEventListener('click', () => {
        toast.show("Opening Anupam Gupta's Official Resume (PDF)...", "success");
        window.open('./assets/Anupam_Gupta_Resume.pdf', '_blank');
      });
    }

    // Top button
    const topBtn = this.container.querySelector('#footer-top-btn');
    if (topBtn) {
      topBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        playSound('click');
      });
    }

    // Re-bind click handlers, sound triggers, and scrolls
    CyberButton.bindAll();
    ScanCard.bindAll();
    DecryptText.bindAll();
    useIntersection.observeAll('.decrypt-trigger-text');

    // Handle Contact Form Submission with Real Email Dispatch via FormSubmit.co
    const form = this.container.querySelector('#secure-contact-form');
    const submitBtn = this.container.querySelector('#contact-submit-btn');

    if (form && submitBtn) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInput = form.querySelector('#contact-name');
        const emailInput = form.querySelector('#contact-email');
        const msgInput = form.querySelector('#contact-message');

        const name = (nameInput ? nameInput.value : '').trim();
        const email = (emailInput ? emailInput.value : '').trim();
        const message = (msgInput ? msgInput.value : '').trim();

        if (!name || !email || !message) {
          toast.show("Please fill in all contact fields.", "alert");
          return;
        }

        // Set UI loading state
        submitBtn.disabled = true;
        const origBtnHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>DISPATCHING MESSAGE...</span>`;
        playSound('click');

        try {
          const res = await fetch('https://formsubmit.co/ajax/guptaanupam552@gmail.com', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              name: name,
              email: email,
              message: message,
              _subject: `New Portfolio Inquiry from ${name} (${email})`,
              _template: 'table',
              _captcha: 'false'
            })
          });

          const data = await res.json();

          if (res.ok && (data.success === 'true' || data.success === true)) {
            toast.show(`Message delivered! Sent to guptaanupam552@gmail.com`, 'success');
            playSound('success');
            form.reset();

            // Log to telemetry store
            store.addLog(`EMAIL_DISPATCH: Inbound message from ${name} <${email}> delivered`, 'success');
          } else {
            // Check if FormSubmit sent an initial confirmation email
            const isActivation = data.message && data.message.toLowerCase().includes('activate');
            if (isActivation) {
              toast.show(`Activation link sent to guptaanupam552@gmail.com. Please confirm it in your inbox!`, 'warning');
            } else {
              toast.show(data.message || `Message dispatched to guptaanupam552@gmail.com`, 'success');
            }
            form.reset();
          }
        } catch (err) {
          console.error("FormSubmit error:", err);
          toast.show("Online dispatch unavailable. Launching your email client...", "warning");
          // Instant mailto fallback so no message is ever lost
          const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
          const body = encodeURIComponent(`Hi Anupam,\n\n${message}\n\n--\nFrom: ${name}\nEmail: ${email}`);
          window.location.href = `mailto:guptaanupam552@gmail.com?subject=${subject}&body=${body}`;
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origBtnHTML;
        }
      });
    }

    // 1. Mount PurpleLoop Simulation (Hero Project Demo)
    const plMount = this.container.querySelector('#purpleloop-sim-mount');
    if (plMount) {
      this.purpleLoopSim = new PurpleLoopSim(plMount);
    }

    // 2. Mount Advanced-NIDS Live Packet-Stream Simulator & alerts.log Panel
    const nidsMount = this.container.querySelector('#nids-sim-mount');
    if (nidsMount) {
      this.nidsPacketSim = new NidsPacketSim(nidsMount);
    }

    // 3. Probe Live Project Status for PurpleLoop (Never fake online: green = reachable, grey = unverified)
    checkPurpleLoopStatus().then(status => {
      const dot = this.container.querySelector('#purpleloop-live-status-dot .beacon-dot');
      const text = this.container.querySelector('#purpleloop-live-status-text');
      if (!dot || !text) return;
      if (status.appReachable || status.apiReachable) {
        dot.className = 'beacon-dot beacon-online';
        text.textContent = 'APP: LIVE // API: REACHABLE';
        text.style.color = 'var(--clr-success)';
      } else {
        dot.className = 'beacon-dot beacon-unverified';
        text.textContent = 'STATUS: UNVERIFIED';
        text.style.color = 'var(--clr-text-muted)';
      }
    }).catch(() => {
      const dot = this.container.querySelector('#purpleloop-live-status-dot .beacon-dot');
      const text = this.container.querySelector('#purpleloop-live-status-text');
      if (dot && text) {
        dot.className = 'beacon-dot beacon-unverified';
        text.textContent = 'STATUS: UNVERIFIED';
        text.style.color = 'var(--clr-text-muted)';
      }
    });

    // 4. Fetch GitHub Live Stats with Session Caching (Fail Silently if API blocked/offline)
    getGitHubLiveStats('AnupamGupta-Pro00Nation').then(stats => {
      if (!stats) return; // Silent fallback, no errors or zeros shown
      const ghBar = this.container.querySelector('#gh-live-stats-bar');
      if (ghBar) {
        ghBar.style.display = 'inline-flex';
        ghBar.innerHTML = `
          <span style="color: var(--clr-primary); font-weight: 700;">GITHUB TELEMETRY:</span>
          <span>REPOS: <strong style="color: var(--clr-text-bright);" data-count="${stats.publicRepos}">${stats.publicRepos}</strong></span>
          <span style="opacity: 0.4;">•</span>
          <span>FOLLOWERS: <strong style="color: var(--clr-text-bright);" data-count="${stats.followers}">${stats.followers}</strong></span>
        `;
      }
      if (stats.projects) {
        const plMeta = this.container.querySelector('#purpleloop-gh-meta');
        if (plMeta && stats.projects['purpleloop']) {
          plMeta.style.display = 'inline-block';
          plMeta.textContent = `[⭐ ${stats.projects['purpleloop'].stars} • ${stats.projects['purpleloop'].language}]`;
        }
        const nidsMeta = this.container.querySelector('#nids-gh-meta');
        if (nidsMeta && stats.projects['advanced-nids']) {
          nidsMeta.style.display = 'inline-block';
          nidsMeta.textContent = `[⭐ ${stats.projects['advanced-nids'].stars} • ${stats.projects['advanced-nids'].language}]`;
        }
      }
    }).catch(() => {
      // Fail silently
    });
  }

  destroy() {
    if (this.particles && typeof this.particles.destroy === 'function') {
      this.particles.destroy();
      this.particles = null;
    }
    if (this.purpleLoopSim && typeof this.purpleLoopSim.destroy === 'function') {
      this.purpleLoopSim.destroy();
      this.purpleLoopSim = null;
    }
    if (this.nidsPacketSim && typeof this.nidsPacketSim.destroy === 'function') {
      this.nidsPacketSim.destroy();
      this.nidsPacketSim = null;
    }
  }
}
