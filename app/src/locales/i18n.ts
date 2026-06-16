import i18next from 'i18next'

import en from './json/lang_en.json'
import zhCN from './json/lang_zh-CN.json'

export const defaultLanguage = 'en'
export const simplifiedChineseLanguage = 'zh-CN'

export const localizationResources = {
  [defaultLanguage]: {
    translation: en,
  },
  [simplifiedChineseLanguage]: {
    translation: zhCN,
  },
} as const

void i18next.init({
  lng: defaultLanguage,
  fallbackLng: defaultLanguage,
  resources: localizationResources,
  interpolation: {
    escapeValue: false,
    prefix: '{',
    suffix: '}',
  },
  keySeparator: false,
  nsSeparator: false,
  returnEmptyString: false,
  initImmediate: false,
})

export function setLocalizationLanguage(language: string) {
  if (i18next.language !== language) {
    void i18next.changeLanguage(language)
  }
}

export function translateLocalizationString(
  key: string,
  language: string,
  defaultValue: string,
  substitutions: Readonly<Record<string, string | number>> = {}
): string {
  const result = i18next.t(key, {
    ...substitutions,
    lng: language,
    defaultValue,
  })

  return typeof result === 'string' ? result : defaultValue
}
