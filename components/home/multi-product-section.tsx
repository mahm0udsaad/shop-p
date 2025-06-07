"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n/client"

export function MultiProductSection() {
  const { t } = useTranslation()
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 animate-on-scroll">
            <div className="inline-block rounded-lg bg-[#ECB176]/20 px-3 py-1 text-sm text-[#6F4E37]">{t('multi_product.badge')}</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#6F4E37]">
              {t('multi_product.title')}
            </h2>
            <p className="max-w-[900px] text-[#A67B5B] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t('multi_product.subtitle')}
            </p>
          </div>
        </div>

        <motion.div
          className="mx-auto grid max-w-6xl items-center gap-12 py-12 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Multi-Product Template */}
          <motion.div
            variants={fadeIn}
            className="group relative overflow-hidden rounded-xl border bg-background shadow-lg transition-all hover:shadow-xl border-[#A67B5B]/20"
          >
            <div className="aspect-[3/4] w-full overflow-hidden">
              <Image
                src="/images/templates/multi-product-template-preview.png"
                width={600}
                height={800}
                alt="Multi-Product Template"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold">{t('multi_product.multi_product_template.title')}</h3>
                  <p className="text-white/80 text-sm">{t('multi_product.multi_product_template.description')}</p>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex flex-col gap-2">
                <Link href="/templates/preview/multi-product">
                  <Button variant="secondary" className="shadow-lg hover:scale-105 transition-transform">
                    {t('multi_product.live_preview')}
                  </Button>
                </Link>
                <Link href="/dashboard/new?template=multi-product">
                  <Button
                    variant="outline"
                    className="bg-background/20 text-white border-white/20 hover:bg-background/30 hover:scale-105 transition-transform"
                  >
                    {t('multi_product.use_template')}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Multi-Product Grid Template */}
          <motion.div
            variants={fadeIn}
            className="group relative overflow-hidden rounded-xl border bg-background shadow-lg transition-all hover:shadow-xl border-[#A67B5B]/20"
          >
            <div className="aspect-[3/4] w-full overflow-hidden">
              <Image
                src="/images/templates/multi-product-grid-template-preview.png"
                width={600}
                height={800}
                alt="Multi-Product Grid Template"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold">{t('multi_product.multi_product_grid.title')}</h3>
                  <p className="text-white/80 text-sm">{t('multi_product.multi_product_grid.description')}</p>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex flex-col gap-2">
                <Link href="/templates/preview/multi-product-grid">
                  <Button variant="secondary" className="shadow-lg hover:scale-105 transition-transform">
                    {t('multi_product.live_preview')}
                  </Button>
                </Link>
                <Link href="/dashboard/new?template=multi-product-grid">
                  <Button
                    variant="outline"
                    className="bg-background/20 text-white border-white/20 hover:bg-background/30 hover:scale-105 transition-transform"
                  >
                    {t('multi_product.use_template')}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Multi-Product Catalog Template */}
          <motion.div
            variants={fadeIn}
            className="group relative overflow-hidden rounded-xl border bg-background shadow-lg transition-all hover:shadow-xl border-[#A67B5B]/20"
          >
            <div className="aspect-[3/4] w-full overflow-hidden">
              <Image
                src="/images/templates/multi-product-catalog-template-preview.png"
                width={600}
                height={800}
                alt="Multi-Product Catalog Template"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold">{t('multi_product.multi_product_catalog.title')}</h3>
                  <p className="text-white/80 text-sm">{t('multi_product.multi_product_catalog.description')}</p>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex flex-col gap-2">
                <Link href="/templates/preview/multi-product-catalog">
                  <Button variant="secondary" className="shadow-lg hover:scale-105 transition-transform">
                    {t('multi_product.live_preview')}
                  </Button>
                </Link>
                <Link href="/dashboard/new?template=multi-product-catalog">
                  <Button
                    variant="outline"
                    className="bg-background/20 text-white border-white/20 hover:bg-background/30 hover:scale-105 transition-transform"
                  >
                    {t('multi_product.use_template')}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="text-center mt-8"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Link href="/templates">
            <Button
              size="lg"
              className="gap-1.5 shadow-lg bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37] hover:scale-105 transition-transform"
            >
              {t('multi_product.view_all_templates')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
