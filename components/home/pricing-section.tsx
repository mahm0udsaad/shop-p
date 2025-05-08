"use client"

import { motion } from "framer-motion"
import { CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { getCheckoutURL } from "@/app/actions"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export function PricingSection() {
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
    <section id="pricing" className="py-16">
      <div className="container px-4 md:px-6">
        <motion.h2
          className="mb-12 text-center text-3xl font-bold text-[#6F4E37]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Pricing Plans
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
            <h3 className="text-xl font-bold text-[#6F4E37]">Single Page</h3>
            <div className="my-4 text-3xl font-bold text-[#6F4E37]">
              $49<span className="text-base font-normal text-[#A67B5B]">/month</span>
            </div>
            <p className="mb-6 text-[#A67B5B]">Perfect for showcasing a single product with all its details.</p>
            <ul className="mb-6 space-y-2">
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">1 product page</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">Custom domain</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">Basic analytics</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">Email support</span>
              </li>
            </ul>
            <Button 
              className="mt-auto bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37] hover:scale-105 transition-transform"
              onClick={() => handleCheckout(509289)}
              disabled={loading}
            >
              {loading ? "Loading..." : "Get Started"}
            </Button>
          </motion.div>

          {/* Multiple Pages Plan */}
          <motion.div
            variants={fadeIn}
            className="flex flex-col rounded-lg border bg-background/60 backdrop-blur-sm border-[#A67B5B]/20 p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-2"
          >
            <h3 className="text-xl font-bold text-[#6F4E37]">Multiple Pages</h3>
            <div className="my-4 text-3xl font-bold text-[#6F4E37]">
              $99<span className="text-base font-normal text-[#A67B5B]">/month</span>
            </div>
            <p className="mb-6 text-[#A67B5B]">Ideal for businesses with multiple products or product categories.</p>
            <ul className="mb-6 space-y-2">
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">Up to 10 product pages</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">Custom domain</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">Advanced analytics</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">Priority support</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">SEO optimization</span>
              </li>
            </ul>
            <Button 
              className="mt-auto bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37] hover:scale-105 transition-transform"
              onClick={() => handleCheckout(499)}
              disabled={loading}
            >
              {loading ? "Loading..." : "Get Started"}
            </Button>
          </motion.div>

          {/* Custom Plan */}
          <motion.div
            variants={fadeIn}
            className="flex flex-col rounded-lg border bg-background/60 backdrop-blur-sm border-[#A67B5B]/20 p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-2"
          >
            <h3 className="text-xl font-bold text-[#6F4E37]">Custom</h3>
            <div className="my-4 text-3xl font-bold text-[#6F4E37]">
              Custom<span className="text-base font-normal text-[#A67B5B]">/project</span>
            </div>
            <p className="mb-6 text-[#A67B5B]">Tailored solutions for businesses with specific requirements.</p>
            <ul className="mb-6 space-y-2">
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">Unlimited product pages</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">Custom design & development</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">Advanced integrations</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">Dedicated support team</span>
              </li>
              <li className="flex items-center">
                <CheckIcon className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-[#A67B5B]">Custom features</span>
              </li>
            </ul>
            <Button
              variant="secondary"
              className="mt-auto bg-[#A67B5B] text-[#6F4E37] hover:scale-105 transition-transform"
              onClick={() => router.push('/contact')}
            >
              Contact Us
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
