export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: 'user' | 'admin' | 'guide';
  bio?: string;
  createdAt?: string;
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  images: string[];
  rating: number;
  entranceFee: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
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
}

export interface Booking {
  id: string;
  userId: string;
  type: 'guide' | 'package';
  targetId: string;
  date: string;
  status: 'pending' | 'confirmed' | 'canceled';
  totalPrice: number;
  guests: number;
}

export interface FoodSpot {
  id: string;
  name: string;
  priceRange: string;
  image: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  rating: number;
  cuisineType?: string | string[];
  menu?: {
    name: string;
    price: string;
    category?: string;
  }[];
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

export interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'seasonal';
  description: string;
  requirements: string[];
  salary?: string;
  image: string;
  postedDate: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  targetId: string;
  targetType: 'destination' | 'foodSpot' | 'guide';
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  helpful: number;
}

export interface Favorite {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'destination' | 'foodSpot' | 'guide';
  createdAt: string;
}
