"use client";

import { useEffect, useState } from "react";
import { Clock, Users, Star, Heart } from "lucide-react";

const stats = [
  {
    icon: Clock,
    value: 25000,
    suffix: "+",
    label: "Hours of Care Delivered",
  },
  {
    icon: Users,
    value: 500,
    suffix: "+",
    label: "Verified Caregivers",
  },
  {
    icon: Star,
    value: 4.9,
    suffix: "",
    label: "Average Rating",
    decimals: 1,
  },
  {
    icon: Heart,
    value: 5000,
    suffix: "+",
    label: "Families Served",
  },
];

function AnimatedCounter({ 
  value, 
  suffix = "", 
  decimals = 0 
}: { 
  value: number; 
  suffix?: string; 
  decimals?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-16 bg-card border-y border-border">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground lg:text-4xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
