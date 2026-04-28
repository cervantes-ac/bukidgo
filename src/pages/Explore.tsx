import { Search, MapPin, Star, Navigation, Utensils, X, Compass, Filter, ArrowUpRight, Calendar, CheckCircle2 } from "lucide-react";
import { DESTINATIONS, FOOD_SPOTS } from "../constants";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { FoodSpot } from "../types";
import { useFirebase } from "../contexts/FirebaseContext";
import { db, OperationType, handleFirestoreError } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Explore() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedFood, setSelectedFood] = useState<FoodSpot | null>(null);
  const [selectedDest, setSelectedDest] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useFirebase();
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const navigate = useNavigate();

  const [liveDestinations, setLiveDestinations] = useState<any[]>(DESTINATIONS || []);
  const [liveFoodSpots, setLiveFoodSpots] = useState<any[]>(FOOD_SPOTS || []);
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const unsubDest = onSnapshot(collection(db, "destinations"), (snapshot) => {
      if (!snapshot.empty) {
        setLiveDestinations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    });
    const unsubFood = onSnapshot(collection(db, "foodSpots"), (snapshot) => {
      if (!snapshot.empty) {
        setLiveFoodSpots(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    });
    return () => { unsubDest(); unsubFood(); };
  }, []);

  const categories = [
    { id: "all", label: "Everything", icon: Compass },
    { id: "nature", label: "Nature", icon: Compass },
    { id: "adventure", label: "Adventure", icon: Compass },
    { id: "cultural", label: "Culture", icon: Compass },
    { id: "viewpoint", label: "Viewpoints", icon: Compass },
    { id: "food", label: "Local Eats", icon: Utensils }
  ];

  const combinedItems = [
    ...(liveDestinations || []),
    ...(liveFoodSpots || []).map(f => ({
      ...f,
      category: "food" as const,
      images: [f.image],
      entranceFee: 0,
      isFood: true,
      originalFood: f
    }))
  ];

  const filteredItems = combinedItems.filter(item => {
    const matchesTab = activeTab === "all" || item.category === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleBookDest = async () => {
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
        destinationId: selectedDest.id,
        destinationName: selectedDest.name,
        date: new Date().toISOString(),
        status: "pending",
        createdAt: serverTimestamp(),
        type: "destination"
      });
      setBooked(true);
      setTimeout(() => {
        setBooked(false);
        setSelectedDest(null);
      }, 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "bookings");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col space-y-12 mb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="max-w-2xl">
            <h1 className="text-6xl font-serif font-bold text-forest mb-6 leading-tight">Explore <br />Bukidnon</h1>
            <p className="text-stone/60 text-xl leading-relaxed">Discover the highland paradise, from hidden waterfalls and mountain peaks to the soul-warming flavors of the local soul.</p>
          </div>
          
          <div className="w-full md:w-96 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone/40 group-focus-within:text-earth transition-colors" />
            <input 
              type="text"
              placeholder="Where to go?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-clay rounded-[2rem] py-5 pl-14 pr-6 focus:ring-2 focus:ring-earth transition-all shadow-sm text-stone placeholder:text-stone/30 font-medium"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar border-b border-clay/30">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={cn(
                  "flex items-center gap-2.5 px-8 py-4 rounded-full text-sm font-bold transition-all whitespace-nowrap border",
                  activeTab === cat.id 
                    ? "bg-earth text-white border-earth shadow-xl shadow-earth/20 scale-105" 
                    : "bg-white text-stone/60 border-clay hover:border-earth/30"
                )}
              >
                <Icon className={cn("w-4 h-4", activeTab === cat.id ? "text-white" : "text-earth/50")} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.02 }}
              key={item.id}
              className="group bg-white rounded-[4rem] overflow-hidden border border-clay hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all cursor-pointer flex flex-col h-full"
              onClick={() => {
                const anyItem = item as any;
                if (anyItem.isFood) {
                  setSelectedFood(anyItem.originalFood as FoodSpot);
                } else {
                  setSelectedDest(item);
                }
              }}
            >
              <div className="relative h-80 overflow-hidden m-4 rounded-[3rem]">
                <img 
                  src={item.images[0]} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  alt={item.name}
                />
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black flex items-center gap-1.5 shadow-xl text-forest border border-clay">
                  <Star className="w-4 h-4 text-earth fill-earth" /> {item.rating}
                </div>
                <div className="absolute top-6 left-6">
                  <span className="bg-forest/80 backdrop-blur-md text-linen text-[10px] uppercase font-black tracking-[0.2em] px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    {item.category}
                  </span>
                </div>
              </div>
              
              <div className="p-10 pt-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-3xl font-serif font-bold text-forest group-hover:text-earth transition-colors leading-tight">{item.name}</h3>
                  <div className="bg-linen p-3 rounded-2xl group-hover:bg-earth group-hover:text-white transition-all">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-stone/50 text-sm mb-6">
                  <MapPin className="w-4 h-4 text-earth" />
                  {item.location.address}
                </div>
                <p className="text-stone/60 leading-relaxed mb-8 line-clamp-3 text-lg">
                  {item.description}
                </p>
                <div className="mt-auto pt-8 border-t border-clay/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {(item as any).isFood ? (
                      <span className="bg-earth/10 text-earth px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest leading-none">
                        {(item as any).priceRange}
                      </span>
                    ) : (
                      <span className="bg-forest/10 text-forest px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest leading-none">
                        ₱{item.entranceFee}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${item.location.lat},${item.location.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white border border-clay text-stone p-4 rounded-2xl hover:bg-forest hover:text-white transition-all shadow-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Navigation className="w-5 h-5" />
                    </a>
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
              className="bg-linen w-full max-w-2xl rounded-[4rem] overflow-hidden shadow-2xl border border-clay relative max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedFood(null)}
                className="absolute top-10 right-10 p-3 bg-white/50 backdrop-blur-md rounded-full text-stone hover:bg-white transition-all z-20 shadow-lg"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="h-64 shrink-0 relative m-6 rounded-[3rem] overflow-hidden">
                <img src={selectedFood.image} className="w-full h-full object-cover" alt={selectedFood.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-10">
                  <h2 className="text-4xl font-serif font-bold text-white mb-2">{selectedFood.name}</h2>
                  <p className="text-white/80 text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {selectedFood.location.address}
                  </p>
                </div>
              </div>

              <div className="p-10 pt-0 flex-1 overflow-y-auto space-y-8 no-scrollbar">
                <div className="flex justify-between items-center pb-6 border-b border-clay/30">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-stone/30 block mb-2">Pricing</span>
                    <span className="bg-earth text-white px-4 py-2 rounded-full text-xs font-black">{selectedFood.priceRange}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-black tracking-widest text-stone/30 block mb-2">Rating</span>
                    <span className="text-forest font-serif font-bold text-3xl">★ {selectedFood.rating}</span>
                  </div>
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

                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase font-black tracking-widest text-stone/30">Popular from the Menu</h4>
                  {selectedFood.menu?.map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex justify-between items-center p-6 bg-white/40 rounded-[2.5rem] border border-clay/50 hover:border-earth/30 transition-all shadow-sm"
                    >
                      <div>
                        <p className="font-bold text-stone text-lg">{item.name}</p>
                        {item.category && <p className="text-[10px] uppercase font-black text-stone/30 tracking-[0.2em] mt-1">{item.category}</p>}
                      </div>
                      <span className="text-earth font-serif font-bold text-xl">{item.price}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-6 pb-6">
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedFood.location.lat},${selectedFood.location.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-stone text-white py-6 rounded-[2.5rem] font-bold hover:bg-forest transition-all flex items-center justify-center gap-3 shadow-2xl"
                  >
                    <Navigation className="w-5 h-5" />
                    Open Route in Maps
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedDest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/40 backdrop-blur-md"
            onClick={() => setSelectedDest(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-linen w-full max-w-2xl rounded-[4rem] overflow-hidden shadow-2xl border border-clay relative max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedDest(null)}
                className="absolute top-10 right-10 p-3 bg-white/50 backdrop-blur-md rounded-full text-stone hover:bg-white transition-all z-20 shadow-lg"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="h-72 shrink-0 relative m-6 rounded-[3rem] overflow-hidden">
                <img src={selectedDest.images[0]} className="w-full h-full object-cover" alt={selectedDest.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-10">
                  <h2 className="text-5xl font-serif font-bold text-white mb-2 leading-tight">{selectedDest.name}</h2>
                  <p className="text-white/80 text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-earth" /> {selectedDest.location.address}
                  </p>
                </div>
              </div>

              <div className="p-10 pt-0 flex-1 overflow-y-auto space-y-10 no-scrollbar">
                {booked ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-20 text-center"
                  >
                    <CheckCircle2 className="w-20 h-20 mx-auto text-forest mb-6" />
                    <h3 className="text-3xl font-serif font-bold text-stone mb-2">Request Sent!</h3>
                    <p className="text-stone/40">We've received your inquiry for {selectedDest.name}.</p>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex justify-between items-center pb-8 border-b border-clay/30">
                      <div>
                        <span className="text-[10px] uppercase font-black tracking-widest text-stone/30 block mb-2">Entrance Fee</span>
                        <span className="bg-forest text-white px-5 py-2.5 rounded-full text-xs font-black">₱{selectedDest.entranceFee}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-black tracking-widest text-stone/30 block mb-2">Visitor Rating</span>
                        <span className="text-forest font-serif font-bold text-4xl">★ {selectedDest.rating}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] uppercase font-black tracking-[0.2em] text-stone/30">About this spot</h4>
                      <p className="text-stone/60 text-xl leading-relaxed">{selectedDest.description}</p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] uppercase font-black tracking-[0.2em] text-stone/30">Location Map</h4>
                      <div className="w-full h-48 rounded-[2rem] overflow-hidden border border-clay shadow-sm">
                        {GOOGLE_MAPS_API_KEY ? (
                          <img 
                            src={`https://maps.googleapis.com/maps/api/staticmap?center=${selectedDest.location.lat},${selectedDest.location.lng}&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C${selectedDest.location.lat},${selectedDest.location.lng}&key=${GOOGLE_MAPS_API_KEY}`}
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
                        onClick={handleBookDest}
                        disabled={isBooking}
                        className="w-full bg-earth text-white py-6 rounded-[2.5rem] font-bold text-xl hover:bg-earth/90 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-earth/20"
                      >
                        {isBooking ? (
                          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Calendar className="w-6 h-6" /> Schedule a Visit
                          </>
                        )}
                      </button>
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedDest.location.lat},${selectedDest.location.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-stone text-white py-6 rounded-[2.5rem] font-bold hover:bg-forest transition-all flex items-center justify-center gap-3 shadow-2xl"
                      >
                        <Navigation className="w-5 h-5" />
                        Get Directions
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
