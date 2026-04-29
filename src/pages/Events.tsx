import { Calendar, MapPin, Ticket, Search, CheckCircle2, Star, X } from "lucide-react";
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
  .ev-row { transition: background 0.15s; }
  .ev-row:hover { background: rgba(26,18,8,0.03) !important; }
  .ev-row:hover .ev-index { color: #1A1208 !important; }
  .ev-img { transition: transform 0.6s ease; }
  .ev-row:hover .ev-img { transform: scale(1.08); }
  .notify-btn:hover { background: #C4622D !important; color: #fff !important; border-color: #C4622D !important; }
  .cat-pill { transition: all 0.15s; }
  input, select { font-family: 'Outfit', system-ui, sans-serif; }
  select option { background: #F5F0E8; }
  .ticker { display: flex; gap: 2rem; animation: scroll 22s linear infinite; }
  @keyframes scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
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

  const filters = [
    { id: "all", label: "All Events" },
    { id: "festival", label: "Festivals" },
    { id: "cultural", label: "Cultural" },
    { id: "sports", label: "Sports" },
    { id: "community", label: "Community" }
  ];

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

        {/* Hero */}
        <div style={{ padding: "72px 2rem 56px", maxWidth: 1280, margin: "0 auto", borderBottom: "1px solid #DDD6C8" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 32 }}>
            <div>
              <div className="bk-mono" style={{ fontSize: 10, color: "#C4622D", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ display: "inline-block", width: 24, height: 1, background: "#C4622D" }} />
                Cultural Calendar · Bukidnon
              </div>
              <h1 className="bk-display" style={{ fontSize: "clamp(3.5rem,9vw,8rem)", fontWeight: 900, color: "#1A1208", lineHeight: 0.9, marginBottom: 16 }}>
                Local<br /><em style={{ color: "#C4622D" }}>Events</em>
              </h1>
              <p style={{ fontSize: 16, color: "#7A6E61", maxWidth: 480, lineHeight: 1.7, fontWeight: 300 }}>
                Experience Bukidnon culture through festivals, sports, and community gatherings.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 32, paddingBottom: 8 }}>
              {[["Total", liveEvents.length, "#1A1208"], ["Showing", filteredEvents.length, "#C4622D"]].map(([label, val, color]) => (
                <div key={label as string} style={{ textAlign: "right" }}>
                  <div className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                  <div className="bk-display" style={{ fontSize: 52, fontWeight: 900, color: color as string, lineHeight: 1 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ position: "sticky", top: 72, zIndex: 20, background: "rgba(245,240,232,0.96)", backdropFilter: "blur(10px)", borderBottom: "1px solid #DDD6C8", padding: "14px 2rem" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
            {/* Search */}
            <div style={{ flex: 1, minWidth: 180, position: "relative" }}>
              <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "#7A6E61" }} />
              <input type="text" placeholder="Search events…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={{ width: "100%", paddingLeft: 40, paddingRight: 14, paddingTop: 10, paddingBottom: 10, background: "#fff", border: "1px solid #DDD6C8", borderRadius: 2, fontSize: 14, color: "#1A1208", outline: "none" }} />
            </div>

            {/* Category pills */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {filters.map(f => (
                <button key={f.id} onClick={() => setActiveFilter(f.id)}
                  className="cat-pill"
                  style={{
                    padding: "8px 14px", borderRadius: 2, fontSize: 12, fontWeight: 600, cursor: "pointer",
                    background: activeFilter === f.id ? "#1A1208" : "transparent",
                    color: activeFilter === f.id ? "#F5F0E8" : "#7A6E61",
                    border: activeFilter === f.id ? "1px solid #1A1208" : "1px solid #DDD6C8",
                  }}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Selects */}
            <div style={{ display: "flex", gap: 8, marginLeft: "auto", alignItems: "center" }}>
              <select value={dateRange} onChange={e => setDateRange(e.target.value as any)}
                style={{ padding: "9px 12px", background: "#fff", border: "1px solid #DDD6C8", borderRadius: 2, fontSize: 13, color: "#1A1208", outline: "none" }}>
                <option value="all">Any Date</option>
                <option value="upcoming">Upcoming</option>
                <option value="this-month">This Month</option>
                <option value="next-month">Next Month</option>
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
                style={{ padding: "9px 12px", background: "#fff", border: "1px solid #DDD6C8", borderRadius: 2, fontSize: 13, color: "#1A1208", outline: "none" }}>
                <option value="date">By Date</option>
                <option value="rating">By Rating</option>
                <option value="name">A–Z</option>
              </select>
              {(searchQuery || activeFilter !== "all" || dateRange !== "all") && (
                <button onClick={() => { setSearchQuery(""); setActiveFilter("all"); setDateRange("all"); setSortBy("date"); }}
                  style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "#C4622D", background: "transparent", border: "none", cursor: "pointer" }}>
                  <X style={{ width: 14, height: 14 }} /> Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Events list */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem 80px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ width: 36, height: 36, border: "2px solid #C4622D", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
              <p className="bk-mono" style={{ fontSize: 11, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase" }}>Loading events…</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredEvents.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "80px 0" }}>
                  <div className="bk-display" style={{ fontSize: 48, color: "#DDD6C8", marginBottom: 8 }}>No events found</div>
                  <p style={{ color: "#7A6E61", fontSize: 14 }}>Try adjusting your filters</p>
                </motion.div>
              ) : (
                filteredEvents.map((ev, i) => (
                  <motion.div key={ev.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}>
                    <div className="ev-row" style={{
                      display: "grid", gridTemplateColumns: "auto 1fr auto",
                      gap: 28, alignItems: "center",
                      borderBottom: "1px solid #DDD6C8", padding: "28px 8px",
                      cursor: "default",
                    }}>
                      {/* Left: index + image */}
                      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                        <span className="bk-display ev-index" style={{ fontSize: 42, fontWeight: 900, color: "#DDD6C8", width: 48, textAlign: "right", lineHeight: 1, transition: "color 0.15s", userSelect: "none" }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div style={{ width: 120, height: 84, borderRadius: 2, overflow: "hidden", flexShrink: 0, border: "1px solid #DDD6C8" }}>
                          <img src={ev.image || "https://images.unsplash.com/photo-1548013146-72479768bbaa"} className="ev-img" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={ev.name}
                            onError={e => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1548013146-72479768bbaa"; }} />
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
                          <span className="bk-mono" style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C4622D", background: "rgba(196,98,45,0.08)", padding: "4px 10px", border: "1px solid rgba(196,98,45,0.2)" }}>
                            {ev.category}
                          </span>
                          <span style={{ fontSize: 12, color: "#7A6E61", display: "flex", alignItems: "center", gap: 4 }}>
                            <Calendar style={{ width: 12, height: 12 }} /> {ev.date}
                          </span>
                          {ev.rating && (
                            <span style={{ fontSize: 12, color: "#7A6E61", display: "flex", alignItems: "center", gap: 3 }}>
                              <Star style={{ width: 12, height: 12, fill: "#D4A853", color: "#D4A853" }} /> {ev.rating}
                            </span>
                          )}
                        </div>
                        <h3 className="bk-display" style={{ fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 900, color: "#1A1208", marginBottom: 6, lineHeight: 1.1 }}>
                          {ev.name}
                        </h3>
                        <p style={{ fontSize: 13, color: "#7A6E61", marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontWeight: 300 }}>
                          {ev.description}
                        </p>
                        <p style={{ fontSize: 12, color: "#7A6E61", display: "flex", alignItems: "center", gap: 4 }}>
                          <MapPin style={{ width: 12, height: 12, color: "#C4622D" }} /> {ev.location}
                        </p>
                      </div>

                      {/* Action */}
                      <button
                        onClick={() => handleNotifyMe(ev)}
                        disabled={isBooking === ev.id || booked === ev.id}
                        className="notify-btn"
                        style={{
                          padding: "12px 20px", borderRadius: 2, fontSize: 13, fontWeight: 600, cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
                          background: booked === ev.id ? "rgba(74,124,89,0.08)" : "transparent",
                          color: booked === ev.id ? "#4A7C59" : "#7A6E61",
                          border: booked === ev.id ? "1px solid #4A7C59" : "1px solid #DDD6C8",
                          transition: "all 0.15s",
                        }}>
                        {isBooking === ev.id ? (
                          <div style={{ width: 16, height: 16, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                        ) : booked === ev.id ? (
                          <><CheckCircle2 style={{ width: 15, height: 15 }} /> Subscribed</>
                        ) : (
                          <><Ticket style={{ width: 15, height: 15 }} /> Notify Me</>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </>
  );
}