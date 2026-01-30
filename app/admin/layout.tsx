"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  DollarSign,
  AlertTriangle,
  Settings,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminNav = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Verifications", href: "/admin/verifications", icon: ShieldCheck },
  { label: "Financials", href: "/admin/financials", icon: DollarSign },
  { label: "Disputes", href: "/admin/disputes", icon: AlertTriangle },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { role } = useAuthStore();

  if (role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="flex h-16 items-center px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-serif text-xl font-semibold">Bolvi Care</span>
            <span className="ml-2 rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
              Admin
            </span>
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 border-r border-border bg-card">
          <nav className="flex flex-col gap-1 p-4">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
