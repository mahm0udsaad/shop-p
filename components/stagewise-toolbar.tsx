'use client'

import { useEffect, useState } from 'react'

export function StagewiseToolbar() {
  const [ToolbarComponent, setToolbarComponent] = useState<any>(null)

  useEffect(() => {
    // Only initialize in development mode
    if (process.env.NODE_ENV === 'development') {
      // Dynamic import to avoid including in production bundle
      import('@stagewise/toolbar-next').then(({ StagewiseToolbar }) => {
        setToolbarComponent(() => StagewiseToolbar)
      }).catch((error) => {
        console.warn('Failed to load stagewise toolbar:', error)
      })
    }
  }, [])

  // Only render in development mode and when component is loaded
  if (process.env.NODE_ENV !== 'development' || !ToolbarComponent) {
    return null
  }

  const stagewiseConfig = {
    plugins: []
  }

  return <ToolbarComponent config={stagewiseConfig} />
} 