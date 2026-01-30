"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Award,
  Clock,
  Play,
  CheckCircle,
  Star,
  Search,
  Filter,
  Lock,
  Users,
  Heart,
  Brain,
  Shield,
  Pill,
} from "lucide-react";

const courses = [
  {
    id: "c-1",
    title: "Dementia Care Fundamentals",
    description:
      "Learn essential techniques for providing compassionate care to individuals with dementia and Alzheimer's disease.",
    category: "Specialized Care",
    duration: "4 hours",
    modules: 8,
    enrolled: 2847,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=200&fit=crop",
    status: "in_progress",
    progress: 65,
    certificate: true,
    icon: Brain,
  },
  {
    id: "c-2",
    title: "Medication Management & Safety",
    description:
      "Master safe medication administration, storage, and documentation practices for home care settings.",
    category: "Medical Skills",
    duration: "3 hours",
    modules: 6,
    enrolled: 3421,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=200&fit=crop",
    status: "completed",
    progress: 100,
    certificate: true,
    icon: Pill,
  },
  {
    id: "c-3",
    title: "Fall Prevention & Mobility Support",
    description:
      "Techniques to prevent falls and safely assist clients with mobility challenges.",
    category: "Safety",
    duration: "2 hours",
    modules: 5,
    enrolled: 2156,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=200&fit=crop",
    status: "not_started",
    progress: 0,
    certificate: true,
    icon: Shield,
  },
  {
    id: "c-4",
    title: "Effective Communication with Seniors",
    description:
      "Build stronger relationships through improved communication techniques with elderly clients.",
    category: "Soft Skills",
    duration: "2 hours",
    modules: 4,
    enrolled: 1892,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=400&h=200&fit=crop",
    status: "not_started",
    progress: 0,
    certificate: false,
    icon: Heart,
  },
  {
    id: "c-5",
    title: "CPR & First Aid Certification",
    description:
      "Get certified in CPR and basic first aid for emergency response in care situations.",
    category: "Certifications",
    duration: "6 hours",
    modules: 10,
    enrolled: 4521,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&h=200&fit=crop",
    status: "not_started",
    progress: 0,
    certificate: true,
    icon: Shield,
  },
  {
    id: "c-6",
    title: "Nutrition & Meal Planning for Seniors",
    description:
      "Learn to prepare nutritious meals that meet the dietary needs of elderly clients.",
    category: "Daily Care",
    duration: "2.5 hours",
    modules: 5,
    enrolled: 1654,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=200&fit=crop",
    status: "not_started",
    progress: 0,
    certificate: false,
    icon: Heart,
  },
];

const certificates = [
  {
    id: "cert-1",
    title: "Medication Management & Safety",
    issueDate: "2024-02-15",
    expiryDate: "2026-02-15",
    credentialId: "MMS-2024-78923",
  },
];

const categories = [
  "All",
  "Specialized Care",
  "Medical Skills",
  "Safety",
  "Soft Skills",
  "Certifications",
  "Daily Care",
];

export default function TrainingCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const inProgressCourses = courses.filter((c) => c.status === "in_progress");
  const completedCourses = courses.filter((c) => c.status === "completed");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="secondary">
            <Play className="mr-1 h-3 w-3" />
            In Progress
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Training Center</h1>
          <p className="text-muted-foreground">
            Expand your skills and earn certifications
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Total Courses</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{courses.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">In Progress</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{inProgressCourses.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{completedCourses.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Certificates</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{certificates.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="my-courses">My Courses</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {/* Search & Filters */}
          <div className="flex flex-col gap-4 sm:flex-row mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => {
              const Icon = course.icon;
              return (
                <Card key={course.id} className="overflow-hidden">
                  <div className="relative h-40">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary">{course.category}</Badge>
                    </div>
                    {course.certificate && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-purple-100 text-purple-800">
                          <Award className="mr-1 h-3 w-3" />
                          Certificate
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-foreground">{course.title}</h3>
                      {getStatusBadge(course.status)}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {course.modules} modules
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {course.rating}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {course.enrolled.toLocaleString()} enrolled
                      </span>
                    </div>
                    {course.status === "in_progress" && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} />
                      </div>
                    )}
                    <Button className="w-full mt-4">
                      {course.status === "completed"
                        ? "Review Course"
                        : course.status === "in_progress"
                        ? "Continue Learning"
                        : "Start Course"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="my-courses" className="mt-6">
          <div className="space-y-6">
            {inProgressCourses.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">In Progress</h2>
                <div className="grid gap-4">
                  {inProgressCourses.map((course) => (
                    <Card key={course.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="h-20 w-32 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{course.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {course.modules} modules • {course.duration}
                            </p>
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>{course.progress}% complete</span>
                              </div>
                              <Progress value={course.progress} />
                            </div>
                          </div>
                          <Button>Continue</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {completedCourses.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Completed</h2>
                <div className="grid gap-4">
                  {completedCourses.map((course) => (
                    <Card key={course.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <img
                              src={course.image}
                              alt={course.title}
                              className="h-16 w-24 rounded-lg object-cover"
                            />
                            <div>
                              <h3 className="font-semibold">{course.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                Completed • {course.duration}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {course.certificate && (
                              <Button variant="outline">
                                <Award className="mr-2 h-4 w-4" />
                                View Certificate
                              </Button>
                            )}
                            <Button variant="ghost">Review</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="certificates" className="mt-6">
          {certificates.length > 0 ? (
            <div className="grid gap-4">
              {certificates.map((cert) => (
                <Card key={cert.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                          <Award className="h-8 w-8 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{cert.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Issued: {cert.issueDate} • Expires: {cert.expiryDate}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Credential ID: {cert.credentialId}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">Download</Button>
                        <Button>Share</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Award className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium">No certificates yet</h3>
                <p className="text-sm text-muted-foreground">
                  Complete courses with certificate badges to earn credentials
                </p>
                <Button className="mt-4">Browse Courses</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
