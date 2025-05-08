"use client"

import { Header } from "@/components/home/header"
import { HeroSection } from "@/components/home/hero-section"
import { TrustedBrandsSection } from "@/components/home/trusted-brands-section"
import { FeaturesSection } from "@/components/home/features-section"
import { TemplatesSection } from "@/components/home/templates-section"
import { MultiProductSection } from "@/components/home/multi-product-section"
import { CTASection } from "@/components/home/cta-section"
import { PricingSection } from "@/components/home/pricing-section"
import { ShowcaseExamplesSection } from "@/components/home/showcase-examples-section"
import { Footer } from "@/components/home/footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <TrustedBrandsSection />
        <FeaturesSection />
        <TemplatesSection />
        <MultiProductSection />
        <CTASection />
        <PricingSection />
        <ShowcaseExamplesSection />
      </main>
      <Footer />
    </div>
  )
}
