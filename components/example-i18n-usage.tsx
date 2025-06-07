// Example Server Component Usage
import { useTranslation } from '@/lib/i18n/server'

export async function ServerComponentExample({ lng }: { lng: string }) {
  const { t } = await useTranslation(lng)
  
  return (
    <div className="p-4">
      <h1>{t('navigation.dashboard')}</h1>
      <p>{t('dashboard.welcome')}</p>
    </div>
  )
}

// Example Client Component Usage - separate file recommended
// 'use client'
// import { useTranslation } from '@/lib/i18n/client'
// 
// export function ClientComponentExample({ lng }: { lng: string }) {
//   const { t } = useTranslation(lng)
//   
//   return (
//     <div className="p-4">
//       <h1>{t('navigation.dashboard')}</h1>
//       <p>{t('dashboard.welcome')}</p>
//       <button>{t('common.save')}</button>
//     </div>
//   )
// } 