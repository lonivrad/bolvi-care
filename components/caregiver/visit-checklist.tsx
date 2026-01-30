"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  Circle,
  Clock,
  MapPin,
  AlertTriangle,
  Camera,
  FileText,
  Send,
  ChevronRight,
  Star,
  Shield,
  Heart,
  Pill,
  Utensils,
  Activity,
  Timer,
  Image,
  X,
  Plus,
  Info,
  Sparkles,
  ThumbsUp,
  AlertCircle,
  Mic,
  Paperclip,
  CheckCheck,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  required: boolean;
  completed: boolean;
  completedAt?: string;
  category: "arrival" | "care" | "medication" | "meals" | "departure";
  notes?: string;
}

interface VisitChecklistProps {
  visitId: string;
  clientName: string;
  scheduledTime: string;
  tasks: string[];
  onComplete?: () => void;
}

const defaultChecklist: ChecklistItem[] = [
  // Arrival
  { id: "arr-1", label: "Clock in with GPS verification", description: "Confirm your location when arriving", required: true, completed: false, category: "arrival" },
  { id: "arr-2", label: "Greet care recipient", description: "Assess mood and overall condition", required: true, completed: false, category: "arrival" },
  { id: "arr-3", label: "Review today's care plan", description: "Check for any updates or changes", required: true, completed: false, category: "arrival" },
  { id: "arr-4", label: "Check vital signs", description: "If applicable to care plan", required: false, completed: false, category: "arrival" },

  // Care Tasks
  { id: "care-1", label: "Personal hygiene assistance", description: "Bathing, grooming, oral care", required: false, completed: false, category: "care" },
  { id: "care-2", label: "Mobility assistance", description: "Help with walking, transfers, exercises", required: false, completed: false, category: "care" },
  { id: "care-3", label: "Companionship activities", description: "Conversation, games, reading", required: false, completed: false, category: "care" },
  { id: "care-4", label: "Light housekeeping", description: "Tidying, laundry, dishes", required: false, completed: false, category: "care" },

  // Medication
  { id: "med-1", label: "Administer scheduled medications", description: "Follow medication schedule exactly", required: true, completed: false, category: "medication" },
  { id: "med-2", label: "Document medication given", description: "Record time and dosage", required: true, completed: false, category: "medication" },
  { id: "med-3", label: "Check medication supply", description: "Note if refills are needed", required: false, completed: false, category: "medication" },

  // Meals
  { id: "meal-1", label: "Prepare meals/snacks", description: "Follow dietary requirements", required: false, completed: false, category: "meals" },
  { id: "meal-2", label: "Assist with eating if needed", description: "Ensure proper nutrition intake", required: false, completed: false, category: "meals" },
  { id: "meal-3", label: "Document food/fluid intake", description: "Track meals consumed", required: false, completed: false, category: "meals" },

  // Departure
  { id: "dep-1", label: "Complete visit notes", description: "Document all activities and observations", required: true, completed: false, category: "departure" },
  { id: "dep-2", label: "Report any concerns", description: "Notify family/supervisor of issues", required: true, completed: false, category: "departure" },
  { id: "dep-3", label: "Ensure safety before leaving", description: "Client is safe and comfortable", required: true, completed: false, category: "departure" },
  { id: "dep-4", label: "Clock out with GPS verification", description: "Confirm your location when leaving", required: true, completed: false, category: "departure" },
];

const categoryInfo = {
  arrival: { label: "Arrival", icon: MapPin, color: "text-blue-500", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/20" },
  care: { label: "Care Tasks", icon: Heart, color: "text-pink-500", bgColor: "bg-pink-500/10", borderColor: "border-pink-500/20" },
  medication: { label: "Medication", icon: Pill, color: "text-purple-500", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/20" },
  meals: { label: "Meals & Nutrition", icon: Utensils, color: "text-orange-500", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/20" },
  departure: { label: "Departure", icon: Clock, color: "text-green-500", bgColor: "bg-green-500/10", borderColor: "border-green-500/20" },
};

export function VisitChecklist({ visitId, clientName, scheduledTime, tasks, onComplete }: VisitChecklistProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(defaultChecklist);
  const [notes, setNotes] = useState("");
  const [concerns, setConcerns] = useState("");
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [visitStartTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState("0:00");
  const [moodRating, setMoodRating] = useState<string>("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["arrival"]);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [quickNoteItem, setQuickNoteItem] = useState<string | null>(null);
  const [showVoiceDialog, setShowVoiceDialog] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceNotes, setVoiceNotes] = useState<{ id: string; duration: string }[]>([]);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Date.now() - visitStartTime.getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setElapsedTime(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [visitStartTime]);

  const toggleItem = (id: string) => {
    setChecklist(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newCompleted = !item.completed;
          // Auto-expand next category when current is complete
          if (newCompleted) {
            const category = item.category;
            const categoryItems = prev.filter(i => i.category === category);
            const willBeAllComplete = categoryItems.filter(i => i.id !== id).every(i => i.completed);
            if (willBeAllComplete) {
              const categories = Object.keys(categoryInfo) as Array<keyof typeof categoryInfo>;
              const currentIndex = categories.indexOf(category);
              if (currentIndex < categories.length - 1) {
                const nextCategory = categories[currentIndex + 1];
                if (!expandedCategories.includes(nextCategory)) {
                  setExpandedCategories(prev => [...prev, nextCategory]);
                }
              }
            }
          }
          return {
            ...item,
            completed: newCompleted,
            completedAt: newCompleted ? new Date().toISOString() : undefined
          };
        }
        return item;
      })
    );
  };

  const addQuickNote = (itemId: string, note: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, notes: note } : item
      )
    );
    setQuickNoteItem(null);
  };

  const completedCount = checklist.filter(item => item.completed).length;
  const requiredCount = checklist.filter(item => item.required).length;
  const completedRequiredCount = checklist.filter(item => item.required && item.completed).length;
  const progress = (completedCount / checklist.length) * 100;
  const canSubmit = completedRequiredCount === requiredCount;

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSubmitDialog(false);
      setShowSuccessAnimation(true);
      setTimeout(() => {
        setShowSuccessAnimation(false);
        onComplete?.();
      }, 2000);
    }, 1500);
  };

  const groupedChecklist = checklist.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const getQualityScore = () => {
    const baseScore = (completedCount / checklist.length) * 100;
    const notesBonus = notes.length > 50 ? 5 : notes.length > 0 ? 2 : 0;
    const photosBonus = photos.length > 0 ? 3 : 0;
    const voiceBonus = voiceNotes.length > 0 ? 3 : 0;
    return Math.min(100, Math.round(baseScore + notesBonus + photosBonus + voiceBonus));
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingTime > 0) {
      const mins = Math.floor(recordingTime / 60);
      const secs = recordingTime % 60;
      setVoiceNotes([
        ...voiceNotes,
        { id: `voice-${Date.now()}`, duration: `${mins}:${secs.toString().padStart(2, '0')}` }
      ]);
    }
    setRecordingTime(0);
  };

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Success animation overlay
  if (showSuccessAnimation) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-12 flex flex-col items-center justify-center text-center">
          <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 animate-bounce">
            <CheckCheck className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Visit Complete!</h2>
          <p className="text-muted-foreground">Your report has been submitted successfully.</p>
          <div className="flex items-center gap-2 mt-4">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            <span className="text-lg font-semibold">{getQualityScore()}% Quality Score</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="block">Visit Verification</span>
                <span className="text-sm font-normal text-muted-foreground">{clientName}</span>
              </div>
            </CardTitle>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="mb-1 font-mono">
              <Timer className="h-3 w-3 mr-1" />
              {elapsedTime}
            </Badge>
            <p className="text-xs text-muted-foreground">{scheduledTime}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Progress Section */}
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <svg className="h-12 w-12 -rotate-90">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="4"
                    fill="transparent"
                    r="20"
                    cx="24"
                    cy="24"
                  />
                  <circle
                    className="text-primary stroke-current transition-all duration-500"
                    strokeWidth="4"
                    strokeDasharray={`${progress * 1.26} 126`}
                    strokeLinecap="round"
                    fill="transparent"
                    r="20"
                    cx="24"
                    cy="24"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                  {Math.round(progress)}%
                </span>
              </div>
              <div>
                <p className="font-medium text-sm">{completedCount} of {checklist.length} tasks</p>
                <p className="text-xs text-muted-foreground">
                  {completedRequiredCount}/{requiredCount} required complete
                </p>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant={canSubmit ? "default" : "secondary"}
                    className={cn(
                      "transition-all",
                      canSubmit && "bg-green-500 hover:bg-green-600"
                    )}
                  >
                    {canSubmit ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Ready to Submit
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {requiredCount - completedRequiredCount} required left
                      </>
                    )}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  {canSubmit
                    ? "All required tasks complete. You can submit the report."
                    : "Complete all required tasks (*) before submitting."
                  }
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Checklist Sections */}
        <div className="divide-y">
          <Accordion
            type="multiple"
            value={expandedCategories}
            onValueChange={setExpandedCategories}
          >
            {(Object.keys(categoryInfo) as Array<keyof typeof categoryInfo>).map((category) => {
              const info = categoryInfo[category];
              const items = groupedChecklist[category] || [];
              const categoryCompleted = items.filter(i => i.completed).length;
              const categoryRequired = items.filter(i => i.required).length;
              const categoryRequiredCompleted = items.filter(i => i.required && i.completed).length;
              const isCategoryComplete = categoryCompleted === items.length;
              const Icon = info.icon;

              return (
                <AccordionItem key={category} value={category} className="border-0">
                  <AccordionTrigger className="hover:no-underline px-4 py-3 hover:bg-muted/50">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center", info.bgColor)}>
                        <Icon className={cn("h-5 w-5", info.color)} />
                      </div>
                      <div className="text-left">
                        <span className="font-medium block">{info.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {categoryRequired > 0 && `${categoryRequiredCompleted}/${categoryRequired} required • `}
                          {categoryCompleted}/{items.length} complete
                        </span>
                      </div>
                      {isCategoryComplete && (
                        <Badge variant="secondary" className="ml-auto mr-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Done
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-2 ml-12">
                      {items.map((item) => (
                        <div key={item.id}>
                          <div
                            className={cn(
                              "flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer group",
                              item.completed
                                ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                                : "border-border hover:bg-muted/50 hover:border-primary/30"
                            )}
                            onClick={() => toggleItem(item.id)}
                          >
                            <Checkbox
                              id={item.id}
                              checked={item.completed}
                              onCheckedChange={() => toggleItem(item.id)}
                              className="mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <Label
                                htmlFor={item.id}
                                className={cn(
                                  "text-sm font-medium cursor-pointer flex items-center gap-2",
                                  item.completed && "line-through text-muted-foreground"
                                )}
                              >
                                {item.label}
                                {item.required && (
                                  <Badge variant="destructive" className="text-[10px] h-4 px-1">
                                    Required
                                  </Badge>
                                )}
                              </Label>
                              {item.description && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {item.description}
                                </p>
                              )}
                              {item.notes && (
                                <p className="text-xs mt-1 p-1.5 bg-muted rounded text-muted-foreground italic">
                                  Note: {item.notes}
                                </p>
                              )}
                              {item.completedAt && (
                                <p className="text-[10px] text-muted-foreground mt-1">
                                  Completed at {new Date(item.completedAt).toLocaleTimeString()}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setQuickNoteItem(item.id);
                                      }}
                                    >
                                      <FileText className="h-3.5 w-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Add note</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            {item.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground/20 shrink-0" />
                            )}
                          </div>

                          {/* Quick Note Input */}
                          {quickNoteItem === item.id && (
                            <div className="mt-2 flex gap-2">
                              <Input
                                placeholder="Add a quick note..."
                                className="text-sm"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    addQuickNote(item.id, (e.target as HTMLInputElement).value);
                                  } else if (e.key === "Escape") {
                                    setQuickNoteItem(null);
                                  }
                                }}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setQuickNoteItem(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        {/* Notes Section */}
        <div className="p-4 space-y-4 border-t bg-muted/20">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Visit Documentation
            </h3>
            <Badge variant="outline" className="text-xs">
              {photos.length} photos attached
            </Badge>
          </div>

          {/* Client Mood */}
          <div className="space-y-2">
            <Label className="text-sm">Client Mood Assessment</Label>
            <Select value={moodRating} onValueChange={setMoodRating}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select mood..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">😊 Excellent - Very positive</SelectItem>
                <SelectItem value="good">🙂 Good - Normal</SelectItem>
                <SelectItem value="fair">😐 Fair - Somewhat down</SelectItem>
                <SelectItem value="poor">😔 Poor - Concerning</SelectItem>
                <SelectItem value="na">N/A - Unable to assess</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm">Visit Notes</Label>
            <Textarea
              id="notes"
              placeholder="Document activities, observations, and any notable events..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <p className="text-[10px] text-muted-foreground text-right">
              {notes.length} characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="concerns" className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Concerns or Issues
            </Label>
            <Textarea
              id="concerns"
              placeholder="Report any concerns, changes in condition, or issues that need attention..."
              value={concerns}
              onChange={(e) => setConcerns(e.target.value)}
              rows={2}
              className={cn(
                "resize-none",
                concerns && "border-amber-300 dark:border-amber-700"
              )}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t bg-background">
          <div className="flex gap-2 mb-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowPhotoDialog(true)}
            >
              <Camera className="h-4 w-4 mr-2" />
              Add Photo
              {photos.length > 0 && (
                <Badge variant="secondary" className="ml-2">{photos.length}</Badge>
              )}
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setShowVoiceDialog(true)}>
              <Mic className="h-4 w-4 mr-2" />
              Voice Note
              {voiceNotes.length > 0 && (
                <Badge variant="secondary" className="ml-2">{voiceNotes.length}</Badge>
              )}
            </Button>
          </div>
          <Button
            className="w-full"
            size="lg"
            disabled={!canSubmit}
            onClick={() => setShowSubmitDialog(true)}
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Visit Report
          </Button>

          {!canSubmit && (
            <p className="text-xs text-center text-muted-foreground mt-2 flex items-center justify-center gap-1">
              <Info className="h-3 w-3" />
              Complete all required tasks to submit
            </p>
          )}
        </div>
      </CardContent>

      {/* Photo Dialog */}
      <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Add Photos
            </DialogTitle>
            <DialogDescription>
              Attach photos to document the visit.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Camera className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm font-medium">Click to take photo or upload</p>
              <p className="text-xs text-muted-foreground">JPEG, PNG up to 10MB</p>
            </div>
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo, idx) => (
                  <div key={idx} className="aspect-square bg-muted rounded-lg relative group">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPhotoDialog(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Voice Note Dialog */}
      <Dialog open={showVoiceDialog} onOpenChange={setShowVoiceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-primary" />
              Voice Notes
            </DialogTitle>
            <DialogDescription>
              Record voice notes to add context to your visit report.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Recording Interface */}
            <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg">
              {isRecording ? (
                <>
                  <div className="h-20 w-20 rounded-full bg-red-500/20 flex items-center justify-center mb-4 animate-pulse">
                    <div className="h-12 w-12 rounded-full bg-red-500 flex items-center justify-center">
                      <Mic className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-mono font-bold text-red-500">
                    {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Recording...</p>
                  <Button
                    variant="destructive"
                    className="mt-4"
                    onClick={stopRecording}
                  >
                    Stop Recording
                  </Button>
                </>
              ) : (
                <>
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Mic className="h-10 w-10 text-primary" />
                  </div>
                  <p className="text-sm font-medium">Tap to start recording</p>
                  <p className="text-xs text-muted-foreground">Max 2 minutes per note</p>
                  <Button
                    className="mt-4"
                    onClick={startRecording}
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    Start Recording
                  </Button>
                </>
              )}
            </div>

            {/* Saved Voice Notes */}
            {voiceNotes.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Saved Notes ({voiceNotes.length})</p>
                {voiceNotes.map((note, idx) => (
                  <div key={note.id} className="flex items-center gap-3 p-3 rounded-lg border bg-background">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mic className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Voice Note {idx + 1}</p>
                      <p className="text-xs text-muted-foreground">Duration: {note.duration}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setVoiceNotes(voiceNotes.filter(n => n.id !== note.id))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVoiceDialog(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Submit Visit Report
            </DialogTitle>
            <DialogDescription>
              Review your visit summary before submitting.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Quality Score */}
            <div className="flex items-center justify-center p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  <span className="text-3xl font-bold">{getQualityScore()}%</span>
                </div>
                <p className="text-sm text-muted-foreground">Quality Score</p>
              </div>
            </div>

            <div className="rounded-lg bg-muted/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Client</span>
                <span className="font-medium">{clientName}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Visit Duration</span>
                <span className="font-medium font-mono">{elapsedTime}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tasks Completed</span>
                <span className="font-medium">{completedCount}/{checklist.length}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Photos</span>
                <span className="font-medium">{photos.length} attached</span>
              </div>
              {moodRating && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Client Mood</span>
                    <Badge variant="outline" className="capitalize">{moodRating}</Badge>
                  </div>
                </>
              )}
            </div>

            {notes && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">VISIT NOTES</p>
                <p className="text-sm bg-muted/50 p-3 rounded-lg">{notes}</p>
              </div>
            )}

            {concerns && (
              <div>
                <p className="text-xs font-medium text-amber-600 mb-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  CONCERNS REPORTED
                </p>
                <p className="text-sm bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                  {concerns}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Activity className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Confirm & Submit
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// Compact version for dashboard - Enhanced
export function VisitChecklistCompact({ visitId, clientName, onStartChecklist }: { visitId: string; clientName: string; onStartChecklist?: () => void }) {
  return (
    <Card
      className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group overflow-hidden"
      onClick={onStartChecklist}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm group-hover:text-primary transition-colors">Visit Checklist Ready</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {clientName}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            Start
            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Progress indicator component for visit list
export function VisitChecklistProgress({ progress, required, completed }: { progress: number; required: { total: number; completed: number }; completed: { total: number; done: number } }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-10 w-10">
        <svg className="h-10 w-10 -rotate-90">
          <circle
            className="text-muted stroke-current"
            strokeWidth="3"
            fill="transparent"
            r="16"
            cx="20"
            cy="20"
          />
          <circle
            className="text-primary stroke-current transition-all duration-500"
            strokeWidth="3"
            strokeDasharray={`${progress} 100`}
            strokeLinecap="round"
            fill="transparent"
            r="16"
            cx="20"
            cy="20"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="text-xs">
        <p className="font-medium">{completed.done}/{completed.total} tasks</p>
        <p className="text-muted-foreground">{required.completed}/{required.total} required</p>
      </div>
    </div>
  );
}
