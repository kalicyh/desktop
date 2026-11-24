import { shell } from '../../lib/app-shell'
import { t } from '../../lib/i18n'
import { Dispatcher } from '../dispatcher'

export async function openFile(
  fullPath: string,
  dispatcher: Dispatcher
): Promise<void> {
  const errorMessage = await shell.openPath(fullPath)

  if (errorMessage !== '') {
    const error = {
      name: 'no-external-program',
      message: t('openFile.error.noExternalProgram', { path: fullPath }),
    }
    await dispatcher.postError(error)
  }
}
