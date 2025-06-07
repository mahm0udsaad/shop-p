import { SupabaseConnectionTest } from "@/components/supabase-connection-test"

export default function TestConnectionPage() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>
      <SupabaseConnectionTest />
    </div>
  )
}
