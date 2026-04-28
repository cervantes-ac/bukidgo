import { useState, useRef } from "react";
import { Sparkles, Send, Calendar, MapPin, Clock, DollarSign, Edit2, Download, ShieldCheck, Plus, Trash2, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";
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
    newItinerary.days[dayIndex].activities.push({
      time: "12:00 PM",
      activity: "New Activity",
      location: "Bukidnon",
      description: "Description here..."
    });
    setItinerary(newItinerary);
  };

  const removeActivity = (dayIndex: number, actIndex: number) => {
    if (!itinerary) return;
    const newItinerary = { ...itinerary };
    newItinerary.days[dayIndex].activities.splice(actIndex, 1);
    setItinerary(newItinerary);
  };
  const [formData, setFormData] = useState({
    tripType: "adventure",
    duration: "2",
    budget: "mid-range",
    preferences: ""
  });

  const generateItinerary = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API key is not configured. Please check your environment variables.");
      }

      const genAI = new GoogleGenAI({ apiKey });
      
      const prompt = `Generate a travel itinerary for Bukidnon, Philippines.
      Trip Type: ${formData.tripType}
      Duration: ${formData.duration} days
      Budget: ${formData.budget}
      Additional Preferences: ${formData.preferences}
      
      Please provide a JSON response with the following structure:
      {
        "title": "...",
        "summary": "...",
        "days": [
          {
            "day": 1,
            "activities": [
              { "time": "08:00 AM", "activity": "...", "location": "...", "description": "..." }
            ]
          }
        ],
        "estimatedCost": "...",
        "tips": ["..."]
      }
      Only return the JSON. Do not include markdown formatting.`;

      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });

      const responseText = response.text?.replace(/```json|```/g, "").trim();
      if (!responseText) {
        throw new Error("Empty response from AI");
      }

      const data = JSON.parse(responseText);
      setItinerary(data);
    } catch (err: any) {
      console.error("Error generating itinerary:", err);
      setError(err.message || "Failed to generate itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-clay/30 text-forest rounded-full text-sm font-bold mb-4 border border-clay">
          <Sparkles className="w-4 h-4 text-earth" />
          AI Powered
        </div>
        <h1 className="text-4xl font-serif font-bold text-forest mb-4">Smart Itinerary Generator</h1>
        <p className="text-stone/60 font-medium">Plan your Bukidnon trip in seconds. Just tell us what you love.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-clay shadow-sm space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-stone/40 uppercase tracking-widest mb-3">Trip Type</label>
              <select 
                value={formData.tripType}
                onChange={(e) => setFormData({...formData, tripType: e.target.value})}
                className="w-full bg-linen border border-clay rounded-xl p-4 focus:ring-2 focus:ring-earth appearance-none font-medium text-stone"
              >
                <option value="adventure">Adventure & Thrill</option>
                <option value="nature">Nature & Relaxation</option>
                <option value="culture">Cultural Heritage</option>
                <option value="food">Food & Coffee Tour</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone/40 uppercase tracking-widest mb-3">Duration (Days)</label>
              <input 
                type="number"
                min="1"
                max="7"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="w-full bg-linen border border-clay rounded-xl p-4 focus:ring-2 focus:ring-earth font-medium text-stone"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone/40 uppercase tracking-widest mb-3">Budget Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['budget', 'mid-range', 'premium'].map((b) => (
                  <button
                    key={b}
                    onClick={() => setFormData({...formData, budget: b})}
                    className={cn(
                      "py-3 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border",
                      formData.budget === b 
                        ? "bg-forest text-linen border-forest shadow-lg shadow-forest/20" 
                        : "bg-linen text-stone/50 border-clay hover:border-stone/20"
                    )}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone/40 uppercase tracking-widest mb-3">Specific Interests</label>
              <textarea 
                placeholder="E.g. I love coffee, waterfalls, and photography..."
                value={formData.preferences}
                onChange={(e) => setFormData({...formData, preferences: e.target.value})}
                rows={4}
                className="w-full bg-linen border border-clay rounded-xl p-4 focus:ring-2 focus:ring-earth text-stone placeholder:text-stone/30 font-medium"
              />
            </div>

            <button
              onClick={generateItinerary}
              disabled={loading}
              className="w-full bg-earth text-white py-4 rounded-2xl font-bold hover:bg-earth/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-earth/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Generate Itinerary
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {itinerary ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="flex gap-4" id="itinerary-actions">
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={cn(
                      "flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all",
                      isEditing ? "bg-stone text-white" : "bg-forest text-white"
                    )}
                  >
                    {isEditing ? <><Save className="w-4 h-4" /> Finish Editing</> : <><Edit2 className="w-4 h-4" /> Edit Itinerary</>}
                  </button>
                  <button 
                    onClick={downloadPDF}
                    className="bg-white border-2 border-clay text-stone px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-linen transition-all"
                  >
                    <Download className="w-5 h-5" />
                    PDF
                  </button>
                </div>

                <div className="bg-forest rounded-[2.5rem] p-10 text-linen relative overflow-hidden shadow-xl" ref={itineraryRef}>
                  <div className="relative z-10 space-y-3">
                    <h2 className="text-3xl font-serif font-bold text-linen">{itinerary.title}</h2>
                    <p className="text-linen/80 font-medium leading-relaxed max-w-xl">{itinerary.summary}</p>
                    <div className="flex gap-4 pt-4">
                      <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                        <Clock className="w-4 h-4 text-earth" /> {formData.duration} Days
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                        <DollarSign className="w-4 h-4 text-earth" /> {itinerary.estimatedCost}
                      </div>
                    </div>
                  </div>
                  <Sparkles className="absolute -bottom-10 -right-10 w-60 h-60 text-white/5 rotate-12" />
                </div>

                <div className="space-y-12 py-6">
                  {itinerary.days?.map((day) => (
                    <div key={day.day} className="relative pl-12 border-l-2 border-clay/50 last:border-0 pb-12">
                      <div className="absolute -left-4 top-0 w-8 h-8 bg-earth rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-earth/20">
                        {day.day}
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-forest mb-8 flex items-center gap-3">
                        <Calendar className="w-6 h-6 text-earth" />
                        Day {day.day}
                      </h3>
                      
                      <div className="space-y-6">
                        {day.activities?.map((act, i) => (
                          <div key={i} className="bg-white p-8 rounded-3xl border border-clay shadow-sm hover:border-earth/30 transition-all hover:shadow-md relative group">
                            {isEditing && (
                              <button 
                                onClick={() => removeActivity(day.day - 1, i)}
                                className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                            <div className="flex justify-between items-start mb-4">
                              {isEditing ? (
                                <input 
                                  value={act.time}
                                  onChange={(e) => handleEditActivity(day.day - 1, i, 'time', e.target.value)}
                                  className="text-[10px] font-bold text-earth bg-linen px-3 py-1.5 rounded-lg uppercase tracking-widest border border-clay focus:ring-1 focus:ring-earth outline-none"
                                />
                              ) : (
                                <span className="text-[10px] font-bold text-earth bg-linen px-3 py-1.5 rounded-lg uppercase tracking-widest border border-clay">
                                  {act.time}
                                </span>
                              )}
                              {!isEditing && <MapPin className="w-5 h-5 text-stone/20" />}
                            </div>
                            
                            {isEditing ? (
                              <div className="space-y-4">
                                <input 
                                  value={act.activity}
                                  onChange={(e) => handleEditActivity(day.day - 1, i, 'activity', e.target.value)}
                                  className="w-full text-lg font-serif font-bold text-forest border-b border-clay focus:border-earth outline-none"
                                  placeholder="Activity Name"
                                />
                                <div className="flex items-center gap-2 text-stone/40">
                                  <MapPin className="w-4 h-4" />
                                  <input 
                                    value={act.location}
                                    onChange={(e) => handleEditActivity(day.day - 1, i, 'location', e.target.value)}
                                    className="w-full text-sm font-bold border-b border-clay focus:border-earth outline-none"
                                    placeholder="Location"
                                  />
                                </div>
                                <textarea 
                                  value={act.description}
                                  onChange={(e) => handleEditActivity(day.day - 1, i, 'description', e.target.value)}
                                  className="w-full text-stone/70 leading-relaxed font-medium bg-linen/30 p-4 rounded-xl border border-clay outline-none"
                                  rows={2}
                                />
                              </div>
                            ) : (
                              <>
                                <h4 className="text-lg font-serif font-bold text-forest mb-2">{act.activity}</h4>
                                <p className="text-sm text-stone/40 font-bold mb-4 flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5" /> 
                                  {typeof act.location === 'string' ? act.location : (act.location as any).address || JSON.stringify(act.location)}
                                </p>
                                <p className="text-stone/70 leading-relaxed font-medium">{act.description}</p>
                              </>
                            )}
                          </div>
                        ))}

                        {isEditing && (
                          <button 
                            onClick={() => addActivity(day.day - 1)}
                            className="w-full py-4 border-2 border-dashed border-clay rounded-3xl text-stone/40 font-bold flex items-center justify-center gap-2 hover:bg-linen hover:text-stone transition-all"
                          >
                            <Plus className="w-4 h-4" /> Add Activity
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-olive/10 border border-olive/20 p-10 rounded-[3rem]">
                  <h4 className="text-xl font-serif font-bold text-olive mb-6 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-earth" /> Expert Travel Tips
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {itinerary.tips?.map((tip, i) => (
                      <li key={i} className="text-stone/70 flex items-start gap-4 font-medium">
                        <div className="w-2 h-2 bg-earth rounded-full mt-2 shrink-0 shadow-sm" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-200">
                    <Edit2 className="w-4 h-4" /> Edit Itinerary
                  </button>
                  <button className="bg-white border-2 border-gray-100 text-gray-600 px-6 py-4 rounded-2xl font-bold flex items-center gap-2">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-gray-100 rounded-[3rem]">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                  <Sparkles className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-400">Your plan will appear here</h3>
                <p className="text-gray-400 max-w-xs mt-2">Adjust your settings and hit generate to see the magic happen.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
