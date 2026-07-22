import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { recordTaskCompletion } from '@/lib/visit';
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  badRequestResponse,
  handleApiError,
} from '@/lib/api-response';

// POST /api/visits/[id]/tasks - Record task completion
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
      return forbiddenResponse('Only caregivers can record task completion');
    }

    const body = await req.json();
    const { taskType, taskName, notes, photoUrl, completedAt } = body;

    if (!taskType || !taskName) {
      return badRequestResponse('Task type and name are required');
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

    // Only the caregiver assigned to this visit may record activity against it.
    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
      include: { booking: { select: { caregiverProfileId: true } } },
    });

    if (!visit) {
      return badRequestResponse('Visit not found');
    }

    if (visit.booking.caregiverProfileId !== caregiverProfile.id) {
      return forbiddenResponse('You are not assigned to this visit');
    }

    const result = await recordTaskCompletion(
      visitId,
      taskName,
      taskType, // taskCategory
      notes,
      session.user.id,
      session.user.email || ''
    );

    return successResponse({
      message: 'Task recorded successfully',
      activity: result.activity,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// GET /api/visits/[id]/tasks - Get visit tasks/activities
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

    // Get the visit with activities
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
        activities: {
          orderBy: { completedAt: 'desc' },
        },
      },
    });

    if (!visit) {
      return badRequestResponse('Visit not found');
    }

    // Verify access - must be caregiver assigned to visit or family member
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

    return successResponse({
      visit: {
        id: visit.id,
        status: visit.status,
        scheduledStart: visit.booking.scheduledStart,
        scheduledEnd: visit.booking.scheduledEnd,
        actualStart: visit.booking.actualStart,
        actualEnd: visit.booking.actualEnd,
        checkInTime: visit.checkInTime,
        checkOutTime: visit.checkOutTime,
      },
      activities: visit.activities,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
