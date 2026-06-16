import { assertNever } from '../../lib/fatal-error'
import { t } from '../../lib/i18n'
import { RepositoryListGroup } from './group-repositories'

export const getRepositoryListGroupLabel = (group: RepositoryListGroup) => {
  const { kind } = group
  if (kind === 'enterprise') {
    return group.host
  } else if (kind === 'other') {
    return t('repositories.group.other')
  } else if (kind === 'dotcom') {
    return group.owner.login
  } else if (kind === 'recent') {
    return t('repositories.group.recent')
  } else if (kind === 'group') {
    return group.group.name
  } else {
    assertNever(kind, `Unknown repository group kind ${kind}`)
  }
}
