import * as Path from 'path'

import { IMenuItem } from '../../lib/menu-item'
import { writeClipboardText } from '../main-process-proxy'
import { isRepositoryAffectedByAssistedCommit } from '../../lib/git/repository-operation'
import { t } from '../../lib/i18n'

interface IWorktreeContextMenuConfig {
  readonly path: string
  readonly isMainWorktree: boolean
  readonly isLocked: boolean
  readonly onRenameWorktree?: (path: string) => void
  readonly onRemoveWorktree?: (path: string) => void
}

export function generateWorktreeContextMenuItems(
  config: IWorktreeContextMenuConfig
): ReadonlyArray<IMenuItem> {
  const { path, isMainWorktree, isLocked, onRenameWorktree, onRemoveWorktree } =
    config
  const name = Path.basename(path)
  const canMutate =
    !isMainWorktree && !isLocked && !isRepositoryAffectedByAssistedCommit(path)
  const items = new Array<IMenuItem>()

  if (onRenameWorktree !== undefined) {
    items.push({
      label: t('worktree.context.rename'),
      action: () => onRenameWorktree(path),
      enabled: canMutate,
    })
  }

  items.push({
    label: t('worktree.context.copyName'),
    action: () => writeClipboardText(name),
  })

  items.push({
    label: t('worktree.context.copyPath'),
    action: () => writeClipboardText(path),
  })

  items.push({ type: 'separator' })

  if (onRemoveWorktree !== undefined) {
    items.push({
      label: t('worktree.context.delete'),
      action: () => onRemoveWorktree(path),
      enabled: canMutate,
    })
  }

  return items
}
