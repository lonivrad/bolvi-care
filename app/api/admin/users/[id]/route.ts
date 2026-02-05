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

const updateUserStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED', 'PENDING', 'DEACTIVATED']),
  reason: z.string().optional(),
});

// GET /api/admin/users/[id] - Get user details (admin only)
export async function GET(
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

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        familyProfile: {
          include: {
            careRecipients: true,
            bookings: {
              take: 10,
              orderBy: { createdAt: 'desc' },
            },
            careTeamMembers: true,
          },
        },
        caregiverProfile: {
          include: {
            certifications: true,
            backgroundCheck: true,
            licenses: true,
            references: true,
            bookings: {
              take: 10,
              orderBy: { createdAt: 'desc' },
            },
          },
        },
        reviewsWritten: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        reviewsReceived: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        incidentsReported: true,
        disputesAsFamily: true,
        disputesAsCaregiver: true,
      },
    });

    if (!user) {
      return notFoundResponse('User not found');
    }

    // Remove sensitive data
    const { passwordHash: _, ...safeUser } = user;

    return successResponse(safeUser);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/admin/users/[id] - Update user status (admin only)
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

    const validatedFields = updateUserStatusSchema.safeParse(body);

    if (!validatedFields.success) {
      return badRequestResponse('Invalid input', validatedFields.error.flatten());
    }

    const { status, reason } = validatedFields.data;

    // Prevent admins from suspending themselves
    if (id === session.user.id && status === 'SUSPENDED') {
      return badRequestResponse('You cannot suspend your own account');
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return notFoundResponse('User not found');
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { status },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userEmail: session.user.email,
        action: 'UPDATE_USER_STATUS',
        entityType: 'User',
        entityId: id,
        oldValues: { status: user.status },
        newValues: { status, reason },
      },
    });

    // Notify user of status change
    if (status !== user.status) {
      let notificationMessage = '';
      switch (status) {
        case 'SUSPENDED':
          notificationMessage = `Your account has been suspended. ${reason ? `Reason: ${reason}` : ''}`;
          break;
        case 'ACTIVE':
          notificationMessage = 'Your account has been activated.';
          break;
        case 'DEACTIVATED':
          notificationMessage = 'Your account has been deactivated.';
          break;
      }

      if (notificationMessage) {
        await prisma.notification.create({
          data: {
            userId: id,
            type: 'SYSTEM_ALERT',
            title: 'Account Status Update',
            message: notificationMessage,
          },
        });
      }
    }

    return successResponse({
      id: updatedUser.id,
      email: updatedUser.email,
      status: updatedUser.status,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
