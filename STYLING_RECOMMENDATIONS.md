# Styling Recommendations for Existing Pages

## Overview
This document provides recommendations for enhancing existing pages with the Bukidnon theme.

## Home Page (`src/pages/Home.tsx`)

### Recommended Enhancements
1. **Hero Section**
   - Use Mountain Green gradient background
   - Add mountain/nature imagery
   - Call-to-action button with golden accent

2. **Features Section**
   - Grid layout with 3-4 feature cards
   - Each card with icon, title, description
   - Hover effect: translateY(-4px)

3. **Testimonials Section**
   - Carousel or grid of user testimonials
   - Profile images with names
   - Star ratings

4. **Call-to-Action Section**
   - Encourage sign-up or exploration
   - Use primary gradient button
   - Responsive layout

### Color Scheme
- Background: #F5F9F7 or #E8F3ED
- Headings: #1B4D2E
- Text: #1A3A2A
- Accents: #D4A574

## Explore Page (`src/pages/Explore.tsx`)

### Recommended Enhancements
1. **Filter Section**
   - Category filters (Mountains, Beaches, Culture, etc.)
   - Location filter
   - Price range slider

2. **Spot Cards**
   - Image with overlay
   - Title, description, rating
   - Location and distance
   - Hover effect with shadow

3. **Map Integration**
   - Show spots on interactive map
   - Click to view details

### Styling
- Card background: #F5F9F7
- Border: 1px solid #C8DDD4
- Hover shadow: 0 12px 24px rgba(45, 122, 74, 0.1)

## Food Page (`src/pages/Food.tsx`)

### Recommended Enhancements
1. **Food Categories**
   - Grid of food category cards
   - Each with image and name
   - Click to filter

2. **Restaurant Cards**
   - Image, name, cuisine type
   - Rating and reviews count
   - Location and hours
   - "View Details" button

3. **Search & Filter**
   - Search by name or cuisine
   - Filter by rating, price, distance

### Color Accents
- Use #D4A574 (golden) for food highlights
- #4A9D6F for success/available status

## Guides Page (`src/pages/Guides.tsx`)

### Recommended Enhancements
1. **Guide Cards**
   - Profile image
   - Name and specialty
   - Rating and reviews
   - Languages spoken
   - "Book Now" button

2. **Filter Options**
   - By specialty (hiking, culture, food, etc.)
   - By language
   - By rating

3. **Guide Details Modal**
   - Full profile information
   - Reviews and testimonials
   - Availability calendar
   - Booking form

### Styling
- Card hover: Scale 1.02 + shadow
- Button: Primary gradient
- Rating stars: #D4A574

## Events Page (`src/pages/Events.tsx`)

### Recommended Enhancements
1. **Event Cards**
   - Event image
   - Title, date, time
   - Location
   - Attendee count
   - "Register" button

2. **Calendar View**
   - Month/week view
   - Click to see events
   - Color-coded by category

3. **Event Details**
   - Full description
   - Agenda/schedule
   - Speakers/organizers
   - Registration form

### Color Coding
- Cultural events: #2D7A4A
- Adventure events: #4A9D6F
- Food events: #D4A574
- Community events: #87CEEB

## AI Itinerary Page (`src/pages/ItineraryGenerator.tsx`)

### Recommended Enhancements
1. **Input Form**
   - Duration selector
   - Interests checkboxes
   - Budget range
   - Group size
   - Accessibility needs

2. **Generated Itinerary**
   - Day-by-day breakdown
   - Map view
   - Time estimates
   - Cost breakdown
   - Edit/customize options

3. **Styling**
   - Form inputs: Light background with green focus
   - Generated itinerary: Card-based layout
   - Buttons: Primary gradient for actions

## Profile Page (`src/pages/Profile.tsx`)

### Recommended Enhancements
1. **Profile Header**
   - User avatar
   - Name and bio
   - Edit profile button

2. **Tabs/Sections**
   - My Bookings
   - Saved Spots
   - Reviews & Ratings
   - Settings

3. **Styling**
   - Header background: Light gradient
   - Tab active: #1A1208 background
   - Buttons: Secondary style for actions

## Admin Dashboard (`src/pages/AdminDashboard.tsx`)

### Recommended Enhancements
1. **Dashboard Layout**
   - Sidebar navigation
   - Main content area
   - Stats cards at top

2. **Stats Cards**
   - Total users
   - Total bookings
   - Revenue
   - Active guides

3. **Management Tables**
   - Users management
   - Guides management
   - Events management
   - Spots management

### Styling
- Sidebar: #1A1208 background
- Active nav: #D4A574 highlight
- Stats cards: Gradient backgrounds
- Tables: Alternating row colors

## Auth Page (`src/pages/Auth.tsx`)

### Recommended Enhancements
1. **Sign In Form**
   - Email input
   - Password input
   - Remember me checkbox
   - Sign in button
   - Forgot password link

2. **Sign Up Form**
   - Name input
   - Email input
   - Password input
   - Confirm password
   - Terms acceptance
   - Sign up button

3. **Social Login**
   - Google login
   - Facebook login
   - Apple login

### Styling
- Form background: #F5F9F7
- Inputs: Light with green focus
- Buttons: Primary gradient
- Links: #2D7A4A color

## General Styling Guidelines

### Consistent Elements
1. **Buttons**
   ```
   Primary: gradient(#1B4D2E to #2D7A4A), #F5F0E8 text
   Secondary: #FAF7F2 background, #C4622D text
   Danger: #C85A54 background
   ```

2. **Cards**
   ```
   Background: #F5F9F7
   Border: 1px solid #C8DDD4
   Radius: 12px
   Hover: translateY(-4px), shadow
   ```

3. **Inputs**
   ```
   Background: rgba(245,240,232,0.06)
   Border: 1px solid #C8DDD4
   Focus: border #2D7A4A
   Radius: 6px
   ```

4. **Text**
   ```
   Headings: #1B4D2E, Fraunces font
   Body: #1A3A2A, Outfit font
   Secondary: #7A6E61
   ```

### Responsive Patterns
- Mobile: Single column, full width
- Tablet: 2 columns, adjusted spacing
- Desktop: 3+ columns, full layout

### Animation Patterns
- Hover: 0.15s transition
- Click: 0.3s transition
- Page load: Stagger children 0.1s apart

## Implementation Priority

### High Priority
1. Home page hero enhancement
2. Explore page card styling
3. Food page layout
4. Guides page cards

### Medium Priority
1. Events page calendar
2. AI Itinerary styling
3. Profile page sections
4. Auth page forms

### Low Priority
1. Admin dashboard polish
2. Advanced animations
3. Additional features
4. Performance optimizations

## Testing Recommendations

1. Test all pages on mobile, tablet, desktop
2. Verify color contrast meets WCAG standards
3. Test keyboard navigation
4. Check hover effects on touch devices
5. Verify animations are smooth
6. Test form validation
7. Check responsive images
8. Verify loading states

## Future Enhancements

1. Dark mode support
2. Custom theme selector
3. Accessibility improvements
4. Performance optimizations
5. Advanced animations
6. Micro-interactions
7. Loading skeletons
8. Error states
