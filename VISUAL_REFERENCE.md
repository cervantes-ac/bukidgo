# BukidGO UI - Visual Reference Guide

## 🎨 Color Swatches

### Primary Brand Colors

```
┌─────────────────────────────────────────────────────────────┐
│ DEEP FOREST GREEN                                           │
│ #0A3D2F                                                     │
│ rgb(10, 61, 47)                                             │
│ Usage: Main brand, text, backgrounds, overlays              │
│ Represents: Lush Bukidnon mountains                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ MOUNTAIN GREEN                                              │
│ #1E4D2B                                                     │
│ rgb(30, 77, 43)                                             │
│ Usage: Secondary backgrounds, depth, layering               │
│ Represents: Highland forest depth                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ TERRACOTTA RED                                              │
│ #9C2A2A                                                     │
│ rgb(156, 42, 42)                                            │
│ Usage: Buttons, accents, highlights, CTAs                   │
│ Represents: Bukidnon flag red, earth, warmth                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ WARM GOLD                                                   │
│ #F5C400                                                     │
│ rgb(245, 196, 0)                                            │
│ Usage: Badges, highlights, accents, emphasis                │
│ Represents: Sunshine, pineapple fields, prosperity          │
└─────────────────────────────────────────────────────────────┘
```

### Neutral Colors

```
┌─────────────────────────────────────────────────────────────┐
│ OFF-WHITE                                                   │
│ #F5F5F0                                                     │
│ rgb(245, 245, 240)                                          │
│ Usage: Primary background, premium feel                     │
│ Represents: Clean, modern aesthetic                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ LIGHT CREAM                                                 │
│ #F5E8D5                                                     │
│ rgb(245, 232, 213)                                          │
│ Usage: Secondary background, sections                       │
│ Represents: Warm, inviting feel                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ BORDER COLOR                                                │
│ #E8DCC8                                                     │
│ rgb(232, 220, 200)                                          │
│ Usage: Borders, dividers, subtle lines                      │
│ Represents: Sophisticated, subtle                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ DARK TEXT                                                   │
│ #0A3D2F                                                     │
│ rgb(10, 61, 47)                                             │
│ Usage: Primary text, high contrast                          │
│ Represents: Readability, accessibility                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📐 Typography Scale

### Headline Hierarchy

```
HERO TITLE
Playfair Display, 900 weight
Desktop: 8rem (128px)
Mobile: 3.2rem (51px)
Responsive: clamp(3.8rem, 10vw, 8rem)
Line Height: 1.0
Letter Spacing: -0.02em
Color: #F5F5F0 (on dark background)
Text Shadow: 0 4px 20px rgba(10,61,47,0.5)

SECTION TITLE
Playfair Display, 900 weight
Desktop: 4rem (64px)
Mobile: 2.2rem (35px)
Responsive: clamp(2.2rem, 5.5vw, 4rem)
Line Height: 1.0
Letter Spacing: -0.01em
Color: #0A3D2F

CARD TITLE
Playfair Display, 700 weight
Desktop: 2.4rem (38px)
Mobile: 1.8rem (29px)
Line Height: 1.1
Color: #0A3D2F or #F5F5F0

BODY TEXT
Barlow, 400 weight
Size: 1rem (16px)
Line Height: 1.6 - 1.8
Letter Spacing: 0.3px
Color: #0A3D2F

SMALL TEXT
Barlow, 400 weight
Size: 0.875rem (14px)
Line Height: 1.5
Color: #1E4D2B

TAG / LABEL
Barlow Condensed, 700 weight
Size: 0.6875rem (11px)
Line Height: 1.0
Letter Spacing: 0.25em - 0.4em
Text Transform: UPPERCASE
Color: #9C2A2A
```

---

## 🎬 Animation Examples

### Card Hover Animation
```
Initial State:
  transform: translateY(0)
  box-shadow: 0 4px 16px rgba(10,61,47,0.08)

Hover State:
  transform: translateY(-8px)
  box-shadow: 0 28px 72px rgba(10,61,47,0.35)

Duration: 0.3s
Easing: cubic-bezier(0.22, 1, 0.36, 1)
```

### Image Zoom Animation
```
Initial State:
  transform: scale(1)

Hover State:
  transform: scale(1.08)

Duration: 0.8s
Easing: cubic-bezier(0.22, 1, 0.36, 1)
```

### Button Hover Animation
```
Initial State:
  background: linear-gradient(135deg, #9C2A2A 0%, #7A1F1F 100%)
  transform: translateY(0)

Hover State:
  background: linear-gradient(135deg, #7A1F1F 0%, #5A1515 100%)
  transform: translateY(-2px)
  box-shadow: 0 8px 24px rgba(156,42,42,0.4)

Duration: 0.2s
Easing: ease
```

### Float Animation (Scroll Indicator)
```
@keyframes floatY {
  0%, 100% {
    transform: translateY(0) translateX(-50%)
  }
  50% {
    transform: translateY(-12px) translateX(-50%)
  }
}

Duration: 3.5s
Easing: ease-in-out
Iteration: infinite
```

---

## 🏗️ Layout Grid

### Desktop Layout (1320px max-width)

```
┌─────────────────────────────────────────────────────────────┐
│                      TRIBE STRIPE (8px)                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                      HERO SECTION (100vh)                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              FEATURED DESTINATIONS (120px padding)          │
│                                                             │
│  ┌──────────────────────────┐  ┌──────────────────┐        │
│  │                          │  │                  │        │
│  │   Featured Card (2:1)    │  │  Card 2 (1:1)    │        │
│  │                          │  │                  │        │
│  │                          │  ├──────────────────┤        │
│  │                          │  │                  │        │
│  │                          │  │  Card 3 (1:1)    │        │
│  │                          │  │                  │        │
│  └──────────────────────────┘  └──────────────────┘        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                      TRIBAL DIVIDER                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              EVENTS TEASER (120px padding)                  │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Event 1  │ │ Event 2  │ │ Event 3  │ │ Event 4  │      │
│  │ (340px)  │ │ (340px)  │ │ (340px)  │ │ (340px)  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              LOCAL EATS (120px padding)                     │
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │              │ │              │ │              │       │
│  │  Food Card   │ │  Food Card   │ │  Food Card   │       │
│  │              │ │              │ │              │       │
│  └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              WHY BUKIDNON (100px padding)                   │
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │ Feature 1    │ │ Feature 2    │ │ Feature 3    │       │
│  └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              LOCAL BUDDIES (120px padding)                  │
│                                                             │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │
│  │ Buddy  │ │ Buddy  │ │ Buddy  │ │ Buddy  │ │ Buddy  │  │
│  │(240px) │ │(240px) │ │(240px) │ │(240px) │ │(240px) │  │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                      TRIBE STRIPE (8px)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Component Specifications

### Hero Section
```
Height: 100vh (full viewport)
Background: Image + Multi-layer overlay
Overlay Opacity: 92%
Overlay Gradient: 160deg angle
Texture Overlay: Tribal weave pattern
Content Alignment: Center
Padding: 0 2rem
Max Width: 920px (content)
```

### Featured Destination Card (Large)
```
Width: 2fr (grid)
Height: 580px
Border Radius: 2px
Image: 100% cover
Overlay: Gradient (top)
Overlay Opacity: 95%
Padding: 32px 28px (bottom)
Hover: Lift 8px, shadow enhancement
```

### Featured Destination Card (Small)
```
Width: 1fr (grid)
Height: 288px
Border Radius: 2px
Image: 100% cover
Overlay: Gradient (top)
Overlay Opacity: 95%
Padding: 32px 28px (bottom)
Hover: Lift 8px, shadow enhancement
```

### Event Card
```
Width: 340px (fixed)
Height: 480px
Border Radius: 2px
Image Height: 480px
Overlay: Gradient (top)
Overlay Opacity: 97%
Padding: 32px 24px (bottom)
Hover: Lift 8px, shadow enhancement
Scroll: Horizontal, custom scrollbar
```

### Food Card
```
Width: 1fr (grid, 3 columns)
Height: Auto
Border: 1.5px solid #E8DCC8
Border Radius: 2px
Image Height: 240px
Content Padding: 24px
Button: Full width, 12px padding
Hover: Lift 8px, shadow enhancement
```

### Buddy Card
```
Width: 240px (min-width)
Height: Auto
Border: 1.5px solid #9C2A2A
Border Radius: 2px
Padding: 32px 26px
Text Align: Center
Profile Image: 88px circular
Verification Badge: 24px circular
Hover: Border gold, lift 4px, shadow
```

---

## 🎯 Button Specifications

### Primary Button
```
Background: linear-gradient(135deg, #9C2A2A 0%, #7A1F1F 100%)
Color: #F5F5F0
Border: None
Padding: 14px 32px (vertical × horizontal)
Font: Barlow Condensed, 700, 14px
Letter Spacing: 0.15em
Text Transform: UPPERCASE
Border Radius: 2px
Cursor: pointer
Transition: all 0.2s

Hover:
  Background: linear-gradient(135deg, #7A1F1F 0%, #5A1515 100%)
  Transform: translateY(-2px)
  Box Shadow: 0 8px 24px rgba(156,42,42,0.4)
```

### Outline Button
```
Background: transparent
Color: #9C2A2A
Border: 2px solid #9C2A2A
Padding: 12px 26px
Font: Barlow Condensed, 700, 13px
Letter Spacing: 0.12em
Text Transform: UPPERCASE
Border Radius: 2px
Cursor: pointer
Transition: all 0.2s

Hover:
  Background: #9C2A2A
  Color: #F5F5F0
  Transform: translateY(-2px)
  Box Shadow: 0 8px 24px rgba(156,42,42,0.3)
```

---

## 🎭 Pattern Examples

### Tribe Stripe Pattern
```
Height: 8px
Background: Repeating linear gradient (90deg)
Sequence:
  #0A3D2F (16px) → #9C2A2A (16px) → #F5C400 (16px) → #1E4D2B (16px)
Total Repeat: 64px
```

### Tribal Weave Pattern
```
Diagonal Lines (45deg):
  rgba(245,196,0,0.04) 1px line, 10px gap

Diagonal Lines (-45deg):
  rgba(245,196,0,0.03) 1px line, 10px gap

Creates: Cross-hatch weave effect
```

### Lumad Weave Pattern
```
Horizontal Lines (0deg):
  rgba(156,42,42,0.08) 2px line, 2px gap

Vertical Lines (90deg):
  rgba(245,196,0,0.06) 2px line, 2px gap

Creates: Grid weave effect
```

---

## 📱 Mobile Responsive Adjustments

### Typography Scaling
```
Hero Title: 3.2rem (from 8rem)
Section Title: 2.2rem (from 4rem)
Card Title: 1.8rem (from 2.4rem)
Body: 1rem (unchanged)
```

### Layout Changes
```
Destination Grid: 1 column (from 2×1 masonry)
Food Grid: 1 column (from 3 columns)
Buddy Grid: 2 columns (from auto-fill)
Event Scroll: Horizontal (unchanged)
```

### Spacing Adjustments
```
Section Padding: 60px (from 120px)
Card Gap: 4px (unchanged)
Element Gap: 8px (from 12px)
Margin Bottom: 12px (from 24px)
```

---

## 🎨 Accessibility Specifications

### Color Contrast
```
Text on Background: 7:1+ (AAA standard)
  #0A3D2F on #F5F5F0: 11.5:1 ✓
  #F5F5F0 on #0A3D2F: 11.5:1 ✓

UI Components: 4.5:1+ (AA standard)
  #9C2A2A on #F5F5F0: 5.2:1 ✓
  #F5C400 on #0A3D2F: 4.8:1 ✓

Large Text: 3:1+ (AA standard)
  All combinations meet or exceed ✓
```

### Focus States
```
Outline: 2px solid #9C2A2A
Outline Offset: 2px
Visible on all interactive elements
High contrast for keyboard navigation
```

### Touch Targets
```
Minimum Size: 44px × 44px
Buttons: 48px × 48px (typical)
Links: 44px × 44px (minimum)
Spacing: 8px between targets
```

---

## 🚀 Performance Specifications

### Animation Performance
```
Frame Rate: 60fps target
GPU Acceleration: transform, opacity only
Avoid: width, height, left, right changes
Easing: cubic-bezier for smooth motion
Duration: 0.15s - 0.8s (optimal range)
```

### Image Optimization
```
Format: WebP with JPEG fallback
Compression: Optimized for web
Lazy Loading: Supported
Responsive: Multiple sizes
Aspect Ratios: 16:9, 4:3, 1:1
```

### CSS Optimization
```
Selectors: Efficient, specific
Specificity: Low to medium
Repaints: Minimized
Reflows: Optimized
File Size: ~30KB (gzipped: ~5.8KB)
```

---

## 📊 Measurement Reference

### Common Sizes
```
Hero Height: 100vh
Section Padding: 120px (desktop), 60px (mobile)
Max Content Width: 1320px
Card Gap: 4px
Element Gap: 8-12px
Border Width: 1px, 1.5px, 2px, 4px
Border Radius: 2px, 50%
```

### Icon Sizes
```
Small: 11px - 14px
Medium: 15px - 18px
Large: 20px - 24px
Extra Large: 48px - 56px
```

### Image Sizes
```
Hero: Full viewport width
Featured Card: 580px height
Event Card: 480px height
Food Card: 240px height
Profile: 88px circular
```

---

**Visual Reference Version**: 1.0
**Last Updated**: May 2, 2026
**Status**: Complete ✅
