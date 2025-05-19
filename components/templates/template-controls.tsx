"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { useTemplate } from "@/contexts/template-context";
import { Search, Globe } from "lucide-react";

export function TemplateControls() {
  const { state, dispatch, colorPalettes } = useTemplate();
  const [showPalette, setShowPalette] = useState(false);
  const [showSEO, setShowSEO] = useState(false);
  const [showDomain, setShowDomain] = useState(false);
  const [domainError, setDomainError] = useState("");

  const handleColorPaletteSelect = (palette: typeof colorPalettes[0]) => {
    dispatch({
      type: "UPDATE_THEME",
      colors: {
        primary: palette.primary,
        secondary: palette.secondary,
        text: palette.text,
        accent: palette.accent,
      },
    });
    setShowPalette(false);
  };

  const handleSEOUpdate = (data: any) => {
    dispatch({
      type: "UPDATE_SEO",
      data,
    });
    setShowSEO(false);
  };

  const handleDomainUpdate = async (domain: string) => {
    // Here you would integrate with your domain validation API
    try {
      const isValid = await validateDomain(domain);
      if (isValid) {
        dispatch({
          type: "UPDATE_DOMAIN",
          domain,
        });
        setDomainError("");
        setShowDomain(false);
      } else {
        setDomainError("Invalid domain format");
      }
    } catch (error) {
      setDomainError("Error validating domain");
    }
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 flex flex-col gap-2">
        {/* Theme Button */}
        <Button
          size="icon"
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow group relative"
          onClick={() => setShowPalette(true)}
        >
          <Icons.paintbrush className="h-5 w-5" />
          <span className="absolute right-full mx-2 bg-background/90 px-2 py-1 rounded text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Color Palette
          </span>
        </Button>

        {/* SEO Button */}
        <Button
          size="icon"
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow group relative"
          onClick={() => setShowSEO(true)}
        >
          <Search className="h-5 w-5" />
          <span className="absolute right-full mx-2 bg-background/90 px-2 py-1 rounded text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            SEO Settings
          </span>
        </Button>

        {/* Domain Button */}
        <Button
          size="icon"
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow group relative"
          onClick={() => setShowDomain(true)}
        >
          <Globe className="h-5 w-5" />
          <span className="absolute right-full mx-2 bg-background/90 px-2 py-1 rounded text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Domain Settings
          </span>
        </Button>
      </div>

      {/* Color Palette Dialog */}
      <Dialog open={showPalette} onOpenChange={setShowPalette}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Color Palette</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            {colorPalettes.map((palette, index) => (
              <button
                key={index}
                className="p-4 rounded-lg border hover:border-primary transition-colors"
                onClick={() => handleColorPaletteSelect(palette)}
              >
                <div className="space-y-2">
                  <div className="text-sm font-medium">{palette.name}</div>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: palette.primary }} />
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: palette.secondary }} />
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: palette.text }} />
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: palette.accent }} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* SEO Dialog */}
      <Dialog open={showSEO} onOpenChange={setShowSEO}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>SEO Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Page Title</Label>
              <Input
                value={state.seo.title}
                onChange={(e) => handleSEOUpdate({ ...state.seo, title: e.target.value })}
                placeholder="Enter page title"
              />
            </div>
            <div>
              <Label>Meta Description</Label>
              <Textarea
                value={state.seo.description}
                onChange={(e) => handleSEOUpdate({ ...state.seo, description: e.target.value })}
                placeholder="Enter meta description"
              />
            </div>
            <div>
              <Label>Keywords (comma-separated)</Label>
              <Input
                value={state.seo.keywords.join(", ")}
                onChange={(e) =>
                  handleSEOUpdate({
                    ...state.seo,
                    keywords: e.target.value.split(",").map((k) => k.trim()),
                  })
                }
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
            <div>
              <Label>OG Image URL</Label>
              <Input
                value={state.seo.ogImage}
                onChange={(e) => handleSEOUpdate({ ...state.seo, ogImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Domain Dialog */}
      <Dialog open={showDomain} onOpenChange={setShowDomain}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Domain Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Custom Domain</Label>
              <Input
                value={state.domain}
                onChange={(e) => handleDomainUpdate(e.target.value)}
                placeholder="yourdomain.com"
              />
              {domainError && <p className="text-sm text-red-500 mt-1">{domainError}</p>}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Placeholder for domain validation - replace with your actual API call
async function validateDomain(domain: string): Promise<boolean> {
  // Basic domain validation regex
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
} 