"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface ColorSelectorProps {
  colors: Array<{ name: string; hex: string }>
  onChange: (colors: Array<{ name: string; hex: string }>) => void
}

export function ColorSelector({ colors = [], onChange }: ColorSelectorProps) {
  const [colorName, setColorName] = useState("")
  const [colorHex, setColorHex] = useState("#000000")

  const handleAddColor = () => {
    if (!colorName) return

    const newColors = [...colors, { name: colorName, hex: colorHex }]
    onChange(newColors)
    setColorName("")
    setColorHex("#000000")
  }

  const handleRemoveColor = (index: number) => {
    const newColors = [...colors]
    newColors.splice(index, 1)
    onChange(newColors)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-2">
        {colors.map((color, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-white rounded-full pl-2 pr-1 py-1 border border-[#A67B5B]/30"
          >
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.hex }}></div>
            <span className="text-sm">{color.name}</span>
            <button
              type="button"
              onClick={() => handleRemoveColor(index)}
              className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-gray-100"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {colors.length === 0 && <div className="text-sm text-[#A67B5B] py-1">No colors added yet</div>}
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Color name (e.g. Red)"
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
            className="bg-white border-[#A67B5B]/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="color"
            value={colorHex}
            onChange={(e) => setColorHex(e.target.value)}
            className="w-12 p-1 h-10"
          />
          <Button
            type="button"
            onClick={handleAddColor}
            disabled={!colorName}
            size="sm"
            className="bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37]"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}
