"use server"

import { createClient } from "@/lib/supabase/server";
import { deleteProduct as baseDeleteProduct } from "@/app/actions/product";
import type { Database } from "@/lib/database.types";

// Update product details
export async function updateProduct(productId: string, formData: FormData) {
  try {
    const supabase = await createClient();
    // Build update object from formData
    const updateData: Partial<Database["public"]["Tables"]["products"]["Update"]> = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: formData.get("price") ? Number(formData.get("price")) : undefined,
      template: formData.get("template") as string,
      published: formData.get("published") === "true",
    };
    // Remove undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key as keyof typeof updateData] === undefined && delete updateData[key as keyof typeof updateData]
    );
    const { error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", productId);
    if (error) {
      return { error: error.message };
    }
    return { success: true };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

// Toggle published status
export async function toggleProductPublished(productId: string, published: boolean) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("products")
      .update({ published })
      .eq("id", productId);
    if (error) {
      return { error: error.message };
    }
    return { success: true };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

// Re-export deleteProduct
export const deleteProduct = baseDeleteProduct; 