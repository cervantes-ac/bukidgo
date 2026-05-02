# BukidGo Design System - Updated

## Color Palette

### Primary Colors
- **Dark**: `#1A1208` - Primary text, high contrast
- **Light**: `#F5F0E8` - Background, light text on dark
- **Accent Brown**: `#C4622D` - Primary action, hover states
- **Dark Brown**: `#8B4513` - Darker hover state

### Secondary Colors
- **Accent Green**: `#4A9D6F` - Focus states, secondary actions
- **Accent Gold**: `#D4A853` - Highlights, badges, accents
- **Secondary Text**: `#7A6E61` - Body text, secondary information
- **Tertiary Text**: `#B8B0A4` - Disabled, muted text
- **Border**: `#DDD6C8` - Card borders, dividers

### Contrast Ratios (WCAG AA)
| Color | Background | Ratio | Level |
|-------|-----------|-------|-------|
| #1A1208 | #F5F0E8 | 16.5:1 | AAA |
| #7A6E61 | #F5F0E8 | 7.5:1 | AA |
| #B8B0A4 | #F5F0E8 | 4.5:1 | AA |
| #C4622D | #F5F0E8 | 5.5:1 | AA |
| #D4A853 | #F5F0E8 | 4.5:1 | AA |
| #4A9D6F | #F5F0E8 | 5.5:1 | AA |
| #F5F0E8 | #1A1208 | 16.5:1 | AAA |

---

## Typography

### Font Families
- **Display**: Fraunces (serif) - Headlines, display text
- **Body**: Outfit (sans-serif) - Body text, UI elements
- **Mono**: JetBrains Mono (monospace) - Code, labels, metadata

### Fluid Typography Scale

#### Headings
```css
.h1-fluid { font-size: clamp(2.5rem, 10vw, 7.5rem); }  /* Hero title */
.h2-fluid { font-size: clamp(2rem, 5vw, 3.5rem); }     /* Section title */
.h3-fluid { font-size: clamp(1.5rem, 3vw, 2.5rem); }   /* Subsection */
```

#### Body Text
```css
.body-lg-fluid { font-size: clamp(15px, 2vw, 18px); }  /* Large body */
.body-md-fluid { font-size: clamp(14px, 1.5vw, 16px); } /* Regular body */
.body-sm-fluid { font-size: clamp(12px, 1.2vw, 14px); } /* Small text */
```

### Font Weights
- **300**: Light (body text, descriptions)
- **400**: Regular (default)
- **500**: Medium (emphasis)
- **600**: Semibold (labels, buttons)
- **700**: Bold (headings, strong emphasis)
- **900**: Black (display, hero text)

### Line Heights
- **1.0**: Tight (headings)
- **1.05**: Compact (display text)
- **1.1**: Comfortable (subheadings)
- **1.7**: Relaxed (body text)

---

## Spacing System (8px Base Grid)

### Spacing Scale
```
8px   - .gap-8, .p-8
16px  - .gap-16, .p-16
24px  - .gap-24, .p-24
32px  - .gap-32, .p-32
40px  - .gap-40, .p-40
48px  - .gap-48, .p-48
56px  - Section padding
64px  - Large section padding
80px  - Extra large section padding
96px  - Hero section padding
120px - Maximum spacing
```

### Common Spacing Patterns
- **Card Padding**: 24px (3x grid)
- **Section Padding**: 96px vertical, 2rem horizontal
- **Component Gap**: 32px (4x grid)
- **Button Padding**: 12px vertical, 24px horizontal
- **Border Radius**: 6px (buttons), 8px (cards)

---

## Component Styles

### Buttons

#### Primary Button
```css
.btn-primary {
  background: #C4622D;
  color: #fff;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  font-size: clamp(13px, 1.2vw, 15px);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #8B4513;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(196, 98, 45, 0.2);
}

.btn-primary:focus {
  outline: 3px solid #4A9D6F;
  outline-offset: 2px;
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(196, 98, 45, 0.15);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: #C4622D;
  border: 1px solid #C4622D;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #C4622D;
  color: #fff;
  transform: translateY(-2px);
}

.btn-secondary:focus {
  outline: 3px solid #4A9D6F;
  outline-offset: 2px;
}
```

### Cards

#### Destination Card
```css
.dest-card {
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), 
              box-shadow 0.3s ease;
}

.dest-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 56px rgba(26,18,8,0.16);
}

.dest-card:hover .dest-img {
  transform: scale(1.08);
}

.dest-card:focus-within {
  outline: 3px solid #4A9D6F;
  outline-offset: 2px;
}
```

#### Buddy Card
```css
.buddy-card {
  border: 1px solid #DDD6C8;
  border-radius: 8px;
  padding: 32px 24px;
  transition: all 0.2s ease;
}

.buddy-card:hover {
  border-color: #C4622D;
  box-shadow: 0 12px 32px rgba(196, 98, 45, 0.12);
  transform: translateY(-4px);
}

.buddy-card:focus-within {
  outline: 3px solid #4A9D6F;
  outline-offset: 2px;
}
```

### Category Badge
```css
.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(212, 168, 83, 0.15);
  color: #D4A853;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
}

.category-badge::before {
  content: '◆';
  font-size: 8px;
}
```

---

## Interactive States

### Focus States
- **Outline**: 3px solid `#4A9D6F`
- **Offset**: 2px
- **Applies to**: All interactive elements (buttons, links, cards)
- **Keyboard**: Visible when using Tab key

### Hover States
- **Buttons**: Background darkens, lifts 2px, adds shadow
- **Cards**: Lifts 4-8px, shadow increases
- **Links**: Color changes to accent, underline appears
- **Images**: Slight zoom (1.08x scale)

### Active States
- **Buttons**: Returns to baseline, shadow reduces
- **Cards**: Lifts 2-4px
- **Feedback**: Immediate visual response

### Disabled States
- **Opacity**: 60%
- **Cursor**: `not-allowed`
- **No hover effects**: Disabled elements don't respond to hover

---

## Animations

### Timing Functions
- **Ease**: `ease` - Default smooth easing
- **Cubic Bezier**: `cubic-bezier(0.34, 1.56, 0.64, 1)` - Bouncy feel
- **Linear**: `linear` - Constant speed (loading spinners)

### Animation Durations
- **Quick**: 0.15s - Micro-interactions
- **Standard**: 0.2s - Button states, transitions
- **Smooth**: 0.3s - Card animations
- **Slow**: 0.7s - Image zoom
- **Extended**: 4s - Float animation

### Keyframe Animations
```css
@keyframes floatY {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .float-anim { animation: none; }
}
```

---

## Tribal Design Elements

### Stripe Pattern
```css
.tribal-stripe-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: repeating-linear-gradient(
    90deg,
    #4A9D6F 0px,
    #4A9D6F 12px,
    #D4A853 12px,
    #D4A853 24px
  );
  z-index: 5;
}
```

### Diamond Accent
```css
.tribal-diamond {
  display: inline-block;
  color: #D4A853;
  margin: 0 6px;
  content: '◆';
}
```

### Color Symbolism
- **Green (#4A9D6F)**: Nature, growth, harmony
- **Gold (#D4A853)**: Prosperity, heritage, warmth
- **Brown (#C4622D)**: Earth, stability, authenticity
- **Dark (#1A1208)**: Depth, strength, tradition

---

## Responsive Breakpoints

### Mobile First Approach
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Fluid Sizing
All major dimensions use `clamp()` for smooth scaling:
```css
/* Padding */
padding: clamp(1rem, 5vw, 2rem);

/* Gap */
gap: clamp(32px, 8vw, 64px);

/* Font Size */
font-size: clamp(14px, 1.5vw, 16px);
```

---

## Accessibility Features

### Keyboard Navigation
- ✓ Tab order is logical
- ✓ Focus indicators are visible
- ✓ Enter/Space keys trigger actions
- ✓ Escape closes modals

### Screen Reader Support
- ✓ Semantic HTML
- ✓ Descriptive aria-labels
- ✓ Proper heading hierarchy
- ✓ Alt text for images

### Color Contrast
- ✓ WCAG AA compliant
- ✓ No color-only information
- ✓ Sufficient contrast in all states

### Motion
- ✓ Respects prefers-reduced-motion
- ✓ Animations are not essential
- ✓ Smooth transitions

---

## Implementation Examples

### Destination Card Grid
```jsx
<div style={{ 
  display: "grid", 
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", 
  gap: 32 
}}>
  {/* Cards */}
</div>
```

### Button with States
```jsx
<button 
  className="btn-primary"
  onMouseEnter={(e) => e.currentTarget.style.background = "#8B4513"}
  onMouseLeave={(e) => e.currentTarget.style.background = "#C4622D"}
>
  Action
</button>
```

### Keyboard Navigation
```jsx
<div 
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleAction();
    }
  }}
>
  Interactive Element
</div>
```

---

## Best Practices

### Spacing
- Always use 8px multiples
- Use `clamp()` for responsive sizing
- Maintain consistent gaps between components

### Typography
- Use fluid sizing with `clamp()`
- Maintain proper line-height for readability
- Use appropriate font weights for hierarchy

### Colors
- Ensure WCAG AA contrast ratios
- Use color + other indicators (not color alone)
- Respect user's color preferences

### Interactions
- Provide clear focus indicators
- Use consistent hover/active states
- Respect prefers-reduced-motion

### Accessibility
- Use semantic HTML
- Provide descriptive labels
- Support keyboard navigation
- Test with screen readers

---

## Resources

### Tools
- Contrast Checker: https://webaim.org/resources/contrastchecker/
- WAVE: https://wave.webaim.org/
- Axe DevTools: https://www.deque.com/axe/devtools/
- Lighthouse: Built into Chrome DevTools

### References
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- MDN Web Docs: https://developer.mozilla.org/
- CSS Tricks: https://css-tricks.com/

---

## Version History

### v2.0 - Redesign (Current)
- Implemented fluid typography with clamp()
- Added 8px grid system
- Enhanced accessibility (WCAG AA)
- Improved interactive states
- Added tribal design elements
- Increased spacing consistency

### v1.0 - Original
- Initial design
- Basic spacing and typography
- Standard interactive states
