export enum ApplicationLanguage {
  System = 'system',
  English = 'en',
  SimplifiedChinese = 'zh-CN',
}

export type ResolvedApplicationLanguage =
  | ApplicationLanguage.English
  | ApplicationLanguage.SimplifiedChinese

type Translations = Record<keyof typeof en, string>
export type TranslationKey = keyof Translations

type TranslationSubstitutions = Readonly<Record<string, string | number>>

const en = {
  'preferences.appearance.language.heading': 'Language',
  'preferences.appearance.language.label': 'Language',
  'preferences.appearance.language.system': 'Follow system',
  'preferences.appearance.language.english': 'English',
  'preferences.appearance.language.simplifiedChinese': 'Simplified Chinese',
  'repositories.group.recent': 'Recent',
  'repositories.group.other': 'Other',
  'favoritesSidebar.ariaLabel': 'Favorites',
  'favoritesSidebar.title': 'Favorites',
  'favoritesSidebar.newGroup': 'New group',
  'favoritesSidebar.empty': 'No favorites',
  'favoritesSidebar.ungrouped': 'Favorites',
  'repositoryGroups.menu.rename': 'Rename Group…',
  'repositoryGroups.menu.delete': 'Delete Group…',
  'repositoryGroups.createTitle': 'Create Repository Group',
  'repositoryGroups.renameTitle': 'Rename Repository Group',
  'repositoryGroups.createDescription':
    'Choose a name for this repository group.',
  'repositoryGroups.createForRepositoryDescription':
    'Choose a group name for "{name}".',
  'repositoryGroups.nameAriaLabel': 'Group name',
  'repositoryGroups.createButton': 'Create Group',
  'repositoryGroups.renameButton': 'Rename Group',
  'repositoryGroups.emptyNameError': 'Group name cannot be empty.',
  'repositoryGroups.duplicateNameError':
    'A group with this name already exists.',
  'repositoryGroups.missingGroupIdError': 'Missing repository group id.',
  'repositoryGroups.deleteTitle': 'Delete Repository Group',
  'repositoryGroups.repositoryCount.one': '1 repository',
  'repositoryGroups.repositoryCount.other': '{count} repositories',
  'repositoryGroups.deleteDescription':
    'Delete "{name}"? {repositoryCount} will return to the automatic repository groups.',
  'repositoryGroups.deleteButton': 'Delete Group',
  'repositoryContext.addToFavorites': 'Add to Favorites',
  'repositoryContext.removeFromFavorites': 'Remove from Favorites',
  'repositoryContext.newGroup': 'New Group…',
  'repositoryContext.addToGroup': 'Add to Group',
  'repositoryContext.moveToGroup': 'Move to Group',
  'repositoryContext.removeFromGroup': 'Remove from Group',
  'menu.showFavoritesSidebar': 'Show Favorites Sidebar',
  'menu.hideFavoritesSidebar': 'Hide Favorites Sidebar',
} as const

const zhCN: Translations = {
  'preferences.appearance.language.heading': '语言',
  'preferences.appearance.language.label': '语言',
  'preferences.appearance.language.system': '跟随系统',
  'preferences.appearance.language.english': '英语',
  'preferences.appearance.language.simplifiedChinese': '简体中文',
  'repositories.group.recent': '最近',
  'repositories.group.other': '其他',
  'favoritesSidebar.ariaLabel': '收藏',
  'favoritesSidebar.title': '收藏',
  'favoritesSidebar.newGroup': '新建分组',
  'favoritesSidebar.empty': '暂无收藏',
  'favoritesSidebar.ungrouped': '收藏',
  'repositoryGroups.menu.rename': '重命名分组…',
  'repositoryGroups.menu.delete': '删除分组…',
  'repositoryGroups.createTitle': '创建仓库分组',
  'repositoryGroups.renameTitle': '重命名仓库分组',
  'repositoryGroups.createDescription': '为这个仓库分组选择一个名称。',
  'repositoryGroups.createForRepositoryDescription':
    '为“{name}”选择一个分组名称。',
  'repositoryGroups.nameAriaLabel': '分组名称',
  'repositoryGroups.createButton': '创建分组',
  'repositoryGroups.renameButton': '重命名分组',
  'repositoryGroups.emptyNameError': '分组名称不能为空。',
  'repositoryGroups.duplicateNameError': '已存在同名分组。',
  'repositoryGroups.missingGroupIdError': '缺少仓库分组 ID。',
  'repositoryGroups.deleteTitle': '删除仓库分组',
  'repositoryGroups.repositoryCount.one': '1 个仓库',
  'repositoryGroups.repositoryCount.other': '{count} 个仓库',
  'repositoryGroups.deleteDescription':
    '删除“{name}”？{repositoryCount} 将回到自动仓库分组。',
  'repositoryGroups.deleteButton': '删除分组',
  'repositoryContext.addToFavorites': '添加到收藏',
  'repositoryContext.removeFromFavorites': '从收藏中移除',
  'repositoryContext.newGroup': '新建分组…',
  'repositoryContext.addToGroup': '添加到分组',
  'repositoryContext.moveToGroup': '移动到分组',
  'repositoryContext.removeFromGroup': '从分组中移除',
  'menu.showFavoritesSidebar': '显示收藏侧栏',
  'menu.hideFavoritesSidebar': '隐藏收藏侧栏',
}

const translations: Record<ResolvedApplicationLanguage, Translations> = {
  [ApplicationLanguage.English]: en,
  [ApplicationLanguage.SimplifiedChinese]: zhCN,
}

let currentLanguage: ResolvedApplicationLanguage = resolveApplicationLanguage(
  ApplicationLanguage.System
)

export function resolveApplicationLanguage(
  language: ApplicationLanguage,
  preferredLanguages: ReadonlyArray<string> = getSystemPreferredLanguages()
): ResolvedApplicationLanguage {
  if (language === ApplicationLanguage.English) {
    return ApplicationLanguage.English
  }

  if (language === ApplicationLanguage.SimplifiedChinese) {
    return ApplicationLanguage.SimplifiedChinese
  }

  for (const preferredLanguage of preferredLanguages) {
    const normalized = preferredLanguage.toLowerCase()
    if (normalized === 'zh' || normalized.startsWith('zh-')) {
      return ApplicationLanguage.SimplifiedChinese
    }
  }

  return ApplicationLanguage.English
}

export function getCurrentLanguage(): ResolvedApplicationLanguage {
  return currentLanguage
}

export function setCurrentLanguage(language: ApplicationLanguage) {
  currentLanguage = resolveApplicationLanguage(language)
}

export function t(
  key: TranslationKey,
  substitutions: TranslationSubstitutions = {}
): string {
  return translate(key, currentLanguage, substitutions)
}

export function translate(
  key: TranslationKey,
  language: ResolvedApplicationLanguage,
  substitutions: TranslationSubstitutions = {}
): string {
  const template =
    translations[language][key] ??
    translations[ApplicationLanguage.English][key]
  return template.replace(/\{(\w+)\}/g, (match, name) => {
    const value = substitutions[name]
    return value === undefined ? match : String(value)
  })
}

function getSystemPreferredLanguages(): ReadonlyArray<string> {
  if (typeof navigator === 'undefined') {
    return []
  }

  if (navigator.languages.length > 0) {
    return navigator.languages
  }

  return navigator.language ? [navigator.language] : []
}
