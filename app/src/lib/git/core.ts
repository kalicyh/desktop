import {
  exec,
  GitError as DugiteError,
  parseError,
  IGitResult as DugiteResult,
  IGitExecutionOptions as DugiteExecutionOptions,
  parseBadConfigValueErrorInfo,
  ExecError,
} from 'dugite'

import { assertNever } from '../fatal-error'
import * as GitPerf from '../../ui/lib/git-perf'
import * as Path from 'path'
import { isErrnoException } from '../errno-exception'
import { withTrampolineEnv } from '../trampoline/trampoline-environment'
import { kStringMaxLength } from 'buffer'
import { withHooksEnv } from '../hooks/with-hooks-env'
import { coerceToString } from './coerce-to-string'
import { pushTerminalChunk } from './push-terminal-chunk'
import { t } from '../i18n'

export const isMaxBufferExceededError = (
  error: unknown
): error is ExecError & { code: 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER' } => {
  return (
    error instanceof ExecError &&
    error.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER'
  )
}

export type TerminalOutput = string | Buffer | Buffer[]

export type TerminalOutputListener = (cb: (chunk: TerminalOutput) => void) => {
  unsubscribe: () => void
}

export type TerminalOutputCallback = (subscribe: TerminalOutputListener) => void

export type HookProgress = {
  readonly hookName: string
} & (
  | {
      readonly status: 'started'
      readonly abort: () => void
    }
  | {
      readonly status: 'finished' | 'failed'
    }
)

export type HookCallbackOptions = {
  readonly onHookProgress?: (progress: HookProgress) => void
  readonly onHookFailure?: (
    hookName: string,
    terminalOutput: TerminalOutput
  ) => Promise<'abort' | 'ignore'>
  readonly onTerminalOutputAvailable?: TerminalOutputCallback
}

/**
 * An extension of the execution options in dugite that
 * allows us to piggy-back our own configuration options in the
 * same object.
 */
export interface IGitExecutionOptions
  extends HookCallbackOptions,
    DugiteExecutionOptions {
  /**
   * The exit codes which indicate success to the
   * caller. Unexpected exit codes will be logged and an
   * error thrown. Defaults to 0 if undefined.
   */
  readonly successExitCodes?: ReadonlySet<number>

  /**
   * The git errors which are expected by the caller. Unexpected errors will
   * be logged and an error thrown.
   */
  readonly expectedErrors?: ReadonlySet<DugiteError>

  /** Should it track & report LFS progress? */
  readonly trackLFSProgress?: boolean

  /**
   * Whether the command about to run is part of a background task or not.
   * This affects error handling and UI such as credential prompts.
   */
  readonly isBackgroundTask?: boolean

  readonly interceptHooks?: string[]
}

/**
 * The result of using `git`. This wraps dugite's results to provide
 * the parsed error if one occurs.
 */
export interface IGitResult extends DugiteResult {
  /**
   * The parsed git error. This will be null when the exit code is included in
   * the `successExitCodes`, or when dugite was unable to parse the
   * error.
   */
  readonly gitError: DugiteError | null

  /** The human-readable error description, based on `gitError`. */
  readonly gitErrorDescription: string | null

  /**
   * The path that the Git command was executed from, i.e. the
   * process working directory (not to be confused with the Git
   * working directory which is... super confusing, I know)
   */
  readonly path: string
}

/** The result of shelling out to git using a string encoding (default) */
export interface IGitStringResult extends IGitResult {
  /** The standard output from git. */
  readonly stdout: string

  /** The standard error output from git. */
  readonly stderr: string
}

export interface IGitStringExecutionOptions extends IGitExecutionOptions {
  readonly encoding?: BufferEncoding
}

export interface IGitBufferExecutionOptions extends IGitExecutionOptions {
  readonly encoding: 'buffer'
}

/** The result of shelling out to git using a buffer encoding */
export interface IGitBufferResult extends IGitResult {
  /** The standard output from git. */
  readonly stdout: Buffer

  /** The standard error output from git. */
  readonly stderr: Buffer
}

export class GitError extends Error {
  /** The result from the failed command. */
  public readonly result: IGitResult

  /** The args for the failed command. */
  public readonly args: ReadonlyArray<string>

  /**
   * Whether or not the error message is just the raw output of the git command.
   */
  public readonly isRawMessage: boolean

  public constructor(
    result: IGitResult,
    args: ReadonlyArray<string>,
    terminalOutput: string
  ) {
    let rawMessage = true
    let message

    if (result.gitErrorDescription) {
      message = result.gitErrorDescription
      rawMessage = false
    } else if (terminalOutput.length > 0) {
      message = terminalOutput
    } else if (result.stderr.length) {
      message = coerceToString(result.stderr)
    } else if (result.stdout.length) {
      message = coerceToString(result.stdout)
    } else {
      message = `Unknown error (exit code ${result.exitCode})`
      rawMessage = false
    }

    super(message)

    this.name = 'GitError'
    this.result = result
    this.args = args
    this.isRawMessage = rawMessage
  }
}

export const isGitError = (
  e: unknown,
  parsedError?: DugiteError
): e is GitError => {
  return (
    e instanceof GitError &&
    (parsedError === undefined || e.result.gitError === parsedError)
  )
}

/**
 * Shell out to git with the given arguments, at the given path.
 *
 * @param args             The arguments to pass to `git`.
 *
 * @param path             The working directory path for the execution of the
 *                         command.
 *
 * @param name             The name for the command based on its caller's
 *                         context. This will be used for performance
 *                         measurements and debugging.
 *
 * @param options          Configuration options for the execution of git,
 *                         see IGitExecutionOptions for more information.
 *
 * Returns the result. If the command exits with a code not in
 * `successExitCodes` or an error not in `expectedErrors`, a `GitError` will be
 * thrown.
 */
export async function git(
  args: string[],
  path: string,
  name: string,
  options?: IGitStringExecutionOptions
): Promise<IGitStringResult>
export async function git(
  args: string[],
  path: string,
  name: string,
  options?: IGitBufferExecutionOptions
): Promise<IGitBufferResult>
export async function git(
  args: string[],
  path: string,
  name: string,
  options?: IGitExecutionOptions
): Promise<IGitResult> {
  const defaultOptions: IGitExecutionOptions = {
    successExitCodes: new Set([0]),
    expectedErrors: new Set(),
    maxBuffer: options?.encoding === 'buffer' ? Infinity : kStringMaxLength,
  }

  const opts = { ...defaultOptions, ...options }

  // The combined contents of stdout and stderr with some light processing
  // applied to remove redundant lines caused by Git's use of `\r` to "erase"
  // the current line while writing progress output. See createTerminalOutput.
  //
  // Note: The output is capped at a maximum of 256kb and the sole intent of
  // this property is to provide "terminal-like" output to the user when a Git
  // command fails.
  const terminalChunks: string[] = []
  const terminalCapacity = 256 * 1024

  // Keep at most 256kb of combined stderr and stdout output. This is used
  // to provide more context in error messages.
  opts.processCallback = process => {
    options?.onTerminalOutputAvailable?.(function (cb) {
      terminalChunks.forEach(chunk => cb(chunk))

      process.stdout?.on('data', cb)
      process.stderr?.on('data', cb)

      return {
        unsubscribe: () => {
          process.stdout?.off('data', cb)
          process.stderr?.off('data', cb)
        },
      }
    })

    const push = (chunk: Buffer | string) => {
      pushTerminalChunk(terminalChunks, terminalCapacity, chunk)
    }

    process.stdout?.on('data', push)
    process.stderr?.on('data', push)

    options?.processCallback?.(process)
  }

  return withHooksEnv(
    hooksEnv =>
      withTrampolineEnv(
        async env => {
          const commandName = `${name}: git ${args.join(' ')}`

          const result = await GitPerf.measure(commandName, () =>
            exec(args, path, {
              ...opts,
              env: {
                // Explicitly set TERM to 'dumb' so that if Desktop was launched
                // from a terminal or if the system environment variables
                // have TERM set Git won't consider us as a smart terminal.
                // See https://github.com/git/git/blob/a7312d1a2/editor.c#L11-L15
                TERM: 'dumb',
                ...opts.env,
                ...hooksEnv,
                ...env,
              },
            })
          ).catch(err => {
            // If this is an exception thrown by Node.js (as opposed to
            // dugite) let's keep the salient details but include the name of
            // the operation.
            if (isErrnoException(err)) {
              throw new Error(`Failed to execute ${name}: ${err.code}`)
            }

            if (isMaxBufferExceededError(err)) {
              throw new ExecError(
                `${err.message} for ${name}`,
                err.stdout,
                err.stderr,
                // Dugite stores the original Node error in the cause property, by
                // passing that along we ensure that all we're doing here is
                // changing the error message (and capping the stack but that's
                // okay since we know exactly where this error is coming from).
                // The null coalescing here is a safety net in case dugite's
                // behavior changes from underneath us.
                err.cause ?? err
              )
            }

            throw err
          })

          const exitCode = result.exitCode

          let gitError: DugiteError | null = null
          const acceptableExitCode = opts.successExitCodes
            ? opts.successExitCodes.has(exitCode)
            : false
          if (!acceptableExitCode) {
            gitError = parseError(coerceToString(result.stderr))
            if (gitError === null) {
              gitError = parseError(coerceToString(result.stdout))
            }
          }

          const gitErrorDescription =
            gitError !== null
              ? getDescriptionForError(gitError, coerceToString(result.stderr))
              : null
          const gitResult = {
            ...result,
            gitError,
            gitErrorDescription,
            path,
          }

          let acceptableError = true
          if (gitError !== null && opts.expectedErrors) {
            acceptableError = opts.expectedErrors.has(gitError)
          }

          if ((gitError !== null && acceptableError) || acceptableExitCode) {
            return gitResult
          }

          // The caller should either handle this error, or expect that exit code.
          const errorMessage = new Array<string>()
          errorMessage.push(
            `\`git ${args.join(
              ' '
            )}\` exited with an unexpected code: ${exitCode}.`
          )

          const terminalOutput = terminalChunks.join('')

          if (terminalOutput.length > 0) {
            // Leave even less of the combined output in the log
            errorMessage.push(terminalOutput.slice(-1024))
          }

          if (gitError !== null) {
            errorMessage.push(
              `(The error was parsed as ${gitError}: ${gitErrorDescription})`
            )
          }

          log.error(errorMessage.join('\n'))

          throw new GitError(gitResult, args, terminalOutput)
        },
        path,
        options?.isBackgroundTask ?? false,
        hooksEnv
      ),
    path,
    options
  )
}

/**
 * Determine whether the provided `error` is an authentication failure
 * as per our definition. Note that this is not an exhaustive list of
 * authentication failures, only a collection of errors that we treat
 * equally in terms of error message and presentation to the user.
 */
export function isAuthFailureError(
  error: DugiteError
): error is
  | DugiteError.SSHAuthenticationFailed
  | DugiteError.SSHPermissionDenied
  | DugiteError.HTTPSAuthenticationFailed {
  switch (error) {
    case DugiteError.SSHAuthenticationFailed:
    case DugiteError.SSHPermissionDenied:
    case DugiteError.HTTPSAuthenticationFailed:
      return true
  }
  return false
}

/**
 * Determine whether the provided `error` is an error from Git indicating
 * that a configuration file  write failed due to a lock file already
 * existing for that config file.
 */
export function isConfigFileLockError(error: Error): error is GitError {
  return (
    error instanceof GitError &&
    error.result.gitError === DugiteError.ConfigLockFileAlreadyExists
  )
}

const lockFilePathRe = /^error: could not lock config file (.+?): File exists$/m

/**
 * If the `result` is associated with an config lock file error (as determined
 * by `isConfigFileLockError`) this method will attempt to extract an absolute
 * path (i.e. rooted) to the configuration lock file in question from the Git
 * output.
 */
export function parseConfigLockFilePathFromError(result: IGitResult) {
  const match = lockFilePathRe.exec(coerceToString(result.stderr))

  if (match === null) {
    return null
  }

  // Git on Windows may print the config file path using forward slashes.
  // Luckily for us forward slashes are not allowed in Windows file or
  // directory names so we can simply replace any instance of forward
  // slashes with backslashes.
  const normalized = __WIN32__ ? match[1].replace('/', '\\') : match[1]

  // https://github.com/git/git/blob/232378479/lockfile.h#L117-L119
  return Path.resolve(result.path, `${normalized}.lock`)
}

export function getDescriptionForError(
  error: DugiteError,
  stderr: string
): string | null {
  if (isAuthFailureError(error)) {
    const menuHint = __DARWIN__
      ? t('git.error.auth.menuHint.mac')
      : t('git.error.auth.menuHint.windows')
    return t('git.error.authenticationFailed', { menuHint })
  }

  switch (error) {
    case DugiteError.BadConfigValue:
      const errorInfo = parseBadConfigValueErrorInfo(stderr)
      if (errorInfo === null) {
        return t('git.error.badConfigValue')
      }

      return t('git.error.badConfigValueWithDetails', {
        value: errorInfo.value,
        key: errorInfo.key,
      })
    case DugiteError.SSHKeyAuditUnverified:
      return t('git.error.sshKeyUnverified')
    case DugiteError.RemoteDisconnection:
      return t('git.error.remoteDisconnected')
    case DugiteError.HostDown:
      return t('git.error.hostDown')
    case DugiteError.RebaseConflicts:
      return t('git.error.rebaseConflicts')
    case DugiteError.MergeConflicts:
      return t('git.error.mergeConflicts')
    case DugiteError.HTTPSRepositoryNotFound:
    case DugiteError.SSHRepositoryNotFound:
      return t('git.error.repositoryNotFound')
    case DugiteError.PushNotFastForward:
      return t('git.error.pushNotFastForward')
    case DugiteError.BranchDeletionFailed:
      return t('git.error.branchDeletionFailed')
    case DugiteError.DefaultBranchDeletionFailed:
      return t('git.error.defaultBranchDeletionFailed')
    case DugiteError.RevertConflicts:
      return t('git.error.revertConflicts')
    case DugiteError.EmptyRebasePatch:
      return t('git.error.emptyRebasePatch')
    case DugiteError.NoMatchingRemoteBranch:
      return t('git.error.noMatchingRemoteBranch')
    case DugiteError.NothingToCommit:
      return t('git.error.nothingToCommit')
    case DugiteError.NoSubmoduleMapping:
      return t('git.error.noSubmoduleMapping')
    case DugiteError.SubmoduleRepositoryDoesNotExist:
      return t('git.error.submoduleRepositoryDoesNotExist')
    case DugiteError.InvalidSubmoduleSHA:
      return t('git.error.invalidSubmoduleSHA')
    case DugiteError.LocalPermissionDenied:
      return t('git.error.localPermissionDenied')
    case DugiteError.InvalidMerge:
      return t('git.error.invalidMerge')
    case DugiteError.InvalidRebase:
      return t('git.error.invalidRebase')
    case DugiteError.NonFastForwardMergeIntoEmptyHead:
      return t('git.error.nonFastForwardMergeIntoEmptyHead')
    case DugiteError.PatchDoesNotApply:
      return t('git.error.patchDoesNotApply')
    case DugiteError.BranchAlreadyExists:
      return t('git.error.branchAlreadyExists')
    case DugiteError.BadRevision:
      return t('git.error.badRevision')
    case DugiteError.NotAGitRepository:
      return t('git.error.notAGitRepository')
    case DugiteError.ProtectedBranchForcePush:
      return t('git.error.protectedBranchForcePush')
    case DugiteError.ProtectedBranchRequiresReview:
      return t('git.error.protectedBranchRequiresReview')
    case DugiteError.PushWithFileSizeExceedingLimit:
      return t('git.error.pushWithFileSizeExceedingLimit')
    case DugiteError.HexBranchNameRejected:
      return t('git.error.hexBranchNameRejected')
    case DugiteError.ForcePushRejected:
      return t('git.error.forcePushRejected')
    case DugiteError.InvalidRefLength:
      return t('git.error.invalidRefLength')
    case DugiteError.CannotMergeUnrelatedHistories:
      return t('git.error.cannotMergeUnrelatedHistories')
    case DugiteError.PushWithPrivateEmail:
      return t('git.error.pushWithPrivateEmail')
    case DugiteError.LFSAttributeDoesNotMatch:
      return t('git.error.lfsAttributeDoesNotMatch')
    case DugiteError.ProtectedBranchDeleteRejected:
      return t('git.error.protectedBranchDeleteRejected')
    case DugiteError.ProtectedBranchRequiredStatus:
      return t('git.error.protectedBranchRequiredStatus')
    case DugiteError.BranchRenameFailed:
      return t('git.error.branchRenameFailed')
    case DugiteError.PathDoesNotExist:
      return t('git.error.pathDoesNotExist')
    case DugiteError.InvalidObjectName:
      return t('git.error.invalidObjectName')
    case DugiteError.OutsideRepository:
      return t('git.error.outsideRepository')
    case DugiteError.LockFileAlreadyExists:
      return t('git.error.lockFileAlreadyExists')
    case DugiteError.NoMergeToAbort:
      return t('git.error.noMergeToAbort')
    case DugiteError.NoExistingRemoteBranch:
      return t('git.error.noExistingRemoteBranch')
    case DugiteError.LocalChangesOverwritten:
      return t('git.error.localChangesOverwritten')
    case DugiteError.UnresolvedConflicts:
      return t('git.error.unresolvedConflicts')
    case DugiteError.ConfigLockFileAlreadyExists:
      // Added in dugite 1.88.0 (https://github.com/desktop/dugite/pull/386)
      // in support of https://github.com/desktop/desktop/issues/8675 but we're
      // not using it yet. Returning a null message here means the stderr will
      // be used as the error message (or stdout if stderr is empty), i.e. the
      // same behavior as before the ConfigLockFileAlreadyExists was added
      return null
    case DugiteError.RemoteAlreadyExists:
      return null
    case DugiteError.TagAlreadyExists:
      return t('git.error.tagAlreadyExists')
    case DugiteError.MergeWithLocalChanges:
    case DugiteError.RebaseWithLocalChanges:
    case DugiteError.GPGFailedToSignData:
    case DugiteError.ConflictModifyDeletedInBranch:
    case DugiteError.MergeCommitNoMainlineOption:
    case DugiteError.UnsafeDirectory:
    case DugiteError.PathExistsButNotInRef:
    case DugiteError.PushWithSecretDetected:
      return null
    default:
      return assertNever(error, `Unknown error: ${error}`)
  }
}

/**
 * Returns the arguments to use on any git operation that can end up
 * triggering a rebase.
 */
export function gitRebaseArguments() {
  return [
    // Explicitly set the rebase backend to merge.
    // We need to force this option to be sure that Desktop
    // uses the merge backend even if the user has the apply backend
    // configured, since this is the only one supported.
    // This can go away once git deprecates the apply backend.
    ...['-c', 'rebase.backend=merge'],
  ]
}

/**
 * Returns the SHA of the passed in IGitResult
 */
export function parseCommitSHA(result: IGitStringResult): string {
  return result.stdout.split(']')[0].split(' ')[1]
}
