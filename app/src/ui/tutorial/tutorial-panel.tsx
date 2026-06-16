import * as React from 'react'
import { join } from 'path'
import { LinkButton } from '../lib/link-button'
import { Button } from '../lib/button'
import { Repository } from '../../models/repository'
import { Dispatcher } from '../dispatcher'
import { Octicon } from '../octicons'
import * as octicons from '../octicons/octicons.generated'
import {
  ValidTutorialStep,
  TutorialStep,
  orderedTutorialSteps,
} from '../../models/tutorial-step'
import { encodePathAsUrl } from '../../lib/path'
import { PopupType } from '../../models/popup'
import { PreferencesTab } from '../../models/preferences'
import { Ref } from '../lib/ref'
import { suggestedExternalEditor } from '../../lib/editors/shared'
import { TutorialStepInstructions } from './tutorial-step-instruction'
import { KeyboardShortcut } from '../keyboard-shortcut/keyboard-shortcut'
import { t } from '../../lib/i18n'

const TutorialPanelImage = encodePathAsUrl(
  __dirname,
  'static/required-status-check.svg'
)

interface ITutorialPanelProps {
  readonly dispatcher: Dispatcher
  readonly repository: Repository

  /** name of the configured external editor
   * (`undefined` if none is configured.)
   */
  readonly resolvedExternalEditor: string | null
  readonly currentTutorialStep: ValidTutorialStep
  readonly onExitTutorial: () => void
}

interface ITutorialPanelState {
  /** ID of the currently expanded tutorial step */
  readonly currentlyOpenSectionId: ValidTutorialStep
}

/** The Onboarding Tutorial Panel
 *  Renders a list of expandable tutorial steps (`TutorialListItem`).
 *  Enforces only having one step expanded at a time through
 *  event callbacks and local state.
 */
export class TutorialPanel extends React.Component<
  ITutorialPanelProps,
  ITutorialPanelState
> {
  public constructor(props: ITutorialPanelProps) {
    super(props)
    this.state = { currentlyOpenSectionId: this.props.currentTutorialStep }
  }

  private openTutorialFileInEditor = () => {
    this.props.dispatcher.openInExternalEditor(
      // TODO: tie this filename to a shared constant
      // for tutorial repos
      join(this.props.repository.path, 'README.md')
    )
  }

  private openPullRequest = () => {
    // This will cause the tutorial pull request step to close first.
    this.props.dispatcher.markPullRequestTutorialStepAsComplete(
      this.props.repository
    )

    // wait for the tutorial step to close before opening the PR, so that the
    // focusing of the "You're Done!" header is not interupted.
    setTimeout(() => {
      this.props.dispatcher.createPullRequest(this.props.repository)
    }, 500)
  }

  private skipEditorInstall = () => {
    this.props.dispatcher.skipPickEditorTutorialStep(this.props.repository)
  }

  private skipCreatePR = () => {
    this.props.dispatcher.markPullRequestTutorialStepAsComplete(
      this.props.repository
    )
  }

  private isStepComplete = (step: ValidTutorialStep) => {
    return (
      orderedTutorialSteps.indexOf(step) <
      orderedTutorialSteps.indexOf(this.props.currentTutorialStep)
    )
  }

  private isStepNextTodo = (step: ValidTutorialStep) => {
    return step === this.props.currentTutorialStep
  }

  public componentWillReceiveProps(nextProps: ITutorialPanelProps) {
    if (this.props.currentTutorialStep !== nextProps.currentTutorialStep) {
      this.setState({
        currentlyOpenSectionId: nextProps.currentTutorialStep,
      })
    }
  }

  public render() {
    return (
      <div className="tutorial-panel-component panel">
        <div className="titleArea">
          <h3>{t('tutorial.panel.title')}</h3>
          <img
            src={TutorialPanelImage}
            alt={t('tutorial.panel.checklistAlt')}
          />
        </div>
        <ol>
          <TutorialStepInstructions
            summaryText={t('tutorial.panel.installEditor.summary')}
            isComplete={this.isStepComplete}
            isNextStepTodo={this.isStepNextTodo}
            sectionId={TutorialStep.PickEditor}
            currentlyOpenSectionId={this.state.currentlyOpenSectionId}
            skipLinkButton={<SkipLinkButton onClick={this.skipEditorInstall} />}
            onSummaryClick={this.onStepSummaryClick}
          >
            {!this.isStepComplete(TutorialStep.PickEditor) ? (
              <>
                <p className="description">
                  {t('tutorial.panel.installEditor.noEditorPrefix')}{' '}
                  <LinkButton
                    uri={suggestedExternalEditor.url}
                    title={t('tutorial.panel.installEditor.openWebsite', {
                      editor: suggestedExternalEditor.name,
                    })}
                  >
                    {suggestedExternalEditor.name}
                  </LinkButton>
                  {` ${t('tutorial.panel.installEditor.or')} `}
                  <LinkButton
                    uri="https://atom.io"
                    title={t('tutorial.panel.installEditor.openWebsite', {
                      editor: 'Atom',
                    })}
                  >
                    Atom
                  </LinkButton>
                  {t('tutorial.panel.installEditor.noEditorSuffix')}
                </p>
                <div className="action">
                  <LinkButton onClick={this.skipEditorInstall}>
                    {t('tutorial.panel.installEditor.haveEditor')}
                  </LinkButton>
                </div>
              </>
            ) : (
              <p className="description">
                {t('tutorial.panel.installEditor.defaultEditorPrefix')}{' '}
                <strong>{this.props.resolvedExternalEditor}</strong>.{' '}
                {t('tutorial.panel.installEditor.defaultEditorMiddle')}{' '}
                <LinkButton onClick={this.onPreferencesClick}>
                  {__DARWIN__
                    ? t('tutorial.panel.installEditor.settings')
                    : t('tutorial.panel.installEditor.options')}
                </LinkButton>
              </p>
            )}
          </TutorialStepInstructions>
          <TutorialStepInstructions
            summaryText={t('tutorial.panel.createBranch.summary')}
            isComplete={this.isStepComplete}
            isNextStepTodo={this.isStepNextTodo}
            sectionId={TutorialStep.CreateBranch}
            currentlyOpenSectionId={this.state.currentlyOpenSectionId}
            onSummaryClick={this.onStepSummaryClick}
          >
            <p className="description">
              {t('tutorial.panel.createBranch.description', {
                newBranch: t('tutorial.panel.createBranch.newBranch'),
              })}
            </p>
            <div className="action">
              <KeyboardShortcut
                darwinKeys={['⌘', '⇧', 'N']}
                keys={['Ctrl', 'Shift', 'N']}
              />
            </div>
          </TutorialStepInstructions>
          <TutorialStepInstructions
            summaryText={t('tutorial.panel.editFile.summary')}
            isComplete={this.isStepComplete}
            isNextStepTodo={this.isStepNextTodo}
            sectionId={TutorialStep.EditFile}
            currentlyOpenSectionId={this.state.currentlyOpenSectionId}
            onSummaryClick={this.onStepSummaryClick}
          >
            <p className="description">
              {t('tutorial.panel.editFile.descriptionPrefix')}{' '}
              <Ref>README.md</Ref>
              {t('tutorial.panel.editFile.descriptionSuffix')}
            </p>
            {this.props.resolvedExternalEditor && (
              <div className="action">
                <Button onClick={this.openTutorialFileInEditor}>
                  {t('tutorial.panel.editFile.openEditor')}
                </Button>
                <KeyboardShortcut
                  darwinKeys={['⌘', '⇧', 'A']}
                  keys={['Ctrl', 'Shift', 'A']}
                />
              </div>
            )}
          </TutorialStepInstructions>
          <TutorialStepInstructions
            summaryText={t('tutorial.panel.makeCommit.summary')}
            isComplete={this.isStepComplete}
            isNextStepTodo={this.isStepNextTodo}
            sectionId={TutorialStep.MakeCommit}
            currentlyOpenSectionId={this.state.currentlyOpenSectionId}
            onSummaryClick={this.onStepSummaryClick}
          >
            <p className="description">
              {t('tutorial.panel.makeCommit.description')}
            </p>
          </TutorialStepInstructions>
          <TutorialStepInstructions
            summaryText={t('tutorial.panel.publish.summary')}
            isComplete={this.isStepComplete}
            isNextStepTodo={this.isStepNextTodo}
            sectionId={TutorialStep.PushBranch}
            currentlyOpenSectionId={this.state.currentlyOpenSectionId}
            onSummaryClick={this.onStepSummaryClick}
          >
            <p className="description">
              {t('tutorial.panel.publish.description')}
            </p>
            <div className="action">
              <KeyboardShortcut darwinKeys={['⌘', 'P']} keys={['Ctrl', 'P']} />
            </div>
          </TutorialStepInstructions>
          <TutorialStepInstructions
            summaryText={t('tutorial.panel.openPullRequest.summary')}
            isComplete={this.isStepComplete}
            isNextStepTodo={this.isStepNextTodo}
            sectionId={TutorialStep.OpenPullRequest}
            currentlyOpenSectionId={this.state.currentlyOpenSectionId}
            skipLinkButton={<SkipLinkButton onClick={this.skipCreatePR} />}
            onSummaryClick={this.onStepSummaryClick}
          >
            <p className="description">
              {t('tutorial.panel.openPullRequest.description')}
            </p>
            <div className="action">
              <Button onClick={this.openPullRequest} role="link">
                {t('tutorial.panel.openPullRequest.button')}
                <Octicon symbol={octicons.linkExternal} />
              </Button>
              <KeyboardShortcut darwinKeys={['⌘', 'R']} keys={['Ctrl', 'R']} />
            </div>
          </TutorialStepInstructions>
        </ol>
        <div className="footer">
          <Button onClick={this.props.onExitTutorial}>
            {t('tutorial.panel.exit')}
          </Button>
        </div>
      </div>
    )
  }
  /** this makes sure we only have one `TutorialListItem` open at a time */
  public onStepSummaryClick = (id: ValidTutorialStep) => {
    this.setState({ currentlyOpenSectionId: id })
  }

  private onPreferencesClick = () => {
    this.props.dispatcher.showPopup({
      type: PopupType.Preferences,
      initialSelectedTab: PreferencesTab.Integrations,
    })
  }
}

const SkipLinkButton: React.FunctionComponent<{
  onClick: () => void
}> = props => (
  <LinkButton onClick={props.onClick}>{t('tutorial.panel.skip')}</LinkButton>
)
