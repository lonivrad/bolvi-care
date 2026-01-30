// Mock data for Bolvi Care

export interface Caregiver {
  id: string;
  name: string;
  photo: string;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  specialties: string[];
  languages: string[];
  certifications: string[];
  bio: string;
  availability: 'available' | 'busy' | 'offline';
  responseTime: string;
  completedVisits: number;
  badges: string[];
  location: string;
  distance?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  instantBook: boolean;
}

export interface Review {
  id: string;
  caregiverId: string;
  authorName: string;
  authorPhoto: string;
  rating: number;
  date: string;
  content: string;
  caregiverResponse?: string;
  verified: boolean;
}

export interface CareRecipient {
  id: string;
  name: string;
  photo: string;
  age: number;
  relationship: string;
  conditions: string[];
  mobility: string;
  preferences: string[];
  emergencyContacts: { name: string; phone: string; relationship: string }[];
}

export interface Booking {
  id: string;
  caregiverId: string;
  caregiverName: string;
  caregiverPhoto: string;
  recipientId: string;
  recipientName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  services: string[];
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled' | 'pending';
  totalCost: number;
  notes?: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderPhoto: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface MessageThread {
  id: string;
  participantId: string;
  participantName: string;
  participantPhoto: string;
  participantRole: 'caregiver' | 'family';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface Notification {
  id: string;
  type: 'booking' | 'message' | 'payment' | 'reminder' | 'system';
  title: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface VisitReport {
  id: string;
  bookingId: string;
  caregiverName: string;
  recipientName: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  duration: number;
  activitiesCompleted: string[];
  notes: string;
  mood: 'excellent' | 'good' | 'fair' | 'poor';
  energy: 'high' | 'moderate' | 'low';
  appetite: 'good' | 'fair' | 'poor';
  medicationsGiven: string[];
  photos: string[];
}

export interface FamilyUser {
  id: string;
  name: string;
  email: string;
  photo: string;
  phone: string;
  careRecipients: CareRecipient[];
  favoriteCaregiversIds: string[];
  memberSince: string;
}

export interface CaregiverUser {
  id: string;
  name: string;
  email: string;
  photo: string;
  phone: string;
  profile: Caregiver;
  earnings: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    pending: number;
    available: number;
  };
  stats: {
    acceptanceRate: number;
    cancellationRate: number;
    onTimeRate: number;
    responseRate: number;
  };
  memberSince: string;
}

// Sample Caregivers
export const caregivers: Caregiver[] = [
  {
    id: 'cg-1',
    name: 'Maria Rodriguez',
    photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
    hourlyRate: 35,
    rating: 4.9,
    reviewCount: 127,
    yearsExperience: 8,
    specialties: ['Dementia Care', 'Companionship', 'Medication Reminders', 'Meal Prep', 'Light Housekeeping'],
    languages: ['English', 'Spanish'],
    certifications: ['CPR Certified', 'First Aid', 'Dementia Care Specialist'],
    bio: 'I have been caring for seniors for over 8 years and truly love what I do. My grandmother inspired me to enter this field, and I treat every client like family. I specialize in dementia care and have completed advanced training in memory care techniques. I believe in maintaining dignity and independence while providing compassionate support.',
    availability: 'available',
    responseTime: 'Replies within 1 hour',
    completedVisits: 342,
    badges: ['Background Check', 'Top Rated', 'CPR Certified', 'COVID Vaccinated', 'Responsive'],
    location: 'San Francisco, CA',
    distance: 2.3,
    isFeatured: true,
    instantBook: true,
  },
  {
    id: 'cg-2',
    name: 'James Williams',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    hourlyRate: 40,
    rating: 4.8,
    reviewCount: 89,
    yearsExperience: 12,
    specialties: ['Personal Care', 'Transportation', 'Physical Therapy Support', 'Companionship'],
    languages: ['English'],
    certifications: ['CPR Certified', 'First Aid', 'CNA'],
    bio: 'Former CNA with 12 years of experience in senior care. I specialize in mobility assistance and have helped many clients maintain their independence. Patient, reliable, and committed to providing the highest quality care.',
    availability: 'available',
    responseTime: 'Replies within 2 hours',
    completedVisits: 256,
    badges: ['Background Check', 'CNA Certified', 'CPR Certified', 'COVID Vaccinated'],
    location: 'San Francisco, CA',
    distance: 3.1,
    instantBook: true,
  },
  {
    id: 'cg-3',
    name: 'Sarah Chen',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    hourlyRate: 45,
    rating: 5.0,
    reviewCount: 156,
    yearsExperience: 15,
    specialties: ['Hospice Care', 'Dementia Care', 'Medication Management', 'Personal Care', 'Companionship'],
    languages: ['English', 'Mandarin', 'Cantonese'],
    certifications: ['RN', 'CPR Certified', 'Hospice Certified', 'Dementia Care Specialist'],
    bio: 'Registered Nurse with 15 years of experience, specializing in hospice and end-of-life care. I provide compassionate, dignified care during life\'s most challenging moments. Fluent in English, Mandarin, and Cantonese.',
    availability: 'busy',
    responseTime: 'Replies within 3 hours',
    completedVisits: 489,
    badges: ['Background Check', 'Top Rated', 'RN', 'Hospice Certified', 'COVID Vaccinated', 'Consistent'],
    location: 'San Francisco, CA',
    distance: 4.5,
    isFeatured: true,
    instantBook: false,
  },
  {
    id: 'cg-4',
    name: 'Emily Thompson',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    hourlyRate: 30,
    rating: 4.7,
    reviewCount: 45,
    yearsExperience: 3,
    specialties: ['Companionship', 'Meal Prep', 'Light Housekeeping', 'Errands', 'Pet Care'],
    languages: ['English', 'French'],
    certifications: ['CPR Certified', 'First Aid'],
    bio: 'Friendly and energetic caregiver passionate about making a difference in seniors\' lives. I love cooking healthy meals, going for walks, and engaging in meaningful conversations. Every day is an opportunity to bring joy.',
    availability: 'available',
    responseTime: 'Replies within 1 hour',
    completedVisits: 78,
    badges: ['Background Check', 'Rising Star', 'CPR Certified', 'COVID Vaccinated', 'Responsive'],
    location: 'Oakland, CA',
    distance: 5.2,
    isNew: true,
    instantBook: true,
  },
  {
    id: 'cg-5',
    name: 'Michael Johnson',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    hourlyRate: 38,
    rating: 4.9,
    reviewCount: 112,
    yearsExperience: 10,
    specialties: ['Personal Care', 'Transportation', 'Companionship', 'Medication Reminders', 'Exercise Assistance'],
    languages: ['English'],
    certifications: ['CPR Certified', 'First Aid', 'Personal Training'],
    bio: 'Dedicated caregiver with a background in physical fitness. I help seniors stay active and healthy through gentle exercise programs and daily activities. My approach focuses on building strength, confidence, and independence.',
    availability: 'available',
    responseTime: 'Replies within 2 hours',
    completedVisits: 298,
    badges: ['Background Check', 'Top Rated', 'CPR Certified', 'COVID Vaccinated'],
    location: 'San Francisco, CA',
    distance: 1.8,
    instantBook: true,
  },
  {
    id: 'cg-6',
    name: 'Linda Martinez',
    photo: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop',
    hourlyRate: 42,
    rating: 4.8,
    reviewCount: 93,
    yearsExperience: 7,
    specialties: ['Dementia Care', 'Personal Care', 'Meal Prep', 'Medication Management', 'Night Care'],
    languages: ['English', 'Spanish', 'Portuguese'],
    certifications: ['CNA', 'CPR Certified', 'Dementia Care Specialist', 'Medication Aide'],
    bio: 'CNA with extensive experience in memory care facilities. I understand the unique challenges of dementia care and create calm, structured environments that help clients feel safe and comfortable.',
    availability: 'available',
    responseTime: 'Replies within 1 hour',
    completedVisits: 201,
    badges: ['Background Check', 'CNA Certified', 'Dementia Specialist', 'COVID Vaccinated', 'Responsive'],
    location: 'San Jose, CA',
    distance: 8.4,
    instantBook: false,
  },
  {
    id: 'cg-7',
    name: 'David Kim',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    hourlyRate: 32,
    rating: 4.6,
    reviewCount: 67,
    yearsExperience: 5,
    specialties: ['Companionship', 'Transportation', 'Tech Support', 'Errands', 'Light Housekeeping'],
    languages: ['English', 'Korean'],
    certifications: ['CPR Certified', 'First Aid'],
    bio: 'Tech-savvy caregiver who helps seniors stay connected with family through technology. I enjoy teaching clients how to video call, use tablets, and navigate the digital world while providing reliable companionship.',
    availability: 'available',
    responseTime: 'Replies within 2 hours',
    completedVisits: 134,
    badges: ['Background Check', 'CPR Certified', 'COVID Vaccinated'],
    location: 'San Francisco, CA',
    distance: 3.7,
    instantBook: true,
  },
  {
    id: 'cg-8',
    name: 'Patricia Adams',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    hourlyRate: 55,
    rating: 5.0,
    reviewCount: 203,
    yearsExperience: 20,
    specialties: ['Hospice Care', 'Personal Care', 'Medication Management', 'Family Support', 'Respite Care'],
    languages: ['English'],
    certifications: ['RN', 'Hospice Certified', 'Palliative Care', 'CPR Certified'],
    bio: 'Experienced RN specializing in end-of-life care for over 20 years. I provide comprehensive support for both patients and families during difficult times, focusing on comfort, dignity, and meaningful moments.',
    availability: 'busy',
    responseTime: 'Replies within 4 hours',
    completedVisits: 567,
    badges: ['Background Check', 'Top Rated', 'RN', 'Hospice Certified', 'COVID Vaccinated', 'Consistent'],
    location: 'San Francisco, CA',
    distance: 2.9,
    isFeatured: true,
    instantBook: false,
  },
  {
    id: 'cg-9',
    name: 'Robert Taylor',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    hourlyRate: 28,
    rating: 4.5,
    reviewCount: 34,
    yearsExperience: 2,
    specialties: ['Companionship', 'Transportation', 'Errands', 'Pet Care', 'Outdoor Activities'],
    languages: ['English'],
    certifications: ['CPR Certified', 'First Aid'],
    bio: 'New to professional caregiving but not to caring. I grew up helping my grandparents and understand the importance of patience and respect. I love outdoor activities and helping clients stay active.',
    availability: 'available',
    responseTime: 'Replies within 30 minutes',
    completedVisits: 52,
    badges: ['Background Check', 'Rising Star', 'CPR Certified', 'COVID Vaccinated', 'Responsive'],
    location: 'Berkeley, CA',
    distance: 6.1,
    isNew: true,
    instantBook: true,
  },
  {
    id: 'cg-10',
    name: 'Jennifer Wong',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    hourlyRate: 48,
    rating: 4.9,
    reviewCount: 178,
    yearsExperience: 11,
    specialties: ['Stroke Recovery', 'Physical Therapy Support', 'Personal Care', 'Medication Management', 'Speech Therapy Support'],
    languages: ['English', 'Cantonese', 'Mandarin'],
    certifications: ['Physical Therapy Aide', 'CPR Certified', 'First Aid', 'CNA'],
    bio: 'Specialized in stroke recovery and rehabilitation support. I work closely with physical and occupational therapists to help clients regain independence. My approach is encouraging, patient, and results-focused.',
    availability: 'available',
    responseTime: 'Replies within 2 hours',
    completedVisits: 312,
    badges: ['Background Check', 'Top Rated', 'PT Aide', 'CNA Certified', 'COVID Vaccinated'],
    location: 'San Francisco, CA',
    distance: 4.2,
    isFeatured: true,
    instantBook: false,
  },
];

// Sample Reviews
export const reviews: Review[] = [
  {
    id: 'r-1',
    caregiverId: 'cg-1',
    authorName: 'Sarah M.',
    authorPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    rating: 5,
    date: '2024-01-15',
    content: 'Maria is absolutely wonderful with my mother. She has a special way of connecting with dementia patients and always leaves mom in great spirits. Highly recommend!',
    caregiverResponse: 'Thank you so much, Sarah! Your mother is such a joy to spend time with. I look forward to our visits together.',
    verified: true,
  },
  {
    id: 'r-2',
    caregiverId: 'cg-1',
    authorName: 'John D.',
    authorPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    rating: 5,
    date: '2024-01-10',
    content: 'We\'ve been using Maria\'s services for 6 months now and couldn\'t be happier. She\'s reliable, punctual, and genuinely cares about our father\'s wellbeing. The visit reports are detailed and give us peace of mind.',
    verified: true,
  },
  {
    id: 'r-3',
    caregiverId: 'cg-1',
    authorName: 'Lisa K.',
    authorPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    rating: 4.5,
    date: '2024-01-05',
    content: 'Maria is professional and caring. My dad can be difficult but she handles situations with grace. The only reason for 4.5 stars is scheduling flexibility, but otherwise excellent!',
    caregiverResponse: 'Thank you Lisa! I completely understand about the scheduling - I\'m working on expanding my availability. Your dad is a pleasure!',
    verified: true,
  },
  {
    id: 'r-4',
    caregiverId: 'cg-2',
    authorName: 'Margaret H.',
    authorPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    rating: 5,
    date: '2024-01-18',
    content: 'James is incredibly strong and helpful with mobility. My husband needs assistance transferring and James makes him feel safe and dignified. True professional.',
    verified: true,
  },
  {
    id: 'r-5',
    caregiverId: 'cg-3',
    authorName: 'Robert L.',
    authorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    rating: 5,
    date: '2024-01-20',
    content: 'Sarah was a blessing during my mother\'s final months. Her nursing background was invaluable, and her compassion made an impossible time bearable for our whole family.',
    caregiverResponse: 'Robert, it was an honor to care for your mother. She was a beautiful soul and I think of her often.',
    verified: true,
  },
];

// Sample Family User
export const sampleFamilyUser: FamilyUser = {
  id: 'f-1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  phone: '(415) 555-0123',
  careRecipients: [
    {
      id: 'cr-1',
      name: 'Eleanor Johnson',
      photo: 'https://images.unsplash.com/photo-1581579186913-45ac3e6efe93?w=200&h=200&fit=crop',
      age: 82,
      relationship: 'Mother',
      conditions: ['Mild Dementia', 'Arthritis', 'Diabetes Type 2'],
      mobility: 'Walker required',
      preferences: ['Enjoys gardening', 'Loves classical music', 'Prefers female caregivers', 'Morning person'],
      emergencyContacts: [
        { name: 'Sarah Johnson', phone: '(415) 555-0123', relationship: 'Daughter' },
        { name: 'Michael Johnson', phone: '(415) 555-0124', relationship: 'Son' },
      ],
    },
    {
      id: 'cr-2',
      name: 'Robert Johnson',
      photo: 'https://images.unsplash.com/photo-1559963110-71b394e7494d?w=200&h=200&fit=crop',
      age: 85,
      relationship: 'Father',
      conditions: ['Post-Stroke', 'High Blood Pressure'],
      mobility: 'Wheelchair bound',
      preferences: ['Enjoys sports on TV', 'Likes board games', 'Afternoon naps required', 'Enjoys conversation'],
      emergencyContacts: [
        { name: 'Sarah Johnson', phone: '(415) 555-0123', relationship: 'Daughter' },
        { name: 'Michael Johnson', phone: '(415) 555-0124', relationship: 'Son' },
      ],
    },
  ],
  favoriteCaregiversIds: ['cg-1', 'cg-3', 'cg-5'],
  memberSince: '2023-06-15',
};

// Sample Caregiver User
export const sampleCaregiverUser: CaregiverUser = {
  id: 'cg-1',
  name: 'Maria Rodriguez',
  email: 'maria.rodriguez@email.com',
  photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop',
  phone: '(415) 555-0456',
  profile: caregivers[0],
  earnings: {
    today: 175,
    thisWeek: 840,
    thisMonth: 3250,
    pending: 420,
    available: 2830,
  },
  stats: {
    acceptanceRate: 94,
    cancellationRate: 2,
    onTimeRate: 98,
    responseRate: 96,
  },
  memberSince: '2022-03-10',
};

// Sample Bookings
export const bookings: Booking[] = [
  {
    id: 'b-1',
    caregiverId: 'cg-1',
    caregiverName: 'Maria Rodriguez',
    caregiverPhoto: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop',
    recipientId: 'cr-1',
    recipientName: 'Eleanor Johnson',
    date: '2024-01-25',
    startTime: '09:00',
    endTime: '13:00',
    duration: 4,
    services: ['Companionship', 'Medication Reminders', 'Meal Prep'],
    status: 'upcoming',
    totalCost: 140,
    notes: 'Please help mom with her morning medications and prepare lunch.',
  },
  {
    id: 'b-2',
    caregiverId: 'cg-2',
    caregiverName: 'James Williams',
    caregiverPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    recipientId: 'cr-2',
    recipientName: 'Robert Johnson',
    date: '2024-01-26',
    startTime: '14:00',
    endTime: '18:00',
    duration: 4,
    services: ['Personal Care', 'Physical Therapy Support'],
    status: 'upcoming',
    totalCost: 160,
    notes: 'Dad needs help with his afternoon exercises and bathing.',
  },
  {
    id: 'b-3',
    caregiverId: 'cg-1',
    caregiverName: 'Maria Rodriguez',
    caregiverPhoto: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop',
    recipientId: 'cr-1',
    recipientName: 'Eleanor Johnson',
    date: '2024-01-20',
    startTime: '09:00',
    endTime: '14:00',
    duration: 5,
    services: ['Companionship', 'Medication Reminders', 'Light Housekeeping'],
    status: 'completed',
    totalCost: 175,
  },
  {
    id: 'b-4',
    caregiverId: 'cg-3',
    caregiverName: 'Sarah Chen',
    caregiverPhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
    recipientId: 'cr-1',
    recipientName: 'Eleanor Johnson',
    date: '2024-01-18',
    startTime: '10:00',
    endTime: '16:00',
    duration: 6,
    services: ['Dementia Care', 'Medication Management', 'Personal Care'],
    status: 'completed',
    totalCost: 270,
  },
  {
    id: 'b-5',
    caregiverId: 'cg-5',
    caregiverName: 'Michael Johnson',
    caregiverPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    recipientId: 'cr-2',
    recipientName: 'Robert Johnson',
    date: '2024-01-15',
    startTime: '08:00',
    endTime: '12:00',
    duration: 4,
    services: ['Exercise Assistance', 'Companionship'],
    status: 'completed',
    totalCost: 152,
  },
];

// Sample Messages
export const messageThreads: MessageThread[] = [
  {
    id: 'mt-1',
    participantId: 'cg-1',
    participantName: 'Maria Rodriguez',
    participantPhoto: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop',
    participantRole: 'caregiver',
    lastMessage: 'I\'ll be there at 9am tomorrow. See you then!',
    lastMessageTime: '2024-01-24T15:30:00',
    unreadCount: 0,
  },
  {
    id: 'mt-2',
    participantId: 'cg-2',
    participantName: 'James Williams',
    participantPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    participantRole: 'caregiver',
    lastMessage: 'How is your father doing today?',
    lastMessageTime: '2024-01-24T10:15:00',
    unreadCount: 1,
  },
  {
    id: 'mt-3',
    participantId: 'cg-3',
    participantName: 'Sarah Chen',
    participantPhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
    participantRole: 'caregiver',
    lastMessage: 'The visit went well. Eleanor was in good spirits!',
    lastMessageTime: '2024-01-18T16:45:00',
    unreadCount: 0,
  },
];

export const messages: Message[] = [
  {
    id: 'm-1',
    threadId: 'mt-1',
    senderId: 'f-1',
    senderName: 'Sarah Johnson',
    senderPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    content: 'Hi Maria! Just wanted to confirm our appointment for tomorrow.',
    timestamp: '2024-01-24T14:00:00',
    isRead: true,
  },
  {
    id: 'm-2',
    threadId: 'mt-1',
    senderId: 'cg-1',
    senderName: 'Maria Rodriguez',
    senderPhoto: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop',
    content: 'Hi Sarah! Yes, I have you down for 9am to 1pm tomorrow. Is there anything specific you\'d like me to focus on?',
    timestamp: '2024-01-24T14:30:00',
    isRead: true,
  },
  {
    id: 'm-3',
    threadId: 'mt-1',
    senderId: 'f-1',
    senderName: 'Sarah Johnson',
    senderPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    content: 'Mom has been a bit restless lately. Maybe some gardening if the weather is nice?',
    timestamp: '2024-01-24T15:00:00',
    isRead: true,
  },
  {
    id: 'm-4',
    threadId: 'mt-1',
    senderId: 'cg-1',
    senderName: 'Maria Rodriguez',
    senderPhoto: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop',
    content: 'I\'ll be there at 9am tomorrow. See you then!',
    timestamp: '2024-01-24T15:30:00',
    isRead: true,
  },
];

// Sample Notifications
export const notifications: Notification[] = [
  {
    id: 'n-1',
    type: 'booking',
    title: 'Upcoming Visit Reminder',
    content: 'Your visit with Maria Rodriguez is starting in 1 hour.',
    timestamp: '2024-01-25T08:00:00',
    isRead: false,
    actionUrl: '/dashboard/family/bookings',
  },
  {
    id: 'n-2',
    type: 'message',
    title: 'New Message',
    content: 'James Williams sent you a message.',
    timestamp: '2024-01-24T10:15:00',
    isRead: false,
    actionUrl: '/messages/mt-2',
  },
  {
    id: 'n-3',
    type: 'payment',
    title: 'Payment Successful',
    content: 'Your payment of $175.00 for the visit on Jan 20 was processed.',
    timestamp: '2024-01-20T14:30:00',
    isRead: true,
    actionUrl: '/dashboard/family/bookings',
  },
  {
    id: 'n-4',
    type: 'system',
    title: 'Visit Summary Ready',
    content: 'Maria Rodriguez has submitted the visit summary for Jan 20.',
    timestamp: '2024-01-20T14:15:00',
    isRead: true,
    actionUrl: '/visit/b-3',
  },
];

// Sample Visit Report
export const visitReports: VisitReport[] = [
  {
    id: 'vr-1',
    bookingId: 'b-3',
    caregiverName: 'Maria Rodriguez',
    recipientName: 'Eleanor Johnson',
    date: '2024-01-20',
    checkInTime: '09:02',
    checkOutTime: '14:05',
    duration: 303,
    activitiesCompleted: [
      'Morning medication administered',
      'Light breakfast prepared and eaten',
      'Morning walk in garden (20 minutes)',
      'Crossword puzzles together',
      'Lunch prepared - chicken soup with vegetables',
      'Afternoon medication administered',
      'Light housekeeping - kitchen and living room',
    ],
    notes: 'Eleanor was in great spirits today! She really enjoyed our time in the garden and was excited to show me her rose bushes. She ate well at both meals and took all medications without issue. We completed two crossword puzzles together and she was very sharp. I noticed she mentioned feeling a bit tired in the afternoon, so we had a quiet time with some classical music. Overall a wonderful visit!',
    mood: 'good',
    energy: 'moderate',
    appetite: 'good',
    medicationsGiven: ['Metformin 500mg', 'Lisinopril 10mg', 'Aricept 5mg'],
    photos: [],
  },
];

// Export aliases for compatibility
export const mockCaregivers = caregivers;
export const mockReviews = reviews;
export const mockCareRecipients = sampleFamilyUser.careRecipients;

// Mock Users for authentication
export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: 'family' | 'caregiver';
  photo: string;
}

export const mockUsers: MockUser[] = [
  {
    id: 'f-1',
    email: 'sarah@example.com',
    name: 'Sarah Johnson',
    role: 'family',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  },
  {
    id: 'cg-1',
    email: 'maria@caregiver.com',
    name: 'Maria Rodriguez',
    role: 'caregiver',
    photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop',
  },
];

// Platform Stats
export const platformStats = {
  totalHours: 25847,
  totalCaregivers: 523,
  averageRating: 4.9,
  citiesServed: 12,
  familiesHelped: 8420,
  backgroundChecked: 100,
};

// Service Types with Pricing
export const serviceTypes = [
  { id: 'companionship', name: 'Companionship', description: 'Social interaction and emotional support', avgRate: 28 },
  { id: 'personal-care', name: 'Personal Care', description: 'Bathing, dressing, grooming assistance', avgRate: 35 },
  { id: 'medication', name: 'Medication Reminders', description: 'Help managing medication schedules', avgRate: 30 },
  { id: 'meal-prep', name: 'Meal Preparation', description: 'Nutritious meal planning and cooking', avgRate: 28 },
  { id: 'transportation', name: 'Transportation', description: 'Doctor visits, errands, outings', avgRate: 32 },
  { id: 'housekeeping', name: 'Light Housekeeping', description: 'Cleaning, laundry, organizing', avgRate: 25 },
  { id: 'dementia', name: 'Dementia Care', description: 'Specialized memory care support', avgRate: 42 },
  { id: 'hospice', name: 'Hospice Support', description: 'End-of-life comfort care', avgRate: 50 },
  { id: 'physical', name: 'Physical Therapy Support', description: 'Exercise and mobility assistance', avgRate: 40 },
  { id: 'night', name: 'Overnight Care', description: '8-12 hour overnight supervision', avgRate: 200 },
];

// Testimonials for homepage
export const testimonials = [
  {
    id: 't-1',
    quote: 'Finding care for my mother used to be so stressful. This platform made it easy to find someone we trust completely. Maria has become like family.',
    author: 'Sarah Johnson',
    role: 'Daughter & Primary Caregiver',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    rating: 5,
  },
  {
    id: 't-2',
    quote: 'The transparency and detailed visit reports give me peace of mind even though I live 500 miles away from my parents. I can see exactly how each visit went.',
    author: 'Michael Chen',
    role: 'Long-distance Family Caregiver',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    rating: 5,
  },
  {
    id: 't-3',
    quote: 'As a caregiver, this platform has transformed my business. I set my own rates, choose my clients, and the booking system is seamless.',
    author: 'Maria Rodriguez',
    role: 'Professional Caregiver',
    photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop',
    rating: 5,
  },
  {
    id: 't-4',
    quote: 'After a bad experience with an agency, we were hesitant to try again. The verified caregivers and background checks here made all the difference.',
    author: 'Jennifer Williams',
    role: 'Family Coordinator',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    rating: 5,
  },
];

// FAQ Data
export const faqItems = [
  {
    question: 'How are caregivers verified?',
    answer: 'All caregivers on our platform undergo comprehensive background checks including FBI fingerprint checks, state criminal records, sex offender registry, and reference verification. We also verify all certifications and conduct interviews before approval.',
  },
  {
    question: 'What if I need to cancel a booking?',
    answer: 'You can cancel bookings up to 24 hours before the scheduled start time for a full refund. Cancellations within 24 hours may incur a cancellation fee of up to 50% of the booking cost to compensate the caregiver.',
  },
  {
    question: 'How does payment work?',
    answer: 'Payment is held securely until the visit is completed. After the caregiver checks out and submits their visit summary, payment is released. We charge a 15% platform fee (10% for Premium members) which is included in the displayed rates.',
  },
  {
    question: 'Can I book the same caregiver regularly?',
    answer: 'Absolutely! You can set up recurring bookings (weekly, bi-weekly, or monthly) with your preferred caregivers. Many families build long-term relationships with 2-4 caregivers who become part of their care team.',
  },
  {
    question: 'What if the caregiver and care recipient aren\'t a good match?',
    answer: 'We offer a satisfaction guarantee on your first booking. If you\'re not happy with the match, we\'ll help you find a better fit at no additional cost. Good chemistry is essential for quality care.',
  },
  {
    question: 'Are caregivers insured?',
    answer: 'Yes, all active caregivers on our platform are covered by our general liability insurance policy. For additional protection, we offer optional bonding coverage for high-value care situations.',
  },
];
