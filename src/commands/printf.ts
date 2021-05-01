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

import { format } from "util";
import { InbuiltCommand } from "../classes";
import { ExitCodes } from "../constants";

export default class Printf extends InbuiltCommand {
  public readonly usage = "printf <FORMAT> [ARGUMENTS...]";

  public invoke() {
    const formatSr = this.args.shift() ?? "";
    return { out: format(formatSr, ...this.args), code: ExitCodes.SUCCESS };
  }
}
