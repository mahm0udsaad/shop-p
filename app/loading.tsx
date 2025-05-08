import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-[#6F4E37]" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
} 