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

import { stat } from "fs/promises";
import { InbuiltCommand } from "../classes";
import { sessionState } from "../sessionStore/sessionState";
import { ExitCodes } from "../util/constants";

export default class Cd extends InbuiltCommand {
  public readonly usage = "cd [DIR]";

  public async invoke() {
    const input = this.args[0] || process.env.HOME!;
    const newCwd = input === "-" ? sessionState.lastCwd : input;

    const stats = await stat(newCwd).catch(() => void 0);
    if (!stats) return { err: `No such file or directory: ${input}\n`, code: ExitCodes.BUILTIN_MISUSE };
    if (!stats.isDirectory()) return { err: `Not a directory: ${input}\n`, code: ExitCodes.BUILTIN_MISUSE };
    try {
      sessionState.lastCwd = process.cwd();
      process.chdir(newCwd);
      return { code: ExitCodes.SUCCESS };
    } catch {
      return { out: `Permission denied: ${newCwd}\n`, code: ExitCodes.ERROR };
    }
  }
}
