"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Clock,
  TrendingUp,
  Calculator,
  Info,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EarningsBreakdown {
  grossEarnings: number;
  platformFee: number;
  paymentProcessing: number;
  netEarnings: number;
  hourlyEquivalent: number;
  weeklyEstimate: number;
  monthlyEstimate: number;
  yearlyEstimate: number;
  selfEmploymentTax: number;
  estimatedTakeHome: number;
}

const PLATFORM_FEE_PERCENT = 15;
const PAYMENT_PROCESSING_PERCENT = 2.9;
const SELF_EMPLOYMENT_TAX_RATE = 15.3;
const FEDERAL_TAX_ESTIMATE = 12; // Simplified estimate

export function EarningsCalculator() {
  const [hourlyRate, setHourlyRate] = useState(28);
  const [hoursPerWeek, setHoursPerWeek] = useState(25);
  const [weeksPerYear, setWeeksPerYear] = useState(48);

  const breakdown = useMemo((): EarningsBreakdown => {
    const grossPerHour = hourlyRate;
    const platformFee = grossPerHour * (PLATFORM_FEE_PERCENT / 100);
    const afterPlatform = grossPerHour - platformFee;
    const paymentProcessing = afterPlatform * (PAYMENT_PROCESSING_PERCENT / 100);
    const netPerHour = afterPlatform - paymentProcessing;

    const weeklyGross = grossPerHour * hoursPerWeek;
    const weeklyNet = netPerHour * hoursPerWeek;
    const monthlyNet = weeklyNet * 4.33;
    const yearlyNet = weeklyNet * weeksPerYear;

    const selfEmploymentTax = yearlyNet * (SELF_EMPLOYMENT_TAX_RATE / 100);
    const federalTax = yearlyNet * (FEDERAL_TAX_ESTIMATE / 100);
    const estimatedTakeHome = yearlyNet - selfEmploymentTax - federalTax;

    return {
      grossEarnings: grossPerHour,
      platformFee,
      paymentProcessing,
      netEarnings: netPerHour,
      hourlyEquivalent: netPerHour,
      weeklyEstimate: weeklyNet,
      monthlyEstimate: monthlyNet,
      yearlyEstimate: yearlyNet,
      selfEmploymentTax,
      estimatedTakeHome,
    };
  }, [hourlyRate, hoursPerWeek, weeksPerYear]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const formatCurrencyDecimal = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Earnings Calculator</h2>
        <p className="text-sm text-muted-foreground">
          See how much you can earn as a Bolvi Care caregiver
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calculator className="h-5 w-5 text-primary" />
              Customize Your Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hourly Rate Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Hourly Rate</label>
                <span className="text-lg font-bold text-primary">${hourlyRate}/hr</span>
              </div>
              <input
                type="range"
                min="18"
                max="50"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$18/hr</span>
                <span>$50/hr</span>
              </div>
            </div>

            {/* Hours per Week */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Hours per Week</label>
                <span className="text-lg font-bold text-primary">{hoursPerWeek} hrs</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5 hrs (Part-time)</span>
                <span>50 hrs (Full-time+)</span>
              </div>
            </div>

            {/* Weeks per Year */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Weeks per Year</label>
                <span className="text-lg font-bold text-primary">{weeksPerYear} weeks</span>
              </div>
              <input
                type="range"
                min="20"
                max="52"
                value={weeksPerYear}
                onChange={(e) => setWeeksPerYear(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>20 weeks</span>
                <span>52 weeks</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-3">Quick Presets</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setHourlyRate(25);
                    setHoursPerWeek(15);
                    setWeeksPerYear(48);
                  }}
                >
                  Part-time
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setHourlyRate(28);
                    setHoursPerWeek(30);
                    setWeeksPerYear(50);
                  }}
                >
                  Standard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setHourlyRate(35);
                    setHoursPerWeek(40);
                    setWeeksPerYear(50);
                  }}
                >
                  Full-time
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setHourlyRate(45);
                    setHoursPerWeek(45);
                    setWeeksPerYear(50);
                  }}
                >
                  Top Earner
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {/* Primary Earnings Card */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Estimated Annual Earnings</p>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-2">
                  {formatCurrency(breakdown.yearlyEstimate)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">before taxes</p>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Weekly</p>
                  <p className="text-lg font-semibold text-foreground">
                    {formatCurrency(breakdown.weeklyEstimate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Monthly</p>
                  <p className="text-lg font-semibold text-foreground">
                    {formatCurrency(breakdown.monthlyEstimate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Effective Rate</p>
                  <p className="text-lg font-semibold text-foreground">
                    {formatCurrencyDecimal(breakdown.netEarnings)}/hr
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fee Breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Per-Hour Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Your Hourly Rate</span>
                <span className="font-semibold">{formatCurrencyDecimal(breakdown.grossEarnings)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Platform Fee ({PLATFORM_FEE_PERCENT}%)</span>
                <span className="text-red-500">-{formatCurrencyDecimal(breakdown.platformFee)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Payment Processing ({PAYMENT_PROCESSING_PERCENT}%)</span>
                <span className="text-red-500">-{formatCurrencyDecimal(breakdown.paymentProcessing)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-medium">You Keep</span>
                <span className="text-lg font-bold text-green-600">{formatCurrencyDecimal(breakdown.netEarnings)}/hr</span>
              </div>
            </CardContent>
          </Card>

          {/* Tax Estimate */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                Estimated Tax Impact
                <Badge variant="secondary" className="text-xs">Estimate Only</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Self-Employment Tax (15.3%)</span>
                <span className="text-amber-600">~{formatCurrency(breakdown.selfEmploymentTax)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Est. Federal Tax (~12%)</span>
                <span className="text-amber-600">~{formatCurrency(breakdown.yearlyEstimate * 0.12)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-medium">Est. Take-Home</span>
                <span className="text-lg font-bold text-foreground">{formatCurrency(breakdown.estimatedTakeHome)}/yr</span>
              </div>
              <p className="text-xs text-muted-foreground flex items-start gap-1.5 mt-2">
                <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                This is a simplified estimate. Actual taxes depend on your total income, deductions, and state. Consult a tax professional.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Benefits Section */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Why Caregivers Choose Bolvi Care</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Clock, title: "Flexible Schedule", desc: "Work when it suits you" },
              { icon: DollarSign, title: "Competitive Rates", desc: "Set your own hourly rate" },
              { icon: TrendingUp, title: "Growth Support", desc: "Free training & certifications" },
              { icon: CheckCircle, title: "Instant Payouts", desc: "Get paid same-day" },
            ].map((benefit) => (
              <div key={benefit.title} className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <benefit.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{benefit.title}</p>
                  <p className="text-xs text-muted-foreground">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
