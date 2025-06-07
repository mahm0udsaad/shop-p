"use client"

import { motion } from "framer-motion"
import { CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { getCheckoutURL } from "@/app/actions"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "@/lib/i18n/client"

export function PricingSection() {
  const { t } = useTranslation()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  
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

  const handleCheckout = async (variantId: number) => {
    try {
      setLoading(true)
      const checkoutUrl = await getCheckoutURL(793602, true)
      console.log(checkoutUrl)
      if (checkoutUrl) {
        window.location.href = checkoutUrl
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error creating checkout. Please try again.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="256544324323436576" className="py-16">
      <div className="container px-4 md:px-6">
        <motion.h2
          className="mb-12 text-center text-3xl font-bold text-[#6F4E37]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {t('pricing.title')}
        </motion.h2>
        <motion.div
          className="grid gap-8 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Single Page Plan */}
          <motion.div
            variants={fadeIn}
            className="flex flex-col rounded-lg border bg-background/60 backdrop-blur-sm border-[#A67B5B]/20 p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-2"
          >
            <h3 className="text-xl font-bold text-[#6F4E37]">{t('pricing.single_page.title')}</h3>
            <div className="my-4 text-3xl font-bold text-[#6F4E37]">
              {t('pricing.single_page.price')}<span className="text-base font-normal text-[#A67B5B]">{t('pricing.single_page.period')}</span>
            </div>
            <p className="mb-6 text-[#A67B5B]">{t('pricing.single_page.description')}</p>
            <ul className="mb-6 space-y-2">
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">{t('pricing.single_page.features.product_page')}</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">{t('pricing.single_page.features.custom_domain')}</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">{t('pricing.single_page.features.basic_analytics')}</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">{t('pricing.single_page.features.email_support')}</span>
              </li>
            </ul>
            <Button 
              className="mt-auto bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37] hover:scale-105 transition-transform"
              onClick={() => handleCheckout(509289)}
              disabled={loading}
            >
              {loading ? t('pricing.loading') : t('pricing.get_started')}
            </Button>
          </motion.div>

          {/* Multiple Pages Plan */}
          <motion.div
            variants={fadeIn}
            className="flex flex-col rounded-lg border bg-background/60 backdrop-blur-sm border-[#A67B5B]/20 p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-2"
          >
            <h3 className="text-xl font-bold text-[#6F4E37]">{t('pricing.multiple_pages.title')}</h3>
            <div className="my-4 text-3xl font-bold text-[#6F4E37]">
              {t('pricing.multiple_pages.price')}<span className="text-base font-normal text-[#A67B5B]">{t('pricing.multiple_pages.period')}</span>
            </div>
            <p className="mb-6 text-[#A67B5B]">{t('pricing.multiple_pages.description')}</p>
            <ul className="mb-6 space-y-2">
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">{t('pricing.multiple_pages.features.product_pages')}</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">{t('pricing.multiple_pages.features.custom_domain')}</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">{t('pricing.multiple_pages.features.advanced_analytics')}</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">{t('pricing.multiple_pages.features.priority_support')}</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">{t('pricing.multiple_pages.features.seo_optimization')}</span>
              </li>
            </ul>
            <Button 
              className="mt-auto bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37] hover:scale-105 transition-transform"
              onClick={() => handleCheckout(499)}
              disabled={loading}
            >
              {loading ? t('pricing.loading') : t('pricing.get_started')}
            </Button>
          </motion.div>

          {/* Custom Plan */}
          <motion.div
            variants={fadeIn}
            className="flex flex-col rounded-lg border bg-background/60 backdrop-blur-sm border-[#A67B5B]/20 p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-2"
          >
            <h3 className="text-xl font-bold text-[#6F4E37]">{t('pricing.custom.title')}</h3>
            <div className="my-4 text-3xl font-bold text-[#6F4E37]">
              {t('pricing.custom.price')}<span className="text-base font-normal text-[#A67B5B]">{t('pricing.custom.period')}</span>
            </div>
            <p className="mb-6 text-[#A67B5B]">{t('pricing.custom.description')}</p>
            <ul className="mb-6 space-y-2">
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">{t('pricing.custom.features.unlimited_pages')}</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">{t('pricing.custom.features.custom_design')}</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">{t('pricing.custom.features.advanced_integrations')}</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">{t('pricing.custom.features.dedicated_support')}</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">{t('pricing.custom.features.custom_features')}</span>
              </li>
            </ul>
            <Button
              variant="secondary"
              className="mt-auto bg-[#A67B5B] text-[#6F4E37] hover:scale-105 transition-transform"
              onClick={() => router.push('/contact')}
            >
              {t('pricing.contact_us')}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
