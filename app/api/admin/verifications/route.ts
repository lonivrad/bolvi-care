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

// GET /api/admin/verifications - List pending verifications
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

    const type = searchParams.get('type'); // background_check, certification, license, reference
    const status = searchParams.get('status') || 'PENDING';

    // Get pending background checks
    const backgroundChecks = type === 'background_check' || !type
      ? await prisma.backgroundCheck.findMany({
          where: { status: status as 'PENDING' },
          include: {
            caregiverProfile: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    photo: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        })
      : [];

    // Get pending certifications
    const certifications = type === 'certification' || !type
      ? await prisma.certification.findMany({
          where: { verified: false },
          include: {
            caregiverProfile: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    photo: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        })
      : [];

    // Get pending licenses
    const licenses = type === 'license' || !type
      ? await prisma.caregiverLicense.findMany({
          where: { status: 'PENDING_VERIFICATION' },
          include: {
            caregiverProfile: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    photo: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        })
      : [];

    // Get pending references
    const references = type === 'reference' || !type
      ? await prisma.reference.findMany({
          where: { status: 'PENDING' },
          include: {
            caregiverProfile: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    photo: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        })
      : [];

    // Combine and format results
    const verifications = [
      ...backgroundChecks.map((bc) => ({
        id: bc.id,
        type: 'background_check',
        status: bc.status,
        caregiver: bc.caregiverProfile.user,
        caregiverProfileId: bc.caregiverProfileId,
        details: {
          provider: bc.provider,
          submittedAt: bc.submittedAt,
        },
        createdAt: bc.createdAt,
      })),
      ...certifications.map((cert) => ({
        id: cert.id,
        type: 'certification',
        status: cert.verified ? 'APPROVED' : 'PENDING',
        caregiver: cert.caregiverProfile.user,
        caregiverProfileId: cert.caregiverProfileId,
        details: {
          name: cert.name,
          issuingOrganization: cert.issuingOrganization,
          documentUrl: cert.documentUrl,
        },
        createdAt: cert.createdAt,
      })),
      ...licenses.map((lic) => ({
        id: lic.id,
        type: 'license',
        status: lic.status,
        caregiver: lic.caregiverProfile.user,
        caregiverProfileId: lic.caregiverProfileId,
        details: {
          state: lic.state,
          licenseType: lic.licenseType,
          licenseNumber: lic.licenseNumber,
          documentUrl: lic.documentUrl,
        },
        createdAt: lic.createdAt,
      })),
      ...references.map((ref) => ({
        id: ref.id,
        type: 'reference',
        status: ref.status,
        caregiver: ref.caregiverProfile.user,
        caregiverProfileId: ref.caregiverProfileId,
        details: {
          name: ref.name,
          relationship: ref.relationship,
          phone: ref.phone,
          email: ref.email,
        },
        createdAt: ref.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Paginate
    const paginatedVerifications = verifications.slice(
      (pagination.page - 1) * pagination.limit,
      pagination.page * pagination.limit
    );

    return paginatedResponse(paginatedVerifications, {
      page: pagination.page,
      limit: pagination.limit,
      total: verifications.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
