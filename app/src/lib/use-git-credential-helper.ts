import { Repository } from '../models/repository'
import { getBoolean, setBoolean } from './local-storage'

export const useGitCredentialHelperEnvKey = 'DESKTOP_USE_GIT_CREDENTIAL_HELPER'

const keyForPath = (path: string) => `use-git-credential-helper:${path}`

export const getUseGitCredentialHelperForPath = (path: string) =>
  getBoolean(keyForPath(path), false)

export const setUseGitCredentialHelperForPath = (
  path: string,
  value: boolean
) => setBoolean(keyForPath(path), value)

export const getUseGitCredentialHelperForRepository = (
  repository: Repository
) => getUseGitCredentialHelperForPath(repository.path)

export const setUseGitCredentialHelperForRepository = (
  repository: Repository,
  value: boolean
) => setUseGitCredentialHelperForPath(repository.path, value)
