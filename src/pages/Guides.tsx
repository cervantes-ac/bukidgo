import { Star, ShieldCheck, Calendar, DollarSign, Briefcase, CheckCircle2, Search, Filter, X, Users, Award, Compass, MapPin, TrendingUp, Sparkles } from "lucide-react";
import { LOCAL_BUDDIES } from "../constants";
import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo, useEffect } from "react";
import { cn } from "../lib/utils";
import { useFirebase } from "../contexts/FirebaseContext";
import { db, OperationType, handleFirestoreError } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Guides() {
  const [selectedBuddy, setSelectedBuddy] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [minExperience, setMinExperience] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [minRating, setMinRating] = useState(0);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const { user } = useFirebase();
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const navigate = useNavigate();

  const [liveGuides, setLiveGuides] = useState<any[]>(LOCAL_BUDDIES || []);

  useEffect(() => {
    return onSnapshot(collection(db, "guides"), (snapshot) => {
      if (!snapshot.empty) setLiveGuides(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const allSpecialties = useMemo(() => {
    const s = new Set<string>();
    liveGuides.forEach(b => { if (b.specialties) b.specialties.forEach((sp: string) => s.add(sp)); });
    return Array.from(s);
  }, [liveGuides]);

  const filteredBuddies = useMemo(() => {
    return (liveGuides || []).filter(buddy => {
      const matchesSearch = buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          buddy.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (buddy.specialties && buddy.specialties.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase())));
      const years = parseInt(buddy.experience) || 0;
      const matchesExp = years >= minExperience;
      const matchesPrice = (buddy.pricePerDay || 0) <= maxPrice;
      const matchesRating = buddy.rating >= minRating;
      const matchesSpecialties = specialties.length === 0 ||
        (buddy.specialties && buddy.specialties.some((s: string) => specialties.includes(s)));
      return matchesSearch && matchesExp && matchesPrice && matchesRating && matchesSpecialties;
    });
  }, [liveGuides, searchQuery, minExperience, maxPrice, minRating, specialties]);

  const handleBook = async () => {
    if (!user) { navigate('/auth'); return; }
    setIsBooking(true);
    try {
      await addDoc(collection(db, "bookings"), {
        userId: user.uid, userName: user.displayName || "User", userEmail: user.email,
        buddyId: selectedBuddy.uid, buddyName: selectedBuddy.name,
        date: new Date().toISOString(), status: "pending", createdAt: serverTimestamp(), type: "buddy"
      });
      setBooked(true);
      setTimeout(() => { setBooked(false); setSelectedBuddy(null); }, 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "bookings");
    } finally {
      setIsBooking(false);
    }
  };

  const toggleSpecialty = (specialty: string) => {
    setSpecialties(prev => prev.includes(specialty) ? prev.filter(s => s !== specialty) : [...prev, specialty]);
  };

  const ratingBadge = (r: number) => r >= 4.8 ? { label: "Elite", bg: '#7c3aed', color: '#fff' } : r >= 4.5 ? { label: "Top Rated", bg: '#0ea5e9', color: '#fff' } : { label: "Verified", bg: '#16a34a', color: '#fff' };

  return (
    <div className="min-h-screen" style={{ background: '#f7f5f2', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;1,400&display=swap');
        .guides-display { font-family: 'Fraunces', serif; }
        .guides-sans { font-family: 'DM Sans', sans-serif; }
        .guide-card { transition: all 0.25s ease; cursor: pointer; }
        .guide-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.1); transform: translateY(-2px); }
        .guide-card.selected { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }
        .guide-photo { transition: transform 0.4s ease; }
        .guide-card:hover .guide-photo { transform: scale(1.05); }
        .detail-enter { animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: translateX(0); } }
        input, select { background: #eeeae4 !important; border: 1.5px solid #ddd8d0 !important; color: #1a1a1a !important; }
        input::placeholder { color: #aaa !important; }
        input:focus, select:focus { border-color: #2563eb !important; outline: none !important; box-shadow: none !important; }
        select option { background: #f7f5f2; }
        input[type="range"] { accent-color: #2563eb; }
        .scroll-area::-webkit-scrollbar { width: 4px; }
        .scroll-area::-webkit-scrollbar-thumb { background: #ddd8d0; border-radius: 99px; }
      `}</style>

      {/* Hero */}
      <div className="px-6 md:px-12 pt-16 pb-14 border-b" style={{ borderColor: '#ddd8d0', background: '#fff' }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] font-semibold tracking-[0.35em] uppercase mb-5 flex items-center gap-2" style={{ color: '#2563eb' }}>
            <Users className="w-4 h-4" /> Local Experts · Bukidnon
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <h1 className="guides-display font-bold leading-[0.9] mb-5" style={{ fontSize: 'clamp(3rem,7vw,6.5rem)', color: '#111' }}>
                Meet Your<br />
                <em style={{ color: '#2563eb' }}>Bukidnon</em> Buddies
              </h1>
              <p className="text-lg max-w-xl leading-relaxed font-light" style={{ color: '#666' }}>
                Verified local guides who know every hidden gem, secret trail, and authentic experience.
              </p>
            </div>
            <div className="flex gap-8 shrink-0 pb-2">
              {[
                { label: "Guides", value: liveGuides.length },
                { label: "Available", value: filteredBuddies.length }
              ].map((s, i) => (
                <div key={i} className="text-right">
                  <p className="guides-display text-5xl font-bold" style={{ color: i === 1 ? '#2563eb' : '#111' }}>{s.value}</p>
                  <p className="text-[11px] tracking-widest uppercase" style={{ color: '#aaa' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="px-6 md:px-12 py-4 border-b sticky top-0 z-20" style={{ background: '#f7f5f2', borderColor: '#ddd8d0' }}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#aaa' }} />
            <input type="text" placeholder="Search by name or specialty..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium" />
          </div>
          <select value={minExperience} onChange={(e) => setMinExperience(Number(e.target.value))}
            className="px-3 py-2.5 rounded-xl text-xs font-medium">
            <option value={0}>Any Experience</option>
            <option value={1}>1+ Year</option>
            <option value={3}>3+ Years</option>
            <option value={5}>5+ Years</option>
          </select>
          <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}
            className="px-3 py-2.5 rounded-xl text-xs font-medium">
            <option value={0}>Any Rating</option>
            <option value={4.0}>4.0+ ★</option>
            <option value={4.5}>4.5+ ★</option>
            <option value={4.8}>4.8+ ★</option>
          </select>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium" style={{ color: '#666' }}>≤ ₱{maxPrice}</span>
            <input type="range" min="500" max="5000" step="100" value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))} style={{ width: '100px' }} />
          </div>
          {(searchQuery || minExperience > 0 || maxPrice < 5000 || minRating > 0 || specialties.length > 0) && (
            <button onClick={() => { setSearchQuery(""); setMinExperience(0); setMaxPrice(5000); setMinRating(0); setSpecialties([]); }}
              className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#2563eb' }}>
              <X className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>
        {allSpecialties.length > 0 && (
          <div className="max-w-7xl mx-auto mt-3 flex flex-wrap gap-2">
            {allSpecialties.map(s => (
              <button key={s} onClick={() => toggleSpecialty(s)}
                className="px-3 py-1 rounded-full text-xs font-medium border transition-all"
                style={specialties.includes(s)
                  ? { background: '#2563eb', color: '#fff', borderColor: '#2563eb' }
                  : { background: 'transparent', color: '#666', borderColor: '#ddd8d0' }}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
          {/* Guide list */}
          <div className="space-y-4">
            {filteredBuddies.length === 0 ? (
              <div className="py-20 text-center rounded-3xl border-2 border-dashed" style={{ borderColor: '#ddd8d0' }}>
                <p className="guides-display text-4xl font-bold mb-2" style={{ color: '#ddd8d0' }}>No guides found</p>
                <p className="text-sm" style={{ color: '#aaa' }}>Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredBuddies.map((buddy) => {
                const badge = ratingBadge(buddy.rating);
                return (
                  <motion.div key={buddy.uid} layout initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                    onClick={() => setSelectedBuddy(buddy)}
                    className={cn("guide-card rounded-3xl border-2 p-6 flex items-center gap-6 bg-white", selectedBuddy?.uid === buddy.uid ? "selected" : "")}
                    style={{ borderColor: selectedBuddy?.uid === buddy.uid ? '#2563eb' : '#ede9e3' }}>
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden">
                        <img src={buddy.photoURL} className="guide-photo w-full h-full object-cover" alt={buddy.name} />
                      </div>
                      <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white"
                        style={{ background: '#16a34a' }}>
                        <ShieldCheck className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h3 className="guides-display text-xl font-bold" style={{ color: '#111' }}>{buddy.name}</h3>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: badge.bg, color: badge.color }}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-xs mb-2 flex items-center gap-1.5" style={{ color: '#888' }}>
                        <Briefcase className="w-3.5 h-3.5" /> {buddy.experience} experience
                      </p>
                      <p className="text-sm line-clamp-1 font-light mb-3" style={{ color: '#666' }}>{buddy.bio}</p>
                      {buddy.specialties && (
                        <div className="flex flex-wrap gap-1.5">
                          {buddy.specialties.slice(0, 4).map((s: string, i: number) => (
                            <span key={i} className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                              style={{ background: '#eff6ff', color: '#2563eb' }}>{s}</span>
                          ))}
                          {buddy.specialties.length > 4 && (
                            <span className="text-[10px] font-medium px-2.5 py-1" style={{ color: '#aaa' }}>+{buddy.specialties.length - 4}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center justify-end gap-1 mb-1">
                        <Star className="w-4 h-4" style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                        <span className="font-bold text-sm" style={{ color: '#111' }}>{buddy.rating}</span>
                      </div>
                      <p className="guides-display text-2xl font-bold" style={{ color: '#2563eb' }}>₱{buddy.pricePerDay}</p>
                      <p className="text-[10px]" style={{ color: '#aaa' }}>per day</p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Detail panel */}
          <div className="lg:sticky lg:top-24 h-fit">
            <AnimatePresence mode="wait">
              {booked ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="rounded-3xl p-10 text-center text-white relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb)' }}>
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-6 animate-bounce" />
                  <h2 className="guides-display text-3xl font-bold mb-3">Booked!</h2>
                  <p className="text-blue-100 leading-relaxed">
                    Your request was sent to {selectedBuddy?.name.split(' ')[0]}. Expect a reply within 24 hours.
                  </p>
                </motion.div>
              ) : selectedBuddy ? (
                <motion.div key="details" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  className="detail-enter rounded-3xl border overflow-hidden"
                  style={{ background: '#fff', borderColor: '#ede9e3' }}>
                  {/* Header */}
                  <div className="p-8 border-b" style={{ borderColor: '#f0ece5' }}>
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <img src={selectedBuddy.photoURL} className="w-24 h-24 rounded-2xl object-cover" alt="" />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white"
                          style={{ background: '#16a34a' }}>
                          <Award className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div>
                        <h2 className="guides-display text-2xl font-bold mb-1" style={{ color: '#111' }}>{selectedBuddy.name}</h2>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium flex items-center gap-1 px-3 py-1 rounded-full"
                            style={{ background: '#f0f9ff', color: '#0284c7' }}>
                            <Briefcase className="w-3 h-3" /> {selectedBuddy.experience}
                          </span>
                          <span className="text-xs font-bold flex items-center gap-1 px-3 py-1 rounded-full"
                            style={{ background: '#fefce8', color: '#a16207' }}>
                            <Star className="w-3 h-3" /> {selectedBuddy.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="scroll-area overflow-y-auto p-8 space-y-6" style={{ maxHeight: '480px' }}>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: '#aaa' }}>About</p>
                      <p className="text-sm leading-relaxed font-light" style={{ color: '#555' }}>{selectedBuddy.bio}</p>
                    </div>

                    {selectedBuddy.specialties && selectedBuddy.specialties.length > 0 && (
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: '#aaa' }}>Specialties</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedBuddy.specialties.map((s: string, i: number) => (
                            <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-full"
                              style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="rounded-2xl p-5 border" style={{ background: '#f7f5f2', borderColor: '#ede9e3' }}>
                      <div className="flex justify-between items-center mb-3 pb-3 border-b" style={{ borderColor: '#ede9e3' }}>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#aaa' }}>Service / day</p>
                          <p className="guides-display text-2xl font-bold" style={{ color: '#111' }}>₱{selectedBuddy.pricePerDay}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#aaa' }}>Platform fee</p>
                          <p className="guides-display text-2xl font-bold" style={{ color: '#111' }}>₱49</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <p className="text-xs" style={{ color: '#aaa' }}>Total estimate</p>
                        <p className="guides-display text-3xl font-bold" style={{ color: '#2563eb' }}>₱{selectedBuddy.pricePerDay + 49}</p>
                      </div>
                    </div>
                  </div>

                  {/* Book CTA */}
                  <div className="p-8 pt-0">
                    <button onClick={handleBook} disabled={isBooking}
                      className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                      style={{ background: '#2563eb', color: '#fff' }}>
                      {isBooking ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : <><Calendar className="w-4 h-4" /> Book {selectedBuddy.name.split(' ')[0]}</>}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="rounded-3xl border-2 border-dashed p-12 flex flex-col items-center text-center"
                  style={{ borderColor: '#ddd8d0' }}>
                  <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 border-4"
                    style={{ borderColor: '#ede9e3', background: '#f7f5f2' }}>
                    <Users className="w-10 h-10" style={{ color: '#ddd8d0' }} />
                  </div>
                  <h3 className="guides-display text-2xl font-bold mb-2" style={{ color: '#bbb' }}>Select a Guide</h3>
                  <p className="text-sm font-light" style={{ color: '#aaa' }}>
                    Choose from our verified local experts to start planning your Bukidnon adventure.
                  </p>
                  <div className="flex items-center gap-4 mt-6 text-xs" style={{ color: '#bbb' }}>
                    <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Verified</span>
                    <span className="flex items-center gap-1"><Award className="w-4 h-4" /> Certified</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Local</span>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}