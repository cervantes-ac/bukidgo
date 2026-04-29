import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db, OperationType, handleFirestoreError } from "../lib/firebase";
import { useFirebase } from "../contexts/FirebaseContext";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Edit2, Save, X, Database, MapPin, BarChart3, Users, Settings, Globe, Coffee, Calendar, Star, DollarSign, Upload, Image, Hash, Type, Text, Map, Tag, Filter, ChevronDown, Search } from "lucide-react";
import { cn } from "../lib/utils";

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useFirebase();
  const [activeTab, setActiveTab] = useState<"destinations" | "foodSpots" | "events" | "guides">("destinations");
  const [items, setItems] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalItems: 0,
    averageRating: 0,
    totalValue: 0
  });

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin, activeTab]);

  useEffect(() => {
    calculateStats();
  }, [items]);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, activeTab));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, activeTab);
    }
  };

  const calculateStats = () => {
    if (items.length === 0) {
      setStats({ totalItems: 0, averageRating: 0, totalValue: 0 });
      return;
    }

    const totalItems = items.length;
    const averageRating = items.reduce((sum, item) => sum + (item.rating || 0), 0) / totalItems;
    const totalValue = items.reduce((sum, item) => {
      if (activeTab === "destinations") return sum + (item.entranceFee || 0);
      if (activeTab === "foodSpots") return sum + 100; // Base value for food spots
      if (activeTab === "events") return sum + 50; // Base value for events
      return sum;
    }, 0);

    setStats({
      totalItems,
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalValue
    });
  };

  const createAdminUser = async () => {
    if (!user) return;
    
    try {
      await setDoc(doc(db, "admins", user.uid), {
        uid: user.uid,
        email: user.email,
        role: "admin",
        createdAt: new Date().toISOString()
      });
      alert("Admin access granted! Please refresh the page.");
      window.location.reload();
    } catch (error) {
      console.error("Error creating admin:", error);
      alert("Error creating admin access. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item? This action cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, activeTab, id));
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${activeTab}/${id}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    // Basic processing
    const refinedData: any = { ...data };
    if (activeTab === "destinations") {
        refinedData.rating = parseFloat(data.rating as string);
        refinedData.entranceFee = parseFloat(data.entranceFee as string);
        refinedData.images = [data.images as string];
        refinedData.location = {
            address: data.address as string,
            lat: parseFloat(data.lat as string) || 0,
            lng: parseFloat(data.lng as string) || 0
        };
    } else if (activeTab === "foodSpots") {
        refinedData.rating = parseFloat(data.rating as string);
        refinedData.image = data.image as string;
        refinedData.location = {
            address: data.address as string,
            lat: parseFloat(data.lat as string) || 0,
            lng: parseFloat(data.lng as string) || 0
        };
        // Handle menu items
        if (data.menu) {
          refinedData.menu = JSON.parse(data.menu as string);
        }
    } else if (activeTab === "events") {
        refinedData.rating = parseFloat(data.rating as string) || 4.5;
        refinedData.image = data.image as string;
        refinedData.month = data.date as string;
    } else if (activeTab === "guides") {
        refinedData.rating = parseFloat(data.rating as string) || 4.5;
        refinedData.pricePerDay = parseFloat(data.pricePerDay as string) || 0;
        refinedData.experience = data.experience as string;
        if (data.specialties) {
          // Handle multi-select specialties
          const specialtiesArray = Array.isArray(data.specialties) 
            ? data.specialties 
            : [data.specialties];
          refinedData.specialties = specialtiesArray;
        }
    }

    try {
      if (isEditing) {
        await updateDoc(doc(db, activeTab, isEditing.id), refinedData);
      } else {
        await addDoc(collection(db, activeTab), refinedData);
      }
      setIsEditing(null);
      setIsAdding(false);
      fetchData();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, activeTab);
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.location?.address && item.location.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return null;
  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="relative rounded-[4rem] overflow-hidden p-16 bg-gradient-to-br from-forest/90 to-earth/90 mb-12">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] -mr-48 -mt-48" />
          <div className="relative z-10">
            <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Database className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-serif font-bold text-white mb-6">Admin Portal</h1>
            <p className="text-white/60 text-xl max-w-2xl mx-auto mb-12">
              Access the administrative dashboard to manage all Bukidnon experiences, guides, and content.
            </p>
          </div>
        </div>
        
        <div className="max-w-md mx-auto bg-white rounded-[3rem] p-12 border border-clay shadow-2xl">
          <h2 className="text-3xl font-serif font-bold text-forest mb-4">Access Required</h2>
          <p className="text-stone/60 mb-8">You need administrative privileges to access this dashboard.</p>
          <button 
            onClick={createAdminUser}
            className="w-full bg-gradient-to-r from-forest to-earth text-white px-8 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-forest/20"
          >
            <Database className="w-6 h-6" />
            Grant Admin Access
          </button>
          <p className="text-stone/40 text-sm mt-6">
            Note: You must be signed in as <span className="font-bold">admin@gmail.com</span>
          </p>
        </div>
      </div>
    );
  }

  const tabConfig = {
    destinations: { icon: Globe, label: "Destinations", color: "from-blue-500/20 to-cyan-500/20", text: "text-blue-600" },
    foodSpots: { icon: Coffee, label: "Food Spots", color: "from-amber-500/20 to-orange-500/20", text: "text-amber-600" },
    events: { icon: Calendar, label: "Events", color: "from-purple-500/20 to-pink-500/20", text: "text-purple-600" },
    guides: { icon: Users, label: "Guides", color: "from-emerald-500/20 to-green-500/20", text: "text-emerald-600" }
  };

  const currentTab = tabConfig[activeTab];

  // Dropdown options
  const categoryOptions = {
    destinations: ["Nature", "Adventure", "Cultural", "Viewpoint", "Waterfall", "Mountain"],
    foodSpots: ["Local Delicacies", "Filipino", "International", "Vegetarian", "Seafood", "Meat", "Coffee & Desserts", "Street Food"],
    events: ["Festival", "Cultural", "Sports", "Community", "Music", "Art", "Food Fair", "Religious"],
    guides: ["Beginner", "Intermediate", "Expert", "Professional"]
  };

  const priceRangeOptions = ["₱", "₱₱", "₱₱₱"];
  const experienceOptions = ["1-2 years", "3-5 years", "5-10 years", "10+ years"];
  const specialtiesOptions = ["Hiking", "Food Tours", "Photography", "History", "Nature", "Adventure", "Cultural", "Transportation"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Header */}
      <div className="relative rounded-[4rem] overflow-hidden mb-16 bg-gradient-to-br from-forest/90 to-earth/90 p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <span className="text-white/80 font-black uppercase tracking-[0.3em] text-sm">Admin Dashboard</span>
              </div>
              <h1 className="text-6xl font-serif font-bold text-white mb-4 leading-tight">
                Content Management <br />
                <span className="text-linen">Hub</span>
              </h1>
              <p className="text-white/60 text-xl max-w-2xl">
                Manage destinations, food spots, events, and local guides across Bukidnon.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                <p className="text-white/80 text-sm font-bold mb-2">Logged in as</p>
                <p className="text-white text-xl font-serif">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-[3rem] p-8 border border-clay shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl flex items-center justify-center">
              <Hash className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-stone/30">Total Items</p>
              <p className="text-4xl font-serif font-bold text-stone">{stats.totalItems}</p>
            </div>
          </div>
          <p className="text-stone/40 text-sm">in {currentTab.label}</p>
        </div>

        <div className="bg-white rounded-[3rem] p-8 border border-clay shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl flex items-center justify-center">
              <Star className="w-7 h-7 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-stone/30">Avg Rating</p>
              <p className="text-4xl font-serif font-bold text-stone">{stats.averageRating}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(stats.averageRating) ? 'fill-yellow-500 text-yellow-500' : 'text-stone/20'}`} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-8 border border-clay shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-stone/30">Total Value</p>
              <p className="text-4xl font-serif font-bold text-stone">₱{stats.totalValue}</p>
            </div>
          </div>
          <p className="text-stone/40 text-sm">Estimated platform value</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-[4rem] border border-clay shadow-2xl overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-clay/30">
          <div className="flex flex-wrap gap-2 p-8">
            {(Object.entries(tabConfig) as [keyof typeof tabConfig, any][]).map(([tabKey, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={tabKey}
                  onClick={() => setActiveTab(tabKey)}
                  className={cn(
                    "flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all",
                    activeTab === tabKey 
                      ? `bg-gradient-to-r ${config.color} text-stone shadow-lg` 
                      : "text-stone/50 hover:text-stone hover:bg-linen"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {config.label}
                  {activeTab === tabKey && (
                    <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-8 border-b border-clay/30">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex-1">
              <div className="relative group max-w-xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone/40 group-focus-within:text-earth transition-colors" />
                <input 
                  type="text"
                  placeholder={`Search ${currentTab.label.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-linen border border-clay rounded-[2rem] focus:ring-2 focus:ring-earth outline-none transition-all font-medium text-stone placeholder:text-stone/30"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setIsAdding(true)}
                className="bg-gradient-to-r from-forest to-earth text-white px-8 py-5 rounded-2xl font-bold flex items-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-forest/20"
              >
                <Plus className="w-6 h-6" />
                Add New {currentTab.label.slice(0, -1)}
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {filteredItems.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-32 h-32 bg-linen rounded-full flex items-center justify-center mx-auto mb-8">
                <Filter className="w-16 h-16 text-stone/20" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-stone mb-4">No {currentTab.label} Found</h3>
              <p className="text-stone/40 mb-8 max-w-md mx-auto">
                {searchQuery ? "Try a different search term or " : ""}
                Add your first {currentTab.label.slice(0, -1).toLowerCase()} to get started.
              </p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="text-earth font-black uppercase tracking-widest text-sm hover:underline flex items-center gap-2 mx-auto"
                >
                  <X className="w-4 h-4" />
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredItems.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-8 rounded-[3rem] border-2 border-clay flex items-center justify-between group hover:shadow-2xl transition-all"
                >
                  <div className="flex items-center gap-8">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-linen to-white overflow-hidden shadow-xl">
                        <img src={item.images?.[0] || item.image || item.photoURL} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-earth text-white p-2 rounded-full border-4 border-white shadow-lg">
                        <currentTab.icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-stone mb-2">{item.name}</h3>
                      <p className="text-stone/40 text-sm flex items-center gap-2 mb-4">
                        <MapPin className="w-3 h-3" />
                        {item.location?.address || item.location || item.description?.substring(0, 80) + "..."}
                      </p>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-bold text-stone">{item.rating}</span>
                        </div>
                        {item.priceRange && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-bold text-stone">{item.priceRange}</span>
                          </div>
                        )}
                        {item.entranceFee && (
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-bold text-stone">₱{item.entranceFee}</span>
                          </div>
                        )}
                        {item.experience && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-bold text-stone">{item.experience}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setIsEditing(item)}
                      className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 rounded-2xl border border-blue-500/20 hover:bg-blue-500/20 transition-all shadow-sm"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 text-red-600 rounded-2xl border border-red-500/20 hover:bg-red-500/20 transition-all shadow-sm"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(isAdding || isEditing) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/60 backdrop-blur-md"
            onClick={() => { setIsAdding(false); setIsEditing(null); }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-linen w-full max-w-4xl rounded-[4rem] p-12 border border-clay shadow-2xl relative max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => { setIsAdding(false); setIsEditing(null); }}
                className="absolute top-10 right-10 p-4 bg-white/50 backdrop-blur-md rounded-full text-stone hover:bg-white transition-all shadow-lg"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-10">
                <h2 className="text-5xl font-serif font-bold text-forest mb-4">
                  {isEditing ? "Edit" : "Add New"} {currentTab.label.slice(0, -1)}
                </h2>
                <p className="text-stone/60 text-lg">
                  Fill in the details below to {isEditing ? "update" : "create"} this {currentTab.label.slice(0, -1).toLowerCase()}.
                </p>
              </div>

              <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-stone/30 flex items-center gap-2">
                      <Type className="w-4 h-4" /> Name
                    </label>
                    <input 
                      name="name" 
                      defaultValue={isEditing?.name} 
                      className="w-full bg-white border border-clay rounded-2xl p-5 font-bold text-stone outline-none focus:ring-2 focus:ring-earth" 
                      required 
                      placeholder="Enter name"
                    />
                  </div>
                  
                  {/* Category */}
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-stone/30 flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Category
                    </label>
                    <select 
                      name="category" 
                      defaultValue={isEditing?.category} 
                      className="w-full bg-white border border-clay rounded-2xl p-5 font-bold text-stone outline-none focus:ring-2 focus:ring-earth" 
                      required
                    >
                      <option value="">Select a category</option>
                      {categoryOptions[activeTab].map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-stone/30 flex items-center gap-2">
                    <Text className="w-4 h-4" /> Description
                  </label>
                  <textarea 
                    name="description" 
                    defaultValue={isEditing?.description} 
                    className="w-full bg-white border border-clay rounded-2xl p-5 font-medium text-stone min-h-[120px] outline-none focus:ring-2 focus:ring-earth" 
                    required 
                    placeholder="Enter detailed description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Rating */}
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-stone/30 flex items-center gap-2">
                      <Star className="w-4 h-4" /> Rating (1-5)
                    </label>
                    <input 
                      name="rating" 
                      type="number" 
                      step="0.1" 
                      min="1" 
                      max="5" 
                      defaultValue={isEditing?.rating || 4.5} 
                      className="w-full bg-white border border-clay rounded-2xl p-5 font-bold text-stone outline-none focus:ring-2 focus:ring-earth" 
                      required 
                    />
                  </div>
                  
                  {/* Price/Entrance Fee/Date */}
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-stone/30 flex items-center gap-2">
                      {activeTab === "foodSpots" ? (
                        <DollarSign className="w-4 h-4" />
                      ) : activeTab === "events" ? (
                        <Calendar className="w-4 h-4" />
                      ) : (
                        <Tag className="w-4 h-4" />
                      )}
                      {activeTab === "foodSpots" ? "Price Range" : activeTab === "events" ? "Date" : "Entrance Fee"}
                    </label>
                    {activeTab === "foodSpots" ? (
                      <select 
                        name="priceRange" 
                        defaultValue={isEditing?.priceRange} 
                        className="w-full bg-white border border-clay rounded-2xl p-5 font-bold text-stone outline-none focus:ring-2 focus:ring-earth" 
                        required
                      >
                        <option value="">Select price range</option>
                        {priceRangeOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : activeTab === "events" ? (
                      <input 
                        name="date" 
                        defaultValue={isEditing?.date} 
                        className="w-full bg-white border border-clay rounded-2xl p-5 font-bold text-stone outline-none focus:ring-2 focus:ring-earth" 
                        required 
                        placeholder="e.g., March 1-31"
                      />
                    ) : (
                      <input 
                        name="entranceFee" 
                        type="number"
                        defaultValue={isEditing?.entranceFee} 
                        className="w-full bg-white border border-clay rounded-2xl p-5 font-bold text-stone outline-none focus:ring-2 focus:ring-earth" 
                        required 
                        placeholder="e.g., 100"
                      />
                    )}
                  </div>
                </div>

                {/* Image URL */}
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-stone/30 flex items-center gap-2">
                    <Image className="w-4 h-4" /> Image URL
                  </label>
                  <div className="flex gap-4">
                    <input 
                      name={activeTab === "foodSpots" ? "image" : activeTab === "events" ? "image" : "images"} 
                      defaultValue={activeTab === "foodSpots" ? isEditing?.image : activeTab === "events" ? isEditing?.image : isEditing?.images?.[0]} 
                      className="flex-1 bg-white border border-clay rounded-2xl p-5 font-bold text-stone outline-none focus:ring-2 focus:ring-earth" 
                      required 
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                    <button 
                      type="button"
                      className="px-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 rounded-2xl border border-blue-500/20 hover:bg-blue-500/20 transition-all flex items-center gap-2"
                    >
                      <Upload className="w-5 h-5" />
                      Upload
                    </button>
                  </div>
                </div>

                {/* Address/Location */}
                {activeTab !== "events" && (
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-stone/30 flex items-center gap-2">
                      <Map className="w-4 h-4" /> Address
                    </label>
                    <input 
                      name="address" 
                      defaultValue={isEditing?.location?.address} 
                      className="w-full bg-white border border-clay rounded-2xl p-5 font-bold text-stone outline-none focus:ring-2 focus:ring-earth" 
                      required 
                      placeholder="Full address including city"
                    />
                  </div>
                )}

                {activeTab === "events" && (
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-stone/30 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Location Name
                    </label>
                    <input 
                      name="location" 
                      defaultValue={isEditing?.location} 
                      className="w-full bg-white border border-clay rounded-2xl p-5 font-bold text-stone outline-none focus:ring-2 focus:ring-earth" 
                      required 
                      placeholder="e.g., Malaybalay City, Bukidnon"
                    />
                  </div>
                )}

                {/* Additional Fields */}
                {activeTab === "guides" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-stone/30 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" /> Price Per Day
                        </label>
                        <input 
                          name="pricePerDay" 
                          type="number" 
                          defaultValue={isEditing?.pricePerDay} 
                          className="w-full bg-white border border-clay rounded-2xl p-5 font-bold text-stone outline-none focus:ring-2 focus:ring-earth" 
                          required 
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-stone/30 flex items-center gap-2">
                          <Users className="w-4 h-4" /> Experience
                        </label>
                        <select 
                          name="experience" 
                          defaultValue={isEditing?.experience} 
                          className="w-full bg-white border border-clay rounded-2xl p-5 font-bold text-stone outline-none focus:ring-2 focus:ring-earth" 
                          required
                        >
                          <option value="">Select experience level</option>
                          {experienceOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-stone/30 flex items-center gap-2">
                        <Tag className="w-4 h-4" /> Specialties
                      </label>
                      <select 
                        name="specialties" 
                        multiple
                        defaultValue={isEditing?.specialties || []} 
                        className="w-full bg-white border border-clay rounded-2xl p-5 font-bold text-stone outline-none focus:ring-2 focus:ring-earth min-h-[120px]" 
                      >
                        {specialtiesOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <p className="text-stone/40 text-xs mt-2">Hold Ctrl/Cmd to select multiple options</p>
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <button className="w-full bg-gradient-to-r from-forest to-earth text-white py-6 rounded-[2rem] font-bold text-xl hover:opacity-90 transition-all shadow-xl shadow-forest/20 flex items-center justify-center gap-3 mt-10">
                  <Save className="w-6 h-6" />
                  {isEditing ? "Update" : "Create"} {currentTab.label.slice(0, -1)}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}