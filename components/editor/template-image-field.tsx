import { useCallback } from "react";
import { useTemplate } from "@/contexts/template-context";
import { ImageUpload } from "@/components/ui/image-upload";
import { FormItem, FormLabel } from "@/components/ui/form";
import { useImageUpload } from "@/hooks/use-image-upload";

interface TemplateImageFieldProps {
  label: string;
  path: string;
  userId: string;
}

export function TemplateImageField({
  label,
  path,
  userId,
}: TemplateImageFieldProps) {
  const { state, dispatch } = useTemplate();
  const { clearImage } = useImageUpload();

  // Get the current image URL from the template state using the provided path
  const getCurrentImageUrl = useCallback(() => {
    const keys = path.split(".");
    let current: any = state.templateData;
    
    for (let i = 0; i < keys.length; i++) {
      if (!current || !current[keys[i]]) return "";
      current = current[keys[i]];
    }
    
    return current || "";
  }, [state.templateData, path]);

  return (
    <FormItem className="space-y-2">
      <FormLabel>{label}</FormLabel>
      <ImageUpload
        currentImageUrl={getCurrentImageUrl()}
        onImageUploaded={(url) => {
          if (url) {
            dispatch({
              type: "UPDATE_FIELD",
              path,
              value: url,
            });
          } else {
            clearImage(path);
          }
        }}
        userId={userId}
        className="w-full"
      />
    </FormItem>
  );
} 