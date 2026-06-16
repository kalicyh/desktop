import * as React from 'react'
import { t } from '../../lib/i18n'
import { Dialog, DialogContent, DefaultDialogFooter } from '../dialog'
import { LinkButton } from '../lib/link-button'

interface ITermsAndConditionsProps {
  /** A function called when the dialog is dismissed. */
  readonly onDismissed: () => void
}

const contact = 'https://github.com/contact'
const logos = 'https://github.com/logos'
const privacyStatement =
  'https://help.github.com/articles/github-privacy-statement/'
const license = 'https://creativecommons.org/licenses/by/4.0/'

export class TermsAndConditions extends React.Component<
  ITermsAndConditionsProps,
  {}
> {
  public render() {
    return (
      <Dialog
        id="terms-and-conditions"
        title={t('terms.title')}
        onSubmit={this.props.onDismissed}
        onDismissed={this.props.onDismissed}
      >
        <DialogContent>
          <p>{t('terms.introduction')}</p>

          <h2>{t('terms.connecting.heading')}</h2>

          <p>{t('terms.connecting.accountTerms')}</p>

          <p>{t('terms.connecting.violation')}</p>

          <h2>{t('terms.openSource.heading')}</h2>

          <p>{t('terms.openSource.notices')}</p>

          <p>
            {t('terms.openSource.sourceOfferPrefix')}{' '}
            <LinkButton uri={contact}>
              {t('terms.openSource.contactLink')}
            </LinkButton>
            {t('terms.openSource.sourceOfferSuffix')}
          </p>

          <p>{t('terms.openSource.minimumTerms')}</p>

          <h2>{t('terms.logos.heading')}</h2>

          <p>{t('terms.logos.trademarkRights')}</p>

          <p>
            {t('terms.logos.usagePrefix')}{' '}
            <LinkButton uri={logos}>{t('terms.logos.usageLink')}</LinkButton>
            {t('terms.logos.usageSuffix')}
          </p>

          <h2>{t('terms.privacy.heading')}</h2>

          <p>
            {t('terms.privacy.statementPrefix')}{' '}
            <LinkButton uri={privacyStatement}>
              {t('terms.privacy.statementLink')}
            </LinkButton>
            {t('terms.privacy.statementSuffix')}
          </p>

          <h2>{t('terms.services.heading')}</h2>

          <h3>{t('terms.services.autoUpdate.heading')}</h3>

          <p>{t('terms.services.autoUpdate.description')}</p>

          <h3>{t('terms.services.liability.heading')}</h3>

          <p>{t('terms.services.liability.disclaimer')}</p>

          <p>{t('terms.services.liability.damages')}</p>

          <p>{t('terms.services.liability.modification')}</p>

          <h2>{t('terms.misc.heading')}</h2>

          <ol>
            <li>{t('terms.misc.noWaiver')}</li>

            <li>{t('terms.misc.entireAgreement')}</li>

            <li>{t('terms.misc.governingLaw')}</li>

            <li>{t('terms.misc.thirdPartyPackages')}</li>

            <li>{t('terms.misc.noModifications')}</li>

            <li>
              {t('terms.misc.licensePrefix')}{' '}
              <LinkButton uri={license}>
                {t('terms.misc.licenseLink')}
              </LinkButton>
              {t('terms.misc.licenseSuffix')}
            </li>

            <li>
              {t('terms.misc.contactPrefix')}{' '}
              <LinkButton uri={contact}>support@github.com</LinkButton>
              {t('terms.misc.contactSuffix')}
            </li>
          </ol>
        </DialogContent>

        <DefaultDialogFooter />
      </Dialog>
    )
  }
}
