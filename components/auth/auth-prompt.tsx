"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, UserPlus, Shield, Heart, Calendar, MessageSquare } from "lucide-react";

interface AuthPromptProps {
  title?: string;
  description?: string;
  action?: string;
  showBenefits?: boolean;
}

export function AuthPrompt({
  title = "Sign in to continue",
  description = "Create an account or sign in to access this feature",
  action = "this feature",
  showBenefits = true,
}: AuthPromptProps) {
  const router = useRouter();

  const benefits = [
    { icon: Calendar, text: "Book trusted caregivers" },
    { icon: MessageSquare, text: "Message caregivers directly" },
    { icon: Heart, text: "Save favorite caregivers" },
    { icon: Shield, text: "Secure payment processing" },
  ];

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {showBenefits && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-center text-muted-foreground">
                With an account you can:
              </p>
              <div className="grid gap-2">
                {benefits.map((benefit, idx) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <Icon className="h-4 w-4 text-primary" />
                      <span>{benefit.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button
              className="w-full"
              size="lg"
              onClick={() => router.push('/auth/login')}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">New to Bolvi Care?</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              onClick={() => router.push('/auth/signup/family')}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Join as Family
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push('/auth/signup/caregiver')}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Join as Caregiver
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
