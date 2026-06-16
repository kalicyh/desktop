import * as React from 'react'
import { APICheckConclusion } from '../../lib/api'
import { IRefCheck } from '../../lib/ci-checks/ci-checks'
import { IMenuItem, showContextualMenu } from '../../lib/menu-item'
import { Button } from '../lib/button'
import { Octicon, syncClockwise } from '../octicons'
import * as octicons from '../octicons/octicons.generated'
import { t } from '../../lib/i18n'

interface ICICheckReRunButtonProps {
  readonly disabled: boolean
  readonly checkRuns: ReadonlyArray<IRefCheck>
  readonly canReRunFailed: boolean
  readonly onRerunChecks: (failedOnly: boolean) => void
}

export class CICheckReRunButton extends React.PureComponent<ICICheckReRunButtonProps> {
  private get failedChecksExist() {
    return this.props.checkRuns.some(
      cr => cr.conclusion === APICheckConclusion.Failure
    )
  }

  private onRerunChecks = () => {
    if (!this.props.canReRunFailed || !this.failedChecksExist) {
      this.props.onRerunChecks(false)
      return
    }

    const items: IMenuItem[] = [
      {
        label: t('checkRuns.rerun.failedChecks'),
        action: () => this.props.onRerunChecks(true),
      },
      {
        label: t('checkRuns.rerun.allChecks'),
        action: () => this.props.onRerunChecks(false),
      },
    ]

    showContextualMenu(items)
  }

  private onRerunKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!this.props.canReRunFailed || !this.failedChecksExist) {
      return
    }

    if (event.key === 'ArrowDown') {
      this.onRerunChecks()
    }
  }

  public render() {
    const text =
      this.props.canReRunFailed && this.failedChecksExist ? (
        <>
          {t('checkRuns.rerun.short')}{' '}
          <Octicon symbol={octicons.triangleDown} />
        </>
      ) : (
        t('checkRuns.rerun.checks')
      )
    return (
      <Button
        onClick={this.onRerunChecks}
        onKeyDown={this.onRerunKeyDown}
        disabled={this.props.disabled}
      >
        <Octicon symbol={syncClockwise} /> {text}
      </Button>
    )
  }
}
