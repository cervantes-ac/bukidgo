/**
 * Unified Bukidnon Theme & Design System
 * Inspired by highland heritage, tribal culture, and natural beauty
 */

export const BUKIDNON_THEME = {
  // Primary Colors - Mountain & Forest
  colors: {
    // Deep forest green (primary)
    darkGreen: "#0A3D2F",
    forestGreen: "#1E4D2B",
    mountainGreen: "#2D6A4F",
    lightGreen: "#4A9D6F",
    
    // Gold accents (tribal/cultural)
    gold: "#F5C400",
    goldLight: "#FDD835",
    
    // Earth tones
    earthBrown: "#8B4513",
    brownAccent: "#C4622D",
    darkBrown: "#5D3A1A",
    
    // Neutral palette
    cream: "#F5F5F0",
    lightCream: "#F5F0E8",
    beige: "#E8DCC8",
    darkText: "#1A1208",
    mediumText: "#2D2D2D",
    lightText: "rgba(245, 245, 240, 0.65)",
    
    // Status colors
    success: "#2D7A4A",
    warning: "#D4A574",
    error: "#9C2A2A",
    info: "#4A9D6F",
  },

  // Typography
  fonts: {
    serif: "'Playfair Display', Georgia, serif",
    body: "'Barlow', system-ui, sans-serif",
    condensed: "'Barlow Condensed', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },

  // Spacing scale
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
    xxxl: "64px",
  },

  // Border radius
  radius: {
    none: "0px",
    sm: "2px",
    md: "4px",
    lg: "8px",
    full: "99px",
  },

  // Shadows
  shadows: {
    sm: "0 2px 8px rgba(10, 61, 47, 0.1)",
    md: "0 8px 24px rgba(10, 61, 47, 0.15)",
    lg: "0 12px 40px rgba(10, 61, 47, 0.25)",
    xl: "0 28px 72px rgba(10, 61, 47, 0.35)",
  },

  // Gradients
  gradients: {
    mountainDark: "linear-gradient(135deg, #0A3D2F 0%, #1E4D2B 50%, #0A3D2F 100%)",
    mountainWarm: "linear-gradient(135deg, #1E4D2B 0%, #2D6A4F 100%)",
    goldAccent: "linear-gradient(135deg, #F5C400 0%, #FDD835 100%)",
    brownAccent: "linear-gradient(135deg, #8B4513 0%, #C4622D 100%)",
    cream: "linear-gradient(135deg, #F5F5F0 0%, #F5E8D5 100%)",
  },

  // Breakpoints
  breakpoints: {
    mobile: "480px",
    tablet: "768px",
    desktop: "1024px",
    wide: "1280px",
  },
};

// Utility function to get theme value
export const getThemeValue = (path: string, defaultValue?: any) => {
  const keys = path.split(".");
  let value: any = BUKIDNON_THEME;
  
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) return defaultValue;
  }
  
  return value;
};

// CSS-in-JS helper
export const createThemeStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@400;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: ${BUKIDNON_THEME.fonts.body};
    background: ${BUKIDNON_THEME.colors.cream};
    color: ${BUKIDNON_THEME.colors.mediumText};
  }

  /* Typography classes */
  .bk-serif { font-family: ${BUKIDNON_THEME.fonts.serif}; }
  .bk-body { font-family: ${BUKIDNON_THEME.fonts.body}; }
  .bk-cond { font-family: ${BUKIDNON_THEME.fonts.condensed}; }
  .bk-mono { font-family: ${BUKIDNON_THEME.fonts.mono}; }

  /* Tribal weave pattern */
  .weave-bg {
    background: ${BUKIDNON_THEME.gradients.mountainDark};
    background-image:
      repeating-linear-gradient(45deg, rgba(245,196,0,0.04) 0px, rgba(245,196,0,0.04) 1px, transparent 1px, transparent 10px),
      repeating-linear-gradient(-45deg, rgba(245,196,0,0.03) 0px, rgba(245,196,0,0.03) 1px, transparent 1px, transparent 10px);
  }

  /* Card hover effect */
  .bk-card {
    transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease;
    cursor: pointer;
  }
  .bk-card:hover {
    transform: translateY(-8px);
    box-shadow: ${BUKIDNON_THEME.shadows.xl};
  }
  .bk-card:hover .bk-img { transform: scale(1.08); }

  .bk-img { transition: transform 0.8s cubic-bezier(0.22,1,0.36,1); }

  /* Button styles */
  .bk-btn-primary {
    background: linear-gradient(135deg, #9C2A2A 0%, #7A1F1F 100%);
    color: ${BUKIDNON_THEME.colors.cream};
    border: none;
    padding: 12px 32px;
    font-family: ${BUKIDNON_THEME.fonts.condensed};
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    transition: all 0.2s;
    white-space: nowrap;
    border-radius: ${BUKIDNON_THEME.radius.sm};
  }
  .bk-btn-primary:hover {
    background: linear-gradient(135deg, #7A1F1F 0%, #5A1515 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(156,42,42,0.4);
  }

  .bk-btn-outline {
    background: transparent;
    color: #9C2A2A;
    border: 2px solid #9C2A2A;
    padding: 12px 26px;
    font-family: ${BUKIDNON_THEME.fonts.condensed};
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    transition: all 0.2s;
    border-radius: ${BUKIDNON_THEME.radius.sm};
  }
  .bk-btn-outline:hover {
    background: #9C2A2A;
    color: ${BUKIDNON_THEME.colors.cream};
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(156,42,42,0.3);
  }

  /* Scrollbar */
  .bk-scroll::-webkit-scrollbar { width: 4px; }
  .bk-scroll::-webkit-scrollbar-thumb { background: #9C2A2A; border-radius: 99px; }

  /* Tribe stripe */
  .tribe-stripe {
    height: 8px;
    background: repeating-linear-gradient(90deg, #0A3D2F 0px, #0A3D2F 16px, #9C2A2A 16px, #9C2A2A 32px, #F5C400 32px, #F5C400 48px, #1E4D2B 48px, #1E4D2B 64px);
  }

  /* Animations */
  @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  .float-anim { animation: floatY 3.5s ease-in-out infinite; }

  @keyframes pulse-glow { 0%,100%{box-shadow:0 0 20px rgba(245,196,0,0.3)} 50%{box-shadow:0 0 40px rgba(245,196,0,0.6)} }
  .pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* Badge styles */
  .badge-primary {
    background: linear-gradient(135deg, #9C2A2A 0%, #7A1F1F 100%);
    color: ${BUKIDNON_THEME.colors.cream};
  }

  .badge-accent {
    background: ${BUKIDNON_THEME.colors.gold};
    color: ${BUKIDNON_THEME.colors.darkGreen};
  }

  /* Tag */
  .bk-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: ${BUKIDNON_THEME.fonts.condensed};
    font-weight: 700;
    font-size: 11px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #9C2A2A;
    padding: 6px 0;
  }
  .bk-tag::before { content: ''; display: inline-block; width: 28px; height: 2px; background: #9C2A2A; }
`;
