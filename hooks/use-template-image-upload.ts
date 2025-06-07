import { useState, useCallback } from "react";
import { useTemplate } from "@/contexts/template-context";
import { uploadImageToStorage } from "@/app/[lng]/dashboard/products/actions";

interface UploadState {
  isUploading: boolean;
  previewUrl: string | null;
  error: string | null;
}

export function useTemplateImageUpload() {
  const { dispatch } = useTemplate();
  const [uploadStates, setUploadStates] = useState<Record<string, UploadState>>({});

  const uploadImage = useCallback(
    async (file: File, path: string) => {
      if (!file) return null;

      try {
        // Set uploading state with preview
        const previewUrl = URL.createObjectURL(file);
        setUploadStates(prev => ({
          ...prev,
          [path]: {
            isUploading: true,
            previewUrl,
            error: null
          }
        }));

        // Update template with preview immediately for instant feedback
        dispatch({
          type: "UPDATE_FIELD",
          path,
          value: previewUrl,
        });

        // Upload to Supabase
        const formData = new FormData();
        formData.append("file", file);
        
        const result = await uploadImageToStorage(formData);

        if (result.error) {
          throw new Error(result.error);
        }

        if (result.success && result.url) {
          // Update template with final URL
          dispatch({
            type: "UPDATE_FIELD",
            path,
            value: result.url,
          });

          // Clear upload state
          setUploadStates(prev => ({
            ...prev,
            [path]: {
              isUploading: false,
              previewUrl: null,
              error: null
            }
          }));

          // Clean up preview URL
          URL.revokeObjectURL(previewUrl);

          return result.url;
        } else {
          throw new Error("Upload failed");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        
        // Set error state
        setUploadStates(prev => ({
          ...prev,
          [path]: {
            isUploading: false,
            previewUrl: null,
            error: error instanceof Error ? error.message : "Upload failed"
          }
        }));

        // Revert to empty value on error
        dispatch({
          type: "UPDATE_FIELD",
          path,
          value: "",
        });

        return null;
      }
    },
    [dispatch]
  );

  const clearImage = useCallback(
    (path: string) => {
      dispatch({
        type: "UPDATE_FIELD",
        path,
        value: "",
      });
      
      // Clear upload state
      setUploadStates(prev => ({
        ...prev,
        [path]: {
          isUploading: false,
          previewUrl: null,
          error: null
        }
      }));
    },
    [dispatch]
  );

  const getUploadState = useCallback(
    (path: string): UploadState => {
      return uploadStates[path] || {
        isUploading: false,
        previewUrl: null,
        error: null
      };
    },
    [uploadStates]
  );

  return {
    uploadImage,
    clearImage,
    getUploadState,
  };
} 