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
import { showOpenDialog } from '../main-process-proxy'
import { encodePathAsUrl } from '../../lib/path'
import { Octicon } from '../octicons'
import * as octicons from '../octicons/octicons.generated'
import { getGitIdentityAvatarURL } from '../../lib/git/config'
import type { IGitIdentityRule } from '../../lib/git/config'

interface IGitIdentityRuleGroup {
  readonly key: string
  readonly name: string
  readonly email: string
  readonly avatarURL: string | null
  readonly rules: ReadonlyArray<IGitIdentityRule>
}

interface IAccountsProps {
  readonly accounts: ReadonlyArray<Account>
  readonly gitIdentityRules: ReadonlyArray<IGitIdentityRule>

  readonly onDotComSignIn: () => void
  readonly onEnterpriseSignIn: () => void
  readonly onLogout: (account: Account) => void
  readonly onGitIdentityRuleAvatarURLChanged: (
    rule: IGitIdentityRule,
    avatarURL: string
  ) => void
}

enum SignInType {
  DotCom,
  Enterprise,
}

interface IAccountsState {
  readonly failedGitIdentityAvatarURLs: ReadonlySet<string>
  readonly selectedGitIdentityKey: string | null
}

export class Accounts extends React.Component<IAccountsProps, IAccountsState> {
  public constructor(props: IAccountsProps) {
    super(props)

    this.state = {
      failedGitIdentityAvatarURLs: new Set(),
      selectedGitIdentityKey: null,
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
    const groups = this.getGitIdentityRuleGroups()

    if (groups.length === 0) {
      return null
    }

    return (
      <>
        <h2>{t('preferences.accounts.gitIdentityRules')}</h2>
        <p className="git-identity-rules-description">
          {t('preferences.accounts.gitIdentityRulesDescription')}
        </p>
        {groups.map(group => this.renderGitIdentityRuleGroup(group))}
        {this.renderGitIdentityAvatarDialog(groups)}
      </>
    )
  }

  private renderGitIdentityRuleGroup(group: IGitIdentityRuleGroup) {
    return (
      <Row className="account-info git-identity-rule" key={group.key}>
        <div className="user-info-container">
          {this.renderGitIdentityAvatar(group)}
          <div className="user-info">
            <div className="name">{group.name}</div>
            <div className="login">{group.email}</div>
          </div>
        </div>
        <Button
          className="git-identity-settings-button"
          ariaLabel={t('preferences.accounts.gitIdentityAvatarSettings')}
          tooltip={t('preferences.accounts.gitIdentityAvatarSettings')}
          onClick={this.onGitIdentitySettingsClicked(group.key)}
        >
          <Octicon symbol={octicons.gear} />
        </Button>
      </Row>
    )
  }

  private renderGitIdentityAvatar(
    identity: Pick<IGitIdentityRuleGroup, 'name' | 'avatarURL'>,
    className = 'git-identity-avatar'
  ) {
    const { avatarURL } = identity

    if (
      avatarURL !== null &&
      !this.state.failedGitIdentityAvatarURLs.has(avatarURL)
    ) {
      return (
        <img
          className={className}
          src={avatarURL}
          alt={t('preferences.accounts.gitIdentityAvatarAlt', {
            name: identity.name,
          })}
          onError={this.onGitIdentityAvatarError}
        />
      )
    }

    return (
      <div className={className} aria-hidden="true">
        {this.getInitials(identity.name)}
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

  private renderGitIdentityAvatarDialog(
    groups: ReadonlyArray<IGitIdentityRuleGroup>
  ) {
    const group = groups.find(x => x.key === this.state.selectedGitIdentityKey)

    if (group === undefined) {
      return null
    }

    const giteaRule = group.rules.find(rule => this.isGiteaIdentityRule(rule))
    const canUseGiteaAvatar =
      giteaRule !== undefined && (giteaRule.login ?? '').length > 0

    return (
      <div className="git-identity-avatar-dialog-backdrop">
        <div
          className="git-identity-avatar-dialog"
          role="dialog"
          aria-modal="true"
          aria-label={t('preferences.accounts.gitIdentityAvatarSettings')}
        >
          <div className="git-identity-avatar-dialog-title">
            <div className="name">{group.name}</div>
            <div className="login">{group.email}</div>
          </div>
          <div className="git-identity-avatar-options">
            <div className="git-identity-avatar-option">
              {this.renderGitIdentityAvatar(group, 'git-identity-avatar-large')}
              <Button
                disabled={!canUseGiteaAvatar}
                onClick={this.onUseGiteaAvatar(group)}
              >
                {t('preferences.accounts.gitIdentityUseGiteaAvatar')}
              </Button>
            </div>
            <div className="git-identity-avatar-divider" />
            <div className="git-identity-avatar-option">
              {this.renderGitIdentityAvatar(group, 'git-identity-avatar-large')}
              <Button onClick={this.onUploadGitIdentityAvatar(group)}>
                {t('preferences.accounts.gitIdentityUploadAvatar')}
              </Button>
            </div>
          </div>
          <div className="git-identity-avatar-dialog-footer">
            <Button onClick={this.onCloseGitIdentitySettings}>
              {t('common.close')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  private getGitIdentityRuleGroups() {
    const rulesByEmail = new Map<string, Array<IGitIdentityRule>>()

    for (const rule of this.props.gitIdentityRules) {
      const key = rule.email.toLowerCase()
      const rules = rulesByEmail.get(key)

      if (rules === undefined) {
        rulesByEmail.set(key, [rule])
      } else {
        rules.push(rule)
      }
    }

    const groups = new Array<IGitIdentityRuleGroup>()

    for (const [key, rules] of rulesByEmail) {
      const preferredRule = this.getPreferredGitIdentityRule(rules)
      const avatarRule = rules.find(rule => rule.avatarURL !== null)

      groups.push({
        key,
        rules,
        name: preferredRule.name,
        email: preferredRule.email,
        avatarURL: avatarRule?.avatarURL ?? null,
      })
    }

    return groups
  }

  private getPreferredGitIdentityRule(
    rules: ReadonlyArray<IGitIdentityRule>
  ): IGitIdentityRule {
    return rules.find(rule => this.isGiteaIdentityRule(rule)) ?? rules[0]
  }

  private isGiteaIdentityRule(rule: IGitIdentityRule) {
    return rule.host.startsWith('gitea.')
  }

  private onGitIdentitySettingsClicked = (key: string) => {
    return () => {
      this.setState({ selectedGitIdentityKey: key })
    }
  }

  private onCloseGitIdentitySettings = () => {
    this.setState({ selectedGitIdentityKey: null })
  }

  private onUseGiteaAvatar = (group: IGitIdentityRuleGroup) => {
    return async () => {
      const rule = group.rules.find(x => this.isGiteaIdentityRule(x))
      const login = rule?.login ?? ''

      if (rule === undefined || login.length === 0) {
        return
      }

      const avatarURL = await getGitIdentityAvatarURL(rule.host, login)

      if (avatarURL !== null) {
        this.props.onGitIdentityRuleAvatarURLChanged(rule, avatarURL)
      }
    }
  }

  private onUploadGitIdentityAvatar = (group: IGitIdentityRuleGroup) => {
    return async () => {
      const path = await showOpenDialog({
        properties: ['openFile'],
        filters: [
          {
            name: t('preferences.accounts.gitIdentityAvatarImageFilter'),
            extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
          },
        ],
      })

      if (path === null) {
        return
      }

      this.props.onGitIdentityRuleAvatarURLChanged(
        this.getPreferredGitIdentityRule(group.rules),
        encodePathAsUrl(path)
      )
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
