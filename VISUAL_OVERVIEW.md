# BukidGo Visual Overview

## Brand Identity

### Logo
- **Icon**: Mountain symbol
- **Background**: #1A1208 (very dark)
- **Icon Color**: #D4A574 (golden)
- **Text**: "BukidGo" in Fraunces serif
- **Tagline**: "Highland Explorer" in JetBrains Mono

### Color Palette

```
Primary Colors (Mountain Greens)
┌─────────────────────────────────────────┐
│ #1B4D2E - Dark Green (Primary)          │
│ #2D7A4A - Mountain Green (Brand)        │
│ #4A9D6F - Light Green (Hover)           │
│ #7BC97F - Lighter Green (Subtle)        │
└─────────────────────────────────────────┘

Secondary Colors (Earth & Sky)
┌─────────────────────────────────────────┐
│ #8B6F47 - Earth Brown                   │
│ #87CEEB - Sky Blue                      │
│ #D4A574 - Golden Accent                 │
└─────────────────────────────────────────┘

Neutral Colors (Natural Tones)
┌─────────────────────────────────────────┐
│ #0F2818 - Very Dark Green               │
│ #1A3A2A - Dark Text                     │
│ #E8F3ED - Light Background              │
│ #F5F9F7 - Lighter Background            │
│ #C8DDD4 - Border Color                  │
└─────────────────────────────────────────┘

Accent Colors
┌─────────────────────────────────────────┐
│ #4A9D6F - Success (Green)               │
│ #D4A574 - Warning (Golden)              │
│ #C85A54 - Danger (Red)                  │
│ #5B8DBE - Info (Blue)                   │
└─────────────────────────────────────────┘
```

## Typography System

```
Display Font: Fraunces (Serif)
├── H1: 48px, 900 weight
├── H2: 32-36px, 700 weight
└── H3: 20-24px, 700 weight

Body Font: Outfit (Sans-serif)
├── Body: 14-16px, 400-500 weight
├── Small: 12-13px, 400 weight
└── Button: 14-16px, 600 weight

Mono Font: JetBrains Mono
└── Code/Technical: 13-14px, 400 weight
```

## Component Library

### Buttons

```
Primary Button
┌──────────────────────────────┐
│ Gradient Background          │
│ #1B4D2E → #2D7A4A           │
│ White Text (#F5F0E8)        │
│ Hover: translateY(-2px)     │
└──────────────────────────────┘

Secondary Button
┌──────────────────────────────┐
│ Light Background (#FAF7F2)   │
│ Golden Text (#C4622D)        │
│ Border: 1px #C4622D         │
│ Hover: Color change         │
└──────────────────────────────┘

Danger Button
┌──────────────────────────────┐
│ Red Background (#C85A54)     │
│ White Text                   │
│ Hover: Darken               │
└──────────────────────────────┘
```

### Cards

```
Standard Card
┌────────────────────────────────┐
│ Background: #F5F9F7            │
│ Border: 1px #C8DDD4           │
│ Radius: 12px                  │
│ Padding: 24-32px              │
│ Hover: translateY(-4px)       │
│         shadow: 0 12px 24px   │
└────────────────────────────────┘
```

### Input Fields

```
Text Input
┌────────────────────────────────┐
│ Background: rgba(245,240,232,0.06) │
│ Border: 1px #C8DDD4           │
│ Radius: 6px                   │
│ Padding: 12px 16px            │
│ Focus Border: #2D7A4A         │
└────────────────────────────────┘
```

## Page Layouts

### Hero Section
```
┌─────────────────────────────────────────┐
│                                         │
│  Background: Mountain Green Gradient    │
│  Color: #F5F0E8                        │
│  Padding: 80px 2rem                    │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Large Heading (48px)            │   │
│  │ Subtitle (18px)                 │   │
│  │ [Primary Button]                │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Content Section
```
┌─────────────────────────────────────────┐
│ Max Width: 1280px                       │
│ Padding: 80px 2rem                      │
│ Background: #F5F9F7 or #E8F3ED         │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ Section Heading (32px)          │    │
│ └─────────────────────────────────┘    │
│                                         │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │  Card 1  │ │  Card 2  │ │  Card 3  │ │
│ └──────────┘ └──────────┘ └──────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### Navigation Bar
```
┌─────────────────────────────────────────┐
│ [Logo] [Nav Links] [User Actions]       │
│                                         │
│ Before Login:                           │
│ [Logo] [About] [Contact] [Terms] [Sign In] │
│                                         │
│ After Login:                            │
│ [Logo] [Explore] [Food] [Guides] [Profile] │
└─────────────────────────────────────────┘
```

### Footer
```
┌─────────────────────────────────────────┐
│ Background: #1A1208                     │
│ Color: #F5F0E8                         │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ [Logo] [Brand Info]             │    │
│ │ [Platform Links] [Company Links] │    │
│ │ [Social Icons] [Newsletter]      │    │
│ └─────────────────────────────────┘    │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ Copyright | Made with ❤️        │    │
│ └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

## Responsive Breakpoints

```
Mobile (≤ 640px)
┌──────────────────┐
│ Single Column    │
│ Full Width       │
│ Compact Spacing  │
│ Hamburger Menu   │
└──────────────────┘

Tablet (641px - 1024px)
┌──────────────────┐
│ 2 Columns        │
│ Adjusted Spacing │
│ Compact Nav      │
│ Touch Friendly   │
└──────────────────┘

Desktop (> 1024px)
┌──────────────────┐
│ 3+ Columns       │
│ Full Layout      │
│ Full Nav         │
│ Optimized        │
└──────────────────┘
```

## Navigation Flow

### Unauthenticated User
```
Home
  ├── About Us
  ├── Contact
  ├── Terms of Service
  ├── Privacy Policy
  ├── Careers
  └── Sign In
```

### Authenticated User
```
Home
  ├── Explore
  ├── Food
  ├── Guides
  ├── Events
  ├── AI Plan
  ├── Profile
  └── Logout
```

### Admin User
```
Home
  ├── Explore
  ├── Food
  ├── Guides
  ├── Events
  ├── AI Plan
  ├── Admin Dashboard
  ├── Profile
  └── Logout
```

## Interaction Patterns

### Hover Effects
```
Buttons:
  Default → Hover: translateY(-2px)
  
Cards:
  Default → Hover: translateY(-4px) + shadow
  
Links:
  Default → Hover: Color change + background
  
Icons:
  Default → Hover: Scale 1.1
```

### Focus States
```
Inputs:
  Default: Border #C8DDD4
  Focus: Border #2D7A4A
  
Buttons:
  Default: Visible background
  Focus: Outline or ring
  
Links:
  Default: Underline
  Focus: Outline
```

### Active States
```
Navigation:
  Inactive: Color #7A6E61, transparent background
  Active: Color #F5F0E8, background #1A1208
  
Tabs:
  Inactive: Light background
  Active: Dark background with indicator
```

## Spacing System

```
Vertical Spacing
┌──────────────────────────────┐
│ 4px   - Extra Small          │
│ 8px   - Small                │
│ 16px  - Medium               │
│ 24px  - Large                │
│ 32px  - Extra Large          │
│ 60px  - Section              │
│ 80px  - Large Section        │
└──────────────────────────────┘

Horizontal Spacing
┌──────────────────────────────┐
│ 2rem  - Container padding    │
│ 1.5rem - Tablet padding      │
│ 1rem  - Mobile padding       │
└──────────────────────────────┘
```

## Shadow System

```
Subtle Shadow
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05)

Medium Shadow
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)

Large Shadow (Card Hover)
box-shadow: 0 12px 24px rgba(45, 122, 74, 0.1)
```

## Animation Timings

```
Fast (Hover Effects)
transition: all 0.15s

Normal (Standard Transitions)
transition: all 0.3s

Slow (Page Transitions)
transition: all 0.5s
```

## Accessibility Features

```
Color Contrast
┌──────────────────────────────┐
│ Normal Text: 4.5:1 ratio     │
│ Large Text: 3:1 ratio        │
│ UI Components: 3:1 ratio     │
└──────────────────────────────┘

Focus Indicators
┌──────────────────────────────┐
│ Visible outline or ring      │
│ Minimum 2px width            │
│ Contrasting color            │
└──────────────────────────────┘

Keyboard Navigation
┌──────────────────────────────┐
│ Tab: Move to next element    │
│ Shift+Tab: Previous element  │
│ Enter: Activate button       │
│ Space: Toggle checkbox       │
└──────────────────────────────┘
```

## File Organization

```
src/
├── pages/
│   ├── Home.tsx
│   ├── Explore.tsx
│   ├── Food.tsx
│   ├── Guides.tsx
│   ├── Events.tsx
│   ├── Profile.tsx
│   ├── Auth.tsx
│   ├── ItineraryGenerator.tsx
│   ├── AdminDashboard.tsx
│   ├── AboutUs.tsx (NEW)
│   ├── Contact.tsx (NEW)
│   ├── TermsOfService.tsx (NEW)
│   ├── PrivacyPolicy.tsx (NEW)
│   └── Careers.tsx (NEW)
├── components/
│   ├── Navbar.tsx (UPDATED)
│   ├── Footer.tsx (UPDATED)
│   └── Layout.tsx
├── contexts/
│   └── FirebaseContext.tsx
├── lib/
│   └── firebase.ts
├── styles/
│   └── (CSS files if needed)
├── App.tsx (UPDATED)
├── theme.ts
├── types.ts
├── main.tsx
├── index.css
├── DESIGN_GUIDE.md (NEW)
├── QUICK_REFERENCE.md (NEW)
└── VISUAL_OVERVIEW.md (NEW)
```

## Design Tokens Summary

```javascript
const designTokens = {
  colors: {
    primary: "#2D7A4A",
    secondary: "#D4A574",
    success: "#4A9D6F",
    warning: "#D4A574",
    danger: "#C85A54",
    info: "#5B8DBE",
    background: "#F5F9F7",
    surface: "#F5F0E8",
    text: "#1A3A2A",
    textSecondary: "#7A6E61",
    border: "#C8DDD4"
  },
  typography: {
    fontFamily: {
      display: "'Fraunces', serif",
      body: "'Outfit', sans-serif",
      mono: "'JetBrains Mono', monospace"
    },
    fontSize: {
      h1: 48,
      h2: 32,
      h3: 20,
      body: 16,
      small: 14
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    section: 60
  },
  borderRadius: {
    sm: 4,
    md: 6,
    lg: 12
  },
  transitions: {
    fast: "0.15s",
    normal: "0.3s",
    slow: "0.5s"
  }
};
```

## Next Steps

1. Review all new pages in browser
2. Test responsive design on mobile/tablet/desktop
3. Verify all navigation links work correctly
4. Check color contrast and accessibility
5. Test form submissions
6. Optimize images and performance
7. Deploy to staging environment
8. Gather user feedback
9. Make refinements based on feedback
10. Deploy to production
