import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  handleApiError,
} from '@/lib/api-response';

// GET /api/admin/metrics - Get platform metrics
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
    const period = searchParams.get('period') || '30'; // days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get user counts
    const [totalUsers, totalFamilies, totalCaregivers, newUsersThisPeriod] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'FAMILY' } }),
      prisma.user.count({ where: { role: 'CAREGIVER' } }),
      prisma.user.count({ where: { createdAt: { gte: startDate } } }),
    ]);

    // Get booking stats
    const [
      totalBookings,
      activeBookings,
      completedBookings,
      cancelledBookings,
      bookingsThisPeriod,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] } } }),
      prisma.booking.count({ where: { status: 'COMPLETED' } }),
      prisma.booking.count({ where: { status: 'CANCELLED' } }),
      prisma.booking.count({ where: { createdAt: { gte: startDate } } }),
    ]);

    // Get payment stats
    const payments = await prisma.payment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true, platformFee: true },
      _count: true,
    });

    const paymentsThisPeriod = await prisma.payment.aggregate({
      where: { status: 'COMPLETED', processedAt: { gte: startDate } },
      _sum: { amount: true, platformFee: true },
      _count: true,
    });

    // Get pending verifications count
    const [pendingBackgroundChecks, pendingCertifications, pendingReferences] = await Promise.all([
      prisma.backgroundCheck.count({ where: { status: 'PENDING' } }),
      prisma.certification.count({ where: { verified: false } }),
      prisma.reference.count({ where: { status: 'PENDING' } }),
    ]);

    // Get dispute stats
    const [openDisputes, resolvedDisputes] = await Promise.all([
      prisma.dispute.count({ where: { status: { in: ['OPEN', 'INVESTIGATING'] } } }),
      prisma.dispute.count({ where: { status: 'RESOLVED' } }),
    ]);

    // Get recent activity
    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        familyProfile: {
          include: { user: { select: { name: true } } },
        },
        caregiverProfile: {
          include: { user: { select: { name: true } } },
        },
      },
    });

    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Calculate trends (comparing to previous period)
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - parseInt(period));

    const previousPeriodBookings = await prisma.booking.count({
      where: { createdAt: { gte: previousPeriodStart, lt: startDate } },
    });

    const previousPeriodRevenue = await prisma.payment.aggregate({
      where: { status: 'COMPLETED', processedAt: { gte: previousPeriodStart, lt: startDate } },
      _sum: { platformFee: true },
    });

    const bookingsTrend = previousPeriodBookings > 0
      ? ((bookingsThisPeriod - previousPeriodBookings) / previousPeriodBookings) * 100
      : 0;

    const currentRevenue = paymentsThisPeriod._sum.platformFee || 0;
    const previousRevenue = previousPeriodRevenue._sum.platformFee || 0;
    const revenueTrend = previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

    return successResponse({
      users: {
        total: totalUsers,
        families: totalFamilies,
        caregivers: totalCaregivers,
        newThisPeriod: newUsersThisPeriod,
      },
      bookings: {
        total: totalBookings,
        active: activeBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
        thisPeriod: bookingsThisPeriod,
        trend: Math.round(bookingsTrend * 10) / 10,
      },
      revenue: {
        totalProcessed: payments._sum.amount || 0,
        totalPlatformFees: payments._sum.platformFee || 0,
        thisPeriod: {
          processed: paymentsThisPeriod._sum.amount || 0,
          platformFees: paymentsThisPeriod._sum.platformFee || 0,
          count: paymentsThisPeriod._count,
        },
        trend: Math.round(revenueTrend * 10) / 10,
      },
      verifications: {
        pendingBackgroundChecks,
        pendingCertifications,
        pendingReferences,
        total: pendingBackgroundChecks + pendingCertifications + pendingReferences,
      },
      disputes: {
        open: openDisputes,
        resolved: resolvedDisputes,
      },
      recentActivity: {
        bookings: recentBookings.map((b) => ({
          id: b.id,
          status: b.status,
          family: b.familyProfile.user.name,
          caregiver: b.caregiverProfile.user.name,
          total: b.total,
          createdAt: b.createdAt,
        })),
        users: recentUsers,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
