import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { paginationSchema } from '@/lib/validations';
import {
  paginatedResponse,
  unauthorizedResponse,
  forbiddenResponse,
  handleApiError,
} from '@/lib/api-response';

// GET /api/admin/users - List all users (admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return unauthorizedResponse();
    }

    if (session.user.role !== 'ADMIN') {
      return forbiddenResponse();
    }

    const searchParams = req.nextUrl.searchParams;
    const pagination = paginationSchema.parse({
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    });

    const role = searchParams.get('role')?.toUpperCase();
    const status = searchParams.get('status')?.toUpperCase();
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          photo: true,
          role: true,
          status: true,
          emailVerified: true,
          createdAt: true,
          lastLoginAt: true,
          familyProfile: {
            select: {
              id: true,
              city: true,
              state: true,
              _count: {
                select: { careRecipients: true, bookings: true },
              },
            },
          },
          caregiverProfile: {
            select: {
              id: true,
              rating: true,
              reviewCount: true,
              completedVisits: true,
              verificationStatus: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      }),
      prisma.user.count({ where }),
    ]);

    return paginatedResponse(users, {
      page: pagination.page,
      limit: pagination.limit,
      total,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
