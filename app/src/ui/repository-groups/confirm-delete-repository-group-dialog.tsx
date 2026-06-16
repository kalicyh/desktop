import * as React from 'react'

import { Dispatcher } from '../dispatcher'
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
      memberCount === 1 ? '1 repository' : `${memberCount} repositories`

    return (
      <Dialog
        id="confirm-delete-repository-group"
        title={
          __DARWIN__ ? 'Delete Repository Group' : 'Delete repository group'
        }
        type="warning"
        ariaDescribedBy="confirm-delete-repository-group-description"
        onDismissed={this.props.onDismissed}
        onSubmit={this.onSubmit}
      >
        <DialogContent>
          <p id="confirm-delete-repository-group-description">
            Delete "{groupName}"? {repositoryText} will return to the automatic
            repository groups.
          </p>
          {this.state.error !== null && (
            <DialogError>{this.state.error}</DialogError>
          )}
        </DialogContent>

        <DialogFooter>
          <OkCancelButtonGroup
            okButtonText={__DARWIN__ ? 'Delete Group' : 'Delete group'}
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
