import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert'
import { join } from 'path'
import {
  RepositoriesStore,
  RepositoryGroupNameTakenError,
} from '../../src/lib/stores/repositories-store'
import { TestRepositoriesDatabase } from '../helpers/databases'
import { IAPIFullRepository, getDotComAPIEndpoint } from '../../src/lib/api'
import { assertIsRepositoryWithGitHubRepository } from '../../src/models/repository'

describe('RepositoriesStore', () => {
  let repoDb = new TestRepositoriesDatabase()
  let repositoriesStore = new RepositoriesStore(repoDb)

  beforeEach(async () => {
    repoDb = new TestRepositoriesDatabase()
    await repoDb.reset()
    repositoriesStore = new RepositoriesStore(repoDb)
  })

  describe('adding a new repository', () => {
    it('contains the added repository', async () => {
      const repoPath = '/some/cool/path'
      await repositoriesStore.addRepository(repoPath, join(repoPath, '.git'))

      const repositories = await repositoriesStore.getAll()
      assert.equal(repositories[0].path, repoPath)
    })
  })

  describe('getting all repositories', () => {
    it('returns multiple repositories', async () => {
      await repositoriesStore.addRepository(
        '/some/cool/path',
        '/some/cool/path/.git'
      )
      await repositoriesStore.addRepository(
        '/some/other/path',
        '/some/other/path/.git'
      )

      const repositories = await repositoriesStore.getAll()
      assert.equal(repositories.length, 2)
    })
  })

  describe('repository groups and favorites', () => {
    it('persists a repository favorite marker', async () => {
      const repoPath = '/some/cool/path'
      const repository = await repositoriesStore.addRepository(
        repoPath,
        join(repoPath, '.git')
      )

      await repositoriesStore.updateRepositoryFavorite(repository, true)

      const repositories = await repositoriesStore.getAll()
      assert.equal(repositories[0].isFavorite, true)
      assert.equal(repositories[0].groupId, null)
    })

    it('persists custom repository groups and memberships', async () => {
      const repoPath = '/some/cool/path'
      const repository = await repositoriesStore.addRepository(
        repoPath,
        join(repoPath, '.git')
      )
      const group = await repositoriesStore.addRepositoryGroup('Client Work')

      await repositoriesStore.updateRepositoryGroup(repository, group.id)

      const repositories = await repositoriesStore.getAll()
      assert.equal(repositories[0].groupId, group.id)

      const groups = await repositoriesStore.getAllRepositoryGroups()
      assert.equal(groups.length, 1)
      assert.equal(groups[0].name, 'Client Work')
    })

    it('rejects duplicate repository group names case-insensitively', async () => {
      await repositoriesStore.addRepositoryGroup('Client Work')

      await assert.rejects(
        repositoriesStore.addRepositoryGroup(' client work '),
        RepositoryGroupNameTakenError
      )
    })

    it('renames repository groups and preserves order', async () => {
      const first = await repositoriesStore.addRepositoryGroup('First')
      const second = await repositoriesStore.addRepositoryGroup('Second')

      await repositoriesStore.renameRepositoryGroup(second.id, 'Renamed')

      const groups = await repositoriesStore.getAllRepositoryGroups()
      assert.equal(groups.length, 2)
      assert.equal(groups[0].id, first.id)
      assert.equal(groups[0].name, 'First')
      assert.equal(groups[1].id, second.id)
      assert.equal(groups[1].name, 'Renamed')
    })

    it('removing a repository group clears memberships but keeps favorites', async () => {
      const repoPath = '/some/cool/path'
      const repository = await repositoriesStore.addRepository(
        repoPath,
        join(repoPath, '.git')
      )
      const group = await repositoriesStore.addRepositoryGroup('Client Work')

      await repositoriesStore.updateRepositoryGroup(repository, group.id)
      await repositoriesStore.updateRepositoryFavorite(repository, true)
      await repositoriesStore.removeRepositoryGroup(group.id)

      const repositories = await repositoriesStore.getAll()
      assert.equal(repositories[0].groupId, null)
      assert.equal(repositories[0].isFavorite, true)

      const groups = await repositoriesStore.getAllRepositoryGroups()
      assert.equal(groups.length, 0)
    })
  })

  describe('updating a GitHub repository', () => {
    const apiRepo: IAPIFullRepository = {
      clone_url: 'https://github.com/my-user/my-repo',
      ssh_url: 'git@github.com:my-user/my-repo.git',
      html_url: 'https://github.com/my-user/my-repo',
      name: 'my-repo',
      owner: {
        id: 42,
        html_url: 'https://github.com/my-user',
        login: 'my-user',
        avatar_url: 'https://github.com/my-user.png',
        type: 'User',
      },
      private: true,
      fork: false,
      default_branch: 'master',
      pushed_at: '1995-12-17T03:24:00',
      has_issues: true,
      archived: false,
      permissions: {
        pull: true,
        push: true,
        admin: false,
      },
      parent: undefined,
    }
    const endpoint = getDotComAPIEndpoint()

    it('adds a new GitHub repository', async () => {
      await repositoriesStore.setGitHubRepository(
        await repositoriesStore.addRepository(
          '/some/cool/path',
          '/some/cool/path/.git'
        ),
        await repositoriesStore.upsertGitHubRepository(endpoint, apiRepo)
      )

      const repositories = await repositoriesStore.getAll()
      const repo = repositories[0]
      assertIsRepositoryWithGitHubRepository(repo)
      assert(repo.gitHubRepository.isPrivate)
      assert(!repo.gitHubRepository.fork)
      assert.equal(
        repo.gitHubRepository.htmlURL,
        'https://github.com/my-user/my-repo'
      )
    })

    it('reuses an existing GitHub repository', async () => {
      const firstRepo = await repositoriesStore.setGitHubRepository(
        await repositoriesStore.addRepository(
          '/some/cool/path',
          '/some/cool/path/.git'
        ),
        await repositoriesStore.upsertGitHubRepository(endpoint, apiRepo)
      )

      const secondRepo = await repositoriesStore.setGitHubRepository(
        await repositoriesStore.addRepository(
          '/some/other/path',
          '/some/other/path/.git'
        ),
        await repositoriesStore.upsertGitHubRepository(endpoint, apiRepo)
      )

      assert.equal(
        firstRepo.gitHubRepository.dbID,
        secondRepo.gitHubRepository.dbID
      )
    })
  })
})
