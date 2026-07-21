"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Clock,
  TrendingUp,
  Calculator,
  Info,
  CheckCircle,
} from "lucide-react";

interface EarningsBreakdown {
  hourlyWage: number;
  weeklyEstimate: number;
  monthlyEstimate: number;
  yearlyEstimate: number;
}

export function EarningsCalculator() {
  const [hourlyRate, setHourlyRate] = useState(27);
  const [hoursPerWeek, setHoursPerWeek] = useState(25);
  const [weeksPerYear, setWeeksPerYear] = useState(48);

  const breakdown = useMemo((): EarningsBreakdown => {
    // Care Partners are W-2 employees paid an hourly wage. Gross pay is simply
    // wage × hours; payroll taxes are withheld by the payroll provider.
    const weeklyGross = hourlyRate * hoursPerWeek;
    const monthlyGross = weeklyGross * 4.33;
    const yearlyGross = weeklyGross * weeksPerYear;

    return {
      hourlyWage: hourlyRate,
      weeklyEstimate: weeklyGross,
      monthlyEstimate: monthlyGross,
      yearlyEstimate: yearlyGross,
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
          See how much you can earn as a Bolvi Care Partner
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
                <p className="text-sm font-medium text-muted-foreground">Estimated Annual Gross Pay</p>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-2">
                  {formatCurrency(breakdown.yearlyEstimate)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">gross, before payroll withholding</p>
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
                  <p className="text-xs text-muted-foreground">Hourly Wage</p>
                  <p className="text-lg font-semibold text-foreground">
                    {formatCurrencyDecimal(breakdown.hourlyWage)}/hr
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* W-2 employment note */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">You&apos;re a W-2 employee</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                As a Care Partner you&apos;re employed by Bolvi Care, not a contractor.
                There are no platform fees taken out of your pay. Payroll taxes are
                withheld and remitted for you, and you receive a W-2 at year end.
              </p>
              <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                Figures are gross pay estimates. Your net paycheck depends on withholding elections, benefits, and state.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Benefits Section */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Why Care Partners Choose Bolvi Care</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Clock, title: "Flexible Schedule", desc: "Work when it suits you" },
              { icon: DollarSign, title: "Competitive Wages", desc: "HCA $23/hr, CNA/EMT $27/hr" },
              { icon: TrendingUp, title: "Growth Support", desc: "Free training & certifications" },
              { icon: CheckCircle, title: "W-2 Employment", desc: "Benefits and taxes handled" },
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
