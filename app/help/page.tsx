"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  MessageCircle,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  Clock,
  X,
} from "lucide-react";
import {
  helpCategories,
  getPopularArticles,
  getFAQs,
  searchArticles,
  getArticlesByCategory,
} from "@/lib/help-data";

const quickLinks = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Community Guidelines", href: "/community" },
  { label: "Accessibility", href: "/accessibility" },
];

export default function HelpCenterPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const popularArticles = useMemo(() => getPopularArticles(5), []);
  const faqs = useMemo(() => getFAQs(), []);

  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return searchArticles(searchQuery).slice(0, 10);
  }, [searchQuery]);

  const handleLiveChat = () => {
    toast({
      title: "Live Chat",
      description: "Connecting you to a support agent...",
      variant: "info",
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length >= 2) {
      setShowSearchResults(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const getCategoryTitle = (categoryId: string) => {
    return helpCategories.find(c => c.id === categoryId)?.title || categoryId;
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground">How can we help?</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Search our help center or browse categories below
          </p>
          <form onSubmit={handleSearch} className="mt-6 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.length >= 2) {
                  setShowSearchResults(true);
                } else {
                  setShowSearchResults(false);
                }
              }}
              className="pl-12 pr-10 h-12 text-lg"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </form>

          {/* Search Results Dropdown */}
          {showSearchResults && searchQuery.length >= 2 && (
            <div className="mt-2 max-w-xl mx-auto bg-card border border-border rounded-lg shadow-lg text-left">
              {searchResults.length > 0 ? (
                <div className="py-2">
                  <p className="px-4 py-2 text-sm text-muted-foreground">
                    {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} found
                  </p>
                  {searchResults.map((article) => (
                    <Link
                      key={article.id}
                      href={`/help/article/${article.slug}`}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-muted transition-colors"
                      onClick={() => setShowSearchResults(false)}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{article.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {article.summary}
                        </p>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {getCategoryTitle(article.categoryId)}
                        </Badge>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground mt-1" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center">
                  <p className="text-muted-foreground">No articles found for &quot;{searchQuery}&quot;</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try different keywords or browse categories below
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Category Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {helpCategories.map((category) => {
            const Icon = category.icon;
            const articleCount = getArticlesByCategory(category.id).length;
            return (
              <Link
                key={category.id}
                href={`/help/category/${category.id}`}
              >
                <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {category.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {category.description}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {articleCount} article{articleCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Popular Articles */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Popular Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {popularArticles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/help/article/${article.slug}`}
                      className="flex items-center justify-between border-b border-border py-4 last:border-0 hover:bg-muted/50 -mx-4 px-4 rounded transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground hover:text-primary">
                          {article.title}
                        </h4>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-muted-foreground">
                            {getCategoryTitle(article.categoryId)}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {article.readTime} min read
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* FAQs */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`faq-${index}`}
                      className="border border-border rounded-lg px-4"
                    >
                      <AccordionTrigger className="hover:no-underline text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Contact Options */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Need more help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={handleLiveChat}
                >
                  <MessageCircle className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Live Chat</p>
                    <p className="text-xs text-muted-foreground">
                      Available 24/7
                    </p>
                  </div>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="tel:1-800-265-8422">
                    <Phone className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">Call Us</p>
                      <p className="text-xs text-muted-foreground">
                        1-800-BOLVI-CARE
                      </p>
                    </div>
                  </a>
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <a href="mailto:support@bolvicare.com">
                    <Mail className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">Email Support</p>
                      <p className="text-xs text-muted-foreground">
                        support@bolvicare.com
                      </p>
                    </div>
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  If you or your loved one is experiencing a medical emergency,
                  please call 911 immediately.
                </p>
                <Button variant="destructive" className="w-full" asChild>
                  <a href="tel:911">
                    <Phone className="mr-2 h-4 w-4" />
                    Call 911
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quickLinks.map((link) => (
                    <Button
                      key={link.label}
                      variant="ghost"
                      className="w-full justify-between"
                      asChild
                    >
                      <Link href={link.href}>
                        {link.label}
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
