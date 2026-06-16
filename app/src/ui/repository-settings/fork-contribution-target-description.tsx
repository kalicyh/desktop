import * as React from 'react'
import { ForkContributionTarget } from '../../models/workflow-preferences'
import { RepositoryWithForkedGitHubRepository } from '../../models/repository'
import { t } from '../../lib/i18n'

interface IForkSettingsDescription {
  readonly repository: RepositoryWithForkedGitHubRepository
  readonly forkContributionTarget: ForkContributionTarget
}

export function ForkSettingsDescription(props: IForkSettingsDescription) {
  // We can't use the getNonForkGitHubRepository() helper since we need to calculate
  // the value based on the temporary form state.
  const targetRepository =
    props.forkContributionTarget === ForkContributionTarget.Self
      ? props.repository.gitHubRepository
      : props.repository.gitHubRepository.parent

  return (
    <ul className="fork-settings-description">
      <li>
        {t('forkSettings.pullRequestsPrefix')}
        <strong>{targetRepository.fullName}</strong>
        {t('forkSettings.pullRequestsSuffix')}
      </li>
      <li>
        {t('forkSettings.issuesPrefix')}
        <strong>{targetRepository.fullName}</strong>
        {t('forkSettings.issuesSuffix')}
      </li>
      <li>
        {t('forkSettings.viewOnGitHubPrefix')}
        <strong>{targetRepository.fullName}</strong>
        {t('forkSettings.viewOnGitHubSuffix')}
      </li>
      <li>
        {t('forkSettings.newBranchesPrefix')}
        <strong>{targetRepository.fullName}</strong>
        {t('forkSettings.newBranchesSuffix')}
      </li>
      <li>
        {t('forkSettings.autocompletePrefix')}
        <strong>{targetRepository.fullName}</strong>
        {t('forkSettings.autocompleteSuffix')}
      </li>
    </ul>
  )
}
