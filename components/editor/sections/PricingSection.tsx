"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionProps } from "../types";

export function PricingSection({ data, updateData }: SectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Pricing Plans</h3>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={data.pricing.title}
          onChange={e => updateData("pricing.title", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Input
          value={data.pricing.subtitle}
          onChange={e => updateData("pricing.subtitle", e.target.value)}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Edit plans in the full editor. This section has been moved to improve performance.
      </p>
    </div>
  );
} 