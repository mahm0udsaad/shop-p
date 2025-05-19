"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icons } from "@/components/icons";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Icons;
}

const steps: OnboardingStep[] = [
  {
    id: "type",
    title: "Choose Your Product Type",
    description: "Are you selling a single product or multiple products?",
    icon: "store"
  },
  {
    id: "template",
    title: "Select Your Template",
    description: "Choose a beautiful template for your product showcase",
    icon: "layout"
  },
  {
    id: "customize",
    title: "Customize Your Site",
    description: "Make it yours with your content and branding",
    icon: "paintbrush"
  }
];

interface OnboardingWizardProps {
  onComplete: (data: {
    productType: "single" | "multi";
    template: string;
  }) => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [productType, setProductType] = useState<"single" | "multi" | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates = [
    { id: "modern", name: "Modern", description: "Clean and minimalist design" },
    { id: "classic", name: "Classic", description: "Timeless and professional" },
    { id: "bold", name: "Bold", description: "Stand out with impact" }
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      if (productType && selectedTemplate) {
        onComplete({ productType, template: selectedTemplate });
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-[#FED8B1]/20 p-4 md:p-8">
      {/* Progress Bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${
                index <= currentStep ? "text-[#6F4E37]" : "text-muted-foreground"
              }`}
            >
              <div className="flex-shrink-0">
                {index < currentStep ? (
                  <div className="h-8 w-8 rounded-full bg-[#6F4E37] text-white flex items-center justify-center">
                    <Icons.check className="h-5 w-5" />
                  </div>
                ) : (
                  <div
                    className={`h-8 w-8 rounded-full border-2 flex items-center justify-center ${
                      index === currentStep
                        ? "border-[#6F4E37] text-[#6F4E37]"
                        : "border-muted-foreground text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                )}
              </div>
              <div
                className={`hidden md:block text-sm ml-2 ${
                  index === currentStep ? "font-medium" : ""
                }`}
              >
                {step.title}
              </div>
            </div>
          ))}
        </div>
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-[#6F4E37]"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -20 }}
          variants={fadeIn}
          className="max-w-4xl mx-auto"
        >
          {currentStep === 0 && (
            <motion.div
              className="grid gap-6 md:grid-cols-2"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeIn}>
                <Card
                  className={`p-6 cursor-pointer transition-all ${
                    productType === "single"
                      ? "ring-2 ring-[#6F4E37]"
                      : "hover:border-[#6F4E37]"
                  }`}
                  onClick={() => setProductType("single")}
                >
                  <Icons.box className="h-12 w-12 mb-4 text-[#ECB176]" />
                  <h3 className="text-lg font-semibold mb-2 text-[#6F4E37]">Single Product</h3>
                  <p className="text-[#A67B5B]">
                    Perfect for showcasing and selling one main product or service
                  </p>
                </Card>
              </motion.div>
              <motion.div variants={fadeIn}>
                <Card
                  className={`p-6 cursor-pointer transition-all ${
                    productType === "multi"
                      ? "ring-2 ring-[#6F4E37]"
                      : "hover:border-[#6F4E37]"
                  }`}
                  onClick={() => setProductType("multi")}
                >
                  <Icons.store className="h-12 w-12 mb-4 text-[#ECB176]" />
                  <h3 className="text-lg font-semibold mb-2 text-[#6F4E37]">Multi Product</h3>
                  <p className="text-[#A67B5B]">
                    Ideal for a store with multiple products or services
                  </p>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              className="grid gap-6 md:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {templates.map(template => (
                <motion.div key={template.id} variants={fadeIn}>
                  <Card
                    className={`p-6 cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? "ring-2 ring-[#6F4E37]"
                        : "hover:border-[#6F4E37]"
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="aspect-video bg-[#FED8B1]/20 rounded-lg mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-[#6F4E37]">{template.name}</h3>
                    <p className="text-[#A67B5B]">{template.description}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              className="text-center"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeIn}>
                <Icons.sparkles className="h-16 w-16 mx-auto mb-6 text-[#ECB176]" />
                <h2 className="text-2xl font-bold mb-4 text-[#6F4E37]">Ready to Customize!</h2>
                <p className="text-[#A67B5B] mb-8">
                  You're all set! Let's start customizing your {productType === "single" ? "product" : "store"} with the {selectedTemplate} template.
                </p>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-8 max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="border-[#6F4E37] text-[#6F4E37] hover:bg-[#6F4E37]/10"
        >
          <Icons.arrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={
            (currentStep === 0 && !productType) ||
            (currentStep === 1 && !selectedTemplate)
          }
          className="bg-[#ECB176] hover:bg-[#6F4E37] text-white"
        >
          {currentStep === steps.length - 1 ? (
            <>
              Start Customizing
              <Icons.sparkles className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Next
              <Icons.arrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
} 