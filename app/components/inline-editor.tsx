"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/app/components/dashboard/icons";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface InlineEditorProps {
  type: "text" | "textarea" | "icon" | "image";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  iconOptions?: string[];
  imageSize?: "sm" | "md" | "lg";
  previewClassName?: string;
}

export function InlineEditor({
  type,
  value,
  onChange,
  placeholder,
  className,
  iconOptions = [],
  imageSize = "md",
  previewClassName,
}: InlineEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const imageSizeClasses = {
    sm: "w-12 h-12",
    md: "w-24 h-24",
    lg: "w-full h-48",
  };

  // Determine preview content based on type
  const renderPreview = () => {
    switch (type) {
      case "icon":
        const Icon = value ? Icons[value as keyof typeof Icons] : null;
        return Icon ? (
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            <span>{value}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">No icon selected</span>
        );
      case "image":
        return value ? (
          <div className={cn("relative rounded overflow-hidden", imageSizeClasses[imageSize])}>
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className={cn("flex items-center justify-center border border-dashed rounded bg-muted", imageSizeClasses[imageSize])}>
            <Icons.image className="h-6 w-6 text-muted-foreground" />
          </div>
        );
      case "textarea":
        return value ? (
          <div className={cn("whitespace-pre-wrap", previewClassName)}>
            {value}
          </div>
        ) : (
          <span className="text-muted-foreground italic">{placeholder}</span>
        );
      default:
        return value ? (
          <div className={previewClassName}>{value}</div>
        ) : (
          <span className="text-muted-foreground italic">{placeholder}</span>
        );
    }
  };

  return (
    <div className={cn("group relative", className)}>
      {!isEditing ? (
        <div className="relative min-h-[1.5rem]">
          <div className="py-0.5 transition-all duration-200">
            {renderPreview()}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute opacity-0 group-hover:opacity-100 top-0 right-0 transition-opacity duration-200"
            onClick={() => setIsEditing(true)}
          >
            <Icons.pencil className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {type === "text" && (
            <Input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder={placeholder}
              onKeyDown={handleKeyDown}
              className="min-w-[200px]"
            />
          )}
          {type === "textarea" && (
            <Textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder={placeholder}
              onKeyDown={handleKeyDown}
              className="min-h-[80px]"
            />
          )}
          {type === "icon" && (
            <Select
              value={tempValue}
              onValueChange={setTempValue}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((icon) => (
                  <SelectItem key={icon} value={icon}>
                    <div className="flex items-center">
                      {Icons[icon as keyof typeof Icons] &&
                        React.createElement(Icons[icon as keyof typeof Icons], {
                          className: "h-4 w-4 mr-2",
                        })}
                      {icon}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {type === "image" && (
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              if (e.target?.result) {
                                setTempValue(e.target.result as string);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      {tempValue && (
                        <div className={cn("relative rounded overflow-hidden", imageSizeClasses[imageSize])}>
                          <img src={tempValue} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Upload new image</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function EditableCard({
  title,
  children,
  onEdit,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  onEdit?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("group relative rounded-lg border p-4 transition-all hover:shadow-md", className)}>
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      {children}
      {onEdit && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={onEdit}
        >
          <Icons.pencil className="h-3.5 w-3.5" />
          <span className="sr-only">Edit</span>
        </Button>
      )}
    </div>
  );
}

export function InlineEditorGroup({
  children,
  className,
  isEditing,
  onEditToggle,
}: {
  children: React.ReactNode;
  className?: string;
  isEditing: boolean;
  onEditToggle: (state: boolean) => void;
}) {
  return (
    <div className={cn("relative group", className)}>
      <div>{children}</div>
      {!isEditing ? (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={() => onEditToggle(true)}
        >
          <Icons.pencil className="h-3.5 w-3.5 mr-1" />
          Edit
        </Button>
      ) : (
        <div className="flex space-x-2 mt-4 justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEditToggle(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => onEditToggle(false)}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
} 