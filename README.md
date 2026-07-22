# Bolvi Care

Bolvi Care is the platform I built to run a home-care operation end to end: family and caregiver onboarding, caregiver search and booking, scheduled visits with check-in/out and medication, vitals, task, and photo logging, payments, messaging, and role-based dashboards for families, caregivers, and admins — all backed by a Postgres/Prisma data model and HIPAA-aligned audit logging.

[![CI](https://github.com/lonivrad/bolvi-care/actions/workflows/ci.yml/badge.svg)](https://github.com/lonivrad/bolvi-care/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)

## Overview

The application is a full build-out rather than a static mock: **79 pages**, **37 API routes**, and a **40-model Prisma schema** backing authentication, bookings, visits, payments, messaging, and audit logging.

The product and business decisions behind it are grounded in first-hand discovery research in the Everett / South Snohomish County market — see [**User Research**](docs/USER_RESEARCH.md) for the segments, the evidence, and the decision each finding drove.

Live demo temporarily offline while authentication is migrated.

> **Demo vs. this codebase.** The live demo is an earlier prototype build — stable and demonstrating the product end to end — currently offline during the auth migration. The current codebase in this repository is a further build-out (NextAuth authentication, Prisma data layer, Stripe payments, HIPAA-aligned audit logging); its auth integration is mid-migration and is **not currently deployed**. The demo credentials below belong to that prototype.

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16.2 (App Router) |
| **Language** | TypeScript 5 |
| **UI Library** | React 19.2 |
| **Styling** | Tailwind CSS 4 |
| **Components** | Radix UI Primitives |
| **State Management** | Zustand 5 |
| **Authentication** | NextAuth v5 (Credentials + Google) |
| **Database** | PostgreSQL + Prisma (40 models) |
| **Payments** | Stripe (Payment Intents + webhooks) |
| **Email** | Resend |
| **Error Monitoring** | Sentry |
| **Icons** | Lucide React |
| **Date Picker** | React Day Picker |

## Features

### Family Features
- Browse and filter caregivers by specialty, availability, price, and language
- View detailed caregiver profiles with reviews and credentials
- Multi-step booking flow with service selection
- Manage care recipients with health profiles
- Track spending and care analytics
- Build a trusted care team

### Care Partner Features (W-2 employees)
- Professional profile with certifications and badges
- Shift scheduling and availability management
- Assigned visits with check-in / check-out
- Visit documentation — medication, vitals, tasks, and photo logging
- Hours and earnings in an employee pay-period view
- Performance overview

> Care Partners are W-2 employees. Payroll, tax withholding, and W-2 issuance run through an external payroll provider — the app deliberately has no in-app payouts, 1099 generation, or contractor tax filing.

### Admin Features
- Platform metrics dashboard
- User management
- Verification queue
- Dispute handling
- Financial reporting

## Running locally

This app needs a Postgres database and a few environment variables; most third-party integrations are optional and the code degrades gracefully when their keys are absent.

1. Install dependencies (`postinstall` runs `prisma generate` automatically):
```bash
npm install
```

2. Create a `.env` with, at minimum:
```bash
DATABASE_URL=postgresql://...       # pooled connection (serverless runtime)
DIRECT_URL=postgresql://...         # direct connection, used for schema pushes
AUTH_SECRET=...                     # NextAuth session secret
NEXTAUTH_URL=http://localhost:3000
```
Optional keys turn on their features when present: `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` (payments), `RESEND_API_KEY` / `EMAIL_FROM` (email), `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (Google sign-in), `NEXT_PUBLIC_SENTRY_DSN` (error monitoring), `CHECKR_API_KEY` / `CHECKR_WEBHOOK_SECRET` (background checks), `AWS_S3_BUCKET` / `AWS_REGION` (file storage).

3. Apply the schema and load demo data:
```bash
npm run db:push     # pushes schema.prisma to the database (no migration history is committed)
npm run db:seed     # seeds demo users, caregivers, and bookings via prisma/seed.ts
```

4. Start the dev server:
```bash
npm run dev
```

### Demo Credentials

These accounts belong to the **deployed prototype** (see the demo note in the Overview), which uses simplified mock authentication — any password is accepted:

| Role | Email | Password |
|------|-------|----------|
| Family | sarah@example.com | any |
| Caregiver | maria@caregiver.com | any |
| Admin | admin@bolvicare.com | any |

## Project Structure

```
bolvi-care/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── auth/              # Authentication pages
│   ├── book/              # Booking flow
│   ├── caregivers/        # Caregiver browsing & profiles
│   ├── dashboard/         # Role-based dashboards
│   │   ├── caregiver/    # Caregiver dashboard
│   │   └── family/       # Family dashboard
│   └── ...
├── components/            # React components
│   ├── caregivers/       # Caregiver-related components
│   ├── home/             # Homepage sections
│   ├── layout/           # Header, footer, navigation
│   └── ui/               # Reusable UI components
├── lib/                   # Utilities and data
│   ├── hipaa/            # Audit logging, consent, security headers
│   ├── store.ts          # Zustand state stores
│   ├── types.ts          # TypeScript interfaces
│   └── utils.ts          # Utility functions
├── prisma/                # schema.prisma (40 models) + seed.ts
└── public/               # Static assets
```

## Deployment

I deploy Bolvi Care on **Vercel**. `vercel.json` pins the install and build commands; the build runs `prisma generate && next build` so the Prisma client is always regenerated against the current schema.

- **Database:** managed **Postgres**, connected through Prisma with a split `DATABASE_URL` (pooled) and `DIRECT_URL` (direct). The pooled URL serves the serverless runtime; the direct URL handles schema operations that shouldn't run through the pooler.
- **Schema:** applied with `prisma db push`. I'm not committing a migration history yet while the 40-model schema is still moving; `npm run db:migrate:prod` (`prisma migrate deploy`) is wired in for when I adopt migrations.
- **Secrets:** all keys live in Vercel's per-environment variables, never in the repo. Optional integrations (Stripe, Resend, Google OAuth, Sentry, Checkr, S3) are guarded in code, so an environment missing a key loses that feature instead of crashing.
- **Error monitoring:** Sentry releases are tagged with the deployed commit via `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA`.

Production is not live at the moment — the deployed prototype is offline while I migrate authentication (see the note in the Overview).

## Security and PHI Handling

This app handles protected health information (PHI), so telemetry and dependencies are managed with that in mind.

- **Audited telemetry for PHI leakage.** Error-reporting breadcrumbs and request bodies were capturing PHI-bearing URLs from care routes (`/api/visits/**`, `/api/medications/**`, `/api/messages/**`). Scrubbing was hardened across the client, server, and edge runtimes — including the edge config, which previously had no filtering at all.
- **Removed a dormant analytics integration.** It was configured with autocapture enabled and no input masking, which would have captured PHI from authenticated pages the moment it was wired into the layout.
- **Removed an unused data/auth subsystem.** This eliminated a second dormant auth path and its transitive dependency vulnerabilities.
- **HIPAA-aligned technical safeguards.** Audit logging, PHI scrubbing, and security headers are implemented at the application level. Full HIPAA compliance additionally requires organizational controls — BAAs, risk assessments, workforce training, and breach procedures — that are beyond application code.
- **Remaining npm advisories are build-time tooling only** (bundler and inbound-mail-parsing dependencies), not in the served request path.
- **Production also requires a BAA** with any error-reporting vendor. Standard plans do not cover PHI.

## Roadmap

### Built
- [x] Caregiver browsing and search
- [x] Detailed caregiver profiles
- [x] Multi-step booking flow
- [x] Family, caregiver, and admin dashboards
- [x] NextAuth authentication with email verification and password reset
- [x] PostgreSQL + Prisma data layer (40 models)
- [x] Stripe payments with webhooks
- [x] Email notifications (Resend)
- [x] HIPAA-aligned audit logging
- [x] Responsive design

### Planned
- [ ] Real-time messaging
- [ ] Geolocation/mapping

## License

Proprietary software of Bolvi Care LLC. All rights reserved.

## Contact

- **Website**: [bolvicare.com](https://bolvicare.com)
- **Email**: hello@bolvicare.com
- **Support**: support@bolvicare.com
