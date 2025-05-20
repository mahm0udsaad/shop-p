"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionProps } from "../types";

export function BrandSection({ data, updateData }: SectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Brand</h3>
      <div className="space-y-2">
        <Label>Brand Name</Label>
        <Input
          value={data.brand.name}
          onChange={e => updateData("brand.name", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Contact Email</Label>
        <Input
          value={data.brand.contactEmail}
          onChange={e => updateData("brand.contactEmail", e.target.value)}
        />
      </div>
    </div>
  );
}
 