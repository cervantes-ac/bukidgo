import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db, OperationType, handleFirestoreError } from "../lib/firebase";
import { useFirebase } from "../contexts/FirebaseContext";
import { DESTINATIONS, FOOD_SPOTS, EVENTS, LOCAL_BUDDIES } from "../constants";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Edit2, Save, X, Database, MapPin, Calendar, Utensils, Star, Users } from "lucide-react";
import { cn } from "../lib/utils";

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useFirebase();
  const [activeTab, setActiveTab] = useState<"destinations" | "foodSpots" | "events" | "guides" | "bookings">("destinations");
  const [items, setItems] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin, activeTab]);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, activeTab));
      setItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, activeTab);
    }
  };

  const seedData = async () => {
    setIsSeeding(true);
    try {
      // Seed Destinations
      for (const d of DESTINATIONS) {
        await setDoc(doc(db, "destinations", d.id), d);
      }
      // Seed Food
      for (const f of FOOD_SPOTS) {
        await setDoc(doc(db, "foodSpots", f.id), f);
      }
      // Seed Events
      for (const e of EVENTS) {
        await setDoc(doc(db, "events", e.id), e);
      }
      // Seed Guides
      for (const g of LOCAL_BUDDIES) {
        await setDoc(doc(db, "guides", g.uid), g);
      }
      // Add self as admin if email matches
      if (user?.email === "Admin@gmail.com") {
        await setDoc(doc(db, "admins", user.uid), {
          uid: user.uid,
          email: user.email
        });
      }
      alert("Database seeded successfully!");
      fetchData();
    } catch (error) {
       console.error("Error seeding:", error);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteDoc(doc(db, activeTab, id));
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${activeTab}/${id}`);
    }
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "bookings", bookingId), { status: newStatus });
      fetchData();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `bookings/${bookingId}`);
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
    } else if (activeTab === "guides") {
        refinedData.rating = parseFloat(data.rating as string);
        refinedData.pricePerDay = parseFloat(data.pricePerDay as string);
        refinedData.photoURL = data.photoURL as string;
        refinedData.uid = isEditing?.uid || Math.random().toString(36).substring(7);
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

  if (loading) return null;
  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h1 className="text-4xl font-serif font-bold text-forest mb-4">Access Denied</h1>
        <p className="text-stone/60 mb-8">You do not have administrative privileges.</p>
        {user?.email === "Admin@gmail.com" && (
           <button 
             onClick={seedData}
             disabled={isSeeding}
             className="bg-earth text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto"
           >
             <Database className={cn("w-5 h-5", isSeeding && "animate-spin")} />
             {isSeeding ? "Provisioning..." : "Provision Admin Account"}
           </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-serif font-bold text-forest mb-4">Admin Hub</h1>
          <p className="text-stone/60 text-lg">Manage the Bukidnon Experience.</p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={seedData}
            disabled={isSeeding}
            className="bg-linen text-stone px-6 py-3 rounded-xl font-bold border border-clay flex items-center gap-2 hover:bg-clay transition-all"
          >
            <Database className={cn("w-4 h-4", isSeeding && "animate-spin")} />
            Seed Initial Data
          </button>
          {activeTab !== "bookings" && (
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-earth text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-earth/90 shadow-lg shadow-earth/20 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add New
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-clay/20 rounded-2xl border border-clay/30 w-fit mb-12 overflow-x-auto max-w-full">
        {(["destinations", "foodSpots", "events", "guides", "bookings"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 py-2.5 rounded-xl font-bold text-sm capitalize transition-all whitespace-nowrap",
              activeTab === tab ? "bg-white text-forest shadow-sm" : "text-stone/50 hover:text-stone"
            )}
          >
            {tab === "foodSpots" ? "Food Spots" : tab}
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        {activeTab === "bookings" ? (
          items.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[2.5rem] border border-clay flex flex-col md:flex-row md:items-center justify-between group hover:shadow-xl transition-all gap-6"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                    item.type === "buddy" ? "bg-blue-100 text-blue-600" : 
                    item.type === "food" ? "bg-orange-100 text-orange-600" : "bg-forest/10 text-forest"
                  )}>
                    {item.type}
                  </span>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                    item.status === "pending" ? "bg-yellow-100 text-yellow-600" : 
                    item.status === "confirmed" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  )}>
                    {item.status}
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-stone mb-1">
                  {item.buddyName || item.destinationName || item.foodSpotName || item.eventName}
                </h3>
                <p className="text-stone/40 text-sm font-bold flex items-center gap-2">
                  Requested by: <span className="text-stone">{item.userName}</span> ({item.userEmail})
                </p>
                <p className="text-stone/30 text-[10px] mt-2 italic">ID: {item.id}</p>
              </div>

              <div className="flex gap-3">
                {item.status === "pending" && (
                  <>
                    <button 
                      onClick={() => handleUpdateStatus(item.id, "confirmed")}
                      className="px-6 py-3 bg-forest text-white rounded-xl font-bold text-sm hover:bg-forest/90 transition-all"
                    >
                      Confirm
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(item.id, "cancelled")}
                      className="px-6 py-3 bg-stone/5 text-stone rounded-xl font-bold text-sm border border-clay hover:bg-red-500 hover:text-white transition-all"
                    >
                      Cancel
                    </button>
                  </>
                )}
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-3 bg-stone/5 text-stone/40 rounded-xl border border-clay hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          items.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[2.5rem] border border-clay flex items-center justify-between group hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-linen overflow-hidden">
                  <img src={item.images?.[0] || item.image || item.photoURL} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-stone mb-1">{item.name}</h3>
                  <p className="text-stone/40 text-sm flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    {item.location?.address || item.location || item.bio}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setIsEditing(item)}
                  className="p-3 bg-linen text-stone rounded-xl border border-clay hover:bg-stone hover:text-white transition-all shadow-sm"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-3 bg-stone/5 text-stone/40 rounded-xl border border-clay hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {(isAdding || isEditing) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/40 backdrop-blur-md"
            onClick={() => { setIsAdding(false); setIsEditing(null); }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-linen w-full max-w-2xl rounded-[3rem] p-12 border border-clay shadow-2xl relative max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => { setIsAdding(false); setIsEditing(null); }}
                className="absolute top-8 right-8 p-3 bg-white/50 rounded-full text-stone hover:bg-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-4xl font-serif font-bold text-forest mb-8">
                {isEditing ? "Edit Item" : "Add New Item"}
              </h2>

              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-stone/40 block mb-2">Name</label>
                  <input name="name" defaultValue={isEditing?.name} className="w-full bg-white border border-clay rounded-2xl p-4 font-bold text-stone outline-none focus:ring-2 focus:ring-earth" required />
                </div>
                
                {activeTab !== "guides" && (
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-stone/40 block mb-2">Description</label>
                    <textarea name="description" defaultValue={isEditing?.description} className="w-full bg-white border border-clay rounded-2xl p-4 font-medium text-stone min-h-[100px] outline-none focus:ring-2 focus:ring-earth" required />
                  </div>
                )}

                {activeTab === "guides" && (
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-stone/40 block mb-2">Bio</label>
                    <textarea name="bio" defaultValue={isEditing?.bio} className="w-full bg-white border border-clay rounded-2xl p-4 font-medium text-stone min-h-[100px] outline-none focus:ring-2 focus:ring-earth" required />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {activeTab !== "guides" && (
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-stone/40 block mb-2">Category</label>
                      <input name="category" defaultValue={isEditing?.category} className="w-full bg-white border border-clay rounded-2xl p-4 font-bold text-stone outline-none focus:ring-2 focus:ring-earth" required />
                    </div>
                  )}
                  {activeTab === "guides" && (
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-stone/40 block mb-2">Experience</label>
                      <input name="experience" defaultValue={isEditing?.experience} className="w-full bg-white border border-clay rounded-2xl p-4 font-bold text-stone outline-none focus:ring-2 focus:ring-earth" required />
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-stone/40 block mb-2">
                      {activeTab === "foodSpots" ? "Price Range" : activeTab === "guides" ? "Price/Day" : activeTab === "events" ? "Date" : "Entrance Fee"}
                    </label>
                    <input name={activeTab === "foodSpots" ? "priceRange" : activeTab === "guides" ? "pricePerDay" : activeTab === "events" ? "date" : "entranceFee"} defaultValue={activeTab === "foodSpots" ? isEditing?.priceRange : activeTab === "guides" ? isEditing?.pricePerDay : activeTab === "events" ? isEditing?.date : isEditing?.entranceFee} className="w-full bg-white border border-clay rounded-2xl p-4 font-bold text-stone outline-none focus:ring-2 focus:ring-earth" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-stone/40 block mb-2">Rating</label>
                    <input name="rating" type="number" step="0.1" defaultValue={isEditing?.rating} className="w-full bg-white border border-clay rounded-2xl p-4 font-bold text-stone outline-none focus:ring-2 focus:ring-earth" required />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-stone/40 block mb-2">Image/Photo URL</label>
                    <input name={activeTab === "guides" ? "photoURL" : activeTab === "foodSpots" ? "image" : activeTab === "events" ? "image" : "images"} defaultValue={activeTab === "guides" ? isEditing?.photoURL : activeTab === "foodSpots" ? isEditing?.image : activeTab === "events" ? isEditing?.image : isEditing?.images?.[0]} className="w-full bg-white border border-clay rounded-2xl p-4 font-bold text-stone outline-none focus:ring-2 focus:ring-earth" required />
                  </div>
                </div>

                {activeTab !== "events" && activeTab !== "guides" && (
                   <div className="grid grid-cols-1 gap-4">
                     <div>
                       <label className="text-xs font-black uppercase tracking-widest text-stone/40 block mb-2">Address</label>
                       <input name="address" defaultValue={isEditing?.location?.address} className="w-full bg-white border border-clay rounded-2xl p-4 font-bold text-stone outline-none focus:ring-2 focus:ring-earth" required />
                     </div>
                   </div>
                )}

                {activeTab === "events" && (
                   <div>
                     <label className="text-xs font-black uppercase tracking-widest text-stone/40 block mb-2">Location Name</label>
                     <input name="location" defaultValue={isEditing?.location} className="w-full bg-white border border-clay rounded-2xl p-4 font-bold text-stone outline-none focus:ring-2 focus:ring-earth" required />
                   </div>
                )}

                <button className="w-full bg-earth text-white py-5 rounded-[2rem] font-bold text-lg hover:bg-earth/90 transition-all shadow-xl shadow-earth/20 flex items-center justify-center gap-3">
                  <Save className="w-6 h-6" />
                  Save Changes
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
