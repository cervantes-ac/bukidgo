import { FileText, Scale, Ban, AlertTriangle, Link, RefreshCw, Globe, CheckCircle, ChevronRight } from "lucide-react";
import { useState } from "react";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Outfit', system-ui, sans-serif; }
  .bk-display { font-family: 'Fraunces', Georgia, serif; }
  .bk-mono { font-family: 'JetBrains Mono', monospace; }

  .tribe-stripe {
    height: 8px;
    background: repeating-linear-gradient(
      90deg,
      #0A3D2F 0px, #0A3D2F 32px,
      #9C2A2A 32px, #9C2A2A 64px,
      #F5C400 64px, #F5C400 96px,
      #1E4D2B 96px, #1E4D2B 128px
    );
  }

  .weave-bg {
    position: relative;
    overflow: hidden;
  }
  .weave-bg::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      repeating-linear-gradient(45deg, rgba(245,196,0,0.04) 0px, rgba(245,196,0,0.04) 1px, transparent 1px, transparent 12px),
      repeating-linear-gradient(-45deg, rgba(10,61,47,0.05) 0px, rgba(10,61,47,0.05) 1px, transparent 1px, transparent 12px);
    pointer-events: none;
  }

  .section-label {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  .section-label::before {
    content: '';
    display: block;
    width: 28px;
    height: 2px;
    background: #9C2A2A;
  }

  .toc-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 14px;
    color: #4A4038;
    cursor: pointer;
    background: transparent;
    border: none;
    width: 100%;
    text-align: left;
    font-family: 'Outfit', sans-serif;
    transition: all 0.2s;
  }
  .toc-link:hover { background: #F5F0E8; color: #0A3D2F; }
  .toc-link.active { background: #1E4D2B; color: #F5F0E8; }

  .policy-section {
    padding: 48px 0;
    border-bottom: 1px solid #E8E0D5;
  }
  .policy-section:last-child { border-bottom: none; }

  .highlight-box {
    background: #FEF9E7;
    border: 1.5px solid #F5C400;
    border-left: 4px solid #C4622D;
    border-radius: 0 8px 8px 0;
    padding: 20px 24px;
    margin: 20px 0;
  }

  .info-box {
    background: #F0FAF4;
    border: 1.5px solid #C8DDD4;
    border-left: 4px solid #2D7A4A;
    border-radius: 0 8px 8px 0;
    padding: 20px 24px;
    margin: 20px 0;
  }

  @media (max-width: 900px) {
    .policy-layout { grid-template-columns: 1fr !important; }
    .toc-sidebar { position: static !important; top: auto !important; }
    .summary-grid { grid-template-columns: 1fr 1fr !important; }
  }
  @media (max-width: 480px) {
    .summary-grid { grid-template-columns: 1fr !important; }
  }
`;

const SECTIONS = [
  {
    id: "acceptance",
    icon: CheckCircle,
    label: "Acceptance",
    title: "1. Acceptance of Terms",
    content: `By accessing and using BukidGo, you accept and agree to be bound by these Terms of Service and our Privacy Policy. These terms apply to all visitors, users, and registered accounts on the platform.\n\nIf you do not agree to these terms, please discontinue use of BukidGo immediately. Your continued use of the platform after any modifications to these terms constitutes your acceptance of the revised terms.`,
    highlight: null,
    list: null,
  },
  {
    id: "license",
    icon: FileText,
    label: "Use License",
    title: "2. Use License",
    content: `BukidGo grants you a limited, non-exclusive, non-transferable license to access and use the platform for personal, non-commercial purposes. Under this license, you may not:`,
    list: [
      "Modify, copy, or distribute any materials from the platform without prior written consent.",
      "Use the platform or its content for commercial purposes or public display without authorization.",
      "Attempt to decompile, reverse engineer, or extract source code from any software on BukidGo.",
      "Remove, alter, or obscure any copyright, trademark, or other proprietary notices.",
      "Transfer, sublicense, or mirror any materials to another person or server.",
      "Scrape, crawl, or use automated tools to access or collect data from BukidGo.",
    ],
    highlight: "This license is automatically revoked upon any violation of these restrictions. BukidGo reserves the right to terminate access at its sole discretion.",
    info: null,
  },
  {
    id: "accounts",
    icon: CheckCircle,
    label: "User Accounts",
    title: "3. User Accounts & Responsibilities",
    content: `When you create an account on BukidGo, you are responsible for:`,
    list: [
      "Maintaining the confidentiality of your login credentials and account security.",
      "All activity that occurs under your account, whether authorized or not.",
      "Providing accurate, complete, and current information during registration.",
      "Notifying us immediately of any unauthorized use of your account.",
      "Ensuring your use of BukidGo complies with all applicable local laws in the Philippines.",
    ],
    highlight: null,
    info: "BukidGo reserves the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or harm the community.",
  },
  {
    id: "disclaimer",
    icon: AlertTriangle,
    label: "Disclaimer",
    title: "4. Disclaimer of Warranties",
    content: `The BukidGo platform and all its content, features, and services are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied.\n\nBukidGo specifically disclaims all implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement. We do not warrant that the platform will be uninterrupted, error-free, or free of viruses or other harmful components.`,
    highlight: "Guide bookings, destination information, and food spot details are provided in good faith. BukidGo is not liable for inaccuracies in third-party listings or for the conduct of individual guides and vendors.",
    list: null,
    info: null,
  },
  {
    id: "limitations",
    icon: Ban,
    label: "Limitations",
    title: "5. Limitation of Liability",
    content: `To the fullest extent permitted by applicable law, BukidGo and its team members, officers, and partners shall not be liable for:`,
    list: [
      "Any indirect, incidental, special, consequential, or punitive damages.",
      "Loss of profits, data, goodwill, or other intangible losses.",
      "Damages arising from your access to or use of (or inability to use) the platform.",
      "Unauthorized access to or alteration of your transmissions or data.",
      "Conduct or content of any third party on the platform.",
      "Any errors or omissions in content, or losses incurred from use of content.",
    ],
    highlight: null,
    info: "In all cases, BukidGo's total liability to you for any claim shall not exceed the amount paid by you, if any, for accessing or using the Service in the 12 months preceding the claim.",
  },
  {
    id: "accuracy",
    icon: FileText,
    label: "Accuracy",
    title: "6. Accuracy of Materials",
    content: `The content on BukidGo — including destination descriptions, guide profiles, food spot listings, event information, and pricing — may contain technical, typographical, or photographic errors.\n\nBukidGo does not guarantee that all materials are accurate, complete, or current. We may update or remove content at any time without prior notice. Reliance on any content is at your own risk.`,
    highlight: null,
    list: null,
    info: "For the most current guide availability and pricing, please contact guides directly through the platform's messaging feature.",
  },
  {
    id: "links",
    icon: Link,
    label: "External Links",
    title: "7. External Links",
    content: `BukidGo may contain links to third-party websites, social media pages, or external resources. These links are provided for convenience only and do not constitute an endorsement of the linked site or its content.\n\nBukidGo has no control over and assumes no responsibility for the content, privacy policies, or practices of any third-party sites or services. We encourage you to review the terms and privacy policy of any third-party site you visit.`,
    highlight: null,
    list: null,
    info: null,
  },
  {
    id: "modifications",
    icon: RefreshCw,
    label: "Modifications",
    title: "8. Modifications to Terms",
    content: `BukidGo reserves the right to revise these Terms of Service at any time without prior notice. When material changes are made, we will:\n\n• Update the "Last Updated" date on this page.\n• Notify registered users via email for significant changes.\n• Display a platform notice for 30 days following major updates.\n\nYour continued use of BukidGo after any modifications constitutes your binding acceptance of the updated terms.`,
    highlight: null,
    list: null,
    info: null,
  },
  {
    id: "governing",
    icon: Globe,
    label: "Governing Law",
    title: "9. Governing Law",
    content: `These Terms of Service are governed by and construed in accordance with the laws of the Republic of the Philippines, without regard to its conflict of law provisions.\n\nAny disputes arising from or relating to these terms or your use of BukidGo shall be subject to the exclusive jurisdiction of the courts located in Bukidnon, Philippines.`,
    highlight: "If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will continue in full force and effect.",
    list: null,
    info: null,
  },
];

const SUMMARY = [
  { icon: CheckCircle, label: "Fair Use", desc: "Personal, non-commercial use is always welcome.", color: "#2D7A4A" },
  { icon: Ban, label: "No Scraping", desc: "Automated data collection is strictly prohibited.", color: "#9C2A2A" },
  { icon: AlertTriangle, label: "Your Responsibility", desc: "You're responsible for your account and activity.", color: "#C4622D" },
  { icon: Scale, label: "Philippine Law", desc: "Disputes fall under Philippine jurisdiction.", color: "#1E4D2B" },
];

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState("acceptance");

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <style>{S}</style>
      <div style={{ minHeight: "100vh", background: "#F5F5F0", paddingTop: 72, fontFamily: "'Outfit', sans-serif" }}>

        <div className="tribe-stripe" />

        {/* Hero */}
        <div className="weave-bg" style={{ background: "linear-gradient(155deg, #0A3D2F 0%, #1E4D2B 60%, #2D7A4A 100%)", color: "#F5F0E8", padding: "88px 2rem 80px", textAlign: "center" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(245,196,0,0.15)", border: "1px solid rgba(245,196,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Scale style={{ width: 32, height: 32, color: "#F5C400" }} />
            </div>
            <div className="section-label" style={{ justifyContent: "center" }}>
              <span className="bk-mono" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#F5C400" }}>Legal · Platform Rules</span>
            </div>
            <h1 className="bk-display" style={{ fontSize: "clamp(36px, 6vw, 58px)", fontWeight: 900, marginBottom: 20, lineHeight: 1.1 }}>
              Terms of <em style={{ color: "#F5C400", fontStyle: "italic" }}>Service</em>
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.8, opacity: 0.88 }}>
              These terms govern your use of BukidGo. Please read them carefully — they protect both you and our community.
            </p>
            <div style={{ marginTop: 28, display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245,240,232,0.1)", border: "1px solid rgba(245,240,232,0.2)", borderRadius: 40, padding: "8px 20px" }}>
              <span style={{ fontSize: 13, opacity: 0.8 }}>Last updated:</span>
              <span className="bk-mono" style={{ fontSize: 12, color: "#F5C400", fontWeight: 700 }}>May 2, 2026</span>
            </div>
          </div>
        </div>

        {/* Quick Summary Cards */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 2rem 0" }}>
          <div className="summary-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {SUMMARY.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} style={{ background: "#fff", border: "1px solid #DDD6C8", borderRadius: 10, padding: "20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: `${s.color}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon style={{ width: 18, height: 18, color: s.color }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#0A3D2F", marginBottom: 3 }}>{s.label}</p>
                    <p style={{ fontSize: 12, color: "#7A6E61", lineHeight: 1.5 }}>{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 2rem 88px" }}>
          <div className="policy-layout" style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 60, alignItems: "start" }}>

            {/* Table of Contents */}
            <div className="toc-sidebar" style={{ position: "sticky", top: 100, background: "#fff", border: "1px solid #DDD6C8", borderRadius: 12, padding: 20 }}>
              <p className="bk-mono" style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9C2A2A", marginBottom: 12, paddingLeft: 16 }}>Contents</p>
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <button key={s.id} className={`toc-link ${activeSection === s.id ? "active" : ""}`} onClick={() => scrollTo(s.id)}>
                    <Icon style={{ width: 13, height: 13, flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{s.label}</span>
                    <ChevronRight style={{ width: 11, height: 11, opacity: 0.5 }} />
                  </button>
                );
              })}
              <div style={{ marginTop: 16, padding: "16px", background: "#F5F0E8", borderRadius: 8 }}>
                <p style={{ fontSize: 11, color: "#7A6E61", lineHeight: 1.6 }}>Questions about these terms? <span style={{ color: "#9C2A2A", fontWeight: 600 }}>legal@bukidgo.com</span></p>
              </div>
            </div>

            {/* Content */}
            <div>
              {SECTIONS.map((section) => (
                <div key={section.id} id={section.id} className="policy-section">
                  <div className="section-label">
                    <span className="bk-mono" style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9C2A2A" }}>{section.label}</span>
                  </div>
                  <h2 className="bk-display" style={{ fontSize: 28, fontWeight: 700, color: "#0A3D2F", marginBottom: 20 }}>{section.title}</h2>

                  {section.content.split("\n\n").map((para, i) => (
                    <p key={i} style={{ fontSize: 15, lineHeight: 1.85, color: "#2D2D2D", marginBottom: 16, whiteSpace: "pre-line" }}>{para}</p>
                  ))}

                  {section.list && (
                    <ul style={{ margin: "16px 0", listStyle: "none" }}>
                      {section.list.map((item, i) => (
                        <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "9px 0", borderBottom: i < (section.list?.length ?? 0) - 1 ? "1px solid #EEE8DF" : "none" }}>
                          <span style={{ color: "#9C2A2A", fontWeight: 900, marginTop: 2, flexShrink: 0 }}>◆</span>
                          <span style={{ fontSize: 15, color: "#2D2D2D", lineHeight: 1.7 }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.highlight && (
                    <div className="highlight-box">
                      <p style={{ fontSize: 14, lineHeight: 1.75, color: "#5A3200", fontWeight: 500 }}>{section.highlight}</p>
                    </div>
                  )}

                  {section.info && (
                    <div className="info-box">
                      <p style={{ fontSize: 14, lineHeight: 1.75, color: "#0A3D2F", fontWeight: 500 }}>{section.info}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Footer CTA */}
              <div style={{ marginTop: 40, background: "linear-gradient(135deg, #0A3D2F, #1E4D2B)", borderRadius: 12, padding: "28px 32px", display: "flex", gap: 20, alignItems: "center" }}>
                <Scale style={{ width: 32, height: 32, color: "#F5C400", flexShrink: 0 }} />
                <div>
                  <h4 className="bk-display" style={{ fontSize: 18, fontWeight: 700, color: "#F5F0E8", marginBottom: 6 }}>Questions about these terms?</h4>
                  <p style={{ fontSize: 13, color: "#B8D4C4", lineHeight: 1.7 }}>
                    We're happy to clarify anything. Reach us at{" "}
                    <span style={{ color: "#F5C400" }}>legal@bukidgo.com</span> or visit our{" "}
                    <a href="/contact" style={{ color: "#F5C400", textDecoration: "underline" }}>Contact page</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tribe-stripe" />
      </div>
    </>
  );
}