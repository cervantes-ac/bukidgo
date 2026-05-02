// BukidGo Logo-Inspired Color Theme
// Deep forest greens, warm earth tones, golden accents, and cream backgrounds

export const BUKIDNON_THEME = {
  // Primary colors - Deep forest from logo
  primary: {
    dark: "#0A3D2F",      // Deep forest green (logo primary)
    main: "#1E4D2B",      // Rich forest green
    light: "#2D7A4A",     // Mountain green
    lighter: "#4A9D6F",   // Light forest green
  },
  
  // Secondary colors - Earth and warmth from logo
  secondary: {
    earth: "#8B4513",     // Warm earth brown (logo accent)
    warm: "#C4622D",      // Warm brown accent
    gold: "#F5C400",      // Golden accent (logo highlight)
    accent: "#D4A574",    // Muted golden
  },
  
  // Neutral colors - Cream and natural tones
  neutral: {
    dark: "#1A1208",      // Very dark brown (almost black)
    text: "#2D2D2D",      // Dark text
    light: "#F5F0E8",     // Warm cream background
    lighter: "#F5F5F0",   // Light cream background
    border: "#DDD6C8",    // Warm border color
  },
  
  // Accent colors
  accent: {
    success: "#2D7A4A",   // Green success
    warning: "#F5C400",   // Golden warning
    danger: "#C4622D",    // Warm red
    info: "#2D7A4A",      // Forest info
  },
  
  // Gradients
  gradients: {
    mountainGreen: "linear-gradient(135deg, #0A3D2F 0%, #1E4D2B 100%)",
    earthToGold: "linear-gradient(135deg, #8B4513 0%, #F5C400 100%)",
    forestWarm: "linear-gradient(135deg, #1E4D2B 0%, #C4622D 100%)",
  },
};

// Export individual color values for easy access
export const colors = {
  // Primary - Deep forest
  deepForest: "#0A3D2F",
  forestGreen: "#1E4D2B",
  mountainGreen: "#2D7A4A",
  lightGreen: "#4A9D6F",
  
  // Secondary - Earth and warmth
  earthBrown: "#8B4513",
  warmBrown: "#C4622D",
  goldenAccent: "#F5C400",
  mutedGold: "#D4A574",
  
  // Neutral - Cream palette
  darkBrown: "#1A1208",
  darkText: "#2D2D2D",
  creamBg: "#F5F0E8",
  lightCream: "#F5F5F0",
  warmBorder: "#DDD6C8",
  
  // Accents
  success: "#2D7A4A",
  warning: "#F5C400",
  danger: "#C4622D",
  info: "#2D7A4A",
};
