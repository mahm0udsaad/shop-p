"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icons } from "@/app/components/dashboard/icons";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface TemplateData {
  tagline: string;
  description: string;
  cta: {
    text: string;
    url: string;
  };
  features: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  benefits: Array<{
    title: string;
    description: string;
  }>;
  pricing: {
    price: number;
    currency: string;
    period?: string;
  };
  media: {
    images: string[];
    video?: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily?: string;
  };
  testimonials?: Array<{
    quote: string;
    name: string;
  }>;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
}

interface ModernTemplateProps {
  data: TemplateData;
  updateData: (path: string, value: any) => void;
  isEditing: boolean;
  alwaysShowEdit?: boolean;
  localImages?: (string | File)[];
  onImageChange?: (index: number, file: File) => void;
  onAddImage?: () => void;
  onRemoveImage?: (index: number) => void;
}

export function ModernTemplate({ data, updateData, isEditing, alwaysShowEdit = false, localImages, onImageChange, onAddImage, onRemoveImage }: ModernTemplateProps) {
  const showEdit = alwaysShowEdit || isEditing;
  const [activeCard, setActiveCard] = useState<{ type: 'feature' | 'benefit' | 'testimonial' | 'faq' | 'media', index: number } | null>(null);
  const [activeEdit, setActiveEdit] = useState<string | null>(null);
  
  // Create a wrapper for editable elements
  const EditableElement = ({
    path,
    value,
    onChange,
    children,
    multiline = false,
    className = "",
  }: {
    path: string;
    value: string;
    onChange: (path: string, value: string) => void;
    children: React.ReactNode;
    multiline?: boolean;
    className?: string;
  }) => {
    const isActive = activeEdit === path;
    const showEdit = alwaysShowEdit || isEditing;
    if (!showEdit) return <>{children}</>;
    
    return (
      <div
        className={cn(
          "relative group",
          isActive ? "ring-2 ring-offset-2 ring-primary" : "",
          className
        )}
        onClick={() => setActiveEdit(path)}
      >
        {isActive ? (
          multiline ? (
            <Textarea
              value={value}
              onChange={(e) => onChange(path, e.target.value)}
              className="min-h-[80px] p-2 w-full"
              autoFocus
              onBlur={() => setActiveEdit(null)}
            />
          ) : (
            <Input
              value={value}
              onChange={(e) => onChange(path, e.target.value)}
              className="p-2"
              autoFocus
              onBlur={() => setActiveEdit(null)}
            />
          )
        ) : (
          <>
            {children}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-0 right-0 opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                setActiveEdit(path);
              }}
            >
              <Icons.pencil className="h-3 w-3 mr-1" />
            </Button>
          </>
        )}
      </div>
    );
  };
  
  // Hero Section image logic
  // Use localImages if provided, else fallback to data.media.images
  const heroImage = localImages && localImages.length > 0 ? localImages[0] : (data.media.images && data.media.images[0]);

  // Media Gallery logic
  const galleryImages = localImages && localImages.length > 1 ? localImages.slice(1) : (data.media.images?.slice(1) || []);

  // Video logic
  const videoUrl = data.media.video || "";

  return (
    <div className="preview-container border rounded-lg overflow-hidden shadow-sm"
      style={{ 
        '--primary-color': data.theme.primaryColor,
        '--secondary-color': data.theme.secondaryColor
      } as any}
    >
      {/* Hero Section */}
      <section className="relative py-20 px-6 md:px-12 overflow-hidden bg-gradient-to-r"
        style={{ backgroundImage: `linear-gradient(to right, ${data.theme.primaryColor}22, ${data.theme.secondaryColor}33)` }}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap md:flex-nowrap items-center">
          <div className="w-full md:w-1/2 md:pr-12 mb-10 md:mb-0">
            <EditableElement
              path="tagline"
              value={data.tagline}
              onChange={updateData}
              className="mb-4"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: data.theme.primaryColor }}>
                {data.tagline}
              </h1>
            </EditableElement>
            
            <EditableElement
              path="description"
              value={data.description}
              onChange={updateData}
              multiline={true}
              className="mb-8"
            >
              <p className="text-lg leading-relaxed text-gray-700 mb-8">
                {data.description}
              </p>
            </EditableElement>
            
            <div className="flex items-center">
              <EditableElement
                path="pricing.price"
                value={data.pricing.price.toString()}
                onChange={(path, value) => updateData(path, Number(value))}
                className="mr-4"
              >
                <div className="text-3xl font-bold mr-2" style={{ color: data.theme.primaryColor }}>
                  {data.pricing.currency} {data.pricing.price}
                </div>
              </EditableElement>
              
              <EditableElement
                path="cta.text"
                value={data.cta?.text || ""}
                onChange={updateData}
              >
                <Button 
                  className="px-8 py-3 rounded-full text-white font-semibold"
                  style={{ backgroundColor: data.theme.primaryColor, borderColor: data.theme.primaryColor }}
                >
                  {data.cta?.text || "Buy Now"}
                </Button>
              </EditableElement>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 relative flex flex-col items-center">
            {heroImage && typeof heroImage === 'string' ? (
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={heroImage}
                  alt="Product showcase"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            ) : (
              <div className="bg-gray-200 rounded-lg h-[400px] w-full flex items-center justify-center">
                <span className="text-gray-500">No product image available</span>
              </div>
            )}
            {showEdit && (
              <div className="flex gap-2 mt-2">
                <label className="cursor-pointer flex items-center gap-2">
                  <Icons.upload className="h-5 w-5" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      if (e.target.files && e.target.files[0] && onImageChange) {
                        onImageChange(0, e.target.files[0]);
                      }
                    }}
                  />
                </label>
                {onRemoveImage && heroImage && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemoveImage(0)}
                  >
                    <Icons.trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: data.theme.primaryColor }}>
              Key Features
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              What makes our product special
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.features.map((feature, index) => {
              const isEditingCard = activeCard?.type === 'feature' && activeCard.index === index;
              return (
                <div key={index} className="p-6 rounded-lg border hover:shadow-md transition-shadow relative">
                  {isEditingCard ? (
                    <>
                      <Input
                        className="mb-2"
                        value={feature.title}
                        onChange={e => {
                          const newFeatures = [...data.features];
                          newFeatures[index].title = e.target.value;
                          updateData("features", newFeatures);
                        }}
                        placeholder="Feature Title"
                        autoFocus
                      />
                      <Textarea
                        className="mb-2"
                        value={feature.description}
                        onChange={e => {
                          const newFeatures = [...data.features];
                          newFeatures[index].description = e.target.value;
                          updateData("features", newFeatures);
                        }}
                        placeholder="Feature Description"
                        rows={3}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="secondary" onClick={() => setActiveCard(null)}>Done</Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const newFeatures = [...data.features];
                            newFeatures.splice(index, 1);
                            updateData("features", newFeatures);
                            setActiveCard(null);
                          }}
                        >
                          <Icons.trash className="h-4 w-4 mr-1" />Remove
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start mb-4">
                        <div 
                          className="rounded-full p-3 mr-4"
                          style={{ backgroundColor: `${data.theme.secondaryColor}33` }}
                        >
                          <Icons.check className="h-6 w-6" style={{ color: data.theme.primaryColor }} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold" style={{ color: data.theme.primaryColor }}>
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 ml-0 mt-2">
                            {feature.description}
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="ml-2 p-1 h-7 w-7"
                          onClick={() => setActiveCard({ type: 'feature', index })}
                        >
                          <Icons.pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
            {showEdit && (
              <div 
                className="p-6 rounded-lg border border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => {
                  const newFeatures = [...data.features, {
                    title: "New Feature",
                    description: "Description of the new feature"
                  }];
                  updateData("features", newFeatures);
                  setActiveCard({ type: 'feature', index: newFeatures.length - 1 });
                }}
              >
                <Icons.plus className="h-8 w-8 mb-2 text-gray-400" />
                <span className="text-gray-500">Add New Feature</span>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 px-6 md:px-12"
        style={{ backgroundColor: `${data.theme.primaryColor}0a` }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: data.theme.primaryColor }}>
              Benefits
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Why customers love our product
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.benefits.map((benefit, index) => {
              const isEditingCard = activeCard?.type === 'benefit' && activeCard.index === index;
              return (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm relative">
                  {isEditingCard ? (
                    <>
                      <Input
                        className="mb-2"
                        value={benefit.title}
                        onChange={e => {
                          const newBenefits = [...data.benefits];
                          newBenefits[index].title = e.target.value;
                          updateData("benefits", newBenefits);
                        }}
                        placeholder="Benefit Title"
                        autoFocus
                      />
                      <Textarea
                        className="mb-2"
                        value={benefit.description}
                        onChange={e => {
                          const newBenefits = [...data.benefits];
                          newBenefits[index].description = e.target.value;
                          updateData("benefits", newBenefits);
                        }}
                        placeholder="Benefit Description"
                        rows={3}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="secondary" onClick={() => setActiveCard(null)}>Done</Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const newBenefits = [...data.benefits];
                            newBenefits.splice(index, 1);
                            updateData("benefits", newBenefits);
                            setActiveCard(null);
                          }}
                        >
                          <Icons.trash className="h-4 w-4 mr-1" />Remove
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-3" style={{ color: data.theme.primaryColor }}>
                            {benefit.title}
                          </h3>
                          <p className="text-gray-600">
                            {benefit.description}
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="ml-2 p-1 h-7 w-7"
                          onClick={() => setActiveCard({ type: 'benefit', index })}
                        >
                          <Icons.pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
            {showEdit && (
              <div 
                className="p-6 rounded-lg border border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors bg-white"
                onClick={() => {
                  const newBenefits = [...data.benefits, {
                    title: "New Benefit",
                    description: "Description of the new benefit"
                  }];
                  updateData("benefits", newBenefits);
                  setActiveCard({ type: 'benefit', index: newBenefits.length - 1 });
                }}
              >
                <Icons.plus className="h-8 w-8 mb-2 text-gray-400" />
                <span className="text-gray-500">Add New Benefit</span>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Media Gallery Section */}
      <section className="py-12 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-4" style={{ color: data.theme.primaryColor }}>
            Media Gallery
          </h2>
          <div className="flex flex-wrap gap-4">
            {galleryImages.map((img, idx) => {
              const isEditingCard = activeCard?.type === 'media' && activeCard.index === idx;
              return (
                <div key={idx} className="relative border rounded-md p-2 flex flex-col items-center justify-center w-48 h-48 bg-gray-50">
                  {typeof img === 'string' ? (
                    <Image src={img} alt={`Gallery image ${idx + 1}`} width={180} height={180} className="object-cover rounded w-full h-full" />
                  ) : (
                    <span className="text-gray-400">Image Preview</span>
                  )}
                  {showEdit && (
                    <div className="absolute top-2 right-2 flex gap-1">
                      <label className="cursor-pointer">
                        <Icons.upload className="h-4 w-4" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => {
                            if (e.target.files && e.target.files[0] && onImageChange) {
                              onImageChange(idx + 1, e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onRemoveImage && onRemoveImage(idx + 1)}
                        className="p-1 h-6 w-6"
                      >
                        <Icons.trash className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
            {showEdit && (
              <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center text-muted-foreground w-48 h-48 cursor-pointer" onClick={onAddImage}>
                <Icons.plus className="h-8 w-8 mb-2" />
                <span>Add Image</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-12 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-4" style={{ color: data.theme.primaryColor }}>
            Product Video
          </h2>
          {showEdit ? (
            <div className="flex gap-2 items-center">
              <Input
                className="w-96"
                value={videoUrl}
                onChange={e => updateData("media.video", e.target.value)}
                placeholder="Paste video URL (YouTube, Vimeo, etc.)"
              />
              {videoUrl && (
                <Button size="icon" variant="ghost" onClick={() => updateData("media.video", "")}> <Icons.trash className="h-4 w-4" /> </Button>
              )}
            </div>
          ) : videoUrl ? (
            <div className="mt-4">
              <iframe src={videoUrl} title="Product Video" className="w-full h-64 rounded" allowFullScreen />
            </div>
          ) : null}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-4" style={{ color: data.theme.primaryColor }}>
            Testimonials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(data.testimonials || []).map((testimonial, idx) => {
              const isEditingCard = activeCard?.type === 'testimonial' && activeCard.index === idx;
              return (
                <div key={idx} className="border rounded-lg p-6 bg-white relative">
                  {isEditingCard ? (
                    <>
                      <Textarea
                        className="mb-2"
                        value={testimonial.quote}
                        onChange={e => {
                          const newTestimonials = [...data.testimonials];
                          newTestimonials[idx].quote = e.target.value;
                          updateData("testimonials", newTestimonials);
                        }}
                        placeholder="Testimonial Quote"
                        rows={3}
                      />
                      <Input
                        className="mb-2"
                        value={testimonial.name}
                        onChange={e => {
                          const newTestimonials = [...data.testimonials];
                          newTestimonials[idx].name = e.target.value;
                          updateData("testimonials", newTestimonials);
                        }}
                        placeholder="Author Name"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="secondary" onClick={() => setActiveCard(null)}>Done</Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const newTestimonials = [...data.testimonials];
                            newTestimonials.splice(idx, 1);
                            updateData("testimonials", newTestimonials);
                            setActiveCard(null);
                          }}
                        >
                          <Icons.trash className="h-4 w-4 mr-1" />Remove
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <blockquote className="italic text-gray-700 mb-2">"{testimonial.quote}"</blockquote>
                      <div className="font-semibold text-[#A67B5B]">- {testimonial.name}</div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 p-1 h-7 w-7"
                        onClick={() => setActiveCard({ type: 'testimonial', index: idx })}
                      >
                        <Icons.pencil className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              );
            })}
            {showEdit && (
              <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors bg-white" onClick={() => {
                const newTestimonials = [...(data.testimonials || []), { quote: "New testimonial", name: "Author" }];
                updateData("testimonials", newTestimonials);
                setActiveCard({ type: 'testimonial', index: newTestimonials.length - 1 });
              }}>
                <Icons.plus className="h-8 w-8 mb-2 text-gray-400" />
                <span className="text-gray-500">Add Testimonial</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-4" style={{ color: data.theme.primaryColor }}>
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(data.faq || []).map((faq, idx) => {
              const isEditingCard = activeCard?.type === 'faq' && activeCard.index === idx;
              return (
                <div key={idx} className="border rounded-lg p-6 bg-white relative">
                  {isEditingCard ? (
                    <>
                      <Input
                        className="mb-2"
                        value={faq.question}
                        onChange={e => {
                          const newFaq = [...data.faq];
                          newFaq[idx].question = e.target.value;
                          updateData("faq", newFaq);
                        }}
                        placeholder="Question"
                        autoFocus
                      />
                      <Textarea
                        className="mb-2"
                        value={faq.answer}
                        onChange={e => {
                          const newFaq = [...data.faq];
                          newFaq[idx].answer = e.target.value;
                          updateData("faq", newFaq);
                        }}
                        placeholder="Answer"
                        rows={3}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="secondary" onClick={() => setActiveCard(null)}>Done</Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const newFaq = [...data.faq];
                            newFaq.splice(idx, 1);
                            updateData("faq", newFaq);
                            setActiveCard(null);
                          }}
                        >
                          <Icons.trash className="h-4 w-4 mr-1" />Remove
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-semibold mb-2">Q: {faq.question}</div>
                      <div className="text-gray-700 mb-2">A: {faq.answer}</div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 p-1 h-7 w-7"
                        onClick={() => setActiveCard({ type: 'faq', index: idx })}
                      >
                        <Icons.pencil className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              );
            })}
            {showEdit && (
              <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors bg-white" onClick={() => {
                const newFaq = [...(data.faq || []), { question: "New question", answer: "Answer" }];
                updateData("faq", newFaq);
                setActiveCard({ type: 'faq', index: newFaq.length - 1 });
              }}>
                <Icons.plus className="h-8 w-8 mb-2 text-gray-400" />
                <span className="text-gray-500">Add FAQ</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 md:px-12 text-center"
        style={{ backgroundColor: data.theme.primaryColor }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Ready to Get Started?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Take advantage of this amazing product today.
          </p>
          <Button 
            className="px-8 py-3 rounded-full text-gray-800 font-semibold"
            style={{ backgroundColor: data.theme.secondaryColor }}
          >
            {data.cta?.text || "Buy Now"}
          </Button>
        </div>
      </section>
    </div>
  );
} 