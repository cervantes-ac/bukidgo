import { describe, it, expect } from 'vitest';
import {
  validateData,
  isValidEmail,
  sanitizeInput,
  userProfileSchema,
  bookingSchema,
  itineraryRequestSchema,
  contactFormSchema,
} from '../validation';

describe('Validation Utils', () => {
  describe('validateData', () => {
    it('validates correct user profile data', () => {
      const validUser = {
        uid: 'user123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
        role: 'user' as const,
        bio: 'Test bio',
      };

      expect(() => validateData(userProfileSchema, validUser)).not.toThrow();
    });

    it('throws error for invalid user profile data', () => {
      const invalidUser = {
        uid: '',
        email: 'invalid-email',
        role: 'invalid-role',
      };

      expect(() => validateData(userProfileSchema, invalidUser)).toThrow();
    });

    it('validates correct booking data', () => {
      const validBooking = {
        userId: 'user123',
        type: 'guide' as const,
        targetId: 'guide456',
        date: '2024-12-25',
        status: 'pending' as const,
        totalPrice: 1500,
        guests: 2,
      };

      expect(() => validateData(bookingSchema, validBooking)).not.toThrow();
    });

    it('validates correct itinerary request', () => {
      const validRequest = {
        destination: 'Bukidnon',
        duration: 3,
        budget: 'mid-range' as const,
        tripType: 'adventure' as const,
        interests: ['hiking', 'culture'],
        groupSize: 4,
      };

      expect(() => validateData(itineraryRequestSchema, validRequest)).not.toThrow();
    });

    it('validates correct contact form', () => {
      const validForm = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Inquiry about tours',
        message: 'I would like to know more about your adventure packages.',
      };

      expect(() => validateData(contactFormSchema, validForm)).not.toThrow();
    });
  });

  describe('isValidEmail', () => {
    it('returns true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    it('returns false for invalid emails', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('trims whitespace', () => {
      expect(sanitizeInput('  hello world  ')).toBe('hello world');
    });

    it('removes dangerous characters', () => {
      expect(sanitizeInput('hello<script>alert("xss")</script>world')).toBe(
        'helloscriptalert("xss")/scriptworld'
      );
    });

    it('handles empty strings', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput('   ')).toBe('');
    });
  });
});