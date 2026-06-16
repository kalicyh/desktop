import * as React from 'react'
import { Repository } from '../../models/repository'
import { Dialog, DialogContent, DialogFooter } from '../dialog'
import { PathText } from '../lib/path-text'
import { LinkButton } from '../lib/link-button'
import { OkCancelButtonGroup } from '../dialog/ok-cancel-button-group'
import { t } from '../../lib/i18n'

const LFSURL = 'https://git-lfs.github.com/'

/**
 * If we're initializing any more than this number, we won't bother listing them
 * all.
 */
const MaxRepositoriesToList = 10

interface IInitializeLFSProps {
  /** The repositories in which LFS needs to be initialized. */
  readonly repositories: ReadonlyArray<Repository>

  /**
   * Event triggered when the dialog is dismissed by the user in the
   * ways described in the Dialog component's dismissable prop.
   */
  readonly onDismissed: () => void

  /**
   * Called when the user chooses to initialize LFS in the repositories.
   */
  readonly onInitialize: (repositories: ReadonlyArray<Repository>) => void
}

export class InitializeLFS extends React.Component<IInitializeLFSProps, {}> {
  public render() {
    return (
      <Dialog
        id="initialize-lfs"
        title={t('lfs.initialize.title')}
        backdropDismissable={false}
        onSubmit={this.onInitialize}
        onDismissed={this.props.onDismissed}
      >
        <DialogContent>{this.renderRepositories()}</DialogContent>

        <DialogFooter>
          <OkCancelButtonGroup
            okButtonText={t('lfs.initialize.initializeButton')}
            cancelButtonText={t('dialog.notNow')}
            onCancelButtonClick={this.props.onDismissed}
          />
        </DialogFooter>
      </Dialog>
    )
  }

  private onInitialize = () => {
    this.props.onInitialize(this.props.repositories)
    this.props.onDismissed()
  }

  private renderRepositories() {
    if (this.props.repositories.length > MaxRepositoriesToList) {
      return (
        <p>
          {t('lfs.initialize.tooManyPrefix', {
            count: this.props.repositories.length,
          })}{' '}
          <LinkButton uri={LFSURL}>Git LFS</LinkButton>.{' '}
          {t('lfs.initialize.tooManySuffix')}
        </p>
      )
    } else {
      const plural = this.props.repositories.length !== 1
      const repositoriesUse = plural
        ? t('lfs.initialize.repositoriesUse')
        : t('lfs.initialize.repositoryUses')
      const contributeTo = plural
        ? t('lfs.initialize.contributeToThem')
        : t('lfs.initialize.contributeToIt')
      return (
        <div>
          <p>
            {repositoriesUse} <LinkButton uri={LFSURL}>Git LFS</LinkButton>.{' '}
            {contributeTo}
          </p>
          <ul>
            {this.props.repositories.map(r => (
              <li key={r.id}>
                <PathText path={r.path} />
              </li>
            ))}
          </ul>
        </div>
      )
    }
  }
}
