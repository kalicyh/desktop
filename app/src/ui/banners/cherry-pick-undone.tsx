import * as React from 'react'
import { SuccessBanner } from './success-banner'
import { formatNumber } from '../../lib/format-number'
import { t } from '../../lib/i18n'

interface ICherryPickUndoneBannerProps {
  readonly targetBranchName: string
  readonly countCherryPicked: number
  readonly onDismissed: () => void
}

export class CherryPickUndone extends React.Component<
  ICherryPickUndoneBannerProps,
  {}
> {
  public render() {
    const { countCherryPicked, targetBranchName, onDismissed } = this.props
    return (
      <SuccessBanner timeout={5000} onDismissed={onDismissed}>
        {t('banners.cherryPickUndone.prefix')}{' '}
        {t(
          countCherryPicked === 1
            ? 'banners.cherryPickUndone.removed.one'
            : 'banners.cherryPickUndone.removed.other',
          { count: formatNumber(countCherryPicked) }
        )}{' '}
        <strong>{targetBranchName}</strong>
        {t('banners.cherryPickUndone.suffix')}
      </SuccessBanner>
    )
  }
}
