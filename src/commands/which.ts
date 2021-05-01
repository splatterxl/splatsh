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

import { InbuiltCommand } from "../classes";
import { ExitCodes } from "../constants";
import { CommandHandler } from "../handleCommand";
import { findInPath } from "../util";

export default class Which extends InbuiltCommand {
  public readonly usage = "which CommandName";

  public async invoke() {
    const [commandName] = this.args;
    if (!commandName) return { out: "", code: ExitCodes.ERROR };

    if (commandName in CommandHandler.inbuiltCommands)
      return { out: `${commandName}: shell builtin\n`, code: ExitCodes.SUCCESS };

    return findInPath(commandName)
      .then(result => {
        if (result) return { out: `${result}\n`, code: ExitCodes.SUCCESS };
        return { out: `${commandName} not found\n`, code: ExitCodes.COMMAND_NOT_FOUND };
      })
      .catch(err => ({ out: `${err}\n`, code: ExitCodes.ERROR }));
  }
}
