import { Star, ShieldCheck, Calendar, DollarSign, Briefcase, CheckCircle2, Search, Filter, X, Users, Award, Compass, MapPin, TrendingUp, Sparkles } from "lucide-react";
import { LOCAL_BUDDIES } from "../constants";
import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo, useEffect } from "react";
import { cn } from "../lib/utils";
import { useFirebase } from "../contexts/FirebaseContext";
import { db, OperationType, handleFirestoreError } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Guides() {
  const [selectedBuddy, setSelectedBuddy] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [minExperience, setMinExperience] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [minRating, setMinRating] = useState(0);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const { user } = useFirebase();
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const navigate = useNavigate();

  const [liveGuides, setLiveGuides] = useState<any[]>(LOCAL_BUDDIES || []);

  useEffect(() => {
    return onSnapshot(collection(db, "guides"), (snapshot) => {
      if (!snapshot.empty) {
        setLiveGuides(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    });
  }, []);

  const allSpecialties = useMemo(() => {
    const specialtiesSet = new Set<string>();
    liveGuides.forEach(buddy => {
      if (buddy.specialties) {
        buddy.specialties.forEach((spec: string) => specialtiesSet.add(spec));
      }
    });
    return Array.from(specialtiesSet);
  }, [liveGuides]);

  const filteredBuddies = useMemo(() => {
    return (liveGuides || []).filter(buddy => {
      const matchesSearch = buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          buddy.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (buddy.specialties && buddy.specialties.some((spec: string) => 
                            spec.toLowerCase().includes(searchQuery.toLowerCase())
                          ));
      const years = parseInt(buddy.experience) || 0;
      const matchesExp = years >= minExperience;
      const matchesPrice = (buddy.pricePerDay || 0) <= maxPrice;
      const matchesRating = buddy.rating >= minRating;
      const matchesSpecialties = specialties.length === 0 || 
        (buddy.specialties && buddy.specialties.some((spec: string) => specialties.includes(spec)));
      
      return matchesSearch && matchesExp && matchesPrice && matchesRating && matchesSpecialties;
    });
  }, [liveGuides, searchQuery, minExperience, maxPrice, minRating, specialties]);

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

  const toggleSpecialty = (specialty: string) => {
    setSpecialties(prev => 
      prev.includes(specialty) 
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="relative rounded-[4rem] overflow-hidden mb-16 bg-gradient-to-br from-forest/90 to-earth/90 p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <span className="text-white/80 font-black uppercase tracking-[0.3em] text-sm">Local Experts</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
            Meet Your <br />
            <span className="text-linen underline decoration-white/30">Bukidnon Buddies</span>
          </h1>
          <p className="text-white/60 text-xl max-w-2xl leading-relaxed">
            Connect with verified local guides who know Bukidnon's hidden gems, secret trails, and authentic experiences.
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
                placeholder="Search by name, bio, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-linen border border-clay rounded-[2rem] focus:ring-2 focus:ring-earth outline-none transition-all font-medium text-stone placeholder:text-stone/30"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4">
            {/* Experience Filter */}
            <div className="space-y-2 min-w-[180px]">
              <label className="text-xs font-black uppercase tracking-widest text-stone/30 flex items-center gap-2">
                <Briefcase className="w-3 h-3" /> Experience
              </label>
              <select 
                value={minExperience}
                onChange={(e) => setMinExperience(Number(e.target.value))}
                className="w-full bg-white border border-clay rounded-2xl px-4 py-3 text-sm font-bold text-stone focus:ring-2 focus:ring-earth outline-none"
              >
                <option value={0}>Any Experience</option>
                <option value={1}>1+ Year</option>
                <option value={3}>3+ Years</option>
                <option value={5}>5+ Years</option>
                <option value={7}>7+ Years</option>
              </select>
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
                <option value={4.5}>4.5+ Stars</option>
                <option value={4.8}>4.8+ Stars</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="space-y-2 min-w-[200px]">
              <label className="text-xs font-black uppercase tracking-widest text-stone/30 flex items-center gap-2">
                <DollarSign className="w-3 h-3" /> Max Price: ₱{maxPrice}
              </label>
              <div className="flex items-center gap-4">
                <input 
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="flex-1 accent-earth"
                />
                <span className="text-sm font-bold text-earth bg-earth/10 px-3 py-1 rounded-full">₱{maxPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specialties Filter */}
        {allSpecialties.length > 0 && (
          <div className="mt-6 pt-6 border-t border-clay/30">
            <div className="flex items-center gap-3 mb-4">
              <Compass className="w-5 h-5 text-earth" />
              <label className="text-xs font-black uppercase tracking-widest text-stone/30">Specialties</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {allSpecialties.map(specialty => (
                <button
                  key={specialty}
                  onClick={() => toggleSpecialty(specialty)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-bold transition-all border",
                    specialties.includes(specialty)
                      ? "bg-earth text-white border-earth shadow-lg shadow-earth/20"
                      : "bg-white text-stone/60 border-clay hover:border-earth/30"
                  )}
                >
                  {specialty}
                </button>
              ))}
              {specialties.length > 0 && (
                <button
                  onClick={() => setSpecialties([])}
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
              <Users className="w-5 h-5 text-earth" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-stone/30">Available Guides</p>
              <p className="text-2xl font-serif font-bold text-forest">
                {filteredBuddies.length} <span className="text-stone/40 text-lg">/ {liveGuides.length}</span>
              </p>
            </div>
          </div>
          {(searchQuery || minExperience > 0 || maxPrice < 5000 || minRating > 0 || specialties.length > 0) && (
            <button 
              onClick={() => { 
                setSearchQuery(""); 
                setMinExperience(0); 
                setMaxPrice(5000); 
                setMinRating(0);
                setSpecialties([]);
              }}
              className="text-earth font-black uppercase tracking-widest text-xs hover:underline flex items-center gap-2"
            >
              <X className="w-3 h-3" />
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Guides List */}
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
                  "cursor-pointer bg-white p-8 rounded-[3rem] border-2 transition-all flex items-center gap-8 shadow-lg hover:shadow-2xl group",
                  selectedBuddy?.uid === buddy.uid 
                    ? "border-earth shadow-xl shadow-earth/20 ring-2 ring-earth/20" 
                    : "border-clay hover:border-earth/50"
                )}
              >
                <div className="relative">
                  <img 
                    src={buddy.photoURL} 
                    className="w-32 h-32 rounded-[2rem] object-cover shadow-xl group-hover:scale-105 transition-transform duration-300"
                    alt={buddy.name}
                  />
                  <div className="absolute -bottom-2 -right-2 bg-forest text-white p-2 rounded-full border-4 border-white">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-stone group-hover:text-forest transition-colors">{buddy.name}</h3>
                      <p className="text-sm text-stone/40 font-bold mb-2 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> {buddy.experience} Experience
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5 text-sm font-black text-yellow-500 bg-yellow-50 px-3 py-1.5 rounded-full">
                        <Star className="w-4 h-4 fill-yellow-500" /> {buddy.rating}
                      </div>
                      <div className="text-2xl font-serif font-bold text-earth">
                        ₱{buddy.pricePerDay}<span className="text-sm text-stone/40 font-sans">/day</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-stone/60 mb-4 line-clamp-2">{buddy.bio}</p>
                  
                  {buddy.specialties && buddy.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {buddy.specialties.slice(0, 3).map((spec: string, idx: number) => (
                        <span key={idx} className="text-xs font-bold text-forest bg-forest/10 px-3 py-1.5 rounded-full">
                          {spec}
                        </span>
                      ))}
                      {buddy.specialties.length > 3 && (
                        <span className="text-xs font-bold text-stone/40 px-3 py-1.5 rounded-full">
                          +{buddy.specialties.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-clay">
              <div className="w-24 h-24 bg-linen rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter className="w-12 h-12 text-stone/20" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-stone mb-4">No Guides Found</h3>
              <p className="text-stone/40 mb-6 max-w-md mx-auto">
                Try adjusting your filters or search terms to find the perfect local buddy.
              </p>
              <button 
                onClick={() => { 
                  setSearchQuery(""); 
                  setMinExperience(0); 
                  setMaxPrice(5000); 
                  setMinRating(0);
                  setSpecialties([]);
                }}
                className="bg-earth text-white px-8 py-3 rounded-2xl font-bold hover:bg-earth/90 transition-all flex items-center gap-2 mx-auto"
              >
                <Sparkles className="w-4 h-4" />
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Selected Buddy Details */}
        <div className="lg:sticky lg:top-24 h-fit">
          <AnimatePresence mode="wait">
            {booked ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gradient-to-br from-forest to-earth rounded-[3rem] p-12 text-center text-white shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32" />
                <CheckCircle2 className="w-24 h-24 mx-auto mb-8 text-linen animate-bounce" />
                <h2 className="text-4xl font-serif font-bold mb-4">Booking Confirmed!</h2>
                <p className="text-linen/80 text-lg mb-8">
                  Your request has been sent to {selectedBuddy?.name.split(' ')[0]}. You'll receive a confirmation within 24 hours.
                </p>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <p className="text-sm font-bold mb-2">What happens next?</p>
                  <ul className="text-sm text-linen/60 space-y-2 text-left">
                    <li className="flex items-center gap-2">✓ Guide will contact you via email</li>
                    <li className="flex items-center gap-2">✓ Discuss itinerary details</li>
                    <li className="flex items-center gap-2">✓ Confirm meeting point & time</li>
                    <li className="flex items-center gap-2">✓ Payment secured through platform</li>
                  </ul>
                </div>
              </motion.div>
            ) : selectedBuddy ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3rem] p-10 border border-clay shadow-2xl space-y-10 relative overflow-hidden"
              >
                {/* Background Elements */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-earth/5 rounded-full -mr-24 -mt-24" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-forest/5 rounded-full -ml-24 -mb-24" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative">
                      <img src={selectedBuddy.photoURL} className="w-28 h-28 rounded-2xl object-cover shadow-xl border-4 border-linen" alt="" />
                      <div className="absolute -bottom-2 -right-2 bg-forest text-white p-2 rounded-full border-4 border-white">
                        <Award className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-3xl font-serif font-bold text-stone">{selectedBuddy.name}</h2>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-sm font-bold text-stone/30 flex items-center gap-1.5 uppercase tracking-widest bg-linen px-4 py-1.5 rounded-full">
                          <Briefcase className="w-3.5 h-3.5" /> {selectedBuddy.experience}
                        </span>
                        <span className="text-sm font-bold text-yellow-500 flex items-center gap-1.5 bg-yellow-50 px-4 py-1.5 rounded-full">
                          <Star className="w-3.5 h-3.5 fill-yellow-500" /> {selectedBuddy.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-stone/30 mb-3 flex items-center gap-2">
                        <Compass className="w-4 h-4" /> About {selectedBuddy.name.split(' ')[0]}
                      </h4>
                      <p className="text-stone/60 leading-relaxed text-lg">{selectedBuddy.bio}</p>
                    </div>

                    {selectedBuddy.specialties && selectedBuddy.specialties.length > 0 && (
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-stone/30 mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" /> Specialties
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedBuddy.specialties.map((spec: string, idx: number) => (
                            <span key={idx} className="text-sm font-bold text-forest bg-forest/10 px-4 py-2 rounded-full">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-gradient-to-r from-linen to-white rounded-[2.5rem] p-8 space-y-4 border border-clay/50">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-bold text-stone/40 mb-1">Service Fee (per day)</p>
                          <p className="text-2xl font-serif font-bold text-stone">₱{selectedBuddy.pricePerDay}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-stone/40 mb-1">Platform Fee</p>
                          <p className="text-xl font-serif font-bold text-stone">₱49</p>
                        </div>
                      </div>
                      <hr className="border-clay/30" />
                      <div className="flex justify-between items-center pt-2">
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-stone/30">Total Estimate</p>
                          <p className="text-sm text-stone/40">Includes taxes & service charges</p>
                        </div>
                        <div className="text-right">
                          <p className="text-4xl font-serif font-bold text-earth">₱{selectedBuddy.pricePerDay + 49}</p>
                          <p className="text-xs text-stone/40">per day</p>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handleBook}
                      disabled={isBooking}
                      className="w-full bg-gradient-to-r from-forest to-earth text-white py-5 rounded-[2rem] font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-forest/20 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-earth/0 via-white/10 to-forest/0 group-hover:animate-shimmer" />
                      {isBooking ? (
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin relative z-10" />
                      ) : (
                        <>
                          <Calendar className="w-5 h-5 relative z-10" />
                          <span className="relative z-10">Book {selectedBuddy.name.split(' ')[0]}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-[500px] flex flex-col items-center justify-center text-center p-12 border-4 border-dashed border-clay rounded-[4rem] bg-gradient-to-b from-white to-linen">
                <div className="w-32 h-32 bg-gradient-to-br from-linen to-white rounded-full flex items-center justify-center text-stone/20 mb-8 border-8 border-clay shadow-inner">
                  <Users className="w-16 h-16" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-stone/40 mb-4">Select a Local Buddy</h3>
                <p className="text-stone/30 text-lg max-w-sm mb-8">
                  Browse through our verified local guides and choose your perfect companion for exploring Bukidnon.
                </p>
                <div className="flex items-center gap-4 text-sm text-stone/40">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Verified
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" /> Certified
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Local
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}