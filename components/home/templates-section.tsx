"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n/client"

export function TemplatesSection() {
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
    <section id="templates" className="w-full py-12 md:py-24 lg:py-32 bg-[#FED8B1]/20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 animate-on-scroll">
            <div className="inline-block rounded-lg bg-[#ECB176]/20 px-3 py-1 text-sm text-[#6F4E37]">
              {t('templates.badge')}
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#6F4E37]">
              {t('templates.title')}
            </h2>
            <p className="max-w-[900px] text-[#A67B5B] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t('templates.subtitle')}
            </p>
          </div>
        </div>

        <motion.div
          className="mx-auto grid max-w-6xl gap-8 py-12 md:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Modern Template */}
          <motion.div
            variants={fadeIn}
            className="group relative overflow-hidden rounded-xl border bg-background shadow-lg transition-all hover:shadow-xl border-[#A67B5B]/20"
          >
            <div className="aspect-[3/4] w-full overflow-hidden">
              <Image
                src="/images/templates/modern-template-preview.png"
                width={600}
                height={800}
                alt="Modern Template"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold">{t('templates.modern.title')}</h3>
                  <p className="text-white/80 text-sm">{t('templates.modern.description')}</p>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex flex-col gap-2">
                <Link href="/templates/preview/modern">
                  <Button variant="secondary" className="shadow-lg hover:scale-105 transition-transform">
                    {t('templates.live_preview')}
                  </Button>
                </Link>
                <Link href="/dashboard/new?template=modern">
                  <Button
                    variant="outline"
                    className="bg-background/20 text-white border-white/20 hover:bg-background/30 hover:scale-105 transition-transform"
                  >
                    {t('templates.use_template')}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Gallery Template */}
          <motion.div
            variants={fadeIn}
            className="group relative overflow-hidden rounded-xl border bg-background shadow-lg transition-all hover:shadow-xl border-[#A67B5B]/20"
          >
            <div className="aspect-[3/4] w-full overflow-hidden">
              <Image
                src="/images/templates/gallery-template-preview.png"
                width={600}
                height={800}
                alt="Gallery Template"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold">{t('templates.gallery.title')}</h3>
                  <p className="text-white/80 text-sm">{t('templates.gallery.description')}</p>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex flex-col gap-2">
                <Link href="/templates/preview/gallery">
                  <Button variant="secondary" className="shadow-lg hover:scale-105 transition-transform">
                    {t('templates.live_preview')}
                  </Button>
                </Link>
                <Link href="/dashboard/new?template=gallery">
                  <Button
                    variant="outline"
                    className="bg-background/20 text-white border-white/20 hover:bg-background/30 hover:scale-105 transition-transform"
                  >
                    {t('templates.use_template')}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Minimal Template */}
          <motion.div
            variants={fadeIn}
            className="group relative overflow-hidden rounded-xl border bg-background shadow-lg transition-all hover:shadow-xl border-[#A67B5B]/20"
          >
            <div className="aspect-[3/4] w-full overflow-hidden">
              <Image
                src="/images/templates/minimal-template-preview.png"
                width={600}
                height={800}
                alt="Minimal Template"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold">{t('templates.minimal.title')}</h3>
                  <p className="text-white/80 text-sm">{t('templates.minimal.description')}</p>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex flex-col gap-2">
                <Link href="/templates/preview/minimal">
                  <Button variant="secondary" className="shadow-lg hover:scale-105 transition-transform">
                    {t('templates.live_preview')}
                  </Button>
                </Link>
                <Link href="/dashboard/new?template=minimal">
                  <Button
                    variant="outline"
                    className="bg-background/20 text-white border-white/20 hover:bg-background/30 hover:scale-105 transition-transform"
                  >
                    {t('templates.use_template')}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
