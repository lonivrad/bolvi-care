"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ClipboardCheck,
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  FileText,
  Users,
  Star,
  Shield,
  Zap,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Plus,
  Eye,
  Download,
  RefreshCw,
  Activity,
  ListChecks,
  Workflow,
  GitBranch,
  Circle,
  CheckCircle2,
  XCircle,
  Timer,
  Award,
  BookOpen,
  MoreHorizontal,
  GripVertical,
  Play,
  Pause,
  Filter,
  Search,
  Calendar,
  UserCheck,
  AlertCircle,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Edit3,
  Copy,
  Trash2,
  ExternalLink,
  History,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Lean Six Sigma DMAIC Metrics
const dmaicMetrics = {
  define: {
    label: "Define",
    description: "Clear care requirements",
    score: 94,
    status: "excellent",
    items: [
      { name: "Care plan documented", completed: 147, total: 150 },
      { name: "Goals defined", completed: 145, total: 150 },
      { name: "Stakeholders identified", completed: 150, total: 150 },
    ],
  },
  measure: {
    label: "Measure",
    description: "Performance tracking",
    score: 87,
    status: "good",
    items: [
      { name: "Visit duration tracked", completed: 1234, total: 1250 },
      { name: "Task completion logged", completed: 4521, total: 5000 },
      { name: "Quality scores recorded", completed: 890, total: 1000 },
    ],
  },
  analyze: {
    label: "Analyze",
    description: "Root cause analysis",
    score: 82,
    status: "good",
    items: [
      { name: "Incidents analyzed", completed: 23, total: 28 },
      { name: "Trends identified", completed: 15, total: 18 },
      { name: "Correlations mapped", completed: 8, total: 10 },
    ],
  },
  improve: {
    label: "Improve",
    description: "Process optimization",
    score: 78,
    status: "needs-attention",
    items: [
      { name: "Improvements implemented", completed: 12, total: 18 },
      { name: "Training completed", completed: 45, total: 52 },
      { name: "Workflows updated", completed: 8, total: 12 },
    ],
  },
  control: {
    label: "Control",
    description: "Sustaining improvements",
    score: 91,
    status: "excellent",
    items: [
      { name: "Standards maintained", completed: 142, total: 150 },
      { name: "Audits passed", completed: 28, total: 30 },
      { name: "Compliance verified", completed: 95, total: 100 },
    ],
  },
};

// Enhanced Kanban Board Data with more details
interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  assignee: string;
  assigneeAvatar?: string;
  dueDate: string;
  type: string;
  comments?: number;
  attachments?: number;
  progress?: number;
  labels?: string[];
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  bgColor: string;
  tasks: KanbanTask[];
  limit?: number;
}

const initialKanbanColumns: KanbanColumn[] = [
  {
    id: "backlog",
    title: "Backlog",
    color: "bg-slate-500",
    bgColor: "bg-slate-50 dark:bg-slate-900/20",
    tasks: [
      {
        id: "t-1",
        title: "Annual caregiver recertification",
        description: "Review and renew certifications for all active caregivers",
        priority: "medium",
        assignee: "Quality Team",
        dueDate: "Mar 15",
        type: "compliance",
        comments: 3,
        labels: ["compliance", "annual"]
      },
      {
        id: "t-2",
        title: "Update medication management protocol",
        description: "Revise medication handling procedures based on new regulations",
        priority: "low",
        assignee: "Medical Director",
        dueDate: "Mar 20",
        type: "process",
        attachments: 2,
        labels: ["medical", "documentation"]
      },
    ],
  },
  {
    id: "todo",
    title: "To Do",
    color: "bg-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    limit: 5,
    tasks: [
      {
        id: "t-3",
        title: "Review Q1 incident reports",
        description: "Analyze all Q1 incidents and identify patterns",
        priority: "high",
        assignee: "Sarah Admin",
        dueDate: "Mar 5",
        type: "analysis",
        comments: 5,
        labels: ["urgent", "quarterly"]
      },
      {
        id: "t-4",
        title: "Caregiver feedback survey",
        description: "Design and distribute satisfaction survey to all caregivers",
        priority: "medium",
        assignee: "HR Team",
        dueDate: "Mar 8",
        type: "feedback",
        labels: ["feedback"]
      },
      {
        id: "t-5",
        title: "Update care plan template",
        description: "Incorporate new assessment fields into care plan form",
        priority: "medium",
        assignee: "Quality Team",
        dueDate: "Mar 10",
        type: "documentation",
        attachments: 1,
        labels: ["documentation"]
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    color: "bg-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    limit: 3,
    tasks: [
      {
        id: "t-6",
        title: "Background check process improvement",
        description: "Streamline vendor integration for faster turnaround",
        priority: "high",
        assignee: "Operations",
        dueDate: "Mar 3",
        type: "process",
        progress: 65,
        comments: 8,
        labels: ["improvement", "urgent"]
      },
      {
        id: "t-7",
        title: "New caregiver onboarding workflow",
        description: "Create automated onboarding checklist system",
        priority: "high",
        assignee: "Training Team",
        dueDate: "Mar 4",
        type: "training",
        progress: 40,
        comments: 4,
        attachments: 3,
        labels: ["training", "automation"]
      },
    ],
  },
  {
    id: "review",
    title: "In Review",
    color: "bg-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    limit: 3,
    tasks: [
      {
        id: "t-8",
        title: "Updated safety checklist",
        description: "New comprehensive safety verification protocol",
        priority: "high",
        assignee: "Safety Officer",
        dueDate: "Mar 2",
        type: "safety",
        progress: 90,
        comments: 12,
        attachments: 5,
        labels: ["safety", "review"]
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    color: "bg-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    tasks: [
      {
        id: "t-9",
        title: "February quality audit",
        description: "Monthly quality assurance audit completed",
        priority: "high",
        assignee: "Quality Team",
        dueDate: "Feb 28",
        type: "audit",
        progress: 100,
        labels: ["audit", "completed"]
      },
      {
        id: "t-10",
        title: "Emergency protocol training",
        description: "All caregivers completed emergency response training",
        priority: "high",
        assignee: "Training Team",
        dueDate: "Feb 25",
        type: "training",
        progress: 100,
        comments: 6,
        labels: ["training", "completed"]
      },
    ],
  },
];

// Care Verification Checklists
const verificationChecklists = [
  {
    id: "pre-visit",
    name: "Pre-Visit Verification",
    description: "Ensure caregiver is prepared before arrival",
    items: [
      { id: "pv-1", label: "Review care recipient's care plan", required: true },
      { id: "pv-2", label: "Confirm visit schedule with family", required: true },
      { id: "pv-3", label: "Check medication list is current", required: true },
      { id: "pv-4", label: "Verify emergency contacts are accessible", required: true },
      { id: "pv-5", label: "Review any special instructions or alerts", required: true },
      { id: "pv-6", label: "Ensure required supplies are available", required: false },
    ],
    completionRate: 94,
  },
  {
    id: "arrival",
    name: "Arrival Checklist",
    description: "Document arrival and initial assessment",
    items: [
      { id: "ar-1", label: "Clock in via app with GPS verification", required: true },
      { id: "ar-2", label: "Greet care recipient and assess mood/condition", required: true },
      { id: "ar-3", label: "Check vital signs if required", required: false },
      { id: "ar-4", label: "Review any changes since last visit", required: true },
      { id: "ar-5", label: "Confirm tasks for today's visit", required: true },
    ],
    completionRate: 97,
  },
  {
    id: "during-visit",
    name: "During Visit Tasks",
    description: "Track task completion during care",
    items: [
      { id: "dv-1", label: "Complete all scheduled care tasks", required: true },
      { id: "dv-2", label: "Administer medications as prescribed", required: true },
      { id: "dv-3", label: "Document any incidents or concerns", required: true },
      { id: "dv-4", label: "Maintain safe environment", required: true },
      { id: "dv-5", label: "Engage in meaningful activities", required: false },
      { id: "dv-6", label: "Prepare meals if required", required: false },
    ],
    completionRate: 91,
  },
  {
    id: "departure",
    name: "Departure Checklist",
    description: "Ensure proper handoff and documentation",
    items: [
      { id: "dp-1", label: "Complete visit summary notes", required: true },
      { id: "dp-2", label: "Document all tasks completed", required: true },
      { id: "dp-3", label: "Report any concerns to family/supervisor", required: true },
      { id: "dp-4", label: "Ensure care recipient is safe and comfortable", required: true },
      { id: "dp-5", label: "Clock out via app with GPS verification", required: true },
      { id: "dp-6", label: "Schedule follow-up if needed", required: false },
    ],
    completionRate: 96,
  },
];

// Workflow Templates
const workflowTemplates = [
  {
    id: "wf-1",
    name: "New Client Onboarding",
    category: "Client Management",
    steps: 8,
    avgDuration: "3-5 days",
    completions: 47,
    successRate: 98,
  },
  {
    id: "wf-2",
    name: "Caregiver Verification",
    category: "HR & Compliance",
    steps: 12,
    avgDuration: "7-14 days",
    completions: 156,
    successRate: 95,
  },
  {
    id: "wf-3",
    name: "Incident Response",
    category: "Safety & Quality",
    steps: 6,
    avgDuration: "24-48 hours",
    completions: 23,
    successRate: 100,
  },
  {
    id: "wf-4",
    name: "Care Plan Review",
    category: "Care Management",
    steps: 5,
    avgDuration: "2-3 days",
    completions: 89,
    successRate: 97,
  },
  {
    id: "wf-5",
    name: "Quality Audit",
    category: "Quality Assurance",
    steps: 10,
    avgDuration: "5-7 days",
    completions: 12,
    successRate: 100,
  },
  {
    id: "wf-6",
    name: "Complaint Resolution",
    category: "Customer Service",
    steps: 7,
    avgDuration: "3-5 days",
    completions: 34,
    successRate: 94,
  },
];

// Quality Metrics with more detail
const qualityMetrics = [
  { label: "Overall Quality Score", value: 4.87, max: 5, trend: 0.12, isPositive: true, icon: Star, color: "text-amber-500" },
  { label: "Task Completion Rate", value: 94.2, max: 100, trend: 2.1, isPositive: true, icon: CheckCircle, color: "text-green-500" },
  { label: "On-Time Arrival", value: 97.8, max: 100, trend: 1.5, isPositive: true, icon: Clock, color: "text-blue-500" },
  { label: "Documentation Compliance", value: 91.5, max: 100, trend: 3.2, isPositive: true, icon: FileText, color: "text-purple-500" },
];

// Recent quality events for activity feed
const recentQualityEvents = [
  { id: "e-1", type: "audit", message: "Quality audit completed for Seattle region", time: "2 hours ago", status: "success" },
  { id: "e-2", type: "checklist", message: "Visit checklist compliance dropped below 95%", time: "4 hours ago", status: "warning" },
  { id: "e-3", type: "workflow", message: "New incident response workflow activated", time: "6 hours ago", status: "info" },
  { id: "e-4", type: "training", message: "12 caregivers completed safety certification", time: "1 day ago", status: "success" },
  { id: "e-5", type: "improvement", message: "Medication verification process updated", time: "1 day ago", status: "info" },
];

export default function QualityAssurancePage() {
  const [selectedChecklist, setSelectedChecklist] = useState<typeof verificationChecklists[0] | null>(null);
  const [checklistDialogOpen, setChecklistDialogOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<typeof workflowTemplates[0] | null>(null);
  const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false);
  const [kanbanColumns, setKanbanColumns] = useState(initialKanbanColumns);
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [kanbanFilter, setKanbanFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dmaic");

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "good": return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      case "needs-attention": return "text-amber-600 bg-amber-100 dark:bg-amber-900/30";
      case "critical": return "text-red-600 bg-red-100 dark:bg-red-900/30";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      case "medium": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "low": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "compliance": return Shield;
      case "process": return Workflow;
      case "analysis": return BarChart3;
      case "feedback": return MessageSquare;
      case "documentation": return FileText;
      case "training": return BookOpen;
      case "safety": return AlertCircle;
      case "audit": return ClipboardCheck;
      default: return Circle;
    }
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-green-500";
      case "warning": return "bg-amber-500";
      case "error": return "bg-red-500";
      case "info": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  // Drag and drop handlers
  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (targetColumnId: string) => {
    if (!draggedTask) return;

    setKanbanColumns(prev => {
      const newColumns = [...prev];
      let movedTask: KanbanTask | undefined;

      // Find and remove task from source column
      for (const column of newColumns) {
        const taskIndex = column.tasks.findIndex(t => t.id === draggedTask);
        if (taskIndex !== -1) {
          movedTask = column.tasks[taskIndex];
          column.tasks = column.tasks.filter(t => t.id !== draggedTask);
          break;
        }
      }

      // Add task to target column
      if (movedTask) {
        const targetColumn = newColumns.find(c => c.id === targetColumnId);
        if (targetColumn) {
          // Update progress based on column
          if (targetColumnId === "done") {
            movedTask.progress = 100;
          } else if (targetColumnId === "in-progress" && !movedTask.progress) {
            movedTask.progress = 25;
          }
          targetColumn.tasks.push(movedTask);
        }
      }

      return newColumns;
    });

    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleTaskClick = (task: KanbanTask) => {
    setSelectedTask(task);
    setTaskDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quality Assurance</h1>
          <p className="text-muted-foreground">Lean Six Sigma workflows, Kanban tracking & care verification</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Workflow
          </Button>
        </div>
      </div>

      {/* Quality Metrics Overview - Enhanced */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {qualityMetrics.map((metric) => {
          const Icon = metric.icon;
          const percentage = (metric.value / metric.max) * 100;
          return (
            <Card key={metric.label} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                      {metric.max === 5 ? metric.value.toFixed(2) : `${metric.value}%`}
                    </p>
                  </div>
                  <div className={cn("rounded-xl p-2.5", `${metric.color.replace("text-", "bg-")}/10`)}>
                    <Icon className={cn("h-5 w-5", metric.color)} />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                      metric.isPositive
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}
                  >
                    {metric.isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {metric.trend}%
                  </span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
                <Progress value={percentage} className="mt-3 h-1.5" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Recent Quality Events
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-xs">
                View All
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentQualityEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={cn("h-2 w-2 rounded-full mt-2", getEventStatusColor(event.status))} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{event.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{event.time}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] shrink-0">{event.type}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Play className="h-4 w-4 mr-2 text-green-500" />
              Start New Audit
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <ClipboardCheck className="h-4 w-4 mr-2 text-blue-500" />
              Create Checklist
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Workflow className="h-4 w-4 mr-2 text-purple-500" />
              New Workflow
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <FileText className="h-4 w-4 mr-2 text-amber-500" />
              Generate Report
            </Button>
            <Separator className="my-3" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pending Reviews</span>
              <Badge>5</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Open Issues</span>
              <Badge variant="destructive">3</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dmaic">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dmaic">DMAIC Framework</TabsTrigger>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="checklists">Verification Checklists</TabsTrigger>
          <TabsTrigger value="workflows">Workflow Templates</TabsTrigger>
        </TabsList>

        {/* DMAIC Framework Tab */}
        <TabsContent value="dmaic" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Lean Six Sigma DMAIC Framework
              </CardTitle>
              <CardDescription>
                Define, Measure, Analyze, Improve, Control - Quality management methodology
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                {Object.entries(dmaicMetrics).map(([key, phase]) => (
                  <div key={key} className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground">{phase.label}</h3>
                      <Badge className={getStatusColor(phase.status)}>
                        {phase.score}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">{phase.description}</p>
                    <div className="space-y-2">
                      {phase.items.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground truncate">{item.name}</span>
                            <span className="font-medium">{item.completed}/{item.total}</span>
                          </div>
                          <Progress value={(item.completed / item.total) * 100} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Six Sigma Metrics */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Process Sigma Level</CardTitle>
                <CardDescription>Defects per million opportunities (DPMO)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-3xl font-bold text-primary">4.2σ</p>
                      <p className="text-sm text-muted-foreground">Current Sigma Level</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">6,210 DPMO</p>
                      <p className="text-sm text-muted-foreground">99.38% yield</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Care Task Completion</span>
                      <span className="font-medium">4.5σ (3,400 DPMO)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Documentation Accuracy</span>
                      <span className="font-medium">4.1σ (8,200 DPMO)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Schedule Adherence</span>
                      <span className="font-medium">4.8σ (1,300 DPMO)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Client Satisfaction</span>
                      <span className="font-medium">4.3σ (5,400 DPMO)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Continuous Improvement Cycle</CardTitle>
                <CardDescription>Active improvement initiatives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Reduce visit documentation time", status: "improve", progress: 65, owner: "Quality Team" },
                    { name: "Increase first-visit satisfaction", status: "measure", progress: 40, owner: "Training" },
                    { name: "Standardize medication protocols", status: "control", progress: 90, owner: "Medical" },
                    { name: "Optimize caregiver matching", status: "analyze", progress: 55, owner: "Operations" },
                  ].map((initiative) => (
                    <div key={initiative.name} className="p-3 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{initiative.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {initiative.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={initiative.progress} className="flex-1 h-2" />
                        <span className="text-xs text-muted-foreground w-12">{initiative.progress}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Owner: {initiative.owner}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Kanban Board Tab - Enhanced */}
        <TabsContent value="kanban" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Workflow className="h-5 w-5 text-primary" />
                    Quality Improvement Kanban Board
                  </CardTitle>
                  <CardDescription>
                    Drag and drop tasks to update status. Visual workflow management for quality initiatives.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tasks..."
                      className="pl-8 w-[180px] h-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={kanbanFilter} onValueChange={setKanbanFilter}>
                    <SelectTrigger className="w-[130px] h-9">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tasks</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={() => setNewTaskDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <div className="flex gap-4 min-w-max pb-4">
                  {kanbanColumns.map((column) => {
                    const filteredTasks = column.tasks.filter(task => {
                      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        task.description?.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesFilter = kanbanFilter === "all" || task.priority === kanbanFilter;
                      return matchesSearch && matchesFilter;
                    });

                    return (
                      <div
                        key={column.id}
                        className={cn(
                          "w-80 shrink-0 rounded-xl p-3 transition-all",
                          column.bgColor,
                          dragOverColumn === column.id && "ring-2 ring-primary ring-offset-2"
                        )}
                        onDragOver={(e) => handleDragOver(e, column.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={() => handleDrop(column.id)}
                      >
                        <div className="flex items-center gap-2 mb-3 px-1">
                          <div className={cn("h-3 w-3 rounded-full", column.color)} />
                          <h3 className="font-semibold text-sm">{column.title}</h3>
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {filteredTasks.length}
                            {column.limit && <span className="text-muted-foreground">/{column.limit}</span>}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Task
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit3 className="h-4 w-4 mr-2" />
                                Edit Column
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Clear Column
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {column.limit && filteredTasks.length >= column.limit && (
                          <div className="mb-2 px-1">
                            <Badge variant="destructive" className="text-[10px]">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              WIP Limit Reached
                            </Badge>
                          </div>
                        )}

                        <div className="space-y-2">
                          {filteredTasks.map((task) => {
                            const TypeIcon = getTypeIcon(task.type);
                            return (
                              <div
                                key={task.id}
                                draggable
                                onDragStart={() => handleDragStart(task.id)}
                                onClick={() => handleTaskClick(task)}
                                className={cn(
                                  "p-3 rounded-lg border bg-background shadow-sm cursor-grab active:cursor-grabbing",
                                  "hover:shadow-md hover:border-primary/50 transition-all",
                                  draggedTask === task.id && "opacity-50 scale-95"
                                )}
                              >
                                <div className="flex items-start gap-2 mb-2">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <GripVertical className="h-4 w-4 text-muted-foreground/50 mt-0.5 shrink-0" />
                                      </TooltipTrigger>
                                      <TooltipContent>Drag to move</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                      <Badge className={cn("text-[10px] border", getPriorityColor(task.priority))}>
                                        {task.priority === "high" && <ArrowUp className="h-2.5 w-2.5 mr-0.5" />}
                                        {task.priority === "low" && <ArrowDown className="h-2.5 w-2.5 mr-0.5" />}
                                        {task.priority}
                                      </Badge>
                                      <Badge variant="outline" className="text-[10px]">
                                        <TypeIcon className="h-2.5 w-2.5 mr-1" />
                                        {task.type}
                                      </Badge>
                                    </div>
                                    <p className="font-medium text-sm leading-tight">{task.title}</p>
                                    {task.description && (
                                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                                    )}
                                  </div>
                                </div>

                                {task.progress !== undefined && task.progress > 0 && task.progress < 100 && (
                                  <div className="mt-2 mb-2">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                      <span>Progress</span>
                                      <span>{task.progress}%</span>
                                    </div>
                                    <Progress value={task.progress} className="h-1.5" />
                                  </div>
                                )}

                                {task.labels && task.labels.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {task.labels.slice(0, 3).map((label) => (
                                      <span key={label} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                        {label}
                                      </span>
                                    ))}
                                    {task.labels.length > 3 && (
                                      <span className="text-[10px] text-muted-foreground">+{task.labels.length - 3}</span>
                                    )}
                                  </div>
                                )}

                                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                                  <div className="flex items-center gap-2">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <Avatar className="h-6 w-6">
                                            <AvatarFallback className="text-[10px] bg-primary/10">
                                              {task.assignee.split(" ").map(n => n[0]).join("")}
                                            </AvatarFallback>
                                          </Avatar>
                                        </TooltipTrigger>
                                        <TooltipContent>{task.assignee}</TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      {task.comments && (
                                        <span className="flex items-center gap-0.5 text-[10px]">
                                          <MessageSquare className="h-3 w-3" />
                                          {task.comments}
                                        </span>
                                      )}
                                      {task.attachments && (
                                        <span className="flex items-center gap-0.5 text-[10px]">
                                          <FileText className="h-3 w-3" />
                                          {task.attachments}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    {task.dueDate}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                          <Button
                            variant="ghost"
                            className="w-full justify-center text-muted-foreground border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:text-primary"
                            size="sm"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Task
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Kanban Metrics - Enhanced */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
            <Card className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Avg. Cycle Time</p>
                    <p className="text-2xl font-bold">4.2 days</p>
                  </div>
                  <div className="rounded-xl bg-blue-500/10 p-2.5">
                    <Timer className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <TrendingDown className="h-3 w-3" />
                    0.8 days
                  </span>
                  <span className="text-xs text-muted-foreground">faster than last month</span>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Throughput</p>
                    <p className="text-2xl font-bold">12/week</p>
                  </div>
                  <div className="rounded-xl bg-green-500/10 p-2.5">
                    <Activity className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <TrendingUp className="h-3 w-3" />
                    +3
                  </span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Blocked Items</p>
                    <p className="text-2xl font-bold">2</p>
                  </div>
                  <div className="rounded-xl bg-amber-500/10 p-2.5">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  </div>
                </div>
                <div className="mt-3">
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Needs attention
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Completed (MTD)</p>
                    <p className="text-2xl font-bold">34</p>
                  </div>
                  <div className="rounded-xl bg-purple-500/10 p-2.5">
                    <CheckCircle className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <TrendingUp className="h-3 w-3" />
                    +12
                  </span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cumulative Flow Diagram Placeholder */}
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Cumulative Flow Diagram</CardTitle>
                  <CardDescription>Visual representation of work items over time</CardDescription>
                </div>
                <Select defaultValue="30d">
                  <SelectTrigger className="w-[100px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 days</SelectItem>
                    <SelectItem value="14d">14 days</SelectItem>
                    <SelectItem value="30d">30 days</SelectItem>
                    <SelectItem value="90d">90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {/* Cumulative Flow Diagram */}
              <div className="h-48 relative">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-xs text-muted-foreground">
                  <span>40</span>
                  <span>30</span>
                  <span>20</span>
                  <span>10</span>
                  <span>0</span>
                </div>
                {/* Chart area */}
                <div className="ml-10 h-full flex flex-col">
                  <div className="flex-1 relative overflow-hidden rounded-lg">
                    {/* Stacked area visualization */}
                    <svg viewBox="0 0 400 160" className="w-full h-full" preserveAspectRatio="none">
                      {/* Completed (bottom layer - green) */}
                      <path
                        d="M0,160 L0,140 L57,135 L114,125 L171,110 L228,90 L285,70 L342,55 L400,40 L400,160 Z"
                        fill="rgb(34, 197, 94)"
                        fillOpacity="0.7"
                      />
                      {/* In Review (middle layer - blue) */}
                      <path
                        d="M0,140 L0,120 L57,118 L114,112 L171,100 L228,82 L285,65 L342,52 L400,38 L400,40 L342,55 L285,70 L228,90 L171,110 L114,125 L57,135 L0,140 Z"
                        fill="rgb(59, 130, 246)"
                        fillOpacity="0.7"
                      />
                      {/* In Progress (upper layer - amber) */}
                      <path
                        d="M0,120 L0,95 L57,98 L114,95 L171,88 L228,72 L285,58 L342,48 L400,35 L400,38 L342,52 L285,65 L228,82 L171,100 L114,112 L57,118 L0,120 Z"
                        fill="rgb(245, 158, 11)"
                        fillOpacity="0.7"
                      />
                      {/* Backlog (top layer - gray) */}
                      <path
                        d="M0,95 L0,60 L57,65 L114,62 L171,58 L228,52 L285,48 L342,42 L400,32 L400,35 L342,48 L285,58 L228,72 L171,88 L114,95 L57,98 L0,95 Z"
                        fill="rgb(156, 163, 175)"
                        fillOpacity="0.5"
                      />
                    </svg>
                  </div>
                  {/* X-axis labels */}
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Week 1</span>
                    <span>Week 2</span>
                    <span>Week 3</span>
                    <span>Week 4</span>
                    <span>Week 5</span>
                    <span>Week 6</span>
                    <span>Week 7</span>
                  </div>
                </div>
              </div>
              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-gray-400/50"></div>
                  <span className="text-xs text-muted-foreground">Backlog</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-amber-500/70"></div>
                  <span className="text-xs text-muted-foreground">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-500/70"></div>
                  <span className="text-xs text-muted-foreground">In Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-500/70"></div>
                  <span className="text-xs text-muted-foreground">Completed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verification Checklists Tab */}
        <TabsContent value="checklists" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {verificationChecklists.map((checklist) => (
              <Card key={checklist.id} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <ListChecks className="h-5 w-5 text-primary" />
                        {checklist.name}
                      </CardTitle>
                      <CardDescription>{checklist.description}</CardDescription>
                    </div>
                    <Badge
                      className={cn(
                        checklist.completionRate >= 95 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        checklist.completionRate >= 90 ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      )}
                    >
                      {checklist.completionRate}% completion
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {checklist.items.slice(0, 4).map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="flex-1">{item.label}</span>
                        {item.required && (
                          <Badge variant="outline" className="text-[10px]">Required</Badge>
                        )}
                      </div>
                    ))}
                    {checklist.items.length > 4 && (
                      <p className="text-xs text-muted-foreground">
                        +{checklist.items.length - 4} more items
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedChecklist(checklist);
                      setChecklistDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Checklist
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Workflow Templates Tab */}
        <TabsContent value="workflows" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-primary" />
                Standardized Workflow Templates
              </CardTitle>
              <CardDescription>
                Pre-defined workflows ensuring consistent quality care delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">Workflow</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                      <th className="px-4 py-3 text-center text-sm font-medium">Steps</th>
                      <th className="px-4 py-3 text-center text-sm font-medium">Avg. Duration</th>
                      <th className="px-4 py-3 text-center text-sm font-medium">Completions</th>
                      <th className="px-4 py-3 text-center text-sm font-medium">Success Rate</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workflowTemplates.map((workflow) => (
                      <tr key={workflow.id} className="border-b last:border-0">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Workflow className="h-4 w-4 text-primary" />
                            <span className="font-medium">{workflow.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">{workflow.category}</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">{workflow.steps}</td>
                        <td className="px-4 py-3 text-center text-sm text-muted-foreground">
                          {workflow.avgDuration}
                        </td>
                        <td className="px-4 py-3 text-center">{workflow.completions}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge
                            className={cn(
                              workflow.successRate >= 98 ? "bg-green-100 text-green-700" :
                              workflow.successRate >= 95 ? "bg-blue-100 text-blue-700" :
                              "bg-amber-100 text-amber-700"
                            )}
                          >
                            {workflow.successRate}%
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedWorkflow(workflow);
                              setWorkflowDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Checklist Dialog */}
      <Dialog open={checklistDialogOpen} onOpenChange={setChecklistDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              {selectedChecklist?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedChecklist?.description}
            </DialogDescription>
          </DialogHeader>
          {selectedChecklist && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm">Completion Rate</span>
                <div className="flex items-center gap-2">
                  <Progress value={selectedChecklist.completionRate} className="w-24 h-2" />
                  <span className="font-medium">{selectedChecklist.completionRate}%</span>
                </div>
              </div>
              <div className="space-y-3">
                {selectedChecklist.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <Checkbox id={item.id} defaultChecked />
                    <div className="flex-1">
                      <Label htmlFor={item.id} className="text-sm cursor-pointer">
                        {item.label}
                      </Label>
                    </div>
                    {item.required && (
                      <Badge variant="destructive" className="text-[10px]">Required</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setChecklistDialogOpen(false)}>
              Close
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Workflow Dialog - Enhanced */}
      <Dialog open={workflowDialogOpen} onOpenChange={setWorkflowDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-primary" />
              {selectedWorkflow?.name}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">{selectedWorkflow?.category}</Badge>
              <span>•</span>
              <span>{selectedWorkflow?.steps} steps</span>
              <span>•</span>
              <span>{selectedWorkflow?.avgDuration}</span>
            </DialogDescription>
          </DialogHeader>
          {selectedWorkflow && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
                  <p className="text-3xl font-bold text-primary">{selectedWorkflow.completions}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total Completions</p>
                </div>
                <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 text-center">
                  <p className="text-3xl font-bold text-green-600">{selectedWorkflow.successRate}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Success Rate</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center">
                  <p className="text-3xl font-bold text-blue-600">{selectedWorkflow.steps}</p>
                  <p className="text-xs text-muted-foreground mt-1">Process Steps</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-primary" />
                  Workflow Steps
                </h4>
                <div className="space-y-3">
                  {Array.from({ length: selectedWorkflow.steps }).map((_, idx) => (
                    <div key={idx} className="flex items-start gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">
                          {idx + 1}
                        </div>
                        {idx < selectedWorkflow.steps - 1 && (
                          <div className="w-0.5 h-full min-h-[20px] bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium text-sm">
                          {getWorkflowStep(selectedWorkflow.id, idx)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Estimated time: {Math.floor(Math.random() * 4) + 1} hours
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">LAST EXECUTED</Label>
                  <p className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    3 days ago by Sarah Admin
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">NEXT SCHEDULED</Label>
                  <p className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Mar 15, 2024
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setWorkflowDialogOpen(false)}>
              Close
            </Button>
            <Button variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
            <Button>
              <Play className="h-4 w-4 mr-2" />
              Start Workflow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Detail Dialog */}
      <Dialog open={taskDetailOpen} onOpenChange={setTaskDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-lg">{selectedTask?.title}</DialogTitle>
                <DialogDescription className="mt-1">
                  {selectedTask?.description}
                </DialogDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Task
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge className={cn("border", getPriorityColor(selectedTask.priority))}>
                  {selectedTask.priority === "high" && <ArrowUp className="h-3 w-3 mr-1" />}
                  {selectedTask.priority === "low" && <ArrowDown className="h-3 w-3 mr-1" />}
                  {selectedTask.priority} priority
                </Badge>
                <Badge variant="outline">
                  {(() => {
                    const TypeIcon = getTypeIcon(selectedTask.type);
                    return <TypeIcon className="h-3 w-3 mr-1" />;
                  })()}
                  {selectedTask.type}
                </Badge>
                {selectedTask.labels?.map((label) => (
                  <Badge key={label} variant="secondary" className="text-xs">
                    {label}
                  </Badge>
                ))}
              </div>

              {selectedTask.progress !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Progress</span>
                    <span className="text-muted-foreground">{selectedTask.progress}%</span>
                  </div>
                  <Progress value={selectedTask.progress} className="h-2" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">ASSIGNEE</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-primary/10">
                          {selectedTask.assignee.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{selectedTask.assignee}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">DUE DATE</Label>
                    <p className="text-sm flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {selectedTask.dueDate}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">COMMENTS</Label>
                    <p className="text-sm flex items-center gap-2 mt-1">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      {selectedTask.comments || 0} comments
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">ATTACHMENTS</Label>
                    <p className="text-sm flex items-center gap-2 mt-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {selectedTask.attachments || 0} files
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-xs font-medium text-muted-foreground">ACTIVITY</Label>
                <div className="mt-3 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                    <div>
                      <p className="text-sm">Task created by Quality Team</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                    <div>
                      <p className="text-sm">Moved to In Progress</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setTaskDetailOpen(false)}>
              Close
            </Button>
            <Button>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Task Dialog */}
      <Dialog open={newTaskDialogOpen} onOpenChange={setNewTaskDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Create New Task
            </DialogTitle>
            <DialogDescription>
              Add a new quality improvement task to the Kanban board.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input id="task-title" placeholder="Enter task title..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-description">Description</Label>
              <Textarea id="task-description" placeholder="Describe the task..." rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">
                      <span className="flex items-center gap-2">
                        <ArrowUp className="h-3 w-3 text-red-500" />
                        High
                      </span>
                    </SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">
                      <span className="flex items-center gap-2">
                        <ArrowDown className="h-3 w-3 text-green-500" />
                        Low
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select defaultValue="process">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="process">Process</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="audit">Audit</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="documentation">Documentation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-assignee">Assignee</Label>
              <Select defaultValue="quality">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quality">Quality Team</SelectItem>
                  <SelectItem value="training">Training Team</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="hr">HR Team</SelectItem>
                  <SelectItem value="medical">Medical Director</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setNewTaskDialogOpen(false)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function for workflow steps
function getWorkflowStep(workflowId: string, stepIndex: number): string {
  const steps: Record<string, string[]> = {
    "wf-1": [
      "Initial inquiry received and logged",
      "Schedule assessment call with family",
      "Conduct needs assessment",
      "Create personalized care plan",
      "Match with compatible caregivers",
      "Family reviews and approves caregiver",
      "Schedule orientation visit",
      "Complete onboarding documentation",
    ],
    "wf-2": [
      "Application received",
      "Initial screening interview",
      "Reference verification",
      "Background check submission",
      "Skills assessment",
      "Health screening verification",
      "Training completion verification",
      "CPR/First Aid certification check",
      "TB test verification",
      "Final review by HR",
      "Onboarding documentation",
      "Profile activation",
    ],
    "wf-3": [
      "Incident reported and logged",
      "Initial assessment and triage",
      "Notify relevant stakeholders",
      "Investigation and documentation",
      "Corrective action implementation",
      "Follow-up and closure",
    ],
    "wf-4": [
      "Schedule review meeting",
      "Gather feedback from all parties",
      "Assess current care effectiveness",
      "Update care plan as needed",
      "Document and communicate changes",
    ],
    "wf-5": [
      "Audit scope and schedule defined",
      "Documentation review",
      "Caregiver interviews",
      "Client satisfaction surveys",
      "Process observation",
      "Compliance verification",
      "Findings documentation",
      "Corrective action recommendations",
      "Management review",
      "Final report and sign-off",
    ],
    "wf-6": [
      "Complaint received and logged",
      "Initial response to complainant",
      "Investigation initiated",
      "Gather evidence and statements",
      "Resolution determination",
      "Implement corrective action",
      "Follow-up with complainant",
    ],
  };

  return steps[workflowId]?.[stepIndex] || `Step ${stepIndex + 1}`;
}
