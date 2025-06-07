"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n/client"

export function CTASection() {
  const { t } = useTranslation()
  
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-[#FED8B1]/20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#6F4E37]">
              {t('cta.title')}
            </h2>
            <p className="max-w-[600px] text-[#A67B5B] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t('cta.subtitle')}
            </p>
          </motion.div>
          <motion.div
            className="flex flex-col gap-2 min-[400px]:flex-row"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href="/dashboard/new">
              <Button
                size="lg"
                className="gap-1.5 shadow-lg bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37] hover:scale-105 transition-transform"
              >
                {t('cta.get_started')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#pricing">
              <Button
                size="lg"
                variant="outline"
                className="border-[#A67B5B] text-[#6F4E37] hover:scale-105 transition-transform"
              >
                {t('cta.view_pricing')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
