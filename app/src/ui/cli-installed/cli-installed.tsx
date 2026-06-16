import * as React from 'react'
import { Dialog, DialogContent, DefaultDialogFooter } from '../dialog'
import { InstalledCLIPath } from '../lib/install-cli'
import { t } from '../../lib/i18n'

interface ICLIInstalledProps {
  /** Called when the popup should be dismissed. */
  readonly onDismissed: () => void
}

/** Tell the user the CLI tool was successfully installed. */
export class CLIInstalled extends React.Component<ICLIInstalledProps, {}> {
  public render() {
    return (
      <Dialog
        title={t('cliInstalled.title')}
        onDismissed={this.props.onDismissed}
        onSubmit={this.props.onDismissed}
      >
        <DialogContent>
          <div>
            {t('cliInstalled.messagePrefix')}{' '}
            <strong>{InstalledCLIPath}</strong>.
          </div>
        </DialogContent>
        <DefaultDialogFooter buttonText={t('common.ok')} />
      </Dialog>
    )
  }
}
