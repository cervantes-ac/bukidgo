import { Utensils, Star, MapPin, X, Navigation, Filter, Search, Calendar, CheckCircle2, Coffee, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useMemo } from "react";
import { FoodSpot } from "../types";
import { cn } from "../lib/utils";
import { useFirebase } from "../contexts/FirebaseContext";
import { db, OperationType, handleFirestoreError } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Food() {
  const [selectedFood, setSelectedFood] = useState<FoodSpot | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useFirebase();
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const navigate = useNavigate();

  const [liveFoodSpots, setLiveFoodSpots] = useState<FoodSpot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onSnapshot(collection(db, "foodSpots"), (snapshot) => {
      if (!snapshot.empty) setLiveFoodSpots(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FoodSpot)));
      setLoading(false);
    });
  }, []);

  const [minRating, setMinRating] = useState(0);
  const [cuisineTypes, setCuisineTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"rating" | "price" | "name">("rating");

  const filters = [
    { id: "all", label: "All" },
    { id: "₱", label: "₱ Budget" },
    { id: "₱₱", label: "₱₱ Mid" },
    { id: "₱₱₱", label: "₱₱₱ Premium" }
  ];

  const allCuisineTypes = useMemo(() => {
    const types = new Set<string>();
    liveFoodSpots.forEach(spot => {
      if (spot.cuisineType) {
        if (Array.isArray(spot.cuisineType)) spot.cuisineType.forEach((t: string) => types.add(t));
        else types.add(spot.cuisineType);
      }
    });
    return Array.from(types);
  }, [liveFoodSpots]);

  const filteredSpots = useMemo(() => {
    let filtered = liveFoodSpots.filter(s => {
      const matchesFilter = activeFilter === "all" || s.priceRange === activeFilter || s.priceRange.includes(activeFilter);
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           s.location.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRating = s.rating >= minRating;
      const matchesCuisine = cuisineTypes.length === 0 ||
        (s.cuisineType && (Array.isArray(s.cuisineType)
          ? s.cuisineType.some((t: string) => cuisineTypes.includes(t))
          : cuisineTypes.includes(s.cuisineType)));
      return matchesFilter && matchesSearch && matchesRating && matchesCuisine;
    });
    filtered.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price") {
        const pa = a.priceRange === "₱" ? 1 : a.priceRange === "₱₱" ? 2 : 3;
        const pb = b.priceRange === "₱" ? 1 : b.priceRange === "₱₱" ? 2 : 3;
        return pa - pb;
      }
      return a.name.localeCompare(b.name);
    });
    return filtered;
  }, [liveFoodSpots, searchQuery, activeFilter, minRating, cuisineTypes, sortBy]);

  const handleReserve = async () => {
    if (!user) { navigate('/auth'); return; }
    setIsBooking(true);
    try {
      await addDoc(collection(db, "bookings"), {
        userId: user.uid, userName: user.displayName || "User", userEmail: user.email,
        foodSpotId: selectedFood?.id, foodSpotName: selectedFood?.name,
        date: new Date().toISOString(), status: "pending", createdAt: serverTimestamp(), type: "food"
      });
      setBooked(true);
      setTimeout(() => { setBooked(false); setSelectedFood(null); }, 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "bookings");
    } finally {
      setIsBooking(false);
    }
  };

  const priceColors: Record<string, string> = { "₱": "#22c55e", "₱₱": "#f59e0b", "₱₱₱": "#ef4444" };

  return (
    <div className="min-h-screen" style={{ background: '#faf6f0', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');
        .food-display { font-family: 'Cormorant Garamond', serif; }
        .food-card { transition: all 0.35s ease; }
        .food-card:hover { transform: scale(1.02); box-shadow: 0 20px 50px rgba(180,100,30,0.15); }
        .food-img { transition: transform 0.8s ease; }
        .food-card:hover .food-img { transform: scale(1.1); }
        .food-reveal { transform: translateY(8px); transition: transform 0.3s ease; }
        .food-card:hover .food-reveal { transform: translateY(0); }
        .modal-scroll::-webkit-scrollbar { width: 3px; }
        .modal-scroll::-webkit-scrollbar-thumb { background: #e0d8cc; border-radius: 99px; }
        input, select { background: #f0ead8 !important; border: 1.5px solid #e0d8cc !important; color: #2d1e0e !important; border-radius: 12px !important; }
        input::placeholder { color: #c4b8a0 !important; }
        input:focus, select:focus { border-color: #c47d2e !important; outline: none !important; box-shadow: none !important; }
        select option { background: #faf6f0; }
        .price-badge-₱ { background: #dcfce7; color: #15803d; }
        .price-badge-₱₱ { background: #fef9c3; color: #a16207; }
        .price-badge-₱₱₱ { background: #fee2e2; color: #b91c1c; }
      `}</style>

      {/* Decorative top strip */}
      <div style={{ background: '#2d1e0e', height: '6px', background: 'linear-gradient(90deg, #c47d2e, #e8a84c, #c47d2e)' }} />

      {/* Hero */}
      <div className="px-6 md:px-12 pt-16 pb-14 border-b" style={{ borderColor: '#e0d8cc' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: '#c47d2e', color: '#fff' }}>
                  <Coffee className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold tracking-[0.35em] uppercase" style={{ color: '#c47d2e' }}>
                  Local Flavors · Bukidnon
                </span>
              </div>

              <h1 className="food-display font-bold leading-[0.92] mb-5" style={{ fontSize: 'clamp(3.5rem,8vw,7.5rem)', color: '#2d1e0e' }}>
                Taste<br />
                <em style={{ color: '#c47d2e' }}>Bukidnon</em><br />
                Like a Local
              </h1>

              <p className="text-lg max-w-lg leading-relaxed font-light" style={{ color: '#8a7060' }}>
                Discover authentic highland cuisine — from traditional Binaki to modern farm-to-table experiences.
              </p>
            </div>

            {/* Decorative circle stat */}
            <div className="flex items-center gap-8 lg:pb-2">
              <div className="w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center"
                style={{ borderColor: '#c47d2e', background: '#fff8f0' }}>
                <p className="food-display text-4xl font-bold" style={{ color: '#2d1e0e' }}>{filteredSpots.length}</p>
                <p className="text-[10px] uppercase tracking-widest font-medium mt-1" style={{ color: '#aaa' }}>Spots</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="border-b sticky top-0 z-20 px-6 md:px-12 py-4" style={{ background: '#faf6f0', borderColor: '#e0d8cc' }}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#aaa' }} />
            <input type="text" placeholder="Search food spots..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm font-medium" />
          </div>

          {filters.map((f) => (
            <button key={f.id} onClick={() => setActiveFilter(f.id)}
              className="px-4 py-2 rounded-full text-xs font-semibold border transition-all"
              style={activeFilter === f.id
                ? { background: '#c47d2e', color: '#fff', borderColor: '#c47d2e' }
                : { background: 'transparent', color: '#8a7060', borderColor: '#e0d8cc' }}>
              {f.label}
            </button>
          ))}

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2.5 text-xs font-medium">
            <option value="rating">Top Rated</option>
            <option value="price">Price: Low–High</option>
            <option value="name">A–Z</option>
          </select>

          {(searchQuery || activeFilter !== "all" || minRating > 0 || cuisineTypes.length > 0) && (
            <button onClick={() => { setSearchQuery(""); setActiveFilter("all"); setMinRating(0); setCuisineTypes([]); setSortBy("rating"); }}
              className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#c47d2e' }}>
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>

        {allCuisineTypes.length > 0 && (
          <div className="max-w-7xl mx-auto mt-3 flex flex-wrap gap-2">
            {allCuisineTypes.map(cuisine => (
              <button key={cuisine} onClick={() => setCuisineTypes(prev => prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine])}
                className="px-3 py-1 rounded-full text-xs font-medium border transition-all"
                style={cuisineTypes.includes(cuisine)
                  ? { background: '#2d1e0e', color: '#faf6f0', borderColor: '#2d1e0e' }
                  : { background: 'transparent', color: '#8a7060', borderColor: '#e0d8cc' }}>
                {cuisine}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {loading ? (
          <div className="py-32 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-[#c47d2e] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm tracking-widest uppercase" style={{ color: '#aaa' }}>Loading...</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredSpots.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center">
                <p className="food-display text-5xl font-bold mb-3" style={{ color: '#e0d8cc' }}>Nothing here yet</p>
                <p className="text-sm" style={{ color: '#aaa' }}>Try different filters</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSpots.map((food, i) => {
                  const pColor = priceColors[food.priceRange] || '#888';
                  return (
                    <motion.div
                      key={food.id} layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.03 }}
                      className="food-card cursor-pointer rounded-3xl overflow-hidden border"
                      style={{ background: '#fff', borderColor: '#ede8df' }}
                      onClick={() => setSelectedFood(food as FoodSpot)}
                    >
                      <div className="relative overflow-hidden" style={{ height: '280px' }}>
                        <img src={food.image} className="food-img w-full h-full object-cover" alt={food.name} />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(45,30,14,0.85) 0%, rgba(45,30,14,0.2) 50%, transparent 100%)' }} />

                        <div className="absolute top-5 left-5">
                          <span className={`price-badge-${food.priceRange} text-[11px] font-bold tracking-widest px-3 py-1.5 rounded-full`}>
                            {food.priceRange}
                          </span>
                        </div>
                        <div className="absolute top-5 right-5 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold"
                          style={{ background: 'rgba(255,255,255,0.95)', color: '#2d1e0e' }}>
                          <Star className="w-3.5 h-3.5" style={{ fill: '#f59e0b', color: '#f59e0b' }} /> {food.rating}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <div className="food-reveal">
                            <h3 className="food-display text-2xl font-bold text-white leading-tight mb-1">{food.name}</h3>
                            <p className="text-xs text-white/70 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" /> {food.location.address}
                            </p>
                          </div>
                          <div className="mt-4 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
                            style={{ background: '#c47d2e', color: '#fff', opacity: 0, transition: 'opacity 0.3s' }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}>
                            <Utensils className="w-4 h-4" /> View Menu
                          </div>
                        </div>
                      </div>

                      {/* Always-visible bottom band */}
                      <div className="px-6 py-4 flex items-center justify-between border-t" style={{ borderColor: '#f0ead8' }}>
                        <div>
                          <p className="food-display text-lg font-semibold" style={{ color: '#2d1e0e' }}>{food.name}</p>
                          <p className="text-xs" style={{ color: '#b4a090' }}>{food.location.address}</p>
                        </div>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{ background: '#c47d2e', color: '#fff' }}>
                          <Utensils className="w-4 h-4" />
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

      {/* Modal */}
      <AnimatePresence>
        {selectedFood && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: 'rgba(45,30,14,0.7)', backdropFilter: 'blur(16px)' }}
            onClick={() => setSelectedFood(null)}>
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              className="modal-scroll w-full max-w-lg rounded-3xl overflow-hidden border relative flex flex-col"
              style={{ background: '#faf6f0', borderColor: '#e0d8cc', maxHeight: '92vh' }}
              onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedFood(null)}
                className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: '#2d1e0e', color: '#faf6f0' }}>
                <X className="w-5 h-5" />
              </button>

              <div className="relative shrink-0" style={{ height: '220px' }}>
                <img src={selectedFood.image} className="w-full h-full object-cover" alt={selectedFood.name} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #faf6f0, transparent 60%)' }} />
              </div>

              <div className="px-8 -mt-6 relative z-10">
                <h2 className="food-display text-4xl font-bold leading-tight mb-1" style={{ color: '#2d1e0e' }}>{selectedFood.name}</h2>
                <p className="text-sm flex items-center gap-1.5" style={{ color: '#8a7060' }}>
                  <MapPin className="w-4 h-4" style={{ color: '#c47d2e' }} /> {selectedFood.location.address}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto modal-scroll px-8 py-6 space-y-6">
                {booked ? (
                  <div className="py-12 text-center">
                    <CheckCircle2 className="w-14 h-14 mx-auto mb-4" style={{ color: '#22c55e' }} />
                    <h3 className="food-display text-2xl font-bold mb-2" style={{ color: '#2d1e0e' }}>Reservation Sent!</h3>
                    <p className="text-sm" style={{ color: '#8a7060' }}>We've received your request for {selectedFood.name}.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center py-4 border-y" style={{ borderColor: '#e0d8cc' }}>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: '#aaa' }}>Price Range</p>
                        <span className={`price-badge-${selectedFood.priceRange} text-xs font-bold px-4 py-1.5 rounded-full`}>
                          {selectedFood.priceRange}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: '#aaa' }}>Rating</p>
                        <p className="food-display text-3xl font-bold" style={{ color: '#2d1e0e' }}>★ {selectedFood.rating}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: '#aaa' }}>Menu Highlights</p>
                      <div className="space-y-2">
                        {selectedFood.menu?.map((item: any, idx: number) => (
                          <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.06 }}
                            className="flex justify-between items-center p-4 rounded-2xl border"
                            style={{ background: '#fff', borderColor: '#ede8df' }}>
                            <div>
                              <p className="font-semibold text-sm" style={{ color: '#2d1e0e' }}>{item.name}</p>
                              {item.category && <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: '#bbb' }}>{item.category}</p>}
                            </div>
                            <span className="font-bold text-base" style={{ color: '#c47d2e' }}>{item.price}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 pb-4">
                      <button onClick={handleReserve} disabled={isBooking}
                        className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
                        style={{ background: '#c47d2e', color: '#fff' }}>
                        {isBooking ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          : <><Calendar className="w-4 h-4" /> Reserve a Table</>}
                      </button>
                      <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedFood.location.lat},${selectedFood.location.lng}`}
                        target="_blank" rel="noreferrer"
                        className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
                        style={{ background: '#2d1e0e', color: '#faf6f0' }}>
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