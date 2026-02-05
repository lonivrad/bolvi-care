import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { createBookingSchema, paginationSchema } from '@/lib/validations';
import {
  successResponse,
  createdResponse,
  paginatedResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  handleApiError,
  validationErrorResponse,
} from '@/lib/api-response';

// Platform fee percentage (10%)
const PLATFORM_FEE_PERCENT = 0.10;

// GET /api/bookings - List bookings for current user
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return unauthorizedResponse();
    }

    const searchParams = req.nextUrl.searchParams;

    // Validate pagination
    const pagination = paginationSchema.parse({
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    });

    // Status filter
    const status = searchParams.get('status');
    const statusFilter = status ? { status: status.toUpperCase() as unknown } : {};

    // Build where clause based on user role
    let where: Record<string, unknown> = {};

    if (session.user.role === 'FAMILY') {
      const familyProfile = await prisma.familyProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      });

      if (!familyProfile) {
        return notFoundResponse('Family profile not found');
      }

      where = {
        familyProfileId: familyProfile.id,
        ...statusFilter,
      };
    } else if (session.user.role === 'CAREGIVER') {
      const caregiverProfile = await prisma.caregiverProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      });

      if (!caregiverProfile) {
        return notFoundResponse('Caregiver profile not found');
      }

      where = {
        caregiverProfileId: caregiverProfile.id,
        ...statusFilter,
      };
    } else if (session.user.role === 'ADMIN') {
      where = statusFilter;
    }

    // Get total count
    const total = await prisma.booking.count({ where });

    // Get bookings
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        familyProfile: {
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
        careRecipient: {
          select: {
            id: true,
            name: true,
            photo: true,
          },
        },
        payment: {
          select: {
            status: true,
          },
        },
        visit: {
          select: {
            status: true,
            checkInTime: true,
            checkOutTime: true,
          },
        },
      },
      orderBy: { scheduledStart: 'desc' },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    });

    return paginatedResponse(
      bookings.map((booking) => ({
        id: booking.id,
        status: booking.status,
        type: booking.type,
        scheduledStart: booking.scheduledStart,
        scheduledEnd: booking.scheduledEnd,
        services: booking.services,
        total: booking.total,
        family: {
          id: booking.familyProfile.id,
          name: booking.familyProfile.user.name,
          photo: booking.familyProfile.user.photo,
        },
        caregiver: {
          id: booking.caregiverProfile.id,
          name: booking.caregiverProfile.user.name,
          photo: booking.caregiverProfile.user.photo,
        },
        careRecipient: booking.careRecipient,
        paymentStatus: booking.payment?.status || null,
        visitStatus: booking.visit?.status || null,
        createdAt: booking.createdAt,
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

// POST /api/bookings - Create a new booking
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return unauthorizedResponse();
    }

    // Only families can create bookings
    if (session.user.role !== 'FAMILY' && session.user.role !== 'ADMIN') {
      return forbiddenResponse('Only families can create bookings');
    }

    const body = await req.json();
    const validatedFields = createBookingSchema.safeParse(body);

    if (!validatedFields.success) {
      return validationErrorResponse(validatedFields.error);
    }

    const {
      caregiverProfileId,
      careRecipientId,
      scheduledStart,
      scheduledEnd,
      services,
      specialInstructions,
      address,
      type,
      recurring,
    } = validatedFields.data;

    // Get family profile
    const familyProfile = await prisma.familyProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: { name: true },
        },
        careRecipients: {
          where: { id: careRecipientId },
        },
      },
    });

    if (!familyProfile) {
      return notFoundResponse('Family profile not found');
    }

    // Verify care recipient belongs to family
    if (familyProfile.careRecipients.length === 0) {
      return forbiddenResponse('Care recipient not found or does not belong to your family');
    }

    // Get caregiver profile and verify availability
    const caregiverProfile = await prisma.caregiverProfile.findUnique({
      where: { id: caregiverProfileId },
      include: {
        user: {
          select: { status: true },
        },
        availability: true,
      },
    });

    if (!caregiverProfile || caregiverProfile.user.status !== 'ACTIVE') {
      return notFoundResponse('Caregiver not found or not available');
    }

    // Calculate pricing
    const startDate = new Date(scheduledStart);
    const endDate = new Date(scheduledEnd);
    const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    const subtotal = Math.round(caregiverProfile.hourlyRate * hours);
    const platformFee = Math.round(subtotal * PLATFORM_FEE_PERCENT);
    const total = subtotal + platformFee;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        familyProfileId: familyProfile.id,
        caregiverProfileId,
        careRecipientId,
        status: caregiverProfile.instantBook ? 'CONFIRMED' : 'PENDING',
        type: type === 'RECURRING' ? 'RECURRING' : 'ONE_TIME',
        scheduledStart: startDate,
        scheduledEnd: endDate,
        services,
        specialInstructions,
        street: address?.street || familyProfile.street,
        unit: address?.unit || familyProfile.unit,
        city: address?.city || familyProfile.city,
        state: address?.state || familyProfile.state,
        zipCode: address?.zipCode || familyProfile.zipCode,
        hourlyRate: caregiverProfile.hourlyRate,
        estimatedHours: hours,
        subtotal,
        platformFee,
        total,
        // Create recurring schedule if applicable
        ...(type === 'RECURRING' && recurring && {
          recurringSchedule: {
            create: {
              frequency: recurring.frequency,
              daysOfWeek: recurring.daysOfWeek || [],
              startDate: startDate,
              endDate: recurring.endDate ? new Date(recurring.endDate) : undefined,
            },
          },
        }),
      },
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
        careRecipient: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Create notification for caregiver
    await prisma.notification.create({
      data: {
        userId: caregiverProfile.userId,
        type: 'BOOKING_REQUEST',
        title: 'New Booking Request',
        message: `You have a new booking request from ${familyProfile.user?.name || 'a family'} for ${startDate.toLocaleDateString()}.`,
        actionUrl: `/dashboard/caregiver/requests`,
        data: { bookingId: booking.id },
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userEmail: session.user.email,
        action: 'CREATE_BOOKING',
        entityType: 'Booking',
        entityId: booking.id,
        newValues: {
          caregiverProfileId,
          careRecipientId,
          scheduledStart,
          scheduledEnd,
          services,
          total,
        },
      },
    });

    return createdResponse({
      id: booking.id,
      status: booking.status,
      scheduledStart: booking.scheduledStart,
      scheduledEnd: booking.scheduledEnd,
      services: booking.services,
      pricing: {
        hourlyRate: booking.hourlyRate,
        estimatedHours: booking.estimatedHours,
        subtotal: booking.subtotal,
        platformFee: booking.platformFee,
        total: booking.total,
      },
      caregiver: {
        id: booking.caregiverProfile.id,
        name: booking.caregiverProfile.user.name,
        photo: booking.caregiverProfile.user.photo,
      },
      careRecipient: booking.careRecipient,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
