import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { User, Settings, History, MapPin, Shield } from "lucide-react";
import { motion } from "motion/react";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const docRef = doc(db, "users", u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      }
    });
  }, []);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-3">
          <User className="text-gray-300" />
          Please sign in to view your profile
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-32">
      <div className="bg-white border border-clay rounded-[3rem] overflow-hidden shadow-sm">
        <div className="h-48 bg-gradient-to-r from-forest to-olive"></div>
        <div className="px-6 md:px-12 pb-12">
          <div className="relative -mt-16 flex flex-col md:flex-row items-center md:items-end gap-6 mb-12">
            <img 
              src={user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"} 
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-white"
              alt=""
            />
            <div className="pb-4 text-center md:text-left">
              <h1 className="text-3xl font-serif font-bold text-forest">{user.displayName || "Explorer"}</h1>
              <p className="text-stone/40 font-medium">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-1 space-y-2">
              <button className="w-full flex items-center gap-3 px-6 py-4 bg-linen text-forest rounded-2xl font-bold border border-clay shadow-sm transition-all">
                <User className="w-4 h-4" /> Account
              </button>
              <button className="w-full flex items-center gap-3 px-6 py-4 text-stone/50 hover:bg-linen rounded-2xl font-bold transition-all">
                <History className="w-4 h-4" /> Bookings
              </button>
              <button className="w-full flex items-center gap-3 px-6 py-4 text-stone/50 hover:bg-linen rounded-2xl font-bold transition-all">
                <MapPin className="w-4 h-4" /> Saved Spots
              </button>
              <button className="w-full flex items-center gap-3 px-6 py-4 text-stone/50 hover:bg-linen rounded-2xl font-bold transition-all">
                <Settings className="w-4 h-4" /> Settings
              </button>
            </div>

            <div className="md:col-span-2 space-y-8">
              <div className="p-8 bg-clay/30 border border-clay rounded-[2.5rem]">
                <h3 className="font-serif font-bold text-forest mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-earth" /> Member Status
                </h3>
                <div className="flex items-center gap-4">
                  <div className="bg-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border border-clay shadow-sm text-forest">
                    {profile?.role || "User"}
                  </div>
                  <p className="text-xs text-stone/40 font-bold">Joined {new Date(profile?.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="p-8 bg-white border border-clay rounded-[2.5rem] shadow-sm">
                <h3 className="font-serif font-bold text-forest mb-6">Travel Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-6 bg-linen rounded-2xl border border-clay">
                    <div className="text-3xl font-serif font-bold text-forest">0</div>
                    <div className="text-[10px] text-stone/40 font-bold uppercase tracking-widest mt-1">Trips</div>
                  </div>
                  <div className="text-center p-6 bg-linen rounded-2xl border border-clay">
                    <div className="text-3xl font-serif font-bold text-earth">0</div>
                    <div className="text-[10px] text-stone/40 font-bold uppercase tracking-widest mt-1">Reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
