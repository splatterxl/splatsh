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

import { useCwd } from "..";
import { InbuiltCommand } from "../classes";
import { ExitCodes } from "../util/constants";
import { statSync } from "fs";
import { join } from "path";

export default class Cd extends InbuiltCommand {
  public readonly usage = "cd FOLDER";
  public invoke() {
    let path = this.args.length ? this.args[0] : (process.env.HOME as string);
    const [cwd, setCwd, oldCwd] = useCwd();
    if (path === "-") {
      path = oldCwd;
    } else if (!path.startsWith("/")) {
      path = join(cwd, path);
    }
    let isDir;
    try {
      isDir = statSync(path).isDirectory();
    } catch {
      return { err: `cd: ${path}: no such file or directory\n`, code: ExitCodes.ERROR, out: "" };
    }
    if (!isDir) return { code: ExitCodes.ERROR, err: `cd: ${path}: is not a directory\n`, out: "" };
    setCwd(path);
    return { out: "", code: ExitCodes.SUCCESS };
  }
}
