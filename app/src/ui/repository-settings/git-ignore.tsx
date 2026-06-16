import * as React from 'react'
import { DialogContent } from '../dialog'
import { TextArea } from '../lib/text-area'
import { LinkButton } from '../lib/link-button'
import { Ref } from '../lib/ref'
import { t } from '../../lib/i18n'

interface IGitIgnoreProps {
  readonly text: string | null
  readonly onIgnoreTextChanged: (text: string) => void
  readonly onShowExamples: () => void
}

/** A view for creating or modifying the repository's gitignore file */
export class GitIgnore extends React.Component<IGitIgnoreProps, {}> {
  public render() {
    return (
      <DialogContent>
        <p id="ignored-files-description">
          {t('repositorySettings.gitIgnore.editingPrefix')}{' '}
          <Ref>.gitignore</Ref>.{' '}
          {t('repositorySettings.gitIgnore.editingSuffix')}{' '}
          <LinkButton onClick={this.props.onShowExamples}>
            {t('repositorySettings.gitIgnore.learnMore')}
          </LinkButton>
        </p>

        <TextArea
          ariaLabel={t('repositorySettings.tabs.ignoredFiles')}
          ariaDescribedBy="ignored-files-description"
          placeholder={t('repositorySettings.tabs.ignoredFiles')}
          value={this.props.text || ''}
          onValueChanged={this.props.onIgnoreTextChanged}
          textareaClassName="gitignore"
        />
      </DialogContent>
    )
  }
}
