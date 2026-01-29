"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Briefcase, ArrowRight, Check } from "lucide-react";

type Role = "family" | "caregiver" | null;

export default function SignupPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  const handleContinue = () => {
    if (selectedRole === "family") {
      router.push("/auth/signup/family");
    } else if (selectedRole === "caregiver") {
      router.push("/auth/signup/caregiver");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto mb-4 flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">ElderCare</span>
          </Link>
          <CardTitle className="text-2xl">Join ElderCare</CardTitle>
          <CardDescription>Choose how you want to use ElderCare</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <button
            type="button"
            onClick={() => setSelectedRole("family")}
            className={`relative w-full rounded-lg border-2 p-6 text-left transition-all hover:border-primary/50 ${
              selectedRole === "family" ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            {selectedRole === "family" && (
              <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-4 w-4" />
              </div>
            )}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">I need care for a loved one</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Find trusted caregivers, schedule visits, and manage care for your family member
                </p>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-primary" /> Browse verified caregivers
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-primary" /> Book and manage appointments
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-primary" /> Receive visit updates
                  </li>
                </ul>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("caregiver")}
            className={`relative w-full rounded-lg border-2 p-6 text-left transition-all hover:border-primary/50 ${
              selectedRole === "caregiver" ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            {selectedRole === "caregiver" && (
              <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-4 w-4" />
              </div>
            )}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/50">
                <Briefcase className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">I want to provide care</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Join our network of caregivers, set your own schedule, and help families in need
                </p>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-primary" /> Set your own rates
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-primary" /> Flexible scheduling
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-primary" /> Build your client base
                  </li>
                </ul>
              </div>
            </div>
          </button>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button onClick={handleContinue} className="w-full" disabled={!selectedRole}>
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
