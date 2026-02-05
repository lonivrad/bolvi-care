import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { updateUserSchema, updateFamilyProfileSchema, updateCaregiverProfileSchema } from '@/lib/validations';
import {
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
  handleApiError,
  validationErrorResponse,
} from '@/lib/api-response';

// GET /api/users/me - Get current user profile
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return unauthorizedResponse();
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        familyProfile: {
          include: {
            careRecipients: true,
            careTeamMembers: {
              include: {
                caregiverProfile: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                        photo: true,
                      },
                    },
                  },
                },
              },
            },
            paymentMethods: {
              select: {
                id: true,
                type: true,
                last4: true,
                brand: true,
                isDefault: true,
              },
            },
            emergencyContacts: true,
          },
        },
        caregiverProfile: {
          include: {
            certifications: true,
            backgroundCheck: true,
            availability: true,
            payoutInfo: {
              select: {
                accountType: true,
                accountLast4: true,
                payoutSchedule: true,
                stripeAccountStatus: true,
              },
            },
            licenses: true,
          },
        },
        adminProfile: true,
      },
    });

    if (!user) {
      return notFoundResponse('User not found');
    }

    // Remove sensitive fields
    const { passwordHash: _, ...safeUser } = user;

    return successResponse(safeUser);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/users/me - Update current user profile
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return unauthorizedResponse();
    }

    const body = await req.json();

    // Validate base user fields
    if (body.name || body.phone || body.photo) {
      const userFields = {
        name: body.name,
        phone: body.phone,
        photo: body.photo,
      };

      const validatedUserFields = updateUserSchema.safeParse(userFields);

      if (!validatedUserFields.success) {
        return validationErrorResponse(validatedUserFields.error);
      }

      // Update user
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          ...(validatedUserFields.data.name && { name: validatedUserFields.data.name }),
          ...(validatedUserFields.data.phone && { phone: validatedUserFields.data.phone }),
          ...(validatedUserFields.data.photo && { photo: validatedUserFields.data.photo }),
        },
      });
    }

    // Update role-specific profile
    if (session.user.role === 'FAMILY' && body.profile) {
      const validatedProfile = updateFamilyProfileSchema.safeParse(body.profile);

      if (!validatedProfile.success) {
        return validationErrorResponse(validatedProfile.error);
      }

      await prisma.familyProfile.update({
        where: { userId: session.user.id },
        data: validatedProfile.data,
      });
    } else if (session.user.role === 'CAREGIVER' && body.profile) {
      const validatedProfile = updateCaregiverProfileSchema.safeParse(body.profile);

      if (!validatedProfile.success) {
        return validationErrorResponse(validatedProfile.error);
      }

      await prisma.caregiverProfile.update({
        where: { userId: session.user.id },
        data: validatedProfile.data,
      });
    }

    // Get updated user
    const updatedUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        familyProfile: true,
        caregiverProfile: true,
        adminProfile: true,
      },
    });

    // Remove sensitive fields
    if (updatedUser) {
      const { passwordHash: _, ...safeUser } = updatedUser;
      return successResponse(safeUser);
    }

    return notFoundResponse('User not found');
  } catch (error) {
    return handleApiError(error);
  }
}
