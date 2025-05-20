"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/app/components/dashboard/icons";
import { Card } from "@/components/ui/card";
import { ModernTemplate } from "@/components/templates/modern-template";
import { TemplateData } from "./types";
import { HeroSection } from "./sections/HeroSection";
import { AboutSection } from "./sections/AboutSection";
import { WhyChooseSection } from "./sections/WhyChooseSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { PricingSection } from "./sections/PricingSection";
import { FaqSection } from "./sections/FaqSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { BrandSection } from "./sections/BrandSection";
import { ThemeSection } from "./sections/ThemeSection";
import { MediaSection } from "./sections/MediaSection";
import { NavbarSection } from "./sections/NavbarSection";

interface ModernTemplateEditorProps {
  data: TemplateData;
  updateData: (path: string, value: any) => void;
}

// Template wrapper that adapts editor data for the ModernTemplate component
function TemplateWrapper({ data }: { data: TemplateData }) {
  // Format the data to match what ModernTemplate expects
  return (
    <ModernTemplate 
      data={data} 
      isEditing={true}
    />
  );
}

export function ModernTemplateEditor({ data, updateData }: ModernTemplateEditorProps) {
  const [activeSection, setActiveSection] = useState<string>("navbar");

  const sections = [
    { id: "navbar", label: "Navigation Bar", icon: "menu" },
    { id: "hero", label: "Hero Section", icon: "home" },
    { id: "about", label: "About Section", icon: "layout" },
    { id: "whyChoose", label: "Why Choose Us", icon: "check" },
    { id: "features", label: "Features", icon: "sparkles" },
    { id: "pricing", label: "Pricing Plans", icon: "creditCard" },
    { id: "faq", label: "FAQ", icon: "help" },
    { id: "testimonials", label: "Testimonials", icon: "quote" },
    { id: "media", label: "Media", icon: "image" },
    { id: "brand", label: "Brand", icon: "building" },
    { id: "theme", label: "Theme", icon: "paintbrush" }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "navbar":
        return <NavbarSection data={data} updateData={updateData} />;
      case "hero":
        return <HeroSection data={data} updateData={updateData} />;
      case "about":
        return <AboutSection data={data} updateData={updateData} />;
      case "whyChoose":
        return <WhyChooseSection data={data} updateData={updateData} />;
      case "features":
        return <FeaturesSection data={data} updateData={updateData} />;
      case "pricing":
        return <PricingSection data={data} updateData={updateData} />;
      case "faq":
        return <FaqSection data={data} updateData={updateData} />;
      case "testimonials":
        return <TestimonialsSection data={data} updateData={updateData} />;
      case "media":
        return <MediaSection data={data} updateData={updateData} />;
      case "brand":
        return <BrandSection data={data} updateData={updateData} />;
      case "theme":
        return <ThemeSection data={data} updateData={updateData} />;
      default:
        return <div>Select a section to edit</div>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Editor Sidebar */}
      <div className="lg:col-span-3 space-y-6">
        <div className="sticky top-0 space-y-6">
          {/* Section Navigation */}
          <Card className="p-4">
            <nav className="space-y-2">
              {sections.map(section => {
                const Icon = Icons[section.icon as keyof typeof Icons];
                return (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveSection(section.id)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {section.label}
                  </Button>
                );
              })}
            </nav>
          </Card>

          {/* Section Editor */}
          <Card className="p-4">
            {renderSection()}
          </Card>
        </div>
      </div>

      {/* Live Preview */}
      <div className="lg:col-span-9">
        <TemplateWrapper data={data} />
      </div>
    </div>
  );
} 