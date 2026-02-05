import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { createCareRecipientSchema } from '@/lib/validations';
import {
  successResponse,
  createdResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  handleApiError,
  validationErrorResponse,
} from '@/lib/api-response';

// GET /api/care-recipients - List care recipients for current family
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return unauthorizedResponse();
    }

    if (session.user.role !== 'FAMILY' && session.user.role !== 'ADMIN') {
      return forbiddenResponse();
    }

    const familyProfile = await prisma.familyProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        careRecipients: {
          include: {
            emergencyContacts: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!familyProfile) {
      return notFoundResponse('Family profile not found');
    }

    return successResponse(familyProfile.careRecipients);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/care-recipients - Create a new care recipient
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return unauthorizedResponse();
    }

    if (session.user.role !== 'FAMILY') {
      return forbiddenResponse('Only families can create care recipients');
    }

    const body = await req.json();
    const validatedFields = createCareRecipientSchema.safeParse(body);

    if (!validatedFields.success) {
      return validationErrorResponse(validatedFields.error);
    }

    const {
      name,
      photo,
      dateOfBirth,
      gender,
      relationship,
      address,
      medicalConditions,
      medications,
      allergies,
      mobilityLevel,
      cognitiveStatus,
      dietaryRestrictions,
      careNeeds,
      notes,
    } = validatedFields.data;

    // Get family profile
    const familyProfile = await prisma.familyProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!familyProfile) {
      return notFoundResponse('Family profile not found');
    }

    // Create care recipient
    const careRecipient = await prisma.careRecipient.create({
      data: {
        familyProfileId: familyProfile.id,
        name,
        photo,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender,
        relationship,
        street: address?.street,
        unit: address?.unit,
        city: address?.city,
        state: address?.state,
        zipCode: address?.zipCode,
        country: address?.country || 'US',
        medicalConditions,
        medications,
        allergies: allergies || [],
        mobilityLevel,
        cognitiveStatus,
        dietaryRestrictions: dietaryRestrictions || [],
        careNeeds: careNeeds || [],
        notes,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        userEmail: session.user.email,
        action: 'CREATE_CARE_RECIPIENT',
        entityType: 'CareRecipient',
        entityId: careRecipient.id,
        newValues: { name },
      },
    });

    return createdResponse(careRecipient);
  } catch (error) {
    return handleApiError(error);
  }
}
