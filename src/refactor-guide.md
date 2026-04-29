# BukidGo Component Refactoring Guide

## Overview
This guide provides instructions for refactoring all BukidGo components to use the new unified design system. The design system creates a consistent, modern, and engaging user experience across all pages.

## Design System Implementation

### 1. Import Design System CSS
Add to your main App.tsx or index.tsx:
```typescript
import './styles/design-system.css';
```

### 2. Update Component Structure

#### Navbar (Already Refactored)
- Uses `container` class for consistent padding
- Uses `btn`, `btn-primary`, `btn-secondary` classes
- Implements gradient backgrounds with `bg-gradient-nature-sky`
- Uses consistent spacing with `gap-*` classes
- Implements mobile-first responsive design

#### Footer (Already Refactored)
- Uses `container` class
- Implements 4-column grid on desktop
- Uses `font-heading` for headings
- Uses `text-stone/70` for body text
- Implements consistent social icons

#### Layout (Already Refactored)
- Uses `min-h-screen` with gradient background
- Smooth page transitions with motion.div
- Consistent padding with `pt-20`

### 3. Page Component Updates

#### Home Page Updates Needed:
1. **Hero Section**: Use `hero-text` class for main heading
2. **Cards**: Use `card`, `card-lg` classes with hover effects
3. **Buttons**: Use `btn btn-primary` and `btn btn-secondary`
4. **Badges**: Use `badge badge-primary` for category labels
5. **Typography**: Use `font-heading` for headings, `font-body` for body
6. **Colors**: Use CSS variables (`--color-forest`, `--color-sky`, etc.)
7. **Spacing**: Use spacing scale (`--space-*` variables)

#### Other Pages to Update:
1. **Explore Page**: Refactor search, filters, and card grid
2. **Food Page**: Update food cards, filters, and modal
3. **Events Page**: Update event cards and filtering
4. **Guides Page**: Update guide cards and detail panel
5. **Itinerary Generator**: Update form and result cards
6. **Admin Dashboard**: Update tables, stats, and forms
7. **Profile Page**: Update profile card and stats
8. **Auth Page**: Update form and validation styles

### 4. Key Patterns to Apply

#### Card Pattern
```tsx
<div className="card hover:shadow-lg transition-all">
  <div className="relative h-64 overflow-hidden rounded-t-lg">
    <img src={image} className="w-full h-full object-cover" />
    <div className="absolute top-4 right-4">
      <div className="badge badge-primary">Category</div>
    </div>
  </div>
  <div className="p-6">
    <h3 className="font-heading font-bold text-charcoal mb-2">Title</h3>
    <p className="text-stone/70 text-sm mb-4">Description</p>
    <div className="flex justify-between items-center">
      <span className="text-forest font-semibold">Price</span>
      <button className="btn btn-secondary">Action</button>
    </div>
  </div>
</div>
```

#### Button Pattern
```tsx
<button className="btn btn-primary">
  <Icon className="w-4 h-4" />
  <span>Button Text</span>
</button>

<button className="btn btn-secondary">
  <Icon className="w-4 h-4" />
  <span>Secondary Action</span>
</button>
```

#### Form Input Pattern
```tsx
<div className="space-y-2">
  <label className="text-sm font-medium text-stone">Label</label>
  <input
    type="text"
    className="input"
    placeholder="Placeholder text"
  />
</div>
```

#### Section Header Pattern
```tsx
<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
  <div>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-gradient-subtle flex items-center justify-center">
        <Icon className="w-5 h-5 text-forest" />
      </div>
      <span className="text-sm font-medium tracking-widest uppercase text-stone/60">Section</span>
    </div>
    <h2 className="text-h2 font-heading font-bold text-charcoal">Section Title</h2>
    <p className="text-lg text-stone/70 max-w-xl">Section description.</p>
  </div>
  <Link to="/path" className="btn btn-secondary">
    <TrendingUp className="w-4 h-4" />
    View All
  </Link>
</div>
```

### 5. Animation Guidelines

#### Page Transitions
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
>
  {/* Page content */}
</motion.div>
```

#### Card Hover Effects
```tsx
<div className="card hover:shadow-lg hover:-translate-y-1 transition-all">
  {/* Card content */}
</div>
```

#### List Item Animation
```tsx
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: index * 0.1 }}
>
  {/* List item */}
</motion.div>
```

### 6. Responsive Design

#### Grid Systems
```tsx
{/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* Grid items */}
</div>
```

#### Container Usage
```tsx
<section className="container">
  {/* Content with consistent padding */}
</section>
```

### 7. Color Usage

#### Text Colors
- Headings: `text-charcoal` or `text-forest`
- Body: `text-stone` or `text-stone/70`
- Links: `text-forest hover:text-sky`
- Accent: `text-sunset`

#### Background Colors
- Primary: `bg-forest` or `bg-gradient-nature-sky`
- Secondary: `bg-linen`
- Cards: `bg-white`
- Accent: `bg-sunset`

### 8. Icon Usage
```tsx
<Icon className="w-5 h-5 text-stone/60" />
<Icon className="w-6 h-6 text-forest" />
<Icon className="w-8 h-8 text-white" />
```

### 9. Implementation Priority

1. **High Priority** (Core UX):
   - Navbar ✓
   - Footer ✓
   - Layout ✓
   - Home page hero & featured sections

2. **Medium Priority** (Key pages):
   - Explore page
   - Food page
   - Guides page
   - Events page

3. **Low Priority** (Secondary pages):
   - Itinerary Generator
   - Admin Dashboard
   - Profile page
   - Auth page

### 10. Testing Checklist

After refactoring each component, verify:
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Colors follow design system
- [ ] Typography hierarchy is correct
- [ ] Animations are smooth and not jarring
- [ ] Buttons have proper hover/focus states
- [ ] Forms are accessible and usable
- [ ] Images load correctly and have alt text
- [ ] Navigation works correctly
- [ ] No console errors
- [ ] Performance is acceptable

### 11. Common Issues & Solutions

**Issue**: Colors don't match design system
**Solution**: Use CSS variables instead of hardcoded colors

**Issue**: Inconsistent spacing
**Solution**: Use spacing scale variables (`--space-*`)

**Issue**: Missing hover states
**Solution**: Add `hover:` variants and `transition-all`

**Issue**: Poor mobile experience
**Solution**: Use mobile-first responsive classes

**Issue**: Slow animations
**Solution**: Use `transition-all` with appropriate duration

### 12. Performance Considerations

1. Use `lazy` loading for images
2. Implement proper image sizing
3. Use `memo` for expensive components
4. Avoid unnecessary re-renders
5. Use `useCallback` for event handlers
6. Implement virtual scrolling for long lists
7. Optimize bundle size with code splitting

## Conclusion

By following this guide, you can systematically refactor all BukidGo components to use the new design system. The result will be a consistent, modern, and engaging user experience that reflects the beauty of Bukidnon while providing excellent usability across all devices.

Start with the highest priority components and work your way down, testing each component thoroughly before moving to the next.