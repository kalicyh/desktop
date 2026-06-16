import * as React from 'react'
import { assertNever } from '../../lib/fatal-error'
import { ComputedAction } from '../../models/computed-action'
import { MergeTreeResult } from '../../models/merge'
import { Octicon } from '../octicons'
import * as octicons from '../octicons/octicons.generated'
import { t } from '../../lib/i18n'

interface IPullRequestMergeStatusProps {
  /** The result of merging the pull request branch into the base branch */
  readonly mergeStatus: MergeTreeResult | null
}

/** The component to display message about the result of merging the pull
 * request. */
export class PullRequestMergeStatus extends React.Component<IPullRequestMergeStatusProps> {
  private getMergeStatusDescription = () => {
    const { mergeStatus } = this.props
    if (mergeStatus === null) {
      return ''
    }

    const { kind } = mergeStatus
    switch (kind) {
      case ComputedAction.Loading:
        return (
          <span className="pr-merge-status-loading">
            <strong>{t('openPullRequest.mergeStatus.checking')}</strong>{' '}
            {t('openPullRequest.mergeStatus.canStillCreate')}
          </span>
        )
      case ComputedAction.Invalid:
        return (
          <span className="pr-merge-status-invalid">
            <strong>{t('openPullRequest.mergeStatus.error')}</strong>{' '}
            {t('openPullRequest.mergeStatus.unrelatedHistories')}
          </span>
        )
      case ComputedAction.Clean:
        return (
          <span className="pr-merge-status-clean">
            <strong>
              <Octicon symbol={octicons.check} />{' '}
              {t('openPullRequest.mergeStatus.ableToMerge')}
            </strong>{' '}
            {t('openPullRequest.mergeStatus.autoMerge')}
          </span>
        )
      case ComputedAction.Conflicts:
        return (
          <span className="pr-merge-status-conflicts">
            <strong>
              <Octicon symbol={octicons.x} />{' '}
              {t('openPullRequest.mergeStatus.cannotAutoMerge')}
            </strong>{' '}
            {t('openPullRequest.mergeStatus.canStillCreate')}
          </span>
        )
      default:
        return assertNever(kind, `Unknown merge status kind of ${kind}.`)
    }
  }

  public render() {
    return (
      <div className="pull-request-merge-status">
        {this.getMergeStatusDescription()}
      </div>
    )
  }
}
