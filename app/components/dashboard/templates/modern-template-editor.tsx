"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/app/components/dashboard/icons";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ModernTemplate } from "@/components/templates/modern-template";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the internal editor data structure
interface TemplateData {
  hero: {
    title: string;
    tagline: string;
    description: string;
    cta: { text: string; url: string };
    image?: string;
  };
  about: {
    title: string;
    description: string;
    image?: string;
    features: string[];
  };
  whyChoose: {
    title: string;
    subtitle: string;
    benefits: string[];
  };
  features: {
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
  };
  pricing: {
    title: string;
    subtitle: string;
    currency: string;
    plans: Array<{
      name: string;
      price: number;
      period: string;
      features: string[];
      isFeatured?: boolean;
      discountNote?: string;
    }>;
  };
  faq: {
    title: string;
    subtitle: string;
    items: Array<{ question: string; answer: string }>;
  };
  testimonials: Array<{
    name: string;
    role: string;
    content: string;
    image?: string;
  }>;
  media: { images: string[]; video?: string };
  brand: { name: string; contactEmail: string; socialLinks: { twitter?: string; facebook?: string; linkedin?: string } };
  theme: { primaryColor: string; secondaryColor: string; fontFamily?: string };
  footer?: string;
  customFields?: Record<string, any>;
}

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
  const [activeSection, setActiveSection] = useState<string>("hero");

  const sections = [
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

  // Helper function to handle file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, path: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          updateData(path, e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBenefit = () => {
    const benefits = [...data.whyChoose.benefits];
    benefits.push("New Benefit");
    updateData("whyChoose.benefits", benefits);
  };

  const handleRemoveBenefit = (index: number) => {
    const benefits = [...data.whyChoose.benefits];
    benefits.splice(index, 1);
    updateData("whyChoose.benefits", benefits);
  };

  const handleAddFeature = () => {
    const items = [...data.features.items];
    items.push({ title: "New Feature", description: "Describe this feature", icon: "sparkles" });
    updateData("features.items", items);
  };

  const handleRemoveFeature = (index: number) => {
    const items = [...data.features.items];
    items.splice(index, 1);
    updateData("features.items", items);
  };

  const handleAddAboutFeature = () => {
    const features = [...(data.about?.features || [])];
    features.push("New Feature");
    updateData("about.features", features);
  };

  const handleRemoveAboutFeature = (index: number) => {
    const features = [...(data.about?.features || [])];
    features.splice(index, 1);
    updateData("about.features", features);
  };

  const handleAddPlan = () => {
    const plans = [...data.pricing.plans];
    plans.push({
      name: "New Plan",
      price: 0,
      period: "month",
      features: ["Feature 1"],
      isFeatured: false
    });
    updateData("pricing.plans", plans);
  };

  const handleRemovePlan = (index: number) => {
    const plans = [...data.pricing.plans];
    plans.splice(index, 1);
    updateData("pricing.plans", plans);
  };

  const handleAddPlanFeature = (planIndex: number) => {
    const plans = [...data.pricing.plans];
    plans[planIndex].features.push("New Feature");
    updateData("pricing.plans", plans);
  };

  const handleRemovePlanFeature = (planIndex: number, featureIndex: number) => {
    const plans = [...data.pricing.plans];
    plans[planIndex].features.splice(featureIndex, 1);
    updateData("pricing.plans", plans);
  };

  const handleAddFaq = () => {
    const items = [...data.faq.items];
    items.push({ question: "New Question", answer: "Answer this question" });
    updateData("faq.items", items);
  };

  const handleRemoveFaq = (index: number) => {
    const items = [...data.faq.items];
    items.splice(index, 1);
    updateData("faq.items", items);
  };

  const handleAddTestimonial = () => {
    const testimonials = [...data.testimonials];
    testimonials.push({
      name: "Customer Name",
      role: "Position",
      content: "Great testimonial",
      image: ""
    });
    updateData("testimonials", testimonials);
  };

  const handleRemoveTestimonial = (index: number) => {
    const testimonials = [...data.testimonials];
    testimonials.splice(index, 1);
    updateData("testimonials", testimonials);
  };

  const iconOptions = ["sparkles", "shield", "zap", "star", "heart", "rocket", "check", "box"];

  // Live Preview
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
            {activeSection === "hero" && (
              <div className="space-y-4">
                <h3 className="font-semibold">Hero Section</h3>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={data.hero.title}
                    onChange={e => updateData("hero.title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input
                    value={data.hero.tagline}
                    onChange={e => updateData("hero.tagline", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={data.hero.description}
                    onChange={e => updateData("hero.description", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA Text</Label>
                  <Input
                    value={data.hero.cta.text}
                    onChange={e => updateData("hero.cta.text", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA URL</Label>
                  <Input
                    value={data.hero.cta.url}
                    onChange={e => updateData("hero.cta.url", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hero Image</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "hero.image")}
                    />
                    {data.hero.image && (
                      <div className="w-16 h-16 relative">
                        <img
                          src={data.hero.image}
                          alt="Hero"
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "about" && (
              <div className="space-y-4">
                <h3 className="font-semibold">About Section</h3>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={data.about?.title || ""}
                    onChange={e => updateData("about.title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={data.about?.description || ""}
                    onChange={e => updateData("about.description", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "about.image")}
                  />
                  {data.about?.image && (
                    <div className="w-full h-32 relative mt-2">
                      <img
                        src={data.about.image}
                        alt="About"
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Features</Label>
                    <Button onClick={handleAddAboutFeature} variant="outline" size="sm">
                      Add Feature
                    </Button>
                  </div>
                  {(data.about?.features || []).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={feature}
                        onChange={e => {
                          const features = [...(data.about?.features || [])];
                          features[index] = e.target.value;
                          updateData("about.features", features);
                        }}
                      />
                      <Button
                        onClick={() => handleRemoveAboutFeature(index)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                      >
                        <Icons.trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "whyChoose" && (
              <div className="space-y-4">
                <h3 className="font-semibold">Why Choose Us</h3>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={data.whyChoose.title}
                    onChange={e => updateData("whyChoose.title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={data.whyChoose.subtitle}
                    onChange={e => updateData("whyChoose.subtitle", e.target.value)}
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Benefits</Label>
                    <Button onClick={handleAddBenefit} variant="outline" size="sm">
                      Add Benefit
                    </Button>
                  </div>
                  {data.whyChoose.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={benefit}
                        onChange={e => {
                          const benefits = [...data.whyChoose.benefits];
                          benefits[index] = e.target.value;
                          updateData("whyChoose.benefits", benefits);
                        }}
                        placeholder="Benefit Text"
                      />
                      <Button
                        onClick={() => handleRemoveBenefit(index)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                      >
                        <Icons.trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "features" && (
              <div className="space-y-4">
                <h3 className="font-semibold">Features</h3>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={data.features.title}
                    onChange={e => updateData("features.title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={data.features.subtitle}
                    onChange={e => updateData("features.subtitle", e.target.value)}
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Features</Label>
                    <Button onClick={handleAddFeature} variant="outline" size="sm">
                      Add Feature
                    </Button>
                  </div>
                  {data.features.items.map((feature, index) => (
                    <Card key={index} className="p-4 space-y-2">
                      <div className="flex justify-between">
                        <Label>Feature {index + 1}</Label>
                        <Button
                          onClick={() => handleRemoveFeature(index)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                        >
                          <Icons.trash className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Icon</Label>
                        <Select
                          value={feature.icon || ""}
                          onValueChange={value => {
                            const items = [...data.features.items];
                            items[index] = { ...feature, icon: value };
                            updateData("features.items", items);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an icon" />
                          </SelectTrigger>
                          <SelectContent>
                            {iconOptions.map(icon => (
                              <SelectItem key={icon} value={icon}>
                                <div className="flex items-center">
                                  {Icons[icon as keyof typeof Icons] && 
                                    React.createElement(Icons[icon as keyof typeof Icons], { className: "h-4 w-4 mr-2" })}
                                  {icon}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={feature.title}
                          onChange={e => {
                            const items = [...data.features.items];
                            items[index] = { ...feature, title: e.target.value };
                            updateData("features.items", items);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={feature.description}
                          onChange={e => {
                            const items = [...data.features.items];
                            items[index] = { ...feature, description: e.target.value };
                            updateData("features.items", items);
                          }}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "pricing" && (
              <div className="space-y-4">
                <h3 className="font-semibold">Pricing Plans</h3>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={data.pricing.title}
                    onChange={e => updateData("pricing.title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={data.pricing.subtitle}
                    onChange={e => updateData("pricing.subtitle", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Input
                    value={data.pricing.currency}
                    onChange={e => updateData("pricing.currency", e.target.value)}
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Plans</Label>
                    <Button onClick={handleAddPlan} variant="outline" size="sm">
                      Add Plan
                    </Button>
                  </div>
                  {data.pricing.plans.map((plan, planIndex) => (
                    <Card key={planIndex} className="p-4 space-y-3">
                      <div className="flex justify-between">
                        <Label>Plan {planIndex + 1}</Label>
                        <Button
                          onClick={() => handleRemovePlan(planIndex)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                        >
                          <Icons.trash className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={plan.name}
                          onChange={e => {
                            const plans = [...data.pricing.plans];
                            plans[planIndex] = { ...plan, name: e.target.value };
                            updateData("pricing.plans", plans);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Price</Label>
                        <Input
                          type="number"
                          value={plan.price}
                          onChange={e => {
                            const plans = [...data.pricing.plans];
                            plans[planIndex] = { ...plan, price: Number(e.target.value) };
                            updateData("pricing.plans", plans);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Billing Period</Label>
                        <Select
                          value={plan.period}
                          onValueChange={value => {
                            const plans = [...data.pricing.plans];
                            plans[planIndex] = { ...plan, period: value };
                            updateData("pricing.plans", plans);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select billing period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="month">Monthly</SelectItem>
                            <SelectItem value="year">Yearly</SelectItem>
                            <SelectItem value="lifetime">One-time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Features</Label>
                          <Button
                            onClick={() => handleAddPlanFeature(planIndex)}
                            variant="outline"
                            size="sm"
                          >
                            Add Feature
                          </Button>
                        </div>
                        {plan.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <Input
                              value={feature}
                              onChange={e => {
                                const plans = [...data.pricing.plans];
                                plans[planIndex].features[featureIndex] = e.target.value;
                                updateData("pricing.plans", plans);
                              }}
                            />
                            <Button
                              onClick={() => handleRemovePlanFeature(planIndex, featureIndex)}
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                            >
                              <Icons.trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "faq" && (
              <div className="space-y-4">
                <h3 className="font-semibold">FAQ Section</h3>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={data.faq.title}
                    onChange={e => updateData("faq.title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={data.faq.subtitle}
                    onChange={e => updateData("faq.subtitle", e.target.value)}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <Label>FAQ Items</Label>
                  <Button onClick={handleAddFaq} variant="outline" size="sm">
                    Add FAQ
                  </Button>
                </div>
                {data.faq.items.map((item, index) => (
                  <Card key={index} className="p-4 space-y-2">
                    <div className="flex justify-between">
                      <Label>FAQ {index + 1}</Label>
                      <Button
                        onClick={() => handleRemoveFaq(index)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                      >
                        <Icons.trash className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Question</Label>
                      <Input
                        value={item.question}
                        onChange={e => {
                          const items = [...data.faq.items];
                          items[index] = { ...item, question: e.target.value };
                          updateData("faq.items", items);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Answer</Label>
                      <Textarea
                        value={item.answer}
                        onChange={e => {
                          const items = [...data.faq.items];
                          items[index] = { ...item, answer: e.target.value };
                          updateData("faq.items", items);
                        }}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeSection === "testimonials" && (
              <div className="space-y-4">
                <h3 className="font-semibold">Testimonials</h3>
                <div className="flex justify-between items-center">
                  <Label>Testimonials</Label>
                  <Button onClick={handleAddTestimonial} variant="outline" size="sm">
                    Add Testimonial
                  </Button>
                </div>
                {data.testimonials.map((testimonial, index) => (
                  <Card key={index} className="p-4 space-y-2">
                    <div className="flex justify-between">
                      <Label>Testimonial {index + 1}</Label>
                      <Button
                        onClick={() => handleRemoveTestimonial(index)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                      >
                        <Icons.trash className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={testimonial.name}
                        onChange={e => {
                          const testimonials = [...data.testimonials];
                          testimonials[index] = { ...testimonial, name: e.target.value };
                          updateData("testimonials", testimonials);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role/Position</Label>
                      <Input
                        value={testimonial.role}
                        onChange={e => {
                          const testimonials = [...data.testimonials];
                          testimonials[index] = { ...testimonial, role: e.target.value };
                          updateData("testimonials", testimonials);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Content</Label>
                      <Textarea
                        value={testimonial.content}
                        onChange={e => {
                          const testimonials = [...data.testimonials];
                          testimonials[index] = { ...testimonial, content: e.target.value };
                          updateData("testimonials", testimonials);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Avatar Image</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                if (e.target?.result) {
                                  const testimonials = [...data.testimonials];
                                  testimonials[index] = { 
                                    ...testimonial, 
                                    image: e.target.result as string 
                                  };
                                  updateData("testimonials", testimonials);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        {testimonial.image && (
                          <div className="w-12 h-12 relative rounded-full overflow-hidden">
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
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