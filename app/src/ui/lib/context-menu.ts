import { t } from '../../lib/i18n'

const RestrictedFileExtensions = ['.cmd', '.exe', '.bat', '.sh']

export function getCopyFilePathLabel() {
  return t('contextMenu.copyFilePath')
}

export function getCopyRelativeFilePathLabel() {
  return t('contextMenu.copyRelativeFilePath')
}

export function getCopySelectedPathsLabel() {
  return t('contextMenu.copyPaths')
}

export function getCopySelectedRelativePathsLabel() {
  return t('contextMenu.copyRelativePaths')
}

export function getDefaultEditorLabel() {
  return t('contextMenu.openInExternalEditor')
}

export function getDefaultShellLabel() {
  return t('contextMenu.openInShell')
}

export function getRevealInFileManagerLabel() {
  return __DARWIN__
    ? t('contextMenu.revealInFinder')
    : __WIN32__
    ? t('contextMenu.showInExplorer')
    : t('contextMenu.showInFileManager')
}

export function getTrashNameLabel() {
  return __WIN32__ ? t('contextMenu.recycleBin') : t('contextMenu.trash')
}

export function getOpenWithDefaultProgramLabel() {
  return t('contextMenu.openWithDefaultProgram')
}

export function isSafeFileExtension(extension: string): boolean {
  if (__WIN32__) {
    return RestrictedFileExtensions.indexOf(extension.toLowerCase()) === -1
  }
  return true
}
