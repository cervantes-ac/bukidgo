import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "motion/react";

const SHARED_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  :root {
    --bg: #F5F0E8;
    --bg-dark: #1A1208;
    --ink: #1A1208;
    --muted: #7A6E61;
    --border: #DDD6C8;
    --accent: #C4622D;
    --accent2: #4A7C59;
    --gold: #D4A853;
    --surface: #FFFFFF;
    --surface2: #FAF7F2;
  }
  html { scroll-behavior: smooth; }
  body { 
    background: var(--bg); 
    color: var(--ink); 
    font-family: 'Outfit', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  ::selection { background: #C4622D22; color: #1A1208; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #F5F0E8; }
  ::-webkit-scrollbar-thumb { background: #DDD6C8; border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: #7A6E61; }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .bk-display { font-family: 'Fraunces', Georgia, serif; }
  .bk-mono { font-family: 'JetBrains Mono', monospace; }
  input, textarea, select, button { font-family: 'Outfit', system-ui, sans-serif; }
`;

export default function Layout() {
  return (
    <>
      <style>{SHARED_STYLE}</style>
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ flex: 1, paddingTop: 72 }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </main>
        <Footer />
      </div>
    </>
  );
}