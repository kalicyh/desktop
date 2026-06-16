import * as React from 'react'
import { SuccessBanner } from './success-banner'
import { formatNumber } from '../../lib/format-number'
import { t } from '../../lib/i18n'

interface ISuccessfulSquashedBannerProps {
  readonly count: number
  readonly onDismissed: () => void
  readonly onUndo: () => void
}

export class SuccessfulSquash extends React.Component<
  ISuccessfulSquashedBannerProps,
  {}
> {
  public render() {
    const { count, onDismissed, onUndo } = this.props

    return (
      <SuccessBanner timeout={15000} onDismissed={onDismissed} onUndo={onUndo}>
        <span>
          {t(
            count === 1
              ? 'banners.successfulSquash.one'
              : 'banners.successfulSquash.other',
            { count: formatNumber(count) }
          )}
        </span>
      </SuccessBanner>
    )
  }
}
