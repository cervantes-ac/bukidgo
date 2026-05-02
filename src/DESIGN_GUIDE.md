# BukidGo Design Guide - Bukidnon Theme

## Color Palette

### Primary Colors - Mountain Greens
- **Dark Green (#1B4D2E)**: Deep forest green - used for primary actions, text, backgrounds
- **Mountain Green (#2D7A4A)**: Main brand color - used for primary buttons, highlights
- **Light Green (#4A9D6F)**: Light forest green - used for hover states, accents
- **Lighter Green (#7BC97F)**: Lighter green - used for subtle backgrounds

### Secondary Colors - Earth & Sky
- **Earth Brown (#8B6F47)**: Mountain earth brown - used for secondary elements
- **Sky Blue (#87CEEB)**: Mountain sky blue - used for info elements
- **Golden Accent (#D4A574)**: Golden accent - used for highlights, CTAs

### Neutral Colors - Natural Tones
- **Very Dark Green (#0F2818)**: Almost black - used for dark backgrounds
- **Dark Text (#1A3A2A)**: Dark text color
- **Light Background (#E8F3ED)**: Light background
- **Lighter Background (#F5F9F7)**: Lighter background
- **Border Color (#C8DDD4)**: Border color

### Accent Colors
- **Success (#4A9D6F)**: Green success state
- **Warning (#D4A574)**: Golden warning state
- **Danger (#C85A54)**: Muted red danger state
- **Info (#5B8DBE)**: Mountain blue info state

## Typography

### Font Families
- **Display Font**: Fraunces (serif) - Used for headings, titles
- **Body Font**: Outfit (sans-serif) - Used for body text, UI elements
- **Mono Font**: JetBrains Mono (monospace) - Used for code, technical text

### Font Sizes & Weights
- **H1**: 48px, 900 weight (Fraunces)
- **H2**: 32-36px, 700 weight (Fraunces)
- **H3**: 20-24px, 700 weight (Fraunces)
- **Body**: 14-16px, 400-500 weight (Outfit)
- **Small**: 12-13px, 400 weight (Outfit)
- **Mono**: 13-14px, 400 weight (JetBrains Mono)

## Component Styling

### Buttons
- **Primary Button**: 
  - Background: Linear gradient (#1B4D2E to #2D7A4A)
  - Color: #F5F0E8
  - Padding: 12px 24px
  - Border Radius: 6px
  - Hover: translateY(-2px)

- **Secondary Button**:
  - Background: #FAF7F2
  - Color: #C4622D
  - Border: 1px solid #C4622D
  - Padding: 8px 14px
  - Border Radius: 4px

### Cards
- **Background**: #F5F9F7
- **Border**: 1px solid #C8DDD4
- **Border Radius**: 12px
- **Padding**: 24-32px
- **Hover**: translateY(-4px), box-shadow: 0 12px 24px rgba(45, 122, 74, 0.1)

### Inputs
- **Background**: rgba(245,240,232,0.06)
- **Border**: 1px solid #C8DDD4
- **Border Radius**: 4-6px
- **Focus Border**: #2D7A4A
- **Padding**: 12px 16px

### Navigation
- **Active State**: Background #1A1208, Color #F5F0E8
- **Hover State**: Background #DDD6C8, Color #1A1208
- **Inactive**: Color #7A6E61

## Gradients

- **Mountain Green**: linear-gradient(135deg, #1B4D2E 0%, #2D7A4A 100%)
- **Forest to Sky**: linear-gradient(180deg, #2D7A4A 0%, #87CEEB 100%)
- **Earth to Green**: linear-gradient(135deg, #8B6F47 0%, #4A9D6F 100%)

## Spacing

- **Extra Small**: 4px
- **Small**: 8px
- **Medium**: 16px
- **Large**: 24px
- **Extra Large**: 32px
- **Section**: 60-80px

## Border Radius

- **Small**: 4px (inputs, small buttons)
- **Medium**: 6px (buttons, small cards)
- **Large**: 12px (cards, containers)

## Shadows

- **Subtle**: 0 2px 4px rgba(0, 0, 0, 0.05)
- **Medium**: 0 4px 12px rgba(0, 0, 0, 0.1)
- **Large**: 0 12px 24px rgba(45, 122, 74, 0.1)

## Transitions

- **Fast**: 0.15s
- **Normal**: 0.3s
- **Slow**: 0.5s

## Responsive Breakpoints

- **Mobile**: ≤ 640px
- **Tablet**: 641px - 1024px
- **Desktop**: > 1024px

## Page Structure

### Hero Sections
- Background: Mountain Green gradient
- Color: #F5F0E8
- Padding: 60-80px 2rem
- Text Alignment: Center

### Content Sections
- Max Width: 1280px
- Padding: 60-80px 2rem
- Background: Alternating between #F5F9F7 and #E8F3ED

### Footer
- Background: #1A1208
- Color: #F5F0E8
- Padding: 72px 2rem 40px

## Accessibility

- Minimum contrast ratio: 4.5:1 for normal text
- Minimum contrast ratio: 3:1 for large text
- Focus states clearly visible
- All interactive elements keyboard accessible
- Semantic HTML structure
- ARIA labels where needed

## Animation Principles

- Use smooth transitions for state changes
- Hover effects should be subtle (0.15s)
- Page transitions should be quick (0.3s)
- Avoid excessive animations
- Respect prefers-reduced-motion

## Brand Voice

- Modern yet approachable
- Adventurous and inspiring
- Community-focused
- Sustainable and responsible
- Local and authentic
