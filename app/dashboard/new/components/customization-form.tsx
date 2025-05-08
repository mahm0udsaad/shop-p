"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

interface CustomizationFormProps {
  productData: any
  setProductData: (data: any) => void
  productType?: "single" | "multi"
  storeData?: any
  setStoreData?: (data: any) => void
}

export function CustomizationForm({
  productData,
  setProductData,
  productType = "single",
  storeData = {},
  setStoreData = () => {},
}: CustomizationFormProps) {
  const [activeTab, setActiveTab] = useState("colors")

  const handleColorChange = (color: string) => {
    if (productType === "single") {
      setProductData({
        ...productData,
        color,
      })
    } else {
      setStoreData({
        ...storeData,
        color,
      })
    }
  }

  const handleAccentColorChange = (accentColor: string) => {
    if (productType === "single") {
      setProductData({
        ...productData,
        accentColor,
      })
    } else {
      setStoreData({
        ...storeData,
        accentColor,
      })
    }
  }

  const colorOptions = [
    { name: "Brown", value: "#6F4E37" },
    { name: "Blue", value: "#1E40AF" },
    { name: "Green", value: "#15803D" },
    { name: "Red", value: "#B91C1C" },
    { name: "Purple", value: "#7E22CE" },
    { name: "Gray", value: "#4B5563" },
    { name: "Black", value: "#111827" },
  ]

  const accentColorOptions = [
    { name: "Light Brown", value: "#ECB176" },
    { name: "Light Blue", value: "#93C5FD" },
    { name: "Light Green", value: "#86EFAC" },
    { name: "Light Red", value: "#FCA5A5" },
    { name: "Light Purple", value: "#D8B4FE" },
    { name: "Light Gray", value: "#D1D5DB" },
    { name: "Gold", value: "#F59E0B" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-[#6F4E37]">
          Customize Your {productType === "single" ? "Product" : "Store"}
        </h2>
        <p className="text-gray-500">
          Personalize the appearance of your {productType === "single" ? "product page" : "store"} to match your brand.
        </p>
      </div>

      <Tabs defaultValue="colors" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-6 pt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mt-2">
                {colorOptions.map((color) => (
                  <div
                    key={color.value}
                    className={`aspect-square rounded-md cursor-pointer border-2 ${
                      (productType === "single" ? productData.color : storeData.color) === color.value
                        ? "border-black"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => handleColorChange(color.value)}
                  >
                    <span className="sr-only">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="accent-color">Accent Color</Label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mt-2">
                {accentColorOptions.map((color) => (
                  <div
                    key={color.value}
                    className={`aspect-square rounded-md cursor-pointer border-2 ${
                      (productType === "single" ? productData.accentColor : storeData.accentColor) === color.value
                        ? "border-black"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => handleAccentColorChange(color.value)}
                  >
                    <span className="sr-only">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="mt-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Preview</h3>
                    <p className="text-sm text-gray-500">See how your colors look together</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: productType === "single" ? productData.color : storeData.color }}
                    ></div>
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{
                        backgroundColor: productType === "single" ? productData.accentColor : storeData.accentColor,
                      }}
                    ></div>
                  </div>
                </div>
                <div
                  className="mt-4 p-4 rounded-md"
                  style={{ backgroundColor: productType === "single" ? productData.color : storeData.color }}
                >
                  <div className="text-white font-medium">Primary Color</div>
                </div>
                <div
                  className="mt-2 p-4 rounded-md"
                  style={{
                    backgroundColor: productType === "single" ? productData.accentColor : storeData.accentColor,
                  }}
                >
                  <div className="text-white font-medium">Accent Color</div>
                </div>
                <div className="mt-2 p-4 rounded-md bg-white border">
                  <div
                    className="font-medium"
                    style={{ color: productType === "single" ? productData.color : storeData.color }}
                  >
                    Text in Primary Color
                  </div>
                  <div
                    className="font-medium"
                    style={{ color: productType === "single" ? productData.accentColor : storeData.accentColor }}
                  >
                    Text in Accent Color
                  </div>
                  <div className="mt-2">
                    <button
                      className="px-4 py-2 rounded-md text-white"
                      style={{ backgroundColor: productType === "single" ? productData.color : storeData.color }}
                    >
                      Primary Button
                    </button>
                    <button
                      className="ml-2 px-4 py-2 rounded-md text-white"
                      style={{
                        backgroundColor: productType === "single" ? productData.accentColor : storeData.accentColor,
                      }}
                    >
                      Accent Button
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="typography" className="space-y-6 pt-4">
          <p className="text-gray-500">Typography customization will be available in a future update.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
