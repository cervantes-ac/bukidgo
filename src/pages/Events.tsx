import { Calendar, MapPin, Ticket, Filter, X, Search, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EVENTS } from "../constants";
import { useState, useEffect } from "react";
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

  const [liveEvents, setLiveEvents] = useState<any[]>(EVENTS || []);

  useEffect(() => {
    return onSnapshot(collection(db, "events"), (snapshot) => {
      if (!snapshot.empty) {
        setLiveEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    });
  }, []);

  const filters = [
    { id: "all", label: "All Events" },
    { id: "festival", label: "Festivals" },
    { id: "cultural", label: "Cultural" },
    { id: "sports", label: "Sports" },
    { id: "community", label: "Community" }
  ];

  const filteredEvents = liveEvents.filter(e => {
    const matchesFilter = activeFilter === "all" || e.category === activeFilter;
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         e.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-xl">
          <h1 className="text-5xl font-serif font-bold text-forest mb-4">Local Events</h1>
          <p className="text-stone/60 text-lg">Experience the rich heart and soul of Bukidnon culture.</p>
        </div>
        
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone/40 group-focus-within:text-earth transition-colors" />
            <input 
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 bg-white border border-clay rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-earth transition-all shadow-sm text-stone placeholder:text-stone/30"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-bold transition-all border",
                  activeFilter === f.id 
                    ? "bg-earth text-white border-earth shadow-lg shadow-earth/20 scale-105" 
                    : "bg-white text-stone/60 border-clay hover:border-earth/30"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
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
      </div>
    </div>
  );
}
