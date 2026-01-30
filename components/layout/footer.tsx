import Link from "next/link";
import { Heart, Phone, Mail, MapPin } from "lucide-react";

const footerLinks = {
  forFamilies: [
    { label: "Find Caregivers", href: "/caregivers" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "Safety", href: "/safety" },
    { label: "Community", href: "/community" },
  ],
  forCaregivers: [
    { label: "Become a Caregiver", href: "/auth/signup/caregiver" },
    { label: "Training Center", href: "/training" },
    { label: "Success Stories", href: "/community" },
    { label: "Earnings Calculator", href: "/dashboard/caregiver/earnings" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Accessibility", href: "/accessibility" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      {/* Emergency Support Banner */}
      <div className="bg-primary/5 border-b border-primary/10">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-primary" />
              <span className="font-medium">24/7 Support:</span>
              <a href="tel:1-800-555-CARE" className="font-semibold text-primary hover:underline">
                1-800-555-CARE
              </a>
            </div>
            <div className="text-xs text-muted-foreground">
              Available around the clock for urgent care needs
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer - More Compact */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-serif text-lg font-semibold">Bolvi Care</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Trusted, verified caregivers for compassionate at-home support.
            </p>
            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                <span>Seattle, WA</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                <a href="mailto:hello@bolvicare.com" className="hover:text-foreground">
                  hello@bolvicare.com
                </a>
              </div>
            </div>
          </div>

          {/* For Families */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">For Families</h3>
            <ul className="mt-3 space-y-2">
              {footerLinks.forFamilies.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Caregivers */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">For Caregivers</h3>
            <ul className="mt-3 space-y-2">
              {footerLinks.forCaregivers.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="mt-3 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Support</h3>
            <ul className="mt-3 space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Badges - More Compact */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-border pt-6">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <svg className="h-4 w-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>100% Fully Vetted</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <svg className="h-4 w-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Insured & Bonded</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <svg className="h-4 w-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>4.9 Rating</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <svg className="h-4 w-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Secure Payments</span>
          </div>
        </div>

        {/* Bottom - More Compact */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Bolvi Care. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/cookies" className="hover:text-foreground">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
