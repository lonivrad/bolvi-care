"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Home,
  Calendar,
  Users,
  Heart,
  Activity,
  TrendingUp,
  Gift,
  Settings,
  HelpCircle,
  MessageSquare,
  Bell,
  ChevronLeft,
  ChevronRight,
  Search,
  Briefcase,
  Clock,
  DollarSign,
  FileText,
  BookOpen,
  Star,
  Shield,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeVariant?: "default" | "secondary" | "destructive";
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const familyNavSections: NavSection[] = [
  {
    items: [
      { name: "Dashboard", href: "/dashboard/family", icon: Home },
      { name: "Find Care", href: "/caregivers", icon: Search },
    ],
  },
  {
    title: "Care Management",
    items: [
      { name: "Bookings", href: "/dashboard/family/bookings", icon: Calendar, badge: 2, badgeVariant: "default" },
      { name: "Care Team", href: "/dashboard/family/care-team", icon: Users },
      { name: "Care Recipients", href: "/dashboard/family/care-recipients", icon: Heart },
      { name: "Health Tracking", href: "/dashboard/family/health-tracking", icon: Activity },
    ],
  },
  {
    title: "Insights",
    items: [
      { name: "Analytics", href: "/dashboard/family/analytics", icon: TrendingUp },
      { name: "Referrals", href: "/dashboard/family/referrals", icon: Gift, badge: "$50", badgeVariant: "secondary" },
    ],
  },
];

const caregiverNavSections: NavSection[] = [
  {
    items: [
      { name: "Dashboard", href: "/dashboard/caregiver", icon: Home },
    ],
  },
  {
    title: "Work",
    items: [
      { name: "Job Requests", href: "/dashboard/caregiver/requests", icon: Bell, badge: 3, badgeVariant: "destructive" },
      { name: "My Jobs", href: "/dashboard/caregiver/jobs", icon: Briefcase },
      { name: "Availability", href: "/dashboard/caregiver/availability", icon: Clock },
    ],
  },
  {
    title: "Earnings",
    items: [
      { name: "Earnings", href: "/dashboard/caregiver/earnings", icon: DollarSign },
      { name: "Tax Center", href: "/dashboard/caregiver/taxes", icon: FileText },
      { name: "Analytics", href: "/dashboard/caregiver/analytics", icon: TrendingUp },
      { name: "Referrals", href: "/dashboard/caregiver/referrals", icon: Gift },
    ],
  },
  {
    title: "Growth",
    items: [
      { name: "Training", href: "/training", icon: BookOpen },
    ],
  },
];

const bottomNavItems: NavItem[] = [
  { name: "Messages", href: "/messages", icon: MessageSquare, badge: 2 },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help", href: "/help", icon: HelpCircle },
];

interface DashboardSidebarProps {
  userType: "family" | "caregiver";
}

export function DashboardSidebar({ userType }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { familyUser, caregiverUser, setRole } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const user = userType === "family" ? familyUser : caregiverUser;
  const navSections = userType === "family" ? familyNavSections : caregiverNavSections;

  const isActive = (href: string) => {
    if (href === "/dashboard/family" || href === "/dashboard/caregiver") {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r bg-card transition-all duration-300",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        {/* User Profile */}
        <div className={cn(
          "p-4 border-b",
          collapsed && "px-2"
        )}>
          <div className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center"
          )}>
            <div className="relative shrink-0">
              <Image
                src={user?.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
                alt={user?.name || "User"}
                width={collapsed ? 36 : 44}
                height={collapsed ? 36 : 44}
                className="rounded-full ring-2 ring-border"
              />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-card" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground capitalize">{userType} Account</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-2">
          <nav className="space-y-1 px-2">
            {navSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-1">
                {section.title && !collapsed && (
                  <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.title}
                  </p>
                )}
                {section.title && collapsed && (
                  <Separator className="my-2" />
                )}
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  const linkContent = (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                        collapsed && "justify-center px-2"
                      )}
                    >
                      <Icon className={cn("h-5 w-5 shrink-0", active && "text-primary-foreground")} />
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.name}</span>
                          {item.badge && (
                            <Badge
                              variant={item.badgeVariant || "secondary"}
                              className={cn(
                                "h-5 px-1.5 text-xs",
                                active && item.badgeVariant !== "destructive" && "bg-primary-foreground/20 text-primary-foreground"
                              )}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>
                  );

                  if (collapsed) {
                    return (
                      <Tooltip key={item.name}>
                        <TooltipTrigger asChild>
                          {linkContent}
                        </TooltipTrigger>
                        <TooltipContent side="right" className="flex items-center gap-2">
                          {item.name}
                          {item.badge && (
                            <Badge variant={item.badgeVariant || "secondary"} className="h-5 px-1.5">
                              {item.badge}
                            </Badge>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return <div key={item.name}>{linkContent}</div>;
                })}
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Bottom Actions */}
        <div className="border-t p-2 space-y-1">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  collapsed && "justify-center px-2"
                )}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.badge && !collapsed && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    {linkContent}
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.name}</TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.name}>{linkContent}</div>;
          })}

          <Separator className="my-2" />

          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn("w-full justify-start", collapsed && "justify-center")}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Collapse
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
