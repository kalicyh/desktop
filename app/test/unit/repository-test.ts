import { describe, it } from 'node:test'
import assert from 'node:assert'
import { Repository } from '../../src/models/repository'

describe('Repository', () => {
  describe('name', () => {
    it('uses the last path component as the name', async () => {
      const repoPath = '/some/cool/path'
      const repository = new Repository(repoPath, -1, null, false)
      assert.equal(repository.name, 'path')
    })

    it('handles repository at root of the drive', async () => {
      const repoPath = 'T:\\'
      const repository = new Repository(repoPath, -1, null, false)
      assert.equal(repository.name, 'T:\\')
    })
  })

  describe('hash', () => {
    it('changes when group membership changes', async () => {
      const ungrouped = new Repository('/some/cool/path', -1, null, false)
      const grouped = new Repository(
        '/some/cool/path',
        -1,
        null,
        false,
        null,
        {},
        false,
        undefined,
        1
      )

      assert.notEqual(ungrouped.hash, grouped.hash)
    })

    it('changes when favorite state changes', async () => {
      const regular = new Repository('/some/cool/path', -1, null, false)
      const favorite = new Repository(
        '/some/cool/path',
        -1,
        null,
        false,
        null,
        {},
        false,
        undefined,
        null,
        true
      )

      assert.notEqual(regular.hash, favorite.hash)
    })
  })
})
