import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { recordVitalSigns } from '@/lib/visit';
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  badRequestResponse,
  handleApiError,
} from '@/lib/api-response';

// POST /api/visits/[id]/vitals - Record vital signs
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
      return forbiddenResponse('Only caregivers can record vital signs');
    }

    const body = await req.json();
    const {
      bloodPressureSystolic,
      bloodPressureDiastolic,
      heartRate,
      temperature,
      oxygenSaturation,
      bloodGlucose,
      weight,
      notes,
    } = body;

    // Require at least one vital sign
    if (
      !bloodPressureSystolic &&
      !heartRate &&
      !temperature &&
      !oxygenSaturation &&
      !bloodGlucose &&
      !weight
    ) {
      return badRequestResponse('At least one vital sign is required');
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

    // Only the caregiver assigned to this visit may record PHI against it.
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

    const result = await recordVitalSigns(
      visitId,
      {
        bloodPressureSystolic,
        bloodPressureDiastolic,
        heartRate,
        temperature,
        oxygenSaturation,
        bloodGlucose,
        weight,
        notes,
      },
      session.user.id,
      session.user.email || ''
    );

    return successResponse({
      message: 'Vital signs recorded successfully',
      activity: result.activity,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// GET /api/visits/[id]/vitals - Get vital signs history for visit
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

    // Get the visit with vital sign activities
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
          where: { type: 'VITAL_SIGNS' },
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
      vitalSigns: visit.activities.map((activity) => ({
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
