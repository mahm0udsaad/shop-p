"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/app/components/dashboard/icons";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface InlineEditorProps {
  type: "text" | "textarea" | "icon" | "image";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  iconOptions?: string[];
  imageSize?: "sm" | "md" | "lg";
  previewClassName?: string;
  editMode?: "inline" | "overlay" | "sidebar";
  label?: string;
  required?: boolean;
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
  editMode = "inline",
  label,
  required = false,
}: InlineEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const [showEditHint, setShowEditHint] = useState(false);
  
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
    if (e.key === "Enter" && !e.shiftKey && type !== "textarea") {
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

  const isEmpty = !value || value.trim() === "";

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
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icons.image className="h-5 w-5" />
            <span>Select icon</span>
          </div>
        );
      case "image":
        return value ? (
          <div className="relative rounded overflow-hidden h-full">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className={cn("flex flex-col items-center justify-center border-2 border-dashed rounded-lg bg-muted/30 transition-colors", imageSizeClasses[imageSize])}>
            <Icons.image className="h-6 w-6 text-muted-foreground mb-2" />
            <span className="text-xs text-muted-foreground text-center px-2">
              {imageSize === "sm" ? "Add" : "Click to add image"}
            </span>
          </div>
        );
      case "textarea":
        return value ? (
          <div className={cn("whitespace-pre-wrap", previewClassName)}>
            {value}
          </div>
        ) : (
          <div className="text-muted-foreground italic text-sm py-2">
            {placeholder || "Add description..."}
          </div>
        );
      default:
        return value ? (
          <div className={previewClassName}>{value}</div>
        ) : (
          <div className="text-muted-foreground italic text-sm">
            {placeholder || "Add text..."}
          </div>
        );
    }
  };

  const renderEditIcon = () => (
    <div className="flex items-center gap-1">
      <Icons.pencil className="h-3 w-3" />
      {editMode !== "overlay" && <span className="text-xs hidden sm:inline">Edit</span>}
    </div>
  );

  // Mobile-first edit button positioning
  const getEditButtonClasses = () => {
    if (editMode === "overlay") {
      return "absolute -top-2 -right-2 z-20 shadow-lg";
    }
    
    if (type === "image" && imageSize === "lg") {
      return "mt-2 w-full justify-center";
    }
    
    return "ml-2 flex-shrink-0";
  };

  const renderInlineMode = () => (
    <div className={cn("group relative transition-all duration-200", className)}>
      {!isEditing ? (
        <div className={cn(
          "relative min-h-[2rem] transition-all duration-200 rounded-md",
          "border border-transparent",
          isEmpty && type !== "image" && "border-dashed border-gray-200 bg-gray-50/50",
          !isEmpty && editMode === "inline" && "hover:bg-gray-50/80"
        )}>
          {/* Edit hint for empty states - but not for images */}
          {isEmpty && type !== "image" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Badge variant="outline" className="text-xs opacity-60">
                <Icons.plus className="h-3 w-3 mr-1" />
                {label || "Click to edit"}
              </Badge>
            </div>
          )}
          
          <div className={cn(
            "flex items-center",
            type === "image" && imageSize === "lg" ? "flex-col" : "flex-row",
            isEmpty && type !== "image" ? "p-3" : "p-2"
          )}>
            <div 
              className={cn(
                "flex-1 min-w-0",
                type === "image" && isEmpty && "cursor-pointer"
              )}
              onClick={type === "image" && isEmpty ? () => setIsEditing(true) : undefined}
            >
              {renderPreview()}
            </div>
            
            {/* Only show edit button for non-image types or when image has content */}
            {(type !== "image" || !isEmpty) && (
              <Button
                type="button"
                variant={isEmpty ? "default" : "ghost"}
                size="sm"
                className={cn(
                  getEditButtonClasses(),
                  "transition-all duration-200",
                  "opacity-100", // Always visible now
                  editMode === "overlay" && "rounded-full w-8 h-8 p-0"
                )}
                onClick={() => setIsEditing(true)}
              >
                {renderEditIcon()}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3 p-4 border rounded-lg bg-white shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          {label && (
            <div className="flex items-center gap-2">
              <Icons.pencil className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-gray-700">{label}</span>
              {required && <span className="text-red-500">*</span>}
            </div>
          )}
          
          {type === "text" && (
            <Input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder={placeholder}
              onKeyDown={handleKeyDown}
              className="w-full"
            />
          )}
          
          {type === "textarea" && (
            <Textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder={placeholder}
              onKeyDown={handleKeyDown}
              className="min-h-[100px]"
            />
          )}
          
          {type === "icon" && (
            <Select value={tempValue} onValueChange={setTempValue}>
              <SelectTrigger>
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
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
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        // Show loading state
                        setTempValue("uploading...");
                        
                        // Upload to Supabase storage
                        const formData = new FormData();
                        formData.append("file", file);
                        
                        const response = await fetch("/api/upload-image", {
                          method: "POST",
                          body: formData,
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                          setTempValue(result.url);
                        } else {
                          console.error("Upload failed:", result.error);
                          // Fallback to base64 for preview
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            if (e.target?.result) {
                              setTempValue(e.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      } catch (error) {
                        console.error("Upload error:", error);
                        // Fallback to base64 for preview
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          if (e.target?.result) {
                            setTempValue(e.target.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }
                  }}
                />
                <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Icons.upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="text-sm text-gray-500 text-center">
                    <span className="font-semibold">Click to upload</span>
                    <br />
                    <span className="text-xs">SVG, PNG, JPG or GIF</span>
                  </p>
                </div>
              </div>
              
              {tempValue && tempValue !== "uploading..." && (
                <div className="relative">
                  <div className={cn("relative rounded overflow-hidden", imageSizeClasses[imageSize])}>
                    <img src={tempValue} alt="Preview" className="w-full h-full object-cover" />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={() => setTempValue("")}
                    >
                      <Icons.x className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
              
              {tempValue === "uploading..." && (
                <div className="flex items-center justify-center p-4">
                  <Icons.spinner className="h-6 w-6 animate-spin text-gray-500" />
                  <span className="ml-2 text-sm text-gray-500">Uploading...</span>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              <Icons.x className="h-3 w-3 mr-1" />
              Cancel
            </Button>
            <Button 
              type="button" 
              size="sm" 
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90"
            >
              <Icons.check className="h-3 w-3 mr-1" />
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return renderInlineMode();
}

// Enhanced Editable Card Component
export interface EditableField {
  id: string;
  type: "text" | "textarea" | "icon" | "image" | "number";
  label: string;
  value: string;
  placeholder?: string;
  options?: string[];
  imageSize?: "sm" | "md" | "lg";
  required?: boolean;
}

export function EditableCard({
  title,
  fields,
  onSave,
  className,
  children,
  editLabel = "Edit Card",
}: {
  title?: string;
  fields: EditableField[];
  onSave: (updatedFields: EditableField[]) => void;
  className?: string;
  children?: React.ReactNode;
  editLabel?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempFields, setTempFields] = useState<EditableField[]>(fields);

  useEffect(() => {
    if (!isEditing) {
      setTempFields(fields);
    }
  }, [fields, isEditing]);

  const handleFieldChange = (id: string, value: string) => {
    setTempFields(
      tempFields.map(field => 
        field.id === id ? { ...field, value } : field
      )
    );
  };

  const handleSave = () => {
    onSave(tempFields);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempFields(fields);
    setIsEditing(false);
  };

  const hasEmptyFields = fields.some(field => !field.value || field.value.trim() === "");

  return (
    <Card className={cn(
      "relative group transition-all duration-200 overflow-hidden",
      isEditing ? "border-primary shadow-lg ring-2 ring-primary/20" : "border-gray-200",
      hasEmptyFields && !isEditing ? "border-dashed border-gray-300 bg-gray-50/30" : "",
      className
    )}>
      {/* Edit overlay button for card */}
      {!isEditing && (
        <div className="absolute top-3 right-3 z-10">
          <Button
            type="button"
            variant={hasEmptyFields ? "default" : "secondary"}
            size="sm"
            className={cn(
              "transition-all duration-200 shadow-sm",
              "opacity-100", // Always visible now
              "rounded-full w-8 h-8 p-0"
            )}
            onClick={() => setIsEditing(true)}
          >
            {hasEmptyFields ? (
              <Icons.plus className="h-3 w-3" />
            ) : (
              <Icons.pencil className="h-3 w-3" />
            )}
          </Button>
        </div>
      )}

      <div className="p-4">
        {title && (
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            {isEditing && (
              <Badge variant="secondary" className="text-xs">
                <Icons.pencil className="h-3 w-3 mr-1" />
                Editing
              </Badge>
            )}
          </div>
        )}
        
        {children}
        
        {!isEditing ? (
          <div className="space-y-4">
            {fields.map(field => (
              <div key={field.id} className="space-y-1">
                {field.label && (
                  <div className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </div>
                )}
                <div className="py-1">
                  {field.type === "image" ? (
                    field.value ? (
                      <div className={cn("relative rounded overflow-hidden", 
                        field.imageSize === "sm" ? "w-12 h-12" : 
                        field.imageSize === "lg" ? "w-full h-48" : 
                        "w-24 h-24"
                      )}>
                        <img src={field.value} alt={field.label} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className={cn("flex flex-col items-center justify-center border-2 border-dashed rounded-lg bg-muted/30", 
                        field.imageSize === "sm" ? "w-12 h-12" : 
                        field.imageSize === "lg" ? "w-full h-48" : 
                        "w-24 h-24"
                      )}>
                        <Icons.image className="h-4 w-4 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground text-center">
                          {field.imageSize === "sm" ? "Add" : "Add image"}
                        </span>
                      </div>
                    )
                  ) : field.type === "icon" ? (
                    field.value && Icons[field.value as keyof typeof Icons] ? (
                      <div className="flex items-center gap-2">
                        {React.createElement(Icons[field.value as keyof typeof Icons], {
                          className: "h-5 w-5 text-primary",
                        })}
                        <span className="text-sm">{field.value}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icons.image className="h-5 w-5" />
                        <span className="text-sm italic">Select icon</span>
                      </div>
                    )
                  ) : field.type === "textarea" ? (
                    <div className="whitespace-pre-wrap text-sm">
                      {field.value || (
                        <span className="text-muted-foreground italic">
                          {field.placeholder}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm">
                      {field.value || (
                        <span className="text-muted-foreground italic">
                          {field.placeholder}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {hasEmptyFields && (
              <div className="pt-2">
                <Badge variant="outline" className="text-xs text-center w-full justify-center py-2">
                  <Icons.eyeOff className="h-3 w-3 mr-1" />
                  Complete your {editLabel.toLowerCase()}
                </Badge>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Icons.pencil className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-gray-700">
                Editing {editLabel}
              </span>
            </div>
            
            {tempFields.map(field => (
              <div key={field.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{field.label}</span>
                  {field.required && <span className="text-red-500">*</span>}
                </div>
                
                {field.type === "text" && (
                  <Input
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                  />
                )}
                
                {field.type === "textarea" && (
                  <Textarea
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="min-h-[80px]"
                  />
                )}
                
                {field.type === "icon" && (
                  <Select
                    value={field.value}
                    onValueChange={(value) => handleFieldChange(field.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {field.options?.map((icon) => (
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
                
                {field.type === "image" && (
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              // Show loading state
                              handleFieldChange(field.id, "uploading...");
                              
                              // Upload to Supabase storage
                              const formData = new FormData();
                              formData.append("file", file);
                              
                              const response = await fetch("/api/upload-image", {
                                method: "POST",
                                body: formData,
                              });
                              
                              const result = await response.json();
                              
                              if (result.success) {
                                handleFieldChange(field.id, result.url);
                              } else {
                                console.error("Upload failed:", result.error);
                                // Fallback to base64 for preview
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  if (e.target?.result) {
                                    handleFieldChange(field.id, e.target.result as string);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            } catch (error) {
                              console.error("Upload error:", error);
                              // Fallback to base64 for preview
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                if (e.target?.result) {
                                  handleFieldChange(field.id, e.target.result as string);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }
                        }}
                      />
                      <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <Icons.upload className="w-6 h-6 mb-2 text-gray-500" />
                        <p className="text-sm text-gray-500 text-center">
                          <span className="font-semibold">Click to upload</span>
                          <br />
                          <span className="text-xs">SVG, PNG, JPG or GIF</span>
                        </p>
                      </div>
                    </div>
                    {field.value && field.value !== "uploading..." && (
                      <div className="relative">
                        <img src={field.value} alt={field.label} className="w-full h-32 object-cover rounded" />
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-2 right-2 h-6 w-6 rounded-full"
                          onClick={() => handleFieldChange(field.id, "")}
                        >
                          <Icons.x className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    
                    {field.value === "uploading..." && (
                      <div className="flex items-center justify-center p-4">
                        <Icons.spinner className="h-4 w-4 animate-spin text-gray-500" />
                        <span className="ml-2 text-xs text-gray-500">Uploading...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleCancel}
              >
                <Icons.x className="h-3 w-3 mr-1" />
                Cancel
              </Button>
              <Button 
                type="button" 
                size="sm" 
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90"
              >
                <Icons.check className="h-3 w-3 mr-1" />
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// Enhanced Section Editor for grouped editing
export function InlineEditorGroup({
  children,
  className,
  isEditing,
  onEditToggle,
  title,
  description,
}: {
  children: React.ReactNode;
  className?: string;
  isEditing: boolean;
  onEditToggle: (state: boolean) => void;
  title?: string;
  description?: string;
}) {
  return (
    <div className={cn("relative group", className)}>
      {/* Section header when editing */}
      {isEditing && (title || description) && (
        <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          {title && (
            <div className="flex items-center gap-2 mb-1">
              <Icons.pencil className="h-4 w-4 text-primary" />
              <h4 className="font-medium text-primary">{title}</h4>
            </div>
          )}
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}
      
      <div className={cn(
        "transition-all duration-200",
        isEditing && "border border-primary/30 rounded-lg p-4 bg-primary/5"
      )}>
        {children}
      </div>
      
      {!isEditing ? (
        <div className="absolute top-4 right-4">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200 shadow-sm"
            onClick={() => onEditToggle(true)}
          >
            <Icons.pencil className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Edit Section</span>
          </Button>
        </div>
      ) : (
        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEditToggle(false)}
          >
            <Icons.x className="h-3 w-3 mr-1" />
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => onEditToggle(false)}
            className="bg-primary hover:bg-primary/90"
          >
            <Icons.check className="h-3 w-3 mr-1" />
            Save Section
          </Button>
        </div>
      )}
    </div>
  );
}