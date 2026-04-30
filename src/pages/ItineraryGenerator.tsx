import { useState, useRef } from "react";
import { Sparkles, Send, Clock, DollarSign, Edit2, Download, Plus, Trash2, Save, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import jsPDF from "jspdf";
import { colors } from "../theme";

// Bukidnon Green Mountain Theme
const THEME = {
  darkBg: "#1B4D2E",
  mainBg: "#F5F9F7",
  primaryAccent: "#2D7A4A",
  secondaryAccent: "#7BC97F",
  text: "#1A3A2A",
  borders: "#C8DDD4",
  earthBrown: "#8B6F47",
  goldenAccent: "#D4A574",
  lightText: "rgba(232, 243, 237, 0.4)",
  darkText: "#1A1208",
  lightBg: "#F5F0E8",
  brownAccent: "#C4622D",
};

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
  .bk-display { font-family: 'Fraunces', Georgia, serif; }
  .bk-mono { font-family: 'JetBrains Mono', monospace; }
  input, textarea, select { font-family: 'Outfit', sans-serif; color: #1A3A2A; }
  .form-input {
    width: 100%; background: #E8F3ED; border: 1px solid #C8DDD4;
    padding: 12px 14px; font-size: 14px; color: #1A3A2A;
    outline: none; transition: border-color 0.15s; border-radius: 2px;
  }
  .form-input::placeholder { color: #8B6F47; }
  .form-input:focus { border-color: #2D7A4A; }
  .type-btn {
    padding: 16px; background: #E8F3ED; border: 1px solid #C8DDD4;
    cursor: pointer; text-align: left; transition: all 0.15s; border-radius: 2px;
  }
  .type-btn:hover { border-color: #2D7A4A; }
  .type-btn.active { background: #2D7A4A; border-color: #2D7A4A; }
  .type-btn.active .type-label { color: #F5F9F7 !important; }
  .budget-btn {
    flex: 1; padding: 12px 8px; background: #E8F3ED; border: 1px solid #C8DDD4;
    cursor: pointer; text-align: center; transition: all 0.15s; border-radius: 2px;
  }
  .budget-btn.active { background: #1B4D2E; border-color: #1B4D2E; }
  .budget-btn.active .budget-label { color: #D4A574 !important; }
  .budget-btn.active .budget-sub { color: rgba(232, 243, 237, 0.4) !important; }
  .activity-row { background: #fff; border-bottom: 1px solid #E8F3ED; transition: background 0.1s; }
  .activity-row:hover { background: #F5F9F7; }
  .edit-field { background: #E8F3ED; border: 1px solid #C8DDD4; padding: 6px 10px; font-size: 13px; color: #1A3A2A; border-radius: 2px; outline: none; }
  .edit-field:focus { border-color: #2D7A4A; }
  input[type="range"] { accent-color: #2D7A4A; }
  @keyframes pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
  .dot { animation: pulse 1.2s ease infinite; }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }
  @media (min-width: 768px) {
    .itinerary-grid { grid-template-columns: 380px 1fr !important; }
  }
`;

interface Activity {
  time: string;
  activity: string;
  location: string;
  description: string;
}

interface Day {
  day: number;
  activities: Activity[];
}

interface Itinerary {
  title: string;
  summary: string;
  days: Day[];
  estimatedCost: string;
  tips: string[];
}

export default function ItineraryGenerator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const itineraryRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    tripType: "adventure",
    duration: "2",
    budget: "mid-range",
    preferences: "",
  });

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
    doc.setFontSize(22);
    doc.text(itinerary.title, 20, y);
    y += 10;
    doc.setFontSize(12);
    const sumLines = doc.splitTextToSize(itinerary.summary, 170);
    doc.text(sumLines, 20, y);
    y += sumLines.length * 7 + 5;
    itinerary.days.forEach((day) => {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFontSize(16);
      doc.text(`Day ${day.day}`, 20, y);
      y += 10;
      day.activities.forEach((act) => {
        if (y > 250) { doc.addPage(); y = 20; }
        doc.setFontSize(12);
        doc.text(`${act.time} - ${act.activity} (${act.location})`, 25, y);
        y += 7;
        const dl = doc.splitTextToSize(act.description, 160);
        doc.setFontSize(10);
        doc.text(dl, 30, y);
        y += dl.length * 5 + 5;
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
    n.days[di].activities.push({
      time: "12:00 PM",
      activity: "New Activity",
      location: "Bukidnon",
      description: "Description here...",
    });
    setItinerary(n);
  };

  const removeActivity = (di: number, ai: number) => {
    if (!itinerary) return;
    const n = { ...itinerary };
    n.days[di].activities.splice(ai, 1);
    setItinerary(n);
  };

  const generateItinerary = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock data generation instead of API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      const mockItineraries = {
        adventure: {
          title: "Bukidnon Adventure Expedition",
          summary: "An action-packed journey through Bukidnon's most thrilling landscapes, featuring mountain treks, river adventures, and cultural encounters.",
          days: [
            {
              day: 1,
              activities: [
                { time: "08:00 AM", activity: "Arrival & Check-in", location: "Dahilayan Adventure Park", description: "Arrive at your accommodation and get settled. Brief orientation about the adventure ahead." },
                { time: "10:00 AM", activity: "Zipline Adventure", location: "Dahilayan Zipline", description: "Experience Asia's longest dual zipline with breathtaking views of the mountain ranges." },
                { time: "01:00 PM", activity: "Lunch with Local Cuisine", location: "Bukidnon Farm Restaurant", description: "Enjoy authentic Binaki (steamed corn cake) and other local delicacies." },
                { time: "03:00 PM", activity: "ATV Trail Riding", location: "Mountain ATV Trails", description: "Navigate through rugged terrain on all-terrain vehicles with experienced guides." }
              ]
            },
            {
              day: 2,
              activities: [
                { time: "07:00 AM", activity: "Mount Kitanglad Trek", location: "Kitanglad Range Natural Park", description: "Moderate hike through protected forest with chance to see rare Philippine eagles." },
                { time: "12:00 PM", activity: "Picnic Lunch", location: "Nasuli Spring", description: "Freshwater spring picnic with locally sourced fruits and vegetables." },
                { time: "02:00 PM", activity: "Waterfall Exploration", location: "Mantianak Falls", description: "Discover hidden waterfalls and natural pools perfect for swimming." }
              ]
            }
          ],
          estimatedCost: "₱3,500 - ₱5,000",
          tips: [
            "Wear comfortable hiking shoes with good grip",
            "Bring waterproof bags for electronics",
            "Stay hydrated - carry at least 2L water per person",
            "Respect local indigenous communities and their traditions"
          ]
        },
        nature: {
          title: "Bukidnon Nature Immersion",
          summary: "A serene journey through Bukidnon's pristine natural wonders, from pine forests to organic farms and tranquil waterfalls.",
          days: [
            {
              day: 1,
              activities: [
                { time: "09:00 AM", activity: "Pine Forest Walk", location: "Bukidnon Pine Forest", description: "Gentle walk through scenic pine forests with photo opportunities." },
                { time: "11:00 AM", activity: "Organic Farm Tour", location: "Bukidnon Organic Farms", description: "Learn about sustainable farming and taste fresh produce." },
                { time: "02:00 PM", activity: "Butterfly Sanctuary", location: "Bukidnon Butterfly Garden", description: "Observe diverse butterfly species in their natural habitat." }
              ]
            }
          ],
          estimatedCost: "₱2,000 - ₱3,500",
          tips: [
            "Bring binoculars for bird watching",
            "Use eco-friendly sunscreen and insect repellent",
            "Support local artisans by purchasing handmade crafts",
            "Leave no trace - pack out all trash"
          ]
        },
        culture: {
          title: "Bukidnon Cultural Heritage Tour",
          summary: "Immerse yourself in Bukidnon's rich cultural tapestry, from indigenous traditions to colonial history and local arts.",
          days: [
            {
              day: 1,
              activities: [
                { time: "09:00 AM", activity: "Kaamulan Cultural Center", location: "Bukidnon Cultural Center", description: "Introduction to Bukidnon's indigenous tribes and their traditions." },
                { time: "11:00 AM", activity: "Traditional Weaving Workshop", location: "Talaandig Weaving Village", description: "Learn basic weaving techniques from master weavers." },
                { time: "02:00 PM", activity: "Historical Church Visit", location: "Immaculate Conception Church", description: "Explore Spanish-era architecture and religious artifacts." }
              ]
            }
          ],
          estimatedCost: "₱1,800 - ₱2,800",
          tips: [
            "Ask permission before taking photos of people",
            "Learn basic greetings in local dialects",
            "Participate respectfully in cultural activities",
            "Purchase authentic crafts directly from artisans"
          ]
        },
        food: {
          title: "Bukidnon Food & Farm Trail",
          summary: "A culinary adventure through Bukidnon's agricultural heartland, featuring farm-to-table experiences and local food traditions.",
          days: [
            {
              day: 1,
              activities: [
                { time: "08:00 AM", activity: "Coffee Farm Tour", location: "Bukidnon Coffee Plantation", description: "From bean to cup: learn about coffee cultivation and processing." },
                { time: "11:00 AM", activity: "Cooking Class", location: "Local Kitchen Studio", description: "Prepare traditional dishes like Binaki and Sinuglaw." },
                { time: "02:00 PM", activity: "Food Market Exploration", location: "Bukidnon Public Market", description: "Taste local specialties and interact with food vendors." }
              ]
            }
          ],
          estimatedCost: "₱2,500 - ₱3,800",
          tips: [
            "Come hungry - there's plenty to taste!",
            "Ask about food origins and preparation methods",
            "Try street food from reputable vendors",
            "Share dishes to sample more variety"
          ]
        }
      };

      // Select itinerary based on trip type
      const selectedItinerary = mockItineraries[formData.tripType as keyof typeof mockItineraries] || mockItineraries.adventure;
      
      // Adjust for duration
      const duration = parseInt(formData.duration);
      if (duration > 1 && selectedItinerary.days.length === 1) {
        // Duplicate and modify days for longer trips
        const extendedDays = [];
        for (let i = 0; i < duration; i++) {
          extendedDays.push({
            day: i + 1,
            activities: [...selectedItinerary.days[0].activities.map((act: any) => ({ ...act }))]
          });
        }
        selectedItinerary.days = extendedDays;
      }

      setItinerary(selectedItinerary);
    } catch (err: any) {
      setError(err.message || "Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{S}</style>
      <div style={{ fontFamily: "'Outfit', sans-serif", background: THEME.mainBg, color: THEME.text, minHeight: "100vh" }}>

        {/* Header */}
        <div style={{ background: THEME.darkBg, padding: "clamp(48px, 6vw, 64px) clamp(16px, 2vw, 2rem) clamp(32px, 4vw, 48px)", borderBottom: `1px solid rgba(232, 243, 237, 0.06)` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div className="bk-mono" style={{ fontSize: "clamp(9px, 1.5vw, 10px)", color: THEME.goldenAccent, letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "clamp(10px, 2vw, 14px)", display: "flex", alignItems: "center", gap: "clamp(6px, 1vw, 10px)" }}>
              <Sparkles style={{ width: "clamp(10px, 1.5vw, 12px)", height: "clamp(10px, 1.5vw, 12px)" }} />
              AI-Powered · Bukidnon
            </div>
            <h1 className="bk-display" style={{ fontSize: "clamp(2rem,6vw,5.5rem)", fontWeight: 900, color: THEME.mainBg, lineHeight: 0.95, marginBottom: "clamp(12px, 2vw, 16px)" }}>
              Smart Itinerary<br /><em style={{ color: THEME.secondaryAccent }}>Generator</em>
            </h1>
            <p style={{ fontSize: "clamp(14px, 2vw, 15px)", color: "rgba(232, 243, 237, 0.4)", fontWeight: 300, maxWidth: "min(100%, 440px)" }}>
              Tell us what you love — get a tailored multi-day Bukidnon plan in seconds.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(32px, 4vw, 48px) clamp(16px, 2vw, 2rem) clamp(60px, 8vw, 80px)" }}>
          <div className="itinerary-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32, alignItems: "start" }}>

            {/* ── FORM PANEL ── */}
            <div style={{ background: "#fff", border: `1px solid ${THEME.borders}`, padding: "clamp(24px, 3vw, 32px)" }}>

              {error && (
                <div style={{ marginBottom: 20, padding: "12px 16px", background: `rgba(45, 122, 74, 0.08)`, border: `1px solid rgba(45, 122, 74, 0.25)`, borderRadius: 2, fontSize: 13, color: THEME.primaryAccent }}>
                  {error}
                </div>
              )}

              {/* Trip Type */}
              <div style={{ marginBottom: 28 }}>
                <div className="bk-mono" style={{ fontSize: 9, color: THEME.earthBrown, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Trip Type</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
                  {tripTypes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setFormData({ ...formData, tripType: t.id })}
                      className={`type-btn ${formData.tripType === t.id ? "active" : ""}`}
                    >
                      <span style={{ fontSize: "clamp(18px, 4vw, 22px)", display: "block", marginBottom: 6, opacity: formData.tripType === t.id ? 1 : 0.6 }}>{t.icon}</span>
                      <span className="type-label" style={{ fontSize: "clamp(12px, 2vw, 13px)", fontWeight: 600, color: formData.tripType === t.id ? THEME.mainBg : THEME.earthBrown }}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div style={{ marginBottom: 28 }}>
                <div className="bk-mono" style={{ fontSize: 9, color: THEME.earthBrown, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
                  Duration — <span style={{ color: THEME.primaryAccent }}>{formData.duration} day{Number(formData.duration) !== 1 ? "s" : ""}</span>
                </div>
                <input
                  type="range" min="1" max="7" value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  style={{ width: "100%", height: "2px" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  {["1", "2", "3", "4", "5", "6", "7"].map((n) => (
                    <span key={n} className="bk-mono" style={{ fontSize: 10, color: formData.duration === n ? "#C4622D" : "#DDD6C8" }}>{n}</span>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div style={{ marginBottom: 28 }}>
                <div className="bk-mono" style={{ fontSize: 9, color: THEME.earthBrown, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Budget Level</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {budgets.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setFormData({ ...formData, budget: b.id })}
                      className={`budget-btn ${formData.budget === b.id ? "active" : ""}`}
                      style={{ minWidth: "calc(33.333% - 4px)" }}
                    >
                      <p className="budget-label" style={{ fontSize: "clamp(11px, 2vw, 12px)", fontWeight: 700, color: formData.budget === b.id ? THEME.goldenAccent : THEME.earthBrown }}>{b.label}</p>
                      <p className="budget-sub" style={{ fontSize: "clamp(9px, 1.5vw, 10px)", marginTop: 2, color: formData.budget === b.id ? "rgba(232, 243, 237, 0.4)" : "#8B6F47" }}>{b.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div style={{ marginBottom: 28 }}>
                <div className="bk-mono" style={{ fontSize: 9, color: THEME.earthBrown, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Specific Interests</div>
                <textarea
                  placeholder="e.g. I love coffee, waterfalls, photography..."
                  value={formData.preferences}
                  onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                  rows={3}
                  className="form-input"
                  style={{ resize: "none" }}
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={generateItinerary}
                disabled={loading}
                style={{ width: "100%", padding: "16px", background: loading ? THEME.borders : THEME.primaryAccent, color: loading ? THEME.earthBrown : THEME.mainBg, border: "none", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 2, transition: "background 0.15s" }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ display: "flex", gap: 3 }}>
                      <span className="dot" style={{ width: 6, height: 6, borderRadius: "50%", background: THEME.earthBrown, display: "inline-block" }} />
                      <span className="dot" style={{ width: 6, height: 6, borderRadius: "50%", background: THEME.earthBrown, display: "inline-block" }} />
                      <span className="dot" style={{ width: 6, height: 6, borderRadius: "50%", background: THEME.earthBrown, display: "inline-block" }} />
                    </span>
                    Generating…
                  </span>
                ) : (
                  <><Send style={{ width: 15, height: 15 }} /> Generate Itinerary</>
                )}
              </button>
            </div>
            {/* ── END FORM PANEL ── */}

            {/* ── RESULT PANEL ── */}
            <div>
              <AnimatePresence mode="wait">
                {itinerary ? (
                  <motion.div key="result" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                    {/* Action Bar */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        style={{ flex: 1, padding: "12px", background: isEditing ? "#1A1208" : "transparent", color: isEditing ? "#F5F0E8" : "#7A6E61", border: "1px solid", borderColor: isEditing ? "#1A1208" : "#DDD6C8", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 2 }}
                      >
                        {isEditing ? <><Save style={{ width: 14, height: 14 }} /> Done</> : <><Edit2 style={{ width: 14, height: 14 }} /> Edit Plan</>}
                      </button>
                      <button
                        onClick={downloadPDF}
                        style={{ padding: "12px 20px", background: "transparent", color: "#7A6E61", border: "1px solid #DDD6C8", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, borderRadius: 2 }}
                      >
                        <Download style={{ width: 14, height: 14 }} /> PDF
                      </button>
                    </div>

                    {/* Summary Card */}
                    <div ref={itineraryRef} style={{ background: THEME.darkBg, padding: "clamp(24px, 3vw, 36px)", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, rgba(212,168,83,0.1), transparent)` }} />
                      <div style={{ position: "relative" }}>
                        <h2 className="bk-display" style={{ fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 900, color: THEME.mainBg, marginBottom: "clamp(8px, 1.5vw, 10px)" }}>{itinerary.title}</h2>
                        <p style={{ fontSize: "clamp(13px, 2vw, 14px)", color: "rgba(232, 243, 237, 0.45)", fontWeight: 300, lineHeight: 1.7, marginBottom: "clamp(16px, 2.5vw, 20px)" }}>{itinerary.summary}</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {[
                            { icon: Clock, label: `${formData.duration} Days` },
                            { icon: DollarSign, label: itinerary.estimatedCost },
                            { icon: Sparkles, label: formData.budget },
                          ].map(({ icon: Icon, label }) => (
                            <span key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "clamp(10px, 1.8vw, 11px)", fontWeight: 600, padding: "clamp(5px, 1vw, 6px) clamp(10px, 1.5vw, 12px)", background: "rgba(45, 122, 74, 0.1)", border: "1px solid rgba(45, 122, 74, 0.2)", color: THEME.goldenAccent }}>
                              <Icon style={{ width: "clamp(10px, 1.8vw, 12px)", height: "clamp(10px, 1.8vw, 12px)" }} /> {label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Days */}
                    {itinerary.days?.map((day) => (
                      <div key={day.day}>
                        <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 1.5vw, 12px)", padding: "clamp(12px, 2vw, 16px) 0", borderBottom: `2px solid ${THEME.darkBg}` }}>
                          <div style={{ width: "clamp(28px, 3vw, 32px)", height: "clamp(28px, 3vw, 32px)", background: THEME.primaryAccent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span className="bk-mono" style={{ fontSize: "clamp(10px, 1.8vw, 11px)", fontWeight: 700, color: THEME.mainBg }}>{String(day.day).padStart(2, "0")}</span>
                          </div>
                          <h3 className="bk-display" style={{ fontSize: "clamp(18px, 3vw, 20px)", fontWeight: 700, color: THEME.text }}>Day {day.day}</h3>
                        </div>
                        <div>
                          {day.activities?.map((act, i) => (
                            <div key={i} className="activity-row" style={{ padding: "clamp(16px, 3vw, 20px) 0", display: "flex", flexDirection: "column", gap: 12 }}>
                              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                                {isEditing ? (
                                  <input
                                    value={act.time}
                                    onChange={(e) => editActivity(day.day - 1, i, "time", e.target.value)}
                                    className="edit-field bk-mono"
                                    style={{ width: "100%", maxWidth: 100, flexShrink: 0, fontSize: "clamp(9px, 1.5vw, 10px)" }}
                                  />
                                ) : (
                                  <span className="bk-mono" style={{ fontSize: "clamp(9px, 1.5vw, 10px)", color: THEME.primaryAccent, background: `rgba(45, 122, 74, 0.08)`, padding: "4px 10px", border: `1px solid rgba(45, 122, 74, 0.15)`, flexShrink: 0, whiteSpace: "nowrap" }}>{act.time}</span>
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  {isEditing ? (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                      <input
                                        value={act.activity}
                                        onChange={(e) => editActivity(day.day - 1, i, "activity", e.target.value)}
                                        className="edit-field"
                                        style={{ fontWeight: 600, fontSize: "clamp(13px, 2vw, 14px)" }}
                                      />
                                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <MapPin style={{ width: 12, height: 12, color: "#B8B0A4", flexShrink: 0 }} />
                                        <input
                                          value={act.location}
                                          onChange={(e) => editActivity(day.day - 1, i, "location", e.target.value)}
                                          className="edit-field"
                                          style={{ flex: 1, fontSize: "clamp(11px, 1.8vw, 12px)" }}
                                        />
                                      </div>
                                      <textarea
                                        value={act.description}
                                        onChange={(e) => editActivity(day.day - 1, i, "description", e.target.value)}
                                        rows={2}
                                        className="edit-field"
                                        style={{ resize: "none", fontSize: "clamp(11px, 1.8vw, 12px)" }}
                                      />
                                    </div>
                                  ) : (
                                    <>
                                      <h4 style={{ fontWeight: 600, fontSize: "clamp(14px, 2vw, 15px)", color: THEME.text, marginBottom: 4 }}>{act.activity}</h4>
                                      <p style={{ fontSize: "clamp(11px, 1.8vw, 12px)", color: THEME.earthBrown, display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                                        <MapPin style={{ width: 12, height: 12 }} />
                                        {typeof act.location === "string" ? act.location : (act.location as any)?.address || JSON.stringify(act.location)}
                                      </p>
                                      <p style={{ fontSize: "clamp(12px, 2vw, 13px)", color: "#7A6E61", fontWeight: 300, lineHeight: 1.6 }}>{act.description}</p>
                                    </>
                                  )}
                                </div>
                                {isEditing && (
                                  <button
                                    onClick={() => removeActivity(day.day - 1, i)}
                                    style={{ padding: 6, background: `rgba(45, 122, 74, 0.08)`, border: `1px solid rgba(45, 122, 74, 0.2)`, borderRadius: 2, cursor: "pointer", color: THEME.primaryAccent, display: "flex", flexShrink: 0 }}
                                  >
                                    <Trash2 style={{ width: 13, height: 13 }} />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                          {isEditing && (
                            <button
                              onClick={() => addActivity(day.day - 1)}
                              style={{ width: "100%", padding: "12px", background: "transparent", border: `1px dashed ${THEME.borders}`, color: THEME.earthBrown, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 8, borderRadius: 2 }}
                            >
                              <Plus style={{ width: 14, height: 14 }} /> Add Activity
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Tips */}
                    <div style={{ background: "#FAF7F2", border: `1px solid ${THEME.borders}`, padding: "clamp(24px, 3vw, 32px)" }}>
                      <div className="bk-mono" style={{ fontSize: 9, color: THEME.primaryAccent, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                        <Sparkles style={{ width: 12, height: 12 }} /> Expert Tips
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: 12 }}>
                        {itinerary.tips?.map((tip, i) => (
                          <div key={i} style={{ display: "flex", gap: 10, padding: "clamp(12px, 2vw, 14px) clamp(14px, 2vw, 16px)", background: "#fff", border: "1px solid #EDE7DC" }}>
                            <div style={{ width: 4, height: 4, background: "#D4A853", borderRadius: "50%", marginTop: 6, flexShrink: 0 }} />
                            <p style={{ fontSize: "clamp(12px, 2vw, 13px)", color: "#7A6E61", fontWeight: 300, lineHeight: 1.6 }}>{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ minHeight: "clamp(300px, 50vh, 500px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `1px dashed ${THEME.borders}`, padding: "clamp(32px, 5vw, 64px) clamp(16px, 2vw, 32px)", textAlign: "center" }}
                  >
                    <div style={{ width: "clamp(60px, 10vw, 80px)", height: "clamp(60px, 10vw, 80px)", background: `rgba(45, 122, 74, 0.06)`, border: `1px solid rgba(45, 122, 74, 0.15)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "clamp(16px, 2.5vw, 20px)" }}>
                      <Sparkles style={{ width: "clamp(24px, 4vw, 32px)", height: "clamp(24px, 4vw, 32px)", color: "rgba(45, 122, 74, 0.3)" }} />
                    </div>
                    <h3 className="bk-display" style={{ fontSize: "clamp(20px, 4vw, 24px)", fontWeight: 900, color: THEME.borders, marginBottom: "clamp(6px, 1vw, 8px)" }}>Your plan awaits</h3>
                    <p style={{ fontSize: "clamp(13px, 2vw, 14px)", color: THEME.earthBrown, fontWeight: 300, maxWidth: "min(100%, 300px)", lineHeight: 1.6 }}>
                      Set your preferences on the left and hit generate to create your personalized Bukidnon itinerary.
                    </p>
                    <div style={{ display: "flex", gap: 8, marginTop: "clamp(20px, 3vw, 28px)", flexWrap: "wrap", justifyContent: "center" }}>
                      {["Adventure", "Nature", "Culture", "Food"].map((t) => (
                        <span key={t} style={{ fontSize: "clamp(10px, 1.8vw, 11px)", padding: "clamp(5px, 1vw, 6px) clamp(10px, 1.5vw, 12px)", border: `1px solid ${THEME.borders}`, color: THEME.earthBrown }}>{t}</span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* ── END RESULT PANEL ── */}

          </div>
        </div>

      </div>
    </>
  );
}