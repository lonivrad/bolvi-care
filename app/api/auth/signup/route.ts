import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { signupFamilySchema, signupCaregiverSchema } from '@/lib/validations';
import { UserRole } from '@prisma/client';

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
    return NextResponse.json(
      { error: 'Something went wrong during signup' },
      { status: 500 }
    );
  }
}

async function handleFamilySignup(body: unknown) {
  const validatedFields = signupFamilySchema.safeParse(body);

  if (!validatedFields.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: validatedFields.error.flatten() },
      { status: 400 }
    );
  }

  const { email, password, name, phone, address } = validatedFields.data;

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
      },
    });

    await tx.familyProfile.create({
      data: {
        userId: newUser.id,
        ...(address && {
          street: address.street,
          unit: address.unit,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country,
        }),
      },
    });

    return newUser;
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
      message: 'Account created successfully. Your profile is pending verification.',
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
