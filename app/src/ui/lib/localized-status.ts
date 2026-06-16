import { t } from '../../lib/i18n'
import {
  AppFileStatus,
  AppFileStatusKind,
  isConflictWithMarkers,
} from '../../models/status'
import { assertNever } from '../../lib/fatal-error'

export function getLocalizedStatus(status: AppFileStatus): string {
  switch (status.kind) {
    case AppFileStatusKind.New:
    case AppFileStatusKind.Untracked:
      return t('fileStatus.new')
    case AppFileStatusKind.Modified:
      return t('fileStatus.modified')
    case AppFileStatusKind.Deleted:
      return t('fileStatus.deleted')
    case AppFileStatusKind.Renamed:
      return t('fileStatus.renamed')
    case AppFileStatusKind.Conflicted:
      if (isConflictWithMarkers(status)) {
        return status.conflictMarkerCount > 0
          ? t('fileStatus.conflicted')
          : t('fileStatus.resolved')
      }

      return t('fileStatus.conflicted')
    case AppFileStatusKind.Copied:
      return t('fileStatus.copied')
    default:
      return assertNever(status, `Unknown file status ${status}`)
  }
}
