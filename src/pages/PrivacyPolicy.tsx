import { Shield, Lock, Eye, RefreshCw, Mail, ChevronRight } from "lucide-react";
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
    text-decoration: none;
    transition: all 0.2s;
    cursor: pointer;
    background: transparent;
    border: none;
    width: 100%;
    text-align: left;
    font-family: 'Outfit', sans-serif;
  }
  .toc-link:hover { background: #F5F0E8; color: #0A3D2F; }
  .toc-link.active { background: #1E4D2B; color: #F5F0E8; }

  .policy-section {
    padding: 48px 0;
    border-bottom: 1px solid #E8E0D5;
  }
  .policy-section:last-child { border-bottom: none; }

  .highlight-box {
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
  }
`;

const SECTIONS = [
  { id: "intro", icon: Shield, label: "Introduction", title: "1. Introduction", content: `BukidGo ("we," "us," or "our") operates the BukidGo website and mobile platform, a highland tourism discovery service based in Bukidnon, Philippines. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our Service.\n\nBy using BukidGo, you agree to the collection and use of information as described in this policy. We are committed to handling your data with transparency, care, and respect.` },
  { id: "collection", icon: Eye, label: "Data Collection", title: "2. Information We Collect", content: `We collect the following categories of information to provide and improve our services:`, list: ["Personal Data: Full name, email address, phone number, and profile photo when you register an account.", "Location Data: General region information to surface relevant destinations and guides near you.", "Usage Data: Pages visited, search queries, time spent on pages, and interaction patterns — used to improve your experience.", "Device Data: Browser type, operating system, and IP address collected automatically.", "Booking Data: Guide and venue reservation details, dates, and preferences.", "Review Data: Ratings and feedback you voluntarily submit about guides and destinations."], highlight: "We never sell your personal data to third parties. Your information is used solely to power and improve BukidGo." },
  { id: "use", icon: RefreshCw, label: "How We Use Data", title: "3. How We Use Your Information", content: `Your data is used for the following purposes:`, list: ["To provide, operate, and maintain the BukidGo platform and its features.", "To process bookings and send confirmation or reminder communications.", "To personalize destination and guide recommendations based on your preferences.", "To send service updates, feature announcements, and occasional promotions (you may opt out at any time).", "To analyze usage trends and improve platform performance and user experience.", "To detect and prevent fraud, abuse, and security incidents.", "To comply with applicable laws and regulations in the Philippines."] },
  { id: "security", icon: Lock, label: "Security", title: "4. Data Security", content: `We take data security seriously. BukidGo uses industry-standard measures to protect your personal information:\n\nAll data is transmitted over encrypted HTTPS connections. Passwords are never stored in plain text — they are hashed using secure algorithms. Access to your personal data is restricted to authorized team members only. Firebase Authentication and Firestore security rules enforce strict access controls.`, highlight: "No method of transmission over the internet is 100% secure. While we implement strong safeguards, we cannot guarantee absolute security. Please use a strong, unique password for your BukidGo account." },
  { id: "rights", icon: Shield, label: "Your Rights", title: "5. Your Rights", content: `As a user of BukidGo, you have the following rights over your personal data:`, list: ["Access: Request a copy of the personal data we hold about you.", "Correction: Ask us to update or correct inaccurate information.", "Deletion: Request that we delete your account and associated personal data.", "Opt-out: Unsubscribe from marketing communications at any time via the link in any email.", "Data Portability: Request your data in a machine-readable format.", "Withdraw Consent: Revoke previously given consent at any time."], highlight: "To exercise any of these rights, contact us at privacy@bukidgo.com. We will respond within 30 days." },
  { id: "changes", icon: RefreshCw, label: "Policy Changes", title: "6. Changes to This Policy", content: `We may update this Privacy Policy from time to time as our platform evolves or as legal requirements change. When we make significant changes, we will:\n\n• Update the "Last Updated" date at the top of this page.\n• Send an email notification to registered users for material changes.\n• Display a notice on the BukidGo platform for 30 days following major updates.\n\nContinued use of BukidGo after changes are published constitutes your acceptance of the updated policy.` },
  { id: "contact", icon: Mail, label: "Contact", title: "7. Contact Us", content: `If you have questions, concerns, or requests about this Privacy Policy or your personal data, please reach out:`, list: ["Email: privacy@bukidgo.com", "Contact Form: bukidgo.com/contact", "Location: Bukidnon, Philippines (Region X)"], highlight: "We take all privacy concerns seriously and aim to respond to all inquiries within 5 business days." },
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("intro");

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
              <Shield style={{ width: 32, height: 32, color: "#F5C400" }} />
            </div>
            <div className="section-label" style={{ justifyContent: "center" }}>
              <span className="bk-mono" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#F5C400" }}>Legal & Transparency</span>
            </div>
            <h1 className="bk-display" style={{ fontSize: "clamp(36px, 6vw, 58px)", fontWeight: 900, marginBottom: 20, lineHeight: 1.1 }}>
              Privacy <em style={{ color: "#F5C400", fontStyle: "italic" }}>Policy</em>
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.8, opacity: 0.88 }}>
              We believe transparency builds trust. Here's exactly how we collect, use, and protect your data on BukidGo.
            </p>
            <div style={{ marginTop: 28, display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245,240,232,0.1)", border: "1px solid rgba(245,240,232,0.2)", borderRadius: 40, padding: "8px 20px" }}>
              <span style={{ fontSize: 13, opacity: 0.8 }}>Last updated:</span>
              <span className="bk-mono" style={{ fontSize: 12, color: "#F5C400", fontWeight: 700 }}>May 2, 2026</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 2rem 88px" }}>
          <div className="policy-layout" style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 60, alignItems: "start" }}>

            {/* Table of Contents */}
            <div className="toc-sidebar" style={{ position: "sticky", top: 100, background: "#fff", border: "1px solid #DDD6C8", borderRadius: 12, padding: 20 }}>
              <p className="bk-mono" style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9C2A2A", marginBottom: 12, paddingLeft: 16 }}>Contents</p>
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <button key={s.id} className={`toc-link ${activeSection === s.id ? "active" : ""}`} onClick={() => scrollTo(s.id)}>
                    <Icon style={{ width: 14, height: 14, flexShrink: 0 }} />
                    {s.label}
                    <ChevronRight style={{ width: 12, height: 12, marginLeft: "auto", opacity: 0.5 }} />
                  </button>
                );
              })}
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
                    <ul style={{ margin: "16px 0 16px 4px", listStyle: "none" }}>
                      {section.list.map((item, i) => (
                        <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "8px 0", borderBottom: i < section.list!.length - 1 ? "1px solid #EEE8DF" : "none" }}>
                          <span style={{ color: "#9C2A2A", fontWeight: 900, marginTop: 2, flexShrink: 0 }}>◆</span>
                          <span style={{ fontSize: 15, color: "#2D2D2D", lineHeight: 1.7 }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.highlight && (
                    <div className="highlight-box">
                      <p style={{ fontSize: 14, lineHeight: 1.75, color: "#0A3D2F", fontWeight: 500 }}>{section.highlight}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Footer note */}
              <div style={{ marginTop: 40, background: "linear-gradient(135deg, #0A3D2F, #1E4D2B)", borderRadius: 12, padding: "28px 32px", display: "flex", gap: 20, alignItems: "center" }}>
                <Lock style={{ width: 32, height: 32, color: "#F5C400", flexShrink: 0 }} />
                <div>
                  <h4 className="bk-display" style={{ fontSize: 18, fontWeight: 700, color: "#F5F0E8", marginBottom: 6 }}>Your privacy matters to us</h4>
                  <p style={{ fontSize: 13, color: "#B8D4C4", lineHeight: 1.7 }}>BukidGo is a student-led platform committed to ethical, transparent data practices. Questions? Reach us at <span style={{ color: "#F5C400" }}>privacy@bukidgo.com</span></p>
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