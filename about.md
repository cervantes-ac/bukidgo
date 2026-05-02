# BukidGo Design System & Page Documentation

## Overview

BukidGo is a Bukidnon-inspired tourism platform featuring a cohesive design system rooted in the region's natural heritage, tribal culture, and mountain landscape. The design emphasizes authenticity, community, and adventure through carefully curated colors, typography, and interactive elements.

---

## Color Palette

### Primary Colors - Mountain Greens
The primary palette draws inspiration from Bukidnon's deep forests and highlands:

- **Deep Forest Green (#0A3D2F)**: The darkest primary color used for hero sections, dark backgrounds, and primary text
- **Forest Green (#1E4D2B)**: Main brand color for primary actions, highlights, and accents
- **Mountain Green (#2D7A4A)**: Used for hover states, secondary accents, and success indicators
- **Light Green (#4A9D6F)**: Lighter forest green for subtle backgrounds and tertiary elements

### Secondary Colors - Earth & Warmth
Warm earth tones and golden accents representing Bukidnon's natural resources:

- **Earth Brown (#8B4513)**: Warm earth brown for secondary elements and borders
- **Warm Brown (#C4622D)**: Warm accent for badges, highlights, and interactive states
- **Golden Accent (#F5C400)**: Bright golden accent for CTAs, highlights, and decorative elements
- **Muted Gold (#D4A574)**: Softer golden tone for secondary accents

### Neutral Colors - Cream Palette
Natural, warm cream tones for backgrounds and text:

- **Very Dark Brown (#1A1208)**: Almost black, used for dark backgrounds and footer
- **Dark Text (#2D2D2D)**: Primary text color
- **Warm Cream (#F5F0E8)**: Light background and card backgrounds
- **Light Cream (#F5F5F0)**: Lighter background for sections
- **Warm Border (#DDD6C8)**: Border and divider color

### Accent Colors
- **Success**: Mountain Green (#2D7A4A)
- **Warning**: Golden Accent (#F5C400)
- **Danger**: Warm Brown (#C4622D)
- **Info**: Mountain Green (#2D7A4A)

---

## Typography

### Font Families

1. **Display Font**: Fraunces (serif)
   - Used for: Headings, titles, hero text
   - Weights: 300, 700, 900
   - Characteristics: Elegant, sophisticated, distinctive

2. **Body Font**: Outfit (sans-serif)
   - Used for: Body text, UI elements, labels
   - Weights: 300, 400, 500, 600, 700
   - Characteristics: Modern, clean, highly readable

3. **Mono Font**: JetBrains Mono (monospace)
   - Used for: Tags, labels, technical text, uppercase accents
   - Weights: 400, 700
   - Characteristics: Technical, precise, distinctive

### Font Sizes & Weights

| Element | Size | Weight | Font | Usage |
|---------|------|--------|------|-------|
| H1 | 48px - 8rem (clamp) | 900 | Fraunces | Hero titles, main page headings |
| H2 | 32-36px | 700 | Fraunces | Section headings |
| H3 | 20-24px | 700 | Fraunces | Subsection headings |
| Body | 14-16px | 400-500 | Outfit | Main content text |
| Small | 12-13px | 400 | Outfit | Secondary text, captions |
| Mono | 13-14px | 400-700 | JetBrains Mono | Tags, labels, technical text |

---

## Component Styling

### Buttons

#### Primary Button
- **Background**: Linear gradient (#9C2A2A to #7A1F1F) - Warm red gradient
- **Color**: #F5F5F0 (cream)
- **Padding**: 12px 24px
- **Border Radius**: 6px
- **Font**: Barlow Condensed, 700 weight, uppercase
- **Hover State**: 
  - Darker gradient (#7A1F1F to #5A1515)
  - Transform: translateY(-2px)
  - Box-shadow: 0 8px 24px rgba(156, 42, 42, 0.4)

#### Secondary/Outline Button
- **Background**: Transparent
- **Color**: #9C2A2A (warm red)
- **Border**: 2px solid #9C2A2A
- **Padding**: 12px 26px
- **Border Radius**: 4px
- **Font**: Barlow Condensed, 700 weight, uppercase
- **Hover State**:
  - Background: #9C2A2A
  - Color: #F5F5F0
  - Transform: translateY(-2px)
  - Box-shadow: 0 8px 24px rgba(156, 42, 42, 0.3)

### Cards

- **Background**: #F5F9F7 (light cream)
- **Border**: 1px solid #C8DDD4 (warm border)
- **Border Radius**: 12px
- **Padding**: 24-32px
- **Hover State**:
  - Transform: translateY(-8px)
  - Box-shadow: 0 28px 72px rgba(10, 61, 47, 0.35)
  - Image scale: 1.08

### Input Fields

- **Background**: rgba(245, 240, 232, 0.06) (semi-transparent cream)
- **Border**: 1px solid #C8DDD4
- **Border Radius**: 4-6px
- **Padding**: 12px 16px
- **Focus Border**: #2D7A4A (mountain green)
- **Font**: Outfit, sans-serif

### Search Bar

- **Background**: #F5F5F0 (light cream)
- **Border**: 2px solid #9C2A2A (warm red)
- **Max Width**: 620px
- **Box Shadow**: 0 12px 40px rgba(10, 61, 47, 0.25)
- **Overflow**: Hidden (for rounded corners)

### Navigation

- **Active State**: Background #1A1208, Color #F5F0E8
- **Hover State**: Background #DDD6C8, Color #1A1208
- **Inactive**: Color #7A6E61

---

## Gradients

- **Mountain Green**: linear-gradient(135deg, #1B4D2E 0%, #2D7A4A 100%)
- **Forest to Sky**: linear-gradient(180deg, #2D7A4A 0%, #87CEEB 100%)
- **Earth to Green**: linear-gradient(135deg, #8B6F47 0%, #4A9D6F 100%)
- **Warm Red**: linear-gradient(135deg, #9C2A2A 0%, #7A1F1F 100%)

---

## Spacing System

| Scale | Value | Usage |
|-------|-------|-------|
| Extra Small | 4px | Micro spacing |
| Small | 8px | Tight spacing |
| Medium | 16px | Standard spacing |
| Large | 24px | Comfortable spacing |
| Extra Large | 32px | Section spacing |
| Section | 60-80px | Major section padding |

---

## Border Radius

| Size | Value | Usage |
|------|-------|-------|
| Small | 4px | Inputs, small buttons |
| Medium | 6px | Buttons, small cards |
| Large | 12px | Cards, containers |

---

## Shadows

| Type | Value | Usage |
|------|-------|-------|
| Subtle | 0 2px 4px rgba(0, 0, 0, 0.05) | Minimal elevation |
| Medium | 0 4px 12px rgba(0, 0, 0, 0.1) | Standard elevation |
| Large | 0 12px 24px rgba(45, 122, 74, 0.1) | Prominent elevation |
| Extra Large | 0 28px 72px rgba(10, 61, 47, 0.35) | Card hover state |

---

## Transitions & Animations

| Speed | Duration | Usage |
|-------|----------|-------|
| Fast | 0.15s | Hover states, quick interactions |
| Normal | 0.3s | Page transitions, standard animations |
| Slow | 0.5s | Entrance animations, emphasis |

### Custom Animations

- **Float Animation**: Vertical floating motion (3.5s loop) - Used for scroll cues
- **Pulse Glow**: Golden glow pulse (3s loop) - Used for emphasis
- **Spin**: 360° rotation - Used for loading indicators

---

## Responsive Breakpoints

| Device | Width | Usage |
|--------|-------|-------|
| Mobile | ≤ 640px | Small screens, phones |
| Tablet | 641px - 1024px | Medium screens, tablets |
| Desktop | > 1024px | Large screens, desktops |

### Mobile Adjustments
- Hero title: 3.2rem (from larger on desktop)
- Stats row: Increased gap (28px)
- Destination grid: 1 column (from 2fr 1fr)
- Food grid: 1 column
- Buddy grid: 2 columns
- Tribe stripe: 6px height (from 8px)

---

## Page Layouts

### Home Page

#### Hero Section
- **Height**: 100vh (full viewport)
- **Background**: Layered image with dark overlay
- **Overlay Gradient**: linear-gradient(160deg, rgba(10,61,47,0.92) 0%, rgba(10,61,47,0.65) 50%, rgba(30,77,43,0.88) 100%)
- **Texture**: Tribal weave pattern overlay with diagonal lines
- **Content Alignment**: Center
- **Padding**: 0 2rem
- **Max Width**: 920px

**Hero Elements:**
- Location badge (top center): Bukidnon · Mindanao · Philippines
- Decorative label: "Highland Heritage Tourism"
- Main title: "Discover Bukidnon" with italic "Bukidnon" in golden
- Subtitle: Descriptive text about the region
- Search bar: Integrated search with explore button
- Stats row: 50+ Destinations, 30+ Food Spots, 7 Tribes, 10+ Local Guides
- Scroll cue: Floating arrow animation at bottom

#### Featured Destinations Section
- **Max Width**: 1320px
- **Padding**: 120px 2rem
- **Layout**: Grid (2fr 1fr with 2 rows)
- **Gap**: 4px between cards
- **First card**: Large (2x2 grid)
- **Other cards**: Smaller (1x1 grid)

**Card Structure:**
- Image with overlay gradient
- Category badge (top left)
- Rating badge (top right)
- Title, location, and arrow button (bottom)

#### Tribal Divider
- Decorative line with rotated diamond shapes
- Colors: Warm red and golden
- Spacing: 18px gap

#### Events Teaser Section
- **Background**: Weave pattern with dark green gradient
- **Decorative circles**: Concentric circles with subtle borders
- **Layout**: Horizontal scroll strip
- **Card width**: 340px
- **Card height**: 480px

**Event Card Structure:**
- Image with overlay
- Month badge (top left, golden)
- Event name, subtitle, and view details link (bottom)

#### Local Eats Section
- **Max Width**: 1320px
- **Padding**: 120px 2rem
- **Layout**: Grid (typically 3 columns)
- **Gap**: 4px

**Food Card Structure:**
- Image with overlay
- Category badge
- Rating
- Name, location, price
- Favorite button
- Reserve button

#### Footer
- **Background**: #1A1208 (very dark brown)
- **Color**: #F5F0E8 (cream)
- **Padding**: 72px 2rem 40px

---

### Guides Page

#### Hero Section
- **Background**: Deep forest green (#0A3D2F)
- **Padding**: 72px 2rem 56px
- **Border Bottom**: 1px solid rgba(197, 221, 212, 0.06)

**Hero Content:**
- Location label: "Mountain Guides · Bukidnon"
- Main title: "Your Local Buddies" with italic "Buddies" in light green
- Subtitle: Description of verified guides
- Stats: Total guides and available guides

#### Filter Bar
- **Position**: Sticky (top: 72px)
- **Background**: rgba(245, 249, 247, 0.96) with backdrop blur
- **Border Bottom**: 1px solid #DDD6C8
- **Padding**: 14px 2rem
- **Z-Index**: 20

**Filter Controls:**
- Search input (with icon)
- Experience dropdown
- Rating dropdown
- Price range slider
- Specialty tags (toggleable)
- Reset button

#### Main Content Area
- **Max Width**: 1280px
- **Padding**: 40px 2rem 80px
- **Layout**: Grid (1fr 400px)
- **Gap**: 32px

**Left Column - Guide List:**
- Table header with columns: Guide, Experience, Rating, Rate
- Rows with:
  - Guide photo (56x56px)
  - Name and specialties
  - Experience years
  - Star rating
  - Price per day
- Selected row: Highlighted with left border and background color

**Right Column - Detail Panel:**
- **Position**: Sticky (top: 140px)
- **Width**: 400px
- **Background**: White
- **Border**: 1px solid #DDD6C8

**Detail Panel Sections:**
- Header: Photo, name, badges, favorite button
- About: Bio text
- Specialties: Tag list
- Reviews: Scrollable review list
- Review form: Rating, title, comment inputs
- Book button: Primary action

---

### Guides Page - Detail Panel States

#### Default State (No Selection)
- Empty state message: "Select a guide to view details"

#### Selected State
- Guide information displayed
- Scrollable content area
- Review form visible
- Book button active

#### Booked State
- Success message with checkmark
- Confirmation text
- Auto-dismisses after 3 seconds

---

## Decorative Elements

### Tribe Stripe
- **Height**: 8px (6px on mobile)
- **Pattern**: Repeating horizontal stripes
- **Colors**: Alternating deep green, warm red, golden, and forest green
- **Usage**: Page dividers, visual breaks

### Weave Pattern
- **Background**: Linear gradient (deep green)
- **Overlay**: Repeating diagonal lines (45° and -45°)
- **Opacity**: 0.04 and 0.03
- **Usage**: Section backgrounds for texture

### Pattern Overlay
- **Type**: Radial gradient dots
- **Sizes**: 1px and 2px circles
- **Opacity**: 0.05 and 0.03
- **Usage**: Subtle texture on sections

### Corner Frame
- **Type**: Decorative corner borders
- **Color**: Warm red (#9C2A2A)
- **Size**: 24x24px
- **Usage**: Card emphasis, special sections

### Diamond Accents
- **Character**: ◆
- **Color**: Warm red (#9C2A2A)
- **Size**: 10px
- **Usage**: List markers, decorative elements

### Tags
- **Font**: Barlow Condensed, 700 weight, uppercase
- **Size**: 11px
- **Letter Spacing**: 0.25em
- **Color**: Warm red (#9C2A2A)
- **Prefix**: Horizontal line (28px × 2px)
- **Usage**: Section labels, category markers

---

## Accessibility

### Contrast Ratios
- **Normal Text**: Minimum 4.5:1 contrast ratio
- **Large Text**: Minimum 3:1 contrast ratio
- **Interactive Elements**: Clearly visible focus states

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus states are clearly visible
- Tab order is logical and intuitive

### Semantic HTML
- Proper heading hierarchy (H1, H2, H3)
- Semantic elements (nav, section, article, footer)
- ARIA labels where needed

### Motion
- Respects `prefers-reduced-motion` preference
- Animations are smooth and purposeful
- No auto-playing animations

---

## Animation Principles

1. **Entrance Animations**: Fade and slide from bottom (0.3-0.8s)
2. **Hover Effects**: Subtle lift and shadow (0.15s)
3. **Transitions**: Smooth cubic-bezier easing (0.22, 1, 0.36, 1)
4. **Loading States**: Spinning indicators with smooth rotation
5. **State Changes**: Quick transitions (0.15-0.3s)

---

## Brand Voice & Tone

- **Modern yet Approachable**: Contemporary design with welcoming feel
- **Adventurous and Inspiring**: Encourages exploration and discovery
- **Community-Focused**: Emphasizes local guides and authentic experiences
- **Sustainable and Responsible**: Respects local culture and environment
- **Local and Authentic**: Celebrates Bukidnon's unique heritage

---

## Design System Usage Guidelines

### When to Use Each Color

| Color | Usage |
|-------|-------|
| Deep Forest Green | Dark backgrounds, primary text, hero sections |
| Forest Green | Primary actions, main highlights |
| Mountain Green | Hover states, success indicators |
| Light Green | Subtle backgrounds, tertiary elements |
| Warm Red | Primary buttons, important accents |
| Golden Accent | CTAs, highlights, decorative elements |
| Cream | Backgrounds, card backgrounds |
| Dark Brown | Footer, dark sections |

### When to Use Each Font

| Font | Usage |
|------|-------|
| Fraunces | Headings, titles, hero text, emphasis |
| Outfit | Body text, UI elements, labels, general content |
| JetBrains Mono | Tags, labels, technical text, uppercase accents |

### Component Hierarchy

1. **Primary Actions**: Warm red gradient buttons
2. **Secondary Actions**: Outline buttons with warm red
3. **Tertiary Actions**: Text links or subtle buttons
4. **Cards**: Elevated with shadow, hover lift effect
5. **Inputs**: Subtle background with clear focus state

---

## Performance Considerations

- **Images**: Optimized with Unsplash (auto-format, fit-crop, quality 80)
- **Animations**: GPU-accelerated transforms (translateY, scale)
- **Lazy Loading**: Images load on demand
- **Responsive Images**: Clamp() for fluid typography
- **Backdrop Blur**: Used sparingly for performance

---

## Future Enhancements

- Dark mode variant
- Additional color themes (seasonal)
- Expanded animation library
- Micro-interactions for feedback
- Advanced accessibility features
- Internationalization support

---

## Summary

BukidGo's design system creates a cohesive, authentic experience that celebrates Bukidnon's natural beauty and cultural heritage. Through carefully chosen colors, typography, and interactive elements, the platform invites users to explore, connect with local guides, and discover authentic experiences in the highlands of Mindanao.
