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

// https://tldp.org/LDP/abs/html/exitcodes.html
export enum ExitCodes {
  SUCCESS = 0,
  /* Catchall for general errors */
  ERROR = 1,
  /* Misuse of shell builtins  */
  BUILTIN_MISUSE = 2,
  /* Command invoked cannot execute */
  CANNOT_EXECUTE = 126,
  /* "command not found" */
  COMMAND_NOT_FOUND = 127,
  /* Invalid argument to exit */
  INVALID_EXIT_ARG = 128,
  /* Script terminated by Control-C */
  CTLR_C = 130,

  /* Own codes idk might wanna change some later */
  UNKNOWN_ERROR = 200
}
