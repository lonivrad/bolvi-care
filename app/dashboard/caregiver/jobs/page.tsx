"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Star,
  Heart,
  Search,
  Filter,
  CheckCircle,
  User,
} from "lucide-react";

const jobListings = [
  {
    id: "job-1",
    title: "Weekly Companion Care",
    family: "Johnson Family",
    location: "San Francisco, CA",
    distance: "2.3 miles",
    schedule: "Mon, Wed, Fri • 9 AM - 1 PM",
    rate: "$35-40/hr",
    careRecipient: {
      name: "Eleanor",
      age: 78,
      conditions: ["Mild Dementia", "Diabetes"],
    },
    needs: ["Companionship", "Medication Reminders", "Light Housekeeping"],
    description:
      "Looking for a compassionate caregiver to provide companionship and assistance with daily activities for my mother. She enjoys reading, gardening, and conversation.",
    posted: "2 hours ago",
    applicants: 3,
    urgent: true,
    saved: false,
  },
  {
    id: "job-2",
    title: "Weekend Care Support",
    family: "Chen Family",
    location: "Oakland, CA",
    distance: "5.1 miles",
    schedule: "Sat, Sun • 8 AM - 4 PM",
    rate: "$38-45/hr",
    careRecipient: {
      name: "Robert",
      age: 82,
      conditions: ["Post-Stroke Recovery"],
    },
    needs: ["Personal Care", "Mobility Assistance", "Meal Preparation"],
    description:
      "Seeking experienced caregiver for weekend shifts to help my father with recovery exercises and daily care needs.",
    posted: "1 day ago",
    applicants: 5,
    urgent: false,
    saved: true,
  },
  {
    id: "job-3",
    title: "Evening Care Provider",
    family: "Martinez Family",
    location: "Berkeley, CA",
    distance: "7.8 miles",
    schedule: "Tue, Thu • 5 PM - 9 PM",
    rate: "$32-38/hr",
    careRecipient: {
      name: "Maria",
      age: 85,
      conditions: ["Arthritis", "Vision Impairment"],
    },
    needs: ["Dinner Preparation", "Medication Management", "Companionship"],
    description:
      "Need a reliable caregiver for evening shifts to help with dinner and bedtime routine. Spanish speaking is a plus.",
    posted: "3 days ago",
    applicants: 8,
    urgent: false,
    saved: false,
  },
  {
    id: "job-4",
    title: "Full-Time Dementia Care",
    family: "Williams Family",
    location: "Palo Alto, CA",
    distance: "12.4 miles",
    schedule: "Mon-Fri • 7 AM - 3 PM",
    rate: "$42-50/hr",
    careRecipient: {
      name: "Helen",
      age: 75,
      conditions: ["Alzheimer's Disease"],
    },
    needs: ["Dementia Care", "Personal Care", "Activities", "Supervision"],
    description:
      "Looking for an experienced dementia caregiver for full-time position. Must have patience, dementia training, and ability to engage in meaningful activities.",
    posted: "5 days ago",
    applicants: 12,
    urgent: false,
    saved: false,
  },
];

const appliedJobs = [
  {
    id: "app-1",
    title: "Daily Morning Care",
    family: "Thompson Family",
    status: "pending",
    appliedDate: "2024-02-28",
    rate: "$35/hr",
  },
  {
    id: "app-2",
    title: "Overnight Care Support",
    family: "Garcia Family",
    status: "interview",
    appliedDate: "2024-02-25",
    rate: "$40/hr",
  },
  {
    id: "app-3",
    title: "Part-Time Companion",
    family: "Lee Family",
    status: "declined",
    appliedDate: "2024-02-20",
    rate: "$32/hr",
  },
];

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [savedJobs, setSavedJobs] = useState<string[]>(["job-2"]);

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending Review</Badge>;
      case "interview":
        return <Badge className="bg-blue-100 text-blue-800">Interview Scheduled</Badge>;
      case "declined":
        return <Badge variant="outline">Not Selected</Badge>;
      case "accepted":
        return <Badge className="bg-green-100 text-green-800">Accepted</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Find Jobs</h1>
        <p className="text-muted-foreground">
          Browse available care opportunities in your area
        </p>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search jobs by title, location, or needs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Distance</SelectItem>
                <SelectItem value="5">Within 5 miles</SelectItem>
                <SelectItem value="10">Within 10 miles</SelectItem>
                <SelectItem value="25">Within 25 miles</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Schedule</SelectItem>
                <SelectItem value="weekday">Weekdays</SelectItem>
                <SelectItem value="weekend">Weekends</SelectItem>
                <SelectItem value="evening">Evenings</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="browse">
        <TabsList>
          <TabsTrigger value="browse">
            <Briefcase className="mr-2 h-4 w-4" />
            Browse Jobs
          </TabsTrigger>
          <TabsTrigger value="saved">
            <Heart className="mr-2 h-4 w-4" />
            Saved ({savedJobs.length})
          </TabsTrigger>
          <TabsTrigger value="applied">
            <CheckCircle className="mr-2 h-4 w-4" />
            Applied ({appliedJobs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="mt-6 space-y-4">
          {jobListings.map((job) => (
            <Card key={job.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Main Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {job.title}
                          </h3>
                          {job.urgent && (
                            <Badge variant="destructive">Urgent</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{job.family}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSaveJob(job.id)}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            savedJobs.includes(job.id)
                              ? "fill-red-500 text-red-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      </Button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {job.location} ({job.distance})
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {job.schedule}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-green-600">
                        <DollarSign className="h-4 w-4" />
                        {job.rate}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-muted-foreground">
                      {job.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {job.needs.map((need) => (
                        <Badge key={need} variant="outline">
                          {need}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Care Recipient Info */}
                  <div className="lg:w-64">
                    <div className="rounded-lg border border-border p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Care Recipient</span>
                      </div>
                      <p className="font-medium">
                        {job.careRecipient.name}, {job.careRecipient.age}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {job.careRecipient.conditions.map((condition) => (
                          <Badge key={condition} variant="secondary" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Posted {job.posted}</span>
                    <span>{job.applicants} applicants</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">View Details</Button>
                    <Button>Apply Now</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="saved" className="mt-6 space-y-4">
          {jobListings
            .filter((job) => savedJobs.includes(job.id))
            .map((job) => (
              <Card key={job.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {job.family} • {job.location}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {job.schedule}
                        </span>
                        <span className="font-medium text-green-600">
                          {job.rate}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSaveJob(job.id)}
                      >
                        <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                      </Button>
                      <Button>Apply</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          {savedJobs.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium">No saved jobs</h3>
                <p className="text-sm text-muted-foreground">
                  Save jobs you're interested in to review later
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="applied" className="mt-6 space-y-4">
          {appliedJobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{job.title}</h3>
                      {getStatusBadge(job.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {job.family} • {job.rate}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Applied on{" "}
                      {new Date(job.appliedDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Button variant="outline">View Application</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
