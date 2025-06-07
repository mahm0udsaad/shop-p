"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Check, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface DomainValidatorProps {
  value: string
  onChange: (value: string) => void
  error?: string
  className?: string
  onValidationChange?: (isAvailable: boolean | null, isChecking: boolean) => void
}

export function DomainValidator({ value, onChange, error, className, onValidationChange }: DomainValidatorProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [checkError, setCheckError] = useState<string | null>(null)
  const lastValidatedDomain = useRef<string>("")

  // Reset validation state only for significant changes
  useEffect(() => {
    // Skip validation reset if the domain was already validated and the change is minor
    // (e.g., adding a character to an already valid domain)
    if (!value) {
      setIsAvailable(null)
      setCheckError(null)
      if (onValidationChange) {
        onValidationChange(null, false)
      }
      lastValidatedDomain.current = ""
      return
    }

    // Only reset validation if the domain has substantially changed
    // For example, if the user is typing a completely new domain
    if (lastValidatedDomain.current && (
        // Check if the new value isn't a simple extension of the validated domain
        // and it's not just removing characters from the end
        !value.startsWith(lastValidatedDomain.current) && 
        !lastValidatedDomain.current.startsWith(value)
    )) {
      setIsAvailable(null)
      setCheckError(null)
      if (onValidationChange) {
        onValidationChange(null, false)
      }
    }
  }, [value, onValidationChange])

  // Debounce the domain check
  useEffect(() => {
    if (!value || value.length < 3) return

    const timer = setTimeout(async () => {
      await checkDomainAvailability(value)
    }, 500)

    return () => clearTimeout(timer)
  }, [value])

  const checkDomainAvailability = async (domain: string) => {
    if (!domain || domain.length < 3) return

    setIsChecking(true)
    setCheckError(null)
    if (onValidationChange) {
      onValidationChange(null, true)
    }

    try {
      const response = await fetch(`/api/check-domain?domain=${encodeURIComponent(domain)}`)
      const data = await response.json()

      if (response.ok) {
        // If data.available is true, it means the domain was not found in the database
        setIsAvailable(data.available)
        if (data.available) {
          lastValidatedDomain.current = domain
        }
        if (onValidationChange) {
          onValidationChange(data.available, false)
        }
      } else {
        setCheckError(data.error || "Failed to check domain availability")
        setIsAvailable(null)
        if (onValidationChange) {
          onValidationChange(null, false)
        }
      }
    } catch (error) {
      console.error("Error checking domain:", error)
      setCheckError("An error occurred while checking domain availability")
      setIsAvailable(null)
      if (onValidationChange) {
        onValidationChange(null, false)
      }
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="your-domain"
          className={cn(
            "pr-32",
            error ? "border-red-500 focus-visible:ring-red-500" : "",
            isAvailable === true ? "border-green-500 focus-visible:ring-green-500" : "",
          )}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-sm text-gray-500">.productshowcase.com</span>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <>
          {isChecking && (
            <p className="text-sm text-gray-500 flex items-center">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Checking availability...
            </p>
          )}

          {isAvailable === true && !isChecking && (
            <p className="text-sm text-green-600 flex items-center">
              <Check className="h-3 w-3 mr-1" />
              Domain is available!
            </p>
          )}

          {isAvailable === false && !isChecking && (
            <p className="text-sm text-red-500 flex items-center">
              <X className="h-3 w-3 mr-1" />
              Domain is already taken. Please try another.
            </p>
          )}

          {checkError && !isChecking && <p className="text-sm text-red-500">{checkError}</p>}
        </>
      )}
    </div>
  )
}
