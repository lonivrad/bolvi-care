"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  HelpCircle,
  Users,
  Shield,
} from "lucide-react";

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Talk to our team directly",
      value: "1-800-BOLVI-CARE",
      action: "tel:1-800-265-8422",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      value: "support@bolvicare.com",
      action: "mailto:support@bolvicare.com",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with us in real-time",
      value: "Available 24/7",
      action: "#chat",
    },
  ];

  const quickLinks = [
    {
      icon: HelpCircle,
      title: "Help Center",
      description: "Browse FAQs and guides",
      href: "/help",
    },
    {
      icon: Users,
      title: "Community",
      description: "Join discussions and events",
      href: "/community",
    },
    {
      icon: Shield,
      title: "Safety Center",
      description: "Learn about our safety measures",
      href: "/safety",
    },
  ];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground">Get in Touch</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about Bolvi Care? We're here to help. Reach out to our team
            and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            return (
              <Card key={method.title} className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
                  <a
                    href={method.action}
                    className="text-primary font-medium mt-2 inline-block hover:underline"
                  >
                    {method.value}
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="John Smith"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="(206) 555-0123"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) =>
                          setFormData({ ...formData, subject: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="booking">Booking Help</SelectItem>
                          <SelectItem value="caregiver">Become a Caregiver</SelectItem>
                          <SelectItem value="billing">Billing Question</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="How can we help you?"
                      rows={6}
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Office Location */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Our Office</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Bolvi Care HQ</p>
                    <p className="text-sm text-muted-foreground">
                      123 Care Street<br />
                      Seattle, WA 98101
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Business Hours</p>
                    <p className="text-sm text-muted-foreground">
                      Monday - Friday: 8am - 6pm PST<br />
                      Saturday: 9am - 3pm PST<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.title}
                      href={link.href}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Icon className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{link.title}</p>
                        <p className="text-xs text-muted-foreground">{link.description}</p>
                      </div>
                    </a>
                  );
                })}
              </CardContent>
            </Card>

            {/* Emergency */}
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-destructive mb-2">Emergency?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  If you or your loved one is experiencing a medical emergency,
                  please call 911 immediately.
                </p>
                <Button variant="destructive" className="w-full" asChild>
                  <a href="tel:911">
                    <Phone className="mr-2 h-4 w-4" />
                    Call 911
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
