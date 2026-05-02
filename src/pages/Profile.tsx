import { User, Mail, MapPin, Calendar, LogOut, Edit2, Heart, Bookmark, Settings, ArrowUpRight, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useFirebase } from "../contexts/FirebaseContext";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
  .bk-display { font-family: 'Fraunces', Georgia, serif; }
  .bk-mono { font-family: 'JetBrains Mono', monospace; }
  .tab-btn { transition: all 0.15s; }
  .tab-btn.active { background: #1A1208; color: #F5F0E8; }
  .modal-scroll::-webkit-scrollbar { width: 4px; }
  .modal-scroll::-webkit-scrollbar-thumb { background: #DDD6C8; border-radius: 99px; }
`;

export default function Profile() {
  const { user } = useFirebase();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("bookings");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.displayName || "");

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (!user) {
    return (
      <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", background: "#F5F0E8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div className="bk-display" style={{ fontSize: 48, fontWeight: 900, color: "#1A1208", marginBottom: 16 }}>Not Signed In</div>
          <p style={{ fontSize: 16, color: "#7A6E61", marginBottom: 32, lineHeight: 1.7 }}>Sign in to view your profile, bookings, and saved favorites.</p>
          <button onClick={() => navigate("/auth")}
            style={{ padding: "14px 32px", background: "#1A1208", color: "#F5F0E8", border: "none", borderRadius: 2, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{S}</style>
      <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", background: "#F5F0E8", color: "#1A1208", minHeight: "100vh" }}>

        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg, #1A1208 0%, #2A1810 100%)", padding: "72px 2rem 56px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(196,98,45,0.1), transparent)" }} />
          <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 2 }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 32 }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 24 }}>
                <div style={{ position: "relative" }}>
                  <img src={user.photoURL || "https://via.placeholder.com/120"} style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: "4px solid #D4A853" }} alt={user.displayName || "User"} />
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: 36, height: 36, borderRadius: "50%", background: "#D4A853", border: "3px solid #1A1208", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <Edit2 style={{ width: 16, height: 16, color: "#1A1208" }} />
                  </div>
                </div>
                <div>
                  <h1 className="bk-display" style={{ fontSize: 40, fontWeight: 900, color: "#F5F0E8", lineHeight: 1 }}>{user.displayName || "Traveler"}</h1>
                  <p className="bk-mono" style={{ fontSize: 11, color: "rgba(245,240,232,0.4)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 6 }}>Member since 2024</p>
                </div>
              </div>
              <button onClick={handleLogout}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "rgba(245,240,232,0.1)", border: "1px solid rgba(245,240,232,0.2)", color: "#F5F0E8", borderRadius: 2, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                <LogOut style={{ width: 16, height: 16 }} /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 2rem 80px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 32 }}>
            {/* Sidebar */}
            <div>
              <div style={{ background: "#fff", border: "1px solid #DDD6C8", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ padding: "24px", borderBottom: "1px solid #DDD6C8" }}>
                  <h3 className="bk-display" style={{ fontSize: 18, fontWeight: 700, color: "#1A1208", marginBottom: 16 }}>Account</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#FAF7F2", borderRadius: 2 }}>
                      <Mail style={{ width: 16, height: 16, color: "#C4622D" }} />
                      <span style={{ fontSize: 13, color: "#7A6E61", wordBreak: "break-all" }}>{user.email}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#FAF7F2", borderRadius: 2 }}>
                      <Calendar style={{ width: 16, height: 16, color: "#C4622D" }} />
                      <span style={{ fontSize: 13, color: "#7A6E61" }}>Joined 2024</span>
                    </div>
                  </div>
                </div>

                <div style={{ padding: "24px" }}>
                  <h3 className="bk-display" style={{ fontSize: 18, fontWeight: 700, color: "#1A1208", marginBottom: 16 }}>Quick Stats</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[["Bookings", "3"], ["Favorites", "12"], ["Reviews", "2"]].map(([label, val]) => (
                      <div key={label as string} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "#FAF7F2", borderRadius: 2 }}>
                        <span style={{ fontSize: 13, color: "#7A6E61", fontWeight: 500 }}>{label}</span>
                        <span className="bk-display" style={{ fontSize: 18, fontWeight: 700, color: "#C4622D" }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button style={{ width: "100%", marginTop: 16, padding: "12px", background: "#FAF7F2", border: "1px solid #DDD6C8", borderRadius: 2, fontSize: 14, fontWeight: 600, color: "#1A1208", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Settings style={{ width: 16, height: 16 }} /> Settings
              </button>
            </div>

            {/* Main */}
            <div>
              {/* Tabs */}
              <div style={{ display: "flex", gap: 8, marginBottom: 32, borderBottom: "1px solid #DDD6C8", paddingBottom: 16 }}>
                {[["bookings", "Bookings"], ["favorites", "Favorites"], ["reviews", "Reviews"]].map(([tab, label]) => (
                  <button key={tab as string} onClick={() => setActiveTab(tab as string)} className="tab-btn"
                    style={{
                      padding: "10px 16px", borderRadius: 2, fontSize: 14, fontWeight: 600, cursor: "pointer",
                      background: activeTab === tab ? "#1A1208" : "transparent",
                      color: activeTab === tab ? "#F5F0E8" : "#7A6E61",
                      border: activeTab === tab ? "1px solid #1A1208" : "1px solid transparent",
                      transition: "all 0.15s",
                    }}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Bookings */}
              {activeTab === "bookings" && (
                <div>
                  <h2 className="bk-display" style={{ fontSize: 28, fontWeight: 900, color: "#1A1208", marginBottom: 24 }}>Your Bookings</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 3 }}>
                    {[
                      { name: "Mount Kitanglad Trek", date: "March 15, 2024", status: "confirmed", type: "destination" },
                      { name: "Dahilayan Adventure Park", date: "April 2, 2024", status: "pending", type: "destination" },
                      { name: "Binaki Cooking Class", date: "March 20, 2024", status: "confirmed", type: "food" }
                    ].map((booking, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        style={{ background: "#fff", border: "1px solid #DDD6C8", borderRadius: 2, padding: "20px", cursor: "pointer", transition: "all 0.2s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(26,18,8,0.1)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                          <h3 className="bk-display" style={{ fontSize: 18, fontWeight: 700, color: "#1A1208" }}>{booking.name}</h3>
                          <span className="bk-mono" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "4px 10px", background: booking.status === "confirmed" ? "#dcfce7" : "#fef9c3", color: booking.status === "confirmed" ? "#166534" : "#854d0e", borderRadius: 2 }}>
                            {booking.status}
                          </span>
                        </div>
                        <p style={{ fontSize: 13, color: "#7A6E61", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                          <Calendar style={{ width: 14, height: 14 }} /> {booking.date}
                        </p>
                        <button style={{ width: "100%", padding: "10px", background: "#1A1208", color: "#F5F0E8", border: "none", borderRadius: 2, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                          View Details
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Favorites */}
              {activeTab === "favorites" && (
                <div>
                  <h2 className="bk-display" style={{ fontSize: 28, fontWeight: 900, color: "#1A1208", marginBottom: 24 }}>Saved Favorites</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 3 }}>
                    {[
                      { name: "Lake Apo", type: "Nature" },
                      { name: "Pineapple Plantations", type: "Agritourism" },
                      { name: "Kaamulan Festival", type: "Cultural" }
                    ].map((fav, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        style={{ background: "#fff", border: "1px solid #DDD6C8", borderRadius: 2, padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                        <div>
                          <h3 className="bk-display" style={{ fontSize: 18, fontWeight: 700, color: "#1A1208", marginBottom: 4 }}>{fav.name}</h3>
                          <p className="bk-mono" style={{ fontSize: 11, color: "#7A6E61", letterSpacing: "0.15em", textTransform: "uppercase" }}>{fav.type}</p>
                        </div>
                        <Heart style={{ width: 20, height: 20, color: "#C4622D", fill: "#C4622D" }} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {activeTab === "reviews" && (
                <div>
                  <h2 className="bk-display" style={{ fontSize: 28, fontWeight: 900, color: "#1A1208", marginBottom: 24 }}>Your Reviews</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[
                      { place: "Dahilayan Adventure Park", rating: 5, text: "Amazing experience! The staff was friendly and the views were incredible." },
                      { place: "Local Restaurant", rating: 4, text: "Great food and authentic atmosphere. Highly recommended!" }
                    ].map((review, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        style={{ background: "#fff", border: "1px solid #DDD6C8", borderRadius: 2, padding: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                          <h3 className="bk-display" style={{ fontSize: 18, fontWeight: 700, color: "#1A1208" }}>{review.place}</h3>
                          <span style={{ fontSize: 14, color: "#D4A853" }}>{'★'.repeat(review.rating)}</span>
                        </div>
                        <p style={{ fontSize: 14, color: "#7A6E61", lineHeight: 1.6, marginBottom: 12 }}>{review.text}</p>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button style={{ padding: "8px 14px", background: "#1A1208", color: "#F5F0E8", border: "none", borderRadius: 2, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                            Edit
                          </button>
                          <button style={{ padding: "8px 14px", background: "#FAF7F2", color: "#C4622D", border: "1px solid #DDD6C8", borderRadius: 2, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                            Delete
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
