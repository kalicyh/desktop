import { t } from '../../../lib/i18n'

export function getLocalizedMultiCommitOperation(operation: string): string {
  switch (operation.toLowerCase()) {
    case 'merge':
      return t('multiCommit.operation.merge')
    case 'rebase':
      return t('multiCommit.operation.rebase')
    case 'cherry-pick':
      return t('multiCommit.operation.cherryPick')
    case 'squash':
      return t('multiCommit.operation.squash')
    case 'reorder':
      return t('multiCommit.operation.reorder')
    case 'amend':
      return t('multiCommit.operation.amend')
    default:
      return operation
  }
}
