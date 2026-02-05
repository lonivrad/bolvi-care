"use client";

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Zap,
  Shield,
  ArrowRight,
  Briefcase,
  Code,
  Headphones,
  TrendingUp,
  Coffee,
  Plane,
  GraduationCap,
  HeartHandshake,
} from "lucide-react";

const openPositions = [
  {
    id: "1",
    title: "Senior Full Stack Engineer",
    department: "Engineering",
    location: "Seattle, WA (Hybrid)",
    type: "Full-time",
    salary: "$150K - $200K",
    description: "Build and scale our platform serving thousands of families and caregivers.",
    tags: ["React", "Node.js", "PostgreSQL", "AWS"],
  },
  {
    id: "2",
    title: "Product Designer",
    department: "Design",
    location: "Remote (US)",
    type: "Full-time",
    salary: "$120K - $160K",
    description: "Design intuitive experiences that make caregiving coordination effortless.",
    tags: ["Figma", "User Research", "Design Systems"],
  },
  {
    id: "3",
    title: "Customer Success Manager",
    department: "Operations",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$80K - $110K",
    description: "Help families and caregivers succeed on our platform.",
    tags: ["Customer Support", "Account Management", "Healthcare"],
  },
  {
    id: "4",
    title: "Marketing Manager",
    department: "Marketing",
    location: "Remote (US)",
    type: "Full-time",
    salary: "$100K - $140K",
    description: "Drive growth and awareness for our caregiving marketplace.",
    tags: ["Digital Marketing", "Content Strategy", "Analytics"],
  },
  {
    id: "5",
    title: "Trust & Safety Specialist",
    department: "Operations",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$70K - $95K",
    description: "Ensure the safety and integrity of our caregiving community.",
    tags: ["Background Checks", "Fraud Prevention", "Policy"],
  },
  {
    id: "6",
    title: "Data Analyst",
    department: "Engineering",
    location: "Remote (US)",
    type: "Full-time",
    salary: "$95K - $130K",
    description: "Turn data into insights that improve matching and outcomes.",
    tags: ["SQL", "Python", "Tableau", "A/B Testing"],
  },
];

const benefits = [
  {
    icon: DollarSign,
    title: "Competitive Salary",
    description: "Top-tier compensation packages with equity options",
  },
  {
    icon: Shield,
    title: "Health Benefits",
    description: "Comprehensive medical, dental, and vision coverage",
  },
  {
    icon: Plane,
    title: "Unlimited PTO",
    description: "Take the time you need to recharge",
  },
  {
    icon: Coffee,
    title: "Remote Friendly",
    description: "Work from anywhere with flexible schedules",
  },
  {
    icon: GraduationCap,
    title: "Learning Budget",
    description: "$2,000 annual stipend for professional development",
  },
  {
    icon: HeartHandshake,
    title: "Parental Leave",
    description: "16 weeks paid leave for all new parents",
  },
];

const values = [
  {
    icon: Heart,
    title: "Care First",
    description: "We put the wellbeing of families and caregivers at the center of everything we do.",
  },
  {
    icon: Shield,
    title: "Trust & Safety",
    description: "We maintain the highest standards for security, privacy, and background verification.",
  },
  {
    icon: Users,
    title: "Community",
    description: "We build meaningful connections between families and caregivers.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "We continuously improve our platform to make caregiving coordination easier.",
  },
];

const departmentIcons: Record<string, React.ElementType> = {
  Engineering: Code,
  Design: Zap,
  Operations: Headphones,
  Marketing: TrendingUp,
};

export default function CareersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-12">
          <div className="absolute inset-0 -z-10">
            <div className="absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-[250px] w-[250px] rounded-full bg-secondary/5 blur-3xl" />
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-3">
              We&apos;re Hiring
            </Badge>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Join Our Mission to Transform Care
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Help us build the future of caregiving. We&apos;re looking for passionate people
              who want to make a meaningful impact on families and caregivers everywhere.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="#positions">
                  View Open Positions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">Learn About Us</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-10 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                Our Values
              </h2>
              <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                These principles guide everything we do at Bolvi Care.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <Card key={value.title} className="text-center">
                    <CardContent className="p-6">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                Why Join Bolvi Care?
              </h2>
              <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                We offer competitive benefits and a supportive environment to help you thrive.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="flex items-start gap-4 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="positions" className="py-10 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                Open Positions
              </h2>
              <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                Find your next role and help us transform the caregiving industry.
              </p>
            </div>
            <div className="grid gap-4">
              {openPositions.map((position) => {
                const DeptIcon = departmentIcons[position.department] || Briefcase;
                return (
                  <Card key={position.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                              <DeptIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{position.title}</h3>
                              <p className="text-sm text-muted-foreground">{position.department}</p>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-3">{position.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {position.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {position.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {position.type}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {position.salary}
                            </span>
                          </div>
                        </div>
                        <Button className="shrink-0">
                          Apply Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
              <CardContent className="p-8 sm:p-12 text-center">
                <h2 className="font-serif text-3xl font-bold sm:text-4xl mb-4">
                  Don&apos;t See Your Role?
                </h2>
                <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
                  We&apos;re always looking for talented people who share our mission.
                  Send us your resume and let us know how you&apos;d like to contribute.
                </p>
                <Button size="lg" variant="secondary">
                  Send Us Your Resume
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
