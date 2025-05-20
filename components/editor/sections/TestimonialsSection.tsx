"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Icons } from "@/app/components/dashboard/icons";
import { SectionProps } from "../types";
import { uploadProductImage } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export function TestimonialsSection({ data, updateData }: SectionProps) {
  const { toast } = useToast();
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  
  // We'll hardcode the user ID for this example - in a real app, you would get this from auth
  const userId = "template-user";

  const handleAddTestimonial = () => {
    const testimonials = [...data.testimonials];
    testimonials.push({
      name: "Customer Name",
      role: "Position",
      content: "Great testimonial",
      image: ""
    });
    updateData("testimonials", testimonials);
  };

  const handleRemoveTestimonial = (index: number) => {
    const testimonials = [...data.testimonials];
    testimonials.splice(index, 1);
    updateData("testimonials", testimonials);
  };

  const handleImageUpload = async (file: File, index: number) => {
    if (!file) return;

    try {
      setUploadingIndex(index);
      
      // Upload to Supabase
      const imageUrl = await uploadProductImage(file, userId);
      
      if (imageUrl) {
        const testimonials = [...data.testimonials];
        testimonials[index] = { 
          ...testimonials[index], 
          image: imageUrl
        };
        updateData("testimonials", testimonials);
        
        toast({
          title: "Image uploaded",
          description: "Testimonial avatar has been uploaded",
        });
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading the avatar image",
        variant: "destructive",
      });
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Testimonials</h3>
      <div className="flex justify-between items-center">
        <Label>Testimonials</Label>
        <Button onClick={handleAddTestimonial} variant="outline" size="sm">
          Add Testimonial
        </Button>
      </div>
      {data.testimonials.map((testimonial, index) => {
        const [isEditing, setIsEditing] = useState(false);
        const isUploading = uploadingIndex === index;
        
        return (
          <Card key={index} className="p-4">
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Testimonial {index + 1}</Label>
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
                      onClick={() => handleRemoveTestimonial(index)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                    >
                      <Icons.trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={testimonial.name}
                    onChange={e => {
                      const testimonials = [...data.testimonials];
                      testimonials[index] = { ...testimonial, name: e.target.value };
                      updateData("testimonials", testimonials);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role/Position</Label>
                  <Input
                    value={testimonial.role}
                    onChange={e => {
                      const testimonials = [...data.testimonials];
                      testimonials[index] = { ...testimonial, role: e.target.value };
                      updateData("testimonials", testimonials);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    value={testimonial.content}
                    onChange={e => {
                      const testimonials = [...data.testimonials];
                      testimonials[index] = { ...testimonial, content: e.target.value };
                      updateData("testimonials", testimonials);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Avatar Image</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
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
                    </div>
                    
                    {isUploading ? (
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-muted">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : testimonial.image ? (
                      <div className="w-12 h-12 relative rounded-full overflow-hidden">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          className="absolute inset-0 opacity-0 hover:opacity-100 bg-background/80 flex items-center justify-center"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const testimonials = [...data.testimonials];
                            testimonials[index] = { ...testimonial, image: "" };
                            updateData("testimonials", testimonials);
                          }}
                        >
                          <Icons.trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  {testimonial.image ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icons.user className="h-8 w-8 text-primary/60" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
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
                  <p className="text-sm italic">"{testimonial.content}"</p>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
} 