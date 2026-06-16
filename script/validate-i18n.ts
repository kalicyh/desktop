import * as fs from 'fs'
import * as path from 'path'

const localeDir = path.join(__dirname, '..', 'app', 'src', 'locales', 'json')
const enPath = path.join(localeDir, 'lang_en.json')
const zhCNPath = path.join(localeDir, 'lang_zh-CN.json')
const domFallbackPath = path.join(
  __dirname,
  '..',
  'app',
  'src',
  'lib',
  'ui-string-localization.ts'
)

type LocaleTable = Record<string, string>

const allowedEnglishTerms = [
  'AI',
  'API',
  'BYOK',
  'Copilot',
  'Enterprise',
  'Git',
  'GitHub',
  'GPG',
  'GPT',
  'HEAD',
  'Hooks',
  'LFS',
  'OAuth',
  'OpenAI',
  'PAT',
  'SAML',
  'SHA',
  'SSH',
  'SSO',
  'Shell',
  'URL',
]

function readLocale(file: string): LocaleTable {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function diffKeys(source: LocaleTable, target: LocaleTable): string[] {
  return Object.keys(source)
    .filter(key => !(key in target))
    .sort()
}

function stripAllowedEnglish(value: string): string {
  return allowedEnglishTerms.reduce(
    (text, term) => text.replace(new RegExp(`\\b${term}\\b`, 'g'), ''),
    value
  )
}

const en = readLocale(enPath)
const zhCN = readLocale(zhCNPath)

const missingInZhCN = diffKeys(en, zhCN)
const extraInZhCN = diffKeys(zhCN, en)
const untranslated = Object.keys(en).filter(key => {
  const value = zhCN[key]
  return value === en[key] && /[A-Za-z]/.test(stripAllowedEnglish(value))
})

const domFallbackSource = fs.existsSync(domFallbackPath)
  ? fs.readFileSync(domFallbackPath, 'utf8')
  : ''
const unsafeNoTranslation = /\[\s*['"]No['"]\s*,\s*['"]无['"]\s*\]/.test(
  domFallbackSource
)

if (
  missingInZhCN.length > 0 ||
  extraInZhCN.length > 0 ||
  untranslated.length > 0 ||
  unsafeNoTranslation
) {
  if (missingInZhCN.length > 0) {
    console.error('Missing zh-CN locale keys:')
    console.error(missingInZhCN.join('\n'))
  }

  if (extraInZhCN.length > 0) {
    console.error('Extra zh-CN locale keys:')
    console.error(extraInZhCN.join('\n'))
  }

  if (untranslated.length > 0) {
    console.error('Potentially untranslated zh-CN locale keys:')
    console.error(untranslated.map(key => `${key}: ${zhCN[key]}`).join('\n'))
  }

  if (unsafeNoTranslation) {
    console.error('Unsafe generic translation detected: No -> 无')
  }

  process.exit(1)
}

console.log(`Validated ${Object.keys(en).length} locale keys.`)
