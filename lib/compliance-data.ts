// ============================================================================
// STATE LICENSING & INSURANCE COMPLIANCE DATA
// ============================================================================

import type { USState, StateLicenseRequirement, InsuranceCoverage } from './types';

// ============================================================================
// STATE LICENSING REQUIREMENTS FOR HOME CARE
// ============================================================================

export const STATE_LICENSE_REQUIREMENTS: Partial<Record<USState, StateLicenseRequirement>> = {
  WA: {
    state: 'WA',
    requiresLicense: true,
    licenseTypes: [
      {
        code: 'HCA',
        name: 'Home Care Aide',
        description: 'Required for personal care services in Washington State',
        scope: ['personal_care', 'medication_management', 'mobility_assistance'],
        renewalPeriodMonths: 24,
        cost: 11000, // $110 in cents
        requirements: [
          '75 hours basic training',
          'Pass state certification exam',
          'Background check',
          'CPR/First Aid certification',
        ],
      },
      {
        code: 'CNA',
        name: 'Certified Nursing Assistant',
        description: 'For medical-related care tasks',
        scope: ['personal_care', 'medication_management', 'hospice_care'],
        renewalPeriodMonths: 24,
        cost: 13000,
        requirements: [
          'Complete approved CNA program (75+ hours)',
          'Pass NNAAP exam',
          'Background check',
          'Ongoing CE requirements',
        ],
      },
    ],
    minimumAge: 18,
    backgroundCheckRequired: true,
    backgroundCheckRenewalMonths: 24,
    trainingRequirements: [
      {
        name: 'Basic Training',
        hours: 75,
        topics: ['Safety', 'Communication', 'Client Rights', 'Basic Care Skills'],
        mustBeCompletedBefore: 'within_90_days',
        renewalRequired: false,
      },
      {
        name: 'Continuing Education',
        hours: 12,
        topics: ['Current care practices', 'Safety updates'],
        mustBeCompletedBefore: 'within_90_days',
        renewalRequired: true,
        renewalPeriodMonths: 24,
      },
    ],
    continuingEducationHours: 12,
    continuingEducationPeriodMonths: 24,
    registryUrl: 'https://www.doh.wa.gov/LicensesPermitsandCertificates/NursingCommission/NursingAssistant',
    notes: 'Washington has strict HCA certification requirements. All personal care workers must be certified.',
  },
  CA: {
    state: 'CA',
    requiresLicense: true,
    licenseTypes: [
      {
        code: 'HCA',
        name: 'Home Care Aide',
        description: 'Registration with CA Home Care Services Bureau required',
        scope: ['personal_care', 'companionship', 'meal_preparation'],
        renewalPeriodMonths: 24,
        cost: 0, // Registration is free
        requirements: [
          'Background check through DOJ/FBI',
          'Complete registration form',
          'No training requirement for basic care',
        ],
      },
      {
        code: 'CNA',
        name: 'Certified Nurse Assistant',
        description: 'For skilled nursing facility or medical care',
        scope: ['personal_care', 'medication_management', 'post_surgery'],
        renewalPeriodMonths: 24,
        cost: 10000,
        requirements: [
          'Complete state-approved training program',
          'Pass competency evaluation',
          'Background check',
        ],
      },
    ],
    minimumAge: 18,
    backgroundCheckRequired: true,
    backgroundCheckRenewalMonths: 12,
    trainingRequirements: [
      {
        name: 'Basic Safety Training',
        hours: 5,
        topics: ['Safety', 'Emergency Procedures', 'Infection Control'],
        mustBeCompletedBefore: 'first_shift',
        renewalRequired: false,
      },
    ],
    registryUrl: 'https://www.cdss.ca.gov/inforesources/home-care-services-bureau',
    notes: 'California requires registration with the Home Care Services Bureau. Licensed home care organizations have additional requirements.',
  },
  NY: {
    state: 'NY',
    requiresLicense: true,
    licenseTypes: [
      {
        code: 'PCA',
        name: 'Personal Care Aide',
        description: 'Provides non-medical personal care services',
        scope: ['personal_care', 'companionship', 'meal_preparation', 'light_housekeeping'],
        renewalPeriodMonths: 0, // No renewal, one-time
        cost: 0,
        requirements: [
          '40-hour training program',
          'Background check',
          'Physical exam',
          'Drug screening',
        ],
      },
      {
        code: 'HHA',
        name: 'Home Health Aide',
        description: 'Provides health-related services under supervision',
        scope: ['personal_care', 'medication_management', 'mobility_assistance'],
        renewalPeriodMonths: 24,
        cost: 0,
        requirements: [
          '75-hour training program',
          'Competency evaluation',
          'Background check',
          'Annual 12-hour in-service training',
        ],
      },
    ],
    minimumAge: 18,
    backgroundCheckRequired: true,
    trainingRequirements: [
      {
        name: 'PCA Basic Training',
        hours: 40,
        topics: ['Personal Care', 'Safety', 'Nutrition', 'Communication'],
        mustBeCompletedBefore: 'hire',
        renewalRequired: false,
      },
    ],
    continuingEducationHours: 12,
    continuingEducationPeriodMonths: 12,
    registryUrl: 'https://www.health.ny.gov/professionals/home_care/',
    notes: 'New York distinguishes between PCAs and HHAs. HHAs require more training and can perform health-related tasks.',
  },
  TX: {
    state: 'TX',
    requiresLicense: false,
    licenseTypes: [
      {
        code: 'CNA',
        name: 'Certified Nurse Aide',
        description: 'Optional but recommended certification',
        scope: ['personal_care', 'medication_management'],
        renewalPeriodMonths: 24,
        cost: 5000,
        requirements: [
          'Complete approved training program',
          'Pass state exam',
          'Background check',
        ],
      },
    ],
    minimumAge: 18,
    backgroundCheckRequired: true,
    trainingRequirements: [],
    notes: 'Texas does not require licensure for private pay home care workers. Agencies may have their own requirements.',
  },
  FL: {
    state: 'FL',
    requiresLicense: true,
    licenseTypes: [
      {
        code: 'HHA',
        name: 'Home Health Aide',
        description: 'Required for home health services',
        scope: ['personal_care', 'medication_management', 'mobility_assistance'],
        renewalPeriodMonths: 24,
        cost: 5500,
        requirements: [
          '75-hour training program or CNA certification',
          'Competency evaluation',
          'Background check (Level 2)',
          '12 hours CE annually',
        ],
      },
      {
        code: 'CNA',
        name: 'Certified Nursing Assistant',
        description: 'Alternative certification for care services',
        scope: ['personal_care', 'medication_management', 'post_surgery'],
        renewalPeriodMonths: 24,
        cost: 7500,
        requirements: [
          '120-hour approved training program',
          'Pass state exam',
          'Level 2 background screening',
        ],
      },
    ],
    minimumAge: 18,
    backgroundCheckRequired: true,
    backgroundCheckRenewalMonths: 60, // 5 years
    trainingRequirements: [
      {
        name: 'Basic Training',
        hours: 75,
        topics: ['Personal Care', 'Safety', 'Infection Control', 'Communication'],
        mustBeCompletedBefore: 'hire',
        renewalRequired: false,
      },
      {
        name: 'Annual In-Service',
        hours: 12,
        topics: ['Current practices', 'Safety updates', 'Specialized care'],
        mustBeCompletedBefore: 'within_90_days',
        renewalRequired: true,
        renewalPeriodMonths: 12,
      },
    ],
    continuingEducationHours: 12,
    continuingEducationPeriodMonths: 12,
    registryUrl: 'https://flhealthsource.gov/cna/',
    notes: 'Florida requires Level 2 background screening which includes FBI fingerprinting.',
  },
};

// ============================================================================
// PLATFORM INSURANCE COVERAGE
// ============================================================================

export const PLATFORM_INSURANCE: InsuranceCoverage[] = [
  {
    type: 'general_liability',
    provider: 'Bolvi Care Insurance Partner',
    policyNumber: 'GL-2024-BOLVI',
    coverageAmount: 200000000, // $2M
    deductible: 50000, // $500
    effectiveDate: '2024-01-01',
    expirationDate: '2025-01-01',
    description: 'General liability coverage for bodily injury and property damage during care visits.',
  },
  {
    type: 'professional_liability',
    provider: 'Bolvi Care Insurance Partner',
    policyNumber: 'PL-2024-BOLVI',
    coverageAmount: 100000000, // $1M
    deductible: 100000, // $1,000
    effectiveDate: '2024-01-01',
    expirationDate: '2025-01-01',
    description: 'Professional liability (E&O) coverage for claims of negligent acts or omissions.',
  },
  {
    type: 'bonding',
    provider: 'Bolvi Care Insurance Partner',
    policyNumber: 'BD-2024-BOLVI',
    coverageAmount: 2500000, // $25K per incident
    deductible: 0,
    effectiveDate: '2024-01-01',
    expirationDate: '2025-01-01',
    description: 'Dishonesty bond coverage protecting families against theft by caregivers.',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getStateLicenseRequirements(state: USState): StateLicenseRequirement | undefined {
  return STATE_LICENSE_REQUIREMENTS[state];
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export function isLicenseExpiringSoon(expiryDate: string, daysThreshold = 30): boolean {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 && diffDays <= daysThreshold;
}

export function isBackgroundCheckExpired(completedAt: string, renewalMonths: number): boolean {
  const completed = new Date(completedAt);
  const expiryDate = new Date(completed.setMonth(completed.getMonth() + renewalMonths));
  return new Date() > expiryDate;
}
