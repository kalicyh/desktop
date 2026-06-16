import * as React from 'react'
import classNames from 'classnames'

import { ILocalRepositoryState, Repository } from '../../models/repository'
import { RepositoryGroup } from '../../models/repository-group'
import { PopupType } from '../../models/popup'
import { caseInsensitiveCompare } from '../../lib/compare'
import { Dispatcher } from '../dispatcher'
import { Button } from '../lib/button'
import { TooltippedContent } from '../lib/tooltipped-content'
import { IMenuItem, showContextualMenu } from '../../lib/menu-item'
import { t } from '../../lib/i18n'
import { Octicon, iconForRepository } from '../octicons'
import * as octicons from '../octicons/octicons.generated'
import { renderRepoIndicators } from '../repositories-list/repository-list-item'
import {
  getRepositoryListGroupFavoriteKey,
  groupRepositories,
} from '../repositories-list/group-repositories'
import { getRepositoryListGroupLabel } from '../repositories-list/repository-list-group-label'

interface IFavoritesSidebarProps {
  readonly repositories: ReadonlyArray<Repository>
  readonly recentRepositories: ReadonlyArray<number>
  readonly repositoryGroups: ReadonlyArray<RepositoryGroup>
  readonly favoriteRepositoryListGroups: ReadonlyArray<string>
  readonly selectedRepository: Repository | null
  readonly localRepositoryStateLookup: ReadonlyMap<
    number,
    ILocalRepositoryState
  >
  readonly dispatcher: Dispatcher
  readonly onShowRepositoryContextMenu: (repository: Repository) => void
}

interface IFavoritesSidebarState {
  readonly collapsedGroupIds: ReadonlySet<string>
}

interface IFavoriteGroupSection {
  readonly id: string
  readonly name: string
  readonly group: RepositoryGroup | null
  readonly favoriteGroupKey: string | null
  readonly repositories: ReadonlyArray<Repository>
  readonly memberCount: number
}

const ungroupedFavoritesId = 'favorites'

export class FavoritesSidebar extends React.Component<
  IFavoritesSidebarProps,
  IFavoritesSidebarState
> {
  public constructor(props: IFavoritesSidebarProps) {
    super(props)

    this.state = {
      collapsedGroupIds: new Set(),
    }
  }

  public render() {
    const sections = this.getSections()

    return (
      <aside
        className="favorites-sidebar"
        aria-label={t('favoritesSidebar.ariaLabel')}
      >
        <div className="favorites-sidebar-header">
          <Octicon symbol={octicons.starFill} />
          <div className="favorites-sidebar-title">
            {t('favoritesSidebar.title')}
          </div>
          <Button
            className="favorites-sidebar-add-group"
            ariaLabel={t('favoritesSidebar.newGroup')}
            tooltip={t('favoritesSidebar.newGroup')}
            onClick={this.onCreateGroup}
          >
            <Octicon symbol={octicons.plus} />
          </Button>
        </div>
        {sections.length === 0 ? (
          <div className="favorites-sidebar-empty">
            {t('favoritesSidebar.empty')}
          </div>
        ) : (
          <div className="favorites-sidebar-list">{sections}</div>
        )}
      </aside>
    )
  }

  private getSections() {
    const favoriteListGroupSections = this.getFavoriteListGroupSections()
    const repositoriesInFavoriteListGroups = new Set(
      favoriteListGroupSections.flatMap(section =>
        section.repositories.map(repository => repository.id)
      )
    )
    const favoriteRepositories = this.props.repositories.filter(
      r => r.isFavorite && !repositoriesInFavoriteListGroups.has(r.id)
    )
    const byGroupId = new Map<number, Repository[]>()
    const ungrouped: Repository[] = []

    for (const repository of favoriteRepositories) {
      if (repository.groupId === null) {
        ungrouped.push(repository)
        continue
      }

      const repositories = byGroupId.get(repository.groupId) ?? []
      repositories.push(repository)
      byGroupId.set(repository.groupId, repositories)
    }

    const groupMemberCounts = new Map<number, number>()
    for (const repository of this.props.repositories) {
      if (repository.groupId === null) {
        continue
      }

      groupMemberCounts.set(
        repository.groupId,
        (groupMemberCounts.get(repository.groupId) ?? 0) + 1
      )
    }

    const sections: IFavoriteGroupSection[] = [...favoriteListGroupSections]

    for (const group of this.props.repositoryGroups) {
      const repositories = byGroupId.get(group.id)
      if (repositories === undefined || repositories.length === 0) {
        continue
      }

      sections.push({
        id: group.id.toString(),
        name: group.name,
        group,
        favoriteGroupKey: null,
        repositories: this.sortRepositories(repositories),
        memberCount: groupMemberCounts.get(group.id) ?? repositories.length,
      })
    }

    if (ungrouped.length > 0) {
      sections.push({
        id: ungroupedFavoritesId,
        name: t('favoritesSidebar.ungrouped'),
        group: null,
        favoriteGroupKey: null,
        repositories: this.sortRepositories(ungrouped),
        memberCount: ungrouped.length,
      })
    }

    return sections.map(this.renderSection)
  }

  private getFavoriteListGroupSections(): ReadonlyArray<IFavoriteGroupSection> {
    const favoriteGroupKeys = new Set(this.props.favoriteRepositoryListGroups)

    if (favoriteGroupKeys.size === 0) {
      return []
    }

    const repositoryListGroups = groupRepositories(
      this.props.repositories,
      this.props.repositoryGroups,
      this.props.localRepositoryStateLookup,
      this.props.recentRepositories
    )
    const sections: IFavoriteGroupSection[] = []

    for (const group of repositoryListGroups) {
      const favoriteGroupKey = getRepositoryListGroupFavoriteKey(
        group.identifier
      )

      if (!favoriteGroupKeys.has(favoriteGroupKey)) {
        continue
      }

      const repositories = group.items
        .map(item => item.repository)
        .filter(
          (repository): repository is Repository =>
            repository instanceof Repository
        )

      if (repositories.length === 0) {
        continue
      }

      sections.push({
        id: `list-group:${favoriteGroupKey}`,
        name: getRepositoryListGroupLabel(group.identifier),
        group:
          group.identifier.kind === 'group' ? group.identifier.group : null,
        favoriteGroupKey,
        repositories: this.sortRepositories(repositories),
        memberCount: repositories.length,
      })
    }

    return sections
  }

  private sortRepositories(repositories: ReadonlyArray<Repository>) {
    return [...repositories].sort((x, y) =>
      caseInsensitiveCompare(x.name, y.name)
    )
  }

  private renderSection = (section: IFavoriteGroupSection) => {
    const collapsed = this.state.collapsedGroupIds.has(section.id)

    return (
      <div className="favorites-sidebar-section" key={section.id}>
        <button
          className="favorites-sidebar-group-header"
          type="button"
          aria-expanded={!collapsed}
          onClick={() => this.onToggleGroup(section.id)}
          onContextMenu={event => this.onGroupContextMenu(event, section)}
        >
          <Octicon
            className="favorites-sidebar-disclosure"
            symbol={collapsed ? octicons.chevronRight : octicons.chevronDown}
          />
          <TooltippedContent
            className="favorites-sidebar-group-name"
            tooltip={section.name}
            onlyWhenOverflowed={true}
          >
            {section.name}
          </TooltippedContent>
          <span className="favorites-sidebar-group-count">
            {section.repositories.length}
          </span>
        </button>
        {!collapsed && (
          <div className="favorites-sidebar-group-items">
            {section.repositories.map(this.renderRepository)}
          </div>
        )}
      </div>
    )
  }

  private renderRepository = (repository: Repository) => {
    const selected = this.props.selectedRepository?.id === repository.id
    const repositoryState = this.props.localRepositoryStateLookup.get(
      repository.id
    )
    const hasChanges = (repositoryState?.changedFilesCount ?? 0) > 0

    return (
      <button
        className={classNames('favorites-sidebar-item', { selected })}
        key={repository.id}
        type="button"
        onClick={() => this.onRepositoryClick(repository)}
        onContextMenu={event => this.onRepositoryContextMenu(event, repository)}
      >
        <Octicon
          className="icon-for-repository"
          symbol={iconForRepository(repository)}
        />
        <TooltippedContent
          className="favorites-sidebar-item-name"
          tooltip={repository.path}
          onlyWhenOverflowed={true}
        >
          {repository.alias ?? repository.name}
        </TooltippedContent>
        {renderRepoIndicators({
          aheadBehind: repositoryState?.aheadBehind ?? null,
          hasChanges,
        })}
      </button>
    )
  }

  private onCreateGroup = () => {
    this.props.dispatcher.showPopup({
      type: PopupType.RepositoryGroupName,
      mode: 'create',
    })
  }

  private onToggleGroup(groupId: string) {
    const collapsedGroupIds = new Set(this.state.collapsedGroupIds)

    if (collapsedGroupIds.has(groupId)) {
      collapsedGroupIds.delete(groupId)
    } else {
      collapsedGroupIds.add(groupId)
    }

    this.setState({ collapsedGroupIds })
  }

  private onGroupContextMenu(
    event: React.MouseEvent<HTMLButtonElement>,
    section: IFavoriteGroupSection
  ) {
    event.preventDefault()

    const items: IMenuItem[] = []

    const favoriteGroupKey = section.favoriteGroupKey

    if (favoriteGroupKey !== null) {
      items.push({
        label: t('repositoryGroups.menu.removeFromFavorites'),
        action: () =>
          this.props.dispatcher.setRepositoryListGroupFavorite(
            favoriteGroupKey,
            false
          ),
      })
    }

    if (section.group === null) {
      if (items.length > 0) {
        showContextualMenu(items)
      }
      return
    }

    const { group } = section

    if (items.length > 0) {
      items.push({ type: 'separator' })
    }

    items.push(
      {
        label: t('repositoryGroups.menu.rename'),
        action: () =>
          this.props.dispatcher.showPopup({
            type: PopupType.RepositoryGroupName,
            mode: 'rename',
            groupId: group.id,
            currentName: group.name,
          }),
      },
      {
        label: t('repositoryGroups.menu.delete'),
        action: () =>
          this.props.dispatcher.showPopup({
            type: PopupType.ConfirmDeleteRepositoryGroup,
            groupId: group.id,
            groupName: group.name,
            memberCount: section.memberCount,
          }),
      },
    )

    showContextualMenu(items)
  }

  private onRepositoryClick(repository: Repository) {
    const repositoryState = this.props.localRepositoryStateLookup.get(
      repository.id
    )
    const hasIndicator =
      (repositoryState?.changedFilesCount ?? 0) > 0 ||
      (repositoryState?.aheadBehind?.ahead ?? 0) > 0 ||
      (repositoryState?.aheadBehind?.behind ?? 0) > 0

    this.props.dispatcher.recordRepoClicked(hasIndicator)
    this.props.dispatcher.selectRepository(repository)
  }

  private onRepositoryContextMenu(
    event: React.MouseEvent<HTMLButtonElement>,
    repository: Repository
  ) {
    event.preventDefault()
    this.props.onShowRepositoryContextMenu(repository)
  }
}
