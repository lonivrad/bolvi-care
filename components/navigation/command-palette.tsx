"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
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
  Star,
  MapPin,
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
import { useAuthStore } from "@/lib/store";
import { caregivers } from "@/lib/mock-data";

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
  { name: "Find Caregivers", href: "/caregivers", icon: Search, shortcut: "⌘K" },
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

const quickActions = [
  { name: "Book a Caregiver", href: "/caregivers", icon: Calendar, description: "Find and book care" },
  { name: "Send Message", href: "/messages", icon: MessageSquare, description: "Chat with your team" },
  { name: "View Schedule", href: "/dashboard/family/bookings", icon: Clock, description: "See upcoming visits" },
  { name: "Get Help", href: "/help", icon: HelpCircle, description: "Support & FAQs" },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { role } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter caregivers based on search
  const filteredCaregivers = caregivers
    .filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .slice(0, 4);

  const pages = role === "family" ? familyPages : role === "caregiver" ? caregiverPages : publicPages;

  const handleSelect = useCallback((href: string) => {
    onOpenChange(false);
    router.push(href);
  }, [onOpenChange, router]);

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

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Search pages, caregivers, or actions..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>
            <div className="py-6 text-center">
              <Search className="mx-auto h-10 w-10 text-muted-foreground/30" />
              <p className="mt-2 text-sm text-muted-foreground">No results found</p>
              <p className="text-xs text-muted-foreground">Try a different search term</p>
            </div>
          </CommandEmpty>

          {/* Quick Actions */}
          {!searchQuery && role && (
            <CommandGroup heading="Quick Actions">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <CommandItem
                    key={action.name}
                    onSelect={() => handleSelect(action.href)}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{action.name}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          <CommandSeparator />

          {/* Caregivers Search Results */}
          {searchQuery && filteredCaregivers.length > 0 && (
            <CommandGroup heading="Caregivers">
              {filteredCaregivers.map((caregiver) => (
                <CommandItem
                  key={caregiver.id}
                  onSelect={() => handleSelect(`/caregivers/${caregiver.id}`)}
                  className="flex items-center gap-3 py-2"
                >
                  <Image
                    src={caregiver.photo}
                    alt={caregiver.name}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{caregiver.name}</p>
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {caregiver.rating}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {caregiver.specialties.slice(0, 2).join(" · ")}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    ${caregiver.hourlyRate}/hr
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Pages */}
          <CommandGroup heading="Pages">
            {pages.map((page) => {
              const Icon = page.icon;
              return (
                <CommandItem
                  key={page.name}
                  onSelect={() => handleSelect(page.href)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span>{page.name}</span>
                  {page.shortcut && (
                    <CommandShortcut>{page.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>

          {role && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Account">
                <CommandItem onSelect={() => handleSelect("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </CommandItem>
                <CommandItem onSelect={() => handleSelect("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                  <CommandShortcut>⌘,</CommandShortcut>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    onOpenChange(false);
                    // Handle logout
                  }}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>

        <div className="border-t px-3 py-2 text-xs text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-2">
            <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 inline-flex">
              ↑↓
            </kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 inline-flex">
              ↵
            </kbd>
            <span>Select</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 inline-flex">
              esc
            </kbd>
            <span>Close</span>
          </div>
        </div>
      </Command>
    </CommandDialog>
  );
}
