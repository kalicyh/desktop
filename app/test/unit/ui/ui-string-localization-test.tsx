import assert from 'node:assert'
import { afterEach, describe, it } from 'node:test'

import { ApplicationLanguage, setCurrentLanguage } from '../../../src/lib/i18n'
import { installUIStringLocalization } from '../../../src/lib/ui-string-localization'

describe('ui string localization', () => {
  afterEach(() => {
    setCurrentLanguage(ApplicationLanguage.English)
    document.body.innerHTML = ''
  })

  it('does not localize diff code text', () => {
    setCurrentLanguage(ApplicationLanguage.SimplifiedChinese)

    document.body.innerHTML = `
      <div class="side-by-side-diff">
        <div class="content-wrapper">Ok</div>
      </div>
      <button>Ok</button>
    `

    installUIStringLocalization()

    assert.equal(document.querySelector('.content-wrapper')?.textContent, 'Ok')
    assert.equal(document.querySelector('button')?.textContent, '确定')
  })
})
