"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/app/components/dashboard/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TemplateControlsProps {
  isEditing: boolean;
  completionPercentage: number;
  primaryColor: string;
  secondaryColor: string;
  onPrimaryColorChange: (color: string) => void;
  onSecondaryColorChange: (color: string) => void;
  completionMessage?: string;
}

export function TemplateControls({
  isEditing,
  completionPercentage,
  primaryColor,
  secondaryColor,
  onPrimaryColorChange,
  onSecondaryColorChange,
  completionMessage
}: TemplateControlsProps) {
  if (!isEditing) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
      {/* Completion Progress Button */}
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative">
            {/* Circular progress border */}
            <svg 
              className="absolute inset-0 w-full h-full -rotate-90" 
              viewBox="0 0 36 36"
            >
              {/* Background circle */}
              <path
                className="text-gray-200"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Progress circle */}
              <path
                className="text-primary transition-all duration-300"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${completionPercentage}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <Button size="sm" variant="outline" className="shadow-md text-xs sm:text-sm px-3 sm:px-4 relative">
              <Icons.chart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="font-medium">{completionPercentage}%</span>
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-64 sm:w-80" align="end">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm sm:text-base">Template Completion</h4>
              <span className="text-lg sm:text-xl font-bold text-primary">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-600">
              {completionPercentage === 100 
                ? "🎉 Your template is complete!" 
                : completionMessage || "Keep adding content to improve your template"}
            </p>
          </div>
        </PopoverContent>
      </Popover>

      {/* Theme Settings */}
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline" className="shadow-md text-xs sm:text-sm px-3 sm:px-4">
            <Icons.paintbrush className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Theme</span>
            <span className="sm:hidden">🎨</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 sm:w-80" align="end">
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-medium text-sm sm:text-base">Theme Settings</h4>
            <div className="space-y-2">
              <Label htmlFor="primary-color" className="text-xs sm:text-sm">Primary Color</Label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border"
                  style={{ backgroundColor: primaryColor }}
                />
                <Input
                  id="primary-color"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => onPrimaryColorChange(e.target.value)}
                  className="w-full h-7 sm:h-8 text-xs sm:text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-color" className="text-xs sm:text-sm">Secondary Color</Label>
              <div className="flex items-center gap-2">
                <div 
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border"
                  style={{ backgroundColor: secondaryColor }}
                />
                <Input
                  id="secondary-color"
                  type="color" 
                  value={secondaryColor}
                  onChange={(e) => onSecondaryColorChange(e.target.value)}
                  className="w-full h-7 sm:h-8 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
} 