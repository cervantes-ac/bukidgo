import React, { useState } from "react";
import { auth, db } from "../lib/firebase";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  AuthError
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Mail, Lock, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();

  // Clear messages after 5 seconds
  React.useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const getAuthErrorMessage = (error: AuthError): string => {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/operation-not-allowed':
        return 'Email/password sign-in is not enabled. Please contact support or try Google sign-in.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled. Please try again.';
      case 'auth/popup-blocked':
        return 'Pop-up was blocked. Please allow pop-ups and try again.';
      case 'auth/cancelled-popup-request':
        return 'Sign-in was cancelled. Please try again.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      // Add custom parameters to ensure we get a fresh sign-in
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document exists
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      // Create or update user document
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: userDoc.exists() ? userDoc.data()?.role || "user" : "user",
        createdAt: userDoc.exists() ? userDoc.data()?.createdAt : new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        provider: 'google'
      }, { merge: true });

      setSuccess('Successfully signed in with Google!');
      setTimeout(() => navigate("/"), 1000);
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (!isLogin && password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Sign in existing user
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess('Successfully signed in!');
      } else {
        // Create new user
        const result = await createUserWithEmailAndPassword(auth, email, password);
        
        // Create user document
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || email.split('@')[0],
          photoURL: null,
          role: "user",
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          provider: 'email'
        });

        setSuccess('Account created successfully!');
      }
      
      setTimeout(() => navigate("/"), 1000);
    } catch (error: any) {
      console.error('Email auth error:', error);
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      setSuccess('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
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
          <h2 className="text-3xl font-serif font-bold text-forest">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-stone/40 mt-2 font-medium">
            Access the best of Bukidnon tourism
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-medium flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-sm font-medium flex items-start gap-3"
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4 mb-8">
          <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-linen border border-clay py-4 rounded-2xl font-bold text-stone hover:bg-clay transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-stone border-t-transparent rounded-full animate-spin" />
            ) : (
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            )}
            Continue with Google
          </button>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-clay"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-4 bg-white text-stone/30 font-bold uppercase tracking-widest">
              Or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone/40 uppercase tracking-widest ml-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone/30" />
              <input 
                type="email" 
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-linen border border-clay rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-earth text-stone font-medium transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-stone/40 uppercase tracking-widest ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone/30" />
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-linen border border-clay rounded-2xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-earth text-stone font-medium transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone/30 hover:text-stone/60 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-stone/40 uppercase tracking-widest ml-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone/30" />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-linen border border-clay rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-earth text-stone font-medium transition-all"
                  required
                />
              </div>
            </div>
          )}

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={handlePasswordReset}
                disabled={loading || resetEmailSent}
                className="text-sm text-earth hover:text-earth/80 font-medium transition-colors disabled:opacity-50"
              >
                {resetEmailSent ? 'Reset email sent' : 'Forgot password?'}
              </button>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-forest text-white py-4 rounded-2xl font-bold hover:bg-forest/90 transition-all shadow-lg shadow-forest/20 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </div>
            ) : isLogin ? (
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
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setSuccess(null);
              setResetEmailSent(false);
            }}
            className="text-earth font-bold hover:underline transition-colors"
            disabled={loading}
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
