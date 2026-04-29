import React, { useState } from "react";
import { auth, db } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  AuthError
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Mail, Lock, AlertCircle, CheckCircle, Eye, EyeOff, ArrowUpRight, Mountain } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
  .bk-display { font-family: 'Fraunces', Georgia, serif; }
  .bk-mono { font-family: 'JetBrains Mono', monospace; }
  .auth-input {
    width: 100%; padding: 14px 16px 14px 44px;
    background: #F5F0E8; border: 1px solid #DDD6C8;
    font-family: 'Outfit', sans-serif; font-size: 15px;
    color: #1A1208; outline: none; transition: border-color 0.15s;
    border-radius: 2px;
  }
  .auth-input::placeholder { color: #B8B0A4; }
  .auth-input:focus { border-color: #C4622D; }
  .auth-btn-primary {
    width: 100%; padding: 16px;
    background: #C4622D; color: #F5F0E8;
    border: none; font-family: 'Outfit', sans-serif;
    font-size: 15px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background 0.15s; border-radius: 2px;
  }
  .auth-btn-primary:hover { background: #A8501F; }
  .auth-btn-primary:disabled { background: #DDD6C8; color: #B8B0A4; cursor: not-allowed; }
  .tab-btn {
    flex: 1; padding: 12px;
    font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600;
    background: transparent; border: none; cursor: pointer;
    transition: all 0.15s; border-bottom: 2px solid transparent;
  }
  .tab-btn.active { color: #C4622D; border-bottom-color: #C4622D; }
  .tab-btn.inactive { color: #B8B0A4; }
  .tab-btn.inactive:hover { color: #7A6E61; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

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

  React.useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => { setError(null); setSuccess(null); }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const getAuthErrorMessage = (error: AuthError): string => {
    switch (error.code) {
      case 'auth/user-not-found': return 'No account found with this email address.';
      case 'auth/wrong-password': return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use': return 'An account with this email already exists.';
      case 'auth/weak-password': return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email': return 'Please enter a valid email address.';
      case 'auth/too-many-requests': return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed': return 'Network error. Please check your connection.';
      default: return error.message || 'An unexpected error occurred. Please try again.';
    }
  };

  const handleEmailAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); setSuccess(null); setLoading(true);
    if (!email || !password) { setError('Please fill in all fields.'); setLoading(false); return; }
    if (!isLogin && password !== confirmPassword) { setError('Passwords do not match.'); setLoading(false); return; }
    if (!isLogin && password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return; }
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess('Welcome back!');
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid, email: result.user.email,
          displayName: result.user.displayName || email.split('@')[0],
          photoURL: null, role: "user",
          createdAt: new Date().toISOString(), lastLoginAt: new Date().toISOString(), provider: 'email'
        });
        setSuccess('Account created successfully!');
      }
      setTimeout(() => navigate("/"), 1000);
    } catch (error: any) {
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) { setError('Please enter your email address first.'); return; }
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
    <>
      <style>{S}</style>
      <div style={{ minHeight: "100vh", background: "#F5F0E8", display: "flex", fontFamily: "'Outfit', sans-serif" }}>

        {/* Left panel — decorative */}
        <div style={{
          display: "none", flex: 1, background: "#1A1208", position: "relative", overflow: "hidden",
          // shown on lg
        }}
          className="auth-left-panel"
        >
          <img
            src="https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&q=80&w=1200"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.35, position: "absolute", inset: 0 }}
            alt=""
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(26,18,8,0.95) 0%, rgba(26,18,8,0.5) 100%)" }} />
          <div style={{ position: "relative", zIndex: 10, padding: "64px 56px", height: "100%", display: "flex", flexDirection: "column" }}>
            <div className="bk-mono" style={{ fontSize: 10, color: "#D4A853", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "auto", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "inline-block", width: 24, height: 1, background: "#D4A853" }} />
              BukidGo
            </div>
            <div>
              <h2 className="bk-display" style={{ fontSize: "clamp(2.5rem,5vw,4rem)", fontWeight: 900, color: "#F5F0E8", lineHeight: 1.0, marginBottom: 20 }}>
                Discover<br />the<br /><em style={{ color: "#D4A853" }}>Highlands</em>
              </h2>
              <p style={{ fontSize: 15, color: "rgba(245,240,232,0.5)", fontWeight: 300, lineHeight: 1.7, maxWidth: 320 }}>
                Your gateway to Bukidnon's hidden waterfalls, tribal festivals, and mountain trails.
              </p>
              <div style={{ display: "flex", gap: 32, marginTop: 48 }}>
                {[["50+", "Spots"], ["10+", "Guides"], ["∞", "Memories"]].map(([n, l]) => (
                  <div key={l}>
                    <div className="bk-display" style={{ fontSize: 28, fontWeight: 900, color: "#D4A853" }}>{n}</div>
                    <div className="bk-mono" style={{ fontSize: 9, color: "rgba(245,240,232,0.3)", letterSpacing: "0.2em", textTransform: "uppercase" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ width: "100%", maxWidth: 460 }}
          >
            {/* Logo mark */}
            <div style={{ marginBottom: 48, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, background: "#C4622D", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 2 }}>
                <Mountain style={{ width: 20, height: 20, color: "#F5F0E8" }} />
              </div>
              <span className="bk-display" style={{ fontSize: 22, fontWeight: 700, color: "#1A1208" }}>BukidGo</span>
            </div>

            <h1 className="bk-display" style={{ fontSize: 40, fontWeight: 900, color: "#1A1208", lineHeight: 1.0, marginBottom: 8 }}>
              {isLogin ? "Welcome back." : "Join the journey."}
            </h1>
            <p style={{ fontSize: 14, color: "#7A6E61", fontWeight: 300, marginBottom: 36 }}>
              {isLogin ? "Sign in to continue your Bukidnon adventure." : "Create an account and start exploring."}
            </p>

            {/* Tab switcher */}
            <div style={{ display: "flex", borderBottom: "1px solid #DDD6C8", marginBottom: 32 }}>
              <button className={`tab-btn ${isLogin ? "active" : "inactive"}`} onClick={() => { setIsLogin(true); setError(null); setSuccess(null); }}>
                Sign In
              </button>
              <button className={`tab-btn ${!isLogin ? "active" : "inactive"}`} onClick={() => { setIsLogin(false); setError(null); setSuccess(null); }}>
                Create Account
              </button>
            </div>

            {/* Alerts */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ marginBottom: 20, padding: "12px 16px", background: "rgba(196,98,45,0.08)", border: "1px solid rgba(196,98,45,0.25)", borderRadius: 2, fontSize: 13, color: "#C4622D", display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <AlertCircle style={{ width: 16, height: 16, flexShrink: 0, marginTop: 1 }} />
                  <span>{error}</span>
                </motion.div>
              )}
              {success && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ marginBottom: 20, padding: "12px 16px", background: "rgba(74,124,89,0.08)", border: "1px solid rgba(74,124,89,0.25)", borderRadius: 2, fontSize: 13, color: "#4A7C59", display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <CheckCircle style={{ width: 16, height: 16, flexShrink: 0, marginTop: 1 }} />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Email */}
              <div>
                <label className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <Mail style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#B8B0A4" }} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" className="auth-input" required />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#B8B0A4" }} />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" className="auth-input" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#B8B0A4", display: "flex" }}>
                    {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
                    <label className="bk-mono" style={{ fontSize: 9, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                      Confirm Password
                    </label>
                    <div style={{ position: "relative" }}>
                      <Lock style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#B8B0A4" }} />
                      <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="••••••••" className="auth-input" required />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Forgot password */}
              {isLogin && (
                <div style={{ textAlign: "right", marginTop: -4 }}>
                  <button type="button" onClick={handlePasswordReset} disabled={loading || resetEmailSent}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: resetEmailSent ? "#4A7C59" : "#C4622D", fontWeight: 500 }}>
                    {resetEmailSent ? "✓ Reset email sent" : "Forgot password?"}
                  </button>
                </div>
              )}

              <button type="submit" disabled={loading} className="auth-btn-primary" style={{ marginTop: 8 }}>
                {loading ? (
                  <div style={{ width: 18, height: 18, border: "2px solid rgba(245,240,232,0.3)", borderTopColor: "#F5F0E8", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                ) : isLogin ? (
                  <><LogIn style={{ width: 16, height: 16 }} /> Sign In</>
                ) : (
                  <><UserPlus style={{ width: 16, height: 16 }} /> Create Account</>
                )}
              </button>
            </form>

            <p style={{ marginTop: 32, fontSize: 13, color: "#B8B0A4", textAlign: "center" }}>
              {isLogin ? "New to BukidGo?" : "Already have an account?"}{" "}
              <button onClick={() => { setIsLogin(!isLogin); setError(null); setSuccess(null); setResetEmailSent(false); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#C4622D", fontWeight: 600, fontSize: 13 }}>
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}