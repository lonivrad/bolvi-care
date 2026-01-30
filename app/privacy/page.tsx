"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, UserCheck, Bell } from "lucide-react";

export default function PrivacyPage() {
  const lastUpdated = "January 15, 2025";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
          <p className="mt-2 text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground leading-relaxed">
                At Bolvi Care, we take your privacy seriously. This Privacy Policy explains how we collect,
                use, disclose, and safeguard your information when you use our platform connecting families
                with caregivers for elder care services.
              </p>
            </CardContent>
          </Card>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">Information We Collect</h2>
            </div>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Name, email address, phone number, and mailing address</li>
                    <li>Account credentials and profile information</li>
                    <li>Payment information (processed securely through our payment providers)</li>
                    <li>For caregivers: professional certifications, background check results, and work history</li>
                    <li>For families: care recipient information and care requirements</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Usage Information</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Device information and browser type</li>
                    <li>IP address and location data</li>
                    <li>Platform usage patterns and preferences</li>
                    <li>Communication history within the platform</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">How We Use Your Information</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>To facilitate connections between families and caregivers</li>
                  <li>To verify caregiver credentials and conduct background checks</li>
                  <li>To process payments and manage bookings</li>
                  <li>To provide customer support and respond to inquiries</li>
                  <li>To send important updates about our services</li>
                  <li>To improve our platform and develop new features</li>
                  <li>To ensure the safety and security of our community</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">Information Security</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground leading-relaxed">
                  We implement industry-standard security measures to protect your personal information, including:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                  <li>SSL/TLS encryption for all data transmission</li>
                  <li>Secure data storage with encryption at rest</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Access controls limiting employee access to personal data</li>
                  <li>PCI DSS compliance for payment processing</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">Information Sharing</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We do not sell your personal information. We may share information with:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Other users as necessary to facilitate care services (e.g., sharing caregiver profiles with families)</li>
                  <li>Background check providers to verify caregiver credentials</li>
                  <li>Payment processors to complete transactions</li>
                  <li>Service providers who assist in operating our platform</li>
                  <li>Law enforcement when required by law or to protect safety</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">Your Rights</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Access and download your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your account and data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Restrict processing of your data</li>
                  <li>Data portability</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  To exercise these rights, contact us at privacy@bolvicare.com
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">Contact Us</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="mt-4 text-muted-foreground">
                  <p><strong>Bolvi Care Privacy Team</strong></p>
                  <p>Email: privacy@bolvicare.com</p>
                  <p>Address: 123 Care Street, Seattle, WA 98101</p>
                  <p>Phone: 1-800-BOLVI-CARE</p>
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
