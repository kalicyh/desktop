import * as React from 'react'
import { Ref } from './ref'
import { LinkButton } from './link-button'
import { unlink } from 'fs/promises'
import { t } from '../../lib/i18n'

interface IConfigLockFileExistsProps {
  /**
   * The path to the lock file that's preventing a configuration
   * file update.
   */
  readonly lockFilePath: string

  /**
   * Called when the lock file has been deleted and the configuration
   * update can be retried
   */
  readonly onLockFileDeleted: () => void

  /**
   * Called if the lock file couldn't be deleted
   */
  readonly onError: (e: Error) => void
}

export class ConfigLockFileExists extends React.Component<IConfigLockFileExistsProps> {
  private onDeleteLockFile = async () => {
    try {
      await unlink(this.props.lockFilePath)
    } catch (e) {
      // We don't care about failure to unlink due to the
      // lock file not existing any more
      if (e.code !== 'ENOENT') {
        this.props.onError(e)
        return
      }
    }

    this.props.onLockFileDeleted()
  }
  public render() {
    return (
      <div className="config-lock-file-exists-component">
        <p>
          {t('configLockFileExists.failedPrefix')}{' '}
          <Ref>{this.props.lockFilePath}</Ref>.
        </p>
        <p>
          {t('configLockFileExists.reasonPrefix')}{' '}
          <LinkButton onClick={this.onDeleteLockFile}>
            {t('configLockFileExists.deleteLockFile')}
          </LinkButton>{' '}
          {t('configLockFileExists.reasonSuffix')}
        </p>
      </div>
    )
  }
}
