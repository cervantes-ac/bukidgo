import { Utensils, Star, MapPin, X, Navigation, Filter, Search, Calendar, CheckCircle2 } from "lucide-react";
import { FOOD_SPOTS } from "../constants";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
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

  const [liveFoodSpots, setLiveFoodSpots] = useState<FoodSpot[]>(FOOD_SPOTS as FoodSpot[]);
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    return onSnapshot(collection(db, "foodSpots"), (snapshot) => {
      if (!snapshot.empty) {
        setLiveFoodSpots(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FoodSpot)));
      }
    });
  }, []);

  const filters = [
    { id: "all", label: "All Spots" },
    { id: "₱", label: "Budget Friendly" },
    { id: "₱₱", label: "Mid Range" },
    { id: "₱₱₱", label: "Premium" }
  ];

  const filteredSpots = liveFoodSpots.filter(s => {
    const matchesFilter = activeFilter === "all" || s.priceRange === activeFilter || s.priceRange.includes(activeFilter);
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-xl">
          <h1 className="text-5xl font-serif font-bold text-forest mb-4">Eat Local</h1>
          <p className="text-stone/60 text-lg">Savor the authentic, soul-warming flavors of Bukidnon.</p>
        </div>
        
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone/40 group-focus-within:text-earth transition-colors" />
            <input 
              type="text"
              placeholder="Search food spots..."
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                      <h4 className="text-[10px] uppercase font-black tracking-widest text-stone/30">Location Map</h4>
                      <div className="w-full h-48 rounded-[2rem] overflow-hidden border border-clay shadow-sm">
                        {GOOGLE_MAPS_API_KEY ? (
                          <img 
                            src={`https://maps.googleapis.com/maps/api/staticmap?center=${selectedFood.location.lat},${selectedFood.location.lng}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${selectedFood.location.lat},${selectedFood.location.lng}&key=${GOOGLE_MAPS_API_KEY}`}
                            className="w-full h-full object-cover"
                            alt="Location Map"
                          />
                        ) : (
                          <div className="w-full h-full bg-linen flex items-center justify-center text-stone/30 text-xs font-bold">
                            Map preview unavailable
                          </div>
                        )}
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
