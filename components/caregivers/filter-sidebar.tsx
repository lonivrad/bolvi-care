"use client";

import { useCaregiversStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
  "Companionship",
  "Personal Care",
  "Medication Reminders",
  "Meal Prep",
  "Transportation",
  "Light Housekeeping",
  "Dementia Care",
  "Hospice Support",
  "Physical Therapy Support",
  "Overnight Care",
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

export function FilterSidebar() {
  const { filters, setFilters } = useCaregiversStore();

  const toggleService = (service: string) => {
    const newServices = filters.services.includes(service)
      ? filters.services.filter((s) => s !== service)
      : [...filters.services, service];
    setFilters({ services: newServices });
  };

  const toggleLanguage = (language: string) => {
    const newLanguages = filters.languages.includes(language)
      ? filters.languages.filter((l) => l !== language)
      : [...filters.languages, language];
    setFilters({ languages: newLanguages });
  };

  const toggleCertification = (cert: string) => {
    const newCerts = filters.certifications.includes(cert)
      ? filters.certifications.filter((c) => c !== cert)
      : [...filters.certifications, cert];
    setFilters({ certifications: newCerts });
  };

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-foreground">Price Range</h3>
        <div className="mt-4">
          <Slider
            value={[filters.minRate, filters.maxRate]}
            min={20}
            max={70}
            step={5}
            onValueChange={([min, max]) => setFilters({ minRate: min, maxRate: max })}
            className="w-full"
          />
          <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
            <span>${filters.minRate}/hr</span>
            <span>${filters.maxRate}/hr</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <h3 className="text-sm font-semibold text-foreground">Minimum Rating</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {[0, 4, 4.5, 4.8].map((rating) => (
            <Button
              key={rating}
              variant={filters.minRating === rating ? "secondary" : "outline"}
              size="sm"
              onClick={() => setFilters({ minRating: rating })}
              className="gap-1"
            >
              {rating === 0 ? (
                "Any"
              ) : (
                <>
                  <Star className="h-3 w-3 fill-secondary text-secondary" />
                  {rating}+
                </>
              )}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Services */}
      <div>
        <h3 className="text-sm font-semibold text-foreground">Services</h3>
        <div className="mt-3 space-y-2">
          {services.map((service) => (
            <div key={service} className="flex items-center gap-2">
              <Checkbox
                id={`service-${service}`}
                checked={filters.services.includes(service)}
                onCheckedChange={() => toggleService(service)}
              />
              <Label
                htmlFor={`service-${service}`}
                className="text-sm font-normal text-muted-foreground cursor-pointer"
              >
                {service}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Languages */}
      <div>
        <h3 className="text-sm font-semibold text-foreground">Languages</h3>
        <div className="mt-3 space-y-2">
          {languages.map((language) => (
            <div key={language} className="flex items-center gap-2">
              <Checkbox
                id={`lang-${language}`}
                checked={filters.languages.includes(language)}
                onCheckedChange={() => toggleLanguage(language)}
              />
              <Label
                htmlFor={`lang-${language}`}
                className="text-sm font-normal text-muted-foreground cursor-pointer"
              >
                {language}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Certifications */}
      <div>
        <h3 className="text-sm font-semibold text-foreground">Certifications</h3>
        <div className="mt-3 space-y-2">
          {certifications.map((cert) => (
            <div key={cert} className="flex items-center gap-2">
              <Checkbox
                id={`cert-${cert}`}
                checked={filters.certifications.includes(cert)}
                onCheckedChange={() => toggleCertification(cert)}
              />
              <Label
                htmlFor={`cert-${cert}`}
                className="text-sm font-normal text-muted-foreground cursor-pointer"
              >
                {cert}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
