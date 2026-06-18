import { getObject, setObject } from './local-storage'
import type { IGitIdentityRule } from './git/config'

const GitIdentityAvatarCacheKey = 'gitIdentityAvatarCache'

type GitIdentityAvatarCache = Record<string, string>

let gitIdentityAvatarCache: GitIdentityAvatarCache | null = null
const preloadedAvatarImages = new Map<string, HTMLImageElement>()

function getGitIdentityAvatarCache(): GitIdentityAvatarCache {
  if (gitIdentityAvatarCache !== null) {
    return gitIdentityAvatarCache
  }

  if (typeof localStorage === 'undefined') {
    gitIdentityAvatarCache = {}
    return gitIdentityAvatarCache
  }

  const storedCache =
    getObject<GitIdentityAvatarCache>(GitIdentityAvatarCacheKey) ?? {}
  gitIdentityAvatarCache = {}

  for (const [email, avatarURL] of Object.entries(storedCache)) {
    if (typeof avatarURL === 'string' && avatarURL.length > 0) {
      gitIdentityAvatarCache[email.toLowerCase()] = avatarURL
      preloadAvatarURL(avatarURL)
    }
  }

  return gitIdentityAvatarCache
}

function writeGitIdentityAvatarCache(cache: GitIdentityAvatarCache) {
  gitIdentityAvatarCache = cache

  if (typeof localStorage !== 'undefined') {
    setObject(GitIdentityAvatarCacheKey, cache)
  }
}

function preloadAvatarURL(avatarURL: string) {
  if (typeof Image !== 'undefined' && !preloadedAvatarImages.has(avatarURL)) {
    const image = new Image()
    image.src = avatarURL
    preloadedAvatarImages.set(avatarURL, image)
  }
}

export function getCachedGitIdentityAvatarURL(email: string) {
  const avatarURL = getGitIdentityAvatarCache()[email.toLowerCase()]

  if (avatarURL !== undefined) {
    preloadAvatarURL(avatarURL)
  }

  return avatarURL
}

export function setCachedGitIdentityAvatarURL(
  email: string,
  avatarURL: string | null
) {
  const key = email.toLowerCase()
  const nextCache = { ...getGitIdentityAvatarCache() }

  if (avatarURL === null || avatarURL.length === 0) {
    const oldAvatarURL = nextCache[key]
    delete nextCache[key]

    if (oldAvatarURL !== undefined) {
      preloadedAvatarImages.delete(oldAvatarURL)
    }
  } else {
    nextCache[key] = avatarURL
    preloadAvatarURL(avatarURL)
  }

  writeGitIdentityAvatarCache(nextCache)
}

export function cacheGitIdentityAvatarURLs(
  rules: ReadonlyArray<IGitIdentityRule>
) {
  for (const rule of rules) {
    if (rule.avatarURL !== null) {
      setCachedGitIdentityAvatarURL(rule.email, rule.avatarURL)
    }
  }
}
