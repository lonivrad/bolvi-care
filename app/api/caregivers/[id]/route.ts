import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { updateCaregiverProfileSchema } from '@/lib/validations';
import {
  successResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  handleApiError,
  validationErrorResponse,
} from '@/lib/api-response';

// GET /api/caregivers/[id] - Get caregiver profile
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const caregiver = await prisma.caregiverProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            photo: true,
            createdAt: true,
          },
        },
        certifications: {
          where: { verified: true },
        },
        backgroundCheck: {
          select: {
            status: true,
            result: true,
            completedAt: true,
          },
        },
        availability: true,
        licenses: {
          where: { status: 'ACTIVE' },
        },
      },
    });

    if (!caregiver) {
      return notFoundResponse('Caregiver not found');
    }

    // Get reviews for this caregiver
    const reviews = await prisma.review.findMany({
      where: {
        targetId: caregiver.userId,
        isPublic: true,
      },
      include: {
        author: {
          select: {
            name: true,
            photo: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return successResponse({
      ...caregiver,
      reviews,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/caregivers/[id] - Update caregiver profile
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    // Check if user owns this profile or is admin
    const caregiver = await prisma.caregiverProfile.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!caregiver) {
      return notFoundResponse('Caregiver not found');
    }

    if (caregiver.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return forbiddenResponse();
    }

    const body = await req.json();
    const validatedFields = updateCaregiverProfileSchema.safeParse(body);

    if (!validatedFields.success) {
      return validationErrorResponse(validatedFields.error);
    }

    const updatedCaregiver = await prisma.caregiverProfile.update({
      where: { id },
      data: validatedFields.data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            photo: true,
          },
        },
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userEmail: session.user.email,
        action: 'UPDATE_CAREGIVER_PROFILE',
        entityType: 'CaregiverProfile',
        entityId: id,
        newValues: validatedFields.data,
      },
    });

    return successResponse(updatedCaregiver);
  } catch (error) {
    return handleApiError(error);
  }
}
