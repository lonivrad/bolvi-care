"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Search,
  Calendar,
  MessageSquare,
  User,
  Briefcase,
  DollarSign,
  Bell,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const familyNavItems: NavItem[] = [
  { name: "Home", href: "/dashboard/family", icon: Home },
  { name: "Find Care", href: "/caregivers", icon: Search },
  { name: "Bookings", href: "/dashboard/family/bookings", icon: Calendar },
  { name: "Messages", href: "/messages", icon: MessageSquare, badge: 2 },
  { name: "Account", href: "/profile", icon: User },
];

const caregiverNavItems: NavItem[] = [
  { name: "Home", href: "/dashboard/caregiver", icon: Home },
  { name: "Jobs", href: "/dashboard/caregiver/jobs", icon: Briefcase },
  { name: "Requests", href: "/dashboard/caregiver/requests", icon: Bell, badge: 3 },
  { name: "Earnings", href: "/dashboard/caregiver/earnings", icon: DollarSign },
  { name: "Account", href: "/profile", icon: User },
];

const publicNavItems: NavItem[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "Find Care", href: "/caregivers", icon: Search },
  { name: "How It Works", href: "/how-it-works", icon: Menu },
  { name: "Sign In", href: "/auth/login", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { role } = useAuthStore();

  // Don't show on auth pages
  if (pathname?.startsWith("/auth")) {
    return null;
  }

  const navItems = role === "family"
    ? familyNavItems
    : role === "caregiver"
    ? caregiverNavItems
    : publicNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[64px]",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[10px] font-medium",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.name}
              </span>
              {isActive && (
                <span className="absolute bottom-1 h-1 w-8 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
