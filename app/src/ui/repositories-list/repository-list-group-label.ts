import { assertNever } from '../../lib/fatal-error'
import { t } from '../../lib/i18n'
import { RepositoryListGroup } from './group-repositories'

export const getRepositoryListGroupLabel = (
  group: RepositoryListGroup,
  qualifyAccount = true
) => {
  if (group.kind === 'recent') {
    return t('repositories.group.recent')
  }
  if (group.kind === 'group') {
    return group.group.name
  }

  const qualifier =
    qualifyAccount && group.accountLogin !== undefined
      ? ` — ${
          group.accountLogin === null
            ? t('repositories.group.unassociated')
            : `@${group.accountLogin}`
        }`
      : ''
  const { kind } = group
  if (kind === 'enterprise') {
    return group.host + qualifier
  } else if (kind === 'other') {
    return t('repositories.group.other') + qualifier
  } else if (kind === 'dotcom') {
    return group.owner.login + qualifier
  } else {
    assertNever(kind, `Unknown repository group kind ${kind}`)
  }
}
