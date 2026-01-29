"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Star,
  MapPin,
  Clock,
  Calendar,
  Shield,
  Heart,
  MessageCircle,
  Share2,
  CheckCircle,
  Award,
  Car,
  Languages,
  Briefcase,
  ArrowLeft,
} from "lucide-react";
import { mockCaregivers, mockReviews } from "@/lib/mock-data";

export default function CaregiverProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const caregiver = mockCaregivers.find((c) => c.id === id) || mockCaregivers[0];
  const reviews = mockReviews.filter((r) => r.caregiverId === caregiver.id);

  const ratingBreakdown = [
    { stars: 5, percentage: 85 },
    { stars: 4, percentage: 10 },
    { stars: 3, percentage: 3 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 1 },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/caregivers"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to search
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6 sm:flex-row">
                    <div className="relative">
                      <Image
                        src={caregiver.avatar || "/placeholder.svg"}
                        alt={`${caregiver.firstName} ${caregiver.lastName}`}
                        width={160}
                        height={160}
                        className="rounded-xl object-cover"
                      />
                      {caregiver.verified && (
                        <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h1 className="text-2xl font-bold">
                            {caregiver.firstName} {caregiver.lastName}
                          </h1>
                          <p className="text-muted-foreground">{caregiver.tagline}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="font-medium">{caregiver.rating}</span>
                          <span className="text-muted-foreground">({caregiver.reviewCount} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {caregiver.location.city}, {caregiver.location.state}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {caregiver.yearsExperience} years experience
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {caregiver.verified && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            <Shield className="mr-1 h-3 w-3" /> Background Checked
                          </Badge>
                        )}
                        {caregiver.certifications.slice(0, 2).map((cert) => (
                          <Badge key={cert} variant="secondary">
                            <Award className="mr-1 h-3 w-3" /> {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="availability">Availability</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-4 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About {caregiver.firstName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{caregiver.bio}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Facts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Briefcase className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Experience</p>
                            <p className="font-medium">{caregiver.yearsExperience} years</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Languages className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Languages</p>
                            <p className="font-medium">{caregiver.languages.join(", ")}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Car className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Transportation</p>
                            <p className="font-medium">{caregiver.hasTransportation ? "Has own vehicle" : "Public transit"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Response Time</p>
                            <p className="font-medium">Within 2 hours</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Certifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {caregiver.certifications.map((cert) => (
                          <Badge key={cert} variant="outline" className="py-1.5">
                            <Award className="mr-1.5 h-3.5 w-3.5 text-primary" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="services" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Services Offered</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {caregiver.services.map((service) => (
                          <div key={service} className="flex items-center gap-3 rounded-lg border p-3">
                            <CheckCircle className="h-5 w-5 text-primary" />
                            <span>{service}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-4 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Rating Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                        <div className="text-center">
                          <div className="text-5xl font-bold">{caregiver.rating}</div>
                          <div className="mt-1 flex justify-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < Math.floor(caregiver.rating)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{caregiver.reviewCount} reviews</p>
                        </div>
                        <div className="flex-1 space-y-2">
                          {ratingBreakdown.map((item) => (
                            <div key={item.stars} className="flex items-center gap-2">
                              <span className="w-3 text-sm">{item.stars}</span>
                              <Star className="h-4 w-4 text-amber-400" />
                              <Progress value={item.percentage} className="h-2 flex-1" />
                              <span className="w-10 text-right text-sm text-muted-foreground">{item.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <Card key={review.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarImage src={review.clientAvatar} />
                                <AvatarFallback>{review.clientName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">{review.clientName}</h4>
                                  <span className="text-sm text-muted-foreground">{review.date}</span>
                                </div>
                                <div className="mt-1 flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center text-muted-foreground">
                        No reviews yet for this caregiver.
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="availability" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Weekly Availability</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        {Object.entries(caregiver.availability).map(([day, slots]) => (
                          <div key={day} className="flex items-center justify-between rounded-lg border p-3">
                            <span className="font-medium capitalize">{day}</span>
                            {slots.length > 0 ? (
                              <div className="flex gap-2">
                                {slots.map((slot, i) => (
                                  <Badge key={i} variant="secondary">
                                    {slot}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">Not available</span>
                            )}
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
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="mb-4 text-center">
                    <div className="text-3xl font-bold text-primary">${caregiver.hourlyRate}</div>
                    <p className="text-sm text-muted-foreground">per hour</p>
                  </div>

                  <div className="space-y-3">
                    <Link href={`/book/${caregiver.id}`}>
                      <Button className="w-full" size="lg">
                        <Calendar className="mr-2 h-4 w-4" /> Book Now
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full" size="lg">
                      <MessageCircle className="mr-2 h-4 w-4" /> Send Message
                    </Button>
                  </div>

                  <div className="mt-6 space-y-3 border-t pt-6 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Response rate</span>
                      <span className="font-medium">98%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Response time</span>
                      <span className="font-medium">~2 hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Bookings completed</span>
                      <span className="font-medium">{caregiver.completedBookings}+</span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg bg-muted/50 p-4 text-center">
                    <Shield className="mx-auto h-6 w-6 text-primary" />
                    <p className="mt-2 text-sm font-medium">100% Satisfaction Guarantee</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      If you&apos;re not satisfied with your first visit, we&apos;ll refund it.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
