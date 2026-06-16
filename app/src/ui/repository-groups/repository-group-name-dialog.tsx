import * as React from 'react'

import { Repository } from '../../models/repository'
import { RepositoryGroup } from '../../models/repository-group'
import { Dispatcher } from '../dispatcher'
import { t } from '../../lib/i18n'
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
  readonly showValidationError: boolean
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
      showValidationError: false,
    }
  }

  public render() {
    const { mode, repository } = this.props
    const trimmed = this.state.name.trim()
    const validationError = this.getValidationError(trimmed)
    const visibleValidationError = this.state.showValidationError
      ? validationError
      : null

    return (
      <Dialog
        id="repository-group-name"
        title={
          mode === 'create'
            ? t('repositoryGroups.createTitle')
            : t('repositoryGroups.renameTitle')
        }
        ariaDescribedBy="repository-group-name-description"
        onDismissed={this.props.onDismissed}
        onSubmit={this.onSubmit}
      >
        <DialogContent>
          <p id="repository-group-name-description">
            {repository === undefined
              ? t('repositoryGroups.createDescription')
              : t('repositoryGroups.createForRepositoryDescription', {
                  name: repository.name,
                })}
          </p>
          <p>
            <TextBox
              ariaLabel={t('repositoryGroups.nameAriaLabel')}
              value={this.state.name}
              onValueChanged={this.onNameChanged}
            />
          </p>
          {(visibleValidationError !== null || this.state.error !== null) && (
            <DialogError>
              {visibleValidationError ?? this.state.error}
            </DialogError>
          )}
        </DialogContent>

        <DialogFooter>
          <OkCancelButtonGroup
            okButtonText={
              mode === 'create'
                ? t('repositoryGroups.createButton')
                : t('repositoryGroups.renameButton')
            }
            okButtonDisabled={validationError !== null}
          />
        </DialogFooter>
      </Dialog>
    )
  }

  private onNameChanged = (name: string) => {
    this.setState({ name, error: null, showValidationError: true })
  }

  private getValidationError(trimmed: string): string | null {
    if (trimmed.length === 0) {
      return t('repositoryGroups.emptyNameError')
    }

    const currentGroupId =
      this.props.mode === 'rename' ? this.props.groupId : -1
    const normalized = trimmed.toLowerCase()
    const duplicate = this.props.existingGroups.some(
      g => g.id !== currentGroupId && g.name.trim().toLowerCase() === normalized
    )

    return duplicate ? t('repositoryGroups.duplicateNameError') : null
  }

  private onSubmit = async () => {
    const name = this.state.name.trim()
    const validationError = this.getValidationError(name)
    if (validationError !== null) {
      this.setState({ error: validationError, showValidationError: true })
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
          throw new Error(t('repositoryGroups.missingGroupIdError'))
        }
        await this.props.dispatcher.renameRepositoryGroup(groupId, name)
      }
      this.props.onDismissed()
    } catch (e) {
      this.setState({ error: e instanceof Error ? e.message : String(e) })
    }
  }
}
