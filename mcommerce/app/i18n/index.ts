import { notFound } from 'next/navigation'

export const locales = ['tr', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

import trTranslations from './locales/tr.json'
import enTranslations from './locales/en.json'

const translations = {
  tr: trTranslations,
  en: enTranslations,
}

export function getTranslations(locale: Locale) {
  const translation = translations[locale]
  if (!translation) {
    notFound()
  }
  return translation
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

export type TranslationKey = keyof typeof trTranslations

export function getNestedTranslation(
  translations: Record<string, unknown>,
  key: string,
  params?: Record<string, string | number>
): string {
  const keys = key.split('.')
  let value: unknown = translations
  
  for (const k of keys) {
    value = (value as Record<string, unknown>)?.[k]
  }
  
  if (typeof value !== 'string') {
    console.warn(`Translation not found for key: ${key}`)
    return key
  }
  
  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match
    })
  }
  
  return value
}

export function formatCurrency(amount: number, locale: Locale): string {
  const formatters = {
    tr: new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }),
    en: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }),
  }
  
  return formatters[locale].format(amount)
}

export function formatDate(date: Date, locale: Locale): string {
  const formatters = {
    tr: new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    en: new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  }
  
  return formatters[locale].format(date)
}