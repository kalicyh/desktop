import * as React from 'react'
import { Octicon } from '../octicons'
import * as octicons from '../octicons/octicons.generated'
import { Button } from '../lib/button'
import { encodePathAsUrl } from '../../lib/path'
import { t } from '../../lib/i18n'

const PaperStackImage = encodePathAsUrl(__dirname, 'static/paper-stack.svg')

interface ICICheckRunNoStepProps {
  /** Callback to opens check runs target url (maybe GitHub, maybe third party) */
  readonly onViewCheckExternally: () => void
}

/** The CI check no step view. */
export class CICheckRunNoStepItem extends React.PureComponent<ICICheckRunNoStepProps> {
  public render() {
    return (
      <div className="ci-check-run-no-steps">
        <p>
          {t('checkRuns.noSteps')}
          <Button
            className="button-with-icon"
            onClick={this.props.onViewCheckExternally}
            role="link"
          >
            {t('checkRuns.viewDetails')}
            <Octicon symbol={octicons.linkExternal} />
          </Button>
        </p>

        <img src={PaperStackImage} alt="" />
      </div>
    )
  }
}
