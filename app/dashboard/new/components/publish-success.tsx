"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, ExternalLink, Home } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface PublishSuccessProps {
  domain: string
  productType: "single" | "multi"
}

export function PublishSuccess({ domain, productType }: PublishSuccessProps) {
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto text-center"
      >
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: "50%",
                  y: "0%",
                  scale: 0,
                }}
                animate={{
                  x: `${Math.random() * 100 - 50}%`,
                  y: `${Math.random() * 100}%`,
                  scale: Math.random() * 0.8 + 0.2,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  ease: "easeOut",
                  delay: Math.random() * 0.2,
                }}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ["#ECB176", "#6F4E37", "#FED8B1", "#A67B5B"][Math.floor(Math.random() * 4)],
                }}
              />
            ))}
          </div>
        )}

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center"
        >
          <Check className="h-10 w-10 text-green-600" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-800 mb-2"
        >
          Published Successfully!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-6"
        >
          Your {productType === "single" ? "product" : "store"} is now live at:
          <br />
          <span className="font-semibold text-[#6F4E37]">{domain}.productshowcase.com</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button asChild className="bg-[#6F4E37] hover:bg-[#5D3D26] flex items-center gap-2">
            <Link href={`/product/${domain}`} target="_blank">
              <ExternalLink className="h-4 w-4" />
              View Website
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-[#ECB176] text-[#6F4E37] hover:bg-[#FED8B1]/20">
            <Link href="/dashboard">
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
