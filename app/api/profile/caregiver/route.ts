import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET - Fetch caregiver profile
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.caregiverProfile.findUnique({
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
        certifications: true,
        availability: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching caregiver profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PATCH - Update caregiver profile
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      headline,
      bio,
      yearsExperience,
      hourlyRate,
      specialties,
      languages,
    } = body;

    // Update the caregiver profile
    const updatedProfile = await prisma.caregiverProfile.update({
      where: { userId: session.user.id },
      data: {
        headline: headline || undefined,
        bio: bio || undefined,
        yearsExperience: yearsExperience !== undefined ? yearsExperience : undefined,
        hourlyRate: hourlyRate !== undefined ? hourlyRate : undefined,
        specialties: specialties || undefined,
        languages: languages || undefined,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating caregiver profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
