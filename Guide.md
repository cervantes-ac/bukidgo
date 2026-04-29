# BukidGo Application Guide

## Overview
BukidGo is a premium travel and tourism platform for Bukidnon, Philippines. It helps users discover destinations, local food, events, and generate personalized AI itineraries. The application is built with React, TypeScript, Vite, and Firebase.

## Project Structure

### Core Components
- **Layout.tsx** - Main layout wrapper with shared styles, navbar, and footer
- **Navbar.tsx** - Navigation bar with user authentication and mobile menu
- **Footer.tsx** - Site footer with links, social media, and newsletter signup

### Pages

#### 1. Home (`/`) - `Home.tsx`
**Purpose**: Landing page showcasing Bukidnon's highlights
**Features**:
- Hero section with search functionality
- Featured destinations with ratings and categories
- Events teaser with cultural calendar
- Local food spots with price ranges and ratings
- Platform features (AI Itinerary, Local Buddies, Verified Spots)
- Local Buddies section with verified guides
- Interactive food spot modals for reservations

**Key Components**:
- Real-time data fetching from Firestore for destinations and food spots
- Authentication check for booking functionality
- Animated transitions with Motion library

#### 2. Explore (`/explore`) - `Explore.tsx`
**Purpose**: Browse and filter food spots in Bukidnon
**Features**:
- Search functionality by name, description, or address
- Price range filters (Budget ₱, Mid ₱₱, Premium ₱₱₱)
- Cuisine type filtering (auto-extracted from data)
- Sorting options (Top Rated, Price: Low-High, A-Z)
- Grid view of food spots with images, ratings, and locations
- Detailed modal view for each food spot with menu highlights
- Reservation system with Firebase integration
- Google Maps directions integration

**Data Structure**:
- Uses `FoodSpot` interface with `cuisineType?: string | string[]`
- Real-time Firestore updates via `onSnapshot`

#### 3. Food (`/food`) - `Food.tsx`
**Note**: This appears to be a duplicate of `Explore.tsx` with identical functionality. Consider consolidating or renaming.

#### 4. Guides (`/guides`) - `Guides.tsx`
**Purpose**: Browse and book local tour guides (Local Buddies)
**Features**:
- Search by name, bio, or specialties
- Experience level filtering (1+ Year, 3+ Years, 5+ Years, etc.)
- Rating filtering (4.0+ ★, 4.5+ ★, 4.8+ ★)
- Price range slider (≤ ₱5000)
- Specialties filtering
- Tabular view with guide details
- Detail panel with booking functionality
- Real-time Firestore integration for guides

**Data Structure**:
- Uses `LOCAL_BUDDIES` constant as fallback
- Real-time Firestore updates for guide data
- Booking system with user authentication

#### 5. Events (`/events`) - `Events.tsx`
**Purpose**: Discover and subscribe to local events
**Features**:
- Animated ticker with event highlights
- Search by name, description, or location
- Category filtering (Festivals, Cultural, Sports, Community)
- Date range filtering (Any Date, Upcoming, This Month, Next Month)
- Sorting options (By Date, By Rating, A-Z)
- List view with event details and "Notify Me" functionality
- Real-time Firestore integration

**Data Structure**:
- Events with category, date, location, and rating
- Booking system for event notifications

#### 6. Itinerary Generator (`/ai-itinerary`) - `ItineraryGenerator.tsx`
**Purpose**: AI-powered travel itinerary generation
**Features**:
- Trip type selection (Adventure, Nature, Culture, Food Tour)
- Duration slider (1-7 days)
- Budget level selection (Budget, Mid Range, Premium)
- Specific interests text input
- AI itinerary generation via API call
- Editable itinerary with add/remove activity functionality
- PDF download capability using jsPDF
- Tips and recommendations section

**Workflow**:
1. User selects preferences
2. API call to `/api/generate-itinerary` with prompt
3. JSON response parsed and displayed
4. User can edit, add activities, or download PDF

#### 7. Profile (`/profile`) - `Profile.tsx`
**Purpose**: User profile and account management
**Features**:
- Authentication check (redirects to auth if not logged in)
- Profile header with user photo and details
- Navigation sidebar (Account, Bookings, Saved Spots, Settings)
- Member status display
- Travel statistics (Trips, Reviews, Bookings, Saved Spots)
- Account details (Display Name, Email, Auth Provider, Last Login)
- Quick links to main features
- Sign out functionality

**Authentication**:
- Uses Firebase Auth for user state
- Firestore for user profile data

#### 8. Admin Dashboard (`/admin`) - `AdminDashboard.tsx`
**Purpose**: Content management system for administrators
**Features**:
- Admin access check (requires `isAdmin` flag)
- Tabbed interface (Destinations, Food Spots, Events, Guides)
- Statistics dashboard (Total Items, Avg Rating, Total Value)
- Search functionality across collections
- CRUD operations (Create, Read, Update, Delete)
- Form-based editing with validation
- Real-time Firestore integration

**Collections Managed**:
- `destinations` - Tourist spots with entrance fees
- `foodSpots` - Restaurants and food establishments
- `events` - Cultural and community events
- `guides` - Local tour guides

#### 9. Auth (`/auth`) - `Auth.tsx`
**Purpose**: User authentication and account creation
**Features**:
- Tabbed interface (Sign In / Create Account)
- Email/password authentication
- Password confirmation for signup
- Show/hide password toggle
- Password reset functionality
- Form validation and error handling
- Firebase Auth integration
- Redirect to home on successful authentication

**Authentication Methods**:
- Email/password sign-in
- Email/password sign-up
- Password reset via email

## Data Models

### Types (`src/types.ts`)
```typescript
export interface FoodSpot {
  id: string;
  name: string;
  priceRange: string;
  image: string;
  description: string;
  location: { lat: number; lng: number; address: string };
  rating: number;
  cuisineType?: string | string[];
  menu?: { name: string; price: string; category?: string }[];
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  images: string[];
  rating: number;
  entranceFee: number;
  location: { lat: number; lng: number; address: string };
  category: 'nature' | 'adventure' | 'culture';
}

export interface LocalBuddy {
  uid: string;
  name: string;
  experience: string;
  rating: number;
  pricePerDay: number;
  photoURL: string;
  bio: string;
  specialties?: string[];
}

export interface Event {
  id: string;
  name: string;
  date: string;
  month: string;
  description: string;
  location: string;
  image: string;
  category: 'festival' | 'cultural' | 'sports' | 'community';
}
```

## Firebase Integration

### Collections
- `destinations` - Tourist destinations
- `foodSpots` - Food establishments
- `events` - Local events
- `guides` - Tour guides
- `bookings` - User reservations
- `users` - User profiles
- `admins` - Admin users

### Authentication
- Firebase Auth for user management
- Role-based access (user/admin)
- Protected routes based on authentication state

## Styling System

### Design Tokens
```css
:root {
  --bg: #F5F0E8;        /* Background */
  --bg-dark: #1A1208;   /* Dark background */
  --ink: #1A1208;       /* Text color */
  --muted: #7A6E61;     /* Muted text */
  --border: #DDD6C8;    /* Border color */
  --accent: #C4622D;    /* Primary accent */
  --accent2: #4A7C59;   /* Secondary accent */
  --gold: #D4A853;      /* Gold accent */
  --surface: #FFFFFF;   /* Surface color */
  --surface2: #FAF7F2;  /* Secondary surface */
}
```

### Typography
- **bk-display**: Fraunces (serif) for headings
- **bk-body**: Outfit (sans-serif) for body text
- **bk-mono**: JetBrains Mono for monospace text

## Key Features

### 1. Real-time Updates
- All data pages use Firestore `onSnapshot` for real-time updates
- Changes in admin dashboard immediately reflect in user views

### 2. Responsive Design
- Mobile-first approach with responsive breakpoints
- Collapsible navigation menu for mobile
- Flexible grid layouts

### 3. Accessibility
- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support

### 4. Performance
- Code splitting via Vite
- Lazy loading of components
- Optimized image loading

## Development Notes

### Build Process
```bash
npm run build    # Vite production build
npm run dev      # Development server
npm run lint     # TypeScript type checking
npm run preview  # Preview production build
```

### Dependencies
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Firebase** - Backend services
- **React Router DOM** - Routing
- **Motion** - Animation library
- **Lucide React** - Icons
- **jsPDF** - PDF generation
- **Tailwind CSS** - Utility classes (via @tailwindcss/vite)

### Environment Variables
- `GEMINI_API_KEY` - For AI itinerary generation
- Firebase configuration in `src/lib/firebase.ts`

## Known Issues

1. **Duplicate Pages**: `Explore.tsx` and `Food.tsx` appear to be identical
2. **Unused Imports**: Several components have unused imports
3. **TypeScript Warnings**: Some deprecated icon imports (Instagram, Facebook, Twitter)
4. **Build Warnings**: Large chunk sizes (>500KB) in production build

## Future Improvements

1. **Consolidate Pages**: Merge `Explore.tsx` and `Food.tsx`
2. **Optimize Bundle**: Implement code splitting for larger chunks
3. **Add Tests**: Unit and integration tests
4. **Enhanced Search**: Implement more advanced search algorithms
5. **Offline Support**: Add service workers for offline functionality
6. **Analytics**: Integrate usage analytics
7. **Multi-language Support**: Add localization for Filipino/English

## Deployment

The application is configured for Firebase Hosting with:
- `firebase.json` configuration
- `dist/` directory for build output
- Firebase Authentication and Firestore backend

To deploy:
```bash
npm run build
firebase deploy --only hosting
```

## Support

For issues or questions:
1. Check the Firebase console for data issues
2. Verify environment variables are set
3. Check browser console for errors
4. Review Firestore security rules

---

*Last Updated: April 29, 2026*