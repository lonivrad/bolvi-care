"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BackButton } from "@/components/ui/back-button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Eye,
  Type,
  Contrast,
  MousePointer,
  Keyboard,
  Volume2,
  Sun,
  Moon,
  Palette,
  RotateCcw,
  Save,
  Accessibility,
} from "lucide-react";

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  reducedMotion: boolean;
  largeClickTargets: boolean;
  keyboardNavigation: boolean;
  screenReaderOptimized: boolean;
  colorBlindMode: "none" | "deuteranopia" | "protanopia" | "tritanopia";
  textSpacing: number;
  focusIndicators: boolean;
  autoplayMedia: boolean;
  captions: boolean;
  darkMode: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  highContrast: false,
  reducedMotion: false,
  largeClickTargets: false,
  keyboardNavigation: true,
  screenReaderOptimized: false,
  colorBlindMode: "none",
  textSpacing: 100,
  focusIndicators: true,
  autoplayMedia: false,
  captions: true,
  darkMode: false,
};

export default function AccessibilityPage() {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setSaved(false);
  };

  const saveSettings = () => {
    // In a real app, this would persist to localStorage or backend
    localStorage.setItem("accessibility-settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Navigation */}
      <div className="mb-6">
        <BackButton href="/settings" label="Back to Settings" variant="link" />
      </div>

      <Breadcrumb
        items={[
          { label: "Settings", href: "/settings" },
          { label: "Accessibility" },
        ]}
        className="mb-6"
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Accessibility className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Accessibility Settings
            </h1>
            <p className="text-muted-foreground">
              Customize your experience for better accessibility
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Visual Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Visual Settings
            </CardTitle>
            <CardDescription>
              Adjust visual appearance for better readability
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Font Size */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="fontSize" className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Text Size
                </Label>
                <span className="text-sm text-muted-foreground">
                  {settings.fontSize}%
                </span>
              </div>
              <Slider
                id="fontSize"
                min={75}
                max={200}
                step={25}
                value={[settings.fontSize]}
                onValueChange={([value]) => updateSetting("fontSize", value)}
                className="w-full"
                aria-label="Adjust text size"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Smaller</span>
                <span>Default</span>
                <span>Larger</span>
              </div>
              <p
                className="text-sm border rounded-lg p-3 bg-muted/50"
                style={{ fontSize: `${settings.fontSize}%` }}
              >
                Preview: This is how text will appear at {settings.fontSize}% size.
              </p>
            </div>

            {/* Text Spacing */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="textSpacing">Letter & Line Spacing</Label>
                <span className="text-sm text-muted-foreground">
                  {settings.textSpacing}%
                </span>
              </div>
              <Slider
                id="textSpacing"
                min={100}
                max={200}
                step={25}
                value={[settings.textSpacing]}
                onValueChange={([value]) => updateSetting("textSpacing", value)}
                className="w-full"
                aria-label="Adjust text spacing"
              />
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label
                  htmlFor="highContrast"
                  className="flex items-center gap-2"
                >
                  <Contrast className="h-4 w-4" />
                  High Contrast Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Increase contrast between text and backgrounds
                </p>
              </div>
              <Switch
                id="highContrast"
                checked={settings.highContrast}
                onCheckedChange={(checked) =>
                  updateSetting("highContrast", checked)
                }
                aria-label="Toggle high contrast mode"
              />
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="darkMode" className="flex items-center gap-2">
                  {settings.darkMode ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                  Dark Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Use dark colors to reduce eye strain
                </p>
              </div>
              <Switch
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => updateSetting("darkMode", checked)}
                aria-label="Toggle dark mode"
              />
            </div>

            {/* Color Blind Mode */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Color Vision Mode
              </Label>
              <RadioGroup
                value={settings.colorBlindMode}
                onValueChange={(value) =>
                  updateSetting(
                    "colorBlindMode",
                    value as AccessibilitySettings["colorBlindMode"]
                  )
                }
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="cb-none" />
                  <Label htmlFor="cb-none" className="cursor-pointer">
                    Standard
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="deuteranopia" id="cb-deuteranopia" />
                  <Label htmlFor="cb-deuteranopia" className="cursor-pointer">
                    Deuteranopia (Green-blind)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="protanopia" id="cb-protanopia" />
                  <Label htmlFor="cb-protanopia" className="cursor-pointer">
                    Protanopia (Red-blind)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tritanopia" id="cb-tritanopia" />
                  <Label htmlFor="cb-tritanopia" className="cursor-pointer">
                    Tritanopia (Blue-blind)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Motor & Interaction Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointer className="h-5 w-5" />
              Motor & Interaction
            </CardTitle>
            <CardDescription>
              Make interactions easier and more accessible
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Large Click Targets */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="largeClickTargets">Large Click Targets</Label>
                <p className="text-sm text-muted-foreground">
                  Increase button and link sizes for easier clicking
                </p>
              </div>
              <Switch
                id="largeClickTargets"
                checked={settings.largeClickTargets}
                onCheckedChange={(checked) =>
                  updateSetting("largeClickTargets", checked)
                }
              />
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reducedMotion">Reduce Motion</Label>
                <p className="text-sm text-muted-foreground">
                  Minimize animations and transitions
                </p>
              </div>
              <Switch
                id="reducedMotion"
                checked={settings.reducedMotion}
                onCheckedChange={(checked) =>
                  updateSetting("reducedMotion", checked)
                }
              />
            </div>

            {/* Focus Indicators */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="focusIndicators">Enhanced Focus Indicators</Label>
                <p className="text-sm text-muted-foreground">
                  Show prominent outlines on focused elements
                </p>
              </div>
              <Switch
                id="focusIndicators"
                checked={settings.focusIndicators}
                onCheckedChange={(checked) =>
                  updateSetting("focusIndicators", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Keyboard & Screen Reader */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Keyboard & Screen Reader
            </CardTitle>
            <CardDescription>
              Settings for keyboard navigation and assistive technologies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Keyboard Navigation */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="keyboardNavigation">
                  Full Keyboard Navigation
                </Label>
                <p className="text-sm text-muted-foreground">
                  Navigate all features using only the keyboard
                </p>
              </div>
              <Switch
                id="keyboardNavigation"
                checked={settings.keyboardNavigation}
                onCheckedChange={(checked) =>
                  updateSetting("keyboardNavigation", checked)
                }
              />
            </div>

            {/* Screen Reader Optimization */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="screenReaderOptimized">
                  Screen Reader Optimization
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enhanced compatibility with screen readers
                </p>
              </div>
              <Switch
                id="screenReaderOptimized"
                checked={settings.screenReaderOptimized}
                onCheckedChange={(checked) =>
                  updateSetting("screenReaderOptimized", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Audio & Media */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Audio & Media
            </CardTitle>
            <CardDescription>
              Control how audio and video content behaves
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Autoplay Media */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoplayMedia">Autoplay Media</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically play videos and audio
                </p>
              </div>
              <Switch
                id="autoplayMedia"
                checked={settings.autoplayMedia}
                onCheckedChange={(checked) =>
                  updateSetting("autoplayMedia", checked)
                }
              />
            </div>

            {/* Captions */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="captions">Always Show Captions</Label>
                <p className="text-sm text-muted-foreground">
                  Display captions on all video content
                </p>
              </div>
              <Switch
                id="captions"
                checked={settings.captions}
                onCheckedChange={(checked) => updateSetting("captions", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" onClick={resetSettings}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button onClick={saveSettings}>
            <Save className="mr-2 h-4 w-4" />
            {saved ? "Saved!" : "Save Settings"}
          </Button>
        </div>

        {/* Accessibility Statement Link */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Bolvi Care is committed to WCAG 2.1 Level AA accessibility
                compliance. We continuously work to improve the accessibility of
                our platform for all users.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="link" asChild>
                  <a href="/accessibility-statement">
                    Read our Accessibility Statement
                  </a>
                </Button>
                <Button variant="link" asChild>
                  <a href="mailto:accessibility@bolvicare.com">
                    Report an Issue
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </main>
      <Footer />
    </>
  );
}
