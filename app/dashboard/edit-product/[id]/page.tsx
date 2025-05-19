import ProductTemplateEditor from "@/app/components/dashboard/product-template-editor";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const { id: productId } = await props.params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null; // Auth will handle redirect
  }
  
  // Fetch the product details
  const { data: product, error } = await supabase
    .from("products")
    .select("*, domains(subdomain, is_active)")
    .eq("id", productId)
    .eq("user_id", user.id)
    .single();

  if (error || !product) {
    console.error("Error fetching product:", error);
    notFound();
  }
  
  return (
    <div className="container py-6 space-y-8">
      <ProductTemplateEditor product={product} />
    </div>
  );
} 