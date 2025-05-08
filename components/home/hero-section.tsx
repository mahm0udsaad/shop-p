"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function HeroSection() {
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
    <section className="w-full py-12 sm:py-24 l xl:py-48 bg-gradient-to-b from-background to-[#FED8B1]/20">
      <motion.div className="container px-4 md:px-6" initial="hidden" animate="visible" variants={fadeIn}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div className="flex flex-col items-center justify-center space-y-6" variants={fadeIn}>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl text-[#6F4E37]">
                Transform Products Into Sales Machines
              </h1>
              <p className="text-xl text-[#A67B5B] max-w-2xl mx-auto">
                Create professional product showcases with custom domains in minutes. Boost conversions with our proven
                templates. No coding needed.
              </p>
            </div>
            <motion.div
              className="flex flex-col gap-3 sm:flex-row justify-center"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeIn}>
                <Link href="/dashboard/new">
                  <Button
                    size="lg"
                    className="gap-1.5 shadow-lg bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37] hover:scale-105 transition-transform px-8"
                  >
                    Start Converting Today
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
            <div className="flex items-center gap-2 pt-6">
              <div className="flex items-center text-sm text-[#A67B5B] bg-white/50 px-4 py-2 rounded-full shadow-sm">
                <span className="font-medium">Join 500+ businesses boosting sales</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
