import * as React from 'react'
import { SuccessBanner } from './success-banner'
import { t } from '../../lib/i18n'

export function SuccessfulMerge({
  ourBranch,
  theirBranch,
  onDismissed,
}: {
  readonly ourBranch: string
  readonly theirBranch?: string
  readonly onDismissed: () => void
}) {
  const message =
    theirBranch !== undefined ? (
      <span>
        {t('banners.successfulMerge.merged')} <strong>{theirBranch}</strong>{' '}
        {t('banners.successfulMerge.into')} <strong>{ourBranch}</strong>
      </span>
    ) : (
      <span>
        {t('banners.successfulMerge.mergedInto')} <strong>{ourBranch}</strong>
      </span>
    )

  return (
    <SuccessBanner timeout={5000} onDismissed={onDismissed}>
      <div className="banner-message">{message}</div>
    </SuccessBanner>
  )
}
