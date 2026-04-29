import { Search, MapPin, Star, Navigation, Utensils, X, Compass, Filter, ArrowUpRight, Calendar, CheckCircle2, DollarSign, Mountain, Eye, Users } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { FoodSpot, Destination } from "../types";
import { useFirebase } from "../contexts/FirebaseContext";
import { db, OperationType, handleFirestoreError } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Explore() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedFood, setSelectedFood] = useState<FoodSpot | null>(null);
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useFirebase();
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const navigate = useNavigate();

  const [liveDestinations, setLiveDestinations] = useState<Destination[]>([]);
  const [liveFoodSpots, setLiveFoodSpots] = useState<FoodSpot[]>([]);
  const [loading, setLoading] = useState(true);

  const [minRating, setMinRating] = useState(0);
  const [maxEntranceFee, setMaxEntranceFee] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"rating" | "name" | "entranceFee">("rating");

  useEffect(() => {
    const unsubDest = onSnapshot(collection(db, "destinations"), (snapshot) => {
      if (!snapshot.empty) setLiveDestinations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Destination)));
      setLoading(false);
    });
    const unsubFood = onSnapshot(collection(db, "foodSpots"), (snapshot) => {
      if (!snapshot.empty) setLiveFoodSpots(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FoodSpot)));
    });
    return () => { unsubDest(); unsubFood(); };
  }, []);

  const categories = [
    { id: "all", label: "Everything", icon: Compass },
    { id: "nature", label: "Nature", icon: Mountain },
    { id: "adventure", label: "Adventure", icon: Navigation },
    { id: "cultural", label: "Culture", icon: Users },
    { id: "viewpoint", label: "Views", icon: Eye },
    { id: "food", label: "Eats", icon: Utensils }
  ];

  type CombinedItem = Destination | (FoodSpot & {
    category: "food"; images: string[]; entranceFee: number; isFood: true; originalFood: FoodSpot;
  });

  const combinedItems = useMemo(() => [
    ...(liveDestinations || []),
    ...(liveFoodSpots || []).map(f => ({
      ...f, category: "food" as const, images: [f.image], entranceFee: 0, isFood: true as const, originalFood: f
    }))
  ] as CombinedItem[], [liveDestinations, liveFoodSpots]);

  const filteredItems = useMemo(() => {
    let filtered = combinedItems.filter(item => {
      const matchesTab = activeTab === "all" || item.category === activeTab;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRating = item.rating >= minRating;
      const matchesEntranceFee = maxEntranceFee === null || ('isFood' in item ? true : item.entranceFee <= maxEntranceFee);
      return matchesTab && matchesSearch && matchesRating && matchesEntranceFee;
    });
    filtered.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "entranceFee") {
        const feeA = 'isFood' in a ? 0 : a.entranceFee;
        const feeB = 'isFood' in b ? 0 : b.entranceFee;
        return feeA - feeB;
      }
      return a.name.localeCompare(b.name);
    });
    return filtered;
  }, [combinedItems, searchQuery, activeTab, minRating, maxEntranceFee, sortBy]);

  const handleBookDest = async () => {
    if (!user) { navigate('/auth'); return; }
    setIsBooking(true);
    try {
      await addDoc(collection(db, "bookings"), {
        userId: user.uid, userName: user.displayName || "User", userEmail: user.email,
        destinationId: selectedDest.id, destinationName: selectedDest.name,
        date: new Date().toISOString(), status: "pending", createdAt: serverTimestamp(), type: "destination"
      });
      setBooked(true);
      setTimeout(() => { setBooked(false); setSelectedDest(null); }, 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "bookings");
    } finally {
      setIsBooking(false);
    }
  };

  const categoryColors: Record<string, string> = {
    nature: "#4ade80", adventure: "#f97316", cultural: "#a78bfa",
    viewpoint: "#38bdf8", food: "#fb923c", all: "#86efac"
  };

  return (
    <div className="min-h-screen" style={{ background: '#f2ede4', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .explore-display { font-family: 'Syne', sans-serif; }
        .ex-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .ex-card:hover { transform: translateY(-6px); box-shadow: 0 24px 48px rgba(0,0,0,0.12); }
        .ex-img-wrap { overflow: hidden; }
        .ex-img { transition: transform 0.7s ease; }
        .ex-card:hover .ex-img { transform: scale(1.08); }
        .tab-btn { transition: all 0.2s; }
        .tab-btn.active { background: #1a1a1a; color: #f2ede4; }
        .modal-scroll::-webkit-scrollbar { width: 4px; }
        .modal-scroll::-webkit-scrollbar-track { background: transparent; }
        .modal-scroll::-webkit-scrollbar-thumb { background: #ddd; border-radius: 999px; }
        input, select { background: #ece8df !important; border: 1.5px solid #d4cfc5 !important; color: #1a1a1a !important; }
        input::placeholder { color: #a09a90 !important; }
        input:focus, select:focus { border-color: #1a1a1a !important; outline: none !important; box-shadow: none !important; }
        select option { background: #f2ede4; }
      `}</style>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: '#1a1a1a', minHeight: '520px' }}>
        {/* Decorative circles */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #4ade80, transparent)' }} />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #f97316, transparent)' }} />

        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-16 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#4ade80', color: '#1a1a1a' }}>
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: '#4ade80' }}>Highland Discovery</span>
              </div>
              <h1 className="explore-display font-extrabold leading-[0.9] mb-6" style={{ fontSize: 'clamp(3.5rem,9vw,8rem)', color: '#f2ede4' }}>
                Explore<br />
                <span style={{ color: '#4ade80' }}>Bukidnon</span>
              </h1>
              <p className="text-lg max-w-xl leading-relaxed font-light" style={{ color: '#888' }}>
                Discover highland paradise — hidden waterfalls, mountain peaks, and soul-warming local flavors.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex gap-6 shrink-0 pb-2">
              {[
                { label: "Destinations", value: liveDestinations.length },
                { label: "Food Spots", value: liveFoodSpots.length },
                { label: "Showing", value: filteredItems.length }
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="explore-display text-4xl font-bold mb-1" style={{ color: i === 2 ? '#4ade80' : '#f2ede4' }}>{s.value}</p>
                  <p className="text-[11px] tracking-widest uppercase font-medium" style={{ color: '#555' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-12 relative max-w-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#666' }} />
            <input
              type="text"
              placeholder="Search destinations, food spots, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl text-sm font-medium"
              style={{ background: '#252525 !important', border: '1.5px solid #333 !important', color: '#f2ede4 !important' }}
            />
          </div>
        </div>
      </div>

      {/* Filter strip */}
      <div className="border-b sticky top-0 z-20 px-6 md:px-12 py-4" style={{ background: '#f2ede4', borderColor: '#d4cfc5' }}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const color = categoryColors[cat.id] || '#888';
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={cn("tab-btn flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border tracking-wide")}
                style={activeTab === cat.id
                  ? { background: '#1a1a1a', color: '#f2ede4', borderColor: '#1a1a1a' }
                  : { background: 'transparent', color: '#666', borderColor: '#d4cfc5' }
                }
              >
                <Icon className="w-3.5 h-3.5" style={activeTab === cat.id ? {} : { color }} />
                {cat.label}
              </button>
            );
          })}

          <div className="ml-auto flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl text-xs font-medium"
            >
              <option value="rating">Top Rated</option>
              <option value="entranceFee">Cheapest First</option>
              <option value="name">A–Z</option>
            </select>
            <select
              value={maxEntranceFee === null ? "any" : maxEntranceFee.toString()}
              onChange={(e) => setMaxEntranceFee(e.target.value === "any" ? null : Number(e.target.value))}
              className="px-3 py-2 rounded-xl text-xs font-medium"
            >
              <option value="any">Any Fee</option>
              <option value="100">≤ ₱100</option>
              <option value="200">≤ ₱200</option>
              <option value="500">≤ ₱500</option>
            </select>
            {(searchQuery || activeTab !== "all" || minRating > 0 || maxEntranceFee !== null) && (
              <button
                onClick={() => { setSearchQuery(""); setActiveTab("all"); setMinRating(0); setMaxEntranceFee(null); setSortBy("rating"); }}
                className="flex items-center gap-1 text-xs font-medium"
                style={{ color: '#f97316' }}
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {loading ? (
          <div className="py-32 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm tracking-widest uppercase" style={{ color: '#aaa' }}>Loading spots...</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredItems.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center">
                <p className="explore-display text-5xl font-bold mb-3" style={{ color: '#d4cfc5' }}>No spots found</p>
                <p className="text-sm" style={{ color: '#aaa' }}>Try adjusting your filters</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item, i) => {
                  const catColor = categoryColors[item.category] || '#888';
                  return (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.03 }}
                      className="ex-card cursor-pointer rounded-3xl overflow-hidden border"
                      style={{ background: '#fff', borderColor: '#e8e3da' }}
                      onClick={() => {
                        if ('isFood' in item && item.isFood) setSelectedFood(item.originalFood);
                        else setSelectedDest(item as Destination);
                      }}
                    >
                      <div className="ex-img-wrap relative" style={{ height: '260px' }}>
                        <img src={item.images[0]} className="ex-img w-full h-full object-cover" alt={item.name} />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
                        <div className="absolute top-4 left-4">
                          <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full"
                            style={{ background: catColor + '22', color: catColor, border: `1px solid ${catColor}44`, backdropFilter: 'blur(8px)' }}>
                            {item.category}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold"
                          style={{ background: 'rgba(255,255,255,0.95)', color: '#1a1a1a' }}>
                          <Star className="w-3.5 h-3.5" style={{ fill: '#f59e0b', color: '#f59e0b' }} /> {item.rating}
                        </div>
                        <div className="absolute bottom-4 right-4 w-10 h-10 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100"
                          style={{ background: catColor, color: '#1a1a1a', transition: 'opacity 0.2s' }}>
                          <ArrowUpRight className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="explore-display text-xl font-bold mb-1 leading-tight" style={{ color: '#1a1a1a' }}>{item.name}</h3>
                        <p className="text-xs mb-3 flex items-center gap-1" style={{ color: '#888' }}>
                          <MapPin className="w-3.5 h-3.5" style={{ color: catColor }} /> {item.location.address}
                        </p>
                        <p className="text-sm leading-relaxed line-clamp-2 mb-5 font-light" style={{ color: '#666' }}>{item.description}</p>
                        <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#f0ebe2' }}>
                          <span className="text-xs font-bold px-3 py-1.5 rounded-full"
                            style={{ background: catColor + '15', color: catColor }}>
                            {'isFood' in item ? (item as any).priceRange : `₱${item.entranceFee}`}
                          </span>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${item.location.lat},${item.location.lng}`}
                            target="_blank" rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-9 h-9 rounded-xl flex items-center justify-center border transition-colors hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a]"
                            style={{ borderColor: '#d4cfc5', color: '#888' }}
                          >
                            <Navigation className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedFood && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: 'rgba(26,26,26,0.7)', backdropFilter: 'blur(12px)' }}
            onClick={() => setSelectedFood(null)}>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              className="modal-scroll w-full max-w-xl rounded-3xl overflow-hidden border relative flex flex-col"
              style={{ background: '#f2ede4', borderColor: '#d4cfc5', maxHeight: '90vh' }}
              onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedFood(null)}
                className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(26,26,26,0.6)', color: '#f2ede4' }}>
                <X className="w-5 h-5" />
              </button>
              <div className="relative h-56 shrink-0">
                <img src={selectedFood.image} className="w-full h-full object-cover" alt={selectedFood.name} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #f2ede4 0%, transparent 60%)' }} />
              </div>
              <div className="px-8 pb-2 -mt-6 relative z-10">
                <h2 className="explore-display text-3xl font-bold mb-1" style={{ color: '#1a1a1a' }}>{selectedFood.name}</h2>
                <p className="text-sm flex items-center gap-1.5" style={{ color: '#888' }}>
                  <MapPin className="w-4 h-4" style={{ color: '#f97316' }} /> {selectedFood.location.address}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto modal-scroll px-8 py-6 space-y-6">
                <div className="flex justify-between items-center py-4 border-y" style={{ borderColor: '#d4cfc5' }}>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest mb-2 font-semibold" style={{ color: '#aaa' }}>Pricing</p>
                    <span className="text-sm font-bold px-4 py-1.5 rounded-full" style={{ background: '#f97316', color: '#fff' }}>{selectedFood.priceRange}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest mb-2 font-semibold" style={{ color: '#aaa' }}>Rating</p>
                    <p className="explore-display text-3xl font-bold" style={{ color: '#1a1a1a' }}>★ {selectedFood.rating}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest mb-3 font-semibold" style={{ color: '#aaa' }}>Menu Highlights</p>
                  <div className="space-y-2">
                    {selectedFood.menu?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-4 rounded-2xl border"
                        style={{ background: '#fff', borderColor: '#e8e3da' }}>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>{item.name}</p>
                          {item.category && <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: '#aaa' }}>{item.category}</p>}
                        </div>
                        <span className="font-bold text-sm" style={{ color: '#f97316' }}>{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pb-4">
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedFood.location.lat},${selectedFood.location.lng}`}
                    target="_blank" rel="noreferrer"
                    className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm transition-opacity hover:opacity-90"
                    style={{ background: '#1a1a1a', color: '#f2ede4' }}>
                    <Navigation className="w-4 h-4" /> Get Directions
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedDest && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: 'rgba(26,26,26,0.7)', backdropFilter: 'blur(12px)' }}
            onClick={() => setSelectedDest(null)}>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              className="modal-scroll w-full max-w-xl rounded-3xl overflow-hidden border relative flex flex-col"
              style={{ background: '#f2ede4', borderColor: '#d4cfc5', maxHeight: '90vh' }}
              onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedDest(null)}
                className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(26,26,26,0.6)', color: '#f2ede4' }}>
                <X className="w-5 h-5" />
              </button>
              <div className="relative h-64 shrink-0">
                <img src={selectedDest.images[0]} className="w-full h-full object-cover" alt={selectedDest.name} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #f2ede4 0%, transparent 55%)' }} />
              </div>
              <div className="px-8 pb-2 -mt-8 relative z-10">
                <h2 className="explore-display text-4xl font-bold mb-1 leading-tight" style={{ color: '#1a1a1a' }}>{selectedDest.name}</h2>
                <p className="text-sm flex items-center gap-1.5" style={{ color: '#888' }}>
                  <MapPin className="w-4 h-4" style={{ color: '#4ade80' }} /> {selectedDest.location.address}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto modal-scroll px-8 py-6 space-y-6">
                {booked ? (
                  <div className="py-16 text-center">
                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: '#4ade80' }} />
                    <h3 className="explore-display text-2xl font-bold mb-2" style={{ color: '#1a1a1a' }}>Request Sent!</h3>
                    <p className="text-sm" style={{ color: '#888' }}>We've received your inquiry for {selectedDest.name}.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center py-4 border-y" style={{ borderColor: '#d4cfc5' }}>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest mb-2 font-semibold" style={{ color: '#aaa' }}>Entrance Fee</p>
                        <span className="text-sm font-bold px-4 py-1.5 rounded-full" style={{ background: '#4ade80', color: '#1a1a1a' }}>₱{selectedDest.entranceFee}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest mb-2 font-semibold" style={{ color: '#aaa' }}>Rating</p>
                        <p className="explore-display text-3xl font-bold" style={{ color: '#1a1a1a' }}>★ {selectedDest.rating}</p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed font-light" style={{ color: '#555' }}>{selectedDest.description}</p>
                    <div className="text-center p-6 rounded-2xl border" style={{ background: '#fff', borderColor: '#e8e3da' }}>
                      <MapPin className="w-8 h-8 mx-auto mb-3" style={{ color: '#d4cfc5' }} />
                      <p className="font-semibold text-sm mb-1" style={{ color: '#1a1a1a' }}>{selectedDest.location.address}</p>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${selectedDest.location.lat},${selectedDest.location.lng}`}
                        target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold mt-3 px-5 py-2 rounded-full"
                        style={{ background: '#1a1a1a', color: '#f2ede4' }}>
                        <Navigation className="w-3.5 h-3.5" /> View on Maps
                      </a>
                    </div>
                    <div className="flex flex-col gap-3 pb-4">
                      <button onClick={handleBookDest} disabled={isBooking}
                        className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                        style={{ background: '#4ade80', color: '#1a1a1a' }}>
                        {isBooking ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          : <><Calendar className="w-4 h-4" /> Schedule a Visit</>}
                      </button>
                      <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedDest.location.lat},${selectedDest.location.lng}`}
                        target="_blank" rel="noreferrer"
                        className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
                        style={{ background: '#1a1a1a', color: '#f2ede4' }}>
                        <Navigation className="w-4 h-4" /> Get Directions
                      </a>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}