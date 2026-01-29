import { Shield, BadgeCheck, FileCheck, Fingerprint, Stethoscope, Clock } from "lucide-react";

const trustFeatures = [
  {
    icon: Fingerprint,
    title: "Background Checked",
    description: "FBI + state criminal background checks on every caregiver",
  },
  {
    icon: BadgeCheck,
    title: "Verified Credentials",
    description: "Certifications and references verified by our team",
  },
  {
    icon: Stethoscope,
    title: "Health Screened",
    description: "COVID-19 vaccination status and health protocols verified",
  },
  {
    icon: FileCheck,
    title: "Insured & Bonded",
    description: "Liability coverage for peace of mind",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Book one-time, recurring, or last-minute care",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Safe, transparent billing with no hidden fees",
  },
];

export function TrustIndicators() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
            Your Safety is Our Priority
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every caregiver goes through our rigorous verification process before joining our platform.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trustFeatures.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/50"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
