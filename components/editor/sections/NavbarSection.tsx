"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash, Plus } from "lucide-react";
import { SectionProps } from "../types";
import { handleImageUpload } from "../utils";

export function NavbarSection({ data, updateData }: SectionProps) {
  const [newLinkText, setNewLinkText] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  const addLink = () => {
    if (newLinkText && newLinkUrl) {
      const updatedLinks = [...data.navbar.links, { text: newLinkText, url: newLinkUrl }];
      updateData("navbar.links", updatedLinks);
      setNewLinkText("");
      setNewLinkUrl("");
    }
  };

  const deleteLink = (index: number) => {
    const updatedLinks = [...data.navbar.links];
    updatedLinks.splice(index, 1);
    updateData("navbar.links", updatedLinks);
  };

  const toggleLinkButton = (index: number) => {
    const updatedLinks = [...data.navbar.links];
    updatedLinks[index] = {
      ...updatedLinks[index],
      isButton: !updatedLinks[index].isButton
    };
    updateData("navbar.links", updatedLinks);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Navbar</h3>
      
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={data.navbar.title}
          onChange={e => updateData("navbar.title", e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Logo</Label>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "navbar.logo", updateData)}
          />
          {data.navbar.logo && (
            <div className="w-10 h-10 relative">
              <img
                src={data.navbar.logo}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="sticky-navbar"
          checked={data.navbar.sticky || false}
          onCheckedChange={checked => updateData("navbar.sticky", checked)}
        />
        <Label htmlFor="sticky-navbar">Sticky Navbar</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="transparent-navbar"
          checked={data.navbar.transparent || false}
          onCheckedChange={checked => updateData("navbar.transparent", checked)}
        />
        <Label htmlFor="transparent-navbar">Transparent Background</Label>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Navigation Links</h4>
        <div className="space-y-4">
          {data.navbar.links.map((link, index) => (
            <div key={index} className="flex flex-col gap-2 p-3 border rounded-md">
              <div className="flex items-center gap-2">
                <Input
                  value={link.text}
                  onChange={e => {
                    const updatedLinks = [...data.navbar.links];
                    updatedLinks[index] = { ...link, text: e.target.value };
                    updateData("navbar.links", updatedLinks);
                  }}
                  placeholder="Link Text"
                />
                <Button 
                  variant="destructive" 
                  size="icon"
                  onClick={() => deleteLink(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              <Input
                value={link.url}
                onChange={e => {
                  const updatedLinks = [...data.navbar.links];
                  updatedLinks[index] = { ...link, url: e.target.value };
                  updateData("navbar.links", updatedLinks);
                }}
                placeholder="URL"
              />
              <div className="flex items-center space-x-2">
                <Switch
                  id={`button-link-${index}`}
                  checked={link.isButton || false}
                  onCheckedChange={() => toggleLinkButton(index)}
                />
                <Label htmlFor={`button-link-${index}`}>Show as Button</Label>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={newLinkText}
              onChange={e => setNewLinkText(e.target.value)}
              placeholder="New Link Text"
            />
            <Input
              value={newLinkUrl}
              onChange={e => setNewLinkUrl(e.target.value)}
              placeholder="New Link URL"
            />
          </div>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={addLink}
            disabled={!newLinkText || !newLinkUrl}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Link
          </Button>
        </div>
      </div>
    </div>
  );
} 