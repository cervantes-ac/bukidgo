import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { User, Settings, History, MapPin, Shield, ArrowUpRight, Mountain, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
  .bk-display { font-family: 'Fraunces', Georgia, serif; }
  .bk-mono { font-family: 'JetBrains Mono', monospace; }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px; font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 500; cursor: pointer;
    background: none; border: none; width: 100%; text-align: left;
    transition: all 0.15s; border-radius: 2px; color: #7A6E61;
  }
  .nav-item:hover { background: #EDE7DC; color: #1A1208; }
  .nav-item.active { background: #1A1208; color: #F5F0E8; }
  .stat-card {
    background: #fff; border: 1px solid #DDD6C8;
    padding: 28px 24px; text-align: center;
  }
`;

const navItems = [
  { id: "account", label: "Account", icon: User },
  { id: "bookings", label: "Bookings", icon: History },
  { id: "saved", label: "Saved Spots", icon: MapPin },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [activeNav, setActiveNav] = useState("account");
  const navigate = useNavigate();

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const docSnap = await getDoc(doc(db, "users", u.uid));
        if (docSnap.exists()) setProfile(docSnap.data());
      }
    });
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/auth");
  };

  if (!user) {
    return (
      <>
        <style>{S}</style>
        <div style={{ minHeight: "100vh", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', sans-serif" }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: "center", maxWidth: 420, padding: "0 24px" }}>
            <div style={{ width: 80, height: 80, background: "#1A1208", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Mountain style={{ width: 36, height: 36, color: "#D4A853" }} />
            </div>
            <h2 className="bk-display" style={{ fontSize: 36, fontWeight: 900, color: "#1A1208", marginBottom: 12 }}>Sign In Required</h2>
            <p style={{ color: "#7A6E61", fontSize: 14, fontWeight: 300, marginBottom: 32, lineHeight: 1.6 }}>
              Create an account or sign in to manage your profile, bookings, and saved spots.
            </p>
            <button onClick={() => navigate("/auth")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#C4622D", color: "#F5F0E8", border: "none", padding: "14px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", borderRadius: 2 }}>
              Sign In <ArrowUpRight style={{ width: 16, height: 16 }} />
            </button>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{S}</style>
      <div style={{ minHeight: "100vh", background: "#F5F0E8", fontFamily: "'Outfit', sans-serif", color: "#1A1208" }}>

        {/* Hero banner */}
        <div style={{ background: "#1A1208", position: "relative", overflow: "hidden" }}>
          <img
            src="https://images.unsplash.com/photo-1618737849564-1d58ded7804d?auto=format&fit=crop&q=80&w=2000"
            style={{ width: "100%", height: 220, objectFit: "cover", opacity: 0.2, display: "block" }}
            alt=""
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, #1A1208 100%)" }} />

          {/* Profile identity */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 2rem 32px", maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 20, flexWrap: "wrap" }}>
              <div style={{ position: "relative" }}>
                <img
                  src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || user.email}`}
                  style={{ width: 88, height: 88, borderRadius: "50%", objectFit: "cover", border: "3px solid #D4A853" }}
                  alt=""
                />
                <div style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, background: "#4A7C59", borderRadius: "50%", border: "2px solid #1A1208", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Shield style={{ width: 11, height: 11, color: "#fff" }} />
                </div>
              </div>
              <div style={{ paddingBottom: 4 }}>
                <h1 className="bk-display" style={{ fontSize: 32, fontWeight: 900, color: "#F5F0E8", lineHeight: 1, marginBottom: 4 }}>
                  {user.displayName || "Explorer"}
                </h1>
                <p className="bk-mono" style={{ fontSize: 11, color: "rgba(245,240,232,0.4)", letterSpacing: "0.15em" }}>{user.email}</p>
              </div>
              <div style={{ marginLeft: "auto", paddingBottom: 4 }}>
                <span style={{ display: "inline-block", background: "rgba(212,168,83,0.15)", border: "1px solid rgba(212,168,83,0.3)", color: "#D4A853", padding: "6px 14px", fontSize: 11, fontWeight: 700, borderRadius: 2, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {profile?.role || "Member"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 2rem 80px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 32, alignItems: "start" }}>

            {/* Sidebar nav */}
            <div style={{ background: "#fff", border: "1px solid #DDD6C8", padding: "12px", position: "sticky", top: 100 }}>
              {navItems.map(({ id, label, icon: Icon }) => (
                <button key={id} className={`nav-item ${activeNav === id ? "active" : ""}`} onClick={() => setActiveNav(id)}>
                  <Icon style={{ width: 16, height: 16 }} />
                  {label}
                </button>
              ))}
              <div style={{ borderTop: "1px solid #DDD6C8", marginTop: 8, paddingTop: 8 }}>
                <button className="nav-item" onClick={handleSignOut} style={{ color: "#C4622D" }}>
                  <LogOut style={{ width: 16, height: 16 }} />
                  Sign Out
                </button>
              </div>
            </div>

            {/* Content panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Member Status */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: "#fff", border: "1px solid #DDD6C8", padding: "32px" }}>
                <div className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                  <Shield style={{ width: 12, height: 12, color: "#C4622D" }} /> Member Status
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <span style={{ background: "#1A1208", color: "#D4A853", padding: "8px 18px", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", borderRadius: 2 }}>
                    {profile?.role || "User"}
                  </span>
                  <span className="bk-mono" style={{ fontSize: 11, color: "#B8B0A4" }}>
                    Member since {new Date(profile?.createdAt || Date.now()).toLocaleDateString("en-PH", { year: "numeric", month: "long" })}
                  </span>
                </div>
              </motion.div>

              {/* Travel Stats */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ background: "#fff", border: "1px solid #DDD6C8", padding: "32px" }}>
                <div className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 20 }}>
                  Travel Statistics
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 2 }}>
                  {[
                    { val: "0", label: "Trips", color: "#C4622D" },
                    { val: "0", label: "Reviews", color: "#D4A853" },
                    { val: "0", label: "Bookings", color: "#4A7C59" },
                    { val: "0", label: "Saved Spots", color: "#1A1208" },
                  ].map(({ val, label, color }) => (
                    <div key={label} className="stat-card">
                      <div className="bk-display" style={{ fontSize: 40, fontWeight: 900, color, lineHeight: 1, marginBottom: 6 }}>{val}</div>
                      <div className="bk-mono" style={{ fontSize: 9, color: "#B8B0A4", letterSpacing: "0.2em", textTransform: "uppercase" }}>{label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Account info */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                style={{ background: "#fff", border: "1px solid #DDD6C8", padding: "32px" }}>
                <div className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 20 }}>
                  Account Details
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {[
                    { label: "Display Name", value: user.displayName || "Not set" },
                    { label: "Email Address", value: user.email },
                    { label: "Auth Provider", value: profile?.provider || "email" },
                    { label: "Last Login", value: new Date(profile?.lastLoginAt || Date.now()).toLocaleString() },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #F5F0E8" }}>
                      <span className="bk-mono" style={{ fontSize: 10, color: "#B8B0A4", letterSpacing: "0.15em", textTransform: "uppercase" }}>{label}</span>
                      <span style={{ fontSize: 14, color: "#1A1208", fontWeight: 500 }}>{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick links */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                {[
                  { label: "Explore Destinations", href: "/explore", color: "#C4622D" },
                  { label: "Find Local Guides", href: "/guides", color: "#4A7C59" },
                  { label: "Browse Events", href: "/events", color: "#D4A853" },
                  { label: "Generate Itinerary", href: "/itinerary", color: "#1A1208" },
                ].map(({ label, href, color }) => (
                  <a key={href} href={href}
                    style={{ background: color, color: "#F5F0E8", padding: "20px 24px", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span className="bk-display" style={{ fontSize: 17, fontWeight: 700 }}>{label}</span>
                    <ArrowUpRight style={{ width: 18, height: 18 }} />
                  </a>
                ))}
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}