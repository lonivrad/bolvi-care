"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useNotificationsStore, useMessagesStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Menu,
  X,
  MessageSquare,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Heart,
  Calendar,
  BarChart3,
  Shield,
  HelpCircle,
  Briefcase,
  Search,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CommandPalette } from "@/components/navigation/command-palette";

const publicNavItems = [
  { label: "Find Care", href: "/caregivers" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "For Caregivers", href: "/auth/signup/caregiver" },
  { label: "Safety", href: "/safety" },
  { label: "Community", href: "/community" },
];

const familyNavItems = [
  { label: "Find Care", href: "/caregivers" },
  { label: "My Bookings", href: "/dashboard/family/bookings" },
  { label: "Care Team", href: "/dashboard/family/care-team" },
  { label: "Community", href: "/community" },
];

const caregiverNavItems = [
  { label: "Dashboard", href: "/dashboard/caregiver" },
  { label: "Jobs", href: "/dashboard/caregiver/jobs" },
  { label: "Earnings", href: "/dashboard/caregiver/earnings" },
  { label: "Training", href: "/training" },
];

const adminNavItems = [
  { label: "Overview", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Bookings", href: "/admin/bookings" },
  { label: "Verifications", href: "/admin/verifications" },
  { label: "Financials", href: "/admin/financials" },
];

export function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const unreadNotifications = useNotificationsStore((s) => s.getUnreadCount());
  const unreadMessages = useMessagesStore((s) => s.getTotalUnread());

  // Get role from session (FAMILY, CAREGIVER, ADMIN)
  const sessionRole = session?.user?.role?.toLowerCase() as 'family' | 'caregiver' | 'admin' | undefined;
  const isLoggedIn = status === 'authenticated' && session?.user;

  const navItems = sessionRole === 'family' ? familyNavItems
    : sessionRole === 'caregiver' ? caregiverNavItems
    : sessionRole === 'admin' ? adminNavItems
    : publicNavItems;

  // Use session user data - only set photo if user actually has one
  const currentUser = isLoggedIn ? {
    name: session.user.name || 'User',
    email: session.user.email || '',
    photo: session.user.image || null, // null means show initials instead
  } : null;

  // Handle logout
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={sessionRole ? `/dashboard/${sessionRole}` : "/"} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-semibold text-foreground">Bolvi Care</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search / Command Palette Trigger */}
          <Button
            variant="outline"
            className="hidden sm:flex items-center gap-2 text-muted-foreground h-9 px-3"
            onClick={() => setCommandOpen(true)}
          >
            <Search className="h-4 w-4" />
            <span className="text-sm">Search...</span>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:inline-flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => setCommandOpen(true)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {isLoggedIn && (
            <>
              {/* Messages */}
              <Link href="/messages">
                <Button variant="ghost" size="icon" className="relative">
                  <MessageSquare className="h-5 w-5" />
                  {unreadMessages > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                      {unreadMessages}
                    </span>
                  )}
                  <span className="sr-only">Messages</span>
                </Button>
              </Link>

              {/* Notifications */}
              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground">
                      {unreadNotifications}
                    </span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </Link>
            </>
          )}

          {/* User Menu / Auth */}
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 pl-2 pr-1">
                  {currentUser.photo ? (
                    <Image
                      src={currentUser.photo}
                      alt={currentUser.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden text-sm font-medium sm:inline">{currentUser.name.split(' ')[0]}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{currentUser.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">{currentUser.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {sessionRole === 'family' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/family"><Calendar className="mr-2 h-4 w-4" />Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/family/care-recipients"><User className="mr-2 h-4 w-4" />Care Recipients</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/family/analytics"><BarChart3 className="mr-2 h-4 w-4" />Analytics</Link>
                    </DropdownMenuItem>
                  </>
                )}

                {sessionRole === 'caregiver' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/caregiver"><Briefcase className="mr-2 h-4 w-4" />Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/caregiver/availability"><Calendar className="mr-2 h-4 w-4" />Availability</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/caregiver/analytics"><BarChart3 className="mr-2 h-4 w-4" />Analytics</Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuItem asChild>
                  <Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/help"><HelpCircle className="mr-2 h-4 w-4" />Help Center</Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup/caregiver">Join as Caregiver</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-card md:hidden">
          <nav className="flex flex-col px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {!isLoggedIn && (
              <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                <Button variant="outline" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/auth/login">Log in</Link>
                </Button>
                <Button asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/auth/signup/caregiver">Join as Caregiver</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* Command Palette */}
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </header>
  );
}
