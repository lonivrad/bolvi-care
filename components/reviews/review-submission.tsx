"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Star,
  ThumbsUp,
  Heart,
  Clock,
  MessageSquare,
  Shield,
  Sparkles,
  CheckCircle,
  Camera,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewCategory {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  rating: number;
}

interface ReviewSubmissionProps {
  caregiver: {
    id: string;
    name: string;
    photo: string;
  };
  visitDate: string;
  visitDuration: string;
  onSubmit?: (review: ReviewData) => void;
  onSkip?: () => void;
}

interface ReviewData {
  overallRating: number;
  categories: Record<string, number>;
  review: string;
  recommend: boolean;
  highlights: string[];
  photos?: string[];
}

const categoryDefaults: Omit<ReviewCategory, "rating">[] = [
  {
    id: "punctuality",
    label: "Punctuality",
    description: "Arrived on time and stayed for full visit",
    icon: Clock,
  },
  {
    id: "communication",
    label: "Communication",
    description: "Kept you informed and responsive",
    icon: MessageSquare,
  },
  {
    id: "careQuality",
    label: "Quality of Care",
    description: "Provided excellent care and attention",
    icon: Heart,
  },
  {
    id: "professionalism",
    label: "Professionalism",
    description: "Professional and respectful demeanor",
    icon: Shield,
  },
];

const highlightOptions = [
  "Great with my loved one",
  "Excellent communicator",
  "Very punctual",
  "Went above and beyond",
  "Patient and kind",
  "Followed care plan perfectly",
  "Made my loved one smile",
  "I felt at ease",
  "Handled medications properly",
  "Great conversation skills",
];

function StarRating({
  rating,
  onChange,
  size = "md",
  readonly = false,
}: {
  rating: number;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className={cn(
            "transition-transform",
            !readonly && "hover:scale-110 cursor-pointer",
            readonly && "cursor-default"
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              "transition-colors",
              (hovered || rating) >= star
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/30"
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function ReviewSubmission({
  caregiver,
  visitDate,
  visitDuration,
  onSubmit,
  onSkip,
}: ReviewSubmissionProps) {
  const [step, setStep] = useState(1);
  const [overallRating, setOverallRating] = useState(0);
  const [categories, setCategories] = useState<ReviewCategory[]>(
    categoryDefaults.map((c) => ({ ...c, rating: 0 }))
  );
  const [review, setReview] = useState("");
  const [recommend, setRecommend] = useState<boolean | null>(null);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateCategoryRating = (id: string, rating: number) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, rating } : c))
    );
  };

  const toggleHighlight = (highlight: string) => {
    setHighlights((prev) =>
      prev.includes(highlight)
        ? prev.filter((h) => h !== highlight)
        : prev.length < 5
        ? [...prev, highlight]
        : prev
    );
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return overallRating > 0;
      case 2:
        return categories.every((c) => c.rating > 0);
      case 3:
        return review.length >= 10;
      case 4:
        return recommend !== null;
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    const reviewData: ReviewData = {
      overallRating,
      categories: categories.reduce((acc, c) => ({ ...acc, [c.id]: c.rating }), {}),
      review,
      recommend: recommend ?? true,
      highlights,
    };
    onSubmit?.(reviewData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Thank You!</h2>
          <p className="text-muted-foreground mb-6">
            Your review has been submitted. It helps other families find great caregivers
            and helps {caregiver.name.split(" ")[0]} improve their service.
          </p>
          <div className="flex items-center justify-center gap-4 p-4 rounded-lg bg-muted mb-6">
            <Image
              src={caregiver.photo}
              alt={caregiver.name}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div className="text-left">
              <p className="font-medium">{caregiver.name}</p>
              <div className="flex items-center gap-1">
                <StarRating rating={overallRating} size="sm" readonly />
                <span className="text-sm text-muted-foreground ml-1">
                  Your rating
                </span>
              </div>
            </div>
          </div>
          <Button onClick={onSkip}>Done</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center border-b">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Image
            src={caregiver.photo}
            alt={caregiver.name}
            width={56}
            height={56}
            className="rounded-full ring-2 ring-border"
          />
          <div className="text-left">
            <CardTitle className="text-lg">{caregiver.name}</CardTitle>
            <CardDescription>
              Visit on {visitDate} ({visitDuration})
            </CardDescription>
          </div>
        </div>
        <Progress value={(step / 5) * 100} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2">
          Step {step} of 5
        </p>
      </CardHeader>

      <CardContent className="p-6">
        {/* Step 1: Overall Rating */}
        {step === 1 && (
          <div className="text-center space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">How was your experience?</h3>
              <p className="text-muted-foreground">
                Rate your overall experience with {caregiver.name.split(" ")[0]}
              </p>
            </div>
            <div className="flex justify-center py-4">
              <StarRating
                rating={overallRating}
                onChange={setOverallRating}
                size="lg"
              />
            </div>
            {overallRating > 0 && (
              <p className="text-lg font-medium">
                {overallRating === 5 && "Excellent!"}
                {overallRating === 4 && "Great!"}
                {overallRating === 3 && "Good"}
                {overallRating === 2 && "Fair"}
                {overallRating === 1 && "Poor"}
              </p>
            )}
          </div>
        )}

        {/* Step 2: Category Ratings */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Rate specific areas</h3>
              <p className="text-muted-foreground">
                Help us understand what went well
              </p>
            </div>
            <div className="space-y-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{category.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <StarRating
                      rating={category.rating}
                      onChange={(r) => updateCategoryRating(category.id, r)}
                      size="sm"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Written Review */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Share your experience</h3>
              <p className="text-muted-foreground">
                Write a few sentences about your visit
              </p>
            </div>
            <Textarea
              placeholder="What made this visit special? How did the caregiver interact with your loved one? Would you book again?"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-[150px] resize-none"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{review.length} characters</span>
              <span>{review.length < 10 ? "Minimum 10 characters" : "Looking good!"}</span>
            </div>
          </div>
        )}

        {/* Step 4: Recommend & Highlights */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                Would you recommend {caregiver.name.split(" ")[0]}?
              </h3>
            </div>
            <div className="flex justify-center gap-4">
              <Button
                variant={recommend === true ? "default" : "outline"}
                size="lg"
                onClick={() => setRecommend(true)}
                className="w-36"
              >
                <ThumbsUp className={cn("mr-2 h-5 w-5", recommend === true && "fill-current")} />
                Yes!
              </Button>
              <Button
                variant={recommend === false ? "destructive" : "outline"}
                size="lg"
                onClick={() => setRecommend(false)}
                className="w-36"
              >
                <ThumbsUp className="mr-2 h-5 w-5 rotate-180" />
                Not really
              </Button>
            </div>

            <div className="pt-4">
              <p className="text-center font-medium mb-3">
                Add highlights (optional, up to 5)
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {highlightOptions.map((highlight) => (
                  <Badge
                    key={highlight}
                    variant={highlights.includes(highlight) ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-all",
                      highlights.includes(highlight) && "bg-primary"
                    )}
                    onClick={() => toggleHighlight(highlight)}
                  >
                    {highlights.includes(highlight) && (
                      <CheckCircle className="mr-1 h-3 w-3" />
                    )}
                    {highlight}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review Summary */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="text-center">
              <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="text-xl font-semibold mb-2">Review Summary</h3>
              <p className="text-muted-foreground">
                Here&apos;s what you&apos;re about to share
              </p>
            </div>

            <div className="rounded-lg border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Overall Rating</span>
                <StarRating rating={overallRating} size="sm" readonly />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {categories.map((c) => (
                  <div key={c.id} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{c.label}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3 w-3",
                            i < c.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm">&ldquo;{review}&rdquo;</p>
              </div>
              {highlights.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {highlights.map((h) => (
                    <Badge key={h} variant="secondary" className="text-xs">
                      {h}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <ThumbsUp
                  className={cn(
                    "h-4 w-4",
                    recommend ? "text-green-500 fill-green-500" : "text-red-500 rotate-180"
                  )}
                />
                <span>
                  {recommend ? "Would recommend" : "Would not recommend"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t mt-6">
          <Button
            variant="ghost"
            onClick={() => (step > 1 ? setStep(step - 1) : onSkip?.())}
          >
            {step > 1 ? "Back" : "Skip"}
          </Button>
          {step < 5 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
              Continue
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Submit Review
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
