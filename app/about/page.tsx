"use client";

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Shield,
  Users,
  Target,
  Award,
  MapPin,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Compassion First",
    description:
      "We believe every elder deserves care delivered with empathy, respect, and genuine kindness.",
  },
  {
    icon: Shield,
    title: "Trust & Safety",
    description:
      "Rigorous background checks and verification ensure families can trust the caregivers they welcome into their homes.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We're building a supportive community where caregivers thrive and families find peace of mind.",
  },
  {
    icon: Target,
    title: "Transparency",
    description:
      "Clear pricing, honest reviews, and open communication are the foundation of our platform.",
  },
];

const stats = [
  { value: "10,000+", label: "Families Served" },
  { value: "5,000+", label: "Verified Caregivers" },
  { value: "4.9", label: "Average Rating" },
  { value: "500,000+", label: "Care Hours Delivered" },
];

const team = [
  {
    name: "Loni Radchishina",
    role: "Founder & CEO",
    bio: "ER nurse, first-generation immigrant, and graduate student at Johns Hopkins and UPenn. Building the care system she wished existed.",
    photo: "/founder-loni.jpg",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative bg-primary/5 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                Reimagining Family Support for Modern Life
              </h1>
              <p className="mt-4 text-muted-foreground">
                Bolvi Care was founded with a simple mission: to make finding trusted,
                compassionate support for your loved ones as easy and transparent as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Founder's Story */}
        <section className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Founder&apos;s Story</h2>
                <div className="mt-6 space-y-4 text-muted-foreground">
                  <p>
                    I immigrated from Ukraine as a child and was the first in my family to go to college. I learned
                    early what it means to navigate systems that are difficult to access and how much depends on
                    having the right support at the right time.
                  </p>
                  <p>
                    Before becoming a nurse, I spent two years working in a nursing home. I expected to see medical
                    complexity. What I did not expect was how many problems had nothing to do with medicine. Most were
                    logistical, human, and preventable. People did not need more treatment. They needed someone to
                    check in, help with basic tasks, or simply show up.
                  </p>
                  <p>
                    That pattern became even clearer in the emergency room. I repeatedly saw patients come in not
                    because of true medical emergencies, but because everyday support had failed. A missed ride. No
                    one available to help at home. A family stretched too thin. By the time they reached us, the
                    system was already reacting to a problem that could have been avoided.
                  </p>
                  <p>
                    I was accepted into nursing school at 17, graduated at 19, and have worked in the ER since I
                    was 20. Today, I am completing an MBA at Johns Hopkins Carey and a Master&apos;s in Computer
                    Science at the University of Pennsylvania, while continuing to work clinically in Seattle.
                  </p>
                  <p>
                    I am building Bolvi Care because I have lived the gap from both sides. As a nurse, I have seen
                    the downstream cost of missed support. As a builder, I have the tools to design something better.
                    Bolvi Care exists to make everyday at home support accessible before small problems turn into
                    medical crises.
                  </p>
                  <p>
                    This is not a hypothetical idea for me. It is the system I wish existed for the families I have
                    treated and the one I am committed to building.
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Proudly headquartered in Seattle, WA</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground italic">— Loni Radchishina, Founder & CEO</p>
              </div>
              <div className="relative">
                <Image
                  src="/founder-loni.jpg"
                  alt="Loni Radchishina, Founder of Bolvi Care"
                  width={600}
                  height={400}
                  className="rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-primary py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-4xl font-bold text-primary-foreground">{stat.value}</p>
                  <p className="mt-2 text-primary-foreground/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Our Values</h2>
              <p className="mt-2 text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <Card key={value.title}>
                    <CardContent className="pt-6 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="mt-4 font-semibold text-foreground">{value.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Meet the Founder */}
        <section className="bg-muted/50 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Meet the Founder</h2>
              <p className="mt-2 text-muted-foreground">
                Building the care system that should have existed all along
              </p>
            </div>
            <div className="flex justify-center">
              {team.map((member) => (
                <Card key={member.name} className="max-w-md">
                  <CardContent className="pt-6 text-center">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      width={160}
                      height={160}
                      className="mx-auto rounded-full object-cover"
                    />
                    <h3 className="mt-4 text-xl font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-primary">{member.role}</p>
                    <p className="mt-3 text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Why Families Choose Bolvi Care</h2>
                <div className="mt-8 space-y-4">
                  {[
                    "100% fully vetted and verified caregivers",
                    "Transparent pricing with no hidden fees",
                    "Real reviews from real families",
                    "Flexible scheduling to fit your needs",
                    "24/7 support for emergencies",
                    "Secure payment processing",
                    "Easy booking and communication tools",
                    "Care coordination and visit reports",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                <Card className="max-w-md">
                  <CardContent className="pt-6 text-center">
                    <Award className="h-16 w-16 text-secondary mx-auto" />
                    <h3 className="mt-4 text-2xl font-bold text-foreground">
                      Trusted by Thousands
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Join the families who have found peace of mind with Bolvi Care.
                      Our 4.9-star average rating speaks to the quality of care our
                      caregivers provide.
                    </p>
                    <Button className="mt-6" asChild>
                      <Link href="/caregivers">
                        Find a Caregiver
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-primary-foreground sm:text-3xl">
              Ready to Experience Better Care?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Whether you&apos;re looking for care or you&apos;re a caregiver looking to make a
              difference, we&apos;d love to have you join the Bolvi Care family.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/caregivers">Find a Caregiver</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href="/auth/signup/caregiver">Become a Caregiver</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
