"use client"

import { ReactNode } from "react"
import { ProductFormProvider } from "@/contexts/product-form-context"
 
export default function NewProductLayout({ children }: { children: ReactNode }) {
  return <ProductFormProvider>{children}</ProductFormProvider>
} 