import * as React from 'react'
import { Dialog, DialogContent, DialogFooter } from '../dialog'
import { Repository } from '../../models/repository'
import { Dispatcher } from '../dispatcher'
import { Row } from '../lib/row'
import { Checkbox, CheckboxValue } from '../lib/checkbox'
import { OkCancelButtonGroup } from '../dialog/ok-cancel-button-group'
import { Commit } from '../../models/commit'
import { t } from '../../lib/i18n'

interface IWarnLocalChangesBeforeUndoProps {
  readonly dispatcher: Dispatcher
  readonly repository: Repository
  readonly commit: Commit
  readonly isWorkingDirectoryClean: boolean
  readonly confirmUndoCommit: boolean
  readonly onDismissed: () => void
}

interface IWarnLocalChangesBeforeUndoState {
  readonly isLoading: boolean
  readonly confirmUndoCommit: boolean
}

/**
 * Dialog that alerts user that there are uncommitted changes in the working
 * directory where they are gonna be undoing a commit.
 */
export class WarnLocalChangesBeforeUndo extends React.Component<
  IWarnLocalChangesBeforeUndoProps,
  IWarnLocalChangesBeforeUndoState
> {
  public constructor(props: IWarnLocalChangesBeforeUndoProps) {
    super(props)
    this.state = {
      isLoading: false,
      confirmUndoCommit: props.confirmUndoCommit,
    }
  }

  public render() {
    return (
      <Dialog
        id="warn-local-changes-before-undo"
        type="warning"
        title={t('undoCommit.warning.title')}
        loading={this.state.isLoading}
        disabled={this.state.isLoading}
        onSubmit={this.onSubmit}
        onDismissed={this.props.onDismissed}
        role="alertdialog"
        ariaDescribedBy="undo-warning-message"
      >
        {this.getWarningDialog()}
        <DialogFooter>
          <OkCancelButtonGroup
            destructive={true}
            okButtonText={t('common.continue')}
          />
        </DialogFooter>
      </Dialog>
    )
  }

  private getWarningDialog() {
    if (this.props.commit.isMergeCommit) {
      return this.getMergeCommitWarningDialog()
    }
    return (
      <DialogContent>
        <Row id="undo-warning-message">
          {t('undoCommit.warning.localChangesMessage')}
        </Row>
        <Row>
          <Checkbox
            label={t('common.doNotShowAgain')}
            value={
              this.state.confirmUndoCommit
                ? CheckboxValue.Off
                : CheckboxValue.On
            }
            onChange={this.onConfirmUndoCommitChanged}
          />
        </Row>
      </DialogContent>
    )
  }

  private getMergeCommitWarningDialog() {
    if (this.props.isWorkingDirectoryClean) {
      return (
        <DialogContent>
          <p>{this.getMergeCommitUndoWarningText()}</p>
          <p>{t('undoCommit.warning.continuePrompt')}</p>
        </DialogContent>
      )
    }
    return (
      <DialogContent>
        <p>{t('undoCommit.warning.mergeLocalChangesMessage')}</p>
        <p>{this.getMergeCommitUndoWarningText()}</p>
        <p>{t('undoCommit.warning.continuePrompt')}</p>
      </DialogContent>
    )
  }

  private getMergeCommitUndoWarningText() {
    return t('undoCommit.warning.mergeCommitMessage')
  }

  private onSubmit = async () => {
    const { dispatcher, repository, commit, onDismissed } = this.props
    this.setState({ isLoading: true })

    try {
      dispatcher.setConfirmUndoCommitSetting(this.state.confirmUndoCommit)
      await dispatcher.undoCommit(repository, commit, false)
    } finally {
      this.setState({ isLoading: false })
    }

    onDismissed()
  }

  private onConfirmUndoCommitChanged = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const value = !event.currentTarget.checked

    this.setState({ confirmUndoCommit: value })
  }
}
