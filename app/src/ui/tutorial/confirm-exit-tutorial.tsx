import * as React from 'react'

import { DialogFooter, DialogContent, Dialog } from '../dialog'
import { OkCancelButtonGroup } from '../dialog/ok-cancel-button-group'
import { t } from '../../lib/i18n'

interface IConfirmExitTutorialProps {
  readonly onDismissed: () => void
  readonly onContinue: () => boolean
}

export class ConfirmExitTutorial extends React.Component<
  IConfirmExitTutorialProps,
  {}
> {
  public render() {
    return (
      <Dialog
        title={t('tutorial.exit.title')}
        onDismissed={this.props.onDismissed}
        onSubmit={this.onContinue}
        type="normal"
      >
        <DialogContent>
          <p>{t('tutorial.exit.confirmMessage')}</p>
        </DialogContent>
        <DialogFooter>
          <OkCancelButtonGroup okButtonText={t('tutorial.exit.button')} />
        </DialogFooter>
      </Dialog>
    )
  }

  private onContinue = () => {
    const dismissPopup = this.props.onContinue()

    if (dismissPopup) {
      this.props.onDismissed()
    }
  }
}
