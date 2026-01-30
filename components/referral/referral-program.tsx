"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Gift,
  Copy,
  Share2,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  Facebook,
  Twitter,
  Linkedin,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Referral {
  id: string;
  name: string;
  email: string;
  status: "pending" | "signed_up" | "first_booking" | "completed";
  dateReferred: string;
  reward: number;
  rewardStatus: "pending" | "earned" | "paid";
}

const mockReferrals: Referral[] = [
  {
    id: "1",
    name: "Jennifer Adams",
    email: "j.adams@email.com",
    status: "completed",
    dateReferred: "2024-01-10",
    reward: 50,
    rewardStatus: "paid",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@email.com",
    status: "first_booking",
    dateReferred: "2024-01-20",
    reward: 50,
    rewardStatus: "earned",
  },
  {
    id: "3",
    name: "Sarah Williams",
    email: "s.williams@email.com",
    status: "signed_up",
    dateReferred: "2024-01-25",
    reward: 50,
    rewardStatus: "pending",
  },
  {
    id: "4",
    name: "David Brown",
    email: "d.brown@email.com",
    status: "pending",
    dateReferred: "2024-01-28",
    reward: 50,
    rewardStatus: "pending",
  },
];

const statusConfig = {
  pending: {
    label: "Invited",
    color: "bg-muted text-muted-foreground",
    step: 1,
  },
  signed_up: {
    label: "Signed Up",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    step: 2,
  },
  first_booking: {
    label: "First Booking",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    step: 3,
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    step: 4,
  },
};

export function ReferralProgram() {
  const [copied, setCopied] = useState(false);
  const referralCode = "CARE-SARAH-2024";
  const referralLink = `https://bolvicare.com/r/${referralCode}`;

  const totalEarned = mockReferrals
    .filter((r) => r.rewardStatus === "paid")
    .reduce((sum, r) => sum + r.reward, 0);

  const pendingEarnings = mockReferrals
    .filter((r) => r.rewardStatus === "earned" || (r.status !== "pending" && r.rewardStatus === "pending"))
    .reduce((sum, r) => sum + r.reward, 0);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          Referral Program
        </h2>
        <p className="text-sm text-muted-foreground">
          Earn $50 for every friend who books their first care visit
        </p>
      </div>

      {/* Hero Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <Badge className="bg-primary text-primary-foreground mb-3">
                <Sparkles className="h-3 w-3 mr-1" />
                Limited Time: Double Rewards
              </Badge>
              <h3 className="text-2xl font-bold text-foreground">
                Give $25, Get $50
              </h3>
              <p className="text-muted-foreground mt-2">
                Share your referral link with friends and family. They get $25 off their first booking,
                and you earn $50 when they complete their first care visit.
              </p>

              {/* Referral Link */}
              <div className="mt-4">
                <label className="text-sm font-medium">Your referral link</label>
                <div className="mt-1.5 flex gap-2">
                  <div className="flex-1 flex items-center bg-background border rounded-lg px-3 py-2">
                    <span className="text-sm truncate text-muted-foreground">{referralLink}</span>
                  </div>
                  <Button onClick={copyToClipboard} variant={copied ? "default" : "outline"}>
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Text
                </Button>
                <Button variant="outline" size="sm">
                  <Facebook className="h-4 w-4 mr-1" />
                  Facebook
                </Button>
                <Button variant="outline" size="sm">
                  <Twitter className="h-4 w-4 mr-1" />
                  Twitter
                </Button>
                <Button variant="outline" size="sm">
                  <Linkedin className="h-4 w-4 mr-1" />
                  LinkedIn
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="lg:w-64 flex flex-row lg:flex-col gap-4">
              <Card className="flex-1 bg-background">
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-6 w-6 mx-auto text-green-500" />
                  <p className="text-2xl font-bold text-foreground mt-2">${totalEarned}</p>
                  <p className="text-xs text-muted-foreground">Total Earned</p>
                </CardContent>
              </Card>
              <Card className="flex-1 bg-background">
                <CardContent className="p-4 text-center">
                  <Clock className="h-6 w-6 mx-auto text-amber-500" />
                  <p className="text-2xl font-bold text-foreground mt-2">${pendingEarnings}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </CardContent>
              </Card>
              <Card className="flex-1 bg-background">
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 mx-auto text-primary" />
                  <p className="text-2xl font-bold text-foreground mt-2">{mockReferrals.length}</p>
                  <p className="text-xs text-muted-foreground">Referrals</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { step: 1, title: "Share", desc: "Send your unique link to friends & family", icon: Share2 },
              { step: 2, title: "Sign Up", desc: "They create an account using your link", icon: Users },
              { step: 3, title: "Book", desc: "They book and complete their first care visit", icon: CheckCircle },
              { step: 4, title: "Earn", desc: "You both get rewarded!", icon: Gift },
            ].map((item, i) => (
              <div key={item.step} className="relative">
                {i < 3 && (
                  <ArrowRight className="hidden sm:block absolute -right-2 top-6 h-4 w-4 text-muted-foreground z-10" />
                )}
                <div className="text-center p-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Referral Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Your Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReferrals.map((referral) => {
              const status = statusConfig[referral.status];
              return (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-muted/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {referral.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{referral.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Referred {new Date(referral.dateReferred).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Progress Steps */}
                  <div className="hidden md:flex items-center gap-2">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className="flex items-center">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                            step <= status.step
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {step <= status.step ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            step
                          )}
                        </div>
                        {step < 4 && (
                          <div
                            className={cn(
                              "w-8 h-0.5",
                              step < status.step ? "bg-primary" : "bg-muted"
                            )}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className={status.color}>{status.label}</Badge>
                    <div className="text-right">
                      <p
                        className={cn(
                          "font-semibold",
                          referral.rewardStatus === "paid"
                            ? "text-green-600"
                            : referral.rewardStatus === "earned"
                            ? "text-amber-600"
                            : "text-muted-foreground"
                        )}
                      >
                        ${referral.reward}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {referral.rewardStatus}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {mockReferrals.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <p className="mt-4 font-medium">No referrals yet</p>
              <p className="text-sm text-muted-foreground">
                Share your link to start earning rewards!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Terms */}
      <p className="text-xs text-muted-foreground text-center">
        Referral rewards are issued after the referred user completes their first paid booking.
        Rewards are added to your account within 5 business days.{" "}
        <a href="/terms/referral" className="text-primary hover:underline">
          Full terms and conditions
        </a>
      </p>
    </div>
  );
}
