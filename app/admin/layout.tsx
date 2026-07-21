"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
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
    title: "Quality",
    items: [
      { label: "Quality Assurance", href: "/admin/quality", icon: Shield },
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

// Searchable items for global search
const searchableItems = [
  // Users
  { type: "user", label: "Sarah Johnson", description: "Family Account", href: "/admin/users?id=u-1", icon: User },
  { type: "user", label: "Maria Rodriguez", description: "Caregiver Account", href: "/admin/users?id=u-2", icon: Heart },
  { type: "user", label: "David Kim", description: "Caregiver Account", href: "/admin/users?id=u-3", icon: Heart },
  { type: "user", label: "James Lee", description: "Caregiver Account", href: "/admin/users?id=u-4", icon: Heart },
  { type: "user", label: "Emily Thompson", description: "Caregiver Account", href: "/admin/users?id=u-5", icon: Heart },
  { type: "user", label: "Michael Chen", description: "Family Account", href: "/admin/users?id=u-6", icon: User },
  { type: "user", label: "Jennifer Williams", description: "Family Account", href: "/admin/users?id=u-7", icon: User },
  // Bookings
  { type: "booking", label: "BK-2024-1234", description: "Johnson Family - Maria Rodriguez", href: "/admin/bookings?id=BK-2024-1234", icon: BookOpen },
  { type: "booking", label: "BK-2024-1235", description: "Smith Family - Sarah Thompson", href: "/admin/bookings?id=BK-2024-1235", icon: BookOpen },
  { type: "booking", label: "BK-2024-1236", description: "Garcia Family - Emily Watson", href: "/admin/bookings?id=BK-2024-1236", icon: BookOpen },
  // Disputes
  { type: "dispute", label: "Billing Discrepancy", description: "Johnson Family vs Maria Rodriguez", href: "/admin/disputes", icon: AlertTriangle },
  { type: "dispute", label: "Service Quality Concern", description: "Smith Family vs David Kim", href: "/admin/disputes", icon: AlertTriangle },
  { type: "dispute", label: "Cancellation Fee Dispute", description: "Garcia Family vs Sarah Thompson", href: "/admin/disputes", icon: AlertTriangle },
  // Tickets
  { type: "ticket", label: "TKT-001", description: "Unable to process payment", href: "/admin/support", icon: Ticket },
  { type: "ticket", label: "TKT-002", description: "Account verification pending", href: "/admin/support", icon: Ticket },
  { type: "ticket", label: "TKT-003", description: "Caregiver didn't show up", href: "/admin/support", icon: Ticket },
  // Pages
  ...allNavItems.map(item => ({ type: "page", label: item.label, description: "Admin Page", href: item.href, icon: item.icon })),
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const role = session?.user?.role?.toLowerCase();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter search results
  const searchResults = searchQuery.length > 0
    ? searchableItems.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : [];

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (role !== "admin") {
      router.push("/");
    }
  }, [role, router]);

  // Show nothing while redirecting
  if (role !== "admin") {
    return null;
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
            <div className="hidden md:flex flex-1 max-w-md mx-4" ref={searchRef}>
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users, bookings, disputes..."
                  className="pl-9 bg-muted/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                />
                {/* Search Results Dropdown */}
                {searchFocused && searchQuery.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                    {searchResults.length > 0 ? (
                      <div className="py-1">
                        {searchResults.map((item, index) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={`${item.type}-${index}`}
                              href={item.href}
                              onClick={() => {
                                setSearchQuery("");
                                setSearchFocused(false);
                              }}
                              className="flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors"
                            >
                              <div className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center",
                                item.type === "user" && "bg-blue-100 dark:bg-blue-900/30",
                                item.type === "booking" && "bg-purple-100 dark:bg-purple-900/30",
                                item.type === "dispute" && "bg-amber-100 dark:bg-amber-900/30",
                                item.type === "ticket" && "bg-pink-100 dark:bg-pink-900/30",
                                item.type === "page" && "bg-muted"
                              )}>
                                <Icon className={cn(
                                  "h-4 w-4",
                                  item.type === "user" && "text-blue-600 dark:text-blue-400",
                                  item.type === "booking" && "text-purple-600 dark:text-purple-400",
                                  item.type === "dispute" && "text-amber-600 dark:text-amber-400",
                                  item.type === "ticket" && "text-pink-600 dark:text-pink-400",
                                  item.type === "page" && "text-muted-foreground"
                                )} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.label}</p>
                                <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                              </div>
                              <Badge variant="outline" className="text-[10px] shrink-0">
                                {item.type}
                              </Badge>
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <Search className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                        <p className="text-sm text-muted-foreground">No results found for &quot;{searchQuery}&quot;</p>
                      </div>
                    )}
                  </div>
                )}
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
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="text-destructive">
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
