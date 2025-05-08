"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"

interface SizeEditorProps {
  initialSizes?: string[]
  onChange: (sizes: string[]) => void
}

export function SizeEditor({ initialSizes = [], onChange }: SizeEditorProps) {
  const [sizes, setSizes] = useState<string[]>(initialSizes)
  const [newSize, setNewSize] = useState("")

  const addSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      const updatedSizes = [...sizes, newSize.trim()]
      setSizes(updatedSizes)
      onChange(updatedSizes)
      setNewSize("")
    }
  }

  const removeSize = (index: number) => {
    const updatedSizes = sizes.filter((_, i) => i !== index)
    setSizes(updatedSizes)
    onChange(updatedSizes)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSize()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label htmlFor="new-size">Add Size</Label>
          <Input
            id="new-size"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., S, M, L, XL, 42, 44"
          />
        </div>
        <Button type="button" onClick={addSize} size="icon">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add Size</span>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {sizes.map((size, index) => (
          <div key={index} className="flex items-center rounded-md bg-muted px-3 py-1 text-sm">
            <span>{size}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-1 h-5 w-5 p-0"
              onClick={() => removeSize(index)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {size}</span>
            </Button>
          </div>
        ))}
        {sizes.length === 0 && <p className="text-sm text-muted-foreground">No sizes added yet.</p>}
      </div>
    </div>
  )
}
