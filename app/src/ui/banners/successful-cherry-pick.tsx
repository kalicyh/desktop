import * as React from 'react'
import { SuccessBanner } from './success-banner'
import { formatNumber } from '../../lib/format-number'
import { t } from '../../lib/i18n'

interface ISuccessfulCherryPickBannerProps {
  readonly targetBranchName: string
  readonly countCherryPicked: number
  readonly onDismissed: () => void
  readonly onUndo: () => void
}

export class SuccessfulCherryPick extends React.Component<
  ISuccessfulCherryPickBannerProps,
  {}
> {
  public render() {
    const { countCherryPicked, onDismissed, onUndo, targetBranchName } =
      this.props

    return (
      <SuccessBanner timeout={15000} onDismissed={onDismissed} onUndo={onUndo}>
        <span>
          {t(
            countCherryPicked === 1
              ? 'banners.successfulCherryPick.prefix.one'
              : 'banners.successfulCherryPick.prefix.other',
            { count: formatNumber(countCherryPicked) }
          )}{' '}
          <strong>{targetBranchName}</strong>
          {t('banners.successfulCherryPick.suffix')}
        </span>
      </SuccessBanner>
    )
  }
}
