"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Icons } from "@/app/components/dashboard/icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionProps } from "../types";
import { iconOptions } from "../utils";

export function WhyChooseSection({ data, updateData }: SectionProps) {
  const handleAddBenefit = () => {
    const benefits = [...data.whyChoose.benefits];
    benefits.push({ text: "New Benefit", icon: "check" });
    updateData("whyChoose.benefits", benefits);
  };

  const handleRemoveBenefit = (index: number) => {
    const benefits = [...data.whyChoose.benefits];
    benefits.splice(index, 1);
    updateData("whyChoose.benefits", benefits);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Why Choose Us</h3>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={data.whyChoose.title}
          onChange={e => updateData("whyChoose.title", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Input
          value={data.whyChoose.subtitle}
          onChange={e => updateData("whyChoose.subtitle", e.target.value)}
        />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Benefits</Label>
          <Button onClick={handleAddBenefit} variant="outline" size="sm">
            Add Benefit
          </Button>
        </div>
        {data.whyChoose.benefits.map((benefit, index) => {
          const [isEditing, setIsEditing] = useState(false);
          const benefitText = typeof benefit === 'string' ? benefit : benefit.text;
          const benefitIcon = typeof benefit === 'string' ? 'check' : (benefit.icon || 'check');
          const Icon = Icons[benefitIcon as keyof typeof Icons] || Icons.check;
          
          return (
            <Card key={index} className="p-4">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Benefit {index + 1}</Label>
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
                        onClick={() => handleRemoveBenefit(index)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                      >
                        <Icons.trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Select
                      value={benefitIcon}
                      onValueChange={value => {
                        const benefits = [...data.whyChoose.benefits];
                        if (typeof benefit === 'string') {
                          benefits[index] = { text: benefit, icon: value };
                        } else {
                          benefits[index] = { ...benefit, icon: value };
                        }
                        updateData("whyChoose.benefits", benefits);
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
                  </div>
                  <div className="space-y-2">
                    <Label>Text</Label>
                    <Input
                      value={benefitText}
                      onChange={e => {
                        const benefits = [...data.whyChoose.benefits];
                        if (typeof benefit === 'string') {
                          benefits[index] = { text: e.target.value, icon: benefitIcon };
                        } else {
                          benefits[index] = { ...benefit, text: e.target.value };
                        }
                        updateData("whyChoose.benefits", benefits);
                      }}
                      placeholder="Benefit Text"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-primary/10 mr-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span>{benefitText}</span>
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
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
} 