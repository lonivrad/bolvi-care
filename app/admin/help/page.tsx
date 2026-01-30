"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  FileText,
  HelpCircle,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  ExternalLink,
  Video,
  Download,
  MessageSquare,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  Copy,
  Settings,
  Folder,
  File,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Article {
  id: string;
  title: string;
  category: string;
  status: "published" | "draft" | "archived";
  views: number;
  helpful: number;
  updatedAt: string;
  author: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

const articles: Article[] = [
  {
    id: "1",
    title: "Getting Started with Bolvi Care",
    category: "Getting Started",
    status: "published",
    views: 12450,
    helpful: 892,
    updatedAt: "2024-03-01",
    author: "Support Team",
  },
  {
    id: "2",
    title: "How to Book a Caregiver",
    category: "Booking",
    status: "published",
    views: 8920,
    helpful: 654,
    updatedAt: "2024-02-28",
    author: "Support Team",
  },
  {
    id: "3",
    title: "Payment Methods and Billing",
    category: "Payments",
    status: "published",
    views: 6543,
    helpful: 432,
    updatedAt: "2024-02-25",
    author: "Finance Team",
  },
  {
    id: "4",
    title: "Safety Guidelines for Families",
    category: "Safety",
    status: "published",
    views: 5678,
    helpful: 398,
    updatedAt: "2024-02-20",
    author: "Safety Team",
  },
  {
    id: "5",
    title: "Caregiver Certification Process",
    category: "For Caregivers",
    status: "draft",
    views: 0,
    helpful: 0,
    updatedAt: "2024-03-02",
    author: "Support Team",
  },
];

const faqs: FAQ[] = [
  {
    id: "1",
    question: "How do I create an account?",
    answer: "You can create an account by clicking the 'Sign Up' button on the homepage. You'll need to provide your email, create a password, and complete your profile.",
    category: "Account",
    order: 1,
  },
  {
    id: "2",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and digital wallets including Apple Pay and Google Pay. Payments are processed securely through Stripe.",
    category: "Payments",
    order: 2,
  },
  {
    id: "3",
    question: "How are caregivers verified?",
    answer: "All caregivers go through a comprehensive background check, identity verification, and credential validation. We also verify references and conduct interviews.",
    category: "Safety",
    order: 3,
  },
  {
    id: "4",
    question: "What if I need to cancel a booking?",
    answer: "You can cancel a booking up to 24 hours in advance for a full refund. Cancellations within 24 hours may be subject to a cancellation fee.",
    category: "Booking",
    order: 4,
  },
];

const categories = [
  { name: "Getting Started", count: 8, icon: BookOpen },
  { name: "Booking", count: 12, icon: FileText },
  { name: "Payments", count: 6, icon: FileText },
  { name: "Safety", count: 10, icon: FileText },
  { name: "For Caregivers", count: 15, icon: FileText },
  { name: "Account", count: 7, icon: FileText },
];

const stats = [
  { label: "Total Articles", value: "58", icon: FileText, color: "text-blue-600" },
  { label: "Total Views", value: "156K", icon: Eye, color: "text-green-600" },
  { label: "Helpful Votes", value: "12.4K", icon: CheckCircle, color: "text-purple-600" },
  { label: "Support Tickets", value: "23", icon: MessageSquare, color: "text-amber-600" },
];

export default function AdminHelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("articles");
  const [isAddArticleOpen, setIsAddArticleOpen] = useState(false);

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: Article["status"]) => {
    const styles = {
      published: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      draft: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      archived: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return (
      <Badge variant="secondary" className={cn("capitalize", styles[status])}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Help Center Management</h1>
          <p className="text-muted-foreground">Manage documentation, articles, and FAQs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/help" target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Help Center
            </a>
          </Button>
          <Dialog open={isAddArticleOpen} onOpenChange={setIsAddArticleOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Article</DialogTitle>
                <DialogDescription>
                  Write a new help article for users
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Article Title</Label>
                  <Input id="title" placeholder="e.g., How to Update Your Profile" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.name} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue="draft">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your article content here... (Markdown supported)"
                    rows={10}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddArticleOpen(false)}>
                  Save as Draft
                </Button>
                <Button onClick={() => setIsAddArticleOpen(false)}>
                  Publish Article
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="articles">
            <FileText className="mr-2 h-4 w-4" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="faqs">
            <HelpCircle className="mr-2 h-4 w-4" />
            FAQs
          </TabsTrigger>
          <TabsTrigger value="categories">
            <Folder className="mr-2 h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="resources">
            <Download className="mr-2 h-4 w-4" />
            Resources
          </TabsTrigger>
        </TabsList>

        {/* Articles Tab */}
        <TabsContent value="articles" className="space-y-4 mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {filteredArticles.map((article) => (
              <Card key={article.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{article.title}</h3>
                        {getStatusBadge(article.status)}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{article.category}</Badge>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {article.views.toLocaleString()} views
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {article.helpful} helpful
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Updated {article.updatedAt}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="space-y-4 mt-6">
          <div className="flex justify-end">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add FAQ
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Frequently Asked Questions</CardTitle>
              <CardDescription>Manage FAQ entries displayed on the help center</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="border rounded-lg px-4"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <Badge variant="outline" className="text-xs">
                          {faq.category}
                        </Badge>
                        <span>{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-2">
                        <p className="text-muted-foreground mb-4">{faq.answer}</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit2 className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <Trash2 className="mr-1 h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4 mt-6">
          <div className="flex justify-end">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.name}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {category.count} articles
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4 mt-6">
          <div className="flex justify-end">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Upload Resource
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Video Tutorials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: "Getting Started Guide", duration: "5:32", views: 2341 },
                    { title: "How to Book a Caregiver", duration: "3:45", views: 1892 },
                    { title: "Managing Your Account", duration: "4:12", views: 1456 },
                  ].map((video) => (
                    <div
                      key={video.title}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-14 rounded bg-muted flex items-center justify-center">
                          <Video className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{video.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {video.duration} • {video.views.toLocaleString()} views
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Downloadable Guides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: "Family Care Guide", format: "PDF", size: "2.4 MB" },
                    { title: "Caregiver Handbook", format: "PDF", size: "3.1 MB" },
                    { title: "Safety Checklist", format: "PDF", size: "1.2 MB" },
                  ].map((file) => (
                    <div
                      key={file.title}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <File className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{file.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {file.format} • {file.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
