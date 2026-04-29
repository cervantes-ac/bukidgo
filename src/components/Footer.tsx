import { MapPin, Instagram, Facebook, Twitter, Mail, Heart, Mountain, ArrowRight } from "lucide-react";

const SHARED_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
  .bk-display { font-family: 'Fraunces', Georgia, serif; }
  .bk-body { font-family: 'Outfit', system-ui, sans-serif; }
  .bk-mono { font-family: 'JetBrains Mono', monospace; }
  .bk-footer-link { transition: color 0.15s, padding-left 0.15s; }
  .bk-footer-link:hover { color: #1A1208 !important; padding-left: 6px !important; }
  .bk-social:hover { background: #1A1208 !important; color: #F5F0E8 !important; }
  .bk-nl-btn:hover { background: #C4622D !important; }
`;

export default function Footer() {
  const platformLinks = ["Explore Spots", "Local Buddies", "AI Itinerary", "Events Calendar", "Food Spots"];
  const companyLinks = ["About Us", "Contact", "Terms of Service", "Privacy Policy", "Careers"];

  return (
    <>
      <style>{SHARED_STYLE}</style>
      <footer
        className="bk-body"
        style={{ background: "#1A1208", color: "#F5F0E8", paddingTop: 72, paddingBottom: 40 }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
          
          {/* Top row — brand + tagline */}
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 24,
            justifyContent: "space-between", alignItems: "flex-start",
            paddingBottom: 56, borderBottom: "1px solid rgba(245,240,232,0.1)"
          }}>
            {/* Brand */}
            <div style={{ maxWidth: 320 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 6, background: "#D4A853",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Mountain style={{ width: 22, height: 22, color: "#1A1208" }} />
                </div>
                <div>
                  <div className="bk-display" style={{ fontSize: 24, fontWeight: 900, color: "#F5F0E8", lineHeight: 1 }}>
                    BukidGo
                  </div>
                  <div className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                    Highland Explorer
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(245,240,232,0.5)", fontWeight: 300 }}>
                Making Bukidnon tourism accessible, smart, and community-driven. Plan your next adventure with a local buddy.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16, color: "#7A6E61", fontSize: 13 }}>
                <MapPin style={{ width: 14, height: 14, color: "#C4622D" }} />
                Bukidnon, Philippines
              </div>
            </div>

            {/* Links grid */}
            <div style={{ display: "flex", gap: 64, flexWrap: "wrap" }}>
              {/* Platform */}
              <div>
                <div className="bk-mono" style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#D4A853", marginBottom: 20, fontWeight: 700 }}>
                  Platform
                </div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {platformLinks.map(item => (
                    <li key={item}>
                      <a href="#" className="bk-footer-link" style={{ textDecoration: "none", fontSize: 14, color: "rgba(245,240,232,0.45)", fontWeight: 400 }}>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <div className="bk-mono" style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#D4A853", marginBottom: 20, fontWeight: 700 }}>
                  Company
                </div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {companyLinks.map(item => (
                    <li key={item}>
                      <a href="#" className="bk-footer-link" style={{ textDecoration: "none", fontSize: 14, color: "rgba(245,240,232,0.45)", fontWeight: 400 }}>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connect */}
              <div>
                <div className="bk-mono" style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#D4A853", marginBottom: 20, fontWeight: 700 }}>
                  Connect
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
                  {[
                    { icon: Instagram, label: "Instagram" },
                    { icon: Facebook, label: "Facebook" },
                    { icon: Twitter, label: "Twitter" },
                    { icon: Mail, label: "Email" }
                  ].map(({ icon: Icon, label }) => (
                    <a
                      key={label}
                      href="#"
                      aria-label={label}
                      className="bk-social"
                      style={{
                        width: 38, height: 38, borderRadius: 4,
                        border: "1px solid rgba(245,240,232,0.12)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "rgba(245,240,232,0.4)", transition: "all 0.15s",
                        textDecoration: "none",
                      }}
                    >
                      <Icon style={{ width: 16, height: 16 }} />
                    </a>
                  ))}
                </div>

                {/* Newsletter */}
                <div className="bk-mono" style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#7A6E61", marginBottom: 10, fontWeight: 700 }}>
                  Newsletter
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    style={{
                      flex: 1, padding: "10px 14px",
                      background: "rgba(245,240,232,0.06)",
                      border: "1px solid rgba(245,240,232,0.12)",
                      borderRadius: 4, color: "#F5F0E8", fontSize: 13,
                      outline: "none", fontFamily: "inherit",
                      minWidth: 0,
                    }}
                  />
                  <button
                    className="bk-nl-btn"
                    style={{
                      padding: "10px 14px", borderRadius: 4, border: "none",
                      background: "#D4A853", color: "#1A1208",
                      fontWeight: 700, fontSize: 13, cursor: "pointer",
                      transition: "background 0.15s", display: "flex", alignItems: "center",
                    }}
                  >
                    <ArrowRight style={{ width: 16, height: 16 }} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 12,
            justifyContent: "space-between", alignItems: "center",
            paddingTop: 28,
          }}>
            <p className="bk-mono" style={{ fontSize: 11, color: "rgba(245,240,232,0.3)", letterSpacing: "0.05em" }}>
              © 2026 BukidGo · Group 5-HM3B · All rights reserved
            </p>
            <p style={{ fontSize: 12, color: "rgba(245,240,232,0.3)", display: "flex", alignItems: "center", gap: 6 }}>
              <Heart style={{ width: 13, height: 13, color: "#C4622D", fill: "#C4622D" }} />
              Made with love for Bukidnon Tourism
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}