"use client"

import { Check, ChevronDown, ChevronUp, Quote, Star, Store } from "lucide-react"
import { useState, useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createOrder } from "@/app/actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/components/icons"
import { Sparkles } from "lucide-react"

interface ModernTemplateProps {
  data: {
    hero: {
      title: string;
      tagline: string;
      description: string;
      cta: {
        text: string;
        url: string;
      };
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
      }>;
    };
    testimonials: Array<{
      name: string;
      role: string;
      content: string;
      image?: string;
    }>;
    faq: {
      title: string;
      subtitle: string;
      items: Array<{
        question: string;
        answer: string;
      }>;
    };
    brand: {
      name: string;
      logo?: string;
    };
    theme: {
      primaryColor: string;
      secondaryColor: string;
    };
  };
  isEditing?: boolean;
  renderField?: (path: string, element: React.ReactNode) => React.ReactNode;
}

export function ModernTemplate({ data, isEditing, renderField }: ModernTemplateProps) {
  const primaryColor = data.theme?.primaryColor || "#6F4E37";
  const secondaryColor = data.theme?.secondaryColor || "#ECB176";

  const wrapField = (path: string, element: React.ReactNode) => {
    if (isEditing && renderField) {
      return renderField(path, element);
    }
    return element;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {wrapField("hero.title",
              <h1 className="text-4xl md:text-5xl font-bold leading-tight" style={{ color: primaryColor }}>
                  {data.hero.title}
              </h1>
              )}
              {wrapField("hero.tagline",
                <p className="text-xl text-gray-600">{data.hero.tagline}</p>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                {wrapField("hero.cta",
                <Button size="lg" style={{ backgroundColor: secondaryColor }} className="text-white">
                    <a href={data.hero.cta.url}>{data.hero.cta.text}</a>
                </Button>
                )}
                <Button size="lg" variant="outline" className="border-gray-300">
                  <a href="#features">Learn More</a>
                </Button>
              </div>
            </div>
            <div className="relative">
              {wrapField("hero.image",
                data.hero.image ? (
                  <img
                    src={data.hero.image}
                    alt="Hero"
                    className="w-full h-auto rounded-lg shadow-xl"
                />
              ) : (
                  <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icons.image className="h-12 w-12 text-gray-400" />
                </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center mb-12">
          {wrapField("whyChoose.title",
            <h2 className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>
              {data.whyChoose.title}
            </h2>
          )}
          {wrapField("whyChoose.subtitle",
            <p className="text-xl text-gray-600">{data.whyChoose.subtitle}</p>
          )}
          </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {data.whyChoose.benefits.map((benefit, index) => (
            wrapField(`whyChoose.benefits.${index}`,
              <div key={index} className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div
                  className="h-12 w-12 rounded-full mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${secondaryColor}20` }}
                >
                  <Check style={{ color: secondaryColor }} className="h-6 w-6" />
                </div>
                <p className="text-gray-600">{benefit}</p>
              </div>
            )
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center mb-12">
          {wrapField("features.title",
            <h2 className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>
              {data.features.title}
            </h2>
          )}
          {wrapField("features.subtitle",
            <p className="text-xl text-gray-600">{data.features.subtitle}</p>
          )}
                      </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {data.features.items.map((feature, index) => (
            wrapField(`features.items.${index}`,
              <div key={index} className="p-6 border rounded-lg">
                <div
                  className="h-12 w-12 rounded-full mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${secondaryColor}20` }}
                >
                  {feature.icon ? (
                    <img src={feature.icon} alt={feature.title} className="h-6 w-6" />
                  ) : (
                    <Sparkles style={{ color: secondaryColor }} className="h-6 w-6" />
                    )}
                  </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            )
            ))}
          </div>
      </section>

      {/* About/Product Detail Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {wrapField("about.image",
                data.about?.image ? (
                <img
                    src={data.about.image}
                    alt="About us"
                  className="w-full rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-full h-[300px] bg-gray-200 rounded-lg flex items-center justify-center">
                    <Icons.image className="h-12 w-12 text-gray-400" />
                </div>
                )
              )}
            </div>

            <div className="space-y-6">
              {wrapField("about.title",
              <h3 className="text-2xl font-bold" style={{ color: primaryColor }}>
                  {data.about?.title || "Designed for Performance"}
              </h3>
              )}
              
              {wrapField("about.description",
                <p className="text-gray-600">{data.about?.description || "Experience crystal-clear audio with our premium wireless headphones. Designed for comfort and performance, these headphones deliver exceptional sound quality for up to 30 hours on a single charge."}</p>
              )}

              <ul className="space-y-3">
                {(data.about?.features || []).map((feature, index) => (
                  wrapField(`about.features.${index}`,
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1">
                      <Check style={{ color: secondaryColor }} className="h-5 w-5" />
                    </div>
                    <span>{feature}</span>
                  </li>
                  )
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center mb-12">
          {wrapField("pricing.title",
            <h2 className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>
              {data.pricing.title}
            </h2>
          )}
          {wrapField("pricing.subtitle",
            <p className="text-xl text-gray-600">{data.pricing.subtitle}</p>
          )}
          </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {data.pricing.plans.map((plan, index) => (
            wrapField(`pricing.plans.${index}`,
              <div key={index} className="p-8 border rounded-lg bg-white">
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <div className="mb-6">
                  <span className="text-4xl font-bold">{data.pricing.currency}{plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                  </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    wrapField(`pricing.plans.${index}.features.${featureIndex}`,
                      <li key={featureIndex} className="flex items-center">
                        <Check className="h-5 w-5 mr-2 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    )
                    ))}
                  </ul>
                <Button className="w-full" style={{ backgroundColor: secondaryColor }}>
                  Choose {plan.name}
                  </Button>
              </div>
            )
            ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {data.testimonials.map((testimonial, index) => (
            wrapField(`testimonials.${index}`,
              <div key={index} className="p-6 border rounded-lg">
                <div className="flex items-center mb-4">
                  {testimonial.image ? (
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full mr-4"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-200 mr-4" />
                  )}
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.content}</p>
              </div>
            )
            ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            {wrapField("faq.title",
              <h2 className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>
                {data.faq.title}
              </h2>
            )}
            {wrapField("faq.subtitle",
              <p className="text-xl text-gray-600">{data.faq.subtitle}</p>
            )}
            </div>
          <div className="grid md:grid-cols-2 gap-8">
            {data.faq.items.map((item, index) => (
              wrapField(`faq.items.${index}`,
                <div key={index} className="p-6 border rounded-lg bg-white">
                  <h3 className="text-lg font-semibold mb-3">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          {wrapField("brand",
            <div className="flex items-center mb-4 md:mb-0">
              {data.brand.logo ? (
                <img
                  src={data.brand.logo}
                  alt={data.brand.name}
                  className="h-8 w-auto mr-2"
                />
              ) : (
                <Store className="h-8 w-8 mr-2" style={{ color: primaryColor }} />
              )}
              <span className="text-xl font-bold" style={{ color: primaryColor }}>
                {data.brand.name}
              </span>
            </div>
          )}
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-900">Terms</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Privacy</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
