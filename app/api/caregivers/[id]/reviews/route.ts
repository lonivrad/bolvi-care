import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { paginationSchema } from '@/lib/validations';
import {
  paginatedResponse,
  notFoundResponse,
  handleApiError,
} from '@/lib/api-response';

// GET /api/caregivers/[id]/reviews - Get reviews for a caregiver
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = req.nextUrl.searchParams;

    // Validate pagination
    const pagination = paginationSchema.parse({
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    });

    // Verify caregiver exists
    const caregiver = await prisma.caregiverProfile.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!caregiver) {
      return notFoundResponse('Caregiver not found');
    }

    // Get total count
    const total = await prisma.review.count({
      where: {
        targetId: caregiver.userId,
        isPublic: true,
      },
    });

    // Get reviews
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
        booking: {
          select: {
            scheduledStart: true,
            services: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    });

    // Calculate rating breakdown
    const ratingCounts = await prisma.review.groupBy({
      by: ['rating'],
      where: {
        targetId: caregiver.userId,
        isPublic: true,
      },
      _count: true,
    });

    const ratingBreakdown = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    ratingCounts.forEach(({ rating, _count }) => {
      ratingBreakdown[rating as keyof typeof ratingBreakdown] = _count;
    });

    return paginatedResponse(
      reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        content: review.content,
        categories: review.categories,
        response: review.response,
        respondedAt: review.respondedAt,
        author: {
          name: review.author.name,
          photo: review.author.photo,
        },
        booking: review.booking ? {
          date: review.booking.scheduledStart,
          services: review.booking.services,
        } : null,
        createdAt: review.createdAt,
      })),
      {
        page: pagination.page,
        limit: pagination.limit,
        total,
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
