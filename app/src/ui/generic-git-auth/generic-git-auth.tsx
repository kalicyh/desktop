import * as React from 'react'

import { TextBox } from '../lib/text-box'
import { Row } from '../lib/row'
import { Dialog, DialogContent, DialogFooter } from '../dialog'
import { OkCancelButtonGroup } from '../dialog/ok-cancel-button-group'
import { Ref } from '../lib/ref'
import { LinkButton } from '../lib/link-button'
import { PasswordTextBox } from '../lib/password-text-box'
import { t } from '../../lib/i18n'

interface IGenericGitAuthenticationProps {
  /** The remote url with which the user tried to authenticate. */
  readonly remoteUrl: string

  /** The function to call when the user saves their credentials. */
  readonly onSave: (username: string, password: string) => void

  /** The function to call when the user dismisses the dialog. */
  readonly onDismiss: () => void

  /**
   * In case the username is predetermined. Setting this will prevent
   * the popup from allowing the user to change the username.
   */
  readonly username?: string
}

interface IGenericGitAuthenticationState {
  readonly username: string
  readonly password: string
}

/** Shown to enter the credentials to authenticate to a generic git server. */
export class GenericGitAuthentication extends React.Component<
  IGenericGitAuthenticationProps,
  IGenericGitAuthenticationState
> {
  public constructor(props: IGenericGitAuthenticationProps) {
    super(props)

    this.state = { username: this.props.username ?? '', password: '' }
  }

  public render() {
    const disabled = !this.state.password.length || !this.state.username.length
    return (
      <Dialog
        id="generic-git-auth"
        title={t('genericGitAuth.title')}
        onDismissed={this.props.onDismiss}
        onSubmit={this.save}
        role="alertdialog"
        ariaDescribedBy="generic-git-auth-error"
      >
        <DialogContent>
          <p id="generic-git-auth-error">
            {t('genericGitAuth.messagePrefix')}{' '}
            <Ref>{this.props.remoteUrl}</Ref>. {t('genericGitAuth.enter')}{' '}
            {this.props.username ? (
              <>
                {t('genericGitAuth.passwordForUser')}{' '}
                <Ref>{this.props.username}</Ref>
                {t('genericGitAuth.passwordTryAgain')}
              </>
            ) : (
              <>
                {t('genericGitAuth.usernameAndPassword')}{' '}
                {t('genericGitAuth.tryAgain')}
              </>
            )}
          </p>

          {this.props.username === undefined && (
            <Row>
              <TextBox
                label={t('genericGitAuth.username')}
                autoFocus={true}
                value={this.state.username}
                onValueChanged={this.onUsernameChange}
              />
            </Row>
          )}

          <Row>
            <PasswordTextBox
              label={t('genericGitAuth.password')}
              value={this.state.password}
              onValueChanged={this.onPasswordChange}
              ariaDescribedBy="generic-git-auth-password-description"
            />
          </Row>

          <Row>
            <div id="generic-git-auth-password-description">
              {t('genericGitAuth.patDescription')}{' '}
              <LinkButton uri="https://github.com/desktop/desktop/tree/development/docs/integrations">
                {t('genericGitAuth.integrationDocs')}
              </LinkButton>
              .
            </div>
          </Row>
        </DialogContent>

        <DialogFooter>
          <OkCancelButtonGroup okButtonDisabled={disabled} />
        </DialogFooter>
      </Dialog>
    )
  }

  private onUsernameChange = (value: string) => {
    this.setState({ username: value })
  }

  private onPasswordChange = (value: string) => {
    this.setState({ password: value })
  }

  private save = () => {
    this.props.onSave(
      this.props.username ?? this.state.username,
      this.state.password
    )
    this.props.onDismiss()
  }
}
