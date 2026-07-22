"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import {
  Search,
  MessageCircle,
  Heart,
  Share2,
  Bookmark,
  Award,
  Calendar,
  MapPin,
  Users,
  BookOpen,
  Star,
  Clock,
  ExternalLink,
  Loader2,
  Send,
} from "lucide-react";

// Mock community data - use local placeholder images to avoid loading issues
const initialStories = [
  {
    id: 1,
    family: "The Johnson Family",
    caregiver: "Maria Rodriguez",
    title: "Finding Peace of Mind After Mom's Diagnosis",
    excerpt: "When Mom was diagnosed with early-stage Alzheimer's, we were overwhelmed. Maria has been our angel, bringing expertise and compassion to every visit. She understands the small things that matter most.",
    image: "/images/story-dementia-care.jpg",
    likes: 234,
    comments: 45,
    date: "2 weeks ago",
    featured: true,
    liked: false,
    bookmarked: false,
  },
  {
    id: 2,
    family: "The Chen Family",
    caregiver: "David Kim",
    title: "Dad's Recovery Journey After Hip Surgery",
    excerpt: "David helped Dad regain his mobility and independence. The physical therapy support was incredible and Dad is now walking on his own again.",
    image: "/images/story-recovery.jpg",
    likes: 189,
    comments: 32,
    date: "1 month ago",
    featured: false,
    liked: false,
    bookmarked: false,
  },
  {
    id: 3,
    family: "The Martinez Family",
    caregiver: "Sarah Thompson",
    title: "Companionship That Changed Everything",
    excerpt: "Grandma was isolated and depressed. Sarah brought joy back into her life with activities and genuine friendship that we treasure.",
    image: "/images/story-companionship.jpg",
    likes: 156,
    comments: 28,
    date: "1 month ago",
    featured: false,
    liked: false,
    bookmarked: false,
  },
];

// Additional stories for "Load More"
const moreStories = [
  {
    id: 4,
    family: "The Williams Family",
    caregiver: "James Mitchell",
    title: "A New Chapter for Dad at 85",
    excerpt: "After Mom passed, Dad needed someone to help him stay active and engaged. James has become like family to us all.",
    image: "/images/story-senior-care.jpg",
    likes: 127,
    comments: 19,
    date: "2 months ago",
    featured: false,
    liked: false,
    bookmarked: false,
  },
  {
    id: 5,
    family: "The Garcia Family",
    caregiver: "Lisa Chen",
    title: "Managing Diabetes with Expert Care",
    excerpt: "Lisa's background in chronic disease management transformed how we approach Dad's diabetes care at home.",
    image: "/images/story-diabetes.jpg",
    likes: 98,
    comments: 14,
    date: "2 months ago",
    featured: false,
    liked: false,
    bookmarked: false,
  },
  {
    id: 6,
    family: "The Anderson Family",
    caregiver: "Patricia Young",
    title: "Finding Hope in Hospice Care",
    excerpt: "Patricia brought dignity, peace, and comfort during our family's most difficult time. Her presence was a blessing.",
    image: "/images/story-hospice.jpg",
    likes: 203,
    comments: 41,
    date: "3 months ago",
    featured: false,
    liked: false,
    bookmarked: false,
  },
];

const forumTopics = [
  {
    id: 1,
    category: "Caregiving Tips",
    title: "Best activities for loved ones with dementia?",
    author: "SarahM",
    replies: 23,
    views: 456,
    lastActivity: "2 hours ago",
    pinned: true,
  },
  {
    id: 2,
    category: "Family Support",
    title: "How to talk to siblings about sharing care responsibilities",
    author: "JohnD",
    replies: 45,
    views: 892,
    lastActivity: "5 hours ago",
    pinned: false,
  },
  {
    id: 3,
    category: "Caregiver Resources",
    title: "Self-care strategies that actually work",
    author: "CaregiverPro",
    replies: 67,
    views: 1234,
    lastActivity: "1 day ago",
    pinned: true,
  },
  {
    id: 4,
    category: "Local Resources",
    title: "Senior centers in the Seattle area - recommendations?",
    author: "SeattleFamily",
    replies: 15,
    views: 234,
    lastActivity: "2 days ago",
    pinned: false,
  },
  {
    id: 5,
    category: "Medical Questions",
    title: "Questions to ask at neurology appointments",
    author: "CaringDaughter",
    replies: 31,
    views: 678,
    lastActivity: "3 days ago",
    pinned: false,
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: "Caregiver Support Group - Seattle Chapter",
    type: "In-Person Meetup",
    date: "Mar 15, 2024",
    time: "6:00 PM",
    location: "Seattle Community Center",
    attendees: 28,
    maxAttendees: 40,
  },
  {
    id: 2,
    title: "Webinar: Understanding Medicare Options",
    type: "Online Event",
    date: "Mar 18, 2024",
    time: "2:00 PM",
    location: "Zoom",
    attendees: 156,
    maxAttendees: 500,
  },
  {
    id: 3,
    title: "Dementia Care Workshop",
    type: "In-Person Workshop",
    date: "Mar 22, 2024",
    time: "10:00 AM",
    location: "Bellevue Senior Center",
    attendees: 35,
    maxAttendees: 50,
  },
];

const topCaregivers = [
  {
    id: "cg-001",
    name: "Maria Rodriguez",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    specialty: "Dementia Care",
    rating: 4.98,
    reviews: 156,
    badge: "Top Rated",
  },
  {
    id: "cg-002",
    name: "David Kim",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    specialty: "Post-Surgery Recovery",
    rating: 4.95,
    reviews: 98,
    badge: "Rising Star",
  },
  {
    id: "cg-003",
    name: "Sarah Thompson",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    specialty: "Companionship",
    rating: 4.92,
    reviews: 87,
    badge: "Community Choice",
  },
];

const localResources = [
  {
    name: "Seattle Senior Center",
    type: "Senior Center",
    address: "2208 2nd Ave, Seattle",
    phone: "(206) 555-0123",
    services: ["Day Programs", "Meals", "Social Activities"],
  },
  {
    name: "Puget Sound Alzheimer's Association",
    type: "Support Organization",
    address: "100 W Harrison St, Seattle",
    phone: "(206) 555-0456",
    services: ["Support Groups", "Education", "Resources"],
  },
  {
    name: "Family Support Solutions",
    type: "Care Management",
    address: "1501 4th Ave, Seattle",
    phone: "(206) 555-0789",
    services: ["Care Planning", "Advocacy", "Referrals"],
  },
];

export default function CommunityPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [stories, setStories] = useState(initialStories);
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreStories, setHasMoreStories] = useState(true);

  // New Topic Dialog State
  const [showNewTopicDialog, setShowNewTopicDialog] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicCategory, setNewTopicCategory] = useState("");
  const [newTopicContent, setNewTopicContent] = useState("");
  const [isSubmittingTopic, setIsSubmittingTopic] = useState(false);

  // Nomination Dialog State
  const [showNominationDialog, setShowNominationDialog] = useState(false);
  const [nominationName, setNominationName] = useState("");
  const [nominationReason, setNominationReason] = useState("");
  const [nominationEmail, setNominationEmail] = useState("");
  const [isSubmittingNomination, setIsSubmittingNomination] = useState(false);

  const handleLike = (storyId: number) => {
    setStories(stories.map(story => {
      if (story.id === storyId) {
        return {
          ...story,
          liked: !story.liked,
          likes: story.liked ? story.likes - 1 : story.likes + 1,
        };
      }
      return story;
    }));
  };

  const handleBookmark = (storyId: number) => {
    setStories(stories.map(story => {
      if (story.id === storyId) {
        const newBookmarked = !story.bookmarked;
        toast({
          title: newBookmarked ? "Story bookmarked" : "Bookmark removed",
          description: newBookmarked ? "Added to your saved stories" : "Removed from saved stories",
          variant: "success",
        });
        return { ...story, bookmarked: newBookmarked };
      }
      return story;
    }));
  };

  const handleShare = async (title: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: `Check out this story on Bolvi Care: ${title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "The link has been copied to your clipboard.",
          variant: "success",
        });
      }
    } catch {
      toast({
        title: "Share",
        description: "Unable to share at this time.",
        variant: "error",
      });
    }
  };

  const handleStartNewTopic = () => {
    setShowNewTopicDialog(true);
  };

  const handleSubmitNewTopic = async () => {
    if (!newTopicTitle.trim() || !newTopicCategory || !newTopicContent.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "error",
      });
      return;
    }

    setIsSubmittingTopic(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmittingTopic(false);
    setShowNewTopicDialog(false);
    setNewTopicTitle("");
    setNewTopicCategory("");
    setNewTopicContent("");

    toast({
      title: "Topic posted!",
      description: "Your topic has been published to the forum.",
      variant: "success",
    });
  };

  const handleRegisterEvent = (eventId: number) => {
    if (registeredEvents.includes(eventId)) {
      setRegisteredEvents(registeredEvents.filter(id => id !== eventId));
      toast({
        title: "Registration cancelled",
        description: "You have been unregistered from this event.",
        variant: "success",
      });
    } else {
      setRegisteredEvents([...registeredEvents, eventId]);
      toast({
        title: "Registered!",
        description: "You have been registered for this event. Check your email for details.",
        variant: "success",
      });
    }
  };

  const handleNominate = () => {
    setShowNominationDialog(true);
  };

  const handleSubmitNomination = async () => {
    if (!nominationName.trim() || !nominationReason.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide the caregiver's name and reason for nomination.",
        variant: "error",
      });
      return;
    }

    setIsSubmittingNomination(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmittingNomination(false);
    setShowNominationDialog(false);
    setNominationName("");
    setNominationReason("");
    setNominationEmail("");

    toast({
      title: "Nomination submitted!",
      description: "Thank you for recognizing an outstanding caregiver. We'll review your nomination.",
      variant: "success",
    });
  };

  const handleContactAdvisor = () => {
    toast({
      title: "Connecting...",
      description: "A care advisor will reach out to you within 24 hours.",
      variant: "success",
    });
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    // Simulate network delay for loading more stories
    setTimeout(() => {
      setStories(prev => [...prev, ...moreStories.map(story => ({
        ...story,
        id: story.id + prev.length, // Ensure unique IDs
      }))]);
      setLoadingMore(false);
      setHasMoreStories(false);
      toast({
        title: "Stories loaded",
        description: "3 more stories have been added.",
        variant: "success",
      });
    }, 1000);
  };

  const filteredTopics = selectedCategory
    ? forumTopics.filter(t => t.category === selectedCategory)
    : forumTopics;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground">Community</h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with other families, share experiences, and find support in your caregiving journey
          </p>
          <div className="mt-6 max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search stories, topics, resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="stories" className="space-y-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-5">
            <TabsTrigger value="stories">Success Stories</TabsTrigger>
            <TabsTrigger value="forum">Forum</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="spotlight">Spotlight</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Success Stories Tab */}
          <TabsContent value="stories">
            <div className="space-y-8">
              {/* Featured Story */}
              {stories.filter(s => s.featured).map(story => (
                <Card key={story.id} className="overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/2 relative bg-gradient-to-br from-primary/20 to-primary/5">
                      <div className="h-64 md:h-full w-full flex items-center justify-center">
                        <div className="text-center p-8">
                          <Heart className="h-16 w-16 text-primary/40 mx-auto" />
                          <p className="mt-4 text-sm text-muted-foreground">Care Story</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 md:w-1/2">
                      <Badge className="mb-2">Featured Story</Badge>
                      <h2 className="text-2xl font-bold text-foreground">
                        {story.title}
                      </h2>
                      <p className="mt-2 text-muted-foreground">
                        {story.excerpt}
                      </p>
                      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{story.family}</span>
                        <span>•</span>
                        <span>with {story.caregiver}</span>
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(story.id)}
                          className={story.liked ? "text-red-500" : ""}
                        >
                          <Heart className={`mr-1 h-4 w-4 ${story.liked ? "fill-current" : ""}`} />
                          {story.likes}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="mr-1 h-4 w-4" />
                          {story.comments}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare(story.title)}
                        >
                          <Share2 className="mr-1 h-4 w-4" />
                          Share
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleBookmark(story.id)}
                          className={story.bookmarked ? "text-primary" : ""}
                        >
                          <Bookmark className={`h-4 w-4 ${story.bookmarked ? "fill-current" : ""}`} />
                        </Button>
                      </div>
                      <Button className="mt-4">Read Full Story</Button>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Other Stories Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                {stories.filter(s => !s.featured).map(story => (
                  <Card key={story.id} className="overflow-hidden">
                    <div className="h-48 w-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <div className="text-center">
                        <Heart className="h-10 w-10 text-muted-foreground/30 mx-auto" />
                        <p className="mt-2 text-xs text-muted-foreground">Care Story</p>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-bold text-foreground">
                        {story.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {story.excerpt}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {story.date}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(story.id)}
                            className={story.liked ? "text-red-500" : ""}
                          >
                            <Heart className={`mr-1 h-4 w-4 ${story.liked ? "fill-current" : ""}`} />
                            {story.likes}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="mr-1 h-4 w-4" />
                            {story.comments}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {hasMoreStories && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load More Stories"
                    )}
                  </Button>
                </div>
              )}
              {!hasMoreStories && (
                <div className="text-center text-muted-foreground text-sm">
                  You&apos;ve reached the end of all stories
                </div>
              )}
            </div>
          </TabsContent>

          {/* Forum Tab */}
          <TabsContent value="forum">
            <div className="grid gap-6 lg:grid-cols-4">
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Discussion Topics</CardTitle>
                      <Button onClick={handleStartNewTopic}>Start New Topic</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredTopics.map(topic => (
                        <div
                          key={topic.id}
                          className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {topic.pinned && (
                                <Badge variant="secondary" className="text-xs">
                                  Pinned
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {topic.category}
                              </Badge>
                            </div>
                            <h4 className="mt-1 font-medium text-foreground hover:text-primary">
                              {topic.title}
                            </h4>
                            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                              <span>by {topic.author}</span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                {topic.replies} replies
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {topic.views} views
                              </span>
                            </div>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {topic.lastActivity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Popular Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {["Caregiving Tips", "Family Support", "Medical Questions", "Local Resources", "Caregiver Resources"].map(cat => (
                        <Button
                          key={cat}
                          variant={selectedCategory === cat ? "default" : "ghost"}
                          className="w-full justify-start"
                          size="sm"
                          onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                        >
                          <BookOpen className="mr-2 h-4 w-4" />
                          {cat}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Community Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Members</span>
                        <span className="font-medium">12,456</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Topics</span>
                        <span className="font-medium">3,891</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Replies</span>
                        <span className="font-medium">45,672</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <div className="grid gap-6 lg:grid-cols-3">
              {upcomingEvents.map(event => (
                <Card key={event.id}>
                  <CardContent className="p-6">
                    <Badge variant={event.type.includes("Online") ? "secondary" : "default"}>
                      {event.type}
                    </Badge>
                    <h3 className="mt-3 text-lg font-bold text-foreground">
                      {event.title}
                    </h3>
                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {registeredEvents.includes(event.id)
                          ? event.attendees + 1
                          : event.attendees}/{event.maxAttendees} attending
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{
                            width: `${((registeredEvents.includes(event.id)
                              ? event.attendees + 1
                              : event.attendees) / event.maxAttendees) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                    <Button
                      className="w-full mt-4"
                      variant={registeredEvents.includes(event.id) ? "outline" : "default"}
                      onClick={() => handleRegisterEvent(event.id)}
                    >
                      {registeredEvents.includes(event.id) ? "Cancel Registration" : "Register"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Spotlight Tab */}
          <TabsContent value="spotlight">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Caregiver Spotlight
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                  {topCaregivers.map(caregiver => (
                    <Card key={caregiver.id}>
                      <CardContent className="p-6 text-center">
                        <div className="relative inline-block">
                          <Avatar className="h-24 w-24">
                            <AvatarImage src={caregiver.photo} alt={caregiver.name} />
                            <AvatarFallback>{caregiver.name[0]}</AvatarFallback>
                          </Avatar>
                          <Badge className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            <Award className="mr-1 h-3 w-3" />
                            {caregiver.badge}
                          </Badge>
                        </div>
                        <h3 className="mt-4 text-lg font-bold">{caregiver.name}</h3>
                        <p className="text-sm text-muted-foreground">{caregiver.specialty}</p>
                        <div className="mt-2 flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{caregiver.rating}</span>
                          <span className="text-muted-foreground">({caregiver.reviews} reviews)</span>
                        </div>
                        <Button variant="outline" className="mt-4 w-full" asChild>
                          <Link href={`/caregivers/${caregiver.id}`}>
                            View Profile
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Nominate a Caregiver</CardTitle>
                  <CardDescription>
                    Know an exceptional caregiver? Nominate them for our monthly spotlight!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleNominate}>Submit Nomination</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Local Resources</h2>
                {localResources.map((resource, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            {resource.type}
                          </Badge>
                          <h3 className="text-lg font-bold">{resource.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {resource.address}
                          </p>
                          <a
                            href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`}
                            className="text-sm text-primary hover:underline"
                          >
                            {resource.phone}
                          </a>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {resource.services.map(service => (
                              <Badge key={service} variant="secondary">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(resource.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Educational Content</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {[
                        { title: "Understanding Dementia: A Guide for Families", type: "Article" },
                        { title: "Caregiver Self-Care: Preventing Burnout", type: "Video" },
                        { title: "Medicare & Medicaid Explained", type: "Guide" },
                        { title: "Home Safety Checklist for Seniors", type: "Checklist" },
                        { title: "Communicating with Healthcare Providers", type: "Article" },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                          onClick={() => toast({
                            title: item.title,
                            description: "This resource will open in a new window.",
                            variant: "info",
                          })}
                        >
                          <div className="flex items-center gap-3">
                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {item.type}
                              </Badge>
                            </div>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Need More Help?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Our care advisors are available to help you find the right resources.
                    </p>
                    <Button className="w-full" onClick={handleContactAdvisor}>
                      Contact Care Advisor
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />

      {/* New Topic Dialog */}
      <Dialog open={showNewTopicDialog} onOpenChange={setShowNewTopicDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Start a New Discussion</DialogTitle>
            <DialogDescription>
              Share your question or topic with the community. Be respectful and helpful!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic-title">Topic Title *</Label>
              <Input
                id="topic-title"
                placeholder="What would you like to discuss?"
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic-category">Category *</Label>
              <Select value={newTopicCategory} onValueChange={setNewTopicCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Caregiving Tips">Caregiving Tips</SelectItem>
                  <SelectItem value="Family Support">Family Support</SelectItem>
                  <SelectItem value="Medical Questions">Medical Questions</SelectItem>
                  <SelectItem value="Local Resources">Local Resources</SelectItem>
                  <SelectItem value="Caregiver Resources">Caregiver Resources</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic-content">Your Message *</Label>
              <Textarea
                id="topic-content"
                placeholder="Share more details about your topic..."
                value={newTopicContent}
                onChange={(e) => setNewTopicContent(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTopicDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitNewTopic} disabled={isSubmittingTopic}>
              {isSubmittingTopic ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Post Topic
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Nomination Dialog */}
      <Dialog open={showNominationDialog} onOpenChange={setShowNominationDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nominate a Caregiver</DialogTitle>
            <DialogDescription>
              Know an exceptional caregiver? Tell us why they deserve recognition!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="caregiver-name">Caregiver&apos;s Name *</Label>
              <Input
                id="caregiver-name"
                placeholder="Enter the caregiver's full name"
                value={nominationName}
                onChange={(e) => setNominationName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nomination-reason">Why are you nominating them? *</Label>
              <Textarea
                id="nomination-reason"
                placeholder="Tell us what makes this caregiver exceptional..."
                value={nominationReason}
                onChange={(e) => setNominationReason(e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="your-email">Your Email (optional)</Label>
              <Input
                id="your-email"
                type="email"
                placeholder="your@email.com"
                value={nominationEmail}
                onChange={(e) => setNominationEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                We may reach out to you for more details about your nomination.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNominationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitNomination} disabled={isSubmittingNomination}>
              {isSubmittingNomination ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Award className="mr-2 h-4 w-4" />
                  Submit Nomination
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
