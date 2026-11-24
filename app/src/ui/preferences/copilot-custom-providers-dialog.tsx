import * as React from 'react'
import { t } from '../../lib/i18n'
import { isLocalBaseUrl, type IBYOKProvider } from '../../lib/copilot/byok'
import { Button } from '../lib/button'
import { Dialog, DialogContent, DialogFooter } from '../dialog'
import { OkCancelButtonGroup } from '../dialog/ok-cancel-button-group'
import { Octicon } from '../octicons'
import * as octicons from '../octicons/octicons.generated'

interface ICopilotCustomProvidersDialogProps {
  readonly providers: ReadonlyArray<IBYOKProvider>
  readonly onAddProvider: () => void
  readonly onEditProvider: (provider: IBYOKProvider) => void
  readonly onDeleteProvider: (provider: IBYOKProvider) => void
  readonly onDismissed: () => void
}

/** Dialog for managing custom Copilot model providers. */
export class CopilotCustomProvidersDialog extends React.Component<ICopilotCustomProvidersDialogProps> {
  private onAddProviderClick = () => this.props.onAddProvider()

  private onEditProviderClick = (provider: IBYOKProvider) => () =>
    this.props.onEditProvider(provider)

  private onDeleteProviderClick = (provider: IBYOKProvider) => () =>
    this.props.onDeleteProvider(provider)

  public render() {
    return (
      <Dialog
        id="copilot-custom-providers-dialog"
        className="copilot-settings-dialog"
        title={__DARWIN__ ? 'Custom Providers' : 'Custom providers'}
        onSubmit={this.props.onDismissed}
        onDismissed={this.props.onDismissed}
      >
        <DialogContent>
          <div className="copilot-section">
            {this.renderProviders()}
            <Button onClick={this.onAddProviderClick}>
              {t('preferences.copilot.byok.addProvider')}
            </Button>
          </div>
        </DialogContent>
        <DialogFooter>
          <OkCancelButtonGroup
            okButtonText="Done"
            cancelButtonVisible={false}
          />
        </DialogFooter>
      </Dialog>
    )
  }

  private renderProviders(): JSX.Element {
    if (this.props.providers.length === 0) {
      return (
        <p className="copilot-byok-empty">
          {t('preferences.copilot.byok.empty')}
        </p>
      )
    }

    return (
      <ul className="copilot-byok-entry-list">
        {this.props.providers.map(this.renderProvider)}
      </ul>
    )
  }

  private renderProvider = (provider: IBYOKProvider) => {
    const modelCount = provider.models.length
    const modelLabel = t(
      modelCount === 1
        ? 'preferences.copilot.byok.modelCount.one'
        : 'preferences.copilot.byok.modelCount.other',
      { count: modelCount }
    )
    const isLocal = isLocalBaseUrl(provider.baseUrl)

    return (
      <li key={provider.id} className="copilot-byok-entry">
        <div className="copilot-byok-entry-info">
          <div className="copilot-byok-entry-title">
            <span>{provider.name}</span>
            {isLocal && (
              <span className="copilot-byok-provider-badge">
                {t('preferences.copilot.byok.local')}
              </span>
            )}
          </div>
          <span className="copilot-byok-entry-meta">
            {this.formatProviderType(provider)} · {modelLabel}
          </span>
        </div>
        <div className="copilot-byok-entry-actions">
          <Button
            onClick={this.onEditProviderClick(provider)}
            ariaLabel={t('preferences.copilot.byok.editProvider', {
              name: provider.name,
            })}
          >
            <Octicon symbol={octicons.pencil} />
          </Button>
          <Button
            onClick={this.onDeleteProviderClick(provider)}
            ariaLabel={t('preferences.copilot.byok.removeProvider', {
              name: provider.name,
            })}
          >
            <Octicon symbol={octicons.trash} />
          </Button>
        </div>
      </li>
    )
  }

  private formatProviderType(provider: IBYOKProvider): string {
    switch (provider.type) {
      case 'openai':
        return 'OpenAI-compatible'
      case 'azure':
        return 'Azure'
      case 'anthropic':
        return 'Anthropic'
    }
  }
}
