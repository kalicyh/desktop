import assert from 'node:assert'
import { describe, it } from 'node:test'

import { getNextVersionTag } from '../../../src/ui/create-tag/create-tag-dialog'

describe('CreateTag', () => {
  describe('getNextVersionTag', () => {
    it('returns null when there are no version tags', () => {
      assert.equal(getNextVersionTag(null), null)
      assert.equal(getNextVersionTag(new Map([['release', 'sha']])), null)
    })

    it('recommends the next patch version for v-prefixed tags', () => {
      assert.equal(
        getNextVersionTag(
          new Map([
            ['v0.1.0', 'sha'],
            ['v0.1.2', 'sha'],
            ['release', 'sha'],
          ])
        ),
        'v0.1.3'
      )
    })

    it('compares version parts numerically', () => {
      assert.equal(
        getNextVersionTag(
          new Map([
            ['v1.9.9', 'sha'],
            ['v1.10.0', 'sha'],
            ['v2.0.0', 'sha'],
          ])
        ),
        'v2.0.1'
      )
    })

    it('keeps non-prefixed version tags non-prefixed', () => {
      assert.equal(getNextVersionTag(new Map([['1.3.2', 'sha']])), '1.3.3')
    })
  })
})
