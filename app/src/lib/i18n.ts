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
  'preferences.title.settings': 'Settings',
  'preferences.title.options': 'Options',
  'preferences.save': 'Save',
  'preferences.tabs.accounts': 'Accounts',
  'preferences.tabs.integrations': 'Integrations',
  'preferences.tabs.copilot': 'Copilot',
  'preferences.tabs.git': 'Git',
  'preferences.tabs.appearance': 'Appearance',
  'preferences.tabs.notifications': 'Notifications',
  'preferences.tabs.prompts': 'Prompts',
  'preferences.tabs.advanced': 'Advanced',
  'preferences.tabs.accessibility': 'Accessibility',
  'preferences.accounts.signOut': 'Sign Out',
  'preferences.accounts.addEnterpriseAccount': 'Add GitHub Enterprise account',
  'preferences.accounts.signIntoDotCom': 'Sign Into GitHub.com',
  'preferences.accounts.signIntoEnterprise': 'Sign Into GitHub Enterprise',
  'preferences.accounts.dotComDescription':
    'Sign in to your GitHub.com account to access your repositories.',
  'preferences.accounts.enterpriseDescription':
    'If you are using GitHub Enterprise at work, sign in to it to get access to your repositories.',
  'preferences.appearance.theme.heading': 'Theme',
  'preferences.appearance.theme.light': 'Light',
  'preferences.appearance.theme.dark': 'Dark',
  'preferences.appearance.theme.system': 'System',
  'preferences.appearance.theme.loadingSystem': 'Loading system theme',
  'preferences.appearance.formatting.heading': 'Formatting',
  'preferences.appearance.formatting.dateFormat': 'Date Format',
  'preferences.appearance.formatting.timeFormat': 'Time Format',
  'preferences.appearance.formatting.numberFormat': 'Number Format',
  'preferences.appearance.formatting.preferAbsoluteDates':
    'Prefer absolute dates over relative',
  'preferences.appearance.diff.heading': 'Diff',
  'preferences.appearance.diff.tabSize': 'Tab Size',
  'preferences.appearance.diff.tabSizeDefault': '{size} (default)',
  'preferences.integrations.applications.heading': 'Applications',
  'preferences.integrations.externalEditor.heading': 'External Editor',
  'preferences.integrations.externalEditor.label': 'External Editor',
  'preferences.integrations.externalEditor.ariaLabel': 'External editor',
  'preferences.integrations.externalEditor.configure':
    'Configure Custom Editor…',
  'preferences.integrations.externalEditor.noEditorsFound': 'No editors found.',
  'preferences.integrations.externalEditor.noOtherEditorsFound':
    'No other editors found.',
  'preferences.integrations.externalEditor.installSuggested': 'Install {name}?',
  'preferences.integrations.shell.heading': 'Shell',
  'preferences.integrations.shell.label': 'Shell',
  'preferences.integrations.shell.ariaLabel': 'Shell',
  'preferences.integrations.shell.configure': 'Configure Custom Shell…',
  'preferences.integrations.custom.path.label': 'Path',
  'preferences.integrations.custom.path.placeholder': 'Path to executable',
  'preferences.integrations.custom.choosePath': 'Choose…',
  'preferences.integrations.custom.arguments.label': 'Arguments',
  'preferences.integrations.custom.arguments.placeholder':
    'Command line arguments',
  'preferences.integrations.custom.invalidPath':
    'This path does not appear to be a valid executable.',
  'preferences.integrations.custom.invalidArguments':
    'These arguments are not valid.',
  'preferences.integrations.custom.missingTargetPathArgument':
    'Arguments must include the target path placeholder ({placeholder}).',
  'preferences.integrations.custom.executableFilter': 'Executables',
  'preferences.notifications.heading': 'Notifications',
  'preferences.notifications.enable': 'Enable notifications',
  'preferences.notifications.description':
    'Allows the display of notifications when high-signal events take place in the current repository.',
  'preferences.notifications.permissionPrefix': 'You need to ',
  'preferences.notifications.grantPermission': 'grant permission',
  'preferences.notifications.permissionSuffix':
    ' to display these notifications from GitHub Desktop.',
  'preferences.notifications.deniedPrefix':
    'GitHub Desktop has no permission to display notifications. Please, enable them in the ',
  'preferences.notifications.settingsLink': 'Notifications Settings',
  'preferences.notifications.deniedSuffix': '.',
  'preferences.notifications.configurePrefix':
    'Make sure notifications are {state} for GitHub Desktop in the ',
  'preferences.notifications.configureSuffix': '.',
  'preferences.notifications.stateConfigured': 'properly configured',
  'preferences.notifications.stateEnabled': 'enabled',
  'preferences.accessibility.heading': 'Accessibility',
  'preferences.accessibility.underlineLinks': 'Underline links',
  'preferences.accessibility.underlineLinksDescription':
    'When enabled, GitHub Desktop will underline links in commit messages, comments, and other text fields. This can help make links easier to distinguish.',
  'preferences.accessibility.exampleLink': 'This is an example link',
  'preferences.accessibility.showDiffCheckMarks':
    'Show check marks in the diff',
  'preferences.accessibility.showDiffCheckMarksDescription':
    'When enabled, check marks will be displayed along side the line numbers and groups of line numbers in the diff when committing. When disabled, the line number controls will be less prominent.',
  'preferences.advanced.backgroundUpdates.heading': 'Background updates',
  'preferences.advanced.repositoryIndicators':
    'Show status icons in the repository list',
  'preferences.advanced.repositoryIndicatorsDescription1':
    'These icons indicate which repositories have local or remote changes, and require the periodic fetching of repositories that are not currently selected.',
  'preferences.advanced.repositoryIndicatorsDescription2':
    'Turning this off will not stop the periodic fetching of your currently selected repository, but may improve overall app performance for users with many repositories.',
  'preferences.advanced.usage.heading': 'Usage',
  'preferences.advanced.reportUsagePrefix':
    'Help GitHub Desktop improve by submitting ',
  'preferences.advanced.usageStats': 'usage stats',
  'preferences.advanced.networkCredentials.heading': 'Network and credentials',
  'preferences.advanced.useGitCredentialManager': 'Use Git Credential Manager',
  'preferences.advanced.gitCredentialManagerPrefix': 'Use ',
  'preferences.advanced.gitCredentialManagerSuffix':
    ' for private repositories outside of GitHub.com. This feature is experimental and subject to change.',
  'preferences.advanced.useSystemOpenSSH': 'Use system OpenSSH (recommended)',
  'preferences.git.tabs.author': 'Author',
  'preferences.git.tabs.defaultBranch': 'Default branch',
  'preferences.git.tabs.hooks': 'Hooks',
  'preferences.git.author.name': 'Name',
  'preferences.git.author.email': 'Email',
  'preferences.git.author.otherEmail': 'Other',
  'preferences.git.emailWarning.learnMoreAriaLabel':
    'Learn more about commit attribution',
  'preferences.git.emailWarning.learnMore': 'Learn more.',
  'preferences.git.emailWarning.matches':
    'This email address matches {account}.',
  'preferences.git.emailWarning.doesNotMatch':
    'This email address does not match {account}. {info}',
  'preferences.git.emailWarning.wronglyAttributed':
    'Your commits will be wrongly attributed.',
  'preferences.git.emailWarning.dotComAccount': 'your GitHub account',
  'preferences.git.emailWarning.enterpriseAccount':
    'your GitHub Enterprise account',
  'preferences.git.emailWarning.anyAccount':
    'either of your GitHub.com nor GitHub Enterprise accounts',
  'preferences.git.defaultBranch.heading':
    'Default branch name for new repositories',
  'preferences.git.defaultBranch.descriptionPrefix':
    "GitHub's default branch name is ",
  'preferences.git.defaultBranch.descriptionMiddle':
    '. You may want to change it due to different workflows, or because your integrations still require the historical default branch name of ',
  'preferences.git.defaultBranch.descriptionSuffix': '.',
  'preferences.git.globalConfigPrefix': 'These preferences will ',
  'preferences.git.globalConfigLink': 'edit your global Git config file',
  'preferences.git.globalConfigSuffix': '.',
  'preferences.git.hooks.loadEnvironment':
    'Load Git hook environment variables from shell',
  'preferences.git.hooks.loadEnvironmentDescription':
    'When enabled, GitHub Desktop will attempt to load environment variables from your shell when executing Git hooks. This is useful if your Git hooks depend on environment variables set in your shell configuration files, a common practice for version managers such as nvm, rbenv, asdf, etc.',
  'preferences.git.hooks.shellLabel': 'Shell to use when loading environment',
  'preferences.git.hooks.cacheEnvironment':
    'Cache Git hook environment variables',
  'preferences.git.hooks.cacheEnvironmentDescription':
    'Cache hook environment variables to improve performance. Disable if your hooks rely on frequently changing environment variables.',
  'preferences.prompts.confirmationHeading':
    'Show a confirmation dialog before...',
  'preferences.prompts.removingRepositories': 'Removing repositories',
  'preferences.prompts.discardingChanges': 'Discarding changes',
  'preferences.prompts.discardingChangesPermanently':
    'Discarding changes permanently',
  'preferences.prompts.discardingStash': 'Discarding stash',
  'preferences.prompts.checkingOutCommit': 'Checking out a commit',
  'preferences.prompts.forcePushing': 'Force pushing',
  'preferences.prompts.undoCommit': 'Undo commit',
  'preferences.prompts.overridingCommitMessage':
    'Overriding commit message with generated message',
  'preferences.prompts.removingWorktrees': 'Removing worktrees',
  'preferences.prompts.committingFilteredChanges':
    'Committing changes hidden by filter',
  'preferences.prompts.switchBranchHeading':
    'If I have changes and I switch branches...',
  'preferences.prompts.switchBranch.ask':
    'Ask me where I want the changes to go',
  'preferences.prompts.switchBranch.move':
    'Always bring my changes to my new branch',
  'preferences.prompts.switchBranch.stash':
    'Always stash and leave my changes on the current branch',
  'preferences.prompts.commitLength.heading': 'Commit Length',
  'preferences.prompts.commitLength.warning': 'Show commit length warning',
  'preferences.copilot.tabs.models': 'Models',
  'preferences.copilot.tabs.providers': 'Providers',
  'preferences.copilot.access.signInMessage':
    'Sign in to an account with a Copilot license to configure Copilot settings.',
  'preferences.copilot.access.signInButton': 'Sign In',
  'preferences.copilot.access.checking': 'Checking Copilot access…',
  'preferences.copilot.access.noLicenseMessage':
    'Copilot features in GitHub Desktop require a GitHub Copilot license.',
  'preferences.copilot.access.viewPlans': 'View Copilot plans',
  'preferences.copilot.access.desktopDisabledMessage':
    'A Copilot license is available for your account, but "Copilot in GitHub Desktop" is disabled in your Copilot feature settings.',
  'preferences.copilot.access.openFeatureSettings':
    'Open Copilot feature settings',
  'preferences.copilot.loadingModels': 'Loading available models…',
  'preferences.copilot.noModels': 'No Copilot models available.',
  'preferences.copilot.customInstructionsPrefix':
    'Tailor how Copilot behaves by using ',
  'preferences.copilot.customInstructionsLink': 'custom instructions',
  'preferences.copilot.customInstructionsSuffix': '.',
  'preferences.copilot.commitMessageGeneration': 'Commit Message Generation',
  'preferences.copilot.learnCommitMessages':
    'Learn more about generating commit messages.',
  'preferences.copilot.conflictResolution': 'Conflict Resolution',
  'preferences.copilot.futureConflictResolution':
    'Model changes apply to future conflict resolutions.',
  'preferences.copilot.alwaysUseForConflicts':
    'Always Use Copilot When Conflicts Are Detected',
  'preferences.copilot.byok.empty':
    'Add a custom provider to use your own API keys with OpenAI-compatible endpoints, Azure, Anthropic, or local providers like Ollama.',
  'preferences.copilot.byok.addProvider': 'Add Provider…',
  'preferences.copilot.byok.modelCount.one': '1 model',
  'preferences.copilot.byok.modelCount.other': '{count} models',
  'preferences.copilot.byok.local': 'Local',
  'preferences.copilot.byok.editProvider': 'Edit {name}',
  'preferences.copilot.byok.removeProvider': 'Remove {name}',
  'preferences.copilot.modelCosts.unavailable': 'Unavailable',
  'preferences.copilot.modelCosts.context': 'Context',
  'preferences.copilot.modelCosts.reasoning': 'Reasoning',
  'preferences.copilot.modelCosts.title': 'AI credits per {tokens} tokens',
  'preferences.copilot.modelCosts.input': 'Input',
  'preferences.copilot.modelCosts.cachedInput': 'Cached input',
  'preferences.copilot.modelCosts.output': 'Output',
  'preferences.copilot.modelCosts.ariaLabel': 'Show Copilot model credit costs',
  'preferences.copilot.modelCosts.tooltip': 'Show credit costs',
  'preferences.copilot.modelPicker.reasoningLevel.one': '1 level',
  'preferences.copilot.modelPicker.reasoningLevel.other': '{count} levels',
  'preferences.copilot.modelPicker.useOfCredits': 'Use of credits: {category}',
  'preferences.copilot.modelPicker.categorySummary':
    '{category} model. {credits}',
  'preferences.copilot.modelPicker.defaultSuffix': '(default)',
  'preferences.copilot.modelPicker.noModelsFound': 'No models found.',
  'preferences.copilot.modelPicker.none': 'None',
  'preferences.copilot.modelPicker.chooseModel': 'Choose a model',
  'preferences.copilot.modelPicker.filterModels': 'Filter models',
  'toolbar.currentRepository': 'Current Repository',
  'toolbar.selectRepository': 'Select a Repository',
  'toolbar.noRepositories': 'No Repositories',
  'toolbar.currentBranch': 'Current Branch',
  'toolbar.currentBranchIs': 'Current branch is {branch}',
  'toolbar.detachedHead': 'Detached HEAD',
  'toolbar.onCommit': 'On {sha}',
  'toolbar.currentlyOnDetachedHead': 'Currently on a detached HEAD',
  'toolbar.checkingOut': 'Checking out {branch}',
  'toolbar.rebasingBranch': 'Rebasing branch',
  'toolbar.rebasing': 'Rebasing {branch}',
  'toolbar.branchDropdownDescription': 'Current branch dropdown button',
  'toolbar.pushPullOptions': 'Push, pull, fetch options',
  'toolbar.pushPullButtonDescription': 'Push pull button',
  'toolbar.hangOn': 'Hang on…',
  'toolbar.actionComplete': '{action} complete',
  'toolbar.publishRepository': 'Publish repository',
  'toolbar.publishRepositoryDescription': 'Publish this repository to GitHub',
  'toolbar.publishBranch': 'Publish branch',
  'toolbar.publishBranchToGitHub': 'Publish this branch to GitHub',
  'toolbar.publishBranchToRemote': 'Publish this branch to the remote',
  'toolbar.rebaseInProgress': 'Rebase in progress',
  'toolbar.cannotPublishDetachedHead': 'Cannot publish detached HEAD',
  'toolbar.fetch': 'Fetch {remote}',
  'toolbar.fetchLatest': 'Fetch the latest changes from {remote}',
  'toolbar.lastFetched': 'Last fetched',
  'toolbar.neverFetched': 'Never fetched',
  'toolbar.pull': 'Pull {remote}',
  'toolbar.pullWithRebase': 'Pull {remote} with rebase',
  'toolbar.push': 'Push {remote}',
  'toolbar.forcePush': 'Force push {remote}',
  'toolbar.forcePushDescription':
    'Overwrite any changes on {remote} with your local changes',
  'toolbar.forcePushWarningTitle': 'Warning:',
  'toolbar.forcePushWarning':
    'A force push will rewrite history on the remote. Any collaborators working on this branch will need to reset their own local branch to match the history of the remote.',
  'repositories.group.recent': 'Recent',
  'repositories.group.other': 'Other',
  'repositories.tooltip.currentBranchPrefix':
    'The currently checked out branch is ',
  'repositories.tooltip.commitCount.one': '1 commit',
  'repositories.tooltip.commitCount.other': '{count} commits',
  'repositories.tooltip.behind': '{commits} behind',
  'repositories.tooltip.and': ' and ',
  'repositories.tooltip.ahead': '{commits} ahead of',
  'repositories.tooltip.trackedBranchSuffix': ' its tracked branch.',
  'repositories.tooltip.fullName': 'Full Name:',
  'repositories.tooltip.path': 'Path:',
  'repositories.tooltip.uncommittedChanges':
    'There are uncommitted changes in this repository.',
  'repositories.filterPlaceholder': 'Filter',
  'repositories.addButton': 'Add',
  'repositories.noResults.title': "Sorry, I can't find that repository",
  'repositories.noResults.protipStart': 'ProTip! Press ',
  'repositories.noResults.protipAddLocal':
    ' to quickly add a local repository, and ',
  'repositories.noResults.protipClone':
    ' to clone from anywhere within the app',
  'repositories.menu.cloneRepository': 'Clone Repository…',
  'repositories.menu.createNewRepository': 'Create New Repository…',
  'repositories.menu.addExistingRepository': 'Add Existing Repository…',
  'favoritesSidebar.ariaLabel': 'Favorites',
  'favoritesSidebar.title': 'Favorites',
  'favoritesSidebar.newGroup': 'New group',
  'favoritesSidebar.empty': 'No favorites',
  'favoritesSidebar.ungrouped': 'Favorites',
  'repositoryGroups.menu.rename': 'Rename Group…',
  'repositoryGroups.menu.delete': 'Delete Group…',
  'repositoryGroups.menu.addToFavorites': 'Add Group to Favorites',
  'repositoryGroups.menu.removeFromFavorites': 'Remove Group from Favorites',
  'repositoryGroups.menu.addRepositoriesToFavorites':
    'Add Repositories to Favorites',
  'repositoryGroups.menu.createGroupFromSection':
    'Create Group from This Section',
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
  'repositoryContext.copyRepoName': 'Copy Repo Name',
  'repositoryContext.copyRepoPath': 'Copy Repo Path',
  'repositoryContext.viewOnGitHub': 'View on GitHub',
  'repositoryContext.openIn': 'Open in {label}',
  'repositoryContext.openInShell': 'Open in Shell',
  'repositoryContext.openInExternalEditor': 'Open in External Editor',
  'repositoryContext.revealInFinder': 'Reveal in Finder',
  'repositoryContext.showInExplorer': 'Show in Explorer',
  'repositoryContext.showInFileManager': 'Show in your File Manager',
  'repositoryContext.remove': 'Remove',
  'repositoryContext.removeWithConfirmation': 'Remove…',
  'repositoryContext.createAlias': 'Create Alias',
  'repositoryContext.changeAlias': 'Change Alias',
  'repositoryContext.removeAlias': 'Remove Alias',
  'repositoryContext.showWorktrees': 'Show Worktrees',
  'repositoryContext.newWorktree': 'New Worktree…',
  'menu.showFavoritesSidebar': 'Show Favorites Sidebar',
  'menu.hideFavoritesSidebar': 'Hide Favorites Sidebar',
} as const

const zhCN: Translations = {
  'preferences.appearance.language.heading': '语言',
  'preferences.appearance.language.label': '语言',
  'preferences.appearance.language.system': '跟随系统',
  'preferences.appearance.language.english': '英语',
  'preferences.appearance.language.simplifiedChinese': '简体中文',
  'preferences.title.settings': '设置',
  'preferences.title.options': '选项',
  'preferences.save': '保存',
  'preferences.tabs.accounts': '账号',
  'preferences.tabs.integrations': '集成',
  'preferences.tabs.copilot': 'Copilot',
  'preferences.tabs.git': 'Git',
  'preferences.tabs.appearance': '外观',
  'preferences.tabs.notifications': '通知',
  'preferences.tabs.prompts': '提示',
  'preferences.tabs.advanced': '高级',
  'preferences.tabs.accessibility': '辅助功能',
  'preferences.accounts.signOut': '退出登录',
  'preferences.accounts.addEnterpriseAccount': '添加 GitHub Enterprise 账号',
  'preferences.accounts.signIntoDotCom': '登录 GitHub.com',
  'preferences.accounts.signIntoEnterprise': '登录 GitHub Enterprise',
  'preferences.accounts.dotComDescription':
    '登录你的 GitHub.com 账号以访问你的仓库。',
  'preferences.accounts.enterpriseDescription':
    '如果你在工作中使用 GitHub Enterprise，请登录它以访问你的仓库。',
  'preferences.appearance.theme.heading': '主题',
  'preferences.appearance.theme.light': '浅色',
  'preferences.appearance.theme.dark': '深色',
  'preferences.appearance.theme.system': '系统',
  'preferences.appearance.theme.loadingSystem': '正在加载系统主题',
  'preferences.appearance.formatting.heading': '格式',
  'preferences.appearance.formatting.dateFormat': '日期格式',
  'preferences.appearance.formatting.timeFormat': '时间格式',
  'preferences.appearance.formatting.numberFormat': '数字格式',
  'preferences.appearance.formatting.preferAbsoluteDates':
    '优先使用绝对日期而不是相对日期',
  'preferences.appearance.diff.heading': '差异',
  'preferences.appearance.diff.tabSize': '制表符宽度',
  'preferences.appearance.diff.tabSizeDefault': '{size}（默认）',
  'preferences.integrations.applications.heading': '应用程序',
  'preferences.integrations.externalEditor.heading': '外部编辑器',
  'preferences.integrations.externalEditor.label': '外部编辑器',
  'preferences.integrations.externalEditor.ariaLabel': '外部编辑器',
  'preferences.integrations.externalEditor.configure': '配置自定义编辑器…',
  'preferences.integrations.externalEditor.noEditorsFound': '没有找到编辑器。',
  'preferences.integrations.externalEditor.noOtherEditorsFound':
    '没有找到其他编辑器。',
  'preferences.integrations.externalEditor.installSuggested': '安装 {name}？',
  'preferences.integrations.shell.heading': 'Shell',
  'preferences.integrations.shell.label': 'Shell',
  'preferences.integrations.shell.ariaLabel': 'Shell',
  'preferences.integrations.shell.configure': '配置自定义 Shell…',
  'preferences.integrations.custom.path.label': '路径',
  'preferences.integrations.custom.path.placeholder': '可执行文件路径',
  'preferences.integrations.custom.choosePath': '选择…',
  'preferences.integrations.custom.arguments.label': '参数',
  'preferences.integrations.custom.arguments.placeholder': '命令行参数',
  'preferences.integrations.custom.invalidPath':
    '这个路径看起来不是有效的可执行文件。',
  'preferences.integrations.custom.invalidArguments': '这些参数无效。',
  'preferences.integrations.custom.missingTargetPathArgument':
    '参数必须包含目标路径占位符（{placeholder}）。',
  'preferences.integrations.custom.executableFilter': '可执行文件',
  'preferences.notifications.heading': '通知',
  'preferences.notifications.enable': '启用通知',
  'preferences.notifications.description':
    '允许在当前仓库发生高价值事件时显示通知。',
  'preferences.notifications.permissionPrefix': '你需要',
  'preferences.notifications.grantPermission': '授予权限',
  'preferences.notifications.permissionSuffix':
    '，GitHub Desktop 才能显示这些通知。',
  'preferences.notifications.deniedPrefix':
    'GitHub Desktop 没有显示通知的权限。请在',
  'preferences.notifications.settingsLink': '通知设置',
  'preferences.notifications.deniedSuffix': '中启用它们。',
  'preferences.notifications.configurePrefix':
    '请确保 GitHub Desktop 的通知已在',
  'preferences.notifications.configureSuffix': '中{state}。',
  'preferences.notifications.stateConfigured': '正确配置',
  'preferences.notifications.stateEnabled': '启用',
  'preferences.accessibility.heading': '辅助功能',
  'preferences.accessibility.underlineLinks': '为链接添加下划线',
  'preferences.accessibility.underlineLinksDescription':
    '启用后，GitHub Desktop 会为提交信息、评论和其他文本字段中的链接添加下划线。这有助于更容易地区分链接。',
  'preferences.accessibility.exampleLink': '这是一个示例链接',
  'preferences.accessibility.showDiffCheckMarks': '在差异中显示勾选标记',
  'preferences.accessibility.showDiffCheckMarksDescription':
    '启用后，提交时会在差异中的行号和行号组旁显示勾选标记。禁用后，行号控件会更加弱化。',
  'preferences.advanced.backgroundUpdates.heading': '后台更新',
  'preferences.advanced.repositoryIndicators': '在仓库列表中显示状态图标',
  'preferences.advanced.repositoryIndicatorsDescription1':
    '这些图标用于指示哪些仓库有本地或远程更改，并需要定期拉取当前未选中的仓库。',
  'preferences.advanced.repositoryIndicatorsDescription2':
    '关闭此选项不会停止定期拉取当前选中的仓库，但可能会改善拥有大量仓库用户的整体应用性能。',
  'preferences.advanced.usage.heading': '使用情况',
  'preferences.advanced.reportUsagePrefix':
    '提交以下内容以帮助 GitHub Desktop 改进：',
  'preferences.advanced.usageStats': '使用统计',
  'preferences.advanced.networkCredentials.heading': '网络和凭据',
  'preferences.advanced.useGitCredentialManager': '使用 Git Credential Manager',
  'preferences.advanced.gitCredentialManagerPrefix':
    '为 GitHub.com 之外的私有仓库使用 ',
  'preferences.advanced.gitCredentialManagerSuffix':
    '。此功能仍处于实验阶段，可能会发生变化。',
  'preferences.advanced.useSystemOpenSSH': '使用系统 OpenSSH（推荐）',
  'preferences.git.tabs.author': '作者',
  'preferences.git.tabs.defaultBranch': '默认分支',
  'preferences.git.tabs.hooks': 'Hooks',
  'preferences.git.author.name': '姓名',
  'preferences.git.author.email': '邮箱',
  'preferences.git.author.otherEmail': '其他',
  'preferences.git.emailWarning.learnMoreAriaLabel': '了解更多提交归属信息',
  'preferences.git.emailWarning.learnMore': '了解更多。',
  'preferences.git.emailWarning.matches': '此邮箱地址与{account}匹配。',
  'preferences.git.emailWarning.doesNotMatch':
    '此邮箱地址与{account}不匹配。{info}',
  'preferences.git.emailWarning.wronglyAttributed': '你的提交会被错误归属。',
  'preferences.git.emailWarning.dotComAccount': '你的 GitHub 账号',
  'preferences.git.emailWarning.enterpriseAccount':
    '你的 GitHub Enterprise 账号',
  'preferences.git.emailWarning.anyAccount':
    '你的 GitHub.com 或 GitHub Enterprise 账号',
  'preferences.git.defaultBranch.heading': '新仓库的默认分支名称',
  'preferences.git.defaultBranch.descriptionPrefix': 'GitHub 的默认分支名称是 ',
  'preferences.git.defaultBranch.descriptionMiddle':
    '。你可能会因为不同的工作流，或集成仍需要历史默认分支名称 ',
  'preferences.git.defaultBranch.descriptionSuffix': ' 而更改它。',
  'preferences.git.globalConfigPrefix': '这些偏好设置将',
  'preferences.git.globalConfigLink': '编辑你的全局 Git 配置文件',
  'preferences.git.globalConfigSuffix': '。',
  'preferences.git.hooks.loadEnvironment': '从 shell 加载 Git hook 环境变量',
  'preferences.git.hooks.loadEnvironmentDescription':
    '启用后，GitHub Desktop 会在执行 Git hook 时尝试从你的 shell 加载环境变量。如果你的 Git hook 依赖 shell 配置文件中的环境变量，例如 nvm、rbenv、asdf 等版本管理器的常见做法，这会很有用。',
  'preferences.git.hooks.shellLabel': '加载环境时使用的 Shell',
  'preferences.git.hooks.cacheEnvironment': '缓存 Git hook 环境变量',
  'preferences.git.hooks.cacheEnvironmentDescription':
    '缓存 hook 环境变量以提升性能。如果你的 hook 依赖经常变化的环境变量，请禁用此选项。',
  'preferences.prompts.confirmationHeading': '在以下操作前显示确认对话框...',
  'preferences.prompts.removingRepositories': '移除仓库',
  'preferences.prompts.discardingChanges': '丢弃更改',
  'preferences.prompts.discardingChangesPermanently': '永久丢弃更改',
  'preferences.prompts.discardingStash': '丢弃 stash',
  'preferences.prompts.checkingOutCommit': '检出提交',
  'preferences.prompts.forcePushing': '强制推送',
  'preferences.prompts.undoCommit': '撤销提交',
  'preferences.prompts.overridingCommitMessage': '用生成的信息覆盖提交信息',
  'preferences.prompts.removingWorktrees': '移除工作树',
  'preferences.prompts.committingFilteredChanges': '提交被筛选器隐藏的更改',
  'preferences.prompts.switchBranchHeading': '如果我有更改并切换分支...',
  'preferences.prompts.switchBranch.ask': '询问我希望更改去哪里',
  'preferences.prompts.switchBranch.move': '始终将我的更改带到新分支',
  'preferences.prompts.switchBranch.stash':
    '始终 stash 并将我的更改留在当前分支',
  'preferences.prompts.commitLength.heading': '提交长度',
  'preferences.prompts.commitLength.warning': '显示提交长度警告',
  'preferences.copilot.tabs.models': '模型',
  'preferences.copilot.tabs.providers': '提供商',
  'preferences.copilot.access.signInMessage':
    '登录拥有 Copilot 许可的账号以配置 Copilot 设置。',
  'preferences.copilot.access.signInButton': '登录',
  'preferences.copilot.access.checking': '正在检查 Copilot 访问权限…',
  'preferences.copilot.access.noLicenseMessage':
    'GitHub Desktop 中的 Copilot 功能需要 GitHub Copilot 许可。',
  'preferences.copilot.access.viewPlans': '查看 Copilot 方案',
  'preferences.copilot.access.desktopDisabledMessage':
    '你的账号拥有 Copilot 许可，但 Copilot 功能设置中的“GitHub Desktop 中的 Copilot”已被禁用。',
  'preferences.copilot.access.openFeatureSettings': '打开 Copilot 功能设置',
  'preferences.copilot.loadingModels': '正在加载可用模型…',
  'preferences.copilot.noModels': '没有可用的 Copilot 模型。',
  'preferences.copilot.customInstructionsPrefix':
    '使用以下内容定制 Copilot 的行为：',
  'preferences.copilot.customInstructionsLink': '自定义指令',
  'preferences.copilot.customInstructionsSuffix': '。',
  'preferences.copilot.commitMessageGeneration': '提交信息生成',
  'preferences.copilot.learnCommitMessages': '了解有关生成提交信息的更多信息。',
  'preferences.copilot.conflictResolution': '冲突解决',
  'preferences.copilot.futureConflictResolution':
    '模型更改会应用到之后的冲突解决。',
  'preferences.copilot.alwaysUseForConflicts': '检测到冲突时始终使用 Copilot',
  'preferences.copilot.byok.empty':
    '添加自定义提供商，以将你自己的 API 密钥用于 OpenAI 兼容端点、Azure、Anthropic 或 Ollama 等本地提供商。',
  'preferences.copilot.byok.addProvider': '添加提供商…',
  'preferences.copilot.byok.modelCount.one': '1 个模型',
  'preferences.copilot.byok.modelCount.other': '{count} 个模型',
  'preferences.copilot.byok.local': '本地',
  'preferences.copilot.byok.editProvider': '编辑 {name}',
  'preferences.copilot.byok.removeProvider': '移除 {name}',
  'preferences.copilot.modelCosts.unavailable': '不可用',
  'preferences.copilot.modelCosts.context': '上下文',
  'preferences.copilot.modelCosts.reasoning': '推理',
  'preferences.copilot.modelCosts.title': '每 {tokens} 个 token 的 AI 积分',
  'preferences.copilot.modelCosts.input': '输入',
  'preferences.copilot.modelCosts.cachedInput': '缓存输入',
  'preferences.copilot.modelCosts.output': '输出',
  'preferences.copilot.modelCosts.ariaLabel': '显示 Copilot 模型积分费用',
  'preferences.copilot.modelCosts.tooltip': '显示积分费用',
  'preferences.copilot.modelPicker.reasoningLevel.one': '1 个级别',
  'preferences.copilot.modelPicker.reasoningLevel.other': '{count} 个级别',
  'preferences.copilot.modelPicker.useOfCredits': '积分使用：{category}',
  'preferences.copilot.modelPicker.categorySummary':
    '{category} 模型。{credits}',
  'preferences.copilot.modelPicker.defaultSuffix': '（默认）',
  'preferences.copilot.modelPicker.noModelsFound': '没有找到模型。',
  'preferences.copilot.modelPicker.none': '无',
  'preferences.copilot.modelPicker.chooseModel': '选择模型',
  'preferences.copilot.modelPicker.filterModels': '筛选模型',
  'toolbar.currentRepository': '当前仓库',
  'toolbar.selectRepository': '选择仓库',
  'toolbar.noRepositories': '没有仓库',
  'toolbar.currentBranch': '当前分支',
  'toolbar.currentBranchIs': '当前分支是 {branch}',
  'toolbar.detachedHead': '分离 HEAD',
  'toolbar.onCommit': '位于 {sha}',
  'toolbar.currentlyOnDetachedHead': '当前处于分离 HEAD 状态',
  'toolbar.checkingOut': '正在检出 {branch}',
  'toolbar.rebasingBranch': '正在变基',
  'toolbar.rebasing': '正在变基 {branch}',
  'toolbar.branchDropdownDescription': '当前分支下拉按钮',
  'toolbar.pushPullOptions': '推送、拉取、获取选项',
  'toolbar.pushPullButtonDescription': '推送拉取按钮',
  'toolbar.hangOn': '请稍候…',
  'toolbar.actionComplete': '{action} 已完成',
  'toolbar.publishRepository': '发布仓库',
  'toolbar.publishRepositoryDescription': '将这个仓库发布到 GitHub',
  'toolbar.publishBranch': '发布分支',
  'toolbar.publishBranchToGitHub': '将这个分支发布到 GitHub',
  'toolbar.publishBranchToRemote': '将这个分支发布到远端',
  'toolbar.rebaseInProgress': '变基进行中',
  'toolbar.cannotPublishDetachedHead': '无法发布分离 HEAD',
  'toolbar.fetch': '获取 {remote}',
  'toolbar.fetchLatest': '从 {remote} 获取最新更改',
  'toolbar.lastFetched': '上次获取',
  'toolbar.neverFetched': '从未获取',
  'toolbar.pull': '拉取 {remote}',
  'toolbar.pullWithRebase': '变基拉取 {remote}',
  'toolbar.push': '推送 {remote}',
  'toolbar.forcePush': '强制推送 {remote}',
  'toolbar.forcePushDescription': '用本地更改覆盖 {remote} 上的任何更改',
  'toolbar.forcePushWarningTitle': '警告：',
  'toolbar.forcePushWarning':
    '强制推送会重写远端历史。在这个分支上协作的其他人需要重置自己的本地分支，以匹配远端历史。',
  'repositories.group.recent': '最近',
  'repositories.group.other': '其他',
  'repositories.tooltip.currentBranchPrefix': '当前检出的分支比其跟踪分支',
  'repositories.tooltip.commitCount.one': '1 个提交',
  'repositories.tooltip.commitCount.other': '{count} 个提交',
  'repositories.tooltip.behind': '落后 {commits}',
  'repositories.tooltip.and': '且',
  'repositories.tooltip.ahead': '领先 {commits}',
  'repositories.tooltip.trackedBranchSuffix': '。',
  'repositories.tooltip.fullName': '完整名称：',
  'repositories.tooltip.path': '路径：',
  'repositories.tooltip.uncommittedChanges': '这个仓库有未提交的更改。',
  'repositories.filterPlaceholder': '筛选',
  'repositories.addButton': '添加',
  'repositories.noResults.title': '抱歉，找不到该仓库',
  'repositories.noResults.protipStart': '提示：按 ',
  'repositories.noResults.protipAddLocal': ' 可快速添加本地仓库，按 ',
  'repositories.noResults.protipClone': ' 可从应用内任意位置克隆仓库',
  'repositories.menu.cloneRepository': '克隆仓库…',
  'repositories.menu.createNewRepository': '创建新仓库…',
  'repositories.menu.addExistingRepository': '添加现有仓库…',
  'favoritesSidebar.ariaLabel': '收藏',
  'favoritesSidebar.title': '收藏',
  'favoritesSidebar.newGroup': '新建分组',
  'favoritesSidebar.empty': '暂无收藏',
  'favoritesSidebar.ungrouped': '收藏',
  'repositoryGroups.menu.rename': '重命名分组…',
  'repositoryGroups.menu.delete': '删除分组…',
  'repositoryGroups.menu.addToFavorites': '将分组添加到收藏',
  'repositoryGroups.menu.removeFromFavorites': '从收藏中移除分组',
  'repositoryGroups.menu.addRepositoriesToFavorites': '将仓库添加到收藏',
  'repositoryGroups.menu.createGroupFromSection': '从此区域创建分组',
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
  'repositoryContext.copyRepoName': '复制仓库名称',
  'repositoryContext.copyRepoPath': '复制仓库路径',
  'repositoryContext.viewOnGitHub': '在 GitHub 上查看',
  'repositoryContext.openIn': '在 {label} 中打开',
  'repositoryContext.openInShell': '在 Shell 中打开',
  'repositoryContext.openInExternalEditor': '在外部编辑器中打开',
  'repositoryContext.revealInFinder': '在访达中显示',
  'repositoryContext.showInExplorer': '在资源管理器中显示',
  'repositoryContext.showInFileManager': '在文件管理器中显示',
  'repositoryContext.remove': '移除',
  'repositoryContext.removeWithConfirmation': '移除…',
  'repositoryContext.createAlias': '创建别名',
  'repositoryContext.changeAlias': '修改别名',
  'repositoryContext.removeAlias': '移除别名',
  'repositoryContext.showWorktrees': '显示工作树',
  'repositoryContext.newWorktree': '新建工作树…',
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
