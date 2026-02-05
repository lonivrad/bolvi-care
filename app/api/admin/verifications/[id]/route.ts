import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  badRequestResponse,
  handleApiError,
} from '@/lib/api-response';
import { z } from 'zod';

const verificationActionSchema = z.object({
  type: z.enum(['background_check', 'certification', 'license', 'reference']),
  action: z.enum(['approve', 'reject']),
  notes: z.string().optional(),
});

// PATCH /api/admin/verifications/[id] - Approve/reject verification
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return unauthorizedResponse();
    }

    if (session.user.role !== 'ADMIN') {
      return forbiddenResponse();
    }

    const { id } = await params;
    const body = await req.json();

    const validatedFields = verificationActionSchema.safeParse(body);

    if (!validatedFields.success) {
      return badRequestResponse('Invalid input', validatedFields.error.flatten());
    }

    const { type, action, notes } = validatedFields.data;
    const isApproved = action === 'approve';
    const now = new Date();

    let result;
    let caregiverUserId: string | undefined;

    switch (type) {
      case 'background_check': {
        const backgroundCheck = await prisma.backgroundCheck.findUnique({
          where: { id },
          include: {
            caregiverProfile: {
              include: { user: true },
            },
          },
        });

        if (!backgroundCheck) {
          return notFoundResponse('Background check not found');
        }

        caregiverUserId = backgroundCheck.caregiverProfile.userId;

        result = await prisma.backgroundCheck.update({
          where: { id },
          data: {
            status: isApproved ? 'APPROVED' : 'REJECTED',
            result: isApproved ? 'CLEAR' : 'FAILED',
            completedAt: now,
            expiresAt: isApproved
              ? new Date(now.getTime() + 2 * 365 * 24 * 60 * 60 * 1000) // 2 years
              : undefined,
            notes,
          },
        });
        break;
      }

      case 'certification': {
        const certification = await prisma.certification.findUnique({
          where: { id },
          include: {
            caregiverProfile: {
              include: { user: true },
            },
          },
        });

        if (!certification) {
          return notFoundResponse('Certification not found');
        }

        caregiverUserId = certification.caregiverProfile.userId;

        result = await prisma.certification.update({
          where: { id },
          data: {
            verified: isApproved,
            verifiedAt: now,
            verifiedBy: session.user.id,
          },
        });
        break;
      }

      case 'license': {
        const license = await prisma.caregiverLicense.findUnique({
          where: { id },
          include: {
            caregiverProfile: {
              include: { user: true },
            },
          },
        });

        if (!license) {
          return notFoundResponse('License not found');
        }

        caregiverUserId = license.caregiverProfile.userId;

        result = await prisma.caregiverLicense.update({
          where: { id },
          data: {
            status: isApproved ? 'ACTIVE' : 'PENDING_VERIFICATION',
            verifiedAt: isApproved ? now : undefined,
            verifiedBy: isApproved ? session.user.id : undefined,
            notes,
          },
        });
        break;
      }

      case 'reference': {
        const reference = await prisma.reference.findUnique({
          where: { id },
          include: {
            caregiverProfile: {
              include: { user: true },
            },
          },
        });

        if (!reference) {
          return notFoundResponse('Reference not found');
        }

        caregiverUserId = reference.caregiverProfile.userId;

        result = await prisma.reference.update({
          where: { id },
          data: {
            status: isApproved ? 'VERIFIED' : 'FAILED',
            verifiedAt: now,
            notes,
          },
        });
        break;
      }
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userEmail: session.user.email,
        action: `VERIFICATION_${action.toUpperCase()}`,
        entityType: type,
        entityId: id,
        newValues: { action, notes },
      },
    });

    // Notify caregiver
    if (caregiverUserId) {
      await prisma.notification.create({
        data: {
          userId: caregiverUserId,
          type: isApproved ? 'VERIFICATION_APPROVED' : 'VERIFICATION_REJECTED',
          title: `${type.replace('_', ' ')} Verification ${isApproved ? 'Approved' : 'Rejected'}`,
          message: isApproved
            ? `Your ${type.replace('_', ' ')} has been verified.`
            : `Your ${type.replace('_', ' ')} verification was not approved. ${notes ? `Reason: ${notes}` : ''}`,
          actionUrl: '/dashboard/caregiver/profile',
        },
      });

      // Update caregiver's overall verification status
      await updateCaregiverVerificationStatus(caregiverUserId);
    }

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

async function updateCaregiverVerificationStatus(userId: string) {
  const profile = await prisma.caregiverProfile.findUnique({
    where: { userId },
    include: {
      backgroundCheck: true,
      certifications: true,
      references: true,
      licenses: true,
    },
  });

  if (!profile) return;

  const verificationStatus = {
    identity: 'APPROVED', // Assuming identity is verified during signup
    background: profile.backgroundCheck?.status || 'NOT_SUBMITTED',
    certifications: profile.certifications.every((c) => c.verified)
      ? 'APPROVED'
      : profile.certifications.some((c) => !c.verified)
      ? 'PENDING'
      : 'NOT_SUBMITTED',
    references: profile.references.every((r) => r.status === 'VERIFIED')
      ? 'APPROVED'
      : profile.references.some((r) => r.status === 'PENDING')
      ? 'PENDING'
      : 'NOT_SUBMITTED',
    overall:
      profile.backgroundCheck?.status === 'APPROVED'
        ? 'verified'
        : profile.backgroundCheck?.status === 'PENDING'
        ? 'pending'
        : 'unverified',
  };

  await prisma.caregiverProfile.update({
    where: { userId },
    data: { verificationStatus },
  });

  // Activate caregiver if fully verified
  if (verificationStatus.overall === 'verified') {
    await prisma.user.update({
      where: { id: userId },
      data: { status: 'ACTIVE' },
    });
  }
}
