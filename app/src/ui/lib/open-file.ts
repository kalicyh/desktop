import { shell } from '../../lib/app-shell'
import { t } from '../../lib/i18n'
import { Dispatcher } from '../dispatcher'

export async function openFile(
  fullPath: string,
  dispatcher: Dispatcher
): Promise<void> {
  const result = await shell.openExternal(`file://${fullPath}`)

  if (!result) {
    const error = {
      name: 'no-external-program',
      message: t('openFile.error.noExternalProgram', { path: fullPath }),
    }
    await dispatcher.postError(error)
  }
}
