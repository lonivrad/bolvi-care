// Zod validation schemas for all entities
import { z } from 'zod';

// ============================================================================
// BASE TYPES
// ============================================================================

export const emailSchema = z.string().email('Invalid email address');
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number');
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const uuidSchema = z.string().cuid();

// ============================================================================
// ADDRESS
// ============================================================================

export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  unit: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().length(2, 'State must be 2 characters'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  country: z.string().default('US'),
});

export type AddressInput = z.infer<typeof addressSchema>;

// ============================================================================
// AUTH SCHEMAS
// ============================================================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const signupFamilySchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: phoneSchema.optional(),
  address: addressSchema.optional(),
  termsAccepted: z.literal(true).describe('You must accept the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const signupCaregiverSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: phoneSchema,
  address: addressSchema,
  bio: z.string().min(50, 'Bio must be at least 50 characters').max(2000),
  headline: z.string().min(10, 'Headline must be at least 10 characters').max(100),
  hourlyRate: z.number().min(1500, 'Minimum rate is $15/hour').max(15000, 'Maximum rate is $150/hour'),
  yearsExperience: z.number().min(0).max(50),
  specialties: z.array(z.string()).min(1, 'Select at least one specialty'),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  termsAccepted: z.literal(true),
  backgroundCheckConsent: z.literal(true),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupFamilyInput = z.infer<typeof signupFamilySchema>;
export type SignupCaregiverInput = z.infer<typeof signupCaregiverSchema>;

// ============================================================================
// USER SCHEMAS
// ============================================================================

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  phone: phoneSchema.optional(),
  photo: z.string().url().optional(),
});

export const updateFamilyProfileSchema = z.object({
  street: z.string().optional(),
  unit: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  preferences: z.any().optional(),
});

export const updateCaregiverProfileSchema = z.object({
  bio: z.string().min(50).max(2000).optional(),
  headline: z.string().min(10).max(100).optional(),
  hourlyRate: z.number().min(1500).max(15000).optional(),
  yearsExperience: z.number().min(0).max(50).optional(),
  specialties: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  instantBook: z.boolean().optional(),
  serviceAreaType: z.enum(['RADIUS', 'ZIPCODES', 'CITIES']).optional(),
  serviceAreaRadius: z.number().min(5).max(100).optional(),
  serviceAreaZipcodes: z.array(z.string()).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateFamilyProfileInput = z.infer<typeof updateFamilyProfileSchema>;
export type UpdateCaregiverProfileInput = z.infer<typeof updateCaregiverProfileSchema>;

// ============================================================================
// CARE RECIPIENT SCHEMAS
// ============================================================================

export const createCareRecipientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  photo: z.string().url().optional(),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
  relationship: z.string().optional(),
  address: addressSchema.optional(),
  medicalConditions: z.array(z.object({
    name: z.string(),
    severity: z.enum(['mild', 'moderate', 'severe']),
    diagnosedDate: z.string().optional(),
    notes: z.string().optional(),
  })).optional(),
  medications: z.array(z.object({
    name: z.string(),
    dosage: z.string(),
    frequency: z.string(),
    timeOfDay: z.array(z.enum(['morning', 'afternoon', 'evening', 'night'])),
    prescribedBy: z.string().optional(),
    notes: z.string().optional(),
  })).optional(),
  allergies: z.array(z.string()).optional(),
  mobilityLevel: z.enum(['INDEPENDENT', 'MINIMAL_ASSISTANCE', 'MODERATE_ASSISTANCE', 'EXTENSIVE_ASSISTANCE', 'DEPENDENT']).optional(),
  cognitiveStatus: z.enum(['INTACT', 'MILD_IMPAIRMENT', 'MODERATE_IMPAIRMENT', 'SEVERE_IMPAIRMENT']).optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  careNeeds: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const updateCareRecipientSchema = createCareRecipientSchema.partial();

export type CreateCareRecipientInput = z.infer<typeof createCareRecipientSchema>;
export type UpdateCareRecipientInput = z.infer<typeof updateCareRecipientSchema>;

// ============================================================================
// BOOKING SCHEMAS
// ============================================================================

export const createBookingSchema = z.object({
  caregiverProfileId: z.string().cuid(),
  careRecipientId: z.string().cuid(),
  scheduledStart: z.string().datetime(),
  scheduledEnd: z.string().datetime(),
  services: z.array(z.string()).min(1, 'Select at least one service'),
  specialInstructions: z.string().max(1000).optional(),
  address: addressSchema.optional(),
  type: z.enum(['ONE_TIME', 'RECURRING']).default('ONE_TIME'),
  recurring: z.object({
    frequency: z.enum(['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY']),
    daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
    endDate: z.string().datetime().optional(),
  }).optional(),
}).refine((data) => {
  const start = new Date(data.scheduledStart);
  const end = new Date(data.scheduledEnd);
  return end > start;
}, {
  message: 'End time must be after start time',
  path: ['scheduledEnd'],
}).refine((data) => {
  const start = new Date(data.scheduledStart);
  return start > new Date();
}, {
  message: 'Start time must be in the future',
  path: ['scheduledStart'],
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED']),
});

export const cancelBookingSchema = z.object({
  reason: z.enum(['SCHEDULE_CONFLICT', 'EMERGENCY', 'ILLNESS', 'FOUND_ALTERNATIVE', 'COST', 'NO_LONGER_NEEDED', 'OTHER']),
  notes: z.string().max(500).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;

// ============================================================================
// VISIT SCHEMAS
// ============================================================================

export const checkInSchema = z.object({
  bookingId: z.string().cuid(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const checkOutSchema = z.object({
  visitId: z.string().cuid(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  notes: z.string().max(2000).optional(),
  moodRating: z.number().min(1).max(5).optional(),
});

export const visitReportSchema = z.object({
  visitId: z.string().cuid(),
  summary: z.string().min(10, 'Summary must be at least 10 characters').max(2000),
  activitiesCompleted: z.array(z.object({
    type: z.string(),
    completedAt: z.string().datetime(),
    duration: z.number().optional(),
    notes: z.string().optional(),
  })).optional(),
  medicationsGiven: z.array(z.object({
    medicationId: z.string(),
    medicationName: z.string(),
    givenAt: z.string().datetime(),
    dosage: z.string(),
    notes: z.string().optional(),
    skipped: z.boolean().optional(),
    skipReason: z.string().optional(),
  })).optional(),
  mealsProvided: z.array(z.object({
    type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
    time: z.string().datetime(),
    description: z.string(),
    appetiteLevel: z.enum(['poor', 'fair', 'good', 'excellent']),
    hydration: z.string().optional(),
  })).optional(),
  vitalSigns: z.object({
    bloodPressure: z.object({
      systolic: z.number(),
      diastolic: z.number(),
    }).optional(),
    heartRate: z.number().optional(),
    temperature: z.number().optional(),
    weight: z.number().optional(),
    bloodSugar: z.number().optional(),
    oxygenSaturation: z.number().optional(),
  }).optional(),
  mood: z.number().min(1).max(5),
  moodNotes: z.string().optional(),
  concerns: z.string().optional(),
  recommendations: z.string().optional(),
  nextVisitNotes: z.string().optional(),
});

export type CheckInInput = z.infer<typeof checkInSchema>;
export type CheckOutInput = z.infer<typeof checkOutSchema>;
export type VisitReportInput = z.infer<typeof visitReportSchema>;

// ============================================================================
// REVIEW SCHEMAS
// ============================================================================

export const createReviewSchema = z.object({
  bookingId: z.string().cuid(),
  rating: z.number().min(1).max(5),
  content: z.string().min(10, 'Review must be at least 10 characters').max(2000),
  categories: z.object({
    punctuality: z.number().min(1).max(5).optional(),
    communication: z.number().min(1).max(5).optional(),
    professionalism: z.number().min(1).max(5).optional(),
    careQuality: z.number().min(1).max(5).optional(),
    reliability: z.number().min(1).max(5).optional(),
  }).optional(),
  isPublic: z.boolean().default(true),
});

export const respondToReviewSchema = z.object({
  reviewId: z.string().cuid(),
  response: z.string().min(10).max(1000),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type RespondToReviewInput = z.infer<typeof respondToReviewSchema>;

// ============================================================================
// MESSAGE SCHEMAS
// ============================================================================

export const createConversationSchema = z.object({
  participantIds: z.array(z.string().cuid()).min(1),
  type: z.enum(['DIRECT', 'GROUP']).default('DIRECT'),
  initialMessage: z.string().min(1).max(5000).optional(),
});

export const sendMessageSchema = z.object({
  conversationId: z.string().cuid(),
  content: z.string().min(1).max(5000),
  type: z.enum(['TEXT', 'IMAGE', 'FILE', 'SYSTEM', 'BOOKING_REQUEST', 'VISIT_UPDATE']).default('TEXT'),
  attachments: z.array(z.object({
    type: z.enum(['image', 'document', 'audio']),
    url: z.string().url(),
    name: z.string(),
    size: z.number(),
  })).optional(),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;

// ============================================================================
// AVAILABILITY SCHEMAS
// ============================================================================

export const timeSlotSchema = z.object({
  start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
});

export const weeklyScheduleSchema = z.object({
  sunday: z.array(timeSlotSchema),
  monday: z.array(timeSlotSchema),
  tuesday: z.array(timeSlotSchema),
  wednesday: z.array(timeSlotSchema),
  thursday: z.array(timeSlotSchema),
  friday: z.array(timeSlotSchema),
  saturday: z.array(timeSlotSchema),
});

export const updateAvailabilitySchema = z.object({
  timezone: z.string().optional(),
  minimumNotice: z.number().min(1).max(168).optional(), // 1 hour to 1 week
  maximumAdvanceBooking: z.number().min(1).max(365).optional(), // 1 day to 1 year
  regularHours: weeklyScheduleSchema.optional(),
});

export const createAvailabilityExceptionSchema = z.object({
  date: z.string().datetime(),
  type: z.enum(['UNAVAILABLE', 'MODIFIED']),
  slots: z.array(timeSlotSchema).optional(),
  reason: z.string().max(200).optional(),
});

export type TimeSlotInput = z.infer<typeof timeSlotSchema>;
export type WeeklyScheduleInput = z.infer<typeof weeklyScheduleSchema>;
export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>;
export type CreateAvailabilityExceptionInput = z.infer<typeof createAvailabilityExceptionSchema>;

// ============================================================================
// PAYMENT SCHEMAS
// ============================================================================

export const createPaymentIntentSchema = z.object({
  bookingId: z.string().cuid(),
});

export const addPaymentMethodSchema = z.object({
  stripePaymentMethodId: z.string(),
  isDefault: z.boolean().default(false),
});

export type CreatePaymentIntentInput = z.infer<typeof createPaymentIntentSchema>;
export type AddPaymentMethodInput = z.infer<typeof addPaymentMethodSchema>;

// ============================================================================
// CERTIFICATION SCHEMAS
// ============================================================================

export const createCertificationSchema = z.object({
  name: z.string().min(2),
  issuingOrganization: z.string().min(2),
  issueDate: z.string().datetime(),
  expiryDate: z.string().datetime().optional(),
  credentialId: z.string().optional(),
  documentUrl: z.string().url().optional(),
});

export type CreateCertificationInput = z.infer<typeof createCertificationSchema>;

// ============================================================================
// EMERGENCY CONTACT SCHEMAS
// ============================================================================

export const emergencyContactSchema = z.object({
  name: z.string().min(2),
  relationship: z.string().min(2),
  phone: phoneSchema,
  email: emailSchema.optional(),
  isPrimary: z.boolean().default(false),
  canMakeDecisions: z.boolean().default(false),
});

export type EmergencyContactInput = z.infer<typeof emergencyContactSchema>;

// ============================================================================
// INCIDENT SCHEMAS
// ============================================================================

export const createIncidentSchema = z.object({
  bookingId: z.string().cuid().optional(),
  visitId: z.string().cuid().optional(),
  caregiverId: z.string().cuid(),
  careRecipientId: z.string().cuid(),
  type: z.enum([
    'FALL', 'MEDICATION_ERROR', 'INJURY', 'BEHAVIORAL', 'PROPERTY_DAMAGE',
    'ABUSE_ALLEGATION', 'NEGLECT_ALLEGATION', 'THEFT_ALLEGATION',
    'HEALTH_EMERGENCY', 'ELOPEMENT', 'OTHER'
  ]),
  severity: z.enum(['MINOR', 'MODERATE', 'MAJOR', 'CRITICAL']),
  description: z.string().min(20).max(5000),
  immediateActions: z.string().optional(),
  witnesses: z.string().optional(),
  injuryOccurred: z.boolean().default(false),
  injuryDescription: z.string().optional(),
  medicalAttentionRequired: z.boolean().default(false),
  emergencyServicesContacted: z.boolean().default(false),
  occurredAt: z.string().datetime(),
});

export type CreateIncidentInput = z.infer<typeof createIncidentSchema>;

// ============================================================================
// DISPUTE SCHEMAS
// ============================================================================

export const createDisputeSchema = z.object({
  bookingId: z.string().cuid(),
  type: z.enum(['BILLING', 'SERVICE_QUALITY', 'CANCELLATION', 'SAFETY', 'OTHER']),
  description: z.string().min(20).max(5000),
});

export const addDisputeEvidenceSchema = z.object({
  disputeId: z.string().cuid(),
  type: z.enum(['MESSAGE', 'DOCUMENT', 'IMAGE']),
  description: z.string().min(5).max(500),
  url: z.string().url().optional(),
});

export type CreateDisputeInput = z.infer<typeof createDisputeSchema>;
export type AddDisputeEvidenceInput = z.infer<typeof addDisputeEvidenceSchema>;

// ============================================================================
// SEARCH & FILTER SCHEMAS
// ============================================================================

export const caregiverSearchSchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radiusMiles: z.number().min(1).max(100).default(25),
  services: z.array(z.string()).optional(),
  specialties: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  minRate: z.number().optional(),
  maxRate: z.number().optional(),
  minRating: z.number().min(1).max(5).optional(),
  minExperience: z.number().optional(),
  availableDate: z.string().datetime().optional(),
  instantBook: z.boolean().optional(),
  sortBy: z.enum(['rating', 'price_low', 'price_high', 'distance', 'experience']).default('rating'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(20),
});

export type CaregiverSearchInput = z.infer<typeof caregiverSearchSchema>;

// ============================================================================
// PAGINATION
// ============================================================================

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
