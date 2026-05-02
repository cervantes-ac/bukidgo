import { Mail, Lock, User, Eye, EyeOff, ArrowUpRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";
import { motion } from "motion/react";
import { FormInput } from "../components/FormInput";
import { useToast, ToastContainer } from "../components/Toast";
import { validationRules, validatePassword } from "../utils/validation";
import { formatErrorMessage } from "../utils/errorMessages";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
  .bk-display { font-family: 'Fraunces', Georgia, serif; }
  .bk-mono { font-family: 'JetBrains Mono', monospace; }
  input { font-family: 'Outfit', system-ui, sans-serif; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    const emailError = validationRules.email(email);
    if (emailError) newErrors.email = emailError;

    // Password validation
    const passwordError = validationRules.password(password);
    if (passwordError) newErrors.password = passwordError;

    // Name validation (for signup)
    if (!isLogin) {
      if (!name.trim()) {
        newErrors.name = 'Full name is required';
      } else if (name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (!isLogin) {
      const { strength } = validatePassword(value);
      setPasswordStrength(strength);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addToast('Please fix the errors below', 'error');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        addToast('Welcome back!', 'success');
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(result.user, { displayName: name });
        }
        addToast('Account created successfully!', 'success');
      }
      
      // Navigate after a short delay to show success message
      setTimeout(() => navigate("/"), 1000);
    } catch (err: any) {
      const errorMsg = formatErrorMessage(err);
      addToast(errorMsg, 'error');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{S}</style>
      <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", background: "#F5F0E8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, maxWidth: 1000, width: "100%" }}>
          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <img 
                src="/img/BukidGO/BukidGO_logo.png" 
                alt="BukidGo Logo"
                style={{
                  width: 48,
                  height: 48,
                  objectFit: "contain"
                }}
              />
              <div>
                <div className="bk-display" style={{ fontSize: 24, fontWeight: 900, color: "#1A1208" }}>BukidGo</div>
                <div className="bk-mono" style={{ fontSize: 8, color: "#7A6E61", letterSpacing: "0.2em", textTransform: "uppercase" }}>Highland Explorer</div>
              </div>
            </div>

            <h1 className="bk-display" style={{ fontSize: 48, fontWeight: 900, color: "#1A1208", lineHeight: 1.1, marginBottom: 20 }}>
              Explore<br /><em style={{ color: "#C4622D" }}>Bukidnon</em>
            </h1>

            <p style={{ fontSize: 16, color: "#7A6E61", lineHeight: 1.8, marginBottom: 32, maxWidth: 380 }}>
              Join thousands of travelers discovering the highlands. Book guides, reserve food spots, and plan your perfect Bukidnon adventure.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { icon: "🏔️", text: "50+ Destinations" },
                { icon: "👥", text: "Verified Local Guides" },
                { icon: "🍽️", text: "Authentic Food Spots" }
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{item.icon}</span>
                  <span style={{ fontSize: 14, color: "#7A6E61", fontWeight: 500 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ background: "#fff", border: "1px solid #DDD6C8", borderRadius: 2, padding: "40px" }}>
              <h2 className="bk-display" style={{ fontSize: 32, fontWeight: 900, color: "#1A1208", marginBottom: 8 }}>
                {isLogin ? "Welcome Back" : "Join Us"}
              </h2>
              <p style={{ fontSize: 14, color: "#7A6E61", marginBottom: 32 }}>
                {isLogin ? "Sign in to your account" : "Create a new account"}
              </p>

              <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {!isLogin && (
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#7A6E61", marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      Full Name
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#FAF7F2", border: "1px solid #DDD6C8", borderRadius: 2 }}>
                      <User style={{ width: 16, height: 16, color: "#7A6E61" }} />
                      <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)}
                        style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "#1A1208" }} />
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#7A6E61", marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Email
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#FAF7F2", border: "1px solid #DDD6C8", borderRadius: 2 }}>
                    <Mail style={{ width: 16, height: 16, color: "#7A6E61" }} />
                    <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required
                      style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "#1A1208" }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#7A6E61", marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Password
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#FAF7F2", border: "1px solid #DDD6C8", borderRadius: 2 }}>
                    <Lock style={{ width: 16, height: 16, color: "#7A6E61" }} />
                    <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => handlePasswordChange(e.target.value)} required
                      style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "#1A1208" }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: "none", border: "none", cursor: "pointer", color: "#7A6E61" }}>
                      {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                    </button>
                  </div>
                </div>

                {Object.keys(errors).length > 0 && (
                  <div style={{ padding: "12px 14px", background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 2, color: "#991b1b", fontSize: 13 }}>
                    {Object.entries(errors).map(([field, message]) => (
                      <div key={field}>{message}</div>
                    ))}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  style={{ padding: "14px", background: "#1A1208", color: "#F5F0E8", border: "none", borderRadius: 2, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {loading ? <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    : <>{isLogin ? "Sign In" : "Create Account"} <ArrowUpRight style={{ width: 16, height: 16 }} /></>}
                </button>
              </form>

              <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid #DDD6C8", textAlign: "center" }}>
                <p style={{ fontSize: 14, color: "#7A6E61", marginBottom: 12 }}>
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </p>
                <button onClick={() => { setIsLogin(!isLogin); setErrors({}); }}
                  style={{ background: "none", border: "none", color: "#C4622D", fontSize: 14, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
