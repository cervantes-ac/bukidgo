import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { Menu, X, User, Sparkles, Utensils, Calendar, LogOut, Settings, Compass, Users } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useFirebase } from "../contexts/FirebaseContext";

const SHARED_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
  .bk-display { font-family: 'Fraunces', Georgia, serif; }
  .bk-body { font-family: 'Outfit', system-ui, sans-serif; }
  .bk-mono { font-family: 'JetBrains Mono', monospace; }
`;

// Device detection hook
function useDeviceType() {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      if (width <= 640) {
        setDeviceType('mobile');
      } else if (width <= 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return deviceType;
}

export default function Navbar() {
  const { user, isAdmin } = useFirebase();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const deviceType = useDeviceType();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const mainNavLinks = [
    { name: "Explore", path: "/explore", icon: Compass },
    { name: "Food", path: "/food", icon: Utensils },
    { name: "Guides", path: "/guides", icon: Users },
    { name: "Events", path: "/events", icon: Calendar },
    { name: "AI Plan", path: "/ai-itinerary", icon: Sparkles },
  ];

  const companyNavLinks = [
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Terms", path: "/terms" },
    { name: "Privacy", path: "/privacy" },
    { name: "Careers", path: "/careers" },
  ];

  // Adjustable styles based on device
  const getDeviceStyles = () => {
    switch (deviceType) {
      case 'mobile':
        return {
          containerPadding: "0 1rem",
          navHeight: 60,
          logoGap: 8,
          logoSize: 32,
          logoIconSize: 16,
          logoFontSize: 18,
          taglineFontSize: 7,
          showFullNav: false,
          showUserText: false,
          buttonPadding: "6px 10px",
          fontSize: 13,
          iconSize: 13,
          avatarSize: 22,
        };
      case 'tablet':
        return {
          containerPadding: "0 1.5rem",
          navHeight: 68,
          logoGap: 10,
          logoSize: 36,
          logoIconSize: 18,
          logoFontSize: 20,
          taglineFontSize: 8,
          showFullNav: true,
          showUserText: false,
          buttonPadding: "7px 12px",
          fontSize: 13,
          iconSize: 14,
          avatarSize: 24,
        };
      case 'desktop':
      default:
        return {
          containerPadding: "0 2rem",
          navHeight: 72,
          logoGap: 12,
          logoSize: 40,
          logoIconSize: 20,
          logoFontSize: 22,
          taglineFontSize: 9,
          showFullNav: true,
          showUserText: true,
          buttonPadding: "8px 14px",
          fontSize: 14,
          iconSize: 15,
          avatarSize: 26,
        };
    }
  };

  const styles = getDeviceStyles();

  return (
    <>
      <style>{SHARED_STYLE}</style>
      <nav
        className="bk-body fixed top-0 w-full z-50"
        style={{
          background: "rgba(245,240,232,0.96)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #DDD6C8",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: styles.containerPadding }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: styles.navHeight }}>
            
            {/* Logo - adjusts based on device */}
            <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: styles.logoGap }}>
              <img 
                src="/img/BukidGO/BukidGO_logo.png" 
                alt="BukidGo Logo"
                style={{
                  width: styles.logoSize,
                  height: styles.logoSize,
                  objectFit: "contain",
                  flexShrink: 0
                }}
              />
              <div>
                <div className="bk-display" style={{ 
                  fontSize: styles.logoFontSize, 
                  fontWeight: 900, 
                  color: "#1A1208", 
                  lineHeight: 1 
                }}>
                  BukidGo
                </div>
                <div className="bk-mono" style={{ 
                  fontSize: styles.taglineFontSize, 
                  color: "#7A6E61", 
                  letterSpacing: "0.2em", 
                  textTransform: "uppercase" 
                }}>
                  Highland Explorer
                </div>
              </div>
            </Link>

            {/* Desktop/Tablet Navigation */}
            {styles.showFullNav && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: deviceType === 'tablet' ? 2 : 4 }}>
                  {/* Show company links if not logged in, main nav if logged in */}
                  {!user ? (
                    companyNavLinks.map((link) => {
                      const isActive = location.pathname === link.path;
                      return (
                        <a
                          key={link.path}
                          href={link.path}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: deviceType === 'tablet' ? 4 : 6,
                            padding: deviceType === 'tablet' ? "6px 10px" : "8px 14px",
                            borderRadius: 4,
                            textDecoration: "none",
                            fontSize: styles.fontSize,
                            fontWeight: 500,
                            transition: "all 0.15s",
                            background: isActive ? "#1A1208" : "transparent",
                            color: isActive ? "#F5F0E8" : "#7A6E61",
                          }}
                          onMouseEnter={e => { 
                            if (!isActive) { 
                              (e.currentTarget as HTMLElement).style.color = "#1A1208"; 
                              (e.currentTarget as HTMLElement).style.background = "#DDD6C8"; 
                            } 
                          }}
                          onMouseLeave={e => { 
                            if (!isActive) { 
                              (e.currentTarget as HTMLElement).style.color = "#7A6E61"; 
                              (e.currentTarget as HTMLElement).style.background = "transparent"; 
                            } 
                          }}
                        >
                          {link.name}
                        </a>
                      );
                    })
                  ) : (
                    mainNavLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = location.pathname === link.path;
                      return (
                        <Link
                          key={link.path}
                          to={link.path}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: deviceType === 'tablet' ? 4 : 6,
                            padding: deviceType === 'tablet' ? "6px 10px" : "8px 14px",
                            borderRadius: 4,
                            textDecoration: "none",
                            fontSize: styles.fontSize,
                            fontWeight: 500,
                            transition: "all 0.15s",
                            background: isActive ? "#1A1208" : "transparent",
                            color: isActive ? "#F5F0E8" : "#7A6E61",
                          }}
                          onMouseEnter={e => { 
                            if (!isActive) { 
                              (e.currentTarget as HTMLElement).style.color = "#1A1208"; 
                              (e.currentTarget as HTMLElement).style.background = "#DDD6C8"; 
                            } 
                          }}
                          onMouseLeave={e => { 
                            if (!isActive) { 
                              (e.currentTarget as HTMLElement).style.color = "#7A6E61"; 
                              (e.currentTarget as HTMLElement).style.background = "transparent"; 
                            } 
                          }}
                        >
                          <Icon style={{ width: styles.iconSize, height: styles.iconSize }} />
                          {deviceType === 'tablet' ? (
                            <span style={{ 
                              display: 'inline-block', 
                              width: 60, 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap' 
                            }}>
                              {link.name}
                            </span>
                          ) : link.name}
                          {isActive && (
                            <div style={{ 
                              width: deviceType === 'tablet' ? 4 : 5, 
                              height: deviceType === 'tablet' ? 4 : 5, 
                              borderRadius: "50%", 
                              background: "#D4A853", 
                              marginLeft: 2 
                            }} />
                          )}
                        </Link>
                      );
                    })
                  )}

                  {isAdmin && (
                    <Link
                      to="/admin"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: deviceType === 'tablet' ? 4 : 6,
                        padding: deviceType === 'tablet' ? "6px 10px" : "8px 14px",
                        borderRadius: 4,
                        textDecoration: "none",
                        fontSize: styles.fontSize,
                        fontWeight: 600,
                        marginLeft: deviceType === 'tablet' ? 4 : 8,
                        background: location.pathname === "/admin" ? "#C4622D" : "#FAF7F2",
                        color: location.pathname === "/admin" ? "#fff" : "#C4622D",
                        border: "1px solid #C4622D",
                      }}
                    >
                      <Settings style={{ width: styles.iconSize, height: styles.iconSize }} />
                      {deviceType === 'tablet' ? 'Admin' : 'Admin'}
                    </Link>
                  )}
                </div>

                {/* User Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {user ? (
                    <>
                      <Link to="/profile" style={{
                        display: "flex",
                        alignItems: "center",
                        gap: deviceType === 'tablet' ? 6 : 8,
                        padding: styles.buttonPadding,
                        borderRadius: 4,
                        textDecoration: "none",
                        fontSize: styles.fontSize,
                        fontWeight: 500,
                        color: "#7A6E61",
                        border: "1px solid #DDD6C8",
                      }}>
                        {user.photoURL ? (
                          <img 
                            src={user.photoURL} 
                            style={{ 
                              width: styles.avatarSize, 
                              height: styles.avatarSize, 
                              borderRadius: "50%", 
                              objectFit: "cover" 
                            }} 
                            alt="" 
                          />
                        ) : (
                          <User style={{ width: styles.iconSize, height: styles.iconSize }} />
                        )}
                        {styles.showUserText && (user.displayName?.split(" ")[0] || "Profile")}
                      </Link>
                      <button
                        onClick={handleLogout}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: deviceType === 'tablet' ? 4 : 6,
                          padding: styles.buttonPadding,
                          borderRadius: 4,
                          border: "none",
                          fontSize: styles.fontSize,
                          fontWeight: 500,
                          color: "#7A6E61",
                          background: "transparent",
                          cursor: "pointer",
                        }}
                      >
                        <LogOut style={{ width: styles.iconSize, height: styles.iconSize }} />
                        {styles.showUserText && 'Logout'}
                      </button>
                    </>
                  ) : (
                    <Link to="/auth" style={{
                      display: "flex",
                      alignItems: "center",
                      gap: deviceType === 'tablet' ? 4 : 6,
                      padding: deviceType === 'tablet' ? "8px 16px" : "10px 20px",
                      borderRadius: 4,
                      textDecoration: "none",
                      fontSize: styles.fontSize,
                      fontWeight: 600,
                      color: "#F5F0E8",
                      background: "#1A1208",
                    }}>
                      <User style={{ width: styles.iconSize, height: styles.iconSize }} />
                      {deviceType === 'tablet' ? 'Login' : 'Sign In'}
                    </Link>
                  )}
                </div>
              </>
            )}

            {/* Mobile Toggle */}
            {!styles.showFullNav && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {user && !isOpen && (
                  <Link to="/profile" style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 10px",
                    borderRadius: 4,
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#7A6E61",
                    border: "1px solid #DDD6C8",
                  }}>
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        style={{ 
                          width: 22, 
                          height: 22, 
                          borderRadius: "50%", 
                          objectFit: "cover" 
                        }} 
                        alt="" 
                      />
                    ) : (
                      <User style={{ width: 13, height: 13 }} />
                    )}
                  </Link>
                )}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 4,
                    border: "1px solid #DDD6C8",
                    background: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isOpen ? <X style={{ width: 18, height: 18 }} /> : <Menu style={{ width: 18, height: 18 }} />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && !styles.showFullNav && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden", borderTop: "1px solid #DDD6C8", background: "#F5F0E8" }}
            >
              <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
                {/* Show company links if not logged in, main nav if logged in */}
                {!user ? (
                  companyNavLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <a
                        key={link.path}
                        href={link.path}
                        onClick={() => setIsOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "12px 16px",
                          borderRadius: 4,
                          textDecoration: "none",
                          fontSize: 15,
                          fontWeight: 500,
                          background: isActive ? "#1A1208" : "transparent",
                          color: isActive ? "#F5F0E8" : "#1A1208",
                        }}
                      >
                        {link.name}
                      </a>
                    );
                  })
                ) : (
                  mainNavLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "12px 16px",
                          borderRadius: 4,
                          textDecoration: "none",
                          fontSize: 15,
                          fontWeight: 500,
                          background: isActive ? "#1A1208" : "transparent",
                          color: isActive ? "#F5F0E8" : "#1A1208",
                        }}
                      >
                        <Icon style={{ width: 18, height: 18 }} />
                        {link.name}
                      </Link>
                    );
                  })
                )}
                <div style={{ borderTop: "1px solid #DDD6C8", marginTop: 8, paddingTop: 8 }}>
                  {user ? (
                    <>
                      <Link 
                        to="/profile" 
                        onClick={() => setIsOpen(false)}
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: 10, 
                          padding: "12px 16px", 
                          textDecoration: "none", 
                          color: "#1A1208", 
                          fontSize: 15, 
                          fontWeight: 500 
                        }}
                      >
                        <User style={{ width: 18, height: 18 }} /> My Profile
                      </Link>
                      <button 
                        onClick={() => { handleLogout(); setIsOpen(false); }}
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: 10, 
                          padding: "12px 16px", 
                          width: "100%", 
                          border: "none", 
                          background: "transparent", 
                          color: "#C4622D", 
                          fontSize: 15, 
                          fontWeight: 500, 
                          cursor: "pointer", 
                          textAlign: "left" 
                        }}
                      >
                        <LogOut style={{ width: 18, height: 18 }} /> Logout
                      </button>
                    </>
                  ) : (
                    <Link 
                      to="/auth" 
                      onClick={() => setIsOpen(false)}
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 10, 
                        padding: "12px 20px", 
                        textDecoration: "none", 
                        color: "#F5F0E8", 
                        background: "#1A1208", 
                        borderRadius: 4, 
                        fontSize: 15, 
                        fontWeight: 600, 
                        justifyContent: "center" 
                      }}
                    >
                      <User style={{ width: 18, height: 18 }} /> Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}