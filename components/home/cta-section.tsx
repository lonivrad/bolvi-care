import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="rounded-2xl bg-primary px-8 py-12 lg:px-16 lg:py-16 text-center">
          <h2 className="font-serif text-3xl font-bold text-primary-foreground sm:text-4xl text-balance">
            Ready to Find Trusted Care?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Join thousands of families who have found peace of mind with Bolvi Care. Start your search today.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/caregivers">
                Find Caregivers
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10" asChild>
              <Link href="/contact">
                <Phone className="mr-2 h-5 w-5" />
                Talk to Our Team
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-primary-foreground/60">
            No commitment required. Browse caregivers for free.
          </p>
        </div>
      </div>
    </section>
  );
}
