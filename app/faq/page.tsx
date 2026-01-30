"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
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
  HelpCircle,
  Shield,
  CreditCard,
  Calendar,
  Users,
  Heart,
  MessageSquare,
  Phone,
  Mail,
  ChevronRight,
  Star,
  Clock,
  CheckCircle,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const categories = [
  { id: "getting-started", name: "Getting Started", icon: HelpCircle, color: "bg-blue-500" },
  { id: "booking", name: "Booking & Scheduling", icon: Calendar, color: "bg-green-500" },
  { id: "payments", name: "Payments & Billing", icon: CreditCard, color: "bg-purple-500" },
  { id: "safety", name: "Safety & Trust", icon: Shield, color: "bg-red-500" },
  { id: "caregivers", name: "For Caregivers", icon: Heart, color: "bg-pink-500" },
  { id: "families", name: "For Families", icon: Users, color: "bg-amber-500" },
];

const faqs: FAQItem[] = [
  // Getting Started
  {
    question: "How do I create an account on Bolvi Care?",
    answer: "Creating an account is simple! Click the 'Sign Up' button on our homepage and choose whether you're registering as a family seeking care or as a caregiver. You'll need to provide your email address, create a secure password, and complete your profile with basic information. The entire process takes about 5 minutes.",
    category: "getting-started",
  },
  {
    question: "What information do I need to complete my profile?",
    answer: "For families: You'll need to provide details about care needs, preferred schedule, location, and any specific requirements. For caregivers: You'll need to submit your qualifications, certifications, experience, availability, and undergo our verification process including background checks.",
    category: "getting-started",
  },
  {
    question: "Is Bolvi Care available in my area?",
    answer: "Bolvi Care is currently available in major metropolitan areas across California, including San Francisco, Los Angeles, San Diego, and Sacramento. We're rapidly expanding to new regions. Enter your zip code on our homepage to check availability in your area.",
    category: "getting-started",
  },
  {
    question: "What devices can I use to access Bolvi Care?",
    answer: "You can access Bolvi Care through any modern web browser on your computer, tablet, or smartphone. We also offer iOS and Android mobile apps for convenient on-the-go access to manage bookings, messages, and more.",
    category: "getting-started",
  },

  // Booking & Scheduling
  {
    question: "How do I book a caregiver?",
    answer: "Browse our caregiver profiles, filter by specialties, availability, and location. Once you find a good match, click 'Book Now' and select your preferred dates and times. You can also message caregivers directly to discuss specific needs before booking.",
    category: "booking",
  },
  {
    question: "Can I book recurring care sessions?",
    answer: "Yes! When booking, you can select 'Recurring' to set up regular care sessions on a weekly or custom schedule. This ensures consistency for your loved one and guarantees your preferred caregiver's availability.",
    category: "booking",
  },
  {
    question: "What is the cancellation policy?",
    answer: "You can cancel a booking up to 24 hours in advance for a full refund. Cancellations within 24 hours may be subject to a 50% cancellation fee. Emergency cancellations are reviewed on a case-by-case basis. Caregivers are also expected to provide at least 24 hours notice for cancellations.",
    category: "booking",
  },
  {
    question: "What happens if my caregiver cancels?",
    answer: "If a caregiver cancels, you'll be immediately notified and offered a full refund or the option to book with another available caregiver. We maintain a network of backup caregivers to help find last-minute replacements when possible.",
    category: "booking",
  },
  {
    question: "Can I request a specific caregiver?",
    answer: "Absolutely! If you've had a great experience with a caregiver, you can add them to your 'Care Team' and request them for future bookings. You can also set them as your preferred caregiver for recurring appointments.",
    category: "booking",
  },

  // Payments & Billing
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), debit cards, and digital wallets including Apple Pay and Google Pay. All payments are processed securely through Stripe.",
    category: "payments",
  },
  {
    question: "How does billing work?",
    answer: "You're only charged after a care session is completed. The total amount includes the caregiver's hourly rate, any applicable service fees, and taxes. You'll receive a detailed receipt via email after each session.",
    category: "payments",
  },
  {
    question: "Are there any hidden fees?",
    answer: "No hidden fees! Our pricing is transparent. You'll see the full cost breakdown before confirming any booking, including the caregiver's rate, platform service fee (15%), and any applicable taxes.",
    category: "payments",
  },
  {
    question: "Can I tip my caregiver?",
    answer: "Yes, tipping is optional but appreciated. After a care session is completed, you'll have the option to add a tip when leaving your review. 100% of tips go directly to the caregiver.",
    category: "payments",
  },
  {
    question: "Do you accept insurance or long-term care benefits?",
    answer: "While we don't directly bill insurance, many long-term care insurance policies and Health Savings Accounts (HSAs) may reimburse for our services. We provide detailed receipts that can be submitted for reimbursement.",
    category: "payments",
  },

  // Safety & Trust
  {
    question: "How are caregivers verified?",
    answer: "All caregivers undergo a comprehensive 5-step verification process: identity verification, nationwide criminal background check, sex offender registry check, professional reference verification, and credential/certification validation. Only caregivers who pass all checks are approved.",
    category: "safety",
  },
  {
    question: "Are caregivers insured?",
    answer: "Yes, all bookings made through Bolvi Care are covered by our comprehensive liability insurance policy. This provides protection for both families and caregivers during care sessions.",
    category: "safety",
  },
  {
    question: "How do I report a safety concern?",
    answer: "Your safety is our top priority. You can report concerns through the app's 'Report' button, by emailing safety@bolvicare.com, or calling our 24/7 support line. All reports are reviewed within 24 hours by our dedicated safety team.",
    category: "safety",
  },
  {
    question: "What safety features does Bolvi Care offer?",
    answer: "We offer real-time GPS tracking during visits (with consent), secure in-app messaging, visit check-ins, emergency contact integration, and 24/7 support. Caregivers also complete regular safety training.",
    category: "safety",
  },

  // For Caregivers
  {
    question: "How do I become a caregiver on Bolvi Care?",
    answer: "Apply through our website by creating a caregiver profile, submitting your certifications and experience, and completing our verification process. Once approved, you can set your rates, availability, and start accepting bookings.",
    category: "caregivers",
  },
  {
    question: "How and when do I get paid?",
    answer: "Caregivers are paid weekly via direct deposit or Stripe. Earnings from completed sessions are typically deposited within 2-3 business days of your payout request. You can also request instant payouts for a small fee.",
    category: "caregivers",
  },
  {
    question: "Can I set my own rates and schedule?",
    answer: "Yes! You have full control over your hourly rate and availability. You can block off dates, set recurring availability, and adjust rates for different service types. Our platform suggests competitive rates based on your experience and location.",
    category: "caregivers",
  },
  {
    question: "What certifications do I need?",
    answer: "Requirements vary by service type. Basic companionship care requires no certifications. Personal care assistance requires a CNA or HHA certification. Specialized care (dementia, medical support) requires additional relevant certifications.",
    category: "caregivers",
  },
  {
    question: "How do taxes work for caregivers?",
    answer: "As an independent contractor, you're responsible for your own taxes. We provide 1099 forms for your annual earnings and offer a Tax Center in your dashboard with tools and resources to help manage your tax obligations.",
    category: "caregivers",
  },

  // For Families
  {
    question: "How do I find the right caregiver for my needs?",
    answer: "Use our search filters to narrow down caregivers by specialty (e.g., dementia care, mobility assistance), availability, location, rating, and price range. Read reviews from other families, view detailed profiles, and message caregivers directly to discuss your needs.",
    category: "families",
  },
  {
    question: "Can I meet a caregiver before booking?",
    answer: "Yes! We encourage meet-and-greets before committing to regular care. You can schedule a short paid trial session or arrange a video call through our messaging system to get to know potential caregivers.",
    category: "families",
  },
  {
    question: "What if I'm not satisfied with a caregiver?",
    answer: "Your satisfaction is important to us. If you're not happy with a caregiver, you can leave feedback, request a different caregiver, or contact our support team for assistance. We offer a satisfaction guarantee on first bookings.",
    category: "families",
  },
  {
    question: "Can multiple family members access our account?",
    answer: "Yes! You can add family members to your account so everyone can view bookings, communicate with caregivers, and receive updates about your loved one's care. Each family member gets their own login credentials.",
    category: "families",
  },
  {
    question: "Do you offer care for children or only seniors?",
    answer: "While our primary focus is senior care, we also connect families with qualified caregivers for adults with disabilities or special needs. For childcare, we recommend specialized childcare platforms.",
    category: "families",
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedFAQs = selectedCategory
    ? { [selectedCategory]: filteredFAQs }
    : filteredFAQs.reduce((acc, faq) => {
        if (!acc[faq.category]) {
          acc[faq.category] = [];
        }
        acc[faq.category].push(faq);
        return acc;
      }, {} as Record<string, FAQItem[]>);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <Badge className="mb-4">Help Center</Badge>
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Find answers to common questions about Bolvi Care
            </p>
            <div className="mt-8 relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
              >
                All Topics
              </Button>
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-4">
            {Object.keys(groupedFAQs).length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No results found</h3>
                <p className="text-muted-foreground">
                  Try a different search term or browse by category
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedFAQs).map(([categoryId, categoryFaqs]) => {
                  const category = categories.find((c) => c.id === categoryId);
                  const Icon = category?.icon || HelpCircle;
                  return (
                    <div key={categoryId}>
                      {!selectedCategory && (
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`rounded-lg p-2 ${category?.color || "bg-primary"}`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <h2 className="text-xl font-semibold">
                            {category?.name || categoryId}
                          </h2>
                        </div>
                      )}
                      <Accordion type="single" collapsible className="space-y-3">
                        {categoryFaqs.map((faq, index) => (
                          <AccordionItem
                            key={index}
                            value={`${categoryId}-${index}`}
                            className="border rounded-lg px-4 bg-card"
                          >
                            <AccordionTrigger className="hover:no-underline text-left py-4">
                              <span className="font-medium">{faq.question}</span>
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground pb-4">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Still Need Help */}
        <section className="py-16 bg-muted/50">
          <div className="mx-auto max-w-4xl px-4">
            <Card>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold">Still have questions?</h2>
                  <p className="text-muted-foreground mt-2">
                    Our support team is here to help you
                  </p>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="text-center p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Live Chat</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Chat with our support team in real-time
                    </p>
                    <Button variant="outline" className="w-full">
                      Start Chat
                    </Button>
                  </div>
                  <div className="text-center p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Email Support</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get a response within 24 hours
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="mailto:support@bolvicare.com">Send Email</a>
                    </Button>
                  </div>
                  <div className="text-center p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Phone Support</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Available Mon-Fri 8am-8pm
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="tel:1-800-265-8422">1-800-BOLVI-CARE</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Related Links */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-xl font-bold mb-6 text-center">Related Resources</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Link href="/help">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <HelpCircle className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-semibold mb-2">Help Center</h3>
                    <p className="text-sm text-muted-foreground">
                      Browse detailed guides and tutorials
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/safety">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <Shield className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-semibold mb-2">Safety Center</h3>
                    <p className="text-sm text-muted-foreground">
                      Learn about our safety measures
                    </p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/community">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <Users className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-semibold mb-2">Community</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect with other families and caregivers
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
