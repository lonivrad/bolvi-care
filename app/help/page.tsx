"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  MessageCircle,
  Phone,
  Mail,
  BookOpen,
  CreditCard,
  Calendar,
  Shield,
  Users,
  Settings,
  HelpCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

const categories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    description: "Learn the basics of using Bolvi Care",
    articles: 8,
  },
  {
    id: "bookings",
    title: "Bookings & Scheduling",
    icon: Calendar,
    description: "How to book, reschedule, and manage care visits",
    articles: 12,
  },
  {
    id: "payments",
    title: "Payments & Billing",
    icon: CreditCard,
    description: "Payment methods, invoices, and refunds",
    articles: 10,
  },
  {
    id: "safety",
    title: "Safety & Trust",
    icon: Shield,
    description: "Background checks, insurance, and security",
    articles: 6,
  },
  {
    id: "caregivers",
    title: "For Caregivers",
    icon: Users,
    description: "Caregiver guides and resources",
    articles: 15,
  },
  {
    id: "account",
    title: "Account & Settings",
    icon: Settings,
    description: "Profile, notifications, and preferences",
    articles: 9,
  },
];

const popularArticles = [
  {
    title: "How to book your first caregiver",
    category: "Getting Started",
    views: 12453,
  },
  {
    title: "Understanding our background check process",
    category: "Safety & Trust",
    views: 8921,
  },
  {
    title: "Cancellation and refund policy",
    category: "Payments & Billing",
    views: 7832,
  },
  {
    title: "How to message your caregiver",
    category: "Getting Started",
    views: 6547,
  },
  {
    title: "Setting up recurring care schedules",
    category: "Bookings & Scheduling",
    views: 5892,
  },
];

const faqs = [
  {
    question: "How do I cancel or reschedule a booking?",
    answer:
      "You can cancel or reschedule a booking from your dashboard. Go to 'My Bookings', find the visit you want to modify, and click 'Reschedule' or 'Cancel'. Cancellations made 24+ hours in advance are fully refundable. For cancellations within 24 hours, please review our cancellation policy.",
  },
  {
    question: "What happens if my caregiver doesn't show up?",
    answer:
      "In the rare event that a caregiver doesn't arrive, please contact us immediately through the app or call our support line. We'll work to find a replacement caregiver and you'll receive a full refund for the missed visit. Caregivers who miss appointments without notice are subject to account review.",
  },
  {
    question: "How are caregivers vetted?",
    answer:
      "All caregivers undergo a comprehensive vetting process including: FBI and state criminal background checks, professional reference verification, credential authentication, in-person interviews, and ongoing monitoring. We also verify certifications like CPR/First Aid and relevant licenses.",
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
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground">How can we help?</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Search our help center or browse categories below
        </p>
        <div className="mt-6 max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-lg"
          />
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-12">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Card
              key={category.id}
              className="hover:border-primary/50 transition-colors cursor-pointer"
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {category.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {category.description}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {category.articles} articles
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Popular Articles */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Popular Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularArticles.map((article, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0 cursor-pointer hover:bg-muted/50 -mx-4 px-4 py-2 rounded"
                  >
                    <div>
                      <h4 className="font-medium text-foreground hover:text-primary">
                        {article.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {article.category}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`faq-${index}`}
                    className="border border-border rounded-lg px-4"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Contact Options */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Need more help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                <MessageCircle className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Live Chat</p>
                  <p className="text-xs text-muted-foreground">
                    Available 24/7
                  </p>
                </div>
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Phone className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Call Us</p>
                  <p className="text-xs text-muted-foreground">
                    1-800-BOLVI-CARE
                  </p>
                </div>
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Mail className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Email Support</p>
                  <p className="text-xs text-muted-foreground">
                    support@bolvicare.com
                  </p>
                </div>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If you or your loved one is experiencing a medical emergency,
                please call 911 immediately.
              </p>
              <Button variant="destructive" className="w-full">
                <Phone className="mr-2 h-4 w-4" />
                Call 911
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  "Terms of Service",
                  "Privacy Policy",
                  "Community Guidelines",
                  "Accessibility",
                ].map((link) => (
                  <Button
                    key={link}
                    variant="ghost"
                    className="w-full justify-between"
                  >
                    {link}
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
