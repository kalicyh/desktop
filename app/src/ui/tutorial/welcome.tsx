import * as React from 'react'

import { encodePathAsUrl } from '../../lib/path'
import { t } from '../../lib/i18n'

const CodeImage = encodePathAsUrl(__dirname, 'static/code.svg')
const TeamDiscussionImage = encodePathAsUrl(
  __dirname,
  'static/github-for-teams.svg'
)
const CloudServerImage = encodePathAsUrl(
  __dirname,
  'static/github-for-business.svg'
)

export class TutorialWelcome extends React.Component {
  public render() {
    return (
      <div id="tutorial-welcome">
        <div className="header">
          <h1>{t('tutorial.welcome.title')}</h1>
          <p>{t('tutorial.welcome.description')}</p>
        </div>
        <ul className="definitions">
          <li>
            <img src={CodeImage} alt={t('tutorial.welcome.codeAlt')} />
            <p>
              <strong>Git</strong> {t('tutorial.welcome.gitDefinition')}
            </p>
          </li>
          <li>
            <img
              src={TeamDiscussionImage}
              alt={t('tutorial.welcome.teamAlt')}
            />
            <p>
              <strong>GitHub</strong> {t('tutorial.welcome.githubDefinition')}
            </p>
          </li>
          <li>
            <img src={CloudServerImage} alt={t('tutorial.welcome.cloudAlt')} />
            <p>
              <strong>GitHub Desktop</strong>{' '}
              {t('tutorial.welcome.desktopDefinition')}
            </p>
          </li>
        </ul>
      </div>
    )
  }
}
