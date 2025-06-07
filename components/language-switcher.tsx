'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { languages } from '@/lib/i18n'
import { useCurrentLanguage } from '@/lib/i18n/client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'

const languageNames = {
  en: 'English',
  ar: 'العربية'
}

export function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const currentLang = useCurrentLanguage()

  const switchLanguage = (newLang: string) => {
    // Remove current language from pathname and add new one
    const segments = pathname.split('/')
    segments[1] = newLang
    const newPath = segments.join('/')
    
    router.push(newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Globe className="h-4 w-4 mr-2" />
          {languageNames[currentLang as keyof typeof languageNames] || currentLang}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => switchLanguage(lang)}
            className={currentLang === lang ? 'bg-accent' : ''}
          >
            {languageNames[lang as keyof typeof languageNames]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 