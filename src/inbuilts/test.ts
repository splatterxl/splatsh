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
import { FlagSchemaObject, ParseFlagsOutput } from "../util/types";

// FIXME temporary test command for the flag parser
export default class Which extends InbuiltCommand<FlagSchemaObject> {
  public readonly usage = "";
  public flagSchema = {
    owo: {
      type: "switch",
      aliases: ["o"]
    },
    uwu: {
      type: "parameter",
      choices: ["xd", "lol"]
    },
    cool: {
      type: "parameter",
      transform: (p: string) => p.toUpperCase()
    },
    number: {
      type: "parameter",
      optional: true,
      validate: (p: string) => !isNaN(parseInt(p))
    },
    and: {
      type: "switch",
      aliases: ["a"]
    }
  } as const;
  public declare flags: ParseFlagsOutput<Which["flagSchema"]>;

  public async invoke() {
    const [parsed, invalid, unrecognised, rest] = this.flags;
    console.log("[SCHEMA]", this.flagSchema);
    console.log("[INPUT]", this.raw);
    console.log("[PARSED]", parsed);
    console.log("[INVALID]", invalid);
    console.log("[UNRECOGNISED]", unrecognised);
    console.log("[REST]", rest);
    return { code: 0, out: "" };
  }
}
