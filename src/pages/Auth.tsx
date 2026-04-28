import React, { useState } from "react";
import { auth, db } from "../lib/firebase";
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Github, Mail, Lock } from "lucide-react";
import { motion } from "motion/react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        role: "user",
        createdAt: new Date().toISOString()
      }, { merge: true });
      navigate("/");
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Failed to sign in with Google");
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          role: "user",
          createdAt: new Date().toISOString()
        });
      }
      navigate("/");
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linen">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl border border-clay"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-forest">{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p className="text-stone/40 mt-2 font-medium">Access the best of Bukidnon tourism</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-8">
          <button 
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-linen border border-clay py-4 rounded-2xl font-bold text-stone hover:bg-clay transition-all shadow-sm"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Continue with Google
          </button>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-clay"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-4 bg-white text-stone/30 font-bold uppercase tracking-widest">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone/40 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone/30" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-linen border border-clay rounded-2xl py-4 pl-12 focus:ring-2 focus:ring-earth text-stone font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone/40 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone/30" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-linen border border-clay rounded-2xl py-4 pl-12 focus:ring-2 focus:ring-earth text-stone font-medium"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-forest text-white py-4 rounded-2xl font-bold hover:bg-forest/90 transition-all shadow-lg shadow-forest/20 mt-6"
          >
            {isLogin ? (
              <div className="flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" /> Sign In
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" /> Create Account
              </div>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-stone/50 mt-10 font-medium">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-earth font-bold hover:underline"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>

        <div className="mt-8 pt-8 border-t border-clay/30 text-center">
          <button 
            onClick={() => navigate('/admin')}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-stone/20 hover:text-earth transition-colors"
          >
            Admin Access
          </button>
        </div>
      </motion.div>
    </div>
  );
}
