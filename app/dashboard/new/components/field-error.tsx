interface FieldErrorProps {
  error?: string
}

function FieldError({ error }: FieldErrorProps) {
  if (!error) return null

  return <p className="text-sm text-red-500 mt-1">{error}</p>
}

export default FieldError
