import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { respondToReviewSchema } from '@/lib/validations';
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  badRequestResponse,
  handleApiError,
  validationErrorResponse,
} from '@/lib/api-response';

// POST /api/reviews/[id]/respond - Respond to a review
export async function POST(
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

    const validatedFields = respondToReviewSchema.safeParse({
      reviewId: id,
      ...body,
    });

    if (!validatedFields.success) {
      return validationErrorResponse(validatedFields.error);
    }

    const { response } = validatedFields.data;

    // Get the review
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return notFoundResponse('Review not found');
    }

    // Only the target of the review can respond
    if (review.targetId !== session.user.id && session.user.role !== 'ADMIN') {
      return forbiddenResponse('You can only respond to reviews about you');
    }

    // Check if already responded
    if (review.response) {
      return badRequestResponse('This review has already been responded to');
    }

    // Update review with response
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        response,
        respondedAt: new Date(),
      },
    });

    // Notify the review author
    await prisma.notification.create({
      data: {
        userId: review.authorId,
        type: 'SYSTEM_ALERT',
        title: 'Review Response',
        message: 'Someone responded to your review.',
        data: { reviewId: id },
      },
    });

    return successResponse(updatedReview);
  } catch (error) {
    return handleApiError(error);
  }
}
