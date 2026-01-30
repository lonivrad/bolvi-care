"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronLeft, Clock, Eye, ThumbsUp } from "lucide-react";
import {
  helpCategories,
  getArticlesByCategory,
} from "@/lib/help-data";

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;

  const category = useMemo(
    () => helpCategories.find((c) => c.id === categoryId),
    [categoryId]
  );

  const articles = useMemo(
    () => getArticlesByCategory(categoryId),
    [categoryId]
  );

  if (!category) {
    notFound();
  }

  const Icon = category.icon;

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
          <span className="text-foreground">{category.title}</span>
        </div>

        {/* Category Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{category.title}</h1>
            <p className="mt-1 text-muted-foreground">{category.description}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {articles.length} article{articles.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {articles.map((article) => (
            <Link key={article.id} href={`/help/article/${article.slug}`}>
              <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-lg">
                        {article.title}
                      </h3>
                      <p className="mt-2 text-muted-foreground line-clamp-2">
                        {article.summary}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          {article.readTime} min read
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Eye className="h-4 w-4 flex-shrink-0" />
                          {article.views.toLocaleString()} views
                        </span>
                        <span className="flex items-center gap-1.5">
                          <ThumbsUp className="h-4 w-4 flex-shrink-0" />
                          {article.helpful} found helpful
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Button variant="outline" asChild>
            <Link href="/help">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Help Center
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
