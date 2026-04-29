import { Calendar, MapPin, Ticket, Filter, Search, CheckCircle2, Star, Clock, Users, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useMemo } from "react";
import { cn } from "../lib/utils";
import { useFirebase } from "../contexts/FirebaseContext";
import { db, OperationType, handleFirestoreError } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Events() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useFirebase();
  const [isBooking, setIsBooking] = useState<string | null>(null);
  const [booked, setBooked] = useState<string | null>(null);
  const navigate = useNavigate();

  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [minRating, setMinRating] = useState(0);
  const [dateRange, setDateRange] = useState<"all" | "upcoming" | "this-month" | "next-month">("all");
  const [sortBy, setSortBy] = useState<"date" | "rating" | "name">("date");

  useEffect(() => {
    console.log("Setting up Firestore listener for events...");
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(`Firestore snapshot received: ${events.length} events`);
      console.log("Sample event data:", events.length > 0 ? {
        name: events[0].name,
        category: events[0].category,
        rating: events[0].rating,
        date: events[0].date
      } : "No events");
      setLiveEvents(events);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to events collection:", error);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  const filters = [
    { id: "all", label: "All" },
    { id: "festival", label: "Festivals" },
    { id: "cultural", label: "Cultural" },
    { id: "sports", label: "Sports" },
    { id: "community", label: "Community" }
  ];

  const filteredEvents = useMemo(() => {
    let filtered = liveEvents.filter(e => {
      const matchesFilter = activeFilter === "all" || e.category === activeFilter;
      const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           e.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRating = (e.rating || 0) >= minRating;
      
      // Handle date filtering more gracefully
      let matchesDate = true;
      if (dateRange !== "all") {
        const eventDateStr = e.date || "";
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        // Try to parse month from date string
        const monthNames = ["january", "february", "march", "april", "may", "june", 
                           "july", "august", "september", "october", "november", "december"];
        const eventMonthStr = eventDateStr.toLowerCase().split(" ")[0];
        const eventMonthIndex = monthNames.findIndex(m => eventMonthStr.includes(m));
        
        if (dateRange === "upcoming") {
          // For upcoming, just check if it's in the future (simplified logic)
          matchesDate = eventMonthIndex >= currentMonth || eventDateStr.toLowerCase().includes("december");
        } else if (dateRange === "this-month") {
          matchesDate = eventMonthIndex === currentMonth;
        } else if (dateRange === "next-month") {
          const nextMonthIndex = (currentMonth + 1) % 12;
          matchesDate = eventMonthIndex === nextMonthIndex;
        }
      }
      
      return matchesFilter && matchesSearch && matchesRating && matchesDate;
    });
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        // Try to parse dates, fall back to string comparison
        try {
          const dateA = new Date(a.date || "").getTime();
          const dateB = new Date(b.date || "").getTime();
          return dateA - dateB;
        } catch {
          return (a.date || "").localeCompare(b.date || "");
        }
      }
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return a.name.localeCompare(b.name);
    });
    return filtered;
  }, [liveEvents, searchQuery, activeFilter, minRating, dateRange, sortBy]);

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
    <div className="min-h-screen bg-[#0d0d0d]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        .events-page { font-family: 'DM Sans', sans-serif; }
        .events-display { font-family: 'Playfair Display', serif; }
        .events-ticker { display: flex; gap: 3rem; animation: ticker 20s linear infinite; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .ev-card-img { transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .ev-card:hover .ev-card-img { transform: scale(1.05); }
        .cat-pill { transition: all 0.2s ease; }
        .cat-pill.active { background: #e8c547; color: #0d0d0d; }
        .notify-btn { transition: all 0.25s ease; }
        .notify-btn:hover { background: #e8c547; color: #0d0d0d; border-color: #e8c547; }
        input[type="text"], select { background: #1a1a1a !important; border: 1px solid #2a2a2a !important; color: #f5f0e8 !important; }
        input[type="text"]::placeholder { color: #555 !important; }
        input[type="text"]:focus, select:focus { border-color: #e8c547 !important; outline: none !important; box-shadow: none !important; }
        select option { background: #1a1a1a; }
        .line-accent { background: linear-gradient(90deg, #e8c547 0%, #e8c54700 100%); }
      `}</style>

      <div className="events-page">
        {/* Ticker tape header */}
        <div className="border-y border-[#2a2a2a] py-3 overflow-hidden bg-[#111]">
          <div className="flex overflow-hidden">
            <div className="events-ticker whitespace-nowrap">
              {["KAAMULAN FESTIVAL", "HIGHLAND GAMES", "CULTURAL PARADE", "BUKIDNON FOLK ARTS", "CORN HARVEST FEST", "TRIBAL GATHERING", "KAAMULAN FESTIVAL", "HIGHLAND GAMES", "CULTURAL PARADE", "BUKIDNON FOLK ARTS", "CORN HARVEST FEST", "TRIBAL GATHERING"].map((t, i) => (
                <span key={i} className="text-[11px] font-medium tracking-[0.25em] text-[#555] uppercase">
                  {t} <span className="text-[#e8c547] mx-2">◆</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="px-6 md:px-12 pt-16 pb-12 border-b border-[#2a2a2a]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div>
                <p className="text-[#e8c547] text-[11px] font-medium tracking-[0.4em] uppercase mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-[#e8c547] inline-block" />
                  Cultural Calendar · Bukidnon
                </p>
                <h1 className="events-display text-[clamp(4rem,10vw,9rem)] font-black leading-[0.88] text-[#f5f0e8] mb-6">
                  Local<br />
                  <span className="italic text-[#e8c547]">Events</span>
                </h1>
                <p className="text-[#888] text-lg max-w-xl leading-relaxed font-light">
                  Experience the rich heart and soul of Bukidnon culture through festivals, sports, and community gatherings.
                </p>
              </div>
              <div className="flex items-center gap-6 lg:pb-2">
                <div className="text-right">
                  <p className="text-[#555] text-[11px] tracking-[0.2em] uppercase mb-1">Total Events</p>
                  <p className="events-display text-5xl font-bold text-[#f5f0e8]">{liveEvents.length}</p>
                </div>
                <div className="w-px h-16 bg-[#2a2a2a]" />
                <div className="text-right">
                  <p className="text-[#555] text-[11px] tracking-[0.2em] uppercase mb-1">Showing</p>
                  <p className="events-display text-5xl font-bold text-[#e8c547]">{filteredEvents.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls bar */}
        <div className="sticky top-0 z-30 bg-[#0d0d0d]/95 backdrop-blur-md border-b border-[#2a2a2a] px-6 md:px-12 py-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm font-medium"
              />
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={cn(
                    "cat-pill px-4 py-2 rounded-full text-xs font-medium border tracking-wide",
                    activeFilter === f.id
                      ? "active border-[#e8c547]"
                      : "border-[#2a2a2a] text-[#888] hover:border-[#555]"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Quick filters */}
            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="px-3 py-2.5 rounded-xl text-xs font-medium"
              >
                <option value="all">Any Date</option>
                <option value="upcoming">Upcoming</option>
                <option value="this-month">This Month</option>
                <option value="next-month">Next Month</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2.5 rounded-xl text-xs font-medium"
              >
                <option value="date">Sort: Date</option>
                <option value="rating">Sort: Rating</option>
                <option value="name">Sort: A–Z</option>
              </select>

              {(searchQuery || activeFilter !== "all" || minRating > 0 || dateRange !== "all") && (
                <button
                  onClick={() => { setSearchQuery(""); setActiveFilter("all"); setMinRating(0); setDateRange("all"); setSortBy("date"); }}
                  className="flex items-center gap-1.5 text-xs text-[#e8c547] hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Events grid */}
        <div className="px-6 md:px-12 py-12 max-w-7xl mx-auto">
          {loading ? (
            <div className="py-32 flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-[#e8c547] border-t-transparent rounded-full animate-spin" />
              <p className="text-[#555] text-sm tracking-widest uppercase">Loading events...</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredEvents.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-32 text-center"
                >
                  <p className="events-display text-6xl text-[#2a2a2a] mb-4">¯\_(ツ)_/¯</p>
                  <p className="text-[#555] tracking-widest uppercase text-sm">No events found</p>
                </motion.div>
              ) : (
                <div className="space-y-0">
                  {filteredEvents.map((ev, i) => (
                    <motion.div
                      key={ev.id}
                      layout
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="ev-card group border-b border-[#2a2a2a] py-10 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-8 items-center hover:bg-[#111] transition-colors px-4 -mx-4 rounded-2xl"
                    >
                      {/* Index + image */}
                      <div className="flex items-center gap-8">
                        <span className="events-display text-[#2a2a2a] text-5xl font-black w-12 text-right leading-none select-none">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div className="w-32 h-24 rounded-2xl overflow-hidden shrink-0 border border-[#2a2a2a]">
                          <img 
                            src={ev.image || "https://images.unsplash.com/photo-1548013146-72479768bbaa"} 
                            className="ev-card-img w-full h-full object-cover" 
                            alt={ev.name} 
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1548013146-72479768bbaa";
                            }}
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-[#e8c547] bg-[#e8c54715] px-3 py-1 rounded-full border border-[#e8c54730]">
                            {ev.category}
                          </span>
                          <span className="text-[#555] text-xs flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" /> {ev.date}
                          </span>
                          {ev.rating && (
                            <span className="text-[#555] text-xs flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-[#e8c547] text-[#e8c547]" /> {ev.rating}
                            </span>
                          )}
                        </div>
                        <h3 className="events-display text-2xl md:text-3xl font-bold text-[#f5f0e8] mb-2 group-hover:text-[#e8c547] transition-colors line-clamp-1">
                          {ev.name}
                        </h3>
                        <p className="text-[#666] text-sm leading-relaxed line-clamp-2 max-w-2xl font-light">{ev.description}</p>
                        <div className="flex items-center gap-1.5 mt-3 text-[#555] text-xs">
                          <MapPin className="w-3.5 h-3.5 text-[#e8c547]" /> {ev.location}
                        </div>
                      </div>

                      {/* Action */}
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => handleNotifyMe(ev)}
                          disabled={isBooking === ev.id || booked === ev.id}
                          className={cn(
                            "notify-btn px-6 py-3 rounded-xl text-sm font-medium border flex items-center gap-2 whitespace-nowrap",
                            booked === ev.id
                              ? "bg-green-900/30 border-green-700 text-green-400"
                              : "border-[#2a2a2a] text-[#888]"
                          )}
                        >
                          {isBooking === ev.id ? (
                            <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" />
                          ) : booked === ev.id ? (
                            <><CheckCircle2 className="w-4 h-4" /> Subscribed</>
                          ) : (
                            <><Ticket className="w-4 h-4" /> Notify Me</>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}