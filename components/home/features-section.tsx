"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import Image from "next/image"
import { useTranslation } from "@/lib/i18n/client"

export function FeaturesSection() {
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
    <section id="features" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 animate-on-scroll">
            <div className="inline-block rounded-lg bg-[#ECB176]/20 px-3 py-1 text-sm text-[#6F4E37]">{t('features.badge')}</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#6F4E37]">
              {t('features.title')}
            </h2>
            <p className="max-w-[900px] text-[#A67B5B] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t('features.subtitle')}
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
              width={600}
              height={600}
              alt="Dashboard Preview"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last shadow-lg"
            />
          </motion.div>
          <div className="flex flex-col justify-center space-y-4">
            <motion.ul
              className="grid gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.li variants={fadeIn}>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ECB176]/20">
                    <Check className="h-4 w-4 text-[#6F4E37]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-[#6F4E37]">{t('features.live_preview.title')}</h3>
                    <p className="text-[#A67B5B]">{t('features.live_preview.description')}</p>
                  </div>
                </div>
              </motion.li>
              <motion.li variants={fadeIn}>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ECB176]/20">
                    <Check className="h-4 w-4 text-[#6F4E37]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-[#6F4E37]">{t('features.mobile_optimization.title')}</h3>
                    <p className="text-[#A67B5B]">{t('features.mobile_optimization.description')}</p>
                  </div>
                </div>
              </motion.li>
              <motion.li variants={fadeIn}>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ECB176]/20">
                    <Check className="h-4 w-4 text-[#6F4E37]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-[#6F4E37]">{t('features.seo_optimization.title')}</h3>
                    <p className="text-[#A67B5B]">
                      {t('features.seo_optimization.description')}
                    </p>
                  </div>
                </div>
              </motion.li>
              <motion.li variants={fadeIn}>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ECB176]/20">
                    <Check className="h-4 w-4 text-[#6F4E37]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-[#6F4E37]">{t('features.analytics_dashboard.title')}</h3>
                    <p className="text-[#A67B5B]">{t('features.analytics_dashboard.description')}</p>
                  </div>
                </div>
              </motion.li>
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  )
}
