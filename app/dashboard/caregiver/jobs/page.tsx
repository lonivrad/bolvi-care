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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
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
  Send,
} from "lucide-react";

const jobListings = [
  {
    id: "job-1",
    title: "Weekly Companion Care",
    family: "Johnson Family",
    location: "Seattle, WA",
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
    location: "Bellevue, WA",
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
    location: "Kirkland, WA",
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
    location: "Redmond, WA",
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
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [distanceFilter, setDistanceFilter] = useState("all");
  const [scheduleFilter, setScheduleFilter] = useState("all");
  const [savedJobs, setSavedJobs] = useState<string[]>(["job-2"]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<typeof jobListings[0] | null>(null);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs((prev) => {
      const newSaved = prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId];

      toast({
        title: prev.includes(jobId) ? "Removed from saved" : "Job saved",
        description: prev.includes(jobId)
          ? "Job removed from your saved list"
          : "Job added to your saved list",
        variant: "success",
      });

      return newSaved;
    });
  };

  const handleApplyClick = (job: typeof jobListings[0]) => {
    setSelectedJob(job);
    setApplicationMessage("");
    setApplyDialogOpen(true);
  };

  const submitApplication = async () => {
    if (!selectedJob) return;
    setIsApplying(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setAppliedJobIds((prev) => [...prev, selectedJob.id]);
    setIsApplying(false);
    setApplyDialogOpen(false);

    toast({
      title: "Application submitted!",
      description: `Your application for "${selectedJob.title}" has been sent to ${selectedJob.family}.`,
      variant: "success",
    });
  };

  // Filter jobs based on search and filters
  const filteredJobs = jobListings.filter((job) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        job.title.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.needs.some(n => n.toLowerCase().includes(query)) ||
        job.family.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Distance filter
    if (distanceFilter !== "all") {
      const jobDistance = parseFloat(job.distance);
      if (distanceFilter === "5" && jobDistance > 5) return false;
      if (distanceFilter === "10" && jobDistance > 10) return false;
      if (distanceFilter === "25" && jobDistance > 25) return false;
    }

    // Schedule filter
    if (scheduleFilter !== "all") {
      const schedule = job.schedule.toLowerCase();
      if (scheduleFilter === "weekday" && !schedule.includes("mon") && !schedule.includes("tue") && !schedule.includes("wed") && !schedule.includes("thu") && !schedule.includes("fri")) return false;
      if (scheduleFilter === "weekend" && !schedule.includes("sat") && !schedule.includes("sun")) return false;
      if (scheduleFilter === "evening" && !schedule.includes("pm")) return false;
    }

    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending Review</Badge>;
      case "interview":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Interview Scheduled</Badge>;
      case "declined":
        return <Badge variant="outline">Not Selected</Badge>;
      case "accepted":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Accepted</Badge>;
      default:
        return null;
    }
  };

  // Combine initial applied jobs with newly applied ones
  const allAppliedJobs = [
    ...appliedJobs,
    ...appliedJobIds.map(id => {
      const job = jobListings.find(j => j.id === id);
      return job ? {
        id: job.id,
        title: job.title,
        family: job.family,
        status: "pending",
        appliedDate: new Date().toISOString().split('T')[0],
        rate: job.rate,
      } : null;
    }).filter(Boolean) as typeof appliedJobs,
  ];

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
        <CardContent className="p-6">
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
            <Select value={distanceFilter} onValueChange={setDistanceFilter}>
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
            <Select value={scheduleFilter} onValueChange={setScheduleFilter}>
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
          {(searchQuery || distanceFilter !== "all" || scheduleFilter !== "all") && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""} found
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setDistanceFilter("all");
                  setScheduleFilter("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
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
          {filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-medium">No jobs found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </CardContent>
            </Card>
          ) : null}
          {filteredJobs.map((job) => (
            <Card key={job.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Card Header: Title + Rate */}
                <div className="flex items-start justify-between gap-4 p-4 pb-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-foreground">
                        {job.title}
                      </h3>
                      <span className="text-lg font-bold text-primary">{job.rate}</span>
                      {job.urgent && (
                        <Badge variant="secondary" className="text-xs">Urgent</Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 -mr-2 -mt-1"
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

                {/* Schedule & Location Row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 pt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {job.schedule}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {job.distance} away
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    {job.careRecipient.name}, {job.careRecipient.age}
                  </span>
                </div>

                {/* Description (1-2 lines) */}
                <p className="px-4 pt-3 text-sm text-muted-foreground line-clamp-2">
                  {job.description}
                </p>

                {/* Care Needs Tags */}
                <div className="flex flex-wrap gap-1.5 px-4 pt-3">
                  {job.needs.slice(0, 3).map((need) => (
                    <Badge key={need} variant="secondary" className="font-normal">
                      {need}
                    </Badge>
                  ))}
                  {job.needs.length > 3 && (
                    <Badge variant="outline" className="font-normal text-muted-foreground">
                      +{job.needs.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Footer: Metadata + CTA */}
                <div className="flex items-center justify-between gap-4 p-4 pt-3">
                  <span className="text-xs text-muted-foreground">
                    {job.posted} • {job.applicants + (appliedJobIds.includes(job.id) ? 1 : 0)} applied
                  </span>
                  {appliedJobIds.includes(job.id) ? (
                    <Button disabled variant="secondary" size="sm">
                      <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                      Applied
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => handleApplyClick(job)}>
                      View & Apply
                    </Button>
                  )}
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
                <CardContent className="p-6">
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
                  Save jobs you&apos;re interested in to review later
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="applied" className="mt-6 space-y-4">
          {allAppliedJobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="p-6">
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

      {/* Apply Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
            <DialogDescription>
              Send your application to {selectedJob?.family}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedJob && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {selectedJob.location}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {selectedJob.schedule}
                  </span>
                  <span className="font-medium text-green-600">
                    {selectedJob.rate}
                  </span>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="message">Introduction message</Label>
              <Textarea
                id="message"
                placeholder="Tell the family why you'd be a great fit for this role..."
                value={applicationMessage}
                onChange={(e) => setApplicationMessage(e.target.value)}
                rows={5}
              />
              <p className="text-xs text-muted-foreground">
                A personalized message increases your chances of getting hired
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitApplication} disabled={isApplying}>
              {isApplying ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
