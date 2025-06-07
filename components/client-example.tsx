'use client'

import { useTranslation } from '@/lib/i18n/client'

export function ClientComponentExample() {
  const { t, lng } = useTranslation()
  
  return (
    <div className="p-4">
      <h1>{t('navigation.dashboard')}</h1>
      <p>{t('dashboard.welcome')}</p>
      <button>{t('common.save')}</button>
      <p className="text-sm text-gray-500">Current language: {lng}</p>
    </div>
  )
} 