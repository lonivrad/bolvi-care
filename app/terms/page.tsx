"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Users, CreditCard, Shield, AlertTriangle, Scale } from "lucide-react";

export default function TermsPage() {
  const lastUpdated = "January 15, 2025";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Terms of Service</h1>
          <p className="mt-2 text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed">
                Welcome to Bolvi Care. By accessing or using our platform, you agree to be bound by these
                Terms of Service. Please read them carefully before using our services.
              </p>
            </CardContent>
          </Card>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  By creating an account or using Bolvi Care, you acknowledge that you have read, understood,
                  and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree
                  to these terms, you may not use our services.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">2. Platform Description</h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Bolvi Care is a marketplace platform that connects families seeking at-home support services
                  with independent caregivers. We provide:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>A platform to search for and connect with caregivers</li>
                  <li>Background check facilitation for caregivers</li>
                  <li>Booking and scheduling tools</li>
                  <li>Secure payment processing</li>
                  <li>Communication tools between families and caregivers</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  <strong>Important:</strong> Bolvi Care is a marketplace platform only. Caregivers are
                  independent contractors, not employees of Bolvi Care. We do not directly provide care
                  services.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">3. User Responsibilities</h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">For All Users:</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Comply with all applicable laws and regulations</li>
                    <li>Treat other users with respect and professionalism</li>
                    <li>Report any suspicious or inappropriate behavior</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">For Caregivers:</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Maintain valid certifications and licenses</li>
                    <li>Complete required background checks</li>
                    <li>Provide services as described in your profile</li>
                    <li>Maintain appropriate insurance coverage</li>
                    <li>Honor all booking commitments</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">For Families:</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Provide accurate information about care needs</li>
                    <li>Ensure a safe environment for caregivers</li>
                    <li>Make timely payments for services</li>
                    <li>Communicate changes in care requirements promptly</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">4. Payments & Fees</h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-4">
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>All payments are processed through our secure payment system</li>
                  <li>Families pay caregivers' hourly rates plus a platform service fee</li>
                  <li>Caregivers receive their earnings minus a platform fee</li>
                  <li>Cancellation fees may apply per our cancellation policy</li>
                  <li>Payment is due at the time of booking or upon service completion</li>
                  <li>Refunds are subject to our refund policy</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">5. Limitations of Liability</h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Bolvi Care provides a platform to connect families and caregivers but is not responsible for:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>The quality of care services provided by caregivers</li>
                  <li>Actions or omissions of any user</li>
                  <li>Disputes between families and caregivers</li>
                  <li>Loss or damage arising from use of our services</li>
                  <li>Accuracy of information provided by users</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  To the maximum extent permitted by law, Bolvi Care's liability is limited to the
                  amount of fees paid to us in the twelve months preceding any claim.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">6. Dispute Resolution</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  Any disputes arising from these Terms or your use of Bolvi Care shall be resolved through
                  binding arbitration in accordance with the rules of the American Arbitration Association.
                  The arbitration shall take place in Seattle, Washington, and the decision of the arbitrator
                  shall be final and binding.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contact Information</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these Terms of Service, please contact us:
                </p>
                <div className="mt-4 text-muted-foreground">
                  <p><strong>Bolvi Care Legal Team</strong></p>
                  <p>Email: legal@bolvicare.com</p>
                  <p>Address: 123 Care Street, Seattle, WA 98101</p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
