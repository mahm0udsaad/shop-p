import React, { useState } from "react";
import { Button } from "./button";
import { uploadProductImage } from "@/lib/supabase";
import { useToast } from "./use-toast";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  currentImageUrl: string;
  onImageUploaded: (url: string) => void;
  userId: string;
  className?: string;
}

export function ImageUpload({
  currentImageUrl,
  onImageUploaded,
  userId,
  className = "",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Upload to Supabase
      const imageUrl = await uploadProductImage(file, userId);
      
      if (imageUrl) {
        onImageUploaded(imageUrl);
        toast({
          title: "Image uploaded",
          description: "Your image has been uploaded successfully",
        });
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your image",
        variant: "destructive",
      });
      // Reset preview if upload failed
      setPreviewUrl(currentImageUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setPreviewUrl(null);
    onImageUploaded("");
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {previewUrl ? (
        <div className="relative w-full">
          <div className="relative aspect-video w-full overflow-hidden rounded-md border border-border">
            <Image
              src={previewUrl}
              alt="Image preview"
              fill
              className="object-cover"
            />
          </div>
          <Button
            size="icon"
            variant="destructive"
            className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label
          htmlFor="image-upload"
          className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/20 transition-colors hover:bg-muted/30"
        >
          <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">Click to upload an image</p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, GIF up to 5MB
            </p>
          </div>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </label>
      )}
      
      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}
    </div>
  );
} 