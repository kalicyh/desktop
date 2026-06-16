import * as React from 'react'
import { Octicon } from '../../octicons'
import * as octicons from '../../octicons/octicons.generated'
import { LinkButton } from '../link-button'
import { t } from '../../../lib/i18n'

export function renderUnmergedFilesSummary(conflictedFilesCount: number) {
  const message = t('multiCommit.conflicts.conflictedFiles', {
    count: conflictedFilesCount,
  })
  return <h2 className="summary">{message}</h2>
}

export function renderAllResolved() {
  return (
    <div className="all-conflicts-resolved">
      <div className="green-circle">
        <Octicon symbol={octicons.check} />
      </div>
      <div className="message">
        {t('multiCommit.conflicts.allConflictsResolved')}
      </div>
    </div>
  )
}

export function renderShellLink(openThisRepositoryInShell: () => void) {
  return (
    <div>
      <LinkButton onClick={openThisRepositoryInShell}>
        {t('multiCommit.conflicts.openInCommandLine')}
      </LinkButton>{' '}
      {t('multiCommit.conflicts.resolveManuallyHint')}
    </div>
  )
}
