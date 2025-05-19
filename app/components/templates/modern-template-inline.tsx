"use client";

import { useState } from "react";
import { InlineEditor, EditableCard, InlineEditorGroup } from "@/app/components/inline-editor";
import { Icons } from "@/app/components/dashboard/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const iconOptions = ["sparkles", "shield", "zap", "star", "heart", "rocket", "check", "box"];

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

  return (
    <div className="min-h-screen bg-white" style={themeStyle}>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
        <InlineEditorGroup
          className="container mx-auto px-4 md:px-6"
          isEditing={isSectionEditing("hero")}
          onEditToggle={(state: boolean) => toggleEditingSection("hero", state)}
        >
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
        </InlineEditorGroup>
      </section>

      {/* About Section (if exists) */}
      {data.about && (
        <section className="py-20 bg-white">
          <InlineEditorGroup
            className="container mx-auto px-4 md:px-6"
            isEditing={isSectionEditing("about")}
            onEditToggle={(state: boolean) => toggleEditingSection("about", state)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative h-[350px] rounded-lg overflow-hidden shadow-xl order-2 md:order-1">
                <InlineEditor
                  type="image"
                  value={data.about.image || ""}
                  onChange={(value: string) => handleUpdate("about.image", value)}
                  imageSize="lg"
                  className="w-full h-full"
                />
              </div>
              
              <div className="space-y-6 order-1 md:order-2">
                <InlineEditor
                  type="text"
                  value={data.about.title}
                  onChange={(value: string) => handleUpdate("about.title", value)}
                  placeholder="About Our Product"
                  previewClassName="text-3xl font-bold tracking-tight text-gray-900"
                />
                
                <InlineEditor
                  type="textarea"
                  value={data.about.description}
                  onChange={(value: string) => handleUpdate("about.description", value)}
                  placeholder="Describe what makes your product special"
                  previewClassName="text-gray-600"
                />
                
                <div className="space-y-3">
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
                  
                  {isSectionEditing("about") && (
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
          </InlineEditorGroup>
        </section>
      )}

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <InlineEditorGroup
          className="container mx-auto px-4 md:px-6"
          isEditing={isSectionEditing("whyChoose")}
          onEditToggle={(state: boolean) => toggleEditingSection("whyChoose", state)}
        >
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
              <EditableCard key={index} className="text-center h-full">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Icons.check className="h-6 w-6 text-primary" />
                </div>
                
                <InlineEditor
                  type="text"
                  value={benefit}
                  onChange={(value: string) => {
                    const benefits = [...data.whyChoose.benefits];
                    benefits[index] = value;
                    handleUpdate("whyChoose.benefits", benefits);
                  }}
                  placeholder={`Benefit ${index + 1}`}
                  previewClassName="font-semibold text-gray-900 mb-2"
                />
              </EditableCard>
            ))}
          </div>
          
          {isSectionEditing("whyChoose") && (
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
        </InlineEditorGroup>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <InlineEditorGroup
          className="container mx-auto px-4 md:px-6"
          isEditing={isSectionEditing("features")}
          onEditToggle={(state: boolean) => toggleEditingSection("features", state)}
        >
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
              <EditableCard key={index} className="h-full">
                <div className="mb-4">
                  {feature.icon && Icons[feature.icon as keyof typeof Icons] ? (
                    <div className="inline-flex h-10 w-10 rounded-md bg-primary/10 p-2">
                      {React.createElement(Icons[feature.icon as keyof typeof Icons], {
                        className: "h-6 w-6 text-primary",
                      })}
                    </div>
                  ) : (
                    <InlineEditor
                      type="icon"
                      value={feature.icon || ""}
                      onChange={(value: string) => {
                        const items = [...data.features.items];
                        items[index] = { ...feature, icon: value };
                        handleUpdate("features.items", items);
                      }}
                      iconOptions={iconOptions}
                      className="inline-block"
                    />
                  )}
                </div>
                
                <InlineEditor
                  type="text"
                  value={feature.title}
                  onChange={(value: string) => {
                    const items = [...data.features.items];
                    items[index] = { ...feature, title: value };
                    handleUpdate("features.items", items);
                  }}
                  placeholder={`Feature ${index + 1}`}
                  previewClassName="font-semibold text-xl mb-2"
                />
                
                <InlineEditor
                  type="textarea"
                  value={feature.description}
                  onChange={(value: string) => {
                    const items = [...data.features.items];
                    items[index] = { ...feature, description: value };
                    handleUpdate("features.items", items);
                  }}
                  placeholder="Describe this feature"
                  previewClassName="text-gray-600"
                />
              </EditableCard>
            ))}
          </div>
          
          {isSectionEditing("features") && (
            <div className="flex justify-center mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const items = [
                    ...data.features.items,
                    { title: "New Feature", description: "Describe this feature", icon: "sparkles" },
                  ];
                  handleUpdate("features.items", items);
                }}
              >
                <Icons.plus className="h-4 w-4 mr-1" /> Add Feature
              </Button>
            </div>
          )}
        </InlineEditorGroup>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <InlineEditorGroup
          className="container mx-auto px-4 md:px-6"
          isEditing={isSectionEditing("pricing")}
          onEditToggle={(state: boolean) => toggleEditingSection("pricing", state)}
        >
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
              placeholder="Choose the perfect plan for you"
              previewClassName="text-xl text-gray-600"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.pricing.plans.map((plan, planIndex) => (
              <EditableCard 
                key={planIndex} 
                className={cn(
                  "h-full border rounded-lg overflow-hidden",
                  plan.isFeatured ? "border-primary shadow-lg" : "border-gray-200"
                )}
              >
                <div className="p-6">
                  <InlineEditor
                    type="text"
                    value={plan.name}
                    onChange={(value: string) => {
                      const plans = [...data.pricing.plans];
                      plans[planIndex] = { ...plan, name: value };
                      handleUpdate("pricing.plans", plans);
                    }}
                    placeholder="Plan Name"
                    previewClassName="text-xl font-semibold mb-2"
                  />
                  
                  <div className="flex items-baseline mb-4">
                    <span className="text-gray-500 mr-1">{data.pricing.currency}</span>
                    <InlineEditor
                      type="text"
                      value={String(plan.price)}
                      onChange={(value: string) => {
                        const plans = [...data.pricing.plans];
                        plans[planIndex] = { ...plan, price: Number(value) };
                        handleUpdate("pricing.plans", plans);
                      }}
                      placeholder="0"
                      previewClassName="text-4xl font-bold"
                    />
                    <span className="text-gray-500 ml-1">
                      /{plan.period === "lifetime" ? "one-time" : plan.period}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <Icons.check className="h-5 w-5 text-primary mr-2" />
                        <InlineEditor
                          type="text"
                          value={feature}
                          onChange={(value: string) => {
                            const plans = [...data.pricing.plans];
                            plans[planIndex].features[featureIndex] = value;
                            handleUpdate("pricing.plans", plans);
                          }}
                          placeholder={`Feature ${featureIndex + 1}`}
                          previewClassName="text-gray-600"
                        />
                      </div>
                    ))}
                    
                    {isSectionEditing("pricing") && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-2 w-full"
                        onClick={() => {
                          const plans = [...data.pricing.plans];
                          plans[planIndex].features.push("New Feature");
                          handleUpdate("pricing.plans", plans);
                        }}
                      >
                        <Icons.plus className="h-4 w-4 mr-1" /> Add Feature
                      </Button>
                    )}
                  </div>
                  
                  <Button variant="default" className="w-full">Get Started</Button>
                </div>
              </EditableCard>
            ))}
          </div>
          
          {isSectionEditing("pricing") && (
            <div className="flex justify-center mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const plans = [
                    ...data.pricing.plans,
                    {
                      name: "New Plan",
                      price: 0,
                      period: "month",
                      features: ["Feature 1"],
                    },
                  ];
                  handleUpdate("pricing.plans", plans);
                }}
              >
                <Icons.plus className="h-4 w-4 mr-1" /> Add Plan
              </Button>
            </div>
          )}
        </InlineEditorGroup>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <InlineEditorGroup
          className="container mx-auto px-4 md:px-6"
          isEditing={isSectionEditing("testimonials")}
          onEditToggle={(state: boolean) => toggleEditingSection("testimonials", state)}
        >
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">What Our Customers Say</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.testimonials.map((testimonial, index) => (
              <EditableCard key={index} className="h-full">
                <div className="mb-4 text-gray-600">
                  <Icons.quote className="h-8 w-8 text-primary/20 mb-2" />
                  <InlineEditor
                    type="textarea"
                    value={testimonial.content}
                    onChange={(value: string) => {
                      const testimonials = [...data.testimonials];
                      testimonials[index] = { ...testimonial, content: value };
                      handleUpdate("testimonials", testimonials);
                    }}
                    placeholder="Customer testimonial"
                    previewClassName="italic"
                  />
                </div>
                
                <div className="flex items-center">
                  <div className="mr-4">
                    <InlineEditor
                      type="image"
                      value={testimonial.image || ""}
                      onChange={(value: string) => {
                        const testimonials = [...data.testimonials];
                        testimonials[index] = { ...testimonial, image: value };
                        handleUpdate("testimonials", testimonials);
                      }}
                      imageSize="sm"
                      className="rounded-full overflow-hidden"
                    />
                  </div>
                  
                  <div>
                    <InlineEditor
                      type="text"
                      value={testimonial.name}
                      onChange={(value: string) => {
                        const testimonials = [...data.testimonials];
                        testimonials[index] = { ...testimonial, name: value };
                        handleUpdate("testimonials", testimonials);
                      }}
                      placeholder="Customer Name"
                      previewClassName="font-semibold"
                    />
                    
                    <InlineEditor
                      type="text"
                      value={testimonial.role}
                      onChange={(value: string) => {
                        const testimonials = [...data.testimonials];
                        testimonials[index] = { ...testimonial, role: value };
                        handleUpdate("testimonials", testimonials);
                      }}
                      placeholder="Customer Role"
                      previewClassName="text-gray-500 text-sm"
                    />
                  </div>
                </div>
              </EditableCard>
            ))}
          </div>
          
          {isSectionEditing("testimonials") && (
            <div className="flex justify-center mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const testimonials = [
                    ...data.testimonials,
                    {
                      name: "New Customer",
                      role: "Position",
                      content: "Add a testimonial",
                      image: "",
                    },
                  ];
                  handleUpdate("testimonials", testimonials);
                }}
              >
                <Icons.plus className="h-4 w-4 mr-1" /> Add Testimonial
              </Button>
            </div>
          )}
        </InlineEditorGroup>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <InlineEditorGroup
          className="container mx-auto px-4 md:px-6 max-w-4xl"
          isEditing={isSectionEditing("faq")}
          onEditToggle={(state: boolean) => toggleEditingSection("faq", state)}
        >
          <div className="text-center mb-12">
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
              placeholder="Find answers to common questions"
              previewClassName="text-xl text-gray-600"
            />
          </div>
          
          <div className="space-y-6">
            {data.faq.items.map((item, index) => (
              <EditableCard key={index}>
                <InlineEditor
                  type="text"
                  value={item.question}
                  onChange={(value: string) => {
                    const items = [...data.faq.items];
                    items[index] = { ...item, question: value };
                    handleUpdate("faq.items", items);
                  }}
                  placeholder={`Question ${index + 1}`}
                  previewClassName="text-lg font-semibold mb-2"
                />
                
                <InlineEditor
                  type="textarea"
                  value={item.answer}
                  onChange={(value: string) => {
                    const items = [...data.faq.items];
                    items[index] = { ...item, answer: value };
                    handleUpdate("faq.items", items);
                  }}
                  placeholder="Answer this question"
                  previewClassName="text-gray-600"
                />
              </EditableCard>
            ))}
          </div>
          
          {isSectionEditing("faq") && (
            <div className="flex justify-center mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const items = [
                    ...data.faq.items,
                    { question: "New Question", answer: "Answer this question" },
                  ];
                  handleUpdate("faq.items", items);
                }}
              >
                <Icons.plus className="h-4 w-4 mr-1" /> Add FAQ
              </Button>
            </div>
          )}
        </InlineEditorGroup>
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
              <p className="mt-2 text-gray-400">© {new Date().getFullYear()} All rights reserved.</p>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Icons.twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Icons.facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Icons.instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 