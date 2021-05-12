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

import { format } from "util";
import { sessionVariables } from "../sessionStore/variables";

export function prompt(hook: (prompt: string) => void, context = "") {
  hook(`${context || ""}$> `);
}

export function shortenPath(path: string) {
  return path.replace(new RegExp(process.env.HOME as string), "~").replace(/(\/)(.).*?(\/)/g, "$1$2$3");
}

export function resolveVariable(key: string) {
  if (Object.prototype.hasOwnProperty.call(sessionVariables, key)) return sessionVariables[key];
  if (Object.prototype.hasOwnProperty.call(process.env, key)) return process.env[key];
  return null;
}

/**
 * Prints formatted text to stdout, supports placeholders and automatically stringifies objects
 * @param str Format string
 * @param [args] Format args. If str has no format placeholders these get appended to str separated by newlines
 */
export function printf<T>(str: string, ...args: T[]) {
  process.stdout.write(format(str, ...args));
}

/**
 * Prints formatted text to stderr, supports placeholders and automatically stringifies objects
 * @param str Format string
 * @param args Format args. If str has no format placeholders these get appended to str separated by newlines
 */
export function printfErr<T>(str: string, ...args: T[]) {
  process.stderr.write(format(str, ...args));
}

export function printfln<T>(str: string, ...args: T[]) {
  return printf(`${str}\n`, ...args);
}
