"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { X, Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { uploadProductImage, deleteProductImage } from "@/lib/supabase/storage"

interface ImageUploaderProps {
  productId: string
  onImageUploaded?: (imageUrl: string) => void
  existingImages?: Array<{ url: string; path: string }>
}

export function ImageUploader({ productId, onImageUploaded, existingImages = [] }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [images, setImages] = useState(existingImages)
  const [isDeletingMap, setIsDeletingMap] = useState<Record<string, boolean>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      const file = files[0]
      const { url, path } = await uploadProductImage(file, productId)

      setImages((prev) => [...prev, { url, path }])

      if (onImageUploaded) {
        onImageUploaded(url)
      }

      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully.",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDeleteImage = async (path: string) => {
    setIsDeletingMap((prev) => ({ ...prev, [path]: true }))

    try {
      const result = await deleteProductImage(path)

      if (result.success) {
        setImages((prev) => prev.filter((img) => img.path !== path))
        toast({
          title: "Image deleted",
          description: "Your image has been deleted successfully.",
        })
      } else {
        throw new Error(result.error || "Failed to delete image")
      }
    } catch (error) {
      console.error("Error deleting image:", error)
      toast({
        title: "Delete failed",
        description: "There was an error deleting your image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeletingMap((prev) => ({ ...prev, [path]: false }))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {images.map((image, index) => (
          <Card key={image.path || index} className="relative overflow-hidden w-32 h-32">
            <CardContent className="p-0">
              <Image
                src={image.url || "/placeholder.svg"}
                alt={`Product image ${index + 1}`}
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 rounded-full"
                onClick={() => handleDeleteImage(image.path)}
                disabled={isDeletingMap[image.path]}
              >
                {isDeletingMap[image.path] ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
              </Button>
            </CardContent>
          </Card>
        ))}

        <Card
          className={`relative overflow-hidden w-32 h-32 flex items-center justify-center border-dashed cursor-pointer ${
            isUploading ? "opacity-50" : ""
          }`}
          onClick={handleUploadClick}
        >
          <CardContent className="p-0 flex flex-col items-center justify-center h-full">
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-[#6F4E37]" />
            ) : (
              <>
                <Upload className="h-6 w-6 mb-2 text-[#6F4E37]" />
                <span className="text-xs text-center text-[#6F4E37]">Upload Image</span>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      <p className="text-sm text-muted-foreground">
        Upload product images. Recommended size: 1200x1200px. Max file size: 5MB.
      </p>
    </div>
  )
}
