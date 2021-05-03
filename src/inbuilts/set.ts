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

import { InbuiltCommand } from "../classes";
import { LongShellOptions, shellOptions } from "../sessionStore/shellOptions";
import { sessionVariables } from "../sessionStore/variables";
import { ExitCodes } from "../util/constants";

const flags = Object.keys(shellOptions)
  .filter(k => k.length === 1)
  .join("");

const nameRegex = new RegExp(`-o (${Object.keys(LongShellOptions).join("|")})`, "g");

export default class Set extends InbuiltCommand {
  public readonly usage = `set [-${flags}] [-o OPTION_NAME]`;

  public invoke() {
    if (!this.args.length) return this.printVars();

    let argStr = this.args.join(" ");
    const toSet = [] as string[];
    const toUnset = [] as string[];
    let shouldPrintOverview = false;
    let shouldPrintCommands = false;

    try {
      argStr = argStr.replace(/[-+]o \w+/g, match => {
        const name = match.slice(3);
        if (!name || !Object.prototype.hasOwnProperty.call(LongShellOptions, name)) throw `Invalid option -o ${name}\n`;
        // FIXME remove double cast if we ever find a better way to do the LongShellOptions embed (currently strings casted to any as otherwise typescript does not generate two way objects)
        (match[0] === "-" ? toSet : toUnset).push(
          (LongShellOptions[name as keyof typeof LongShellOptions] as unknown) as string
        );
        return "";
      });
      argStr.match(/[-+]\w+/g)?.forEach(match => {
        const shouldSet = match[0] === "-";
        const chars = match.slice(1).split("");
        for (const char of chars) {
          if (char === "o") {
            if (shouldSet) shouldPrintOverview = true;
            else shouldPrintCommands = true;
          } else if (!Object.prototype.hasOwnProperty.call(shellOptions, char)) throw `Invalid option -${char}\n`;
          else (shouldSet ? toSet : toUnset).push(char);
        }
      });
    } catch (err) {
      return { out: err, code: ExitCodes.BUILTIN_MISUSE };
    }

    if (shouldPrintCommands && shouldPrintOverview)
      return { out: `Illegal option +o -o`, code: ExitCodes.BUILTIN_MISUSE };

    for (const flag of toSet) shellOptions[flag as keyof typeof shellOptions] = true;
    for (const flag of toUnset) shellOptions[flag as keyof typeof shellOptions] = false;

    if (shouldPrintCommands) return this.printCommands();
    if (shouldPrintOverview) return this.printOptions();

    return { out: "", code: ExitCodes.SUCCESS };
  }

  public printOptions() {
    const options = Object.entries(shellOptions)
      .map(([k, v]) => `${LongShellOptions[k as keyof typeof LongShellOptions]}: ${v ? "on" : "off"}`)
      .join("\n");
    return { out: `${options}\n`, code: ExitCodes.SUCCESS };
  }

  public printCommands() {
    const options = Object.entries(shellOptions)
      .map(([k, v]) => `set ${v ? "-" : "+"}o ${LongShellOptions[k as keyof typeof LongShellOptions]}`)
      .join("\n");
    return { out: `${options}\n`, code: ExitCodes.SUCCESS };
  }

  public printVars() {
    const variables = Object.assign({}, process.env, sessionVariables);
    const formatted = Object.entries(variables)
      .map(([key, value]) => `${key}='${value.replace(`'`, `\\'`)}'`)
      .join("\n");
    return {
      out: `${formatted}\n`,
      code: ExitCodes.SUCCESS
    };
  }
}
