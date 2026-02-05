import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { caregiverSearchSchema } from '@/lib/validations';
import {
  paginatedResponse,
  handleApiError,
  validationErrorResponse,
} from '@/lib/api-response';

// GET /api/caregivers - Search and list caregivers
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    // Parse query parameters
    const queryParams = {
      query: searchParams.get('query') || undefined,
      location: searchParams.get('location') || undefined,
      latitude: searchParams.get('latitude') ? parseFloat(searchParams.get('latitude')!) : undefined,
      longitude: searchParams.get('longitude') ? parseFloat(searchParams.get('longitude')!) : undefined,
      radiusMiles: searchParams.get('radiusMiles') ? parseInt(searchParams.get('radiusMiles')!) : 25,
      services: searchParams.get('services')?.split(',').filter(Boolean) || undefined,
      specialties: searchParams.get('specialties')?.split(',').filter(Boolean) || undefined,
      languages: searchParams.get('languages')?.split(',').filter(Boolean) || undefined,
      minRate: searchParams.get('minRate') ? parseInt(searchParams.get('minRate')!) : undefined,
      maxRate: searchParams.get('maxRate') ? parseInt(searchParams.get('maxRate')!) : undefined,
      minRating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined,
      minExperience: searchParams.get('minExperience') ? parseInt(searchParams.get('minExperience')!) : undefined,
      instantBook: searchParams.get('instantBook') === 'true' ? true : undefined,
      sortBy: (searchParams.get('sortBy') as 'rating' | 'price_low' | 'price_high' | 'distance' | 'experience') || 'rating',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    };

    // Validate query parameters
    const validatedParams = caregiverSearchSchema.safeParse(queryParams);

    if (!validatedParams.success) {
      return validationErrorResponse(validatedParams.error);
    }

    const {
      query,
      specialties,
      languages,
      minRate,
      maxRate,
      minRating,
      minExperience,
      instantBook,
      sortBy,
      page,
      limit,
    } = validatedParams.data;

    // Build where clause
    const where: Record<string, unknown> = {
      user: {
        status: 'ACTIVE',
      },
    };

    // Text search on name or bio
    if (query) {
      where.OR = [
        { user: { name: { contains: query, mode: 'insensitive' } } },
        { bio: { contains: query, mode: 'insensitive' } },
        { headline: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Filter by specialties
    if (specialties && specialties.length > 0) {
      where.specialties = { hasSome: specialties };
    }

    // Filter by languages
    if (languages && languages.length > 0) {
      where.languages = { hasSome: languages };
    }

    // Filter by hourly rate
    if (minRate !== undefined) {
      where.hourlyRate = { ...((where.hourlyRate as object) || {}), gte: minRate };
    }
    if (maxRate !== undefined) {
      where.hourlyRate = { ...((where.hourlyRate as object) || {}), lte: maxRate };
    }

    // Filter by rating
    if (minRating !== undefined) {
      where.rating = { gte: minRating };
    }

    // Filter by experience
    if (minExperience !== undefined) {
      where.yearsExperience = { gte: minExperience };
    }

    // Filter by instant book
    if (instantBook !== undefined) {
      where.instantBook = instantBook;
    }

    // Build order by clause
    let orderBy: Record<string, string> = {};
    switch (sortBy) {
      case 'price_low':
        orderBy = { hourlyRate: 'asc' };
        break;
      case 'price_high':
        orderBy = { hourlyRate: 'desc' };
        break;
      case 'experience':
        orderBy = { yearsExperience: 'desc' };
        break;
      case 'rating':
      default:
        orderBy = { rating: 'desc' };
        break;
    }

    // Get total count
    const total = await prisma.caregiverProfile.count({ where });

    // Get caregivers with pagination
    const caregivers = await prisma.caregiverProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            photo: true,
            email: true,
          },
        },
        certifications: {
          where: { verified: true },
          select: {
            id: true,
            name: true,
            issuingOrganization: true,
          },
        },
        backgroundCheck: {
          select: {
            status: true,
            result: true,
          },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    // Transform response
    const transformedCaregivers = caregivers.map((caregiver) => ({
      id: caregiver.id,
      userId: caregiver.userId,
      name: caregiver.user.name,
      photo: caregiver.user.photo,
      email: caregiver.user.email,
      bio: caregiver.bio,
      headline: caregiver.headline,
      hourlyRate: caregiver.hourlyRate,
      yearsExperience: caregiver.yearsExperience,
      specialties: caregiver.specialties,
      languages: caregiver.languages,
      rating: caregiver.rating,
      reviewCount: caregiver.reviewCount,
      completedVisits: caregiver.completedVisits,
      responseRate: caregiver.responseRate,
      responseTime: caregiver.responseTime,
      instantBook: caregiver.instantBook,
      isFeatured: caregiver.isFeatured,
      isNew: caregiver.isNew,
      certifications: caregiver.certifications,
      backgroundCheck: caregiver.backgroundCheck,
      verificationStatus: caregiver.verificationStatus,
    }));

    return paginatedResponse(transformedCaregivers, { page, limit, total });
  } catch (error) {
    return handleApiError(error);
  }
}
