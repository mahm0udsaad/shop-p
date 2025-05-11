import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AddProductButton() {
  return (
      <Button asChild className="bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37]">
        <Link href="/dashboard/new">
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Link>
      </Button>
  )
} 