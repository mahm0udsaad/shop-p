"use client"
import { Plus, ChevronDown, ChevronUp, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUploader } from "./image-uploader"
import { AiTextGenerator } from "./ai-text-generator"

interface Product {
  id: string
  name: string
  description: string
  price: string
  category: string
  features: string
  images: any[]
  isExpanded: boolean
}

interface MultiProductManagerProps {
  products: Product[]
  setProducts: (products: Product[]) => void
  setProductData: (data: any) => void
  productData: any
}

export function MultiProductManager({ products, setProducts, setProductData, productData }: MultiProductManagerProps) {
  const addNewProduct = () => {
    const newProduct = {
      id: `product-${Date.now()}`,
      name: "",
      description: "",
      price: "",
      category: "electronics",
      features: "",
      images: [],
      isExpanded: true,
    }

    const updatedProducts = [...products, newProduct]
    setProducts(updatedProducts)
    setProductData({
      ...productData,
      products: updatedProducts,
    })
  }

  const removeProduct = (id: string) => {
    const updatedProducts = products.filter((product) => product.id !== id)
    setProducts(updatedProducts)
    setProductData({
      ...productData,
      products: updatedProducts,
    })
  }

  const toggleProductExpansion = (id: string) => {
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        return { ...product, isExpanded: !product.isExpanded }
      }
      return product
    })
    setProducts(updatedProducts)
    setProductData({
      ...productData,
      products: updatedProducts,
    })
  }

  const updateProduct = (id: string, field: string, value: any) => {
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        return { ...product, [field]: value }
      }
      return product
    })
    setProducts(updatedProducts)
    setProductData({
      ...productData,
      products: updatedProducts,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-[#6F4E37]">Products</h3>
        <Button type="button" onClick={addNewProduct} className="bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37]">
          <Plus className="h-4 w-4 mr-1" /> Add Product
        </Button>
      </div>

      {products.length === 0 && (
        <Card className="border-dashed border-2 border-[#A67B5B]/30">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-[#6F4E37] mb-4">No products added yet</p>
            <Button type="button" onClick={addNewProduct} className="bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37]">
              <Plus className="h-4 w-4 mr-1" /> Add Your First Product
            </Button>
          </CardContent>
        </Card>
      )}

      {products.map((product, index) => (
        <Card key={product.id} className="border-[#A67B5B]/30">
          <div
            className="flex justify-between items-center p-4 cursor-pointer border-b border-[#A67B5B]/10"
            onClick={() => toggleProductExpansion(product.id)}
          >
            <div className="flex items-center">
              <span className="font-medium text-[#6F4E37]">
                Product {index + 1}: {product.name || "Unnamed Product"}
              </span>
              {product.price && <span className="ml-2 text-sm text-[#6F4E37]/70">(${product.price})</span>}
            </div>
            <div className="flex items-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  removeProduct(product.id)
                }}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 mr-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              {product.isExpanded ? (
                <ChevronUp className="h-5 w-5 text-[#6F4E37]" />
              ) : (
                <ChevronDown className="h-5 w-5 text-[#6F4E37]" />
              )}
            </div>
          </div>

          {product.isExpanded && (
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`product-name-${product.id}`} className="text-[#6F4E37]">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`product-name-${product.id}`}
                    value={product.name}
                    onChange={(e) => updateProduct(product.id, "name", e.target.value)}
                    className="bg-white border-[#A67B5B]/30"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor={`product-price-${product.id}`} className="text-[#6F4E37]">
                    Price <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`product-price-${product.id}`}
                    value={product.price}
                    onChange={(e) => updateProduct(product.id, "price", e.target.value)}
                    className="bg-white border-[#A67B5B]/30"
                    placeholder="Enter price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`product-category-${product.id}`} className="text-[#6F4E37]">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={product.category}
                  onValueChange={(value) => updateProduct(product.id, "category", value)}
                >
                  <SelectTrigger className="bg-white border-[#A67B5B]/30">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="home">Home & Kitchen</SelectItem>
                    <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                    <SelectItem value="sports">Sports & Outdoors</SelectItem>
                    <SelectItem value="toys">Toys & Games</SelectItem>
                    <SelectItem value="books">Books & Media</SelectItem>
                    <SelectItem value="health">Health & Wellness</SelectItem>
                    <SelectItem value="jewelry">Jewelry & Accessories</SelectItem>
                    <SelectItem value="food">Food & Beverages</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <AiTextGenerator
                fieldId={`product-description-${product.id}`}
                fieldLabel="Product Description"
                placeholder="Enter product description"
                currentValue={product.description}
                onValueChange={(value) => updateProduct(product.id, "description", value)}
                contextData={{
                  name: product.name,
                  category: product.category,
                  price: product.price,
                }}
                promptTemplate="Write a compelling product description for {name} in the {category} category"
              />

              <AiTextGenerator
                fieldId={`product-features-${product.id}`}
                fieldLabel="Key Features"
                placeholder="Enter key features (one per line)"
                currentValue={product.features}
                onValueChange={(value) => updateProduct(product.id, "features", value)}
                contextData={{
                  name: product.name,
                  category: product.category,
                }}
                promptTemplate="List key features for {name} in the {category} category"
              />

              <div>
                <Label className="text-[#6F4E37]">
                  Product Images <span className="text-red-500">*</span>
                </Label>
                <ImageUploader
                  images={product.images}
                  setImages={(images) => updateProduct(product.id, "images", images)}
                  maxImages={5}
                />
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      {products.length > 0 && (
        <Button
          type="button"
          onClick={addNewProduct}
          variant="outline"
          className="w-full border-dashed border-2 border-[#A67B5B]/30 text-[#6F4E37]"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Another Product
        </Button>
      )}
    </div>
  )
}
