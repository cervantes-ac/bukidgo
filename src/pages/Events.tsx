import { Calendar, MapPin, Ticket, Search, CheckCircle2, Star, X, Flame, Users, Music, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useMemo } from "react";
import { cn } from "../lib/utils";
import { useFirebase } from "../contexts/FirebaseContext";
import { db, OperationType, handleFirestoreError } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
  .bk-display { font-family: 'Fraunces', Georgia, serif; }
  .bk-mono { font-family: 'JetBrains Mono', monospace; }
  
  .event-card { 
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    overflow: hidden;
  }
  .event-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, #C4622D, #D4A853, #C4622D);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 10;
  }
  .event-card:hover { 
    transform: translateY(-12px);
    box-shadow: 0 32px 64px rgba(26,18,8,0.2);
  }
  .event-card:hover::before { transform: scaleX(1); }
  
  .event-img { 
    transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
  }
  .event-card:hover .event-img { transform: scale(1.15); }
  
  .tribal-accent {
    position: absolute;
    opacity: 0.08;
    pointer-events: none;
  }
  
  .cat-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .cat-pill { 
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    border-radius: 20px;
  }
  .cat-pill:hover { transform: translateY(-2px); }
  .cat-pill:focus-visible { outline: 2px solid #C4622D; outline-offset: 2px; }
  
  input, select { font-family: 'Outfit', system-ui, sans-serif; }
  select option { background: #F5F0E8; }
  input:focus, select:focus { outline: 2px solid #C4622D; outline-offset: 2px; }
  
  .ticker { display: flex; gap: 2rem; animation: scroll 22s linear infinite; }
  @keyframes scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
`;

export default function Events() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useFirebase();
  const [isBooking, setIsBooking] = useState<string | null>(null);
  const [booked, setBooked] = useState<string | null>(null);
  const navigate = useNavigate();
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<"all" | "upcoming" | "this-month" | "next-month">("all");
  const [sortBy, setSortBy] = useState<"date" | "rating" | "name">("date");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      setLiveEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return unsubscribe;
  }, []);

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case "festival": return Flame;
      case "cultural": return Music;
      case "sports": return Trophy;
      case "community": return Users;
      default: return Calendar;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case "festival": return { bg: "#FEE2E2", color: "#991B1B", accent: "#DC2626" };
      case "cultural": return { bg: "#FEF3C7", color: "#92400E", accent: "#F59E0B" };
      case "sports": return { bg: "#DBEAFE", color: "#1E40AF", accent: "#3B82F6" };
      case "community": return { bg: "#DCFCE7", color: "#166534", accent: "#22C55E" };
      default: return { bg: "#F3E8FF", color: "#6B21A8", accent: "#A855F7" };
    }
  };

  const filteredEvents = useMemo(() => {
    let filtered = liveEvents.filter(e => {
      const matchesFilter = activeFilter === "all" || e.category === activeFilter;
      const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDate = dateRange === "all" ? true : (() => {
        const today = new Date();
        const months = ["january","february","march","april","may","june","july","august","september","october","november","december"];
        const eMonth = months.findIndex(m => (e.date||"").toLowerCase().includes(m));
        if (dateRange === "upcoming") return eMonth >= today.getMonth();
        if (dateRange === "this-month") return eMonth === today.getMonth();
        if (dateRange === "next-month") return eMonth === (today.getMonth() + 1) % 12;
        return true;
      })();
      return matchesFilter && matchesSearch && matchesDate;
    });
    filtered.sort((a, b) => {
      if (sortBy === "rating") return (b.rating||0) - (a.rating||0);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return (a.date||"").localeCompare(b.date||"");
    });
    return filtered;
  }, [liveEvents, searchQuery, activeFilter, dateRange, sortBy]);

  const handleNotifyMe = async (ev: any) => {
    if (!user) { navigate('/auth'); return; }
    setIsBooking(ev.id);
    try {
      await addDoc(collection(db, "bookings"), {
        userId: user.uid, userName: user.displayName || "User", userEmail: user.email,
        eventId: ev.id, eventName: ev.name, date: ev.date, status: "pending",
        createdAt: serverTimestamp(), type: "event"
      });
      setBooked(ev.id);
      setTimeout(() => setBooked(null), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "bookings");
    } finally {
      setIsBooking(null);
    }
  };

  return (
    <>
      <style>{S}</style>
      <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", background: "#F5F0E8", color: "#1A1208", minHeight: "100vh" }}>

        {/* Ticker */}
        <div style={{ background: "#1A1208", borderBottom: "1px solid rgba(245,240,232,0.06)", padding: "12px 0", overflow: "hidden" }}>
          <div className="ticker" style={{ whiteSpace: "nowrap" }}>
            {["KAAMULAN FESTIVAL","HIGHLAND GAMES","CULTURAL PARADE","FOLK ARTS FESTIVAL","CORN HARVEST FEST","TRIBAL GATHERING",
              "KAAMULAN FESTIVAL","HIGHLAND GAMES","CULTURAL PARADE","FOLK ARTS FESTIVAL","CORN HARVEST FEST","TRIBAL GATHERING"].map((t, i) => (
              <span key={i} className="bk-mono" style={{ fontSize: 10, color: "rgba(245,240,232,0.25)", letterSpacing: "0.25em", textTransform: "uppercase" }}>
                {t} <span style={{ color: "#D4A853", margin: "0 8px" }}>◆</span>
              </span>
            ))}
          </div>
        </div>

        {/* Hero Section */}
        <div style={{ padding: "88px 2rem 64px", maxWidth: 1280, margin: "0 auto", position: "relative" }}>
          <div style={{ position: "absolute", top: -40, right: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(196,98,45,0.08), transparent)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 2 }}>
            <div className="bk-mono" style={{ fontSize: 11, color: "#C4622D", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "inline-block", width: 28, height: 2, background: "#C4622D" }} />
              Cultural Calendar · Bukidnon
            </div>
            <h1 className="bk-display" style={{ fontSize: "clamp(3.5rem,9vw,8rem)", fontWeight: 900, color: "#1A1208", lineHeight: 0.9, marginBottom: 20 }}>
              Celebrate<br /><em style={{ color: "#C4622D" }}>Bukidnon</em>
            </h1>
            <p style={{ fontSize: 17, color: "#7A6E61", maxWidth: 520, lineHeight: 1.8, fontWeight: 300, marginBottom: 32 }}>
              Immerse yourself in vibrant festivals, cultural celebrations, and community gatherings that showcase the spirit of the highlands.
            </p>
            <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
              {[["Total Events", liveEvents.length], ["Upcoming", filteredEvents.length]].map(([label, val]) => (
                <div key={label as string}>
                  <div className="bk-display" style={{ fontSize: 48, fontWeight: 900, color: "#C4622D", lineHeight: 1 }}>{val}</div>
                  <div className="bk-mono" style={{ fontSize: 10, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 6 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={{ position: "sticky", top: 72, zIndex: 20, background: "rgba(245,240,232,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid #DDD6C8", padding: "16px 2rem" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 12 }}>
              {/* Search */}
              <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
                <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#7A6E61" }} />
                <input type="text" placeholder="Search events…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: "100%", paddingLeft: 40, paddingRight: 14, paddingTop: 11, paddingBottom: 11, background: "#fff", border: "1px solid #DDD6C8", borderRadius: 6, fontSize: 14, color: "#1A1208", outline: "none" }} />
              </div>

              {/* Selects */}
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <select value={dateRange} onChange={e => setDateRange(e.target.value as any)}
                  style={{ padding: "10px 12px", background: "#fff", border: "1px solid #DDD6C8", borderRadius: 6, fontSize: 13, color: "#1A1208", outline: "none" }}>
                  <option value="all">Any Date</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="this-month">This Month</option>
                  <option value="next-month">Next Month</option>
                </select>
                <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
                  style={{ padding: "10px 12px", background: "#fff", border: "1px solid #DDD6C8", borderRadius: 6, fontSize: 13, color: "#1A1208", outline: "none" }}>
                  <option value="date">By Date</option>
                  <option value="rating">By Rating</option>
                  <option value="name">A–Z</option>
                </select>
                {(searchQuery || activeFilter !== "all" || dateRange !== "all") && (
                  <button onClick={() => { setSearchQuery(""); setActiveFilter("all"); setDateRange("all"); setSortBy("date"); }}
                    style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "#C4622D", background: "transparent", border: "none", cursor: "pointer", padding: "8px 12px" }}>
                    <X style={{ width: 14, height: 14 }} /> Reset
                  </button>
                )}
              </div>
            </div>

            {/* Category Pills */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[{ id: "all", label: "All Events" }, { id: "festival", label: "Festivals" }, { id: "cultural", label: "Cultural" }, { id: "sports", label: "Sports" }, { id: "community", label: "Community" }].map(f => (
                <button key={f.id} onClick={() => setActiveFilter(f.id)}
                  className="cat-pill"
                  style={{
                    padding: "8px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
                    background: activeFilter === f.id ? "#1A1208" : "transparent",
                    color: activeFilter === f.id ? "#F5F0E8" : "#7A6E61",
                    border: activeFilter === f.id ? "1px solid #1A1208" : "1px solid #DDD6C8",
                  }}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 2rem 88px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ width: 40, height: 40, border: "3px solid #C4622D", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
              <p className="bk-mono" style={{ fontSize: 12, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase" }}>Loading events…</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredEvents.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "80px 0" }}>
                  <div className="bk-display" style={{ fontSize: 48, color: "#DDD6C8", marginBottom: 12 }}>No events found</div>
                  <p style={{ color: "#7A6E61", fontSize: 15 }}>Try adjusting your filters to discover more celebrations</p>
                </motion.div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 28 }}>
                  {filteredEvents.map((ev, i) => {
                    const catColor = getCategoryColor(ev.category);
                    const CatIcon = getCategoryIcon(ev.category);
                    return (
                      <motion.div key={ev.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.05 }}
                        className="event-card" style={{ background: "#fff", border: "1px solid #DDD6C8", borderRadius: 12, overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column" }}>
                        
                        {/* Image */}
                        <div style={{ position: "relative", height: 240, overflow: "hidden" }}>
                          <img src={ev.image || "https://images.unsplash.com/photo-1548013146-72479768bbaa"} className="event-img" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={ev.name}
                            onError={e => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1548013146-72479768bbaa"; }} />
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,18,8,0.8) 0%, rgba(26,18,8,0.2) 50%, transparent 100%)" }} />
                          
                          {/* Category Badge */}
                          <div style={{ position: "absolute", top: 16, left: 16 }}>
                            <div className="cat-badge" style={{ background: catColor.bg, color: catColor.color }}>
                              <CatIcon style={{ width: 14, height: 14 }} />
                              {ev.category}
                            </div>
                          </div>

                          {/* Rating */}
                          {ev.rating && (
                            <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(245,240,232,0.95)", padding: "6px 12px", borderRadius: 20, display: "flex", alignItems: "center", gap: 4 }}>
                              <Star style={{ width: 13, height: 13, fill: "#D4A853", color: "#D4A853" }} />
                              <span className="bk-mono" style={{ fontSize: 11, fontWeight: 700, color: "#1A1208" }}>{ev.rating}</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
                          <h3 className="bk-display" style={{ fontSize: "clamp(18px, 4vw, 24px)", fontWeight: 900, color: "#1A1208", marginBottom: 12, lineHeight: 1.2 }}>
                            {ev.name}
                          </h3>

                          <p style={{ fontSize: 13, color: "#7A6E61", lineHeight: 1.6, marginBottom: 16, flex: 1, fontWeight: 300, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {ev.description}
                          </p>

                          {/* Meta Info */}
                          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #EEE8DC" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#7A6E61" }}>
                              <Calendar style={{ width: 14, height: 14, color: "#C4622D", flexShrink: 0 }} />
                              <span>{ev.date}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#7A6E61" }}>
                              <MapPin style={{ width: 14, height: 14, color: "#C4622D", flexShrink: 0 }} />
                              <span>{ev.location}</span>
                            </div>
                          </div>

                          {/* Button */}
                          <button
                            onClick={() => handleNotifyMe(ev)}
                            disabled={isBooking === ev.id || booked === ev.id}
                            style={{
                              width: "100%", padding: "12px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center", gap: 8, whiteSpace: "nowrap",
                              background: booked === ev.id ? "#DCFCE7" : "#C4622D",
                              color: booked === ev.id ? "#166534" : "#fff",
                              border: booked === ev.id ? "1px solid #22C55E" : "1px solid #C4622D",
                              transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                            }}
                            onMouseEnter={e => {
                              if (booked !== ev.id && isBooking !== ev.id) {
                                e.currentTarget.style.background = "#B8511F";
                                e.currentTarget.style.transform = "translateY(-2px)";
                              }
                            }}
                            onMouseLeave={e => {
                              if (booked !== ev.id && isBooking !== ev.id) {
                                e.currentTarget.style.background = "#C4622D";
                                e.currentTarget.style.transform = "translateY(0)";
                              }
                            }}>
                            {isBooking === ev.id ? (
                              <div style={{ width: 16, height: 16, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                            ) : booked === ev.id ? (
                              <><CheckCircle2 style={{ width: 16, height: 16 }} /> Subscribed</>
                            ) : (
                              <><Ticket style={{ width: 16, height: 16 }} /> Notify Me</>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </>
  );
}