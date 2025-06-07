"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Icons } from "@/app/components/dashboard/icons";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "./color-picker";
import ModernTemplate from "./templates/modern-template-editor";
import { Input } from "@/components/ui/input";
import { updateProductTemplateData } from "@/app/[lng]/dashboard/products/actions";
import { TemplateData } from "@/components/editor/types";

// Types for template data - using imported TemplateData type
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  template: string;
  template_data?: TemplateData;
  media?: {
    images?: string[];
    video?: string;
  };
  domains?: Array<{
    subdomain: string;
    is_active: boolean;
  }>;
  published: boolean;
  featured: boolean;
}

interface ProductTemplateEditorProps {
  product: Product;
}

const PLACEHOLDER_IMAGE = "/placeholder.svg?height=400&width=600";

// --- FooterEditor Component ---
function FooterEditor({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  // Simple parser: split by links and text
  // Example: '© 2023 Product Showcase. All rights reserved. | [Terms](#) | [Privacy](#) | [Contact](#)'
  // Will render text and links separately
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  // Parse links: [text](url)
  const parts = [] as { type: 'text' | 'link', value: string, url?: string }[];
  let remaining = value;
  while (remaining.length > 0) {
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^\)]+)\)/);
    if (linkMatch && linkMatch.index !== undefined) {
      if (linkMatch.index > 0) {
        parts.push({ type: 'text', value: remaining.slice(0, linkMatch.index) });
      }
      parts.push({ type: 'link', value: linkMatch[1], url: linkMatch[2] });
      remaining = remaining.slice(linkMatch.index + linkMatch[0].length);
    } else {
      parts.push({ type: 'text', value: remaining });
      break;
    }
  }

  // Handle save
  const handleSave = (idx: number) => {
    const newParts = [...parts];
    if (newParts[idx].type === 'link') {
      // editValue format: text|url
      const [text, url] = editValue.split('|');
      newParts[idx] = { type: 'link', value: text || '', url: url || '#' };
    } else {
      newParts[idx] = { type: 'text', value: editValue };
    }
    // Rebuild footer string
    const newFooter = newParts.map(p => p.type === 'link' ? `[${p.value}](${p.url})` : p.value).join('');
    onChange(newFooter);
    setEditingIndex(null);
  };

  return (
    <footer className="border-t py-6 md:py-0 flex flex-wrap gap-2 items-center">
      {parts.map((part, idx) => (
        <span key={idx} className="relative group flex items-center">
          {editingIndex === idx ? (
            part.type === 'link' ? (
              <>
                <Input
                  className="w-32 mr-1"
                  value={editValue.split('|')[0] || ''}
                  onChange={e => setEditValue(e.target.value + '|' + (editValue.split('|')[1] || ''))}
                  placeholder="Link text"
                  autoFocus
                  onBlur={() => handleSave(idx)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSave(idx); }}
                />
                <Input
                  className="w-32"
                  value={editValue.split('|')[1] || ''}
                  onChange={e => setEditValue((editValue.split('|')[0] || '') + '|' + e.target.value)}
                  placeholder="URL"
                  onBlur={() => handleSave(idx)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSave(idx); }}
                />
              </>
            ) : (
              <Input
                className="w-48"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                autoFocus
                onBlur={() => handleSave(idx)}
                onKeyDown={e => { if (e.key === 'Enter') handleSave(idx); }}
              />
            )
          ) : (
            part.type === 'link' ? (
              <a href={part.url} className="text-sm font-medium text-[#A67B5B] hover:text-[#6F4E37] transition-colors mr-1">
                {part.value}
              </a>
            ) : (
              <span className="text-sm text-[#A67B5B] mr-1">{part.value}</span>
            )
          )}
          <Button
            size="icon"
            variant="ghost"
            className="ml-1 p-1 h-6 w-6"
            onClick={() => {
              setEditingIndex(idx);
              if (part.type === 'link') setEditValue(part.value + '|' + (part.url || ''));
              else setEditValue(part.value);
            }}
            tabIndex={-1}
          >
            <Icons.pencil className="h-4 w-4" />
          </Button>
        </span>
      ))}
    </footer>
  );
}

export default function ProductTemplateEditor({ product }: ProductTemplateEditorProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize template data with defaults for missing properties
  const defaultTemplateData: TemplateData = {
    navbar: {
      title: '',
      logo: '',
      links: [],
      sticky: true,
      transparent: false
    },
    hero: { title: '', tagline: '', description: '', cta: { text: '', url: '' }, image: '' },
    about: {
      title: '',
      description: '',
      image: '',
      features: []
    },
    whyChoose: { title: '', subtitle: '', benefits: [] },
    features: { title: '', subtitle: '', items: [] },
    pricing: { title: '', subtitle: '', currency: 'USD', plans: [] },
    faq: { title: '', subtitle: '', items: [] },
    testimonials: [],
    media: { images: [], video: '' },
    brand: { name: '', contactEmail: '', socialLinks: {} },
    theme: { primaryColor: '#6F4E37', secondaryColor: '#ECB176' },
    footer: '',
    customFields: {},
  };

  // Merge with existing template data
  const [templateData, setTemplateData] = useState<TemplateData>(() => {
    if (!product.template_data) return defaultTemplateData;
    return {
      ...defaultTemplateData,
      ...product.template_data,
      hero: { ...defaultTemplateData.hero, ...(product.template_data.hero || {}) },
      whyChoose: { ...defaultTemplateData.whyChoose, ...(product.template_data.whyChoose || {}) },
      pricing: { ...defaultTemplateData.pricing, ...(product.template_data.pricing || {}) },
      media: { ...defaultTemplateData.media, ...(product.template_data.media || {}) },
      brand: { ...defaultTemplateData.brand, ...(product.template_data.brand || {}) },
      theme: { ...defaultTemplateData.theme, ...(product.template_data.theme || {}) },
      features: product.template_data.features || [],
      faq: product.template_data.faq || [],
      testimonials: product.template_data.testimonials || [],
      footer: product.template_data.footer || '',
      customFields: product.template_data.customFields || {},
    };
  });

  // Color palette handlers
  const handlePrimaryColorChange = (color: string) => {
    setTemplateData((prev) => ({
      ...prev,
      theme: { ...prev.theme, primaryColor: color }
    }));
  };
  const handleSecondaryColorChange = (color: string) => {
    setTemplateData((prev) => ({
      ...prev,
      theme: { ...prev.theme, secondaryColor: color }
    }));
  };

  // General update handler
  const updateTemplateData = useCallback((path: string, value: any) => {
    setTemplateData((prev) => {
      const newData = { ...prev };
      const keys = path.split(".");
      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  }, []);

  // Image upload logic (local preview, upload on save)
  const [localImages, setLocalImages] = useState<(string | File)[]>(templateData.media.images.length > 0 ? templateData.media.images : [PLACEHOLDER_IMAGE]);
  const handleImageChange = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setLocalImages((prev) => {
        const newImages = [...prev];
        newImages[index] = e.target?.result as string;
        return newImages;
      });
    };
    reader.readAsDataURL(file);
    // Store the file for upload on save
    setLocalImages((prev) => {
      const newImages = [...prev];
      newImages[index] = file;
      return newImages;
    });
  };
  const handleAddImage = () => {
    setLocalImages((prev) => [...prev, PLACEHOLDER_IMAGE]);
  };
  const handleRemoveImage = (index: number) => {
    setLocalImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Save changes to the product
  const saveChanges = async () => {
    setIsLoading(true);
    try {
      // TODO: Upload images if any are File objects, update templateData.media.images accordingly
      // For now, just save templateData
      const result = await updateProductTemplateData(product.id, templateData);
      if (result && result.error) {
        throw new Error(result.error);
      }
      toast({
        title: "Changes saved",
        description: "Your template changes have been successfully saved.",
      });
      router.refresh();
    } catch (error) {
      console.error("Error saving template changes:", error);
      toast({
        title: "Error",
        description: "Failed to save template changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      {/* Sticky Color Palette Bar */}
      <div className="sticky top-0 z-20 bg-white border-b py-2 sm:py-3 px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 sm:items-center sm:justify-between">
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-6 xs:items-center">
            <ColorPicker
              color={templateData.theme.primaryColor}
              onChange={handlePrimaryColorChange}
              label="Primary Color"
            />
            <ColorPicker
              color={templateData.theme.secondaryColor}
              onChange={handleSecondaryColorChange}
              label="Secondary Color"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/products`)}
              className="text-xs sm:text-sm px-3 sm:px-4"
            >
              Cancel
            </Button>
            <Button
              onClick={saveChanges}
              disabled={isLoading}
              className="text-xs sm:text-sm px-3 sm:px-4"
            >
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  <span className="hidden xs:inline">Saving...</span>
                  <span className="xs:hidden">Save</span>
                </>
              ) : (
                <>
                  <span className="hidden xs:inline">Save Changes</span>
                  <span className="xs:hidden">Save</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Editable Modern Template Sections */}
      {product.template === "modern" && (
        <ModernTemplate
          data={templateData}
          updateData={updateTemplateData}
        />
      )}

      {/* Footer Editor */}
      <div className="border rounded-md p-4 mt-8">
        <Label>Footer</Label>
        <FooterEditor
          value={templateData.footer || ""}
          onChange={val => updateTemplateData("footer", val)}
        />
        <div className="text-xs text-muted-foreground mt-1">Click the <Icons.pencil className="inline h-3 w-3" /> icon to edit text or links. Links use markdown: [text](url).</div>
      </div>
    </div>
  );
} 