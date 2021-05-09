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

import chalk from "chalk";
import { CommandHandler } from "./handleCommand";
import resolveBeforeContinuing from "./handleProcessArgs";
import { parseArgs } from "./parsers/parseArgs";
import { sessionVariables } from "./sessionStore/variables";
import { ExitCodes } from "./util/constants";
import { printf, prompt, shortenPath } from "./util/session";

let occupied = true;
let cwd = process.cwd();
let oldCwd = cwd;
export function useCwd() {
  function setCwd(val: string) {
    oldCwd = cwd;
    return (cwd = val);
  }
  return [cwd, setCwd, oldCwd] as const;
}

export function useOccupiedState(): [boolean, (val: boolean) => boolean] {
  function setOccupied(val?: boolean) {
    return (occupied = val ?? !occupied);
  }
  return [occupied, setOccupied];
}

void CommandHandler.prepare()
  .then(() => resolveBeforeContinuing)
  .then(() => {
    printf(chalk`Welcome to {yellowBright Splatsh}, the {green Node.js}-based terminal client for everyone!\n`);
    promptShell(shortenPath(cwd));
    occupied = false;
  });

let typing = "";

function promptShell(loc?: string, code?: number | NodeJS.Signals) {
  prompt(
    process.stdout.write.bind(process.stdout),
    `${loc ? chalk`{greenBright ${loc}}` : "~"}${code ? chalk` {red [${code}]}` : ""}` || "~ "
  );
}
async function handleTypedData() {
  if (occupied) return;
  else occupied = true;
  let args;
  try {
    args = parseArgs(typing);
  } catch (err) {
    printf(`${err}\n`);
    occupied = false;
    return promptShell(shortenPath(cwd), ExitCodes.ERROR);
  }

  typing = "";

  const commandVariables = {} as Record<string, string>;

  while (args.length && /\w+=[^\s]+/.test(args[0])) {
    const [key, value] = args.shift()!.split("=");
    commandVariables[key] = value;
  }

  if (!args.length) {
    for (const [key, value] of Object.entries(commandVariables)) {
      sessionVariables[key] = value;
    }
    occupied = false;
    return promptShell(shortenPath(cwd), ExitCodes.SUCCESS);
  }

  const result = await CommandHandler.invoke(args, commandVariables);
  printf(result.out);
  printf(result.err || "");
  occupied = false;
  promptShell(shortenPath(cwd), result.code);
}

process.stdin.on("data", data => {
  if (data.toString() === "\n") return promptShell(shortenPath(cwd), 0);
  typing = data.toString().slice(0, -1) || "";
  void handleTypedData();
});

process.on("SIGINT", () => {
  comment: {
    break comment;
  }
});
