"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Icons } from "@/app/components/dashboard/icons";
import { SectionProps } from "../types";
import { handleImageUpload } from "../utils";

export function AboutSection({ data, updateData }: SectionProps) {
  const handleAddAboutFeature = () => {
    const features = [...(data.about?.features || [])];
    features.push("New Feature");
    updateData("about.features", features);
  };

  const handleRemoveAboutFeature = (index: number) => {
    const features = [...(data.about?.features || [])];
    features.splice(index, 1);
    updateData("about.features", features);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">About Section</h3>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={data.about?.title || ""}
          onChange={e => updateData("about.title", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={data.about?.description || ""}
          onChange={e => updateData("about.description", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Image</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "about.image", updateData)}
        />
        {data.about?.image && (
          <div className="w-full h-32 relative mt-2">
            <img
              src={data.about.image}
              alt="About"
              className="w-full h-full object-cover rounded"
            />
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Features</Label>
          <Button onClick={handleAddAboutFeature} variant="outline" size="sm">
            Add Feature
          </Button>
        </div>
        {(data.about?.features || []).map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={feature}
              onChange={e => {
                const features = [...(data.about?.features || [])];
                features[index] = e.target.value;
                updateData("about.features", features);
              }}
            />
            <Button
              onClick={() => handleRemoveAboutFeature(index)}
              variant="ghost"
              size="sm"
              className="text-destructive"
            >
              <Icons.trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 