"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Heart,
  Calendar,
  Clock,
  DollarSign,
  Star,
  ArrowRight,
  Sparkles,
  Activity,
  Shield,
  Users,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Insight {
  id: string;
  type: "recommendation" | "alert" | "achievement" | "trend" | "tip";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  metric?: {
    label: string;
    value: string | number;
    change?: number;
    isPositive?: boolean;
  };
  action?: {
    label: string;
    href: string;
  };
  icon?: React.ElementType;
}

const familyInsights: Insight[] = [
  {
    id: "1",
    type: "recommendation",
    title: "Schedule Regular Care",
    description: "Families with consistent weekly schedules report 40% higher satisfaction. Consider setting up recurring visits.",
    priority: "high",
    action: { label: "Set Up Schedule", href: "/dashboard/family/bookings" },
    icon: Calendar,
  },
  {
    id: "2",
    type: "trend",
    title: "Care Hours Trending Up",
    description: "Your care usage has increased 25% this month. This is common as needs evolve.",
    priority: "medium",
    metric: { label: "Hours this month", value: 48, change: 25, isPositive: true },
    icon: TrendingUp,
  },
  {
    id: "3",
    type: "tip",
    title: "Try Morning Visits",
    description: "Based on Eleanor's activity patterns, morning visits (9-11 AM) may be most beneficial.",
    priority: "medium",
    icon: Lightbulb,
  },
  {
    id: "4",
    type: "achievement",
    title: "Great Team Building!",
    description: "You've built a reliable care team of 3 caregivers. This provides flexibility and continuity.",
    priority: "low",
    metric: { label: "Team members", value: 3 },
    icon: Users,
  },
  {
    id: "5",
    type: "alert",
    title: "Review Medications",
    description: "It's been 30 days since the last medication review. Consider scheduling one with the caregiver.",
    priority: "high",
    action: { label: "Schedule Review", href: "/dashboard/family/health-tracking" },
    icon: AlertTriangle,
  },
];

const caregiverInsights: Insight[] = [
  {
    id: "1",
    type: "recommendation",
    title: "Optimize Your Schedule",
    description: "Adding Tuesday afternoon availability could increase your bookings by 30%.",
    priority: "high",
    action: { label: "Update Availability", href: "/dashboard/caregiver/availability" },
    icon: Calendar,
  },
  {
    id: "2",
    type: "trend",
    title: "Earnings Growing",
    description: "Your monthly earnings are up 18% compared to last month. Keep up the great work!",
    priority: "medium",
    metric: { label: "This month", value: "$3,240", change: 18, isPositive: true },
    icon: DollarSign,
  },
  {
    id: "3",
    type: "achievement",
    title: "5-Star Streak!",
    description: "You've maintained a perfect 5-star rating for 10 consecutive visits.",
    priority: "low",
    metric: { label: "Consecutive 5-stars", value: 10 },
    icon: Star,
  },
  {
    id: "4",
    type: "tip",
    title: "Complete CPR Recertification",
    description: "Your CPR certification expires in 30 days. Renewing early can boost your profile visibility.",
    priority: "high",
    action: { label: "Find Classes", href: "/training" },
    icon: Shield,
  },
  {
    id: "5",
    type: "recommendation",
    title: "Consider Dementia Specialization",
    description: "Dementia care specialists earn 25% more on average. You're 2 courses away from certification.",
    priority: "medium",
    action: { label: "View Training", href: "/training" },
    icon: Brain,
  },
];

const typeConfig = {
  recommendation: {
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    borderColor: "border-blue-200 dark:border-blue-800/50",
    label: "Recommendation",
  },
  alert: {
    color: "text-amber-500",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    borderColor: "border-amber-200 dark:border-amber-800/50",
    label: "Attention",
  },
  achievement: {
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    borderColor: "border-green-200 dark:border-green-800/50",
    label: "Achievement",
  },
  trend: {
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    borderColor: "border-purple-200 dark:border-purple-800/50",
    label: "Trend",
  },
  tip: {
    color: "text-teal-500",
    bgColor: "bg-teal-100 dark:bg-teal-900/30",
    borderColor: "border-teal-200 dark:border-teal-800/50",
    label: "Tip",
  },
};

interface CareInsightsProps {
  userType?: "family" | "caregiver";
  maxItems?: number;
}

export function CareInsights({ userType = "family", maxItems = 5 }: CareInsightsProps) {
  const insights = userType === "family" ? familyInsights : caregiverInsights;
  const displayInsights = insights.slice(0, maxItems);

  // Calculate overall score
  const highPriorityCount = insights.filter((i) => i.priority === "high").length;
  const achievementCount = insights.filter((i) => i.type === "achievement").length;
  const overallScore = Math.max(0, 100 - highPriorityCount * 15 + achievementCount * 10);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">AI Care Insights</CardTitle>
              <p className="text-xs text-muted-foreground">
                Personalized recommendations powered by AI
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "font-mono",
              overallScore >= 80
                ? "border-green-500 text-green-600"
                : overallScore >= 60
                ? "border-amber-500 text-amber-600"
                : "border-red-500 text-red-600"
            )}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Score: {overallScore}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-muted/30">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {insights.filter((i) => i.priority === "high").length}
            </p>
            <p className="text-xs text-muted-foreground">Action Items</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {insights.filter((i) => i.type === "achievement").length}
            </p>
            <p className="text-xs text-muted-foreground">Achievements</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {insights.filter((i) => i.type === "tip").length}
            </p>
            <p className="text-xs text-muted-foreground">Tips</p>
          </div>
        </div>

        {/* Insights List */}
        <div className="space-y-3">
          {displayInsights.map((insight) => {
            const config = typeConfig[insight.type];
            const Icon = insight.icon || Lightbulb;

            return (
              <div
                key={insight.id}
                className={cn(
                  "p-4 rounded-lg border transition-all hover:shadow-sm",
                  insight.priority === "high"
                    ? "border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/10"
                    : "border-border"
                )}
              >
                <div className="flex gap-3">
                  <div
                    className={cn(
                      "h-9 w-9 rounded-full flex items-center justify-center shrink-0",
                      config.bgColor
                    )}
                  >
                    <Icon className={cn("h-4 w-4", config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm text-foreground">
                            {insight.title}
                          </p>
                          <Badge
                            variant="secondary"
                            className={cn("text-[10px] px-1.5 h-5", config.bgColor, config.color)}
                          >
                            {config.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {insight.description}
                        </p>
                      </div>
                    </div>

                    {/* Metric */}
                    {insight.metric && (
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-lg font-bold text-foreground">
                            {insight.metric.value}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {insight.metric.label}
                          </span>
                        </div>
                        {insight.metric.change !== undefined && (
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              insight.metric.isPositive
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            )}
                          >
                            {insight.metric.isPositive ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {insight.metric.change}%
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Action */}
                    {insight.action && (
                      <div className="mt-3">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={insight.action.href}>
                            {insight.action.label}
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All */}
        {insights.length > maxItems && (
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/insights">
              View All Insights ({insights.length})
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
