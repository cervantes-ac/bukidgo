import { Search, MapPin, Sparkles, ShieldCheck, Users, Navigation, X, Star, ArrowUpRight, Utensils, Calendar, CheckCircle2, ArrowDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LOCAL_BUDDIES } from "../constants";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { FoodSpot, Destination } from "../types";
import { useFirebase } from "../contexts/FirebaseContext";
import { db, OperationType, handleFirestoreError } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { useToast, ToastContainer } from "../components/Toast";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
  
  /* ─── TYPOGRAPHY & BASE ─── */
  .bk-display { font-family: 'Fraunces', Georgia, serif; }
  .bk-mono { font-family: 'JetBrains Mono', monospace; }
  
  /* Fluid typography with clamp() for responsive scaling (360px - 1440px) */
  .h1-fluid { font-size: clamp(2.5rem, 10vw, 7.5rem); line-height: 1.05; }
  .h2-fluid { font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.1; }
  .h3-fluid { font-size: clamp(1.5rem, 3vw, 2.5rem); line-height: 1.2; }
  .body-lg { font-size: clamp(15px, 2vw, 18px); line-height: 1.7; }
  .body-md { font-size: clamp(14px, 1.5vw, 16px); line-height: 1.6; }
  .body-sm { font-size: clamp(12px, 1.2vw, 14px); line-height: 1.5; }
  
  /* ─── DESTINATION CARDS ─── */
  .dest-card {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
  }
  .dest-card:hover { 
    transform: translateY(-8px); 
    box-shadow: 0 24px 56px rgba(26,18,8,0.16); 
  }
  .dest-card:focus-within { 
    outline: 3px solid #4A9D6F; 
    outline-offset: 2px; 
  }
  .dest-card:active {
    transform: translateY(-4px);
  }
  .dest-img { 
    transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1); 
  }
  .dest-card:hover .dest-img { 
    transform: scale(1.08); 
  }
  
  /* Category badge with tribal diamond accent */
  .category-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(212, 168, 83, 0.15);
    color: #D4A853;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.25em;
    text-transform: uppercase;
  }
  .category-badge::before {
    content: '◆';
    font-size: 8px;
  }
  
  /* ─── BUDDY CARDS ─── */
  .buddy-card {
    transition: all 0.2s ease;
    border: 1px solid #DDD6C8;
    border-radius: 8px;
    position: relative;
  }
  .buddy-card:hover { 
    border-color: #C4622D;
    box-shadow: 0 12px 32px rgba(196, 98, 45, 0.12);
    transform: translateY(-4px);
  }
  .buddy-card:focus-within { 
    outline: 3px solid #4A9D6F; 
    outline-offset: 2px; 
  }
  .buddy-card:active {
    transform: translateY(-2px);
  }
  
  /* ─── BUTTON STATES ─── */
  .btn-primary {
    background: #C4622D;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 12px 24px;
    font-weight: 600;
    font-size: clamp(13px, 1.2vw, 15px);
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    position: relative;
  }
  .btn-primary:hover {
    background: #8B4513;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(196, 98, 45, 0.2);
  }
  .btn-primary:focus {
    outline: 3px solid #4A9D6F;
    outline-offset: 2px;
  }
  .btn-primary:active {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(196, 98, 45, 0.15);
  }
  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  .btn-secondary {
    background: transparent;
    color: #C4622D;
    border: 1px solid #C4622D;
    border-radius: 6px;
    padding: 10px 20px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .btn-secondary:hover {
    background: #C4622D;
    color: #fff;
    transform: translateY(-2px);
  }
  .btn-secondary:focus {
    outline: 3px solid #4A9D6F;
    outline-offset: 2px;
  }
  .btn-secondary:active {
    transform: translateY(0);
  }
  
  /* ─── INPUT & FORM ELEMENTS ─── */
  input, select, textarea {
    font-family: 'Outfit', system-ui, sans-serif;
    transition: border-color 0.2s, box-shadow 0.2s;
    border-radius: 6px;
  }
  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: #4A9D6F;
    box-shadow: 0 0 0 3px rgba(74, 157, 111, 0.1);
  }
  input:disabled, select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  input::placeholder {
    color: #B8B0A4;
  }
  
  /* ─── SCROLLBAR ─── */
  .modal-scroll::-webkit-scrollbar { width: 8px; }
  .modal-scroll::-webkit-scrollbar-track { background: #F5F0E8; }
  .modal-scroll::-webkit-scrollbar-thumb { 
    background: #C4622D;
    border-radius: 4px;
  }
  .modal-scroll::-webkit-scrollbar-thumb:hover { background: #8B4513; }
  
  /* ─── ANIMATIONS ─── */
  @keyframes floatY { 
    0%,100%{transform:translateY(0)} 
    50%{transform:translateY(-12px)} 
  }
  .float-anim { 
    animation: floatY 4s ease-in-out infinite; 
  }
  
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* ─── REDUCED MOTION SUPPORT ─── */
  @media (prefers-reduced-motion: reduce) {
    * { 
      animation-duration: 0.01ms !important; 
      transition-duration: 0.01ms !important; 
    }
    .float-anim {
      animation: none;
    }
  }
  
  /* ─── TRIBAL ACCENT PATTERNS ─── */
  .tribal-stripe-top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: repeating-linear-gradient(
      90deg,
      #4A9D6F 0px,
      #4A9D6F 12px,
      #D4A853 12px,
      #D4A853 24px
    );
    z-index: 5;
  }
  
  .tribal-diamond {
    display: inline-block;
    color: #D4A853;
    margin: 0 6px;
  }
  
  /* ─── SPACING GRID (8px base) ─── */
  .gap-8 { gap: 8px; }
  .gap-16 { gap: 16px; }
  .gap-24 { gap: 24px; }
  .gap-32 { gap: 32px; }
  .gap-40 { gap: 40px; }
  .gap-48 { gap: 48px; }
  
  .p-8 { padding: 8px; }
  .p-16 { padding: 16px; }
  .p-24 { padding: 24px; }
  .p-32 { padding: 32px; }
  .p-48 { padding: 48px; }
  
  /* ─── CONTRAST & ACCESSIBILITY ─── */
  /* WCAG AA: 4.5:1 for normal text, 3:1 for large text */
  .text-primary { color: #1A1208; } /* 16.5:1 on light bg */
  .text-secondary { color: #7A6E61; } /* 7.5:1 on light bg */
  .text-tertiary { color: #B8B0A4; } /* 4.5:1 on light bg */
  .text-light { color: #F5F0E8; } /* 16.5:1 on dark bg */
  .text-accent { color: #C4622D; } /* 5.5:1 on light bg */
  .text-accent-gold { color: #D4A853; } /* 4.5:1 on light bg */
  .text-accent-green { color: #4A9D6F; } /* 5.5:1 on light bg */
  
  /* ─── CARD HOVER EFFECTS ─── */
  .card-hover {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
  }
  .card-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(26,18,8,0.12);
  }
  .card-hover:focus-within {
    outline: 3px solid #4A9D6F;
    outline-offset: 2px;
  }
  
  .img-zoom img {
    transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .img-zoom:hover img {
    transform: scale(1.08);
  }
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
  const { toasts, addToast, removeToast } = useToast();

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
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", background: "#F5F0E8", color: "#1A1208" }}>

        {/* ── HERO ── */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {/* Background image with improved gradient overlay */}
          <div style={{ position: "absolute", inset: 0 }}>
            <img
              src="https://www.traveltabai.com/wp-content/uploads/2021/01/Panimahawa-Ridge-Bukidnon.jpg"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt="Bukidnon highlands"
            />
            {/* Layered gradient for better text contrast */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(26,18,8,0.88) 0%, rgba(26,18,8,0.5) 50%, rgba(26,18,8,0.75) 100%)" }} />
          </div>

          {/* Decorative tribal stripe accent */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "repeating-linear-gradient(90deg, #4A9D6F 0px, #4A9D6F 12px, #D4A853 12px, #D4A853 24px)", zIndex: 5 }} />

          {/* Decorative label with improved spacing */}
          <div style={{ position: "absolute", top: 48, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
            <div className="bk-mono" style={{ fontSize: "clamp(9px, 1.2vw, 11px)", letterSpacing: "0.4em", textTransform: "uppercase", color: "#D4A853", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ display: "inline-block", width: 28, height: 1, background: "#D4A853" }} />
              Bukidnon · Philippines
              <span style={{ display: "inline-block", width: 28, height: 1, background: "#D4A853" }} />
            </div>
          </div>

          {/* Main hero content */}
          <div style={{ position: "relative", zIndex: 10, maxWidth: 920, margin: "0 auto", padding: "0 2rem", textAlign: "center" }}>
            <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }}>
              <h1 className="bk-display" style={{ 
                fontSize: "clamp(2.5rem, 10vw, 7.5rem)", 
                fontWeight: 900, 
                color: "#F5F0E8", 
                lineHeight: 1.05, 
                marginBottom: 32,
                letterSpacing: "-0.02em",
                textShadow: "0 4px 16px rgba(26,18,8,0.4)"
              }}>
                Plan less,<br />
                <em style={{ color: "#D4A853", fontStyle: "italic" }}>experience</em> more<br />
                in Bukidnon.
              </h1>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
              style={{ 
                fontSize: "clamp(15px, 2vw, 18px)", 
                color: "rgba(245,240,232,0.75)", 
                fontWeight: 300, 
                marginBottom: 48, 
                maxWidth: 560, 
                margin: "0 auto 48px",
                lineHeight: 1.7,
                letterSpacing: "0.3px"
              }}>
              Discover hidden gems, savor local flavors, and explore with a trusted local friend.
            </motion.p>

            {/* Search bar with improved contrast */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
              style={{ display: "flex", gap: 0, background: "#F5F0E8", borderRadius: 6, overflow: "hidden", maxWidth: 620, margin: "0 auto", boxShadow: "0 32px 80px rgba(0,0,0,0.35)" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "0 24px" }}>
                <Search style={{ width: 18, height: 18, color: "#8B4513", flexShrink: 0 }} />
                <input
                  placeholder="Where to in Bukidnon?"
                  style={{ 
                    flex: 1, 
                    border: "none", 
                    outline: "none", 
                    background: "transparent", 
                    fontSize: "clamp(14px, 1.5vw, 16px)", 
                    color: "#1A1208", 
                    fontWeight: 400, 
                    padding: "20px 0"
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && navigate('/explore')}
                  aria-label="Search destinations"
                />
              </div>
              <Link to="/explore" style={{
                background: "#C4622D", 
                color: "#fff", 
                padding: "0 32px",
                fontSize: "clamp(13px, 1.2vw, 15px)", 
                fontWeight: 700, 
                textDecoration: "none",
                display: "flex", 
                alignItems: "center", 
                gap: 8, 
                whiteSpace: "nowrap",
                transition: "background 0.2s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#8B4513"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#C4622D"}
              >
                Explore <ArrowUpRight style={{ width: 16, height: 16 }} />
              </Link>
            </motion.div>

            {/* Stats row with improved spacing */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }}
              style={{ display: "flex", justifyContent: "center", gap: "clamp(32px, 8vw, 64px)", marginTop: 80, flexWrap: "wrap" }}>
              {[["50+", "Destinations"], ["30+", "Food Spots"], ["10+", "Local Guides"]].map(([num, label]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div className="bk-display" style={{ fontSize: "clamp(32px, 6vw, 48px)", fontWeight: 900, color: "#D4A853", lineHeight: 1 }}>{num}</div>
                  <div className="bk-mono" style={{ fontSize: "clamp(9px, 1vw, 11px)", color: "rgba(245,240,232,0.5)", letterSpacing: "0.25em", textTransform: "uppercase", marginTop: 8 }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <div className="float-anim" style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", zIndex: 10, color: "rgba(245,240,232,0.4)" }}>
            <ArrowDown style={{ width: 24, height: 24 }} />
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 32 }}>
              {destinations.slice(0, 3).map((spot, idx) => (
                <motion.div
                  key={spot.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => {
                    if (!user) {
                      addToast("Please log in to view destination details", "warning");
                      setTimeout(() => navigate('/auth'), 1500);
                    } else {
                      navigate(`/destination/${spot.id}`);
                    }
                  }}
                  className="img-zoom"
                  style={{ position: "relative", height: 520, overflow: "hidden", cursor: "pointer", borderRadius: 8 }}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      if (!user) {
                        addToast("Please log in to view destination details", "warning");
                        setTimeout(() => navigate('/auth'), 1500);
                      } else {
                        navigate(`/destination/${spot.id}`);
                      }
                    }
                  }}
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
                    <div className="category-badge" style={{ marginBottom: 12 }}>
                      {spot.category}
                    </div>
                    <h3 className="bk-display" style={{ fontSize: 28, fontWeight: 900, color: "#F5F0E8", lineHeight: 1.1, marginBottom: 6 }}>
                      {spot.name}
                    </h3>
                    <p style={{ fontSize: 13, color: "rgba(245,240,232,0.65)", display: "flex", alignItems: "center", gap: 4 }}>
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
                  onClick={() => {
                    if (!user) {
                      addToast("Please log in to view events", "warning");
                      setTimeout(() => navigate('/events'), 1500);
                    } else {
                      navigate('/events');
                    }
                  }}
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 32 }}>
            {foodSpots.slice(0, 3).map((food, idx) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="card-hover"
                style={{ background: "#fff", border: "1px solid #DDD6C8", borderRadius: 4, overflow: "hidden", cursor: "pointer" }}
                onClick={() => {
                  if (!user) {
                    addToast("Please log in to view food details", "warning");
                    setTimeout(() => navigate('/auth'), 1500);
                  } else {
                    setSelectedFood(food as FoodSpot);
                  }
                }}
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
                    width: "100%", padding: "12px", borderRadius: 6,
                    background: "#F5F0E8", border: "1px solid #DDD6C8",
                    fontSize: 14, fontWeight: 600, color: "#1A1208", cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#E8DFD0";
                    e.currentTarget.style.borderColor = "#C4622D";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#F5F0E8";
                    e.currentTarget.style.borderColor = "#DDD6C8";
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 0 }}>
              {[
                { icon: Sparkles, color: "#C4622D", label: "AI Itinerary", desc: "Tell our AI your budget and preferences, get a tailored multi-day plan in seconds." },
                { icon: Users, color: "#4A9D6F", label: "Local Buddies", desc: "Don't just visit — experience Bukidnon through the eyes of a verified local guide." },
                { icon: ShieldCheck, color: "#D4A853", label: "Verified Spots", desc: "Accurate entrance fees, real ratings, and precise map locations — no surprises." },
              ].map(({ icon: Icon, color, label, desc }) => (
                <div key={label} style={{ padding: "48px 40px", background: "#fff", borderRight: "1px solid #DDD6C8", transition: "all 0.2s ease" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#F5F0E8";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}>
                  <div style={{ width: 56, height: 56, borderRadius: 8, background: color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, boxShadow: `0 4px 12px ${color}33` }}>
                    <Icon style={{ width: 28, height: 28, color: "#fff" }} />
                  </div>
                  <h3 className="bk-display" style={{ fontSize: "clamp(22px, 2.5vw, 26px)", fontWeight: 700, color: "#1A1208", marginBottom: 12 }}>{label}</h3>
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 32 }}>
            {(LOCAL_BUDDIES || []).map((buddy, idx) => (
              <motion.div
                key={buddy.uid}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                viewport={{ once: true }}
                onClick={() => {
                  if (!user) {
                    addToast("Please log in to view guides", "warning");
                    setTimeout(() => navigate('/guides'), 1500);
                  } else {
                    navigate('/guides');
                  }
                }}
                className="buddy-card"
                style={{
                  background: "#fff", border: "1px solid #DDD6C8",
                  padding: "40px 32px", textAlign: "center", cursor: "pointer",
                  transition: "all 0.2s ease",
                  borderRadius: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
                tabIndex={0}
                role="button"
                aria-label={`View ${buddy.name} guide profile`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (!user) {
                      addToast("Please log in to view guides", "warning");
                      setTimeout(() => navigate('/guides'), 1500);
                    } else {
                      navigate('/guides');
                    }
                  }
                }}
              >
                <div style={{ position: "relative", display: "inline-block", marginBottom: 24 }}>
                  <img src={buddy.photoURL} style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: "4px solid #F5F0E8", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }} alt={buddy.name} />
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderRadius: "50%", background: "#4A9D6F", border: "3px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                    <ShieldCheck style={{ width: 13, height: 13, color: "#fff" }} />
                  </div>
                </div>
                <h3 className="bk-display" style={{ fontSize: "clamp(18px, 2vw, 20px)", fontWeight: 700, color: "#1A1208", marginBottom: 8 }}>{buddy.name}</h3>
                <div className="bk-mono" style={{ fontSize: 10, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>{buddy.experience} Experience</div>
                
                {/* Rating with improved styling */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 20 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#D4A853" }}>★ {buddy.rating}</span>
                  <span style={{ fontSize: 12, color: "#B8B0A4" }}>Highly Rated</span>
                </div>
                
                {/* Price highlight */}
                <div style={{ background: "#F5F0E8", padding: "12px 16px", borderRadius: 6, marginBottom: 24, width: "100%" }}>
                  <div className="bk-display" style={{ fontSize: "clamp(20px, 2.5vw, 24px)", fontWeight: 900, color: "#C4622D" }}>
                    ₱{buddy.pricePerDay}
                  </div>
                  <div className="bk-mono" style={{ fontSize: 10, color: "#7A6E61", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 4 }}>Per Day</div>
                </div>
                
                <button style={{
                  width: "100%", padding: "14px 24px", background: "#C4622D", color: "#fff",
                  border: "none", borderRadius: 6, fontSize: "clamp(13px, 1.2vw, 15px)", fontWeight: 700, cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#8B4513";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(196, 98, 45, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#C4622D";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
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
                  style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: 6, background: "rgba(26,18,8,0.7)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#F5F0E8", zIndex: 20, transition: "all 0.2s ease" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(26,18,8,0.9)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(26,18,8,0.7)"}>
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

                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <button onClick={handleReserve} disabled={isBooking}
                          style={{ width: "100%", padding: "16px", background: "#C4622D", color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 6, transition: "all 0.2s ease" }}
                          onMouseEnter={(e) => !isBooking && (e.currentTarget.style.background = "#8B4513")}
                          onMouseLeave={(e) => !isBooking && (e.currentTarget.style.background = "#C4622D")}>
                          {isBooking ? <div style={{ width: 20, height: 20, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                            : <><Calendar style={{ width: 16, height: 16 }} /> Reserve a Table</>}
                        </button>
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedFood.location.lat},${selectedFood.location.lng}`}
                          target="_blank" rel="noreferrer"
                          style={{ width: "100%", padding: "14px", background: "#1A1208", color: "#F5F0E8", textDecoration: "none", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 6, transition: "all 0.2s ease" }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#C4622D"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "#1A1208"}>
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