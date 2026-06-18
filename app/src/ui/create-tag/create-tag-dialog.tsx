import * as React from 'react'

import { Repository } from '../../models/repository'
import { Dispatcher } from '../dispatcher'
import { Dialog, DialogError, DialogContent, DialogFooter } from '../dialog'

import { OkCancelButtonGroup } from '../dialog/ok-cancel-button-group'
import { startTimer } from '../lib/timing'
import { Ref } from '../lib/ref'
import { RefNameTextBox } from '../lib/ref-name-text-box'
import { enablePreviousTagSuggestions } from '../../lib/feature-flag'
import { t } from '../../lib/i18n'

interface ICreateTagProps {
  readonly repository: Repository
  readonly dispatcher: Dispatcher
  readonly onDismissed: () => void
  readonly targetCommitSha: string
  readonly initialName?: string
  readonly localTags: Map<string, string> | null
}

interface ICreateTagState {
  readonly tagName: string
  readonly tagNameInputKey: number

  /**
   * Note: once tag creation has been initiated this value stays at true
   * and will never revert to being false. If the tag creation operation
   * fails this dialog will still be dismissed and an error dialog will be
   * shown in its place.
   */
  readonly isCreatingTag: boolean
  readonly previousTags: Array<string> | null
}

const MaxTagNameLength = 245

export function getNextVersionTag(
  localTags: Map<string, string> | null
): string | null {
  if (localTags === null) {
    return null
  }

  let latestVersion: {
    readonly prefix: string
    readonly major: number
    readonly minor: number
    readonly patch: number
  } | null = null

  for (const tagName of localTags.keys()) {
    const match = /^(v?)(\d+)\.(\d+)\.(\d+)$/.exec(tagName)

    if (match === null) {
      continue
    }

    const version = {
      prefix: match[1],
      major: Number(match[2]),
      minor: Number(match[3]),
      patch: Number(match[4]),
    }

    if (
      latestVersion === null ||
      version.major > latestVersion.major ||
      (version.major === latestVersion.major &&
        version.minor > latestVersion.minor) ||
      (version.major === latestVersion.major &&
        version.minor === latestVersion.minor &&
        version.patch > latestVersion.patch)
    ) {
      latestVersion = version
    }
  }

  return latestVersion === null
    ? null
    : `${latestVersion.prefix}${latestVersion.major}.${latestVersion.minor}.${
        latestVersion.patch + 1
      }`
}

/** The Create Tag component. */
export class CreateTag extends React.Component<
  ICreateTagProps,
  ICreateTagState
> {
  public constructor(props: ICreateTagProps) {
    super(props)

    this.state = {
      tagName: props.initialName || '',
      tagNameInputKey: 0,
      isCreatingTag: false,
      previousTags: this.getExistingTagsFiltered(),
    }
  }

  public render() {
    const error = this.getCurrentError()
    const disabled = error !== null || this.state.tagName.length === 0

    return (
      <Dialog
        id="create-tag"
        title={t('tag.create.title')}
        onSubmit={this.createTag}
        onDismissed={this.props.onDismissed}
        loading={this.state.isCreatingTag}
        disabled={this.state.isCreatingTag}
      >
        {error && <DialogError>{error}</DialogError>}

        <DialogContent>
          <RefNameTextBox
            key={this.state.tagNameInputKey}
            label={t('tag.nameLabel')}
            initialValue={this.state.tagName}
            onValueChange={this.updateTagName}
          />

          {this.renderSuggestedVersionTag()}
          {this.renderPreviousTags()}
        </DialogContent>

        <DialogFooter>
          <OkCancelButtonGroup
            okButtonText={t('tag.create.button')}
            okButtonDisabled={disabled}
          />
        </DialogFooter>
      </Dialog>
    )
  }

  private renderSuggestedVersionTag() {
    const nextVersionTag = getNextVersionTag(this.props.localTags)

    if (nextVersionTag === null) {
      return null
    }

    return (
      <>
        <p>{t('tag.suggestedVersion.title')}</p>
        <button
          className="ref-component tag-suggestion-button"
          type="button"
          onClick={this.onSuggestedTagClick(nextVersionTag)}
        >
          {nextVersionTag}
        </button>
      </>
    )
  }

  private renderPreviousTags() {
    if (!enablePreviousTagSuggestions()) {
      return null
    }

    const { localTags } = this.props
    const { previousTags } = this.state

    if (previousTags === null || localTags === null || localTags.size === 0) {
      return null
    }

    const title = t('tag.previous.title')
    const tagsToShow =
      previousTags.length > 0 ? previousTags : Array.from(localTags.keys())
    const lastThreeTags = tagsToShow.slice(-3)

    return (
      <>
        <p>{title}</p>
        {lastThreeTags.map((item: string, index: number) => (
          <Ref key={index}>{item}</Ref>
        ))}
      </>
    )
  }

  private getCurrentError(): JSX.Element | null {
    if (this.state.tagName.length > MaxTagNameLength) {
      return <>{t('tag.error.tooLong', { count: MaxTagNameLength })}</>
    }

    const alreadyExists =
      this.props.localTags && this.props.localTags.has(this.state.tagName)
    if (alreadyExists) {
      return (
        <>
          {t('tag.error.alreadyExistsPrefix')} <Ref>{this.state.tagName}</Ref>{' '}
          {t('tag.error.alreadyExistsSuffix')}
        </>
      )
    }

    return null
  }

  private getExistingTagsFiltered(filter: string = ''): Array<string> | null {
    if (this.props.localTags === null) {
      return null
    }
    const previousTags = Array.from(this.props.localTags.keys())
    return previousTags.filter(item => item.includes(filter))
  }

  private updateTagName = (tagName: string) => {
    this.setState({
      tagName,
      previousTags: this.getExistingTagsFiltered(tagName),
    })
  }

  private onSuggestedTagClick = (tagName: string) => {
    return () => {
      this.setState(state => ({
        tagName,
        tagNameInputKey: state.tagNameInputKey + 1,
        previousTags: this.getExistingTagsFiltered(tagName),
      }))
    }
  }

  private createTag = async () => {
    const name = this.state.tagName
    const repository = this.props.repository

    if (name.length > 0) {
      this.setState({ isCreatingTag: true })

      const timer = startTimer('create tag', repository)
      await this.props.dispatcher.createTag(
        repository,
        name,
        this.props.targetCommitSha
      )
      timer.done()

      this.props.onDismissed()
    }
  }
}
