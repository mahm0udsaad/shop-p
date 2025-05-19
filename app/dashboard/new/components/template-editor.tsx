"use client";

import { useTemplate } from "@/contexts/template-context";
import { ModernTemplateInline } from "@/app/components/templates/modern-template-inline";

export function TemplateEditor() {
  const { state, dispatch } = useTemplate();

  const handleUpdate = (path: string, value: any) => {
    dispatch({ type: "UPDATE_FIELD", path, value });
  };

  return (
    <div className="w-full">
      <ModernTemplateInline 
        data={state.templateData} 
        isEditing={true}
        onUpdate={handleUpdate}
      />
    </div>
  );
} 