import sys

def escape_pdf(text):
    text = text.replace('\u2022', chr(149))  # WinAnsi bullet
    text = text.replace('\u2013', '-').replace('\u2014', '--')
    text = text.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
    return text

class PDFBuilder:
    def __init__(self):
        self.width = 595.28   # A4 width
        self.height = 841.89  # A4 height
        self.margin_x = 36.0
        self.cursor_y = self.height - 30.0
        self.commands = []

    def draw_line(self, x1, y1, x2, y2, width=0.5, r=0.1, g=0.1, b=0.1):
        self.commands.append(f"{r:.3f} {g:.3f} {b:.3f} RG {width:.2f} w {x1:.2f} {y1:.2f} m {x2:.2f} {y2:.2f} l S")

    def draw_text(self, text, x, y, font="F1", size=8.5, r=0.08, g=0.08, b=0.08):
        escaped = escape_pdf(text)
        self.commands.append(f"BT {r:.3f} {g:.3f} {b:.3f} rg /{font} {size} Tf {x:.2f} {y:.2f} Td ({escaped}) Tj ET")

    def draw_centered_text(self, text, y, font="F2", size=16, r=0.05, g=0.08, b=0.15):
        char_w = size * (0.54 if "F2" in font else 0.48)
        total_w = len(text) * char_w
        x = max(self.margin_x, (self.width - total_w) / 2.0)
        self.draw_text(text, x, y, font=font, size=size, r=r, g=g, b=b)

    def add_section_header(self, title):
        self.cursor_y -= 14
        self.draw_text(title.upper(), self.margin_x, self.cursor_y, font="F2", size=9.8, r=0.05, g=0.05, b=0.05)
        line_y = self.cursor_y - 2.5
        self.draw_line(self.margin_x, line_y, self.width - self.margin_x, line_y, width=0.75, r=0.2, g=0.2, b=0.2)
        self.cursor_y -= 11

    def add_bullet(self, text, indent=12, max_chars=105, size=8.3, line_spacing=10.6):
        words = text.split(' ')
        lines = []
        curr = ""
        for w in words:
            if len(curr) + len(w) + 1 <= max_chars:
                curr = (curr + " " + w).strip()
            else:
                lines.append(curr)
                curr = w
        if curr:
            lines.append(curr)

        for i, line in enumerate(lines):
            prefix = chr(149) + "  " if i == 0 else "   "
            self.draw_text(prefix + line, self.margin_x + indent, self.cursor_y, font="F1", size=size, r=0.12, g=0.12, b=0.12)
            self.cursor_y -= line_spacing

    def build_resume(self):
        # 1. Header
        self.draw_centered_text("ANUPAM GUPTA", self.cursor_y, font="F2", size=18, r=0.05, g=0.05, b=0.05)
        self.cursor_y -= 14
        self.draw_centered_text("Cybersecurity | Web Application Penetration Testing | Purple Teaming | Vulnerability Assessment", self.cursor_y, font="F2", size=8.8, r=0.05, g=0.05, b=0.05)
        self.cursor_y -= 12
        contact_line_1 = "Jhansi, India  |  +91 8381982462  |  guptaanupam552@gmail.com  |  linkedin.com/in/anupam-gupta-9294a234a |"
        contact_line_2 = "github.com/AnupamGupta-Pro00Nation"
        self.draw_centered_text(contact_line_1, self.cursor_y, font="F1", size=8.0, r=0.15, g=0.2, b=0.25)
        self.cursor_y -= 10
        self.draw_centered_text(contact_line_2, self.cursor_y, font="F1", size=8.0, r=0.15, g=0.2, b=0.25)
        self.cursor_y -= 4

        # 2. Professional Summary
        self.add_section_header("Professional Summary")
        summary = (
            "B.Tech Computer Science (Cybersecurity) student with hands-on experience in web application penetration testing, "
            "vulnerability assessment, and digital forensics. WAPT intern at CyberCell Headquarters, Uttar Pradesh Police, testing "
            "live government web applications against the OWASP Top 10. Builds security tooling, including PurpleLoop (purple teaming "
            "and detection engineering) and a C-based network intrusion detection system."
        )
        words = summary.split(' ')
        curr = ""
        for w in words:
            if len(curr) + len(w) + 1 <= 112:
                curr = (curr + " " + w).strip()
            else:
                self.draw_text(curr, self.margin_x, self.cursor_y, font="F1", size=8.3, r=0.15, g=0.15, b=0.15)
                self.cursor_y -= 10.5
                curr = w
        if curr:
            self.draw_text(curr, self.margin_x, self.cursor_y, font="F1", size=8.3, r=0.15, g=0.15, b=0.15)
            self.cursor_y -= 10.5

        # 3. Technical Skills
        self.add_section_header("Technical Skills")
        skills = [
            ("Security: ", "Penetration Testing, Web Application Security (OWASP Top 10), Vulnerability Assessment, Network Security, Digital Forensics, Incident Response, Threat Intelligence, Detection Engineering"),
            ("Tools: ", "Burp Suite, Metasploit, Nmap, Splunk, Wazuh, Wireshark, Volatility, Aircrack-ng, Kali Linux, libpcap"),
            ("Programming: ", "Python, C, Java, JavaScript, HTML, CSS"),
            ("Development & Platforms: ", "Git, GitHub, React, Spring Boot, REST APIs, VirtualBox, Vercel, Render")
        ]
        for label, val in skills:
            self.draw_text(label, self.margin_x, self.cursor_y, font="F2", size=8.3, r=0.05, g=0.05, b=0.05)
            # Offset based on label width
            offset = 120 if "Development" in label else (68 if "Programming" in label else (45 if "Security" in label else 38))
            self.draw_text(val, self.margin_x + offset, self.cursor_y, font="F1", size=8.1, r=0.15, g=0.15, b=0.15)
            self.cursor_y -= 10.2

        # 4. Experience
        self.add_section_header("Experience")

        # CyberCell
        self.draw_text("WAPT | CTF Developing Intern", self.margin_x, self.cursor_y, font="F2", size=8.8, r=0.05, g=0.05, b=0.05)
        self.draw_text("| CyberCell Headquarters, Lucknow -- Uttar Pradesh Police", self.margin_x + 138, self.cursor_y, font="F1", size=8.4, r=0.15, g=0.15, b=0.15)
        self.draw_text("-- Jun 2026 - Jul 2026", self.width - self.margin_x - 90, self.cursor_y, font="F1", size=8.2, r=0.25, g=0.25, b=0.25)
        self.cursor_y -= 11.0
        self.add_bullet("Conducted web application penetration testing (WAPT) engagements on live government web applications, identifying and validating security vulnerabilities mapped to OWASP Top 10 risk categories.")
        self.add_bullet("Performed reconnaissance and exploitation testing; documented findings with remediation recommendations in formal security assessment reports.")
        self.add_bullet("Designed and deployed Capture The Flag (CTF) challenges to build practical security skills and awareness.")
        self.cursor_y -= 3.0

        # ShadowFox
        self.draw_text("Cybersecurity Intern", self.margin_x, self.cursor_y, font="F2", size=8.8, r=0.05, g=0.05, b=0.05)
        self.draw_text("| ShadowFox (Remote)", self.margin_x + 98, self.cursor_y, font="F1", size=8.4, r=0.15, g=0.15, b=0.15)
        self.draw_text("-- Aug 2025 - Sep 2025", self.width - self.margin_x - 90, self.cursor_y, font="F1", size=8.2, r=0.25, g=0.25, b=0.25)
        self.cursor_y -= 11.0
        self.add_bullet("Executed penetration testing exercises using Metasploit, including reverse shell exploitation in simulated environments; evaluated Wi-Fi security protocols, and performed VeraCrypt encryption analysis and basic malware analysis.")
        self.cursor_y -= 3.0

        # Cyberonites Club
        self.draw_text("Technical Team Member", self.margin_x, self.cursor_y, font="F2", size=8.8, r=0.05, g=0.05, b=0.05)
        self.draw_text("| Cyberonites Club, GLA University, Mathura", self.margin_x + 115, self.cursor_y, font="F1", size=8.4, r=0.15, g=0.15, b=0.15)
        self.draw_text("-- Jun 2025 - Present", self.width - self.margin_x - 85, self.cursor_y, font="F1", size=8.2, r=0.25, g=0.25, b=0.25)
        self.cursor_y -= 11.0
        self.add_bullet("Provide hands-on cybersecurity support and guidance to club members; help plan and execute security workshops and technical events.")
        self.add_bullet("Authored multiple CTF challenges for the pre-screening round of Seize da Flaq 2026, the club's national-level 18-hour CTF (1500+ registrations, 780+ players); also contributed to the Grand Finale.")
        self.cursor_y -= 2.5

        # 5. Projects
        self.add_section_header("Projects")

        # Project 1: PurpleLoop
        self.draw_text("PurpleLoop -- Purple Teaming & Detection Engineering Platform", self.margin_x, self.cursor_y, font="F2", size=8.8, r=0.05, g=0.05, b=0.05)
        self.draw_text("| Java, Spring Boot, React, REST API", self.margin_x + 282, self.cursor_y, font="F1", size=8.3, r=0.15, g=0.15, b=0.15)
        self.draw_text("-- 2026 - Present", self.width - self.margin_x - 68, self.cursor_y, font="F1", size=8.2, r=0.25, g=0.25, b=0.25)
        self.cursor_y -= 11.0
        self.add_bullet("Links controlled attack simulations to defensive detection: synthetic events feed detectors that raise alerts; dashboard tracks detection metrics including MTTD. Brute-force detector groups failed logins by IP with a configurable threshold.")
        self.draw_text("Code: github.com/AnupamGupta-Pro00Nation/purpleloop  |  Live: purpleloop-weld.vercel.app", self.margin_x + 12, self.cursor_y, font="F1", size=8.1, r=0.2, g=0.35, b=0.45)
        self.cursor_y -= 11.5

        # Project 2: Advanced NIDS
        self.draw_text("Advanced Network Intrusion Detection System (NIDS)", self.margin_x, self.cursor_y, font="F2", size=8.8, r=0.05, g=0.05, b=0.05)
        self.draw_text("| C, libpcap, Linux", self.margin_x + 246, self.cursor_y, font="F1", size=8.3, r=0.15, g=0.15, b=0.15)
        self.draw_text("-- Feb 2026", self.width - self.margin_x - 48, self.cursor_y, font="F1", size=8.2, r=0.25, g=0.25, b=0.25)
        self.cursor_y -= 11.0
        self.add_bullet("C-based NIDS using libpcap for real-time packet capture and manual parsing of Ethernet, IPv4, TCP and UDP headers; threshold detection for port scans and SYN, HTTP and ICMP floods; multithreaded processing with timestamped alert logging.")
        self.draw_text("Code: github.com/AnupamGupta-Pro00Nation/Advanced-NIDS", self.margin_x + 12, self.cursor_y, font="F1", size=8.1, r=0.2, g=0.35, b=0.45)
        self.cursor_y -= 11.5

        # Project 3: Home Lab
        self.draw_text("Cybersecurity Home Lab", self.margin_x, self.cursor_y, font="F2", size=8.8, r=0.05, g=0.05, b=0.05)
        self.draw_text("| VirtualBox, Kali Linux, Metasploitable, Splunk", self.margin_x + 118, self.cursor_y, font="F1", size=8.3, r=0.15, g=0.15, b=0.15)
        self.draw_text("-- Mar 2026", self.width - self.margin_x - 48, self.cursor_y, font="F1", size=8.2, r=0.25, g=0.25, b=0.25)
        self.cursor_y -= 11.0
        self.add_bullet("Virtualized penetration testing lab simulating attack-and-defense scenarios; reconnaissance and exploitation with Nmap and Metasploit (5+ CVEs exploited); log and security event analysis in Splunk.")
        self.draw_text("Code: github.com/AnupamGupta-Pro00Nation/Cybersecurity-Home-Lab", self.margin_x + 12, self.cursor_y, font="F1", size=8.1, r=0.2, g=0.35, b=0.45)
        self.cursor_y -= 11.0

        # 6. Education
        self.add_section_header("Education")
        self.draw_text("Bachelor of Technology in Computer Science and Engineering (Cybersecurity)", self.margin_x, self.cursor_y, font="F2", size=8.8, r=0.05, g=0.05, b=0.05)
        self.draw_text("-- GLA University, Mathura  |  2024 - 2028 (Expected)", self.margin_x + 328, self.cursor_y, font="F1", size=8.3, r=0.15, g=0.15, b=0.15)
        self.cursor_y -= 10.5

        # 7. Certifications
        self.add_section_header("Certifications")
        c1 = "Fortinet Certified Fundamentals in Cybersecurity (NSE 1 & 2), 2026  |  Cybersecurity Essentials (LFC108), The Linux Foundation, 2025  |  Security Operations Fundamentals, Palo Alto Networks, 2025"
        c2 = "SQL Injection Attacks, CodeRed, 2026  |  Networking Basics, Cisco Networking Academy, 2025"
        self.draw_text(c1, self.margin_x, self.cursor_y, font="F1", size=7.8, r=0.15, g=0.15, b=0.15)
        self.cursor_y -= 10.0
        self.draw_text(c2, self.margin_x, self.cursor_y, font="F1", size=7.8, r=0.15, g=0.15, b=0.15)
        self.cursor_y -= 10.0
        self.draw_text(chr(149) + "  Verify certifications on Credly: credly.com/users/anupam-gupta.8e0a3913", self.margin_x + 12, self.cursor_y, font="F2", size=7.9, r=0.0, g=0.42, b=0.28)
        self.cursor_y -= 10.0

        # 8. Achievements
        self.add_section_header("Achievements")
        a1 = "Top 3% -- TryHackMe  |  Top 20 -- Pentest Showdown, GLA University (Jan 2026)  |  Speaker, Digital Forensics -- Payload Party, GLA University (Feb 2026)"
        a2 = "Participant -- SPARK Hack 2026; EscalateX V2 CTF (2025); MythX CTF (2026); ISEA ISAP CTF (2026)"
        self.draw_text(chr(149) + "  " + a1, self.margin_x + 12, self.cursor_y, font="F1", size=7.8, r=0.15, g=0.15, b=0.15)
        self.cursor_y -= 10.0
        self.draw_text(chr(149) + "  " + a2, self.margin_x + 12, self.cursor_y, font="F1", size=7.8, r=0.15, g=0.15, b=0.15)
        self.cursor_y -= 8.0

    def compile(self):
        stream_content = "\n".join(self.commands).encode('latin-1')
        stream_len = len(stream_content)

        objects = []
        # obj 1: Catalog
        objects.append(b"<< /Type /Catalog /Pages 2 0 R >>")
        # obj 2: Pages
        objects.append(b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>")
        # obj 3: Page
        objects.append(
            f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {self.width} {self.height}] "
            f"/Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>".encode('latin-1')
        )
        # obj 4: Content Stream
        objects.append(f"<< /Length {stream_len} >>\nstream\n".encode('latin-1') + stream_content + b"\nendstream")
        # obj 5: Font F1 (Helvetica regular)
        objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>")
        # obj 6: Font F2 (Helvetica-Bold)
        objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>")

        # Assemble PDF file
        pdf = bytearray()
        pdf.extend(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
        offsets = []
        for i, obj in enumerate(objects):
            offsets.append(len(pdf))
            obj_num = i + 1
            pdf.extend(f"{obj_num} 0 obj\n".encode('latin-1'))
            pdf.extend(obj)
            pdf.extend(b"\nendobj\n")

        xref_pos = len(pdf)
        pdf.extend(f"xref\n0 {len(objects) + 1}\n".encode('latin-1'))
        pdf.extend(b"0000000000 65535 f \n")
        for off in offsets:
            pdf.extend(f"{off:010d} 00000 n \n".encode('latin-1'))

        pdf.extend(
            f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_pos}\n%%EOF".encode('latin-1')
        )
        return bytes(pdf)

if __name__ == '__main__':
    builder = PDFBuilder()
    builder.build_resume()
    pdf_bytes = builder.compile()
    with open('assets/Anupam_Gupta_Resume.pdf', 'wb') as f:
        f.write(pdf_bytes)
    print(f"Generated assets/Anupam_Gupta_Resume.pdf ({len(pdf_bytes)} bytes)")
    print(f"Remaining bottom margin: {builder.cursor_y:.1f} pt")
