import { Briefcase, MapPin, Clock, ArrowUpRight, Star, Users, Leaf, Zap, ChevronDown, ChevronUp, Send, X } from "lucide-react";
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

  .perk-card {
    background: #fff;
    border: 1px solid #DDD6C8;
    border-radius: 12px;
    padding: 28px 24px;
    transition: all 0.25s ease;
    position: relative;
    overflow: hidden;
  }
  .perk-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    transform: scaleX(0);
    background: linear-gradient(90deg, #1E4D2B, #F5C400);
    transition: transform 0.3s ease;
    transform-origin: left;
  }
  .perk-card:hover { box-shadow: 0 12px 32px rgba(10,61,47,0.1); transform: translateY(-4px); }
  .perk-card:hover::after { transform: scaleX(1); }

  .job-row {
    background: #fff;
    border: 1.5px solid #DDD6C8;
    border-radius: 12px;
    padding: 28px 32px;
    margin-bottom: 16px;
    transition: all 0.25s ease;
    cursor: pointer;
  }
  .job-row:hover { border-color: #2D7A4A; box-shadow: 0 8px 24px rgba(10,61,47,0.08); }
  .job-row.open { border-color: #2D7A4A; box-shadow: 0 8px 24px rgba(10,61,47,0.1); }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 11px;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .apply-btn {
    padding: 12px 24px;
    background: linear-gradient(135deg, #0A3D2F, #1E4D2B);
    color: #F5F0E8;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 700;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.25s;
  }
  .apply-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(10,61,47,0.25); }

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
    padding: 40px;
    max-width: 520px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
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
    cursor: pointer; color: #0A3D2F; transition: all 0.2s;
  }
  .close-btn:hover { background: #1E4D2B; color: #F5F0E8; }
  .form-label {
    display: block;
    font-size: 11px;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #4A4038;
    margin-bottom: 7px;
  }
  .form-input {
    width: 100%;
    padding: 12px 14px;
    border: 1.5px solid #DDD6C8;
    border-radius: 6px;
    font-size: 14px;
    font-family: 'Outfit', sans-serif;
    color: #1A1208;
    background: #FAFAF7;
    outline: none;
    margin-bottom: 16px;
    transition: border-color 0.2s;
  }
  .form-input:focus { border-color: #2D7A4A; background: #fff; }

  @media (max-width: 768px) {
    .perks-grid { grid-template-columns: 1fr 1fr !important; }
    .job-header { flex-direction: column; align-items: flex-start !important; gap: 12px !important; }
  }
  @media (max-width: 480px) {
    .perks-grid { grid-template-columns: 1fr !important; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const PERKS = [
  { icon: Star, title: "Mission-Driven Work", desc: "Contribute to real cultural preservation and community uplift in Bukidnon.", color: "#F5C400" },
  { icon: Leaf, title: "Sustainable Culture", desc: "We practice what we preach — eco-conscious operations and responsible growth.", color: "#2D7A4A" },
  { icon: Users, title: "Tight-Knit Team", desc: "A small, passionate team where your ideas actually get implemented.", color: "#1E4D2B" },
  { icon: Zap, title: "Grow Fast", desc: "Startup pace with mentorship — you'll wear many hats and grow quickly.", color: "#C4622D" },
];

const JOBS = [
  {
    title: "Hotel Manager",
    dept: "Hospitality",
    type: "Full-time",
    location: "Bukidnon",
    desc: "Lead operations of a boutique highland resort or hotel. Oversee guest services, staff management, and ensure exceptional hospitality experiences that showcase Bukidnon's unique culture and natural beauty.",
    reqs: ["3+ years hospitality management", "Guest service excellence", "Staff leadership & training", "Budget & operations management"],
    badge: { label: "Open", bg: "#E6F7EE", color: "#1E4D2B" },
  },
  {
    title: "Event Coordinator",
    dept: "Events & Experiences",
    type: "Full-time",
    location: "Bukidnon",
    desc: "Plan and execute memorable events, tours, and cultural experiences for guests. Coordinate with local communities, manage logistics, and create authentic Bukidnon experiences that leave lasting impressions.",
    reqs: ["Event planning experience", "Vendor & logistics coordination", "Cultural sensitivity", "Strong organizational skills"],
    badge: { label: "Open", bg: "#E6F7EE", color: "#1E4D2B" },
  },
  {
    title: "Guest Services Manager",
    dept: "Customer Experience",
    type: "Full-time",
    location: "Bukidnon",
    desc: "Deliver exceptional guest experiences from arrival to departure. Manage guest relations, handle inquiries, resolve issues, and ensure every visitor feels welcomed and valued in Bukidnon.",
    reqs: ["Customer service excellence", "Problem-solving skills", "Multilingual preferred", "Hospitality background"],
    badge: { label: "Open", bg: "#E6F7EE", color: "#1E4D2B" },
  },
  {
    title: "Food & Beverage Manager",
    dept: "F&B Operations",
    type: "Full-time",
    location: "Bukidnon",
    desc: "Oversee dining operations and culinary experiences. Manage menus featuring local Bukidnon cuisine, supervise kitchen and service staff, and maintain quality standards that celebrate regional flavors.",
    reqs: ["F&B management experience", "Menu development", "Kitchen operations", "Food safety certification"],
    badge: { label: "Coming Soon", bg: "#F5F0E8", color: "#7A6E61" },
  },
];

export default function Careers() {
  const [openJob, setOpenJob] = useState<number | null>(null);
  const [applyJob, setApplyJob] = useState<typeof JOBS[0] | null>(null);
  const [form, setForm] = useState({ name: "", email: "", link: "", note: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setTimeout(() => { setSent(false); setApplyJob(null); setForm({ name: "", email: "", link: "", note: "" }); }, 3000);
    }, 1200);
  };

  return (
    <>
      <style>{S}</style>
      <div style={{ minHeight: "100vh", background: "#F5F5F0", paddingTop: 72, fontFamily: "'Outfit', sans-serif" }}>

        <div className="tribe-stripe" />

        {/* Hero */}
        <div className="weave-bg" style={{ background: "linear-gradient(155deg, #0A3D2F 0%, #1E4D2B 60%, #2D7A4A 100%)", color: "#F5F0E8", padding: "88px 2rem 80px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center" }}>
            <div>
              <div className="section-label">
                <span className="bk-mono" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#F5C400" }}>Join the Team</span>
              </div>
              <h1 className="bk-display" style={{ fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
                Build the Future of<br /><em style={{ color: "#F5C400" }}>Hospitality in Bukidnon</em>
              </h1>
              <p style={{ fontSize: 17, lineHeight: 1.8, opacity: 0.88, maxWidth: 520 }}>
                Join our team and help create world-class hospitality experiences that celebrate Bukidnon's culture, nature, and warmth. Shape the future of highland tourism.
              </p>
            </div>
            <div style={{ background: "rgba(245,196,0,0.12)", border: "1px solid rgba(245,196,0,0.3)", borderRadius: 16, padding: "28px 32px", textAlign: "center", minWidth: 160 }}>
              <div className="bk-display" style={{ fontSize: 48, fontWeight: 900, color: "#F5C400", lineHeight: 1 }}>3</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Open Roles</div>
            </div>
          </div>
        </div>

        {/* Perks */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="section-label" style={{ justifyContent: "center" }}>
              <span className="bk-mono" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9C2A2A" }}>Why BukidGo?</span>
            </div>
            <h2 className="bk-display" style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, color: "#0A3D2F" }}>What You'll Gain</h2>
          </div>
          <div className="perks-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {PERKS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="perk-card">
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: `${p.color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                    <Icon style={{ width: 24, height: 24, color: p.color }} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0A3D2F", marginBottom: 10 }}>{p.title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: "#4A4038" }}>{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 2rem", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ flex: 1, height: 1, background: "#DDD6C8" }} />
          {["◆", "◆", "◆"].map((d, i) => <span key={i} style={{ color: i === 1 ? "#F5C400" : "#9C2A2A", fontSize: i === 1 ? 14 : 10 }}>{d}</span>)}
          <div style={{ flex: 1, height: 1, background: "#DDD6C8" }} />
        </div>

        {/* Open Roles */}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "72px 2rem 88px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="section-label" style={{ justifyContent: "center" }}>
              <span className="bk-mono" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9C2A2A" }}>Open Positions</span>
            </div>
            <h2 className="bk-display" style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, color: "#0A3D2F" }}>Find Your Role</h2>
          </div>

          {JOBS.map((job, i) => (
            <div key={i} className={`job-row ${openJob === i ? "open" : ""}`} onClick={() => setOpenJob(openJob === i ? null : i)}>
              <div className="job-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                    <span className="badge" style={{ background: job.badge.bg, color: job.badge.color }}>{job.badge.label}</span>
                    <span className="badge" style={{ background: "#F5F0E8", color: "#7A6E61" }}>{job.dept}</span>
                  </div>
                  <h3 className="bk-display" style={{ fontSize: 22, fontWeight: 700, color: "#0A3D2F", marginBottom: 6 }}>{job.title}</h3>
                  <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, color: "#7A6E61", display: "flex", alignItems: "center", gap: 5 }}><Clock style={{ width: 13, height: 13 }} />{job.type}</span>
                    <span style={{ fontSize: 13, color: "#7A6E61", display: "flex", alignItems: "center", gap: 5 }}><MapPin style={{ width: 13, height: 13 }} />{job.location}</span>
                  </div>
                </div>
                <div style={{ flexShrink: 0, color: "#2D7A4A" }}>
                  {openJob === i ? <ChevronUp style={{ width: 20, height: 20 }} /> : <ChevronDown style={{ width: 20, height: 20 }} />}
                </div>
              </div>

              {openJob === i && (
                <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid #E8E0D5", animation: "fadeIn 0.2s ease" }}>
                  <p style={{ fontSize: 15, lineHeight: 1.8, color: "#2D2D2D", marginBottom: 20 }}>{job.desc}</p>
                  <div style={{ marginBottom: 24 }}>
                    <p className="bk-mono" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9C2A2A", marginBottom: 12 }}>What We're Looking For</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {job.reqs.map((r, j) => (
                        <span key={j} style={{ fontSize: 12, background: "#F5F0E8", color: "#0A3D2F", border: "1px solid #DDD6C8", padding: "6px 12px", borderRadius: 4, fontWeight: 600 }}>◆ {r}</span>
                      ))}
                    </div>
                  </div>
                  {job.badge.label !== "Coming Soon" && (
                    <button className="apply-btn" onClick={e => { e.stopPropagation(); setApplyJob(job); }}>
                      Apply Now <ArrowUpRight style={{ width: 15, height: 15 }} />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Open call */}
          <div style={{ marginTop: 40, background: "linear-gradient(135deg, #0A3D2F, #1E4D2B)", borderRadius: 12, padding: "32px 36px", display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <h3 className="bk-display" style={{ fontSize: 20, fontWeight: 700, color: "#F5F0E8", marginBottom: 8 }}>Don't see your fit?</h3>
              <p style={{ fontSize: 14, color: "#B8D4C4", lineHeight: 1.7 }}>We're always open to passionate people. Send an open application and we'll be in touch.</p>
            </div>
            <button className="apply-btn" onClick={() => setApplyJob({ title: "Open Application", dept: "Any", type: "Open", location: "Remote", desc: "", reqs: [], badge: { label: "Open", bg: "", color: "" } })}>
              Send Open Application <Send style={{ width: 15, height: 15 }} />
            </button>
          </div>
        </div>

        <div className="tribe-stripe" />

        {/* Apply Modal */}
        {applyJob && (
          <div className="modal-overlay" onClick={() => setApplyJob(null)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setApplyJob(null)}><X size={18} /></button>
              {sent ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#E6F7EE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <Star style={{ width: 28, height: 28, color: "#2D7A4A" }} />
                  </div>
                  <h3 className="bk-display" style={{ fontSize: 22, fontWeight: 700, color: "#0A3D2F", marginBottom: 8 }}>Application Sent!</h3>
                  <p style={{ fontSize: 14, color: "#4A4038" }}>We'll review your application and get back to you within 5–7 days.</p>
                </div>
              ) : (
                <>
                  <p className="bk-mono" style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9C2A2A", marginBottom: 6 }}>Applying for</p>
                  <h2 className="bk-display" style={{ fontSize: 24, fontWeight: 700, color: "#0A3D2F", marginBottom: 24 }}>{applyJob.title}</h2>
                  <form onSubmit={handleApply}>
                    <label className="form-label">Full Name</label>
                    <input className="form-input" type="text" placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    <label className="form-label">Email Address</label>
                    <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    <label className="form-label">Portfolio / LinkedIn / GitHub (optional)</label>
                    <input className="form-input" type="url" placeholder="https://" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} />
                    <label className="form-label">Why BukidGo?</label>
                    <textarea className="form-input" rows={4} placeholder="Tell us a bit about yourself and why you want to join..." value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} required style={{ resize: "vertical" }} />
                    <button type="submit" style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #0A3D2F, #1E4D2B)", color: "#F5F0E8", border: "none", borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }} disabled={loading}>
                      {loading ? <><div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Sending...</> : <>Submit Application <Send style={{ width: 15, height: 15 }} /></>}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    </>
  );
}