import en from '../locales/json/lang_en.json'
import {
  setLocalizationLanguage,
  translateLocalizationString,
} from '../locales/i18n'

export enum ApplicationLanguage {
  System = 'system',
  English = 'en',
  SimplifiedChinese = 'zh-CN',
}

export type ResolvedApplicationLanguage =
  | ApplicationLanguage.English
  | ApplicationLanguage.SimplifiedChinese

export type TranslationKey = keyof typeof en

type TranslationSubstitutions = Readonly<Record<string, string | number>>

let currentLanguage: ResolvedApplicationLanguage = resolveApplicationLanguage(
  ApplicationLanguage.System
)

setLocalizationLanguage(currentLanguage)

export function resolveApplicationLanguage(
  language: ApplicationLanguage,
  preferredLanguages: ReadonlyArray<string> = getSystemPreferredLanguages()
): ResolvedApplicationLanguage {
  if (language === ApplicationLanguage.English) {
    return ApplicationLanguage.English
  }

  if (language === ApplicationLanguage.SimplifiedChinese) {
    return ApplicationLanguage.SimplifiedChinese
  }

  for (const preferredLanguage of preferredLanguages) {
    const normalized = preferredLanguage.toLowerCase()
    if (normalized === 'zh' || normalized.startsWith('zh-')) {
      return ApplicationLanguage.SimplifiedChinese
    }
  }

  return ApplicationLanguage.English
}

export function getCurrentLanguage(): ResolvedApplicationLanguage {
  return currentLanguage
}

export function setCurrentLanguage(language: ApplicationLanguage) {
  currentLanguage = resolveApplicationLanguage(language)
  setLocalizationLanguage(currentLanguage)
}

export function t(
  key: TranslationKey,
  substitutions: TranslationSubstitutions = {}
): string {
  return translate(key, currentLanguage, substitutions)
}

export function translate(
  key: TranslationKey,
  language: ResolvedApplicationLanguage,
  substitutions: TranslationSubstitutions = {}
): string {
  return translateLocalizationString(key, language, en[key], substitutions)
}

function getSystemPreferredLanguages(): ReadonlyArray<string> {
  if (typeof navigator === 'undefined') {
    return []
  }

  if (navigator.languages.length > 0) {
    return navigator.languages
  }

  return navigator.language ? [navigator.language] : []
}
