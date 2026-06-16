import * as React from 'react'
import { GitHubRepository } from '../../models/github-repository'
import {
  RepoRulesMetadataFailure,
  RepoRulesMetadataFailures,
} from '../../models/repo-rules'
import { RepoRulesetsForBranchLink } from './repo-rulesets-for-branch-link'
import { RepoRulesetLink } from './repo-ruleset-link'
import { t } from '../../lib/i18n'

interface IRepoRulesMetadataFailureListProps {
  readonly repository: GitHubRepository
  readonly branch: string
  readonly failures: RepoRulesMetadataFailures

  /**
   * Text that will come before the standard text, should be the name of the rule
   * that's being checked. For example, "The email in your global Git config" or
   * "This commit message".
   */
  readonly leadingText: string | JSX.Element
}

/**
 * Returns a standard message for failed repo metadata rules.
 */
export class RepoRulesMetadataFailureList extends React.Component<IRepoRulesMetadataFailureListProps> {
  public render() {
    const { repository, branch, failures, leadingText } = this.props

    const totalFails = failures.failed.length + failures.bypassed.length
    let endText: string
    if (failures.status === 'bypass') {
      endText = t(
        totalFails === 1
          ? 'repositoryRules.bypassEnd.one'
          : 'repositoryRules.bypassEnd.other'
      )
    } else {
      endText = '.'
    }

    return (
      <div className="repo-rules-failure-list-component">
        <p>
          {leadingText}{' '}
          {t(
            totalFails === 1
              ? 'repositoryRules.failsRule.one'
              : 'repositoryRules.failsRule.other',
            { count: totalFails }
          )}
          {endText}{' '}
          <RepoRulesetsForBranchLink repository={repository} branch={branch}>
            {t('repositoryRules.viewAllRulesets')}
          </RepoRulesetsForBranchLink>
        </p>
        {this.renderRuleFailureList(failures.failed, 'failed')}
        {this.renderRuleFailureList(failures.bypassed, 'bypassed')}
      </div>
    )
  }

  private renderRuleFailureList(
    failures: RepoRulesMetadataFailure[],
    label: string
  ) {
    if (failures.length === 0) {
      return null
    }
    const labelId = `repo-rule-list-label-${label.toLowerCase()}`
    return (
      <div className="repo-rule-list">
        <label id={labelId}>
          {label === 'failed'
            ? t('repositoryRules.failedRules')
            : t('repositoryRules.bypassedRules')}
          :
        </label>
        <ul aria-labelledby={labelId}>
          {failures.map(f => (
            <li key={`${f.description}-${f.rulesetId}`}>
              <RepoRulesetLink
                repository={this.props.repository}
                rulesetId={f.rulesetId}
              >
                {f.description}
              </RepoRulesetLink>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
