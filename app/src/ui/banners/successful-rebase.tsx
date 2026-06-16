import * as React from 'react'
import { SuccessBanner } from './success-banner'
import { t } from '../../lib/i18n'

export function SuccessfulRebase({
  baseBranch,
  targetBranch,
  onDismissed,
}: {
  readonly baseBranch?: string
  readonly targetBranch: string
  readonly onDismissed: () => void
}) {
  const message =
    baseBranch !== undefined ? (
      <span>
        {t('banners.successfulRebase.rebased')} <strong>{targetBranch}</strong>{' '}
        {t('banners.successfulRebase.onto')} <strong>{baseBranch}</strong>
      </span>
    ) : (
      <span>
        {t('banners.successfulRebase.rebased')} <strong>{targetBranch}</strong>
      </span>
    )

  return (
    <SuccessBanner timeout={5000} onDismissed={onDismissed}>
      <div className="banner-message">{message}</div>
    </SuccessBanner>
  )
}
