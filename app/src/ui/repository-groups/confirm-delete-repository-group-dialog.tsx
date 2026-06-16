import * as React from 'react'

import { Dispatcher } from '../dispatcher'
import { t } from '../../lib/i18n'
import { Dialog, DialogContent, DialogError, DialogFooter } from '../dialog'
import { OkCancelButtonGroup } from '../dialog/ok-cancel-button-group'

interface IConfirmDeleteRepositoryGroupDialogProps {
  readonly dispatcher: Dispatcher
  readonly onDismissed: () => void
  readonly groupId: number
  readonly groupName: string
  readonly memberCount: number
}

interface IConfirmDeleteRepositoryGroupDialogState {
  readonly error: string | null
}

export class ConfirmDeleteRepositoryGroupDialog extends React.Component<
  IConfirmDeleteRepositoryGroupDialogProps,
  IConfirmDeleteRepositoryGroupDialogState
> {
  public constructor(props: IConfirmDeleteRepositoryGroupDialogProps) {
    super(props)
    this.state = { error: null }
  }

  public render() {
    const { groupName, memberCount } = this.props
    const repositoryText =
      memberCount === 1
        ? t('repositoryGroups.repositoryCount.one')
        : t('repositoryGroups.repositoryCount.other', { count: memberCount })

    return (
      <Dialog
        id="confirm-delete-repository-group"
        title={t('repositoryGroups.deleteTitle')}
        type="warning"
        ariaDescribedBy="confirm-delete-repository-group-description"
        onDismissed={this.props.onDismissed}
        onSubmit={this.onSubmit}
      >
        <DialogContent>
          <p id="confirm-delete-repository-group-description">
            {t('repositoryGroups.deleteDescription', {
              name: groupName,
              repositoryCount: repositoryText,
            })}
          </p>
          {this.state.error !== null && (
            <DialogError>{this.state.error}</DialogError>
          )}
        </DialogContent>

        <DialogFooter>
          <OkCancelButtonGroup
            okButtonText={t('repositoryGroups.deleteButton')}
            destructive={true}
          />
        </DialogFooter>
      </Dialog>
    )
  }

  private onSubmit = async () => {
    try {
      await this.props.dispatcher.removeRepositoryGroup(this.props.groupId)
      this.props.onDismissed()
    } catch (e) {
      this.setState({ error: e instanceof Error ? e.message : String(e) })
    }
  }
}
