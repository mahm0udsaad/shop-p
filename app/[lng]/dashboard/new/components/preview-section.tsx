"use client"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PreviewDevice } from "@/components/preview-device"
import { Monitor, Smartphone } from "lucide-react"
// Import the conversion function
import { convertFormToLandingPageData } from "@/utils/form-to-landing-page-data"

interface PreviewSectionProps {
  previewDevice: string
  setPreviewDevice: (device: string) => void
  productData: any
  selectedTemplate: string
  step: number
  productType?: "single" | "multi"
  multiProductsData?: any[]
  storeData?: any
}

export function PreviewSection({
  previewDevice,
  setPreviewDevice,
  productData,
  selectedTemplate,
  step,
  productType = "single",
  multiProductsData = [],
  storeData = {},
}: PreviewSectionProps) {
  // In the component, before rendering the template, convert the data
  const landingPageData = productType === "single" ? convertFormToLandingPageData(productData) : null

  return (
    <div className="space-y-4 sticky top-24">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Live Preview</h2>
        <Tabs value={previewDevice} onValueChange={setPreviewDevice} className="w-auto">
          <TabsList className="grid w-auto grid-cols-2">
            <TabsTrigger value="desktop" className="px-3 flex items-center gap-1">
              <Monitor className="h-4 w-4" />
              <span className="hidden sm:inline">Desktop</span>
            </TabsTrigger>
            <TabsTrigger value="mobile" className="px-3 flex items-center gap-1">
              <Smartphone className="h-4 w-4" />
              <span className="hidden sm:inline">Mobile</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg flex justify-center">
        <div className="w-full max-w-[800px]">
          <PreviewDevice
            deviceType={previewDevice === "mobile" ? "mobile" : "desktop"}
            templateType={selectedTemplate}
            // Then use landingPageData when rendering the template
            productData={landingPageData}
            productType={productType}
            multiProductsData={multiProductsData}
            storeData={storeData}
          />
        </div>
      </div>
    </div>
  )
}
