// Bukidnon-inspired color theme
// Green mountains, lush forests, and natural earth tones

export const BUKIDNON_THEME = {
  // Primary colors - Mountain greens
  primary: {
    dark: "#1B4D2E",      // Deep forest green
    main: "#2D7A4A",      // Mountain green
    light: "#4A9D6F",     // Light forest green
    lighter: "#7BC97F",   // Lighter green
  },
  
  // Secondary colors - Earth and sky
  secondary: {
    earth: "#8B6F47",     // Mountain earth brown
    sky: "#87CEEB",       // Mountain sky blue
    accent: "#D4A574",    // Golden accent
  },
  
  // Neutral colors - Natural tones
  neutral: {
    dark: "#0F2818",      // Very dark green (almost black)
    text: "#1A3A2A",      // Dark text
    light: "#E8F3ED",     // Light background
    lighter: "#F5F9F7",   // Lighter background
    border: "#C8DDD4",    // Border color
  },
  
  // Accent colors
  accent: {
    success: "#4A9D6F",   // Green success
    warning: "#D4A574",   // Golden warning
    danger: "#C85A54",    // Muted red
    info: "#5B8DBE",      // Mountain blue
  },
  
  // Gradients
  gradients: {
    mountainGreen: "linear-gradient(135deg, #1B4D2E 0%, #2D7A4A 100%)",
    forestToSky: "linear-gradient(180deg, #2D7A4A 0%, #87CEEB 100%)",
    earthToGreen: "linear-gradient(135deg, #8B6F47 0%, #4A9D6F 100%)",
  },
};

// Export individual color values for easy access
export const colors = {
  // Primary
  darkGreen: "#1B4D2E",
  mountainGreen: "#2D7A4A",
  lightGreen: "#4A9D6F",
  forestGreen: "#7BC97F",
  
  // Secondary
  earthBrown: "#8B6F47",
  skyBlue: "#87CEEB",
  goldenAccent: "#D4A574",
  
  // Neutral
  veryDarkGreen: "#0F2818",
  darkText: "#1A3A2A",
  lightBg: "#E8F3ED",
  lighterBg: "#F5F9F7",
  borderColor: "#C8DDD4",
  
  // Accents
  success: "#4A9D6F",
  warning: "#D4A574",
  danger: "#C85A54",
  info: "#5B8DBE",
};
