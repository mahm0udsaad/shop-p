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
            <span className="ml-2 text-xs text-muted-foreground">Click to add image</span>
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
        <div className="relative min-h-[1.5rem] p-1 rounded hover:bg-gray-50 transition-colors">
          <div className="py-0.5 transition-all duration-200">
            {renderPreview()}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="absolute right-1 top-1 opacity-90 transition-opacity duration-200"
            onClick={() => setIsEditing(true)}
          >
            <Icons.pencil className="h-3.5 w-3.5" />
            <span className="ml-1 text-xs">Edit</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200 p-1 border rounded-md bg-background shadow-sm">
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
            <div>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Icons.upload className="w-8 h-8 mb-3 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
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
                  </label>
                </div>
                {tempValue && (
                  <div className={cn("relative rounded overflow-hidden", imageSizeClasses[imageSize])}>
                    <img src={tempValue} alt="Preview" className="w-full h-full object-cover" />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => setTempValue("")}
                    >
                      <Icons.x className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
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

// Card with editable fields
export interface EditableField {
  id: string;
  type: "text" | "textarea" | "icon" | "image";
  label: string;
  value: string;
  placeholder?: string;
  options?: string[];
  imageSize?: "sm" | "md" | "lg";
}

export function EditableCard({
  title,
  fields,
  onSave,
  className,
  children,
}: {
  title?: string;
  fields: EditableField[];
  onSave: (updatedFields: EditableField[]) => void;
  className?: string;
  children?: React.ReactNode;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempFields, setTempFields] = useState<EditableField[]>(fields);

  // Update local state when props change
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

  return (
    <Card className={cn("relative p-4 transition-all border", isEditing ? "border-primary shadow-md" : "", className)}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      
      {children}
      
      {!isEditing ? (
        <>
          {fields.map(field => (
            <div key={field.id} className="mb-3">
              {field.label && <div className="text-sm font-medium mb-1">{field.label}</div>}
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
                    <div className={cn("flex items-center justify-center border border-dashed rounded bg-muted", 
                      field.imageSize === "sm" ? "w-12 h-12" : 
                      field.imageSize === "lg" ? "w-full h-48" : 
                      "w-24 h-24"
                    )}>
                      <Icons.image className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )
                ) : field.type === "icon" ? (
                  field.value && Icons[field.value as keyof typeof Icons] ? (
                    <div className="flex items-center gap-2">
                      {React.createElement(Icons[field.value as keyof typeof Icons], {
                        className: "h-5 w-5",
                      })}
                      <span>{field.value}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No icon selected</span>
                  )
                ) : field.type === "textarea" ? (
                  <div className="whitespace-pre-wrap">{field.value || <span className="text-muted-foreground italic">{field.placeholder}</span>}</div>
                ) : (
                  <div>{field.value || <span className="text-muted-foreground italic">{field.placeholder}</span>}</div>
                )}
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 w-full justify-center"
            onClick={() => setIsEditing(true)}
          >
            <Icons.pencil className="h-3.5 w-3.5 mr-2" />
            Edit
          </Button>
        </>
      ) : (
        <div className="space-y-4">
          {tempFields.map(field => (
            <div key={field.id} className="space-y-2">
              {field.label && <div className="text-sm font-medium">{field.label}</div>}
              
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
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Icons.upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-1 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              if (e.target?.result) {
                                handleFieldChange(field.id, e.target.result as string);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  {field.value && (
                    <div className={cn("relative rounded overflow-hidden", 
                      field.imageSize === "sm" ? "w-16 h-16" : 
                      field.imageSize === "lg" ? "w-full h-48" : 
                      "w-32 h-32"
                    )}>
                      <img src={field.value} alt={field.label} className="w-full h-full object-cover" />
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => handleFieldChange(field.id, "")}
                      >
                        <Icons.x className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </Card>
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
          className="absolute top-2 right-2 opacity-90 shadow-sm"
          onClick={() => onEditToggle(true)}
        >
          <Icons.pencil className="h-3.5 w-3.5 mr-1" />
          Edit Section
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
            Save Section
          </Button>
        </div>
      )}
    </div>
  );
} 