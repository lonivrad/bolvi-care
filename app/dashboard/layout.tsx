"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Heart,
  BarChart3,
  Briefcase,
  Clock,
  DollarSign,
  FileText,
  Activity,
  Settings,
  HelpCircle,
} from "lucide-react";

const familySidebarItems = [
  { label: "Dashboard", href: "/dashboard/family", icon: LayoutDashboard },
  { label: "Bookings", href: "/dashboard/family/bookings", icon: Calendar },
  { label: "Care Team", href: "/dashboard/family/care-team", icon: Users },
  { label: "Care Recipients", href: "/dashboard/family/care-recipients", icon: Heart },
  { label: "Health Tracking", href: "/dashboard/family/health-tracking", icon: Activity },
  { label: "Analytics", href: "/dashboard/family/analytics", icon: BarChart3 },
];

const caregiverSidebarItems = [
  { label: "Dashboard", href: "/dashboard/caregiver", icon: LayoutDashboard },
  { label: "Job Requests", href: "/dashboard/caregiver/requests", icon: FileText },
  { label: "Jobs", href: "/dashboard/caregiver/jobs", icon: Briefcase },
  { label: "Availability", href: "/dashboard/caregiver/availability", icon: Clock },
  { label: "Earnings", href: "/dashboard/caregiver/earnings", icon: DollarSign },
  { label: "Analytics", href: "/dashboard/caregiver/analytics", icon: BarChart3 },
];

const bottomSidebarItems = [
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Help", href: "/help", icon: HelpCircle },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { role } = useAuthStore();

  const sidebarItems = role === "caregiver" ? caregiverSidebarItems : familySidebarItems;
  const dashboardTitle = role === "caregiver" ? "Caregiver Dashboard" : "Family Dashboard";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:border-border lg:bg-card">
          <div className="flex flex-col flex-1 pt-6 pb-4 overflow-y-auto">
            {/* Dashboard Title */}
            <div className="px-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground">{dashboardTitle}</h2>
              <p className="text-sm text-muted-foreground mt-1">Manage your care</p>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 space-y-1">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== "/dashboard/family" && item.href !== "/dashboard/caregiver" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Navigation */}
            <div className="px-3 pt-4 mt-4 border-t border-border">
              {bottomSidebarItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main id="main-content" className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
