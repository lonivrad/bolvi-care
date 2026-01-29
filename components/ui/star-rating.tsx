"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const sizes = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  interactive = false,
  onChange,
}: StarRatingProps) {
  const stars = Array.from({ length: maxRating }, (_, i) => {
    const starValue = i + 1;
    const isFilled = starValue <= Math.floor(rating);
    const isPartial = starValue === Math.ceil(rating) && rating % 1 !== 0;
    const fillPercentage = isPartial ? (rating % 1) * 100 : 0;

    return (
      <button
        key={i}
        type="button"
        disabled={!interactive}
        onClick={() => interactive && onChange?.(starValue)}
        className={cn(
          "relative",
          interactive && "cursor-pointer transition-transform hover:scale-110"
        )}
      >
        {/* Background star (empty) */}
        <Star className={cn(sizes[size], "text-muted-foreground/30")} />
        
        {/* Filled star (overlay) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: isFilled ? "100%" : `${fillPercentage}%` }}
        >
          <Star className={cn(sizes[size], "fill-secondary text-secondary")} />
        </div>
      </button>
    );
  });

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      {showValue && (
        <span className="ml-1 text-sm font-medium text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
