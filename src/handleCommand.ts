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

import { spawn } from "child_process";
import { readdirSync } from "fs";
import path from "path";
import { Handler, InbuiltCommand } from "./classes";
import { ExitCodes } from "./util/constants";
import { exists, findInPath, isExecutable } from "./util/fs";
import { CommandResult } from "./util/types";

export class CommandHandler implements Handler {
  public static inbuiltCommands: Record<string, new () => InbuiltCommand> = {};

  public static async prepare() {
    for (let file of readdirSync(`${__dirname}/inbuilts`)) {
      const data = await import(`${__dirname}/inbuilts/${file}`);
      file = file.replace(/\.js$/, "");
      this.inbuiltCommands[file] = data.default;
    }
  }

  public static async invoke(args: string[], variables: Record<string, string>): Promise<CommandResult> {
    const input = args.shift();
    if (!input) return { code: ExitCodes.SUCCESS, out: "" };
    let commandName = input;

    if (Object.prototype.hasOwnProperty.call(CommandHandler.inbuiltCommands, commandName))
      return new CommandHandler.inbuiltCommands[commandName]().prepare(this, args, variables).invoke();

    const slashIdx = commandName.indexOf("/");
    if (slashIdx !== -1) {
      if (slashIdx !== 0) commandName = path.join(process.cwd(), commandName);
      if (!(await exists(commandName))) return { code: ExitCodes.COMMAND_NOT_FOUND, out: `No such file: ${input}\n` };
    } else {
      try {
        commandName = (await findInPath(commandName)) as string;
        if (!commandName) return { out: `${input}: command not found\n`, code: ExitCodes.COMMAND_NOT_FOUND };
      } catch (err) {
        if (typeof err !== "string") return { out: `An unknown error occurred\n`, code: ExitCodes.UNKNOWN_ERROR };
        return { out: err, code: ExitCodes.ERROR };
      }
    }

    if (!(await isExecutable(commandName)))
      return { out: `permission denied: ${commandName}\n`, code: ExitCodes.CANNOT_EXECUTE };

    return new Promise(r => {
      const child = spawn(
        `${Object.entries(variables)
          .map(([key, value]) => `${key}="${value}"`)
          .join(" ")} ${commandName} ${args.map(arg => `"${arg}"`).join(" ")}`,
        { shell: true }
      );

      const { isRaw } = process.stdin;
      process.stdin.setRawMode(false);

      function writeToChild(d: Buffer) {
        child.stdin.write(d);
      }
      process.stdin.on("data", writeToChild);
      child.stdout.on("data", d => process.stdout.write(d.toString()));
      child.stderr.on("data", d => process.stderr.write(d.toString()));
      child.on("exit", (code, signal) => {
        process.stdin.off("data", writeToChild);
        process.stdin.setRawMode(isRaw);
        r({ out: "", code: code || signal || 0 });
      });
    });
  }
}
