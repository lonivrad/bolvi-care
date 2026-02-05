"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format, addMonths } from "date-fns";
import { Search, MapPin, Calendar as CalendarIcon, ArrowRight, Shield, Star, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCaregiversStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const router = useRouter();
  const { toast } = useToast();
  const { setFilters } = useCaregiversStore();
  const [zipCode, setZipCode] = useState("");
  const [careDate, setCareDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that zip code is filled
    if (!zipCode.trim()) {
      toast({
        title: "Please enter your zip code",
        description: "We need your location to find caregivers near you",
        variant: "error",
      });
      return;
    }

    // Validate that date is selected
    if (!careDate) {
      toast({
        title: "Please select a date",
        description: "Choose when you need care to find available caregivers",
        variant: "error",
      });
      return;
    }

    // Set location filter based on zip code input
    setFilters({ location: zipCode });
    router.push("/caregivers");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left column - Content */}
          <div className="flex flex-col justify-center">
            <h1 className="font-serif text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
              Trusted Care for Your Loved Ones, <span className="text-primary">On Your Terms</span>
            </h1>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
              Connect with verified, independent caregivers for flexible, compassionate support—without the agency markups.
            </p>

            {/* Search box */}
            <form onSubmit={handleSearch} className="mt-6 rounded-xl border border-border bg-card p-3 shadow-lg sm:p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Your zip code"
                    className="h-11 pl-9"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    aria-label="Enter your zip code or city"
                  />
                </div>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      type="button"
                      className={cn(
                        "h-11 flex-1 justify-start text-left font-normal",
                        !careDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {careDate ? format(careDate, "MMM d, yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={careDate}
                      onSelect={(date) => {
                        setCareDate(date);
                        setCalendarOpen(false);
                      }}
                      disabled={(date) => {
                        const today = new Date(new Date().setHours(0, 0, 0, 0));
                        const sixMonthsFromNow = addMonths(today, 6);
                        return date < today || date > sixMonthsFromNow;
                      }}
                      startMonth={new Date()}
                      endMonth={addMonths(new Date(), 6)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Button type="submit" className="h-11 gap-2 px-5">
                  <Search className="h-4 w-4" />
                  <span>Find Care</span>
                </Button>
              </div>
            </form>

            {/* Trust metrics bar - consolidated */}
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground sm:gap-6">
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-primary" />
                <span><strong className="text-foreground">500+</strong> verified caregivers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-amber-500" />
                <span><strong className="text-foreground">4.9</strong> avg rating</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                <span><strong className="text-foreground">25k+</strong> care hours</span>
              </div>
            </div>

            {/* Secondary CTAs */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="outline" size="sm" className="gap-1.5" asChild>
                <Link href="/how-it-works">
                  How It Works
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/signup/caregiver">
                  Become a Caregiver
                </Link>
              </Button>
            </div>
          </div>

          {/* Right column - Single welcoming image */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=600&fit=crop"
                alt="Caregiver sharing a warm moment with elderly client"
                className="h-full w-full object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 z-10 rounded-xl border border-border bg-card p-3 shadow-lg">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <Shield className="h-4.5 w-4.5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Background Verified</p>
                  <p className="text-xs text-muted-foreground">All caregivers screened</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
