"use client";

import { useTemplate } from "@/contexts/template-context";
import { ModernTemplateInline } from "@/app/components/templates/modern-template-inline";
import { MinimalTemplateInline } from "@/app/components/templates/minimal-template-inline";

interface TemplateEditorProps {
  initialTemplate?: string;
  isEditMode?: boolean;
}

export function TemplateEditor({ initialTemplate = "modern", isEditMode = false }: TemplateEditorProps) {
  const { state, dispatch } = useTemplate();

  const handleUpdate = (path: string, value: any) => {
    dispatch({ type: "UPDATE_FIELD", path, value });
  };

  return (
    <div className="w-full">
      {initialTemplate === "modern" && (
        <ModernTemplateInline 
          data={state.templateData} 
          isEditing={true}
          onUpdate={handleUpdate}
        />
      )}
      {initialTemplate === "minimal" && (
        <MinimalTemplateInline 
          data={state.templateData} 
          isEditing={true}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
} 