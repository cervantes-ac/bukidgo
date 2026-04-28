import { Star, ShieldCheck, Calendar, DollarSign, Briefcase, CheckCircle2, Search, Filter, X } from "lucide-react";
import { LOCAL_BUDDIES } from "../constants";
import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo } from "react";
import { cn } from "../lib/utils";
import { useFirebase } from "../contexts/FirebaseContext";
import { db, OperationType, handleFirestoreError } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Guides() {
  const [selectedBuddy, setSelectedBuddy] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [minExperience, setMinExperience] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const { user } = useFirebase();
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const navigate = useNavigate();

  const filteredBuddies = useMemo(() => {
    return (LOCAL_BUDDIES || []).filter(buddy => {
      const matchesSearch = buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          buddy.bio.toLowerCase().includes(searchQuery.toLowerCase());
      const years = parseInt(buddy.experience) || 0;
      const matchesExp = years >= minExperience;
      const matchesPrice = buddy.pricePerDay <= maxPrice;
      return matchesSearch && matchesExp && matchesPrice;
    });
  }, [searchQuery, minExperience, maxPrice]);

  const handleBook = async () => {
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
        buddyId: selectedBuddy.uid,
        buddyName: selectedBuddy.name,
        date: new Date().toISOString(),
        status: "pending",
        createdAt: serverTimestamp(),
        type: "buddy"
      });
      setBooked(true);
      setTimeout(() => {
        setBooked(false);
        setSelectedBuddy(null);
      }, 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "bookings");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-serif font-bold text-forest mb-4">Local Buddies</h1>
          <p className="text-stone/60 text-lg">Expert guides to make your Bukidnon experience authentic.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 items-end">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone/30 group-focus-within:text-earth transition-colors" />
            <input 
              type="text"
              placeholder="Search buddies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border border-clay rounded-2xl w-full md:w-64 focus:ring-2 focus:ring-earth outline-none transition-all font-medium"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone/30">Experience (Yrs)</label>
              <select 
                value={minExperience}
                onChange={(e) => setMinExperience(Number(e.target.value))}
                className="bg-white border border-clay rounded-2xl px-4 py-4 text-sm font-bold text-stone focus:ring-2 focus:ring-earth outline-none"
              >
                <option value={0}>Any</option>
                <option value={1}>1+ Yr</option>
                <option value={3}>3+ Yrs</option>
                <option value={5}>5+ Yrs</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone/30">Max Price (₱)</label>
              <input 
                type="range"
                min="500"
                max="5000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-32 accent-earth"
              />
              <div className="text-[10px] font-bold text-stone/40">Up to ₱{maxPrice}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          {filteredBuddies.length > 0 ? (
            filteredBuddies.map((buddy) => (
              <motion.div
                key={buddy.uid}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 10 }}
                onClick={() => setSelectedBuddy(buddy)}
                className={cn(
                  "cursor-pointer bg-white p-8 rounded-[2.5rem] border-2 transition-all flex items-center gap-8 shadow-sm",
                  selectedBuddy?.uid === buddy.uid ? "border-earth shadow-xl shadow-earth/10" : "border-clay hover:border-earth/30"
                )}
              >
              <img 
                src={buddy.photoURL} 
                className="w-28 h-28 rounded-3xl object-cover shadow-lg"
                alt={buddy.name}
              />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-serif font-bold text-stone group-hover:text-forest transition-colors">{buddy.name}</h3>
                  <div className="flex items-center gap-1.5 text-sm font-black text-yellow-500 bg-yellow-50 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-yellow-500" /> {buddy.rating}
                  </div>
                </div>
                <p className="text-sm text-stone/40 font-bold mb-6 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> {buddy.experience} of experience
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5 text-xs font-black text-earth uppercase tracking-[0.2em]">
                    <DollarSign className="w-3.5 h-3.5" />
                    ₱{buddy.pricePerDay} / DAY
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-forest uppercase tracking-[0.2em]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    VERIFIED
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center bg-white rounded-[2.5rem] border border-clay border-dashed">
            <Filter className="w-12 h-12 mx-auto text-stone/20 mb-4" />
            <p className="text-stone/40 font-bold">No local buddies match your current filters.</p>
            <button 
              onClick={() => { setSearchQuery(""); setMinExperience(0); setMaxPrice(5000); }}
              className="mt-4 text-earth font-black uppercase tracking-widest text-xs hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

        <div className="lg:sticky lg:top-24 h-fit">
          <AnimatePresence mode="wait">
            {booked ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-forest rounded-[3rem] p-12 text-center text-white shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
                <CheckCircle2 className="w-24 h-24 mx-auto mb-8 text-linen animate-bounce" />
                <h2 className="text-4xl font-serif font-bold mb-4">Booking Sent!</h2>
                <p className="text-linen/60 text-lg">Your request has been forwarded to {selectedBuddy.name.split(' ')[0]}. You'll hear back within 24 hours.</p>
              </motion.div>
            ) : selectedBuddy ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3rem] p-10 border border-clay shadow-2xl space-y-10"
              >
                <div className="flex items-center gap-6">
                  <img src={selectedBuddy.photoURL} className="w-24 h-24 rounded-full object-cover shadow-xl border-4 border-linen" alt="" />
                  <div>
                    <h2 className="text-3xl font-serif font-bold text-stone">{selectedBuddy.name}</h2>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm font-bold text-stone/30 flex items-center gap-1.5 uppercase tracking-widest">
                        <Briefcase className="w-3.5 h-3.5" /> {selectedBuddy.experience}
                      </span>
                      <span className="text-sm font-bold text-yellow-500 flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 fill-yellow-500" /> {selectedBuddy.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-stone/30">About the Buddy</h4>
                  <p className="text-stone/60 leading-relaxed text-lg">{selectedBuddy.bio}</p>
                </div>

                <div className="bg-linen rounded-[2.5rem] p-8 space-y-4 border border-clay/50">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-stone/40">Service Fee (per day)</span>
                    <span className="text-stone font-serif">₱{selectedBuddy.pricePerDay}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-stone/40">Platform Fee</span>
                    <span className="text-stone font-serif">₱49</span>
                  </div>
                  <hr className="border-clay/50" />
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-black text-stone uppercase tracking-widest text-xs">Total Estimate</span>
                    <span className="text-3xl font-serif font-bold text-earth">₱{selectedBuddy.pricePerDay + 49}</span>
                  </div>
                </div>

                <button 
                  onClick={handleBook}
                  disabled={isBooking}
                  className="w-full bg-forest text-white py-5 rounded-[2rem] font-bold text-lg hover:bg-forest/90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-forest/20"
                >
                  {isBooking ? (
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Calendar className="w-5 h-5" /> Book Buddy
                    </>
                  )}
                </button>
              </motion.div>
            ) : (
              <div className="h-[500px] flex flex-col items-center justify-center text-center p-12 border-4 border-dashed border-clay rounded-[4rem]">
                <div className="w-24 h-24 bg-linen rounded-full flex items-center justify-center text-stone/20 mb-8 border-4 border-clay shadow-inner">
                  <ShieldCheck className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-stone/40">Select a Buddy</h3>
                <p className="text-stone/30 text-lg max-w-xs mt-4">Browse through our verified locals and choose your perfect guide.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
