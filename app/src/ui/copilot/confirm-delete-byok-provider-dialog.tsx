import * as React from 'react'
import { Dialog, DialogContent, DialogFooter } from '../dialog'
import { OkCancelButtonGroup } from '../dialog/ok-cancel-button-group'
import { Ref } from '../lib/ref'
import { IBYOKProvider } from '../../lib/copilot/byok'
import { t } from '../../lib/i18n'

interface IConfirmDeleteCopilotBYOKProviderDialogProps {
  readonly provider: IBYOKProvider
  readonly onConfirm: (provider: IBYOKProvider) => void
  readonly onDismissed: () => void
}

/**
 * Confirmation prompt shown before removing a BYOK Copilot provider. The
 * provider is removed from local storage and any stored secret is purged
 * from the OS keychain.
 */
export class ConfirmDeleteCopilotBYOKProviderDialog extends React.Component<IConfirmDeleteCopilotBYOKProviderDialogProps> {
  public render() {
    return (
      <Dialog
        id="confirm-delete-copilot-byok-provider"
        title={t('copilot.byok.confirmDelete.title')}
        type="warning"
        onSubmit={this.onConfirm}
        onDismissed={this.props.onDismissed}
        role="alertdialog"
        ariaDescribedBy="confirm-delete-copilot-byok-provider-message"
      >
        <DialogContent>
          <p id="confirm-delete-copilot-byok-provider-message">
            {t('copilot.byok.confirmDelete.messagePrefix')}{' '}
            <Ref>{this.props.provider.name}</Ref>?{' '}
            {this.renderSecretConsequence()}
          </p>
        </DialogContent>
        <DialogFooter>
          <OkCancelButtonGroup
            destructive={true}
            okButtonText={t('copilot.byok.confirmDelete.remove')}
          />
        </DialogFooter>
      </Dialog>
    )
  }

  private renderSecretConsequence() {
    switch (this.props.provider.authKind) {
      case 'apiKey':
        return t('copilot.byok.confirmDelete.apiKeyConsequence')
      case 'bearer':
        return t('copilot.byok.confirmDelete.bearerTokenConsequence')
      case 'none':
        return t('copilot.byok.confirmDelete.noAuthConsequence')
    }
  }

  private onConfirm = () => {
    this.props.onConfirm(this.props.provider)
    this.props.onDismissed()
  }
}
