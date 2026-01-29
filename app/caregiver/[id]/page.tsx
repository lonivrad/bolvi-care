"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/ui/star-rating";
import { CaregiverCard } from "@/components/caregivers/caregiver-card";
import { caregivers, reviews } from "@/lib/mock-data";
import {
  Heart,
  MessageSquare,
  MapPin,
  Clock,
  Calendar,
  Shield,
  CheckCircle,
  Zap,
  Star,
  Award,
  Share2,
  ChevronLeft,
} from "lucide-react";

const servicePricing = [
  { name: "Basic Visit", description: "Companionship, light tasks, conversation", rate: 30 },
  { name: "Enhanced Care", description: "Personal care, medication reminders, meal prep", rate: 45 },
  { name: "Specialized Support", description: "Dementia care, mobility assistance, medical support", rate: 60 },
];

export default function CaregiverProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const caregiver = caregivers.find((c) => c.id === id);
  
  if (!caregiver) {
    notFound();
  }

  const caregiverReviews = reviews.filter((r) => r.caregiverId === id);
  const similarCaregivers = caregivers
    .filter((c) => c.id !== id && c.specialties.some((s) => caregiver.specialties.includes(s)))
    .slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <Link href="/find-care" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
              Back to Search
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6 sm:flex-row">
                    <div className="relative">
                      <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-xl sm:h-48 sm:w-48">
                        <Image
                          src={caregiver.photo}
                          alt={caregiver.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {caregiver.availability === 'available' && (
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-accent-foreground" />
                          Available Now
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-foreground">{caregiver.name}</h1>
                            {caregiver.isFeatured && (
                              <Badge className="bg-primary">Featured</Badge>
                            )}
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-secondary text-secondary" />
                              <span className="font-medium text-foreground">{caregiver.rating}</span>
                              ({caregiver.reviewCount} reviews)
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {caregiver.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Award className="h-4 w-4" />
                              {caregiver.yearsExperience} years experience
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{caregiver.responseTime}</span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {caregiver.badges.slice(0, 5).map((badge) => (
                          <Badge key={badge} variant="secondary" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            {badge}
                          </Badge>
                        ))}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {caregiver.languages.map((lang) => (
                          <Badge key={lang} variant="outline">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="services">Services & Pricing</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews ({caregiverReviews.length})</TabsTrigger>
                  <TabsTrigger value="availability">Availability</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About Me</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{caregiver.bio}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Specialties</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {caregiver.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Certifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {caregiver.certifications.map((cert) => (
                          <div key={cert} className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-accent" />
                            <span>{cert}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-foreground">{caregiver.completedVisits}</p>
                          <p className="text-sm text-muted-foreground">Completed Visits</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-foreground">{caregiver.yearsExperience}</p>
                          <p className="text-sm text-muted-foreground">Years Experience</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-foreground">{caregiver.rating}</p>
                          <p className="text-sm text-muted-foreground">Average Rating</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="services" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Service Packages</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {servicePricing.map((service, index) => (
                        <div
                          key={service.name}
                          className="flex items-center justify-between rounded-lg border border-border p-4"
                        >
                          <div>
                            <h4 className="font-semibold text-foreground">{service.name}</h4>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-foreground">${service.rate}</p>
                            <p className="text-sm text-muted-foreground">per hour</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6 space-y-4">
                  {caregiverReviews.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Star className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-semibold">No reviews yet</h3>
                        <p className="mt-2 text-muted-foreground">Be the first to leave a review!</p>
                      </CardContent>
                    </Card>
                  ) : (
                    caregiverReviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Image
                                src={review.authorPhoto}
                                alt={review.authorName}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                              <div>
                                <p className="font-medium text-foreground">{review.authorName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(review.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <StarRating rating={review.rating} size="sm" />
                              {review.verified && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="mt-4 text-muted-foreground">{review.content}</p>
                          {review.caregiverResponse && (
                            <div className="mt-4 rounded-lg bg-muted p-4">
                              <p className="text-sm font-medium text-foreground">Response from {caregiver.name}</p>
                              <p className="mt-1 text-sm text-muted-foreground">{review.caregiverResponse}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="availability" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Weekly Availability</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                          <div key={day} className="flex items-center justify-between rounded-lg border border-border p-3">
                            <span className="font-medium">{day}</span>
                            <span className="text-muted-foreground">
                              {day === 'Saturday' || day === 'Sunday' ? 'Not available' : '8:00 AM - 6:00 PM'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Card */}
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Starting at</p>
                    <p className="text-4xl font-bold text-foreground">${caregiver.hourlyRate}</p>
                    <p className="text-muted-foreground">per hour</p>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-3">
                    <Button className="w-full gap-2" size="lg" asChild>
                      <Link href={`/book/${caregiver.id}`}>
                        {caregiver.instantBook && <Zap className="h-4 w-4" />}
                        {caregiver.instantBook ? "Book Instantly" : "Request to Book"}
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full gap-2" size="lg">
                      <MessageSquare className="h-4 w-4" />
                      Send Message
                    </Button>
                  </div>

                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    Free cancellation up to 24 hours before
                  </p>
                </CardContent>
              </Card>

              {/* Trust Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground">Trust & Safety</h3>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-5 w-5 text-accent" />
                      <span>Background Check Verified</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      <span>Identity Verified</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      <span>References Checked</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Similar Caregivers */}
          {similarCaregivers.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-foreground">Similar Caregivers</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {similarCaregivers.map((cg) => (
                  <CaregiverCard key={cg.id} caregiver={cg} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
