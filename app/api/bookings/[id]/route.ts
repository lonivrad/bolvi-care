import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { updateBookingStatusSchema, cancelBookingSchema } from '@/lib/validations';
import {
  successResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  badRequestResponse,
  handleApiError,
  validationErrorResponse,
} from '@/lib/api-response';

// GET /api/bookings/[id] - Get booking details
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

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        familyProfile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                photo: true,
                phone: true,
              },
            },
            emergencyContacts: true,
          },
        },
        caregiverProfile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                photo: true,
                phone: true,
              },
            },
          },
        },
        careRecipient: {
          include: {
            emergencyContacts: true,
          },
        },
        payment: true,
        visit: {
          include: {
            activities: true,
            photos: true,
            report: true,
          },
        },
        review: true,
        cancellation: true,
        recurringSchedule: true,
      },
    });

    if (!booking) {
      return notFoundResponse('Booking not found');
    }

    // Check access - user must be involved in the booking or be admin
    const isFamily = booking.familyProfile.userId === session.user.id;
    const isCaregiver = booking.caregiverProfile.userId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isFamily && !isCaregiver && !isAdmin) {
      return forbiddenResponse();
    }

    return successResponse(booking);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/bookings/[id] - Update booking status
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
    const body = await req.json();

    // Check if this is a cancellation request
    if (body.action === 'cancel') {
      return handleCancellation(id, body, session.user);
    }

    // Otherwise, handle status update
    const validatedFields = updateBookingStatusSchema.safeParse(body);

    if (!validatedFields.success) {
      return validationErrorResponse(validatedFields.error);
    }

    const { status } = validatedFields.data;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        familyProfile: {
          select: { userId: true },
        },
        caregiverProfile: {
          select: { userId: true },
        },
      },
    });

    if (!booking) {
      return notFoundResponse('Booking not found');
    }

    // Validate status transitions
    const isFamily = booking.familyProfile.userId === session.user.id;
    const isCaregiver = booking.caregiverProfile.userId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isFamily && !isCaregiver && !isAdmin) {
      return forbiddenResponse();
    }

    // Status transition rules
    const allowedTransitions: Record<string, string[]> = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['IN_PROGRESS', 'CANCELLED'],
      IN_PROGRESS: ['COMPLETED', 'DISPUTED'],
      COMPLETED: ['DISPUTED'],
      CANCELLED: [],
      DISPUTED: ['COMPLETED', 'CANCELLED'],
    };

    if (!allowedTransitions[booking.status]?.includes(status)) {
      return badRequestResponse(
        `Cannot transition from ${booking.status} to ${status}`
      );
    }

    // Only caregivers can confirm bookings
    if (status === 'CONFIRMED' && !isCaregiver && !isAdmin) {
      return forbiddenResponse('Only caregivers can confirm bookings');
    }

    // Only caregivers can start visits
    if (status === 'IN_PROGRESS' && !isCaregiver && !isAdmin) {
      return forbiddenResponse('Only caregivers can start visits');
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    // Create appropriate notification
    const notificationRecipientId = isCaregiver
      ? booking.familyProfile.userId
      : booking.caregiverProfile.userId;

    let notificationType: 'BOOKING_CONFIRMED' | 'VISIT_STARTED' | 'VISIT_COMPLETED' = 'BOOKING_CONFIRMED';
    let notificationTitle = '';
    let notificationMessage = '';

    switch (status) {
      case 'CONFIRMED':
        notificationType = 'BOOKING_CONFIRMED';
        notificationTitle = 'Booking Confirmed';
        notificationMessage = 'Your booking has been confirmed by the caregiver.';
        break;
      case 'IN_PROGRESS':
        notificationType = 'VISIT_STARTED';
        notificationTitle = 'Visit Started';
        notificationMessage = 'The caregiver has checked in and started the visit.';
        // Create visit record
        await prisma.visit.create({
          data: {
            bookingId: id,
            careRecipientId: booking.careRecipientId,
            status: 'IN_PROGRESS',
            checkInTime: new Date(),
          },
        });
        break;
      case 'COMPLETED':
        notificationType = 'VISIT_COMPLETED';
        notificationTitle = 'Visit Completed';
        notificationMessage = 'The visit has been completed.';
        break;
    }

    if (notificationTitle) {
      await prisma.notification.create({
        data: {
          userId: notificationRecipientId,
          type: notificationType,
          title: notificationTitle,
          message: notificationMessage,
          actionUrl: `/dashboard/${isCaregiver ? 'family' : 'caregiver'}/bookings/${id}`,
          data: { bookingId: id },
        },
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userEmail: session.user.email,
        action: 'UPDATE_BOOKING_STATUS',
        entityType: 'Booking',
        entityId: id,
        oldValues: { status: booking.status },
        newValues: { status },
      },
    });

    return successResponse(updatedBooking);
  } catch (error) {
    return handleApiError(error);
  }
}

async function handleCancellation(
  bookingId: string,
  body: unknown,
  user: { id: string; email: string; role: string }
) {
  const validatedFields = cancelBookingSchema.safeParse(body);

  if (!validatedFields.success) {
    return validationErrorResponse(validatedFields.error);
  }

  const { reason, notes } = validatedFields.data;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      familyProfile: {
        select: { userId: true },
      },
      caregiverProfile: {
        select: { userId: true },
      },
      payment: true,
    },
  });

  if (!booking) {
    return notFoundResponse('Booking not found');
  }

  const isFamily = booking.familyProfile.userId === user.id;
  const isCaregiver = booking.caregiverProfile.userId === user.id;
  const isAdmin = user.role === 'ADMIN';

  if (!isFamily && !isCaregiver && !isAdmin) {
    return forbiddenResponse();
  }

  // Cannot cancel completed or already cancelled bookings
  if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
    return badRequestResponse('This booking cannot be cancelled');
  }

  // Calculate refund based on cancellation policy
  let refundAmount = 0;
  const hoursUntilBooking =
    (new Date(booking.scheduledStart).getTime() - Date.now()) / (1000 * 60 * 60);

  if (hoursUntilBooking > 24) {
    // Full refund if cancelled more than 24 hours before
    refundAmount = booking.total;
  } else if (hoursUntilBooking > 2) {
    // 50% refund if cancelled 2-24 hours before
    refundAmount = Math.round(booking.total * 0.5);
  }
  // No refund if cancelled less than 2 hours before

  // Update booking and create cancellation record
  const [updatedBooking] = await prisma.$transaction([
    prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    }),
    prisma.cancellation.create({
      data: {
        bookingId,
        cancelledById: user.id,
        cancelledByRole: user.role as 'FAMILY' | 'CAREGIVER' | 'ADMIN',
        reason,
        notes,
        refundAmount,
        refundStatus: refundAmount > 0 ? 'PENDING' : undefined,
      },
    }),
  ]);

  // Notify the other party
  const notificationRecipientId = isCaregiver
    ? booking.familyProfile.userId
    : booking.caregiverProfile.userId;

  await prisma.notification.create({
    data: {
      userId: notificationRecipientId,
      type: 'BOOKING_CANCELLED',
      title: 'Booking Cancelled',
      message: `A booking has been cancelled. Reason: ${reason}`,
      actionUrl: `/dashboard/${isCaregiver ? 'family' : 'caregiver'}/bookings`,
      data: { bookingId },
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      userEmail: user.email,
      action: 'CANCEL_BOOKING',
      entityType: 'Booking',
      entityId: bookingId,
      newValues: { reason, refundAmount },
    },
  });

  return successResponse({
    booking: updatedBooking,
    cancellation: {
      reason,
      refundAmount,
      refundStatus: refundAmount > 0 ? 'PENDING' : null,
    },
  });
}
