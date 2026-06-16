import * as React from 'react'
import { Octicon } from '../octicons'
import * as octicons from '../octicons/octicons.generated'
import { Banner } from './banner'
import { Dispatcher } from '../dispatcher'
import { Popup } from '../../models/popup'
import { LinkButton } from '../lib/link-button'
import { t } from '../../lib/i18n'

interface IMergeConflictsBannerProps {
  readonly dispatcher: Dispatcher
  /** branch the user is merging into */
  readonly ourBranch: string
  /** merge conflicts dialog popup to be shown by this banner */
  readonly popup: Popup
  readonly onDismissed: () => void
}

export class MergeConflictsBanner extends React.Component<
  IMergeConflictsBannerProps,
  {}
> {
  private openDialog = () => {
    this.props.onDismissed()
    this.props.dispatcher.showPopup(this.props.popup)
    this.props.dispatcher.incrementMetric('mergeConflictsDialogReopenedCount')
  }
  public render() {
    return (
      <Banner
        id="merge-conflicts-banner"
        dismissable={false}
        onDismissed={this.props.onDismissed}
      >
        <Octicon className="alert-icon" symbol={octicons.alert} />
        <div className="banner-message">
          <span>
            {t('banners.conflicts.resolveAndCommitToMergeInto')}{' '}
            <strong>{this.props.ourBranch}</strong>.
          </span>
          <LinkButton onClick={this.openDialog}>
            {t('banners.conflicts.viewConflicts')}
          </LinkButton>
        </div>
      </Banner>
    )
  }
}
