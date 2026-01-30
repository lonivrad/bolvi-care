"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Shield, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/store";
import { CaregiverCard } from "@/components/caregivers/caregiver-card";
import { caregivers } from "@/lib/mock-data";

// Limited preview data for non-authenticated users
const previewCaregivers = [
  {
    id: "preview-1",
    name: "Maria R.",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    rating: 4.9,
    reviewCount: 127,
    specialties: ["Dementia Care", "Medication Management"],
    yearsExperience: 8,
  },
  {
    id: "preview-2",
    name: "David K.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    rating: 4.8,
    reviewCount: 89,
    specialties: ["Physical Therapy", "Mobility Assistance"],
    yearsExperience: 5,
  },
  {
    id: "preview-3",
    name: "Sarah T.",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    rating: 4.9,
    reviewCount: 156,
    specialties: ["Companionship", "Meal Preparation"],
    yearsExperience: 6,
  },
];

export function FeaturedCaregivers() {
  const { role, familyUser } = useAuthStore();
  const isAuthenticated = !!role;
  const featuredCaregivers = caregivers.filter(cg => cg.isFeatured).slice(0, 3);

  // For authenticated users, show full caregiver cards
  if (isAuthenticated) {
    return (
      <section className="bg-muted/30 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
                Top-Rated Caregivers
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">
                Meet some of our highest-rated caregivers who consistently deliver exceptional care.
              </p>
            </div>
            <Button variant="outline" className="gap-2" asChild>
              <Link href="/caregivers">
                View All Caregivers
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredCaregivers.map((caregiver) => (
              <CaregiverCard
                key={caregiver.id}
                caregiver={caregiver}
                isFavorite={familyUser?.favoriteCaregiversIds.includes(caregiver.id)}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // For non-authenticated users, show a teaser preview
  return (
    <section className="bg-muted/30 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
            Meet Our Verified Caregivers
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground text-pretty">
            Join Bolvi Care to connect with our community of background-checked,
            highly-rated caregivers in your area.
          </p>
        </div>

        {/* Preview cards with blurred details */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {previewCaregivers.map((caregiver) => (
            <Card key={caregiver.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Image
                      src={caregiver.photo}
                      alt={caregiver.name}
                      width={64}
                      height={64}
                      className="rounded-full object-cover ring-2 ring-border"
                    />
                    <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{caregiver.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium">{caregiver.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({caregiver.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {caregiver.specialties.slice(0, 2).map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>{caregiver.yearsExperience}+ years experience</span>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>

                {/* Blurred placeholder for pricing/booking */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="blur-sm select-none">
                      <span className="text-lg font-bold text-primary">$XX</span>
                      <span className="text-sm text-muted-foreground">/hr</span>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Sign in to view
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA to sign up */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold text-foreground">500+ Verified Caregivers</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Ready to Find Your Perfect Caregiver?
              </h3>
              <p className="text-muted-foreground mb-6">
                Create a free account to browse profiles, read reviews, message caregivers, and book care.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" asChild>
                  <Link href="/auth/signup/family">
                    Sign Up Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/how-it-works">
                    Learn More
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
