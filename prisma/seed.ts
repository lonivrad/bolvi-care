import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data (in development)
  if (process.env.NODE_ENV !== 'production') {
    console.log('Cleaning existing data...');
    await prisma.auditLog.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.message.deleteMany();
    await prisma.conversationParticipant.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.disputeEvidence.deleteMany();
    await prisma.dispute.deleteMany();
    await prisma.incident.deleteMany();
    await prisma.cancellation.deleteMany();
    await prisma.visitPhoto.deleteMany();
    await prisma.visitActivity.deleteMany();
    await prisma.visitReport.deleteMany();
    await prisma.visit.deleteMany();
    await prisma.review.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.recurringSchedule.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.careTeamMember.deleteMany();
    await prisma.availabilityException.deleteMany();
    await prisma.availabilitySchedule.deleteMany();
    await prisma.taxDocument.deleteMany();
    await prisma.taxInfo.deleteMany();
    await prisma.caregiverLicense.deleteMany();
    await prisma.reference.deleteMany();
    await prisma.backgroundCheck.deleteMany();
    await prisma.certification.deleteMany();
    await prisma.paymentMethod.deleteMany();
    await prisma.emergencyContact.deleteMany();
    await prisma.careRecipientEmergencyContact.deleteMany();
    await prisma.careRecipient.deleteMany();
    await prisma.caregiverProfile.deleteMany();
    await prisma.familyProfile.deleteMany();
    await prisma.adminProfile.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
  }

  // All demo accounts share one password, sourced from SEED_PASSWORD so no
  // guessable credential is ever committed or shipped. Refuse to seed without
  // a strong value.
  const seedPassword = process.env.SEED_PASSWORD;
  if (!seedPassword || seedPassword.length < 12) {
    throw new Error(
      'SEED_PASSWORD must be set to a strong value (at least 12 characters) ' +
        'before seeding. Refusing to seed demo accounts with a blank or weak password.'
    );
  }
  const passwordHash = await bcrypt.hash(seedPassword, 12);

  // Create Admin User
  console.log('Creating admin user...');
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@bolvicare.com',
      passwordHash,
      name: 'Demo Admin',
      phone: '+15551234567',
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: new Date(),
      adminProfile: {
        create: {
          department: 'Operations',
          permissions: [
            'users:read', 'users:write', 'users:delete',
            'bookings:read', 'bookings:write',
            'payments:read', 'payments:write',
            'disputes:read', 'disputes:write',
            'verifications:read', 'verifications:write',
            'analytics:read', 'settings:write',
          ],
        },
      },
    },
  });
  console.log(`  ✓ Created admin: ${adminUser.email}`);

  // Create Family Users
  console.log('Creating family users...');
  const familyUser1 = await prisma.user.create({
    data: {
      email: 'sarah.johnson@email.com',
      passwordHash,
      name: 'Demo Family One',
      phone: '+15559876543',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      role: 'FAMILY',
      status: 'ACTIVE',
      emailVerified: new Date(),
      familyProfile: {
        create: {
          street: '123 Oak Street',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102',
          country: 'US',
          preferences: {
            notifications: {
              email: true,
              sms: true,
              push: true,
              bookingReminders: true,
              visitUpdates: true,
            },
          },
        },
      },
    },
    include: { familyProfile: true },
  });
  console.log(`  ✓ Created family: ${familyUser1.email}`);

  const familyUser2 = await prisma.user.create({
    data: {
      email: 'michael.chen@email.com',
      passwordHash,
      name: 'Demo Family Two',
      phone: '+15558765432',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      role: 'FAMILY',
      status: 'ACTIVE',
      emailVerified: new Date(),
      familyProfile: {
        create: {
          street: '456 Pine Avenue',
          city: 'Oakland',
          state: 'CA',
          zipCode: '94612',
          country: 'US',
        },
      },
    },
    include: { familyProfile: true },
  });
  console.log(`  ✓ Created family: ${familyUser2.email}`);

  // Create Care Recipients
  console.log('Creating care recipients...');
  const careRecipient1 = await prisma.careRecipient.create({
    data: {
      familyProfileId: familyUser1.familyProfile!.id,
      name: 'Eleanor D. (demo resident)',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
      dateOfBirth: new Date('1942-03-15'),
      gender: 'FEMALE',
      relationship: 'parent',
      street: '123 Oak Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      medicalConditions: [
        { name: 'Mild dementia', severity: 'moderate', diagnosedDate: '2020-06-15' },
        { name: 'Arthritis', severity: 'mild' },
      ],
      medications: [
        { name: 'Donepezil', dosage: '10mg', frequency: 'Once daily', timeOfDay: ['morning'] },
        { name: 'Ibuprofen', dosage: '200mg', frequency: 'As needed', timeOfDay: ['morning', 'evening'] },
      ],
      allergies: ['Penicillin'],
      mobilityLevel: 'MINIMAL_ASSISTANCE',
      cognitiveStatus: 'MILD_IMPAIRMENT',
      dietaryRestrictions: ['Low sodium'],
      careNeeds: ['medication_reminders', 'companionship', 'meal_prep', 'light_housekeeping'],
      notes: 'This demo resident enjoys reading, gardening, and watching classic movies, and prefers a quiet environment.',
    },
  });
  console.log(`  ✓ Created care recipient: ${careRecipient1.name}`);

  const careRecipient2 = await prisma.careRecipient.create({
    data: {
      familyProfileId: familyUser1.familyProfile!.id,
      name: 'Robert D. (demo resident)',
      dateOfBirth: new Date('1940-08-22'),
      gender: 'MALE',
      relationship: 'parent',
      street: '123 Oak Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      medicalConditions: [
        { name: 'Parkinson\'s disease', severity: 'moderate', diagnosedDate: '2018-11-20' },
      ],
      mobilityLevel: 'MODERATE_ASSISTANCE',
      cognitiveStatus: 'INTACT',
      careNeeds: ['mobility', 'bathing', 'dressing', 'medication_reminders'],
    },
  });
  console.log(`  ✓ Created care recipient: ${careRecipient2.name}`);

  // Create Caregiver Users
  console.log('Creating caregiver users...');
  const caregiverUser1 = await prisma.user.create({
    data: {
      email: 'maria.rodriguez@email.com',
      passwordHash,
      name: 'Sample Caregiver One',
      phone: '+15557654321',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
      role: 'CAREGIVER',
      status: 'ACTIVE',
      emailVerified: new Date(),
      caregiverProfile: {
        create: {
          bio: 'Certified nursing assistant with over 8 years of experience providing compassionate care for seniors. I specialize in dementia care and have helped many families through challenging times. My approach focuses on maintaining dignity, independence, and quality of life for all my clients.',
          headline: 'Experienced CNA | Dementia Care Specialist',
          hourlyRate: 2800, // $28/hour
          yearsExperience: 8,
          specialties: ['dementia_care', 'alzheimers_care', 'companionship', 'medication_management', 'personal_care'],
          languages: ['english', 'spanish'],
          rating: 4.9,
          reviewCount: 47,
          completedVisits: 312,
          responseRate: 98,
          responseTime: 15,
          instantBook: true,
          isFeatured: true,
          isNew: false,
          latitude: 37.7749,
          longitude: -122.4194,
          serviceAreaRadius: 15,
          verificationStatus: {
            identity: 'APPROVED',
            background: 'APPROVED',
            certifications: 'APPROVED',
            references: 'APPROVED',
            overall: 'verified',
          },
        },
      },
    },
    include: { caregiverProfile: true },
  });
  console.log(`  ✓ Created caregiver: ${caregiverUser1.email}`);

  // Add certifications for caregiver 1
  await prisma.certification.createMany({
    data: [
      {
        caregiverProfileId: caregiverUser1.caregiverProfile!.id,
        name: 'Certified Nursing Assistant (CNA)',
        issuingOrganization: 'California Board of Nursing',
        issueDate: new Date('2016-03-15'),
        expiryDate: new Date('2026-03-15'),
        credentialId: 'CNA-123456',
        verified: true,
        verifiedAt: new Date(),
      },
      {
        caregiverProfileId: caregiverUser1.caregiverProfile!.id,
        name: 'CPR/First Aid Certified',
        issuingOrganization: 'American Red Cross',
        issueDate: new Date('2023-06-01'),
        expiryDate: new Date('2025-06-01'),
        verified: true,
        verifiedAt: new Date(),
      },
      {
        caregiverProfileId: caregiverUser1.caregiverProfile!.id,
        name: 'Alzheimer\'s Care Certification',
        issuingOrganization: 'Alzheimer\'s Association',
        issueDate: new Date('2019-08-20'),
        verified: true,
        verifiedAt: new Date(),
      },
    ],
  });

  // Add background check for caregiver 1
  await prisma.backgroundCheck.create({
    data: {
      caregiverProfileId: caregiverUser1.caregiverProfile!.id,
      provider: 'checkr',
      status: 'APPROVED',
      result: 'CLEAR',
      submittedAt: new Date('2023-01-10'),
      completedAt: new Date('2023-01-15'),
      expiresAt: new Date('2025-01-15'),
    },
  });

  // Add availability for caregiver 1
  await prisma.availabilitySchedule.create({
    data: {
      caregiverProfileId: caregiverUser1.caregiverProfile!.id,
      timezone: 'America/Los_Angeles',
      minimumNotice: 4,
      maximumAdvanceBooking: 60,
      regularHours: {
        sunday: [],
        monday: [{ start: '08:00', end: '18:00' }],
        tuesday: [{ start: '08:00', end: '18:00' }],
        wednesday: [{ start: '08:00', end: '18:00' }],
        thursday: [{ start: '08:00', end: '18:00' }],
        friday: [{ start: '08:00', end: '16:00' }],
        saturday: [{ start: '09:00', end: '14:00' }],
      },
    },
  });

  const caregiverUser2 = await prisma.user.create({
    data: {
      email: 'james.wilson@email.com',
      passwordHash,
      name: 'Sample Caregiver Two',
      phone: '+15556543210',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      role: 'CAREGIVER',
      status: 'ACTIVE',
      emailVerified: new Date(),
      caregiverProfile: {
        create: {
          bio: 'Dedicated caregiver with experience in physical therapy assistance and post-surgery recovery. I believe in creating personalized care plans that help seniors maintain their independence while ensuring their safety and well-being.',
          headline: 'Physical Therapy Assistant | Post-Surgery Care',
          hourlyRate: 3200, // $32/hour
          yearsExperience: 5,
          specialties: ['post_surgery', 'mobility_assistance', 'exercise_assistance', 'personal_care'],
          languages: ['english'],
          rating: 4.7,
          reviewCount: 28,
          completedVisits: 156,
          responseRate: 95,
          responseTime: 30,
          instantBook: false,
          isFeatured: false,
          isNew: false,
          latitude: 37.8044,
          longitude: -122.2712,
          serviceAreaRadius: 20,
          verificationStatus: {
            identity: 'APPROVED',
            background: 'APPROVED',
            certifications: 'APPROVED',
            references: 'APPROVED',
            overall: 'verified',
          },
        },
      },
    },
    include: { caregiverProfile: true },
  });
  console.log(`  ✓ Created caregiver: ${caregiverUser2.email}`);

  await prisma.backgroundCheck.create({
    data: {
      caregiverProfileId: caregiverUser2.caregiverProfile!.id,
      provider: 'checkr',
      status: 'APPROVED',
      result: 'CLEAR',
      submittedAt: new Date('2023-02-01'),
      completedAt: new Date('2023-02-05'),
      expiresAt: new Date('2025-02-05'),
    },
  });

  await prisma.availabilitySchedule.create({
    data: {
      caregiverProfileId: caregiverUser2.caregiverProfile!.id,
      timezone: 'America/Los_Angeles',
      minimumNotice: 24,
      maximumAdvanceBooking: 30,
      regularHours: {
        sunday: [],
        monday: [{ start: '09:00', end: '17:00' }],
        tuesday: [{ start: '09:00', end: '17:00' }],
        wednesday: [{ start: '09:00', end: '17:00' }],
        thursday: [{ start: '09:00', end: '17:00' }],
        friday: [{ start: '09:00', end: '17:00' }],
        saturday: [],
      },
    },
  });

  const caregiverUser3 = await prisma.user.create({
    data: {
      email: 'emily.chen@email.com',
      passwordHash,
      name: 'Sample Caregiver Three',
      phone: '+15555432109',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
      role: 'CAREGIVER',
      status: 'ACTIVE',
      emailVerified: new Date(),
      caregiverProfile: {
        create: {
          bio: 'Bilingual caregiver fluent in English and Mandarin. I have extensive experience working with Asian families and understand cultural nuances in caregiving. My focus is on providing respectful, culturally sensitive care.',
          headline: 'Bilingual Caregiver | Cultural Care Expert',
          hourlyRate: 3000, // $30/hour
          yearsExperience: 6,
          specialties: ['companionship', 'meal_preparation', 'medication_management', 'respite_care'],
          languages: ['english', 'mandarin'],
          rating: 4.8,
          reviewCount: 35,
          completedVisits: 210,
          responseRate: 99,
          responseTime: 20,
          instantBook: true,
          isFeatured: true,
          isNew: false,
          latitude: 37.7849,
          longitude: -122.4094,
          serviceAreaRadius: 12,
          verificationStatus: {
            identity: 'APPROVED',
            background: 'APPROVED',
            certifications: 'APPROVED',
            references: 'APPROVED',
            overall: 'verified',
          },
        },
      },
    },
    include: { caregiverProfile: true },
  });
  console.log(`  ✓ Created caregiver: ${caregiverUser3.email}`);

  await prisma.backgroundCheck.create({
    data: {
      caregiverProfileId: caregiverUser3.caregiverProfile!.id,
      provider: 'checkr',
      status: 'APPROVED',
      result: 'CLEAR',
      submittedAt: new Date('2023-03-01'),
      completedAt: new Date('2023-03-06'),
      expiresAt: new Date('2025-03-06'),
    },
  });

  await prisma.availabilitySchedule.create({
    data: {
      caregiverProfileId: caregiverUser3.caregiverProfile!.id,
      timezone: 'America/Los_Angeles',
      minimumNotice: 12,
      maximumAdvanceBooking: 45,
      regularHours: {
        sunday: [{ start: '10:00', end: '16:00' }],
        monday: [{ start: '08:00', end: '18:00' }],
        tuesday: [{ start: '08:00', end: '18:00' }],
        wednesday: [],
        thursday: [{ start: '08:00', end: '18:00' }],
        friday: [{ start: '08:00', end: '18:00' }],
        saturday: [{ start: '10:00', end: '16:00' }],
      },
    },
  });

  // Create Bookings
  console.log('Creating sample bookings...');
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Completed booking
  const completedBooking = await prisma.booking.create({
    data: {
      familyProfileId: familyUser1.familyProfile!.id,
      caregiverProfileId: caregiverUser1.caregiverProfile!.id,
      careRecipientId: careRecipient1.id,
      status: 'COMPLETED',
      type: 'ONE_TIME',
      scheduledStart: lastWeek,
      scheduledEnd: new Date(lastWeek.getTime() + 4 * 60 * 60 * 1000),
      actualStart: lastWeek,
      actualEnd: new Date(lastWeek.getTime() + 4 * 60 * 60 * 1000),
      services: ['companionship', 'meal_prep', 'medication_reminders'],
      street: '123 Oak Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      hourlyRate: 2800,
      estimatedHours: 4,
      subtotal: 11200,
      total: 11200,
    },
  });

  // Create visit for completed booking
  await prisma.visit.create({
    data: {
      bookingId: completedBooking.id,
      careRecipientId: careRecipient1.id,
      status: 'COMPLETED',
      checkInTime: lastWeek,
      checkOutTime: new Date(lastWeek.getTime() + 4 * 60 * 60 * 1000),
      moodRating: 4,
      notes: 'Great visit! The demo resident was in good spirits today.',
    },
  });

  // Create review for completed booking
  await prisma.review.create({
    data: {
      bookingId: completedBooking.id,
      authorId: familyUser1.id,
      authorType: 'FAMILY',
      targetId: caregiverUser1.id,
      targetType: 'CAREGIVER',
      rating: 5,
      content: 'The sample caregiver was wonderful with my mother — punctual, professional, and genuinely caring. My mom really enjoyed the company!',
      categories: {
        punctuality: 5,
        communication: 5,
        professionalism: 5,
        careQuality: 5,
        reliability: 5,
      },
      isPublic: true,
    },
  });

  // Create payment for completed booking
  await prisma.payment.create({
    data: {
      bookingId: completedBooking.id,
      payerId: familyUser1.id,
      amount: 11200,
      status: 'COMPLETED',
      method: 'CARD',
      processedAt: lastWeek,
    },
  });

  console.log(`  ✓ Created completed booking with review and payment`);

  // Upcoming booking
  const upcomingBooking = await prisma.booking.create({
    data: {
      familyProfileId: familyUser1.familyProfile!.id,
      caregiverProfileId: caregiverUser1.caregiverProfile!.id,
      careRecipientId: careRecipient1.id,
      status: 'CONFIRMED',
      type: 'ONE_TIME',
      scheduledStart: tomorrow,
      scheduledEnd: new Date(tomorrow.getTime() + 3 * 60 * 60 * 1000),
      services: ['companionship', 'light_housekeeping'],
      street: '123 Oak Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      hourlyRate: 2800,
      estimatedHours: 3,
      subtotal: 8400,
      total: 8400,
    },
  });
  console.log(`  ✓ Created upcoming booking`);

  // Pending booking
  const pendingBooking = await prisma.booking.create({
    data: {
      familyProfileId: familyUser1.familyProfile!.id,
      caregiverProfileId: caregiverUser2.caregiverProfile!.id,
      careRecipientId: careRecipient2.id,
      status: 'PENDING',
      type: 'ONE_TIME',
      scheduledStart: nextWeek,
      scheduledEnd: new Date(nextWeek.getTime() + 2 * 60 * 60 * 1000),
      services: ['mobility', 'exercise'],
      street: '123 Oak Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      hourlyRate: 3200,
      estimatedHours: 2,
      subtotal: 6400,
      total: 6400,
    },
  });
  console.log(`  ✓ Created pending booking`);

  // Create Care Team relationship
  await prisma.careTeamMember.create({
    data: {
      familyProfileId: familyUser1.familyProfile!.id,
      caregiverProfileId: caregiverUser1.caregiverProfile!.id,
      status: 'ACTIVE',
      isPrimary: true,
      totalVisits: 12,
      totalHours: 48,
      lastVisitAt: lastWeek,
    },
  });
  console.log(`  ✓ Created care team relationship`);

  // Create Conversation
  const conversation = await prisma.conversation.create({
    data: {
      type: 'DIRECT',
      lastMessageAt: now,
      participants: {
        create: [
          { userId: familyUser1.id },
          { userId: caregiverUser1.id },
        ],
      },
    },
  });

  // Add messages to conversation
  await prisma.message.createMany({
    data: [
      {
        conversationId: conversation.id,
        senderId: familyUser1.id,
        content: 'Hi! I wanted to check if you\'re available for an extra session this weekend?',
        type: 'TEXT',
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
      {
        conversationId: conversation.id,
        senderId: caregiverUser1.id,
        content: 'Hi! Yes, I have Saturday morning available from 9 AM to 1 PM. Would that work?',
        type: 'TEXT',
        createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      },
      {
        conversationId: conversation.id,
        senderId: familyUser1.id,
        content: 'That\'s perfect! Let me create a booking for that.',
        type: 'TEXT',
        createdAt: now,
      },
    ],
  });
  console.log(`  ✓ Created conversation with messages`);

  // Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: familyUser1.id,
        type: 'BOOKING_CONFIRMED',
        title: 'Booking Confirmed',
        message: 'Your booking with Sample Caregiver One has been confirmed for tomorrow.',
        read: false,
        actionUrl: `/dashboard/family/bookings/${upcomingBooking.id}`,
        data: { bookingId: upcomingBooking.id },
      },
      {
        userId: caregiverUser1.id,
        type: 'NEW_REVIEW',
        title: 'New Review',
        message: 'You received a 5-star review from Demo Family One!',
        read: false,
        actionUrl: '/dashboard/caregiver/reviews',
      },
      {
        userId: caregiverUser2.id,
        type: 'BOOKING_REQUEST',
        title: 'New Booking Request',
        message: 'You have a new booking request from Demo Family One.',
        read: false,
        actionUrl: `/dashboard/caregiver/requests`,
        data: { bookingId: pendingBooking.id },
      },
    ],
  });
  console.log(`  ✓ Created notifications`);

  // Create Emergency Contacts
  await prisma.emergencyContact.create({
    data: {
      familyProfileId: familyUser1.familyProfile!.id,
      name: 'John D. (demo contact)',
      relationship: 'Spouse',
      phone: '+15551112222',
      email: 'john.johnson@email.com',
      isPrimary: true,
      canMakeDecisions: true,
    },
  });
  console.log(`  ✓ Created emergency contacts`);

  console.log('\n✅ Database seeding completed successfully!');
  console.log('\n📝 Demo accounts (password = your SEED_PASSWORD, not printed):');
  console.log('  Admin:     admin@bolvicare.com');
  console.log('  Family:    sarah.johnson@email.com');
  console.log('  Family:    michael.chen@email.com');
  console.log('  Caregiver: maria.rodriguez@email.com');
  console.log('  Caregiver: james.wilson@email.com');
  console.log('  Caregiver: emily.chen@email.com');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
