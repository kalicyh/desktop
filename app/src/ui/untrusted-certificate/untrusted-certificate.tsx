import * as React from 'react'
import * as URL from 'url'
import { Dialog, DialogContent, DialogFooter } from '../dialog'
import { OkCancelButtonGroup } from '../dialog/ok-cancel-button-group'
import { t } from '../../lib/i18n'

interface IUntrustedCertificateProps {
  /** The untrusted certificate. */
  readonly certificate: Electron.Certificate

  /** The URL which was being accessed. */
  readonly url: string

  /** The function to call when the user chooses to dismiss the dialog. */
  readonly onDismissed: () => void

  /**
   * The function to call when the user chooses to continue in the process of
   * trusting the certificate.
   */
  readonly onContinue: (certificate: Electron.Certificate) => void
}

/**
 * The dialog we display when an API request encounters an untrusted
 * certificate.
 *
 * An easy way to test this dialog is to attempt to sign in to GitHub
 * Enterprise using  one of the badssl.com domains, such
 * as https://self-signed.badssl.com/
 */
export class UntrustedCertificate extends React.Component<
  IUntrustedCertificateProps,
  {}
> {
  public render() {
    const host = URL.parse(this.props.url).hostname

    return (
      <Dialog
        title={t('untrustedCertificate.title')}
        onDismissed={this.props.onDismissed}
        onSubmit={this.onContinue}
        type={__DARWIN__ ? 'warning' : 'error'}
      >
        <DialogContent>
          <p>
            {t('untrustedCertificate.messagePrefix')} {host}.{' '}
            {t('untrustedCertificate.certificatePrefix')} (
            {this.props.certificate.subjectName}){' '}
            {t('untrustedCertificate.certificateSuffix')}{' '}
            <strong>{t('untrustedCertificate.attackWarning')}</strong>
          </p>
          <p>{t('untrustedCertificate.expectedCases')}</p>
          <ul>
            <li>{t('untrustedCertificate.enterpriseTrial')}</li>
            <li>{t('untrustedCertificate.unusualDomain')}</li>
          </ul>
          <p>{t('untrustedCertificate.contactAdmin')}</p>
        </DialogContent>
        <DialogFooter>
          <OkCancelButtonGroup
            destructive={true}
            okButtonText={
              __DARWIN__
                ? t('untrustedCertificate.viewCertificate')
                : t('untrustedCertificate.addCertificate')
            }
          />
        </DialogFooter>
      </Dialog>
    )
  }

  private onContinue = () => {
    this.props.onDismissed()
    this.props.onContinue(this.props.certificate)
  }
}
