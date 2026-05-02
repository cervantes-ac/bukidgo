# BukidGo Theme - Quick Reference Guide

## Color Palette at a Glance

### Primary Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Forest Dark | `#0A3D2F` | Primary brand, headers, dark elements |
| Forest | `#1E4D2B` | Secondary brand, buttons, accents |
| Forest Light | `#2D7A4A` | Hover states, lighter elements |
| Forest Lighter | `#4A9D6F` | Disabled states, subtle backgrounds |

### Secondary Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Earth Brown | `#8B4513` | Warm accents, secondary buttons |
| Earth Warm | `#C4622D` | Primary accent, CTAs, highlights |
| Gold | `#F5C400` | Special highlights, badges |
| Gold Muted | `#D4A574` | Subtle accents, secondary highlights |

### Neutral Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Brown Dark | `#1A1208` | Dark backgrounds, footer |
| Charcoal | `#2D2D2D` | Body text, primary text |
| Cream | `#F5F0E8` | Warm background, cards |
| Cream Light | `#F5F5F0` | Page background, light surfaces |
| Border | `#DDD6C8` | Borders, dividers, subtle lines |

## CSS Variables

### Using in CSS
```css
/* Colors */
color: var(--color-forest-dark);
background: var(--color-cream);
border-color: var(--color-border);

/* Gradients */
background: var(--gradient-forest);
background: var(--gradient-earth-gold);

/* Shadows */
box-shadow: var(--shadow-md);
box-shadow: var(--shadow-glow);

/* Spacing */
padding: var(--space-4);
margin: var(--space-8);

/* Border Radius */
border-radius: var(--radius-md);

/* Typography */
font-family: var(--font-heading);
font-size: var(--text-h1);
```

## Utility Classes

### Text Colors
```tsx
className="text-forest-dark"      // #0A3D2F
className="text-forest"           // #1E4D2B
className="text-earth"            // #8B4513
className="text-earth-warm"       // #C4622D
className="text-gold"             // #F5C400
className="text-charcoal"         // #2D2D2D
```

### Background Colors
```tsx
className="bg-forest-dark"        // #0A3D2F
className="bg-forest"             // #1E4D2B
className="bg-cream"              // #F5F0E8
className="bg-white"              // #FFFFFF
```

### Gradients
```tsx
className="bg-gradient-forest"    // Forest gradient
className="bg-gradient-earth-gold" // Earth to gold
className="bg-gradient-forest-warm" // Forest to warm
```

### Shadows
```tsx
className="shadow-sm"             // Small shadow
className="shadow-md"             // Medium shadow
className="shadow-lg"             // Large shadow
className="shadow-glow"           // Forest glow
className="shadow-glow-gold"      // Gold glow
```

## TypeScript Usage

### Importing Colors
```tsx
import { colors, BUKIDNON_THEME } from '../theme';

// Using colors object
style={{ color: colors.deepForest }}
style={{ background: colors.creamBg }}

// Using theme object
style={{ color: BUKIDNON_THEME.primary.dark }}
style={{ background: BUKIDNON_THEME.secondary.earth }}
```

## Common Patterns

### Button Styling
```tsx
// Primary Button
style={{
  background: 'var(--gradient-forest)',
  color: '#F5F0E8',
  border: 'none'
}}

// Secondary Button
style={{
  background: 'transparent',
  color: '#0A3D2F',
  border: '2px solid #0A3D2F'
}}

// Accent Button
style={{
  background: '#C4622D',
  color: '#F5F0E8',
  border: 'none'
}}
```

### Card Styling
```tsx
style={{
  background: '#FFFFFF',
  border: '1px solid #DDD6C8',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-md)',
  padding: 'var(--space-6)'
}}
```

### Input Styling
```tsx
style={{
  background: '#F5F0E8',
  border: '1px solid #DDD6C8',
  color: '#2D2D2D',
  padding: 'var(--space-4)',
  borderRadius: 'var(--radius-md)'
}}

// Focus state
onFocus={(e) => e.currentTarget.style.borderColor = '#0A3D2F'}
```

### Hero Section
```tsx
style={{
  background: 'linear-gradient(135deg, #0A3D2F 0%, #1E4D2B 100%)',
  color: '#F5F0E8',
  padding: 'var(--space-16)'
}}
```

## Responsive Design

### Mobile-First Approach
```tsx
// Mobile (default)
style={{ fontSize: 14 }}

// Tablet (768px+)
@media (min-width: 768px) {
  fontSize: 16px;
}

// Desktop (1024px+)
@media (min-width: 1024px) {
  fontSize: 18px;
}
```

## Accessibility

### Color Contrast
- ✅ Forest Dark (#0A3D2F) on Cream (#F5F0E8): 11.5:1
- ✅ Charcoal (#2D2D2D) on Cream (#F5F0E8): 12.8:1
- ✅ Earth Warm (#C4622D) on White (#FFFFFF): 5.2:1

### Focus States
```tsx
// Always include visible focus state
onFocus={(e) => {
  e.currentTarget.style.outline = '2px solid #0A3D2F';
  e.currentTarget.style.outlineOffset = '2px';
}}
```

## Animation & Transitions

### Smooth Transitions
```tsx
style={{
  transition: 'all var(--transition-base)',
  // or
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
}}
```

### Hover Effects
```tsx
onMouseEnter={(e) => {
  e.currentTarget.style.transform = 'translateY(-4px)';
  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
}}

onMouseLeave={(e) => {
  e.currentTarget.style.transform = 'translateY(0)';
  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
}}
```

## Typography

### Font Families
```tsx
// Headings
fontFamily: "'Fraunces', Georgia, serif"

// Body
fontFamily: "'Outfit', system-ui, sans-serif"

// Monospace
fontFamily: "'JetBrains Mono', monospace"
```

### Font Sizes
```tsx
// Using CSS variables
fontSize: 'var(--text-h1)'      // 2rem - 3.5rem
fontSize: 'var(--text-h2)'      // 1.5rem - 2.5rem
fontSize: 'var(--text-h3)'      // 1.25rem - 2rem
fontSize: 'var(--text-body)'    // 1rem
fontSize: 'var(--text-small)'   // 0.875rem
fontSize: 'var(--text-micro)'   // 0.75rem
```

## Spacing Scale

```tsx
var(--space-1)   // 0.25rem (4px)
var(--space-2)   // 0.5rem (8px)
var(--space-3)   // 0.75rem (12px)
var(--space-4)   // 1rem (16px)
var(--space-6)   // 1.5rem (24px)
var(--space-8)   // 2rem (32px)
var(--space-12)  // 3rem (48px)
var(--space-16)  // 4rem (64px)
```

## Border Radius

```tsx
var(--radius-sm)   // 0.5rem
var(--radius-md)   // 1rem
var(--radius-lg)   // 2rem
var(--radius-xl)   // 3rem
var(--radius-full) // 9999px
```

## Common Mistakes to Avoid

❌ **Don't**: Use old colors like `#1B4D2E`, `#87CEEB`, `#E8F3ED`
✅ **Do**: Use new colors like `#0A3D2F`, `#C4622D`, `#F5F0E8`

❌ **Don't**: Create custom colors not in the palette
✅ **Do**: Use colors from the defined palette

❌ **Don't**: Hardcode color values
✅ **Do**: Use CSS variables or utility classes

❌ **Don't**: Forget focus states for accessibility
✅ **Do**: Always include visible focus indicators

❌ **Don't**: Use colors without sufficient contrast
✅ **Do**: Verify WCAG AA compliance

## Need Help?

- Check `src/theme.ts` for the complete color object
- Review `src/styles/design-system.css` for all CSS variables
- Look at existing components for usage examples
- Refer to `src/THEME_REFACTOR_COMPLETE.md` for detailed documentation

---

**Last Updated**: May 2, 2026
**Version**: 1.0.0
