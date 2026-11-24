import * as React from 'react'
import * as Path from 'path'

import { Dialog, DialogContent, DialogFooter } from '../dialog'
import { Ref } from '../lib/ref'
import { OkCancelButtonGroup } from '../dialog/ok-cancel-button-group'
import { Repository } from '../../models/repository'
import { IDeleteWorktreeOptions } from '../../models/worktree'
import { Checkbox, CheckboxValue } from '../lib/checkbox'
import { t } from '../../lib/i18n'

interface IDeleteWorktreeDialogProps {
  readonly repository: Repository
  readonly worktreePath: string
  readonly options: IDeleteWorktreeOptions
  readonly askForConfirmationOnWorktreeRemoval: boolean
  readonly onDeleteWorktree: (
    repository: Repository,
    worktreePath: string,
    options?: IDeleteWorktreeOptions
  ) => Promise<void>
  readonly onConfirmWorktreeRemovalChanged: (value: boolean) => void
  readonly onDismissed: () => void
}

interface IDeleteWorktreeDialogState {
  readonly isDeleting: boolean
  readonly confirmWorktreeRemoval: boolean
}

export class DeleteWorktreeDialog extends React.Component<
  IDeleteWorktreeDialogProps,
  IDeleteWorktreeDialogState
> {
  public constructor(props: IDeleteWorktreeDialogProps) {
    super(props)

    this.state = {
      isDeleting: false,
      confirmWorktreeRemoval: props.askForConfirmationOnWorktreeRemoval,
    }
  }

  public render() {
    const isMissing = this.props.options.isMissing === true
    const name = Path.basename(this.props.worktreePath)

    const title = isMissing
      ? t('worktree.delete.missingTitle')
      : t('worktree.delete.title')

    return (
      <Dialog
        id="delete-worktree"
        title={title}
        type="warning"
        onSubmit={this.onSubmit}
        onDismissed={this.props.onDismissed}
        disabled={this.state.isDeleting}
        loading={this.state.isDeleting}
        role="alertdialog"
        ariaDescribedBy="delete-worktree-confirmation"
      >
        <DialogContent>
          <p id="delete-worktree-confirmation">
            {isMissing ? (
              <>
                {t('worktree.delete.missingPrefix')} <Ref>{name}</Ref>
                {t('worktree.delete.missingSuffix')}
              </>
            ) : (
              <>
                {t('worktree.delete.confirmPrefix')} <Ref>{name}</Ref>
                {t('worktree.delete.confirmSuffix')}
              </>
            )}
          </p>
          {!isMissing && (
            <Checkbox
              label={t('common.doNotShowAgain')}
              value={
                this.state.confirmWorktreeRemoval
                  ? CheckboxValue.Off
                  : CheckboxValue.On
              }
              onChange={this.onConfirmWorktreeRemovalChanged}
            />
          )}
        </DialogContent>
        <DialogFooter>
          <OkCancelButtonGroup
            destructive={true}
            okButtonText={
              isMissing
                ? t('worktree.delete.remove')
                : t('worktree.delete.button')
            }
          />
        </DialogFooter>
      </Dialog>
    )
  }

  private onConfirmWorktreeRemovalChanged = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const value = !event.currentTarget.checked
    this.setState({ confirmWorktreeRemoval: value })
  }

  private onSubmit = async () => {
    this.setState({ isDeleting: true })

    this.props.onConfirmWorktreeRemovalChanged(
      this.state.confirmWorktreeRemoval
    )

    await this.props.onDeleteWorktree(
      this.props.repository,
      this.props.worktreePath,
      this.props.options
    )
    this.props.onDismissed()
  }
}
