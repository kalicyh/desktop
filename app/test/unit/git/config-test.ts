import { describe, it, TestContext } from 'node:test'
import assert from 'node:assert'
import { exec } from 'dugite'
import * as Path from 'path'

import { Repository } from '../../../src/models/repository'
import { getAvatarUserFromAuthor } from '../../../src/models/avatar'
import {
  getConfigValue,
  getGlobalConfigPath,
  getGlobalConfigValue,
  setGlobalConfigValue,
  getGlobalBooleanConfigValue,
  getGlobalGitIdentityRules,
  setGlobalGitIdentityRuleAccountInfo,
  git,
} from '../../../src/lib/git'

import { setupFixtureRepository } from '../../helpers/repositories'
import { realpath } from 'fs/promises'
import { createTempDirectory } from '../../helpers/temp'

describe('git/config', () => {
  describe('config', () => {
    it('looks up config values', async t => {
      const testRepoPath = await setupFixtureRepository(t, 'test-repo')
      const repository = new Repository(testRepoPath, -1, null, false)
      const bare = await getConfigValue(repository, 'core.bare')
      assert.equal(bare, 'false')
    })

    it('returns null for undefined values', async t => {
      const testRepoPath = await setupFixtureRepository(t, 'test-repo')
      const repository = new Repository(testRepoPath, -1, null, false)
      const value = await getConfigValue(repository, 'core.the-meaning-of-life')
      assert(value === null)
    })
  })

  describe('GIT_CONFIG_PARAMETERS', () => {
    it('picks them up', async t => {
      const testRepoPath = await setupFixtureRepository(t, 'test-repo')
      const repository = new Repository(testRepoPath, -1, null, false)

      const withoutEnvOutput = await git(
        ['config', 'desktop.test'],
        repository.path,
        '',
        { successExitCodes: new Set([1]) }
      ).then(x => x.stdout)

      assert.equal(
        withoutEnvOutput.length,
        0,
        'Expected withoutEnvOutput to be empty'
      )
      const withEnvOutput = await git(
        ['config', 'desktop.test'],
        repository.path,
        '',
        { env: { GIT_CONFIG_PARAMETERS: "'desktop.test=1'" } }
      ).then(x => x.stdout)

      assert.equal(withEnvOutput, '1\n')
    })

    it('takes precedence over GIT_CONFIG_*', async t => {
      const testRepoPath = await setupFixtureRepository(t, 'test-repo')
      const repository = new Repository(testRepoPath, -1, null, false)

      const output = await git(['config', 'user.name'], repository.path, '', {
        env: {
          GIT_CONFIG_PARAMETERS: "'user.name=foobar'",
          GIT_CONFIG_COUNT: '1',
          GIT_CONFIG_KEY_0: 'user.name',
          GIT_CONFIG_VALUE_0: 'baz',
        },
      }).then(x => x.stdout)

      assert.equal(output, 'foobar\n')
    })
  })

  describe('global config', () => {
    const setup = async (t: TestContext) => {
      const HOME = await createTempDirectory(t)
      const env = { HOME }
      const expectedConfigPath = Path.normalize(Path.join(HOME, '.gitconfig'))
      const baseArgs = ['config', '-f', expectedConfigPath]

      return { env, expectedConfigPath, baseArgs }
    }

    describe('getGlobalConfigPath', () => {
      it('gets the config path', async t => {
        const { env, expectedConfigPath, baseArgs } = await setup(t)

        // getGlobalConfigPath requires at least one entry, so the
        // test needs to setup an existing config value
        await exec([...baseArgs, 'user.name', 'bar'], __dirname)

        const path = await getGlobalConfigPath(env)
        assert.equal(path, await realpath(expectedConfigPath))
      })
    })

    describe('setGlobalConfigValue', () => {
      it('will replace all entries for a global value', async t => {
        const { env, baseArgs } = await setup(t)
        const key = 'foo.bar'

        await exec([...baseArgs, '--add', key, 'first'], __dirname)
        await exec([...baseArgs, '--add', key, 'second'], __dirname)

        await setGlobalConfigValue(key, 'the correct value', env)
        const value = await getGlobalConfigValue(key, env)
        assert.equal(value, 'the correct value')
      })
    })

    describe('getGlobalBooleanConfigValue', () => {
      const key = 'foo.bar'

      it('treats "false" as false', async t => {
        const { env } = await setup(t)

        await setGlobalConfigValue(key, 'false', env)
        const value = await getGlobalBooleanConfigValue(key, env)
        assert.strictEqual(value, false)
      })

      it('treats "off" as false', async t => {
        const { env } = await setup(t)

        await setGlobalConfigValue(key, 'off', env)
        const value = await getGlobalBooleanConfigValue(key, env)
        assert.strictEqual(value, false)
      })

      it('treats "no" as false', async t => {
        const { env } = await setup(t)

        await setGlobalConfigValue(key, 'no', env)
        const value = await getGlobalBooleanConfigValue(key, env)
        assert.strictEqual(value, false)
      })

      it('treats "0" as false', async t => {
        const { env } = await setup(t)

        await setGlobalConfigValue(key, '0', env)
        const value = await getGlobalBooleanConfigValue(key, env)
        assert.strictEqual(value, false)
      })

      it('treats "true" as true', async t => {
        const { env } = await setup(t)

        await setGlobalConfigValue(key, 'true', env)
        const value = await getGlobalBooleanConfigValue(key, env)
        assert.strictEqual(value, true)
      })

      it('treats "yes" as true', async t => {
        const { env } = await setup(t)

        await setGlobalConfigValue(key, 'yes', env)
        const value = await getGlobalBooleanConfigValue(key, env)
        assert.strictEqual(value, true)
      })

      it('treats "on" as true', async t => {
        const { env } = await setup(t)

        await setGlobalConfigValue(key, 'on', env)
        const value = await getGlobalBooleanConfigValue(key, env)
        assert.strictEqual(value, true)
      })

      it('treats "1" as true', async t => {
        const { env } = await setup(t)

        await setGlobalConfigValue(key, '1', env)
        const value = await getGlobalBooleanConfigValue(key, env)
        assert.strictEqual(value, true)
      })
    })

    describe('getGlobalGitIdentityRules', () => {
      it('returns includeIf remote URL identity rules', async t => {
        const { env, baseArgs } = await setup(t)
        const includePath = Path.join(env.HOME, '.gitconfig-gitea')

        await exec(
          ['config', '-f', includePath, 'user.name', 'Ethan Cheng'],
          __dirname
        )
        await exec(
          ['config', '-f', includePath, 'user.email', 'ethan.cheng@n-hop.com'],
          __dirname
        )

        await exec(
          [
            ...baseArgs,
            '--add',
            'includeIf.hasconfig:remote.*.url:https://gitea.nz.com/**.path',
            includePath,
          ],
          __dirname
        )
        await exec(
          [
            ...baseArgs,
            '--add',
            'includeIf.hasconfig:remote.*.url:https://gitlab.app.n-hop.com/**.path',
            includePath,
          ],
          __dirname
        )
        await exec(
          [
            ...baseArgs,
            'desktopIdentity.ethan.cheng@n-hop.com.avatarURL',
            'https://gitea.nz.com/avatars/ethan',
          ],
          __dirname
        )

        const rules = await getGlobalGitIdentityRules(env)

        assert.deepEqual(rules, [
          {
            pattern: 'https://gitea.nz.com/**',
            host: 'gitea.nz.com',
            configPath: includePath,
            name: 'Ethan Cheng',
            email: 'ethan.cheng@n-hop.com',
            login: null,
            avatarURL: 'https://gitea.nz.com/avatars/ethan',
          },
          {
            pattern: 'https://gitlab.app.n-hop.com/**',
            host: 'gitlab.app.n-hop.com',
            configPath: includePath,
            name: 'Ethan Cheng',
            email: 'ethan.cheng@n-hop.com',
            login: null,
            avatarURL: 'https://gitea.nz.com/avatars/ethan',
          },
        ])
      })

      it('sets and clears desktop account mappings', async t => {
        const { env } = await setup(t)
        const rule = { host: 'gitea.nz.com', email: 'ethan.cheng@n-hop.com' }

        await setGlobalGitIdentityRuleAccountInfo(
          rule,
          'ethan',
          'https://gitea.nz.com/avatars/ethan',
          env
        )
        assert.equal(
          await getGlobalConfigValue('desktopAccount.gitea.nz.com.login', env),
          'ethan'
        )
        assert.equal(
          await getGlobalConfigValue(
            'desktopIdentity.ethan.cheng@n-hop.com.avatarURL',
            env
          ),
          'https://gitea.nz.com/avatars/ethan'
        )

        await setGlobalGitIdentityRuleAccountInfo(rule, '', '', env)
        assert.equal(
          await getGlobalConfigValue('desktopAccount.gitea.nz.com.login', env),
          null
        )
        assert.equal(
          await getGlobalConfigValue(
            'desktopIdentity.ethan.cheng@n-hop.com.avatarURL',
            env
          ),
          null
        )
      })

      it('updates the email avatar cache', async t => {
        const { env } = await setup(t)
        const avatarURL = 'https://gitea.nz.com/avatars/cached'

        await setGlobalGitIdentityRuleAccountInfo(
          { host: 'gitea.nz.com', email: 'cached@example.com' },
          'cached',
          avatarURL,
          env
        )

        const avatarUser = getAvatarUserFromAuthor(
          { name: 'Cached User', email: 'cached@example.com' },
          null
        )

        assert.equal(avatarUser.avatarURL, avatarURL)
      })
    })
  })
})
