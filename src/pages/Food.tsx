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
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    return onSnapshot(collection(db, "foodSpots"), (snapshot) => {
      if (!snapshot.empty) {
        setLiveFoodSpots(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FoodSpot)));
      }
      setLoading(false);
    });
  }, []);

  const [minRating, setMinRating] = useState(0);
  const [cuisineTypes, setCuisineTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"rating" | "price" | "name">("rating");

  const filters = [
    { id: "all", label: "All Spots", icon: "🍽️" },
    { id: "₱", label: "Budget", icon: "💰" },
    { id: "₱₱", label: "Mid Range", icon: "⭐" },
    { id: "₱₱₱", label: "Premium", icon: "👑" }
  ];

  const cuisineOptions = [
    "Local Delicacies", "Filipino", "International", "Vegetarian", 
    "Seafood", "Meat", "Coffee & Desserts", "Street Food"
  ];

  const allCuisineTypes = useMemo(() => {
    const types = new Set<string>();
    liveFoodSpots.forEach(spot => {
      if (spot.cuisineType) {
        if (Array.isArray(spot.cuisineType)) {
          spot.cuisineType.forEach((type: string) => types.add(type));
        } else {
          types.add(spot.cuisineType);
        }
      }
    });
    return Array.from(types);
  }, [liveFoodSpots]);

  const filteredSpots = useMemo(() => {
    let filtered = liveFoodSpots.filter(s => {
      const matchesFilter = activeFilter === "all" || s.priceRange === activeFilter || s.priceRange.includes(activeFilter);
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           s.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (s.cuisineType && (Array.isArray(s.cuisineType) 
                             ? s.cuisineType.some((type: string) => type.toLowerCase().includes(searchQuery.toLowerCase()))
                             : s.cuisineType.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesRating = s.rating >= minRating;
      const matchesCuisine = cuisineTypes.length === 0 || 
        (s.cuisineType && (Array.isArray(s.cuisineType)
          ? s.cuisineType.some((type: string) => cuisineTypes.includes(type))
          : cuisineTypes.includes(s.cuisineType)));
      
      return matchesFilter && matchesSearch && matchesRating && matchesCuisine;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price") {
        const priceA = a.priceRange === "₱" ? 1 : a.priceRange === "₱₱" ? 2 : 3;
        const priceB = b.priceRange === "₱" ? 1 : b.priceRange === "₱₱" ? 2 : 3;
        return priceA - priceB;
      }
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [liveFoodSpots, searchQuery, activeFilter, minRating, cuisineTypes, sortBy]);

  const handleReserve = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setIsBooking(true);
    try {
      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        userName: user.displayName || "User",
        userEmail: user.email,
        foodSpotId: selectedFood?.id,
        foodSpotName: selectedFood?.name,
        date: new Date().toISOString(),
        status: "pending",
        createdAt: serverTimestamp(),
        type: "food"
      });
      setBooked(true);
      setTimeout(() => {
        setBooked(false);
        setSelectedFood(null);
      }, 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "bookings");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="relative rounded-[4rem] overflow-hidden mb-16 bg-gradient-to-br from-amber-900/90 to-orange-800/90 p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Coffee className="w-8 h-8 text-white" />
            </div>
            <span className="text-white/80 font-black uppercase tracking-[0.3em] text-sm">Local Flavors</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
            Taste Bukidnon <br />
            <span className="text-linen underline decoration-white/30">Like a Local</span>
          </h1>
          <p className="text-white/60 text-xl max-w-2xl leading-relaxed">
            Discover authentic highland cuisine, from traditional Binaki to modern farm-to-table experiences.
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
                placeholder="Search by name, cuisine, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-linen border border-clay rounded-[2rem] focus:ring-2 focus:ring-earth outline-none transition-all font-medium text-stone placeholder:text-stone/30"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4">
            {/* Price Filter */}
            <div className="space-y-2 min-w-[180px]">
              <label className="text-xs font-black uppercase tracking-widest text-stone/30 flex items-center gap-2">
                <DollarSign className="w-3 h-3" /> Price Range
              </label>
              <div className="flex flex-wrap gap-2">
                {filters.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id)}
                    className={cn(
                      "px-4 py-2.5 rounded-full text-sm font-bold transition-all border flex items-center gap-2",
                      activeFilter === f.id 
                        ? "bg-earth text-white border-earth shadow-lg shadow-earth/20" 
                        : "bg-white text-stone/60 border-clay hover:border-earth/30"
                    )}
                  >
                    <span>{f.icon}</span>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            
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

            {/* Sort Filter */}
            <div className="space-y-2 min-w-[180px]">
              <label className="text-xs font-black uppercase tracking-widest text-stone/30 flex items-center gap-2">
                <Filter className="w-3 h-3" /> Sort By
              </label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "rating" | "price" | "name")}
                className="w-full bg-white border border-clay rounded-2xl px-4 py-3 text-sm font-bold text-stone focus:ring-2 focus:ring-earth outline-none"
              >
                <option value="rating">Highest Rated</option>
                <option value="price">Price (Low to High)</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cuisine Filter */}
        {allCuisineTypes.length > 0 && (
          <div className="mt-6 pt-6 border-t border-clay/30">
            <div className="flex items-center gap-3 mb-4">
              <Utensils className="w-5 h-5 text-earth" />
              <label className="text-xs font-black uppercase tracking-widest text-stone/30">Cuisine Types</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {allCuisineTypes.map(cuisine => (
                <button
                  key={cuisine}
                  onClick={() => setCuisineTypes(prev => 
                    prev.includes(cuisine) 
                      ? prev.filter(c => c !== cuisine)
                      : [...prev, cuisine]
                  )}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-bold transition-all border",
                    cuisineTypes.includes(cuisine)
                      ? "bg-earth text-white border-earth shadow-lg shadow-earth/20"
                      : "bg-white text-stone/60 border-clay hover:border-earth/30"
                  )}
                >
                  {cuisine}
                </button>
              ))}
              {cuisineTypes.length > 0 && (
                <button
                  onClick={() => setCuisineTypes([])}
                  className="px-4 py-2 rounded-full text-sm font-bold text-stone/40 hover:text-stone transition-all"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results Counter */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-earth/10 rounded-2xl flex items-center justify-center">
              <Coffee className="w-5 h-5 text-earth" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-stone/30">Available Spots</p>
              <p className="text-2xl font-serif font-bold text-forest">
                {filteredSpots.length} <span className="text-stone/40 text-lg">/ {liveFoodSpots.length}</span>
              </p>
            </div>
          </div>
          {(searchQuery || activeFilter !== "all" || minRating > 0 || cuisineTypes.length > 0) && (
            <button 
              onClick={() => { 
                setSearchQuery(""); 
                setActiveFilter("all"); 
                setMinRating(0);
                setCuisineTypes([]);
                setSortBy("rating");
              }}
              className="text-earth font-black uppercase tracking-widest text-xs hover:underline flex items-center gap-2"
            >
              <X className="w-3 h-3" />
              Reset All Filters
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-3 text-center py-20">
            <div className="w-10 h-10 border-3 border-earth border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-stone/40">Loading food spots...</p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {filteredSpots.map((food, i) => (
                <motion.div 
                  key={food.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.02 }}
                  className="group relative h-[450px] rounded-[3.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all cursor-pointer border border-clay"
                  onClick={() => setSelectedFood(food as FoodSpot)}
                >
                  <img src={food.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={food.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-10 flex flex-col justify-end">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-yellow-400 font-bold bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-sm">
                          <Star className="w-4 h-4 fill-yellow-400" /> {food.rating}
                        </div>
                        <span className="text-white/80 font-bold text-sm tracking-widest">{food.priceRange}</span>
                      </div>
                      <h3 className="text-4xl font-serif font-bold text-white tracking-tight mb-2">{food.name}</h3>
                      <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
                        <MapPin className="w-4 h-4" /> {food.location.address}
                      </div>
                      <div className="bg-white text-stone py-4 rounded-2xl font-bold flex items-center justify-center gap-2 group-hover:bg-earth group-hover:text-white transition-all shadow-xl">
                        <Utensils className="w-4 h-4" />
                        View Menu
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredSpots.length === 0 && (
              <div className="col-span-3 text-center py-20">
                <p className="text-stone/40">No food spots found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedFood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/40 backdrop-blur-md"
            onClick={() => setSelectedFood(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-linen w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl border border-clay relative max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedFood(null)}
                className="absolute top-8 right-8 p-3 bg-white/50 backdrop-blur-md rounded-full text-stone hover:bg-white transition-all z-20 shadow-lg"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="h-64 shrink-0 relative">
                <img src={selectedFood.image} className="w-full h-full object-cover" alt={selectedFood.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-linen via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-10 pb-4">
                  <h2 className="text-4xl font-serif font-bold text-stone mb-2">{selectedFood.name}</h2>
                  <p className="text-stone/60 text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-earth" /> {selectedFood.location.address}
                  </p>
                </div>
              </div>

              <div className="p-10 pt-4 flex-1 overflow-y-auto space-y-8 no-scrollbar">
                {booked ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-20 text-center"
                  >
                    <CheckCircle2 className="w-20 h-20 mx-auto text-forest mb-6" />
                    <h3 className="text-3xl font-serif font-bold text-stone mb-2">Reservation Sent!</h3>
                    <p className="text-stone/40">We've received your request for {selectedFood.name}.</p>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex justify-between items-center pb-6 border-b border-clay/30">
                      <div>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-stone/30 block mb-2">Pricing Guide</span>
                        <span className="bg-earth/10 text-earth px-4 py-2 rounded-full text-xs font-black">{selectedFood.priceRange}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-stone/30 block mb-2">Average Rating</span>
                        <span className="text-forest font-serif font-bold text-2xl">★ {selectedFood.rating}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-stone/30">Popular Selections</h4>
                      {selectedFood.menu?.map((item, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex justify-between items-center p-6 bg-white/40 rounded-[2rem] border border-clay/50 hover:border-earth/30 transition-all shadow-sm group/item"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-earth/30 group-hover/item:scale-150 group-hover/item:bg-earth transition-all" />
                            <div>
                              <p className="font-bold text-stone group-hover/item:text-forest transition-colors">{item.name}</p>
                              {item.category && <p className="text-[10px] uppercase font-black text-stone/30 tracking-widest mt-1">{item.category}</p>}
                            </div>
                          </div>
                          <span className="text-earth font-serif font-bold text-lg">{item.price}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] uppercase font-black tracking-widest text-stone/30">Location</h4>
                      <div className="w-full h-48 rounded-[2rem] overflow-hidden border border-clay shadow-sm bg-linen flex flex-col items-center justify-center p-6">
                        <div className="text-center">
                          <MapPin className="w-12 h-12 text-earth/30 mx-auto mb-4" />
                          <p className="font-bold text-stone mb-2">{selectedFood.location.address}</p>
                          <p className="text-stone/40 text-sm mb-4">Coordinates: {selectedFood.location.lat.toFixed(4)}, {selectedFood.location.lng.toFixed(4)}</p>
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${selectedFood.location.lat},${selectedFood.location.lng}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-earth text-white px-6 py-3 rounded-full font-bold hover:bg-earth/90 transition-all"
                          >
                            <Navigation className="w-4 h-4" />
                            Open in Google Maps
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 pt-6 pb-6">
                      <button 
                        onClick={handleReserve}
                        disabled={isBooking}
                        className="w-full bg-earth text-white py-5 rounded-[2rem] font-bold text-lg hover:bg-earth/90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-earth/20"
                      >
                        {isBooking ? (
                          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Calendar className="w-5 h-5" /> Reserve a Table
                          </>
                        )}
                      </button>
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedFood.location.lat},${selectedFood.location.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-stone text-white py-5 rounded-[2rem] font-bold hover:bg-forest transition-all flex items-center justify-center gap-3 shadow-xl"
                      >
                        <Navigation className="w-5 h-5" />
                        Open Directions in Maps
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