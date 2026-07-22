"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Search,
  Home,
  Calendar,
  Users,
  DollarSign,
  Settings,
  HelpCircle,
  MessageSquare,
  Bell,
  FileText,
  Heart,
  Clock,
  Shield,
  TrendingUp,
  Briefcase,
  BookOpen,
  Phone,
  LogOut,
  User,
  CreditCard,
  Activity,
  Gift,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PageItem {
  name: string;
  href: string;
  icon: React.ElementType;
  shortcut?: string;
}

const familyPages: PageItem[] = [
  { name: "Dashboard", href: "/dashboard/family", icon: Home, shortcut: "⌘D" },
  { name: "Find Caregivers", href: "/caregivers", icon: Search },
  { name: "My Bookings", href: "/dashboard/family/bookings", icon: Calendar },
  { name: "Care Team", href: "/dashboard/family/care-team", icon: Users },
  { name: "Care Recipients", href: "/dashboard/family/care-recipients", icon: Heart },
  { name: "Health Tracking", href: "/dashboard/family/health-tracking", icon: Activity },
  { name: "Spending & Analytics", href: "/dashboard/family/analytics", icon: TrendingUp },
  { name: "Referral Program", href: "/dashboard/family/referrals", icon: Gift },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help Center", href: "/help", icon: HelpCircle },
];

const caregiverPages: PageItem[] = [
  { name: "Dashboard", href: "/dashboard/caregiver", icon: Home, shortcut: "⌘D" },
  { name: "Job Requests", href: "/dashboard/caregiver/requests", icon: Bell },
  { name: "My Jobs", href: "/dashboard/caregiver/jobs", icon: Briefcase },
  { name: "Availability", href: "/dashboard/caregiver/availability", icon: Clock },
  { name: "Earnings", href: "/dashboard/caregiver/earnings", icon: DollarSign },
  { name: "Tax Center", href: "/dashboard/caregiver/taxes", icon: FileText },
  { name: "Analytics", href: "/dashboard/caregiver/analytics", icon: TrendingUp },
  { name: "Referral Program", href: "/dashboard/caregiver/referrals", icon: Gift },
  { name: "Training", href: "/training", icon: BookOpen },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help Center", href: "/help", icon: HelpCircle },
];

const publicPages: PageItem[] = [
  { name: "Find Care", href: "/caregivers", icon: Search },
  { name: "How It Works", href: "/how-it-works", icon: HelpCircle },
  { name: "For Caregivers", href: "/auth/signup/caregiver", icon: Users },
  { name: "Safety", href: "/safety", icon: Shield },
  { name: "Pricing", href: "/pricing", icon: CreditCard },
  { name: "Community", href: "/community", icon: Heart },
  { name: "Contact Us", href: "/contact", icon: Phone },
  { name: "Sign In", href: "/auth/login", icon: User },
];

const quickActionsFamily = [
  { name: "Book a Caregiver", href: "/caregivers", icon: Calendar, description: "Find and book care" },
  { name: "Send Message", href: "/messages", icon: MessageSquare, description: "Chat with your team" },
  { name: "View Schedule", href: "/dashboard/family/bookings", icon: Clock, description: "See upcoming visits" },
  { name: "Get Help", href: "/help", icon: HelpCircle, description: "Support & FAQs" },
];

const quickActionsCaregiver = [
  { name: "View Job Requests", href: "/dashboard/caregiver/requests", icon: Bell, description: "See new opportunities" },
  { name: "Set Availability", href: "/dashboard/caregiver/availability", icon: Clock, description: "Update your schedule" },
  { name: "View Earnings", href: "/dashboard/caregiver/earnings", icon: DollarSign, description: "Track your income" },
  { name: "Get Help", href: "/help", icon: HelpCircle, description: "Support & FAQs" },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  // Get role from session
  const sessionRole = session?.user?.role?.toLowerCase() as 'family' | 'caregiver' | 'admin' | undefined;
  const isLoggedIn = !!session?.user;

  const pages = sessionRole === "family" ? familyPages
    : sessionRole === "caregiver" ? caregiverPages
    : publicPages;

  const quickActions = sessionRole === "caregiver" ? quickActionsCaregiver : quickActionsFamily;

  // Filter pages based on search
  const filteredPages = searchQuery
    ? pages.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : pages;

  // Check if we have any results when searching
  const hasNoResults = searchQuery && filteredPages.length === 0;

  const handleSelect = useCallback((href: string) => {
    onOpenChange(false);
    setSearchQuery("");
    router.push(href);
  }, [onOpenChange, router]);

  const handleLogout = useCallback(async () => {
    onOpenChange(false);
    await signOut({ callbackUrl: "/" });
  }, [onOpenChange]);

  // Keyboard shortcut to open
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  // Reset search when closing. Intentionally driven by the `open` prop; this
  // only runs on an open/close toggle, so the extra render is harmless.
  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional reset on close
      setSearchQuery("");
    }
  }, [open]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command className="rounded-lg border-0">
        <CommandInput
          placeholder="Search pages, caregivers, or actions..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList className="max-h-[400px]">
          {/* Empty state - only show when searching with no results */}
          {hasNoResults && (
            <div className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 text-sm font-medium text-muted-foreground">No results found</p>
              <p className="mt-1 text-xs text-muted-foreground">Try a different search term</p>
            </div>
          )}

          {/* Quick Actions - only show when not searching and logged in */}
          {!searchQuery && isLoggedIn && (
            <>
              <CommandGroup heading="Quick Actions">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <CommandItem
                      key={action.name}
                      onSelect={() => handleSelect(action.href)}
                      className="flex items-center gap-4 px-4 py-3"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{action.name}</p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator className="my-2" />
            </>
          )}

          {/* Pages - only show when there are results */}
          {filteredPages.length > 0 && (
            <CommandGroup heading="Pages">
              {filteredPages.map((page) => {
                const Icon = page.icon;
                return (
                  <CommandItem
                    key={page.name}
                    onSelect={() => handleSelect(page.href)}
                    className="flex items-center gap-3 px-4 py-2.5"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="flex-1">{page.name}</span>
                    {page.shortcut && (
                      <CommandShortcut>{page.shortcut}</CommandShortcut>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {isLoggedIn && !hasNoResults && (
            <>
              <CommandSeparator className="my-2" />
              <CommandGroup heading="Account">
                <CommandItem
                  onSelect={() => handleSelect("/settings")}
                  className="flex items-center gap-3 px-4 py-2.5"
                >
                  <Settings className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1">Settings</span>
                  <CommandShortcut>⌘,</CommandShortcut>
                </CommandItem>
                <CommandItem
                  onSelect={handleLogout}
                  className="flex items-center gap-3 px-4 py-2.5 text-destructive"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span className="flex-1">Log out</span>
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>

        <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-3">
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <kbd className="inline-flex h-5 min-w-[20px] items-center justify-center rounded border bg-background px-1.5 font-mono text-[10px]">
                ↑↓
              </kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="inline-flex h-5 min-w-[20px] items-center justify-center rounded border bg-background px-1.5 font-mono text-[10px]">
                ↵
              </kbd>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="inline-flex h-5 min-w-[20px] items-center justify-center rounded border bg-background px-1.5 font-mono text-[10px]">
                esc
              </kbd>
              <span>Close</span>
            </div>
          </div>
        </div>
      </Command>
    </CommandDialog>
  );
}
