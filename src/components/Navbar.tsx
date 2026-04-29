// ─── PAGE: NAVBAR ─────────────────────────────────────────────
const Navbar = ({ currentPage, setCurrentPage, user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
 
  const links = [
    { name: "Explore", page: "explore" },
    { name: "Food",    page: "food"    },
    { name: "Guides",  page: "guides"  },
    { name: "Events",  page: "events"  },
    { name: "AI Plan", page: "ai"      },
  ];
 
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(247,240,230,0.92)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(61,107,79,0.1)",
      padding: "0 32px",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        {/* Logo */}
        <button onClick={() => setCurrentPage("home")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer" }}>
          <div style={{ width: 38, height: 38, background: T.jungle, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="map" size={18} color={T.gold} />
          </div>
          <span className="display" style={{ fontSize: 22, fontWeight: 700, color: T.jungle, letterSpacing: "-0.02em" }}>BukidGo</span>
        </button>
 
        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {links.map(l => (
            <button key={l.page} onClick={() => setCurrentPage(l.page)} style={{
              background: currentPage === l.page ? "rgba(61,107,79,0.1)" : "none",
              border: "none",
              padding: "8px 16px",
              borderRadius: 10,
              fontFamily: "var(--ff-body)",
              fontSize: 14,
              fontWeight: currentPage === l.page ? 600 : 400,
              color: currentPage === l.page ? T.moss : T.stone,
              cursor: "pointer",
              transition: "all 0.2s",
            }}>
              {l.name}
            </button>
          ))}
          {user?.isAdmin && (
            <button onClick={() => setCurrentPage("admin")} style={{
              background: T.amber, color: "white", border: "none",
              padding: "7px 14px", borderRadius: 10,
              fontFamily: "var(--ff-body)", fontSize: 13, fontWeight: 600,
              cursor: "pointer", marginLeft: 4
            }}>
              Admin
            </button>
          )}
        </div>
 
        {/* Auth */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user ? (
            <>
              <button onClick={() => setCurrentPage("profile")} style={{
                width: 38, height: 38, borderRadius: 10,
                background: T.mist, border: "1.5px solid rgba(61,107,79,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer"
              }}>
                <Icon name="user" size={16} color={T.moss} />
              </button>
              <button onClick={onLogout} className="btn-ghost" style={{ padding: "8px 14px", fontSize: 13 }}>
                <Icon name="logout" size={14} />
                Out
              </button>
            </>
          ) : (
            <button className="btn-primary" onClick={() => setCurrentPage("auth")} style={{ padding: "9px 22px" }}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};