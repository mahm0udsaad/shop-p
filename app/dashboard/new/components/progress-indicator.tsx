interface ProgressIndicatorProps {
  step: number
  steps: string[]
}

export function ProgressIndicator({ step, steps }: ProgressIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="relative flex justify-between mb-6">
        {/* Progress bar background */}
        <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-gray-200"></div>

        {/* Active progress bar */}
        <div
          className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-[#ECB176] transition-all duration-300 ease-in-out"
          style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Step circles */}
        {steps.map((stepName, index) => (
          <div key={index} className="relative z-10 flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                index <= step ? "border-[#ECB176] bg-[#ECB176] text-white" : "border-gray-300 bg-white text-gray-400"
              }`}
            >
              {index < step ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <span
              className={`absolute mt-10 w-max text-center text-sm ${
                index <= step ? "font-medium text-[#6F4E37]" : "text-gray-500"
              }`}
              style={{ transform: "translateX(-50%)", left: "50%" }}
            >
              {stepName}
            </span>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-[#A67B5B] mt-12">
        Complete all steps to create your professional product page
      </p>
    </div>
  )
}
