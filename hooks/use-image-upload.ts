import { useState, useCallback } from "react";
import { useTemplate } from "@/contexts/template-context";
import { uploadProductImage } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const { state, dispatch } = useTemplate();
  const { toast } = useToast();

  const uploadImage = useCallback(
    async (file: File, userId: string, path: string) => {
      if (!file) return;

      try {
        setIsUploading(true);
        const imageUrl = await uploadProductImage(file, userId);

        if (!imageUrl) {
          throw new Error("Failed to upload image");
        }

        // Update the template context with the new image URL
        dispatch({
          type: "UPDATE_FIELD",
          path,
          value: imageUrl,
        });

        toast({
          title: "Image uploaded",
          description: "Your image has been uploaded successfully",
        });

        return imageUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Upload failed",
          description: "There was a problem uploading your image",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [dispatch, toast]
  );

  const clearImage = useCallback(
    (path: string) => {
      dispatch({
        type: "UPDATE_FIELD",
        path,
        value: "",
      });
    },
    [dispatch]
  );

  return {
    isUploading,
    uploadImage,
    clearImage,
  };
} 