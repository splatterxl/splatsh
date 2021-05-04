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
import { parseFlags } from "../parsers/parseFlags";

// FIXME temporary test command for the flag parser
export default class Which extends InbuiltCommand {
  public readonly usage = "";

  public async invoke() {
    const schema = {
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
    const sample = '-oa hey --uwu invalid --cool "this should scream" im a rest! --unknown-opt --number';
    const parsed = parseFlags(sample, schema);
    console.log("[SCHEMA]", schema);
    console.log("[INPUT]", sample);
    console.log("[PARSED]", parsed[0]);
    console.log("[INVALID]", parsed[1]);
    console.log("[UNRECOGNISED]", parsed[2]);
    console.log("[REST]", parsed[3]);
    return { code: 0, out: "" };
  }
}
