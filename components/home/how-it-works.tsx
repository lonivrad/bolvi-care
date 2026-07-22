import { Search, UserCheck, Calendar, Heart } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Search & Browse",
    description: "Enter your location and care needs to discover verified caregivers in your area. Filter by specialty, availability, ratings, and more.",
  },
  {
    icon: UserCheck,
    number: "02",
    title: "Review Profiles",
    description: "Read detailed profiles, reviews from other families, and view certifications. Message caregivers directly to ask questions.",
  },
  {
    icon: Calendar,
    number: "03",
    title: "Book & Schedule",
    description: "Book instantly or request specific times. Set up recurring visits for consistent care. All payments are secure and transparent.",
  },
  {
    icon: Heart,
    number: "04",
    title: "Receive Quality Care",
    description: "Get real-time updates during visits, detailed summaries after, and build lasting relationships with trusted caregivers.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
            Finding Quality Care Made Simple
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">
            From search to care in four easy steps. We&apos;ve simplified the process so you can focus on what matters most.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-gradient-to-r from-primary/50 to-primary/20 lg:block" />
              )}
              
              <div className="relative flex flex-col items-center text-center">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10">
                  <step.icon className="h-10 w-10 text-primary" />
                  <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-3 text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
