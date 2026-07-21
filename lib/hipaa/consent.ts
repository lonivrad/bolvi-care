// HIPAA Compliance: Consent Management System
// Tracks user consent for PHI access and data processing

import { prisma } from '@/lib/db';
import { createAuditLog, AUDIT_ACTIONS, ENTITY_TYPES } from './audit';

// Consent types required for the home care agency
export const CONSENT_TYPES = {
  // Privacy & Data
  PRIVACY_POLICY: 'PRIVACY_POLICY',
  TERMS_OF_SERVICE: 'TERMS_OF_SERVICE',
  DATA_PROCESSING: 'DATA_PROCESSING',

  // Healthcare specific
  PHI_ACCESS: 'PHI_ACCESS', // Allow caregiver to access health info
  PHI_SHARING: 'PHI_SHARING', // Share PHI between family members
  MEDICAL_RECORDS: 'MEDICAL_RECORDS', // Access to medical records
  EMERGENCY_CONTACT: 'EMERGENCY_CONTACT', // Contact in emergencies

  // Communication
  EMAIL_MARKETING: 'EMAIL_MARKETING',
  SMS_NOTIFICATIONS: 'SMS_NOTIFICATIONS',
  PUSH_NOTIFICATIONS: 'PUSH_NOTIFICATIONS',

  // Third-party
  BACKGROUND_CHECK: 'BACKGROUND_CHECK', // Consent for background check
  PAYMENT_PROCESSING: 'PAYMENT_PROCESSING',
  ANALYTICS: 'ANALYTICS',
} as const;

export type ConsentType = (typeof CONSENT_TYPES)[keyof typeof CONSENT_TYPES];

interface ConsentRecord {
  id: string;
  userId: string;
  consentType: ConsentType;
  granted: boolean;
  grantedAt: Date | null;
  revokedAt: Date | null;
  version: string;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: Record<string, unknown> | null;
}

// Current consent policy versions (update when policies change)
export const CONSENT_VERSIONS = {
  PRIVACY_POLICY: '2024.1',
  TERMS_OF_SERVICE: '2024.1',
  DATA_PROCESSING: '2024.1',
  PHI_ACCESS: '2024.1',
  PHI_SHARING: '2024.1',
  MEDICAL_RECORDS: '2024.1',
  EMERGENCY_CONTACT: '2024.1',
  EMAIL_MARKETING: '2024.1',
  SMS_NOTIFICATIONS: '2024.1',
  PUSH_NOTIFICATIONS: '2024.1',
  BACKGROUND_CHECK: '2024.1',
  PAYMENT_PROCESSING: '2024.1',
  ANALYTICS: '2024.1',
} as const;

// Required consents for each user role
export const REQUIRED_CONSENTS: Record<string, ConsentType[]> = {
  FAMILY: [
    'PRIVACY_POLICY',
    'TERMS_OF_SERVICE',
    'DATA_PROCESSING',
    'PAYMENT_PROCESSING',
  ],
  CAREGIVER: [
    'PRIVACY_POLICY',
    'TERMS_OF_SERVICE',
    'DATA_PROCESSING',
    'BACKGROUND_CHECK',
    'PAYMENT_PROCESSING',
  ],
  ADMIN: [
    'PRIVACY_POLICY',
    'TERMS_OF_SERVICE',
    'DATA_PROCESSING',
  ],
};

// Store consent (using a JSON field on User for simplicity, or create Consent model)
// For production, you should create a dedicated Consent table
export async function grantConsent(
  userId: string,
  userEmail: string,
  consentType: ConsentType,
  ipAddress?: string,
  userAgent?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const version = CONSENT_VERSIONS[consentType];
  const consentData = {
    type: consentType,
    granted: true,
    grantedAt: new Date().toISOString(),
    version,
    ipAddress,
    userAgent,
    metadata,
  };

  // Get current user preferences/consents
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // For now, store in audit log (production should have dedicated Consent table)
  await createAuditLog({
    userId,
    userEmail,
    action: AUDIT_ACTIONS.CONSENT_GRANTED,
    entityType: ENTITY_TYPES.CONSENT,
    entityId: `${userId}-${consentType}`,
    newValues: consentData,
    sensitivityLevel: 'MEDIUM',
  });
}

export async function revokeConsent(
  userId: string,
  userEmail: string,
  consentType: ConsentType,
  reason?: string
): Promise<void> {
  const consentData = {
    type: consentType,
    granted: false,
    revokedAt: new Date().toISOString(),
    reason,
  };

  await createAuditLog({
    userId,
    userEmail,
    action: AUDIT_ACTIONS.CONSENT_REVOKED,
    entityType: ENTITY_TYPES.CONSENT,
    entityId: `${userId}-${consentType}`,
    newValues: consentData,
    sensitivityLevel: 'MEDIUM',
  });
}

// Check if user has granted specific consent
export async function hasConsent(
  userId: string,
  consentType: ConsentType
): Promise<boolean> {
  // Query the most recent consent audit log for this user and type
  const latestConsent = await prisma.auditLog.findFirst({
    where: {
      userId,
      entityType: 'Consent',
      entityId: `${userId}-${consentType}`,
      action: {
        in: ['CONSENT_GRANTED', 'CONSENT_REVOKED'],
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!latestConsent) {
    return false;
  }

  return latestConsent.action === 'CONSENT_GRANTED';
}

// Check if user has all required consents for their role
export async function hasRequiredConsents(
  userId: string,
  role: 'FAMILY' | 'CAREGIVER' | 'ADMIN'
): Promise<{ complete: boolean; missing: ConsentType[] }> {
  const required = REQUIRED_CONSENTS[role] || [];
  const missing: ConsentType[] = [];

  for (const consentType of required) {
    const hasIt = await hasConsent(userId, consentType);
    if (!hasIt) {
      missing.push(consentType);
    }
  }

  return {
    complete: missing.length === 0,
    missing,
  };
}

// Get all consents for a user
export async function getUserConsents(userId: string): Promise<Record<ConsentType, boolean>> {
  const consents: Record<string, boolean> = {};

  // Initialize all consent types as false
  for (const type of Object.values(CONSENT_TYPES)) {
    consents[type] = false;
  }

  // Get all consent audit logs for this user
  const consentLogs = await prisma.auditLog.findMany({
    where: {
      userId,
      entityType: 'Consent',
      action: {
        in: ['CONSENT_GRANTED', 'CONSENT_REVOKED'],
      },
    },
    orderBy: { createdAt: 'asc' }, // Process in order
  });

  // Process logs to get current state
  for (const log of consentLogs) {
    if (log.entityId) {
      const consentType = log.entityId.replace(`${userId}-`, '') as ConsentType;
      consents[consentType] = log.action === 'CONSENT_GRANTED';
    }
  }

  return consents as Record<ConsentType, boolean>;
}

// Check if consent needs renewal (policy version changed)
export async function needsConsentRenewal(
  userId: string,
  consentType: ConsentType
): Promise<boolean> {
  const latestConsent = await prisma.auditLog.findFirst({
    where: {
      userId,
      entityType: 'Consent',
      entityId: `${userId}-${consentType}`,
      action: 'CONSENT_GRANTED',
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!latestConsent) {
    return true;
  }

  // Check if the version matches current
  const newValues = latestConsent.newValues as Record<string, unknown> | null;
  const grantedVersion = newValues?.version as string | undefined;
  const currentVersion = CONSENT_VERSIONS[consentType];

  return grantedVersion !== currentVersion;
}

// Batch grant consents (for signup flow)
export async function grantMultipleConsents(
  userId: string,
  userEmail: string,
  consentTypes: ConsentType[],
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  for (const consentType of consentTypes) {
    await grantConsent(userId, userEmail, consentType, ipAddress, userAgent);
  }
}

// PHI-specific consent management
export async function grantPHIAccessConsent(
  familyUserId: string,
  familyEmail: string,
  careRecipientId: string,
  caregiverId: string,
  accessLevel: 'FULL' | 'LIMITED' | 'EMERGENCY_ONLY' = 'LIMITED',
  expiresAt?: Date
): Promise<void> {
  await createAuditLog({
    userId: familyUserId,
    userEmail: familyEmail,
    action: AUDIT_ACTIONS.CONSENT_GRANTED,
    entityType: ENTITY_TYPES.CONSENT,
    entityId: `phi-access-${careRecipientId}-${caregiverId}`,
    newValues: {
      type: 'PHI_ACCESS',
      careRecipientId,
      caregiverId,
      grantedBy: familyUserId,
      accessLevel,
      expiresAt: expiresAt?.toISOString(),
      grantedAt: new Date().toISOString(),
    },
    phiAccessed: true,
    sensitivityLevel: 'CRITICAL',
  });
}

export async function revokePHIAccessConsent(
  familyUserId: string,
  familyEmail: string,
  careRecipientId: string,
  caregiverId: string,
  reason: string
): Promise<void> {
  await createAuditLog({
    userId: familyUserId,
    userEmail: familyEmail,
    action: AUDIT_ACTIONS.CONSENT_REVOKED,
    entityType: ENTITY_TYPES.CONSENT,
    entityId: `phi-access-${careRecipientId}-${caregiverId}`,
    newValues: {
      type: 'PHI_ACCESS',
      careRecipientId,
      caregiverId,
      revokedBy: familyUserId,
      reason,
      revokedAt: new Date().toISOString(),
    },
    phiAccessed: true,
    sensitivityLevel: 'CRITICAL',
  });
}

// Check if caregiver has PHI access consent for a care recipient
export async function hasPHIAccessConsent(
  caregiverId: string,
  careRecipientId: string
): Promise<{ hasAccess: boolean; accessLevel?: string; expiresAt?: Date }> {
  const latestConsent = await prisma.auditLog.findFirst({
    where: {
      entityType: 'Consent',
      entityId: `phi-access-${careRecipientId}-${caregiverId}`,
      action: {
        in: ['CONSENT_GRANTED', 'CONSENT_REVOKED'],
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!latestConsent || latestConsent.action === 'CONSENT_REVOKED') {
    return { hasAccess: false };
  }

  const newValues = latestConsent.newValues as Record<string, unknown> | null;
  const expiresAtStr = newValues?.expiresAt as string | undefined;
  const expiresAt = expiresAtStr ? new Date(expiresAtStr) : undefined;

  // Check if consent has expired
  if (expiresAt && expiresAt < new Date()) {
    return { hasAccess: false };
  }

  return {
    hasAccess: true,
    accessLevel: newValues?.accessLevel as string | undefined,
    expiresAt,
  };
}
