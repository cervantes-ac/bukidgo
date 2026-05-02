import { Star, Briefcase, Award, AlertCircle, RefreshCw, Heart, Search, X, Calendar, MessageSquare, ThumbsUp, CheckCircle2 } from "lucide-react";
import { LOCAL_BUDDIES, MOCK_REVIEWS } from "../constants";
import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo, useEffect } from "react";
import { useFirebase } from "../contexts/FirebaseContext";
import { db, OperationType, handleFirestoreError } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot, query, where, deleteDoc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { SkeletonLoader } from "../components/SkeletonLoader";
import { useToast, ToastContainer } from "../components/Toast";
import { formatErrorMessage } from "../utils/errorMessages";
import { Review, Favorite } from "../types";

const THEME = {
  darkBg: "#0A3D2F",
  mainBg: "#F5F5F0",
  primaryAccent: "#1E4D2B",
  secondaryAccent: "#4A9D6F",
  text: "#2D2D2D",
  borders: "#DDD6C8",
  earthBrown: "#8B4513",
  goldenAccent: "#D4A574",
  lightText: "rgba(245, 245, 240, 0.45)",
  darkText: "#1A1208",
  lightBg: "#F5F0E8",
  brownAccent: "#C4622D",
  verifiedGreen: "#2D7A4A",
};

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
  .bk-display { font-family: 'Fraunces', Georgia, serif; }
  .bk-mono { font-family: 'JetBrains Mono', monospace; }
  
  .guide-card {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    overflow: hidden;
  }
  .guide-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #1E4D2B, #4A9D6F, #1E4D2B);
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 1;
  }
  .guide-card:hover {
    transform: translateY(-12px);
    box-shadow: 0 32px 64px rgba(26,18,8,0.2);
  }
  .guide-card:hover::before {
    transform: scaleX(1);
  }
  
  .guide-img {
    transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .guide-card:hover .guide-img {
    transform: scale(1.15);
  }
  
  input, select { font-family: 'Outfit', sans-serif; }
  select option { background: #F5F5F0; }
  input[type="range"] { accent-color: #1E4D2B; }
  input:focus, select:focus { outline: 2px solid #1E4D2B; outline-offset: 2px; }
  
  .scroll-pane::-webkit-scrollbar { width: 6px; }
  .scroll-pane::-webkit-scrollbar-track { background: #F5F0E8; }
  .scroll-pane::-webkit-scrollbar-thumb { background: #DDD6C8; border-radius: 99px; }
  .scroll-pane::-webkit-scrollbar-thumb:hover { background: #C4C0B8; }
  
  .book-btn { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
  .book-btn:hover:not(:disabled) { background: #0A3D2F !important; transform: translateY(-2px); }
  .book-btn:focus-visible { outline: 2px solid #1E4D2B; outline-offset: 2px; }
  
  @keyframes spin { to { transform: rotate(360deg); } }
`;

export default function Guides() {
  const [selectedBuddy, setSelectedBuddy] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [minExperience, setMinExperience] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [minRating, setMinRating] = useState(0);
  const [specialties, setSpecialties] = useState<string[]>([]);
  
  const { user } = useFirebase();
  const navigate = useNavigate();
  const [liveGuides, setLiveGuides] = useState<any[]>(LOCAL_BUDDIES || []);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS.filter(r => r.targetType === 'guide') as Review[] || []);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toasts, addToast, removeToast } = useToast();
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", comment: "" });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    let unsubGuides: (() => void) | null = null;
    let unsubReviews: (() => void) | null = null;
    let unsubFavorites: (() => void) | null = null;
    let timeoutId: NodeJS.Timeout;
    let guidesLoaded = false;

    try {
      // Load guides with fallback to LOCAL_BUDDIES
      unsubGuides = onSnapshot(
        collection(db, "guides"),
        (snapshot) => {
          try {
            const guides = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (guides.length > 0) {
              setLiveGuides(guides);
              guidesLoaded = true;
            } else {
              // Use fallback data if collection is empty
              setLiveGuides(LOCAL_BUDDIES || []);
              guidesLoaded = true;
            }
            setLoading(false);
            setError(null);
          } catch (err) {
            console.error('Error processing guides:', err);
            // Use fallback data on processing error
            setLiveGuides(LOCAL_BUDDIES || []);
            setLoading(false);
            setError(null);
          }
        },
        (err) => {
          console.error('Firestore guides error:', err);
          // Use fallback data on Firestore error
          setLiveGuides(LOCAL_BUDDIES || []);
          setLoading(false);
          // Only show error if we have no fallback data
          if (!LOCAL_BUDDIES || LOCAL_BUDDIES.length === 0) {
            setError('Failed to load guides. Please refresh the page.');
          } else {
            setError(null);
          }
          guidesLoaded = true;
        }
      );

      // Load reviews (non-critical)
      unsubReviews = onSnapshot(
        collection(db, "reviews"),
        (snapshot) => {
          try {
            const reviewsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
            // Merge with mock reviews
            const mockGuideReviews = MOCK_REVIEWS.filter(r => r.targetType === 'guide') as Review[];
            const allReviews = [...mockGuideReviews, ...reviewsData];
            setReviews(allReviews);
          } catch (err) {
            console.error('Error processing reviews:', err);
            const mockGuideReviews = MOCK_REVIEWS.filter(r => r.targetType === 'guide') as Review[];
            setReviews(mockGuideReviews);
          }
        },
        (err) => {
          console.error('Firestore reviews error:', err);
          const mockGuideReviews = MOCK_REVIEWS.filter(r => r.targetType === 'guide') as Review[];
          setReviews(mockGuideReviews);
        }
      );

      // Load favorites (user-specific, non-critical)
      if (user) {
        unsubFavorites = onSnapshot(
          query(collection(db, "favorites"), where("userId", "==", user.uid)),
          (snapshot) => {
            try {
              const favoritesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Favorite));
              setFavorites(favoritesData);
            } catch (err) {
              console.error('Error processing favorites:', err);
              setFavorites([]);
            }
          },
          (err) => {
            console.error('Firestore favorites error:', err);
            setFavorites([]);
          }
        );
      }

      // Timeout to prevent indefinite loading
      timeoutId = setTimeout(() => {
        if (!guidesLoaded) {
          console.warn('Guide loading timeout - using fallback data');
          setLiveGuides(LOCAL_BUDDIES || []);
          setLoading(false);
          if (!LOCAL_BUDDIES || LOCAL_BUDDIES.length === 0) {
            setError('Loading took too long. Using cached data.');
          }
        }
      }, 8000);
    } catch (err) {
      console.error('Error initializing data loading:', err);
      setLiveGuides(LOCAL_BUDDIES || []);
      setLoading(false);
      if (!LOCAL_BUDDIES || LOCAL_BUDDIES.length === 0) {
        setError('Failed to initialize data loading');
      }
    }

    return () => {
      if (unsubGuides) unsubGuides();
      if (unsubReviews) unsubReviews();
      if (unsubFavorites) unsubFavorites();
      clearTimeout(timeoutId);
    };
  }, [user, retryCount]);

  const allSpecialties = useMemo(() => {
    const s = new Set<string>();
    liveGuides.forEach(b => {
      if (b.specialties) b.specialties.forEach((sp: string) => s.add(sp));
    });
    return Array.from(s).sort();
  }, [liveGuides]);

  const filteredGuides = useMemo(() => {
    return liveGuides.filter(buddy => {
      const matchesSearch = buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buddy.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buddy.specialties?.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const years = parseInt(buddy.experience) || 0;
      return matchesSearch &&
        years >= minExperience &&
        (buddy.pricePerDay || 0) <= maxPrice &&
        buddy.rating >= minRating &&
        (specialties.length === 0 || buddy.specialties?.some((s: string) => specialties.includes(s)));
    });
  }, [liveGuides, searchQuery, minExperience, maxPrice, minRating, specialties]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setRetryCount(prev => prev + 1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setMinExperience(0);
    setMaxPrice(5000);
    setMinRating(0);
    setSpecialties([]);
  };

  const toggleSpecialty = (s: string) => {
    setSpecialties(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const badgeFor = (r: number) =>
    r >= 4.8 ? { label: "Elite", bg: "#7c3aed" } : r >= 4.5 ? { label: "Top Rated", bg: THEME.brownAccent } : { label: "Verified", bg: THEME.verifiedGreen };

  const isFavorited = (buddyId: string) => favorites.some(f => f.targetId === buddyId && f.targetType === "guide");

  const toggleFavorite = async (buddyId: string) => {
    if (!user) { navigate('/auth'); return; }
    const existing = favorites.find(f => f.targetId === buddyId && f.targetType === "guide");
    if (existing) {
      try {
        const q = query(collection(db, "favorites"), where("userId", "==", user.uid), where("targetId", "==", buddyId), where("targetType", "==", "guide"));
        const snapshot = await getDocs(q);
        snapshot.docs.forEach(doc => deleteDoc(doc.ref));
        addToast('Removed from favorites', 'success');
      } catch (error) {
        const errorMsg = formatErrorMessage(error);
        addToast(errorMsg, 'error');
        handleFirestoreError(error, OperationType.DELETE, "favorites");
      }
    } else {
      try {
        await addDoc(collection(db, "favorites"), {
          userId: user.uid,
          targetId: buddyId,
          targetType: "guide",
          createdAt: serverTimestamp()
        });
        addToast('Added to favorites', 'success');
      } catch (error) {
        const errorMsg = formatErrorMessage(error);
        addToast(errorMsg, 'error');
        handleFirestoreError(error, OperationType.WRITE, "favorites");
      }
    }
  };

  const hasActiveFilters = searchQuery || minExperience > 0 || maxPrice < 5000 || minRating > 0 || specialties.length > 0;

  const handleBook = async () => {
    if (!user) { navigate('/auth'); return; }
    setIsBooking(true);
    try {
      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        userName: user.displayName || "User",
        userEmail: user.email,
        buddyId: selectedBuddy.uid || selectedBuddy.id,
        buddyName: selectedBuddy.name,
        date: new Date().toISOString(),
        status: "pending",
        createdAt: serverTimestamp(),
        type: "buddy"
      });
      setBooked(true);
      addToast(`Booking request sent to ${selectedBuddy.name}!`, 'success');
      setTimeout(() => { setBooked(false); setSelectedBuddy(null); }, 3000);
    } catch (error) {
      const errorMsg = formatErrorMessage(error);
      addToast(errorMsg, 'error');
      handleFirestoreError(error, OperationType.WRITE, "bookings");
    } finally {
      setIsBooking(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user || !selectedBuddy || !reviewForm.title || !reviewForm.comment) {
      addToast('Please fill in all fields', 'error');
      return;
    }
    setIsSubmittingReview(true);
    try {
      await addDoc(collection(db, "reviews"), {
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userPhoto: user.photoURL,
        targetId: selectedBuddy.uid || selectedBuddy.id,
        targetType: "guide",
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment,
        createdAt: serverTimestamp(),
        helpful: 0
      });
      setReviewForm({ rating: 5, title: "", comment: "" });
      setShowReviewForm(false);
      addToast('Review submitted successfully!', 'success');
    } catch (error) {
      const errorMsg = formatErrorMessage(error);
      addToast(errorMsg, 'error');
      handleFirestoreError(error, OperationType.WRITE, "reviews");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getGuideReviews = (buddyId: string) => reviews.filter(r => r.targetId === (buddyId) && r.targetType === "guide");

  return (
    <>
      <style>{S}</style>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      {/* Detail View - Centered */}
      <AnimatePresence>
        {selectedBuddy && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px"
            }}
            onClick={() => setSelectedBuddy(null)}
          >
            {/* Centered Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: "#fff",
                borderRadius: 12,
                border: `1px solid ${THEME.borders}`,
                maxWidth: 700,
                width: "100%",
                maxHeight: "90vh",
                overflow: "auto",
                boxShadow: "0 32px 64px rgba(26,18,8,0.3)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {booked ? (
                <div style={{ padding: "60px 40px", textAlign: "center" }}>
                  <CheckCircle2 style={{ width: 56, height: 56, color: THEME.verifiedGreen, margin: "0 auto 20px" }} />
                  <h2 className="bk-display" style={{ fontSize: 32, fontWeight: 900, color: THEME.darkText, marginBottom: 10 }}>Booked!</h2>
                  <p style={{ color: "#7A6E61", fontSize: 14, lineHeight: 1.6 }}>
                    Your request was sent to {selectedBuddy?.name.split(' ')[0]}. They'll reply within 24 hours.
                  </p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div style={{ padding: "28px 28px 24px", borderBottom: `1px solid ${THEME.borders}`, display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
                      <div style={{ position: "relative" }}>
                        <img src={selectedBuddy.photoURL} style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8 }} alt={selectedBuddy.name} />
                        <div style={{ position: "absolute", bottom: -4, right: -4, width: 22, height: 22, background: THEME.verifiedGreen, borderRadius: "50%", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Award style={{ width: 10, height: 10, color: "#fff" }} />
                        </div>
                      </div>
                      <div>
                        <h2 className="bk-display" style={{ fontSize: 22, fontWeight: 900, color: THEME.darkText, marginBottom: 6 }}>{selectedBuddy.name}</h2>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 11, background: "rgba(196, 98, 45, 0.08)", color: THEME.brownAccent, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4 }}>
                            <Briefcase style={{ width: 11, height: 11 }} /> {selectedBuddy.experience}
                          </span>
                          <span style={{ fontSize: 11, background: "#FFFBF0", color: "#A16207", padding: "4px 10px", display: "flex", alignItems: "center", gap: 4 }}>
                            <Star style={{ width: 11, height: 11 }} /> {selectedBuddy.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(selectedBuddy.uid || selectedBuddy.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}
                    >
                      <Heart style={{ width: 24, height: 24, fill: isFavorited(selectedBuddy.uid || selectedBuddy.id) ? THEME.brownAccent : "none", color: THEME.brownAccent }} />
                    </button>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "24px 28px", maxHeight: "calc(90vh - 200px)", overflowY: "auto" }}>
                    <div className="bk-mono" style={{ fontSize: 9, color: "#B8B0A4", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>About</div>
                    <p style={{ fontSize: 13, color: "#7A6E61", lineHeight: 1.7, fontWeight: 300, marginBottom: 20 }}>{selectedBuddy.bio}</p>

                    {selectedBuddy.specialties?.length > 0 && (
                      <div style={{ marginBottom: 20 }}>
                        <div className="bk-mono" style={{ fontSize: 9, color: "#B8B0A4", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>Specialties</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {selectedBuddy.specialties.map((s: string, i: number) => (
                            <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: "4px 12px", background: THEME.lightBg, color: THEME.brownAccent, border: `1px solid rgba(196, 98, 45, 0.2)` }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pricing */}
                    <div style={{ background: THEME.lightBg, border: `1px solid ${THEME.borders}`, padding: "20px", marginBottom: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${THEME.borders}` }}>
                        <div>
                          <div className="bk-mono" style={{ fontSize: 9, color: "#B8B0A4", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>Service / day</div>
                          <div className="bk-display" style={{ fontSize: 26, fontWeight: 900, color: THEME.darkText }}>₱{selectedBuddy.pricePerDay}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div className="bk-mono" style={{ fontSize: 9, color: "#B8B0A4", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>Platform fee</div>
                          <div className="bk-display" style={{ fontSize: 26, fontWeight: 900, color: THEME.darkText }}>₱49</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: 12, color: "#B8B0A4" }}>Total estimate</span>
                        <span className="bk-display" style={{ fontSize: 32, fontWeight: 900, color: THEME.brownAccent }}>₱{selectedBuddy.pricePerDay + 49}</span>
                      </div>
                    </div>

                    {/* Reviews Section */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <div className="bk-mono" style={{ fontSize: 9, color: "#B8B0A4", letterSpacing: "0.2em", textTransform: "uppercase" }}>Reviews ({getGuideReviews(selectedBuddy.uid || selectedBuddy.id).length})</div>
                        <button onClick={() => setShowReviewForm(!showReviewForm)}
                          style={{ fontSize: 11, fontWeight: 600, color: THEME.brownAccent, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                          <MessageSquare style={{ width: 13, height: 13 }} /> Add Review
                        </button>
                      </div>

                      {showReviewForm && (
                        <div style={{ background: THEME.lightBg, border: `1px solid ${THEME.borders}`, padding: 16, marginBottom: 12, borderRadius: 2 }}>
                          <div style={{ marginBottom: 12 }}>
                            <label style={{ fontSize: 11, color: "#B8B0A4", display: "block", marginBottom: 6 }}>Rating</label>
                            <div style={{ display: "flex", gap: 4 }}>
                              {[1, 2, 3, 4, 5].map(i => (
                                <button key={i} onClick={() => setReviewForm(prev => ({ ...prev, rating: i }))}
                                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                                  <Star style={{ width: 20, height: 20, fill: i <= reviewForm.rating ? "#D4A853" : "none", color: "#D4A853" }} />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div style={{ marginBottom: 12 }}>
                            <input type="text" placeholder="Review title" value={reviewForm.title}
                              onChange={e => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                              style={{ width: "100%", padding: "8px 12px", border: `1px solid ${THEME.borders}`, borderRadius: 2, fontSize: 12, fontFamily: "'Outfit', sans-serif", marginBottom: 8 }} />
                            <textarea placeholder="Share your experience..." value={reviewForm.comment}
                              onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                              style={{ width: "100%", padding: "8px 12px", border: `1px solid ${THEME.borders}`, borderRadius: 2, fontSize: 12, fontFamily: "'Outfit', sans-serif", minHeight: 80, resize: "none" }} />
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={handleSubmitReview} disabled={isSubmittingReview || !reviewForm.title || !reviewForm.comment}
                              style={{ flex: 1, padding: "8px 12px", background: THEME.brownAccent, color: "#fff", border: "none", borderRadius: 2, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                              {isSubmittingReview ? "Submitting..." : "Submit"}
                            </button>
                            <button onClick={() => setShowReviewForm(false)}
                              style={{ flex: 1, padding: "8px 12px", background: "#DDD6C8", color: THEME.darkText, border: "none", borderRadius: 2, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {getGuideReviews(selectedBuddy.uid || selectedBuddy.id).slice(0, 3).map(review => (
                          <div key={review.id} style={{ background: THEME.lightBg, border: `1px solid ${THEME.borders}`, padding: 12, borderRadius: 2 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: THEME.darkText }}>{review.userName}</span>
                                  <div style={{ display: "flex", gap: 2 }}>
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} style={{ width: 11, height: 11, fill: i < review.rating ? "#D4A853" : "none", color: "#D4A853" }} />
                                    ))}
                                  </div>
                                </div>
                                <h4 style={{ fontSize: 11, fontWeight: 600, color: THEME.brownAccent, marginBottom: 4 }}>{review.title}</h4>
                                <p style={{ fontSize: 11, color: "#7A6E61", lineHeight: 1.5 }}>{review.comment}</p>
                              </div>
                            </div>
                            <button style={{ fontSize: 10, color: "#B8B0A4", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                              <ThumbsUp style={{ width: 11, height: 11 }} /> Helpful ({review.helpful})
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ padding: "0 28px 28px", borderTop: `1px solid ${THEME.borders}` }}>
                    <button onClick={handleBook} disabled={isBooking} className="book-btn"
                      style={{ width: "100%", padding: "16px", background: THEME.brownAccent, color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 2 }}>
                      {isBooking
                        ? <div style={{ width: 18, height: 18, border: "2px solid rgba(255, 255, 255, 0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                        : <><Calendar style={{ width: 15, height: 15 }} /> Book {selectedBuddy.name.split(' ')[0]}</>
                      }
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ fontFamily: "'Outfit', sans-serif", background: THEME.mainBg, color: THEME.text, minHeight: "100vh" }}>

        {/* Hero */}
        <div style={{ background: THEME.darkBg, padding: "72px 2rem 56px", borderBottom: `1px solid rgba(197, 221, 212, 0.06)` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div className="bk-mono" style={{ fontSize: 10, color: THEME.goldenAccent, letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "inline-block", width: 24, height: 1, background: THEME.goldenAccent }} />
              Mountain Guides · Bukidnon
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 32 }}>
              <div>
                <h1 className="bk-display" style={{ fontSize: "clamp(3rem,7vw,6.5rem)", fontWeight: 900, color: THEME.mainBg, lineHeight: 0.9, marginBottom: 16 }}>
                  Your Local<br /><em style={{ color: THEME.secondaryAccent }}>Buddies</em>
                </h1>
                <p style={{ fontSize: 16, color: THEME.lightText, maxWidth: 440, lineHeight: 1.7, fontWeight: 300 }}>
                  Verified guides who know every hidden gem, secret trail, and authentic experience.
                </p>
              </div>
              <div style={{ display: "flex", gap: 40, paddingBottom: 8 }}>
                {[["Total", liveGuides.length, THEME.mainBg], ["Available", filteredGuides.length, THEME.secondaryAccent]].map(([label, val, color]) => (
                  <div key={label as string} style={{ textAlign: "right" }}>
                    <div className="bk-display" style={{ fontSize: 52, fontWeight: 900, color: color as string, lineHeight: 1 }}>{val}</div>
                    <div className="bk-mono" style={{ fontSize: 9, color: "rgba(245, 249, 247, 0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div style={{ position: "sticky", top: 72, zIndex: 20, background: "rgba(245, 249, 247, 0.96)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${THEME.borders}`, padding: "14px 2rem" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, minWidth: 180, maxWidth: 320, position: "relative" }}>
              <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: THEME.earthBrown }} />
              <input type="text" placeholder="Search by name or specialty..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 10, paddingBottom: 10, background: "#fff", border: `1px solid ${THEME.borders}`, borderRadius: 2, fontSize: 13, color: THEME.text, outline: "none" }} />
            </div>
            <select value={minExperience} onChange={e => setMinExperience(Number(e.target.value))}
              style={{ padding: "9px 12px", background: "#fff", border: `1px solid ${THEME.borders}`, borderRadius: 2, fontSize: 12, color: THEME.text, outline: "none" }}>
              <option value={0}>Any Experience</option>
              <option value={1}>1+ Year</option>
              <option value={3}>3+ Years</option>
              <option value={5}>5+ Years</option>
            </select>
            <select value={minRating} onChange={e => setMinRating(Number(e.target.value))}
              style={{ padding: "9px 12px", background: "#fff", border: `1px solid ${THEME.borders}`, borderRadius: 2, fontSize: 12, color: THEME.text, outline: "none" }}>
              <option value={0}>Any Rating</option>
              <option value={4.0}>4.0+ ★</option>
              <option value={4.5}>4.5+ ★</option>
              <option value={4.8}>4.8+ ★</option>
            </select>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="bk-mono" style={{ fontSize: 10, color: THEME.earthBrown }}>≤ ₱{maxPrice}</span>
              <input type="range" min="500" max="5000" step="100" value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: 90 }} />
            </div>
            {hasActiveFilters && (
              <button onClick={handleReset}
                style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: THEME.primaryAccent, background: "transparent", border: "none", cursor: "pointer" }}>
                <X style={{ width: 13, height: 13 }} /> Reset
              </button>
            )}
          </div>
          {allSpecialties.length > 0 && (
            <div style={{ maxWidth: 1280, margin: "10px auto 0", display: "flex", flexWrap: "wrap", gap: 6 }}>
              {allSpecialties.map(s => (
                <button key={s} onClick={() => toggleSpecialty(s)}
                  style={{ padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "1px solid", transition: "all 0.15s",
                    background: specialties.includes(s) ? THEME.darkBg : "transparent",
                    color: specialties.includes(s) ? THEME.mainBg : THEME.earthBrown,
                    borderColor: specialties.includes(s) ? THEME.darkBg : THEME.borders }}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 2rem 80px" }}>
          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
                border: '1px solid #FFB74D',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(255, 152, 0, 0.1)'
              }}
              role="alert"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <AlertCircle style={{ width: 24, height: 24, color: '#E65100', flexShrink: 0 }} />
                <div>
                  <p style={{ color: '#E65100', fontWeight: 700, marginBottom: '4px', fontSize: '15px' }}>Connection Issue</p>
                  <p style={{ color: '#BF360C', fontSize: '13px', lineHeight: 1.5 }}>
                    {error.includes('timeout') 
                      ? 'Loading is taking longer than expected. Showing cached guides.' 
                      : error.includes('offline')
                      ? 'You appear to be offline. Showing cached guides.'
                      : error}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRetry}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 18px',
                  background: '#E65100',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  marginLeft: '12px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#D84315';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(230, 81, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#E65100';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <RefreshCw style={{ width: 14, height: 14 }} />
                Retry
              </button>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <div style={{ padding: '60px 0' }}>
              <SkeletonLoader count={5} type="row" />
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <div>
              {filteredGuides.length === 0 ? (
                <div style={{ padding: "80px 0", textAlign: "center" }}>
                  <div style={{ marginBottom: 24 }}>
                    <Search style={{ width: 56, height: 56, color: "#DDD6C8", margin: "0 auto 16px", opacity: 0.5 }} />
                  </div>
                  <div className="bk-display" style={{ fontSize: 32, fontWeight: 700, color: "#2D2D2D", marginBottom: 8 }}>
                    No guides found
                  </div>
                  <p style={{ color: "#B8B0A4", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
                    {hasActiveFilters 
                      ? "Try adjusting your filters or search terms" 
                      : "No guides available at the moment"}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={handleReset}
                      style={{
                        padding: "10px 20px",
                        background: THEME.primaryAccent,
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 600,
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = THEME.darkBg;
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = THEME.primaryAccent;
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 28 }}>
                  {filteredGuides.map((buddy, i) => {
                    const badge = badgeFor(buddy.rating);
                    const isFav = isFavorited(buddy.uid || buddy.id);
                    return (
                      <motion.div
                        key={buddy.uid || buddy.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="guide-card"
                        style={{
                          background: "#fff",
                          border: `1px solid ${THEME.borders}`,
                          borderRadius: 12,
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          cursor: "pointer"
                        }}
                        onClick={() => setSelectedBuddy(buddy)}
                      >
                        {/* Image Container */}
                        <div style={{ position: "relative", height: 280, overflow: "hidden", background: "#f0f0f0" }}>
                          <img src={buddy.photoURL} className="guide-img" alt={buddy.name} />
                          {/* Badge */}
                          <div style={{ position: "absolute", top: 12, right: 12, display: "flex", alignItems: "center", gap: 4, background: badge.bg, color: "#fff", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, zIndex: 2 }}>
                            <Award style={{ width: 12, height: 12 }} />
                            {badge.label}
                          </div>
                          {/* Rating */}
                          <div style={{ position: "absolute", top: 12, left: 12, display: "flex", alignItems: "center", gap: 4, background: "rgba(255, 255, 255, 0.95)", color: THEME.darkText, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, zIndex: 2 }}>
                            <Star style={{ width: 13, height: 13, fill: "#D4A853", color: "#D4A853" }} />
                            {buddy.rating}
                          </div>
                        </div>

                        {/* Content */}
                        <div style={{ padding: 24, display: "flex", flexDirection: "column", flex: 1 }}>
                          {/* Name & Experience */}
                          <div style={{ marginBottom: 12 }}>
                            <h3 className="bk-display" style={{ fontSize: "clamp(18px, 4vw, 24px)", fontWeight: 700, color: THEME.darkText, marginBottom: 4 }}>
                              {buddy.name}
                            </h3>
                            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: THEME.earthBrown }}>
                              <Briefcase style={{ width: 13, height: 13 }} />
                              {buddy.experience} experience
                            </div>
                          </div>

                          {/* Description */}
                          <p style={{ fontSize: 13, color: "#7A6E61", lineHeight: 1.6, marginBottom: 12, fontWeight: 300, flex: 1 }}>
                            {buddy.bio && buddy.bio.substring(0, 100)}
                            {buddy.bio && buddy.bio.length > 100 ? "..." : ""}
                          </p>

                          {/* Specialties */}
                          {buddy.specialties && buddy.specialties.length > 0 && (
                            <div style={{ marginBottom: 12 }}>
                              <div className="bk-mono" style={{ fontSize: 9, color: "#B8B0A4", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>Specialties</div>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                {buddy.specialties.slice(0, 3).map((s: string, idx: number) => (
                                  <span key={idx} style={{ fontSize: 10, background: "rgba(45, 122, 74, 0.08)", color: THEME.primaryAccent, padding: "3px 8px", fontWeight: 600, borderRadius: 2 }}>
                                    {s}
                                  </span>
                                ))}
                                {buddy.specialties.length > 3 && (
                                  <span style={{ fontSize: 10, color: THEME.earthBrown, padding: "3px 8px" }}>
                                    +{buddy.specialties.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Price */}
                          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 16, paddingTop: 12, borderTop: `1px solid ${THEME.borders}` }}>
                            <span className="bk-display" style={{ fontSize: 24, fontWeight: 900, color: THEME.primaryAccent }}>
                              ₱{buddy.pricePerDay}
                            </span>
                            <span className="bk-mono" style={{ fontSize: 10, color: THEME.earthBrown }}>/day</span>
                          </div>

                          {/* Action Buttons */}
                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(buddy.uid || buddy.id);
                              }}
                              style={{
                                flex: 1,
                                padding: "10px 12px",
                                background: isFav ? "rgba(196, 98, 45, 0.1)" : "#f5f5f5",
                                border: `1px solid ${isFav ? THEME.brownAccent : THEME.borders}`,
                                borderRadius: 6,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 6,
                                fontSize: 12,
                                fontWeight: 600,
                                color: isFav ? THEME.brownAccent : THEME.earthBrown,
                                transition: "all 0.2s"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = isFav ? "rgba(196, 98, 45, 0.15)" : "#efefef";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = isFav ? "rgba(196, 98, 45, 0.1)" : "#f5f5f5";
                              }}
                            >
                              <Heart style={{ width: 14, height: 14, fill: isFav ? THEME.brownAccent : "none" }} />
                              {isFav ? "Favorited" : "Favorite"}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBuddy(buddy);
                              }}
                              className="book-btn"
                              style={{
                                flex: 1,
                                padding: "10px 12px",
                                background: THEME.primaryAccent,
                                color: "#fff",
                                border: "none",
                                borderRadius: 6,
                                cursor: "pointer",
                                fontSize: 12,
                                fontWeight: 600,
                                transition: "all 0.2s"
                              }}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
