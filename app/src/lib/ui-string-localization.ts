import { ApplicationLanguage, getCurrentLanguage } from './i18n'

const exactTranslations = new Map<string, string>([
  ['Close', '关闭'],
  ['Ok', '确定'],
  ['OK', '确定'],
  ['Cancel', '取消'],
  ['Save', '保存'],
  ['Delete', '删除'],
  ['Remove', '移除'],
  ['Retry', '重试'],
  ['Continue', '继续'],
  ['Done', '完成'],
  ['Done!', '完成！'],
  ['Not Now', '暂不'],
  ['Please wait', '请稍候'],
  ['Choose…', '选择…'],
  ['Locate…', '定位…'],
  ['Rename…', '重命名…'],
  ['Delete…', '删除…'],
  ['Clone Again', '重新克隆'],
  ['Learn more', '了解更多'],
  ['Search…', '搜索…'],
  ['Branch filter', '分支筛选'],
  ['No repository selected', '未选择仓库'],
  ['Application menu', '应用菜单'],
  ['Repository sidebar', '仓库侧栏'],
  ['Resize handle', '调整大小手柄'],
  ['Dismiss this message', '关闭此消息'],
  ['Toggle password visibility', '切换密码可见性'],
  ['Search for user', '搜索用户'],
  ['Input cleared', '输入已清空'],
  ['Your Name', '你的姓名'],
  ['your-email@example.com', 'your-email@example.com'],
  ['Enterprise address', 'Enterprise 地址'],
  ['API key', 'API key'],
  ['Bearer token', 'bearer token'],
  ['Remote URL', '远程 URL'],
  ['URL or username/repository', 'URL 或用户名/仓库'],
  [
    'Repository URL or GitHub username and repository',
    '仓库 URL 或 GitHub 用户名和仓库',
  ],
  ['repository path', '仓库路径'],
  ['Full Name:', '完整名称：'],
  ['Last Modified:', '最后修改：'],
  ['Lines changed:', '变更行数：'],
  ['added lines', '新增行'],
  ['removed lines', '删除行'],
  ['files selected', '已选择文件'],
  ['local only', '仅本地'],
  ['default branch', '默认分支'],
  ['hidden changes', '隐藏的更改'],
  ['most recent commit', '最近的提交'],
  [
    'The file is in conflict and must be resolved via the command line.',
    '文件存在冲突，必须通过命令行解决。',
  ],
  ['This binary file has changed.', '此二进制文件已更改。'],
  ['Open file in external program.', '在外部程序中打开文件。'],
  ['Clone Again', '重新克隆'],
  ['Create a new repository', '创建新仓库'],
  ['Create a new repository', '创建新仓库'],
  [
    'A pull request allows you to propose changes to the code. By opening one, you’re requesting that someone review and merge them. Since this is a demo repository, this pull request will be private.',
    '拉取请求用于向代码提出更改。创建拉取请求表示你请求他人审查并合并这些更改。由于这是演示仓库，此拉取请求将是私有的。',
  ],
  [
    'Publishing will “push”, or upload, your commits to this branch of your repository on GitHub. Publish using the third button in the top bar.',
    '发布会将你的提交“推送”或上传到 GitHub 上此仓库的这个分支。请使用顶部栏的第三个按钮发布。',
  ],
  ['Welcome to GitHub Desktop', '欢迎使用 GitHub Desktop'],
  ['helps you work with GitHub locally.', '帮助你在本地使用 GitHub。'],
  ['is the version control system.', '是版本控制系统。'],
  [
    'is where you store your code and collaborate with others.',
    '是你存储代码并与他人协作的地方。',
  ],
  ['Html syntax icon', 'HTML 语法图标'],
  ['People with discussion bubbles overhead', '头顶有讨论气泡的人物'],
  ['Server stack with cloud', '带云的服务器堆栈'],
  ['Partially checked check list', '部分勾选的清单'],
  ['Hands clapping', '鼓掌'],
  [
    "Couldn't determine the last time an update check was performed. You may be running an old version. Please try manually checking for updates and contact GitHub Support if the problem persists",
    '无法确定上次检查更新的时间。你可能正在运行旧版本。请尝试手动检查更新；如果问题仍然存在，请联系 GitHub 支持。',
  ],
  [
    'An updated version of GitHub Desktop is available and will be installed at the next launch. See',
    '已有新版 GitHub Desktop，将在下次启动时安装。查看',
  ],
  [
    'Add a repository to GitHub Desktop to start collaborating',
    '向 GitHub Desktop 添加仓库以开始协作',
  ],
  [
    'You can drag & drop an existing repository folder here to add it to Desktop',
    '可以将现有仓库文件夹拖放到这里，以添加到 Desktop',
  ],
  ['ProTip!', '提示！'],
  ['ProTip! Press', '提示：按'],
  ['Add a local repository', '添加本地仓库'],
  ['create a repository', '创建仓库'],
  ['create a new branch', '创建新分支'],
  ['create a fork', '创建复刻'],
  ['add this repository', '添加此仓库'],
  ['add an exception for this directory', '为此目录添加例外'],
  ['here instead?', '到这里？'],
  ['instead?', '改为这样？'],
  [
    'This directory does not appear to be a Git repository.',
    '此目录看起来不是 Git 仓库。',
  ],
  ['The Git repository', 'Git 仓库'],
  ['The Git repository at', '位于此处的 Git 仓库'],
  [
    'appears to be owned by another user on your machine. Adding untrusted repositories may automatically execute files in the repository.',
    '看起来归本机上的另一位用户所有。添加不受信任的仓库可能会自动执行仓库中的文件。',
  ],
  [
    'If you trust the owner of the directory you can',
    '如果你信任此目录的所有者，可以',
  ],
  ['in order to continue.', '以继续。'],
  [
    'appears to be a Git repository. Would you like to',
    '看起来是一个 Git 仓库。是否要',
  ],
  [
    'appears to be a subfolder of Git repository.',
    '看起来是 Git 仓库的子文件夹。',
  ],
  ['This directory contains a', '此目录包含一个'],
  [
    'file already. Checking this box will result in the existing file being overwritten.',
    '文件。勾选此框将覆盖现有文件。',
  ],
  ['The repository will be created at', '仓库将创建于'],
  [
    'Directory could not be created at this path. You may not have permissions to create a directory here.',
    '无法在此路径创建目录。你可能没有在这里创建目录的权限。',
  ],
  ['Initialize this repository with a README', '使用 README 初始化此仓库'],
  [
    'Invalid characters have been replaced by hyphens.',
    '无效字符已替换为连字符。',
  ],
  [
    'Spaces and invalid characters have been replaced by hyphens.',
    '空格和无效字符已替换为连字符。',
  ],
  ['Will be created as', '将创建为'],
  ['Clone repository', '克隆仓库'],
  ['Looks like there are no repositories for', '看起来没有以下账号的仓库：'],
  ["Sorry, I can't find any repository matching", '抱歉，找不到匹配的仓库：'],
  ['Refresh this list', '刷新此列表'],
  ["if you've created a repository recently.", '如果你最近创建了仓库。'],
  ['GitHub Enterprise', 'GitHub Enterprise'],
  [
    'If you are using GitHub Enterprise at work, sign in to it to get access to your repositories.',
    '如果你在工作中使用 GitHub Enterprise，请登录以访问你的仓库。',
  ],
  [
    'Sign in to your GitHub.com account to access your repositories.',
    '登录你的 GitHub.com 账号以访问仓库。',
  ],
  ['Sign in to your GitHub Enterprise', '登录你的 GitHub Enterprise'],
  ['Git requesting credentials to access', 'Git 正在请求凭据以访问'],
  [
    "Depending on your repository's hosting service, you might need to use a Personal Access Token (PAT) as your password. Learn more about creating a PAT in our",
    '根据仓库托管服务，你可能需要使用个人访问令牌（PAT）作为密码。请在我们的',
  ],
  ['integration docs', '集成文档'],
  ['We were unable to authenticate with', '无法通过身份验证：'],
  ['. Please enter', '。请输入'],
  ['the password for the user', '该用户的密码'],
  ['to try again.', '以重试。'],
  [
    "Your browser will redirect you back to GitHub Desktop once you've signed in. If your browser asks for your permission to launch GitHub Desktop, please allow it.",
    '登录后浏览器会将你重定向回 GitHub Desktop。如果浏览器请求允许启动 GitHub Desktop，请允许。',
  ],
  ["You're already signed in to", '你已经登录到'],
  ['with the account', '使用账号'],
  [
    '. If you continue, you will first be signed out.',
    '。如果继续，你会先退出登录。',
  ],
  ['account. Do you want to sign in again?', '账号。是否重新登录？'],
  [
    'Your account token has been invalidated and you have been signed out from your',
    '你的账号令牌已失效，并已退出登录：',
  ],
  [
    'The " organization has enabled or enforced SAML SSO. To access this repository, you must sign in again and grant GitHub Desktop permission to access the organization\'s repositories.',
    '此组织已启用或强制 SAML SSO。要访问此仓库，你必须重新登录并授权 GitHub Desktop 访问该组织的仓库。',
  ],
  [
    'Would you like to open a browser to grant GitHub Desktop permission to access the repository?',
    '是否打开浏览器以授权 GitHub Desktop 访问该仓库？',
  ],
  [
    'The push was rejected by the server for containing a modification to the workflow file',
    '服务器拒绝推送，因为其中包含对工作流文件的修改',
  ],
  [
    '. In order to be able to push to workflow files GitHub Desktop needs to request additional permissions.',
    '。为了能够推送工作流文件，GitHub Desktop 需要请求额外权限。',
  ],
  [
    'Would you like to open a browser to grant GitHub Desktop permission to update workflow files?',
    '是否打开浏览器以授权 GitHub Desktop 更新工作流文件？',
  ],
  ['Initialize Git LFS', '初始化 Git LFS'],
  ['Git LFS', 'Git LFS'],
  ['Git LFS filters are already configured in', 'Git LFS 过滤器已配置在'],
  ['your global git config', '你的全局 Git 配置'],
  [
    'but are not the values it expects. Would you like to update them now?',
    '但不是预期值。是否现在更新？',
  ],
  ['repositories use', '仓库使用'],
  [
    '. To contribute to them, Git LFS must first be initialized. Would you like to do so now?',
    '。要向它们贡献内容，必须先初始化 Git LFS。是否现在执行？',
  ],
  ['. To contribute to', '。要向'],
  [
    ', Git LFS must first be initialized. Would you like to do so now?',
    '贡献内容，必须先初始化 Git LFS。是否现在执行？',
  ],
  ['The following files are over 100MB.', '以下文件超过 100MB。'],
  [
    'If you commit these files, you will no longer be able to push this repository to GitHub.com.',
    '如果提交这些文件，你将无法再将此仓库推送到 GitHub.com。',
  ],
  [
    'We recommend you avoid committing these files or use',
    '建议避免提交这些文件，或使用',
  ],
  ['to store large files on GitHub.', '在 GitHub 上存储大文件。'],
  ['Files that exceed the limit', '超过限制的文件'],
  [
    'for more information on managing large files on GitHub',
    '了解更多关于在 GitHub 上管理大文件的信息',
  ],
  ['Secret Scanning', '密钥扫描'],
  [
    'found secret(s) in the commit(s) you attempted to push.',
    '在你尝试推送的提交中发现密钥。',
  ],
  [
    'Allowing secrets risks exposure. Consider',
    '允许密钥存在会带来泄露风险。请考虑',
  ],
  [
    'removing the secret from your commit and commit history.',
    '从提交和提交历史中移除密钥。',
  ],
  ['Exposing this secret can allow someone to:', '泄露此密钥可能会让他人：'],
  ['Verify the identity of the secret(s)', '验证密钥身份'],
  ['Know which resources the secret(s) can access', '知道密钥可访问哪些资源'],
  ["Act on behalf of the secret's owner", '代表密钥所有者执行操作'],
  [
    'Push the secret(s) to this repository without being blocked',
    '不受阻止地将密钥推送到此仓库',
  ],
  ["It's used in tests", '它用于测试'],
  ["It's a false positive", '这是误报'],
  ['The detected string is not a secret', '检测到的字符串不是密钥'],
  ["I'll fix it later", '稍后修复'],
  [
    'The secret poses no risk. If anyone finds it, they cannot do any damage or gain access to sensitive information.',
    '此密钥没有风险。即使被他人发现，也无法造成破坏或访问敏感信息。',
  ],
  [
    'The secret is real, I understand the risk, and I will need to revoke it. This will open a security alert and notify admins of this repository.',
    '此密钥真实存在，我理解风险，并需要吊销它。这会打开安全警报并通知此仓库管理员。',
  ],
  ['Choose a branch to merge into', '选择要合并到的分支'],
  ['Merge into', '合并到'],
  ['Create a merge commit', '创建合并提交'],
  ['Squash and merge', '压缩并合并'],
  [
    'The commits from the selected branch will be added to the current branch via a merge commit.',
    '所选分支的提交将通过合并提交添加到当前分支。',
  ],
  [
    'The commits in the selected branch will be combined into one commit in the current branch.',
    '所选分支中的提交将在当前分支合并为一个提交。',
  ],
  [
    'The commits from the selected branch will be rebased and added to the current branch.',
    '所选分支中的提交将变基后添加到当前分支。',
  ],
  [
    'Checking for ability to merge automatically...',
    '正在检查是否可以自动合并...',
  ],
  [
    'Checking for ability to rebase automatically…',
    '正在检查是否可以自动变基…',
  ],
  ['Checking for ability to', '正在检查是否可以'],
  ['automatically…', '自动执行…'],
  [
    'Unable to display diff when multiple non-consecutive selected.',
    '选择多个非连续提交时无法显示差异。',
  ],
  ['You will', '你将'],
  ['see changes from the following', '看到来自以下内容的更改'],
  [
    'in the ancestry path of the most recent commit in your selection.',
    '位于你选择的最近提交的祖先路径中。',
  ],
  ['Learn more about unreachable commits.', '了解更多关于不可达提交的信息。'],
  ['There will be', '将会有'],
  ['This will merge', '这将合并'],
  ['This will update', '这将更新'],
  ['This will fast-forward', '这将快进'],
  ['is already up to date with', '已经与以下内容保持最新：'],
  ['Fast-forwarding branches', '正在快进分支'],
  ['Cherry-picking from', '正在拣选自'],
  ['Squashing into', '正在压缩到'],
  ['Reorder of', '重新排序'],
  ['Squash of', '压缩'],
  ['Successfully copied', '已成功复制'],
  ['Successfully reordered', '已成功重新排序'],
  ['Successfully squashed', '已成功压缩'],
  ['Cherry-pick undone. Successfully removed the', '已撤销拣选。成功移除'],
  ['Resolve conflicts to continue', '解决冲突以继续'],
  ['Resolve conflicts and commit to merge into', '解决冲突并提交以合并到'],
  ['Resolve conflicts to continue rebasing', '解决冲突以继续变基'],
  ['Resolve conflicts to continue cherry-picking onto', '解决冲突以继续拣选到'],
  ['All conflicts resolved', '所有冲突已解决'],
  ['All conflicted files have been resolved.', '所有冲突文件均已解决。'],
  ['All resolutions have been undone.', '所有解决方案均已撤销。'],
  [
    'Review and edit the generated message carefully before use.',
    '使用前请仔细审查并编辑生成的信息。',
  ],
  [
    'Review the suggested resolutions carefully before applying them to your files.',
    '应用到文件前请仔细审查建议的解决方案。',
  ],
  ['Copilot Instructions', 'Copilot 指令'],
  ['Tip: You can use', '提示：你可以使用'],
  [
    'to customize how commit messages are generated.',
    '来自定义提交信息的生成方式。',
  ],
  ['Copilot billing issue', 'Copilot 计费问题'],
  ['Copilot billing not configured', 'Copilot 计费未配置'],
  ['Quota exceeded', '配额已超出'],
  ['Session quota exceeded', '会话配额已超出'],
  ['Delete branch', '删除分支'],
  ['Delete remote branch', '删除远程分支'],
  ['Yes, delete this branch on the remote', '是，同时删除远程分支'],
  ['This action cannot be undone.', '此操作无法撤销。'],
  [
    'The branch also exists on the remote, do you wish to delete it there as well?',
    '此分支也存在于远程。是否也删除远程分支？',
  ],
  [
    'This branch does not exist locally. Deleting it may impact others collaborating on this branch.',
    '此分支不存在于本地。删除它可能会影响在此分支上协作的其他人。',
  ],
  [
    'This branch may have an open pull request associated with it.',
    '此分支可能有关联的打开拉取请求。',
  ],
  [
    'has been merged, you can also go to GitHub to delete the remote branch.',
    '已合并，你也可以前往 GitHub 删除远程分支。',
  ],
  ['already exists', '已存在'],
  ['The current branch (', '当前分支（'],
  [
    ") hasn't been published to the remote yet. By publishing it",
    '）尚未发布到远程。发布后',
  ],
  ['you can share it,', '你可以共享它，'],
  ['and collaborate with others.', '并与他人协作。'],
  [') has', '）有'],
  ['exist on your machine.', '存在于你的机器上。'],
  [
    ') is already published to GitHub. Create a pull request to propose and collaborate on your changes.',
    '）已发布到 GitHub。创建拉取请求以提出更改并协作。',
  ],
  [
    ') is already published to GitHub. Preview the changes this pull request will have before proposing your changes.',
    '）已发布到 GitHub。在提出更改前预览此拉取请求将包含的更改。',
  ],
  ["Couldn't get the repository's description", '无法获取仓库描述'],
  [
    'Tried to publish with no user. That seems impossible!',
    '尝试在没有用户的情况下发布。这不应该发生！',
  ],
  [
    '. This file specifies intentionally untracked files that Git should ignore. Files already tracked by Git are not affected.',
    '。此文件指定 Git 应忽略的未跟踪文件。已被 Git 跟踪的文件不受影响。',
  ],
  ['We will help you contribute to the', '我们将帮助你向'],
  ["I'll be using this fork…", '我将使用此复刻…'],
  ['@username', '@username'],
  ['. Want to', '。是否要'],
  [
    'to display these notifications from GitHub Desktop.',
    '以显示来自 GitHub Desktop 的这些通知。',
  ],
  [
    'GitHub Desktop has no permission to display notifications. Please, enable them in the',
    'GitHub Desktop 没有显示通知的权限。请在',
  ],
  ['Notifications Settings', '通知设置'],
  ['Make sure notifications are', '请确保通知已'],
  ['for GitHub Desktop in the', '，针对 GitHub Desktop 位于'],
  ['Check run steps incoming!', '检查运行步骤即将到来！'],
  ['Check runs incoming!', '检查运行即将到来！'],
  ['Stand By', '请稍候'],
  ['Checks Summary', '检查摘要'],
  ["Some checks haven't completed yet", '部分检查尚未完成'],
  ['All checks have failed', '所有检查均失败'],
  ['All checks have passed', '所有检查均通过'],
  ['Some checks were not successful', '部分检查未成功'],
  ['There are no steps to display for this check.', '此检查没有可显示的步骤。'],
  ['A new attempt of', '新的尝试：'],
  ['will be started, including all of', '将会开始，包括全部'],
  ['Determining which checks can be re-run.', '正在确定哪些检查可以重新运行。'],
  ['No steps to display', '没有可显示的步骤'],
  ['All resolutions have been undone.', '所有解决均已撤销。'],
  ['Open in command line,', '在命令行中打开，'],
  [
    'your tool of choice, or close to resolve manually.',
    '或使用你选择的工具，或关闭后手动解决。',
  ],
  ['Open in command line', '在命令行中打开'],
  ['Choose a new alias for the repository "', '为仓库选择新别名：“'],
  [
    'This will not affect the original repository name on GitHub.',
    '这不会影响 GitHub 上的原始仓库名称。',
  ],
  ['Are you sure you want to remove the repository "', '确定要移除仓库“'],
  ['" from GitHub Desktop?', '”从 GitHub Desktop？'],
  [
    'The repository will be removed from GitHub Desktop:',
    '该仓库将从 GitHub Desktop 中移除：',
  ],
  ['Can\'t find "', '找不到“'],
  ['It was last seen at', '上次出现于'],
  ['Check again.', '重新检查。'],
  ['is potentially unsafe', '可能不安全'],
  [
    'If you trust the owner of the directory you can add an exception for this directory in order to continue.',
    '如果你信任此目录的所有者，可以为此目录添加例外以继续。',
  ],
  ['Would you like to retry cloning', '是否重试克隆'],
  ['Files that exceed the limit', '超过限制的文件'],
  ['A branch named', '名为'],
  ['already exists on the remote.', '的分支已存在于远程。'],
  ['This branch is tracking', '此分支正在跟踪'],
  [
    'and renaming this branch will not change the branch name on the remote.',
    '，重命名此分支不会更改远程分支名称。',
  ],
  ['is not a valid name.', '不是有效名称。'],
  ['Will be', '将为'],
  ['A force push will rewrite history on', '强制推送会重写以下位置的历史：'],
  [
    '. Any collaborators working on this branch will need to reset their own local branch to match the history of the remote.',
    '。在此分支上协作的其他人需要重置自己的本地分支以匹配远程历史。',
  ],
  ['Are you sure you want to force push?', '确定要强制推送？'],
  ['At the end of the', '在结束时'],
  [
    'flow, GitHub Desktop will enable you to force push the branch to update the upstream branch. Force pushing will alter the history on the remote and potentially cause problems for others collaborating on this branch.',
    '流程结束后，GitHub Desktop 将允许你强制推送分支以更新上游分支。强制推送会改变远程历史，并可能给此分支上的其他协作者带来问题。',
  ],
  ['Are you sure you want to', '确定要'],
  ['Are you sure you want to abort this', '确定要中止此'],
  [
    'This will take you back to the original branch state and the conflicts you have already resolved will be discarded.',
    '这会让你回到原始分支状态，并丢弃已解决的冲突。',
  ],
  [
    'Are you sure you want to commit these conflicted files?',
    '确定要提交这些冲突文件？',
  ],
  [
    'If you choose to commit, you’ll be committing the following conflicted files into your repository:',
    '如果选择提交，你会将以下冲突文件提交到仓库：',
  ],
  ['Are you sure you want to continue connecting?', '确定要继续连接？'],
  ['SSH Host', 'SSH 主机'],
  ['SSH Key Passphrase', 'SSH 密钥密码短语'],
  ['SSH User Password', 'SSH 用户密码'],
  ['Remember passphrase', '记住密码短语'],
  ['Remember password', '记住密码'],
  ["The authenticity of host '", "无法确认主机 '"],
  [")' can't be established.", "）' 的真实性。"],
  ['key fingerprint is', '密钥指纹是'],
  [
    'Are you sure you want to proceed? This will overwrite your existing stash with your current changes.',
    '确定要继续？这会用当前更改覆盖现有贮藏。',
  ],
  ['Do you want to continue anyway?', '仍要继续吗？'],
  [
    'You have changes in progress. Resetting to a previous commit might result in some of these changes being lost. Do you want to continue anyway?',
    '你有进行中的更改。重置到之前的提交可能会导致部分更改丢失。仍要继续吗？',
  ],
  [
    'You have changes in progress. Undoing the commit might result in some of these changes being lost. Do you want to continue anyway?',
    '你有进行中的更改。撤销提交可能会导致部分更改丢失。仍要继续吗？',
  ],
  [
    'You have changes in progress. Undoing the merge commit might result in some of these changes being lost.',
    '你有进行中的更改。撤销合并提交可能会导致部分更改丢失。',
  ],
  ['Unable to', '无法'],
  ['when changes are present on your branch.', '当你的分支存在更改时。'],
  [
    'You can try to show it anyway, but performance may be negatively impacted.',
    '你仍可以尝试显示，但性能可能会受影响。',
  ],
  [
    'The diff is too large to be displayed by default.',
    '差异过大，默认不显示。',
  ],
  ['The diff is too large to be displayed.', '差异过大，无法显示。'],
  [
    'This diff contains bidirectional Unicode text that may be interpreted or compiled differently than what appears below. To review, open the file in an editor that reveals hidden Unicode characters.',
    '此差异包含双向 Unicode 文本，可能会以不同于下方显示的方式解释或编译。要审查，请在能显示隐藏 Unicode 字符的编辑器中打开文件。',
  ],
  [
    'Learn more about bidirectional Unicode characters',
    '了解更多双向 Unicode 字符信息',
  ],
  ["This diff contains a change in line endings from '", "此差异包含行尾从 '"],
  ["' to '", "' 改为 '"],
  [
    'Interacting with individual lines or hunks will be disabled while hiding whitespace.',
    '隐藏空白字符时，将无法与单独行或代码块交互。',
  ],
  ['Show whitespace changes?', '显示空白字符更改？'],
  [
    'Selecting lines is disabled when hiding whitespace changes.',
    '隐藏空白字符更改时禁用选择行。',
  ],
  ['Onion Skin', '洋葱皮模式'],
  ['Expand Up', '向上展开'],
  ['Expand Down', '向下展开'],
  ['Expand All', '全部展开'],
  ['px |', 'px |'],
  ['Open Your Card', '打开你的卡片'],
  ['Throw It Away', '扔掉'],
  [
    'The Desktop team would like to thank you for your contributions.',
    'Desktop 团队感谢你的贡献。',
  ],
  [
    'Thanks so much for all your hard work on GitHub Desktop',
    '非常感谢你为 GitHub Desktop 付出的努力',
  ],
  [
    ". We're so grateful for your willingness to contribute and make the app better for everyone!",
    '。我们非常感谢你愿意贡献，让这款应用对所有人都更好！',
  ],
  ['You contributed:', '你的贡献：'],
  ['Support details', '支持详情'],
  [
    'Could not securely connect to the server, because its certificate is not trusted. Attackers might be trying to steal your information. To connect unsafely, which may put your data at risk, you can “Always trust” the certificate and try again.',
    '无法安全连接到服务器，因为其证书不受信任。攻击者可能正在尝试窃取你的信息。若要以不安全方式连接（这可能使数据面临风险），可以“始终信任”该证书并重试。',
  ],
  [
    'GitHub Desktop cannot verify the identity of',
    'GitHub Desktop 无法验证以下对象的身份：',
  ],
  ['. The certificate (', '。证书（'],
  [') is invalid or untrusted.', '）无效或不受信任。'],
  [
    'This may indicate attackers are trying to steal your data.',
    '这可能表明攻击者正在尝试窃取你的数据。',
  ],
  [
    'In some cases, this may be expected. For example:',
    '在某些情况下，这可能是预期行为。例如：',
  ],
  [
    'If this is a GitHub Enterprise trial.',
    '如果这是 GitHub Enterprise 试用版。',
  ],
  [
    'If your GitHub Enterprise instance is run on an unusual top-level domain.',
    '如果你的 GitHub Enterprise 实例运行在不常见的顶级域名上。',
  ],
  [
    'If you are unsure of what to do, cancel and contact your system administrator.',
    '如果不确定该怎么做，请取消并联系系统管理员。',
  ],
  ['The repository', '仓库'],
  ['is a fork of', '是以下仓库的复刻：'],
  [', but its', '，但它的'],
  ['remote points elsewhere.', '远程指向其他位置。'],
  [
    'Would you like to update the remote to use the expected URL?',
    '是否更新远程地址以使用预期 URL？',
  ],
  [
    'Checking out a commit will create a detached HEAD, and you will no longer be on any branch. Are you sure you want to checkout this commit?',
    '检出提交会创建分离 HEAD，你将不再位于任何分支。确定要检出此提交？',
  ],
  [
    "No Modifications; Complete Agreement. These Application Terms may only be modified by a written amendment signed by an authorized representative of GitHub, or by the posting by GitHub of a revised version. These Application Terms, together with any applicable Open Source Licenses and Notices and GitHub's Privacy Statement, represent the complete and exclusive statement of the agreement between you and us. These Application Terms supersede any proposal or prior agreement oral or written, and any other communications between you and GitHub relating to the subject matter of these terms.",
    '无修改；完整协议。除非由 GitHub 授权代表签署书面修订，或 GitHub 发布修订版本，否则不得修改这些应用条款。这些应用条款连同任何适用的开源许可和声明以及 GitHub 隐私声明，构成你与我们之间完整且排他的协议声明。这些应用条款取代任何与这些条款主题相关的口头或书面提议、先前协议以及其他通信。',
  ],
  [
    'GitHub Open Source Applications Terms and Conditions',
    'GitHub 开源应用条款和条件',
  ],
  ['Open Source Licenses and Notices', '开源许可和声明'],
  ['GitHub Privacy Statement', 'GitHub 隐私声明'],
  ['GitHub Privacy Statement.', 'GitHub 隐私声明。'],
  ['Terms of Service', '服务条款'],
  ['Additional Services', '附加服务'],
  ['Auto-Update Services', '自动更新服务'],
  ['Disclaimers and Limitations of Liability', '免责声明和责任限制'],
  ['Connecting to GitHub', '连接到 GitHub'],
  ['Creative Commons Attribution license', '知识共享署名许可'],
  [
    'License to GitHub Policies. These Application Terms are licensed under the',
    'GitHub 政策许可。这些应用条款基于',
  ],
  [
    'Contact Us. Please send any questions about these Application Terms to',
    '联系我们。关于这些应用条款的任何问题请发送至',
  ],
  [', but feel free to use any.', '，不过你也可以使用任意编辑器。'],
  [
    ". For more information about GitHub's privacy practices, see the",
    '。更多 GitHub 隐私做法信息请参阅',
  ],
  ['. Please', '。请'],
  ['. See', '。请参阅'],
  [
    '. You can change your preferred editor in',
    '。你可以在以下位置更改首选编辑器：',
  ],
  [
    '. You may use it freely under the terms of the Creative Commons license.',
    '。你可以根据知识共享许可条款自由使用它。',
  ],
  ["'Insert here'", '“插入到这里”'],
  [
    '" organization has enabled or enforced SAML SSO. To access this repository, you must sign in again and grant GitHub Desktop permission to access the organization\'s repositories.',
    '”组织已启用或强制 SAML SSO。要访问此仓库，你必须重新登录并授权 GitHub Desktop 访问该组织的仓库。',
  ],
  ['as determined by your', '，由你的'],
  [
    'Always available in the toolbar for local repositories or',
    '始终可在本地仓库的工具栏中使用，或',
  ],
  ['Always available in the toolbar or', '始终可在工具栏中使用，或'],
  [
    'Always available in the toolbar when there are local commits waiting to be pushed or',
    '当有本地提交等待推送时，始终可在工具栏中使用，或',
  ],
  [
    'Always available in the toolbar when there are remote changes or',
    '当有远程更改时，始终可在工具栏中使用，或',
  ],
  ['and try again?', '并重试？'],
  ['are entirely different commit histories.', '是完全不同的提交历史。'],
  [
    'Are you sure you want to leave the tutorial? This will bring you back to the home screen.',
    '确定要离开教程？这会带你回到主页。',
  ],
  [
    'Are you sure you want to remove the custom provider',
    '确定要移除自定义提供商',
  ],
  ['at line', '位于行'],
  ['been resolved.', '已解决。'],
  ['By creating an account, you agree to the', '创建账号即表示你同意'],
  ['Checking mergeability…', '正在检查可合并性…'],
  ['Checking out', '正在检出'],
  ['Checking out files', '正在检出文件'],
  ['Compressing objects', '正在压缩对象'],
  [
    'Could not find a branch to perform force push',
    '找不到可执行强制推送的分支',
  ],
  [
    'Could not find an upstream branch which will be pushed',
    '找不到将要推送的上游分支',
  ],
  ['Could not get git version information', '无法获取 Git 版本信息'],
  ["Couldn't parse licenses!", '无法解析许可！'],
  ['delete the lock file', '删除锁文件'],
  [
    'Do you want to switch to that Pull Request now and start fixing',
    '是否现在切换到该拉取请求并开始修复',
  ],
  [
    'Entire Agreement. These Application Terms, together with any applicable Privacy Notices, constitutes the entire agreement between you and GitHub and governs your use of the Software, superseding any prior agreements between you and GitHub (including, but not limited to, any prior versions of the Application Terms).',
    '完整协议。这些应用条款连同任何适用的隐私声明，构成你与 GitHub 之间的完整协议，并约束你对本软件的使用，取代你与 GitHub 之间任何先前协议（包括但不限于应用条款的任何先前版本）。',
  ],
  ['Example commit', '示例提交'],
  ['failed in your pull request', '在你的拉取请求中失败'],
  [
    'Failed to update Git configuration file. A lock file already exists at',
    '更新 Git 配置文件失败。锁文件已存在于',
  ],
  ['file, save it, and come back.', '文件，保存后再回来。'],
  ['For this repository I wish to', '对于此仓库，我希望'],
  ['for your repository.', '用于你的仓库。'],
  [
    'GitHub Desktop also distributes these libraries:',
    'GitHub Desktop 还分发以下库：',
  ],
  [
    'GitHub Desktop is a seamless way to contribute to projects on GitHub and GitHub Enterprise. Sign in below to get started with your existing projects.',
    'GitHub Desktop 是向 GitHub 和 GitHub Enterprise 上的项目贡献代码的顺畅方式。请在下方登录，以开始处理现有项目。',
  ],
  [
    'GitHub Desktop is unable to push commits to this branch because there are commits on the remote that are not present on your local branch. Fetch these new commits before pushing in order to reconcile them with your local commits.',
    'GitHub Desktop 无法向此分支推送提交，因为远程存在本地分支没有的提交。请先获取这些新提交，再推送以与你的本地提交协调。',
  ],
  [
    'GitHub Desktop sends usage metrics to improve the product and inform feature decisions.',
    'GitHub Desktop 会发送使用指标，以改进产品并辅助功能决策。',
  ],
  ["GitHub's Logos", 'GitHub 标志'],
  ['hook failed. What would you like to do?', 'Hook 失败。你希望怎么做？'],
  ['Icon Preview', '图标预览'],
  ['in progress that you have not yet committed.', '个尚未提交的进行中更改。'],
  ['in your', '在你的'],
  ['is a protected branch. Want to', '是受保护分支。是否要'],
  [
    'is an open source project published under the MIT License. You can view the source code and contribute to this project on',
    '是基于 MIT 许可发布的开源项目。你可以在这里查看源代码并为项目贡献：',
  ],
  ['is the', '是'],
  ['is up to date with all commits from', '已包含来自以下位置的全部提交：'],
  [
    'It doesn’t look like you have a text editor installed. We can recommend',
    '看起来你还没有安装文本编辑器。我们可以推荐',
  ],
  ['Learn more about user metrics.', '了解更多用户指标信息。'],
  ['menu or', '菜单，或'],
  ['not included.', '未包含。'],
  ['One or more rules', '一条或多条规则'],
  ['Receiving objects', '正在接收对象'],
  ['Release notes generated from markdown', '由 Markdown 生成的发行说明'],
  ['remote: Compressing objects', '远程：正在压缩对象'],
  ['remote: Resolving deltas', '远程：正在解析增量'],
  ['Resolving deltas', '正在解析增量'],
  ['Revert progress button', '还原进度按钮'],
  ['Reverting…', '正在还原…'],
  ['Showing changes from', '显示更改来源：'],
  ['Showing changes from all commits', '显示所有提交中的更改'],
  [
    'The commit message you have entered will be overridden by the generated commit message.',
    '你输入的提交信息将被生成的提交信息覆盖。',
  ],
  [
    'The currently checked out branch. Pick this if you need to build on work done on this branch.',
    '当前检出的分支。如果需要基于此分支上的工作继续，请选择它。',
  ],
  [
    "The default branch in your repository. Pick this to start on something new that's not dependent on your current branch.",
    '仓库中的默认分支。如果要开始不依赖当前分支的新工作，请选择它。',
  ],
  [
    "The default branch of the upstream repository. Pick this to start on something new that's not dependent on your current branch.",
    '上游仓库的默认分支。如果要开始不依赖当前分支的新工作，请选择它。',
  ],
  ['The directory', '目录'],
  ['The email in your global Git config (', '全局 Git 配置中的邮箱（'],
  [
    'There are no uncommitted changes in this repository. Here are some friendly suggestions for what to do next.',
    '此仓库没有未提交的更改。下面是一些下一步建议。',
  ],
  ['There are uncommitted changes in this repository', '此仓库有未提交的更改'],
  [
    'This can happen if another tool is currently modifying the Git configuration or if a Git process has terminated earlier without cleaning up the lock file. Do you want to',
    '如果另一个工具正在修改 Git 配置，或某个 Git 进程之前终止但没有清理锁文件，就可能出现这种情况。是否要',
  ],
  ['to exit fullscreen', '退出全屏'],
  ['View all rulesets for this branch.', '查看此分支的全部规则集。'],
  [
    'Would you like to automatically start with Copilot whenever conflicts are detected? You can change this anytime in',
    '检测到冲突时是否自动使用 Copilot 开始？你可以随时在以下位置更改：',
  ],
  ['Writing objects', '正在写入对象'],
  ['You can', '你可以'],
  ['You have', '你有'],
  ['You have the latest version (last checked', '你已是最新版本（上次检查时间'],
  ['your pull request', '你的拉取请求'],
  [
    'Any use of the Software that violates your applicable GitHub Terms will also be a violation of these Application Terms.',
    '任何违反适用 GitHub 条款的软件使用行为，也会构成对这些应用条款的违反。',
  ],
  [
    'GitHub reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. GitHub shall not be liable to you or to any third-party for any price change, suspension or discontinuance of the Service.',
    'GitHub 保留随时修改或停止服务（或服务任何部分）的权利，无论是临时还是永久，且无需通知。GitHub 不会因任何价格变更、暂停或停止服务而对你或任何第三方承担责任。',
  ],
  [
    'Governing Law. You agree that these Application Terms and your use of the Software are governed under California law and any dispute related to the Software must be brought in a tribunal of competent jurisdiction located in or near San Francisco, California.',
    '适用法律。你同意这些应用条款以及你对本软件的使用受加利福尼亚州法律管辖，任何与本软件相关的争议必须提交至位于或靠近加利福尼亚州旧金山的有管辖权法院。',
  ],
  [
    'If you configure the Software to work with one or more accounts on the GitHub.com website or with an instance of GitHub Enterprise Server, your use of the Software will also be governed your applicable GitHub.com website Terms of Service and/or the license agreement applicable to your instance of GitHub Enterprise ("GitHub Terms").',
    '如果你将本软件配置为与 GitHub.com 网站上的一个或多个账号，或某个 GitHub Enterprise Server 实例一起使用，则你对本软件的使用也受适用的 GitHub.com 网站服务条款和/或适用于你的 GitHub Enterprise 实例的许可协议（“GitHub 条款”）约束。',
  ],
  [
    'No Waiver. The failure of GitHub to exercise or enforce any right or provision of these Application Terms shall not constitute a waiver of such right or provision.',
    '不构成弃权。GitHub 未行使或执行这些应用条款中的任何权利或规定，并不构成对该权利或规定的放弃。',
  ],
  [
    'The license grant included with the Software is not for GitHub\'s trademarks, which include the Software logo designs. GitHub reserves all trademark and copyright rights in and to all GitHub trademarks. GitHub\'s logos include, for instance, the stylized designs that include "logo" in the file title in the "logos" folder.',
    '本软件随附的许可授权不适用于 GitHub 的商标，其中包括软件标志设计。GitHub 保留所有 GitHub 商标中的商标权和版权。GitHub 的标志包括例如“标志”文件夹中文件标题包含“标志”的风格化设计。',
  ],
  [
    "The names GitHub, GitHub Desktop, GitHub for Mac, GitHub for Windows, Atom, the Octocat, and related GitHub logos and/or stylized names are trademarks of GitHub. You agree not to display or use these trademarks in any manner without GitHub's prior, written permission, except as allowed by GitHub's Logos and Usage Policy:",
    'GitHub、GitHub Desktop、GitHub for Mac、GitHub for Windows、Atom、Octocat 以及相关 GitHub 标志和/或风格化名称均为 GitHub 的商标。除 GitHub 标志和使用政策允许外，未经 GitHub 事先书面许可，你同意不以任何方式展示或使用这些商标：',
  ],
  [
    'The open source license for the Software is included in the "Open Source Notices" documentation that is included with the Software. That documentation also includes copies of all applicable open source licenses.',
    '本软件的开源许可包含在随软件提供的“开源声明”文档中。该文档还包含所有适用开源许可的副本。',
  ],
  [
    'THE SERVICE IS PROVIDED ON AN "AS IS" BASIS, AND NO WARRANTY, EITHER EXPRESS OR IMPLIED, IS GIVEN. YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK. GitHub does not warrant that (i) the Service will meet your specific requirements; (ii) the Service is fully compatible with any particular platform; (iii) your use of the Service will be uninterrupted, timely, secure, or error-free; (iv) the results that may be obtained from the use of the Service will be accurate or reliable; (v) the quality of any products, services, information, or other material purchased or obtained by you through the Service will meet your expectations; or (vi) any errors in the Service will be corrected.',
    '本服务按“现状”提供，不作任何明示或暗示保证。你自行承担使用本服务的全部风险。GitHub 不保证：（1）服务将满足你的特定需求；（2）服务完全兼容任何特定平台；（3）你对服务的使用不会中断、及时、安全或无错误；（4）通过使用服务获得的结果准确或可靠；（5）通过服务购买或取得的任何产品、服务、信息或其他材料的质量符合你的期望；或（6）服务中的任何错误都会被纠正。',
  ],
  [
    "The Software may collect personal information. You may control what information the Software collects in the settings panel. If the Software does collect personal information on GitHub's behalf, GitHub will process that information in accordance with the",
    '本软件可能收集个人信息。你可以在设置面板中控制软件收集哪些信息。如果本软件代表 GitHub 收集个人信息，GitHub 将按照以下文件处理这些信息：',
  ],
  [
    'The Software may include an auto-update service ("Service"). If you choose to use the Service or you download Software that automatically enables the Service, GitHub will automatically update the Software when a new version is available.',
    '本软件可能包含自动更新服务（“服务”）。如果你选择使用该服务，或下载会自动启用该服务的软件，当新版本可用时，GitHub 将自动更新本软件。',
  ],
  [
    'These GitHub Open Source Applications Terms and Conditions ("Application Terms") are a legal agreement between you (either as an individual or on behalf of an entity) and GitHub, Inc. regarding your use of GitHub\'s applications, such as GitHub Desktop™ and associated documentation ("Software"). These Application Terms apply to the executable code version of the Software. Source code for the Software is available separately and free of charge under open source software license agreements. If you do not agree to all of the terms in these Application Terms, do not download, install, use, or copy the Software.',
    '这些 GitHub 开源应用条款和条件（“应用条款”）是你（无论以个人身份还是代表某个实体）与 GitHub, Inc. 就你使用 GitHub 应用（例如 GitHub Desktop™）及相关文档（“软件”）达成的法律协议。这些应用条款适用于软件的可执行代码版本。软件源代码根据开源软件许可协议单独免费提供。如果你不同意这些应用条款中的全部条款，请不要下载、安装、使用或复制本软件。',
  ],
  [
    'Third-Party Packages. The Software supports third-party "Packages" which may modify, add, remove, or alter the functionality of the Software. These Packages are not covered by these Application Terms and may include their own license which governs your use of that particular package.',
    '第三方包。本软件支持第三方“包”，这些包可能修改、添加、移除或改变本软件的功能。这些包不受这些应用条款约束，且可能包含其自身许可，用于约束你对该特定包的使用。',
  ],
  [
    'To the extent the terms of the licenses applicable to open source components require GitHub to make an offer to provide source code in connection with the Software, such offer is hereby made, and you may exercise it by contacting GitHub:',
    '在适用于开源组件的许可条款要求 GitHub 就本软件提供源代码的范围内，GitHub 特此作出该提供源代码的要约，你可以通过联系 GitHub 行使该权利：',
  ],
  [
    "Unless otherwise agreed to in writing with GitHub, your agreement with GitHub will always include, at a minimum, these Application Terms. Open source software licenses for the Software's source code constitute separate written agreements. To the limited extent that the open source software licenses expressly supersede these Application Terms, the open source licenses govern your agreement with GitHub for the use of the Software or specific included components of the Software.",
    '除非你与 GitHub 另有书面约定，你与 GitHub 的协议至少始终包含这些应用条款。本软件源代码的开源软件许可构成单独的书面协议。在开源软件许可明确取代这些应用条款的有限范围内，开源许可将约束你与 GitHub 就使用本软件或软件中特定组件达成的协议。',
  ],
  [
    'YOU EXPRESSLY UNDERSTAND AND AGREE THAT GITHUB SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO, DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA OR OTHER INTANGIBLE LOSSES (EVEN IF GITHUB HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES) RELATED TO THE SERVICE, including, for example: (i) the use or the inability to use the Service; (ii) the cost of procurement of substitute goods and services resulting from any goods, data, information or services purchased or obtained or messages received or transactions entered into through or from the Service; (iii) unauthorized access to or alteration of your transmissions or data; (iv) statements or conduct of any third-party on the Service; (v) or any other matter relating to the Service.',
    '你明确理解并同意，GitHub 不对与本服务相关的任何直接、间接、偶然、特殊、后果性或惩罚性损害承担责任，包括但不限于利润、商誉、使用、数据或其他无形损失（即使 GitHub 已被告知发生此类损害的可能性），例如：（1）使用或无法使用本服务；（2）因通过本服务购买或取得的任何商品、数据、信息或服务，或收到的信息，或通过本服务订立的交易而产生的替代商品和服务采购成本；（3）你的传输或数据遭到未经授权访问或更改；（4）第三方在服务上的声明或行为；（5）或与服务有关的任何其他事项。',
  ],
  ['The "', '“'],
])

const ignoredElements = new Set([
  'CODE',
  'KBD',
  'PRE',
  'SAMP',
  'SCRIPT',
  'STYLE',
  'TEXTAREA',
])

const ignoredAncestorSelectors = [
  '.CodeMirror',
  '.cm-editor',
  '.diff-line',
  '.blob-code',
]

const translatableAttributes = ['aria-label', 'alt', 'placeholder', 'title']

const originalText = new WeakMap<Text, string>()
const originalAttributes = new WeakMap<Element, Map<string, string>>()

let observer: MutationObserver | null = null
let isLocalizing = false

export function installUIStringLocalization() {
  if (observer !== null || typeof document === 'undefined') {
    return
  }

  observer = new MutationObserver(mutations => {
    if (isLocalizing) {
      return
    }

    for (const mutation of mutations) {
      if (mutation.type === 'characterData') {
        localizeTextNode(mutation.target as Text)
        continue
      }

      if (mutation.type === 'attributes') {
        localizeElementAttributes(mutation.target as Element)
        continue
      }

      for (const node of mutation.addedNodes) {
        localizeNode(node)
      }
    }
  })

  localizeNode(document.body)

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: translatableAttributes,
    characterData: true,
    childList: true,
    subtree: true,
  })
}

function localizeNode(node: Node) {
  if (node.nodeType === Node.TEXT_NODE) {
    localizeTextNode(node as Text)
    return
  }

  if (!(node instanceof Element) || shouldIgnoreElement(node)) {
    return
  }

  localizeElementAttributes(node)

  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
    acceptNode: candidate => {
      const parent = candidate.parentElement
      return parent !== null && shouldIgnoreElement(parent)
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT
    },
  })

  const textNodes: Text[] = []
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text)
  }

  for (const textNode of textNodes) {
    localizeTextNode(textNode)
  }

  for (const element of node.querySelectorAll('*')) {
    localizeElementAttributes(element)
  }
}

function localizeTextNode(node: Text) {
  const source = originalText.get(node) ?? node.data
  const translated = translateVisibleString(source)

  applyTextChange(() => {
    if (translated === source) {
      if (originalText.has(node) && node.data !== source) {
        node.data = source
      }
      originalText.delete(node)
      return
    }

    originalText.set(node, source)
    if (node.data !== translated) {
      node.data = translated
    }
  })
}

function localizeElementAttributes(element: Element) {
  if (shouldIgnoreElement(element)) {
    return
  }

  for (const attribute of translatableAttributes) {
    const currentValue = element.getAttribute(attribute)
    if (currentValue === null) {
      continue
    }

    const originals = originalAttributes.get(element)
    const source = originals?.get(attribute) ?? currentValue
    const translated = translateVisibleString(source)

    applyTextChange(() => {
      if (translated === source) {
        if (originals?.has(attribute) && currentValue !== source) {
          element.setAttribute(attribute, source)
        }
        originals?.delete(attribute)
        return
      }

      const map = originals ?? new Map<string, string>()
      map.set(attribute, source)
      originalAttributes.set(element, map)

      if (currentValue !== translated) {
        element.setAttribute(attribute, translated)
      }
    })
  }
}

export function translateVisibleString(value: string): string {
  if (getCurrentLanguage() !== ApplicationLanguage.SimplifiedChinese) {
    return value
  }

  const leading = value.match(/^\s*/)?.[0] ?? ''
  const trailing = value.match(/\s*$/)?.[0] ?? ''
  const normalized = normalizeForLookup(value)

  if (normalized.length === 0 || !/[A-Za-z]/.test(normalized)) {
    return value
  }

  const exact = exactTranslations.get(normalized)
  if (exact !== undefined) {
    return `${leading}${exact}${trailing}`
  }

  const templated = translateTemplate(normalized)
  if (templated !== null) {
    return `${leading}${templated}${trailing}`
  }

  return value
}

function translateTemplate(value: string): string | null {
  const signedIn = value.match(
    /^You're already signed in to (.+) with the account (.+)\. If you continue, you will first be signed out\.$/
  )
  if (signedIn !== null) {
    return `你已经使用账号 ${signedIn[2]} 登录到 ${signedIn[1]}。如果继续，你会先退出登录。`
  }

  const removeRepository = value.match(
    /^Are you sure you want to remove the repository "(.+)" from GitHub Desktop\?$/
  )
  if (removeRepository !== null) {
    return `确定要从 GitHub Desktop 移除仓库“${removeRepository[1]}”？`
  }

  const chooseAlias = value.match(
    /^Choose a new alias for the repository "(.+)"$/
  )
  if (chooseAlias !== null) {
    return `为仓库“${chooseAlias[1]}”选择新别名`
  }

  const missingRepository = value.match(/^Can't find "(.+)"$/)
  if (missingRepository !== null) {
    return `找不到“${missingRepository[1]}”`
  }

  const currentBranchPublished = value.match(
    /^The current branch \((.+)\) is already published to GitHub\. Create a pull request to propose and collaborate on your changes\.$/
  )
  if (currentBranchPublished !== null) {
    return `当前分支（${currentBranchPublished[1]}）已发布到 GitHub。创建拉取请求以提出更改并协作。`
  }

  const currentBranchPreview = value.match(
    /^The current branch \((.+)\) is already published to GitHub\. Preview the changes this pull request will have before proposing your changes\.$/
  )
  if (currentBranchPreview !== null) {
    return `当前分支（${currentBranchPreview[1]}）已发布到 GitHub。提出更改前预览此拉取请求将包含的更改。`
  }

  const currentBranchUnpublished = value.match(
    /^The current branch \((.+)\) hasn't been published to the remote yet\. By publishing it you can share it, and collaborate with others\.$/
  )
  if (currentBranchUnpublished !== null) {
    return `当前分支（${currentBranchUnpublished[1]}）尚未发布到远程。发布后你可以共享它并与他人协作。`
  }

  const currentBranchExists = value.match(
    /^The current branch \((.+)\) has (.+) exist on your machine\.$/
  )
  if (currentBranchExists !== null) {
    return `当前分支（${currentBranchExists[1]}）在本机有 ${currentBranchExists[2]}。`
  }

  const forcePush = value.match(
    /^A force push will rewrite history on (.+)\. Any collaborators working on this branch will need to reset their own local branch to match the history of the remote\.$/
  )
  if (forcePush !== null) {
    return `强制推送会重写 ${forcePush[1]} 上的历史。在此分支上协作的其他人需要重置自己的本地分支以匹配远程历史。`
  }

  const addRepository = value.match(
    /^The Git repository (.+) appears to be owned by another user on your machine\. Adding untrusted repositories may automatically execute files in the repository\.$/
  )
  if (addRepository !== null) {
    return `Git 仓库 ${addRepository[1]} 看起来归本机上的另一位用户所有。添加不受信任的仓库可能会自动执行仓库中的文件。`
  }

  const retryCloning = value.match(/^Would you like to retry cloning (.+)$/)
  if (retryCloning !== null) {
    return `是否重试克隆 ${retryCloning[1]}？`
  }

  const signedOut = value.match(
    /^Your account token has been invalidated and you have been signed out from your (.+) account\. Do you want to sign in again\?$/
  )
  if (signedOut !== null) {
    return `你的 ${signedOut[1]} 账号令牌已失效，并已退出登录。是否重新登录？`
  }

  const noRepositoryMatch = value.match(
    /^Sorry, I can't find any repository matching (.+)$/
  )
  if (noRepositoryMatch !== null) {
    return `抱歉，找不到匹配的仓库：${noRepositoryMatch[1]}`
  }

  return null
}

function normalizeForLookup(value: string): string {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&hellip;/g, '…')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function shouldIgnoreElement(element: Element): boolean {
  if (ignoredElements.has(element.tagName)) {
    return true
  }

  if (element instanceof HTMLElement && element.isContentEditable) {
    return true
  }

  return ignoredAncestorSelectors.some(selector => element.closest(selector))
}

function applyTextChange(change: () => void) {
  isLocalizing = true
  try {
    change()
  } finally {
    isLocalizing = false
  }
}
