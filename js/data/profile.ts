export interface Profile {
  name: string;
  badge: string;
  title: string;
  currentRole: string;
  education: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  credly?: string;
  phone: string;
  bio: string[];
}

export const profile: Profile = {
  name: "Anupam Gupta",
  badge: "Cybersecurity Specialist & Detection Engineer",
  title: "Cybersecurity | Web Application Penetration Testing | Purple Teaming | Vulnerability Assessment",
  currentRole: "WAPT & CTF Developing Intern at CyberCell Headquarters, Lucknow",
  education: "B.Tech in Computer Science and Engineering (Cybersecurity), GLA University, Mathura (2024 – 2028 Expected)",
  location: "Jhansi / Mathura, Uttar Pradesh, India",
  email: "guptaanupam552@gmail.com",
  github: "https://github.com/AnupamGupta-Pro00Nation",
  linkedin: "https://www.linkedin.com/in/anupam-gupta-9294a234a/",
  credly: "https://www.credly.com/users/anupam-gupta.8e0a3913",
  phone: "+91 8381982462",
  bio: [
    "I am a Computer Science (Cybersecurity) undergraduate at GLA University with hands-on experience in web application penetration testing, vulnerability assessment, and digital forensics.",
    "During my engagement at CyberCell Headquarters, Lucknow (Uttar Pradesh Police), I tested live government web applications against the OWASP Top 10, identified and validated security flaws, and authored formal remediation disclosures for engineering teams.",
    "I engineer security tooling from scratch — from PurpleLoop (a full-stack purple teaming and detection engineering platform built with Java & Spring Boot) to Advanced-NIDS (a wire-speed multithreaded Network Intrusion Detection System in pure C with libpcap)."
  ]
};
