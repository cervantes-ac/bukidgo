# BukidGo Design System

## Color Palette

### Primary Colors
- **Forest Green**: `#1a5d1a` - Main brand color, represents nature
- **Earth Brown**: `#8b4513` - Secondary color, represents soil/earth
- **Sky Blue**: `#4a90e2` - Accent color, represents sky/water
- **Sunset Orange**: `#ff6b35` - Highlight color, represents sunsets

### Neutral Colors
- **Linen White**: `#f8f4e5` - Background color
- **Clay Gray**: `#d4c9bc` - Border/divider color
- **Stone Gray**: `#8a7f70` - Text color
- **Charcoal Black**: `#2d2d2d` - Headings color

### Gradient Combinations
1. `linear-gradient(135deg, #1a5d1a, #4a90e2)` - Nature to Sky
2. `linear-gradient(135deg, #8b4513, #ff6b35)` - Earth to Sunset
3. `linear-gradient(135deg, #4a90e2, #1a5d1a)` - Sky to Forest

## Typography

### Font Families
- **Headings**: 'Playfair Display', serif - Elegant and sophisticated
- **Body**: 'DM Sans', sans-serif - Clean and readable
- **Monospace**: 'Space Mono', monospace - For technical elements
- **Display**: 'Syne', sans-serif - For large hero text

### Font Sizes
- **Hero**: `clamp(3rem, 8vw, 6rem)` - Large, impactful
- **H1**: `clamp(2rem, 5vw, 3.5rem)` - Page titles
- **H2**: `clamp(1.5rem, 4vw, 2.5rem)` - Section titles
- **H3**: `clamp(1.25rem, 3vw, 2rem)` - Subsection titles
- **Body**: `1rem` - Regular text
- **Small**: `0.875rem` - Captions, labels
- **Micro**: `0.75rem` - Tiny labels, badges

## Spacing System
- **Base Unit**: `0.25rem` (4px)
- **Scale**: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128

## Border Radius
- **Small**: `0.5rem` (8px) - Buttons, small elements
- **Medium**: `1rem` (16px) - Cards, inputs
- **Large**: `2rem` (32px) - Large cards, containers
- **Extra Large**: `3rem` (48px) - Hero sections, modals
- **Full**: `9999px` - Circles, pills

## Shadows
- **Small**: `0 2px 8px rgba(0,0,0,0.08)`
- **Medium**: `0 4px 16px rgba(0,0,0,0.12)`
- **Large**: `0 8px 32px rgba(0,0,0,0.16)`
- **Glow**: `0 0 20px rgba(26,93,26,0.15)` - Green glow
- **Glow Blue**: `0 0 20px rgba(74,144,226,0.15)` - Blue glow

## Animation
- **Duration**: Base 0.3s, Fast 0.15s, Slow 0.5s
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` - Smooth acceleration
- **Hover Scale**: `scale(1.02)` - Subtle growth
- **Hover Translate**: `translateY(-2px)` - Lift effect
- **Focus Ring**: `0 0 0 3px rgba(26,93,26,0.2)` - Accessible focus

## Component Patterns

### Cards
- **Background**: White or subtle gradient
- **Border**: 1px solid Clay Gray
- **Border Radius**: Medium (1rem)
- **Shadow**: Medium shadow
- **Hover**: Lift + Large shadow
- **Transition**: All 0.3s ease

### Buttons
- **Primary**: Forest Green background, white text, Medium radius
- **Secondary**: Transparent background, Forest Green border/text, Medium radius
- **Tertiary**: Transparent background, Stone Gray text, no border
- **Hover**: Scale 1.02, translateY(-1px), shadow
- **Active**: Scale 0.98

### Inputs
- **Background**: Linen White
- **Border**: 1px solid Clay Gray
- **Border Radius**: Medium (1rem)
- **Focus**: 2px solid Forest Green, glow shadow
- **Placeholder**: Stone Gray at 60% opacity

### Navigation
- **Active State**: Forest Green text, bottom border
- **Hover**: Earth Brown text
- **Transition**: Color 0.2s ease

## Layout Grid
- **Container**: max-width 7xl (1280px), centered
- **Gutters**: 1rem mobile, 1.5rem tablet, 2rem desktop
- **Columns**: 12-column grid
- **Breakpoints**: sm:640px, md:768px, lg:1024px, xl:1280px

## Iconography
- **Size**: Small (16px), Medium (20px), Large (24px)
- **Color**: Inherit from text or use Forest Green
- **Stroke Width**: 1.5px for consistency
- **Animation**: Rotate, scale, or fade on interaction

## Accessibility
- **Contrast Ratio**: Minimum 4.5:1 for text
- **Focus States**: Visible outline with glow
- **Reduced Motion**: Respects prefers-reduced-motion
- **Keyboard Navigation**: Full support
- **Screen Reader**: Semantic HTML, ARIA labels