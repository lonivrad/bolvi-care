"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Calculator,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Printer,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TaxDocument {
  id: string;
  type: "1099-NEC" | "1099-K" | "Annual Summary" | "Quarterly Estimate";
  year: number;
  quarter?: number;
  status: "available" | "processing" | "upcoming";
  generatedAt?: string;
  dueDate?: string;
  amount?: number;
}

interface QuarterlyEstimate {
  quarter: number;
  year: number;
  dueDate: string;
  estimatedTax: number;
  status: "paid" | "due" | "upcoming" | "overdue";
  paidDate?: string;
  paidAmount?: number;
}

const mockDocuments: TaxDocument[] = [
  {
    id: "1",
    type: "1099-NEC",
    year: 2023,
    status: "available",
    generatedAt: "2024-01-15",
    amount: 38450,
  },
  {
    id: "2",
    type: "Annual Summary",
    year: 2023,
    status: "available",
    generatedAt: "2024-01-15",
  },
  {
    id: "3",
    type: "1099-NEC",
    year: 2024,
    status: "upcoming",
    dueDate: "2025-01-31",
  },
];

const mockQuarterlyEstimates: QuarterlyEstimate[] = [
  {
    quarter: 1,
    year: 2024,
    dueDate: "2024-04-15",
    estimatedTax: 1245,
    status: "paid",
    paidDate: "2024-04-10",
    paidAmount: 1245,
  },
  {
    quarter: 2,
    year: 2024,
    dueDate: "2024-06-17",
    estimatedTax: 1320,
    status: "paid",
    paidDate: "2024-06-15",
    paidAmount: 1320,
  },
  {
    quarter: 3,
    year: 2024,
    dueDate: "2024-09-16",
    estimatedTax: 1180,
    status: "paid",
    paidDate: "2024-09-14",
    paidAmount: 1180,
  },
  {
    quarter: 4,
    year: 2024,
    dueDate: "2025-01-15",
    estimatedTax: 1290,
    status: "due",
  },
];

const statusConfig = {
  available: {
    label: "Available",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle,
  },
  processing: {
    label: "Processing",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    icon: Clock,
  },
  upcoming: {
    label: "Upcoming",
    color: "bg-muted text-muted-foreground",
    icon: Calendar,
  },
  paid: {
    label: "Paid",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle,
  },
  due: {
    label: "Due",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    icon: AlertCircle,
  },
  overdue: {
    label: "Overdue",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: AlertCircle,
  },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function TaxCenter() {
  const [showDeductions, setShowDeductions] = useState(false);

  const currentYearEarnings = 42680;
  const estimatedSETax = currentYearEarnings * 0.153;
  const estimatedFederalTax = currentYearEarnings * 0.12;
  const totalEstimatedTax = estimatedSETax + estimatedFederalTax;

  const totalPaid = mockQuarterlyEstimates
    .filter((q) => q.status === "paid")
    .reduce((sum, q) => sum + (q.paidAmount || 0), 0);

  const commonDeductions = [
    { name: "Mileage", description: "67¢/mile for 2024", example: "~$3,350 for 5,000 miles" },
    { name: "Home Office", description: "Simplified: $5/sq ft up to 300 sq ft", example: "Up to $1,500" },
    { name: "Supplies", description: "Gloves, masks, first aid supplies", example: "Varies" },
    { name: "Phone/Internet", description: "Business use percentage", example: "~30-50%" },
    { name: "Training/Certifications", description: "CPR, First Aid, continuing education", example: "Fully deductible" },
    { name: "Insurance", description: "Professional liability insurance", example: "Fully deductible" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Tax Center
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage your tax documents and estimated payments
        </p>
      </div>

      {/* Tax Year Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">2024 Earnings</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {formatCurrency(currentYearEarnings)}
                </p>
              </div>
              <div className="rounded-xl bg-green-100 dark:bg-green-900/30 p-2.5">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">YTD gross earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Est. Tax Liability</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {formatCurrency(totalEstimatedTax)}
                </p>
              </div>
              <div className="rounded-xl bg-amber-100 dark:bg-amber-900/30 p-2.5">
                <Calculator className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">SE + Federal estimate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Quarterly Paid</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatCurrency(totalPaid)}
                </p>
              </div>
              <div className="rounded-xl bg-primary/10 p-2.5">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">3 of 4 quarters paid</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800/50">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Q4 Due</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {formatCurrency(mockQuarterlyEstimates[3].estimatedTax)}
                </p>
              </div>
              <div className="rounded-xl bg-amber-100 dark:bg-amber-900/30 p-2.5">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-2 font-medium">
              Due January 15, 2025
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tax Documents */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tax Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockDocuments.map((doc) => {
              const status = statusConfig[doc.status];
              const StatusIcon = status.icon;

              return (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-muted/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{doc.type}</p>
                      <p className="text-sm text-muted-foreground">
                        Tax Year {doc.year}
                        {doc.amount && ` • ${formatCurrency(doc.amount)} reported`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={status.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                    {doc.status === "available" && (
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {doc.status === "upcoming" && (
                      <span className="text-sm text-muted-foreground">
                        Available by {doc.dueDate}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quarterly Estimates */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">2024 Quarterly Estimated Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {mockQuarterlyEstimates.map((quarter) => {
              const status = statusConfig[quarter.status];
              const StatusIcon = status.icon;

              return (
                <div
                  key={`${quarter.year}-Q${quarter.quarter}`}
                  className={cn(
                    "p-4 rounded-lg border",
                    quarter.status === "due" && "border-amber-300 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20",
                    quarter.status === "paid" && "bg-muted/20",
                    quarter.status === "overdue" && "border-red-300 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold">Q{quarter.quarter} {quarter.year}</span>
                    <Badge className={cn(status.color, "text-xs")}>
                      {status.label}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold">{formatCurrency(quarter.estimatedTax)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Due: {new Date(quarter.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  {quarter.paidDate && (
                    <p className="text-xs text-green-600 mt-1">
                      Paid: {new Date(quarter.paidDate).toLocaleDateString()}
                    </p>
                  )}
                  {quarter.status === "due" && (
                    <Button className="w-full mt-3" size="sm">
                      Pay Now
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Common Deductions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Common Deductions for Caregivers</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeductions(!showDeductions)}
            >
              {showDeductions ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" /> Hide
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" /> Show
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        {showDeductions && (
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {commonDeductions.map((deduction) => (
                <div
                  key={deduction.name}
                  className="p-3 rounded-lg border bg-muted/20"
                >
                  <p className="font-medium">{deduction.name}</p>
                  <p className="text-sm text-muted-foreground">{deduction.description}</p>
                  <p className="text-sm text-primary mt-1">{deduction.example}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <div className="flex gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800 dark:text-blue-300">
                    Track your expenses!
                  </p>
                  <p className="text-blue-700 dark:text-blue-400">
                    Keep receipts and records of all business expenses. Consider using an
                    expense tracking app to maximize your deductions.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tax Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <Button variant="outline" className="justify-start h-auto py-3" asChild>
              <a href="https://www.irs.gov/businesses/small-businesses-self-employed/self-employed-individuals-tax-center" target="_blank" rel="noopener noreferrer">
                <div className="text-left">
                  <p className="font-medium">IRS Self-Employment Guide</p>
                  <p className="text-xs text-muted-foreground">Official IRS resources</p>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </a>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-3" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <div className="text-left">
                  <p className="font-medium">Find a Tax Professional</p>
                  <p className="text-xs text-muted-foreground">Partner directory</p>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </a>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-3" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <div className="text-left">
                  <p className="font-medium">Tax FAQ for Caregivers</p>
                  <p className="text-xs text-muted-foreground">Common questions answered</p>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center">
        This information is for educational purposes only and does not constitute tax advice.
        Please consult a qualified tax professional for advice specific to your situation.
      </p>
    </div>
  );
}
