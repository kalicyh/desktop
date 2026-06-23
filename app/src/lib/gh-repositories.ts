import { Account } from '../models/account'
import { execFile } from './exec-file'
import { getHTMLURL, IAPIRepository } from './api'

const GhCommands = ['gh', '/opt/homebrew/bin/gh', '/usr/local/bin/gh']

const isAPIRepository = (value: unknown): value is IAPIRepository => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const repo = value as Partial<IAPIRepository>
  const owner = repo.owner as Partial<IAPIRepository['owner']> | null

  return (
    typeof repo.clone_url === 'string' &&
    typeof repo.ssh_url === 'string' &&
    typeof repo.html_url === 'string' &&
    typeof repo.name === 'string' &&
    owner !== undefined &&
    owner !== null &&
    typeof owner.login === 'string'
  )
}

export async function getRepositoriesFromGh(
  account: Account
): Promise<ReadonlyArray<IAPIRepository>> {
  const hostname = new URL(getHTMLURL(account.endpoint)).hostname
  const args = [
    'api',
    'user/repos?affiliation=owner,collaborator,organization_member&per_page=100',
    '--hostname',
    hostname,
    '--paginate',
    '--slurp',
  ]
  let lastError: unknown = null

  for (const command of GhCommands) {
    const { repositories, error } = await getRepositoriesFromGhCommand(
      command,
      args
    )
    if (repositories !== null) {
      return repositories
    }
    lastError = error
  }

  log.warn(
    'Unable to load cloneable repositories from gh',
    lastError instanceof Error ? lastError : undefined
  )
  return []
}

async function getRepositoriesFromGhCommand(
  command: string,
  args: ReadonlyArray<string>
): Promise<{
  readonly repositories: ReadonlyArray<IAPIRepository> | null
  readonly error: unknown
}> {
  try {
    const { stdout } = await execFile(command, args, {
      maxBuffer: 50 * 1024 * 1024,
      timeout: 60_000,
    })

    const pages = JSON.parse(stdout)
    if (!Array.isArray(pages)) {
      return { repositories: [], error: null }
    }

    return { repositories: pages.flat().filter(isAPIRepository), error: null }
  } catch (e) {
    return { repositories: null, error: e }
  }
}
