"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Circle,
  ChevronRight,
  User,
  Shield,
  CreditCard,
  Bell,
  Search,
  Calendar,
  FileText,
  Sparkles,
  Gift,
  ArrowRight,
  X,
  Camera,
  Briefcase,
  Clock,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href?: string;
  action?: string;
  completed: boolean;
  required: boolean;
  reward?: string;
}

interface OnboardingChecklistProps {
  userType: "family" | "caregiver";
  userName?: string;
  onComplete?: () => void;
  onDismiss?: () => void;
  completedSteps?: string[];
}

const familyChecklist: Omit<ChecklistItem, "completed">[] = [
  {
    id: "profile",
    title: "Complete your profile",
    description: "Add your name, photo, and contact info",
    icon: User,
    href: "/settings",
    action: "Complete Profile",
    required: true,
    reward: "Unlock caregiver matching",
  },
  {
    id: "care-recipient",
    title: "Add a care recipient",
    description: "Tell us about your loved one who needs care",
    icon: FileText,
    href: "/dashboard/family/care-recipients",
    action: "Add Recipient",
    required: true,
    reward: "Get personalized recommendations",
  },
  {
    id: "payment",
    title: "Add payment method",
    description: "Secure payment for seamless booking",
    icon: CreditCard,
    href: "/settings",
    action: "Add Payment",
    required: true,
    reward: "Enable instant booking",
  },
  {
    id: "browse",
    title: "Browse caregivers",
    description: "Explore our vetted caregiver network",
    icon: Search,
    href: "/caregivers",
    action: "Start Browsing",
    required: false,
  },
  {
    id: "notifications",
    title: "Set up notifications",
    description: "Stay informed about bookings and messages",
    icon: Bell,
    href: "/settings",
    action: "Configure",
    required: false,
  },
  {
    id: "first-booking",
    title: "Book your first visit",
    description: "Find the perfect caregiver and schedule care",
    icon: Calendar,
    href: "/caregivers",
    action: "Book Now",
    required: false,
    reward: "$20 off first booking",
  },
];

const caregiverChecklist: Omit<ChecklistItem, "completed">[] = [
  {
    id: "profile",
    title: "Complete your profile",
    description: "Add your bio, photo, and experience",
    icon: User,
    href: "/settings",
    action: "Complete Profile",
    required: true,
    reward: "Get discovered by families",
  },
  {
    id: "photo",
    title: "Upload a professional photo",
    description: "Profiles with photos get 3x more bookings",
    icon: Camera,
    href: "/settings",
    action: "Upload Photo",
    required: true,
  },
  {
    id: "background",
    title: "Complete background check",
    description: "Required for all caregivers on our platform",
    icon: Shield,
    href: "/settings",
    action: "Start Check",
    required: true,
    reward: "Trusted badge on profile",
  },
  {
    id: "experience",
    title: "Add your experience",
    description: "List your skills, certifications, and specialties",
    icon: Briefcase,
    href: "/settings",
    action: "Add Experience",
    required: true,
  },
  {
    id: "availability",
    title: "Set your availability",
    description: "Let families know when you're free",
    icon: Clock,
    href: "/dashboard/caregiver/availability",
    action: "Set Hours",
    required: true,
    reward: "Appear in search results",
  },
  {
    id: "payment",
    title: "Set up direct deposit",
    description: "Get paid quickly and securely",
    icon: CreditCard,
    href: "/settings",
    action: "Add Bank",
    required: true,
    reward: "Faster payouts",
  },
  {
    id: "first-job",
    title: "Accept your first job",
    description: "Start earning on Bolvi Care",
    icon: Star,
    href: "/dashboard/caregiver/requests",
    action: "View Requests",
    required: false,
    reward: "$50 new caregiver bonus",
  },
];

export function OnboardingChecklist({
  userType,
  userName = "there",
  onComplete,
  onDismiss,
  completedSteps = [],
}: OnboardingChecklistProps) {
  const [dismissed, setDismissed] = useState(false);

  const baseChecklist = userType === "family" ? familyChecklist : caregiverChecklist;
  const checklist: ChecklistItem[] = baseChecklist.map((item) => ({
    ...item,
    completed: completedSteps.includes(item.id),
  }));

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const requiredCompleted = checklist.filter((item) => item.required && item.completed).length;
  const requiredTotal = checklist.filter((item) => item.required).length;
  const progress = (completedCount / totalCount) * 100;
  const allRequiredComplete = requiredCompleted === requiredTotal;

  if (dismissed) return null;

  // If all required items are complete, show celebration
  if (allRequiredComplete && completedCount === totalCount) {
    return (
      <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <CardContent className="p-6 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            You&apos;re all set, {userName}!
          </h3>
          <p className="text-muted-foreground mb-4">
            Your account is fully set up and ready to go.
            {userType === "family"
              ? " Start browsing caregivers to find the perfect match."
              : " Families can now find and book you."}
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={onComplete}>
              {userType === "family" ? "Find Caregivers" : "View Dashboard"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setDismissed(true);
                onDismiss?.();
              }}
            >
              Dismiss
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              Welcome{userName ? `, ${userName}` : ""}!
            </CardTitle>
            <CardDescription>
              Complete these steps to get started on Bolvi Care
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setDismissed(true);
              onDismiss?.();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedCount} of {totalCount} complete
            </span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {checklist.map((item, index) => {
            const Icon = item.icon;
            const isNext = !item.completed && checklist.slice(0, index).every((i) => i.completed || !i.required);

            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-colors",
                  item.completed && "bg-green-50 dark:bg-green-950/20",
                  isNext && !item.completed && "bg-primary/5 border border-primary/20",
                  !item.completed && !isNext && "opacity-60"
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full shrink-0",
                    item.completed
                      ? "bg-green-100 dark:bg-green-900/30"
                      : isNext
                      ? "bg-primary/10"
                      : "bg-muted"
                  )}
                >
                  {item.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        isNext ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        "font-medium",
                        item.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {item.title}
                    </p>
                    {item.required && !item.completed && (
                      <Badge variant="secondary" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {item.description}
                  </p>
                  {item.reward && !item.completed && (
                    <p className="text-xs text-primary flex items-center gap-1 mt-1">
                      <Gift className="h-3 w-3" />
                      {item.reward}
                    </p>
                  )}
                </div>
                {!item.completed && item.href && (
                  <Button
                    size="sm"
                    variant={isNext ? "default" : "ghost"}
                    className="shrink-0"
                    asChild
                  >
                    <Link href={item.href}>
                      {item.action}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                )}
                {item.completed && (
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    Done
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {!allRequiredComplete && (
          <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Tip:</strong> Complete all required steps to{" "}
              {userType === "family"
                ? "start booking caregivers"
                : "appear in search results and receive booking requests"}
              .
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
