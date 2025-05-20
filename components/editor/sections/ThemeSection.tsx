"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionProps } from "../types";

export function ThemeSection({ data, updateData }: SectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Theme</h3>
      <div className="space-y-2">
        <Label>Primary Color</Label>
        <div className="flex items-center gap-2">
          <Input
            type="color"
            value={data.theme.primaryColor}
            onChange={e => updateData("theme.primaryColor", e.target.value)}
            className="w-16 h-10"
          />
          <Input
            value={data.theme.primaryColor}
            onChange={e => updateData("theme.primaryColor", e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Secondary Color</Label>
        <div className="flex items-center gap-2">
          <Input
            type="color"
            value={data.theme.secondaryColor}
            onChange={e => updateData("theme.secondaryColor", e.target.value)}
            className="w-16 h-10"
          />
          <Input
            value={data.theme.secondaryColor}
            onChange={e => updateData("theme.secondaryColor", e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Font Family</Label>
        <Input
          value={data.theme.fontFamily || ''}
          onChange={e => updateData("theme.fontFamily", e.target.value)}
          placeholder="System default"
        />
      </div>
    </div>
  );
} 