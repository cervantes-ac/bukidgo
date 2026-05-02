import { Mail, Phone, MapPin, Send, MessageCircle, Clock, CheckCircle } from "lucide-react";
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

  .contact-info-card {
    display: flex;
    gap: 20px;
    padding: 24px;
    background: #fff;
    border: 1px solid #DDD6C8;
    border-radius: 12px;
    transition: all 0.25s ease;
  }
  .contact-info-card:hover {
    border-color: #2D7A4A;
    box-shadow: 0 8px 24px rgba(10,61,47,0.08);
    transform: translateX(4px);
  }

  .form-field {
    margin-bottom: 20px;
  }
  .form-label {
    display: block;
    font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #4A4038;
    margin-bottom: 8px;
  }
  .form-input {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid #DDD6C8;
    border-radius: 6px;
    font-size: 15px;
    font-family: 'Outfit', sans-serif;
    color: #1A1208;
    background: #FAFAF7;
    outline: none;
    transition: all 0.2s;
  }
  .form-input:focus {
    border-color: #2D7A4A;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(45,122,74,0.1);
  }
  .form-input::placeholder { color: #AFA89E; }

  .submit-btn {
    width: 100%;
    padding: 15px 24px;
    background: linear-gradient(135deg, #0A3D2F 0%, #1E4D2B 100%);
    color: #F5F0E8;
    border: none;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 700;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
    letter-spacing: 0.02em;
  }
  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(10,61,47,0.3);
  }
  .submit-btn:active { transform: translateY(0); }

  .faq-item {
    border-bottom: 1px solid #E8E0D5;
    padding: 20px 0;
  }
  .faq-item:last-child { border-bottom: none; }

  @media (max-width: 768px) {
    .contact-grid { grid-template-columns: 1fr !important; }
    .faq-grid { grid-template-columns: 1fr !important; }
  }
`;

const CONTACT_ITEMS = [
  { icon: Mail, label: "Email Us", value: "hello@bukidgo.com", sub: "We reply within 24 hours", color: "#1E4D2B" },
  { icon: Phone, label: "Call Us", value: "+63 (0) 123 456 7890", sub: "Mon – Fri, 8am to 5pm", color: "#9C2A2A" },
  { icon: MapPin, label: "Find Us", value: "Bukidnon, Philippines", sub: "Northern Mindanao Region X", color: "#2D7A4A" },
  { icon: Clock, label: "Office Hours", value: "Mon – Fri: 8am – 5pm", sub: "Sat: 9am – 12pm", color: "#C4622D" },
];

const FAQS = [
  { q: "How do I book a local guide?", a: "Browse our Guides page, select your preferred guide, and click Book. You'll receive confirmation within 2 hours." },
  { q: "Are the guides verified?", a: "Yes. All guides undergo background checks, local expertise interviews, and community verification before listing." },
  { q: "Can I cancel a booking?", a: "Cancellations made 48 hours before are fully refunded. Within 48 hours, a 50% cancellation fee applies." },
  { q: "How do I list my business?", a: "Contact us via this form with the subject 'List My Business' and our team will onboard you within 3–5 business days." },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 4000);
    }, 1200);
  };

  return (
    <>
      <style>{S}</style>
      <div style={{ minHeight: "100vh", background: "#F5F5F0", paddingTop: 72, fontFamily: "'Outfit', sans-serif" }}>

        <div className="tribe-stripe" />

        {/* Hero */}
        <div className="weave-bg" style={{ background: "linear-gradient(155deg, #0A3D2F 0%, #1E4D2B 60%, #2D7A4A 100%)", color: "#F5F0E8", padding: "88px 2rem 80px", textAlign: "center" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>
              <span className="bk-mono" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#F5C400" }}>Say Hello</span>
            </div>
            <h1 className="bk-display" style={{ fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 900, marginBottom: 20, lineHeight: 1.1 }}>
              Get in <em style={{ color: "#F5C400", fontStyle: "italic" }}>Touch</em>
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.8, opacity: 0.88 }}>
              Have a question, feedback, or want to partner with us? We'd love to hear from you — our team is always listening.
            </p>
          </div>
        </div>

        {/* Contact Cards */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 2rem 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {CONTACT_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="contact-info-card">
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: `${item.color}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon style={{ width: 22, height: 22, color: item.color }} />
                  </div>
                  <div>
                    <p className="bk-mono" style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9C8F82", marginBottom: 4 }}>{item.label}</p>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#1A1208", marginBottom: 2 }}>{item.value}</p>
                    <p style={{ fontSize: 12, color: "#7A6E61" }}>{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main contact area */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 2rem 88px" }}>
          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>

            {/* Left: Form */}
            <div>
              <div className="section-label">
                <span className="bk-mono" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9C2A2A" }}>Message Us</span>
              </div>
              <h2 className="bk-display" style={{ fontSize: 32, fontWeight: 700, color: "#0A3D2F", marginBottom: 8 }}>Send a Message</h2>
              <p style={{ fontSize: 15, color: "#4A4038", marginBottom: 36, lineHeight: 1.7 }}>Fill out the form and we'll get back to you within one business day.</p>

              {submitted ? (
                <div style={{ background: "#F0FAF4", border: "1.5px solid #2D7A4A", borderRadius: 12, padding: 40, textAlign: "center" }}>
                  <CheckCircle style={{ width: 48, height: 48, color: "#2D7A4A", margin: "0 auto 16px" }} />
                  <h3 className="bk-display" style={{ fontSize: 22, fontWeight: 700, color: "#0A3D2F", marginBottom: 8 }}>Message Sent!</h3>
                  <p style={{ fontSize: 14, color: "#4A4038" }}>We'll get back to you within 24 hours. Thank you for reaching out!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ background: "#fff", border: "1px solid #DDD6C8", borderRadius: 12, padding: 36 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div className="form-field">
                      <label className="form-label">Full Name</label>
                      <input className="form-input" type="text" placeholder="Your name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Email</label>
                      <input className="form-input" type="email" placeholder="your@email.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Subject</label>
                    <select className="form-input" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} required style={{ cursor: "pointer" }}>
                      <option value="">Select a topic</option>
                      <option>General Inquiry</option>
                      <option>Guide Booking Help</option>
                      <option>List My Business</option>
                      <option>Partnership</option>
                      <option>Bug Report</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Message</label>
                    <textarea className="form-input" rows={5} placeholder="Tell us how we can help..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} required style={{ resize: "vertical" }} />
                  </div>
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading
                      ? <><div style={{ width: 18, height: 18, border: "2px solid rgba(245,240,232,0.3)", borderTopColor: "#F5F0E8", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Sending...</>
                      : <><Send style={{ width: 17, height: 17 }} /> Send Message</>
                    }
                  </button>
                </form>
              )}
            </div>

            {/* Right: FAQ */}
            <div>
              <div className="section-label">
                <span className="bk-mono" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9C2A2A" }}>Quick Help</span>
              </div>
              <h2 className="bk-display" style={{ fontSize: 32, fontWeight: 700, color: "#0A3D2F", marginBottom: 8 }}>Common Questions</h2>
              <p style={{ fontSize: 15, color: "#4A4038", marginBottom: 36, lineHeight: 1.7 }}>Most answers are right here — save yourself a message.</p>

              <div style={{ background: "#fff", border: "1px solid #DDD6C8", borderRadius: 12, padding: "8px 28px 8px" }}>
                {FAQS.map((faq, i) => (
                  <div key={i} className="faq-item">
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ color: "#F5C400", fontWeight: 900, fontSize: 18, lineHeight: 1.4, flexShrink: 0 }}>◆</span>
                      <div>
                        <h4 style={{ fontSize: 15, fontWeight: 700, color: "#0A3D2F", marginBottom: 6 }}>{faq.q}</h4>
                        <p style={{ fontSize: 14, color: "#4A4038", lineHeight: 1.7 }}>{faq.a}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live chat nudge */}
              <div style={{ marginTop: 24, background: "linear-gradient(135deg, #0A3D2F, #1E4D2B)", borderRadius: 12, padding: "24px 28px", display: "flex", gap: 16, alignItems: "center" }}>
                <MessageCircle style={{ width: 32, height: 32, color: "#F5C400", flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: "#F5F0E8", marginBottom: 4 }}>Still need help?</h4>
                  <p style={{ fontSize: 13, color: "#B8D4C4", lineHeight: 1.6 }}>Our team is available via email and we aim to respond within 24 hours on weekdays.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="tribe-stripe" />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );
}