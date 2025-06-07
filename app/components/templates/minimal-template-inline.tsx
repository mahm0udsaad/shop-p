"use client";

import { createElement } from "react";
import { InlineEditor, EditableCard, EditableField } from "@/app/components/inline-editor";
import { Icons } from "@/app/components/dashboard/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TemplateControls } from "@/app/components/templates/shared/template-controls";
import { useTemplateImageUpload } from "@/hooks/use-template-image-upload";

interface TemplateData {
  navbar?: {
    logo?: string;
    title?: string;
    links?: Array<{
      text: string;
      url: string;
      isButton?: boolean;
    }>;
  };
  hero: {
    title: string;
    subtitle: string;
    description: string;
    cta: { text: string; url: string };
    image?: string;
    price?: string;
    originalPrice?: string;
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
  benefits: {
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      description: string;
      image?: string;
    }>;
  };
  pricing: {
    title: string;
    subtitle: string;
    price: string;
    originalPrice?: string;
    currency: string;
    features: string[];
    cta: { text: string; url: string };
    guarantee?: string;
  };
  testimonials: Array<{
    name: string;
    role: string;
    content: string;
    image?: string;
    rating?: number;
  }>;
  cta: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonUrl: string;
  };
  brand: { 
    name: string; 
    logo?: string 
  };
  theme: { 
    primaryColor: string; 
    secondaryColor: string 
  };
}

interface MinimalTemplateInlineProps {
  data: TemplateData;
  isEditing?: boolean;
  onUpdate?: (path: string, value: any) => void;
}

// Custom Image Input Component with Upload Support
interface ImageInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  isEditing?: boolean;
  uploadPath: string; // Path for the upload state tracking
}

function ImageInput({ value, onChange, className, placeholder = "Click to upload image", isEditing = true, uploadPath }: ImageInputProps) {
  const { uploadImage, getUploadState } = useTemplateImageUpload();
  const uploadState = getUploadState(uploadPath);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadImage(file, uploadPath);
    }
  };

  if (!isEditing) {
    return value ? (
      <img src={value} alt="" className={cn("object-cover", className)} />
    ) : (
      <div className={cn("bg-gray-100 flex items-center justify-center", className)}>
        <Icons.image className="h-12 w-12 text-gray-400" />
      </div>
    );
  }

  return (
    <div className={cn("relative group cursor-pointer", className)}>
      {value || uploadState.previewUrl ? (
        // Image exists or uploading - overlay input on top
        <>
          <img src={value || uploadState.previewUrl || ""} alt="" className="w-full h-full object-cover" />
          
          {/* Loading overlay */}
          {uploadState.isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white/90 rounded-lg p-3 flex items-center gap-2">
                <Icons.spinner className="h-4 w-4 animate-spin" />
                <span className="text-sm">Uploading...</span>
              </div>
            </div>
          )}
          
          {/* Hover overlay for changing image */}
          {!uploadState.isUploading && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-lg p-2">
                <Icons.camera className="h-6 w-6 text-gray-700" />
              </div>
            </div>
          )}
          
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploadState.isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </>
      ) : (
        // No image - show placeholder with input
        <div className="w-full h-full border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100">
          <Icons.image className="h-12 w-12 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500 text-center px-4">{placeholder}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploadState.isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      )}
      
      {/* Error message */}
      {uploadState.error && (
        <div className="absolute -bottom-6 left-0 right-0 text-xs text-red-500 text-center">
          {uploadState.error}
        </div>
      )}
    </div>
  );
}

export function MinimalTemplateInline({ data, isEditing = false, onUpdate }: MinimalTemplateInlineProps) {
  const iconOptions = ["sparkles", "shield", "zap", "star", "heart", "rocket", "check", "box", 
    "settings", "globe", "home", "mail", "thumbsUp", "users", "wand", "desktop", "sun", "moon"];

  // Helper to handle updates
  const handleUpdate = (path: string, value: any) => {
    if (onUpdate) {
      onUpdate(path, value);
    }
  };

  // Generate css variable style for theme colors
  const themeStyle = {
    "--primary-color": data.theme.primaryColor,
    "--secondary-color": data.theme.secondaryColor,
  } as React.CSSProperties;

  // Generate dynamic CSS classes for theme colors
  const primaryColorStyle = { color: data.theme.primaryColor };
  const primaryBgStyle = { backgroundColor: data.theme.primaryColor };

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

  // Handle updates for benefit fields
  const handleBenefitUpdate = (index: number, fields: EditableField[]) => {
    const updatedBenefit = { ...data.benefits.items[index] };
    
    fields.forEach(field => {
      if (field.id === 'title') updatedBenefit.title = field.value;
      if (field.id === 'description') updatedBenefit.description = field.value;
      if (field.id === 'image') updatedBenefit.image = field.value;
    });
    
    const items = [...data.benefits.items];
    items[index] = updatedBenefit;
    handleUpdate("benefits.items", items);
  };

  // Handle updates for testimonial fields
  const handleTestimonialUpdate = (index: number, fields: EditableField[]) => {
    const updatedTestimonial = { ...data.testimonials[index] };
    
    fields.forEach(field => {
      if (field.id === 'name') updatedTestimonial.name = field.value;
      if (field.id === 'role') updatedTestimonial.role = field.value;
      if (field.id === 'content') updatedTestimonial.content = field.value;
      if (field.id === 'image') updatedTestimonial.image = field.value;
      if (field.id === 'rating') updatedTestimonial.rating = Number(field.value);
    });
    
    const testimonials = [...data.testimonials];
    testimonials[index] = updatedTestimonial;
    handleUpdate("testimonials", testimonials);
  };

  // Handle updates for pricing features
  const handlePricingFeatureUpdate = (index: number, value: string) => {
    const features = [...data.pricing.features];
    features[index] = value;
    handleUpdate("pricing.features", features);
  };

  // Calculate completion percentage
  const calculateCompletionPercentage = () => {
    const requiredFields = [
      data.hero.title,
      data.hero.subtitle,
      data.hero.description,
      data.hero.cta.text,
      data.features.title,
      data.benefits.title,
      data.pricing.title,
      data.pricing.price,
      data.cta.title,
      data.brand.name,
    ];

    const optionalFields = [
      data.hero.image,
      data.hero.price,
      data.navbar?.logo,
      data.pricing.guarantee,
      ...data.features.items.map(item => item.title),
      ...data.benefits.items.map(item => item.title),
      ...data.testimonials.map(t => t.name),
      ...data.pricing.features,
    ];

    const filledRequired = requiredFields.filter(field => field && field.trim() !== '').length;
    const filledOptional = optionalFields.filter(field => field && field.trim() !== '').length;
    
    const requiredWeight = 0.7; // 70% weight for required fields
    const optionalWeight = 0.3; // 30% weight for optional fields
    
    const requiredScore = (filledRequired / requiredFields.length) * requiredWeight;
    const optionalScore = (filledOptional / optionalFields.length) * optionalWeight;
    
    return Math.round((requiredScore + optionalScore) * 100);
  };

  // Render star rating
  const renderStars = (rating: number = 5) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icons.star
        key={i}
        className={cn(
          "h-4 w-4",
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        )}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-white" style={themeStyle}>
      {/* Template Controls */}
      <TemplateControls
        isEditing={isEditing}
        completionPercentage={calculateCompletionPercentage()}
        primaryColor={data.theme.primaryColor}
        secondaryColor={data.theme.secondaryColor}
        onPrimaryColorChange={(color) => handleUpdate("theme.primaryColor", color)}
        onSecondaryColorChange={(color) => handleUpdate("theme.secondaryColor", color)}
        completionMessage="Complete your product landing page"
      />

      {/* Navbar/Header */}
      <header className="w-full py-4 px-6 border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center max-w-6xl">
          <div className="flex items-center">
            {/* Logo Component */}
            {isEditing ? (
              <div className="flex items-center gap-3 cursor-pointer">
                <ImageInput
                  value={data.navbar?.logo || ""}
                  onChange={(value: string) => handleUpdate("navbar.logo", value)}
                  className="h-8 w-8 rounded"
                  placeholder="Logo"
                  isEditing={isEditing}
                  uploadPath="navbar.logo"
                />
                <div style={primaryColorStyle}>
                  <InlineEditor
                    type="text"
                    value={data.navbar?.title || data.brand?.name || "Your Brand"}
                    onChange={(value: string) => handleUpdate("navbar.title", value)}
                    placeholder="Brand Name"
                    previewClassName="text-xl font-semibold"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {data.navbar?.logo && (
                  <img 
                    src={data.navbar.logo} 
                    alt="Logo" 
                    className="h-8 w-8 object-contain"
                  />
                )}
                <div style={primaryColorStyle} className="text-xl font-semibold">
                  {data.navbar?.title || data.brand?.name || "Your Brand"}
                </div>
              </div>
            )}
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {(data.navbar?.links || [
              { text: "Features", url: "#features" },
              { text: "Benefits", url: "#benefits" },
              { text: "Pricing", url: "#pricing" },
              { text: "Buy Now", url: "#pricing", isButton: true }
            ]).map((link, index) => (
              <div key={index}>
                {link.isButton ? (
                  <Button 
                    style={primaryBgStyle}
                    className="text-white hover:opacity-90 px-6"
                  >
                    {link.text}
                  </Button>
                ) : (
                  <a 
                    href={link.url} 
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.text}
                  </a>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Icons.menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <InlineEditor
                  type="text"
                  value={data.hero.title}
                  onChange={(value: string) => handleUpdate("hero.title", value)}
                  placeholder="Your Amazing Product Name"
                  previewClassName="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight"
                />
                
                <InlineEditor
                  type="text"
                  value={data.hero.subtitle}
                  onChange={(value: string) => handleUpdate("hero.subtitle", value)}
                  placeholder="The solution you've been waiting for"
                  previewClassName="text-xl text-gray-600"
                />
              </div>
              
              <InlineEditor
                type="textarea"
                value={data.hero.description}
                onChange={(value: string) => handleUpdate("hero.description", value)}
                placeholder="Describe your product's main benefits and why customers need it"
                previewClassName="text-gray-600 text-lg leading-relaxed"
              />
              
              {/* Price Display */}
              <div className="flex items-center gap-4">
                <div className="flex items-baseline gap-2">
                  <InlineEditor
                    type="text"
                    value={data.hero.price || "$99"}
                    onChange={(value: string) => handleUpdate("hero.price", value)}
                    placeholder="$99"
                    previewClassName="text-3xl font-bold text-gray-900"
                  />
                  {data.hero.originalPrice && (
                    <InlineEditor
                      type="text"
                      value={data.hero.originalPrice}
                      onChange={(value: string) => handleUpdate("hero.originalPrice", value)}
                      placeholder="$149"
                      previewClassName="text-lg text-gray-500 line-through"
                    />
                  )}
                </div>
                {isEditing && !data.hero.originalPrice && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdate("hero.originalPrice", "$149")}
                  >
                    Add Original Price
                  </Button>
                )}
              </div>
              
              <div className="pt-4">
                <Button 
                  style={primaryBgStyle}
                  className="text-white hover:opacity-90 px-8 py-3 text-lg font-semibold"
                  size="lg"
                >
                  <InlineEditor
                    type="text"
                    value={data.hero.cta.text}
                    onChange={(value: string) => handleUpdate("hero.cta.text", value)}
                    placeholder="Buy Now"
                    className="p-0 m-0"
                    previewClassName="font-semibold"
                  />
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <ImageInput
                value={data.hero.image || ""}
                onChange={(value: string) => handleUpdate("hero.image", value)}
                className="w-full h-96 rounded-xl overflow-hidden shadow-2xl"
                placeholder="Upload your product image"
                isEditing={isEditing}
                uploadPath="hero.image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <InlineEditor
              type="text"
              value={data.features.title}
              onChange={(value: string) => handleUpdate("features.title", value)}
              placeholder="Key Features"
              previewClassName="text-3xl font-bold tracking-tight text-gray-900 mb-4"
            />
            
            <InlineEditor
              type="text"
              value={data.features.subtitle}
              onChange={(value: string) => handleUpdate("features.subtitle", value)}
              placeholder="Everything you need in one product"
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
                className="text-center p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
              >
                {feature.icon && Icons[feature.icon as keyof typeof Icons] && (
                  <div className="mb-4 flex justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      {createElement(Icons[feature.icon as keyof typeof Icons], {
                        className: "h-6 w-6 text-primary",
                      })}
                    </div>
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

      {/* Benefits Section */}
      <section id="benefits" className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <InlineEditor
              type="text"
              value={data.benefits.title}
              onChange={(value: string) => handleUpdate("benefits.title", value)}
              placeholder="Why Choose Our Product"
              previewClassName="text-3xl font-bold tracking-tight text-gray-900 mb-4"
            />
            
            <InlineEditor
              type="text"
              value={data.benefits.subtitle}
              onChange={(value: string) => handleUpdate("benefits.subtitle", value)}
              placeholder="The benefits that make the difference"
              previewClassName="text-xl text-gray-600"
            />
          </div>
          
          <div className="space-y-12">
            {data.benefits.items.map((benefit, index) => (
              <div
                key={index}
                className={cn(
                  "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center",
                  index % 2 === 1 && "lg:grid-flow-col-dense"
                )}
              >
                <div className={cn("space-y-4", index % 2 === 1 && "lg:col-start-2")}>
                  <EditableCard
                    fields={[
                      {
                        id: "title",
                        type: "text",
                        label: "Title",
                        value: benefit.title,
                        placeholder: `Benefit ${index + 1}`
                      },
                      {
                        id: "description",
                        type: "textarea",
                        label: "Description",
                        value: benefit.description,
                        placeholder: "Describe this benefit"
                      }
                    ]}
                    onSave={(fields) => handleBenefitUpdate(index, fields)}
                    className="bg-transparent border-none p-0 shadow-none"
                  />
                </div>
                
                <div className={cn("relative", index % 2 === 1 && "lg:col-start-1")}>
                  <ImageInput
                    value={benefit.image || ""}
                    onChange={(value: string) => {
                      const items = [...data.benefits.items];
                      items[index] = { ...benefit, image: value };
                      handleUpdate("benefits.items", items);
                    }}
                    className="w-full h-64 rounded-xl overflow-hidden shadow-lg"
                    placeholder="Upload benefit image"
                    isEditing={isEditing}
                    uploadPath={`benefits.items.${index}.image`}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {isEditing && (
            <div className="flex justify-center mt-12">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const items = [...data.benefits.items, {
                    title: "New Benefit",
                    description: "Description of this benefit",
                    image: ""
                  }];
                  handleUpdate("benefits.items", items);
                }}
              >
                <Icons.plus className="h-4 w-4 mr-1" /> Add Benefit
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Real reviews from real customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="mb-4 flex justify-center">
                  <div className="flex gap-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
                
                <div className="mb-4 flex justify-center">
                  <ImageInput
                    value={testimonial.image || ""}
                    onChange={(value: string) => {
                      const testimonials = [...data.testimonials];
                      testimonials[index] = { ...testimonial, image: value };
                      handleUpdate("testimonials", testimonials);
                    }}
                    className="w-16 h-16 rounded-full overflow-hidden"
                    placeholder="Upload photo"
                    isEditing={isEditing}
                    uploadPath={`testimonials.${index}.image`}
                  />
                </div>
                
                <EditableCard
                  fields={[
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
                      placeholder: "Verified Customer"
                    },
                    {
                      id: "content",
                      type: "textarea",
                      label: "Review",
                      value: testimonial.content,
                      placeholder: "Share what this customer said"
                    },
                    {
                      id: "rating",
                      type: "text",
                      label: "Rating (1-5)",
                      value: testimonial.rating?.toString() || "5",
                      placeholder: "5"
                    }
                  ]}
                  onSave={(fields) => handleTestimonialUpdate(index, fields)}
                  className="bg-transparent border-none p-0 shadow-none"
                />
              </div>
            ))}
          </div>
          
          {isEditing && (
            <div className="flex justify-center mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const testimonials = [...data.testimonials, {
                    name: "New Customer",
                    role: "Verified Customer",
                    content: "Share what this customer said",
                    image: "",
                    rating: 5
                  }];
                  handleUpdate("testimonials", testimonials);
                }}
              >
                <Icons.plus className="h-4 w-4 mr-1" /> Add Review
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-8">
            <div>
              <InlineEditor
                type="text"
                value={data.pricing.title}
                onChange={(value: string) => handleUpdate("pricing.title", value)}
                placeholder="Get Your Product Today"
                previewClassName="text-3xl font-bold tracking-tight text-gray-900 mb-4"
              />
              
              <InlineEditor
                type="text"
                value={data.pricing.subtitle}
                onChange={(value: string) => handleUpdate("pricing.subtitle", value)}
                placeholder="Limited time offer - don't miss out!"
                previewClassName="text-xl text-gray-600"
              />
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto">
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <InlineEditor
                    type="text"
                    value={data.pricing.price}
                    onChange={(value: string) => handleUpdate("pricing.price", value)}
                    placeholder="$99"
                    previewClassName="text-4xl font-bold text-gray-900"
                  />
                  {data.pricing.originalPrice && (
                    <InlineEditor
                      type="text"
                      value={data.pricing.originalPrice}
                      onChange={(value: string) => handleUpdate("pricing.originalPrice", value)}
                      placeholder="$149"
                      previewClassName="text-xl text-gray-500 line-through"
                    />
                  )}
                </div>
                {isEditing && !data.pricing.originalPrice && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdate("pricing.originalPrice", "$149")}
                  >
                    Add Original Price
                  </Button>
                )}
              </div>
              
              <div className="space-y-3 mb-6">
                {data.pricing.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Icons.check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <InlineEditor
                      type="text"
                      value={feature}
                      onChange={(value: string) => handlePricingFeatureUpdate(index, value)}
                      placeholder={`Feature ${index + 1}`}
                      previewClassName="text-gray-700"
                    />
                    {isEditing && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const features = data.pricing.features.filter((_, i) => i !== index);
                          handleUpdate("pricing.features", features);
                        }}
                      >
                        <Icons.x className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
                
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      const features = [...data.pricing.features, "New Feature"];
                      handleUpdate("pricing.features", features);
                    }}
                  >
                    <Icons.plus className="h-4 w-4 mr-1" /> Add Feature
                  </Button>
                )}
              </div>
              
              <Button 
                style={primaryBgStyle}
                className="w-full text-white hover:opacity-90 py-3 text-lg font-semibold"
                size="lg"
              >
                <InlineEditor
                  type="text"
                  value={data.pricing.cta.text}
                  onChange={(value: string) => handleUpdate("pricing.cta.text", value)}
                  placeholder="Buy Now"
                  className="p-0 m-0"
                  previewClassName="font-semibold"
                />
              </Button>
              
              {data.pricing.guarantee && (
                <div className="mt-4 text-sm text-gray-600">
                  <InlineEditor
                    type="text"
                    value={data.pricing.guarantee}
                    onChange={(value: string) => handleUpdate("pricing.guarantee", value)}
                    placeholder="30-day money-back guarantee"
                    previewClassName="text-sm text-gray-600"
                  />
                </div>
              )}
              
              {isEditing && !data.pricing.guarantee && (
                <div className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdate("pricing.guarantee", "30-day money-back guarantee")}
                  >
                    Add Guarantee
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-6">
            <InlineEditor
              type="text"
              value={data.cta.title}
              onChange={(value: string) => handleUpdate("cta.title", value)}
              placeholder="Ready to Get Started?"
              previewClassName="text-3xl font-bold tracking-tight text-gray-900"
            />
            
            <InlineEditor
              type="text"
              value={data.cta.subtitle}
              onChange={(value: string) => handleUpdate("cta.subtitle", value)}
              placeholder="Join thousands of satisfied customers today"
              previewClassName="text-xl text-gray-600"
            />
            
            <div className="pt-4">
              <Button 
                style={primaryBgStyle}
                className="text-white hover:opacity-90 px-12 py-4 text-xl font-semibold"
                size="lg"
              >
                <InlineEditor
                  type="text"
                  value={data.cta.buttonText}
                  onChange={(value: string) => handleUpdate("cta.buttonText", value)}
                  placeholder="Order Now"
                  className="p-0 m-0"
                  previewClassName="font-semibold"
                />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <InlineEditor
                type="text"
                value={data.brand.name}
                onChange={(value: string) => handleUpdate("brand.name", value)}
                placeholder="Your Brand"
                previewClassName="text-xl font-semibold"
              />
              <div className="text-gray-400 mt-1 text-sm">
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