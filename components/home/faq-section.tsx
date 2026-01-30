"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How are caregivers vetted?",
    answer: "All caregivers undergo comprehensive FBI and state criminal background checks, professional reference verification, credential authentication, and in-person interviews. We also verify COVID-19 vaccination status and relevant certifications like CPR and First Aid.",
  },
  {
    question: "What services do caregivers provide?",
    answer: "Our caregivers offer a wide range of services including companionship, personal care assistance, medication reminders, meal preparation, light housekeeping, transportation, dementia care, and post-surgery recovery support. Each caregiver lists their specific services and specialties on their profile.",
  },
  {
    question: "How much does care cost?",
    answer: "Caregiver rates typically range from $25-65 per hour depending on experience, certifications, and services required. Unlike traditional agencies, there are no hidden fees or long-term contracts. You only pay for the care you book, plus a small platform fee that supports our verification and support services.",
  },
  {
    question: "Can I book care for a one-time visit or recurring schedule?",
    answer: "Absolutely! You can book one-time visits for special occasions, regular recurring care (daily, weekly, or monthly), or even last-minute care when you need it. Many families start with a trial visit before committing to a regular schedule.",
  },
  {
    question: "What if I need to cancel or reschedule?",
    answer: "Life happens, and we understand. Cancellations made 24+ hours in advance are fully refundable. Cancellations within 24 hours may be subject to a partial charge to fairly compensate caregivers for reserved time. Rescheduling is always free when done in advance.",
  },
  {
    question: "How do I communicate with my caregiver?",
    answer: "Our secure in-app messaging lets you communicate directly with your caregiver before, during, and after visits. You'll also receive detailed visit summaries including activities completed, notes, and even photos (with your permission) after each care session.",
  },
  {
    question: "Is Bolvi Care available in my area?",
    answer: "We're currently serving the San Francisco Bay Area with plans to expand to Los Angeles, Seattle, and other major metropolitan areas soon. Enter your zip code on our search page to see available caregivers near you.",
  },
];

export function FAQSection() {
  return (
    <section className="py-16 lg:py-24 bg-muted/50">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about finding care with Bolvi Care.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="rounded-lg border border-border bg-card px-6"
            >
              <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
