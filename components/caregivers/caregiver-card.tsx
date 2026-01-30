"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, Clock, MapPin, CheckCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Caregiver } from "@/lib/mock-data";

interface CaregiverCardProps {
  caregiver: Caregiver;
  variant?: "grid" | "list" | "featured";
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

const badgeIcons: Record<string, string> = {
  "Background Check": "shield",
  "Top Rated": "star",
  "CPR Certified": "heart",
  "COVID Vaccinated": "check",
  "Responsive": "zap",
  "Rising Star": "trending",
  "Consistent": "check-circle",
};

export function CaregiverCard({ caregiver, variant = "grid", onFavorite, isFavorite }: CaregiverCardProps) {
  const displayedBadges = caregiver.badges.slice(0, 3);
  const displayedSpecialties = caregiver.specialties.slice(0, 3);

  if (variant === "featured") {
    return (
      <Card className="group relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent transition-all duration-200 hover:border-primary/40 hover:shadow-lg">
        <div className="absolute right-3 top-3 z-10">
          <Badge className="bg-primary text-primary-foreground">Featured</Badge>
        </div>
        <CardContent className="p-6">
          <div className="flex gap-6">
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={caregiver.photo}
                alt={caregiver.name}
                fill
                className="object-cover"
              />
              {caregiver.availability === 'available' && (
                <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-accent-foreground" />
                  Available
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{caregiver.name}</h3>
                  <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-secondary text-secondary" />
                      {caregiver.rating} ({caregiver.reviewCount})
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {caregiver.distance}mi
                    </span>
                    <span>{caregiver.yearsExperience} years exp.</span>
                  </div>
                </div>
                <button
                  onClick={() => onFavorite?.(caregiver.id)}
                  className="rounded-full p-2 transition-colors hover:bg-muted"
                >
                  <Heart className={cn("h-5 w-5", isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground")} />
                </button>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{caregiver.bio}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {displayedBadges.map((badge) => (
                  <Badge key={badge} variant="secondary" className="text-xs">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    {badge}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-foreground">${caregiver.hourlyRate}</span>
                  <span className="text-muted-foreground">/hr</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <Link href={`/caregivers/${caregiver.id}`}>View Profile</Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/book/${caregiver.id}`}>
                      {caregiver.instantBook && <Zap className="mr-1 h-4 w-4" />}
                      Book Now
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "list") {
    return (
      <Card className="group transition-all duration-200 hover:shadow-md">
        <CardContent className="flex gap-4 p-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={caregiver.photo}
              alt={caregiver.name}
              fill
              className="object-cover"
            />
            {caregiver.availability === 'available' && (
              <div className="absolute bottom-1 left-1 h-3 w-3 animate-pulse rounded-full border-2 border-card bg-accent" />
            )}
          </div>
          <div className="flex flex-1 items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{caregiver.name}</h3>
                {caregiver.isNew && <Badge variant="secondary" className="text-xs">New</Badge>}
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                {caregiver.rating} ({caregiver.reviewCount})
                <span className="text-border">•</span>
                <MapPin className="h-3 w-3" />
                {caregiver.distance}mi
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {displayedSpecialties.map((spec) => (
                  <Badge key={spec} variant="outline" className="text-xs">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xl font-bold text-foreground">${caregiver.hourlyRate}</div>
                <div className="text-xs text-muted-foreground">per hour</div>
              </div>
              <Button asChild size="sm">
                <Link href={`/book/${caregiver.id}`}>Book</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default grid variant
  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={caregiver.photo}
          alt={caregiver.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Top badges */}
        <div className="absolute left-3 top-3 flex gap-1">
          {caregiver.isFeatured && (
            <Badge className="bg-primary text-primary-foreground">Featured</Badge>
          )}
          {caregiver.isNew && (
            <Badge className="bg-accent text-accent-foreground">New</Badge>
          )}
          {caregiver.instantBook && (
            <Badge variant="secondary" className="gap-1">
              <Zap className="h-3 w-3" />
              Instant
            </Badge>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={() => onFavorite?.(caregiver.id)}
          className="absolute right-3 top-3 rounded-full bg-card/80 p-2 backdrop-blur-sm transition-colors hover:bg-card"
        >
          <Heart className={cn("h-5 w-5", isFavorite ? "fill-destructive text-destructive" : "text-foreground")} />
        </button>

        {/* Availability indicator */}
        {caregiver.availability === 'available' && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent-foreground" />
            Available Now
          </div>
        )}

        {/* Price tag */}
        <div className="absolute bottom-3 right-3 rounded-lg bg-card/90 px-2.5 py-1 backdrop-blur-sm">
          <span className="font-bold text-foreground">${caregiver.hourlyRate}</span>
          <span className="text-xs text-muted-foreground">/hr</span>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-foreground">{caregiver.name}</h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-secondary text-secondary" />
              <span>{caregiver.rating}</span>
              <span className="text-muted-foreground/50">({caregiver.reviewCount})</span>
              <span className="text-border">•</span>
              <span>{caregiver.yearsExperience}y exp</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{caregiver.location}</span>
          {caregiver.distance && <span className="text-muted-foreground/50">• {caregiver.distance}mi</span>}
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {displayedSpecialties.map((spec) => (
            <Badge key={spec} variant="outline" className="text-xs">
              {spec}
            </Badge>
          ))}
          {caregiver.specialties.length > 3 && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              +{caregiver.specialties.length - 3}
            </Badge>
          )}
        </div>

        <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{caregiver.responseTime}</span>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" className="flex-1" asChild>
            <Link href={`/caregivers/${caregiver.id}`}>Profile</Link>
          </Button>
          <Button className="flex-1" asChild>
            <Link href={`/book/${caregiver.id}`}>Book</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
