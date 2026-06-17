import * as React from 'react'
import {
  Account,
  isDotComAccount,
  isEnterpriseAccount,
} from '../../models/account'
import { IAvatarUser } from '../../models/avatar'
import { lookupPreferredEmail } from '../../lib/email'
import { assertNever } from '../../lib/fatal-error'
import { Button } from '../lib/button'
import { Row } from '../lib/row'
import { DialogContent, DialogPreferredFocusClassName } from '../dialog'
import { Avatar } from '../lib/avatar'
import { CallToAction } from '../lib/call-to-action'
import { getHTMLURL } from '../../lib/api'
import { t } from '../../lib/i18n'
import type { IGitIdentityRule } from '../../lib/git/config'
import { TextBox } from '../lib/text-box'

interface IAccountsProps {
  readonly accounts: ReadonlyArray<Account>
  readonly gitIdentityRules: ReadonlyArray<IGitIdentityRule>

  readonly onDotComSignIn: () => void
  readonly onEnterpriseSignIn: () => void
  readonly onLogout: (account: Account) => void
  readonly onGitIdentityRuleLoginChanged: (
    rule: IGitIdentityRule,
    login: string
  ) => void
}

enum SignInType {
  DotCom,
  Enterprise,
}

interface IAccountsState {
  readonly failedGitIdentityAvatarURLs: ReadonlySet<string>
}

export class Accounts extends React.Component<IAccountsProps, IAccountsState> {
  public constructor(props: IAccountsProps) {
    super(props)

    this.state = {
      failedGitIdentityAvatarURLs: new Set(),
    }
  }

  public render() {
    const { accounts } = this.props
    const dotComAccount = accounts.find(isDotComAccount)

    return (
      <DialogContent className="accounts-tab">
        <h2>GitHub.com</h2>
        {dotComAccount
          ? this.renderAccount(dotComAccount, SignInType.DotCom)
          : this.renderSignIn(SignInType.DotCom)}

        <h2>GitHub Enterprise</h2>
        {this.renderMultipleEnterpriseAccounts()}

        {this.renderGitIdentityRules()}
      </DialogContent>
    )
  }

  private renderGitIdentityRules() {
    if (this.props.gitIdentityRules.length === 0) {
      return null
    }

    return (
      <>
        <h2>{t('preferences.accounts.gitIdentityRules')}</h2>
        <p className="git-identity-rules-description">
          {t('preferences.accounts.gitIdentityRulesDescription')}
        </p>
        {this.props.gitIdentityRules.map(rule =>
          this.renderGitIdentityRule(rule)
        )}
      </>
    )
  }

  private renderGitIdentityRule(rule: IGitIdentityRule) {
    return (
      <Row className="account-info git-identity-rule" key={rule.pattern}>
        <div className="user-info-container">
          {this.renderGitIdentityAvatar(rule)}
          <div className="user-info">
            <div className="account-title">{rule.host}</div>
            <div className="name">{rule.name}</div>
            <div className="login">{rule.email}</div>
            <div className="endpoint">
              {t('preferences.accounts.gitIdentityRuleSource', {
                path: rule.configPath,
              })}
            </div>
            {this.renderGitIdentityRuleLogin(rule)}
          </div>
        </div>
      </Row>
    )
  }

  private renderGitIdentityAvatar(rule: IGitIdentityRule) {
    const { avatarURL } = rule

    if (
      avatarURL !== null &&
      !this.state.failedGitIdentityAvatarURLs.has(avatarURL)
    ) {
      return (
        <img
          className="git-identity-avatar"
          src={avatarURL}
          alt={t('preferences.accounts.gitIdentityAvatarAlt', {
            name: rule.name,
          })}
          onError={this.onGitIdentityAvatarError}
        />
      )
    }

    return (
      <div className="git-identity-avatar" aria-hidden="true">
        {this.getInitials(rule.name)}
      </div>
    )
  }

  private onGitIdentityAvatarError = (
    event: React.SyntheticEvent<HTMLImageElement>
  ) => {
    const failedURL = event.currentTarget.src

    this.setState(state => ({
      failedGitIdentityAvatarURLs: new Set([
        ...state.failedGitIdentityAvatarURLs,
        failedURL,
      ]),
    }))
  }

  private renderGitIdentityRuleLogin(rule: IGitIdentityRule) {
    if (!this.isGiteaIdentityRule(rule)) {
      return null
    }

    return (
      <TextBox
        className="git-identity-login"
        label={t('preferences.accounts.gitIdentityRuleLoginLabel')}
        value={rule.login ?? ''}
        placeholder={t('preferences.accounts.gitIdentityRuleLoginPlaceholder')}
        onValueChanged={this.onGitIdentityRuleLoginChanged(rule)}
      />
    )
  }

  private isGiteaIdentityRule(rule: IGitIdentityRule) {
    return rule.host.startsWith('gitea.')
  }

  private onGitIdentityRuleLoginChanged = (rule: IGitIdentityRule) => {
    return (login: string) => {
      this.props.onGitIdentityRuleLoginChanged(rule, login.trim())
    }
  }

  private getInitials(name: string) {
    const initials = name
      .split(/\s+/)
      .filter(x => x.length > 0)
      .slice(0, 2)
      .map(x => x[0])
      .join('')

    return initials.toLocaleUpperCase()
  }

  private renderMultipleEnterpriseAccounts() {
    const enterpriseAccounts = this.props.accounts.filter(isEnterpriseAccount)

    return (
      <>
        {enterpriseAccounts.map(account => {
          return this.renderAccount(account, SignInType.Enterprise)
        })}
        {enterpriseAccounts.length === 0 ? (
          this.renderSignIn(SignInType.Enterprise)
        ) : (
          <Button onClick={this.props.onEnterpriseSignIn}>
            {t('preferences.accounts.addEnterpriseAccount')}
          </Button>
        )}
      </>
    )
  }

  private renderAccount(account: Account, type: SignInType) {
    const avatarUser: IAvatarUser = {
      name: account.name,
      email: lookupPreferredEmail(account),
      avatarURL: account.avatarURL,
      endpoint: account.endpoint,
    }

    // The DotCom account is shown first, so its sign in/out button should be
    // focused initially when the dialog is opened.
    const className =
      type === SignInType.DotCom ? DialogPreferredFocusClassName : undefined

    return (
      <Row className="account-info">
        <div className="user-info-container">
          <Avatar accounts={this.props.accounts} user={avatarUser} />
          <div className="user-info">
            {isEnterpriseAccount(account) ? (
              <>
                <div className="account-title">
                  {account.name === account.login
                    ? `@${account.login}`
                    : `@${account.login} (${account.name})`}
                </div>
                <div className="endpoint">{getHTMLURL(account.endpoint)}</div>
              </>
            ) : (
              <>
                <div className="name">{account.name}</div>
                <div className="login">@{account.login}</div>
              </>
            )}
          </div>
        </div>
        <Button onClick={this.logout(account)} className={className}>
          {t('preferences.accounts.signOut')}
        </Button>
      </Row>
    )
  }

  private onDotComSignIn = () => {
    this.props.onDotComSignIn()
  }

  private onEnterpriseSignIn = () => {
    this.props.onEnterpriseSignIn()
  }

  private renderSignIn(type: SignInType) {
    switch (type) {
      case SignInType.DotCom: {
        return (
          <CallToAction
            actionTitle={t('preferences.accounts.signIntoDotCom')}
            onAction={this.onDotComSignIn}
            // The DotCom account is shown first, so its sign in/out button should be
            // focused initially when the dialog is opened.
            buttonClassName={DialogPreferredFocusClassName}
          >
            <div>{t('preferences.accounts.dotComDescription')}</div>
          </CallToAction>
        )
      }
      case SignInType.Enterprise:
        return (
          <CallToAction
            actionTitle={t('preferences.accounts.signIntoEnterprise')}
            onAction={this.onEnterpriseSignIn}
          >
            <div>{t('preferences.accounts.enterpriseDescription')}</div>
          </CallToAction>
        )
      default:
        return assertNever(type, `Unknown sign in type: ${type}`)
    }
  }

  private logout = (account: Account) => {
    return () => {
      this.props.onLogout(account)
    }
  }
}
