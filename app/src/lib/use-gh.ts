import { Repository } from '../models/repository'
import { getBoolean, setBoolean } from './local-storage'

export const useGhEnvKey = 'DESKTOP_USE_GH'

const keyForPath = (path: string) => `use-gh:${path}`

export const getUseGhForPath = (path: string) =>
  getBoolean(keyForPath(path), false)

export const setUseGhForPath = (path: string, value: boolean) =>
  setBoolean(keyForPath(path), value)

export const getUseGhForRepository = (repository: Repository) =>
  getUseGhForPath(repository.path)

export const setUseGhForRepository = (repository: Repository, value: boolean) =>
  setUseGhForPath(repository.path, value)
