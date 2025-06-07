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
import { useTranslation } from "@/lib/i18n/server"
import Link from "next/link"
import { MessageSquare } from "lucide-react"

export default async function Home({params}: {params: Promise<{lng: string}>}) {
  const { lng } = await params;
  const { t } = await useTranslation(lng);
  
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
      
      {/* Chat Assistant Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Link 
          href={`/${lng}/chat`}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transition-all hover:shadow-xl"
        >
          <MessageSquare className="h-5 w-5" />
          <span>{t('home.hero.chatAssistant')}</span>
        </Link>
      </div>
    </div>
  )
}
