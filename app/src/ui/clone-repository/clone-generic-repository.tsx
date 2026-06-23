import * as React from 'react'
import { TextBox } from '../lib/text-box'
import { Button } from '../lib/button'
import { Row } from '../lib/row'
import { DialogContent } from '../dialog'
import { Ref } from '../lib/ref'
import { t } from '../../lib/i18n'
import { Checkbox, CheckboxValue } from '../lib/checkbox'

interface ICloneGenericRepositoryProps {
  /** The URL to clone. */
  readonly url: string

  /** The path to which the repository should be cloned. */
  readonly path: string

  /** Called when the destination path changes. */
  readonly onPathChanged: (path: string) => void

  /** Called when the URL to clone changes. */
  readonly onUrlChanged: (url: string) => void

  /**
   * Called when the user should be prompted to choose a directory to clone to.
   */
  readonly onChooseDirectory: () => Promise<string | undefined>

  readonly useGh: boolean

  readonly onUseGhChanged: (value: boolean) => void
}

/** The component for cloning a repository. */
export class CloneGenericRepository extends React.Component<
  ICloneGenericRepositoryProps,
  {}
> {
  public render() {
    return (
      <DialogContent className="clone-generic-repository-content">
        <Row>
          <TextBox
            placeholder={t('clone.urlPlaceholder')}
            value={this.props.url}
            onValueChanged={this.onUrlChanged}
            autoFocus={true}
            label={
              <div className="clone-url-textbox-label">
                <p>{t('clone.urlLabel')}</p>
                <p>
                  (<Ref>hubot/cool-repo</Ref>)
                </p>
              </div>
            }
          />
        </Row>

        <Row>
          <TextBox
            value={this.props.path}
            label={t('clone.localPath')}
            placeholder={t('clone.repositoryPathPlaceholder')}
            onValueChanged={this.props.onPathChanged}
          />
          <Button onClick={this.props.onChooseDirectory}>
            {t('clone.choose')}
          </Button>
        </Row>

        <Row>
          <Checkbox
            label={t('clone.useGh')}
            value={this.props.useGh ? CheckboxValue.On : CheckboxValue.Off}
            onChange={this.onUseGhChanged}
          />
        </Row>
      </DialogContent>
    )
  }

  private onUrlChanged = (url: string) => {
    this.props.onUrlChanged(url)
  }

  private onUseGhChanged = (event: React.FormEvent<HTMLInputElement>) => {
    this.props.onUseGhChanged(event.currentTarget.checked)
  }
}
