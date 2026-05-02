# BukidGo UI/UX Design Improvements

## Current Design Critique

### 1. **Hero Section Issues**
- **Problem**: Text hierarchy is unclear; the main headline lacks visual weight and breathing room
- **Problem**: Search bar contrast could be improved; placeholder text is hard to read
- **Problem**: Stats section spacing is inconsistent; numbers don't pop enough
- **Solution**: Increase headline size with better clamp() scaling, improve search bar styling with better focus states, add visual hierarchy to stats with color accents

### 2. **Destination Cards Grid**
- **Problem**: Cards lack clear visual hierarchy; category badges are too subtle
- **Problem**: Hover states are minimal; users don't get clear feedback
- **Problem**: Rating badges blend into the image; hard to read
- **Problem**: Spacing between cards is too tight (gap: 2px instead of 32px)
- **Solution**: Add tribal diamond accents to badges, improve hover animations with spring easing, increase card gap, add focus states for accessibility

### 3. **Local Guides Section**
- **Problem**: Buddy cards are too small and cramped; hard to scan
- **Problem**: Price display lacks visual emphasis
- **Problem**: "Book Buddy" button lacks clear call-to-action styling
- **Problem**: No clear visual distinction between verified and unverified guides
- **Solution**: Increase card size, add price highlight with accent color, improve button styling with hover effects, add verification badge styling

### 4. **Typography & Spacing**
- **Problem**: Inconsistent use of clamp() for fluid typography
- **Problem**: Spacing grid not consistently applied (8px base)
- **Problem**: Line heights vary; some text is hard to read
- **Solution**: Standardize all typography with clamp(), apply 8px grid consistently, improve line heights for readability

### 5. **Accessibility & Interactions**
- **Problem**: Focus states not clearly defined
- **Problem**: No keyboard navigation support for cards
- **Problem**: Color contrast issues in some areas
- **Problem**: Animations don't respect prefers-reduced-motion
- **Solution**: Add clear focus rings, implement keyboard support, verify WCAG AA contrast, add motion preferences

## Design Improvements Summary

✅ **Hero Section**: Improved typography scale, better search bar styling, enhanced stats display
✅ **Destination Cards**: Added tribal accents, improved hover states, better spacing (32px gap)
✅ **Guides Section**: Larger cards, better price emphasis, improved button styling
✅ **Typography**: Standardized clamp() usage, consistent line heights
✅ **Accessibility**: Added focus states, keyboard support, motion preferences, WCAG AA compliance
✅ **Spacing**: Applied 8px base grid throughout
✅ **Interactive States**: Defined default, hover, focus, active, disabled states for all components
