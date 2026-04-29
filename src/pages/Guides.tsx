import { Star, ShieldCheck, Calendar, DollarSign, Briefcase, CheckCircle2, Search, X, Users, Award, MapPin } from "lucide-react";
import { LOCAL_BUDDIES } from "../constants";
import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo, useEffect } from "react";
import { useFirebase } from "../contexts/FirebaseContext";
import { db, OperationType, handleFirestoreError } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
  .bk-display { font-family: 'Fraunces', Georgia, serif; }
  .bk-mono { font-family: 'JetBrains Mono', monospace; }
  .guide-row { transition: background 0.15s; cursor: pointer; }
  .guide-row:hover { background: rgba(26,18,8,0.03) !important; }
  .guide-row.selected { background: #F5EFE6 !important; border-left: 3px solid #C4622D !important; }
  .guide-img { transition: transform 0.5s ease; }
  .guide-row:hover .guide-img { transform: scale(1.06); }
  input, select { font-family: 'Outfit', sans-serif; }
  select option { background: #F5F0E8; }
  input[type="range"] { accent-color: #C4622D; }
  .scroll-pane::-webkit-scrollbar { width: 4px; }
  .scroll-pane::-webkit-scrollbar-thumb { background: #DDD6C8; border-radius: 99px; }
  .book-btn { transition: all 0.15s; }
  .book-btn:hover:not(:disabled) { background: #A8501F !important; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

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

  const filteredGuides = useMemo(() => {
    return liveGuides.filter(buddy => {
      const matchesSearch = buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buddy.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buddy.specialties?.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const years = parseInt(buddy.experience) || 0;
      return matchesSearch && years >= minExperience && (buddy.pricePerDay || 0) <= maxPrice &&
        buddy.rating >= minRating &&
        (specialties.length === 0 || buddy.specialties?.some((s: string) => specialties.includes(s)));
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

  const toggleSpecialty = (s: string) =>
    setSpecialties(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const badgeFor = (r: number) =>
    r >= 4.8 ? { label: "Elite", bg: "#7c3aed" } : r >= 4.5 ? { label: "Top Rated", bg: "#C4622D" } : { label: "Verified", bg: "#4A7C59" };

  return (
    <>
      <style>{S}</style>
      <div style={{ fontFamily: "'Outfit', sans-serif", background: "#F5F0E8", color: "#1A1208", minHeight: "100vh" }}>

        {/* Hero */}
        <div style={{ background: "#1A1208", padding: "72px 2rem 56px", borderBottom: "1px solid rgba(245,240,232,0.06)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div className="bk-mono" style={{ fontSize: 10, color: "#D4A853", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "inline-block", width: 24, height: 1, background: "#D4A853" }} />
              Local Experts · Bukidnon
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 32 }}>
              <div>
                <h1 className="bk-display" style={{ fontSize: "clamp(3rem,7vw,6.5rem)", fontWeight: 900, color: "#F5F0E8", lineHeight: 0.9, marginBottom: 16 }}>
                  Your Local<br /><em style={{ color: "#D4A853" }}>Buddies</em>
                </h1>
                <p style={{ fontSize: 16, color: "rgba(245,240,232,0.45)", maxWidth: 440, lineHeight: 1.7, fontWeight: 300 }}>
                  Verified guides who know every hidden gem, secret trail, and authentic experience.
                </p>
              </div>
              <div style={{ display: "flex", gap: 40, paddingBottom: 8 }}>
                {[["Total", liveGuides.length, "#F5F0E8"], ["Available", filteredGuides.length, "#D4A853"]].map(([label, val, color]) => (
                  <div key={label as string} style={{ textAlign: "right" }}>
                    <div className="bk-display" style={{ fontSize: 52, fontWeight: 900, color: color as string, lineHeight: 1 }}>{val}</div>
                    <div className="bk-mono" style={{ fontSize: 9, color: "rgba(245,240,232,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div style={{ position: "sticky", top: 72, zIndex: 20, background: "rgba(245,240,232,0.96)", backdropFilter: "blur(10px)", borderBottom: "1px solid #DDD6C8", padding: "14px 2rem" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, minWidth: 180, maxWidth: 320, position: "relative" }}>
              <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#B8B0A4" }} />
              <input type="text" placeholder="Search by name or specialty..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 10, paddingBottom: 10, background: "#fff", border: "1px solid #DDD6C8", borderRadius: 2, fontSize: 13, color: "#1A1208", outline: "none" }} />
            </div>
            <select value={minExperience} onChange={e => setMinExperience(Number(e.target.value))}
              style={{ padding: "9px 12px", background: "#fff", border: "1px solid #DDD6C8", borderRadius: 2, fontSize: 12, color: "#1A1208", outline: "none" }}>
              <option value={0}>Any Experience</option>
              <option value={1}>1+ Year</option>
              <option value={3}>3+ Years</option>
              <option value={5}>5+ Years</option>
            </select>
            <select value={minRating} onChange={e => setMinRating(Number(e.target.value))}
              style={{ padding: "9px 12px", background: "#fff", border: "1px solid #DDD6C8", borderRadius: 2, fontSize: 12, color: "#1A1208", outline: "none" }}>
              <option value={0}>Any Rating</option>
              <option value={4.0}>4.0+ ★</option>
              <option value={4.5}>4.5+ ★</option>
              <option value={4.8}>4.8+ ★</option>
            </select>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="bk-mono" style={{ fontSize: 10, color: "#7A6E61" }}>≤ ₱{maxPrice}</span>
              <input type="range" min="500" max="5000" step="100" value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: 90 }} />
            </div>
            {(searchQuery || minExperience > 0 || maxPrice < 5000 || minRating > 0 || specialties.length > 0) && (
              <button onClick={() => { setSearchQuery(""); setMinExperience(0); setMaxPrice(5000); setMinRating(0); setSpecialties([]); }}
                style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "#C4622D", background: "transparent", border: "none", cursor: "pointer" }}>
                <X style={{ width: 13, height: 13 }} /> Reset
              </button>
            )}
          </div>
          {allSpecialties.length > 0 && (
            <div style={{ maxWidth: 1280, margin: "10px auto 0", display: "flex", flexWrap: "wrap", gap: 6 }}>
              {allSpecialties.map(s => (
                <button key={s} onClick={() => toggleSpecialty(s)}
                  style={{ padding: "5px 12px", borderRadius: 2, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "1px solid", transition: "all 0.15s",
                    background: specialties.includes(s) ? "#1A1208" : "transparent",
                    color: specialties.includes(s) ? "#F5F0E8" : "#7A6E61",
                    borderColor: specialties.includes(s) ? "#1A1208" : "#DDD6C8" }}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 2rem 80px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 32, alignItems: "start" }}>

            {/* Guide list — tabular rows */}
            <div>
              {filteredGuides.length === 0 ? (
                <div style={{ padding: "80px 0", textAlign: "center" }}>
                  <div className="bk-display" style={{ fontSize: 48, color: "#DDD6C8", marginBottom: 8 }}>No guides found</div>
                  <p style={{ color: "#B8B0A4", fontSize: 14 }}>Try adjusting your filters</p>
                </div>
              ) : (
                <div>
                  {/* Table header */}
                  <div className="bk-mono" style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 16, padding: "0 8px 12px", fontSize: 9, color: "#B8B0A4", letterSpacing: "0.2em", textTransform: "uppercase", borderBottom: "1px solid #DDD6C8", marginBottom: 0 }}>
                    <span>Guide</span><span>Experience</span><span>Rating</span><span>Rate</span>
                  </div>
                  {filteredGuides.map((buddy, i) => {
                    const badge = badgeFor(buddy.rating);
                    return (
                      <motion.div key={buddy.uid || buddy.id}
                        layout initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                        onClick={() => setSelectedBuddy(buddy)}
                        className={`guide-row ${selectedBuddy?.uid === buddy.uid ? "selected" : ""}`}
                        style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 16, alignItems: "center", padding: "20px 8px", borderBottom: "1px solid #DDD6C8", borderLeft: selectedBuddy?.uid === buddy.uid ? "3px solid #C4622D" : "3px solid transparent" }}>

                        {/* Name & info */}
                        <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
                          <div style={{ position: "relative", flexShrink: 0 }}>
                            <div style={{ width: 56, height: 56, overflow: "hidden", borderRadius: 2, border: "1px solid #DDD6C8" }}>
                              <img src={buddy.photoURL} className="guide-img" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={buddy.name} />
                            </div>
                            <div style={{ position: "absolute", bottom: -3, right: -3, width: 18, height: 18, background: "#4A7C59", borderRadius: "50%", border: "2px solid #F5F0E8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <ShieldCheck style={{ width: 9, height: 9, color: "#fff" }} />
                            </div>
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                              <h3 className="bk-display" style={{ fontSize: 19, fontWeight: 700, color: "#1A1208" }}>{buddy.name}</h3>
                              <span className="bk-mono" style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", background: badge.bg, color: "#fff", letterSpacing: "0.1em" }}>
                                {badge.label}
                              </span>
                            </div>
                            {buddy.specialties && (
                              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                {buddy.specialties.slice(0, 3).map((s: string, idx: number) => (
                                  <span key={idx} style={{ fontSize: 10, background: "rgba(196,98,45,0.08)", color: "#C4622D", padding: "2px 8px", fontWeight: 600 }}>{s}</span>
                                ))}
                                {buddy.specialties.length > 3 && <span style={{ fontSize: 10, color: "#B8B0A4" }}>+{buddy.specialties.length - 3}</span>}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Experience */}
                        <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                          <div className="bk-mono" style={{ fontSize: 11, color: "#7A6E61" }}>{buddy.experience}</div>
                        </div>

                        {/* Rating */}
                        <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                            <Star style={{ width: 12, height: 12, fill: "#D4A853", color: "#D4A853" }} />
                            <span style={{ fontWeight: 700, fontSize: 13, color: "#1A1208" }}>{buddy.rating}</span>
                          </div>
                        </div>

                        {/* Price */}
                        <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                          <div className="bk-display" style={{ fontSize: 20, fontWeight: 900, color: "#C4622D" }}>₱{buddy.pricePerDay}</div>
                          <div className="bk-mono" style={{ fontSize: 9, color: "#B8B0A4" }}>/day</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Detail panel */}
            <div style={{ position: "sticky", top: 140 }}>
              <AnimatePresence mode="wait">
                {booked ? (
                  <motion.div key="booked" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    style={{ background: "#1A1208", padding: "56px 40px", textAlign: "center" }}>
                    <CheckCircle2 style={{ width: 56, height: 56, color: "#4A7C59", margin: "0 auto 20px" }} />
                    <h2 className="bk-display" style={{ fontSize: 32, fontWeight: 900, color: "#F5F0E8", marginBottom: 10 }}>Booked!</h2>
                    <p style={{ color: "rgba(245,240,232,0.45)", fontSize: 14, lineHeight: 1.6 }}>
                      Your request was sent to {selectedBuddy?.name.split(' ')[0]}. They'll reply within 24 hours.
                    </p>
                  </motion.div>
                ) : selectedBuddy ? (
                  <motion.div key="detail" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ background: "#fff", border: "1px solid #DDD6C8", overflow: "hidden" }}>
                    {/* Header */}
                    <div style={{ padding: "28px 28px 24px", borderBottom: "1px solid #F5F0E8" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ position: "relative" }}>
                          <img src={selectedBuddy.photoURL} style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 2 }} alt="" />
                          <div style={{ position: "absolute", bottom: -4, right: -4, width: 22, height: 22, background: "#4A7C59", borderRadius: "50%", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Award style={{ width: 10, height: 10, color: "#fff" }} />
                          </div>
                        </div>
                        <div>
                          <h2 className="bk-display" style={{ fontSize: 22, fontWeight: 900, color: "#1A1208", marginBottom: 6 }}>{selectedBuddy.name}</h2>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 11, background: "rgba(196,98,45,0.08)", color: "#C4622D", padding: "4px 10px", display: "flex", alignItems: "center", gap: 4 }}>
                              <Briefcase style={{ width: 11, height: 11 }} /> {selectedBuddy.experience}
                            </span>
                            <span style={{ fontSize: 11, background: "#FFFBF0", color: "#A16207", padding: "4px 10px", display: "flex", alignItems: "center", gap: 4 }}>
                              <Star style={{ width: 11, height: 11 }} /> {selectedBuddy.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="scroll-pane" style={{ overflowY: "auto", maxHeight: 360, padding: "24px 28px" }}>
                      <div className="bk-mono" style={{ fontSize: 9, color: "#B8B0A4", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>About</div>
                      <p style={{ fontSize: 13, color: "#7A6E61", lineHeight: 1.7, fontWeight: 300, marginBottom: 20 }}>{selectedBuddy.bio}</p>

                      {selectedBuddy.specialties?.length > 0 && (
                        <div style={{ marginBottom: 20 }}>
                          <div className="bk-mono" style={{ fontSize: 9, color: "#B8B0A4", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>Specialties</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {selectedBuddy.specialties.map((s: string, i: number) => (
                              <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: "4px 12px", background: "#F5F0E8", color: "#C4622D", border: "1px solid rgba(196,98,45,0.2)" }}>{s}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Pricing */}
                      <div style={{ background: "#F5F0E8", border: "1px solid #DDD6C8", padding: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #DDD6C8" }}>
                          <div>
                            <div className="bk-mono" style={{ fontSize: 9, color: "#B8B0A4", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>Service / day</div>
                            <div className="bk-display" style={{ fontSize: 26, fontWeight: 900, color: "#1A1208" }}>₱{selectedBuddy.pricePerDay}</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div className="bk-mono" style={{ fontSize: 9, color: "#B8B0A4", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>Platform fee</div>
                            <div className="bk-display" style={{ fontSize: 26, fontWeight: 900, color: "#1A1208" }}>₱49</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <span style={{ fontSize: 12, color: "#B8B0A4" }}>Total estimate</span>
                          <span className="bk-display" style={{ fontSize: 32, fontWeight: 900, color: "#C4622D" }}>₱{selectedBuddy.pricePerDay + 49}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: "0 28px 28px" }}>
                      <button onClick={handleBook} disabled={isBooking} className="book-btn"
                        style={{ width: "100%", padding: "16px", background: "#C4622D", color: "#F5F0E8", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 2 }}>
                        {isBooking
                          ? <div style={{ width: 18, height: 18, border: "2px solid rgba(245,240,232,0.3)", borderTopColor: "#F5F0E8", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                          : <><Calendar style={{ width: 15, height: 15 }} /> Book {selectedBuddy.name.split(' ')[0]}</>
                        }
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div style={{ background: "#fff", border: "1px solid #DDD6C8", padding: "56px 32px", textAlign: "center" }}>
                    <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#F5F0E8", border: "2px solid #DDD6C8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                      <Users style={{ width: 36, height: 36, color: "#DDD6C8" }} />
                    </div>
                    <h3 className="bk-display" style={{ fontSize: 24, fontWeight: 700, color: "#DDD6C8", marginBottom: 8 }}>Select a Guide</h3>
                    <p style={{ fontSize: 13, color: "#B8B0A4", fontWeight: 300 }}>
                      Choose from our verified local experts on the left.
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 24 }}>
                      {[ShieldCheck, Award, MapPin].map((Icon, i) => (
                        <Icon key={i} style={{ width: 18, height: 18, color: "#DDD6C8" }} />
                      ))}
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}