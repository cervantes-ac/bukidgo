import { Search, MapPin, Star, Navigation, Utensils, X, Compass, ArrowUpRight, Calendar, CheckCircle2, Mountain, Eye, Users } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FoodSpot, Destination } from "../types";
import { useFirebase } from "../contexts/FirebaseContext";
import { db, OperationType, handleFirestoreError } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
  .bk-display { font-family: 'Fraunces', Georgia, serif; }
  .bk-mono { font-family: 'JetBrains Mono', monospace; }
  .ex-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
  .ex-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(26,18,8,0.12); }
  .ex-img { transition: transform 0.7s ease; }
  .ex-card:hover .ex-img { transform: scale(1.07); }
  .tab-btn { transition: all 0.15s; }
  .modal-scroll::-webkit-scrollbar { width: 4px; }
  .modal-scroll::-webkit-scrollbar-thumb { background: #DDD6C8; border-radius: 99px; }
  input, select { font-family: 'Outfit', system-ui, sans-serif; }
  select option { background: #F5F0E8; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const CAT_COLORS: Record<string, string> = {
  nature: "#4A7C59", adventure: "#C4622D", cultural: "#7C5B9E",
  viewpoint: "#2A7090", food: "#C4622D", all: "#4A7C59"
};

type CombinedItem = Destination | (FoodSpot & { category: "food"; images: string[]; entranceFee: number; isFood: true; originalFood: FoodSpot; });

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
  const [sortBy, setSortBy] = useState<"rating" | "name" | "entranceFee">("rating");
  const [maxEntranceFee, setMaxEntranceFee] = useState<number | null>(null);

  useEffect(() => {
    const u1 = onSnapshot(collection(db, "destinations"), s => {
      if (!s.empty) setLiveDestinations(s.docs.map(d => ({ id: d.id, ...d.data() } as Destination)));
      setLoading(false);
    });
    const u2 = onSnapshot(collection(db, "foodSpots"), s => {
      if (!s.empty) setLiveFoodSpots(s.docs.map(d => ({ id: d.id, ...d.data() } as FoodSpot)));
    });
    return () => { u1(); u2(); };
  }, []);

  const categories = [
    { id: "all", label: "Everything", icon: Compass },
    { id: "nature", label: "Nature", icon: Mountain },
    { id: "adventure", label: "Adventure", icon: Navigation },
    { id: "cultural", label: "Culture", icon: Users },
    { id: "viewpoint", label: "Views", icon: Eye },
    { id: "food", label: "Eats", icon: Utensils }
  ];

  const combinedItems = useMemo(() => [
    ...liveDestinations,
    ...liveFoodSpots.map(f => ({ ...f, category: "food" as const, images: [f.image], entranceFee: 0, isFood: true as const, originalFood: f }))
  ] as CombinedItem[], [liveDestinations, liveFoodSpots]);

  const filteredItems = useMemo(() => {
    let filtered = combinedItems.filter(item => {
      const matchesTab = activeTab === "all" || item.category === activeTab;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFee = maxEntranceFee === null || ('isFood' in item ? true : item.entranceFee <= maxEntranceFee);
      return matchesTab && matchesSearch && matchesFee;
    });
    filtered.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "entranceFee") return ('isFood' in a ? 0 : a.entranceFee) - ('isFood' in b ? 0 : b.entranceFee);
      return a.name.localeCompare(b.name);
    });
    return filtered;
  }, [combinedItems, searchQuery, activeTab, maxEntranceFee, sortBy]);

  const handleBookDest = async () => {
    if (!user) { navigate('/auth'); return; }
    setIsBooking(true);
    try {
      await addDoc(collection(db, "bookings"), {
        userId: user.uid, userName: user.displayName || "User", userEmail: user.email,
        destinationId: selectedDest!.id, destinationName: selectedDest!.name,
        date: new Date().toISOString(), status: "pending", createdAt: serverTimestamp(), type: "destination"
      });
      setBooked(true);
      setTimeout(() => { setBooked(false); setSelectedDest(null); }, 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "bookings");
    } finally { setIsBooking(false); }
  };

  const ModalClose = ({ fn }: { fn: () => void }) => (
    <button onClick={fn} style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: 2, background: "rgba(26,18,8,0.7)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#F5F0E8", zIndex: 20 }}>
      <X style={{ width: 18, height: 18 }} />
    </button>
  );

  return (
    <>
      <style>{S}</style>
      <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", background: "#F5F0E8", color: "#1A1208", minHeight: "100vh" }}>

        {/* Hero */}
        <div style={{ background: "#1A1208", padding: "72px 2rem 56px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(74,124,89,0.12), transparent)" }} />
          <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 2 }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 32, marginBottom: 40 }}>
              <div>
                <div className="bk-mono" style={{ fontSize: 10, color: "#4A7C59", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <Compass style={{ width: 14, height: 14 }} /> Highland Discovery
                </div>
                <h1 className="bk-display" style={{ fontSize: "clamp(3.5rem,9vw,8rem)", fontWeight: 900, color: "#F5F0E8", lineHeight: 0.9 }}>
                  Explore<br /><em style={{ color: "#4A7C59" }}>Bukidnon</em>
                </h1>
                <p style={{ fontSize: 16, color: "rgba(245,240,232,0.45)", maxWidth: 440, lineHeight: 1.7, fontWeight: 300, marginTop: 16 }}>
                  Highland paradise — hidden waterfalls, mountain peaks, and soul-warming local flavors.
                </p>
              </div>
              <div style={{ display: "flex", gap: 32, paddingBottom: 8 }}>
                {[["Destinations", liveDestinations.length, "#F5F0E8"], ["Food Spots", liveFoodSpots.length, "#F5F0E8"], ["Showing", filteredItems.length, "#4A7C59"]].map(([label, val, color]) => (
                  <div key={label as string} style={{ textAlign: "right" }}>
                    <div className="bk-display" style={{ fontSize: 40, fontWeight: 900, color: color as string, lineHeight: 1 }}>{val}</div>
                    <div className="bk-mono" style={{ fontSize: 9, color: "rgba(245,240,232,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Search */}
            <div style={{ position: "relative", maxWidth: 560 }}>
              <Search style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "rgba(245,240,232,0.3)" }} />
              <input type="text" placeholder="Search destinations, food spots, locations…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={{ width: "100%", paddingLeft: 52, paddingRight: 20, paddingTop: 16, paddingBottom: 16, background: "rgba(245,240,232,0.06)", border: "1px solid rgba(245,240,232,0.1)", borderRadius: 2, color: "#F5F0E8", fontSize: 15, outline: "none" }} />
            </div>
          </div>
        </div>

        {/* Filter strip */}
        <div style={{ position: "sticky", top: 72, zIndex: 20, background: "rgba(245,240,232,0.96)", backdropFilter: "blur(10px)", borderBottom: "1px solid #DDD6C8", padding: "12px 2rem" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
            {categories.map(cat => {
              const Icon = cat.icon;
              const color = CAT_COLORS[cat.id];
              return (
                <button key={cat.id} onClick={() => setActiveTab(cat.id)} className="tab-btn"
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 14px", borderRadius: 2, fontSize: 13, fontWeight: 600, cursor: "pointer",
                    background: activeTab === cat.id ? "#1A1208" : "transparent",
                    color: activeTab === cat.id ? "#F5F0E8" : "#7A6E61",
                    border: activeTab === cat.id ? "1px solid #1A1208" : "1px solid #DDD6C8",
                  }}>
                  <Icon style={{ width: 14, height: 14, color: activeTab === cat.id ? "#F5F0E8" : color }} />
                  {cat.label}
                </button>
              );
            })}
            <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
                style={{ padding: "8px 12px", background: "#fff", border: "1px solid #DDD6C8", borderRadius: 2, fontSize: 13, color: "#1A1208", outline: "none" }}>
                <option value="rating">Top Rated</option>
                <option value="entranceFee">Cheapest First</option>
                <option value="name">A–Z</option>
              </select>
              <select value={maxEntranceFee === null ? "any" : String(maxEntranceFee)}
                onChange={e => setMaxEntranceFee(e.target.value === "any" ? null : Number(e.target.value))}
                style={{ padding: "8px 12px", background: "#fff", border: "1px solid #DDD6C8", borderRadius: 2, fontSize: 13, color: "#1A1208", outline: "none" }}>
                <option value="any">Any Fee</option>
                <option value="100">≤ ₱100</option>
                <option value="200">≤ ₱200</option>
                <option value="500">≤ ₱500</option>
              </select>
              {(searchQuery || activeTab !== "all" || maxEntranceFee !== null) && (
                <button onClick={() => { setSearchQuery(""); setActiveTab("all"); setMaxEntranceFee(null); setSortBy("rating"); }}
                  style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "#C4622D", background: "transparent", border: "none", cursor: "pointer" }}>
                  <X style={{ width: 14, height: 14 }} /> Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 2rem 80px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ width: 36, height: 36, border: "2px solid #1A1208", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredItems.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "80px 0" }}>
                  <div className="bk-display" style={{ fontSize: 48, color: "#DDD6C8", marginBottom: 8 }}>No spots found</div>
                  <p style={{ color: "#7A6E61", fontSize: 14 }}>Try adjusting your filters</p>
                </motion.div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 2 }}>
                  {filteredItems.map((item, i) => {
                    const catColor = CAT_COLORS[item.category] || "#7A6E61";
                    return (
                      <motion.div key={item.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}
                        className="ex-card" style={{ background: "#fff", border: "1px solid #DDD6C8", overflow: "hidden", cursor: "pointer" }}
                        onClick={() => {
                          if ('isFood' in item && item.isFood) setSelectedFood(item.originalFood);
                          else setSelectedDest(item as Destination);
                        }}>
                        <div style={{ position: "relative", height: 260, overflow: "hidden" }}>
                          <img src={item.images[0]} className="ex-img" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={item.name} />
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,18,8,0.6) 0%, transparent 55%)" }} />
                          <div style={{ position: "absolute", top: 14, left: 14, background: catColor + "20", color: catColor, border: `1px solid ${catColor}40`, padding: "4px 10px", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", backdropFilter: "blur(6px)" }} className="bk-mono">
                            {item.category}
                          </div>
                          <div className="bk-mono" style={{ position: "absolute", top: 14, right: 14, background: "rgba(245,240,232,0.95)", color: "#1A1208", padding: "4px 10px", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                            <Star style={{ width: 10, height: 10, fill: "#D4A853", color: "#D4A853" }} /> {item.rating}
                          </div>
                        </div>
                        <div style={{ padding: "20px 22px" }}>
                          <h3 className="bk-display" style={{ fontSize: 20, fontWeight: 700, color: "#1A1208", marginBottom: 4, lineHeight: 1.1 }}>{item.name}</h3>
                          <p style={{ fontSize: 12, color: "#7A6E61", marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
                            <MapPin style={{ width: 12, height: 12, color: catColor }} /> {item.location.address}
                          </p>
                          <p style={{ fontSize: 13, color: "#7A6E61", fontWeight: 300, lineHeight: 1.5, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {item.description}
                          </p>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid #DDD6C8" }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: catColor, background: catColor + "12", padding: "4px 10px" }}>
                              {'isFood' in item ? (item as any).priceRange : `₱${item.entranceFee}`}
                            </span>
                            <a href={`https://www.google.com/maps/dir/?api=1&destination=${item.location.lat},${item.location.lng}`}
                              target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                              style={{ width: 34, height: 34, border: "1px solid #DDD6C8", display: "flex", alignItems: "center", justifyContent: "center", color: "#7A6E61", textDecoration: "none" }}>
                              <Navigation style={{ width: 15, height: 15 }} />
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
              style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(26,18,8,0.7)", backdropFilter: "blur(10px)" }}
              onClick={() => setSelectedFood(null)}>
              <motion.div initial={{ y: 32, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 32, opacity: 0 }}
                className="modal-scroll" onClick={e => e.stopPropagation()}
                style={{ background: "#FAF7F2", width: "100%", maxWidth: 500, maxHeight: "90vh", display: "flex", flexDirection: "column", border: "1px solid #DDD6C8", overflow: "hidden", position: "relative" }}>
                <ModalClose fn={() => setSelectedFood(null)} />
                <div style={{ height: 200, flexShrink: 0, position: "relative" }}>
                  <img src={selectedFood.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #FAF7F2, transparent 55%)" }} />
                </div>
                <div style={{ padding: "0 28px 8px", position: "relative", zIndex: 5 }}>
                  <h2 className="bk-display" style={{ fontSize: 28, fontWeight: 900, color: "#1A1208", marginBottom: 4 }}>{selectedFood.name}</h2>
                  <p style={{ fontSize: 13, color: "#7A6E61", display: "flex", alignItems: "center", gap: 4 }}>
                    <MapPin style={{ width: 13, height: 13, color: "#C4622D" }} /> {selectedFood.location.address}
                  </p>
                </div>
                <div className="modal-scroll" style={{ flex: 1, overflowY: "auto", padding: "20px 28px 28px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 16, marginBottom: 16, borderBottom: "1px solid #DDD6C8" }}>
                    <div>
                      <div className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>Pricing</div>
                      <span style={{ background: "#C4622D", color: "#fff", padding: "4px 14px", fontSize: 12, fontWeight: 700 }}>{selectedFood.priceRange}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>Rating</div>
                      <div className="bk-display" style={{ fontSize: 28, fontWeight: 900, color: "#1A1208" }}>★ {selectedFood.rating}</div>
                    </div>
                  </div>
                  <div className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Menu</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                    {selectedFood.menu?.map((item: any, idx: number) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#fff", border: "1px solid #DDD6C8" }}>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: 14, color: "#1A1208" }}>{item.name}</p>
                          {item.category && <p className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 2 }}>{item.category}</p>}
                        </div>
                        <span className="bk-display" style={{ fontSize: 18, fontWeight: 700, color: "#C4622D" }}>{item.price}</span>
                      </div>
                    ))}
                  </div>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedFood.location.lat},${selectedFood.location.lng}`}
                    target="_blank" rel="noreferrer"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "14px", background: "#1A1208", color: "#F5F0E8", textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
                    <Navigation style={{ width: 16, height: 16 }} /> Get Directions
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}

          {selectedDest && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(26,18,8,0.7)", backdropFilter: "blur(10px)" }}
              onClick={() => setSelectedDest(null)}>
              <motion.div initial={{ y: 32, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 32, opacity: 0 }}
                className="modal-scroll" onClick={e => e.stopPropagation()}
                style={{ background: "#FAF7F2", width: "100%", maxWidth: 520, maxHeight: "90vh", display: "flex", flexDirection: "column", border: "1px solid #DDD6C8", overflow: "hidden", position: "relative" }}>
                <ModalClose fn={() => setSelectedDest(null)} />
                <div style={{ height: 240, flexShrink: 0, position: "relative" }}>
                  <img src={selectedDest.images[0]} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #FAF7F2, transparent 50%)" }} />
                </div>
                <div style={{ padding: "0 28px 8px", position: "relative", zIndex: 5 }}>
                  <h2 className="bk-display" style={{ fontSize: 32, fontWeight: 900, color: "#1A1208", lineHeight: 1.1, marginBottom: 4 }}>{selectedDest.name}</h2>
                  <p style={{ fontSize: 13, color: "#7A6E61", display: "flex", alignItems: "center", gap: 4 }}>
                    <MapPin style={{ width: 13, height: 13, color: "#4A7C59" }} /> {selectedDest.location.address}
                  </p>
                </div>
                <div className="modal-scroll" style={{ flex: 1, overflowY: "auto", padding: "20px 28px 28px" }}>
                  {booked ? (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <CheckCircle2 style={{ width: 52, height: 52, color: "#4A7C59", margin: "0 auto 16px" }} />
                      <h3 className="bk-display" style={{ fontSize: 26, fontWeight: 700, color: "#1A1208", marginBottom: 6 }}>Request Sent!</h3>
                      <p style={{ color: "#7A6E61", fontSize: 14 }}>We've received your inquiry for {selectedDest.name}.</p>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 16, marginBottom: 16, borderBottom: "1px solid #DDD6C8" }}>
                        <div>
                          <div className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>Entrance Fee</div>
                          <span style={{ background: "#4A7C59", color: "#fff", padding: "4px 14px", fontSize: 12, fontWeight: 700 }}>₱{selectedDest.entranceFee}</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>Rating</div>
                          <div className="bk-display" style={{ fontSize: 28, fontWeight: 900, color: "#1A1208" }}>★ {selectedDest.rating}</div>
                        </div>
                      </div>
                      <p style={{ fontSize: 14, color: "#7A6E61", lineHeight: 1.7, fontWeight: 300, marginBottom: 20 }}>{selectedDest.description}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <button onClick={handleBookDest} disabled={isBooking}
                          style={{ width: "100%", padding: "14px", background: "#4A7C59", color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          {isBooking ? <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                            : <><Calendar style={{ width: 15, height: 15 }} /> Schedule a Visit</>}
                        </button>
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedDest.location.lat},${selectedDest.location.lng}`}
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