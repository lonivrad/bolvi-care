# Bolvi Care - Home Care Marketplace

A modern marketplace platform connecting families with trusted, vetted caregivers for compassionate at-home support.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)

## Overview

Bolvi Care revolutionizes how families find trusted support for their loved ones by providing:

- **For Families**: Easy search and booking of verified caregivers with transparent pricing
- **For Caregivers**: Flexible work opportunities with fair compensation
- **Trust & Safety**: Background checks, credential verification, and reviews

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
| **Framework** | Next.js 16.1 (App Router) |
| **Language** | TypeScript 5 |
| **UI Library** | React 19.2 |
| **Styling** | Tailwind CSS 4 |
| **Components** | Radix UI Primitives |
| **State Management** | Zustand 5 |
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

The MVP uses mock authentication. Use these test accounts:

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

## Roadmap

### MVP (Current)
- [x] Caregiver browsing and search
- [x] Detailed caregiver profiles
- [x] Multi-step booking flow
- [x] Family dashboard
- [x] Caregiver dashboard
- [x] Admin dashboard
- [x] Mock authentication
- [x] Responsive design

### Phase 2 (Planned)
- [ ] Real authentication (NextAuth/Firebase)
- [ ] Database integration (PostgreSQL/Prisma)
- [ ] Payment processing (Stripe)
- [ ] Real-time messaging
- [ ] Email notifications
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
