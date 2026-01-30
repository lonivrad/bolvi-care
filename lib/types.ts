// ============================================================================
// CORE ENTITY TYPES
// ============================================================================

// Base types
export type UUID = string;
export type ISODateTime = string;
export type ISODate = string;
export type Email = string;
export type PhoneNumber = string;
export type URL = string;
export type Currency = number; // Stored in cents

// User roles
export type UserRole = 'family' | 'caregiver' | 'admin';

// ============================================================================
// USER & AUTHENTICATION
// ============================================================================

export interface BaseUser {
  id: UUID;
  email: Email;
  phone: PhoneNumber;
  name: string;
  photo: URL;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLoginAt: ISODateTime;
  status: UserStatus;
}

export type UserStatus = 'active' | 'suspended' | 'pending' | 'deactivated';

export interface FamilyUser extends BaseUser {
  role: 'family';
  careRecipients: CareRecipient[];
  careTeam: CareTeamMember[];
  paymentMethods: PaymentMethod[];
  address: Address;
  emergencyContacts: EmergencyContact[];
  preferences: FamilyPreferences;
}

export interface CaregiverUser extends BaseUser {
  role: 'caregiver';
  bio: string;
  headline: string;
  hourlyRate: Currency;
  yearsExperience: number;
  specialties: CareSpecialty[];
  certifications: Certification[];
  languages: Language[];
  availability: AvailabilitySchedule;
  serviceArea: ServiceArea;
  rating: number;
  reviewCount: number;
  completedVisits: number;
  responseRate: number;
  responseTime: number; // in minutes
  verificationStatus: VerificationStatus;
  backgroundCheck: BackgroundCheck;
  payoutInfo: PayoutInfo;
}

export interface AdminUser extends BaseUser {
  role: 'admin';
  permissions: AdminPermission[];
  department: string;
}

export type User = FamilyUser | CaregiverUser | AdminUser;

// Type guards
export function isFamilyUser(user: User): user is FamilyUser {
  return user.role === 'family';
}

export function isCaregiverUser(user: User): user is CaregiverUser {
  return user.role === 'caregiver';
}

export function isAdminUser(user: User): user is AdminUser {
  return user.role === 'admin';
}

// ============================================================================
// CARE RECIPIENT
// ============================================================================

export interface CareRecipient {
  id: UUID;
  familyId: UUID;
  name: string;
  photo?: URL;
  dateOfBirth: ISODate;
  gender: Gender;
  relationship: Relationship;
  address: Address;
  medicalConditions: MedicalCondition[];
  medications: Medication[];
  allergies: string[];
  mobilityLevel: MobilityLevel;
  cognitiveStatus: CognitiveStatus;
  dietaryRestrictions: string[];
  emergencyContacts: EmergencyContact[];
  primaryPhysician?: Physician;
  careNeeds: CareNeed[];
  preferences: CareRecipientPreferences;
  notes: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';
export type Relationship = 'parent' | 'grandparent' | 'spouse' | 'sibling' | 'relative' | 'friend' | 'other';
export type MobilityLevel = 'independent' | 'minimal_assistance' | 'moderate_assistance' | 'extensive_assistance' | 'dependent';
export type CognitiveStatus = 'intact' | 'mild_impairment' | 'moderate_impairment' | 'severe_impairment';

export interface MedicalCondition {
  id: UUID;
  name: string;
  diagnosedDate?: ISODate;
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

export interface Medication {
  id: UUID;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: ('morning' | 'afternoon' | 'evening' | 'night')[];
  prescribedBy?: string;
  startDate?: ISODate;
  endDate?: ISODate;
  notes?: string;
}

export interface Physician {
  name: string;
  specialty: string;
  phone: PhoneNumber;
  address?: Address;
}

export interface CareRecipientPreferences {
  preferredActivities: string[];
  communicationStyle: string;
  routineNotes: string;
  likes: string[];
  dislikes: string[];
}

// ============================================================================
// CARE SERVICES & SPECIALTIES
// ============================================================================

export type CareSpecialty =
  | 'dementia_care'
  | 'alzheimers_care'
  | 'parkinsons_care'
  | 'stroke_recovery'
  | 'post_surgery'
  | 'hospice_care'
  | 'respite_care'
  | 'companionship'
  | 'personal_care'
  | 'medication_management'
  | 'mobility_assistance'
  | 'meal_preparation'
  | 'light_housekeeping'
  | 'transportation'
  | 'exercise_assistance'
  | 'veteran_care';

export type CareNeed =
  | 'bathing'
  | 'dressing'
  | 'grooming'
  | 'toileting'
  | 'feeding'
  | 'mobility'
  | 'medication_reminders'
  | 'companionship'
  | 'meal_prep'
  | 'light_housekeeping'
  | 'transportation'
  | 'errands'
  | 'exercise'
  | 'cognitive_activities';

export interface Service {
  id: UUID;
  name: string;
  description: string;
  category: ServiceCategory;
  basePrice?: Currency;
  duration?: number; // in minutes
}

export type ServiceCategory =
  | 'personal_care'
  | 'companionship'
  | 'household'
  | 'medical'
  | 'transportation'
  | 'specialized';

// ============================================================================
// BOOKING & VISITS
// ============================================================================

export interface Booking {
  id: UUID;
  familyId: UUID;
  caregiverId: UUID;
  careRecipientId: UUID;
  status: BookingStatus;
  type: BookingType;
  scheduledStart: ISODateTime;
  scheduledEnd: ISODateTime;
  actualStart?: ISODateTime;
  actualEnd?: ISODateTime;
  services: CareNeed[];
  specialInstructions?: string;
  address: Address;
  pricing: BookingPricing;
  payment?: Payment;
  visitReport?: VisitReport;
  review?: Review;
  cancellation?: Cancellation;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export type BookingStatus =
  | 'pending'        // Awaiting caregiver acceptance
  | 'confirmed'      // Accepted by caregiver
  | 'in_progress'    // Visit currently happening
  | 'completed'      // Visit finished
  | 'cancelled'      // Cancelled by either party
  | 'disputed';      // Under dispute

export type BookingType = 'one_time' | 'recurring';

export interface BookingPricing {
  hourlyRate: Currency;
  estimatedHours: number;
  subtotal: Currency;
  platformFee: Currency;
  discount?: Currency;
  promoCode?: string;
  total: Currency;
}

export interface RecurringSchedule {
  id: UUID;
  bookingTemplateId: UUID;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  daysOfWeek?: number[]; // 0-6 for weekly
  startDate: ISODate;
  endDate?: ISODate;
  exceptions: ISODate[]; // Dates to skip
}

// ============================================================================
// VISIT & REPORTING
// ============================================================================

export interface Visit {
  id: UUID;
  bookingId: UUID;
  caregiverId: UUID;
  careRecipientId: UUID;
  status: VisitStatus;
  checkInTime?: ISODateTime;
  checkInLocation?: GeoLocation;
  checkOutTime?: ISODateTime;
  checkOutLocation?: GeoLocation;
  activities: VisitActivity[];
  notes: string;
  moodRating?: MoodRating;
  photos?: VisitPhoto[];
}

export type VisitStatus = 'scheduled' | 'checked_in' | 'in_progress' | 'checked_out' | 'report_pending' | 'completed';

export interface VisitActivity {
  id: UUID;
  type: CareNeed;
  completedAt: ISODateTime;
  duration?: number;
  notes?: string;
}

export interface VisitPhoto {
  id: UUID;
  url: URL;
  caption?: string;
  uploadedAt: ISODateTime;
}

export type MoodRating = 1 | 2 | 3 | 4 | 5;

export interface VisitReport {
  id: UUID;
  visitId: UUID;
  submittedAt: ISODateTime;
  summary: string;
  activitiesCompleted: VisitActivity[];
  medicationsGiven: MedicationLog[];
  mealsProvided: MealLog[];
  vitalSigns?: VitalSignsLog;
  mood: MoodRating;
  moodNotes?: string;
  concerns?: string;
  recommendations?: string;
  nextVisitNotes?: string;
  photos: VisitPhoto[];
}

export interface MedicationLog {
  medicationId: UUID;
  medicationName: string;
  givenAt: ISODateTime;
  dosage: string;
  notes?: string;
  skipped?: boolean;
  skipReason?: string;
}

export interface MealLog {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: ISODateTime;
  description: string;
  appetiteLevel: 'poor' | 'fair' | 'good' | 'excellent';
  hydration?: string;
}

export interface VitalSignsLog {
  bloodPressure?: { systolic: number; diastolic: number };
  heartRate?: number;
  temperature?: number;
  weight?: number;
  bloodSugar?: number;
  oxygenSaturation?: number;
  notes?: string;
}

// ============================================================================
// REVIEWS & RATINGS
// ============================================================================

export interface Review {
  id: UUID;
  bookingId: UUID;
  authorId: UUID;
  authorType: 'family' | 'caregiver';
  authorName: string;
  authorPhoto: URL;
  targetId: UUID;
  targetType: 'family' | 'caregiver';
  rating: number; // 1-5
  content: string;
  categories?: ReviewCategories;
  response?: ReviewResponse;
  isPublic: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface ReviewCategories {
  punctuality?: number;
  communication?: number;
  professionalism?: number;
  careQuality?: number;
  reliability?: number;
}

export interface ReviewResponse {
  content: string;
  respondedAt: ISODateTime;
}

// ============================================================================
// MESSAGING
// ============================================================================

export interface Conversation {
  id: UUID;
  participants: ConversationParticipant[];
  type: 'direct' | 'group';
  lastMessageAt: ISODateTime;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: ISODateTime;
}

export interface ConversationParticipant {
  userId: UUID;
  name: string;
  photo: URL;
  role: UserRole;
  joinedAt: ISODateTime;
  lastReadAt?: ISODateTime;
}

export interface Message {
  id: UUID;
  conversationId: UUID;
  senderId: UUID;
  senderName: string;
  senderPhoto: URL;
  content: string;
  type: MessageType;
  attachments?: MessageAttachment[];
  readBy: UUID[];
  createdAt: ISODateTime;
  editedAt?: ISODateTime;
  deletedAt?: ISODateTime;
}

export type MessageType = 'text' | 'image' | 'file' | 'system' | 'booking_request' | 'visit_update';

export interface MessageAttachment {
  id: UUID;
  type: 'image' | 'document' | 'audio';
  url: URL;
  name: string;
  size: number;
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export interface Notification {
  id: UUID;
  userId: UUID;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  actionUrl?: string;
  createdAt: ISODateTime;
}

export type NotificationType =
  | 'booking_request'
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'booking_reminder'
  | 'visit_started'
  | 'visit_completed'
  | 'new_message'
  | 'new_review'
  | 'payment_received'
  | 'payment_sent'
  | 'verification_approved'
  | 'verification_rejected'
  | 'system_alert';

// ============================================================================
// PAYMENTS & FINANCIAL
// ============================================================================

export interface Payment {
  id: UUID;
  bookingId: UUID;
  payerId: UUID;
  payeeId: UUID;
  amount: Currency;
  platformFee: Currency;
  payeeAmount: Currency;
  status: PaymentStatus;
  method: PaymentMethodType;
  transactionId?: string;
  processedAt?: ISODateTime;
  createdAt: ISODateTime;
}

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'disputed';

export interface PaymentMethod {
  id: UUID;
  userId: UUID;
  type: PaymentMethodType;
  last4: string;
  expiryMonth?: number;
  expiryYear?: number;
  brand?: string;
  isDefault: boolean;
  createdAt: ISODateTime;
}

export type PaymentMethodType = 'card' | 'bank_account' | 'paypal';

export interface PayoutInfo {
  accountType: 'bank_account' | 'paypal' | 'venmo';
  accountLast4: string;
  routingNumber?: string;
  payoutSchedule: 'weekly' | 'biweekly' | 'monthly';
  minimumPayout: Currency;
}

export interface Payout {
  id: UUID;
  caregiverId: UUID;
  amount: Currency;
  status: PayoutStatus;
  periodStart: ISODate;
  periodEnd: ISODate;
  bookingIds: UUID[];
  processedAt?: ISODateTime;
  createdAt: ISODateTime;
}

export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Cancellation {
  id: UUID;
  bookingId: UUID;
  cancelledBy: UUID;
  cancelledByRole: UserRole;
  reason: CancellationReason;
  notes?: string;
  refundAmount?: Currency;
  refundStatus?: 'pending' | 'processed' | 'denied';
  cancelledAt: ISODateTime;
}

export type CancellationReason =
  | 'schedule_conflict'
  | 'emergency'
  | 'illness'
  | 'found_alternative'
  | 'cost'
  | 'no_longer_needed'
  | 'other';

// ============================================================================
// VERIFICATION & COMPLIANCE
// ============================================================================

export interface VerificationStatus {
  identity: VerificationState;
  background: VerificationState;
  certifications: VerificationState;
  references: VerificationState;
  overall: 'unverified' | 'pending' | 'verified' | 'rejected';
}

export type VerificationState = 'not_submitted' | 'pending' | 'approved' | 'rejected' | 'expired';

export interface BackgroundCheck {
  id: UUID;
  caregiverId: UUID;
  provider: string;
  status: VerificationState;
  submittedAt: ISODateTime;
  completedAt?: ISODateTime;
  expiresAt?: ISODateTime;
  result?: 'clear' | 'review_required' | 'failed';
  notes?: string;
}

export interface Certification {
  id: UUID;
  name: string;
  issuingOrganization: string;
  issueDate: ISODate;
  expiryDate?: ISODate;
  credentialId?: string;
  documentUrl?: URL;
  verified: boolean;
  verifiedAt?: ISODateTime;
}

export interface Reference {
  id: UUID;
  caregiverId: UUID;
  name: string;
  relationship: string;
  phone: PhoneNumber;
  email?: Email;
  yearsKnown: number;
  status: 'pending' | 'contacted' | 'verified' | 'failed';
  notes?: string;
  verifiedAt?: ISODateTime;
}

// ============================================================================
// AVAILABILITY & SCHEDULING
// ============================================================================

export interface AvailabilitySchedule {
  regularHours: WeeklySchedule;
  exceptions: AvailabilityException[];
  timezone: string;
  minimumNotice: number; // hours
  maximumAdvanceBooking: number; // days
}

export interface WeeklySchedule {
  sunday: TimeSlot[];
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
}

export interface TimeSlot {
  start: string; // HH:MM format
  end: string;
}

export interface AvailabilityException {
  id: UUID;
  date: ISODate;
  type: 'unavailable' | 'modified';
  slots?: TimeSlot[];
  reason?: string;
}

// ============================================================================
// LOCATION & GEOGRAPHY
// ============================================================================

export interface Address {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface ServiceArea {
  type: 'radius' | 'zipcodes' | 'cities';
  center?: GeoLocation;
  radiusMiles?: number;
  zipcodes?: string[];
  cities?: string[];
}

// ============================================================================
// CARE TEAM
// ============================================================================

export interface CareTeamMember {
  id: UUID;
  caregiverId: UUID;
  caregiver: CaregiverUser;
  familyId: UUID;
  addedAt: ISODateTime;
  status: 'active' | 'inactive' | 'blocked';
  isPrimary: boolean;
  notes?: string;
  totalVisits: number;
  totalHours: number;
  lastVisitAt?: ISODateTime;
}

// ============================================================================
// EMERGENCY & CONTACTS
// ============================================================================

export interface EmergencyContact {
  id: UUID;
  name: string;
  relationship: string;
  phone: PhoneNumber;
  email?: Email;
  isPrimary: boolean;
  canMakeDecisions: boolean;
}

// ============================================================================
// TRAINING & CERTIFICATION
// ============================================================================

export interface Course {
  id: UUID;
  title: string;
  description: string;
  category: CourseCategory;
  duration: number; // in minutes
  modules: CourseModule[];
  thumbnail: URL;
  instructor?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  certification?: CourseCertification;
  requiredFor?: CareSpecialty[];
  createdAt: ISODateTime;
}

export type CourseCategory =
  | 'safety'
  | 'medical'
  | 'communication'
  | 'specialized_care'
  | 'professional_development'
  | 'compliance';

export interface CourseModule {
  id: UUID;
  title: string;
  type: 'video' | 'reading' | 'quiz' | 'interactive';
  duration: number;
  content?: string;
  videoUrl?: URL;
  quiz?: Quiz;
}

export interface Quiz {
  id: UUID;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number;
}

export interface QuizQuestion {
  id: UUID;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface CourseCertification {
  name: string;
  validityPeriod?: number; // months
  accreditedBy?: string;
}

export interface CourseProgress {
  courseId: UUID;
  userId: UUID;
  status: 'not_started' | 'in_progress' | 'completed';
  completedModules: UUID[];
  currentModuleId?: UUID;
  quizAttempts: QuizAttempt[];
  startedAt?: ISODateTime;
  completedAt?: ISODateTime;
  certificateUrl?: URL;
}

export interface QuizAttempt {
  quizId: UUID;
  score: number;
  passed: boolean;
  attemptedAt: ISODateTime;
  answers: number[];
}

// ============================================================================
// ANALYTICS & METRICS
// ============================================================================

export interface AnalyticsPeriod {
  start: ISODate;
  end: ISODate;
  granularity: 'day' | 'week' | 'month' | 'year';
}

export interface FamilyAnalytics {
  period: AnalyticsPeriod;
  totalSpent: Currency;
  totalHours: number;
  totalVisits: number;
  averageVisitDuration: number;
  caregiverBreakdown: CaregiverAnalyticsBreakdown[];
  serviceBreakdown: ServiceAnalyticsBreakdown[];
  spendingTrend: TimeSeriesData[];
  visitsTrend: TimeSeriesData[];
}

export interface CaregiverAnalytics {
  period: AnalyticsPeriod;
  totalEarnings: Currency;
  totalHours: number;
  totalVisits: number;
  averageRating: number;
  newReviews: number;
  clientBreakdown: ClientAnalyticsBreakdown[];
  earningsTrend: TimeSeriesData[];
  visitsTrend: TimeSeriesData[];
  performanceMetrics: PerformanceMetrics;
}

export interface CaregiverAnalyticsBreakdown {
  caregiverId: UUID;
  caregiverName: string;
  hours: number;
  visits: number;
  spent: Currency;
  percentage: number;
}

export interface ServiceAnalyticsBreakdown {
  service: CareNeed;
  hours: number;
  visits: number;
  spent: Currency;
  percentage: number;
}

export interface ClientAnalyticsBreakdown {
  familyId: UUID;
  familyName: string;
  hours: number;
  visits: number;
  earnings: Currency;
  percentage: number;
}

export interface TimeSeriesData {
  date: ISODate;
  value: number;
  label?: string;
}

export interface PerformanceMetrics {
  onTimeArrival: number;
  visitCompletion: number;
  clientSatisfaction: number;
  responseTime: number;
  repeatClientRate: number;
}

// ============================================================================
// ADMIN & PLATFORM
// ============================================================================

export interface PlatformMetrics {
  totalUsers: number;
  totalFamilies: number;
  totalCaregivers: number;
  activeBookings: number;
  completedVisits: number;
  totalRevenue: Currency;
  platformFees: Currency;
  averageBookingValue: Currency;
  caregiverRetention: number;
  familyRetention: number;
}

export interface Dispute {
  id: UUID;
  bookingId: UUID;
  familyId: UUID;
  caregiverId: UUID;
  type: DisputeType;
  status: DisputeStatus;
  description: string;
  evidence: DisputeEvidence[];
  resolution?: DisputeResolution;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export type DisputeType = 'billing' | 'service_quality' | 'cancellation' | 'safety' | 'other';
export type DisputeStatus = 'open' | 'investigating' | 'resolved' | 'escalated';

export interface DisputeEvidence {
  id: UUID;
  type: 'message' | 'document' | 'image';
  description: string;
  url?: URL;
  submittedBy: UUID;
  submittedAt: ISODateTime;
}

export interface DisputeResolution {
  outcome: 'family_favor' | 'caregiver_favor' | 'split' | 'no_action';
  refundAmount?: Currency;
  notes: string;
  resolvedBy: UUID;
  resolvedAt: ISODateTime;
}

export type AdminPermission =
  | 'users:read'
  | 'users:write'
  | 'users:delete'
  | 'bookings:read'
  | 'bookings:write'
  | 'payments:read'
  | 'payments:write'
  | 'disputes:read'
  | 'disputes:write'
  | 'verifications:read'
  | 'verifications:write'
  | 'analytics:read'
  | 'settings:write';

// ============================================================================
// PREFERENCES & SETTINGS
// ============================================================================

export interface FamilyPreferences {
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  communication: CommunicationPreferences;
  caregiverPreferences: CaregiverMatchPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  bookingReminders: boolean;
  visitUpdates: boolean;
  messageNotifications: boolean;
  marketingEmails: boolean;
  weeklyDigest: boolean;
}

export interface PrivacyPreferences {
  shareProfilePhoto: boolean;
  shareLocation: boolean;
  allowCaregiverContact: boolean;
  showOnlineStatus: boolean;
}

export interface CommunicationPreferences {
  preferredLanguage: Language;
  preferredContactMethod: 'email' | 'phone' | 'sms' | 'in_app';
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

export interface CaregiverMatchPreferences {
  preferredGender?: Gender;
  minimumExperience?: number;
  requiredCertifications?: string[];
  requiredLanguages?: Language[];
  maxHourlyRate?: Currency;
}

export type Language =
  | 'english'
  | 'spanish'
  | 'mandarin'
  | 'cantonese'
  | 'tagalog'
  | 'vietnamese'
  | 'korean'
  | 'japanese'
  | 'hindi'
  | 'arabic'
  | 'russian'
  | 'portuguese'
  | 'french'
  | 'german'
  | 'italian';

// ============================================================================
// ACCESSIBILITY
// ============================================================================

export interface AccessibilitySettings {
  fontSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
  colorBlindMode?: 'deuteranopia' | 'protanopia' | 'tritanopia';
  keyboardNavigation: boolean;
}

// ============================================================================
// UI STATE TYPES (for components)
// ============================================================================

export interface PaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterState {
  [key: string]: string | number | boolean | string[] | undefined;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Discriminated union for async states
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

// Type guard for async states
export function isSuccess<T>(state: AsyncState<T>): state is { status: 'success'; data: T } {
  return state.status === 'success';
}

export function isError<T>(state: AsyncState<T>): state is { status: 'error'; error: string } {
  return state.status === 'error';
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface BookingFormData {
  caregiverId: UUID;
  careRecipientId: UUID;
  date: ISODate;
  startTime: string;
  endTime: string;
  services: CareNeed[];
  specialInstructions?: string;
  recurring?: {
    enabled: boolean;
    frequency?: RecurringSchedule['frequency'];
    endDate?: ISODate;
  };
}

export interface CaregiverSignupFormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: Email;
    phone: PhoneNumber;
    dateOfBirth: ISODate;
    address: Address;
  };
  experience: {
    yearsExperience: number;
    specialties: CareSpecialty[];
    bio: string;
    hourlyRate: number;
  };
  availability: WeeklySchedule;
  certifications: Omit<Certification, 'id' | 'verified' | 'verifiedAt'>[];
  references: Omit<Reference, 'id' | 'caregiverId' | 'status' | 'verifiedAt'>[];
  documents: {
    governmentId?: File;
    certificationDocs?: File[];
  };
  agreements: {
    termsAccepted: boolean;
    backgroundCheckConsent: boolean;
    privacyPolicyAccepted: boolean;
  };
}

export interface FamilySignupFormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: Email;
    phone: PhoneNumber;
    address: Address;
  };
  careRecipient?: Omit<CareRecipient, 'id' | 'familyId' | 'createdAt' | 'updatedAt'>;
  agreements: {
    termsAccepted: boolean;
    privacyPolicyAccepted: boolean;
  };
}
