"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionProps } from "../types";
import { handleImageUpload } from "../utils";

export function HeroSection({ data, updateData }: SectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Hero Section</h3>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={data.hero.title}
          onChange={e => updateData("hero.title", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Tagline</Label>
        <Input
          value={data.hero.tagline}
          onChange={e => updateData("hero.tagline", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={data.hero.description}
          onChange={e => updateData("hero.description", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>CTA Text</Label>
        <Input
          value={data.hero.cta.text}
          onChange={e => updateData("hero.cta.text", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>CTA URL</Label>
        <Input
          value={data.hero.cta.url}
          onChange={e => updateData("hero.cta.url", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Hero Image</Label>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "hero.image", updateData)}
          />
          {data.hero.image && (
            <div className="w-16 h-16 relative">
              <img
                src={data.hero.image}
                alt="Hero"
                className="w-full h-full object-cover rounded"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 