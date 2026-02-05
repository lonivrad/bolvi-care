import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { signupFamilySchema, signupCaregiverSchema } from '@/lib/validations';
import { UserRole } from '@prisma/client';
import { sendVerificationEmail } from '@/lib/email';

// Helper function to generate verification token
function generateVerificationToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role } = body;

    // Handle both uppercase (from frontend) and lowercase role values
    const normalizedRole = role?.toUpperCase?.() || role;

    if (normalizedRole === 'CAREGIVER' || role === 'caregiver') {
      return handleCaregiverSignup(body);
    } else {
      return handleFamilySignup(body);
    }
  } catch (error) {
    console.error('Signup error:', error);

    // Provide more specific error messages
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Check for database connection errors
    if (errorMessage.includes('P1010') || errorMessage.includes('denied access')) {
      return NextResponse.json(
        { error: 'Database connection error. Please check your database configuration.' },
        { status: 503 }
      );
    }

    if (errorMessage.includes('P1001') || errorMessage.includes('connect')) {
      return NextResponse.json(
        { error: 'Unable to connect to database. Please ensure your database is running.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Something went wrong during signup. Please try again.' },
      { status: 500 }
    );
  }
}

async function handleFamilySignup(body: Record<string, unknown>) {
  // Extract fields directly from body - more flexible than strict Zod validation
  const email = body.email as string;
  const password = body.password as string;
  const name = body.name as string;
  const phone = body.phone as string | undefined;
  const zipCode = body.zipCode as string | undefined;

  // Basic validation
  if (!email || !password || !name) {
    return NextResponse.json(
      { error: 'Email, password, and name are required' },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters' },
      { status: 400 }
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: 'Please enter a valid email address' },
      { status: 400 }
    );
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: 'An account with this email already exists' },
      { status: 409 }
    );
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Generate verification token
  const verificationToken = generateVerificationToken();
  const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Create user and family profile in a transaction
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name,
        phone,
        role: 'FAMILY' as UserRole,
        status: 'ACTIVE',
        verificationToken,
        verificationTokenExpiry,
      },
    });

    await tx.familyProfile.create({
      data: {
        userId: newUser.id,
        ...(zipCode && { zipCode }),
      },
    });

    return newUser;
  });

  // Send verification email (don't block on this)
  sendVerificationEmail({
    email: user.email,
    name: user.name,
    verificationToken,
  }).catch((err) => {
    console.error('Failed to send verification email:', err);
  });

  // Create audit log
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      userEmail: user.email,
      action: 'USER_SIGNUP',
      entityType: 'User',
      entityId: user.id,
      newValues: { role: 'FAMILY', email: user.email },
    },
  });

  return NextResponse.json(
    {
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    },
    { status: 201 }
  );
}

async function handleCaregiverSignup(body: Record<string, unknown>) {
  // Extract fields - support both flat structure and nested caregiverProfile
  const caregiverProfile = body.caregiverProfile as Record<string, unknown> | undefined;

  const email = body.email as string;
  const password = body.password as string;
  const name = body.name as string;
  const phone = body.phone as string;

  // Basic validation
  if (!email || !password || !name) {
    return NextResponse.json(
      { error: 'Email, password, and name are required' },
      { status: 400 }
    );
  }

  // Get profile data from either nested object or flat structure
  const bio = (caregiverProfile?.bio || body.bio) as string | undefined;
  const hourlyRate = Number(caregiverProfile?.hourlyRate || body.hourlyRate) || 25;
  const yearsExperience = Number(caregiverProfile?.yearsExperience || body.yearsExperience) || 0;
  const services = (caregiverProfile?.services || body.specialties) as string[] | undefined;
  const certifications = caregiverProfile?.certifications as string[] | undefined;
  const availabilityDays = caregiverProfile?.availability as Record<string, boolean> | undefined;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: 'An account with this email already exists' },
      { status: 409 }
    );
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Generate verification token
  const verificationToken = generateVerificationToken();
  const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Build availability based on selected days
  const buildAvailabilityHours = () => {
    const defaultHours = { start: '09:00', end: '17:00' };
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const regularHours: Record<string, any[]> = {};

    days.forEach(day => {
      if (availabilityDays && availabilityDays[day]) {
        regularHours[day] = [defaultHours];
      } else if (!availabilityDays) {
        // Default to weekdays if no availability specified
        regularHours[day] = ['saturday', 'sunday'].includes(day) ? [] : [defaultHours];
      } else {
        regularHours[day] = [];
      }
    });

    return regularHours;
  };

  // Create user and caregiver profile in a transaction
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name,
        phone,
        role: 'CAREGIVER' as UserRole,
        status: 'PENDING', // Caregivers start as pending until verified
        verificationToken,
        verificationTokenExpiry,
      },
    });

    await tx.caregiverProfile.create({
      data: {
        userId: newUser.id,
        bio,
        hourlyRate,
        yearsExperience,
        specialties: services,
        // Create background check record (pending)
        backgroundCheck: {
          create: {
            status: 'NOT_SUBMITTED',
          },
        },
        // Create default availability
        availability: {
          create: {
            timezone: 'America/New_York',
            minimumNotice: 24,
            maximumAdvanceBooking: 30,
            regularHours: buildAvailabilityHours(),
          },
        },
        // Create certifications if provided
        ...(certifications && certifications.length > 0 && {
          certifications: {
            create: certifications.map(cert => ({
              name: cert,
              issuingOrganization: 'Self-reported',
              issueDate: new Date(),
              verified: false,
            })),
          },
        }),
      },
    });

    return newUser;
  });

  // Send verification email (don't block on this)
  sendVerificationEmail({
    email: user.email,
    name: user.name,
    verificationToken,
  }).catch((err) => {
    console.error('Failed to send verification email:', err);
  });

  // Create audit log
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      userEmail: user.email,
      action: 'USER_SIGNUP',
      entityType: 'User',
      entityId: user.id,
      newValues: { role: 'CAREGIVER', email: user.email },
    },
  });

  return NextResponse.json(
    {
      message: 'Account created successfully. Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    },
    { status: 201 }
  );
}
