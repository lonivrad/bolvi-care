import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Fetch the actual role from database to ensure it's current
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  // Use database role as source of truth (session might have stale data)
  const role = dbUser?.role || session.user.role;

  console.log("[Dashboard] Session role:", session.user.role, "DB role:", dbUser?.role, "Using:", role);

  // Check if user needs onboarding
  if (role === "CAREGIVER") {
    const profile = await prisma.caregiverProfile.findUnique({
      where: { userId: session.user.id },
      select: { isNew: true, bio: true, hourlyRate: true },
    });

    // Redirect to onboarding if profile is new or incomplete
    if (profile?.isNew || !profile?.bio) {
      redirect("/onboarding/caregiver");
    }

    redirect("/dashboard/caregiver");
  } else if (role === "ADMIN") {
    redirect("/admin");
  } else {
    // Family role
    const profile = await prisma.familyProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true, preferences: true },
    });

    if (profile) {
      const careRecipients = await prisma.careRecipient.count({
        where: { familyProfileId: profile.id },
      });

      // Check if onboarding is complete
      const preferences = profile.preferences as { onboardingComplete?: boolean } | null;

      // Redirect to onboarding if no care recipients and onboarding not marked complete
      if (careRecipients === 0 && !preferences?.onboardingComplete) {
        redirect("/onboarding/family");
      }
    }

    redirect("/dashboard/family");
  }
}
