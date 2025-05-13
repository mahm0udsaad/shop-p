'use client'

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteProduct } from "@/app/dashboard/products/actions"
import { useToast } from "@/hooks/use-toast"

interface DeleteProductButtonProps {
  productId: string
  productName: string
}

// Define the return type of deleteProduct
interface DeleteProductResult {
  success: boolean
  error?: string | unknown
  logs?: string[]
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async (event: React.MouseEvent) => {
    // Prevent the default action (closing the dialog)
    event.preventDefault()
    
    setIsDeleting(true)
    setLogs([`Starting deletion process for product: ${productName} ...`])
    
    try {
      const result = await deleteProduct(productId) as DeleteProductResult
      
      if (result.logs && Array.isArray(result.logs)) {
        setLogs(result.logs)
      }
      
      if (result.success) {
        setLogs(prev => [...prev, "Product deleted successfully"])
        toast({
          title: "Success",
          description: "Product deleted successfully",

        })
        router.refresh()
        if (!result.logs?.some((log: string) => log.includes("Error"))) {
          setOpen(false)
        }
      } else {
        const errorMessage = typeof result.error === 'string' ? result.error : 'Failed to delete product'
        setLogs(prev => [...prev, `Error: ${errorMessage}`])
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to delete product"
      setLogs(prev => [...prev, `Exception: ${errorMessage}`])
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="border-destructive/30 text-destructive hover:bg-destructive/5"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{productName}&quot; and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-2">
            <p className="text-sm text-muted-foreground mb-2">This action will delete:</p>
            <ul className="list-disc pl-6 text-sm text-muted-foreground">
              <li>Product showcase page</li>
              <li>Custom domain configuration</li>
              <li>Analytics data</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">This action cannot be undone.</p>
          </div>
          
          {logs.length > 0 && (
            <div className="max-h-32 overflow-y-auto bg-muted p-2 rounded text-xs">
              {logs.map((log, i) => (
                <div key={i} className="mb-1">{log}</div>
              ))}
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Product"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}