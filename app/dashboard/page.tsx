import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const role = session.user.role;

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
