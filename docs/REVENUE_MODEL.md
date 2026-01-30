# Bolvi Care Revenue Model

## Overview

Bolvi Care operates as a **marketplace platform** connecting families with verified caregivers. Our revenue model is designed to be sustainable while keeping care affordable for families and earnings attractive for caregivers.

---

## Primary Revenue Streams

### 1. Platform Service Fee (Primary Revenue)

**Structure:** 15% service fee on all bookings, charged to families

| Booking Value | Service Fee | Family Pays | Caregiver Receives |
|---------------|-------------|-------------|-------------------|
| $100 | $15 | $115 | $100 |
| $200 | $30 | $230 | $200 |
| $500 | $75 | $575 | $500 |

**What the fee covers:**
- Background check verification processing
- Liability insurance coverage
- Payment processing (Stripe fees ~2.9% + $0.30)
- 24/7 customer support
- Platform development and maintenance
- Dispute resolution

### 2. Caregiver Subscription Tiers (Secondary Revenue)

| Tier | Monthly Cost | Benefits |
|------|--------------|----------|
| **Basic** | Free | Standard listing, 10% commission cap |
| **Professional** | $29/mo | Featured placement, reduced 12% commission, priority support |
| **Elite** | $79/mo | Top search placement, 10% commission, dedicated account manager, professional photo session |

### 3. Premium Family Services (Tertiary Revenue)

| Service | Price | Description |
|---------|-------|-------------|
| Care Coordinator | $99/mo | Dedicated coordinator to manage schedules and caregiver relationships |
| Rush Booking | $25/booking | Priority matching for urgent care needs (<24 hours) |
| Background Check Plus | $49/one-time | Enhanced background check with driving record and credit check |
| Multi-Caregiver Plan | $149/mo | Manage team of caregivers with shared calendar and notes |

---

## Unit Economics

### Per-Booking Economics (Average Booking)

```
Average Booking Details:
- Duration: 4 hours
- Hourly Rate: $35/hour
- Subtotal: $140

Revenue Breakdown:
- Gross Booking Value: $140
- Service Fee (15%): $21
- Payment Processing (~3%): -$4.83
- Net Platform Revenue: $16.17
- Caregiver Payout: $140
- Family Total Payment: $161
```

### Monthly Economics (Target at Scale)

```
Monthly Targets (Year 2):
- Active Families: 2,500
- Active Caregivers: 1,500
- Avg Bookings/Family/Month: 4
- Total Monthly Bookings: 10,000

Revenue:
- Booking Service Fees: $210,000
- Caregiver Subscriptions: $35,000
- Premium Family Services: $25,000
- Gross Monthly Revenue: $270,000

Costs:
- Payment Processing: $48,300
- Insurance & Compliance: $27,000
- Customer Support: $40,000
- Technology & Hosting: $15,000
- Marketing: $50,000
- Operations: $35,000
- Total Monthly Costs: $215,300

Net Monthly Revenue: $54,700 (20.3% margin)
```

---

## Pricing Strategy

### Market Positioning

We position slightly below agency rates while above informal care arrangements:

| Care Type | Agency Rate | Bolvi Care | Informal/Craigslist |
|-----------|-------------|------------|---------------------|
| Companion | $35-50/hr | $25-35/hr | $15-25/hr |
| Personal Care | $40-60/hr | $30-45/hr | $20-30/hr |
| Specialized | $50-80/hr | $40-60/hr | $30-45/hr |

**Value Proposition:**
- More affordable than agencies (30-40% savings)
- More reliable than informal arrangements (verified, insured)
- More flexible than both (on-demand booking, choose your caregiver)

### Geographic Pricing

Initial pricing based on Seattle market. Expansion markets will adjust:

| Market Tier | Base Rate Adjustment | Service Fee |
|-------------|---------------------|-------------|
| Tier 1 (SF, NYC, LA) | +15% | 15% |
| Tier 2 (Seattle, Portland, Denver) | Base | 15% |
| Tier 3 (Phoenix, Austin, Nashville) | -10% | 15% |

---

## Payment Flow

### Standard Payment Timeline

```
Day 0: Family books caregiver
  └─> Family card pre-authorized for full amount

Day 1: Visit occurs
  └─> Visit logged and confirmed by both parties

Day 2: Payment captured
  └─> Funds captured from family
  └─> Platform fee deducted
  └─> Caregiver balance updated

Day 3-5: Payout processed
  └─> Caregiver can withdraw to bank (1-2 business days)
```

### Payout Options for Caregivers

| Method | Speed | Fee |
|--------|-------|-----|
| Standard Bank Transfer | 2-3 days | Free |
| Instant Transfer | Minutes | $1.50 per transfer |
| Weekly Auto-Payout | Weekly (Fridays) | Free |

---

## Financial Projections

### Year 1-3 Revenue Forecast

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Active Families | 800 | 2,500 | 6,000 |
| Active Caregivers | 500 | 1,500 | 3,500 |
| Total Bookings | 24,000 | 120,000 | 360,000 |
| Gross Booking Value | $3.4M | $16.8M | $50.4M |
| Platform Revenue | $612K | $2.7M | $7.6M |
| Operating Costs | $720K | $2.2M | $5.3M |
| Net Income | -$108K | $500K | $2.3M |

### Key Assumptions

1. Average booking value: $140
2. Bookings per family per month: 3-4
3. Caregiver utilization: 15-20 hours/week average
4. Customer acquisition cost: $150/family, $75/caregiver
5. Customer lifetime value: $1,800/family (18 months avg)
6. Caregiver retention: 70% annual

---

## Incentive Programs

### Caregiver Incentives

| Program | Requirement | Reward |
|---------|-------------|--------|
| Welcome Bonus | Complete 5 bookings in first 30 days | $100 bonus |
| Quality Bonus | Maintain 4.8+ rating with 20+ reviews | $50/month |
| Referral Bonus | Refer new caregiver who completes 10 bookings | $150 |
| Surge Bonus | Accept urgent bookings (<4 hour notice) | +25% rate |

### Family Incentives

| Program | Requirement | Reward |
|---------|-------------|--------|
| First Booking | Complete profile and first booking | $25 credit |
| Subscription Discount | Sign up for monthly plan | 20% off service fees |
| Referral Credit | Refer family who books | $50 credit each |
| Loyalty Program | 10+ bookings/month | 12% service fee (vs 15%) |

---

## Risk Factors & Mitigation

### Revenue Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Caregiver disintermediation | High | Build value through insurance, scheduling tools, payment protection |
| Price competition | Medium | Focus on quality, trust, and verified caregivers |
| Economic downturn | Medium | Emphasize value vs. agency rates |
| Regulatory changes | High | Legal monitoring, compliance reserves |

### Financial Reserves

- Maintain 6 months operating expenses in reserve
- Insurance reserve: $100K for liability claims
- Chargeback reserve: 2% of monthly GMV

---

## Metrics & KPIs

### Key Financial Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Gross Margin | 70%+ | - |
| Net Margin | 20%+ | - |
| LTV:CAC Ratio | 3:1+ | - |
| Monthly Burn Rate | <$60K | - |
| Runway | 18+ months | - |

### Operational Metrics

| Metric | Target |
|--------|--------|
| Fill Rate (bookings/requests) | 85%+ |
| Repeat Booking Rate | 70%+ |
| Caregiver Response Time | <2 hours |
| Support Ticket Resolution | <24 hours |
| NPS Score | +50 |

---

## Future Revenue Opportunities

1. **B2B Enterprise Plans** - Partner with employers for employee caregiver benefits
2. **Insurance Partnerships** - Revenue share with long-term care insurers
3. **Training & Certification** - Paid courses for caregivers to upskill
4. **Care Management Software** - SaaS for home care agencies
5. **Telehealth Integration** - Partner with telehealth providers for virtual check-ins
