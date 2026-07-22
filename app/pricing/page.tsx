"use client";

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  HelpCircle,
  DollarSign,
  Clock,
  Shield,
  Star,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const careTypes = [
  {
    title: "Companion Care",
    priceRange: "$25-35",
    description: "Social interaction, light activities, and supervision",
    services: ["Companionship", "Conversation & engagement", "Light housekeeping", "Meal preparation", "Medication reminders", "Transportation"],
  },
  {
    title: "Personal Care",
    priceRange: "$30-45",
    description: "Assistance with daily living activities",
    services: ["All Companion Care services", "Bathing & grooming", "Dressing assistance", "Mobility support", "Toileting assistance", "Feeding assistance"],
    popular: true,
  },
  {
    title: "Specialized Care",
    priceRange: "$40-60",
    description: "For complex medical or cognitive needs",
    services: ["All Personal Care services", "Dementia/Alzheimer's care", "Post-surgery recovery", "Chronic condition management", "Physical therapy support", "Hospice support"],
  },
];

const faqs = [
  { q: "Is there a minimum booking?", a: "Most caregivers have a 2-4 hour minimum per visit to ensure quality care." },
  { q: "How do I pay?", a: "Payments are processed securely through our platform after each visit is completed." },
  { q: "Are there any hidden fees?", a: "No. You only pay the caregiver's hourly rate plus a small service fee (typically 15%)." },
  { q: "Can I get a refund?", a: "Yes, cancellations made 24+ hours in advance are fully refundable." },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Transparent, Affordable Pricing
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
              Straightforward hourly rates for care delivered by Care Partners we
              employ. The rate you see is what you pay—no platform fees or markups.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-3">
              {careTypes.map((type) => (
                <Card
                  key={type.title}
                  className={type.popular ? "border-primary shadow-lg" : ""}
                >
                  {type.popular && (
                    <div className="flex justify-center">
                      <Badge className="absolute -mt-3 bg-primary text-primary-foreground">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle>{type.title}</CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-foreground">{type.priceRange}</span>
                      <span className="text-muted-foreground">/hour</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {type.services.map((service) => (
                        <li key={service} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-accent" />
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="mt-6 w-full" variant={type.popular ? "default" : "outline"} asChild>
                      <Link href="/caregivers">Find Caregivers</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How Pricing Works */}
        <section className="bg-muted/30 py-10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">How Pricing Works</h2>
              <p className="mt-2 text-muted-foreground">Simple and straightforward</p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="mx-auto h-10 w-10 text-primary" />
                  <h3 className="mt-4 font-semibold">Caregiver Rate</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Each caregiver sets their own hourly rate based on experience and services
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="mx-auto h-10 w-10 text-primary" />
                  <h3 className="mt-4 font-semibold">Hours Booked</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You&apos;re charged for the actual hours of care provided
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="mx-auto h-10 w-10 text-primary" />
                  <h3 className="mt-4 font-semibold">No Service Fee</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="mt-2 flex cursor-help items-center justify-center gap-1 text-sm text-muted-foreground">
                          The hourly rate is all you pay
                          <HelpCircle className="h-3 w-3" />
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-sm">
                          Background checks, insurance, and 24/7 support are included—Bolvi Care is the agency, not a marketplace taking a cut
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardContent>
              </Card>
            </div>
            <Card className="mt-8 bg-accent/5 border-accent/20">
              <CardContent className="flex flex-col items-center gap-4 py-6 sm:flex-row sm:justify-between">
                <div className="text-center sm:text-left">
                  <h3 className="font-semibold">Example Calculation</h3>
                  <p className="text-sm text-muted-foreground">
                    4 hours at $30/hour = $120 + $18 service fee = <strong>$138 total</strong>
                  </p>
                </div>
                <Button asChild>
                  <Link href="/caregivers">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-10">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">Pricing FAQs</h2>
            <div className="mt-8 space-y-3">
              {faqs.map((faq) => (
                <Card key={faq.q}>
                  <CardContent className="py-4">
                    <h3 className="font-semibold">{faq.q}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary py-10">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-primary-foreground sm:text-3xl">
              Start Finding Care Today
            </h2>
            <p className="mt-4 text-primary-foreground/80">
              Browse caregivers in your area and see their rates
            </p>
            <Button size="lg" variant="secondary" className="mt-8" asChild>
              <Link href="/caregivers">Browse Caregivers</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
