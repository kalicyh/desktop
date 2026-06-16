import { describe, it } from 'node:test'
import assert from 'node:assert'

import {
  ApplicationLanguage,
  resolveApplicationLanguage,
  setCurrentLanguage,
  t,
} from '../../src/lib/i18n'

describe('i18n', () => {
  it('resolves the system language to Simplified Chinese for zh locales', () => {
    assert.equal(
      resolveApplicationLanguage(ApplicationLanguage.System, ['zh-Hans-CN']),
      ApplicationLanguage.SimplifiedChinese
    )
  })

  it('resolves the system language to English for unsupported locales', () => {
    assert.equal(
      resolveApplicationLanguage(ApplicationLanguage.System, ['fr-FR']),
      ApplicationLanguage.English
    )
  })

  it('uses explicit language selections over the system language', () => {
    assert.equal(
      resolveApplicationLanguage(ApplicationLanguage.English, ['zh-CN']),
      ApplicationLanguage.English
    )
    assert.equal(
      resolveApplicationLanguage(ApplicationLanguage.SimplifiedChinese, [
        'en-US',
      ]),
      ApplicationLanguage.SimplifiedChinese
    )
  })

  it('translates and interpolates strings for the current language', () => {
    setCurrentLanguage(ApplicationLanguage.SimplifiedChinese)
    assert.equal(
      t('repositoryGroups.createForRepositoryDescription', { name: 'desktop' }),
      '为“desktop”选择一个分组名称。'
    )

    setCurrentLanguage(ApplicationLanguage.English)
    assert.equal(
      t('repositoryGroups.createForRepositoryDescription', { name: 'desktop' }),
      'Choose a group name for "desktop".'
    )
  })
})
