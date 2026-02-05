import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET - Fetch family profile and care recipients
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.familyProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            photo: true,
            phone: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Fetch care recipients separately
    const careRecipients = await prisma.careRecipient.findMany({
      where: { familyProfileId: profile.id },
      select: {
        id: true,
        name: true,
        relationship: true,
        dateOfBirth: true,
      },
    });

    return NextResponse.json({
      profile,
      careRecipients,
    });
  } catch (error) {
    console.error('Error fetching family profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PATCH - Update family profile
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      street,
      unit,
      city,
      state,
      zipCode,
      country,
      preferences,
    } = body;

    // Get current profile first for merging preferences
    const currentProfile = await prisma.familyProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!currentProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Merge preferences if updating
    const mergedPreferences = preferences
      ? {
          ...(typeof currentProfile.preferences === 'object' && currentProfile.preferences !== null
            ? currentProfile.preferences as object
            : {}),
          ...preferences,
        }
      : undefined;

    // Update the family profile
    const updatedProfile = await prisma.familyProfile.update({
      where: { userId: session.user.id },
      data: {
        street: street || undefined,
        unit: unit || undefined,
        city: city || undefined,
        state: state || undefined,
        zipCode: zipCode || undefined,
        country: country || undefined,
        preferences: mergedPreferences,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating family profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
