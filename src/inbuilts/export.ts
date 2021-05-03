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
import { ExitCodes } from "../util/constants";

export default class Export extends InbuiltCommand {
  public readonly usage = "export KEY=VALUE...";

  public async invoke() {
    if (!this.args.length) return this.printVars();

    const [key, value] = this.args[0].split("=");
    if (!key || !value) return { out: "", code: ExitCodes.ERROR };

    process.env[key] = value;
    return { out: "", code: ExitCodes.SUCCESS };
  }

  public printVars() {
    return {
      out: `${Object.entries(process.env)
        .map(([key, value]) => `export ${key}='${value?.replace(`'`, `\\'`)}'`)
        .join("\n")}\n`,
      code: ExitCodes.SUCCESS
    };
  }
}
