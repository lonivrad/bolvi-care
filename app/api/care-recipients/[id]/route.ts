import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { updateCareRecipientSchema } from '@/lib/validations';
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  handleApiError,
  validationErrorResponse,
} from '@/lib/api-response';

// GET /api/care-recipients/[id] - Get care recipient details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    const careRecipient = await prisma.careRecipient.findUnique({
      where: { id },
      include: {
        familyProfile: {
          select: { userId: true },
        },
        emergencyContacts: true,
      },
    });

    if (!careRecipient) {
      return notFoundResponse('Care recipient not found');
    }

    // Check access
    if (
      careRecipient.familyProfile.userId !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      // Check if user is a caregiver with access through care team
      const careTeamAccess = await prisma.careTeamMember.findFirst({
        where: {
          familyProfileId: careRecipient.familyProfileId,
          caregiverProfile: {
            userId: session.user.id,
          },
          status: 'ACTIVE',
        },
      });

      if (!careTeamAccess) {
        return forbiddenResponse();
      }
    }

    return successResponse(careRecipient);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/care-recipients/[id] - Update care recipient
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

    const careRecipient = await prisma.careRecipient.findUnique({
      where: { id },
      include: {
        familyProfile: {
          select: { userId: true },
        },
      },
    });

    if (!careRecipient) {
      return notFoundResponse('Care recipient not found');
    }

    // Only family owner or admin can update
    if (
      careRecipient.familyProfile.userId !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      return forbiddenResponse();
    }

    const body = await req.json();
    const validatedFields = updateCareRecipientSchema.safeParse(body);

    if (!validatedFields.success) {
      return validationErrorResponse(validatedFields.error);
    }

    const {
      address,
      dateOfBirth,
      ...restData
    } = validatedFields.data;

    const updatedCareRecipient = await prisma.careRecipient.update({
      where: { id },
      data: {
        ...restData,
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
        ...(address && {
          street: address.street,
          unit: address.unit,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country,
        }),
      },
      include: {
        emergencyContacts: true,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userEmail: session.user.email,
        action: 'UPDATE_CARE_RECIPIENT',
        entityType: 'CareRecipient',
        entityId: id,
        newValues: validatedFields.data,
      },
    });

    return successResponse(updatedCareRecipient);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/care-recipients/[id] - Delete care recipient
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    const careRecipient = await prisma.careRecipient.findUnique({
      where: { id },
      include: {
        familyProfile: {
          select: { userId: true },
        },
        bookings: {
          where: {
            status: {
              in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'],
            },
          },
        },
      },
    });

    if (!careRecipient) {
      return notFoundResponse('Care recipient not found');
    }

    // Only family owner or admin can delete
    if (
      careRecipient.familyProfile.userId !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      return forbiddenResponse();
    }

    // Cannot delete if there are active bookings
    if (careRecipient.bookings.length > 0) {
      return forbiddenResponse(
        'Cannot delete care recipient with active bookings'
      );
    }

    await prisma.careRecipient.delete({
      where: { id },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userEmail: session.user.email,
        action: 'DELETE_CARE_RECIPIENT',
        entityType: 'CareRecipient',
        entityId: id,
        oldValues: { name: careRecipient.name },
      },
    });

    return successResponse({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
