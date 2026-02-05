import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { createReviewSchema } from '@/lib/validations';
import {
  createdResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  badRequestResponse,
  handleApiError,
  validationErrorResponse,
} from '@/lib/api-response';

// POST /api/reviews - Create a review
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return unauthorizedResponse();
    }

    const body = await req.json();
    const validatedFields = createReviewSchema.safeParse(body);

    if (!validatedFields.success) {
      return validationErrorResponse(validatedFields.error);
    }

    const { bookingId, rating, content, categories, isPublic } = validatedFields.data;

    // Get the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        familyProfile: {
          include: {
            user: true,
          },
        },
        caregiverProfile: {
          include: {
            user: true,
          },
        },
        review: true,
      },
    });

    if (!booking) {
      return notFoundResponse('Booking not found');
    }

    // Check if booking is completed
    if (booking.status !== 'COMPLETED') {
      return badRequestResponse('Can only review completed bookings');
    }

    // Check if user is part of the booking
    const isFamily = booking.familyProfile.userId === session.user.id;
    const isCaregiver = booking.caregiverProfile.userId === session.user.id;

    if (!isFamily && !isCaregiver) {
      return forbiddenResponse('You are not part of this booking');
    }

    // Check if review already exists
    if (booking.review) {
      return badRequestResponse('This booking has already been reviewed');
    }

    // Determine author and target
    const authorId = session.user.id;
    const authorType = isFamily ? 'FAMILY' : 'CAREGIVER';
    const targetId = isFamily
      ? booking.caregiverProfile.userId
      : booking.familyProfile.userId;
    const targetType = isFamily ? 'CAREGIVER' : 'FAMILY';

    // Create review
    const review = await prisma.review.create({
      data: {
        bookingId,
        authorId,
        authorType,
        targetId,
        targetType,
        rating,
        content,
        categories,
        isPublic,
      },
    });

    // Update caregiver rating if this is a family reviewing a caregiver
    if (isFamily) {
      const caregiverReviews = await prisma.review.findMany({
        where: {
          targetId: booking.caregiverProfile.userId,
          targetType: 'CAREGIVER',
        },
        select: { rating: true },
      });

      const avgRating =
        caregiverReviews.reduce((sum, r) => sum + r.rating, 0) /
        caregiverReviews.length;

      await prisma.caregiverProfile.update({
        where: { id: booking.caregiverProfileId },
        data: {
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: caregiverReviews.length,
        },
      });
    }

    // Create notification for the reviewed party
    await prisma.notification.create({
      data: {
        userId: targetId,
        type: 'NEW_REVIEW',
        title: 'New Review',
        message: `You received a ${rating}-star review.`,
        actionUrl: isFamily
          ? `/dashboard/caregiver/reviews`
          : `/dashboard/family/reviews`,
        data: { reviewId: review.id, bookingId },
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userEmail: session.user.email,
        action: 'CREATE_REVIEW',
        entityType: 'Review',
        entityId: review.id,
        newValues: { bookingId, rating },
      },
    });

    return createdResponse(review);
  } catch (error) {
    return handleApiError(error);
  }
}
