/*
 *  Splatsh, a Node.js-based shell.
 *  Copyright (C) 2021 nearlySplat and Vendicated
 *
 *  splatsh is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  splatsh is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with splatsh.  If not, see <https://www.gnu.org/licenses/>.
 */

/* These are the shell options that can be set/unset via the set builtin */
/* https://pubs.opengroup.org/onlinepubs/007904875/utilities/set.html */
export const shellOptions = {
  /* KEY=VALUE shall be interpreted as export KEY=VALUE */
  a: false,
  /* Notify user of background task completion: "[%d]%c %s%s\n", <job-number>, <current>, <status>, <job-name> */
  b: false,
  /* > redirect will not override existing files, >| shall override this behaviour */
  C: false,
  /* Exit immediately if a command exits with a non-zero status unless part of while, until, if, and/or list or preceded by ! */
  e: false,
  /* Disable globbing */
  f: false,
  /* Remember location of commands after they were run, do not search PATH again */
  h: false,
  // TODO: translate this to English
  /* This option shall be supported if the implementation supports the User Portability Utilities option.
   * All jobs shall be run in their own process groups. Immediately before the shell issues a prompt after completion of the background job,
   * a message reporting the exit status of the background job shall be written to standard error.
   * If a foreground job stops, the shell shall write a message to standard error to that effect, formatted as described by the jobs utility.
   * In addition, if a job changes status other than exiting (for example, if it stops for input or output or is stopped by a SIGSTOP signal),
   * the shell shall write a similar message immediately prior to writing the next prompt. This option is enabled by default for interactive shells. */
  m: false,
  /* Read commands but do not execute them, can be ignored in interactive shell */
  n: false,
  /* Print to stderr (and exit unless in interactive shell) if expanding non existant variable */
  u: false,
  /* Write stdin to stderr */
  v: false,
  /* Write commands to stderr before executing */
  x: false,
  _NO_HIST: false,
  _VI: false,
  _IGNORE_EOF: false
};

// FIXME remove any casts, currently needed as typescript does not generate the enum two ways with string properties
export enum LongShellOptions {
  allexport = "a" as any,
  errexit = "e" as any,
  monitor = "m" as any,
  noclobber = "C" as any,
  noglob = "f" as any,
  noexec = "n" as any,
  notify = "b" as any,
  nounset = "u" as any,
  rememberlocation = "h" as any,
  verbose = "v" as any,
  xtrace = "x" as any,
  /* Ignore EOF (CTRL + D) */
  ignoreeof = "_IGNORE_EOF" as any,
  /* Do not log to HISTFILE */
  nolog = "_NO_HIST" as any,
  vi = "_VI" as any
}
