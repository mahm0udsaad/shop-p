"use client";

import { ModernTemplateEditor } from "@/components/editor/ModernTemplateEditor";
import { TemplateData } from "@/components/editor/types";

interface ModernTemplateEditorWrapperProps {
  data: TemplateData;
  updateData: (path: string, value: any) => void;
}

// This is a wrapper component that passes the props to our modular editor
export default function ModernTemplateEditorWrapper({ data, updateData }: ModernTemplateEditorWrapperProps) {
  return <ModernTemplateEditor data={data} updateData={updateData} />;
} 