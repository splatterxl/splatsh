import { spawn } from "child_process";
import { readdirSync } from "fs";
import { Handler, InbuiltCommand } from "./classes";
import { ExitCodes } from "./constants";
import { CommandResult } from "./types";
import { findInPath } from "./util";

export class CommandHandler implements Handler {
  public static inbuiltCommands: Record<string, new () => InbuiltCommand> = {};

  public static async prepare() {
    for (let file of readdirSync(`${__dirname}/commands`)) {
      const data = await import(`${__dirname}/commands/${file}`);
      file = file.replace(/\.js$/, "");
      this.inbuiltCommands[file] = data.default;
    }
  }

  public static async invoke(args: string[], variables: Record<string, string>): Promise<CommandResult> {
    let commandName = args.shift();
    if (commandName in CommandHandler.inbuiltCommands)
      return new CommandHandler.inbuiltCommands[commandName]().prepare(this, args, variables).invoke();
    try {
      const input = commandName;
      commandName = await findInPath(commandName);
      if (!commandName) return { out: `${input}: command not found\n`, code: ExitCodes.COMMAND_NOT_FOUND };
    } catch (err) {
      if (typeof err !== "string") return { out: `An unknown error occurred`, code: ExitCodes.UNKNOWN_ERROR };
      return { out: err, code: ExitCodes.ERROR };
    }
    return new Promise(r => {
      const child = spawn(
        `${Object.entries(variables)
          .map(([key, value]) => `${key}="${value}"`)
          .join(" ")} ${commandName} ${args.map(arg => `"${arg}"`).join(" ")}`,
        { shell: true }
      );
      const isRaw = process.stdin.isRaw;
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
        r({ out: "", code: code || signal });
      });
    });
  }
}
