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

import { resolveVariable } from "../util/session";

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