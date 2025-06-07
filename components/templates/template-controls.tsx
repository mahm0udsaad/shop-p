"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTemplate } from "@/contexts/template-context";
import { Check, Globe, Rocket, Languages, Search, Palette, Sparkles, Heart, Star, ArrowRight, ExternalLink, Home } from "lucide-react";
import Confetti from 'react-confetti';
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DomainValidator } from "@/app/[lng]/dashboard/new/components/domain-validator";
import { createProduct } from "@/app/[lng]/dashboard/new/actions";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { useTranslation } from '@/lib/i18n/client';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function TemplateControls() {
  const { state, dispatch, colorPalettes, saveChanges, isSaving, isEditMode } = useTemplate();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [domainError, setDomainError] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishingStep, setPublishingStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [domainType, setDomainType] = useState<"subdomain" | "custom">("subdomain");
  const [subdomain, setSubdomain] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [isSubdomainValid, setIsSubdomainValid] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [languagePreference, setLanguagePreference] = useState(state.languagePreference || 'auto');
  const [publishedDomain, setPublishedDomain] = useState("");
  const router = useRouter();
  const { t } = useTranslation();

  // Steps configuration
  const steps = [
    { key: 'language', icon: Languages, title: t('templateControls.steps.language.title') },
    { key: 'seo', icon: Search, title: t('templateControls.steps.seo.title') },
    { key: 'domain', icon: Globe, title: t('templateControls.steps.domain.title') }
  ];

  useEffect(() => {
    if (state.domain) {
      if (state.domain.endsWith('.shipfaster.tech')) {
        const sub = state.domain.replace('.shipfaster.tech', '');
        setSubdomain(sub);
        setDomainType("subdomain");
      } else {
        setCustomDomain(state.domain);
        setDomainType("custom");
      }
    }
  }, [state.domain]);

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  const handleColorPaletteSelect = (palette: typeof colorPalettes[0]) => {
    dispatch({
      type: "UPDATE_THEME",
      colors: {
        primary: palette.primary,
        secondary: palette.secondary,
        text: palette.text,
        accent: palette.accent,
      },
    });
  };

  const handleSEOUpdate = (data: any) => {
    dispatch({
      type: "UPDATE_SEO",
      data,
    });
  };

  const handleDomainChange = (type: "subdomain" | "custom") => {
    setDomainType(type);
    if (type === "subdomain" && subdomain) {
      dispatch({
        type: "UPDATE_DOMAIN",
        domain: `${subdomain}.shipfaster.tech`,
      });
    } else if (type === "custom" && customDomain) {
      dispatch({
        type: "UPDATE_DOMAIN",
        domain: customDomain,
      });
    } else {
      dispatch({
        type: "UPDATE_DOMAIN",
        domain: "",
      });
    }
    setDomainError("");
  };

  const handleSubdomainChange = (value: string) => {
    setSubdomain(value);
    if (value) {
      dispatch({
        type: "UPDATE_DOMAIN",
        domain: `${value}.shipfaster.tech`,
      });
    } else {
      dispatch({
        type: "UPDATE_DOMAIN",
        domain: "",
      });
    }
  };

  const handleCustomDomainChange = (value: string) => {
    setCustomDomain(value);
    if (value) {
      dispatch({
        type: "UPDATE_DOMAIN",
        domain: value,
      });
    } else {
        dispatch({
          type: "UPDATE_DOMAIN",
          domain: "",
        });
    }
    setDomainError("");
  };

  const handleSubdomainValidationChange = (available: boolean | null, checking: boolean) => {
    setIsSubdomainValid(available);
    setIsValidating(checking);
  };

  const validateCustomDomain = (domain: string): boolean => {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  const handleLanguagePreferenceChange = (value: string) => {
    setLanguagePreference(value);
    dispatch({ type: 'UPDATE_LANGUAGE_PREFERENCE', languagePreference: value });
  };

  const prepareFormData = () => {
    const formData = new FormData();
    const { hero, features, whyChoose, testimonials, faq, theme, brand } = state.templateData;

    formData.append("name", hero?.title || "Website Template");
    formData.append("description", hero?.description || "");
    formData.append("tagline", hero?.tagline || "");

    if (domainType === "subdomain") {
      formData.append("domain", subdomain);
    } else {
      formData.append("domain", customDomain);
      formData.append("customDomain", "true");
    }

    formData.append("template", "modern");
    formData.append("product_type", "single");
    formData.append("color", theme?.primaryColor || "#6F4E37");
    formData.append("accentColor", theme?.secondaryColor || "#ECB176");

    const featuresAsString = features?.items
      ?.map((item: { title: string; description: string }) => item.title + ": " + item.description)
      .join("\n") || "";
    formData.append("features", featuresAsString);

    const benefitsAsString = whyChoose?.benefits
      ?.map((benefit: string | { text: string; icon?: string }) => 
        typeof benefit === 'string' ? benefit : benefit.text)
      .join("\n") || "";
    formData.append("benefits", benefitsAsString);

    formData.append("faq", JSON.stringify(faq?.items || []));
    formData.append("testimonials", JSON.stringify(testimonials || []));
    formData.append("seo", JSON.stringify(state.seo || {}));
    formData.append("brand", JSON.stringify(brand || {}));
    formData.append("media", JSON.stringify({ images: [], video: "" }));
    formData.append("colors", JSON.stringify([]));
    formData.append("sizes", JSON.stringify([]));
    formData.append("callToAction", JSON.stringify(hero?.cta || { text: "", url: "" }));
    formData.append("price", "0");
    formData.append("templateData", JSON.stringify(state.templateData));

    return formData;
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 2: // Domain step (now index 2 instead of 3)
        if (domainType === "subdomain") {
          return isSubdomainValid === true;
        } else {
          return validateCustomDomain(customDomain);
        }
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      if (validateStep(currentStep)) {
        setCurrentStep(currentStep + 1);
        setDomainError("");
      } else if (currentStep === 2) {
        setDomainError("Please select a valid domain before continuing");
      }
    } else {
      handlePublish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setDomainError("");
    }
  };

  const handlePublish = async () => {
    if (!validateStep(currentStep)) {
      if (currentStep === 2) {
        setDomainError("Please select a valid domain before publishing");
      }
      return;
    }

    try {
      setIsPublishing(true);
      setPublishingStep(0);

      const publishingSteps = t('templateControls.publishing.steps');
      
      // Simulate publishing steps with realistic timing
      for (let i = 0; i < publishingSteps.length; i++) {
        setPublishingStep(i);
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      }

      const formData = prepareFormData();
      const result = await createProduct(formData, user?.id);
      
      if (result && result.success) {
        setPublishedDomain(result.domain + ".shipfaster.tech");
        setIsComplete(true);
        toast({
          title: "Website published!",
          description: `Your website has been published to ${result.domain}.shipfaster.tech`,
        });
      } else {
        throw new Error("Failed to publish website");
      }
    } catch (error) {
      console.error("Failed to publish:", error);
      toast({
        title: "Publishing failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      setIsPublishing(false);
    }
  };

  const handleAction = async () => {
    if (isEditMode) {
      try {
        await saveChanges();
        toast({
          title: "Changes saved",
          description: "Your template changes have been successfully saved.",
        });
        router.push('/dashboard');
      } catch (error) {
        console.error("Failed to save changes:", error);
        toast({
          title: "Failed to save changes",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive",
        });
      }
    } else {
      setOpen(true);
      setCurrentStep(0);
    }
  };

  const goToDashboard = () => {
    setOpen(false);
    router.push('/dashboard');
  };

  const previewWebsite = () => {
    window.open(`https://${publishedDomain}`, '_blank');
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.key) {
      case 'language':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">{t('templateControls.steps.language.title')}</h3>
              <p className="text-muted-foreground">{t('templateControls.steps.language.subtitle')}</p>
              <p className="text-sm text-muted-foreground">{t('templateControls.steps.language.description')}</p>
            </div>
            <RadioGroup
              value={languagePreference}
              onValueChange={handleLanguagePreferenceChange}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border">
                <RadioGroupItem value="auto" id="lang-auto" />
                <Label htmlFor="lang-auto" className="flex-1">{t('templateControls.language.auto')}</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border">
                <RadioGroupItem value="ar" id="lang-ar" />
                <Label htmlFor="lang-ar" className="flex-1">{t('templateControls.language.ar')}</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border">
                <RadioGroupItem value="en" id="lang-en" />
                <Label htmlFor="lang-en" className="flex-1">{t('templateControls.language.en')}</Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-muted-foreground">{t('templateControls.language.help')}</p>
          </div>
        );

      case 'seo':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">{t('templateControls.steps.seo.title')}</h3>
              <p className="text-muted-foreground">{t('templateControls.steps.seo.subtitle')}</p>
              <p className="text-sm text-muted-foreground">{t('templateControls.steps.seo.description')}</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Page Title</Label>
                <Input
                  value={state.seo.title}
                  onChange={(e) => handleSEOUpdate({ ...state.seo, title: e.target.value })}
                  placeholder="Enter page title"
                />
              </div>
              <div>
                <Label>Meta Description</Label>
                <Textarea
                  value={state.seo.description}
                  onChange={(e) => handleSEOUpdate({ ...state.seo, description: e.target.value })}
                  placeholder="Enter meta description"
                />
              </div>
              <div>
                <Label>Keywords (comma-separated)</Label>
                <Input
                  value={state.seo.keywords.join(", ")}
                  onChange={(e) =>
                    handleSEOUpdate({
                      ...state.seo,
                      keywords: e.target.value.split(",").map((k) => k.trim()),
                    })
                  }
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>
          </div>
        );

      case 'domain':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">{t('templateControls.steps.domain.title')}</h3>
              <p className="text-muted-foreground">{t('templateControls.steps.domain.subtitle')}</p>
              <p className="text-sm text-muted-foreground">{t('templateControls.steps.domain.description')}</p>
            </div>
            <RadioGroup 
              value={domainType}
              onValueChange={(value) => handleDomainChange(value as "subdomain" | "custom")}
              className="space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg border">
                  <RadioGroupItem value="subdomain" id="subdomain" />
                  <Label htmlFor="subdomain">Use a subdomain on shipfaster.tech</Label>
                </div>
                
                {domainType === "subdomain" && (
                  <div className="ml-6">
                    <DomainValidator
                      value={subdomain}
                      onChange={handleSubdomainChange} 
                      onValidationChange={handleSubdomainValidationChange}
                      className="mb-2"
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg border">
                  <RadioGroupItem value="custom" id="custom-domain" />
                  <Label htmlFor="custom-domain">Use a custom domain</Label>
                </div>

                {domainType === "custom" && (
                  <div className="ml-6 space-y-2">
                    <Input
                      value={customDomain}
                      onChange={(e) => handleCustomDomainChange(e.target.value)}
                      placeholder="yourdomain.com"
                    />
                    <p className="text-sm text-amber-600">
                      You'll need to configure your DNS settings to point to our servers.
                    </p>
                  </div>
                )}
              </div>
            </RadioGroup>
            {domainError && <p className="text-sm text-red-500 text-center">{domainError}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  if (isComplete) {
    return (
      <>
        {windowSize.width > 0 && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
          />
        )}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <div className="text-center space-y-6 py-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">{t('templateControls.steps.success.title')}</h3>
                <p className="text-muted-foreground">{t('templateControls.steps.success.subtitle')}</p>
                <p className="text-sm text-muted-foreground">{t('templateControls.steps.success.description')}</p>
              </div>
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                <Globe className="w-4 h-4 inline mr-2" />
                {publishedDomain}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={goToDashboard} variant="outline" className="flex-1">
                  <Home className="w-4 h-4 mr-2" />
                  {t('templateControls.buttons.dashboard')}
                </Button>
                <Button onClick={previewWebsite} className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t('templateControls.buttons.viewWebsite')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
  return (
    <>
      {/* Theme Button */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="shadow-md text-xs sm:text-sm px-3 sm:px-4"
            >
              <Palette className="w-4 h-4 mr-2" />
              Theme
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4 max-h-60 overflow-y-auto">
              <h4 className="font-medium leading-none">Color Palettes</h4>
              <div className="space-y-3">
                {colorPalettes.map((palette, index) => (
                  <button
                    key={index}
                    className="w-full p-3 rounded-lg border hover:border-primary transition-colors text-left"
                    onClick={() => handleColorPaletteSelect(palette)}
                  >
                    <div className="space-y-2">
                      <div className="text-sm font-medium">{palette.name}</div>
                      <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: palette.primary }} />
                        <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: palette.secondary }} />
                        <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: palette.text }} />
                        <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: palette.accent }} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Main Publish Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
  <div className="group relative">
    <Button
      size="lg"
      className={` gap-0 rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 ${
        isEditMode 
          ? 'bg-blue-600 hover:bg-blue-700' 
          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
      } text-white border-0 group-hover:px-8`}
      onClick={handleAction}
      disabled={isSaving}
    >
      {isSaving ? (
        <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <Rocket className="w-6 h-6" />
      )}
      <span className="mx-0 group-hover:mx-3 max-w-0 group-hover:max-w-xs overflow-hidden transition-all duration-300 ease-out whitespace-nowrap">
        {isEditMode ? 'Save Changes' : t('templateControls.buttons.publish')}
      </span>
    </Button>
  </div>
</div>

      {/* Step-by-step Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          {isPublishing ? (
            // Publishing Animation
            <div className="text-center space-y-6 py-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <div className="relative">
                  <Rocket className="w-10 h-10 text-purple-600 animate-bounce" />
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">{t('templateControls.steps.publishing.title')}</h3>
                <p className="text-muted-foreground">{t('templateControls.steps.publishing.subtitle')}</p>
                <p className="text-sm text-muted-foreground">{t('templateControls.steps.publishing.description')}</p>
              </div>

              <div className="space-y-3">
              {t('templateControls.publishing.steps').split(',').map((step: string, index: number) => (
                  <div 
                    key={index} 
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-500 ${
                      index <= publishingStep 
                        ? 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200' 
                        : 'bg-muted/50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      index < publishingStep 
                        ? 'bg-green-500' 
                        : index === publishingStep 
                        ? 'bg-purple-500' 
                        : 'bg-gray-300'
                    }`}>
                      {index < publishingStep ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : index === publishingStep ? (
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                      ) : (
                        <div className="w-3 h-3 bg-gray-500 rounded-full" />
                      )}
                    </div>
                    <span className={`text-sm ${
                      index <= publishingStep ? 'text-foreground font-medium' : 'text-muted-foreground'
                    }`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center space-x-2 text-purple-600">
                <Heart className="w-4 h-4 animate-pulse" />
                <span className="text-sm">Making something beautiful...</span>
                <Star className="w-4 h-4 animate-pulse" />
              </div>
            </div>
          ) : (
            // Step Content
            <>
              <DialogHeader>
                <DialogTitle className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                  {(() => {
                const IconComponent = steps[currentStep].icon;
                  return <IconComponent className="w-6 h-6" />;
                })()}                 
                   <span>{steps[currentStep].title}</span>
                  </div>
                </DialogTitle>
              </DialogHeader>

              {/* Progress Indicator */}
              <div className="flex items-center justify-center space-x-2 mb-6">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index <= currentStep 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              {/* Step Content */}
              <div className="min-h-[300px]">
                {renderStepContent()}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  {t('templateControls.buttons.back')}
                </Button>
                
                <Button 
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      <Rocket className="w-4 h-4 mx-2" />
                      {t('templateControls.buttons.publish')}
                    </>
                  ) : (
                    <>
                      {t('templateControls.buttons.next')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 