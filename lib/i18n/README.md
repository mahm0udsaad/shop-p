# Internationalization (i18n) Setup

This project uses `i18next` with `react-i18next` for internationalization, supporting English (EN) and Arabic (AR) languages.

## Structure

```
lib/i18n/
├── index.ts          # Main configuration
├── client.ts         # Client-side i18n setup
├── server.ts         # Server-side i18n setup
└── locales/
    ├── en/
    │   └── common.json
    └── ar/
        └── common.json
```

## Usage

### Server Components
```tsx
import { useTranslation } from '@/lib/i18n/server'

export default async function MyComponent({ 
  params: { lng } 
}: { 
  params: { lng: string } 
}) {
  const { t } = await useTranslation(lng)
  
  return <h1>{t('navigation.dashboard')}</h1>
}
```

### Client Components
```tsx
'use client'
import { useTranslation } from '@/lib/i18n/client'

export function MyComponent() {
  const { t, lng } = useTranslation()
  
  return (
    <div>
      <button>{t('common.save')}</button>
      <p>Current language: {lng}</p>
    </div>
  )
}
```

## URL Structure

- English: `/en/dashboard`
- Arabic: `/ar/dashboard`

## Language Detection

The language is automatically detected from the URL pathname:
- Client components: Use `useTranslation()` hook (no props needed)
- Server components: Pass `lng` from params to `useTranslation(lng)`
- Language switching: Updates the URL to change language

## RTL Support

Arabic language automatically applies RTL (right-to-left) direction:
- Layout direction is set via `dir="rtl"` on `<html>`
- CSS utilities for RTL support are available
- Tailwind RTL plugin provides additional utilities

## Adding New Languages

1. Add language code to `languages` array in `lib/i18n/index.ts`
2. Create translation file: `lib/i18n/locales/{lang}/common.json`
3. Update middleware `locales` array
4. Add language name to `LanguageSwitcher` component

## Translation Files

Translation files use nested JSON structure:
```json
{
  "navigation": {
    "home": "Home",
    "dashboard": "Dashboard"
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

## Features

- ✅ Server-side rendering support
- ✅ Client-side hydration
- ✅ Language detection from URL
- ✅ RTL support for Arabic
- ✅ Language switcher component
- ✅ Fallback to English
- ✅ Auto-detection (no props needed for client components) 