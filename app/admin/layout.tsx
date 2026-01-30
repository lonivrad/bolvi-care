"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/lib/store";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  DollarSign,
  AlertTriangle,
  Settings,
  Heart,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Ticket,
  BarChart3,
  FileText,
  Tag,
  Activity,
  Database,
  Shield,
  MessageSquare,
  Flag,
  BookOpen,
  Globe,
  Zap,
  Clock,
  Menu,
  X,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavSection {
  title: string;
  items: {
    label: string;
    href: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeVariant?: "default" | "destructive" | "secondary";
  }[];
}

const adminNavSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "Activity Log", href: "/admin/activity", icon: Activity },
    ],
  },
  {
    title: "User Management",
    items: [
      { label: "All Users", href: "/admin/users", icon: Users },
      { label: "Verifications", href: "/admin/verifications", icon: ShieldCheck, badge: 12, badgeVariant: "destructive" },
      { label: "Reports & Flags", href: "/admin/reports", icon: Flag, badge: 5, badgeVariant: "destructive" },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Bookings", href: "/admin/bookings", icon: BookOpen },
      { label: "Disputes", href: "/admin/disputes", icon: AlertTriangle, badge: 3 },
      { label: "Support Tickets", href: "/admin/support", icon: Ticket, badge: 8 },
      { label: "Incidents", href: "/admin/incidents", icon: Shield },
    ],
  },
  {
    title: "Finance",
    items: [
      { label: "Financials", href: "/admin/financials", icon: DollarSign },
      { label: "Payouts", href: "/admin/payouts", icon: DollarSign },
      { label: "Promotions", href: "/admin/promotions", icon: Tag },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Moderation", href: "/admin/moderation", icon: MessageSquare, badge: 4 },
      { label: "Reviews", href: "/admin/reviews", icon: FileText },
      { label: "Services", href: "/admin/services", icon: Globe },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Platform Health", href: "/admin/health", icon: Zap },
      { label: "Audit Logs", href: "/admin/audit", icon: Database },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

// Flatten for quick access
const allNavItems = adminNavSections.flatMap((s) => s.items);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { role, setRole } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (role !== "admin") {
    redirect("/");
  }

  const totalBadgeCount = allNavItems.reduce((sum, item) => {
    if (typeof item.badge === "number") return sum + item.badge;
    return sum;
  }, 0);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="min-h-screen bg-muted/30">
        {/* Admin Header */}
        <header className="sticky top-0 z-50 border-b border-border bg-background">
          <div className="flex h-14 items-center justify-between px-4">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <Link href="/admin" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Heart className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-serif text-lg font-semibold hidden sm:inline">Bolvi Care</span>
                <Badge variant="destructive" className="text-[10px] px-1.5">
                  ADMIN
                </Badge>
              </Link>
            </div>

            {/* Center - Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users, bookings, disputes..."
                  className="pl-9 bg-muted/50"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Quick Actions */}
              <Button variant="ghost" size="icon" className="relative">
                <Activity className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {totalBadgeCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                    {totalBadgeCount > 99 ? "99+" : totalBadgeCount}
                  </span>
                )}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 pl-2 pr-1">
                    <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                      A
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">Admin</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>Admin User</span>
                      <span className="text-xs font-normal text-muted-foreground">admin@bolvicare.com</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/audit"><Database className="mr-2 h-4 w-4" />Audit Logs</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Switch View</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setRole("family")}>
                    <User className="mr-2 h-4 w-4" />View as Family
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRole("caregiver")}>
                    <Heart className="mr-2 h-4 w-4" />View as Caregiver
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setRole(null)} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside
            className={cn(
              "sticky top-14 h-[calc(100vh-3.5rem)] border-r border-border bg-background transition-all duration-300 overflow-y-auto",
              sidebarCollapsed ? "w-16" : "w-64",
              "hidden lg:block"
            )}
          >
            <div className="flex flex-col h-full">
              {/* Collapse Toggle */}
              <div className="flex justify-end p-2 border-b">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                  <ChevronRight className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")} />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-2 space-y-4">
                {adminNavSections.map((section) => (
                  <div key={section.title}>
                    {!sidebarCollapsed && (
                      <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {section.title}
                      </p>
                    )}
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        const linkContent = (
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                              sidebarCollapsed && "justify-center px-2"
                            )}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            {!sidebarCollapsed && (
                              <>
                                <span className="flex-1">{item.label}</span>
                                {item.badge && (
                                  <Badge
                                    variant={item.badgeVariant || "secondary"}
                                    className="h-5 px-1.5 text-[10px]"
                                  >
                                    {item.badge}
                                  </Badge>
                                )}
                              </>
                            )}
                          </Link>
                        );

                        if (sidebarCollapsed) {
                          return (
                            <Tooltip key={item.href}>
                              <TooltipTrigger asChild>
                                <div className="relative">
                                  {linkContent}
                                  {item.badge && (
                                    <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-destructive text-[9px] text-destructive-foreground">
                                      {typeof item.badge === "number" && item.badge > 9 ? "9+" : item.badge}
                                    </span>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <p>{item.label}</p>
                                {item.badge && (
                                  <p className="text-xs text-muted-foreground">{item.badge} pending</p>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          );
                        }

                        return <div key={item.href}>{linkContent}</div>;
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              {/* Help Link */}
              {!sidebarCollapsed && (
                <div className="p-4 border-t">
                  <Link
                    href="/admin/help"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Admin Documentation
                  </Link>
                </div>
              )}
            </div>
          </aside>

          {/* Mobile Sidebar */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
              <aside className="fixed left-0 top-14 bottom-0 w-72 border-r border-border bg-background overflow-y-auto">
                <nav className="p-4 space-y-4">
                  {adminNavSections.map((section) => (
                    <div key={section.title}>
                      <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {section.title}
                      </p>
                      <div className="space-y-1">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = pathname === item.href;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                  ? "bg-primary text-primary-foreground"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              )}
                            >
                              <Icon className="h-4 w-4" />
                              <span className="flex-1">{item.label}</span>
                              {item.badge && (
                                <Badge variant={item.badgeVariant || "secondary"} className="h-5 px-1.5 text-[10px]">
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>
              </aside>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-6 min-h-[calc(100vh-3.5rem)]">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
