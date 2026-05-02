import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Star, MapPin, DollarSign, ArrowLeft, Heart, MessageSquare, ThumbsUp, AlertCircle, RefreshCw } from "lucide-react";
import { Destination, Review } from "../types";
import { db, OperationType, handleFirestoreError } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot, query, where, deleteDoc, getDocs } from "firebase/firestore";
import { useFirebase } from "../contexts/FirebaseContext";
import { useToast, ToastContainer } from "../components/Toast";
import { formatErrorMessage } from "../utils/errorMessages";
import { MOCK_REVIEWS } from "../constants";

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

export default function DestinationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useFirebase();
  const { toasts, addToast, removeToast } = useToast();
  
  const [destination, setDestination] = useState<Destination | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", comment: "" });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    let unsubReviews: (() => void) | null = null;

    try {
      // Load destination from Firestore
      const loadDestination = async () => {
        try {
          const snapshot = await getDocs(query(collection(db, "destinations"), where("id", "==", id)));
          if (!snapshot.empty) {
            setDestination({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Destination);
          } else {
            setError("Destination not found");
          }
          setLoading(false);
        } catch (err) {
          console.error("Error loading destination:", err);
          setError("Failed to load destination");
          setLoading(false);
        }
      };

      loadDestination();

      // Load reviews
      unsubReviews = onSnapshot(
        query(collection(db, "reviews"), where("targetId", "==", id), where("targetType", "==", "destination")),
        (snapshot) => {
          if (!snapshot.empty) {
            setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
          }
        },
        (err) => {
          console.error("Firestore error:", err);
        }
      );
    } catch (err) {
      setError("Failed to initialize data loading");
      setLoading(false);
    }

    return () => {
      if (unsubReviews) unsubReviews();
    };
  }, [id]);

  // Add mock reviews if no real reviews exist - use first 3 mock destination reviews as fallback
  const displayReviews = reviews.length > 0 ? reviews : MOCK_REVIEWS.filter(r => r.targetType === "destination").slice(0, 3);

  const handleSubmitReview = async () => {
    if (!user || !destination || !reviewForm.title || !reviewForm.comment) {
      addToast("Please fill in all fields", "error");
      return;
    }
    setIsSubmittingReview(true);
    try {
      await addDoc(collection(db, "reviews"), {
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userPhoto: user.photoURL,
        targetId: destination.id,
        targetType: "destination",
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment,
        createdAt: serverTimestamp(),
        helpful: 0
      });
      setReviewForm({ rating: 5, title: "", comment: "" });
      setShowReviewForm(false);
      addToast("Review submitted successfully!", "success");
    } catch (error) {
      const errorMsg = formatErrorMessage(error);
      addToast(errorMsg, "error");
      handleFirestoreError(error, OperationType.WRITE, "reviews");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: THEME.mainBg }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid #9C2A2A", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 20px" }} />
          <p style={{ color: THEME.earthBrown, fontSize: 14 }}>Loading destination...</p>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: THEME.mainBg, padding: "2rem" }}>
        <div style={{ textAlign: "center", maxWidth: 500 }}>
          <AlertCircle style={{ width: 48, height: 48, color: "#C62828", margin: "0 auto 20px" }} />
          <h2 style={{ fontSize: 24, fontWeight: 700, color: THEME.darkText, marginBottom: 10 }}>
            {error || "Destination not found"}
          </h2>
          <button
            onClick={() => navigate("/explore")}
            style={{
              marginTop: 20,
              padding: "12px 24px",
              background: THEME.darkBg,
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600
            }}
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div style={{ fontFamily: "'Outfit', sans-serif", background: THEME.mainBg, color: THEME.text, minHeight: "100vh" }}>
        {/* Header with back button */}
        <div style={{ padding: "20px 2rem", borderBottom: `1px solid ${THEME.borders}` }}>
          <button
            onClick={() => navigate("/explore")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: THEME.primaryAccent,
              fontSize: 14,
              fontWeight: 600
            }}
          >
            <ArrowLeft style={{ width: 18, height: 18 }} />
            Back to Explore
          </button>
        </div>

        {/* Main content */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 40, alignItems: "start" }}>
            {/* Left: Images and details */}
            <div>
              {/* Main image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  width: "100%",
                  height: 500,
                  overflow: "hidden",
                  borderRadius: 4,
                  marginBottom: 30,
                  boxShadow: "0 12px 40px rgba(10,61,47,0.15)"
                }}
              >
                <img
                  src={destination.images[0]}
                  alt={destination.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </motion.div>

              {/* Gallery */}
              {destination.images.length > 1 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 40 }}>
                  {destination.images.slice(1, 4).map((img, idx) => (
                    <div
                      key={idx}
                      style={{
                        height: 150,
                        overflow: "hidden",
                        borderRadius: 4,
                        cursor: "pointer"
                      }}
                    >
                      <img
                        src={img}
                        alt={`${destination.name} ${idx + 2}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              <div style={{ marginBottom: 40 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: THEME.darkText, marginBottom: 16 }}>About</h2>
                <p style={{ fontSize: 15, color: THEME.text, lineHeight: 1.8, marginBottom: 20 }}>
                  {destination.description}
                </p>
              </div>

              {/* Reviews Section */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 700, color: THEME.darkText }}>Reviews</h2>
                  {user && (
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      style={{
                        padding: "10px 20px",
                        background: THEME.primaryAccent,
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: 600
                      }}
                    >
                      {showReviewForm ? "Cancel" : "Write Review"}
                    </button>
                  )}
                </div>

                {showReviewForm && user && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: "#fff",
                      border: `1px solid ${THEME.borders}`,
                      borderRadius: 4,
                      padding: 24,
                      marginBottom: 24
                    }}
                  >
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: THEME.earthBrown, marginBottom: 8, textTransform: "uppercase" }}>
                        Rating
                      </label>
                      <div style={{ display: "flex", gap: 8 }}>
                        {[1, 2, 3, 4, 5].map(num => (
                          <button
                            key={num}
                            onClick={() => setReviewForm({ ...reviewForm, rating: num })}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: 24
                            }}
                          >
                            <Star
                              style={{
                                width: 24,
                                height: 24,
                                fill: num <= reviewForm.rating ? "#D4A574" : "none",
                                color: "#D4A574"
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: THEME.earthBrown, marginBottom: 8, textTransform: "uppercase" }}>
                        Title
                      </label>
                      <input
                        type="text"
                        placeholder="Summary of your experience"
                        value={reviewForm.title}
                        onChange={e => setReviewForm({ ...reviewForm, title: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: `1px solid ${THEME.borders}`,
                          borderRadius: 4,
                          fontSize: 14,
                          outline: "none"
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: THEME.earthBrown, marginBottom: 8, textTransform: "uppercase" }}>
                        Comment
                      </label>
                      <textarea
                        placeholder="Share your detailed experience..."
                        value={reviewForm.comment}
                        onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: `1px solid ${THEME.borders}`,
                          borderRadius: 4,
                          fontSize: 14,
                          outline: "none",
                          minHeight: 100,
                          fontFamily: "inherit"
                        }}
                      />
                    </div>

                    <button
                      onClick={handleSubmitReview}
                      disabled={isSubmittingReview}
                      style={{
                        width: "100%",
                        padding: "12px",
                        background: THEME.primaryAccent,
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: 600,
                        opacity: isSubmittingReview ? 0.6 : 1
                      }}
                    >
                      {isSubmittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </motion.div>
                )}

                {displayReviews.length === 0 ? (
                  <p style={{ color: THEME.lightText, fontSize: 14, textAlign: "center", padding: "40px 0" }}>
                    No reviews yet. Be the first to review!
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {displayReviews.map((review, idx) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        style={{
                          background: "#fff",
                          border: `1px solid ${THEME.borders}`,
                          borderRadius: 4,
                          padding: 20
                        }}
                      >
                        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                          <img
                            src={review.userPhoto || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"}
                            alt={review.userName}
                            style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 4 }}>
                              <h4 style={{ fontSize: 14, fontWeight: 700, color: THEME.darkText }}>
                                {review.userName}
                              </h4>
                              <div style={{ display: "flex", gap: 4 }}>
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    style={{
                                      width: 14,
                                      height: 14,
                                      fill: i < review.rating ? "#D4A574" : "none",
                                      color: "#D4A574"
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                            <p style={{ fontSize: 12, color: THEME.lightText, marginBottom: 8 }}>
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <h5 style={{ fontSize: 14, fontWeight: 700, color: THEME.darkText, marginBottom: 8 }}>
                          {review.title}
                        </h5>
                        <p style={{ fontSize: 13, color: THEME.text, lineHeight: 1.6, marginBottom: 12 }}>
                          {review.comment}
                        </p>

                        <div style={{ display: "flex", gap: 16, fontSize: 12, color: THEME.lightText }}>
                          <button
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              color: THEME.lightText
                            }}
                          >
                            <ThumbsUp style={{ width: 14, height: 14 }} />
                            Helpful ({review.helpful})
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Info card */}
            <div style={{ position: "sticky", top: 100 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: "#fff",
                  border: `1px solid ${THEME.borders}`,
                  borderRadius: 4,
                  padding: 24,
                  boxShadow: "0 4px 12px rgba(10,61,47,0.08)"
                }}
              >
                <h1 style={{ fontSize: 28, fontWeight: 900, color: THEME.darkText, marginBottom: 12 }}>
                  {destination.name}
                </h1>

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        style={{
                          width: 16,
                          height: 16,
                          fill: i < Math.floor(destination.rating) ? "#D4A574" : "none",
                          color: "#D4A574"
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: THEME.darkText }}>
                    {destination.rating} ({displayReviews.length} reviews)
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <MapPin style={{ width: 18, height: 18, color: THEME.primaryAccent }} />
                    <div>
                      <p style={{ fontSize: 12, color: THEME.lightText, textTransform: "uppercase", fontWeight: 600 }}>Location</p>
                      <p style={{ fontSize: 14, color: THEME.darkText, fontWeight: 600 }}>
                        {destination.location.address}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <DollarSign style={{ width: 18, height: 18, color: THEME.primaryAccent }} />
                    <div>
                      <p style={{ fontSize: 12, color: THEME.lightText, textTransform: "uppercase", fontWeight: 600 }}>Entrance Fee</p>
                      <p style={{ fontSize: 14, color: THEME.darkText, fontWeight: 600 }}>
                        ₱{destination.entranceFee}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: THEME.primaryAccent,
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 700,
                    marginBottom: 12
                  }}
                >
                  Plan Visit
                </button>

                <button
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "transparent",
                    color: THEME.primaryAccent,
                    border: `2px solid ${THEME.primaryAccent}`,
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8
                  }}
                >
                  <Heart style={{ width: 16, height: 16 }} />
                  Save
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
