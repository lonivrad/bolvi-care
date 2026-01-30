"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  ChevronRight,
  ChevronLeft,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Printer,
  Calendar,
} from "lucide-react";
import {
  helpCategories,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/help-data";
import ReactMarkdown from "react-markdown";

export default function ArticlePage() {
  const { toast } = useToast();
  const params = useParams();
  const slug = params.slug as string;

  const article = useMemo(() => getArticleBySlug(slug), [slug]);
  const relatedArticles = useMemo(
    () => (article ? getRelatedArticles(article.id) : []),
    [article]
  );

  const [helpfulVote, setHelpfulVote] = useState<"yes" | "no" | null>(null);

  if (!article) {
    notFound();
  }

  const category = helpCategories.find((c) => c.id === article.categoryId);

  const handleVote = (vote: "yes" | "no") => {
    setHelpfulVote(vote);
    toast({
      title: "Thank you for your feedback!",
      description: vote === "yes"
        ? "We're glad this article was helpful."
        : "We'll work to improve this article.",
      variant: "success",
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      });
    } catch {
      // Fallback to copy link
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Article link has been copied to clipboard.",
        variant: "success",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/help" className="hover:text-foreground transition-colors">
            Help Center
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={`/help/category/${article.categoryId}`}
            className="hover:text-foreground transition-colors"
          >
            {category?.title}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground truncate max-w-[200px]">{article.title}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Article Header */}
            <div className="mb-6">
              <Badge variant="secondary" className="mb-3">
                {category?.title}
              </Badge>
              <h1 className="text-3xl font-bold text-foreground">{article.title}</h1>
              <p className="mt-2 text-lg text-muted-foreground">{article.summary}</p>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {article.readTime} min read
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {article.views.toLocaleString()} views
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Updated {new Date(article.lastUpdated).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Article Content */}
            <Card>
              <CardContent className="py-6 prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => (
                      <h2 className="text-xl font-bold mt-6 mb-3 text-foreground">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground">{children}</h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="text-base font-semibold mt-3 mb-2 text-foreground">{children}</h4>
                    ),
                    p: ({ children }) => (
                      <p className="my-3 text-muted-foreground leading-relaxed">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="my-3 ml-6 list-disc space-y-1">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="my-3 ml-6 list-decimal space-y-1">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-muted-foreground">{children}</li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">{children}</strong>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-4">
                        <table className="w-full border-collapse border border-border">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-muted">{children}</thead>
                    ),
                    th: ({ children }) => (
                      <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-border px-4 py-2 text-muted-foreground">
                        {children}
                      </td>
                    ),
                    hr: () => <hr className="my-6 border-border" />,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children }) => (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code>
                    ),
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </CardContent>
            </Card>

            {/* Helpful Section */}
            <Card className="mt-6">
              <CardContent className="py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground">Was this article helpful?</h3>
                    <p className="text-sm text-muted-foreground">
                      {article.helpful} people found this helpful
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={helpfulVote === "yes" ? "default" : "outline"}
                      onClick={() => handleVote("yes")}
                      disabled={helpfulVote !== null}
                    >
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      Yes
                    </Button>
                    <Button
                      variant={helpfulVote === "no" ? "default" : "outline"}
                      onClick={() => handleVote("no")}
                      disabled={helpfulVote !== null}
                    >
                      <ThumbsDown className="mr-2 h-4 w-4" />
                      No
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-between">
              <Button variant="outline" asChild>
                <Link href={`/help/category/${article.categoryId}`}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to {category?.title}
                </Link>
              </Button>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handlePrint}>
                  <Printer className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Related Articles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.id}
                      href={`/help/article/${related.slug}`}
                      className="block p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <h4 className="font-medium text-foreground text-sm line-clamp-2">
                        {related.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {related.readTime} min read
                      </p>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Need More Help */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Still need help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Can&apos;t find what you&apos;re looking for? Our support team is here to help.
                </p>
                <Button className="w-full" asChild>
                  <Link href="/help#contact">Contact Support</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Browse Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Browse Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {helpCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/help/category/${cat.id}`}
                    className={`flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors ${
                      cat.id === article.categoryId ? "bg-muted" : ""
                    }`}
                  >
                    <cat.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{cat.title}</span>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
