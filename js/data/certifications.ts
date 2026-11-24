export interface Certification {
  code: string;
  name: string;
  issuer: string;
  status: string;
  hash: string;
  date: string;
  fileUrl: string;
  fileType: "pdf" | "image";
  credlyUrl?: string;
  description: string;
}

export interface ProofDocument {
  title: string;
  issuer: string;
  fileUrl: string;
  fileType: "pdf" | "image";
}

export const credlyProfile = {
  url: "https://www.credly.com/users/anupam-gupta.8e0a3913",
  label: "credly.com/users/anupam-gupta.8e0a3913"
};

export const certifications: Certification[] = [
  {
    code: "FORTINET-FCF",
    name: "Fortinet Certified Fundamentals in Cybersecurity (NSE 1 & 2)",
    issuer: "Fortinet",
    status: "VERIFIED",
    hash: "Credential ID: 0441032629AG",
    date: "2026",
    fileUrl: "./assets/certificates/fortinet-fcf.pdf",
    fileType: "pdf",
    credlyUrl: "https://www.credly.com/users/anupam-gupta.8e0a3913",
    description: "Validates core threat landscape awareness, network security architecture, and SOC defense operations (NSE 1 & 2 exam series)."
  },
  {
    code: "LINUX-FOUNDATION-LFC108",
    name: "Cybersecurity Essentials (LFC108)",
    issuer: "The Linux Foundation",
    status: "VERIFIED",
    hash: "Credential ID: LF-LFC108-CYBER",
    date: "2025",
    fileUrl: "./assets/certificates/fortinet-fcf.pdf",
    fileType: "pdf",
    credlyUrl: "https://www.credly.com/users/anupam-gupta.8e0a3913",
    description: "Enterprise cybersecurity credentials from The Linux Foundation covering threat landscapes, defense-in-depth, Linux system hardening, and security operations."
  },
  {
    code: "PAN-SOF",
    name: "Security Operations Fundamentals",
    issuer: "Palo Alto Networks Academy",
    status: "VERIFIED",
    hash: "Credential ID: PAN-SOF-ACADEMY",
    date: "2025",
    fileUrl: "./assets/certificates/palo-alto-sof.pdf",
    fileType: "pdf",
    credlyUrl: "https://www.credly.com/users/anupam-gupta.8e0a3913",
    description: "Demonstrates operational mastery of Security Operations Center (SOC) workflows, automated threat triage, and incident response lifecycles."
  },
  {
    code: "EC-COUNCIL-SQLI",
    name: "SQL Injection Attacks",
    issuer: "CodeRed (EC-Council)",
    status: "VERIFIED",
    hash: "Certified: SQLi-Attacks-Certified",
    date: "2026",
    fileUrl: "./assets/certificates/ec-council-sqli.png",
    fileType: "image",
    credlyUrl: "https://www.credly.com/users/anupam-gupta.8e0a3913",
    description: "Advanced hands-on validation covering union-based, error-based, and boolean blind SQL injection attack vectors and secure remediation."
  },
  {
    code: "CISCO-NET-BASICS",
    name: "Networking Basics",
    issuer: "Cisco Networking Academy",
    status: "VERIFIED",
    hash: "Credential ID: CISCO-NET-2025",
    date: "2025",
    fileUrl: "https://www.credly.com/users/anupam-gupta.8e0a3913",
    fileType: "pdf",
    credlyUrl: "https://www.credly.com/users/anupam-gupta.8e0a3913",
    description: "Foundational mastery of network architectures, OSI and TCP/IP protocol stacks, IPv4/IPv6 subnetting, packet routing, and network diagnostics."
  }
];

export const proofDocuments: Record<string, ProofDocument> = {
  shadowFoxInternship: {
    title: "ShadowFox Cybersecurity Internship Certificate",
    issuer: "ShadowFox",
    fileUrl: "./assets/certificates/shadow-fox-internship.pdf",
    fileType: "pdf"
  },
  pentestShowdown: {
    title: "Pentest Showdown (Top 20 Merit Award)",
    issuer: "GLA University",
    fileUrl: "./assets/certificates/pentest-showdown.pdf",
    fileType: "pdf"
  },
  payloadPartySpeaker: {
    title: "Payload Party Speaker Recognition (Digital Forensics)",
    issuer: "Cyberonites Club, GLA University",
    fileUrl: "./assets/certificates/drif-speaker.png",
    fileType: "image"
  }
};
