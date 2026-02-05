import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update the family profile to mark onboarding as complete
    const familyProfile = await prisma.familyProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (familyProfile) {
      await prisma.familyProfile.update({
        where: { userId: session.user.id },
        data: {
          preferences: {
            ...(typeof familyProfile.preferences === 'object' && familyProfile.preferences !== null
              ? familyProfile.preferences as object
              : {}),
            onboardingComplete: true,
          },
        },
      });
    }

    // Also update user metadata if needed
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}
