import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Menu, X, User, MapPin, Sparkles, Utensils, Calendar, LogOut } from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

import { useFirebase } from "../contexts/FirebaseContext";

export default function Navbar() {
  const { user, isAdmin } = useFirebase();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const navLinks = [
    { name: "Explore", path: "/explore", icon: MapPin },
    { name: "Eat Local", path: "/food", icon: Utensils },
    { name: "Guides", path: "/guides", icon: User },
    { name: "Events", path: "/events", icon: Calendar },
    { name: "AI Plan", path: "/ai-itinerary", icon: Sparkles },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-clay">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-3">
            <img src="/img/BukidGO/BukidGO.png" alt="BukidGo" className="h-10 w-auto" />
            <span className="text-2xl font-serif font-bold text-forest tracking-tighter">BukidGo</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium tracking-wide transition-colors hover:text-earth flex items-center gap-1.5",
                  location.pathname === link.path ? "text-forest border-b-2 border-forest pb-1" : "text-stone"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
            
            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-black tracking-widest text-earth hover:text-earth/80 uppercase border-2 border-earth/20 px-3 py-1 rounded-lg"
              >
                Admin
              </Link>
            )}
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="w-8 h-8 bg-clay rounded-full flex items-center justify-center hover:bg-stone/10 transition-colors">
                  <User className="w-4 h-4 text-stone" />
                </Link>
                <button onClick={handleLogout} className="text-stone/40 hover:text-earth transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-earth text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-earth/90 transition-all shadow-md shadow-earth/20"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-clay overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-stone font-medium"
                >
                  <link.icon className="w-5 h-5 text-forest" />
                  {link.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-earth font-black uppercase tracking-widest text-sm"
                >
                  <MapPin className="w-5 h-5 text-earth" />
                  Admin Panel
                </Link>
              )}
              <hr className="border-clay" />
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-stone font-medium">
                    <User className="w-5 h-5 text-forest" />
                    My Profile
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-3 text-earth font-medium w-full text-left">
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-earth text-white text-center py-3 rounded-xl font-medium"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
