import * as React from 'react'

import { RepositoryListItem } from './repository-list-item'
import {
  groupRepositories,
  IRepositoryListItem,
  Repositoryish,
  RepositoryListGroup,
  getGroupKey,
  getRepositoryListGroupFavoriteKey,
} from './group-repositories'
import { IFilterListGroup } from '../lib/filter-list'
import { IMatches } from '../../lib/fuzzy-find'
import { ILocalRepositoryState, Repository } from '../../models/repository'
import { RepositoryGroup } from '../../models/repository-group'
import { Dispatcher } from '../dispatcher'
import { Button } from '../lib/button'
import { Octicon } from '../octicons'
import * as octicons from '../octicons/octicons.generated'
import { showContextualMenu } from '../../lib/menu-item'
import { IMenuItem } from '../../lib/menu-item'
import { PopupType } from '../../models/popup'
import { encodePathAsUrl } from '../../lib/path'
import { TooltippedContent } from '../lib/tooltipped-content'
import memoizeOne from 'memoize-one'
import { KeyboardShortcut } from '../keyboard-shortcut/keyboard-shortcut'
import { generateRepositoryListContextMenu } from '../repositories-list/repository-list-item-context-menu'
import { enableWorktreeSupport } from '../../lib/feature-flag'
import { SectionFilterList } from '../lib/section-filter-list'
import { IAheadBehind } from '../../models/branch'
import { t } from '../../lib/i18n'
import { getRepositoryListGroupLabel } from './repository-list-group-label'

const BlankSlateImage = encodePathAsUrl(__dirname, 'static/empty-no-repo.svg')

interface IRepositoriesListProps {
  readonly selectedRepository: Repositoryish | null
  readonly repositories: ReadonlyArray<Repositoryish>
  readonly recentRepositories: ReadonlyArray<number>
  readonly repositoryGroups: ReadonlyArray<RepositoryGroup>
  readonly favoriteRepositoryListGroups: ReadonlyArray<string>

  /** A cache of the latest repository state values, keyed by the repository id */
  readonly localRepositoryStateLookup: ReadonlyMap<
    number,
    ILocalRepositoryState
  >

  /** Called when a repository has been selected. */
  readonly onSelectionChanged: (repository: Repositoryish) => void

  /** Whether the user has enabled the setting to confirm removing a repository from the app */
  readonly askForConfirmationOnRemoveRepository: boolean

  /** Called when the repository should be removed. */
  readonly onRemoveRepository: (repository: Repositoryish) => void

  /** Called when the repository should be shown in Finder/Explorer/File Manager. */
  readonly onShowRepository: (repository: Repositoryish) => void

  /** Called when the repository should be opened on GitHub in the default web browser. */
  readonly onViewOnGitHub: (repository: Repositoryish) => void

  /** Called when the repository should be shown in the shell. */
  readonly onOpenInShell: (repository: Repositoryish) => void

  /** Called when the repository should be opened in an external editor */
  readonly onOpenInExternalEditor: (repository: Repositoryish) => void

  /** The current external editor selected by the user */
  readonly externalEditorLabel?: string

  /** The label for the user's preferred shell. */
  readonly shellLabel?: string

  /** The callback to fire when the filter text has changed */
  readonly onFilterTextChanged: (text: string) => void

  /** The text entered by the user to filter their repository list */
  readonly filterText: string

  readonly dispatcher: Dispatcher
}

interface IRepositoriesListState {
  readonly newRepositoryMenuExpanded: boolean
  readonly selectedItem: IRepositoryListItem | null
}

const RowHeight = 29

/**
 * Iterate over all groups until a list item is found that matches
 * the id of the provided repository.
 */
function findMatchingListItem(
  groups: ReadonlyArray<
    IFilterListGroup<IRepositoryListItem, RepositoryListGroup>
  >,
  selectedRepository: Repositoryish | null
) {
  if (selectedRepository !== null) {
    for (const group of groups) {
      for (const item of group.items) {
        if (item.repository.id === selectedRepository.id) {
          return item
        }
      }
    }
  }

  return null
}

/** The list of user-added repositories. */
export class RepositoriesList extends React.Component<
  IRepositoriesListProps,
  IRepositoriesListState
> {
  /**
   * A memoized function for grouping repositories for display
   * in the FilterList. The group will not be recomputed as long
   * as the provided list of repositories is equal to the last
   * time the method was called (reference equality).
   */
  private getRepositoryGroups = memoizeOne(
    (
      repositories: ReadonlyArray<Repositoryish> | null,
      repositoryGroups: ReadonlyArray<RepositoryGroup>,
      localRepositoryStateLookup: ReadonlyMap<number, ILocalRepositoryState>,
      recentRepositories: ReadonlyArray<number>
    ) =>
      repositories === null
        ? []
        : groupRepositories(
            repositories,
            repositoryGroups,
            localRepositoryStateLookup,
            recentRepositories
          )
  )

  /**
   * A memoized function for finding the selected list item based
   * on an IAPIRepository instance. The selected item will not be
   * recomputed as long as the provided list of repositories and
   * the selected data object is equal to the last time the method
   * was called (reference equality).
   *
   * See findMatchingListItem for more details.
   */
  private getSelectedListItem = memoizeOne(findMatchingListItem)

  public constructor(props: IRepositoriesListProps) {
    super(props)

    this.state = {
      newRepositoryMenuExpanded: false,
      selectedItem: null,
    }
  }

  private renderItem = (item: IRepositoryListItem, matches: IMatches) => {
    const repository = item.repository
    return (
      <RepositoryListItem
        key={repository.id}
        repository={repository}
        needsDisambiguation={item.needsDisambiguation}
        matches={matches}
        aheadBehind={item.aheadBehind}
        changedFilesCount={item.changedFilesCount}
      />
    )
  }

  private getAheadBehindTooltip = (aheadBehind: IAheadBehind | null) => {
    if (aheadBehind === null) {
      return null
    }

    const { ahead, behind } = aheadBehind

    if (behind === 0 && ahead === 0) {
      return null
    }

    let relationship = ''
    if (behind > 0) {
      relationship += t('repositories.tooltip.behind', {
        commits: this.getCommitCountText(behind),
      })
    }

    if (behind > 0 && ahead > 0) {
      relationship += t('repositories.tooltip.and')
    }

    if (ahead > 0) {
      relationship += t('repositories.tooltip.ahead', {
        commits: this.getCommitCountText(ahead),
      })
    }

    return `${t('repositories.tooltip.currentBranchPrefix')}${relationship}${t(
      'repositories.tooltip.trackedBranchSuffix'
    )}`
  }

  private getCommitCountText(count: number) {
    return t(
      count === 1
        ? 'repositories.tooltip.commitCount.one'
        : 'repositories.tooltip.commitCount.other',
      { count }
    )
  }

  private renderRowFocusTooltip = (
    item: IRepositoryListItem
  ): JSX.Element | string | null => {
    const { repository, aheadBehind, changedFilesCount } = item
    const gitHubRepo =
      repository instanceof Repository ? repository.gitHubRepository : null
    const alias = repository instanceof Repository ? repository.alias : null
    const realName = gitHubRepo ? gitHubRepo.fullName : repository.name
    const aheadBehindTooltip = this.getAheadBehindTooltip(aheadBehind)
    const hasChanges = changedFilesCount > 0
    const uncommittedChangesTooltip = hasChanges
      ? t('repositories.tooltip.uncommittedChanges')
      : null

    const ahead = aheadBehind?.ahead ?? 0
    const behind = aheadBehind?.behind ?? 0

    return (
      <div className="repository-list-item-tooltip list-item-tooltip">
        <div>
          <div className="label">{t('repositories.tooltip.fullName')} </div>
          {realName}
          {alias && <> ({alias})</>}
        </div>
        <div>
          <div className="label">{t('repositories.tooltip.path')} </div>
          {repository.path}
        </div>
        {aheadBehindTooltip && (
          <div>
            <div className="label">
              <div className="ahead-behind">
                {ahead > 0 && <Octicon symbol={octicons.arrowUp} />}
                {behind > 0 && <Octicon symbol={octicons.arrowDown} />}
              </div>
            </div>
            {aheadBehindTooltip}
          </div>
        )}
        {uncommittedChangesTooltip && (
          <div>
            <div className="label">
              <span className="change-indicator-wrapper">
                <Octicon symbol={octicons.dotFill} />
              </span>
            </div>
            {uncommittedChangesTooltip}
          </div>
        )}
      </div>
    )
  }

  private renderGroupHeader = (group: RepositoryListGroup) => {
    const label = getRepositoryListGroupLabel(group)

    return (
      <div
        key={getGroupKey(group)}
        className="filter-list-group-header repository-list-group-header"
        onClick={event => this.onGroupHeaderClick(group, event)}
        onContextMenu={event => this.onGroupContextMenu(group, event)}
      >
        <TooltippedContent
          className="repository-list-group-header-label"
          tooltip={label}
          onlyWhenOverflowed={true}
        >
          {label}
        </TooltippedContent>
      </div>
    )
  }

  private getRepositoriesForGroup(group: RepositoryListGroup) {
    const groupKey = getGroupKey(group)
    const groups = this.getRepositoryGroups(
      this.props.repositories,
      this.props.repositoryGroups,
      this.props.localRepositoryStateLookup,
      this.props.recentRepositories
    )
    const match = groups.find(g => getGroupKey(g.identifier) === groupKey)

    if (match === undefined) {
      return []
    }

    return match.items
      .map(item => item.repository)
      .filter(
        (repository): repository is Repository =>
          repository instanceof Repository
      )
  }

  private onGroupHeaderClick = (
    group: RepositoryListGroup,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (event.shiftKey) {
      event.preventDefault()
      event.stopPropagation()
      this.setRepositoryListGroupFavorite(group, true)
    } else if (event.metaKey || event.ctrlKey) {
      event.preventDefault()
      event.stopPropagation()
      this.createRepositoryGroupFromListGroup(
        group,
        this.getRepositoriesForGroup(group)
      )
    }
  }

  private onGroupContextMenu = (
    group: RepositoryListGroup,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.preventDefault()
    event.stopPropagation()

    const repositories = this.getRepositoriesForGroup(group)
    const favoriteKey = getRepositoryListGroupFavoriteKey(group)
    const isFavorite =
      this.props.favoriteRepositoryListGroups.includes(favoriteKey)

    if (event.shiftKey) {
      this.setRepositoryListGroupFavorite(group, true)
      return
    }

    if (event.metaKey || event.ctrlKey) {
      this.createRepositoryGroupFromListGroup(group, repositories)
      return
    }

    const items: Array<IMenuItem> = [
      {
        label: isFavorite
          ? t('repositoryGroups.menu.removeFromFavorites')
          : t('repositoryGroups.menu.addToFavorites'),
        action: () =>
          this.props.dispatcher.setRepositoryListGroupFavorite(
            favoriteKey,
            !isFavorite
          ),
      },
      {
        label: t('repositoryGroups.menu.addRepositoriesToFavorites'),
        enabled: repositories.length > 0,
        action: () => this.addRepositoriesToFavorites(repositories),
      },
      {
        label: t('repositoryGroups.menu.createGroupFromSection'),
        enabled: repositories.length > 0,
        action: () =>
          this.createRepositoryGroupFromListGroup(group, repositories),
      },
    ]

    if (group.kind === 'group') {
      items.push(
        { type: 'separator' },
        {
          label: t('repositoryGroups.menu.rename'),
          action: () =>
            this.props.dispatcher.showPopup({
              type: PopupType.RepositoryGroupName,
              mode: 'rename',
              groupId: group.group.id,
              currentName: group.group.name,
            }),
        },
        {
          label: t('repositoryGroups.menu.delete'),
          action: () =>
            this.props.dispatcher.showPopup({
              type: PopupType.ConfirmDeleteRepositoryGroup,
              groupId: group.group.id,
              groupName: group.group.name,
              memberCount: repositories.length,
            }),
        }
      )
    }

    showContextualMenu(items)
  }

  private setRepositoryListGroupFavorite = (
    group: RepositoryListGroup,
    isFavorite: boolean
  ) => {
    this.props.dispatcher.setRepositoryListGroupFavorite(
      getRepositoryListGroupFavoriteKey(group),
      isFavorite
    )
  }

  private addRepositoriesToFavorites = async (
    repositories: ReadonlyArray<Repository>
  ) => {
    try {
      for (const repository of repositories) {
        if (!repository.isFavorite) {
          await this.props.dispatcher.setRepositoryFavorite(repository, true)
        }
      }
    } catch (e) {
      this.props.dispatcher.postError(e)
    }
  }

  private createRepositoryGroupFromListGroup = async (
    group: RepositoryListGroup,
    repositories: ReadonlyArray<Repository>
  ) => {
    if (repositories.length === 0) {
      return
    }

    try {
      const name = this.getUniqueRepositoryGroupName(
        getRepositoryListGroupLabel(group)
      )
      const newGroup = await this.props.dispatcher.addRepositoryGroup(name)

      for (const repository of repositories) {
        await this.props.dispatcher.changeRepositoryGroup(
          repository,
          newGroup.id
        )
      }
    } catch (e) {
      this.props.dispatcher.postError(e)
    }
  }

  private getUniqueRepositoryGroupName(name: string) {
    const existingNames = new Set(
      this.props.repositoryGroups.map(group => group.name.toLocaleLowerCase())
    )

    if (!existingNames.has(name.toLocaleLowerCase())) {
      return name
    }

    let suffix = 2
    while (existingNames.has(`${name} ${suffix}`.toLocaleLowerCase())) {
      suffix++
    }

    return `${name} ${suffix}`
  }

  private onItemClick = (item: IRepositoryListItem) => {
    const hasIndicator =
      item.changedFilesCount > 0 ||
      (item.aheadBehind !== null
        ? item.aheadBehind.ahead > 0 || item.aheadBehind.behind > 0
        : false)
    this.props.dispatcher.recordRepoClicked(hasIndicator)
    this.props.onSelectionChanged(item.repository)
  }

  private onItemContextMenu = (
    item: IRepositoryListItem,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.preventDefault()

    const items = generateRepositoryListContextMenu({
      onRemoveRepository: this.props.onRemoveRepository,
      onShowRepository: this.props.onShowRepository,
      onOpenInShell: this.props.onOpenInShell,
      onOpenInExternalEditor: this.props.onOpenInExternalEditor,
      askForConfirmationOnRemoveRepository:
        this.props.askForConfirmationOnRemoveRepository,
      externalEditorLabel: this.props.externalEditorLabel,
      onChangeRepositoryAlias: this.onChangeRepositoryAlias,
      onRemoveRepositoryAlias: this.onRemoveRepositoryAlias,
      onSetRepositoryFavorite: this.onSetRepositoryFavorite,
      onSetRepositoryGroup: this.onSetRepositoryGroup,
      onCreateRepositoryGroupForRepository:
        this.onCreateRepositoryGroupForRepository,
      onViewOnGitHub: this.props.onViewOnGitHub,
      onCreateWorktree: enableWorktreeSupport()
        ? this.onCreateWorktree
        : undefined,
      onShowWorktrees: enableWorktreeSupport()
        ? this.onShowWorktrees
        : undefined,
      repository: item.repository,
      repositoryGroups: this.props.repositoryGroups,
      shellLabel: this.props.shellLabel,
    })

    showContextualMenu(items)
  }

  private getItemAriaLabel = (item: IRepositoryListItem) => item.repository.name
  private getGroupAriaLabelGetter =
    (
      groups: ReadonlyArray<
        IFilterListGroup<IRepositoryListItem, RepositoryListGroup>
      >
    ) =>
    (group: number) =>
      getRepositoryListGroupLabel(groups[group].identifier)

  public render() {
    const groups = this.getRepositoryGroups(
      this.props.repositories,
      this.props.repositoryGroups,
      this.props.localRepositoryStateLookup,
      this.props.recentRepositories
    )

    // So there's two types of selection at play here. There's the repository
    // selection for the whole app and then there's the keyboard selection in
    // the list itself. If the user has selected a repository using keyboard
    // navigation we want to honor that selection. If the user hasn't selected a
    // repository yet we'll select the repository currently selected in the app.
    const selectedItem =
      this.state.selectedItem ??
      this.getSelectedListItem(groups, this.props.selectedRepository)

    return (
      <div className="repository-list">
        <SectionFilterList<IRepositoryListItem, RepositoryListGroup>
          rowHeight={RowHeight}
          selectedItem={selectedItem}
          filterText={this.props.filterText}
          onFilterTextChanged={this.props.onFilterTextChanged}
          renderItem={this.renderItem}
          renderRowFocusTooltip={this.renderRowFocusTooltip}
          renderGroupHeader={this.renderGroupHeader}
          onItemClick={this.onItemClick}
          renderPostFilter={this.renderPostFilter}
          renderNoItems={this.renderNoItems}
          placeholderText={t('repositories.filterPlaceholder')}
          groups={groups}
          invalidationProps={{
            repositories: this.props.repositories,
            filterText: this.props.filterText,
          }}
          onItemContextMenu={this.onItemContextMenu}
          getGroupAriaLabel={this.getGroupAriaLabelGetter(groups)}
          getItemAriaLabel={this.getItemAriaLabel}
          onSelectionChanged={this.onSelectionChanged}
        />
      </div>
    )
  }

  private onSelectionChanged = (selectedItem: IRepositoryListItem | null) => {
    this.setState({ selectedItem })
  }

  private renderPostFilter = () => {
    return (
      <Button
        className="new-repository-button"
        onClick={this.onNewRepositoryButtonClick}
        ariaExpanded={this.state.newRepositoryMenuExpanded}
        onKeyDown={this.onNewRepositoryButtonKeyDown}
      >
        {t('repositories.addButton')}
        <Octicon symbol={octicons.triangleDown} />
      </Button>
    )
  }

  private onNewRepositoryButtonKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    if (event.key === 'ArrowDown') {
      this.onNewRepositoryButtonClick()
    }
  }

  private renderNoItems = () => {
    return (
      <div className="no-items no-results-found">
        <img src={BlankSlateImage} className="blankslate-image" alt="" />
        <div className="title">{t('repositories.noResults.title')}</div>

        <div className="protip">
          {t('repositories.noResults.protipStart')}
          <div className="kbd-shortcut">
            <KeyboardShortcut darwinKeys={['⌘', 'O']} keys={['Ctrl', 'O']} />
          </div>
          {t('repositories.noResults.protipAddLocal')}
          <div className="kbd-shortcut">
            <KeyboardShortcut
              darwinKeys={['⇧', '⌘', 'O']}
              keys={['Ctrl', 'Shift', 'O']}
            />
          </div>
          {t('repositories.noResults.protipClone')}
        </div>
      </div>
    )
  }

  private onNewRepositoryButtonClick = () => {
    const items: IMenuItem[] = [
      {
        label: t('repositories.menu.cloneRepository'),
        action: this.onCloneRepository,
      },
      {
        label: t('repositories.menu.createNewRepository'),
        action: this.onCreateNewRepository,
      },
      {
        label: t('repositories.menu.addExistingRepository'),
        action: this.onAddExistingRepository,
      },
    ]

    this.setState({ newRepositoryMenuExpanded: true })
    showContextualMenu(items).then(() => {
      this.setState({ newRepositoryMenuExpanded: false })
    })
  }

  private onCloneRepository = () => {
    this.props.dispatcher.showPopup({
      type: PopupType.CloneRepository,
      initialURL: null,
    })
  }

  private onAddExistingRepository = () => {
    this.props.dispatcher.showPopup({ type: PopupType.AddRepository })
  }

  private onCreateNewRepository = () => {
    this.props.dispatcher.showPopup({ type: PopupType.CreateRepository })
  }

  private onChangeRepositoryAlias = (repository: Repository) => {
    this.props.dispatcher.showPopup({
      type: PopupType.ChangeRepositoryAlias,
      repository,
    })
  }

  private onRemoveRepositoryAlias = (repository: Repository) => {
    this.props.dispatcher.changeRepositoryAlias(repository, null)
  }

  private onSetRepositoryFavorite = (
    repository: Repository,
    isFavorite: boolean
  ) => {
    this.props.dispatcher.setRepositoryFavorite(repository, isFavorite)
  }

  private onSetRepositoryGroup = (
    repository: Repository,
    groupId: number | null
  ) => {
    this.props.dispatcher.changeRepositoryGroup(repository, groupId)
  }

  private onCreateRepositoryGroupForRepository = (repository: Repository) => {
    this.props.dispatcher.showPopup({
      type: PopupType.RepositoryGroupName,
      mode: 'create',
      repository,
    })
  }

  private onCreateWorktree = (repository: Repository) => {
    this.props.dispatcher.showPopup({
      type: PopupType.AddWorktree,
      repository,
    })
  }

  private onShowWorktrees = (repository: Repository) => {
    this.props.dispatcher.selectRepository(repository)
    this.props.dispatcher.showWorktreesFoldout()
  }
}
