"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { useTemplate } from "@/contexts/template-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Globe, Palette, Save, Search, Settings } from "lucide-react";
import Confetti from 'react-confetti';
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DomainValidator } from "@/app/dashboard/new/components/domain-validator";
import { createProduct } from "@/app/dashboard/new/actions";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";

export function TemplateControls() {
  const { state, dispatch, colorPalettes } = useTemplate();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("domain");
  const [domainError, setDomainError] = useState("");
  const [published, setPublished] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [domainType, setDomainType] = useState<"subdomain" | "custom">("subdomain");
  const [subdomain, setSubdomain] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [isSubdomainValid, setIsSubdomainValid] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Initialize subdomain from state
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
    // Get window size for confetti
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

  const prepareFormData = () => {
    const formData = new FormData();

    // Extract data from state.templateData
    const { hero, features, whyChoose, testimonials, faq, theme, brand } = state.templateData;

    // Required fields
    formData.append("name", hero?.title || "Website Template");
    formData.append("description", hero?.description || "");
    formData.append("tagline", hero?.tagline || "");

    // Domain - based on selected type
    if (domainType === "subdomain") {
      formData.append("domain", subdomain);
    } else {
      // For custom domains, we might need special handling
      formData.append("domain", customDomain);
      formData.append("customDomain", "true");
    }

    // Template type
    formData.append("template", "modern");
    formData.append("product_type", "single");

    // Colors
    formData.append("color", theme?.primaryColor || "#6F4E37");
    formData.append("accentColor", theme?.secondaryColor || "#ECB176");

    // Convert features to the expected format
    const featuresAsString = features?.items
      ?.map((item: { title: string; description: string }) => item.title + ": " + item.description)
      .join("\n") || "";
    formData.append("features", featuresAsString);

    // Convert benefits to the expected format
    const benefitsAsString = whyChoose?.benefits
      ?.map((benefit: string | { text: string; icon?: string }) => 
        typeof benefit === 'string' ? benefit : benefit.text)
      .join("\n") || "";
    formData.append("benefits", benefitsAsString);

    // JSON objects
    formData.append("faq", JSON.stringify(faq?.items || []));
    formData.append("testimonials", JSON.stringify(testimonials || []));
    formData.append("seo", JSON.stringify(state.seo || {}));
    formData.append("brand", JSON.stringify(brand || {}));
    formData.append("media", JSON.stringify({ images: [], video: "" }));
    formData.append("colors", JSON.stringify([]));
    formData.append("sizes", JSON.stringify([]));
    formData.append("callToAction", JSON.stringify(hero?.cta || { text: "", url: "" }));

    // Price (placeholder)
    formData.append("price", "0");

    return formData;
  };

  const handlePublish = async () => {
    // Check if domain is set up
    if (!state.domain) {
      setOpen(true);
      setActiveTab("domain");
      return;
    }

    // Validate domain based on the type
    if (domainType === "subdomain") {
      if (!isSubdomainValid) {
        setOpen(true);
        setActiveTab("domain");
        setDomainError("Please select a valid subdomain before publishing");
        return;
      }
    } else {
      if (!validateCustomDomain(customDomain)) {
        setOpen(true);
        setActiveTab("domain");
        setDomainError("Please enter a valid domain before publishing");
        return;
      }
    }

    try {
      setIsPublishing(true);
      
      // Prepare form data for the API
      const formData = prepareFormData();
      
      // Call the createProduct action
      const result = await createProduct(formData, user?.id);
      
      if (result && result.success) {
        setPublished(true);
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
    } finally {
      setIsPublishing(false);
    }
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  const previewWebsite = () => {
    // Open in new tab
    window.open(`/preview?domain=${state.domain}`, '_blank');
  };

  if (published) {
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <Card className="w-full max-w-md p-6 space-y-6 text-center">
            <h2 className="text-2xl font-bold">Published Successfully!</h2>
            <p className="text-gray-600">
              Your website has been published to <span className="font-semibold">{state.domain}</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button onClick={goToDashboard} variant="outline">
                Go to Dashboard
              </Button>
              <Button onClick={previewWebsite}>
                Preview Website
              </Button>
            </div>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
        {/* Settings Button */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
        <Button
          size="icon"
              className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow"
        >
              <Settings className="h-6 w-6" />
        </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Template Settings</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="domain">
                  <Globe className="h-4 w-4 mr-2" />
                  Domain
                </TabsTrigger>
                <TabsTrigger value="theme">
                  <Palette className="h-4 w-4 mr-2" />
                  Theme
                </TabsTrigger>
                <TabsTrigger value="seo">
                  <Search className="h-4 w-4 mr-2" />
                  SEO
                </TabsTrigger>
              </TabsList>
              
              {/* Domain Tab - Now First */}
              <TabsContent value="domain" className="space-y-4 py-4">
                <RadioGroup 
                  defaultValue={domainType}
                  value={domainType}
                  onValueChange={(value) => handleDomainChange(value as "subdomain" | "custom")}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2">
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
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom-domain" />
                    <Label htmlFor="custom-domain">Use a custom domain</Label>
      </div>

                  {domainType === "custom" && (
                    <div className="ml-6 space-y-2">
                      <Input
                        id="customDomainInput"
                        value={customDomain}
                        onChange={(e) => handleCustomDomainChange(e.target.value)}
                        placeholder="yourdomain.com"
                      />
                      {domainError && <p className="text-sm text-red-500">{domainError}</p>}
                      <p className="text-sm text-gray-500">
                        Enter your domain name to publish your site (e.g. example.com)
                      </p>
                      <p className="text-sm text-amber-600">
                        You'll need to configure your DNS settings to point to our servers.
                      </p>
                    </div>
                  )}
                </RadioGroup>
              </TabsContent>
              
              {/* Theme Tab */}
              <TabsContent value="theme" className="py-4">
          <div className="grid grid-cols-2 gap-4">
            {colorPalettes.map((palette, index) => (
              <button
                key={index}
                className="p-4 rounded-lg border hover:border-primary transition-colors"
                onClick={() => handleColorPaletteSelect(palette)}
              >
                <div className="space-y-2">
                  <div className="text-sm font-medium">{palette.name}</div>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: palette.primary }} />
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: palette.secondary }} />
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: palette.text }} />
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: palette.accent }} />
                  </div>
                </div>
              </button>
            ))}
          </div>
              </TabsContent>
              
              {/* SEO Tab */}
              <TabsContent value="seo" className="space-y-4 py-4">
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
            <div>
              <Label>OG Image URL</Label>
              <Input
                value={state.seo.ogImage}
                onChange={(e) => handleSEOUpdate({ ...state.seo, ogImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
              </TabsContent>
            </Tabs>
        </DialogContent>
      </Dialog>

        {/* Publish Button */}
        <Button
          size="icon"
          variant="default"
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow bg-green-600 hover:bg-green-700"
          onClick={handlePublish}
          disabled={isPublishing}
        >
          {isPublishing ? (
            <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Save className="h-6 w-6" />
          )}
        </Button>
          </div>
    </>
  );
} 