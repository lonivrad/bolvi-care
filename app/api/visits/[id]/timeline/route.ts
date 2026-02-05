import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { getVisitTimeline } from '@/lib/visit';
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  badRequestResponse,
  handleApiError,
} from '@/lib/api-response';

// GET /api/visits/[id]/timeline - Get complete visit timeline
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id: visitId } = await params;

    if (!session?.user) {
      return unauthorizedResponse();
    }

    const { prisma } = await import('@/lib/db');

    // Get the visit to verify access
    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
      include: {
        booking: {
          include: {
            careRecipient: {
              include: {
                familyProfile: true,
              },
            },
            caregiverProfile: true,
          },
        },
      },
    });

    if (!visit) {
      return badRequestResponse('Visit not found');
    }

    // Verify access
    const isCaregiver = session.user.role === 'CAREGIVER';
    const isFamily = session.user.role === 'FAMILY';

    if (isCaregiver) {
      const caregiverProfile = await prisma.caregiverProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      });

      if (caregiverProfile?.id !== visit.booking.caregiverProfileId) {
        return forbiddenResponse('You are not assigned to this visit');
      }
    } else if (isFamily) {
      const familyProfile = await prisma.familyProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      });

      if (familyProfile?.id !== visit.booking.careRecipient.familyProfileId) {
        return forbiddenResponse('You do not have access to this visit');
      }
    } else if (session.user.role !== 'ADMIN') {
      return forbiddenResponse('Access denied');
    }

    const timeline = await getVisitTimeline(visitId);

    return successResponse(timeline);
  } catch (error) {
    return handleApiError(error);
  }
}
