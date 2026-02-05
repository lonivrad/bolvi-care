// HIPAA Compliance Module
// Exports all HIPAA-related functionality

// Audit logging
export {
  createAuditLog,
  auditPHIAccess,
  auditCareRecipientAccess,
  auditVisitAction,
  auditIncidentReport,
  auditAuthEvent,
  queryAuditLogs,
  generateHIPAAComplianceReport,
  AUDIT_ACTIONS,
  ENTITY_TYPES,
  type AuditAction,
  type EntityType,
} from './audit';

// Consent management
export {
  grantConsent,
  revokeConsent,
  hasConsent,
  hasRequiredConsents,
  getUserConsents,
  needsConsentRenewal,
  grantMultipleConsents,
  grantPHIAccessConsent,
  revokePHIAccessConsent,
  hasPHIAccessConsent,
  CONSENT_TYPES,
  CONSENT_VERSIONS,
  REQUIRED_CONSENTS,
  type ConsentType,
} from './consent';

// Security headers
export {
  SECURITY_HEADERS,
  API_SECURITY_HEADERS,
  STATIC_HEADERS,
  applySecurityHeaders,
  withSecurityHeaders,
  applyCORSHeaders,
  CORS_CONFIG,
  RATE_LIMIT_CONFIG,
  COOKIE_CONFIG,
  SESSION_COOKIE_CONFIG,
  buildCSP,
  CSP_DIRECTIVES,
} from './security-headers';

// Data retention (to be implemented)
export const DATA_RETENTION_POLICIES = {
  // Audit logs must be kept for 6 years per HIPAA
  AUDIT_LOGS: 6 * 365, // days
  // PHI should be retained per state laws (varies)
  PHI_RECORDS: 7 * 365, // 7 years default
  // Consent records
  CONSENT_RECORDS: 6 * 365,
  // Incident reports
  INCIDENT_REPORTS: 7 * 365,
  // Background checks
  BACKGROUND_CHECKS: 7 * 365,
  // Messages (may contain PHI)
  MESSAGES: 3 * 365,
  // Session logs
  SESSION_LOGS: 90, // 90 days
};

// PHI field identifiers (for data masking)
export const PHI_FIELDS = [
  'ssn',
  'socialSecurityNumber',
  'dateOfBirth',
  'dob',
  'medicalConditions',
  'medications',
  'allergies',
  'diagnosis',
  'treatmentPlan',
  'vitalSigns',
  'healthInsurance',
  'insuranceId',
  'medicalRecordNumber',
  'emergencyContact',
  'physicianName',
  'physicianPhone',
];

// Mask PHI fields in an object
export function maskPHI<T extends Record<string, unknown>>(
  data: T,
  fieldsToMask: string[] = PHI_FIELDS
): T {
  const masked: Record<string, unknown> = { ...data };

  for (const field of fieldsToMask) {
    if (field in masked && masked[field]) {
      const value = masked[field];
      if (typeof value === 'string') {
        // Mask string fields (show last 4 chars)
        masked[field] = value.length > 4
          ? '*'.repeat(value.length - 4) + value.slice(-4)
          : '****';
      } else if (Array.isArray(value)) {
        masked[field] = `[${value.length} items]`;
      } else if (typeof value === 'object') {
        masked[field] = '[REDACTED]';
      }
    }
  }

  return masked as T;
}

// Check if request is accessing PHI
export function isPHIAccess(entityType: string, action: string): boolean {
  const phiEntityTypes = [
    'CareRecipient',
    'VisitReport',
    'Incident',
    'MedicalRecord',
  ];

  const phiActions = [
    'VIEW',
    'CREATE',
    'UPDATE',
    'DELETE',
    'EXPORT',
  ];

  return (
    phiEntityTypes.some((type) => entityType.includes(type)) ||
    phiActions.some((act) => action.includes(act) && action.includes('PHI'))
  );
}
