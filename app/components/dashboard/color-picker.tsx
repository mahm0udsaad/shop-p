"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

// Predefined color palette
const predefinedColors = [
  "#6F4E37", // Brown
  "#ECB176", // Light Brown
  "#FED8B1", // Beige
  "#A67B5B", // Medium Brown
  "#D2B48C", // Tan
  "#8B4513", // Saddle Brown
  "#0077B6", // Blue
  "#3A86FF", // Royal Blue
  "#023E8A", // Dark Blue
  "#FB8500", // Orange
  "#F25C54", // Red
  "#F94144", // Bright Red
  "#43AA8B", // Green
  "#90BE6D", // Light Green
  "#2EC4B6", // Teal
  "#F9C74F", // Yellow
  "#FFCA3A", // Bright Yellow
  "#9D4EDD", // Purple
  "#6A4C93", // Dark Purple
  "#9E2A2B", // Maroon
  "#000000", // Black
  "#343A40", // Dark Gray
  "#6C757D", // Medium Gray
  "#CED4DA", // Light Gray
  "#FFFFFF", // White
];

export function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  const [currentColor, setCurrentColor] = useState(color);
  
  const handleColorChange = (newColor: string) => {
    setCurrentColor(newColor);
    onChange(newColor);
  };
  
  return (
    <div className="space-y-1 sm:space-y-1.5">
      {label && <Label htmlFor="color-input" className="text-xs sm:text-sm">{label}</Label>}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-md border border-input flex items-center justify-center"
              style={{ backgroundColor: currentColor }}
              aria-label="Pick a color"
            />
          </PopoverTrigger>
          <PopoverContent className="w-56 sm:w-64 p-2 sm:p-3" align="start">
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {predefinedColors.map((c) => (
                <button
                  key={c}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-md border border-input transition-all hover:scale-110"
                  style={{ backgroundColor: c }}
                  onClick={() => handleColorChange(c)}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3">
              <div 
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-md border border-input flex-shrink-0" 
                style={{ backgroundColor: currentColor }} 
              />
              <Input
                id="color-input"
                type="text"
                value={currentColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="font-mono text-xs sm:text-sm h-7 sm:h-9"
                placeholder="#000000"
              />
            </div>
          </PopoverContent>
        </Popover>
        <Input
          id="color-input"
          type="text"
          value={currentColor}
          onChange={(e) => handleColorChange(e.target.value)}
          className="font-mono text-xs sm:text-sm h-7 sm:h-9 min-w-0 flex-1"
          placeholder="#000000"
        />
      </div>
    </div>
  );
} 