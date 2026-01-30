"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, MapPin, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCaregiversStore } from "@/lib/store";

export function HeroSection() {
  const router = useRouter();
  const { setFilters } = useCaregiversStore();
  const [zipCode, setZipCode] = useState("");
  const [careDate, setCareDate] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Set location filter based on zip code input
    if (zipCode) {
      setFilters({ location: zipCode });
    }
    router.push("/caregivers");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column - Content */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Trusted by 10,000+ families
            </div>

            <h1 className="mt-6 font-serif text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              Trusted Care for Your Loved Ones, <span className="text-primary">On Your Terms</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
              Connect with verified, independent caregivers for flexible, compassionate support—without the agency markups.
              Real-time updates, transparent pricing, and peace of mind.
            </p>

            {/* Search box */}
            <form onSubmit={handleSearch} className="mt-8 rounded-2xl border border-border bg-card p-4 shadow-lg">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter your zip code"
                    className="h-12 pl-10"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    aria-label="Enter your zip code or city"
                  />
                </div>
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="When do you need care?"
                    className="h-12 pl-10"
                    value={careDate}
                    onChange={(e) => setCareDate(e.target.value)}
                    aria-label="When do you need care"
                  />
                </div>
                <Button type="submit" size="lg" className="h-12 gap-2 px-6">
                  <Search className="h-5 w-5" />
                  <span>Find Care</span>
                </Button>
              </div>
              <p className="mt-3 text-center text-sm text-muted-foreground">
                500+ verified caregivers available in your area
              </p>
            </form>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <Link href="/how-it-works">
                  Learn How It Works
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" className="gap-2" asChild>
                <Link href="/auth/signup/caregiver">
                  Become a Caregiver
                </Link>
              </Button>
            </div>
          </div>

          {/* Right column - Image collage */}
          <div className="relative hidden lg:block">
            <div className="absolute -right-4 top-4 z-10 rounded-xl border border-border bg-card p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                  <svg className="h-5 w-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Background Verified</p>
                  <p className="text-xs text-muted-foreground">All caregivers are screened</p>
                </div>
              </div>
            </div>

            <div className="absolute -left-4 bottom-20 z-10 rounded-xl border border-border bg-card p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop" alt="" className="h-8 w-8 rounded-full border-2 border-card" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop" alt="" className="h-8 w-8 rounded-full border-2 border-card" />
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop" alt="" className="h-8 w-8 rounded-full border-2 border-card" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="h-4 w-4 fill-secondary text-secondary" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">4.9 average rating</p>
                </div>
              </div>
            </div>

            {/* Main image grid */}
            <div className="grid gap-4">
              <div className="flex gap-4">
                <div className="aspect-[4/3] w-1/2 overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=400&h=300&fit=crop"
                    alt="Caregiver with elderly person"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="aspect-[4/3] w-1/2 overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1516307365426-bea591f05011?w=400&h=300&fit=crop"
                    alt="Happy senior couple"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="aspect-[16/9] overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=450&fit=crop"
                  alt="Caregiver helping senior"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
