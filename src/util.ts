/*
 *  splatsh, a shell written in nodejs
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

import { readdir } from "fs/promises";
import path from "path";
import { format } from "util";
import { sessionVariables } from "./sessionVariables";

export function prompt(hook: (prompt: string) => void, context = "") {
  hook(`${context || ""}$> `);
}

export async function findInPath(command: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const { PATH } = process.env;
    if (!PATH) reject("No path specified");

    const paths = PATH.split(":");

    Promise.all(paths.map(prefix => readdir(prefix).then(files => ({ prefix, files }))))
      .then(prefixes => {
        const match = prefixes.find(p => p.files.includes(command));
        resolve(match ? path.join(match.prefix, command) : null);
      })
      .catch(err => reject(`Invalid path ${err.path} in PATH variable`));
  });
}

// TODO: handle $()
export function parseArgs(str: string) {
  const args = [] as string[];
  let currentArg = "";
  let currentVariable = "";
  let insideDoubleQuotes = false;
  let insideSingleQuotes = false;
  let resolvingVariable = false;
  let escapingNext = false;

  function pushChar(char: string) {
    if (resolvingVariable) currentVariable += char;
    else currentArg += char;
  }

  function pushArg() {
    if (resolvingVariable) {
      currentArg += resolveVariable(currentVariable) ?? "";
      resolvingVariable = false;
      currentVariable = "";
    }
    args.push(currentArg);
    currentArg = "";
  }

  loop: for (const char of str) {
    if (escapingNext || (insideSingleQuotes && char !== `'`)) {
      currentArg += char;
      continue;
    }

    switch (char) {
      case "\\":
        escapingNext = true;
        break;
      case "$":
        if (resolvingVariable) pushChar(char);
        else resolvingVariable = true;
        break;
      case "{":
        if (resolvingVariable) break;
        pushChar(char);
        break;
      case "}":
        if (resolvingVariable) {
          currentArg += resolveVariable(currentVariable) ?? "";
          resolvingVariable = false;
          currentVariable = "";
        } else pushChar(char);
        break;
      case `"`:
        insideDoubleQuotes = !insideDoubleQuotes;
        break;
      case `'`:
        insideSingleQuotes = !insideSingleQuotes;
        break;
      case " ":
        if (resolvingVariable) {
          currentArg += resolveVariable(currentVariable) ?? "";
          resolvingVariable = false;
          currentVariable = "";
          pushChar(char);
        } else if (insideDoubleQuotes) pushChar(char);
        else if (!resolvingVariable && !currentArg) break;
        else pushArg();
        break;
      case "\n":
        pushArg();
        break loop;
      default:
        pushChar(char);
    }
  }

  if (currentArg || currentVariable) pushArg();
  if (resolvingVariable) args.push("$");
  if (insideDoubleQuotes) throw 'Unmatched "';
  if (insideSingleQuotes) throw "Unmatched '";
  return args;
}

export function resolveVariable(key: string) {
  if (sessionVariables.has(key)) return sessionVariables.get(key);
  if (Object.prototype.hasOwnProperty.call(process.env, key)) return process.env[key];
  return null;
}

/**
 * Prints formatted text to stdout, supports placeholders and automatically stringifies objects
 * @param str Format string
 * @param args Format args. If str has no format placeholders these get appended to str separated by newlines
 */
export function printf(str: string, ...args: unknown[]) {
  process.stdout.write(format(str, ...args));
}

/**
 * Prints formatted text to stderr, supports placeholders and automatically stringifies objects
 * @param str Format string
 * @param args Format args. If str has no format placeholders these get appended to str separated by newlines
 */
export function printfErr(str: string, ...args: unknown[]) {
  process.stderr.write(format(str, ...args));
}
