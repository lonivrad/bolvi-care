"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Info,
  ExternalLink,
  Printer,
  Mail,
} from "lucide-react";

// Care Partners are W-2 employees. Payroll, tax withholding, and W-2 issuance
// are handled by an external payroll provider — this view is for pay and tax
// document visibility, not contractor 1099 / quarterly self-employment filing.
interface TaxDocument {
  id: string;
  type: "W-2" | "Annual Summary";
  year: number;
  status: "available" | "processing" | "upcoming";
  generatedAt?: string;
  dueDate?: string;
  amount?: number;
}

const mockDocuments: TaxDocument[] = [
  {
    id: "1",
    type: "W-2",
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
    type: "W-2",
    year: 2024,
    status: "upcoming",
    dueDate: "2025-01-31",
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
  const currentYearEarnings = 42680;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Tax Center
        </h2>
        <p className="text-sm text-muted-foreground">
          Your pay and tax documents
        </p>
      </div>

      {/* Tax Year Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">2024 Gross Earnings</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {formatCurrency(currentYearEarnings)}
                </p>
              </div>
              <div className="rounded-xl bg-green-100 dark:bg-green-900/30 p-2.5">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              YTD gross pay, before payroll withholding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Employment Type</p>
                <p className="text-2xl font-bold text-foreground mt-1">W-2 Employee</p>
              </div>
              <div className="rounded-xl bg-primary/10 p-2.5">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Taxes withheld via payroll; W-2 issued at year end
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

      {/* W-2 explainer */}
      <Card>
        <CardContent className="p-5">
          <div className="flex gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium">You&apos;re a W-2 employee</p>
              <p className="text-muted-foreground">
                Bolvi Care employs you directly. Federal and state payroll taxes are
                withheld and remitted on your behalf each pay period, and your W-2 is
                issued through our payroll provider by January 31. You don&apos;t file
                quarterly estimated taxes the way an independent contractor would.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tax Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button variant="outline" className="justify-start h-auto py-3" asChild>
              <a href="https://www.irs.gov/forms-pubs/about-form-w-2" target="_blank" rel="noopener noreferrer">
                <div className="text-left">
                  <p className="font-medium">IRS: About Form W-2</p>
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
