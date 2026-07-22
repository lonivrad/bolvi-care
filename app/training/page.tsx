"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Users,
  Heart,
  Brain,
  Shield,
  Pill,
  AlertTriangle,
  MessageSquare,
  Scale,
  ChevronRight,
  FileText,
  Target,
  Lightbulb,
  ExternalLink,
} from "lucide-react";

// Comprehensive training courses based on CDC, NIH/NIA, CMS, and OSHA guidelines
const courses = [
  {
    id: "safety-basics",
    title: "Safety Basics",
    description: "Essential safety training for non-licensed caregivers providing in-home support to older adults. Learn to identify risks, prevent falls, use proper lifting techniques, and respond to emergencies.",
    category: "Core Training",
    duration: "2.5 hours",
    modules: [
      {
        id: "sb-1",
        title: "Fall Prevention & Risk Assessment",
        duration: "30 min",
        objectives: [
          "Identify fall risk factors in a home environment",
          "Conduct a basic home safety assessment",
          "Implement fall prevention strategies"
        ],
        topics: ["Environmental hazards", "Lighting assessment", "Furniture placement", "Footwear safety", "Bathroom safety"]
      },
      {
        id: "sb-2",
        title: "Safe Lifting & Body Mechanics",
        duration: "35 min",
        objectives: [
          "Demonstrate proper lifting techniques",
          "Safely assist a client from bed to chair",
          "Use transfer aids appropriately"
        ],
        topics: ["OSHA lifting guidelines", "Pivot transfers", "Gait belts", "Slide boards", "Preventing caregiver injury"]
      },
      {
        id: "sb-3",
        title: "Emergency Response",
        duration: "40 min",
        objectives: [
          "Recognize signs of medical emergencies",
          "Activate emergency services appropriately",
          "Provide basic first aid until help arrives"
        ],
        topics: ["When to call 911", "Choking response", "Stroke signs (FAST)", "Heart attack symptoms", "Falls with injury"]
      },
      {
        id: "sb-4",
        title: "Infection Prevention",
        duration: "25 min",
        objectives: [
          "Practice proper hand hygiene",
          "Use personal protective equipment correctly",
          "Implement infection control measures"
        ],
        topics: ["CDC hand hygiene guidelines", "PPE usage", "Cleaning vs disinfecting", "Respiratory hygiene"]
      }
    ],
    enrolled: 3847,
    rating: 4.9,
    status: "not_started",
    progress: 0,
    certificate: true,
    icon: Shield,
    sources: ["CDC", "OSHA", "NIH"],
    color: "blue"
  },
  {
    id: "dementia-care",
    title: "Dementia Care Fundamentals",
    description: "Comprehensive training on providing compassionate, effective care for individuals with dementia and Alzheimer's disease. Based on NIH/NIA evidence-based approaches.",
    category: "Specialized Care",
    duration: "3 hours",
    modules: [
      {
        id: "dc-1",
        title: "Understanding Dementia",
        duration: "30 min",
        objectives: [
          "Explain different types of dementia",
          "Describe how dementia affects the brain",
          "Recognize stages of progression"
        ],
        topics: ["Alzheimer's disease", "Vascular dementia", "Lewy body dementia", "Frontotemporal dementia", "Disease progression"]
      },
      {
        id: "dc-2",
        title: "Communication Strategies",
        duration: "40 min",
        objectives: [
          "Use effective verbal communication techniques",
          "Interpret non-verbal cues and body language",
          "Adapt communication as dementia progresses"
        ],
        topics: ["Simple sentences", "Visual cues", "Active listening", "Tone and approach", "Validation therapy basics"]
      },
      {
        id: "dc-3",
        title: "Managing Behavioral Changes",
        duration: "45 min",
        objectives: [
          "Identify common behavioral symptoms",
          "Implement non-pharmacological interventions",
          "Document and report behavioral patterns"
        ],
        topics: ["Agitation triggers", "Sundowning", "Wandering prevention", "Sleep disturbances", "Repetitive behaviors"]
      },
      {
        id: "dc-4",
        title: "De-escalation Techniques",
        duration: "35 min",
        objectives: [
          "Recognize escalating situations early",
          "Apply calming techniques safely",
          "Redirect attention appropriately"
        ],
        topics: ["Warning signs", "Creating calm environments", "Distraction techniques", "When to step back", "Self-care during difficult moments"]
      },
      {
        id: "dc-5",
        title: "Daily Care Activities",
        duration: "30 min",
        objectives: [
          "Assist with ADLs while maintaining dignity",
          "Create structured routines",
          "Adapt activities to abilities"
        ],
        topics: ["Bathing assistance", "Dressing support", "Mealtime strategies", "Activity engagement", "Maintaining independence"]
      }
    ],
    enrolled: 2847,
    rating: 4.9,
    status: "not_started",
    progress: 0,
    certificate: true,
    icon: Brain,
    sources: ["NIH/NIA", "Alzheimer's Association", "CDC"],
    color: "purple"
  },
  {
    id: "medication-awareness",
    title: "Medication Awareness",
    description: "Essential knowledge about medication safety, documentation, and knowing the boundaries of caregiver responsibilities. Learn what caregivers can and cannot do with medications.",
    category: "Medical Skills",
    duration: "2 hours",
    modules: [
      {
        id: "ma-1",
        title: "Caregiver Scope & Limitations",
        duration: "25 min",
        objectives: [
          "Define what caregivers CAN do with medications",
          "Identify what requires licensed professionals",
          "Know when to contact healthcare providers"
        ],
        topics: ["Reminding vs administering", "State regulations", "PRN medications", "Insulin/injections", "Controlled substances"]
      },
      {
        id: "ma-2",
        title: "Medication Red Flags",
        duration: "30 min",
        objectives: [
          "Recognize adverse drug reactions",
          "Identify medication errors before they happen",
          "Escalate concerns appropriately"
        ],
        topics: ["Common side effects", "Drug interactions", "Signs of overdose", "Allergic reactions", "When to call the pharmacist"]
      },
      {
        id: "ma-3",
        title: "Safe Storage & Handling",
        duration: "25 min",
        objectives: [
          "Store medications properly",
          "Handle medication safely",
          "Dispose of medications appropriately"
        ],
        topics: ["Temperature requirements", "Expiration dates", "Child/pet safety", "Sharps disposal", "Medication disposal"]
      },
      {
        id: "ma-4",
        title: "Documentation Best Practices",
        duration: "40 min",
        objectives: [
          "Document medication assistance accurately",
          "Report concerns to appropriate parties",
          "Maintain medication logs"
        ],
        topics: ["What to document", "MAR basics", "Error reporting", "Communication with family", "HIPAA considerations"]
      }
    ],
    enrolled: 3421,
    rating: 4.8,
    status: "not_started",
    progress: 0,
    certificate: true,
    icon: Pill,
    sources: ["CMS", "FDA", "State Board Guidelines"],
    color: "green"
  },
  {
    id: "ethics-boundaries",
    title: "Professional Boundaries & Ethics",
    description: "Critical training on recognizing abuse/neglect, understanding your scope of practice, and navigating complex family dynamics while maintaining professional boundaries.",
    category: "Professional Development",
    duration: "2.5 hours",
    modules: [
      {
        id: "eb-1",
        title: "Abuse & Neglect Recognition",
        duration: "40 min",
        objectives: [
          "Identify signs of physical, emotional, and financial abuse",
          "Recognize indicators of neglect and self-neglect",
          "Know mandatory reporting requirements"
        ],
        topics: ["Physical abuse signs", "Emotional abuse indicators", "Financial exploitation", "Neglect vs self-neglect", "Reporting procedures"]
      },
      {
        id: "eb-2",
        title: "Scope of Caregiver Role",
        duration: "30 min",
        objectives: [
          "Define caregiver responsibilities clearly",
          "Identify tasks outside your scope",
          "Know when to decline requests appropriately"
        ],
        topics: ["ADL vs IADL assistance", "Medical vs non-medical tasks", "Saying no professionally", "Care plan boundaries", "Documentation of scope"]
      },
      {
        id: "eb-3",
        title: "Family Dynamics",
        duration: "35 min",
        objectives: [
          "Navigate conflicting family instructions",
          "Maintain professional neutrality",
          "Communicate boundaries effectively"
        ],
        topics: ["Multiple decision-makers", "Family conflicts", "Professional distance", "Avoiding taking sides", "Escalation to supervisor"]
      },
      {
        id: "eb-4",
        title: "Personal & Professional Boundaries",
        duration: "25 min",
        objectives: [
          "Maintain appropriate professional relationships",
          "Protect personal information",
          "Handle gifts and gratuities appropriately"
        ],
        topics: ["Social media policies", "Personal relationships", "Gift policies", "Borrowing/lending", "Professional dress and conduct"]
      }
    ],
    enrolled: 2156,
    rating: 4.9,
    status: "not_started",
    progress: 0,
    certificate: true,
    icon: Scale,
    sources: ["CMS", "State Adult Protective Services", "Professional Ethics Guidelines"],
    color: "amber"
  },
  {
    id: "client-communication",
    title: "Client Communication",
    description: "Develop essential communication skills for difficult conversations, cultural sensitivity, and knowing when and how to escalate concerns to appropriate parties.",
    category: "Soft Skills",
    duration: "2 hours",
    modules: [
      {
        id: "cc-1",
        title: "Difficult Conversations",
        duration: "35 min",
        objectives: [
          "Approach sensitive topics with compassion",
          "Deliver difficult news appropriately",
          "Handle client refusals professionally"
        ],
        topics: ["End-of-life discussions", "Hygiene conversations", "Declining abilities", "Client refuses care", "Family disagreements"]
      },
      {
        id: "cc-2",
        title: "Cultural Sensitivity",
        duration: "30 min",
        objectives: [
          "Recognize and respect cultural differences",
          "Adapt care to cultural preferences",
          "Avoid cultural assumptions and stereotypes"
        ],
        topics: ["Cultural awareness", "Religious considerations", "Food preferences", "Family structures", "Communication styles"]
      },
      {
        id: "cc-3",
        title: "Active Listening & Empathy",
        duration: "25 min",
        objectives: [
          "Practice active listening techniques",
          "Show empathy without overstepping",
          "Validate client feelings appropriately"
        ],
        topics: ["Listening skills", "Non-verbal communication", "Empathetic responses", "Avoiding advice-giving", "Being present"]
      },
      {
        id: "cc-4",
        title: "Escalation Pathways",
        duration: "30 min",
        objectives: [
          "Identify when to escalate concerns",
          "Use proper escalation channels",
          "Document escalated issues appropriately"
        ],
        topics: ["When to contact supervisor", "Healthcare provider communication", "Emergency escalation", "Family notification", "Documentation"]
      }
    ],
    enrolled: 1892,
    rating: 4.8,
    status: "not_started",
    progress: 0,
    certificate: true,
    icon: MessageSquare,
    sources: ["Joint Commission", "NIH", "Cultural Competency Guidelines"],
    color: "pink"
  }
];

// Sample scenario data for each course
const scenarioExamples = {
  "safety-basics": [
    "Client refuses to use their walker. How do you respond?",
    "You notice new bruises on client's arm. What steps do you take?",
    "Client falls while you're present but says they're fine. What do you do?"
  ],
  "dementia-care": [
    "Client insists their deceased spouse is coming home. How do you respond?",
    "Client becomes agitated during bathing. What de-escalation techniques do you use?",
    "Family gives you conflicting instructions about care. How do you handle it?"
  ],
  "medication-awareness": [
    "Client asks you to give them an extra pain pill. What do you do?",
    "You notice a medication looks different than usual. What action do you take?",
    "Client refuses their medication. How do you document and respond?"
  ],
  "ethics-boundaries": [
    "Client's adult child asks you to report on family members' visits. How do you respond?",
    "You suspect financial exploitation by a family member. What do you do?",
    "Client offers you a valuable gift. How do you handle it professionally?"
  ],
  "client-communication": [
    "Client from a different cultural background has dietary restrictions you're unfamiliar with. What do you do?",
    "Client becomes tearful about their declining independence. How do you respond?",
    "Family member is upset about care and yells at you. How do you de-escalate?"
  ]
};

const certificates = [
  {
    id: "cert-1",
    title: "Medication Awareness",
    issueDate: "2024-02-15",
    expiryDate: "2026-02-15",
    credentialId: "BC-MA-2024-78923",
  },
];

const categories = [
  "All",
  "Core Training",
  "Specialized Care",
  "Medical Skills",
  "Professional Development",
  "Soft Skills",
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
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
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

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
      purple: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800" },
      green: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", border: "border-green-200 dark:border-green-800" },
      amber: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
      pink: { bg: "bg-pink-100 dark:bg-pink-900/30", text: "text-pink-700 dark:text-pink-400", border: "border-pink-200 dark:border-pink-800" },
    };
    return colors[color] || colors.blue;
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 md:p-8">
            <h1 className="text-3xl font-bold text-foreground">Caregiver Training Center</h1>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
              Evidence-based training for non-licensed caregivers providing in-home support to older adults.
              Complete courses to earn certificates and improve your care skills.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline" className="text-sm">
                <FileText className="mr-1 h-3 w-3" />
                Based on CDC, NIH, CMS & OSHA guidelines
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Target className="mr-1 h-3 w-3" />
                Scenario-based learning
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Clock className="mr-1 h-3 w-3" />
                5-10 minute micro-modules
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">Total Courses</span>
              </div>
              <p className="mt-2 text-2xl font-bold">{courses.length}</p>
              <p className="text-xs text-muted-foreground">
                {courses.reduce((acc, c) => acc + c.modules.length, 0)} modules total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-muted-foreground">In Progress</span>
              </div>
              <p className="mt-2 text-2xl font-bold">{inProgressCourses.length}</p>
              <p className="text-xs text-muted-foreground">
                Continue learning
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <p className="mt-2 text-2xl font-bold">{completedCourses.length}</p>
              <p className="text-xs text-muted-foreground">
                {completedCourses.length > 0 ? "Great progress!" : "Get started!"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-muted-foreground">Certificates</span>
              </div>
              <p className="mt-2 text-2xl font-bold">{certificates.length}</p>
              <p className="text-xs text-muted-foreground">
                Earn credentials
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="my-courses">My Learning</TabsTrigger>
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
            <div className="grid gap-6 lg:grid-cols-2">
              {filteredCourses.map((course) => {
                const Icon = course.icon;
                const colors = getColorClasses(course.color);
                const scenarios = scenarioExamples[course.id as keyof typeof scenarioExamples] || [];

                return (
                  <Card key={course.id} className="overflow-hidden flex flex-col">
                    {/* Card Header */}
                    <CardHeader className={`${colors.bg} border-b ${colors.border} p-5`}>
                      <div className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/60 dark:bg-white/10 ${colors.text}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
                            {course.certificate && (
                              <Badge className="shrink-0 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 text-xs">
                                <Award className="mr-1 h-3 w-3" />
                                Certificate
                              </Badge>
                            )}
                          </div>
                          {/* Key stats - more prominent */}
                          <div className="flex items-center gap-3 mt-2 text-sm">
                            <span className="font-medium text-foreground">{course.duration}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">{course.modules.length} modules</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              <span className="font-medium text-foreground">{course.rating}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-5 flex-1 flex flex-col">
                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>

                      {/* Modules Preview - cleaner layout */}
                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">What you&apos;ll learn</p>
                        <div className="space-y-1.5">
                          {course.modules.slice(0, 3).map((module, i) => (
                            <div key={module.id} className="flex items-center gap-2.5 text-sm">
                              <div className={`flex h-5 w-5 items-center justify-center rounded-full ${colors.bg} ${colors.text} text-xs font-semibold`}>
                                {i + 1}
                              </div>
                              <span className="text-foreground">{module.title}</span>
                            </div>
                          ))}
                          {course.modules.length > 3 && (
                            <p className="text-xs text-muted-foreground pl-7">
                              +{course.modules.length - 3} more modules
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Spacer */}
                      <div className="flex-1 min-h-4" />

                      {/* Progress or enrollment info */}
                      {course.status === "in_progress" ? (
                        <div className="mt-4 p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="font-medium">Your progress</span>
                            <span className="text-muted-foreground">
                              {Math.floor((course.progress / 100) * course.modules.length)} of {course.modules.length} modules
                            </span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      ) : (
                        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          <span>{course.enrolled.toLocaleString()} caregivers enrolled</span>
                          <span className="text-muted-foreground/50">•</span>
                          <span>Source: {course.sources[0]}</span>
                        </div>
                      )}

                      {/* CTA */}
                      <Link href={`/training/${course.id}`} className="mt-4">
                        <Button className="w-full" variant={course.status === "in_progress" ? "default" : "outline"}>
                          {course.status === "completed"
                            ? "Review Course"
                            : course.status === "in_progress"
                            ? "Continue Learning"
                            : "Start Course"}
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="my-courses" className="mt-6">
            <div className="space-y-6">
              {inProgressCourses.length > 0 ? (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
                  <div className="grid gap-4">
                    {inProgressCourses.map((course) => {
                      const Icon = course.icon;
                      const colors = getColorClasses(course.color);
                      return (
                        <Card key={course.id}>
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <div className={`flex h-14 w-14 items-center justify-center rounded-lg ${colors.bg}`}>
                                <Icon className={`h-7 w-7 ${colors.text}`} />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold">{course.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {course.modules.length} modules • {course.duration}
                                </p>
                                <div className="mt-2">
                                  <div className="flex items-center justify-between text-sm mb-1">
                                    <span>{course.progress}% complete</span>
                                  </div>
                                  <Progress value={course.progress} />
                                </div>
                              </div>
                              <Link href={`/training/${course.id}`}>
                                <Button>Continue</Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 font-medium">No courses in progress</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Start a course to begin your learning journey
                    </p>
                    <Button className="mt-4" onClick={() => {}}>
                      Browse Courses
                    </Button>
                  </CardContent>
                </Card>
              )}

              {completedCourses.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Completed Courses</h2>
                  <div className="grid gap-4">
                    {completedCourses.map((course) => {
                      const Icon = course.icon;
                      const colors = getColorClasses(course.color);
                      return (
                        <Card key={course.id}>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${colors.bg}`}>
                                  <Icon className={`h-6 w-6 ${colors.text}`} />
                                </div>
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
                                    Certificate
                                  </Button>
                                )}
                                <Link href={`/training/${course.id}`}>
                                  <Button variant="ghost">Review</Button>
                                </Link>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="certificates" className="mt-6">
            <div className="mb-6">
              <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-200 dark:bg-purple-900">
                      <Award className="h-6 w-6 text-purple-700 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100">About Certificates</h3>
                      <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                        Bolvi Care certificates align with HCA competencies, CNA skill standards, and Joint Commission safety themes.
                        Each certificate includes a unique credential ID and can be shared with families and employers.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {certificates.length > 0 ? (
              <div className="grid gap-4">
                {certificates.map((cert) => (
                  <Card key={cert.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                            <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{cert.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Issued: {new Date(cert.issueDate).toLocaleDateString()} •
                              Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Credential ID: {cert.credentialId}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Download PDF
                          </Button>
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
                  <p className="text-sm text-muted-foreground mt-2">
                    Complete courses with certificate badges to earn professional credentials
                  </p>
                  <Button className="mt-4">Browse Courses</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </>
  );
}
