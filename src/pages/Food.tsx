import { Utensils, Star, MapPin, X, Navigation, Search, Calendar, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useMemo } from "react";
import { FoodSpot } from "../types";
import { useFirebase } from "../contexts/FirebaseContext";
import { db, OperationType, handleFirestoreError } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useToast, ToastContainer } from "../components/Toast";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
  .bk-display { font-family: 'Fraunces', Georgia, serif; }
  .bk-mono { font-family: 'JetBrains Mono', monospace; }
  .food-card { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease; position: relative; }
  .food-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #C4622D, #D4A853); transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease; z-index: 10; }
  .food-card:hover { transform: translateY(-8px); box-shadow: 0 24px 48px rgba(26,18,8,0.16); }
  .food-card:hover::before { transform: scaleX(1); }
  .food-img { transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1); }
  .food-card:hover .food-img { transform: scale(1.1); }
  .modal-scroll::-webkit-scrollbar { width: 6px; }
  .modal-scroll::-webkit-scrollbar-track { background: #F5F0E8; }
  .modal-scroll::-webkit-scrollbar-thumb { background: #DDD6C8; border-radius: 99px; }
  .modal-scroll::-webkit-scrollbar-thumb:hover { background: #C4C0B8; }
  input, select { font-family: 'Outfit', system-ui, sans-serif; }
  select option { background: #FAF7F2; }
  input:focus, select:focus { outline: 2px solid #C4622D; outline-offset: 2px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .price-badge-low { background: #dcfce7; color: #166534; }
  .price-badge-mid { background: #fef9c3; color: #854d0e; }
  .price-badge-high { background: #fee2e2; color: #991b1b; }
`;

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
  const [sortBy, setSortBy] = useState<"rating" | "price" | "name">("rating");
  const [cuisineTypes, setCuisineTypes] = useState<string[]>([]);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    return onSnapshot(collection(db, "foodSpots"), snapshot => {
      if (!snapshot.empty) setLiveFoodSpots(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FoodSpot)));
      setLoading(false);
    });
  }, []);

  const filters = [
    { id: "all", label: "All" },
    { id: "₱", label: "₱ Budget" },
    { id: "₱₱", label: "₱₱ Mid" },
    { id: "₱₱₱", label: "₱₱₱ Premium" }
  ];

  const allCuisineTypes = useMemo(() => {
    const types = new Set<string>();
    liveFoodSpots.forEach(s => {
      if (s.cuisineType) {
        if (Array.isArray(s.cuisineType)) s.cuisineType.forEach((t: string) => types.add(t));
        else types.add(s.cuisineType as string);
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
      const matchesCuisine = cuisineTypes.length === 0 ||
        (s.cuisineType && (Array.isArray(s.cuisineType)
          ? s.cuisineType.some((t: string) => cuisineTypes.includes(t))
          : cuisineTypes.includes(s.cuisineType as string)));
      return matchesFilter && matchesSearch && matchesCuisine;
    });
    filtered.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price") {
        const p = { "₱": 1, "₱₱": 2, "₱₱₱": 3 };
        return (p[a.priceRange as keyof typeof p] || 1) - (p[b.priceRange as keyof typeof p] || 1);
      }
      return a.name.localeCompare(b.name);
    });
    return filtered;
  }, [liveFoodSpots, searchQuery, activeFilter, cuisineTypes, sortBy]);

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
    } finally { setIsBooking(false); }
  };

  const priceBadgeClass = (pr: string) => pr === "₱" ? "price-badge-low" : pr === "₱₱₱" ? "price-badge-high" : "price-badge-mid";

  return (
    <>
      <style>{S}</style>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", background: "#F5F0E8", color: "#1A1208", minHeight: "100vh" }}>

        {/* Decorative top bar */}
        <div style={{ height: 4, background: "linear-gradient(90deg, #C4622D, #D4A853, #C4622D)" }} />

        {/* Hero */}
        <div style={{ padding: "72px 2rem 56px", borderBottom: "1px solid #DDD6C8", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "end", flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, background: "#C4622D", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Utensils style={{ width: 18, height: 18, color: "#fff" }} />
                </div>
                <span className="bk-mono" style={{ fontSize: 10, color: "#C4622D", letterSpacing: "0.35em", textTransform: "uppercase", fontWeight: 700 }}>
                  Local Flavors · Bukidnon
                </span>
              </div>
              <h1 className="bk-display" style={{ fontSize: "clamp(3rem,8vw,7rem)", fontWeight: 900, color: "#1A1208", lineHeight: 0.9, marginBottom: 16 }}>
                Taste<br /><em style={{ color: "#C4622D" }}>Bukidnon</em><br />Like a Local
              </h1>
              <p style={{ fontSize: 16, color: "#7A6E61", maxWidth: 440, lineHeight: 1.7, fontWeight: 300 }}>
                Authentic highland cuisine — from traditional Binaki to modern farm-to-table experiences.
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: 8 }}>
              <div style={{ width: 140, height: 140, borderRadius: "50%", border: "3px solid #C4622D", background: "#FAF7F2", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div className="bk-display" style={{ fontSize: 44, fontWeight: 900, color: "#1A1208", lineHeight: 1 }}>{filteredSpots.length}</div>
                <div className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 4 }}>Spots</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div style={{ position: "sticky", top: 72, zIndex: 20, background: "rgba(245,240,232,0.96)", backdropFilter: "blur(10px)", borderBottom: "1px solid #DDD6C8", padding: "12px 2rem" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, minWidth: 180, maxWidth: 320, position: "relative" }}>
                <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "#7A6E61" }} />
                <input type="text" placeholder="Search food spots…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: "100%", paddingLeft: 40, paddingRight: 14, paddingTop: 10, paddingBottom: 10, background: "#fff", border: "1px solid #DDD6C8", borderRadius: 2, fontSize: 14, color: "#1A1208", outline: "none" }} />
              </div>

              {filters.map(f => (
                <button key={f.id} onClick={() => setActiveFilter(f.id)}
                  style={{
                    padding: "8px 14px", borderRadius: 2, fontSize: 13, fontWeight: 600, cursor: "pointer",
                    background: activeFilter === f.id ? "#C4622D" : "transparent",
                    color: activeFilter === f.id ? "#fff" : "#7A6E61",
                    border: activeFilter === f.id ? "1px solid #C4622D" : "1px solid #DDD6C8",
                    transition: "all 0.15s",
                  }}>
                  {f.label}
                </button>
              ))}

              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
                style={{ padding: "9px 12px", background: "#fff", border: "1px solid #DDD6C8", borderRadius: 2, fontSize: 13, color: "#1A1208", outline: "none", marginLeft: "auto" }}>
                <option value="rating">Top Rated</option>
                <option value="price">Price: Low–High</option>
                <option value="name">A–Z</option>
              </select>

              {(searchQuery || activeFilter !== "all" || cuisineTypes.length > 0) && (
                <button onClick={() => { setSearchQuery(""); setActiveFilter("all"); setCuisineTypes([]); setSortBy("rating"); }}
                  style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "#C4622D", background: "transparent", border: "none", cursor: "pointer" }}>
                  <X style={{ width: 14, height: 14 }} /> Clear
                </button>
              )}
            </div>

            {allCuisineTypes.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                {allCuisineTypes.map(cuisine => (
                  <button key={cuisine} onClick={() => setCuisineTypes(prev => prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine])}
                    style={{
                      padding: "5px 12px", borderRadius: 2, fontSize: 11, fontWeight: 600, cursor: "pointer",
                      background: cuisineTypes.includes(cuisine) ? "#1A1208" : "transparent",
                      color: cuisineTypes.includes(cuisine) ? "#F5F0E8" : "#7A6E61",
                      border: cuisineTypes.includes(cuisine) ? "1px solid #1A1208" : "1px solid #DDD6C8",
                      transition: "all 0.15s",
                    }}>
                    {cuisine}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 2rem 80px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ width: 36, height: 36, border: "2px solid #C4622D", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            </div>
          ) : filteredSpots.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div className="bk-display" style={{ fontSize: 48, color: "#DDD6C8", marginBottom: 8 }}>Nothing here yet</div>
              <p style={{ color: "#7A6E61", fontSize: 14 }}>Try different filters</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 2 }}>
                {filteredSpots.map((food, i) => (
                  <motion.div key={food.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}
                    className="food-card" style={{ background: "#fff", border: "1px solid #DDD6C8", overflow: "hidden", cursor: "pointer" }}
                    onClick={() => setSelectedFood(food as FoodSpot)}>
                    <div style={{ position: "relative", height: 260, overflow: "hidden" }}>
                      <img src={food.image} className="food-img" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={food.name} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,18,8,0.8) 0%, rgba(26,18,8,0.2) 50%, transparent 100%)" }} />
                      <div className={`bk-mono ${priceBadgeClass(food.priceRange)}`} style={{ position: "absolute", top: 14, left: 14, padding: "6px 12px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", borderRadius: 3 }}>
                        {food.priceRange}
                      </div>
                      <div className="bk-mono" style={{ position: "absolute", top: 14, right: 14, background: "rgba(245,240,232,0.95)", color: "#1A1208", padding: "6px 12px", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 5, borderRadius: 3 }}>
                        <Star style={{ width: 11, height: 11, fill: "#D4A853", color: "#D4A853" }} /> {food.rating}
                      </div>
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px" }}>
                        <h3 className="bk-display" style={{ fontSize: "clamp(18px, 4vw, 24px)", fontWeight: 900, color: "#F5F0E8", lineHeight: 1.1, marginBottom: 6 }}>{food.name}</h3>
                        <p style={{ fontSize: 13, color: "rgba(245,240,232,0.75)", display: "flex", alignItems: "center", gap: 5 }}>
                          <MapPin style={{ width: 13, height: 13, flexShrink: 0 }} /> {food.location.address}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedFood && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(26,18,8,0.75)", backdropFilter: "blur(12px)" }}
              onClick={() => setSelectedFood(null)}>
              <motion.div initial={{ y: 48, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 48, opacity: 0 }}
                className="modal-scroll" onClick={e => e.stopPropagation()}
                style={{ background: "#FAF7F2", width: "100%", maxWidth: 500, maxHeight: "92vh", display: "flex", flexDirection: "column", border: "1px solid #DDD6C8", overflow: "hidden", position: "relative" }}>
                <button onClick={() => setSelectedFood(null)}
                  style={{ position: "absolute", top: 14, right: 14, width: 34, height: 34, background: "#1A1208", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#F5F0E8", zIndex: 20 }}>
                  <X style={{ width: 16, height: 16 }} />
                </button>

                <div style={{ height: 200, flexShrink: 0, position: "relative" }}>
                  <img src={selectedFood.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #FAF7F2, transparent 60%)" }} />
                </div>

                <div style={{ padding: "0 28px 8px", position: "relative", zIndex: 5 }}>
                  <h2 className="bk-display" style={{ fontSize: 32, fontWeight: 900, color: "#1A1208", lineHeight: 1.1, marginBottom: 4 }}>{selectedFood.name}</h2>
                  <p style={{ fontSize: 13, color: "#7A6E61", display: "flex", alignItems: "center", gap: 4 }}>
                    <MapPin style={{ width: 13, height: 13, color: "#C4622D" }} /> {selectedFood.location.address}
                  </p>
                </div>

                <div className="modal-scroll" style={{ flex: 1, overflowY: "auto", padding: "20px 28px 28px" }}>
                  {booked ? (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <CheckCircle2 style={{ width: 52, height: 52, color: "#4A7C59", margin: "0 auto 16px" }} />
                      <h3 className="bk-display" style={{ fontSize: 26, fontWeight: 700, color: "#1A1208", marginBottom: 6 }}>Reservation Sent!</h3>
                      <p style={{ color: "#7A6E61", fontSize: 14 }}>We've received your request for {selectedFood.name}.</p>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 16, marginBottom: 16, borderBottom: "1px solid #DDD6C8" }}>
                        <div>
                          <div className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>Price Range</div>
                          <span className={priceBadgeClass(selectedFood.priceRange)} style={{ padding: "4px 14px", fontSize: 12, fontWeight: 700 }}>{selectedFood.priceRange}</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>Rating</div>
                          <div className="bk-display" style={{ fontSize: 28, fontWeight: 900, color: "#1A1208" }}>★ {selectedFood.rating}</div>
                        </div>
                      </div>

                      <div className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Menu Highlights</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                        {selectedFood.menu?.map((item: any, idx: number) => (
                          <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#fff", border: "1px solid #DDD6C8" }}>
                            <div>
                              <p style={{ fontWeight: 600, fontSize: 14, color: "#1A1208" }}>{item.name}</p>
                              {item.category && <p className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 2 }}>{item.category}</p>}
                            </div>
                            <span className="bk-display" style={{ fontSize: 18, fontWeight: 700, color: "#C4622D" }}>{item.price}</span>
                          </motion.div>
                        ))}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <button onClick={handleReserve} disabled={isBooking}
                          style={{ width: "100%", padding: "14px", background: "#C4622D", color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          {isBooking ? <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                            : <><Calendar style={{ width: 15, height: 15 }} /> Reserve a Table</>}
                        </button>
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedFood.location.lat},${selectedFood.location.lng}`}
                          target="_blank" rel="noreferrer"
                          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "14px", background: "#1A1208", color: "#F5F0E8", textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
                          <Navigation style={{ width: 15, height: 15 }} /> Get Directions
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
    </>
  );
}