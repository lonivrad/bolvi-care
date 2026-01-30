// ============================================================================
// STATE TAX & COMPLIANCE DATA
// ============================================================================

import type { USState, StateTaxInfo, StateLicenseRequirement, InsuranceCoverage } from './types';

// ============================================================================
// STATE TAX INFORMATION
// ============================================================================

export const STATE_TAX_INFO: Record<USState, StateTaxInfo> = {
  // States with NO income tax
  AK: {
    state: 'AK',
    hasStateTax: false,
    filingRequirements: 'No state income tax filing required.',
    quarterlyDueDates: [],
  },
  FL: {
    state: 'FL',
    hasStateTax: false,
    filingRequirements: 'No state income tax filing required.',
    quarterlyDueDates: [],
  },
  NV: {
    state: 'NV',
    hasStateTax: false,
    filingRequirements: 'No state income tax filing required.',
    quarterlyDueDates: [],
  },
  SD: {
    state: 'SD',
    hasStateTax: false,
    filingRequirements: 'No state income tax filing required.',
    quarterlyDueDates: [],
  },
  TX: {
    state: 'TX',
    hasStateTax: false,
    filingRequirements: 'No state income tax filing required.',
    quarterlyDueDates: [],
  },
  WA: {
    state: 'WA',
    hasStateTax: false,
    filingRequirements: 'No state income tax. However, Washington has a 7% Long-Term Care tax on wages (WA Cares Fund).',
    quarterlyDueDates: [],
  },
  WY: {
    state: 'WY',
    hasStateTax: false,
    filingRequirements: 'No state income tax filing required.',
    quarterlyDueDates: [],
  },
  TN: {
    state: 'TN',
    hasStateTax: false,
    filingRequirements: 'No state income tax on wages (only interest/dividends, phasing out).',
    quarterlyDueDates: [],
  },
  NH: {
    state: 'NH',
    hasStateTax: false,
    filingRequirements: 'No state income tax on wages (only interest/dividends at 5%).',
    quarterlyDueDates: [],
  },

  // States WITH income tax (showing key states for home care)
  CA: {
    state: 'CA',
    hasStateTax: true,
    brackets: [
      { min: 0, max: 1000000, rate: 0.01 },
      { min: 1000100, max: 2384200, rate: 0.02 },
      { min: 2384300, max: 3769200, rate: 0.04 },
      { min: 3769300, max: 5231900, rate: 0.06 },
      { min: 5231900, max: 6602800, rate: 0.08 },
      { min: 6602900, max: 33804700, rate: 0.093 },
      { min: 33804800, max: 40566800, rate: 0.103 },
      { min: 40566900, max: 67611400, rate: 0.113 },
      { min: 67611500, rate: 0.123 },
    ],
    selfEmploymentRate: 0.153,
    filingRequirements: 'Quarterly estimated payments required if tax liability exceeds $500.',
    quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'],
  },
  NY: {
    state: 'NY',
    hasStateTax: true,
    brackets: [
      { min: 0, max: 850000, rate: 0.04 },
      { min: 850100, max: 1170000, rate: 0.045 },
      { min: 1170100, max: 1350500, rate: 0.0525 },
      { min: 1350600, max: 2155000, rate: 0.055 },
      { min: 2155100, max: 500000000, rate: 0.06 },
      { min: 500000100, max: 2500000000, rate: 0.0685 },
      { min: 2500000100, rate: 0.0882 },
    ],
    additionalLocalTax: true, // NYC has additional tax
    filingRequirements: 'Quarterly estimated payments required. NYC residents have additional local tax.',
    quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'],
  },
  IL: {
    state: 'IL',
    hasStateTax: true,
    standardRate: 0.0495,
    filingRequirements: 'Flat tax rate of 4.95%. Quarterly payments required.',
    quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'],
  },
  PA: {
    state: 'PA',
    hasStateTax: true,
    standardRate: 0.0307,
    additionalLocalTax: true,
    filingRequirements: 'Flat tax rate of 3.07%. Local earned income taxes may apply.',
    quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'],
  },
  OH: {
    state: 'OH',
    hasStateTax: true,
    brackets: [
      { min: 0, max: 2600000, rate: 0 },
      { min: 2600100, max: 4650000, rate: 0.02765 },
      { min: 4650100, max: 9290000, rate: 0.03226 },
      { min: 9290100, rate: 0.03688 },
    ],
    filingRequirements: 'Graduated tax rate. Municipal income taxes common in Ohio.',
    quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'],
  },
  MA: {
    state: 'MA',
    hasStateTax: true,
    standardRate: 0.05,
    filingRequirements: 'Flat tax rate of 5%. Additional 4% surtax on income over $1M.',
    quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'],
  },
  NJ: {
    state: 'NJ',
    hasStateTax: true,
    brackets: [
      { min: 0, max: 2000000, rate: 0.014 },
      { min: 2000100, max: 3500000, rate: 0.0175 },
      { min: 3500100, max: 4000000, rate: 0.035 },
      { min: 4000100, max: 7500000, rate: 0.05525 },
      { min: 7500100, max: 50000000, rate: 0.0637 },
      { min: 50000100, max: 100000000, rate: 0.0897 },
      { min: 100000100, rate: 0.1075 },
    ],
    filingRequirements: 'Graduated rates. Quarterly payments required.',
    quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'],
  },
  AZ: {
    state: 'AZ',
    hasStateTax: true,
    standardRate: 0.025,
    filingRequirements: 'Flat tax rate of 2.5%. Quarterly payments required if liability exceeds $1,000.',
    quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'],
  },
  CO: {
    state: 'CO',
    hasStateTax: true,
    standardRate: 0.044,
    filingRequirements: 'Flat tax rate of 4.4%. Quarterly payments required.',
    quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'],
  },
  GA: {
    state: 'GA',
    hasStateTax: true,
    standardRate: 0.0549,
    filingRequirements: 'Flat tax rate of 5.49%. Quarterly payments required.',
    quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'],
  },
  NC: {
    state: 'NC',
    hasStateTax: true,
    standardRate: 0.0475,
    filingRequirements: 'Flat tax rate of 4.75%. Quarterly payments required.',
    quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'],
  },
  MI: {
    state: 'MI',
    hasStateTax: true,
    standardRate: 0.0425,
    additionalLocalTax: true,
    filingRequirements: 'Flat tax rate of 4.25%. Some cities have local income tax.',
    quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'],
  },
  VA: {
    state: 'VA',
    hasStateTax: true,
    brackets: [
      { min: 0, max: 300000, rate: 0.02 },
      { min: 300100, max: 500000, rate: 0.03 },
      { min: 500100, max: 1700000, rate: 0.05 },
      { min: 1700100, rate: 0.0575 },
    ],
    filingRequirements: 'Graduated rates. Quarterly payments required.',
    quarterlyDueDates: ['2024-05-01', '2024-06-15', '2024-09-15', '2025-01-15'],
  },
  MD: {
    state: 'MD',
    hasStateTax: true,
    brackets: [
      { min: 0, max: 100000, rate: 0.02 },
      { min: 100100, max: 150000, rate: 0.03 },
      { min: 150100, max: 175000, rate: 0.04 },
      { min: 175100, max: 225000, rate: 0.0475 },
      { min: 225100, max: 300000, rate: 0.05 },
      { min: 300100, rate: 0.0575 },
    ],
    additionalLocalTax: true,
    filingRequirements: 'Graduated rates plus county "piggyback" tax (1.75-3.2%). Quarterly payments required.',
    quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'],
  },
  MN: {
    state: 'MN',
    hasStateTax: true,
    brackets: [
      { min: 0, max: 3037500, rate: 0.0535 },
      { min: 3037600, max: 9994400, rate: 0.068 },
      { min: 9994500, max: 16613500, rate: 0.0785 },
      { min: 16613600, rate: 0.0985 },
    ],
    filingRequirements: 'Graduated rates. Quarterly payments required.',
    quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'],
  },
  OR: {
    state: 'OR',
    hasStateTax: true,
    brackets: [
      { min: 0, max: 395000, rate: 0.0475 },
      { min: 395100, max: 990000, rate: 0.0675 },
      { min: 990100, max: 12500000, rate: 0.0875 },
      { min: 12500100, rate: 0.099 },
    ],
    filingRequirements: 'Graduated rates. Quarterly payments required.',
    quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'],
  },
  // Fill in remaining states with default values
  AL: { state: 'AL', hasStateTax: true, standardRate: 0.05, filingRequirements: 'Graduated rates up to 5%. Quarterly payments may be required.', quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'] },
  AR: { state: 'AR', hasStateTax: true, standardRate: 0.047, filingRequirements: 'Top rate of 4.7%. Quarterly payments required.', quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'] },
  CT: { state: 'CT', hasStateTax: true, standardRate: 0.0699, filingRequirements: 'Graduated rates up to 6.99%. Quarterly payments required.', quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'] },
  DE: { state: 'DE', hasStateTax: true, standardRate: 0.066, filingRequirements: 'Top rate of 6.6%. Quarterly payments required.', quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'] },
  DC: { state: 'DC', hasStateTax: true, standardRate: 0.0895, filingRequirements: 'Graduated rates up to 8.95%. Quarterly payments required.', quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'] },
  HI: { state: 'HI', hasStateTax: true, standardRate: 0.11, filingRequirements: 'Top rate of 11%. Quarterly payments required.', quarterlyDueDates: ['2024-04-20', '2024-06-20', '2024-09-20', '2025-01-20'] },
  ID: { state: 'ID', hasStateTax: true, standardRate: 0.058, filingRequirements: 'Flat rate of 5.8%. Quarterly payments required.', quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'] },
  IN: { state: 'IN', hasStateTax: true, standardRate: 0.0315, additionalLocalTax: true, filingRequirements: 'Flat rate of 3.15% plus county tax. Quarterly payments required.', quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'] },
  IA: { state: 'IA', hasStateTax: true, standardRate: 0.0575, filingRequirements: 'Flat rate of 5.7%. Quarterly payments required.', quarterlyDueDates: ['2024-04-30', '2024-06-30', '2024-09-30', '2025-01-31'] },
  KS: { state: 'KS', hasStateTax: true, standardRate: 0.057, filingRequirements: 'Graduated rates up to 5.7%. Quarterly payments required.', quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'] },
  KY: { state: 'KY', hasStateTax: true, standardRate: 0.045, filingRequirements: 'Flat rate of 4.5%. Quarterly payments required.', quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'] },
  LA: { state: 'LA', hasStateTax: true, standardRate: 0.0425, filingRequirements: 'Graduated rates up to 4.25%. Quarterly payments required.', quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'] },
  ME: { state: 'ME', hasStateTax: true, standardRate: 0.0715, filingRequirements: 'Top rate of 7.15%. Quarterly payments required.', quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'] },
  MS: { state: 'MS', hasStateTax: true, standardRate: 0.05, filingRequirements: 'Flat rate of 5%. Quarterly payments required.', quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'] },
  MO: { state: 'MO', hasStateTax: true, standardRate: 0.048, filingRequirements: 'Top rate of 4.8%. Quarterly payments required.', quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'] },
  MT: { state: 'MT', hasStateTax: true, standardRate: 0.0575, filingRequirements: 'Top rate of 5.9%. Quarterly payments required.', quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'] },
  NE: { state: 'NE', hasStateTax: true, standardRate: 0.0584, filingRequirements: 'Top rate of 5.84%. Quarterly payments required.', quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'] },
  NM: { state: 'NM', hasStateTax: true, standardRate: 0.059, filingRequirements: 'Top rate of 5.9%. Quarterly payments required.', quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'] },
  ND: { state: 'ND', hasStateTax: true, standardRate: 0.029, filingRequirements: 'Top rate of 2.9%. Quarterly payments required.', quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'] },
  OK: { state: 'OK', hasStateTax: true, standardRate: 0.0475, filingRequirements: 'Top rate of 4.75%. Quarterly payments required.', quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'] },
  PR: { state: 'PR', hasStateTax: true, standardRate: 0.33, filingRequirements: 'Complex tax structure. Consult local tax professional.', quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'] },
  RI: { state: 'RI', hasStateTax: true, standardRate: 0.0599, filingRequirements: 'Top rate of 5.99%. Quarterly payments required.', quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'] },
  SC: { state: 'SC', hasStateTax: true, standardRate: 0.065, filingRequirements: 'Top rate of 6.5%. Quarterly payments required.', quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'] },
  UT: { state: 'UT', hasStateTax: true, standardRate: 0.0485, filingRequirements: 'Flat rate of 4.85%. Quarterly payments required.', quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'] },
  VT: { state: 'VT', hasStateTax: true, standardRate: 0.0875, filingRequirements: 'Top rate of 8.75%. Quarterly payments required.', quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'] },
  WV: { state: 'WV', hasStateTax: true, standardRate: 0.065, filingRequirements: 'Top rate of 6.5%. Quarterly payments required.', quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'] },
  WI: { state: 'WI', hasStateTax: true, standardRate: 0.0765, filingRequirements: 'Top rate of 7.65%. Quarterly payments required.', quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'] },
};

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
// FEDERAL TAX RATES
// ============================================================================

export const FEDERAL_TAX_INFO = {
  selfEmploymentTaxRate: 0.153, // 15.3% (12.4% SS + 2.9% Medicare)
  selfEmploymentDeduction: 0.5, // Can deduct 50% of SE tax
  quarterlyDueDates: ['2024-04-15', '2024-06-17', '2024-09-16', '2025-01-15'],
  brackets2024: [
    { min: 0, max: 1160000, rate: 0.10 },
    { min: 1160100, max: 4712500, rate: 0.12 },
    { min: 4712600, max: 10052500, rate: 0.22 },
    { min: 10052600, max: 19175000, rate: 0.24 },
    { min: 19175100, max: 24337500, rate: 0.32 },
    { min: 24337600, max: 57787500, rate: 0.35 },
    { min: 57787600, rate: 0.37 },
  ],
  standardDeduction2024: {
    single: 1450000, // $14,500
    marriedFilingJointly: 2900000, // $29,000
    marriedFilingSeparately: 1450000,
    headOfHousehold: 2175000, // $21,750
  },
  form1099Threshold: 60000, // $600 - must issue 1099 if paid $600+ in a year
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

export function getStateTaxInfo(state: USState): StateTaxInfo {
  return STATE_TAX_INFO[state];
}

export function getStateLicenseRequirements(state: USState): StateLicenseRequirement | undefined {
  return STATE_LICENSE_REQUIREMENTS[state];
}

export function hasStateTax(state: USState): boolean {
  return STATE_TAX_INFO[state]?.hasStateTax ?? true;
}

export function calculateFederalSelfEmploymentTax(netEarnings: number): number {
  // Self-employment tax is 15.3% on 92.35% of net earnings
  const taxableEarnings = netEarnings * 0.9235;
  return Math.round(taxableEarnings * FEDERAL_TAX_INFO.selfEmploymentTaxRate);
}

export function calculateQuarterlyEstimate(annualIncome: number, state: USState): {
  federalEstimate: number;
  stateEstimate: number;
  selfEmploymentTax: number;
  totalQuarterly: number;
} {
  // Simplified estimate - actual calculation would be more complex
  const federalTaxableIncome = annualIncome - FEDERAL_TAX_INFO.standardDeduction2024.single;
  let federalTax = 0;

  // Calculate federal tax using brackets
  for (const bracket of FEDERAL_TAX_INFO.brackets2024) {
    if (federalTaxableIncome > bracket.min) {
      const taxableInBracket = bracket.max
        ? Math.min(federalTaxableIncome - bracket.min, bracket.max - bracket.min)
        : federalTaxableIncome - bracket.min;
      federalTax += taxableInBracket * bracket.rate;
    }
  }

  // Self-employment tax
  const seTax = calculateFederalSelfEmploymentTax(annualIncome);

  // State tax
  const stateTaxInfo = STATE_TAX_INFO[state];
  let stateTax = 0;
  if (stateTaxInfo?.hasStateTax) {
    if (stateTaxInfo.standardRate) {
      stateTax = annualIncome * stateTaxInfo.standardRate;
    } else if (stateTaxInfo.brackets) {
      for (const bracket of stateTaxInfo.brackets) {
        if (annualIncome > bracket.min) {
          const taxableInBracket = bracket.max
            ? Math.min(annualIncome - bracket.min, bracket.max - bracket.min)
            : annualIncome - bracket.min;
          stateTax += taxableInBracket * bracket.rate;
        }
      }
    }
  }

  const totalAnnual = federalTax + seTax + stateTax;

  return {
    federalEstimate: Math.round(federalTax / 4),
    stateEstimate: Math.round(stateTax / 4),
    selfEmploymentTax: Math.round(seTax / 4),
    totalQuarterly: Math.round(totalAnnual / 4),
  };
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
