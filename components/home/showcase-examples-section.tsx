"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function ShowcaseExamplesSection() {
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
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-block rounded-lg bg-[#ECB176]/20 px-3 py-1 text-sm text-[#6F4E37]">
              Showcase Examples
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#6F4E37]">
              Explore Stunning Product Showcases
            </h2>
            <p className="max-w-[900px] text-[#A67B5B] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Get inspired by these beautiful product showcases created by our users.
            </p>
          </motion.div>
        </div>
        <motion.div
          className="mx-auto mt-8 max-w-5xl"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <motion.div
              className="overflow-hidden rounded-lg shadow-lg"
              variants={fadeIn}
              whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
            >
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
                alt="E-commerce store"
                width={600}
                height={400}
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </motion.div>
            <motion.div
              className="overflow-hidden rounded-lg shadow-lg"
              variants={fadeIn}
              whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
            >
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d"
                alt="Product showcase"
                width={600}
                height={400}
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </motion.div>
            <motion.div
              className="overflow-hidden rounded-lg shadow-lg"
              variants={fadeIn}
              whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
            >
              <Image
                src="https://images.unsplash.com/photo-1607082349566-187342175e2f"
                alt="Online store"
                width={600}
                height={400}
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
