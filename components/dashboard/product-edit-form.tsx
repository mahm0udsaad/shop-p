"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ImageUploader } from "@/app/dashboard/new/components/image-uploader"
import { updateProduct } from "@/app/dashboard/products/actions"
import type { Database } from "@/lib/database.types"

type Product = Database["public"]["Tables"]["products"]["Row"]
type ProductImage = { url: string; path: string }

interface ProductEditFormProps {
  product: Product
  productImages: ProductImage[]
}

export function ProductEditForm({ product, productImages }: ProductEditFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description || "",
    price: product.price?.toString() || "",
    template: product.template,
    published: product.published,
  })
  const [images, setImages] = useState<ProductImage[]>(productImages)
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTemplateChange = (value: string) => {
    setFormData((prev) => ({ ...prev, template: value }))
  }

  const handlePublishedChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, published: checked }))
  }

  const handleImageUploaded = (imageUrl: string) => {
    // This function is called when a new image is uploaded
    // We don't need to update the images state here as it's handled in the ImageUploader component
    router.refresh()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formDataObj = new FormData()
      formDataObj.append("name", formData.name)
      formDataObj.append("description", formData.description)
      formDataObj.append("price", formData.price)
      formDataObj.append("template", formData.template)

      if (formData.published) {
        formDataObj.append("published", "true")
      }

      const result = await updateProduct(product.id, formDataObj)

      if (result.error) {
        throw new Error(result.error)
      }

      toast({
        title: "Product updated",
        description: "Your product has been updated successfully.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: "There was an error updating your product.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-[#FED8B1]/30">
          <TabsTrigger value="general" className="data-[state=active]:bg-white data-[state=active]:text-[#6F4E37]">
            General
          </TabsTrigger>
          <TabsTrigger value="images" className="data-[state=active]:bg-white data-[state=active]:text-[#6F4E37]">
            Images
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-[#6F4E37]">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>Basic information about your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Upload and manage product images</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploader productId={product.id} onImageUploaded={handleImageUploaded} existingImages={images} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template</CardTitle>
              <CardDescription>Choose a template for your product showcase</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={formData.template} onValueChange={handleTemplateChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="gallery">Gallery</SelectItem>
                  <SelectItem value="showcase">Showcase</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visibility</CardTitle>
              <CardDescription>Control whether your product is visible to the public</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch id="published" checked={formData.published} onCheckedChange={handlePublishedChange} />
                <Label htmlFor="published">{formData.published ? "Published" : "Draft"}</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex items-center justify-between">
        <Button type="button" variant="outline" asChild>
          <Link href={`/product/${product.slug}`} target="_blank">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Link>
        </Button>
        <Button type="submit" className="bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37]" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
