"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    content: "Bolvi Care has been a blessing for our family. Maria treats my mother like her own grandmother. The detailed visit reports give us peace of mind even from miles away.",
    author: "Sarah M.",
    role: "Daughter caring for mother",
    location: "San Francisco, CA",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    content: "After trying two agencies, we found Bolvi Care. The transparency in pricing and the quality of caregivers is unmatched. Dad actually looks forward to his visits now.",
    author: "John D.",
    role: "Son caring for father",
    location: "Oakland, CA",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    content: "The booking process is so easy, and I love being able to read real reviews. Our caregiver James is patient, professional, and my husband trusts him completely.",
    author: "Margaret H.",
    role: "Wife caring for husband",
    location: "Berkeley, CA",
    rating: 5,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
  },
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl text-balance">
            Trusted by Thousands of Families
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hear from families who have found peace of mind with Bolvi Care.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-2xl bg-card border border-border p-8 lg:p-12">
            <Quote className="h-12 w-12 text-primary/20 mb-6" />
            
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonials[current].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                  ))}
                </div>
                
                <blockquote className="text-lg lg:text-xl text-foreground leading-relaxed">
                  "{testimonials[current].content}"
                </blockquote>
                
                <div className="mt-6">
                  <p className="font-semibold text-foreground">{testimonials[current].author}</p>
                  <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
                  <p className="text-sm text-muted-foreground">{testimonials[current].location}</p>
                </div>
              </div>
              
              <div className="shrink-0">
                <img
                  src={testimonials[current].image}
                  alt={testimonials[current].author}
                  className="h-24 w-24 lg:h-32 lg:w-32 rounded-full object-cover ring-4 ring-primary/10"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Button variant="outline" size="icon" onClick={prev} aria-label="Previous testimonial">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    i === current ? "bg-primary" : "bg-border"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={next} aria-label="Next testimonial">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
