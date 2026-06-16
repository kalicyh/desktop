import * as React from 'react'
import * as Path from 'path'

import { Dialog, DialogContent, DialogFooter } from '../dialog'
import { Ref } from '../lib/ref'
import { OkCancelButtonGroup } from '../dialog/ok-cancel-button-group'
import { Repository } from '../../models/repository'
import { getUnderlyingError, isRawGitError } from '../app-error'
import { Terminal } from '../terminal'
import { WorktreeEntry } from '../../models/worktree'
import { t } from '../../lib/i18n'

interface IDeleteWorktreeFailedDialogProps {
  readonly repository: Repository
  readonly worktreePath: string
  readonly onDeleteWorktree: (
    repository: Repository,
    worktreePath: string,
    force: boolean
  ) => Promise<void>
  readonly onSwitchToWorktree: (
    repository: Repository,
    worktree: WorktreeEntry
  ) => Promise<void>
  readonly error: Error
  readonly originalWorktree: WorktreeEntry | null
  readonly onDismissed: () => void
}

interface IDeleteWorktreeFailedDialogState {
  readonly isDeleting: boolean
}

export class DeleteWorktreeFailedDialog extends React.Component<
  IDeleteWorktreeFailedDialogProps,
  IDeleteWorktreeFailedDialogState
> {
  public constructor(props: IDeleteWorktreeFailedDialogProps) {
    super(props)

    this.state = {
      isDeleting: false,
    }
  }

  public render() {
    const name = Path.basename(this.props.worktreePath)

    return (
      <Dialog
        id="delete-worktree-failed"
        title={t('worktree.deleteFailed.title')}
        type="error"
        onSubmit={this.onSubmit}
        onDismissed={this.onDismissed}
        disabled={this.state.isDeleting}
        loading={this.state.isDeleting}
        role="alertdialog"
        ariaDescribedBy="delete-worktree-failed-message"
      >
        <DialogContent>
          <div id="delete-worktree-failed-message">
            <p>
              {t('worktree.deleteFailed.messagePrefix')} <Ref>{name}</Ref>
              {t('worktree.deleteFailed.messageSuffix')}
            </p>
            {this.renderErrorMessage()}
            <p>
              {t('worktree.deleteFailed.forcePromptPrefix')} <Ref>{name}</Ref>
              {t('worktree.deleteFailed.forcePromptSuffix')}
            </p>
          </div>
        </DialogContent>
        <DialogFooter>
          <OkCancelButtonGroup
            destructive={true}
            okButtonText={t('worktree.deleteFailed.forceButton')}
          />
        </DialogFooter>
      </Dialog>
    )
  }

  private renderErrorMessage() {
    const e = getUnderlyingError(this.props.error)

    if (isRawGitError(e)) {
      return <Terminal terminalOutput={e.message} rows={8} cols={80} />
    }

    return <p>{e.toString()}</p>
  }

  private onDismissed = () => {
    const { originalWorktree, repository } = this.props

    if (originalWorktree !== null) {
      this.props.onSwitchToWorktree(repository, originalWorktree)
    }

    this.props.onDismissed()
  }

  private onSubmit = async () => {
    this.setState({ isDeleting: true })
    await this.props.onDeleteWorktree(
      this.props.repository,
      this.props.worktreePath,
      true
    )
    this.props.onDismissed()
  }
}
