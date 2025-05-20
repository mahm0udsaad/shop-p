"use client";

import { createElement, useState } from "react";
import { InlineEditor, EditableCard, EditableField, InlineEditorGroup } from "@/app/components/inline-editor";
import { Icons } from "@/app/components/dashboard/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TemplateData {
  hero: {
    title: string;
    tagline: string;
    description: string;
    cta: { text: string; url: string };
    image?: string;
  };
  about?: {
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
  brand: { 
    name: string; 
    logo?: string 
  };
  theme: { 
    primaryColor: string; 
    secondaryColor: string 
  };
}

interface ModernTemplateInlineProps {
  data: TemplateData;
  isEditing?: boolean;
  onUpdate?: (path: string, value: any) => void;
}

export function ModernTemplateInline({ data, isEditing = false, onUpdate }: ModernTemplateInlineProps) {
  const [editingSections, setEditingSections] = useState<Record<string, boolean>>({});
  const iconOptions = ["sparkles", "shield", "zap", "star", "heart", "rocket", "check", "box", 
    "settings", "globe", "home", "mail", "thumbsUp", "users", "wand", "desktop", "sun", "moon"];

  // Helper to handle updates
  const handleUpdate = (path: string, value: any) => {
    if (onUpdate) {
      onUpdate(path, value);
    }
  };

  // Toggle editing state for a section
  const toggleEditingSection = (section: string, state: boolean) => {
    setEditingSections(prev => ({
      ...prev,
      [section]: state
    }));
  };

  // Check if section is being edited
  const isSectionEditing = (section: string) => {
    return isEditing && (editingSections[section] || false);
  };

  // Generate css variable style for theme colors
  const themeStyle = {
    "--primary-color": data.theme.primaryColor,
    "--secondary-color": data.theme.secondaryColor,
  } as React.CSSProperties;

  // Handle updates for testimonial fields
  const handleTestimonialUpdate = (index: number, fields: EditableField[]) => {
    const updatedTestimonial = { ...data.testimonials[index] };
    
    fields.forEach(field => {
      if (field.id === 'name') updatedTestimonial.name = field.value;
      if (field.id === 'role') updatedTestimonial.role = field.value;
      if (field.id === 'content') updatedTestimonial.content = field.value;
      if (field.id === 'image') updatedTestimonial.image = field.value;
    });
    
    const testimonials = [...data.testimonials];
    testimonials[index] = updatedTestimonial;
    handleUpdate("testimonials", testimonials);
  };

  // Handle updates for feature fields
  const handleFeatureUpdate = (index: number, fields: EditableField[]) => {
    const updatedFeature = { ...data.features.items[index] };
    
    fields.forEach(field => {
      if (field.id === 'title') updatedFeature.title = field.value;
      if (field.id === 'description') updatedFeature.description = field.value;
      if (field.id === 'icon') updatedFeature.icon = field.value;
    });
    
    const items = [...data.features.items];
    items[index] = updatedFeature;
    handleUpdate("features.items", items);
  };

  // Handle updates for pricing plan fields
  const handlePlanUpdate = (index: number, fields: EditableField[]) => {
    const updatedPlan = { ...data.pricing.plans[index] };
    
    fields.forEach(field => {
      if (field.id === 'name') updatedPlan.name = field.value;
      if (field.id === 'price') updatedPlan.price = Number(field.value);
      if (field.id === 'period') updatedPlan.period = field.value;
      if (field.id === 'discountNote') updatedPlan.discountNote = field.value;
      if (field.id === 'isFeatured') updatedPlan.isFeatured = field.value === 'true';
    });
    
    const plans = [...data.pricing.plans];
    plans[index] = updatedPlan;
    handleUpdate("pricing.plans", plans);
  };

  // Handle updates for FAQ fields
  const handleFaqUpdate = (index: number, fields: EditableField[]) => {
    const updatedFaq = { ...data.faq.items[index] };
    
    fields.forEach(field => {
      if (field.id === 'question') updatedFaq.question = field.value;
      if (field.id === 'answer') updatedFaq.answer = field.value;
    });
    
    const items = [...data.faq.items];
    items[index] = updatedFaq;
    handleUpdate("faq.items", items);
  };

  // Handle updates for benefit fields
  const handleBenefitUpdate = (index: number, fields: EditableField[]) => {
    const benefits = [...data.whyChoose.benefits];
    benefits[index] = fields[0].value;
    handleUpdate("whyChoose.benefits", benefits);
  };

  return (
    <div className="min-h-screen bg-white" style={themeStyle}>
      {/* Theme Settings */}
      {isEditing && (
        <div className="fixed bottom-4 right-4 z-50">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline" className="shadow-md">
                <Icons.paintbrush className="h-4 w-4 mr-2" />
                Theme
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Theme Settings</h4>
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: data.theme.primaryColor }}
                    />
                    <Input
                      id="primary-color"
                      type="color"
                      value={data.theme.primaryColor}
                      onChange={(e) => handleUpdate("theme.primaryColor", e.target.value)}
                      className="w-full h-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: data.theme.secondaryColor }}
                    />
                    <Input
                      id="secondary-color"
                      type="color" 
                      value={data.theme.secondaryColor}
                      onChange={(e) => handleUpdate("theme.secondaryColor", e.target.value)}
                      className="w-full h-8"
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <InlineEditor
                type="text"
                value={data.hero.title}
                onChange={(value: string) => handleUpdate("hero.title", value)}
                placeholder="Your Product Name"
                previewClassName="text-4xl font-bold tracking-tight text-gray-900"
              />
              
              <InlineEditor
                type="text"
                value={data.hero.tagline}
                onChange={(value: string) => handleUpdate("hero.tagline", value)}
                placeholder="A compelling tagline that captures attention"
                previewClassName="text-xl font-medium text-gray-600"
              />
              
              <InlineEditor
                type="textarea"
                value={data.hero.description}
                onChange={(value: string) => handleUpdate("hero.description", value)}
                placeholder="Describe your product's main value proposition"
                previewClassName="text-gray-600 max-w-md"
              />
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white"
                  size="lg"
                >
                  <InlineEditor
                    type="text"
                    value={data.hero.cta.text}
                    onChange={(value: string) => handleUpdate("hero.cta.text", value)}
                    placeholder="Get Started"
                    className="p-0 m-0"
                    previewClassName="font-medium"
                  />
                </Button>
              </div>
            </div>
            
            <div className="relative h-[350px] rounded-lg overflow-hidden shadow-xl">
              <InlineEditor
                type="image"
                value={data.hero.image || ""}
                onChange={(value: string) => handleUpdate("hero.image", value)}
                imageSize="lg"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section (if exists) */}
      {data.about && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <InlineEditor
                  type="image"
                  value={data.about.image || ""}
                  onChange={(value: string) => handleUpdate("about.image", value)}
                  imageSize="lg"
                  className="w-full h-full aspect-square"
                />
              </div>
              
              <div className="space-y-6">
                <InlineEditor
                  type="text"
                  value={data.about.title}
                  onChange={(value: string) => handleUpdate("about.title", value)}
                  placeholder="About Our Product"
                  previewClassName="text-3xl font-bold tracking-tight text-gray-900 mb-4"
                />
                
                <InlineEditor
                  type="textarea"
                  value={data.about.description}
                  onChange={(value: string) => handleUpdate("about.description", value)}
                  placeholder="Describe what makes your product special"
                  previewClassName="text-gray-600"
                />
                
                <div className="space-y-2 mt-4">
                  <h3 className="font-semibold text-lg mb-3">Key Features</h3>
                  <div className="space-y-2">
                    {data.about.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-5 w-5 text-primary">
                          <Icons.check className="h-5 w-5" />
                        </div>
                        <InlineEditor
                          type="text"
                          value={feature}
                          onChange={(value: string) => {
                            const features = [...data.about!.features];
                            features[index] = value;
                            handleUpdate("about.features", features);
                          }}
                          placeholder={`Feature ${index + 1}`}
                          previewClassName="text-gray-600"
                        />
                      </div>
                    ))}
                    
                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          const features = [...data.about!.features, "New Feature"];
                          handleUpdate("about.features", features);
                        }}
                      >
                        <Icons.plus className="h-4 w-4 mr-1" /> Add Feature
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <InlineEditor
              type="text"
              value={data.whyChoose.title}
              onChange={(value: string) => handleUpdate("whyChoose.title", value)}
              placeholder="Why Choose Us"
              previewClassName="text-3xl font-bold tracking-tight text-gray-900 mb-4"
            />
            
            <InlineEditor
              type="text"
              value={data.whyChoose.subtitle}
              onChange={(value: string) => handleUpdate("whyChoose.subtitle", value)}
              placeholder="Discover the benefits that set us apart"
              previewClassName="text-xl text-gray-600"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.whyChoose.benefits.map((benefit, index) => (
              <EditableCard
                key={index}
                fields={[
                  {
                    id: "benefit",
                    type: "text",
                    label: "Benefit",
                    value: benefit,
                    placeholder: `Benefit ${index + 1}`
                  }
                ]}
                onSave={(fields) => handleBenefitUpdate(index, fields)}
                className="text-center h-full"
              >
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Icons.check className="h-6 w-6 text-primary" />
                </div>
              </EditableCard>
            ))}
          </div>
          
          {isEditing && (
            <div className="flex justify-center mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const benefits = [...data.whyChoose.benefits, "New Benefit"];
                  handleUpdate("whyChoose.benefits", benefits);
                }}
              >
                <Icons.plus className="h-4 w-4 mr-1" /> Add Benefit
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <InlineEditor
              type="text"
              value={data.features.title}
              onChange={(value: string) => handleUpdate("features.title", value)}
              placeholder="Features"
              previewClassName="text-3xl font-bold tracking-tight text-gray-900 mb-4"
            />
            
            <InlineEditor
              type="text"
              value={data.features.subtitle}
              onChange={(value: string) => handleUpdate("features.subtitle", value)}
              placeholder="Everything you need to succeed"
              previewClassName="text-xl text-gray-600"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.features.items.map((feature, index) => (
              <EditableCard
                key={index}
                fields={[
                  {
                    id: "icon",
                    type: "icon",
                    label: "Icon",
                    value: feature.icon || "",
                    options: iconOptions
                  },
                  {
                    id: "title",
                    type: "text",
                    label: "Title",
                    value: feature.title,
                    placeholder: `Feature ${index + 1}`
                  },
                  {
                    id: "description",
                    type: "textarea",
                    label: "Description",
                    value: feature.description,
                    placeholder: "Describe this feature"
                  }
                ]}
                onSave={(fields) => handleFeatureUpdate(index, fields)}
                className="h-full"
              >
                {feature.icon && Icons[feature.icon as keyof typeof Icons] && (
                  <div className="mb-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {createElement(Icons[feature.icon as keyof typeof Icons], {
                      className: "h-5 w-5 text-primary",
                    })}
                  </div>
                )}
              </EditableCard>
            ))}
          </div>
          
          {isEditing && (
            <div className="flex justify-center mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const items = [...data.features.items, {
                    title: "New Feature",
                    description: "Description of this feature",
                    icon: "sparkles"
                  }];
                  handleUpdate("features.items", items);
                }}
              >
                <Icons.plus className="h-4 w-4 mr-1" /> Add Feature
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <InlineEditor
              type="text"
              value={data.pricing.title}
              onChange={(value: string) => handleUpdate("pricing.title", value)}
              placeholder="Pricing Plans"
              previewClassName="text-3xl font-bold tracking-tight text-gray-900 mb-4"
            />
            
            <InlineEditor
              type="text"
              value={data.pricing.subtitle}
              onChange={(value: string) => handleUpdate("pricing.subtitle", value)}
              placeholder="Choose the perfect plan for your needs"
              previewClassName="text-xl text-gray-600"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {data.pricing.plans.map((plan, index) => (
              <EditableCard
                key={index}
                fields={[
                  {
                    id: "name",
                    type: "text",
                    label: "Plan Name",
                    value: plan.name,
                    placeholder: "Plan Name"
                  },
                  {
                    id: "price",
                    type: "text",
                    label: "Price",
                    value: plan.price.toString(),
                    placeholder: "29"
                  },
                  {
                    id: "period",
                    type: "text",
                    label: "Period",
                    value: plan.period,
                    placeholder: "per month"
                  },
                  {
                    id: "discountNote",
                    type: "text",
                    label: "Discount Note (optional)",
                    value: plan.discountNote || "",
                    placeholder: "Save 20% with annual billing"
                  }
                ]}
                onSave={(fields) => handlePlanUpdate(index, fields)}
                className={cn(
                  "h-full transition-all",
                  plan.isFeatured ? "border-primary shadow-lg scale-105 relative z-10 bg-white" : "bg-white"
                )}
              >
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold mb-1">
                    <span className="text-lg align-top">{data.pricing.currency}</span>
                    {plan.price}
                  </div>
                  <div className="text-sm text-gray-500">{plan.period}</div>
                  {plan.discountNote && (
                    <div className="text-xs text-primary mt-1">{plan.discountNote}</div>
                  )}
                </div>
                
                {plan.isFeatured && (
                  <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg font-medium">
                    Popular
                  </div>
                )}
                
                <div className="space-y-2 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <Icons.check className="h-4 w-4 text-primary flex-shrink-0" />
                      <InlineEditor
                        type="text"
                        value={feature}
                        onChange={(value: string) => {
                          const updatedPlan = { ...plan };
                          updatedPlan.features = [...plan.features];
                          updatedPlan.features[featureIndex] = value;
                          
                          const plans = [...data.pricing.plans];
                          plans[index] = updatedPlan;
                          handleUpdate("pricing.plans", plans);
                        }}
                        placeholder={`Feature ${featureIndex + 1}`}
                        className="flex-1"
                      />
                    </div>
                  ))}
                  
                  {isEditing && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => {
                        const updatedPlan = { ...plan };
                        updatedPlan.features = [...plan.features, "New Feature"];
                        
                        const plans = [...data.pricing.plans];
                        plans[index] = updatedPlan;
                        handleUpdate("pricing.plans", plans);
                      }}
                    >
                      <Icons.plus className="h-3 w-3 mr-1" /> Add Feature
                    </Button>
                  )}
                </div>
                
                <Button className="w-full bg-primary text-white hover:bg-primary/90">
                  Choose Plan
                </Button>
                
                {isEditing && (
                  <div className="mt-4 flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <label className="text-gray-600">Featured</label>
                      <input
                        type="checkbox"
                        checked={plan.isFeatured}
                        onChange={(e) => {
                          const updatedPlan = { ...plan, isFeatured: e.target.checked };
                          const plans = [...data.pricing.plans];
                          plans[index] = updatedPlan;
                          handleUpdate("pricing.plans", plans);
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                    
                    {data.pricing.plans.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          const plans = data.pricing.plans.filter((_, i) => i !== index);
                          handleUpdate("pricing.plans", plans);
                        }}
                      >
                        <Icons.trash className="h-3 w-3 mr-1" /> Remove
                      </Button>
                    )}
                  </div>
                )}
              </EditableCard>
            ))}
          </div>
          
          {isEditing && (
            <div className="flex justify-center mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const newPlan = {
                    name: "New Plan",
                    price: 49,
                    period: "per month",
                    features: ["Feature 1", "Feature 2", "Feature 3"],
                    isFeatured: false
                  };
                  
                  const plans = [...data.pricing.plans, newPlan];
                  handleUpdate("pricing.plans", plans);
                }}
              >
                <Icons.plus className="h-4 w-4 mr-1" /> Add Plan
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Don't just take our word for it. Here's what our users think.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.testimonials.map((testimonial, index) => (
              <EditableCard
                key={index}
                fields={[
                  {
                    id: "image",
                    type: "image",
                    label: "Profile Image",
                    value: testimonial.image || "",
                    imageSize: "sm"
                  },
                  {
                    id: "name",
                    type: "text",
                    label: "Name",
                    value: testimonial.name,
                    placeholder: "John Doe"
                  },
                  {
                    id: "role",
                    type: "text",
                    label: "Role",
                    value: testimonial.role,
                    placeholder: "CEO at Company"
                  },
                  {
                    id: "content",
                    type: "textarea",
                    label: "Testimonial",
                    value: testimonial.content,
                    placeholder: "Share what this person had to say about your product"
                  }
                ]}
                onSave={(fields) => handleTestimonialUpdate(index, fields)}
                className="h-full bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="mb-6 flex justify-center">
                  <Icons.quote className="h-8 w-8 text-primary/20" />
                </div>
              </EditableCard>
            ))}
          </div>
          
          {isEditing && (
            <div className="flex justify-center mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const testimonials = [...data.testimonials, {
                    name: "New Testimonial",
                    role: "Role at Company",
                    content: "Share what this person had to say about your product",
                    image: ""
                  }];
                  handleUpdate("testimonials", testimonials);
                }}
              >
                <Icons.plus className="h-4 w-4 mr-1" /> Add Testimonial
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <InlineEditor
              type="text"
              value={data.faq.title}
              onChange={(value: string) => handleUpdate("faq.title", value)}
              placeholder="Frequently Asked Questions"
              previewClassName="text-3xl font-bold tracking-tight text-gray-900 mb-4"
            />
            
            <InlineEditor
              type="text"
              value={data.faq.subtitle}
              onChange={(value: string) => handleUpdate("faq.subtitle", value)}
              placeholder="Find answers to common questions about our product"
              previewClassName="text-xl text-gray-600"
            />
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {data.faq.items.map((item, index) => (
              <EditableCard
                key={index}
                fields={[
                  {
                    id: "question",
                    type: "text",
                    label: "Question",
                    value: item.question,
                    placeholder: "What is your question?"
                  },
                  {
                    id: "answer",
                    type: "textarea",
                    label: "Answer",
                    value: item.answer,
                    placeholder: "Provide the answer to the question"
                  }
                ]}
                onSave={(fields) => handleFaqUpdate(index, fields)}
                className="bg-white"
              />
            ))}
          </div>
          
          {isEditing && (
            <div className="flex justify-center mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const items = [...data.faq.items, {
                    question: "New Question",
                    answer: "Provide the answer to this question"
                  }];
                  handleUpdate("faq.items", items);
                }}
              >
                <Icons.plus className="h-4 w-4 mr-1" /> Add FAQ
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <InlineEditor
                type="text"
                value={data.brand.name}
                onChange={(value: string) => handleUpdate("brand.name", value)}
                placeholder="Your Brand"
                previewClassName="text-xl font-bold"
              />
              <div className="text-gray-400 mt-2">
                © {new Date().getFullYear()} All rights reserved.
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Icons.twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Icons.facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Icons.instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 