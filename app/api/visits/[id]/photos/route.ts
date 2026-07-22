import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { uploadVisitPhoto } from '@/lib/visit';
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  badRequestResponse,
  handleApiError,
} from '@/lib/api-response';

// POST /api/visits/[id]/photos - Upload visit photo
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
      return forbiddenResponse('Only caregivers can upload visit photos');
    }

    const body = await req.json();
    const { photoUrl, caption, category } = body;

    if (!photoUrl) {
      return badRequestResponse('Photo URL is required');
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

    // Only the caregiver assigned to this visit may attach photos to it.
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

    // Map category to valid photo type
    const photoTypeMap: Record<string, 'ARRIVAL' | 'TASK' | 'MEAL' | 'INCIDENT' | 'DEPARTURE' | 'OTHER'> = {
      arrival: 'ARRIVAL',
      task: 'TASK',
      meal: 'MEAL',
      incident: 'INCIDENT',
      departure: 'DEPARTURE',
    };
    const photoType = photoTypeMap[category?.toLowerCase()] || 'OTHER';

    const result = await uploadVisitPhoto(
      visitId,
      photoUrl,
      photoType,
      caption
    );

    return successResponse({
      message: 'Photo uploaded successfully',
      photo: result.photo,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// GET /api/visits/[id]/photos - Get visit photos
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

    // Get the visit with photo activities
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
        photos: {
          orderBy: { uploadedAt: 'desc' },
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
      photos: visit.photos.map((photo) => ({
        id: photo.id,
        url: photo.url,
        caption: photo.caption,
        uploadedAt: photo.uploadedAt,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
