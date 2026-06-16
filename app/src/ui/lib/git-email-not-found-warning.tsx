import * as React from 'react'
import { Account, isDotComAccount } from '../../models/account'
import { LinkButton } from './link-button'
import { isAttributableEmailFor } from '../../lib/email'
import { Octicon } from '../octicons'
import * as octicons from '../octicons/octicons.generated'
import { AriaLiveContainer } from '../accessibility/aria-live-container'
import { t } from '../../lib/i18n'

interface IGitEmailNotFoundWarningProps {
  /** The account the commit should be attributed to. */
  readonly accounts: ReadonlyArray<Account>

  /** The email address used in the commit author info. */
  readonly email: string
}

/**
 * A component which just displays a warning to the user if their git config
 * email doesn't match any of the emails in their GitHub (Enterprise) account.
 */
export class GitEmailNotFoundWarning extends React.Component<IGitEmailNotFoundWarningProps> {
  private buildMessage(isAttributableEmail: boolean) {
    const indicatorIcon = !isAttributableEmail ? (
      <span className="warning-icon">⚠️</span>
    ) : (
      <span className="green-circle">
        <Octicon className="check-icon" symbol={octicons.check} />
      </span>
    )

    const learnMore = !isAttributableEmail ? (
      <LinkButton
        ariaLabel={t('preferences.git.emailWarning.learnMoreAriaLabel')}
        uri="https://docs.github.com/en/github/committing-changes-to-your-project/why-are-my-commits-linked-to-the-wrong-user"
      >
        {t('preferences.git.emailWarning.learnMore')}
      </LinkButton>
    ) : null

    return (
      <>
        {indicatorIcon}
        {this.buildScreenReaderMessage(isAttributableEmail)}
        {learnMore}
      </>
    )
  }

  private buildScreenReaderMessage(isAttributableEmail: boolean) {
    const account = this.getAccountTypeDescription()

    return isAttributableEmail
      ? t('preferences.git.emailWarning.matches', { account })
      : t('preferences.git.emailWarning.doesNotMatch', {
          account,
          info: t('preferences.git.emailWarning.wronglyAttributed'),
        })
  }

  public render() {
    const { accounts, email } = this.props

    if (accounts.length === 0 || email.trim().length === 0) {
      return null
    }

    const isAttributableEmail = accounts.some(account =>
      isAttributableEmailFor(account, email)
    )

    /**
     * Here we put the message in the top div for visual users immediately  and
     * in the bottom div for screen readers. The screen reader content is
     * debounced to avoid frequent updates from typing in the email field.
     */
    return (
      <>
        <div className="git-email-not-found-warning">
          {this.buildMessage(isAttributableEmail)}
        </div>

        <AriaLiveContainer
          id="git-email-not-found-warning-for-screen-readers"
          trackedUserInput={this.props.email}
          message={this.buildScreenReaderMessage(isAttributableEmail)}
        />
      </>
    )
  }

  private getAccountTypeDescription() {
    if (this.props.accounts.length === 1) {
      const accountType = isDotComAccount(this.props.accounts[0])
        ? 'preferences.git.emailWarning.dotComAccount'
        : 'preferences.git.emailWarning.enterpriseAccount'

      return t(accountType)
    }

    return t('preferences.git.emailWarning.anyAccount')
  }
}
