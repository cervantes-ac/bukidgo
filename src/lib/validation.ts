import { z } from 'zod';

// User validation schemas
export const userProfileSchema = z.object({
  uid: z.string().min(1),
  email: z.string().email(),
  displayName: z.string().nullable(),
  photoURL: z.string().url().nullable(),
  role: z.enum(['user', 'admin', 'guide']),
  bio: z.string().optional(),
  createdAt: z.string().optional(),
});

// Booking validation schemas
export const bookingSchema = z.object({
  userId: z.string().min(1),
  type: z.enum(['guide', 'package', 'event']),
  targetId: z.string().min(1),
  date: z.string().min(1),
  status: z.enum(['pending', 'confirmed', 'canceled']),
  totalPrice: z.number().min(0),
  guests: z.number().min(1).max(20),
});

// Itinerary generation validation
export const itineraryRequestSchema = z.object({
  destination: z.string().min(1),
  duration: z.number().min(1).max(14),
  budget: z.enum(['budget', 'mid-range', 'luxury']),
  tripType: z.enum(['adventure', 'cultural', 'nature', 'family', 'romantic']),
  interests: z.array(z.string()).min(1),
  groupSize: z.number().min(1).max(20),
});

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(1000),
});

// Environment variables validation
export const envSchema = z.object({
  VITE_GOOGLE_MAPS_API_KEY: z.string().min(1),
  GEMINI_API_KEY: z.string().min(1),
  APP_URL: z.string().url(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
export type Booking = z.infer<typeof bookingSchema>;
export type ItineraryRequest = z.infer<typeof itineraryRequestSchema>;
export type ContactForm = z.infer<typeof contactFormSchema>;

// Validation helper functions
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
};

export const isValidEmail = (email: string): boolean => {
  return z.string().email().safeParse(email).success;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};