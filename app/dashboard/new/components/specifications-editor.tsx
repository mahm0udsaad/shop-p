"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Specification {
  name: string
  value: string
}

interface SpecificationsEditorProps {
  specifications: Specification[]
  onChange: (specifications: Specification[]) => void
}

export function SpecificationsEditor({ specifications, onChange }: SpecificationsEditorProps) {
  const handleAddSpecification = () => {
    const newSpecs = [...specifications, { name: "", value: "" }]
    onChange(newSpecs)
  }

  const handleRemoveSpecification = (index: number) => {
    const newSpecs = [...specifications]
    newSpecs.splice(index, 1)
    onChange(newSpecs)
  }

  const handleSpecificationChange = (index: number, field: "name" | "value", value: string) => {
    const newSpecs = [...specifications]
    newSpecs[index][field] = value
    onChange(newSpecs)
  }

  return (
    <div className="space-y-4">
      <Label className="text-[#6F4E37]">Specifications</Label>
      {specifications.map((spec, index) => (
        <div key={index} className="flex gap-4">
          <Input
            value={spec.name}
            onChange={(e) => handleSpecificationChange(index, "name", e.target.value)}
            placeholder="Specification name"
            className="bg-white border-[#A67B5B]/30 w-1/2"
          />
          <Input
            value={spec.value}
            onChange={(e) => handleSpecificationChange(index, "value", e.target.value)}
            placeholder="Specification value"
            className="bg-white border-[#A67B5B]/30 w-1/2"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => handleRemoveSpecification(index)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="border-[#A67B5B]/30 text-[#6F4E37]"
        onClick={handleAddSpecification}
      >
        Add Specification
      </Button>
    </div>
  )
}
