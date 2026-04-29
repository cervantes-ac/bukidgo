import { useState, useRef } from "react";
import { Sparkles, Send, Calendar, MapPin, Clock, DollarSign, Edit2, Download, ShieldCheck, Plus, Trash2, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import jsPDF from "jspdf";

interface Itinerary {
  title: string;
  summary: string;
  days: {
    day: number;
    activities: {
      time: string;
      activity: string;
      location: string;
      description: string;
    }[];
  }[];
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
    preferences: ""
  });

  const downloadPDF = () => {
    if (!itinerary) return;
    const doc = new jsPDF();
    let yPos = 20;
    doc.setFontSize(22);
    doc.text(itinerary.title, 20, yPos);
    yPos += 10;
    doc.setFontSize(12);
    const summaryLines = doc.splitTextToSize(itinerary.summary, 170);
    doc.text(summaryLines, 20, yPos);
    yPos += summaryLines.length * 7 + 5;
    itinerary.days.forEach(day => {
      if (yPos > 250) { doc.addPage(); yPos = 20; }
      doc.setFontSize(16);
      doc.text(`Day ${day.day}`, 20, yPos);
      yPos += 10;
      day.activities.forEach(act => {
        if (yPos > 250) { doc.addPage(); yPos = 20; }
        doc.setFontSize(12);
        doc.text(`${act.time} - ${act.activity} (${act.location})`, 25, yPos);
        yPos += 7;
        const descLines = doc.splitTextToSize(act.description, 160);
        doc.setFontSize(10);
        doc.text(descLines, 30, yPos);
        yPos += descLines.length * 5 + 5;
      });
    });
    doc.save(`BukidGo-Itinerary-${itinerary.title}.pdf`);
  };

  const handleEditActivity = (dayIndex: number, actIndex: number, field: string, value: string) => {
    if (!itinerary) return;
    const newItinerary = { ...itinerary };
    (newItinerary.days[dayIndex].activities[actIndex] as any)[field] = value;
    setItinerary(newItinerary);
  };

  const addActivity = (dayIndex: number) => {
    if (!itinerary) return;
    const newItinerary = { ...itinerary };
    newItinerary.days[dayIndex].activities.push({ time: "12:00 PM", activity: "New Activity", location: "Bukidnon", description: "Description here..." });
    setItinerary(newItinerary);
  };

  const removeActivity = (dayIndex: number, actIndex: number) => {
    if (!itinerary) return;
    const newItinerary = { ...itinerary };
    newItinerary.days[dayIndex].activities.splice(actIndex, 1);
    setItinerary(newItinerary);
  };

  const generateItinerary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Generate a travel itinerary for Bukidnon, Philippines.
          Trip Type: ${formData.tripType}
          Duration: ${formData.duration} days
          Budget: ${formData.budget}
          Additional Preferences: ${formData.preferences}
          Please provide a JSON response with the following structure:
          { "title": "...", "summary": "...", "days": [{ "day": 1, "activities": [{ "time": "08:00 AM", "activity": "...", "location": "...", "description": "..." }] }], "estimatedCost": "...", "tips": ["..."] }
          Only return the JSON. Do not include markdown formatting.`
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate itinerary");
      }
      const data = await response.json();
      const responseText = data.text.replace(/```json|```/g, "").trim();
      setItinerary(JSON.parse(responseText));
    } catch (err: any) {
      setError(err.message || "Failed to generate itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const tripTypes = [
    { id: "adventure", label: "Adventure", icon: "🏔️" },
    { id: "nature", label: "Nature", icon: "🌿" },
    { id: "culture", label: "Culture", icon: "🏛️" },
    { id: "food", label: "Food Tour", icon: "🍽️" }
  ];

  const budgets = [
    { id: "budget", label: "Budget", sub: "₱500–1k/day" },
    { id: "mid-range", label: "Mid Range", sub: "₱1k–3k/day" },
    { id: "premium", label: "Premium", sub: "₱3k+/day" }
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');
        .ai-display { font-family: 'Space Grotesk', sans-serif; }
        .ai-mono { font-family: 'Space Mono', monospace; }
        .glow-green { box-shadow: 0 0 20px rgba(74,222,128,0.15); }
        .form-card { background: #111; border: 1px solid #1e1e1e; }
        input, textarea, select { background: #1a1a1a !important; border: 1px solid #2a2a2a !important; color: #f0f0f0 !important; }
        input::placeholder, textarea::placeholder { color: #555 !important; }
        input:focus, textarea:focus, select:focus { border-color: #4ade80 !important; outline: none !important; box-shadow: 0 0 0 2px rgba(74,222,128,0.15) !important; }
        select option { background: #1a1a1a; }
        .trip-type-btn { transition: all 0.2s ease; background: #1a1a1a; border: 1px solid #2a2a2a; }
        .trip-type-btn:hover { border-color: #3a3a3a; }
        .trip-type-btn.active { background: rgba(74,222,128,0.1); border-color: #4ade80; }
        .budget-btn { transition: all 0.2s ease; background: #1a1a1a; border: 1px solid #2a2a2a; }
        .budget-btn.active { background: rgba(74,222,128,0.08); border-color: #4ade80; color: #4ade80; }
        .result-scroll::-webkit-scrollbar { width: 4px; }
        .result-scroll::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 99px; }
        .day-line { border-left: 1px solid #2a2a2a; }
        .activity-card { background: #111; border: 1px solid #1e1e1e; transition: border-color 0.2s; }
        .activity-card:hover { border-color: #2a2a2a; }
        .edit-input { background: #1a1a1a !important; border: 1px solid #2a2a2a !important; color: #f0f0f0 !important; border-radius: 8px !important; padding: 6px 10px !important; }
        .edit-input:focus { border-color: #4ade80 !important; outline: none !important; }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        .loading-dot { animation: pulse-glow 1.2s ease infinite; }
        .loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      {/* Header */}
      <div className="border-b px-6 md:px-12 py-8" style={{ borderColor: '#1e1e1e' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)' }}>
              <Sparkles className="w-4 h-4" style={{ color: '#4ade80' }} />
            </div>
            <span className="ai-mono text-[11px] tracking-widest uppercase" style={{ color: '#4ade80' }}>AI-Powered</span>
          </div>
          <h1 className="ai-display font-bold" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#f0f0f0', lineHeight: 1.1 }}>
            Smart Itinerary<br />
            <span style={{ color: '#4ade80' }}>Generator</span>
          </h1>
          <p className="mt-3 font-light" style={{ color: '#555' }}>Plan your Bukidnon trip in seconds. Tell us what you love.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10">

          {/* Form panel */}
          <div className="space-y-4">
            <div className="rounded-3xl p-8 space-y-7 form-card">
              {error && (
                <div className="flex items-center gap-3 p-4 rounded-xl border text-sm" style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)', color: '#f87171' }}>
                  <ShieldCheck className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}

              {/* Trip Type */}
              <div>
                <label className="ai-mono text-[10px] tracking-widest uppercase mb-3 block" style={{ color: '#555' }}>Trip Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {tripTypes.map((t) => (
                    <button key={t.id} onClick={() => setFormData({ ...formData, tripType: t.id })}
                      className={cn("trip-type-btn rounded-xl p-4 text-left", formData.tripType === t.id ? "active" : "")}>
                      <span className="text-2xl block mb-2">{t.icon}</span>
                      <span className="text-sm font-semibold" style={{ color: formData.tripType === t.id ? '#4ade80' : '#888' }}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="ai-mono text-[10px] tracking-widest uppercase mb-3 block" style={{ color: '#555' }}>
                  Duration — <span style={{ color: '#4ade80' }}>{formData.duration} day{Number(formData.duration) !== 1 ? 's' : ''}</span>
                </label>
                <input type="range" min="1" max="7" value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full h-1.5 rounded-full" style={{ accentColor: '#4ade80', background: '#2a2a2a' }} />
                <div className="flex justify-between mt-2">
                  {['1','2','3','4','5','6','7'].map(n => (
                    <span key={n} className="ai-mono text-[10px]" style={{ color: formData.duration === n ? '#4ade80' : '#333' }}>{n}</span>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="ai-mono text-[10px] tracking-widest uppercase mb-3 block" style={{ color: '#555' }}>Budget Level</label>
                <div className="flex gap-2">
                  {budgets.map((b) => (
                    <button key={b.id} onClick={() => setFormData({ ...formData, budget: b.id })}
                      className={cn("budget-btn flex-1 py-3 px-2 rounded-xl text-center")}
                      style={{ color: formData.budget === b.id ? '#4ade80' : '#555' }}>
                      <p className="text-xs font-semibold">{b.label}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: formData.budget === b.id ? '#4ade80' : '#333' }}>{b.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div>
                <label className="ai-mono text-[10px] tracking-widest uppercase mb-3 block" style={{ color: '#555' }}>Specific Interests</label>
                <textarea
                  placeholder="e.g. I love coffee, waterfalls, photography..."
                  value={formData.preferences}
                  onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                  rows={3}
                  className="w-full p-4 rounded-xl text-sm font-light resize-none"
                />
              </div>

              <button onClick={generateItinerary} disabled={loading}
                className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 glow-green"
                style={{ background: loading ? '#1a3a1a' : '#4ade80', color: loading ? '#4ade80' : '#0a0a0a' }}>
                {loading ? (
                  <span className="flex items-center gap-3">
                    <span className="flex gap-1">
                      <span className="loading-dot w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#4ade80' }} />
                      <span className="loading-dot w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#4ade80' }} />
                      <span className="loading-dot w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#4ade80' }} />
                    </span>
                    Generating...
                  </span>
                ) : (
                  <><Send className="w-4 h-4" /> Generate Itinerary</>
                )}
              </button>
            </div>
          </div>

          {/* Result panel */}
          <div>
            <AnimatePresence mode="wait">
              {itinerary ? (
                <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  {/* Action bar */}
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsEditing(!isEditing)}
                      className="flex-1 py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all border"
                      style={isEditing
                        ? { background: '#f0f0f0', color: '#0a0a0a', borderColor: '#f0f0f0' }
                        : { background: 'transparent', color: '#888', borderColor: '#2a2a2a' }}>
                      {isEditing ? <><Save className="w-4 h-4" /> Done Editing</> : <><Edit2 className="w-4 h-4" /> Edit Plan</>}
                    </button>
                    <button onClick={downloadPDF}
                      className="px-6 py-3 rounded-2xl font-semibold text-sm flex items-center gap-2 border transition-colors hover:bg-[#1a1a1a]"
                      style={{ borderColor: '#2a2a2a', color: '#888' }}>
                      <Download className="w-4 h-4" /> PDF
                    </button>
                  </div>

                  {/* Summary card */}
                  <div className="rounded-3xl p-8 relative overflow-hidden" style={{ background: '#111', border: '1px solid #1e1e1e' }} ref={itineraryRef}>
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #4ade80, transparent)', transform: 'translate(50%, -50%)' }} />
                    <div className="relative z-10">
                      <h2 className="ai-display text-2xl font-bold mb-2" style={{ color: '#f0f0f0' }}>{itinerary.title}</h2>
                      <p className="font-light leading-relaxed mb-6" style={{ color: '#666', fontSize: '15px' }}>{itinerary.summary}</p>
                      <div className="flex flex-wrap gap-3">
                        <span className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border"
                          style={{ background: 'rgba(74,222,128,0.08)', borderColor: 'rgba(74,222,128,0.2)', color: '#4ade80' }}>
                          <Clock className="w-3.5 h-3.5" /> {formData.duration} Days
                        </span>
                        <span className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border"
                          style={{ background: 'rgba(74,222,128,0.08)', borderColor: 'rgba(74,222,128,0.2)', color: '#4ade80' }}>
                          <DollarSign className="w-3.5 h-3.5" /> {itinerary.estimatedCost}
                        </span>
                        <span className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border"
                          style={{ background: 'rgba(74,222,128,0.08)', borderColor: 'rgba(74,222,128,0.2)', color: '#4ade80' }}>
                          <Sparkles className="w-3.5 h-3.5" /> {formData.budget}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Days */}
                  <div className="space-y-10">
                    {itinerary.days?.map((day) => (
                      <div key={day.day} className="relative pl-10 day-line">
                        {/* Day marker */}
                        <div className="absolute -left-4 top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: '#4ade80', color: '#0a0a0a' }}>
                          {day.day}
                        </div>
                        <h3 className="ai-display text-lg font-semibold mb-5 flex items-center gap-2" style={{ color: '#f0f0f0' }}>
                          <Calendar className="w-4 h-4" style={{ color: '#4ade80' }} /> Day {day.day}
                        </h3>
                        <div className="space-y-3">
                          {day.activities?.map((act, i) => (
                            <div key={i} className="activity-card rounded-2xl p-6 relative group">
                              {isEditing && (
                                <button onClick={() => removeActivity(day.day - 1, i)}
                                  className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <div className="flex items-start gap-4">
                                {isEditing ? (
                                  <input value={act.time}
                                    onChange={(e) => handleEditActivity(day.day - 1, i, 'time', e.target.value)}
                                    className="edit-input ai-mono text-xs w-28 shrink-0" />
                                ) : (
                                  <span className="ai-mono text-xs px-3 py-1.5 rounded-lg shrink-0"
                                    style={{ background: '#1a1a1a', color: '#4ade80', border: '1px solid #2a2a2a' }}>
                                    {act.time}
                                  </span>
                                )}
                                <div className="flex-1 min-w-0">
                                  {isEditing ? (
                                    <div className="space-y-2">
                                      <input value={act.activity}
                                        onChange={(e) => handleEditActivity(day.day - 1, i, 'activity', e.target.value)}
                                        className="edit-input w-full text-sm font-semibold" />
                                      <div className="flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: '#555' }} />
                                        <input value={act.location}
                                          onChange={(e) => handleEditActivity(day.day - 1, i, 'location', e.target.value)}
                                          className="edit-input flex-1 text-xs" />
                                      </div>
                                      <textarea value={act.description}
                                        onChange={(e) => handleEditActivity(day.day - 1, i, 'description', e.target.value)}
                                        rows={2}
                                        className="edit-input w-full text-xs resize-none" />
                                    </div>
                                  ) : (
                                    <>
                                      <h4 className="font-semibold mb-1" style={{ color: '#f0f0f0', fontSize: '15px' }}>{act.activity}</h4>
                                      <p className="text-xs flex items-center gap-1.5 mb-2" style={{ color: '#555' }}>
                                        <MapPin className="w-3.5 h-3.5" />
                                        {typeof act.location === 'string' ? act.location : (act.location as any).address || JSON.stringify(act.location)}
                                      </p>
                                      <p className="text-sm font-light leading-relaxed" style={{ color: '#777' }}>{act.description}</p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          {isEditing && (
                            <button onClick={() => addActivity(day.day - 1)}
                              className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 border border-dashed transition-colors hover:bg-[#111]"
                              style={{ borderColor: '#2a2a2a', color: '#555' }}>
                              <Plus className="w-4 h-4" /> Add Activity
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tips */}
                  <div className="rounded-3xl p-8" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
                    <h4 className="ai-display font-semibold mb-5 flex items-center gap-2" style={{ color: '#f0f0f0', fontSize: '18px' }}>
                      <Sparkles className="w-4 h-4" style={{ color: '#4ade80' }} /> Expert Tips
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {itinerary.tips?.map((tip, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 rounded-2xl border" style={{ background: 'rgba(74,222,128,0.04)', borderColor: 'rgba(74,222,128,0.1)' }}>
                          <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: '#4ade80' }} />
                          <p className="text-sm font-light leading-relaxed" style={{ color: '#888' }}>{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="h-full min-h-[500px] flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-16 text-center"
                  style={{ borderColor: '#1e1e1e' }}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 relative"
                    style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)' }}>
                    <Sparkles className="w-9 h-9" style={{ color: 'rgba(74,222,128,0.4)' }} />
                  </div>
                  <h3 className="ai-display text-xl font-semibold mb-3" style={{ color: '#333' }}>Your plan awaits</h3>
                  <p className="text-sm font-light max-w-xs" style={{ color: '#444' }}>
                    Set your preferences on the left and hit generate to create your personalized Bukidnon itinerary.
                  </p>
                  <div className="mt-8 flex items-center gap-3">
                    {['Adventure', 'Nature', 'Culture', 'Food'].map((t, i) => (
                      <span key={i} className="text-[11px] px-3 py-1.5 rounded-full border" style={{ borderColor: '#1e1e1e', color: '#333' }}>{t}</span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}