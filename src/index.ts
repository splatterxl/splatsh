import chalk from "chalk";
import { Lex } from "jvar";
import { ExitCodes } from './constants';
import { CommandHandler } from "./handleCommand";
import { sessionVariables } from './sessionVariables';
import { CommandResult } from './types';
import { parseArgs, prompt } from './util';

CommandHandler.prepare().then(() => {
  printf(
    chalk`Welcome to {greenBright Splatsh}, the {green Node.js}-based terminal client for everyone!\n`
  );
  promptShell("~");
});
let typing = "";

function promptShell(loc?: string, code?: number | NodeJS.Signals) {
  prompt(
    process.stdout.write.bind(process.stdout),
    `${loc ? "~" : loc}${code ? chalk` {red [${code}]}` : ""}` || "~ "
  );
}

export const shellFlags = new Lex(
  { debug: Boolean, exec: String },
  { c: "exec", d: "debug" }
).lex(process.argv.slice(2).join(" ")) as {
  args: string[];
  flags: Record<string, any>;
};

async function handleTypedData() {
  const args = parseArgs(typing);
  typing = "";

  let commandVariables = {} as Record<string, string>;

  while (args.length && /\w+=\w+/.test(args[0])) {
    const [key, value] = args.shift().split("=");
    commandVariables[key] = value;
  }

  if (!args.length) {
    for (const [key, value] of Object.entries(commandVariables)) {
      sessionVariables.set(key, value);
    }
    return promptShell("~", ExitCodes.SUCCESS);
  }

  const result = await CommandHandler.invoke(args, commandVariables);

  printf(result.out);
  promptShell("~", result.code);
}

process.stdin.on("data", (data) => {
  if (data.toString() === "\n") return promptShell("~", 0);
  typing = data.toString().slice(0, -1) || "";
  handleTypedData();
});

process.on("SIGSEGV", () => {
  process.stdout.write("Segmentation fault. Killing process.");
  process.exit(7);
});

process.on("SIGINT", () => {
  printf("\n");
  promptShell("~", ExitCodes.CTLR_C);
});

function printf(str: string) {
  process.stdout.write(str);
}
