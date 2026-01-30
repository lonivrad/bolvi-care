"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  FileCheck,
  Fingerprint,
  Heart,
  GraduationCap,
  Car,
  BadgeCheck,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface VerificationItem {
  id: string;
  name: string;
  status: "verified" | "pending" | "expired" | "not_started";
  verifiedAt?: string;
  expiresAt?: string;
  provider?: string;
  icon: React.ElementType;
  required: boolean;
}

interface VerificationBadgeProps {
  verifications?: VerificationItem[];
  variant?: "compact" | "detailed";
  showActions?: boolean;
}

const statusConfig = {
  verified: {
    label: "Verified",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle,
    iconColor: "text-green-500",
  },
  pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    icon: Clock,
    iconColor: "text-amber-500",
  },
  expired: {
    label: "Expired",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: AlertCircle,
    iconColor: "text-red-500",
  },
  not_started: {
    label: "Not Started",
    color: "bg-muted text-muted-foreground",
    icon: AlertCircle,
    iconColor: "text-muted-foreground",
  },
};

export const defaultVerifications: VerificationItem[] = [
  {
    id: "background",
    name: "Fully Vetted",
    status: "verified",
    verifiedAt: "2024-01-15",
    expiresAt: "2025-01-15",
    provider: "Verified",
    icon: Shield,
    required: true,
  },
  {
    id: "identity",
    name: "Identity Verification",
    status: "verified",
    verifiedAt: "2024-01-10",
    provider: "Stripe Identity",
    icon: Fingerprint,
    required: true,
  },
  {
    id: "cpr",
    name: "CPR Certification",
    status: "verified",
    verifiedAt: "2024-02-01",
    expiresAt: "2026-02-01",
    provider: "American Red Cross",
    icon: Heart,
    required: false,
  },
  {
    id: "firstaid",
    name: "First Aid Training",
    status: "verified",
    verifiedAt: "2024-02-01",
    expiresAt: "2026-02-01",
    icon: FileCheck,
    required: false,
  },
  {
    id: "license",
    name: "State License (HCA)",
    status: "verified",
    verifiedAt: "2024-01-20",
    expiresAt: "2025-01-20",
    provider: "WA DSHS",
    icon: BadgeCheck,
    required: true,
  },
  {
    id: "driving",
    name: "Driving Record",
    status: "pending",
    icon: Car,
    required: false,
  },
  {
    id: "education",
    name: "Education Verification",
    status: "not_started",
    icon: GraduationCap,
    required: false,
  },
];

export function VerificationBadge({
  verifications = defaultVerifications,
  variant = "detailed",
  showActions = true,
}: VerificationBadgeProps) {
  const verifiedCount = verifications.filter((v) => v.status === "verified").length;
  const requiredVerified = verifications.filter((v) => v.required && v.status === "verified").length;
  const requiredTotal = verifications.filter((v) => v.required).length;
  const allRequiredVerified = requiredVerified === requiredTotal;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1",
            allRequiredVerified
              ? "bg-green-100 dark:bg-green-900/30"
              : "bg-amber-100 dark:bg-amber-900/30"
          )}
        >
          <Shield
            className={cn(
              "h-4 w-4",
              allRequiredVerified
                ? "text-green-600 dark:text-green-400"
                : "text-amber-600 dark:text-amber-400"
            )}
          />
          <span
            className={cn(
              "text-sm font-medium",
              allRequiredVerified
                ? "text-green-700 dark:text-green-400"
                : "text-amber-700 dark:text-amber-400"
            )}
          >
            {allRequiredVerified ? "Fully Verified" : `${requiredVerified}/${requiredTotal} Verified`}
          </span>
        </div>
        {verifiedCount > requiredTotal && (
          <Badge variant="secondary" className="text-xs">
            +{verifiedCount - requiredTotal} certifications
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-5 w-5 text-primary" />
            Trust & Verification
          </CardTitle>
          <Badge
            className={cn(
              allRequiredVerified
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0"
            )}
          >
            {verifiedCount}/{verifications.length} Complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Verification Progress</span>
            <span className="font-medium">{Math.round((verifiedCount / verifications.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                allRequiredVerified ? "bg-green-500" : "bg-amber-500"
              )}
              style={{ width: `${(verifiedCount / verifications.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Verification Items */}
        <div className="space-y-3">
          {verifications.map((item) => {
            const status = statusConfig[item.status];
            const StatusIcon = status.icon;

            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border",
                  item.status === "verified" && "bg-green-50/50 dark:bg-green-950/10 border-green-100 dark:border-green-900/30",
                  item.status === "pending" && "bg-amber-50/50 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/30",
                  item.status === "expired" && "bg-red-50/50 dark:bg-red-950/10 border-red-100 dark:border-red-900/30",
                  item.status === "not_started" && "bg-muted/30 border-border"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", item.status === "verified" ? "bg-green-100 dark:bg-green-900/30" : "bg-muted")}>
                    <item.icon className={cn("h-4 w-4", item.status === "verified" ? "text-green-600" : "text-muted-foreground")} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{item.name}</span>
                      {item.required && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          Required
                        </Badge>
                      )}
                    </div>
                    {item.status === "verified" && (
                      <p className="text-xs text-muted-foreground">
                        {item.provider && `${item.provider} • `}
                        Verified {formatDate(item.verifiedAt)}
                        {item.expiresAt && ` • Expires ${formatDate(item.expiresAt)}`}
                      </p>
                    )}
                    {item.status === "pending" && (
                      <p className="text-xs text-amber-600">Verification in progress...</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon className={cn("h-5 w-5", status.iconColor)} />
                  {showActions && item.status === "not_started" && (
                    <Button variant="outline" size="sm" className="text-xs h-7">
                      Start
                    </Button>
                  )}
                  {showActions && item.status === "expired" && (
                    <Button variant="outline" size="sm" className="text-xs h-7">
                      Renew
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Score */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Trust Score</p>
              <p className="text-xs text-muted-foreground">Based on verifications, reviews, and history</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">98</p>
              <p className="text-xs text-muted-foreground">Excellent</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
