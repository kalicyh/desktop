import * as React from 'react'

import { Repository } from '../../models/repository'
import { RepositoryGroup } from '../../models/repository-group'
import { Dispatcher } from '../dispatcher'
import { Dialog, DialogContent, DialogError, DialogFooter } from '../dialog'
import { OkCancelButtonGroup } from '../dialog/ok-cancel-button-group'
import { TextBox } from '../lib/text-box'

type RepositoryGroupNameDialogMode = 'create' | 'rename'

interface IRepositoryGroupNameDialogProps {
  readonly dispatcher: Dispatcher
  readonly onDismissed: () => void
  readonly mode: RepositoryGroupNameDialogMode
  readonly repository?: Repository
  readonly groupId?: number
  readonly currentName?: string
  readonly existingGroups: ReadonlyArray<RepositoryGroup>
}

interface IRepositoryGroupNameDialogState {
  readonly name: string
  readonly error: string | null
}

export class RepositoryGroupNameDialog extends React.Component<
  IRepositoryGroupNameDialogProps,
  IRepositoryGroupNameDialogState
> {
  public constructor(props: IRepositoryGroupNameDialogProps) {
    super(props)

    this.state = {
      name: props.currentName ?? '',
      error: null,
    }
  }

  public render() {
    const { mode, repository } = this.props
    const verb = mode === 'create' ? 'Create' : 'Rename'
    const trimmed = this.state.name.trim()
    const validationError = this.getValidationError(trimmed)

    return (
      <Dialog
        id="repository-group-name"
        title={
          mode === 'create'
            ? __DARWIN__
              ? 'Create Repository Group'
              : 'Create repository group'
            : __DARWIN__
            ? 'Rename Repository Group'
            : 'Rename repository group'
        }
        ariaDescribedBy="repository-group-name-description"
        onDismissed={this.props.onDismissed}
        onSubmit={this.onSubmit}
      >
        <DialogContent>
          <p id="repository-group-name-description">
            {repository === undefined
              ? 'Choose a name for this repository group.'
              : `Choose a group name for "${repository.name}".`}
          </p>
          <p>
            <TextBox
              ariaLabel="Group name"
              value={this.state.name}
              onValueChanged={this.onNameChanged}
            />
          </p>
          {(validationError !== null || this.state.error !== null) && (
            <DialogError>{validationError ?? this.state.error}</DialogError>
          )}
        </DialogContent>

        <DialogFooter>
          <OkCancelButtonGroup
            okButtonText={__DARWIN__ ? `${verb} Group` : `${verb} group`}
            okButtonDisabled={validationError !== null}
          />
        </DialogFooter>
      </Dialog>
    )
  }

  private onNameChanged = (name: string) => {
    this.setState({ name, error: null })
  }

  private getValidationError(trimmed: string): string | null {
    if (trimmed.length === 0) {
      return 'Group name cannot be empty.'
    }

    const currentGroupId =
      this.props.mode === 'rename' ? this.props.groupId : -1
    const normalized = trimmed.toLowerCase()
    const duplicate = this.props.existingGroups.some(
      g => g.id !== currentGroupId && g.name.trim().toLowerCase() === normalized
    )

    return duplicate ? 'A group with this name already exists.' : null
  }

  private onSubmit = async () => {
    const name = this.state.name.trim()
    const validationError = this.getValidationError(name)
    if (validationError !== null) {
      this.setState({ error: validationError })
      return
    }

    try {
      if (this.props.mode === 'create') {
        const group = await this.props.dispatcher.addRepositoryGroup(name)
        if (this.props.repository !== undefined) {
          await this.props.dispatcher.changeRepositoryGroup(
            this.props.repository,
            group.id
          )
        }
      } else {
        const { groupId } = this.props
        if (groupId === undefined) {
          throw new Error('Missing repository group id.')
        }
        await this.props.dispatcher.renameRepositoryGroup(groupId, name)
      }
      this.props.onDismissed()
    } catch (e) {
      this.setState({ error: e instanceof Error ? e.message : String(e) })
    }
  }
}
