import * as React from 'react'
import { Dialog, DialogContent, DialogFooter } from '../dialog'
import { OkCancelButtonGroup } from '../dialog/ok-cancel-button-group'
import { t } from '../../lib/i18n'

interface IAddSSHHostProps {
  readonly host: string
  readonly ip: string
  readonly keyType: string
  readonly fingerprint: string
  readonly onSubmit: (addHost: boolean) => void
  readonly onDismissed: () => void
}

/**
 * Dialog prompts the user to add a new SSH host as known.
 */
export class AddSSHHost extends React.Component<IAddSSHHostProps> {
  public render() {
    return (
      <Dialog
        id="add-ssh-host"
        type="normal"
        title={t('ssh.host.title')}
        backdropDismissable={false}
        onSubmit={this.onSubmit}
        onDismissed={this.onCancel}
      >
        <DialogContent>
          <p>
            {t('ssh.host.authenticityPrefix')} '{this.props.host} (
            {this.props.ip})' {t('ssh.host.authenticityMiddle')}{' '}
            {this.props.keyType} {t('ssh.host.fingerprintIs')}{' '}
            {this.props.fingerprint}.
          </p>
          <p>{t('ssh.host.continuePrompt')}</p>
        </DialogContent>
        <DialogFooter>
          <OkCancelButtonGroup
            okButtonText={t('dialog.yes')}
            cancelButtonText={t('dialog.no')}
            onCancelButtonClick={this.onCancel}
          />
        </DialogFooter>
      </Dialog>
    )
  }

  private submit(addHost: boolean) {
    const { onSubmit, onDismissed } = this.props

    onSubmit(addHost)
    onDismissed()
  }

  private onSubmit = () => {
    this.submit(true)
  }

  private onCancel = () => {
    this.submit(false)
  }
}
