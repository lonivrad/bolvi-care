import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { checkInToVisit } from '@/lib/visit';
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  badRequestResponse,
  handleApiError,
} from '@/lib/api-response';

// POST /api/visits/[id]/check-in - Check in to a visit with GPS
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id: visitId } = await params;

    if (!session?.user) {
      return unauthorizedResponse();
    }

    if (session.user.role !== 'CAREGIVER') {
      return forbiddenResponse('Only caregivers can check in to visits');
    }

    const body = await req.json();
    const { latitude, longitude, accuracy } = body;

    if (!latitude || !longitude) {
      return badRequestResponse('Location (latitude, longitude) is required');
    }

    // Get caregiver profile ID
    const { prisma } = await import('@/lib/db');
    const caregiverProfile = await prisma.caregiverProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!caregiverProfile) {
      return forbiddenResponse('Caregiver profile not found');
    }

    const result = await checkInToVisit(
      {
        visitId,
        caregiverId: caregiverProfile.id,
        location: {
          latitude,
          longitude,
          accuracy,
          timestamp: new Date(),
        },
      },
      session.user.id,
      session.user.email || ''
    );

    if (!result.success) {
      return badRequestResponse(result.message);
    }

    return successResponse({
      message: result.message,
      visit: result.visit,
      locationVerification: result.locationVerification,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
