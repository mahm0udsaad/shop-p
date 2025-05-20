"use client"

import React from "react"
import { Check, Store, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Icons as BaseIcons } from "@/components/icons"
import { Sparkles } from "lucide-react"

// Extend the base Icons with the menu icon we need
const Icons = {
  ...BaseIcons,
  menu: Menu
}

interface ModernTemplateProps {
  landingPageData: {
    navbar: {
      logo?: string;
      title: string;
      links: Array<{
        text: string;
        url: string;
        isButton?: boolean;
      }>;
      sticky?: boolean;
      transparent?: boolean;
    };
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
      benefits: Array<string | { text: string; icon?: string }>;
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

export function ModernTemplate({ landingPageData, isEditing, renderField }: ModernTemplateProps) {
  const data = landingPageData
  // Make sure theme object exists and provide fallbacks for all properties
  const theme = data?.theme || {};
  const primaryColor = theme.primaryColor || "#6F4E37";
  const secondaryColor = theme.secondaryColor || "#ECB176";
  // Ensure all required objects exist
  const navbar = data?.navbar || { title: "Website", links: [] };
  const hero = data?.hero || { title: "Title", tagline: "Tagline", description: "Description", cta: { text: "Get Started", url: "#" } };
  const about = data?.about || { title: "About", description: "About us", features: [] };
  const features = data?.features || { title: "Features", subtitle: "Our Features", items: [] };
  const whyChoose = data?.whyChoose || { title: "Why Choose Us", subtitle: "Benefits", benefits: [] };
  const pricing = data?.pricing || { title: "Pricing", subtitle: "Our Plans", currency: "$", plans: [] };
  const faq = data?.faq || { title: "FAQ", subtitle: "Frequently Asked Questions", items: [] };
  const testimonials = data?.testimonials || [];
  const brand = data?.brand || { name: navbar.title };

  const wrapField = (path: string, element: React.ReactNode) => {
    if (isEditing && renderField) {
      return renderField(path, element);
    }
    return element;
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className={`w-full py-4 px-6 z-10 ${navbar.sticky ? 'sticky top-0' : ''} ${navbar.transparent ? 'bg-transparent' : 'bg-white shadow-sm'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            {wrapField("navbar.logo",
              navbar.logo ? (
                <img 
                  src={navbar.logo} 
                  alt="Logo" 
                  className="h-10 w-auto" 
                />
              ) : null
            )}
            {wrapField("navbar.title",
              <span className="text-xl font-bold" style={{ color: primaryColor }}>
                {navbar.title}
              </span>
            )}
          </div>

          <nav className="hidden md:flex items-center gap-4">
            {navbar.links.map((link, index) => (
              wrapField(`navbar.links.${index}`,
                <div key={index}>
                  {link.isButton ? (
                    <Button style={{ backgroundColor: secondaryColor }} className="text-white">
                      <a href={link.url}>{link.text}</a>
                    </Button>
                  ) : (
                    <a 
                      href={link.url} 
                      className="text-gray-700 hover:text-gray-900"
                    >
                      {link.text}
                    </a>
                  )}
                </div>
              )
            ))}
          </nav>

          {/* Mobile menu button - only for display purposes */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Icons.menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {wrapField("hero.title",
              <h1 className="text-4xl md:text-5xl font-bold leading-tight" style={{ color: primaryColor }}>
                  {hero.title}
              </h1>
              )}
              {wrapField("hero.tagline",
                <p className="text-xl text-gray-600">{hero.tagline}</p>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                {wrapField("hero.cta",
                <Button size="lg" style={{ backgroundColor: secondaryColor }} className="text-white">
                    <a href={hero.cta.url}>{hero.cta.text}</a>
                </Button>
                )}
                <Button size="lg" variant="outline" className="border-gray-300">
                  <a href="#features">Learn More</a>
                </Button>
              </div>
            </div>
            <div className="relative">
              {wrapField("hero.image",
                hero.image ? (
                  <img
                    src={hero.image}
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
              {whyChoose.title}
            </h2>
          )}
          {wrapField("whyChoose.subtitle",
            <p className="text-xl text-gray-600">{whyChoose.subtitle}</p>
          )}
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {whyChoose.benefits.map((benefit, index) => {
            const benefitText = typeof benefit === 'string' ? benefit : benefit.text;
            const benefitIcon = typeof benefit === 'string' ? null : benefit.icon;
            
            return wrapField(`whyChoose.benefits.${index}`,
              <div key={index} className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div
                  className="h-12 w-12 rounded-full mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${secondaryColor}20` }}
                >
                  {benefitIcon ? (
                    <div className="h-6 w-6 flex items-center justify-center">
                      {Icons[benefitIcon as keyof typeof Icons] ? 
                        React.createElement(Icons[benefitIcon as keyof typeof Icons], { 
                          style: { color: secondaryColor },
                          className: "h-6 w-6" 
                        }) :
                        <Check style={{ color: secondaryColor }} className="h-6 w-6" />
                      }
                    </div>
                  ) : (
                    <Check style={{ color: secondaryColor }} className="h-6 w-6" />
                  )}
                </div>
                <p className="text-gray-600">{benefitText}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center mb-12">
          {wrapField("features.title",
            <h2 className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>
              {features.title}
            </h2>
          )}
          {wrapField("features.subtitle",
            <p className="text-xl text-gray-600">{features.subtitle}</p>
          )}
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.items.map((feature, index) => (
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
                about.image ? (
                <img
                    src={about.image}
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
                  {about.title}
              </h3>
              )}
              
              {wrapField("about.description",
                <p className="text-gray-600">{about.description}</p>
              )}

              <ul className="space-y-3">
                {about.features.map((feature, index) => (
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
              {pricing.title}
            </h2>
          )}
          {wrapField("pricing.subtitle",
            <p className="text-xl text-gray-600">{pricing.subtitle}</p>
          )}
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricing.plans.map((plan, index) => (
            wrapField(`pricing.plans.${index}`,
              <div key={index} className="p-8 border rounded-lg bg-white">
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <div className="mb-6">
                  <span className="text-4xl font-bold">{pricing.currency}{plan.price}</span>
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
          {testimonials.map((testimonial, index) => (
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
                {faq.title}
              </h2>
            )}
            {wrapField("faq.subtitle",
              <p className="text-xl text-gray-600">{faq.subtitle}</p>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {faq.items.map((item, index) => (
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
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-8 w-auto mr-2"
                />
              ) : (
                <Store className="h-8 w-8 mr-2" style={{ color: primaryColor }} />
              )}
              <span className="text-xl font-bold" style={{ color: primaryColor }}>
                {brand.name}
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
