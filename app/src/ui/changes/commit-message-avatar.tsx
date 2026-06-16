import React from 'react'
import { Select } from '../lib/select'
import { Button } from '../lib/button'
import { Row } from '../lib/row'
import {
  Popover,
  PopoverAnchorPosition,
  PopoverDecoration,
} from '../lib/popover'
import { IAvatarUser } from '../../models/avatar'
import { Avatar } from '../lib/avatar'
import { Octicon } from '../octicons'
import * as octicons from '../octicons/octicons.generated'
import { LinkButton } from '../lib/link-button'
import { OkCancelButtonGroup } from '../dialog'
import { getConfigValue } from '../../lib/git/config'
import { Repository } from '../../models/repository'
import classNames from 'classnames'
import { RepoRulesMetadataFailures } from '../../models/repo-rules'
import { RepoRulesMetadataFailureList } from '../repository-rules/repo-rules-failure-list'
import { Account } from '../../models/account'
import { t } from '../../lib/i18n'

export type CommitMessageAvatarWarningType =
  | 'none'
  | 'misattribution'
  | 'disallowedEmail'

interface ICommitMessageAvatarState {
  readonly isPopoverOpen: boolean

  /** Currently selected account email address. */
  readonly accountEmail: string

  /** Whether the git configuration is local to the repository or global  */
  readonly isGitConfigLocal: boolean
}

interface ICommitMessageAvatarProps {
  /** The user whose avatar should be displayed. */
  readonly user?: IAvatarUser

  /** Current email address configured by the user. */
  readonly email?: string

  /**
   * Controls whether a warning should be displayed.
   * - 'none': No error is displayed, the field is valid.
   * - 'misattribution': The user's Git config emails don't match and the
   * commit may not be attributed to the user.
   * - 'disallowedEmail': A repository rule may prevent the user from
   * committing with the selected email address.
   */
  readonly warningType: CommitMessageAvatarWarningType

  /**
   * List of validations that failed for repo rules. Only used if
   * `warningType` is 'disallowedEmail'.
   */
  readonly emailRuleFailures?: RepoRulesMetadataFailures

  /**
   * Name of the current branch
   */
  readonly branch: string | null

  /** Whether or not the user's account is a GHE account. */
  readonly isEnterpriseAccount: boolean

  /** Email addresses available in the relevant GitHub (Enterprise) account. */
  readonly accountEmails: ReadonlyArray<string>

  /** Preferred email address from the user's account. */
  readonly preferredAccountEmail: string

  /**
   * The currently selected repository
   */
  readonly repository: Repository

  readonly onUpdateEmail: (email: string) => void

  /**
   * Called when the user has requested to see the Git Config tab in the
   * repository settings dialog
   */
  readonly onOpenRepositorySettings: () => void

  /**
   * Called when the user has requested to see the Git tab in the user settings
   * dialog
   */
  readonly onOpenGitSettings: () => void

  readonly accounts: ReadonlyArray<Account>
}

/**
 * User avatar shown in the commit message area. It encapsulates not only the
 * user avatar, but also any badge and warning we might display to the user.
 */
export class CommitMessageAvatar extends React.Component<
  ICommitMessageAvatarProps,
  ICommitMessageAvatarState
> {
  private avatarButtonRef: HTMLButtonElement | null = null
  private warningBadgeRef = React.createRef<HTMLDivElement>()

  public constructor(props: ICommitMessageAvatarProps) {
    super(props)

    this.state = {
      isPopoverOpen: false,
      accountEmail: this.props.preferredAccountEmail,
      isGitConfigLocal: false,
    }
    this.determineGitConfigLocation()
  }

  public componentDidUpdate(prevProps: ICommitMessageAvatarProps) {
    if (
      this.props.user?.name !== prevProps.user?.name ||
      this.props.user?.email !== prevProps.user?.email
    ) {
      this.determineGitConfigLocation()
    }

    if (
      this.props.preferredAccountEmail !== prevProps.preferredAccountEmail &&
      this.state.accountEmail === prevProps.preferredAccountEmail
    ) {
      this.setState({ accountEmail: this.props.preferredAccountEmail })
    }
  }

  private async determineGitConfigLocation() {
    const isGitConfigLocal = await this.isGitConfigLocal()
    this.setState({ isGitConfigLocal })
  }

  private isGitConfigLocal = async () => {
    const { repository } = this.props
    const localName = await getConfigValue(repository, 'user.name', true)
    const localEmail = await getConfigValue(repository, 'user.email', true)
    return localName !== null || localEmail !== null
  }

  private onButtonRef = (buttonRef: HTMLButtonElement | null) => {
    this.avatarButtonRef = buttonRef
  }

  public render() {
    const { warningType, user } = this.props

    let ariaLabel = ''
    switch (warningType) {
      case 'none':
        ariaLabel = t('changes.commitAuthor.viewInfo')
        break

      case 'misattribution':
        ariaLabel = t('changes.commitAuthor.misattributionAriaLabel')
        break

      case 'disallowedEmail':
        ariaLabel = t('changes.commitAuthor.disallowedEmailAriaLabel')
        break
    }

    const classes = classNames('commit-message-avatar-component', {
      misattributed: warningType !== 'none',
    })

    return (
      <div className={classes}>
        <Button
          className="avatar-button"
          ariaLabel={ariaLabel}
          onButtonRef={this.onButtonRef}
          onClick={this.onAvatarClick}
        >
          {warningType !== 'none' && this.renderWarningBadge()}
          <Avatar accounts={this.props.accounts} user={user} title={null} />
        </Button>
        {this.state.isPopoverOpen && this.renderPopover()}
      </div>
    )
  }

  private renderWarningBadge() {
    const { warningType, emailRuleFailures } = this.props

    // the parent component only renders this one if an error/warning is present, so we
    // only need to check which of the two it is here
    const isError =
      warningType === 'disallowedEmail' && emailRuleFailures?.status === 'fail'
    const classes = classNames('warning-badge', {
      error: isError,
      warning: !isError,
    })
    const symbol = isError ? octicons.stop : octicons.alert

    return (
      <div className={classes} ref={this.warningBadgeRef}>
        <Octicon symbol={symbol} />
      </div>
    )
  }

  private openPopover = () => {
    this.setState(prevState => {
      if (prevState.isPopoverOpen === false) {
        return { isPopoverOpen: true }
      }
      return null
    })
  }

  private closePopover = () => {
    this.setState(prevState => {
      if (prevState.isPopoverOpen) {
        return { isPopoverOpen: false }
      }
      return null
    })
  }

  private onAvatarClick = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (this.state.isPopoverOpen) {
      this.closePopover()
    } else {
      this.openPopover()
    }
  }

  private renderGitConfigPopover() {
    const { user } = this.props
    const { isGitConfigLocal } = this.state

    const settings = isGitConfigLocal
      ? t('changes.commitAuthor.repositorySettings')
      : t('changes.commitAuthor.gitSettings')
    const configDescription = isGitConfigLocal
      ? t('changes.commitAuthor.localGitConfiguration')
      : t('changes.commitAuthor.globalGitConfiguration')

    return (
      <>
        <p>
          {user &&
            user.name &&
            t('changes.commitAuthor.emailLabel', { email: user.email })}
        </p>

        <p>
          {t('changes.commitAuthor.updateConfigMessage', {
            config: configDescription,
            settings,
          })}
        </p>

        {!isGitConfigLocal && (
          <p className="secondary-text">
            {t('changes.commitAuthor.setLocalEmailPrefix')}{' '}
            <LinkButton onClick={this.onRepositorySettingsClick}>
              {t('changes.commitAuthor.repositorySettings')}
            </LinkButton>
            {t('changes.commitAuthor.setLocalEmailSuffix')}
          </p>
        )}
        <Row className="button-row">
          <OkCancelButtonGroup
            okButtonText={t('changes.commitAuthor.openGitSettings')}
            onOkButtonClick={this.onOpenGitSettings}
            onCancelButtonClick={this.onIgnoreClick}
          />
        </Row>
      </>
    )
  }

  private renderWarningPopover() {
    const { warningType, emailRuleFailures } = this.props

    const updateEmailTitle = t('changes.commitAuthor.updateEmail')

    const sharedHeader = (
      <>
        {t('changes.commitAuthor.globalGitConfigEmailPrefix')} (
        <span className="git-email">{this.props.email}</span>)
      </>
    )

    const hasEmails = this.props.accountEmails.length > 0

    const sharedFooter = (
      <>
        {hasEmails && (
          <Row>
            <Select
              label={t('changes.commitAuthor.accountEmails')}
              value={this.state.accountEmail}
              onChange={this.onSelectedGitHubEmailChange}
            >
              {this.props.accountEmails.map(n => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
          </Row>
        )}
        <Row>
          <div className="secondary-text">
            {hasEmails
              ? t('changes.commitAuthor.chooseLocalEmailAlsoPrefix')
              : t('changes.commitAuthor.chooseLocalEmailPrefix')}{' '}
            <LinkButton onClick={this.onRepositorySettingsClick}>
              {t('changes.commitAuthor.repositorySettings')}
            </LinkButton>
            {t('changes.commitAuthor.chooseLocalEmailSuffix')}
          </div>
        </Row>
        <Row className="button-row">
          <Button onClick={this.onIgnoreClick} type="button">
            {t('changes.commitAuthor.ignore')}
          </Button>
          {hasEmails && (
            <Button onClick={this.onUpdateEmailClick} type="submit">
              {updateEmailTitle}
            </Button>
          )}
        </Row>
      </>
    )

    if (warningType === 'misattribution') {
      const accountTypeSuffix = this.props.isEnterpriseAccount
        ? t('changes.commitAuthor.enterpriseSuffix')
        : ''

      const userName =
        this.props.user && this.props.user.name
          ? t('changes.commitAuthor.forUser', { name: this.props.user.name })
          : ''

      return (
        <>
          <Row>
            <div>
              {sharedHeader}{' '}
              {t('changes.commitAuthor.misattributionMessage', {
                accountTypeSuffix,
                userName,
              })}{' '}
              <LinkButton
                ariaLabel={t('preferences.git.emailWarning.learnMoreAriaLabel')}
                uri="https://docs.github.com/en/github/committing-changes-to-your-project/why-are-my-commits-linked-to-the-wrong-user"
              >
                {t('preferences.git.emailWarning.learnMore')}
              </LinkButton>
            </div>
          </Row>
          {sharedFooter}
        </>
      )
    } else if (
      warningType === 'disallowedEmail' &&
      emailRuleFailures &&
      this.props.branch &&
      this.props.repository.gitHubRepository
    ) {
      return (
        <>
          <RepoRulesMetadataFailureList
            repository={this.props.repository.gitHubRepository}
            branch={this.props.branch}
            failures={emailRuleFailures}
            leadingText={sharedHeader}
          />
          {sharedFooter}
        </>
      )
    }

    return
  }

  private getCommittingAsTitle(): string | JSX.Element | undefined {
    const { user } = this.props

    if (user === undefined) {
      return t('history.unknownUser')
    }

    const { name, email } = user

    if (name) {
      return (
        <>
          {t('changes.commitAuthor.committingAs')} <strong>{name}</strong>
        </>
      )
    }

    return <>{t('changes.commitAuthor.committingWith', { email })}</>
  }

  private renderPopover() {
    const { warningType } = this.props

    let header: string | JSX.Element | undefined = ''
    switch (this.props.warningType) {
      case 'misattribution':
        header = t('changes.commitAuthor.misattributionHeader')
        break

      case 'disallowedEmail':
        header = t('changes.commitAuthor.disallowedEmailHeader')
        break

      default:
        header = this.getCommittingAsTitle()
        break
    }

    return (
      <Popover
        anchor={
          warningType !== 'none'
            ? this.warningBadgeRef.current
            : this.avatarButtonRef
        }
        anchorPosition={PopoverAnchorPosition.RightBottom}
        decoration={PopoverDecoration.Balloon}
        onMousedownOutside={this.closePopover}
        onClickOutside={this.closePopover}
        ariaLabelledby="commit-avatar-popover-header"
      >
        <h3 id="commit-avatar-popover-header">{header}</h3>

        {warningType !== 'none'
          ? this.renderWarningPopover()
          : this.renderGitConfigPopover()}
      </Popover>
    )
  }

  private onRepositorySettingsClick = () => {
    this.closePopover()
    this.props.onOpenRepositorySettings()
  }

  private onOpenGitSettings = () => {
    this.closePopover()
    if (this.state.isGitConfigLocal) {
      this.props.onOpenRepositorySettings()
    } else {
      this.props.onOpenGitSettings()
    }
  }

  private onIgnoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    this.closePopover()
  }

  private onUpdateEmailClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
    this.closePopover()

    if (this.props.email !== this.state.accountEmail) {
      this.props.onUpdateEmail(this.state.accountEmail)
    }
  }

  private onSelectedGitHubEmailChange = (
    event: React.FormEvent<HTMLSelectElement>
  ) => {
    const email = event.currentTarget.value
    if (email) {
      this.setState({ accountEmail: email })
    }
  }
}
