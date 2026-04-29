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

  // Enhanced filter states
  const [minRating, setMinRating] = useState(0);
  const [dateRange, setDateRange] = useState<"all" | "upcoming" | "this-month" | "next-month">("all");
  const [sortBy, setSortBy] = useState<"date" | "rating" | "name">("date");

  useEffect(() => {
    return onSnapshot(collection(db, "events"), (snapshot) => {
      if (!snapshot.empty) {
        setLiveEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
      setLoading(false);
    });
  }, []);

  const filters = [
    { id: "all", label: "All Events", icon: Calendar },
    { id: "festival", label: "Festivals", icon: Users },
    { id: "cultural", label: "Cultural", icon: Users },
    { id: "sports", label: "Sports", icon: Users },
    { id: "community", label: "Community", icon: Users }
  ];

  const filteredEvents = useMemo(() => {
    let filtered = liveEvents.filter(e => {
      const matchesFilter = activeFilter === "all" || e.category === activeFilter;
      const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           e.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRating = e.rating >= minRating;
      
      // Date filtering
      const eventDate = new Date(e.date);
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(today.getMonth() + 1);
      
      const matchesDate = dateRange === "all" || 
        (dateRange === "upcoming" && eventDate >= today) ||
        (dateRange === "this-month" && 
          eventDate.getMonth() === today.getMonth() && 
          eventDate.getFullYear() === today.getFullYear()) ||
        (dateRange === "next-month" && 
          eventDate.getMonth() === nextMonth.getMonth() && 
          eventDate.getFullYear() === nextMonth.getFullYear());
      
      return matchesFilter && matchesSearch && matchesRating && matchesDate;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
      }
      if (sortBy === "rating") return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [liveEvents, searchQuery, activeFilter, minRating, dateRange, sortBy]);

  const handleNotifyMe = async (ev: any) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setIsBooking(ev.id);
    try {
      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        userName: user.displayName || "User",
        userEmail: user.email,
        eventId: ev.id,
        eventName: ev.name,
        date: ev.date,
        status: "pending",
        createdAt: serverTimestamp(),
        type: "event"
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="relative rounded-[4rem] overflow-hidden mb-16 bg-gradient-to-br from-purple-900/90 to-indigo-800/90 p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <span className="text-white/80 font-black uppercase tracking-[0.3em] text-sm">Cultural Calendar</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
            Local <br />
            <span className="text-linen underline decoration-white/30">Events</span>
          </h1>
          <p className="text-white/60 text-xl max-w-2xl leading-relaxed">
            Experience the rich heart and soul of Bukidnon culture through festivals, sports, and community gatherings.
          </p>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="mb-12 bg-white rounded-[3rem] p-8 border border-clay shadow-lg">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Search */}
          <div className="flex-1">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone/40 group-focus-within:text-earth transition-colors" />
              <input 
                type="text"
                placeholder="Search events by name, location, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-linen border border-clay rounded-[2rem] focus:ring-2 focus:ring-earth outline-none transition-all font-medium text-stone placeholder:text-stone/30"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4">
            {/* Rating Filter */}
            <div className="space-y-2 min-w-[180px]">
              <label className="text-xs font-black uppercase tracking-widest text-stone/30 flex items-center gap-2">
                <Star className="w-3 h-3" /> Min Rating
              </label>
              <select 
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full bg-white border border-clay rounded-2xl px-4 py-3 text-sm font-bold text-stone focus:ring-2 focus:ring-earth outline-none"
              >
                <option value={0}>Any Rating</option>
                <option value={4.0}>4.0+ Stars</option>
                <option value={4.3}>4.3+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={4.7}>4.7+ Stars</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2 min-w-[180px]">
              <label className="text-xs font-black uppercase tracking-widest text-stone/30 flex items-center gap-2">
                <Clock className="w-3 h-3" /> Date Range
              </label>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as "all" | "upcoming" | "this-month" | "next-month")}
                className="w-full bg-white border border-clay rounded-2xl px-4 py-3 text-sm font-bold text-stone focus:ring-2 focus:ring-earth outline-none"
              >
                <option value="all">All Dates</option>
                <option value="upcoming">Upcoming Only</option>
                <option value="this-month">This Month</option>
                <option value="next-month">Next Month</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="space-y-2 min-w-[180px]">
              <label className="text-xs font-black uppercase tracking-widest text-stone/30 flex items-center gap-2">
                <Filter className="w-3 h-3" /> Sort By
              </label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "rating" | "name")}
                className="w-full bg-white border border-clay rounded-2xl px-4 py-3 text-sm font-bold text-stone focus:ring-2 focus:ring-earth outline-none"
              >
                <option value="date">Date (Soonest)</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mt-6 pt-6 border-t border-clay/30">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-earth" />
            <label className="text-xs font-black uppercase tracking-widest text-stone/30">Event Categories</label>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-bold transition-all border flex items-center gap-2",
                    activeFilter === f.id 
                      ? "bg-earth text-white border-earth shadow-lg shadow-earth/20" 
                      : "bg-white text-stone/60 border-clay hover:border-earth/30"
                  )}
                >
                  <Icon className={cn("w-4 h-4", activeFilter === f.id ? "text-white" : "text-earth/50")} />
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-earth/10 rounded-2xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-earth" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-stone/30">Available Events</p>
              <p className="text-2xl font-serif font-bold text-forest">
                {filteredEvents.length} <span className="text-stone/40 text-lg">/ {liveEvents.length}</span>
              </p>
            </div>
          </div>
          {(searchQuery || activeFilter !== "all" || minRating > 0 || dateRange !== "all") && (
            <button 
              onClick={() => { 
                setSearchQuery(""); 
                setActiveFilter("all"); 
                setMinRating(0);
                setDateRange("all");
                setSortBy("date");
              }}
              className="text-earth font-black uppercase tracking-widest text-xs hover:underline flex items-center gap-2"
            >
              <X className="w-3 h-3" />
              Reset All Filters
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-3 border-earth border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-stone/40">Loading events...</p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((ev, i) => (
                <motion.div 
                  key={ev.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white group rounded-[3rem] border border-clay overflow-hidden flex flex-col md:flex-row items-stretch shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="w-full md:w-80 h-64 md:h-auto relative overflow-hidden">
                    <img src={ev.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={ev.name} />
                    <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest text-earth">
                      {ev.category}
                    </div>
                  </div>

                  <div className="p-10 flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-forest/40 font-bold text-xs uppercase tracking-[0.2em] mb-4">
                      <Calendar className="w-4 h-4" />
                      {ev.date}
                    </div>
                    <h3 className="text-4xl font-serif font-bold text-stone mb-4 group-hover:text-forest transition-colors">{ev.name}</h3>
                    <p className="text-stone/60 leading-relaxed mb-8 max-w-2xl text-lg">{ev.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2 text-stone/40 font-medium">
                        <MapPin className="w-5 h-5 text-earth" />
                        {ev.location}
                      </div>
                      <button 
                        onClick={() => handleNotifyMe(ev)}
                        disabled={isBooking === ev.id || booked === ev.id}
                        className={cn(
                          "ml-auto px-8 py-4 rounded-2xl font-bold border transition-all flex items-center gap-2 shadow-sm",
                          booked === ev.id 
                            ? "bg-forest border-forest text-white" 
                            : "bg-linen text-stone border-clay hover:bg-earth hover:text-white hover:border-earth"
                        )}
                      >
                        {isBooking === ev.id ? (
                          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : booked === ev.id ? (
                          <>
                            <CheckCircle2 className="w-5 h-5" /> Subscribed
                          </>
                        ) : (
                          <>
                            <Ticket className="w-5 h-5" /> Notify Me
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredEvents.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-32 text-center"
              >
                <div className="w-20 h-20 bg-clay/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter className="w-8 h-8 text-stone/20" />
                </div>
                <h3 className="text-xl font-bold text-stone mb-2">No events found</h3>
                <p className="text-stone/40">Try selecting a different category or name.</p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}