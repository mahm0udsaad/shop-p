"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Icons } from "@/app/components/dashboard/icons";
import { SectionProps } from "../types";
import { uploadProductImage } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";
import { TemplateImageField } from "../template-image-field";
import { Loader2 } from "lucide-react";

export function MediaSection({ data, updateData }: SectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // We'll hardcode the user ID for this example - in a real app, you would get this from auth
  const userId = "template-user";

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Upload to Supabase instead of using FileReader
      const imageUrl = await uploadProductImage(file, userId);
      
      if (imageUrl) {
        const images = [...(data.media?.images || [])];
        images.push(imageUrl);
        updateData("media.images", images);
        
        toast({
          title: "Image uploaded",
          description: "Your image has been uploaded to Supabase storage",
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
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const images = [...(data.media?.images || [])];
    images.splice(index, 1);
    updateData("media.images", images);
  };

  // Initialize media if it doesn't exist
  if (!data.media) {
    data.media = { images: [] };
  }

  return (
    <div className="space-y-6">
      <h3 className="font-semibold">Media Gallery</h3>
      
      {/* Component for direct uploads to the hero section */}
      <div className="space-y-4 border-b pb-4">
        <h4 className="text-sm font-medium">Hero Image</h4>
        <TemplateImageField
          label="Hero Image"
          path="hero.image"
          userId={userId}
        />
      </div>
      
      {/* Component for direct uploads to the logo */}
      <div className="space-y-4 border-b pb-4">
        <h4 className="text-sm font-medium">Brand Logo</h4>
        <TemplateImageField
          label="Logo"
          path="navbar.logo"
          userId={userId}
        />
      </div>
      
      {/* Media Gallery */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Media Gallery</h4>
        <div className="space-y-2">
          <Label>Add Image to Gallery</Label>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleAddImage}
              disabled={isUploading}
            />
            {isUploading && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {(data.media.images || []).map((image, index) => (
            <div key={index} className="relative group">
              <img 
                src={image} 
                alt={`Image ${index + 1}`} 
                className="w-full h-32 object-cover rounded"
              />
              <Button
                onClick={() => handleRemoveImage(index)}
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Icons.trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {(data.media.images || []).length === 0 && (
            <div className="col-span-2 p-4 border border-dashed rounded-md text-center text-muted-foreground">
              No images in the gallery yet
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Video URL (YouTube or Vimeo)</Label>
        <Input
          value={data.media?.video || ''}
          onChange={e => updateData("media.video", e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>
    </div>
  );
} 