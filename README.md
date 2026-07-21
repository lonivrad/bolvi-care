# Bolvi Care - Home Care Marketplace

A modern marketplace platform connecting families with trusted, vetted caregivers for compassionate at-home support.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)

## Overview

Bolvi Care revolutionizes how families find trusted support for their loved ones by providing:

- **For Families**: Easy search and booking of verified caregivers with transparent pricing
- **For Caregivers**: Flexible work opportunities with fair compensation
- **Trust & Safety**: Background checks, credential verification, and reviews

The application is a full build-out rather than a static mock: **79 pages**, **37 API routes**, and a **40-model Prisma schema** backing authentication, bookings, visits, payments, messaging, and audit logging.

<!-- TODO(demo-url): replace with the public production alias once promoted (see PR notes). -->
Live demo → _coming soon — publicly reachable production alias being set up_

> **Demo vs. this codebase.** The live demo runs an earlier prototype build — it is stable and demonstrates the product end to end. The current codebase in this repository is a further build-out (NextAuth authentication, Prisma data layer, Stripe payments, HIPAA-aligned audit logging); its auth integration is mid-migration and is **not currently deployed**. The demo credentials below belong to the deployed prototype.

## Screenshots

<!-- Add your screenshots here -->
<details>
<summary>View Screenshots</summary>

### Homepage
![Homepage](screenshots/homepage.png)

### Caregiver Search
![Caregiver Search](screenshots/caregiver-search.png)

### Booking Flow
![Booking Flow](screenshots/booking-flow.png)

### Family Dashboard
![Family Dashboard](screenshots/family-dashboard.png)

### Caregiver Dashboard
![Caregiver Dashboard](screenshots/caregiver-dashboard.png)

</details>

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

### Caregiver Features
- Professional profile with certifications and badges
- Availability calendar management
- Booking request management
- Earnings tracking and payout history
- Performance analytics

### Admin Features
- Platform metrics dashboard
- User management
- Verification queue
- Dispute handling
- Financial reporting

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bolvi-care.git
cd bolvi-care
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Copy environment variables (optional for MVP):
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
│   ├── mock-data.ts      # Mock data for MVP
│   ├── store.ts          # Zustand state stores
│   ├── types.ts          # TypeScript interfaces
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/bolvi-care)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will auto-detect Next.js and deploy

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

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

### Phase 3 (Future)
- [ ] Mobile apps (React Native)
- [ ] Video consultations
- [ ] AI-powered matching
- [ ] Care plan recommendations

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## License

This project is proprietary software. All rights reserved.

## Contact

- **Website**: [bolvicare.com](https://bolvicare.com)
- **Email**: hello@bolvicare.com
- **Support**: support@bolvicare.com

---

Built with care for those who care.
