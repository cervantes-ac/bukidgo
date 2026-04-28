import { Search, MapPin, Sparkles, TrendingUp, ShieldCheck, Users, Navigation, X, Star, ArrowUpRight, Utensils, Calendar, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { DESTINATIONS, LOCAL_BUDDIES, FOOD_SPOTS } from "../constants";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { FoodSpot } from "../types";
import { useFirebase } from "../contexts/FirebaseContext";
import { db, OperationType, handleFirestoreError } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Home() {
  const [selectedFood, setSelectedFood] = useState<FoodSpot | null>(null);
  const { user } = useFirebase();
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const navigate = useNavigate();

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
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover brightness-50"
            alt="Bukidnon Landscape"
          />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold text-white tracking-tight"
          >
            Plan less, experience more in{" "}
            <span className="text-earth underline decoration-clay/30">Bukidnon.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-linen/90 font-medium"
          >
            Discover hidden gems, savor local flavors, and explore with a trusted local friend.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-2xl mx-auto"
          >
            <div className="flex-1 flex items-center gap-3 px-4 py-3">
              <Search className="text-stone/40 w-5 h-5" />
              <input 
                placeholder="Where to go? (Dahilayan, Monastery...)" 
                className="w-full bg-transparent border-none focus:ring-0 text-stone placeholder:text-stone/40 font-medium"
                onKeyDown={(e) => e.key === 'Enter' && navigate('/explore')}
              />
            </div>
            <Link 
              to="/explore"
              className="bg-earth text-white px-8 py-4 rounded-xl font-bold hover:bg-earth/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-earth/20"
            >
              Start Planning
              <TrendingUp className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-serif font-bold text-forest mb-2">Featured Spots</h2>
            <p className="text-stone/60 text-lg">Handpicked breathtaking destinations just for you.</p>
          </div>
          <Link to="/explore" className="text-earth font-bold hover:underline flex items-center gap-2 text-lg">
            View All <TrendingUp className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {(DESTINATIONS || []).slice(0, 3).map((spot, idx) => (
            <motion.div
              key={spot.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer flex flex-col h-full"
              onClick={() => navigate('/explore')}
            >
              <div className="relative h-[450px] rounded-[3.5rem] overflow-hidden mb-6 shadow-2xl border border-clay">
                <img 
                  src={spot.images[0]} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  alt={spot.name}
                />
                <div className="absolute top-8 right-8 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black flex items-center gap-1.5 shadow-xl text-earth">
                  <Star className="w-4 h-4 fill-earth" /> {spot.rating}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-10 flex flex-col justify-end">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <span className="bg-earth/80 backdrop-blur-md text-white text-[10px] uppercase font-black tracking-[0.2em] px-4 py-2 rounded-full mb-4 inline-block">
                      {spot.category}
                    </span>
                    <h3 className="text-4xl font-serif font-bold text-white mb-2 leading-tight">{spot.name}</h3>
                    <div className="flex items-center gap-2 text-white/70 text-sm mb-6">
                      <MapPin className="w-4 h-4" /> {spot.location.address}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Events Section Teaser */}
      <section className="bg-forest py-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-earth/10 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-clay/10 rounded-full blur-[120px] -ml-48 -mb-48" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 text-center md:text-left gap-8">
            <div>
              <h2 className="text-5xl font-serif font-bold text-white mb-4 leading-tight">Authentic <br />Experience</h2>
              <p className="text-linen/60 text-xl max-w-xl">Immerse yourself in the living culture of Bukidnon through our vibrant festivals and community gatherings.</p>
            </div>
            <Link 
              to="/events"
              className="bg-earth text-white px-10 py-5 rounded-[2rem] font-bold hover:bg-earth/90 transition-all flex items-center gap-3 shadow-2xl shadow-black/20"
            >
              Explore Events <TrendingUp className="w-5 h-5" />
            </Link>
          </div>

          <div className="flex gap-8 overflow-x-auto pb-12 no-scrollbar snap-x snap-mandatory">
            {[
              { id: '1', name: 'Kaamulan Festival', date: 'March', image: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&q=80&w=1000' },
              { id: '2', name: 'Valencia Charter', date: 'January', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1000' },
              { id: '3', name: 'Malaybalay Day', date: 'June', image: 'https://images.unsplash.com/photo-1467307983825-619715426c70?auto=format&fit=crop&q=80&w=1000' }
            ].map((ev, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                onClick={() => navigate('/events')}
                className="shrink-0 w-[350px] md:w-[450px] h-[550px] relative rounded-[4rem] overflow-hidden group snap-center shadow-2xl cursor-pointer"
              >
                <img src={ev.image} className="absolute inset-0 w-full h-full object-cover brightness-75 group-hover:scale-110 transition-transform duration-[1.5s]" alt={ev.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-12">
                  <span className="text-earth font-black text-xs uppercase tracking-[0.3em] mb-4">{ev.date} Event</span>
                  <h3 className="text-4xl font-serif font-bold text-white mb-8">{ev.name}</h3>
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 group-hover:bg-earth group-hover:border-earth transition-all">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Eats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-serif font-bold text-forest mb-2">Eat Local</h2>
            <p className="text-stone/60 text-lg">Taste the soul of the highland fields.</p>
          </div>
          <Link to="/food" className="text-earth font-bold hover:underline flex items-center gap-2 text-lg">
            View All <TrendingUp className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {(FOOD_SPOTS || []).slice(0, 3).map((food, idx) => (
            <motion.div
              key={food.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white border border-clay rounded-[4rem] overflow-hidden group hover:shadow-2xl transition-all"
            >
              <div className="relative h-72 m-4 rounded-[3rem] overflow-hidden">
                <img 
                  src={food.image} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  alt={food.name}
                />
                <div className="absolute top-6 left-6 bg-forest/80 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black text-white border border-white/20 flex items-center gap-1.5 uppercase tracking-widest">
                  <Utensils className="w-3 h-3" /> {food.priceRange}
                </div>
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black text-earth border border-clay shadow-lg">
                  ★ {food.rating}
                </div>
              </div>
              <div className="p-10 pt-4">
                <h3 className="text-3xl font-serif font-bold text-forest mb-2">{food.name}</h3>
                <p className="text-stone/50 text-sm font-medium flex items-center gap-1.5 mb-6">
                  <MapPin className="w-4 h-4 text-earth" /> {food.location.address}
                </p>
                <button 
                  onClick={() => setSelectedFood(food as FoodSpot)}
                  className="w-full py-5 bg-linen text-stone rounded-[2rem] font-bold border border-clay hover:bg-forest hover:text-white transition-all shadow-sm"
                >
                  Explore Menu
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Menu Modal */}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-10">
                  <h2 className="text-5xl font-serif font-bold text-white mb-2 leading-tight">{selectedFood.name}</h2>
                  <p className="text-white/80 text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-earth" /> {selectedFood.location.address}
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
                    <h3 className="text-3xl font-serif font-bold text-stone mb-2">Reservation Sent!</h3>
                    <p className="text-stone/40">We've received your request for {selectedFood.name}.</p>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex justify-between items-center pb-8 border-b border-clay/30">
                      <div>
                        <span className="text-[10px] uppercase font-black tracking-widest text-stone/30 block mb-2">Price Estimate</span>
                        <span className="bg-earth text-white px-5 py-2.5 rounded-full text-xs font-black">{selectedFood.priceRange}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-black tracking-widest text-stone/30 block mb-2">Visitor Rating</span>
                        <span className="text-forest font-serif font-bold text-4xl">★ {selectedFood.rating}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] uppercase font-black tracking-[0.2em] text-stone/30">Menu Highlights</h4>
                      {selectedFood.menu?.map((item, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex justify-between items-center p-6 bg-white/40 rounded-[2.5rem] border border-clay/50 hover:border-earth/30 transition-all shadow-sm"
                        >
                          <div>
                            <p className="font-bold text-stone text-xl leading-none">{item.name}</p>
                            {item.category && <p className="text-[10px] uppercase font-black text-stone/30 tracking-[0.3em] mt-3">{item.category}</p>}
                          </div>
                          <span className="text-earth font-serif font-bold text-2xl">{item.price}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-4 pt-6 pb-6">
                      <button 
                        onClick={handleReserve}
                        disabled={isBooking}
                        className="w-full bg-earth text-white py-6 rounded-[2.5rem] font-bold text-lg hover:bg-earth/90 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-earth/20"
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
                        className="w-full bg-stone text-white py-6 rounded-[2.5rem] font-bold hover:bg-forest transition-all flex items-center justify-center gap-3 shadow-2xl"
                      >
                        <Navigation className="w-5 h-5" />
                        Open Route in Maps
                      </a>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features Grid */}
      <section className="bg-clay/30 py-20 px-4 border-y border-clay/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm space-y-5 border border-clay">
            <div className="w-14 h-14 bg-earth rounded-2xl flex items-center justify-center text-white shadow-lg shadow-earth/20">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-forest">AI Itinerary</h3>
            <p className="text-stone/70 leading-relaxed font-medium">
              Tell our AI your budget and preferences, and get a tailored 3-day plan in seconds.
            </p>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm space-y-5 border border-clay">
            <div className="w-14 h-14 bg-forest rounded-2xl flex items-center justify-center text-white shadow-lg shadow-forest/20">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-forest">Local Buddies</h3>
            <p className="text-stone/70 leading-relaxed font-medium">
              Don't just visit—witness Bukidnon through the eyes of a local guide.
            </p>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm space-y-5 border border-clay">
            <div className="w-14 h-14 bg-olive rounded-2xl flex items-center justify-center text-white shadow-lg shadow-olive/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-forest">Verified Spots</h3>
            <p className="text-stone/70 leading-relaxed font-medium">
              Accurate entrance fees, real ratings, and precise Google Maps locations.
            </p>
          </div>
        </div>
      </section>

      {/* Local Buddies Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-16">
          <div className="flex-1 space-y-6">
            <h2 className="text-5xl font-serif font-bold text-forest leading-tight">Our Local Buddies</h2>
            <p className="text-stone/60 text-xl leading-relaxed">
              Don't just visit—experience Bukidnon like a local. Our verified buddies are expert mountaineers, cultural storytellers, and waterfall chasers ready to guide you.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/guides" className="bg-earth text-white px-8 py-4 rounded-2xl font-bold hover:bg-earth/90 transition-all shadow-lg shadow-earth/20 flex items-center gap-2">
                Meet the Team <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full h-[400px] rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white relative group">
            <img 
              src="/img/BukidGO/4.jpg" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              alt="Local Buddies Group"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] uppercase font-black tracking-widest px-4 py-2 rounded-full border border-white/30">
                Official Local Buddies Team
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(LOCAL_BUDDIES || []).map((buddy, idx) => (
            <motion.div
              key={buddy.uid}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              onClick={() => navigate('/guides')}
              className="bg-white border border-clay rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <img 
                    src={buddy.photoURL} 
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform"
                    alt={buddy.name}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-forest text-linen p-1 rounded-full border-2 border-white">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-forest group-hover:text-earth transition-colors">{buddy.name}</h3>
                  <p className="text-xs text-stone/40 uppercase tracking-widest font-bold">{buddy.experience} Exp</p>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-earth">
                  ★ {buddy.rating}
                </div>
                <div className="text-forest font-bold font-serif">
                  ₱{buddy.pricePerDay}<span className="text-xs text-stone/40 font-sans font-normal"> / day</span>
                </div>
                <button className="w-full bg-linen text-stone py-3 rounded-xl text-sm font-bold hover:bg-forest hover:text-white transition-all shadow-sm">
                  Book Buddy
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
