import {
  BookOpen,
  Calendar,
  CreditCard,
  Shield,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface HelpArticle {
  id: string;
  slug: string;
  title: string;
  categoryId: string;
  summary: string;
  content: string;
  views: number;
  helpful: number;
  lastUpdated: string;
  readTime: number; // minutes
  relatedArticles?: string[];
}

export interface HelpCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  color: string;
}

export const helpCategories: HelpCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    description: "Learn the basics of using Bolvi Care",
    color: "blue",
  },
  {
    id: "bookings",
    title: "Bookings & Scheduling",
    icon: Calendar,
    description: "How to book, reschedule, and manage care visits",
    color: "green",
  },
  {
    id: "payments",
    title: "Payments & Billing",
    icon: CreditCard,
    description: "Payment methods, invoices, and refunds",
    color: "purple",
  },
  {
    id: "safety",
    title: "Safety & Trust",
    icon: Shield,
    description: "Background checks, insurance, and security",
    color: "orange",
  },
  {
    id: "caregivers",
    title: "For Caregivers",
    icon: Users,
    description: "Caregiver guides and resources",
    color: "teal",
  },
  {
    id: "account",
    title: "Account & Settings",
    icon: Settings,
    description: "Profile, notifications, and preferences",
    color: "gray",
  },
];

export const helpArticles: HelpArticle[] = [
  // ==================== GETTING STARTED ====================
  {
    id: "gs-1",
    slug: "how-to-book-first-caregiver",
    title: "How to book your first caregiver",
    categoryId: "getting-started",
    summary: "A step-by-step guide to finding and booking your first caregiver on Bolvi Care.",
    content: `
## Finding the Right Caregiver

Booking your first caregiver is easy with Bolvi Care. Here's how to get started:

### Step 1: Search for Caregivers

1. Click "Find Caregiver" from your dashboard or the homepage
2. Enter your location or use your current location
3. Select the type of care you need (companion care, personal care, dementia care, etc.)
4. Choose your preferred dates and times

### Step 2: Review Caregiver Profiles

Each caregiver profile includes:
- **Photo and bio** - Get to know your caregiver
- **Ratings and reviews** - See feedback from other families
- **Certifications** - View their qualifications (CPR, CNA, etc.)
- **Specialties** - What types of care they excel at
- **Hourly rate** - Transparent pricing
- **Availability** - When they can work

### Step 3: Book a Caregiver

1. Click "Book Now" on your chosen caregiver's profile
2. Select the date and time for your visit
3. Choose which care recipient needs care
4. Add any special instructions or care notes
5. Review the booking summary and total cost
6. Confirm your booking

### Step 4: Prepare for the Visit

After booking:
- You'll receive a confirmation email
- Message your caregiver through the app to introduce yourself
- Share any important care details
- The caregiver will arrive at the scheduled time

### Tips for First-Time Bookings

- **Start with a shorter visit** to see if it's a good fit
- **Be detailed** in your care instructions
- **Have emergency contacts** ready
- **Prepare a list** of medications and routines
    `,
    views: 12453,
    helpful: 892,
    lastUpdated: "2025-01-15",
    readTime: 5,
    relatedArticles: ["gs-2", "gs-3", "bookings-1"],
  },
  {
    id: "gs-2",
    slug: "creating-your-account",
    title: "Creating and setting up your account",
    categoryId: "getting-started",
    summary: "Learn how to create your Bolvi Care account and set up your profile.",
    content: `
## Creating Your Bolvi Care Account

### Sign Up Options

You can create an account using:
- **Email address** - Use any valid email
- **Google account** - Quick sign-in with Google
- **Apple ID** - Sign in with Apple (iOS users)

### Setting Up Your Profile

After creating your account, complete these steps:

#### 1. Personal Information
- Full name
- Phone number (for important notifications)
- Profile photo (helps caregivers recognize you)

#### 2. Add Care Recipients
Click "Add Care Recipient" and provide:
- Name and relationship
- Age and date of birth
- Medical conditions
- Medications and allergies
- Care needs and preferences
- Emergency contacts

#### 3. Payment Method
Add a payment method for seamless bookings:
- Credit or debit card
- HSA/FSA card (if applicable)

#### 4. Notification Preferences
Choose how you want to be notified:
- Email notifications
- Push notifications
- SMS alerts for urgent updates

### Account Verification

For security, we verify:
- Email address (click the link we send)
- Phone number (enter the code we text)

### Privacy Settings

Control your privacy:
- Who can see your profile
- Communication preferences
- Data sharing settings
    `,
    views: 8234,
    helpful: 654,
    lastUpdated: "2025-01-10",
    readTime: 4,
    relatedArticles: ["gs-1", "account-1"],
  },
  {
    id: "gs-3",
    slug: "understanding-care-types",
    title: "Understanding different types of care",
    categoryId: "getting-started",
    summary: "Learn about companion care, personal care, dementia care, and other care types.",
    content: `
## Types of Care Available on Bolvi Care

### Companion Care
**Best for:** Seniors who are independent but need social interaction

Includes:
- Conversation and companionship
- Light meal preparation
- Medication reminders
- Light housekeeping
- Transportation to appointments
- Running errands
- Recreational activities

### Personal Care
**Best for:** Those who need help with daily activities

Includes:
- Bathing and grooming assistance
- Dressing assistance
- Toileting and incontinence care
- Mobility assistance
- Feeding assistance
- Personal hygiene

### Dementia & Alzheimer's Care
**Best for:** Those with cognitive impairments

Includes:
- Memory care activities
- Redirection and calming techniques
- Safety supervision
- Routine maintenance
- Communication strategies
- Wandering prevention

### Post-Surgery & Recovery Care
**Best for:** Those recovering from surgery or illness

Includes:
- Wound care assistance
- Mobility exercises
- Medication management
- Appointment transportation
- Recovery monitoring

### Respite Care
**Best for:** Family caregivers who need a break

Provides temporary relief for family caregivers, available for:
- A few hours
- Overnight stays
- Weekend coverage
- Vacation coverage

### Overnight & 24-Hour Care
**Best for:** Those who need round-the-clock assistance

Options include:
- Overnight care (sleeping caregiver)
- 24-hour care (awake caregiver)
- Live-in care arrangements
    `,
    views: 6892,
    helpful: 523,
    lastUpdated: "2025-01-08",
    readTime: 6,
    relatedArticles: ["gs-1", "gs-4"],
  },
  {
    id: "gs-4",
    slug: "messaging-your-caregiver",
    title: "How to message your caregiver",
    categoryId: "getting-started",
    summary: "Learn how to communicate effectively with your caregiver through the app.",
    content: `
## Communicating with Your Caregiver

### Using the Message Center

Access messages from:
- The Messages icon in the top navigation
- Your booking details page
- The caregiver's profile

### What You Can Share

- **Care instructions** - Daily routines, preferences
- **Schedule updates** - Changes to visit times
- **Health updates** - New medications, conditions
- **Questions** - About care or qualifications
- **Feedback** - After visits

### Best Practices

1. **Introduce yourself** before the first visit
2. **Be specific** about care needs
3. **Share emergency contacts** and procedures
4. **Respond promptly** to messages
5. **Use the app** for all communication (for your protection)

### Quick Reply Options

Use our quick replies for common messages:
- "Running 5 minutes late"
- "Confirmed for tomorrow"
- "Please call me when you arrive"
- "Thank you for the great care!"

### Video Calls

For complex discussions, you can:
- Schedule a video call through the app
- Share your screen to show documents
- Include family members in the call
    `,
    views: 6547,
    helpful: 478,
    lastUpdated: "2025-01-05",
    readTime: 3,
    relatedArticles: ["gs-1", "gs-2"],
  },
  {
    id: "gs-5",
    slug: "adding-care-recipients",
    title: "Adding and managing care recipients",
    categoryId: "getting-started",
    summary: "How to add family members who need care and manage their profiles.",
    content: `
## Managing Care Recipients

### Adding a Care Recipient

1. Go to Dashboard > Care Recipients
2. Click "Add Care Recipient"
3. Fill in their information:

#### Basic Information
- Full name
- Relationship to you
- Date of birth
- Photo (optional but helpful)

#### Medical Information
- Medical conditions
- Current medications (name, dosage, frequency)
- Allergies (medications, food, environmental)
- Mobility level
- Dietary restrictions

#### Care Preferences
- Preferred daily routine
- Activities they enjoy
- Communication preferences
- Things to avoid

#### Emergency Contacts
- Primary care physician
- Specialists
- Family members to contact
- Hospital preference

### Sharing Access

You can invite other family members to:
- View care recipient profiles
- Book caregivers
- Receive notifications
- Access care reports

### Updating Information

Keep profiles current by updating:
- Medication changes
- New diagnoses
- Mobility changes
- Care preference updates

### Privacy & Security

- Only you and authorized caregivers see full details
- Medical info is encrypted
- You control who has access
    `,
    views: 4521,
    helpful: 367,
    lastUpdated: "2025-01-12",
    readTime: 4,
    relatedArticles: ["gs-2", "gs-3"],
  },
  {
    id: "gs-6",
    slug: "mobile-app-guide",
    title: "Using the Bolvi Care mobile app",
    categoryId: "getting-started",
    summary: "Download and navigate the Bolvi Care mobile app for iOS and Android.",
    content: `
## Bolvi Care Mobile App

### Download the App

- **iOS:** Available on the App Store
- **Android:** Available on Google Play

### Key Features

#### Home Screen
- Quick booking button
- Upcoming visits
- Unread messages
- Recent activity

#### Find Caregivers
- Map view of nearby caregivers
- Filter by specialty, rating, price
- Save favorites
- Instant booking

#### Manage Bookings
- View upcoming visits
- Reschedule or cancel
- Contact caregivers
- Rate completed visits

#### Messages
- Real-time messaging
- Photo sharing
- Voice messages
- Read receipts

#### Notifications
- Booking confirmations
- Caregiver updates
- Arrival alerts
- Payment receipts

### Offline Access

The app works offline for:
- Viewing saved bookings
- Accessing emergency contacts
- Reading care instructions

### Tips for Families

- Enable location services for accurate caregiver matching
- Turn on notifications for important updates
- Add the app to your home screen for quick access
    `,
    views: 3892,
    helpful: 298,
    lastUpdated: "2025-01-03",
    readTime: 4,
    relatedArticles: ["gs-2", "gs-4"],
  },
  {
    id: "gs-7",
    slug: "what-to-expect-first-visit",
    title: "What to expect during the first visit",
    categoryId: "getting-started",
    summary: "Prepare for your caregiver's first visit with this helpful guide.",
    content: `
## Your First Care Visit

### Before the Visit

#### Prepare Your Home
- Clear pathways for easy movement
- Have necessary supplies ready
- Prepare a list of important information
- Set out any mobility aids

#### Information to Have Ready
- Daily routine schedule
- Medication list and locations
- Emergency contact numbers
- Important phone numbers (doctors, pharmacy)
- House rules or preferences

### When the Caregiver Arrives

#### Introductions
- Greet the caregiver warmly
- Introduce them to the care recipient
- Give a tour of relevant areas
- Show them where supplies are kept

#### Review Care Plan
- Go over the care recipient's needs
- Discuss the day's activities
- Review any medications to be given
- Share communication preferences

### During the Visit

The caregiver will:
- Follow the agreed care plan
- Document activities and observations
- Contact you with questions
- Handle any minor issues

### After the Visit

- Review the visit summary in your app
- Leave feedback and a rating
- Note any adjustments needed
- Message the caregiver with follow-up questions

### Building a Relationship

- Consistency is key - consider booking the same caregiver
- Open communication prevents issues
- Feedback helps improve care
- Trust develops over time
    `,
    views: 5234,
    helpful: 421,
    lastUpdated: "2025-01-14",
    readTime: 5,
    relatedArticles: ["gs-1", "gs-5"],
  },
  {
    id: "gs-8",
    slug: "care-team-favorites",
    title: "Building your care team and favorites",
    categoryId: "getting-started",
    summary: "How to create a reliable team of caregivers you trust.",
    content: `
## Building Your Care Team

### What is a Care Team?

Your care team is a group of caregivers you've worked with and trust. Benefits include:
- Faster booking with familiar caregivers
- Consistency in care
- Caregivers who know your loved one
- Priority scheduling

### Adding Caregivers to Your Team

After a positive visit:
1. Go to the completed booking
2. Click "Add to Care Team"
3. The caregiver appears in your Care Team section

### Setting a Primary Caregiver

Designate a primary caregiver who:
- Gets first priority for your bookings
- Knows your care recipient best
- Provides continuity of care

To set a primary:
1. Go to Dashboard > Care Team
2. Click on a caregiver
3. Select "Set as Primary"

### Saving Favorites

Not ready for your care team? Save favorites:
- Click the heart icon on any profile
- Access favorites from your dashboard
- Get notified of their availability

### Managing Your Team

- Remove caregivers who aren't a good fit
- Add notes about each caregiver
- Track booking history
- View ratings you've given
    `,
    views: 3456,
    helpful: 267,
    lastUpdated: "2025-01-09",
    readTime: 3,
    relatedArticles: ["gs-1", "bookings-4"],
  },

  // ==================== BOOKINGS & SCHEDULING ====================
  {
    id: "bookings-1",
    slug: "cancel-reschedule-booking",
    title: "How to cancel or reschedule a booking",
    categoryId: "bookings",
    summary: "Learn about our cancellation policy and how to modify your bookings.",
    content: `
## Cancelling or Rescheduling Bookings

### Cancellation Policy

| Timing | Refund |
|--------|--------|
| 48+ hours before | Full refund |
| 24-48 hours before | 75% refund |
| 12-24 hours before | 50% refund |
| Less than 12 hours | No refund |

**Emergency cancellations** are evaluated on a case-by-case basis.

### How to Cancel

1. Go to Dashboard > Bookings
2. Find the booking you want to cancel
3. Click "Cancel Booking"
4. Select a reason for cancellation
5. Confirm the cancellation

### How to Reschedule

1. Go to Dashboard > Bookings
2. Click "Reschedule" on the booking
3. Select a new date/time
4. Check caregiver availability
5. Confirm the new time

### What Happens After

**After cancelling:**
- You'll receive a confirmation email
- Refund processed within 3-5 business days
- The caregiver is notified

**After rescheduling:**
- New booking confirmation sent
- Original time slot released
- No additional charges (if same duration)

### Emergency Situations

If you need to cancel due to:
- Medical emergency
- Hospitalization
- Death in family

Contact support immediately for a full refund regardless of timing.
    `,
    views: 7832,
    helpful: 612,
    lastUpdated: "2025-01-16",
    readTime: 4,
    relatedArticles: ["bookings-2", "payments-3"],
  },
  {
    id: "bookings-2",
    slug: "recurring-care-schedules",
    title: "Setting up recurring care schedules",
    categoryId: "bookings",
    summary: "Book regular care visits that repeat weekly or monthly.",
    content: `
## Recurring Care Schedules

### Benefits of Recurring Bookings

- **Consistency** - Same caregiver, same time
- **Priority booking** - Guaranteed availability
- **Discounts** - Save 5-10% on recurring bookings
- **Less hassle** - Book once, care continues

### Setting Up Recurring Care

1. Book a caregiver as usual
2. On the confirmation screen, select "Make this recurring"
3. Choose frequency:
   - Daily
   - Weekly (specific days)
   - Bi-weekly
   - Monthly
4. Set an end date or "ongoing"
5. Confirm the schedule

### Managing Recurring Bookings

#### Skip a Visit
- Click on the specific date
- Select "Skip this visit"
- No charge for skipped visits (with 48hr notice)

#### Modify Schedule
- Change the regular time
- Add or remove days
- Adjust duration

#### Pause Recurring Care
- Temporarily pause (e.g., for vacation)
- Set resume date
- Your schedule is saved

#### Cancel Recurring
- End the recurring schedule
- Individual bookings before cancellation still apply

### Billing for Recurring Care

- Charged after each visit
- Monthly summary available
- Receipts sent automatically
    `,
    views: 5892,
    helpful: 467,
    lastUpdated: "2025-01-11",
    readTime: 4,
    relatedArticles: ["bookings-1", "payments-1"],
  },
  {
    id: "bookings-3",
    slug: "same-day-booking",
    title: "Booking a caregiver for same-day visits",
    categoryId: "bookings",
    summary: "How to find and book caregivers for urgent, same-day care needs.",
    content: `
## Same-Day Bookings

### When to Use Same-Day Booking

- Unexpected work meeting
- Family emergency
- Regular caregiver cancelled
- Sudden health need

### How to Book Same-Day

1. Click "Find Caregiver" from dashboard
2. Select today's date
3. Filter by "Available Now" or specific time
4. Review available caregivers
5. Book with "Instant Book" caregivers for fastest confirmation

### Availability Considerations

- Fewer caregivers available same-day
- May cost slightly more (5-10% surge pricing)
- Instant Book caregivers confirm immediately
- Others may take up to 1 hour to respond

### Tips for Same-Day Success

- **Be flexible** with timing
- **Expand your radius** to find more caregivers
- **Have your Care Team** - they're more likely to accept
- **Book as early as possible** in the day

### Instant Book Caregivers

Look for the lightning bolt icon - these caregivers:
- Accept bookings immediately
- No waiting for confirmation
- Great for urgent needs
- Still fully vetted and verified
    `,
    views: 4234,
    helpful: 345,
    lastUpdated: "2025-01-13",
    readTime: 3,
    relatedArticles: ["bookings-1", "gs-1"],
  },
  {
    id: "bookings-4",
    slug: "requesting-specific-caregiver",
    title: "How to request a specific caregiver",
    categoryId: "bookings",
    summary: "Book your preferred caregiver every time.",
    content: `
## Requesting Specific Caregivers

### From Their Profile

1. Visit the caregiver's profile
2. Click "Book [Name]"
3. Select your preferred date/time
4. Complete the booking

### From Your Care Team

1. Go to Dashboard > Care Team
2. Click on the caregiver
3. Select "Book Now"
4. Choose date/time from their availability

### From Past Bookings

1. Go to Dashboard > Booking History
2. Find a past visit with that caregiver
3. Click "Book Again"
4. Modify date/time as needed

### If They're Not Available

If your preferred caregiver isn't available:
- Check alternative times
- Join their waitlist
- Enable notifications for their availability
- Consider booking a backup caregiver

### Building Caregiver Relationships

- **Communicate preferences** clearly
- **Leave positive reviews** for great care
- **Book consistently** to build rapport
- **Add them to your Care Team** for priority
    `,
    views: 3678,
    helpful: 289,
    lastUpdated: "2025-01-07",
    readTime: 3,
    relatedArticles: ["gs-8", "bookings-2"],
  },
  {
    id: "bookings-5",
    slug: "overnight-24hour-care",
    title: "Booking overnight and 24-hour care",
    categoryId: "bookings",
    summary: "How to arrange extended care for overnight or round-the-clock needs.",
    content: `
## Extended Care Options

### Overnight Care (Sleep-In)

**Hours:** Typically 10 PM - 6 AM

The caregiver:
- Sleeps at your home
- Responds to nighttime needs
- Helps with bedtime/morning routines
- Handles emergencies

**Best for:**
- Fall risk at night
- Bathroom assistance
- Medication timing
- Peace of mind

### 24-Hour Care (Awake)

**Hours:** Round-the-clock supervision

The caregiver:
- Stays awake all night
- Provides continuous monitoring
- No sleeping on shift

**Best for:**
- High fall risk
- Dementia with wandering
- Post-surgery monitoring
- Hospice care

### Live-In Care

For ongoing needs:
- Caregiver lives in your home
- Daily rate vs hourly
- Scheduled breaks required
- Often the same caregiver

### How to Book Extended Care

1. Select "Overnight" or "24-Hour" care type
2. Choose dates (arrival to departure)
3. Filter for caregivers with extended care experience
4. Review rates (often discounted for longer stays)
5. Confirm booking

### Pricing

| Care Type | Typical Rate |
|-----------|--------------|
| Overnight (8hr) | Flat rate |
| 24-Hour | Hourly rate |
| Live-In | Daily rate |

### Preparing for Extended Stays

- Provide sleeping accommodations for overnight
- Ensure meals/snacks available
- Share detailed nighttime routine
- Provide emergency procedures
    `,
    views: 4567,
    helpful: 378,
    lastUpdated: "2025-01-06",
    readTime: 5,
    relatedArticles: ["gs-3", "bookings-2"],
  },
  {
    id: "bookings-6",
    slug: "caregiver-no-show",
    title: "What to do if your caregiver doesn't show up",
    categoryId: "bookings",
    summary: "Steps to take if your caregiver misses their scheduled visit.",
    content: `
## Handling No-Shows

### First Steps

1. **Check messages** - The caregiver may have sent an update
2. **Wait 15 minutes** - Traffic or minor delays happen
3. **Call the caregiver** - Use the app to call directly
4. **Contact support** - If no response after 15 minutes

### How to Contact Support

- **In-app:** Tap "Get Help" on the booking
- **Phone:** 1-800-BOLVI-CARE (available 24/7)
- **Chat:** Live chat in the app

### What We'll Do

1. Attempt to contact the caregiver
2. Find a replacement caregiver if needed
3. Process a full refund for the missed visit
4. Investigate the incident

### Replacement Care

If we find a replacement:
- You'll be notified immediately
- New caregiver's profile shared
- Same rate applies
- Your approval required

### Caregiver Consequences

Caregivers who no-show:
- Receive a warning
- May be suspended
- Account terminated for repeat offenses
- Required to explain absence

### Your Refund

- Automatic full refund for no-shows
- Processed within 24 hours
- No action required from you

### Prevention Tips

- Book caregivers with high ratings
- Use your Care Team for reliability
- Confirm the booking day-before
    `,
    views: 5123,
    helpful: 445,
    lastUpdated: "2025-01-15",
    readTime: 4,
    relatedArticles: ["bookings-1", "payments-3"],
  },
  {
    id: "bookings-7",
    slug: "booking-multiple-caregivers",
    title: "Booking multiple caregivers for an event",
    categoryId: "bookings",
    summary: "How to book several caregivers for special occasions or round-the-clock coverage.",
    content: `
## Multiple Caregiver Bookings

### When You Need Multiple Caregivers

- Family events with multiple seniors
- 24-hour coverage with shift changes
- Complex care requiring two people
- Respite for family reunions

### How to Book Multiple Caregivers

#### Same Time, Different People
1. Create separate bookings for each care recipient
2. Search for available caregivers
3. Book different caregivers for each

#### Shift Coverage (24-Hour)
1. Book first caregiver for shift 1 (e.g., 7 AM - 3 PM)
2. Book second caregiver for shift 2 (e.g., 3 PM - 11 PM)
3. Book third caregiver for shift 3 (e.g., 11 PM - 7 AM)

### Coordinating Caregivers

- Share care plans with all caregivers
- Introduce them to each other if shifts overlap
- Use the group message feature
- Provide shift handoff instructions

### Special Event Care

For weddings, reunions, etc.:
- Book 2-4 weeks in advance
- Request caregivers experienced with events
- Provide event details and expectations
- Confirm transportation arrangements
    `,
    views: 2345,
    helpful: 198,
    lastUpdated: "2025-01-04",
    readTime: 4,
    relatedArticles: ["bookings-5", "bookings-2"],
  },
  {
    id: "bookings-8",
    slug: "visit-documentation",
    title: "Understanding visit documentation and reports",
    categoryId: "bookings",
    summary: "What information caregivers record during and after visits.",
    content: `
## Visit Documentation

### What Caregivers Document

#### During the Visit
- **Check-in time** - GPS-verified arrival
- **Activities completed** - Tasks from care plan
- **Medications given** - With timestamps
- **Meals/fluids** - What was consumed
- **Vitals** - If monitoring is requested
- **Mood/behavior** - Observations

#### After the Visit
- **Check-out time** - Departure verification
- **Visit summary** - Overview of the day
- **Notes** - Important observations
- **Photos** - Activities, meals (with permission)
- **Concerns** - Anything requiring attention

### Accessing Documentation

1. Go to Dashboard > Booking History
2. Click on a completed visit
3. View "Visit Report"

### What's Included in Reports

- Timeline of activities
- Caregiver notes
- Medication log
- Meal log
- Any incidents or concerns
- Photos (if taken)

### Sharing Reports

Share reports with:
- Other family members
- Healthcare providers
- Care managers

Options:
- Email PDF report
- Print from app
- Grant dashboard access

### Using Reports for Care Planning

- Track trends over time
- Identify changes in behavior
- Share with doctors
- Adjust care plans accordingly
    `,
    views: 3234,
    helpful: 267,
    lastUpdated: "2025-01-10",
    readTime: 4,
    relatedArticles: ["bookings-4", "gs-5"],
  },

  // ==================== PAYMENTS & BILLING ====================
  {
    id: "payments-1",
    slug: "payment-methods",
    title: "Accepted payment methods",
    categoryId: "payments",
    summary: "Learn about the payment options available on Bolvi Care.",
    content: `
## Payment Methods

### Accepted Cards

- **Credit Cards:** Visa, Mastercard, American Express, Discover
- **Debit Cards:** With Visa/Mastercard logo
- **HSA/FSA Cards:** Health Savings and Flexible Spending Accounts

### Adding a Payment Method

1. Go to Settings > Payment Methods
2. Click "Add Payment Method"
3. Enter card details
4. Save for future use

### Setting a Default Payment

- Your first card becomes default
- Change default in Payment Settings
- Default is charged automatically

### When You're Charged

- **After each visit** - Charged when caregiver checks out
- **Recurring bookings** - Charged after each visit
- **Cancellation fees** - If applicable

### Payment Security

- **Encrypted** - Bank-level encryption
- **Secure storage** - We never store full card numbers
- **PCI compliant** - Highest security standards
- **Fraud protection** - Suspicious activity monitoring

### HSA/FSA Payments

Home care is often HSA/FSA eligible:
- Enter your HSA/FSA card
- Get receipts automatically
- Consult your plan administrator for eligibility
    `,
    views: 4567,
    helpful: 356,
    lastUpdated: "2025-01-12",
    readTime: 3,
    relatedArticles: ["payments-2", "payments-4"],
  },
  {
    id: "payments-2",
    slug: "understanding-pricing",
    title: "Understanding pricing and fees",
    categoryId: "payments",
    summary: "A breakdown of how pricing works on Bolvi Care.",
    content: `
## Pricing Structure

### What You Pay

Your total includes:

| Component | Description |
|-----------|-------------|
| Caregiver Rate | Hourly rate set by caregiver |
| Platform Fee | 15% of caregiver rate |
| Total | What you're charged |

**Example:**
- Caregiver rate: $35/hour
- Platform fee: $5.25/hour
- Your cost: $40.25/hour

### What's Included in the Platform Fee

- Background check maintenance
- Liability insurance coverage
- 24/7 customer support
- Secure messaging
- Payment processing
- Care coordination tools
- Visit documentation

### Variable Pricing Factors

Rates may vary based on:
- **Care type** - Specialized care costs more
- **Time of day** - Evenings/weekends may have premiums
- **Location** - Urban vs rural areas
- **Experience** - More experienced caregivers charge more
- **Certifications** - Specialized credentials

### Minimum Booking

- Minimum 2-hour booking
- Some caregivers set higher minimums

### Discounts Available

- **Recurring bookings:** 5-10% off
- **Extended visits:** Discounted hourly rates
- **Referral credits:** $50 for each referral
    `,
    views: 5678,
    helpful: 445,
    lastUpdated: "2025-01-14",
    readTime: 4,
    relatedArticles: ["payments-1", "payments-3"],
  },
  {
    id: "payments-3",
    slug: "refund-policy",
    title: "Refund policy and how refunds work",
    categoryId: "payments",
    summary: "Everything you need to know about getting a refund.",
    content: `
## Refund Policy

### Cancellation Refunds

| When You Cancel | Refund Amount |
|-----------------|---------------|
| 48+ hours before | 100% |
| 24-48 hours before | 75% |
| 12-24 hours before | 50% |
| Less than 12 hours | 0% |

### Automatic Refunds

You automatically receive refunds for:
- Caregiver no-shows
- Caregiver cancellations
- Significant lateness (30+ minutes)

### Requesting a Refund

For other issues:
1. Go to the booking in question
2. Click "Report an Issue"
3. Describe the problem
4. Submit for review

### Refund Processing Time

- **Credit/Debit cards:** 3-5 business days
- **HSA/FSA cards:** 5-7 business days

### Partial Refunds

You may receive partial refunds for:
- Visit ended early at your request
- Service quality issues
- Caregiver arrived late

### Service Quality Issues

If care wasn't satisfactory:
1. Contact support within 48 hours
2. Provide specific details
3. We'll investigate
4. Refund or credit issued if warranted

### Refund Disputes

If you disagree with a refund decision:
- Contact support to appeal
- Provide additional information
- Resolution within 5 business days
    `,
    views: 6234,
    helpful: 512,
    lastUpdated: "2025-01-15",
    readTime: 4,
    relatedArticles: ["bookings-1", "payments-2"],
  },
  {
    id: "payments-4",
    slug: "viewing-receipts-invoices",
    title: "Viewing receipts and invoices",
    categoryId: "payments",
    summary: "How to access and download your payment history.",
    content: `
## Receipts and Invoices

### Finding Your Receipts

1. Go to Dashboard > Payment History
2. View all transactions
3. Click any transaction for details

### What's on Each Receipt

- Date and time of service
- Caregiver name
- Duration of visit
- Breakdown of charges
- Payment method used
- Transaction ID

### Downloading Receipts

- **Individual:** Click "Download PDF" on any receipt
- **Bulk:** Select date range, click "Export All"
- **Monthly statements:** Available on the 1st of each month

### For Tax Purposes

At year-end, access:
- **Annual summary** - Total spent on care
- **Detailed report** - All transactions
- **W-9 form** - If required for tax deductions

### HSA/FSA Documentation

For reimbursement:
- Download itemized receipts
- Include caregiver name and service
- Our receipts include required info

### Sharing with Insurance

If submitting for reimbursement:
1. Download the receipt
2. Include the diagnosis code (ask your doctor)
3. Submit to your insurance provider
    `,
    views: 3456,
    helpful: 278,
    lastUpdated: "2025-01-08",
    readTime: 3,
    relatedArticles: ["payments-1", "payments-5"],
  },
  {
    id: "payments-5",
    slug: "payment-failed",
    title: "What to do if payment fails",
    categoryId: "payments",
    summary: "Troubleshooting payment issues and updating payment methods.",
    content: `
## Payment Troubleshooting

### Common Reasons for Failed Payments

- **Expired card** - Check expiration date
- **Insufficient funds** - Ensure adequate balance
- **Incorrect details** - Verify card number, CVV, zip code
- **Card blocked** - Contact your bank
- **Daily limit reached** - Some cards have limits

### What Happens When Payment Fails

1. You receive a notification
2. We retry in 24 hours
3. You can update payment method
4. Booking isn't affected immediately

### Updating Payment Method

1. Go to Settings > Payment Methods
2. Add a new card or update existing
3. Set as default if desired
4. Retry the failed payment

### Manual Payment Retry

If you've updated your card:
1. Go to Dashboard > Payment History
2. Find the failed payment
3. Click "Retry Payment"

### Preventing Future Failures

- Keep cards up to date
- Add a backup payment method
- Ensure sufficient funds before visits
- Enable card notifications from your bank

### Still Having Issues?

Contact support if:
- Payment continues to fail
- You've been charged incorrectly
- You see unauthorized charges
    `,
    views: 2789,
    helpful: 234,
    lastUpdated: "2025-01-11",
    readTime: 3,
    relatedArticles: ["payments-1", "payments-3"],
  },
  {
    id: "payments-6",
    slug: "tipping-caregivers",
    title: "Tipping your caregiver",
    categoryId: "payments",
    summary: "How to show appreciation for excellent care with tips.",
    content: `
## Tipping Caregivers

### Is Tipping Expected?

Tipping is **not required** but is appreciated for exceptional service.

### How to Tip

After a visit:
1. Open the completed booking
2. Click "Leave Tip"
3. Select amount or enter custom
4. Add a personal note (optional)
5. Confirm

### Suggested Amounts

- **Standard:** 10-15% of visit cost
- **Exceptional service:** 20%+
- **Holiday/Special occasions:** Bonus tip

### When to Consider Tipping Extra

- Outstanding care
- Going above and beyond
- Holiday visits
- Difficult situations handled well
- Building a long-term relationship

### Alternative Ways to Show Appreciation

- Leave a detailed positive review
- Recommend to friends and family
- Send a thank you message
- Request them regularly

### Tax Considerations

Tips are:
- Separate from the booking cost
- 100% goes to the caregiver
- Not subject to platform fee
    `,
    views: 2345,
    helpful: 198,
    lastUpdated: "2025-01-06",
    readTime: 2,
    relatedArticles: ["payments-2", "gs-7"],
  },

  // ==================== SAFETY & TRUST ====================
  {
    id: "safety-1",
    slug: "background-check-process",
    title: "Understanding our background check process",
    categoryId: "safety",
    summary: "Learn how we screen caregivers to ensure your family's safety.",
    content: `
## Caregiver Background Checks

### What We Check

Every caregiver undergoes comprehensive screening:

#### Criminal Background
- FBI criminal database
- State criminal records
- County court records
- Sex offender registry
- National criminal database

#### Identity Verification
- Government ID verification
- Social Security number verification
- Address history verification

#### Professional Verification
- Employment history
- Professional references
- Credential verification
- License validation

### The Process

1. **Application** - Caregiver applies to join
2. **Initial screening** - Basic qualifications review
3. **Background check** - 3-7 day comprehensive check
4. **Reference calls** - We contact references
5. **Interview** - Video or in-person interview
6. **Approval** - Only qualified caregivers approved

### What Disqualifies Caregivers

We do not accept caregivers with:
- Violent crimes
- Theft or fraud
- Elder abuse history
- Sex offenses
- Drug-related felonies
- Falsified information

### Ongoing Monitoring

Background checks aren't one-time:
- Annual re-screening
- Continuous criminal monitoring
- License expiration alerts
- Regular compliance reviews

### Your Peace of Mind

- View verification badges on profiles
- See when background check completed
- Report any concerns immediately
    `,
    views: 8921,
    helpful: 723,
    lastUpdated: "2025-01-16",
    readTime: 5,
    relatedArticles: ["safety-2", "safety-3"],
  },
  {
    id: "safety-2",
    slug: "insurance-coverage",
    title: "Insurance and liability coverage",
    categoryId: "safety",
    summary: "How you and your loved ones are protected during care visits.",
    content: `
## Insurance Coverage

### What's Covered

#### General Liability Insurance
- Accidents during care
- Property damage
- Medical expenses from incidents

#### Workers' Compensation
- Caregiver injuries on the job
- You're not liable for caregiver injuries

#### Professional Liability
- Care-related errors
- Medication mistakes
- Negligence claims

### Coverage Limits

- **Per occurrence:** Up to $1,000,000
- **Aggregate:** Up to $2,000,000
- **Property damage:** Up to $100,000

### What's NOT Covered

- Pre-existing damage
- Intentional acts
- Theft (handled separately)
- Care outside of booked visits

### If an Incident Occurs

1. Ensure everyone is safe
2. Document what happened
3. Report to Bolvi Care immediately
4. File a claim if needed
5. We'll guide you through the process

### Your Homeowner's Insurance

Our coverage is primary, but:
- Notify your homeowner's insurance
- They may provide additional coverage
- No impact on your premiums for our visits

### Requesting Proof of Insurance

If you need documentation:
1. Contact support
2. Request certificate of insurance
3. Received within 24 hours
    `,
    views: 5678,
    helpful: 456,
    lastUpdated: "2025-01-13",
    readTime: 4,
    relatedArticles: ["safety-1", "safety-4"],
  },
  {
    id: "safety-3",
    slug: "reporting-concerns",
    title: "How to report a concern or incident",
    categoryId: "safety",
    summary: "What to do if something goes wrong during a care visit.",
    content: `
## Reporting Concerns

### Types of Concerns

#### Urgent (Report Immediately)
- Abuse or neglect
- Theft
- Safety hazards
- Medical emergencies
- Inappropriate behavior

#### Non-Urgent
- Service quality issues
- Communication problems
- Minor scheduling issues
- Feedback on care

### How to Report

#### In the App
1. Go to the booking
2. Click "Report an Issue"
3. Select the type of concern
4. Provide details
5. Submit

#### By Phone
- Call 1-800-BOLVI-CARE
- Available 24/7
- For urgent matters

#### By Email
- support@bolvicare.com
- Response within 24 hours

### What Happens Next

1. **Acknowledgment** - We confirm receipt
2. **Investigation** - We gather information
3. **Resolution** - Action taken
4. **Follow-up** - We update you

### For Emergencies

- **Medical emergency:** Call 911 first
- **Suspected abuse:** Contact Adult Protective Services
- **Then notify us** - We'll support the investigation

### Anonymous Reporting

You can report anonymously if preferred:
- Use our anonymous tip line
- No retaliation for good-faith reports
    `,
    views: 4567,
    helpful: 378,
    lastUpdated: "2025-01-14",
    readTime: 4,
    relatedArticles: ["safety-1", "safety-4"],
  },
  {
    id: "safety-4",
    slug: "home-safety-tips",
    title: "Home safety tips for care visits",
    categoryId: "safety",
    summary: "Prepare your home for safe and effective caregiving.",
    content: `
## Home Safety Preparation

### Before the First Visit

#### Clear Pathways
- Remove tripping hazards
- Ensure adequate lighting
- Secure loose rugs
- Clear clutter from walkways

#### Bathroom Safety
- Non-slip mats
- Grab bars near toilet/shower
- Raised toilet seat if needed
- Adequate lighting

#### Bedroom Safety
- Bed at proper height
- Clear path to bathroom
- Night lights
- Bedside phone/call button

### Essential Supplies

Have these ready:
- First aid kit
- Emergency contact list
- Medication list
- Medical equipment instructions
- Caregiver instructions

### Security Considerations

#### Giving Access
- Provide entry method (key, code, etc.)
- Introduce caregiver to neighbors
- Set up camera notifications

#### Valuables
- Secure medications
- Lock away valuables
- Note any pre-existing damage

### Emergency Preparedness

Share with your caregiver:
- Fire escape routes
- Location of fire extinguisher
- Circuit breaker location
- Water shut-off
- Emergency contacts

### Communication Devices

Ensure your loved one has:
- Working phone access
- Medical alert system (if used)
- Caregiver's contact number
    `,
    views: 3456,
    helpful: 287,
    lastUpdated: "2025-01-09",
    readTime: 5,
    relatedArticles: ["gs-7", "safety-3"],
  },
  {
    id: "safety-5",
    slug: "caregiver-verification-badges",
    title: "Understanding caregiver verification badges",
    categoryId: "safety",
    summary: "What each verification badge means on caregiver profiles.",
    content: `
## Verification Badges Explained

### Badge Types

#### Background Checked
- FBI and state criminal check passed
- Sex offender registry cleared
- Annual re-verification
- Most recent check date shown

#### ID Verified
- Government ID confirmed
- Photo matches profile
- Address verified
- SSN validated

#### Credential Verified
- Professional licenses confirmed
- Certifications validated
- Training records verified
- Expiration dates monitored

#### Reference Checked
- Professional references contacted
- Employment history verified
- Character references reviewed

### Additional Badges

#### CPR/First Aid Certified
- Current certification
- Expiration date shown
- Re-certification tracked

#### Specialized Training
- Dementia care training
- Alzheimer's certified
- Hospice trained
- Other specializations

### How to View Badges

1. Open caregiver profile
2. Scroll to "Verifications" section
3. Click any badge for details
4. See verification dates

### If a Badge Expires

- Caregiver notified to renew
- Badge removed if not renewed
- Profile shows "Renewal Pending"
    `,
    views: 2789,
    helpful: 234,
    lastUpdated: "2025-01-07",
    readTime: 3,
    relatedArticles: ["safety-1", "gs-1"],
  },
  {
    id: "safety-6",
    slug: "protecting-personal-information",
    title: "Protecting your personal information",
    categoryId: "safety",
    summary: "How we keep your data safe and what you can control.",
    content: `
## Data Privacy & Security

### What We Collect

#### Account Information
- Name, email, phone
- Payment information
- Profile details

#### Care Information
- Care recipient details
- Medical information
- Care preferences

#### Usage Information
- Booking history
- App activity
- Communications

### How We Protect Your Data

- **Encryption** - All data encrypted in transit and at rest
- **Access controls** - Limited employee access
- **Regular audits** - Security assessments
- **Compliance** - HIPAA-aligned safeguards for health information

### What Caregivers See

Caregivers only see:
- Care recipient name
- Care needs and preferences
- Address (only for booked visits)
- Contact phone (only for booked visits)

They DO NOT see:
- Your full profile
- Payment information
- Other care recipients
- Booking history with others

### Your Privacy Controls

In Settings > Privacy:
- Control profile visibility
- Manage communication preferences
- Download your data
- Request data deletion

### Secure Communication

- All messages encrypted
- No personal info in notifications
- Secure file sharing
    `,
    views: 3123,
    helpful: 256,
    lastUpdated: "2025-01-11",
    readTime: 4,
    relatedArticles: ["account-4", "safety-3"],
  },

  // ==================== FOR CAREGIVERS ====================
  {
    id: "caregivers-1",
    slug: "becoming-caregiver",
    title: "How to become a caregiver on Bolvi Care",
    categoryId: "caregivers",
    summary: "Step-by-step guide to joining our caregiver network.",
    content: `
## Becoming a Bolvi Care Caregiver

### Requirements

#### Basic Requirements
- 18 years or older
- Legal work authorization
- Clean background check
- Reliable transportation
- Smartphone with data plan

#### Experience (One of the Following)
- 1+ years professional caregiving
- CNA, HHA, or equivalent certification
- Family caregiving experience

### Application Process

#### Step 1: Apply Online
- Create an account
- Complete the application
- Upload required documents

#### Step 2: Background Check
- Consent to comprehensive screening
- Takes 3-7 business days
- We cover the cost

#### Step 3: Interview
- Video interview with our team
- Discuss experience and approach
- Ask questions about the platform

#### Step 4: Profile Setup
- Professional photo
- Detailed bio
- Set your rate and availability
- List specialties and certifications

#### Step 5: Training
- Complete platform orientation
- Review safety protocols
- Understand policies

### Documents Needed

- Government-issued ID
- Proof of certifications
- Professional references
- Work authorization (if applicable)

### Timeline

- Application: 15-20 minutes
- Background check: 3-7 days
- Interview: 30 minutes
- Total: About 1-2 weeks
    `,
    views: 7234,
    helpful: 589,
    lastUpdated: "2025-01-15",
    readTime: 5,
    relatedArticles: ["caregivers-2", "caregivers-3"],
  },
  {
    id: "caregivers-2",
    slug: "setting-your-rate",
    title: "Setting your hourly rate",
    categoryId: "caregivers",
    summary: "Tips for pricing your caregiving services competitively.",
    content: `
## Pricing Your Services

### Factors to Consider

#### Your Experience
- Years of caregiving
- Types of care provided
- Client outcomes

#### Your Credentials
- Certifications (CNA, HHA)
- Specialized training
- Continuing education

#### Local Market Rates
- Research your area's rates
- Consider cost of living
- Look at competitor pricing

### Recommended Rate Ranges

| Experience Level | Suggested Rate |
|-----------------|----------------|
| Entry (0-2 years) | $25-32/hour |
| Intermediate (2-5 years) | $30-38/hour |
| Experienced (5+ years) | $35-45/hour |
| Specialized Care | $40-55/hour |

### Setting Different Rates

You can set different rates for:
- **Weekday daytime** - Standard rate
- **Evenings** - Premium rate
- **Weekends** - Premium rate
- **Holidays** - Holiday premium
- **Overnight** - Flat rate option

### Rate Strategy Tips

- **Start competitive** - Build reviews first
- **Increase gradually** - After positive reviews
- **Consider minimums** - 2-3 hour minimum
- **Factor in travel** - Include travel time

### Changing Your Rate

- Update anytime in Settings
- Existing bookings keep original rate
- New bookings use new rate
- No limit on changes
    `,
    views: 5678,
    helpful: 456,
    lastUpdated: "2025-01-12",
    readTime: 4,
    relatedArticles: ["caregivers-1", "caregivers-4"],
  },
  {
    id: "caregivers-3",
    slug: "managing-availability",
    title: "Managing your availability calendar",
    categoryId: "caregivers",
    summary: "How to set your schedule and manage time off.",
    content: `
## Managing Your Schedule

### Setting Weekly Availability

1. Go to Dashboard > Availability
2. Toggle days on/off
3. Set time ranges for each day
4. Save changes

### Adding Time Slots

For each available day:
- Set start and end times
- Add multiple slots (split shifts)
- Different times for different days

### Blocking Time Off

Use the calendar to block:
- Vacation days
- Personal appointments
- Unavailable periods

To block dates:
1. Click on the date in calendar
2. Add a reason (optional)
3. Confirm the block

### Booking Settings

Configure preferences:
- **Instant Booking** - Accept bookings automatically
- **Minimum Notice** - How much advance notice you need
- **Max Hours/Day** - Cap your daily hours

### Managing Requests

If Instant Booking is off:
- Review booking requests
- Accept or decline within 1 hour
- Propose alternative times

### Tips for Success

- Keep availability updated
- Block time before you need it
- Respond to requests quickly
- Be consistent with your schedule
    `,
    views: 4567,
    helpful: 378,
    lastUpdated: "2025-01-10",
    readTime: 4,
    relatedArticles: ["caregivers-2", "caregivers-5"],
  },
  {
    id: "caregivers-4",
    slug: "getting-more-bookings",
    title: "Tips for getting more bookings",
    categoryId: "caregivers",
    summary: "Strategies to increase your visibility and booking rate.",
    content: `
## Maximizing Your Bookings

### Profile Optimization

#### Great Profile Photo
- Professional, friendly appearance
- Clear face, good lighting
- Smile and approachable

#### Compelling Bio
- Highlight experience
- Share your "why"
- Mention specialties
- Include personal touches

#### Complete All Sections
- Add all certifications
- List all services
- Include languages spoken
- Add availability details

### Improving Your Ranking

#### Response Time
- Respond to requests within 1 hour
- Quick responses boost ranking
- Set up notifications

#### Acceptance Rate
- Accept requests when possible
- High acceptance = better visibility
- Only decline when necessary

#### Review Score
- Provide excellent care
- Communicate proactively
- Go above and beyond

### Building Your Client Base

- Enable Instant Booking
- Offer competitive rates initially
- Be available during peak times
- Specialize in high-demand areas

### Marketing Yourself

- Share your profile link
- Ask satisfied families for referrals
- Keep certifications current
- Add new skills and training
    `,
    views: 6789,
    helpful: 567,
    lastUpdated: "2025-01-14",
    readTime: 5,
    relatedArticles: ["caregivers-2", "caregivers-6"],
  },
  {
    id: "caregivers-5",
    slug: "during-care-visit",
    title: "Best practices during care visits",
    categoryId: "caregivers",
    summary: "How to provide excellent care and document visits properly.",
    content: `
## Providing Excellent Care

### Before Arriving

- Review care notes
- Plan activities
- Check for updates
- Arrive 5 minutes early

### Arrival Protocol

1. Check in through the app (GPS verified)
2. Greet care recipient warmly
3. Wash hands immediately
4. Review any family updates

### During the Visit

#### Follow the Care Plan
- Complete assigned tasks
- Note any changes needed
- Respect preferences

#### Communication
- Engage with care recipient
- Update family as needed
- Document observations

#### Safety First
- Watch for hazards
- Monitor for changes
- Follow emergency protocols

### Documentation Requirements

Log in the app:
- Activities completed
- Meals and fluids
- Medications given
- Mood and behavior
- Any concerns

### Departure Protocol

1. Ensure care recipient is safe and comfortable
2. Complete all documentation
3. Leave notes for next caregiver/family
4. Check out through the app
5. Lock up as instructed

### Handling Issues

If problems arise:
- Stay calm
- Contact family if appropriate
- Use emergency protocols if needed
- Document everything
    `,
    views: 5234,
    helpful: 423,
    lastUpdated: "2025-01-13",
    readTime: 5,
    relatedArticles: ["caregivers-3", "caregivers-7"],
  },
  {
    id: "caregivers-6",
    slug: "caregiver-payments-earnings",
    title: "Understanding your earnings and payments",
    categoryId: "caregivers",
    summary: "How and when you get paid for your caregiving work.",
    content: `
## Caregiver Payments

### How Earnings Work

Your earnings = Your Rate - Platform Fee (15%)

**Example:**
- You set rate: $40/hour
- Platform fee: $6/hour
- You earn: $34/hour

### Payment Schedule

- Earnings available after visit completion
- Transfer to bank: 1-3 business days
- Direct deposit available

### Setting Up Payments

1. Go to Settings > Payment Settings
2. Add bank account or debit card
3. Verify your identity
4. Choose payment method

### Withdrawal Options

#### Instant Transfer
- Available immediately
- Small fee applies
- To eligible debit cards

#### Standard Transfer
- Free
- 1-3 business days
- To bank account

### Tracking Earnings

In your dashboard:
- Daily earnings
- Weekly summary
- Monthly totals
- Transaction history

### Tax Information

- You're an independent contractor
- We provide 1099 forms
- Track your mileage and expenses
- Consult a tax professional
    `,
    views: 4567,
    helpful: 378,
    lastUpdated: "2025-01-11",
    readTime: 4,
    relatedArticles: ["caregivers-2", "caregivers-8"],
  },
  {
    id: "caregivers-7",
    slug: "handling-emergencies",
    title: "How to handle emergencies during visits",
    categoryId: "caregivers",
    summary: "Emergency protocols and procedures for caregivers.",
    content: `
## Emergency Procedures

### Medical Emergencies

#### Signs of Emergency
- Difficulty breathing
- Chest pain
- Severe bleeding
- Loss of consciousness
- Stroke symptoms (FAST)
- Severe allergic reaction

#### What to Do

1. **Stay calm**
2. **Call 911** immediately
3. Provide first aid if trained
4. Contact family immediately
5. Stay with care recipient
6. Document everything

### Falls

If the care recipient falls:
1. Don't move them (unless in danger)
2. Check for injuries
3. Call 911 if serious injury suspected
4. Contact family
5. Document the incident
6. Report in app

### Fire Emergency

1. Get care recipient out safely
2. Call 911
3. Don't go back inside
4. Contact family and Bolvi Care
5. Document what happened

### Behavioral Emergencies

For aggression or confusion:
1. Stay calm and speak softly
2. Don't argue or restrain
3. Remove potential hazards
4. Create space if needed
5. Call for help if escalating
6. Document behaviors

### After an Emergency

1. Complete incident report in app
2. Contact Bolvi Care support
3. Provide statement if needed
4. Attend debriefing if offered

### Your Emergency Contacts

Always have ready:
- 911
- Family contacts
- Bolvi Care support: 1-800-BOLVI-CARE
- Poison control: 1-800-222-1222
    `,
    views: 6123,
    helpful: 534,
    lastUpdated: "2025-01-16",
    readTime: 5,
    relatedArticles: ["caregivers-5", "safety-3"],
  },
  {
    id: "caregivers-8",
    slug: "caregiver-reviews-ratings",
    title: "Understanding reviews and ratings",
    categoryId: "caregivers",
    summary: "How the review system works and how to maintain high ratings.",
    content: `
## Reviews and Ratings

### How Ratings Work

After each visit, families can rate:
- Overall experience (1-5 stars)
- Punctuality
- Communication
- Care quality
- Professionalism

### Your Overall Rating

- Average of all ratings
- Updated after each review
- Displayed on your profile
- Key factor in search rankings

### Responding to Reviews

- View all reviews in your dashboard
- Respond professionally to feedback
- Thank families for positive reviews
- Address concerns constructively

### Handling Negative Reviews

If you receive a negative review:
1. Stay professional
2. Reflect on the feedback
3. Respond calmly if appropriate
4. Learn and improve
5. Contact support if unfair

### Maintaining High Ratings

- Arrive on time
- Communicate proactively
- Follow care plans exactly
- Go above and beyond
- Ask for feedback

### Impact of Ratings

| Rating | Impact |
|--------|--------|
| 4.8+ | Featured in searches |
| 4.5-4.7 | Good visibility |
| 4.0-4.4 | Normal visibility |
| Below 4.0 | Reduced visibility |
| Below 3.5 | Account review |
    `,
    views: 3789,
    helpful: 312,
    lastUpdated: "2025-01-09",
    readTime: 4,
    relatedArticles: ["caregivers-4", "caregivers-5"],
  },

  // ==================== ACCOUNT & SETTINGS ====================
  {
    id: "account-1",
    slug: "updating-profile",
    title: "Updating your profile information",
    categoryId: "account",
    summary: "How to edit your personal information and preferences.",
    content: `
## Managing Your Profile

### Editing Personal Information

Go to Settings > Profile to update:
- Name
- Email address
- Phone number
- Profile photo
- Address

### Changing Your Password

1. Go to Settings > Security
2. Click "Change Password"
3. Enter current password
4. Enter new password
5. Confirm new password
6. Save

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one number
- At least one special character

### Updating Email

1. Go to Settings > Profile
2. Click on email address
3. Enter new email
4. Verify via link sent to new email
5. Old email notified of change

### Profile Photo Guidelines

- Clear, recent photo
- Shows your face
- Good lighting
- Professional appearance
- Appropriate attire

### Keeping Information Current

Update your profile when:
- Phone number changes
- Address changes
- Emergency contacts change
- Care needs evolve
    `,
    views: 4234,
    helpful: 345,
    lastUpdated: "2025-01-10",
    readTime: 3,
    relatedArticles: ["gs-2", "account-2"],
  },
  {
    id: "account-2",
    slug: "notification-settings",
    title: "Managing notification settings",
    categoryId: "account",
    summary: "Control how and when you receive notifications.",
    content: `
## Notification Preferences

### Notification Types

#### Booking Notifications
- Booking confirmations
- Upcoming visit reminders
- Caregiver check-in/out
- Schedule changes

#### Message Notifications
- New messages
- Urgent communications
- Quick replies

#### Account Notifications
- Payment receipts
- Security alerts
- Policy updates

### Delivery Methods

Choose for each notification type:
- **Push notifications** - On your phone
- **Email** - To your registered email
- **SMS** - Text messages (urgent only)

### Setting Preferences

1. Go to Settings > Notifications
2. Toggle each notification type
3. Choose delivery method
4. Save preferences

### Do Not Disturb

Set quiet hours:
- Choose start and end time
- Only urgent notifications come through
- Customize by day of week

### Email Digest

Instead of individual emails:
- Daily summary option
- Weekly summary option
- Reduces inbox clutter

### Recommended Settings

We suggest keeping on:
- Booking confirmations
- Caregiver arrivals
- Payment receipts
- Security alerts
    `,
    views: 3123,
    helpful: 256,
    lastUpdated: "2025-01-08",
    readTime: 3,
    relatedArticles: ["account-1", "account-3"],
  },
  {
    id: "account-3",
    slug: "account-security",
    title: "Keeping your account secure",
    categoryId: "account",
    summary: "Security features and best practices for your account.",
    content: `
## Account Security

### Two-Factor Authentication (2FA)

Add an extra layer of security:
1. Go to Settings > Security
2. Enable Two-Factor Authentication
3. Choose method: SMS or Authenticator app
4. Verify setup with code

### Login Alerts

Get notified of:
- New device logins
- Unusual login locations
- Failed login attempts

### Session Management

View and manage active sessions:
- See all logged-in devices
- Log out of specific devices
- Log out of all devices

### Password Best Practices

- Use a unique password
- Don't reuse passwords
- Consider a password manager
- Change periodically

### Recognizing Scams

Bolvi Care will never:
- Ask for your password via email
- Request payment outside the app
- Call asking for personal info
- Send unsolicited links

### If You Suspect Compromise

1. Change your password immediately
2. Enable 2FA if not already
3. Review recent activity
4. Contact support
5. Monitor for suspicious activity

### Security Features

We provide:
- Encrypted communications
- Secure payment processing
- Regular security audits
- Fraud monitoring
    `,
    views: 3456,
    helpful: 287,
    lastUpdated: "2025-01-12",
    readTime: 4,
    relatedArticles: ["account-1", "safety-6"],
  },
  {
    id: "account-4",
    slug: "deleting-account",
    title: "How to delete your account",
    categoryId: "account",
    summary: "Steps to close your Bolvi Care account and what happens to your data.",
    content: `
## Deleting Your Account

### Before You Delete

Consider these alternatives:
- **Pause your account** - Temporarily inactive
- **Update settings** - Reduce notifications
- **Talk to support** - Resolve issues

### What Happens When You Delete

- Profile removed from platform
- Active bookings cancelled
- Payment methods removed
- Data retained per legal requirements

### Data Retention

After deletion, we retain:
- Transaction records (7 years)
- Tax documents (required by law)
- Safety incident records

We delete immediately:
- Profile information
- Care recipient details
- Message history
- Preferences

### How to Delete

1. Go to Settings > Account
2. Scroll to "Delete Account"
3. Enter your password
4. Confirm deletion
5. Account deleted within 24 hours

### Outstanding Balances

Before deletion:
- Pay any outstanding charges
- Receive any pending refunds
- Earnings transferred (caregivers)

### Rejoining Later

If you want to return:
- Create a new account
- Previous data not recoverable
- Background check may be required again
    `,
    views: 2345,
    helpful: 198,
    lastUpdated: "2025-01-06",
    readTime: 3,
    relatedArticles: ["account-1", "safety-6"],
  },
  {
    id: "account-5",
    slug: "sharing-account-access",
    title: "Sharing account access with family",
    categoryId: "account",
    summary: "How to give other family members access to manage care.",
    content: `
## Family Account Sharing

### Adding Family Members

Share access so others can:
- View bookings
- Book caregivers
- Message caregivers
- Access care reports

### How to Add Someone

1. Go to Settings > Family Access
2. Click "Invite Family Member"
3. Enter their email
4. Choose permission level
5. Send invitation

### Permission Levels

#### Viewer
- See bookings and reports
- View messages
- Cannot make changes

#### Manager
- Everything Viewer can do
- Book caregivers
- Message caregivers
- Manage care recipients

#### Admin
- Full access
- Add/remove family members
- Manage payment methods
- Account settings

### Accepting an Invitation

When invited:
1. Check email for invitation
2. Click the link
3. Create account (if needed)
4. Access shared care

### Removing Access

To remove someone:
1. Go to Settings > Family Access
2. Click on the person
3. Select "Remove Access"
4. Confirm removal

### Activity Log

See who did what:
- Bookings made
- Messages sent
- Settings changed
    `,
    views: 2789,
    helpful: 234,
    lastUpdated: "2025-01-09",
    readTime: 3,
    relatedArticles: ["gs-5", "account-1"],
  },
  {
    id: "account-6",
    slug: "switching-roles",
    title: "Switching between family and caregiver roles",
    categoryId: "account",
    summary: "How to access both family and caregiver dashboards.",
    content: `
## Role Switching

### Having Multiple Roles

You can be both:
- A family member booking care
- A caregiver providing care

### Setting Up Dual Roles

If you're a family member adding caregiver role:
1. Go to Settings > Account Type
2. Click "Become a Caregiver"
3. Complete caregiver application
4. Pass background check

### Switching Between Roles

Once approved for both:
1. Click your profile icon
2. Select "Switch Role"
3. Choose Family or Caregiver
4. Dashboard changes accordingly

### Separate Dashboards

Each role has its own:
- Dashboard view
- Bookings
- Messages
- Settings

### Important Notes

- Same login for both roles
- Separate notification settings
- Cannot book yourself as a caregiver
- Reviews are role-specific
    `,
    views: 1987,
    helpful: 167,
    lastUpdated: "2025-01-07",
    readTime: 2,
    relatedArticles: ["caregivers-1", "account-1"],
  },
];

export const getFAQs = () => [
  {
    question: "How do I cancel or reschedule a booking?",
    answer:
      "You can cancel or reschedule a booking from your dashboard. Go to 'My Bookings', find the visit you want to modify, and click 'Reschedule' or 'Cancel'. Cancellations made 48+ hours in advance are fully refundable. For cancellations within 24 hours, please review our cancellation policy.",
  },
  {
    question: "What happens if my caregiver doesn't show up?",
    answer:
      "In the rare event that a caregiver doesn't arrive, please contact us immediately through the app or call our support line at 1-800-BOLVI-CARE. We'll work to find a replacement caregiver and you'll receive a full refund for the missed visit. Caregivers who miss appointments without notice are subject to account review.",
  },
  {
    question: "How are caregivers vetted?",
    answer:
      "All caregivers undergo a comprehensive vetting process including: FBI and state criminal background checks, professional reference verification, credential authentication, video interviews, and ongoing monitoring. We also verify certifications like CPR/First Aid and relevant licenses.",
  },
  {
    question: "Can I request a specific caregiver?",
    answer:
      "Yes! Once you've found a caregiver you like, you can add them to your 'Care Team' and request them for future bookings. You can also set a primary caregiver who will be given priority for your bookings.",
  },
  {
    question: "What's included in the platform fee?",
    answer:
      "Our platform fee covers: background check maintenance, liability insurance coverage, 24/7 support, secure messaging, payment processing, and our care coordination tools. This fee ensures both families and caregivers have a safe, reliable experience.",
  },
  {
    question: "How do I leave a review for my caregiver?",
    answer:
      "After each visit, you'll receive a prompt to leave a review. You can also go to your booking history and click 'Leave Review' on any completed visit. Reviews help other families and help caregivers improve their services.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Yes, absolutely. We use bank-level encryption and are PCI-DSS compliant. We never store your full card number, and all transactions are processed through secure payment processors. You can also use HSA/FSA cards for eligible care expenses.",
  },
  {
    question: "What types of care do caregivers provide?",
    answer:
      "Our caregivers provide various types of care including companion care, personal care (bathing, dressing), dementia care, medication reminders, meal preparation, light housekeeping, transportation, and specialized care for post-surgery recovery. Each caregiver's profile shows their specialties.",
  },
];

export const getArticlesByCategory = (categoryId: string): HelpArticle[] => {
  return helpArticles.filter((article) => article.categoryId === categoryId);
};

export const getArticleBySlug = (slug: string): HelpArticle | undefined => {
  return helpArticles.find((article) => article.slug === slug);
};

export const getPopularArticles = (limit: number = 5): HelpArticle[] => {
  return [...helpArticles]
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
};

export const searchArticles = (query: string): HelpArticle[] => {
  const lowerQuery = query.toLowerCase();
  return helpArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.summary.toLowerCase().includes(lowerQuery) ||
      article.content.toLowerCase().includes(lowerQuery)
  );
};

export const getRelatedArticles = (articleId: string): HelpArticle[] => {
  const article = helpArticles.find((a) => a.id === articleId);
  if (!article?.relatedArticles) return [];
  return article.relatedArticles
    .map((id) => helpArticles.find((a) => a.id === id))
    .filter((a): a is HelpArticle => a !== undefined);
};
