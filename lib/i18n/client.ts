'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import i18next from 'i18next'
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { getOptions, languages, fallbackLng } from './index'

const runsOnServerSide = typeof window === 'undefined'

//
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
  .init({
    ...getOptions(),
    lng: undefined, // let detect the language on client side
    detection: {
      order: ['path', 'htmlTag', 'navigator'],
    },
    preload: runsOnServerSide ? languages : []
  })

export default i18next

// Hook to get current language from URL
export function useCurrentLanguage(): string {
  const pathname = usePathname()
  
  // Extract language from pathname (e.g., /en/dashboard -> en)
  const segments = pathname.split('/')
  const potentialLang = segments[1]
  
  // Check if it's a valid language, otherwise return fallback
  if (languages.includes(potentialLang)) {
    return potentialLang
  }
  
  return fallbackLng
}

export function useTranslation(ns?: string, options?: any) {
  const currentLang = useCurrentLanguage()
  const ret = useTranslationOrg(ns, options)
  const { i18n } = ret
  
  if (runsOnServerSide && currentLang && i18n.resolvedLanguage !== currentLang) {
    i18n.changeLanguage(currentLang)
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage)
    useEffect(() => {
      if (activeLng === i18n.resolvedLanguage) return
      setActiveLng(i18n.resolvedLanguage)
    }, [activeLng, i18n.resolvedLanguage])
    useEffect(() => {
      if (!currentLang || i18n.resolvedLanguage === currentLang) return
      i18n.changeLanguage(currentLang)
    }, [currentLang, i18n])
  }
  return { ...ret, lng: currentLang }
} 