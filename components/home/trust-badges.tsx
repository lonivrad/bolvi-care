import { Shield, Clock, CreditCard, FileCheck } from "lucide-react";

const badges = [
  {
    icon: Shield,
    title: "100% Fully Vetted",
    description: "Every caregiver is fully vetted before joining",
  },
  {
    icon: FileCheck,
    title: "Verified Credentials",
    description: "All certifications validated and verified",
  },
  {
    icon: Clock,
    title: "Real-Time Updates",
    description: "Visit summaries and check-ins you can trust",
  },
  {
    icon: CreditCard,
    title: "Transparent Pricing",
    description: "No hidden fees or agency markups",
  },
];

export function TrustBadges() {
  return (
    <section className="border-y border-border bg-muted/50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge) => (
            <div key={badge.title} className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <badge.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{badge.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
