"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  Heart,
  Shield,
  Calendar,
  ArrowRight,
  Zap,
  ThumbsUp,
  MessageSquare,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchedCaregiver {
  id: string;
  name: string;
  photo: string;
  matchScore: number;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  distance: number;
  yearsExperience: number;
  specialties: string[];
  availability: "available" | "busy" | "unavailable";
  responseTime: string;
  matchReasons: MatchReason[];
  badges: string[];
  instantBook: boolean;
}

interface MatchReason {
  category: string;
  reason: string;
  weight: number;
}

const mockMatches: MatchedCaregiver[] = [
  {
    id: "cg-1",
    name: "Maria Rodriguez",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    matchScore: 98,
    hourlyRate: 28,
    rating: 4.9,
    reviewCount: 127,
    distance: 2.3,
    yearsExperience: 8,
    specialties: ["Dementia Care", "Medication Management", "Mobility Assistance"],
    availability: "available",
    responseTime: "< 1 hour",
    badges: ["Background Checked", "CPR Certified", "Top Rated"],
    instantBook: true,
    matchReasons: [
      { category: "Experience", reason: "8+ years with dementia care patients", weight: 30 },
      { category: "Availability", reason: "Available for your requested times", weight: 25 },
      { category: "Location", reason: "Only 2.3 miles away", weight: 20 },
      { category: "Reviews", reason: "Highly rated by similar families", weight: 15 },
      { category: "Skills", reason: "Medication management certified", weight: 10 },
    ],
  },
  {
    id: "cg-2",
    name: "David Kim",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    matchScore: 94,
    hourlyRate: 30,
    rating: 4.8,
    reviewCount: 89,
    distance: 3.1,
    yearsExperience: 6,
    specialties: ["Physical Therapy", "Mobility Assistance", "Post-Surgery Care"],
    availability: "available",
    responseTime: "< 2 hours",
    badges: ["Background Checked", "First Aid Certified", "Consistent"],
    instantBook: true,
    matchReasons: [
      { category: "Specialization", reason: "Physical therapy background matches needs", weight: 35 },
      { category: "Availability", reason: "Flexible scheduling options", weight: 25 },
      { category: "Experience", reason: "6 years working with seniors", weight: 20 },
      { category: "Reviews", reason: "Praised for patience and skill", weight: 20 },
    ],
  },
  {
    id: "cg-3",
    name: "Sarah Thompson",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    matchScore: 91,
    hourlyRate: 26,
    rating: 4.7,
    reviewCount: 56,
    distance: 4.5,
    yearsExperience: 4,
    specialties: ["Companionship", "Meal Preparation", "Light Housekeeping"],
    availability: "busy",
    responseTime: "< 3 hours",
    badges: ["Background Checked", "Rising Star"],
    instantBook: false,
    matchReasons: [
      { category: "Personality", reason: "Great companion match based on interests", weight: 30 },
      { category: "Value", reason: "Competitive rate for the area", weight: 25 },
      { category: "Skills", reason: "Excellent meal preparation skills", weight: 25 },
      { category: "Growth", reason: "Rising star with excellent trajectory", weight: 20 },
    ],
  },
];

function MatchScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-20 h-20">
      <svg className="w-20 h-20 transform -rotate-90">
        <circle
          cx="40"
          cy="40"
          r="36"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          className="text-muted"
        />
        <circle
          cx="40"
          cy="40"
          r="36"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn(
            "transition-all duration-500",
            score >= 90 ? "text-green-500" : score >= 80 ? "text-blue-500" : "text-amber-500"
          )}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold">{score}%</span>
      </div>
    </div>
  );
}

function MatchedCaregiverCard({ caregiver }: { caregiver: MatchedCaregiver }) {
  const [showReasons, setShowReasons] = useState(false);

  return (
    <Card className={cn(
      "overflow-hidden transition-all",
      caregiver.matchScore >= 95 && "ring-2 ring-green-200 dark:ring-green-800"
    )}>
      {caregiver.matchScore >= 95 && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center py-1.5 text-sm font-medium">
          <Sparkles className="h-4 w-4 inline mr-1" />
          Best Match for Your Needs
        </div>
      )}
      <CardContent className="p-5">
        <div className="flex gap-4">
          {/* Match Score */}
          <div className="flex flex-col items-center">
            <MatchScoreRing score={caregiver.matchScore} />
            <span className="text-xs text-muted-foreground mt-1">Match Score</span>
          </div>

          {/* Caregiver Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src={caregiver.photo}
                    alt={caregiver.name}
                    width={48}
                    height={48}
                    className="rounded-full ring-2 ring-border"
                  />
                  {caregiver.availability === "available" && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-card" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{caregiver.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{caregiver.rating}</span>
                    <span>({caregiver.reviewCount})</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-foreground">${caregiver.hourlyRate}</p>
                <p className="text-xs text-muted-foreground">/hour</p>
              </div>
            </div>

            {/* Quick Info */}
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {caregiver.distance} mi away
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                {caregiver.responseTime} response
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Shield className="h-3 w-3" />
                {caregiver.yearsExperience}+ years
              </span>
            </div>

            {/* Badges */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {caregiver.badges.slice(0, 3).map((badge) => (
                <Badge key={badge} variant="secondary" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {badge}
                </Badge>
              ))}
              {caregiver.instantBook && (
                <Badge className="bg-primary text-primary-foreground text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  Instant Book
                </Badge>
              )}
            </div>

            {/* Specialties */}
            <div className="mt-3 flex flex-wrap gap-1">
              {caregiver.specialties.map((spec) => (
                <Badge key={spec} variant="outline" className="text-xs">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Match Reasons Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-4"
          onClick={() => setShowReasons(!showReasons)}
        >
          <Sparkles className="h-4 w-4 mr-1" />
          {showReasons ? "Hide" : "See"} why they&apos;re a great match
        </Button>

        {/* Match Reasons */}
        {showReasons && (
          <div className="mt-4 p-4 rounded-lg bg-muted/30 space-y-3">
            <p className="text-sm font-medium">Why we recommend {caregiver.name.split(" ")[0]}:</p>
            {caregiver.matchReasons.map((reason, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <ThumbsUp className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{reason.category}</span>
                    <span className="text-xs text-muted-foreground">{reason.weight}% weight</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{reason.reason}</p>
                  <Progress value={reason.weight} className="h-1 mt-1" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Button variant="outline" className="flex-1" asChild>
            <Link href={`/caregivers/${caregiver.id}`}>
              View Profile
            </Link>
          </Button>
          <Button variant="outline" size="icon">
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
          <Button className="flex-1" asChild>
            <Link href={`/book/${caregiver.id}`}>
              {caregiver.instantBook && <Zap className="h-4 w-4 mr-1" />}
              Book Now
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface SmartMatchProps {
  careNeeds?: string[];
  location?: string;
  schedule?: string;
}

export function SmartMatch({ careNeeds, location, schedule }: SmartMatchProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Smart Matches
          </h2>
          <p className="text-sm text-muted-foreground">
            AI-powered recommendations based on your care needs
          </p>
        </div>
        <Button variant="outline" size="sm">
          Adjust Preferences
        </Button>
      </div>

      {/* Matching Criteria Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <p className="text-sm font-medium mb-2">Matching based on:</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-background">
              <Heart className="h-3 w-3 mr-1" />
              Dementia Care
            </Badge>
            <Badge variant="outline" className="bg-background">
              <MapPin className="h-3 w-3 mr-1" />
              Seattle, WA
            </Badge>
            <Badge variant="outline" className="bg-background">
              <Calendar className="h-3 w-3 mr-1" />
              Mon, Wed, Fri mornings
            </Badge>
            <Badge variant="outline" className="bg-background">
              <DollarSign className="h-3 w-3 mr-1" />
              $25-35/hr
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Matched Caregivers */}
      <div className="space-y-4">
        {mockMatches.map((caregiver) => (
          <MatchedCaregiverCard key={caregiver.id} caregiver={caregiver} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">
          Show More Matches
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
