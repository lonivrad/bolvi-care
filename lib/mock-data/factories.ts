/**
 * Mock Data Factories
 *
 * These factories generate consistent, realistic mock data for
 * Bolvi Care. They ensure proper relationships between
 * entities and provide realistic data patterns.
 */

import type {
  UUID,
  ISODateTime,
  ISODate,
  FamilyUser,
  CaregiverUser,
  CareRecipient,
  Booking,
  BookingStatus,
  Review,
  Message,
  Conversation,
  Notification,
  NotificationType,
  Visit,
  VisitReport,
  Course,
  CourseProgress,
  CareSpecialty,
  CareNeed,
  Language,
  Certification,
  WeeklySchedule,
  TimeSlot,
  MedicalCondition,
  Medication,
  EmergencyContact,
  Address,
  Payment,
  PaymentStatus,
  Dispute,
  DisputeStatus,
} from '../types';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

let idCounter = 0;

export function generateId(prefix: string = ''): UUID {
  idCounter++;
  return `${prefix}${prefix ? '-' : ''}${Date.now()}-${idCounter}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateShortId(prefix: string = ''): UUID {
  return `${prefix}${prefix ? '-' : ''}${Math.random().toString(36).substr(2, 6)}`;
}

export function randomFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function randomSubset<T>(array: T[], min: number = 1, max?: number): T[] {
  const maxCount = max || array.length;
  const count = Math.floor(Math.random() * (maxCount - min + 1)) + min;
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomDecimal(min: number, max: number, decimals: number = 2): number {
  const num = Math.random() * (max - min) + min;
  return parseFloat(num.toFixed(decimals));
}

export function generatePastDate(daysAgo: number): ISODateTime {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

export function generateFutureDate(daysAhead: number): ISODateTime {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString();
}

export function generateDateInRange(startDaysAgo: number, endDaysAgo: number): ISODateTime {
  const daysAgo = randomNumber(endDaysAgo, startDaysAgo);
  return generatePastDate(daysAgo);
}

export function toISODate(date: Date | string): ISODate {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

// ============================================================================
// DATA POOLS
// ============================================================================

const FIRST_NAMES = [
  'Maria', 'Sarah', 'Jennifer', 'Lisa', 'Patricia', 'Linda', 'Elizabeth', 'Susan',
  'Jessica', 'Margaret', 'Dorothy', 'Karen', 'Nancy', 'Betty', 'Helen', 'Sandra',
  'James', 'John', 'Robert', 'Michael', 'David', 'William', 'Richard', 'Joseph',
  'Thomas', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Steven', 'Paul'
];

const LAST_NAMES = [
  'Rodriguez', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore',
  'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Clark', 'Lewis',
  'Robinson', 'Walker', 'Hall', 'Young', 'King', 'Wright', 'Chen', 'Kim'
];

const CITIES = [
  { city: 'Seattle', state: 'WA', zip: '98101' },
  { city: 'Bellevue', state: 'WA', zip: '98004' },
  { city: 'Tacoma', state: 'WA', zip: '98402' },
  { city: 'Kirkland', state: 'WA', zip: '98033' },
  { city: 'Redmond', state: 'WA', zip: '98052' },
  { city: 'Renton', state: 'WA', zip: '98055' },
  { city: 'Everett', state: 'WA', zip: '98201' },
  { city: 'Kent', state: 'WA', zip: '98032' },
];

const STREETS = [
  'Oak Street', 'Maple Avenue', 'Cedar Lane', 'Pine Road', 'Elm Street',
  'Washington Boulevard', 'Lincoln Avenue', 'Park Drive', 'Main Street',
  'Broadway', 'Market Street', 'Valencia Street', 'Mission Street'
];

const SPECIALTIES: CareSpecialty[] = [
  'dementia_care', 'alzheimers_care', 'parkinsons_care', 'stroke_recovery',
  'post_surgery', 'hospice_care', 'respite_care', 'companionship',
  'personal_care', 'medication_management', 'mobility_assistance',
  'meal_preparation', 'light_housekeeping', 'transportation'
];

const CARE_NEEDS: CareNeed[] = [
  'bathing', 'dressing', 'grooming', 'toileting', 'feeding', 'mobility',
  'medication_reminders', 'companionship', 'meal_prep', 'light_housekeeping',
  'transportation', 'errands', 'exercise', 'cognitive_activities'
];

const LANGUAGES: Language[] = [
  'english', 'spanish', 'mandarin', 'cantonese', 'tagalog',
  'vietnamese', 'korean', 'japanese', 'hindi', 'russian'
];

const MEDICAL_CONDITIONS = [
  'Alzheimer\'s Disease', 'Dementia', 'Parkinson\'s Disease', 'Diabetes Type 2',
  'Hypertension', 'Arthritis', 'Heart Disease', 'COPD', 'Stroke Recovery',
  'Osteoporosis', 'Depression', 'Anxiety', 'Chronic Pain', 'Vision Impairment'
];

const MEDICATIONS = [
  { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
  { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
  { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily' },
  { name: 'Omeprazole', dosage: '20mg', frequency: 'Once daily' },
  { name: 'Atorvastatin', dosage: '40mg', frequency: 'Once daily' },
  { name: 'Levothyroxine', dosage: '50mcg', frequency: 'Once daily' },
  { name: 'Aricept', dosage: '10mg', frequency: 'Once daily' },
  { name: 'Namenda', dosage: '10mg', frequency: 'Twice daily' },
];

const CAREGIVER_BIOS = [
  "Compassionate caregiver with over {years} years of experience caring for elderly clients. Specialized in dementia care and memory support. I believe in treating every client with dignity and respect while fostering independence.",
  "Dedicated healthcare professional passionate about improving seniors' quality of life. Certified in CPR, First Aid, and medication management. I enjoy creating meaningful connections with my clients and their families.",
  "Experienced caregiver specializing in post-surgical recovery and rehabilitation support. I take a holistic approach to care, focusing on physical, emotional, and social well-being.",
  "Warm and patient caregiver with expertise in Parkinson's and mobility assistance. Former nurse's aide with extensive hospital experience. Fluent in English and Spanish.",
  "Reliable and trustworthy caregiver committed to providing exceptional care. Skilled in meal preparation, light housekeeping, and transportation. I treat every client like family.",
];

const REVIEW_CONTENT = [
  "Absolutely wonderful caregiver! {name} is patient, kind, and truly cares about {recipient}'s well-being. Highly recommend!",
  "{name} has been a blessing to our family. Very professional and always goes above and beyond. {recipient} looks forward to every visit.",
  "We couldn't be happier with {name}. Great communication, reliable, and treats {recipient} with so much respect and dignity.",
  "Excellent caregiver! {name} is punctual, attentive, and has great experience with dementia care. Peace of mind for our whole family.",
  "{name} is amazing with {recipient}. Very patient and engaging. The detailed visit reports are so helpful for our family.",
];

const PHOTO_URLS = {
  female: [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
  ],
  male: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
  ],
  elderly: [
    'https://images.unsplash.com/photo-1581579438747-104c53d7fbc4?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop',
  ]
};

// ============================================================================
// FACTORIES
// ============================================================================

export function createAddress(overrides?: Partial<Address>): Address {
  const location = randomFromArray(CITIES);
  return {
    street: `${randomNumber(100, 9999)} ${randomFromArray(STREETS)}`,
    city: location.city,
    state: location.state,
    zipCode: location.zip,
    country: 'USA',
    ...overrides,
  };
}

export function createEmergencyContact(overrides?: Partial<EmergencyContact>): EmergencyContact {
  const firstName = randomFromArray(FIRST_NAMES);
  const lastName = randomFromArray(LAST_NAMES);
  return {
    id: generateShortId('ec'),
    name: `${firstName} ${lastName}`,
    relationship: randomFromArray(['Spouse', 'Son', 'Daughter', 'Sibling', 'Friend']),
    phone: `(${randomNumber(200, 999)}) ${randomNumber(200, 999)}-${randomNumber(1000, 9999)}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    isPrimary: false,
    canMakeDecisions: true,
    ...overrides,
  };
}

export function createMedicalCondition(overrides?: Partial<MedicalCondition>): MedicalCondition {
  return {
    id: generateShortId('mc'),
    name: randomFromArray(MEDICAL_CONDITIONS),
    severity: randomFromArray(['mild', 'moderate', 'severe']),
    diagnosedDate: toISODate(generatePastDate(randomNumber(365, 3650))),
    ...overrides,
  };
}

export function createMedication(overrides?: Partial<Medication>): Medication {
  const med = randomFromArray(MEDICATIONS);
  return {
    id: generateShortId('med'),
    name: med.name,
    dosage: med.dosage,
    frequency: med.frequency,
    timeOfDay: randomSubset(['morning', 'afternoon', 'evening', 'night'], 1, 2),
    startDate: toISODate(generatePastDate(randomNumber(30, 365))),
    ...overrides,
  };
}

export function createCertification(overrides?: Partial<Certification>): Certification {
  const certifications = [
    { name: 'Certified Nursing Assistant (CNA)', org: 'Washington State Department of Health' },
    { name: 'CPR/First Aid Certification', org: 'American Red Cross' },
    { name: 'Home Health Aide (HHA)', org: 'Washington Home Care Services' },
    { name: 'Dementia Care Specialist', org: 'Alzheimer\'s Association' },
    { name: 'Medication Administration', org: 'State Board of Nursing' },
  ];
  const cert = randomFromArray(certifications);
  const issueDate = generatePastDate(randomNumber(180, 1095));

  return {
    id: generateShortId('cert'),
    name: cert.name,
    issuingOrganization: cert.org,
    issueDate: toISODate(issueDate),
    expiryDate: toISODate(generateFutureDate(randomNumber(180, 730))),
    verified: Math.random() > 0.2,
    verifiedAt: generatePastDate(randomNumber(1, 30)),
    ...overrides,
  };
}

export function createWeeklySchedule(): WeeklySchedule {
  const createDaySlots = (available: boolean): TimeSlot[] => {
    if (!available) return [];
    const startHour = randomNumber(7, 10);
    const endHour = randomNumber(17, 21);
    return [{ start: `${startHour.toString().padStart(2, '0')}:00`, end: `${endHour.toString().padStart(2, '0')}:00` }];
  };

  return {
    sunday: createDaySlots(Math.random() > 0.5),
    monday: createDaySlots(Math.random() > 0.2),
    tuesday: createDaySlots(Math.random() > 0.2),
    wednesday: createDaySlots(Math.random() > 0.2),
    thursday: createDaySlots(Math.random() > 0.2),
    friday: createDaySlots(Math.random() > 0.2),
    saturday: createDaySlots(Math.random() > 0.4),
  };
}

export function createCareRecipient(familyId: UUID, overrides?: Partial<CareRecipient>): CareRecipient {
  const firstName = randomFromArray(FIRST_NAMES);
  const lastName = randomFromArray(LAST_NAMES);
  const age = randomNumber(65, 95);
  const birthYear = new Date().getFullYear() - age;

  return {
    id: generateShortId('cr'),
    familyId,
    name: `${firstName} ${lastName}`,
    photo: randomFromArray(PHOTO_URLS.elderly),
    dateOfBirth: `${birthYear}-${randomNumber(1, 12).toString().padStart(2, '0')}-${randomNumber(1, 28).toString().padStart(2, '0')}`,
    gender: randomFromArray(['male', 'female']),
    relationship: randomFromArray(['parent', 'grandparent', 'spouse', 'relative']),
    address: createAddress(),
    medicalConditions: Array.from({ length: randomNumber(1, 3) }, () => createMedicalCondition()),
    medications: Array.from({ length: randomNumber(2, 5) }, () => createMedication()),
    allergies: randomSubset(['Penicillin', 'Sulfa', 'Latex', 'Shellfish', 'Peanuts', 'None'], 0, 2),
    mobilityLevel: randomFromArray(['independent', 'minimal_assistance', 'moderate_assistance', 'extensive_assistance']),
    cognitiveStatus: randomFromArray(['intact', 'mild_impairment', 'moderate_impairment']),
    dietaryRestrictions: randomSubset(['Low Sodium', 'Diabetic', 'Soft Foods', 'Gluten-Free', 'None'], 0, 2),
    emergencyContacts: [createEmergencyContact({ isPrimary: true }), createEmergencyContact()],
    careNeeds: randomSubset(CARE_NEEDS, 3, 7),
    preferences: {
      preferredActivities: randomSubset(['Reading', 'Puzzles', 'Walking', 'Music', 'TV', 'Gardening', 'Cards'], 2, 4),
      communicationStyle: randomFromArray(['Direct and clear', 'Gentle and patient', 'Encouraging']),
      routineNotes: 'Prefers morning activities. Naps after lunch.',
      likes: randomSubset(['Classical music', 'Nature documentaries', 'Family photos', 'Tea'], 2, 3),
      dislikes: randomSubset(['Loud noises', 'Rushed activities', 'Cold food'], 1, 2),
    },
    notes: '',
    createdAt: generatePastDate(randomNumber(30, 365)),
    updatedAt: generatePastDate(randomNumber(1, 30)),
    ...overrides,
  };
}

export function createFamilyUser(overrides?: Partial<FamilyUser>): FamilyUser {
  const firstName = randomFromArray(FIRST_NAMES);
  const lastName = randomFromArray(LAST_NAMES);
  const isFemale = Math.random() > 0.4;
  const id = generateShortId('f');

  const user: FamilyUser = {
    id,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    phone: `(${randomNumber(200, 999)}) ${randomNumber(200, 999)}-${randomNumber(1000, 9999)}`,
    name: `${firstName} ${lastName}`,
    photo: randomFromArray(isFemale ? PHOTO_URLS.female : PHOTO_URLS.male),
    createdAt: generatePastDate(randomNumber(60, 400)),
    updatedAt: generatePastDate(randomNumber(1, 30)),
    emailVerified: true,
    phoneVerified: Math.random() > 0.2,
    lastLoginAt: generatePastDate(randomNumber(0, 7)),
    status: 'active',
    role: 'family',
    careRecipients: [],
    careTeam: [],
    paymentMethods: [{
      id: generateShortId('pm'),
      userId: id,
      type: 'card',
      last4: randomNumber(1000, 9999).toString(),
      expiryMonth: randomNumber(1, 12),
      expiryYear: randomNumber(2025, 2029),
      brand: randomFromArray(['visa', 'mastercard', 'amex']),
      isDefault: true,
      createdAt: generatePastDate(randomNumber(30, 200)),
    }],
    address: createAddress(),
    emergencyContacts: [createEmergencyContact({ isPrimary: true })],
    preferences: {
      notifications: {
        email: true,
        sms: true,
        push: true,
        bookingReminders: true,
        visitUpdates: true,
        messageNotifications: true,
        marketingEmails: false,
        weeklyDigest: true,
      },
      privacy: {
        shareProfilePhoto: true,
        shareLocation: false,
        allowCaregiverContact: true,
        showOnlineStatus: true,
      },
      communication: {
        preferredLanguage: 'english',
        preferredContactMethod: 'in_app',
      },
      caregiverPreferences: {},
    },
    ...overrides,
  };

  // Add care recipients
  user.careRecipients = Array.from(
    { length: randomNumber(1, 2) },
    () => createCareRecipient(user.id)
  );

  return user;
}

export function createCaregiverUser(overrides?: Partial<CaregiverUser>): CaregiverUser {
  const firstName = randomFromArray(FIRST_NAMES);
  const lastName = randomFromArray(LAST_NAMES);
  const isFemale = Math.random() > 0.3;
  const yearsExperience = randomNumber(2, 20);
  const id = generateShortId('cg');

  return {
    id,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@caregivers.com`,
    phone: `(${randomNumber(200, 999)}) ${randomNumber(200, 999)}-${randomNumber(1000, 9999)}`,
    name: `${firstName} ${lastName}`,
    photo: randomFromArray(isFemale ? PHOTO_URLS.female : PHOTO_URLS.male),
    createdAt: generatePastDate(randomNumber(90, 500)),
    updatedAt: generatePastDate(randomNumber(1, 14)),
    emailVerified: true,
    phoneVerified: true,
    lastLoginAt: generatePastDate(randomNumber(0, 3)),
    status: 'active',
    role: 'caregiver',
    bio: randomFromArray(CAREGIVER_BIOS).replace('{years}', yearsExperience.toString()),
    headline: `Compassionate ${randomFromArray(['Caregiver', 'Care Professional', 'Senior Care Specialist'])} | ${yearsExperience} Years Experience`,
    hourlyRate: randomNumber(2800, 6500), // in cents
    yearsExperience,
    specialties: randomSubset(SPECIALTIES, 3, 6),
    certifications: Array.from({ length: randomNumber(2, 4) }, () => createCertification()),
    languages: ['english', ...randomSubset(LANGUAGES.filter(l => l !== 'english'), 0, 2)] as Language[],
    availability: {
      regularHours: createWeeklySchedule(),
      exceptions: [],
      timezone: 'America/Los_Angeles',
      minimumNotice: randomNumber(2, 24),
      maximumAdvanceBooking: randomNumber(30, 90),
    },
    serviceArea: {
      type: 'radius',
      center: { latitude: 47.6062, longitude: -122.3321 },
      radiusMiles: randomNumber(10, 25),
    },
    rating: randomDecimal(4.5, 5.0, 1),
    reviewCount: randomNumber(5, 150),
    completedVisits: randomNumber(20, 500),
    responseRate: randomNumber(90, 100),
    responseTime: randomNumber(5, 60),
    verificationStatus: {
      identity: 'approved',
      background: 'approved',
      certifications: Math.random() > 0.2 ? 'approved' : 'pending',
      references: 'approved',
      overall: 'verified',
    },
    backgroundCheck: {
      id: generateShortId('bg'),
      caregiverId: id,
      provider: 'Checkr',
      status: 'approved',
      submittedAt: generatePastDate(randomNumber(90, 365)),
      completedAt: generatePastDate(randomNumber(80, 355)),
      expiresAt: generateFutureDate(randomNumber(180, 365)),
      result: 'clear',
    },
    ...overrides,
  };
}

export function createBooking(
  familyId: UUID,
  caregiverId: UUID,
  careRecipientId: UUID,
  overrides?: Partial<Booking>
): Booking {
  const status = overrides?.status || randomFromArray<BookingStatus>([
    'pending', 'confirmed', 'completed', 'cancelled'
  ]);

  const isPast = status === 'completed' || status === 'cancelled';
  const baseDate = isPast
    ? generatePastDate(randomNumber(1, 60))
    : generateFutureDate(randomNumber(1, 30));

  const startDate = new Date(baseDate);
  startDate.setHours(randomNumber(8, 14), 0, 0, 0);

  const hours = randomNumber(2, 6);
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + hours);

  const hourlyRate = randomNumber(2800, 5500);
  const subtotal = hourlyRate * hours;

  const id = generateShortId('b');

  return {
    id,
    familyId,
    caregiverId,
    careRecipientId,
    status,
    type: Math.random() > 0.7 ? 'recurring' : 'one_time',
    scheduledStart: startDate.toISOString(),
    scheduledEnd: endDate.toISOString(),
    actualStart: status === 'completed' ? startDate.toISOString() : undefined,
    actualEnd: status === 'completed' ? endDate.toISOString() : undefined,
    services: randomSubset(CARE_NEEDS, 2, 5),
    address: createAddress(),
    pricing: {
      hourlyRate,
      estimatedHours: hours,
      subtotal,
      total: subtotal,
    },
    createdAt: generatePastDate(randomNumber(isPast ? 61 : 1, isPast ? 90 : 14)),
    updatedAt: generatePastDate(randomNumber(0, 7)),
    ...overrides,
  };
}

export function createReview(
  bookingId: UUID,
  authorId: UUID,
  authorName: string,
  authorPhoto: string,
  targetId: UUID,
  careRecipientName: string,
  overrides?: Partial<Review>
): Review {
  const content = randomFromArray(REVIEW_CONTENT)
    .replace('{name}', authorName.split(' ')[0])
    .replace('{recipient}', careRecipientName);

  return {
    id: generateShortId('r'),
    bookingId,
    authorId,
    authorType: 'family',
    authorName,
    authorPhoto,
    targetId,
    targetType: 'caregiver',
    rating: randomNumber(4, 5),
    content,
    categories: {
      punctuality: randomNumber(4, 5),
      communication: randomNumber(4, 5),
      professionalism: randomNumber(4, 5),
      careQuality: randomNumber(4, 5),
      reliability: randomNumber(4, 5),
    },
    isPublic: true,
    createdAt: generatePastDate(randomNumber(1, 60)),
    updatedAt: generatePastDate(randomNumber(0, 30)),
    ...overrides,
  };
}

export function createMessage(
  conversationId: UUID,
  senderId: UUID,
  senderName: string,
  senderPhoto: string,
  content: string,
  overrides?: Partial<Message>
): Message {
  return {
    id: generateShortId('m'),
    conversationId,
    senderId,
    senderName,
    senderPhoto,
    content,
    type: 'text',
    readBy: [senderId],
    createdAt: generatePastDate(randomNumber(0, 7)),
    ...overrides,
  };
}

export function createConversation(
  participants: { userId: UUID; name: string; photo: string; role: 'family' | 'caregiver' }[],
  overrides?: Partial<Conversation>
): Conversation {
  return {
    id: generateShortId('conv'),
    participants: participants.map(p => ({
      ...p,
      joinedAt: generatePastDate(randomNumber(30, 180)),
      lastReadAt: generatePastDate(randomNumber(0, 2)),
    })),
    type: 'direct',
    lastMessageAt: generatePastDate(randomNumber(0, 7)),
    unreadCount: randomNumber(0, 5),
    createdAt: generatePastDate(randomNumber(30, 180)),
    ...overrides,
  };
}

export function createNotification(
  userId: UUID,
  type: NotificationType,
  overrides?: Partial<Notification>
): Notification {
  const templates: Record<NotificationType, { title: string; message: string }> = {
    booking_request: {
      title: 'New Booking Request',
      message: 'You have a new care request for next week.',
    },
    booking_confirmed: {
      title: 'Booking Confirmed',
      message: 'Your booking has been confirmed by the caregiver.',
    },
    booking_cancelled: {
      title: 'Booking Cancelled',
      message: 'A booking has been cancelled.',
    },
    booking_reminder: {
      title: 'Upcoming Visit Reminder',
      message: 'You have a visit scheduled for tomorrow.',
    },
    visit_started: {
      title: 'Visit Started',
      message: 'Your caregiver has checked in and started the visit.',
    },
    visit_completed: {
      title: 'Visit Completed',
      message: 'The visit has been completed. View the report.',
    },
    new_message: {
      title: 'New Message',
      message: 'You have a new message.',
    },
    new_review: {
      title: 'New Review',
      message: 'You received a new 5-star review!',
    },
    payment_received: {
      title: 'Payment Received',
      message: 'Your payment has been processed successfully.',
    },
    payment_sent: {
      title: 'Payment Sent',
      message: 'Your payment to Bolvi Care has been processed.',
    },
    verification_approved: {
      title: 'Verification Approved',
      message: 'Your background check has been approved.',
    },
    verification_rejected: {
      title: 'Verification Issue',
      message: 'There was an issue with your verification. Please contact support.',
    },
    system_alert: {
      title: 'System Update',
      message: 'We have updated our terms of service.',
    },
  };

  const template = templates[type];

  return {
    id: generateShortId('n'),
    userId,
    type,
    title: template.title,
    message: template.message,
    read: Math.random() > 0.5,
    createdAt: generatePastDate(randomNumber(0, 14)),
    ...overrides,
  };
}

export function createCourse(overrides?: Partial<Course>): Course {
  const courses = [
    {
      title: 'Dementia Care Fundamentals',
      description: 'Learn essential techniques for caring for individuals with dementia and Alzheimer\'s disease.',
      category: 'specialized_care' as const,
      duration: 120,
    },
    {
      title: 'CPR & First Aid Certification',
      description: 'Comprehensive training in emergency response, CPR, and first aid techniques.',
      category: 'safety' as const,
      duration: 180,
    },
    {
      title: 'Medication Management',
      description: 'Best practices for medication administration, tracking, and safety.',
      category: 'medical' as const,
      duration: 90,
    },
    {
      title: 'Effective Communication with Seniors',
      description: 'Develop skills for clear, compassionate communication with elderly clients.',
      category: 'communication' as const,
      duration: 60,
    },
    {
      title: 'Fall Prevention & Mobility Support',
      description: 'Techniques for preventing falls and assisting with safe mobility.',
      category: 'safety' as const,
      duration: 75,
    },
  ];

  const course = randomFromArray(courses);

  return {
    id: generateShortId('course'),
    title: course.title,
    description: course.description,
    category: course.category,
    duration: course.duration,
    modules: [
      {
        id: generateShortId('mod'),
        title: 'Introduction',
        type: 'video',
        duration: 15,
        videoUrl: 'https://example.com/video1.mp4',
      },
      {
        id: generateShortId('mod'),
        title: 'Core Concepts',
        type: 'reading',
        duration: 20,
        content: 'Module content here...',
      },
      {
        id: generateShortId('mod'),
        title: 'Assessment',
        type: 'quiz',
        duration: 15,
        quiz: {
          id: generateShortId('quiz'),
          questions: [
            {
              id: generateShortId('q'),
              question: 'Sample question?',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 0,
            },
          ],
          passingScore: 80,
        },
      },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
    level: randomFromArray(['beginner', 'intermediate', 'advanced']),
    createdAt: generatePastDate(randomNumber(90, 365)),
    ...overrides,
  };
}

export function createDispute(
  bookingId: UUID,
  familyId: UUID,
  caregiverId: UUID,
  overrides?: Partial<Dispute>
): Dispute {
  const types = [
    { type: 'billing' as const, desc: 'Dispute regarding billing discrepancy.' },
    { type: 'service_quality' as const, desc: 'Concerns about quality of care provided.' },
    { type: 'cancellation' as const, desc: 'Dispute regarding cancellation fee.' },
  ];

  const selected = randomFromArray(types);

  return {
    id: generateShortId('d'),
    bookingId,
    familyId,
    caregiverId,
    type: selected.type,
    status: randomFromArray<DisputeStatus>(['open', 'investigating', 'resolved']),
    description: selected.desc,
    evidence: [],
    createdAt: generatePastDate(randomNumber(1, 30)),
    updatedAt: generatePastDate(randomNumber(0, 14)),
    ...overrides,
  };
}

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

export interface MockDatabase {
  families: FamilyUser[];
  caregivers: CaregiverUser[];
  bookings: Booking[];
  reviews: Review[];
  conversations: Conversation[];
  messages: Message[];
  notifications: Notification[];
  courses: Course[];
  disputes: Dispute[];
}

export function seedMockDatabase(
  familyCount: number = 10,
  caregiverCount: number = 20
): MockDatabase {
  // Create users
  const families = Array.from({ length: familyCount }, () => createFamilyUser());
  const caregivers = Array.from({ length: caregiverCount }, () => createCaregiverUser());

  const bookings: Booking[] = [];
  const reviews: Review[] = [];
  const conversations: Conversation[] = [];
  const messages: Message[] = [];
  const notifications: Notification[] = [];
  const disputes: Dispute[] = [];

  // Create bookings and related data
  families.forEach(family => {
    const familyCaregivers = randomSubset(caregivers, 1, 3);

    familyCaregivers.forEach(caregiver => {
      // Add to care team
      family.careTeam.push({
        id: generateShortId('ct'),
        caregiverId: caregiver.id,
        caregiver,
        familyId: family.id,
        addedAt: generatePastDate(randomNumber(30, 180)),
        status: 'active',
        isPrimary: family.careTeam.length === 0,
        totalVisits: randomNumber(5, 50),
        totalHours: randomNumber(20, 200),
        lastVisitAt: generatePastDate(randomNumber(1, 14)),
      });

      // Create bookings
      const bookingCount = randomNumber(2, 5);
      for (let i = 0; i < bookingCount; i++) {
        const careRecipient = randomFromArray(family.careRecipients);
        const booking = createBooking(family.id, caregiver.id, careRecipient.id);
        bookings.push(booking);

        // Create review for completed bookings
        if (booking.status === 'completed' && Math.random() > 0.3) {
          const review = createReview(
            booking.id,
            family.id,
            family.name,
            family.photo,
            caregiver.id,
            careRecipient.name
          );
          reviews.push(review);
        }
      }

      // Create conversation
      const conversation = createConversation([
        { userId: family.id, name: family.name, photo: family.photo, role: 'family' },
        { userId: caregiver.id, name: caregiver.name, photo: caregiver.photo, role: 'caregiver' },
      ]);
      conversations.push(conversation);

      // Create messages
      const messageCount = randomNumber(3, 10);
      for (let i = 0; i < messageCount; i++) {
        const sender = Math.random() > 0.5 ? family : caregiver;
        const sampleMessages = [
          'Hi! I wanted to confirm our appointment for tomorrow.',
          'Of course! I\'ll be there at 10am as scheduled.',
          'Thank you so much! See you then.',
          'How was Mom doing today?',
          'She had a great day! We went for a walk in the garden.',
          'That\'s wonderful to hear. Thank you for the update.',
          'Is there anything specific you\'d like me to focus on next visit?',
          'Please help with some light exercises if possible.',
        ];
        const message = createMessage(
          conversation.id,
          sender.id,
          sender.name,
          sender.photo,
          randomFromArray(sampleMessages)
        );
        messages.push(message);
      }
    });

    // Create notifications
    const notificationTypes: NotificationType[] = [
      'booking_confirmed', 'booking_reminder', 'visit_completed',
      'new_message', 'payment_received'
    ];
    notificationTypes.forEach(type => {
      if (Math.random() > 0.5) {
        notifications.push(createNotification(family.id, type));
      }
    });
  });

  // Create caregiver notifications
  caregivers.forEach(caregiver => {
    const notificationTypes: NotificationType[] = [
      'booking_request', 'new_review', 'payment_sent', 'verification_approved'
    ];
    notificationTypes.forEach(type => {
      if (Math.random() > 0.5) {
        notifications.push(createNotification(caregiver.id, type));
      }
    });
  });

  // Create courses
  const courses = Array.from({ length: 8 }, () => createCourse());

  // Create some disputes
  const completedBookings = bookings.filter(b => b.status === 'completed');
  randomSubset(completedBookings, 0, 3).forEach(booking => {
    disputes.push(createDispute(booking.id, booking.familyId, booking.caregiverId));
  });

  return {
    families,
    caregivers,
    bookings,
    reviews,
    conversations,
    messages,
    notifications,
    courses,
    disputes,
  };
}
