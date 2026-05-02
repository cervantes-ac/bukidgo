# BukidGo Theme Refactor - Logo-Inspired Design System

## Overview
The entire BukidGo design system has been refactored to align with the official BukidGo logo. The new theme features a cohesive color palette extracted from the logo's visual identity.

## Color Palette

### Primary Colors - Deep Forest
- **Forest Dark**: `#0A3D2F` - Deep forest green (logo primary)
- **Forest**: `#1E4D2B` - Rich forest green
- **Forest Light**: `#2D7A4A` - Mountain green
- **Forest Lighter**: `#4A9D6F` - Light forest green

### Secondary Colors - Earth & Warmth
- **Earth Brown**: `#8B4513` - Warm earth brown (logo accent)
- **Earth Warm**: `#C4622D` - Warm brown accent
- **Gold**: `#F5C400` - Golden accent (logo highlight)
- **Gold Muted**: `#D4A574` - Muted golden

### Neutral Colors - Cream Palette
- **Brown Dark**: `#1A1208` - Very dark brown (almost black)
- **Charcoal**: `#2D2D2D` - Dark text
- **Cream**: `#F5F0E8` - Warm cream background
- **Cream Light**: `#F5F5F0` - Light cream background
- **Border**: `#DDD6C8` - Warm border color

## Updated Files

### 1. `src/theme.ts`
- Updated `BUKIDNON_THEME` object with new color values
- Updated `colors` export with logo-inspired palette
- Removed outdated sky blue and sunset colors
- Added warm earth and golden accent colors

### 2. `src/styles/design-system.css`
- Updated CSS custom properties (--color-*) to match new palette
- Updated gradients:
  - `--gradient-forest`: Deep forest gradient
  - `--gradient-earth-gold`: Earth to gold gradient
  - `--gradient-forest-warm`: Forest to warm brown gradient
- Updated all utility classes to use new color variables
- Updated shadows to use forest green tones
- Updated scrollbar styling with warm colors

### 3. `src/index.css`
- Updated Tailwind theme colors to match new palette
- Changed background from linen to cream-light
- Updated text colors to charcoal

### 4. `src/components/Navbar.tsx`
- **Logo Update**: Replaced icon-based logo with actual BukidGo logo image
- Logo now displays: `/img/BukidGO/BukidGO_logo.png`
- Removed Mountain icon import (no longer needed)
- Logo scales responsively based on device type

## Key Changes

### Visual Improvements
1. **Cohesive Brand Identity**: All colors now derive from the official logo
2. **Warm, Inviting Palette**: Earth tones and golden accents create warmth
3. **Better Contrast**: Deep forest on cream backgrounds provides excellent readability
4. **Professional Appearance**: Consistent use of warm neutrals throughout

### Component Updates
- Buttons now use forest green gradients
- Cards use warm borders and shadows
- Badges support forest, earth, and gold variants
- Input focus states use forest green
- Scrollbars use warm earth tones

## Gradient Options

Three main gradients are now available:
1. **Forest Gradient**: `linear-gradient(135deg, #0A3D2F, #1E4D2B)`
2. **Earth-Gold Gradient**: `linear-gradient(135deg, #8B4513, #F5C400)`
3. **Forest-Warm Gradient**: `linear-gradient(135deg, #1E4D2B, #C4622D)`

## Usage Examples

### Using New Colors in Components
```tsx
// Using CSS variables
style={{ color: 'var(--color-forest-dark)' }}

// Using utility classes
className="text-forest-dark bg-cream"

// Using theme object
import { colors } from '../theme';
style={{ color: colors.deepForest }}
```

### Applying Gradients
```tsx
// CSS variable
style={{ background: 'var(--gradient-forest)' }}

// Utility class
className="bg-gradient-forest"
```

## Responsive Design
The navbar logo now scales appropriately:
- **Mobile**: 32px
- **Tablet**: 36px
- **Desktop**: 40px

## Accessibility
- All color combinations maintain WCAG AA contrast ratios
- Focus states use forest green outline
- Reduced motion preferences are respected
- Scrollbar styling remains accessible

## Migration Notes
If you have custom components using old colors, update them as follows:
- `#1B4D2E` → `#0A3D2F` (dark green)
- `#2D7A4A` → `#1E4D2B` (main green)
- `#8B6F47` → `#8B4513` (earth brown)
- `#87CEEB` → `#C4622D` (warm accent)
- `#E8F3ED` → `#F5F0E8` (light background)
- `#F5F9F7` → `#F5F5F0` (lighter background)
- `#C8DDD4` → `#DDD6C8` (border)
