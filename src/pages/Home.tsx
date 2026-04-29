import { Search, MapPin, Sparkles, TrendingUp, ShieldCheck, Users, Navigation, X, Star, ArrowUpRight, Utensils, Calendar, CheckCircle2, Mountain, ArrowDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LOCAL_BUDDIES } from "../constants";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { FoodSpot, Destination } from "../types";
import { useFirebase } from "../contexts/FirebaseContext";
import { db, OperationType, handleFirestoreError } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
  .bk-display { font-family: 'Fraunces', Georgia, serif; }
  .bk-mono { font-family: 'JetBrains Mono', monospace; }
  .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(26,18,8,0.12); }
  .img-zoom img { transition: transform 0.8s ease; }
  .img-zoom:hover img { transform: scale(1.06); }
  .buddy-card:hover { border-color: #C4622D !important; }
  input { font-family: 'Outfit', system-ui, sans-serif; }
  .modal-scroll::-webkit-scrollbar { width: 4px; }
  .modal-scroll::-webkit-scrollbar-thumb { background: #DDD6C8; border-radius: 99px; }
  @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  .float-anim { animation: floatY 4s ease-in-out infinite; }
`;

export default function Home() {
  const [selectedFood, setSelectedFood] = useState<FoodSpot | null>(null);
  const { user } = useFirebase();
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [foodSpots, setFoodSpots] = useState<FoodSpot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubDest = onSnapshot(collection(db, "destinations"), (snapshot) => {
      if (!snapshot.empty) setDestinations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Destination)));
      setLoading(false);
    });
    const unsubFood = onSnapshot(collection(db, "foodSpots"), (snapshot) => {
      if (!snapshot.empty) setFoodSpots(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FoodSpot)));
    });
    return () => { unsubDest(); unsubFood(); };
  }, []);

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

  return (
    <>
      <style>{S}</style>
      <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", background: "#F5F0E8", color: "#1A1208" }}>

        {/* ── HERO ── */}
        <section style={{ position: "relative", minHeight: "92vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <img
              src="https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&q=80&w=2000"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt="Bukidnon"
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(26,18,8,0.82) 0%, rgba(26,18,8,0.4) 60%, rgba(26,18,8,0.7) 100%)" }} />
          </div>

          {/* Decorative label */}
          <div style={{ position: "absolute", top: 32, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
            <div className="bk-mono" style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "#D4A853", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "inline-block", width: 32, height: 1, background: "#D4A853" }} />
              Bukidnon · Philippines
              <span style={{ display: "inline-block", width: 32, height: 1, background: "#D4A853" }} />
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 10, maxWidth: 880, margin: "0 auto", padding: "0 2rem", textAlign: "center" }}>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h1 className="bk-display" style={{ fontSize: "clamp(3rem,8vw,7rem)", fontWeight: 900, color: "#F5F0E8", lineHeight: 1.0, marginBottom: 24, letterSpacing: "-0.01em" }}>
                Plan less,<br />
                <em style={{ color: "#D4A853" }}>experience</em> more<br />
                in Bukidnon.
              </h1>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              style={{ fontSize: 18, color: "rgba(245,240,232,0.65)", fontWeight: 300, marginBottom: 40, maxWidth: 520, margin: "0 auto 40px" }}>
              Discover hidden gems, savor local flavors, and explore with a trusted local friend.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              style={{ display: "flex", gap: 0, background: "#F5F0E8", borderRadius: 4, overflow: "hidden", maxWidth: 580, margin: "0 auto", boxShadow: "0 24px 64px rgba(0,0,0,0.3)" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "0 20px" }}>
                <Search style={{ width: 18, height: 18, color: "#7A6E61", flexShrink: 0 }} />
                <input
                  placeholder="Where to in Bukidnon?"
                  style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 15, color: "#1A1208", fontWeight: 400, padding: "18px 0" }}
                  onKeyDown={(e) => e.key === 'Enter' && navigate('/explore')}
                />
              </div>
              <Link to="/explore" style={{
                background: "#C4622D", color: "#fff", padding: "0 28px",
                fontSize: 14, fontWeight: 700, textDecoration: "none",
                display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
              }}>
                Explore <ArrowUpRight style={{ width: 16, height: 16 }} />
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 64, flexWrap: "wrap" }}>
              {[["50+", "Destinations"], ["30+", "Food Spots"], ["10+", "Local Guides"]].map(([num, label]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div className="bk-display" style={{ fontSize: 36, fontWeight: 900, color: "#D4A853", lineHeight: 1 }}>{num}</div>
                  <div className="bk-mono" style={{ fontSize: 10, color: "rgba(245,240,232,0.4)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <div className="float-anim" style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 10, color: "rgba(245,240,232,0.3)" }}>
            <ArrowDown style={{ width: 20, height: 20 }} />
          </div>
        </section>

        {/* ── FEATURED DESTINATIONS ── */}
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "96px 2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div className="bk-mono" style={{ fontSize: 10, color: "#C4622D", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 10 }}>
                — Featured
              </div>
              <h2 className="bk-display" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, color: "#1A1208", lineHeight: 1.0 }}>
                Must-Visit<br />Spots
              </h2>
            </div>
            <Link to="/explore" style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 14, fontWeight: 600, color: "#C4622D", textDecoration: "none",
              border: "1px solid #C4622D", padding: "10px 20px", borderRadius: 4,
            }}>
              View All <ArrowUpRight style={{ width: 15, height: 15 }} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ width: 40, height: 40, border: "2px solid #C4622D", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
              <p style={{ color: "#7A6E61", fontSize: 14 }}>Loading destinations…</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 2 }}>
              {destinations.slice(0, 3).map((spot, idx) => (
                <motion.div
                  key={spot.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => navigate('/explore')}
                  className="img-zoom"
                  style={{ position: "relative", height: 520, overflow: "hidden", cursor: "pointer" }}
                >
                  <img src={spot.images[0]} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={spot.name} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,18,8,0.9) 0%, rgba(26,18,8,0.1) 60%)" }} />

                  {/* Rating chip */}
                  <div className="bk-mono" style={{
                    position: "absolute", top: 20, right: 20,
                    background: "#D4A853", color: "#1A1208",
                    fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 2,
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    <Star style={{ width: 12, height: 12, fill: "#1A1208" }} /> {spot.rating}
                  </div>

                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 28px" }}>
                    <div className="bk-mono" style={{ fontSize: 9, color: "#D4A853", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 8 }}>
                      {spot.category}
                    </div>
                    <h3 className="bk-display" style={{ fontSize: 28, fontWeight: 900, color: "#F5F0E8", lineHeight: 1.1, marginBottom: 6 }}>
                      {spot.name}
                    </h3>
                    <p style={{ fontSize: 13, color: "rgba(245,240,232,0.5)", display: "flex", alignItems: "center", gap: 4 }}>
                      <MapPin style={{ width: 13, height: 13, color: "#C4622D" }} /> {spot.location.address}
                    </p>
                  </div>

                  {/* Hover arrow */}
                  <div style={{
                    position: "absolute", bottom: 32, right: 28,
                    width: 44, height: 44, borderRadius: 2,
                    background: "#C4622D", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <ArrowUpRight style={{ width: 20, height: 20, color: "#fff" }} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* ── EVENTS TEASER ── */}
        <section style={{ background: "#1A1208", padding: "96px 0", overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,168,83,0.08), transparent)" }} />

          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 56, flexWrap: "wrap", gap: 24 }}>
              <div>
                <div className="bk-mono" style={{ fontSize: 10, color: "#D4A853", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 10 }}>— Cultural Calendar</div>
                <h2 className="bk-display" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, color: "#F5F0E8", lineHeight: 1.0 }}>
                  Local<br /><em style={{ color: "#D4A853" }}>Events</em>
                </h2>
              </div>
              <Link to="/events" style={{
                background: "#C4622D", color: "#fff", padding: "14px 28px",
                fontSize: 14, fontWeight: 700, textDecoration: "none", borderRadius: 4,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                All Events <ArrowUpRight style={{ width: 16, height: 16 }} />
              </Link>
            </div>

            <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8 }} className="no-scrollbar">
              {[
                { name: 'Kaamulan Festival', date: 'March', image: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&q=80&w=1000' },
                { name: 'Valencia Charter', date: 'January', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1000' },
                { name: 'Malaybalay Day', date: 'June', image: 'https://images.unsplash.com/photo-1467307983825-619715426c70?auto=format&fit=crop&q=80&w=1000' }
              ].map((ev, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  onClick={() => navigate('/events')}
                  className="img-zoom"
                  style={{ flexShrink: 0, width: 360, height: 480, position: "relative", overflow: "hidden", borderRadius: 2, cursor: "pointer", border: "1px solid rgba(245,240,232,0.06)" }}
                >
                  <img src={ev.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={ev.name} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,18,8,0.95) 0%, transparent 55%)" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 24px" }}>
                    <div className="bk-mono" style={{ fontSize: 9, color: "#D4A853", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8 }}>
                      {ev.date}
                    </div>
                    <h3 className="bk-display" style={{ fontSize: 24, fontWeight: 900, color: "#F5F0E8", marginBottom: 16 }}>{ev.name}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(245,240,232,0.4)", fontSize: 12 }}>
                      <ArrowUpRight style={{ width: 14, height: 14 }} /> View Details
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOCAL EATS ── */}
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "96px 2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div className="bk-mono" style={{ fontSize: 10, color: "#4A7C59", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 10 }}>— Eat Local</div>
              <h2 className="bk-display" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, color: "#1A1208", lineHeight: 1.0 }}>
                Taste the<br />Highlands
              </h2>
            </div>
            <Link to="/food" style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 14, fontWeight: 600, color: "#4A7C59", textDecoration: "none",
              border: "1px solid #4A7C59", padding: "10px 20px", borderRadius: 4,
            }}>
              View All <ArrowUpRight style={{ width: 15, height: 15 }} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {foodSpots.slice(0, 3).map((food, idx) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="card-hover"
                style={{ background: "#fff", border: "1px solid #DDD6C8", borderRadius: 4, overflow: "hidden", cursor: "pointer" }}
                onClick={() => setSelectedFood(food as FoodSpot)}
              >
                <div className="img-zoom" style={{ height: 240, overflow: "hidden", position: "relative" }}>
                  <img src={food.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={food.name} />
                  <div style={{ position: "absolute", top: 16, left: 16, background: "#1A1208", color: "#D4A853", padding: "4px 12px", fontSize: 11, fontWeight: 700, borderRadius: 2 }}>
                    {food.priceRange}
                  </div>
                  <div className="bk-mono" style={{ position: "absolute", top: 16, right: 16, background: "#fff", color: "#1A1208", padding: "4px 10px", fontSize: 11, fontWeight: 700, borderRadius: 2, display: "flex", alignItems: "center", gap: 4 }}>
                    <Star style={{ width: 10, height: 10, fill: "#D4A853", color: "#D4A853" }} /> {food.rating}
                  </div>
                </div>
                <div style={{ padding: "24px" }}>
                  <h3 className="bk-display" style={{ fontSize: 22, fontWeight: 700, color: "#1A1208", marginBottom: 6 }}>{food.name}</h3>
                  <p style={{ fontSize: 13, color: "#7A6E61", display: "flex", alignItems: "center", gap: 4, marginBottom: 20 }}>
                    <MapPin style={{ width: 13, height: 13, color: "#C4622D" }} /> {food.location.address}
                  </p>
                  <button style={{
                    width: "100%", padding: "12px", borderRadius: 2,
                    background: "#F5F0E8", border: "1px solid #DDD6C8",
                    fontSize: 14, fontWeight: 600, color: "#1A1208", cursor: "pointer",
                    transition: "all 0.15s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}>
                    <Utensils style={{ width: 15, height: 15 }} /> View Menu
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section style={{ background: "#FAF7F2", borderTop: "1px solid #DDD6C8", borderBottom: "1px solid #DDD6C8", padding: "80px 0" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 2 }}>
              {[
                { icon: Sparkles, color: "#C4622D", label: "AI Itinerary", desc: "Tell our AI your budget and preferences, get a tailored multi-day plan in seconds." },
                { icon: Users, color: "#4A7C59", label: "Local Buddies", desc: "Don't just visit — experience Bukidnon through the eyes of a verified local guide." },
                { icon: ShieldCheck, color: "#D4A853", label: "Verified Spots", desc: "Accurate entrance fees, real ratings, and precise map locations — no surprises." },
              ].map(({ icon: Icon, color, label, desc }) => (
                <div key={label} style={{ padding: "48px 40px", background: "#fff", borderRight: "1px solid #DDD6C8" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 4, background: color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                    <Icon style={{ width: 22, height: 22, color: "#fff" }} />
                  </div>
                  <h3 className="bk-display" style={{ fontSize: 26, fontWeight: 700, color: "#1A1208", marginBottom: 12 }}>{label}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "#7A6E61", fontWeight: 300 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOCAL BUDDIES ── */}
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "96px 2rem 80px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div className="bk-mono" style={{ fontSize: 10, color: "#4A7C59", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 10 }}>— Expert Guides</div>
              <h2 className="bk-display" style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, color: "#1A1208", lineHeight: 1.0 }}>
                Your Local<br />Buddies
              </h2>
            </div>
            <Link to="/guides" style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 14, fontWeight: 600, color: "#4A7C59", textDecoration: "none",
              border: "1px solid #4A7C59", padding: "10px 20px", borderRadius: 4,
            }}>
              View All <ArrowUpRight style={{ width: 15, height: 15 }} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 2 }}>
            {(LOCAL_BUDDIES || []).map((buddy, idx) => (
              <motion.div
                key={buddy.uid}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                viewport={{ once: true }}
                onClick={() => navigate('/guides')}
                className="buddy-card"
                style={{
                  background: "#fff", border: "1px solid #DDD6C8",
                  padding: "32px 24px", textAlign: "center", cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
              >
                <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
                  <img src={buddy.photoURL} style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid #F5F0E8" }} alt={buddy.name} />
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderRadius: "50%", background: "#4A7C59", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ShieldCheck style={{ width: 11, height: 11, color: "#fff" }} />
                  </div>
                </div>
                <h3 className="bk-display" style={{ fontSize: 18, fontWeight: 700, color: "#1A1208", marginBottom: 4 }}>{buddy.name}</h3>
                <div className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>{buddy.experience} Exp</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#D4A853", marginBottom: 4 }}>★ {buddy.rating}</div>
                <div className="bk-display" style={{ fontSize: 20, fontWeight: 700, color: "#1A1208", marginBottom: 20 }}>
                  ₱{buddy.pricePerDay}<span style={{ fontSize: 12, color: "#7A6E61", fontFamily: "'Outfit', sans-serif", fontWeight: 400 }}>/day</span>
                </div>
                <button style={{
                  width: "100%", padding: "10px", background: "#1A1208", color: "#F5F0E8",
                  border: "none", borderRadius: 2, fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}>
                  Book Buddy
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── FOOD MODAL ── */}
        <AnimatePresence>
          {selectedFood && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(26,18,8,0.7)", backdropFilter: "blur(8px)" }}
              onClick={() => setSelectedFood(null)}
            >
              <motion.div
                initial={{ y: 32, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 32, opacity: 0 }}
                className="modal-scroll"
                style={{ background: "#FAF7F2", width: "100%", maxWidth: 520, maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden", border: "1px solid #DDD6C8", position: "relative" }}
                onClick={e => e.stopPropagation()}
              >
                <button onClick={() => setSelectedFood(null)}
                  style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: 2, background: "rgba(26,18,8,0.7)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#F5F0E8", zIndex: 20 }}>
                  <X style={{ width: 18, height: 18 }} />
                </button>

                <div style={{ height: 220, flexShrink: 0, position: "relative", overflow: "hidden" }}>
                  <img src={selectedFood.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={selectedFood.name} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #FAF7F2 0%, transparent 55%)" }} />
                </div>

                <div style={{ padding: "0 32px 8px", position: "relative", zIndex: 5 }}>
                  <h2 className="bk-display" style={{ fontSize: 32, fontWeight: 900, color: "#1A1208", lineHeight: 1.1, marginBottom: 4 }}>{selectedFood.name}</h2>
                  <p style={{ fontSize: 13, color: "#7A6E61", display: "flex", alignItems: "center", gap: 4 }}>
                    <MapPin style={{ width: 13, height: 13, color: "#C4622D" }} /> {selectedFood.location.address}
                  </p>
                </div>

                <div className="modal-scroll" style={{ flex: 1, overflowY: "auto", padding: "24px 32px 32px" }}>
                  {booked ? (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <CheckCircle2 style={{ width: 56, height: 56, color: "#4A7C59", margin: "0 auto 16px" }} />
                      <h3 className="bk-display" style={{ fontSize: 26, fontWeight: 700, color: "#1A1208", marginBottom: 6 }}>Reservation Sent!</h3>
                      <p style={{ color: "#7A6E61", fontSize: 14 }}>We've received your request for {selectedFood.name}.</p>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 20, marginBottom: 20, borderBottom: "1px solid #DDD6C8" }}>
                        <div>
                          <div className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>Price Range</div>
                          <span style={{ background: "#C4622D", color: "#fff", padding: "4px 14px", fontSize: 12, fontWeight: 700, borderRadius: 2 }}>{selectedFood.priceRange}</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>Rating</div>
                          <div className="bk-display" style={{ fontSize: 28, fontWeight: 900, color: "#1A1208" }}>★ {selectedFood.rating}</div>
                        </div>
                      </div>

                      <div className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>Menu Highlights</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                        {selectedFood.menu?.map((item: any, idx: number) => (
                          <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: "#fff", border: "1px solid #DDD6C8" }}>
                            <div>
                              <p style={{ fontWeight: 600, fontSize: 14, color: "#1A1208" }}>{item.name}</p>
                              {item.category && <p className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 2 }}>{item.category}</p>}
                            </div>
                            <span className="bk-display" style={{ fontSize: 18, fontWeight: 700, color: "#C4622D" }}>{item.price}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <button onClick={handleReserve} disabled={isBooking}
                          style={{ width: "100%", padding: "16px", background: "#C4622D", color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 2 }}>
                          {isBooking ? <div style={{ width: 20, height: 20, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                            : <><Calendar style={{ width: 16, height: 16 }} /> Reserve a Table</>}
                        </button>
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedFood.location.lat},${selectedFood.location.lng}`}
                          target="_blank" rel="noreferrer"
                          style={{ width: "100%", padding: "14px", background: "#1A1208", color: "#F5F0E8", textDecoration: "none", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 2 }}>
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