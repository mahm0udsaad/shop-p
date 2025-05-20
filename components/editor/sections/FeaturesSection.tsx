"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Icons } from "@/app/components/dashboard/icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionProps } from "../types";
import { iconOptions } from "../utils";
import { uploadProductImage } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ImageIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function FeaturesSection({ data, updateData }: SectionProps) {
  const { toast } = useToast();
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  
  // We'll hardcode the user ID for this example - in a real app, you would get this from auth
  const userId = "template-user";

  const handleAddFeature = () => {
    const items = [...data.features.items];
    items.push({ title: "New Feature", description: "Describe this feature", icon: "sparkles" });
    updateData("features.items", items);
  };

  const handleRemoveFeature = (index: number) => {
    const items = [...data.features.items];
    items.splice(index, 1);
    updateData("features.items", items);
  };

  const handleImageUpload = async (file: File, index: number) => {
    if (!file) return;

    try {
      setUploadingIndex(index);
      
      // Upload to Supabase
      const imageUrl = await uploadProductImage(file, userId);
      
      if (imageUrl) {
        const items = [...data.features.items];
        // Store the image URL in the icon field, prefixed with "img:" to distinguish from icon names
        items[index] = { 
          ...items[index], 
          icon: `img:${imageUrl}`
        };
        updateData("features.items", items);
        
        toast({
          title: "Image uploaded",
          description: "Feature image has been uploaded",
        });
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading the image",
        variant: "destructive",
      });
    } finally {
      setUploadingIndex(null);
    }
  };

  // Helper to check if a feature uses an image instead of an icon
  const isImageIcon = (iconValue: string | undefined): boolean => {
    return iconValue ? iconValue.startsWith('img:') : false;
  };

  // Helper to get the image URL from the icon field
  const getImageUrl = (iconValue: string | undefined): string => {
    return iconValue ? iconValue.replace('img:', '') : '';
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Features</h3>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={data.features.title}
          onChange={e => updateData("features.title", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Input
          value={data.features.subtitle}
          onChange={e => updateData("features.subtitle", e.target.value)}
        />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Features</Label>
          <Button onClick={handleAddFeature} variant="outline" size="sm">
            Add Feature
          </Button>
        </div>
        {data.features.items.map((feature, index) => {
          const [isEditing, setIsEditing] = useState(false);
          const hasImage = isImageIcon(feature.icon);
          const imageUrl = hasImage ? getImageUrl(feature.icon) : '';
          const iconName = !hasImage ? feature.icon : 'sparkles';
          const Icon = iconName ? 
            Icons[iconName as keyof typeof Icons] : 
            Icons.sparkles;
          const isUploading = uploadingIndex === index;
          
          return (
            <Card key={index} className="p-4">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Feature {index + 1}</Label>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        size="sm"
                      >
                        <Icons.check className="h-4 w-4 mr-1" />
                        Done
                      </Button>
                      <Button
                        onClick={() => handleRemoveFeature(index)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                      >
                        <Icons.trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Tabs defaultValue={hasImage ? "image" : "icon"} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="icon">Icon</TabsTrigger>
                      <TabsTrigger value="image">Image</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="icon" className="space-y-2">
                      <Label>Icon</Label>
                      <Select
                        value={hasImage ? "" : (feature.icon || "")}
                        onValueChange={value => {
                          const items = [...data.features.items];
                          items[index] = { ...feature, icon: value };
                          updateData("features.items", items);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map(icon => (
                            <SelectItem key={icon} value={icon}>
                              <div className="flex items-center">
                                {Icons[icon as keyof typeof Icons] && 
                                  React.createElement(Icons[icon as keyof typeof Icons], { className: "h-4 w-4 mr-2" })}
                                {icon}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TabsContent>
                    
                    <TabsContent value="image" className="space-y-2">
                      <Label>Image</Label>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(file, index);
                              }
                            }}
                            disabled={isUploading}
                          />
                          {isUploading && (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          )}
                        </div>
                        
                        {imageUrl && (
                          <div className="relative">
                            <img 
                              src={imageUrl} 
                              alt={feature.title}
                              className="h-32 w-full object-cover rounded-md" 
                            />
                            <Button
                              className="absolute top-1 right-1"
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                const items = [...data.features.items];
                                items[index] = { ...feature, icon: "sparkles" };
                                updateData("features.items", items);
                              }}
                            >
                              <Icons.trash className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={feature.title}
                      onChange={e => {
                        const items = [...data.features.items];
                        items[index] = { ...feature, title: e.target.value };
                        updateData("features.items", items);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={feature.description}
                      onChange={e => {
                        const items = [...data.features.items];
                        items[index] = { ...feature, description: e.target.value };
                        updateData("features.items", items);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {hasImage ? (
                        <div className="w-10 h-10 rounded-md overflow-hidden mr-3">
                          <img 
                            src={imageUrl} 
                            alt={feature.title}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      ) : (
                        <div className="p-2 rounded-full bg-primary/10 mr-3">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <h4 className="font-medium">{feature.title}</h4>
                    </div>
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="ghost"
                      size="sm"
                    >
                      <Icons.pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{feature.description}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
} 