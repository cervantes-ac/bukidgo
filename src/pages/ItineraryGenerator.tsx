import { useState, useRef } from "react";
import { Sparkles, Send, Calendar, MapPin, Clock, DollarSign, Edit2, Download, Plus, Trash2, Save, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import jsPDF from "jspdf";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
  .bk-display { font-family: 'Fraunces', Georgia, serif; }
  .bk-mono { font-family: 'JetBrains Mono', monospace; }
  input, textarea, select { font-family: 'Outfit', sans-serif; color: #1A1208; }
  .form-input {
    width: 100%; background: #EDE7DC; border: 1px solid #DDD6C8;
    padding: 12px 14px; font-size: 14px; color: #1A1208;
    outline: none; transition: border-color 0.15s; border-radius: 2px;
  }
  .form-input::placeholder { color: #B8B0A4; }
  .form-input:focus { border-color: #C4622D; }
  .type-btn {
    padding: 16px; background: #EDE7DC; border: 1px solid #DDD6C8;
    cursor: pointer; text-align: left; transition: all 0.15s; border-radius: 2px;
  }
  .type-btn:hover { border-color: #C4622D; }
  .type-btn.active { background: #C4622D; border-color: #C4622D; }
  .type-btn.active .type-label { color: #F5F0E8 !important; }
  .type-btn.active .type-icon { opacity: 1; }
  .budget-btn {
    flex: 1; padding: 12px 8px; background: #EDE7DC; border: 1px solid #DDD6C8;
    cursor: pointer; text-align: center; transition: all 0.15s; border-radius: 2px;
  }
  .budget-btn.active { background: #1A1208; border-color: #1A1208; }
  .budget-btn.active .budget-label { color: #D4A853 !important; }
  .budget-btn.active .budget-sub { color: rgba(245,240,232,0.4) !important; }
  .activity-row { background: #fff; border-bottom: 1px solid #F5F0E8; transition: background 0.1s; }
  .activity-row:hover { background: #FEFCF9; }
  .edit-field { background: #EDE7DC; border: 1px solid #DDD6C8; padding: 6px 10px; font-size: 13px; color: #1A1208; border-radius: 2px; outline: none; }
  .edit-field:focus { border-color: #C4622D; }
  .result-scroll::-webkit-scrollbar { width: 4px; }
  .result-scroll::-webkit-scrollbar-thumb { background: #DDD6C8; border-radius: 99px; }
  input[type="range"] { accent-color: #C4622D; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
  .dot { animation: pulse 1.2s ease infinite; }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }
`;

interface Itinerary {
  title: string; summary: string;
  days: { day: number; activities: { time: string; activity: string; location: string; description: string; }[]; }[];
  estimatedCost: string; tips: string[];
}

export default function ItineraryGenerator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const itineraryRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ tripType: "adventure", duration: "2", budget: "mid-range", preferences: "" });

  const tripTypes = [
    { id: "adventure", label: "Adventure", icon: "🏔️" },
    { id: "nature", label: "Nature", icon: "🌿" },
    { id: "culture", label: "Culture", icon: "🏛️" },
    { id: "food", label: "Food Tour", icon: "🍽️" },
  ];
  const budgets = [
    { id: "budget", label: "Budget", sub: "₱500–1k/day" },
    { id: "mid-range", label: "Mid Range", sub: "₱1k–3k/day" },
    { id: "premium", label: "Premium", sub: "₱3k+/day" },
  ];

  const downloadPDF = () => {
    if (!itinerary) return;
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(22); doc.text(itinerary.title, 20, y); y += 10;
    doc.setFontSize(12);
    const sumLines = doc.splitTextToSize(itinerary.summary, 170);
    doc.text(sumLines, 20, y); y += sumLines.length * 7 + 5;
    itinerary.days.forEach(day => {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFontSize(16); doc.text(`Day ${day.day}`, 20, y); y += 10;
      day.activities.forEach(act => {
        if (y > 250) { doc.addPage(); y = 20; }
        doc.setFontSize(12); doc.text(`${act.time} - ${act.activity} (${act.location})`, 25, y); y += 7;
        const dl = doc.splitTextToSize(act.description, 160);
        doc.setFontSize(10); doc.text(dl, 30, y); y += dl.length * 5 + 5;
      });
    });
    doc.save(`BukidGo-${itinerary.title}.pdf`);
  };

  const editActivity = (di: number, ai: number, field: string, val: string) => {
    if (!itinerary) return;
    const n = { ...itinerary };
    (n.days[di].activities[ai] as any)[field] = val;
    setItinerary(n);
  };

  const addActivity = (di: number) => {
    if (!itinerary) return;
    const n = { ...itinerary };
    n.days[di].activities.push({ time: "12:00 PM", activity: "New Activity", location: "Bukidnon", description: "Description here..." });
    setItinerary(n);
  };

  const removeActivity = (di: number, ai: number) => {
    if (!itinerary) return;
    const n = { ...itinerary };
    n.days[di].activities.splice(ai, 1);
    setItinerary(n);
  };

  const generateItinerary = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Generate a travel itinerary for Bukidnon, Philippines.
          Trip Type: ${formData.tripType}
          Duration: ${formData.duration} days
          Budget: ${formData.budget}
          Additional Preferences: ${formData.preferences}
          Return ONLY a JSON object: { "title":"...","summary":"...","days":[{"day":1,"activities":[{"time":"08:00 AM","activity":"...","location":"...","description":"..."}]}],"estimatedCost":"...","tips":["..."] }`
        })
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Failed"); }
      const data = await res.json();
      const text = data.text.replace(/```json|```/g, "").trim();
      setItinerary(JSON.parse(text));
    } catch (err: any) {
      setError(err.message || "Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{S}</style>
      <div style={{ fontFamily: "'Outfit', sans-serif", background: "#F5F0E8", color: "#1A1208", minHeight: "100vh" }}>

        {/* Header */}
        <div style={{ background: "#1A1208", padding: "64px 2rem 48px", borderBottom: "1px solid rgba(245,240,232,0.06)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div className="bk-mono" style={{ fontSize: 10, color: "#D4A853", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
              <Sparkles style={{ width: 12, height: 12 }} />
              AI-Powered · Bukidnon
            </div>
            <h1 className="bk-display" style={{ fontSize: "clamp(2.5rem,6vw,5.5rem)", fontWeight: 900, color: "#F5F0E8", lineHeight: 0.95, marginBottom: 16 }}>
              Smart Itinerary<br /><em style={{ color: "#D4A853" }}>Generator</em>
            </h1>
            <p style={{ fontSize: 15, color: "rgba(245,240,232,0.4)", fontWeight: 300, maxWidth: 440 }}>
              Tell us what you love — get a tailored multi-day Bukidnon plan in seconds.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 2rem 80px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 32, alignItems: "start" }}>

            {/* Form */}
            <div style={{ background: "#fff", border: "1px solid #DDD6C8", padding: "32px" }}>
              {error && (
                <div style={{ marginBottom: 20, padding: "12px 16px", background: "rgba(196,98,45,0.08)", border: "1px solid rgba(196,98,45,0.25)", borderRadius: 2, fontSize: 13, color: "#C4622D" }}>
                  {error}
                </div>
              )}

              {/* Trip type */}
              <div style={{ marginBottom: 28 }}>
                <div className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Trip Type</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {tripTypes.map(t => (
                    <button key={t.id} onClick={() => setFormData({ ...formData, tripType: t.id })}
                      className={`type-btn ${formData.tripType === t.id ? "active" : ""}`}>
                      <span style={{ fontSize: 22, display: "block", marginBottom: 6, opacity: formData.tripType === t.id ? 1 : 0.6 }}>{t.icon}</span>
                      <span className="type-label" style={{ fontSize: 13, fontWeight: 600, color: formData.tripType === t.id ? "#F5F0E8" : "#7A6E61" }}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div style={{ marginBottom: 28 }}>
                <div className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
                  Duration — <span style={{ color: "#C4622D" }}>{formData.duration} day{Number(formData.duration) !== 1 ? "s" : ""}</span>
                </div>
                <input type="range" min="1" max="7" value={formData.duration}
                  onChange={e => setFormData({ ...formData, duration: e.target.value })}
                  style={{ width: "100%", height: "2px" }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  {["1","2","3","4","5","6","7"].map(n => (
                    <span key={n} className="bk-mono" style={{ fontSize: 10, color: formData.duration === n ? "#C4622D" : "#DDD6C8" }}>{n}</span>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div style={{ marginBottom: 28 }}>
                <div className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Budget Level</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {budgets.map(b => (
                    <button key={b.id} onClick={() => setFormData({ ...formData, budget: b.id })}
                      className={`budget-btn ${formData.budget === b.id ? "active" : ""}`}>
                      <p className="budget-label" style={{ fontSize: 12, fontWeight: 700, color: formData.budget === b.id ? "#D4A853" : "#7A6E61" }}>{b.label}</p>
                      <p className="budget-sub" style={{ fontSize: 10, marginTop: 2, color: formData.budget === b.id ? "rgba(245,240,232,0.4)" : "#B8B0A4" }}>{b.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div style={{ marginBottom: 28 }}>
                <div className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Specific Interests</div>
                <textarea placeholder="e.g. I love coffee, waterfalls, photography..." value={formData.preferences}
                  onChange={e => setFormData({ ...formData, preferences: e.target.value })}
                  rows={3} className="form-input" style={{ resize: "none" }} />
              </div>

              <button onClick={generateItinerary} disabled={loading}
                style={{ width: "100%", padding: "16px", background: loading ? "#DDD6C8" : "#C4622D", color: loading ? "#B8B0A4" : "#F5F0E8", border: "none", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 2, transition: "background 0.15s" }}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ display: "flex", gap: 3 }}>
                      <span className="dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#B8B0A4", display: "inline-block" }} />
                      <span className="dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#B8B0A4", display: "inline-block" }} />
                      <span className="dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#B8B0A4", display: "inline-block" }} />
                    </span>
                    Generating…
                  </span>
                ) : (
                  <><Send style={{ width: 15, height: 15 }} /> Generate Itinerary</>
                )}
              </button>
            </div>

            {/* Result */}
            <div>
              <AnimatePresence mode="wait">
                {itinerary ? (
                  <motion.div key="result" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* Action bar */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setIsEditing(!isEditing)}
                        style={{ flex: 1, padding: "12px", background: isEditing ? "#1A1208" : "transparent", color: isEditing ? "#F5F0E8" : "#7A6E61", border: "1px solid", borderColor: isEditing ? "#1A1208" : "#DDD6C8", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 2 }}>
                        {isEditing ? <><Save style={{ width: 14, height: 14 }} /> Done</> : <><Edit2 style={{ width: 14, height: 14 }} /> Edit Plan</>}
                      </button>
                      <button onClick={downloadPDF}
                        style={{ padding: "12px 20px", background: "transparent", color: "#7A6E61", border: "1px solid #DDD6C8", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, borderRadius: 2 }}>
                        <Download style={{ width: 14, height: 14 }} /> PDF
                      </button>
                    </div>

                    {/* Summary */}
                    <div ref={itineraryRef} style={{ background: "#1A1208", padding: "36px", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,168,83,0.1), transparent)" }} />
                      <div style={{ position: "relative" }}>
                        <h2 className="bk-display" style={{ fontSize: 28, fontWeight: 900, color: "#F5F0E8", marginBottom: 10 }}>{itinerary.title}</h2>
                        <p style={{ fontSize: 14, color: "rgba(245,240,232,0.45)", fontWeight: 300, lineHeight: 1.7, marginBottom: 20 }}>{itinerary.summary}</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {[
                            { icon: Clock, label: `${formData.duration} Days` },
                            { icon: DollarSign, label: itinerary.estimatedCost },
                            { icon: Sparkles, label: formData.budget },
                          ].map(({ icon: Icon, label }) => (
                            <span key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, padding: "6px 12px", background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.2)", color: "#D4A853" }}>
                              <Icon style={{ width: 12, height: 12 }} /> {label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Days */}
                    {itinerary.days?.map((day) => (
                      <div key={day.day}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0", borderBottom: "2px solid #1A1208" }}>
                          <div style={{ width: 32, height: 32, background: "#C4622D", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span className="bk-mono" style={{ fontSize: 11, fontWeight: 700, color: "#F5F0E8" }}>{String(day.day).padStart(2, "0")}</span>
                          </div>
                          <h3 className="bk-display" style={{ fontSize: 20, fontWeight: 700, color: "#1A1208" }}>Day {day.day}</h3>
                        </div>
                        <div>
                          {day.activities?.map((act, i) => (
                            <div key={i} className="activity-row" style={{ padding: "20px 0", display: "flex", gap: 16, alignItems: "flex-start" }}>
                              {isEditing ? (
                                <input value={act.time} onChange={e => editActivity(day.day - 1, i, "time", e.target.value)}
                                  className="edit-field bk-mono" style={{ width: 100, flexShrink: 0, fontSize: 10 }} />
                              ) : (
                                <span className="bk-mono" style={{ fontSize: 10, color: "#C4622D", background: "rgba(196,98,45,0.08)", padding: "4px 10px", border: "1px solid rgba(196,98,45,0.15)", flexShrink: 0, marginTop: 2, whiteSpace: "nowrap" }}>{act.time}</span>
                              )}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                {isEditing ? (
                                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    <input value={act.activity} onChange={e => editActivity(day.day - 1, i, "activity", e.target.value)}
                                      className="edit-field" style={{ fontWeight: 600, fontSize: 14 }} />
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                      <MapPin style={{ width: 12, height: 12, color: "#B8B0A4", flexShrink: 0 }} />
                                      <input value={act.location} onChange={e => editActivity(day.day - 1, i, "location", e.target.value)}
                                        className="edit-field" style={{ flex: 1, fontSize: 12 }} />
                                    </div>
                                    <textarea value={act.description} onChange={e => editActivity(day.day - 1, i, "description", e.target.value)}
                                      rows={2} className="edit-field" style={{ resize: "none", fontSize: 12 }} />
                                  </div>
                                ) : (
                                  <>
                                    <h4 style={{ fontWeight: 600, fontSize: 15, color: "#1A1208", marginBottom: 4 }}>{act.activity}</h4>
                                    <p style={{ fontSize: 12, color: "#B8B0A4", display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                                      <MapPin style={{ width: 12, height: 12 }} />
                                      {typeof act.location === "string" ? act.location : (act.location as any)?.address || JSON.stringify(act.location)}
                                    </p>
                                    <p style={{ fontSize: 13, color: "#7A6E61", fontWeight: 300, lineHeight: 1.6 }}>{act.description}</p>
                                  </>
                                )}
                              </div>
                              {isEditing && (
                                <button onClick={() => removeActivity(day.day - 1, i)}
                                  style={{ padding: 6, background: "rgba(196,98,45,0.08)", border: "1px solid rgba(196,98,45,0.2)", borderRadius: 2, cursor: "pointer", color: "#C4622D", display: "flex", flexShrink: 0 }}>
                                  <Trash2 style={{ width: 13, height: 13 }} />
                                </button>
                              )}
                            </div>
                          ))}
                          {isEditing && (
                            <button onClick={() => addActivity(day.day - 1)}
                              style={{ width: "100%", padding: "12px", background: "transparent", border: "1px dashed #DDD6C8", color: "#B8B0A4", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 8, borderRadius: 2 }}>
                              <Plus style={{ width: 14, height: 14 }} /> Add Activity
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Tips */}
                    <div style={{ background: "#FAF7F2", border: "1px solid #DDD6C8", padding: "32px" }}>
                      <div className="bk-mono" style={{ fontSize: 9, color: "#C4622D", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                        <Sparkles style={{ width: 12, height: 12 }} /> Expert Tips
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                        {itinerary.tips?.map((tip, i) => (
                          <div key={i} style={{ display: "flex", gap: 10, padding: "14px 16px", background: "#fff", border: "1px solid #EDE7DC" }}>
                            <div style={{ width: 4, height: 4, background: "#D4A853", borderRadius: "50%", marginTop: 6, flexShrink: 0 }} />
                            <p style={{ fontSize: 13, color: "#7A6E61", fontWeight: 300, lineHeight: 1.6 }}>{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ minHeight: 500, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "1px dashed #DDD6C8", padding: "64px 32px", textAlign: "center" }}>
                    <div style={{ width: 80, height: 80, background: "rgba(196,98,45,0.06)", border: "1px solid rgba(196,98,45,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                      <Sparkles style={{ width: 32, height: 32, color: "rgba(196,98,45,0.3)" }} />
                    </div>
                    <h3 className="bk-display" style={{ fontSize: 24, fontWeight: 900, color: "#DDD6C8", marginBottom: 8 }}>Your plan awaits</h3>
                    <p style={{ fontSize: 14, color: "#B8B0A4", fontWeight: 300, maxWidth: 300, lineHeight: 1.6 }}>
                      Set your preferences on the left and hit generate to create your personalized Bukidnon itinerary.
                    </p>
                    <div style={{ display: "flex", gap: 8, marginTop: 28, flexWrap: "wrap", justifyContent: "center" }}>
                      {["Adventure", "Nature", "Culture", "Food"].map(t => (
                        <span key={t} style={{ fontSize: 11, padding: "6px 12px", border: "1px solid #DDD6C8", color: "#B8B0A4" }}>{t}</span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}