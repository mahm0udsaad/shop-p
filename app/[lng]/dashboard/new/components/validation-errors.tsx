interface ValidationErrorsProps {
  errors: string[]
}

export function ValidationErrors({ errors }: ValidationErrorsProps) {
  if (errors.length === 0) return null

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-6">
      <p className="font-medium mb-1">Please fix the following errors:</p>
      <ul className="list-disc pl-5 text-sm">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  )
}
