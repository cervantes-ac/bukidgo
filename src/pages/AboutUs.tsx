import { Mountain, Users, Leaf, Heart, Star, X, MapPin, Award, Globe } from "lucide-react";
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
    position: absolute;
    inset: 0;
    background-image:
      repeating-linear-gradient(45deg, rgba(245,196,0,0.04) 0px, rgba(245,196,0,0.04) 1px, transparent 1px, transparent 12px),
      repeating-linear-gradient(-45deg, rgba(10,61,47,0.05) 0px, rgba(10,61,47,0.05) 1px, transparent 1px, transparent 12px);
    pointer-events: none;
  }

  .value-card {
    background: #fff;
    border: 1px solid #DDD6C8;
    border-radius: 12px;
    padding: 32px 24px;
    text-align: center;
    transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
    position: relative;
    overflow: hidden;
  }
  .value-card::before {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #1E4D2B, #F5C400);
    transform: scaleX(0);
    transition: transform 0.3s ease;
    transform-origin: left;
  }
  .value-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(10,61,47,0.12); }
  .value-card:hover::before { transform: scaleX(1); }

  .member-card {
    background: #F5F9F7;
    border: 1.5px solid #C8DDD4;
    border-radius: 12px;
    padding: 28px 20px;
    text-align: center;
    transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .member-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 24px 56px rgba(10,61,47,0.18);
    border-color: #2D7A4A;
  }

  .specialty-tag {
    font-size: 10px;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: #F5F0E8;
    color: #0A3D2F;
    padding: 4px 10px;
    border-radius: 4px;
    border: 1px solid #DDD6C8;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10,20,12,0.72);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    backdrop-filter: blur(6px);
  }

  .modal-card {
    background: #F5F9F7;
    border-radius: 16px;
    padding: 48px 40px;
    max-width: 480px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 32px 80px rgba(10,61,47,0.35);
    position: relative;
    animation: modalIn 0.3s cubic-bezier(0.22,1,0.36,1);
  }

  @keyframes modalIn {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .close-btn {
    position: absolute;
    top: 16px; right: 16px;
    width: 36px; height: 36px;
    border-radius: 50%;
    background: #F5F0E8;
    border: 1px solid #DDD6C8;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: #0A3D2F;
    transition: all 0.2s;
  }
  .close-btn:hover { background: #1E4D2B; color: #F5F0E8; border-color: #1E4D2B; }

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

  .stat-chip {
    background: rgba(245,240,232,0.12);
    border: 1px solid rgba(245,240,232,0.2);
    border-radius: 40px;
    padding: 8px 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  @media (max-width: 768px) {
    .mission-grid { grid-template-columns: 1fr !important; }
    .values-grid { grid-template-columns: 1fr 1fr !important; }
    .team-grid { grid-template-columns: 1fr 1fr !important; }
    .hero-stats { flex-direction: column; align-items: center; }
  }
  @media (max-width: 480px) {
    .values-grid { grid-template-columns: 1fr !important; }
    .team-grid { grid-template-columns: 1fr !important; }
  }
`;

const GROUP_5_TEAM = [
  { uid: "buddy1", name: "Christine Lynette B. Aguila", photoURL: "/img/BukidGO/default-person.svg" },
  { uid: "buddy2", name: "Mitch Jyacenth L. Alemanio", photoURL: "/img/BukidGO/4.jpg" },
  { uid: "buddy3", name: "Rejean D. Cabatingan", photoURL: "/img/BukidGO/1.jpg" },
  { uid: "buddy4", name: "Yyan April Kaye L. Daligdig", photoURL: "/img/BukidGO/5.jpg" },
  { uid: "buddy5", name: "Uriah Shianne E. Rellebo", photoURL: "/img/BukidGO/2.jpg" },
  { uid: "buddy6", name: "Jonaira M. Saripada", photoURL: "/img/BukidGO/3.jpg" },
  { uid: "buddy7", name: "Daisy Rose Yam-oc", photoURL: "/img/BukidGO/6.jpg" },
];

const VALUES = [
  { icon: Leaf, title: "Sustainability", desc: "Protecting Bukidnon's natural heritage for future generations through responsible tourism practices.", color: "#2D7A4A" },
  { icon: Users, title: "Community", desc: "Empowering local guides, artisans, and small businesses at the heart of every journey.", color: "#1E4D2B" },
  { icon: Heart, title: "Authenticity", desc: "Genuine highland experiences that create real connections between travelers and local culture.", color: "#9C2A2A" },
  { icon: Mountain, title: "Adventure", desc: "Inspiring exploration and discovery across Bukidnon's magnificent highland landscapes.", color: "#0A3D2F" },
];

export default function AboutUs() {
  const [selectedMember, setSelectedMember] = useState<typeof GROUP_5_TEAM[0] | null>(null);

  return (
    <>
      <style>{S}</style>
      <div style={{ minHeight: "100vh", background: "#F5F5F0", paddingTop: 72, fontFamily: "'Outfit', sans-serif" }}>

        {/* Tribe Stripe */}
        <div className="tribe-stripe" />

        {/* Hero */}
        <div className="weave-bg" style={{ background: "linear-gradient(155deg, #0A3D2F 0%, #1E4D2B 60%, #2D7A4A 100%)", color: "#F5F0E8", padding: "88px 2rem 80px", textAlign: "center" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>
              <span className="bk-mono" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#F5C400" }}>Our Story</span>
            </div>
            <h1 className="bk-display" style={{ fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 900, marginBottom: 20, lineHeight: 1.1 }}>
              About <em style={{ color: "#F5C400", fontStyle: "italic" }}>BukidGo</em>
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.8, opacity: 0.88, maxWidth: 580, margin: "0 auto 40px" }}>
              A student-built platform making Bukidnon's highland beauty accessible, discoverable, and unforgettable for every traveler.
            </p>
            <div className="hero-stats" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              {[["50+", "Destinations"], ["7", "Tribes Honored"], ["30+", "Food Spots"], ["10+", "Local Guides"]].map(([num, label]) => (
                <div key={label} className="stat-chip">
                  <span className="bk-display" style={{ fontSize: 22, fontWeight: 700, color: "#F5C400" }}>{num}</span>
                  <span style={{ fontSize: 13, opacity: 0.8 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "88px 2rem" }}>
          <div className="mission-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
            <div>
              <div className="section-label">
                <span className="bk-mono" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9C2A2A" }}>Why We Exist</span>
              </div>
              <h2 className="bk-display" style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, marginBottom: 24, color: "#0A3D2F", lineHeight: 1.2 }}>
                Bringing Bukidnon to the World
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.9, color: "#4A4038", marginBottom: 20 }}>
                Bukidnon's highlands hide breathtaking landscapes, rich indigenous cultures, and authentic experiences that most travelers never discover. BukidGo was born to change that — through technology and community.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.9, color: "#4A4038" }}>
                By connecting travelers directly with verified local guides, hidden gems, and genuine food experiences, we empower the community while giving visitors the real Bukidnon — not a tourist version of it.
              </p>
              <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
                {["Est. 2024", "Group 5 · HM3B", "CDO, Mindanao"].map(tag => (
                  <span key={tag} className="specialty-tag">{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "4/3" }}>
                <img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=700&fit=crop" alt="Bukidnon landscape" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ position: "absolute", bottom: -20, left: -20, background: "#1E4D2B", borderRadius: 12, padding: "20px 24px", boxShadow: "0 8px 32px rgba(10,61,47,0.3)" }}>
                <div className="bk-display" style={{ fontSize: 32, fontWeight: 900, color: "#F5C400" }}>7</div>
                <div style={{ fontSize: 12, color: "#B8D4C4", lineHeight: 1.4 }}>Indigenous<br />Tribes Honored</div>
              </div>
              <div style={{ position: "absolute", top: -16, right: -16, width: 64, height: 64, borderRadius: "50%", background: "#F5C400", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Award style={{ width: 28, height: 28, color: "#0A3D2F" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Tribe Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 2rem", maxWidth: 1280, margin: "0 auto 0" }}>
          <div style={{ flex: 1, height: 1, background: "#DDD6C8" }} />
          {["◆", "◆", "◆"].map((d, i) => <span key={i} style={{ color: i === 1 ? "#F5C400" : "#9C2A2A", fontSize: i === 1 ? 14 : 10 }}>{d}</span>)}
          <div style={{ flex: 1, height: 1, background: "#DDD6C8" }} />
        </div>

        {/* Values */}
        <div className="weave-bg" style={{ background: "#F5F0E8", padding: "88px 2rem" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div className="section-label" style={{ justifyContent: "center" }}>
                <span className="bk-mono" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9C2A2A" }}>What Drives Us</span>
              </div>
              <h2 className="bk-display" style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: "#0A3D2F" }}>Our Core Values</h2>
            </div>
            <div className="values-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
              {VALUES.map((v) => {
                const Icon = v.icon;
                return (
                  <div key={v.title} className="value-card">
                    <div style={{ width: 56, height: 56, borderRadius: 12, background: `${v.color}18`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                      <Icon style={{ width: 28, height: 28, color: v.color }} />
                    </div>
                    <h3 className="bk-display" style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: "#0A3D2F" }}>{v.title}</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "#4A4038" }}>{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Team */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "88px 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-label" style={{ justifyContent: "center" }}>
              <span className="bk-mono" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9C2A2A" }}>The Builders</span>
            </div>
            <h2 className="bk-display" style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: "#0A3D2F", marginBottom: 12 }}>
              Built by Group 5-HM3B
            </h2>
            <p style={{ fontSize: 16, color: "#4A4038", maxWidth: 560, margin: "0 auto" }}>
              Seven passionate students combining technology, design, and local knowledge to celebrate Bukidnon.
            </p>
          </div>

          <div className="team-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {GROUP_5_TEAM.map((member) => (
              <div key={member.uid} className="member-card" onClick={() => setSelectedMember(member)}>
                <div style={{ position: "absolute", top: -32, right: -32, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,122,74,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
                <div style={{ position: "relative", marginBottom: 16, display: "flex", justifyContent: "center" }}>
                  <div style={{ position: "relative" }}>
                    <img src={member.photoURL} alt={member.name} style={{ width: 88, height: 88, borderRadius: "50%", objectFit: "cover", border: "3px solid #2D7A4A", display: "block" }} />
                    <div style={{ position: "absolute", bottom: -2, right: -2, width: 24, height: 24, borderRadius: "50%", background: "#1E4D2B", border: "2px solid #F5F9F7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Star style={{ width: 11, height: 11, fill: "#F5C400", color: "#F5C400" }} />
                    </div>
                  </div>
                </div>
                <h3 className="bk-display" style={{ fontSize: 17, fontWeight: 700, color: "#0A3D2F", marginBottom: 2, textAlign: "center" }}>{member.name}</h3>
                <p className="bk-mono" style={{ fontSize: 9, color: "#2D7A4A", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10, textAlign: "center" }}>HM3B · Group 5</p>
                <p style={{ fontSize: 12, color: "#4A4038", lineHeight: 1.5, marginBottom: 12, minHeight: 36, textAlign: "center" }}>Passionate member of Group 5 contributing to BukidGo's mission.</p>
                <p style={{ fontSize: 10, color: "#2D7A4A", marginTop: 10, fontWeight: 600, opacity: 0.7, textAlign: "center" }}>Team Member ↗</p>
              </div>
            ))}

            {/* Filler team description card */}
            <div style={{ background: "linear-gradient(135deg, #0A3D2F, #1E4D2B)", borderRadius: 12, padding: 28, display: "flex", flexDirection: "column", justifyContent: "center", color: "#F5F0E8" }}>
              <Globe style={{ width: 32, height: 32, color: "#F5C400", marginBottom: 16 }} />
              <h3 className="bk-display" style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, lineHeight: 1.3 }}>Rooted in Bukidnon</h3>
              <p style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.82 }}>
                From agricultural specialists to mountain guides — our team embodies the diverse spirit of Bukidnon.
              </p>
            </div>
          </div>
        </div>

        {/* Tribe Stripe Footer */}
        <div className="tribe-stripe" />

        {/* Member Modal */}
        {selectedMember && (
          <div className="modal-overlay" onClick={() => setSelectedMember(null)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setSelectedMember(null)}>
                <X size={18} />
              </button>
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <img src={selectedMember.photoURL} alt={selectedMember.name} style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: "4px solid #2D7A4A", boxShadow: "0 8px 24px rgba(10,61,47,0.2)", marginBottom: 20 }} />
                <h2 className="bk-display" style={{ fontSize: 26, fontWeight: 700, color: "#0A3D2F", marginBottom: 4 }}>{selectedMember.name}</h2>
                <p className="bk-mono" style={{ fontSize: 10, color: "#2D7A4A", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 20 }}>Third Year · HM3B · Group 5</p>
                <p style={{ fontSize: 15, color: "#2D2D2D", lineHeight: 1.75, marginBottom: 24 }}>Dedicated member of Group 5, contributing to BukidGo's mission to showcase Bukidnon's beauty and culture.</p>
                <div style={{ background: "#F5F0E8", borderRadius: 10, padding: "14px 18px", border: "1px solid #DDD6C8", width: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                    <MapPin style={{ width: 14, height: 14, color: "#9C2A2A" }} />
                    <span style={{ fontSize: 13, color: "#4A4038" }}>Bukidnon, Philippines</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}