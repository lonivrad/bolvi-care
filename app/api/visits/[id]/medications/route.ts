import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { recordMedicationAdministration } from '@/lib/visit';
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  badRequestResponse,
  handleApiError,
} from '@/lib/api-response';

// POST /api/visits/[id]/medications - Record medication administration
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
      return forbiddenResponse('Only caregivers can record medication administration');
    }

    const body = await req.json();
    const { medicationName, dosage, route, scheduledTime, notes, refused, refusalReason } = body;

    if (!medicationName || !dosage) {
      return badRequestResponse('Medication name and dosage are required');
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

    const result = await recordMedicationAdministration(
      visitId,
      {
        name: medicationName,
        dosage,
        route: route || 'oral',
        time: scheduledTime ? new Date(scheduledTime) : new Date(),
        notes,
        refused: refused || false,
        refusedReason: refusalReason,
      },
      session.user.id,
      session.user.email || ''
    );

    return successResponse({
      message: 'Medication recorded successfully',
      activity: result.activity,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// GET /api/visits/[id]/medications - Get medication history for visit
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

    // Get the visit with medication activities
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
          where: { type: 'MEDICATION' },
          orderBy: { completedAt: 'desc' },
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

    return successResponse({
      visitId: visit.id,
      medications: visit.activities.map((activity) => ({
        id: activity.id,
        completedAt: activity.completedAt,
        type: activity.type,
        notes: activity.notes,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
