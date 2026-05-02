# BukidGO Design Tokens & Color Reference

## 🎨 Color Palette

### Primary Colors

| Color | Hex | RGB | Usage | Notes |
|-------|-----|-----|-------|-------|
| Deep Forest Green | `#0A3D2F` | rgb(10, 61, 47) | Main brand, text, backgrounds | Represents lush mountains |
| Mountain Green | `#1E4D2B` | rgb(30, 77, 43) | Secondary backgrounds, overlays | Depth and layering |
| Terracotta Red | `#9C2A2A` | rgb(156, 42, 42) | Buttons, accents, highlights | Bukidnon flag red |
| Warm Gold | `#F5C400` | rgb(245, 196, 0) | Accents, badges, highlights | Sunshine & pineapple fields |

### Neutral Colors

| Color | Hex | RGB | Usage | Notes |
|-------|-----|-----|-------|-------|
| Off-White | `#F5F5F0` | rgb(245, 245, 240) | Primary background | Premium, clean feel |
| Light Cream | `#F5E8D5` | rgb(245, 232, 213) | Secondary background | Warm, inviting |
| Border Color | `#E8DCC8` | rgb(232, 220, 200) | Borders, dividers | Subtle, sophisticated |
| Dark Text | `#0A3D2F` | rgb(10, 61, 47) | Primary text | High contrast |

### Semantic Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Success | `#4A9D6F` | Confirmations, positive actions |
| Warning | `#D4A574` | Alerts, cautions |
| Danger | `#C85A54` | Errors, destructive actions |
| Info | `#5B8DBE` | Information, secondary actions |

---

## 🔤 Typography Scale

### Font Families

```css
/* Serif - Headlines */
font-family: 'Playfair Display', Georgia, serif;
font-weights: 700, 900

/* Body - Main text */
font-family: 'Barlow', system-ui, sans-serif;
font-weights: 300, 400, 500, 600, 700

/* Condensed - Labels, tags, CTAs */
font-family: 'Barlow Condensed', system-ui, sans-serif;
font-weights: 400, 600, 700, 800
```

### Font Sizes (Responsive with clamp)

| Element | Desktop | Mobile | Clamp Formula |
|---------|---------|--------|---------------|
| Hero Title | 8rem | 3.2rem | clamp(3.8rem, 10vw, 8rem) |
| Section Title | 4rem | 2.2rem | clamp(2.2rem, 5.5vw, 4rem) |
| Card Title | 2.4rem | 1.8rem | clamp(1.8rem, 4vw, 2.4rem) |
| Body Text | 1rem | 0.9rem | 1rem |
| Small Text | 0.875rem | 0.8rem | 0.875rem |
| Tag/Label | 0.6875rem | 0.6875rem | 0.6875rem |

### Line Heights

```css
Headlines: 1.0 - 1.1 (tight, premium feel)
Body: 1.6 - 1.8 (readable, comfortable)
Tags: 1.0 (compact)
```

### Letter Spacing

```css
Headlines: -0.02em (tight)
Body: 0.3px (subtle)
Tags: 0.25em - 0.4em (uppercase emphasis)
Condensed: 0.12em - 0.2em (uppercase)
```

---

## 📏 Spacing System

### Base Unit: 4px

```
4px   = 1 unit
8px   = 2 units
12px  = 3 units
16px  = 4 units
20px  = 5 units
24px  = 6 units
28px  = 7 units
32px  = 8 units
40px  = 10 units
48px  = 12 units
60px  = 15 units
80px  = 20 units
100px = 25 units
120px = 30 units
```

### Common Spacing Values

| Purpose | Value | Usage |
|---------|-------|-------|
| Padding (Small) | 12px - 16px | Cards, buttons |
| Padding (Medium) | 24px - 32px | Sections |
| Padding (Large) | 80px - 120px | Section padding |
| Gap (Cards) | 3px - 4px | Grid gaps |
| Gap (Elements) | 8px - 12px | Flex gaps |
| Margin (Bottom) | 12px - 24px | Text spacing |

---

## 🎯 Border & Radius

### Border Styles

```css
/* Primary borders */
border: 2px solid #9C2A2A;

/* Secondary borders */
border: 1.5px solid #9C2A2A;

/* Subtle borders */
border: 1px solid #E8DCC8;

/* Accent borders */
border-left: 4px solid #9C2A2A;
border-left: 3px solid #1E4D2B;
```

### Border Radius

```css
/* Minimal (modern aesthetic) */
border-radius: 2px;

/* Circular */
border-radius: 50%;

/* Smooth corners */
border-radius: 8px;
```

---

## 🌟 Shadows

### Shadow Hierarchy

```css
/* Subtle shadow */
box-shadow: 0 4px 16px rgba(10, 61, 47, 0.08);

/* Medium shadow */
box-shadow: 0 12px 32px rgba(10, 61, 47, 0.2);

/* Strong shadow */
box-shadow: 0 28px 72px rgba(10, 61, 47, 0.35);

/* Hero shadow */
box-shadow: 0 24px 72px rgba(10, 61, 47, 0.5);

/* Hover shadow */
box-shadow: 0 8px 24px rgba(156, 42, 42, 0.3);
```

### Shadow Usage

| Shadow | Usage |
|--------|-------|
| 0 4px 16px | Cards, subtle depth |
| 0 12px 32px | Buddy cards, hover states |
| 0 28px 72px | Featured cards, strong emphasis |
| 0 24px 72px | Search bar, hero elements |

---

## ⚡ Transitions & Animations

### Easing Functions

```css
/* Premium easing */
cubic-bezier(0.22, 1, 0.36, 1)

/* Standard easing */
ease-in-out

/* Linear */
linear
```

### Transition Durations

```css
/* Quick interactions */
0.15s - 0.2s (button hovers, color changes)

/* Smooth animations */
0.3s - 0.5s (card lifts, modal opens)

/* Longer animations */
0.7s - 0.8s (page load, complex animations)

/* Continuous animations */
3s - 3.5s (floating, pulsing)
```

### Animation Examples

```css
/* Card hover */
transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), 
            box-shadow 0.3s ease;

/* Button hover */
transition: all 0.2s;

/* Image zoom */
transition: transform 0.8s cubic-bezier(0.22,1,0.36,1);

/* Float animation */
animation: floatY 3.5s ease-in-out infinite;

/* Spin animation */
animation: spin 0.8s linear infinite;
```

---

## 🎬 Keyframe Animations

### Float Animation
```css
@keyframes floatY {
  0%, 100% { transform: translateY(0) translateX(-50%); }
  50% { transform: translateY(-12px) translateX(-50%); }
}
```

### Spin Animation
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Pulse Glow Animation
```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(245,196,0,0.3); }
  50% { box-shadow: 0 0 40px rgba(245,196,0,0.6); }
}
```

---

## 🎨 Gradient Definitions

### Background Gradients

```css
/* Mountain gradient */
background: linear-gradient(135deg, #0A3D2F 0%, #1E4D2B 50%, #0A3D2F 100%);

/* Warm gradient */
background: linear-gradient(135deg, #F5F5F0 0%, #F5E8D5 100%);

/* Button gradient */
background: linear-gradient(135deg, #9C2A2A 0%, #7A1F1F 100%);

/* Overlay gradient (top) */
background: linear-gradient(to top, rgba(10,61,47,0.95) 0%, rgba(10,61,47,0.2) 60%);

/* Overlay gradient (bottom) */
background: linear-gradient(to bottom, rgba(10,61,47,0.92) 0%, rgba(10,61,47,0.65) 50%, rgba(30,77,43,0.88) 100%);
```

---

## 🎭 Pattern Definitions

### Tribal Weave Pattern
```css
background-image:
  repeating-linear-gradient(45deg, rgba(245,196,0,0.04) 0px, rgba(245,196,0,0.04) 1px, transparent 1px, transparent 10px),
  repeating-linear-gradient(-45deg, rgba(245,196,0,0.03) 0px, rgba(245,196,0,0.03) 1px, transparent 1px, transparent 10px);
```

### Lumad Weave Pattern
```css
background-image: 
  repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(156,42,42,0.08) 2px, rgba(156,42,42,0.08) 4px),
  repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(245,196,0,0.06) 2px, rgba(245,196,0,0.06) 4px);
```

### Dot Pattern
```css
background-image: 
  radial-gradient(circle, rgba(156,42,42,0.05) 1px, transparent 1px),
  radial-gradient(circle, rgba(245,196,0,0.03) 2px, transparent 2px);
background-size: 32px 32px, 64px 64px;
```

### Tribe Stripe
```css
background: repeating-linear-gradient(
  90deg,
  #0A3D2F 0px, #0A3D2F 16px,
  #9C2A2A 16px, #9C2A2A 32px,
  #F5C400 32px, #F5C400 48px,
  #1E4D2B 48px, #1E4D2B 64px
);
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
@media (max-width: 768px) {
  /* Mobile styles */
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1024px) {
  /* Tablet styles */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Desktop styles */
}

/* Large Desktop */
@media (min-width: 1440px) {
  /* Large desktop styles */
}
```

---

## 🔧 CSS Classes Reference

### Utility Classes

```css
.bk-serif      /* Playfair Display serif font */
.bk-body       /* Barlow body font */
.bk-cond       /* Barlow Condensed font */
.bk-card       /* Card hover effects */
.bk-img        /* Image zoom on hover */
.bk-scroll     /* Custom scrollbar styling */
.bk-tag        /* Tag/label styling */
.bk-btn-primary    /* Primary button */
.bk-btn-outline    /* Outline button */
.bk-search-bar     /* Search bar styling */
.weave-bg      /* Tribal weave background */
.pattern-overlay   /* Pattern overlay */
.lumad-weave   /* Lumad weave pattern */
.float-anim    /* Float animation */
.pulse-glow    /* Pulse glow animation */
.badge-primary /* Primary badge */
.badge-accent  /* Accent badge */
.gradient-mountain /* Mountain gradient */
.gradient-warm /* Warm gradient */
```

---

## 🎯 Component Sizing

### Button Sizes

```css
/* Primary Button */
padding: 14px 32px;
font-size: 14px;
height: ~48px;

/* Outline Button */
padding: 12px 26px;
font-size: 13px;
height: ~44px;

/* Small Button */
padding: 10px 20px;
font-size: 12px;
height: ~40px;
```

### Card Sizes

```css
/* Featured Card */
height: 580px;
width: 2fr (grid)

/* Secondary Card */
height: 288px;
width: 1fr (grid)

/* Event Card */
width: 340px;
height: 480px;

/* Food Card */
height: 240px (image) + 120px (content)

/* Buddy Card */
width: 240px (min);
height: auto;
```

### Image Sizes

```css
/* Profile Image */
width: 88px;
height: 88px;
border-radius: 50%;

/* Verification Badge */
width: 24px;
height: 24px;
border-radius: 50%;

/* Icon Size */
width: 16px - 24px;
height: 16px - 24px;
```

---

## 🌐 Accessibility

### Color Contrast Ratios

- **Text on Background**: 7:1+ (AAA standard)
- **UI Components**: 4.5:1+ (AA standard)
- **Large Text**: 3:1+ (AA standard)

### Focus States

```css
/* Keyboard focus */
outline: 2px solid #9C2A2A;
outline-offset: 2px;
```

### Semantic HTML

- Use `<button>` for interactive elements
- Use `<a>` for navigation
- Use `<section>` for major sections
- Use `<h1>`, `<h2>`, etc. for headings
- Use `<img>` with alt text for images

---

## 📊 Design Metrics

| Metric | Value |
|--------|-------|
| Max Content Width | 1320px |
| Min Touch Target | 44px × 44px |
| Line Length | 50-75 characters |
| Aspect Ratio (Hero) | 16:9 |
| Aspect Ratio (Cards) | 4:3 to 16:9 |
| Z-Index (Modal) | 50 |
| Z-Index (Navigation) | 10 |

---

**Design System Version**: 1.0
**Last Updated**: May 2, 2026
**Status**: Production Ready ✅
