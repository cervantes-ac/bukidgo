import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db, OperationType, handleFirestoreError } from "../lib/firebase";
import { useFirebase } from "../contexts/FirebaseContext";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Edit2, Save, X, Database, MapPin, BarChart3, Users, Settings, Globe, Coffee, Calendar, Star, DollarSign, Upload, Image, Hash, Type, Text, Map, Tag, Search, ArrowUpRight, Mountain, Filter } from "lucide-react";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
  .bk-display { font-family: 'Fraunces', Georgia, serif; }
  .bk-mono { font-family: 'JetBrains Mono', monospace; }
  .tab-btn { transition: all 0.15s; cursor: pointer; }
  .tab-btn:hover { background: #EDE7DC !important; }
  .item-row { transition: background 0.1s; }
  .item-row:hover { background: #FEFCF9 !important; }
  .item-row:hover .row-actions { opacity: 1 !important; }
  .row-actions { opacity: 0; transition: opacity 0.15s; }
  .form-input {
    width: 100%; background: #F5F0E8; border: 1px solid #DDD6C8;
    padding: 12px 14px; font-family: 'Outfit', sans-serif; font-size: 14px; color: #1A1208;
    outline: none; transition: border-color 0.15s; border-radius: 2px;
  }
  .form-input::placeholder { color: #B8B0A4; }
  .form-input:focus { border-color: #C4622D; }
  .form-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #B8B0A4; letter-spacing: 0.2em; text-transform: uppercase; display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
  select.form-input option { background: #F5F0E8; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useFirebase();
  const [activeTab, setActiveTab] = useState<"destinations" | "foodSpots" | "events" | "guides">("destinations");
  const [items, setItems] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ totalItems: 0, averageRating: 0, totalValue: 0 });

  useEffect(() => { if (isAdmin) fetchData(); }, [isAdmin, activeTab]);
  useEffect(() => { calculateStats(); }, [items]);

  const fetchData = async () => {
    try {
      const snap = await getDocs(collection(db, activeTab));
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { handleFirestoreError(e, OperationType.LIST, activeTab); }
  };

  const calculateStats = () => {
    if (!items.length) { setStats({ totalItems: 0, averageRating: 0, totalValue: 0 }); return; }
    const avg = items.reduce((s, i) => s + (i.rating || 0), 0) / items.length;
    const val = items.reduce((s, i) => s + (activeTab === "destinations" ? (i.entranceFee || 0) : activeTab === "foodSpots" ? 100 : 50), 0);
    setStats({ totalItems: items.length, averageRating: parseFloat(avg.toFixed(1)), totalValue: val });
  };

  const createAdminUser = async () => {
    if (!user) return;
    try {
      await setDoc(doc(db, "admins", user.uid), { uid: user.uid, email: user.email, role: "admin", createdAt: new Date().toISOString() });
      alert("Admin access granted! Please refresh."); window.location.reload();
    } catch (e) { console.error(e); alert("Error. Please try again."); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      await deleteDoc(doc(db, activeTab, id));
      setItems(items.filter(i => i.id !== id));
    } catch (e) { handleFirestoreError(e, OperationType.DELETE, `${activeTab}/${id}`); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(fd.entries());
    const refined: any = { ...data };
    if (activeTab === "destinations") {
      refined.rating = parseFloat(data.rating as string);
      refined.entranceFee = parseFloat(data.entranceFee as string);
      refined.images = [data.images as string];
      refined.location = { address: data.address as string, lat: parseFloat(data.lat as string) || 0, lng: parseFloat(data.lng as string) || 0 };
    } else if (activeTab === "foodSpots") {
      refined.rating = parseFloat(data.rating as string);
      refined.image = data.image as string;
      refined.location = { address: data.address as string, lat: parseFloat(data.lat as string) || 0, lng: parseFloat(data.lng as string) || 0 };
      if (data.menu) refined.menu = JSON.parse(data.menu as string);
    } else if (activeTab === "events") {
      refined.rating = parseFloat(data.rating as string) || 4.5;
      refined.image = data.image as string;
      refined.month = data.date as string;
    } else if (activeTab === "guides") {
      refined.rating = parseFloat(data.rating as string) || 4.5;
      refined.pricePerDay = parseFloat(data.pricePerDay as string) || 0;
      refined.experience = data.experience as string;
      if (data.specialties) {
        const arr = Array.isArray(data.specialties) ? data.specialties : [data.specialties];
        refined.specialties = arr;
      }
    }
    try {
      if (isEditing) { await updateDoc(doc(db, activeTab, isEditing.id), refined); }
      else { await addDoc(collection(db, activeTab), refined); }
      setIsEditing(null); setIsAdding(false); fetchData();
    } catch (e) { handleFirestoreError(e, OperationType.WRITE, activeTab); }
  };

  const filtered = items.filter(i =>
    i.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.location?.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return null;

  if (!isAdmin) {
    return (
      <>
        <style>{S}</style>
        <div style={{ minHeight: "100vh", background: "#F5F0E8", fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
            <div style={{ background: "#1A1208", padding: "64px 48px", marginBottom: 24 }}>
              <div style={{ width: 72, height: 72, background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <Database style={{ width: 32, height: 32, color: "#D4A853" }} />
              </div>
              <h1 className="bk-display" style={{ fontSize: 40, fontWeight: 900, color: "#F5F0E8", marginBottom: 10 }}>Admin Portal</h1>
              <p style={{ fontSize: 14, color: "rgba(245,240,232,0.35)", fontWeight: 300, lineHeight: 1.7 }}>
                Access the administrative dashboard to manage all Bukidnon content.
              </p>
            </div>
            <div style={{ background: "#fff", border: "1px solid #DDD6C8", padding: "40px 32px" }}>
              <h2 className="bk-display" style={{ fontSize: 26, fontWeight: 700, color: "#1A1208", marginBottom: 8 }}>Access Required</h2>
              <p style={{ fontSize: 13, color: "#B8B0A4", marginBottom: 28, fontWeight: 300 }}>You need administrative privileges to proceed.</p>
              <button onClick={createAdminUser}
                style={{ width: "100%", padding: "16px", background: "#C4622D", color: "#F5F0E8", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 2 }}>
                <Database style={{ width: 16, height: 16 }} /> Grant Admin Access
              </button>
              <p className="bk-mono" style={{ fontSize: 10, color: "#DDD6C8", marginTop: 16, letterSpacing: "0.1em" }}>Requires admin@gmail.com</p>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  const tabs = {
    destinations: { icon: Globe, label: "Destinations", accent: "#0ea5e9" },
    foodSpots: { icon: Coffee, label: "Food Spots", accent: "#f59e0b" },
    events: { icon: Calendar, label: "Events", accent: "#8b5cf6" },
    guides: { icon: Users, label: "Guides", accent: "#10b981" },
  };
  const tab = tabs[activeTab];

  const categoryOptions = { destinations: ["Nature", "Adventure", "Cultural", "Viewpoint", "Waterfall", "Mountain"], foodSpots: ["Local Delicacies", "Filipino", "International", "Vegetarian", "Seafood", "Coffee & Desserts", "Street Food"], events: ["Festival", "Cultural", "Sports", "Community", "Music", "Food Fair", "Religious"], guides: ["Beginner", "Intermediate", "Expert", "Professional"] };
  const priceRangeOptions = ["₱", "₱₱", "₱₱₱"];
  const experienceOptions = ["1-2 years", "3-5 years", "5-10 years", "10+ years"];
  const specialtiesOptions = ["Hiking", "Food Tours", "Photography", "History", "Nature", "Adventure", "Cultural", "Transportation"];

  return (
    <>
      <style>{S}</style>
      <div style={{ fontFamily: "'Outfit', sans-serif", background: "#F5F0E8", color: "#1A1208", minHeight: "100vh" }}>

        {/* Header */}
        <div style={{ background: "#1A1208", padding: "56px 2rem 48px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div className="bk-mono" style={{ fontSize: 10, color: "#D4A853", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
              <Settings style={{ width: 12, height: 12 }} />
              Admin Dashboard · BukidGo
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24 }}>
              <div>
                <h1 className="bk-display" style={{ fontSize: "clamp(2rem,5vw,4rem)", fontWeight: 900, color: "#F5F0E8", lineHeight: 0.95, marginBottom: 10 }}>
                  Content<br /><em style={{ color: "#D4A853" }}>Management</em>
                </h1>
                <p style={{ fontSize: 14, color: "rgba(245,240,232,0.35)", fontWeight: 300 }}>
                  Manage destinations, food spots, events, and guides.
                </p>
              </div>
              <div style={{ background: "rgba(245,240,232,0.05)", border: "1px solid rgba(245,240,232,0.08)", padding: "16px 20px" }}>
                <div className="bk-mono" style={{ fontSize: 9, color: "rgba(245,240,232,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>Signed in as</div>
                <div style={{ fontSize: 14, color: "#F5F0E8", fontWeight: 500 }}>{user?.email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 2rem 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 2 }}>
            {[
              { label: "Total Items", value: stats.totalItems, icon: Hash, color: "#0ea5e9" },
              { label: "Avg Rating", value: stats.averageRating, icon: Star, color: "#D4A853" },
              { label: "Total Value", value: `₱${stats.totalValue}`, icon: BarChart3, color: "#4A7C59" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} style={{ background: "#fff", border: "1px solid #DDD6C8", padding: "24px 28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon style={{ width: 18, height: 18, color }} />
                  </div>
                  <div className="bk-mono" style={{ fontSize: 9, color: "#B8B0A4", letterSpacing: "0.2em", textTransform: "uppercase" }}>{label}</div>
                </div>
                <div className="bk-display" style={{ fontSize: 36, fontWeight: 900, color: "#1A1208" }}>{value}</div>
                <div className="bk-mono" style={{ fontSize: 9, color: "#B8B0A4", marginTop: 4 }}>in {tab.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 2rem 80px" }}>
          <div style={{ background: "#fff", border: "1px solid #DDD6C8" }}>

            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid #DDD6C8", padding: "16px 16px 0" }}>
              {(Object.entries(tabs) as [keyof typeof tabs, any][]).map(([key, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <button key={key} onClick={() => setActiveTab(key)} className="tab-btn"
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "transparent", border: "none", borderBottom: activeTab === key ? `2px solid ${cfg.accent}` : "2px solid transparent", marginBottom: -1, fontSize: 13, fontWeight: 600, color: activeTab === key ? "#1A1208" : "#B8B0A4", cursor: "pointer" }}>
                    <Icon style={{ width: 15, height: 15, color: activeTab === key ? cfg.accent : "inherit" }} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>

            {/* Toolbar */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #EDE7DC", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
                <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#B8B0A4" }} />
                <input type="text" placeholder={`Search ${tab.label.toLowerCase()}…`} value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)} className="form-input"
                  style={{ paddingLeft: 36, paddingTop: 10, paddingBottom: 10 }} />
              </div>
              <button onClick={() => setIsAdding(true)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#C4622D", color: "#F5F0E8", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", borderRadius: 2, whiteSpace: "nowrap" }}>
                <Plus style={{ width: 15, height: 15 }} /> Add {tab.label.slice(0, -1)}
              </button>
            </div>

            {/* Items */}
            <div style={{ minHeight: 300 }}>
              {filtered.length === 0 ? (
                <div style={{ padding: "80px 24px", textAlign: "center" }}>
                  <div style={{ width: 64, height: 64, background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <Filter style={{ width: 28, height: 28, color: "#DDD6C8" }} />
                  </div>
                  <h3 className="bk-display" style={{ fontSize: 24, color: "#DDD6C8", marginBottom: 6 }}>No {tab.label} Found</h3>
                  <p style={{ fontSize: 13, color: "#B8B0A4" }}>
                    {searchQuery ? "Try a different search term." : `Add your first ${tab.label.slice(0, -1).toLowerCase()} to get started.`}
                  </p>
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")}
                      style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#C4622D", background: "none", border: "none", cursor: "pointer" }}>
                      <X style={{ width: 12, height: 12 }} /> Clear Search
                    </button>
                  )}
                </div>
              ) : (
                filtered.map((item) => (
                  <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="item-row"
                    style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 20, alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #F5F0E8", background: "#fff" }}>
                    {/* Image */}
                    <div style={{ width: 56, height: 56, overflow: "hidden", flexShrink: 0, border: "1px solid #DDD6C8" }}>
                      <img src={item.images?.[0] || item.image || item.photoURL || ""}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                    </div>
                    {/* Info */}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                        <h3 className="bk-display" style={{ fontSize: 19, fontWeight: 700, color: "#1A1208" }}>{item.name}</h3>
                        {item.category && (
                          <span className="bk-mono" style={{ fontSize: 9, color: "#C4622D", background: "rgba(196,98,45,0.08)", padding: "2px 8px", border: "1px solid rgba(196,98,45,0.15)" }}>
                            {item.category}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: "#B8B0A4", display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                        <MapPin style={{ width: 11, height: 11 }} />
                        {item.location?.address || item.location || item.description?.substring(0, 80) + "…"}
                      </p>
                      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        {item.rating && (
                          <span style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 3, color: "#1A1208" }}>
                            <Star style={{ width: 11, height: 11, fill: "#D4A853", color: "#D4A853" }} />
                            <strong>{item.rating}</strong>
                          </span>
                        )}
                        {item.priceRange && <span style={{ fontSize: 12, color: "#7A6E61" }}>{item.priceRange}</span>}
                        {item.entranceFee && <span style={{ fontSize: 12, color: "#7A6E61" }}>₱{item.entranceFee} entrance</span>}
                        {item.pricePerDay && <span style={{ fontSize: 12, color: "#7A6E61" }}>₱{item.pricePerDay}/day</span>}
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="row-actions" style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setIsEditing(item)}
                        style={{ padding: "8px 14px", background: "rgba(14,165,233,0.06)", border: "1px solid rgba(14,165,233,0.15)", color: "#0ea5e9", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, borderRadius: 2 }}>
                        <Edit2 style={{ width: 13, height: 13 }} /> Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)}
                        style={{ padding: "8px 14px", background: "rgba(196,98,45,0.06)", border: "1px solid rgba(196,98,45,0.15)", color: "#C4622D", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, borderRadius: 2 }}>
                        <Trash2 style={{ width: 13, height: 13 }} /> Delete
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {(isAdding || isEditing) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(26,18,8,0.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
              onClick={() => { setIsAdding(false); setIsEditing(null); }}>
              <motion.div initial={{ scale: 0.97, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.97, opacity: 0 }}
                style={{ background: "#F5F0E8", width: "100%", maxWidth: 740, maxHeight: "90vh", overflowY: "auto", border: "1px solid #DDD6C8", position: "relative" }}
                onClick={e => e.stopPropagation()}>

                {/* Modal header */}
                <div style={{ background: "#1A1208", padding: "32px 40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "sticky", top: 0, zIndex: 10 }}>
                  <div>
                    <div className="bk-mono" style={{ fontSize: 9, color: "rgba(245,240,232,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>
                      {isEditing ? "Editing" : "New"} Entry
                    </div>
                    <h2 className="bk-display" style={{ fontSize: 32, fontWeight: 900, color: "#F5F0E8" }}>
                      {isEditing ? "Edit" : "Add"} {tab.label.slice(0, -1)}
                    </h2>
                  </div>
                  <button onClick={() => { setIsAdding(false); setIsEditing(null); }}
                    style={{ background: "rgba(245,240,232,0.06)", border: "1px solid rgba(245,240,232,0.08)", padding: 10, cursor: "pointer", color: "#F5F0E8", display: "flex", borderRadius: 2 }}>
                    <X style={{ width: 18, height: 18 }} />
                  </button>
                </div>

                <form onSubmit={handleSave} style={{ padding: "36px 40px", display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label className="form-label"><Type style={{ width: 11, height: 11 }} /> Name</label>
                      <input name="name" defaultValue={isEditing?.name} className="form-input" required placeholder="Enter name" />
                    </div>
                    <div>
                      <label className="form-label"><Tag style={{ width: 11, height: 11 }} /> Category</label>
                      <select name="category" defaultValue={isEditing?.category} className="form-input" required>
                        <option value="">Select category</option>
                        {categoryOptions[activeTab].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label"><Text style={{ width: 11, height: 11 }} /> Description</label>
                    <textarea name="description" defaultValue={isEditing?.description} className="form-input" required placeholder="Enter description" style={{ minHeight: 100, resize: "vertical" }} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label className="form-label"><Star style={{ width: 11, height: 11 }} /> Rating (1–5)</label>
                      <input name="rating" type="number" step="0.1" min="1" max="5" defaultValue={isEditing?.rating || 4.5} className="form-input" required />
                    </div>
                    <div>
                      <label className="form-label">
                        {activeTab === "foodSpots" ? <DollarSign style={{ width: 11, height: 11 }} /> : <Calendar style={{ width: 11, height: 11 }} />}
                        {activeTab === "foodSpots" ? "Price Range" : activeTab === "events" ? "Date" : "Entrance Fee"}
                      </label>
                      {activeTab === "foodSpots" ? (
                        <select name="priceRange" defaultValue={isEditing?.priceRange} className="form-input" required>
                          <option value="">Select range</option>
                          {priceRangeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : activeTab === "events" ? (
                        <input name="date" defaultValue={isEditing?.date} className="form-input" required placeholder="e.g. March 1–31" />
                      ) : (
                        <input name="entranceFee" type="number" defaultValue={isEditing?.entranceFee} className="form-input" required placeholder="e.g. 100" />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="form-label"><Image style={{ width: 11, height: 11 }} /> Image URL</label>
                    <input name={activeTab === "destinations" ? "images" : "image"}
                      defaultValue={activeTab === "destinations" ? isEditing?.images?.[0] : isEditing?.image}
                      className="form-input" required placeholder="https://images.unsplash.com/…" />
                  </div>

                  {activeTab !== "events" && (
                    <div>
                      <label className="form-label"><Map style={{ width: 11, height: 11 }} /> Address</label>
                      <input name="address" defaultValue={isEditing?.location?.address} className="form-input" required placeholder="Full address" />
                    </div>
                  )}
                  {activeTab === "events" && (
                    <div>
                      <label className="form-label"><MapPin style={{ width: 11, height: 11 }} /> Location Name</label>
                      <input name="location" defaultValue={isEditing?.location} className="form-input" required placeholder="e.g. Malaybalay City" />
                    </div>
                  )}

                  {activeTab === "guides" && (
                    <>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                          <label className="form-label"><DollarSign style={{ width: 11, height: 11 }} /> Price Per Day</label>
                          <input name="pricePerDay" type="number" defaultValue={isEditing?.pricePerDay} className="form-input" required />
                        </div>
                        <div>
                          <label className="form-label"><Users style={{ width: 11, height: 11 }} /> Experience</label>
                          <select name="experience" defaultValue={isEditing?.experience} className="form-input" required>
                            <option value="">Select level</option>
                            {experienceOptions.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="form-label"><Tag style={{ width: 11, height: 11 }} /> Specialties</label>
                        <select name="specialties" multiple defaultValue={isEditing?.specialties || []} className="form-input" style={{ minHeight: 100 }}>
                          {specialtiesOptions.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                        <p className="bk-mono" style={{ fontSize: 9, color: "#B8B0A4", marginTop: 6, letterSpacing: "0.1em" }}>Hold Ctrl/Cmd to select multiple</p>
                      </div>
                    </>
                  )}

                  <button type="submit"
                    style={{ width: "100%", padding: "16px", background: "#C4622D", color: "#F5F0E8", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8, borderRadius: 2 }}>
                    <Save style={{ width: 16, height: 16 }} />
                    {isEditing ? "Update" : "Create"} {tab.label.slice(0, -1)}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}