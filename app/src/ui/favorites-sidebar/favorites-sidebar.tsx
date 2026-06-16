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

interface IFavoritesSidebarProps {
  readonly repositories: ReadonlyArray<Repository>
  readonly repositoryGroups: ReadonlyArray<RepositoryGroup>
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
    const favoriteRepositories = this.props.repositories.filter(
      r => r.isFavorite
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

    const sections: IFavoriteGroupSection[] = []

    for (const group of this.props.repositoryGroups) {
      const repositories = byGroupId.get(group.id)
      if (repositories === undefined || repositories.length === 0) {
        continue
      }

      sections.push({
        id: group.id.toString(),
        name: group.name,
        group,
        repositories: this.sortRepositories(repositories),
        memberCount: groupMemberCounts.get(group.id) ?? repositories.length,
      })
    }

    if (ungrouped.length > 0) {
      sections.push({
        id: ungroupedFavoritesId,
        name: t('favoritesSidebar.ungrouped'),
        group: null,
        repositories: this.sortRepositories(ungrouped),
        memberCount: ungrouped.length,
      })
    }

    return sections.map(this.renderSection)
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

    if (section.group === null) {
      return
    }

    const { group } = section

    const items: ReadonlyArray<IMenuItem> = [
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
    ]

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
