# Bolvi Care Technical Architecture

## Current State (Demo/MVP)

The current implementation is a **frontend demo** built to validate UX and gather feedback. It uses:

- **Framework:** Next.js 16 with App Router
- **Styling:** Tailwind CSS 4 + shadcn/ui components
- **State Management:** Zustand for client-side state
- **Data:** Mock data in `/lib/mock-data.ts`
- **Authentication:** Simulated role switching (no real auth)

---

## Target Production Architecture

### Overview Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │   Web    │  │  Mobile  │  │  Admin   │  │  Widget  │        │
│  │ (Next.js)│  │ (React   │  │  Panel   │  │ (Embed)  │        │
│  │          │  │  Native) │  │          │  │          │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
└───────┼─────────────┼─────────────┼─────────────┼───────────────┘
        │             │             │             │
        └─────────────┴──────┬──────┴─────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                      API GATEWAY                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Next.js API Routes / tRPC                   │   │
│  │         (Authentication, Rate Limiting, Validation)      │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────────┐
│                    BACKEND SERVICES                              │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Auth    │  │ Booking  │  │ Payment  │  │ Messaging│        │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       │             │             │             │                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Search   │  │ Notifi-  │  │ Review   │  │ Analytics│        │
│  │ Service  │  │ cation   │  │ Service  │  │ Service  │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
└───────┼─────────────┼─────────────┼─────────────┼───────────────┘
        │             │             │             │
┌───────┴─────────────┴──────┬──────┴─────────────┴───────────────┐
│                      DATA LAYER                                  │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  PostgreSQL  │  │    Redis     │  │ Elasticsearch│          │
│  │  (Primary)   │  │   (Cache)    │  │  (Search)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │     S3       │  │  Pinecone    │                             │
│  │  (Files)     │  │ (Embeddings) │                             │
│  └──────────────┘  └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Schema (PostgreSQL + Prisma)

### Core Models

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============ USERS ============

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  phone         String?   @unique
  passwordHash  String?
  role          UserRole  @default(FAMILY)
  status        UserStatus @default(PENDING)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLoginAt   DateTime?

  familyProfile   FamilyProfile?
  caregiverProfile CaregiverProfile?
  sessions        Session[]
  notifications   Notification[]

  @@index([email])
  @@index([phone])
}

enum UserRole {
  FAMILY
  CAREGIVER
  ADMIN
}

enum UserStatus {
  PENDING
  ACTIVE
  SUSPENDED
  DEACTIVATED
}

// ============ FAMILY PROFILES ============

model FamilyProfile {
  id            String   @id @default(cuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id])

  firstName     String
  lastName      String
  address       Json?    // { street, city, state, zip, lat, lng }
  photo         String?

  careRecipients CareRecipient[]
  bookings       Booking[]
  reviews        Review[]
  favorites      FavoriteCaregiver[]

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model CareRecipient {
  id            String   @id @default(cuid())
  familyId      String
  family        FamilyProfile @relation(fields: [familyId], references: [id])

  firstName     String
  lastName      String
  relationship  String
  dateOfBirth   DateTime
  conditions    String[] // Array of health conditions
  notes         String?

  bookings      Booking[]

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

// ============ CAREGIVER PROFILES ============

model CaregiverProfile {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])

  firstName       String
  lastName        String
  photo           String?
  bio             String?
  hourlyRate      Decimal  @db.Decimal(10, 2)

  // Location
  address         Json?
  serviceRadius   Int      @default(15) // miles

  // Qualifications
  yearsExperience Int      @default(0)
  certifications  String[]
  specialties     String[]
  languages       String[]

  // Verification
  backgroundCheckStatus VerificationStatus @default(PENDING)
  backgroundCheckDate   DateTime?
  idVerified            Boolean @default(false)

  // Stats
  rating          Decimal  @db.Decimal(3, 2) @default(0)
  reviewCount     Int      @default(0)
  completedVisits Int      @default(0)
  responseRate    Decimal  @db.Decimal(5, 2) @default(0)

  availability    Availability[]
  bookings        Booking[]
  reviews         Review[]
  earnings        Earning[]
  favoritedBy     FavoriteCaregiver[]

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([hourlyRate])
  @@index([rating])
}

enum VerificationStatus {
  PENDING
  IN_PROGRESS
  VERIFIED
  FAILED
  EXPIRED
}

// ============ AVAILABILITY ============

model Availability {
  id           String   @id @default(cuid())
  caregiverId  String
  caregiver    CaregiverProfile @relation(fields: [caregiverId], references: [id])

  dayOfWeek    Int      // 0-6 (Sunday-Saturday)
  startTime    String   // "09:00"
  endTime      String   // "17:00"
  isRecurring  Boolean  @default(true)

  // For specific date overrides
  specificDate DateTime?
  isBlocked    Boolean  @default(false)

  @@unique([caregiverId, dayOfWeek, startTime], name: "unique_recurring_slot")
  @@index([caregiverId])
}

// ============ BOOKINGS ============

model Booking {
  id              String   @id @default(cuid())

  familyId        String
  family          FamilyProfile @relation(fields: [familyId], references: [id])

  caregiverId     String
  caregiver       CaregiverProfile @relation(fields: [caregiverId], references: [id])

  careRecipientId String
  careRecipient   CareRecipient @relation(fields: [careRecipientId], references: [id])

  // Schedule
  date            DateTime
  startTime       String
  endTime         String
  duration        Decimal  @db.Decimal(4, 2) // hours

  // Services
  services        String[]
  specialNotes    String?

  // Status
  status          BookingStatus @default(PENDING)

  // Pricing
  hourlyRate      Decimal  @db.Decimal(10, 2)
  subtotal        Decimal  @db.Decimal(10, 2)
  serviceFee      Decimal  @db.Decimal(10, 2)
  total           Decimal  @db.Decimal(10, 2)

  // Payment
  paymentIntentId String?
  paymentStatus   PaymentStatus @default(PENDING)

  // Recurring
  isRecurring     Boolean  @default(false)
  recurringGroupId String?

  review          Review?
  earning         Earning?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([familyId])
  @@index([caregiverId])
  @@index([date])
  @@index([status])
}

enum BookingStatus {
  PENDING      // Awaiting caregiver acceptance
  CONFIRMED    // Accepted, upcoming
  IN_PROGRESS  // Currently happening
  COMPLETED    // Visit finished
  CANCELLED    // Cancelled by either party
  NO_SHOW      // Caregiver didn't show
  DISPUTED     // Under dispute resolution
}

enum PaymentStatus {
  PENDING
  AUTHORIZED
  CAPTURED
  REFUNDED
  FAILED
}

// ============ REVIEWS ============

model Review {
  id           String   @id @default(cuid())

  bookingId    String   @unique
  booking      Booking  @relation(fields: [bookingId], references: [id])

  familyId     String
  family       FamilyProfile @relation(fields: [familyId], references: [id])

  caregiverId  String
  caregiver    CaregiverProfile @relation(fields: [caregiverId], references: [id])

  rating       Int      // 1-5
  content      String?

  // Moderation
  status       ReviewStatus @default(PENDING)
  flaggedReason String?

  // Response
  response     String?
  respondedAt  DateTime?

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([caregiverId])
  @@index([rating])
}

enum ReviewStatus {
  PENDING
  APPROVED
  FLAGGED
  REMOVED
}

// ============ PAYMENTS & EARNINGS ============

model Earning {
  id           String   @id @default(cuid())

  caregiverId  String
  caregiver    CaregiverProfile @relation(fields: [caregiverId], references: [id])

  bookingId    String   @unique
  booking      Booking  @relation(fields: [bookingId], references: [id])

  grossAmount  Decimal  @db.Decimal(10, 2)
  platformFee  Decimal  @db.Decimal(10, 2)
  netAmount    Decimal  @db.Decimal(10, 2)

  status       EarningStatus @default(PENDING)
  paidAt       DateTime?
  payoutId     String?

  createdAt    DateTime @default(now())

  @@index([caregiverId])
  @@index([status])
}

enum EarningStatus {
  PENDING
  AVAILABLE
  PAID
  HELD
}

// ============ MESSAGING ============

model Conversation {
  id           String   @id @default(cuid())

  familyId     String
  caregiverId  String

  lastMessageAt DateTime?

  messages     Message[]

  createdAt    DateTime @default(now())

  @@unique([familyId, caregiverId])
  @@index([familyId])
  @@index([caregiverId])
}

model Message {
  id             String   @id @default(cuid())

  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id])

  senderId       String
  content        String

  readAt         DateTime?

  createdAt      DateTime @default(now())

  @@index([conversationId])
}

// ============ NOTIFICATIONS ============

model Notification {
  id       String   @id @default(cuid())

  userId   String
  user     User     @relation(fields: [userId], references: [id])

  type     NotificationType
  title    String
  message  String
  data     Json?

  readAt   DateTime?

  createdAt DateTime @default(now())

  @@index([userId])
  @@index([createdAt])
}

enum NotificationType {
  BOOKING_REQUEST
  BOOKING_CONFIRMED
  BOOKING_CANCELLED
  BOOKING_REMINDER
  PAYMENT_RECEIVED
  REVIEW_RECEIVED
  MESSAGE_RECEIVED
  VERIFICATION_UPDATE
  SYSTEM
}

// ============ SUPPORT ============

model FavoriteCaregiver {
  id           String   @id @default(cuid())

  familyId     String
  family       FamilyProfile @relation(fields: [familyId], references: [id])

  caregiverId  String
  caregiver    CaregiverProfile @relation(fields: [caregiverId], references: [id])

  createdAt    DateTime @default(now())

  @@unique([familyId, caregiverId])
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id])

  token        String   @unique
  expiresAt    DateTime

  userAgent    String?
  ipAddress    String?

  createdAt    DateTime @default(now())

  @@index([userId])
  @@index([token])
}
```

---

## API Design (REST/tRPC)

### Authentication Endpoints

```typescript
// POST /api/auth/signup
// POST /api/auth/login
// POST /api/auth/logout
// POST /api/auth/refresh
// POST /api/auth/forgot-password
// POST /api/auth/reset-password
// POST /api/auth/verify-email
// POST /api/auth/verify-phone
```

### User Endpoints

```typescript
// GET    /api/users/me
// PATCH  /api/users/me
// DELETE /api/users/me
// GET    /api/users/:id (admin)
```

### Caregiver Endpoints

```typescript
// GET    /api/caregivers          - List/search caregivers
// GET    /api/caregivers/:id      - Get caregiver profile
// PATCH  /api/caregivers/:id      - Update profile (owner/admin)
// GET    /api/caregivers/:id/availability
// POST   /api/caregivers/:id/availability
// GET    /api/caregivers/:id/reviews
```

### Booking Endpoints

```typescript
// POST   /api/bookings            - Create booking
// GET    /api/bookings            - List user's bookings
// GET    /api/bookings/:id        - Get booking details
// PATCH  /api/bookings/:id        - Update booking
// POST   /api/bookings/:id/cancel - Cancel booking
// POST   /api/bookings/:id/confirm - Caregiver confirms
// POST   /api/bookings/:id/complete - Mark complete
```

### Payment Endpoints

```typescript
// POST   /api/payments/intent     - Create payment intent
// POST   /api/payments/webhook    - Stripe webhook
// GET    /api/earnings            - Caregiver earnings
// POST   /api/earnings/withdraw   - Request payout
```

---

## Third-Party Integrations

### Required Integrations

| Service | Purpose | Provider |
|---------|---------|----------|
| Authentication | OAuth, MFA | NextAuth + Auth0 |
| Payments | Processing, Payouts | Stripe Connect |
| Background Checks | Verification | Checkr API |
| SMS/Email | Notifications | Twilio + SendGrid |
| File Storage | Photos, Documents | AWS S3 |
| Search | Caregiver search | Elasticsearch / Algolia |
| Maps | Location, Distance | Google Maps API |
| Analytics | Usage tracking | PostHog / Mixpanel |
| Error Tracking | Bug monitoring | Sentry |

### Stripe Connect Flow

```
1. Caregiver signs up
   └─> Create Stripe Connect account (Standard)

2. Family books caregiver
   └─> Create PaymentIntent with transfer_data
   └─> Pre-authorize family's card

3. Visit completed
   └─> Capture payment
   └─> Transfer to caregiver's Stripe account (minus platform fee)

4. Caregiver withdraws
   └─> Stripe handles payout to caregiver's bank
```

---

## Infrastructure

### Deployment Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        Vercel                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Next.js Application                     │    │
│  │         (SSR, API Routes, Static Assets)            │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                     AWS / Railway                             │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  PostgreSQL  │  │    Redis     │  │      S3      │       │
│  │   (Neon)     │  │  (Upstash)   │  │   (Files)    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└──────────────────────────────────────────────────────────────┘
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Auth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://bolvicare.com

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# External APIs
CHECKR_API_KEY=...
GOOGLE_MAPS_API_KEY=...
SENDGRID_API_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...

# Monitoring
SENTRY_DSN=...
POSTHOG_API_KEY=...

# Storage
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
```

---

## Security Measures

### Authentication & Authorization

- JWT tokens with short expiry (15 min) + refresh tokens (7 days)
- Role-based access control (RBAC) on all API routes
- Rate limiting: 100 req/min for authenticated, 20 req/min for anonymous
- MFA support for admin accounts

### Data Protection

- All PII encrypted at rest (AES-256)
- TLS 1.3 for all connections
- Database field-level encryption for sensitive data
- Regular security audits

### Compliance

- HIPAA considerations for health information
- PCI DSS compliance via Stripe (no card data stored)
- CCPA/GDPR data deletion support
- SOC 2 Type II certification (planned)

---

## Migration Path

### Phase 1: MVP Backend (Weeks 1-4)

- [ ] Set up PostgreSQL database with Prisma
- [ ] Implement NextAuth authentication
- [ ] Create basic CRUD API for users, caregivers, bookings
- [ ] Replace mock data with database queries
- [ ] Basic search with PostgreSQL full-text search

### Phase 2: Core Features (Weeks 5-8)

- [ ] Stripe Connect integration
- [ ] Background check integration (Checkr)
- [ ] Real-time messaging with WebSockets
- [ ] Email/SMS notifications (SendGrid/Twilio)
- [ ] File uploads to S3

### Phase 3: Scale & Optimize (Weeks 9-12)

- [ ] Redis caching layer
- [ ] Elasticsearch for caregiver search
- [ ] Background job processing (Bull/BullMQ)
- [ ] Performance optimization
- [ ] Monitoring and alerting setup

### Phase 4: Advanced Features (Weeks 13-16)

- [ ] Mobile app (React Native)
- [ ] Admin dashboard backend
- [ ] Analytics pipeline
- [ ] Automated testing suite
- [ ] CI/CD pipeline optimization
