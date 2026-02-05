"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error" | "no-token">(
    token ? "loading" : "no-token"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("no-token");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Your email has been verified successfully!");
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push("/auth/login?verified=true");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(data.error || "Failed to verify email. The link may have expired.");
        }
      } catch {
        setStatus("error");
        setMessage("An error occurred while verifying your email.");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="font-semibold">Bolvi Care</span>
          </div>
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>
            {status === "loading" && "Verifying your email address..."}
            {status === "success" && "Your email has been verified!"}
            {status === "error" && "Verification failed"}
            {status === "no-token" && "Check your email"}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Please wait while we verify your email...</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <p className="text-green-700">{message}</p>
              <p className="text-sm text-muted-foreground">
                Redirecting you to login...
              </p>
              <Button asChild className="mt-4">
                <Link href="/auth/login">Go to Login</Link>
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="rounded-full bg-red-100 p-3">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
              <p className="text-red-700">{message}</p>
              <div className="mt-4 space-y-2">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/auth/login">Go to Login</Link>
                </Button>
                <p className="text-sm text-muted-foreground">
                  Need a new verification link?{" "}
                  <Link href="/auth/resend-verification" className="text-primary hover:underline">
                    Resend verification email
                  </Link>
                </p>
              </div>
            </div>
          )}

          {status === "no-token" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="rounded-full bg-blue-100 p-3">
                <Mail className="h-12 w-12 text-blue-600" />
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  We&apos;ve sent a verification link to your email address.
                </p>
                <p className="text-muted-foreground">
                  Please check your inbox and click the link to verify your account.
                </p>
              </div>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p>Didn&apos;t receive the email?</p>
                <ul className="list-inside list-disc text-left">
                  <li>Check your spam or junk folder</li>
                  <li>Make sure you entered the correct email</li>
                  <li>
                    <Link href="/auth/resend-verification" className="text-primary hover:underline">
                      Resend verification email
                    </Link>
                  </li>
                </ul>
              </div>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/auth/login">Back to Login</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
