"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabaseClient } from "@/lib/supabase/client"
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase/config"

export function SupabaseConnectionTest() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const testConnection = async () => {
    setStatus("loading")
    setMessage("Testing connection to Supabase...")

    try {
      // Simple query to test the connection
      const { data, error } = await supabaseClient.from("profiles").select("count()", { count: "exact" })

      if (error) throw error

      setStatus("success")
      setMessage(`Connection successful! Found ${data.count} profiles.`)
    } catch (error) {
      console.error("Connection test failed:", error)
      setStatus("error")
      setMessage(`Connection failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
        <CardDescription>Test your connection to Supabase</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-[120px_1fr] gap-2">
            <div className="font-medium">URL:</div>
            <div className="truncate">{supabaseUrl || "Not configured"}</div>

            <div className="font-medium">Anon Key:</div>
            <div className="truncate">
              {supabaseAnonKey
                ? `${supabaseAnonKey.substring(0, 5)}...${supabaseAnonKey.substring(supabaseAnonKey.length - 5)}`
                : "Not configured"}
            </div>
          </div>

          {status !== "idle" && (
            <div
              className={`p-3 rounded-md ${
                status === "loading"
                  ? "bg-blue-50 text-blue-700"
                  : status === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={testConnection} disabled={status === "loading"} className="w-full">
          {status === "loading" ? "Testing..." : "Test Connection"}
        </Button>
      </CardFooter>
    </Card>
  )
}
