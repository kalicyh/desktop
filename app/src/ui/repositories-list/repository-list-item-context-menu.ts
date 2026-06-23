import { Repository } from '../../models/repository'
import { IMenuItem } from '../../lib/menu-item'
import { Repositoryish } from './group-repositories'
import { RepositoryGroup } from '../../models/repository-group'
import { clipboard } from 'electron'
import { t } from '../../lib/i18n'
import { getUseGhForRepository, setUseGhForRepository } from '../../lib/use-gh'

interface IRepositoryListItemContextMenuConfig {
  repository: Repositoryish
  shellLabel: string | undefined
  externalEditorLabel: string | undefined
  askForConfirmationOnRemoveRepository: boolean
  repositoryGroups: ReadonlyArray<RepositoryGroup>
  onViewOnGitHub: (repository: Repositoryish) => void
  onOpenInShell: (repository: Repositoryish) => void
  onShowRepository: (repository: Repositoryish) => void
  onOpenInExternalEditor: (repository: Repositoryish) => void
  onRemoveRepository: (repository: Repositoryish) => void
  onChangeRepositoryAlias: (repository: Repository) => void
  onRemoveRepositoryAlias: (repository: Repository) => void
  onSetRepositoryFavorite: (repository: Repository, isFavorite: boolean) => void
  onSetRepositoryGroup: (repository: Repository, groupId: number | null) => void
  onCreateRepositoryGroupForRepository: (repository: Repository) => void
  onCreateWorktree?: (repository: Repository) => void
  onShowWorktrees?: (repository: Repository) => void
}

export const generateRepositoryListContextMenu = (
  config: IRepositoryListItemContextMenuConfig
) => {
  const { repository } = config
  const missing = repository instanceof Repository && repository.missing
  const github =
    repository instanceof Repository && repository.gitHubRepository != null
  const openInExternalEditor = config.externalEditorLabel
    ? t('repositoryContext.openIn', { label: config.externalEditorLabel })
    : t('repositoryContext.openInExternalEditor')
  const openInShell = config.shellLabel
    ? t('repositoryContext.openIn', { label: config.shellLabel })
    : t('repositoryContext.openInShell')

  const items: ReadonlyArray<IMenuItem> = [
    ...buildAliasMenuItems(config),
    ...buildFavoriteMenuItems(config),
    ...buildGroupMenuItems(config),
    ...buildWorktreeMenuItems(config),
    ...buildGhMenuItems(config),
    {
      label: t('repositoryContext.copyRepoName'),
      action: () => clipboard.writeText(repository.name),
    },
    {
      label: t('repositoryContext.copyRepoPath'),
      action: () => clipboard.writeText(repository.path),
    },
    { type: 'separator' },
    {
      label: t('repositoryContext.viewOnGitHub'),
      action: () => config.onViewOnGitHub(repository),
      enabled: github,
    },
    {
      label: openInShell,
      action: () => config.onOpenInShell(repository),
      enabled: !missing,
    },
    {
      label: getRevealInFileManagerLabel(),
      action: () => config.onShowRepository(repository),
      enabled: !missing,
    },
    {
      label: openInExternalEditor,
      action: () => config.onOpenInExternalEditor(repository),
      enabled: !missing,
    },
    { type: 'separator' },
    {
      label: config.askForConfirmationOnRemoveRepository
        ? t('repositoryContext.removeWithConfirmation')
        : t('repositoryContext.remove'),
      action: () => config.onRemoveRepository(repository),
    },
  ]

  return items
}

const buildGhMenuItems = (
  config: IRepositoryListItemContextMenuConfig
): ReadonlyArray<IMenuItem> => {
  const { repository } = config

  if (!(repository instanceof Repository)) {
    return []
  }

  const useGh = getUseGhForRepository(repository)

  return [
    {
      label: t('repositoryContext.useGh'),
      type: 'checkbox',
      checked: useGh,
      action: () => setUseGhForRepository(repository, !useGh),
    },
  ]
}

const buildFavoriteMenuItems = (
  config: IRepositoryListItemContextMenuConfig
): ReadonlyArray<IMenuItem> => {
  const { repository } = config

  if (!(repository instanceof Repository)) {
    return []
  }

  return [
    {
      label: repository.isFavorite
        ? t('repositoryContext.removeFromFavorites')
        : t('repositoryContext.addToFavorites'),
      action: () =>
        config.onSetRepositoryFavorite(repository, !repository.isFavorite),
    },
  ]
}

const buildGroupMenuItems = (
  config: IRepositoryListItemContextMenuConfig
): ReadonlyArray<IMenuItem> => {
  const { repository, repositoryGroups } = config

  if (!(repository instanceof Repository)) {
    return []
  }

  const submenu: Array<IMenuItem> = repositoryGroups.map(group => ({
    label: group.name,
    type: 'checkbox',
    checked: group.id === repository.groupId,
    action: () => config.onSetRepositoryGroup(repository, group.id),
  }))

  if (submenu.length > 0) {
    submenu.push({ type: 'separator' })
  }

  submenu.push({
    label: t('repositoryContext.newGroup'),
    action: () => config.onCreateRepositoryGroupForRepository(repository),
  })

  const items: Array<IMenuItem> = [
    {
      label:
        repository.groupId === null
          ? t('repositoryContext.addToGroup')
          : t('repositoryContext.moveToGroup'),
      submenu,
    },
  ]

  if (repository.groupId !== null) {
    items.push({
      label: t('repositoryContext.removeFromGroup'),
      action: () => config.onSetRepositoryGroup(repository, null),
    })
  }

  return items
}

const buildAliasMenuItems = (
  config: IRepositoryListItemContextMenuConfig
): ReadonlyArray<IMenuItem> => {
  const { repository } = config

  if (!(repository instanceof Repository)) {
    return []
  }

  const items: Array<IMenuItem> = [
    {
      label:
        repository.alias == null
          ? t('repositoryContext.createAlias')
          : t('repositoryContext.changeAlias'),
      action: () => config.onChangeRepositoryAlias(repository),
    },
  ]

  if (repository.alias !== null) {
    items.push({
      label: t('repositoryContext.removeAlias'),
      action: () => config.onRemoveRepositoryAlias(repository),
    })
  }

  return items
}

const buildWorktreeMenuItems = (
  config: IRepositoryListItemContextMenuConfig
): ReadonlyArray<IMenuItem> => {
  const { repository, onCreateWorktree, onShowWorktrees } = config

  if (!(repository instanceof Repository)) {
    return []
  }

  if (onCreateWorktree === undefined && onShowWorktrees === undefined) {
    return []
  }

  const items: Array<IMenuItem> = []

  if (onShowWorktrees !== undefined) {
    items.push({
      label: t('repositoryContext.showWorktrees'),
      action: () => onShowWorktrees(repository),
    })
  }

  if (onCreateWorktree !== undefined) {
    items.push({
      label: t('repositoryContext.newWorktree'),
      action: () => onCreateWorktree(repository),
    })
  }

  return items
}

const getRevealInFileManagerLabel = () => {
  if (__DARWIN__) {
    return t('repositoryContext.revealInFinder')
  }

  if (__WIN32__) {
    return t('repositoryContext.showInExplorer')
  }

  return t('repositoryContext.showInFileManager')
}
