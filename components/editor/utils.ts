import React from "react";

// Helper function to handle file upload
export const handleImageUpload = (
  e: React.ChangeEvent<HTMLInputElement>, 
  path: string,
  updateData: (path: string, value: any) => void
) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        updateData(path, e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  }
};

// Shared icon options for selects
export const iconOptions = [
  "sparkles", 
  "shield", 
  "zap", 
  "star", 
  "heart", 
  "rocket", 
  "check", 
  "box",
  "user",
  "settings",
  "eye",
  "lock",
  "globe",
  "calendar",
  "bell"
]; 