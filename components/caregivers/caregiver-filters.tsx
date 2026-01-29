"use client";

import { useCaregiversStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const services = [
  "Companionship",
  "Personal Care",
  "Dementia Care",
  "Medication Reminders",
  "Meal Prep",
  "Transportation",
  "Light Housekeeping",
  "Hospice Care",
  "Night Care",
  "Exercise Assistance",
];

const languages = ["English", "Spanish", "Mandarin", "Cantonese", "Korean", "French", "Portuguese"];

const certifications = [
  "CPR Certified",
  "CNA",
  "RN",
  "First Aid",
  "Dementia Care Specialist",
  "Hospice Certified",
];

const availabilityOptions = ["Available Now", "This Week", "Weekends", "Evenings"];

interface CaregiverFiltersProps {
  onApply?: () => void;
}

export function CaregiverFilters({ onApply }: CaregiverFiltersProps) {
  const { filters, setFilters, resetFilters } = useCaregiversStore();

  const toggleArrayFilter = (
    key: "services" | "languages" | "certifications" | "availability",
    value: string
  ) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setFilters({ [key]: updated });
  };

  const handleApply = () => {
    onApply?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          Reset
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["rate", "rating", "services"]} className="w-full">
        {/* Hourly Rate */}
        <AccordionItem value="rate">
          <AccordionTrigger className="text-sm font-medium">Hourly Rate</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider
                value={[filters.minRate, filters.maxRate]}
                min={20}
                max={70}
                step={5}
                onValueChange={([min, max]) => setFilters({ minRate: min, maxRate: max })}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${filters.minRate}/hr</span>
                <span>${filters.maxRate}/hr</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Minimum Rating */}
        <AccordionItem value="rating">
          <AccordionTrigger className="text-sm font-medium">Minimum Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {[0, 4, 4.5, 4.8].map((rating) => (
                <label
                  key={rating}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Checkbox
                    checked={filters.minRating === rating}
                    onCheckedChange={() => setFilters({ minRating: rating })}
                  />
                  <span className="text-sm">
                    {rating === 0 ? "Any rating" : `${rating}+ stars`}
                  </span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Services */}
        <AccordionItem value="services">
          <AccordionTrigger className="text-sm font-medium">Services</AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 space-y-3 overflow-y-auto pt-2">
              {services.map((service) => (
                <label
                  key={service}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Checkbox
                    checked={filters.services.includes(service)}
                    onCheckedChange={() => toggleArrayFilter("services", service)}
                  />
                  <span className="text-sm">{service}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Languages */}
        <AccordionItem value="languages">
          <AccordionTrigger className="text-sm font-medium">Languages</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {languages.map((lang) => (
                <label
                  key={lang}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Checkbox
                    checked={filters.languages.includes(lang)}
                    onCheckedChange={() => toggleArrayFilter("languages", lang)}
                  />
                  <span className="text-sm">{lang}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Certifications */}
        <AccordionItem value="certifications">
          <AccordionTrigger className="text-sm font-medium">Certifications</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {certifications.map((cert) => (
                <label
                  key={cert}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Checkbox
                    checked={filters.certifications.includes(cert)}
                    onCheckedChange={() => toggleArrayFilter("certifications", cert)}
                  />
                  <span className="text-sm">{cert}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Availability */}
        <AccordionItem value="availability">
          <AccordionTrigger className="text-sm font-medium">Availability</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {availabilityOptions.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Checkbox
                    checked={filters.availability.includes(option)}
                    onCheckedChange={() => toggleArrayFilter("availability", option)}
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      {/* Apply Button (mobile) */}
      {onApply && (
        <Button className="w-full" onClick={handleApply}>
          Apply Filters
        </Button>
      )}
    </div>
  );
}
