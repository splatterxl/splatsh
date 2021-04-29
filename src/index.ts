import chalk from "chalk";
import { ExitCodes } from "./constants";
import { CommandHandler } from "./handleCommand";
import { sessionVariables } from "./sessionVariables";
import { parseArgs, printf, printfErr, prompt } from "./util";

CommandHandler.prepare().then(() => {
  printf(chalk`Welcome to {greenBright Splatsh}, the {green Node.js}-based terminal client for everyone!\n`);
  promptShell("~");
});
let typing = "";

function promptShell(loc?: string, code?: number | NodeJS.Signals) {
  prompt(process.stdout.write.bind(process.stdout), `${loc ? "~" : loc}${code ? chalk` {red [${code}]}` : ""}` || "~ ");
}

async function handleTypedData() {
  let args;
  try {
    args = parseArgs(typing);
  } catch (err) {
    printf(err + "\n");
    return promptShell("~", ExitCodes.ERROR);
  }

  typing = "";

  let commandVariables = {} as Record<string, string>;

  while (args.length && /\w+=[^\s]+/.test(args[0])) {
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

process.stdin.on("data", data => {
  if (data.toString() === "\n") return promptShell("~", 0);
  typing = data.toString().slice(0, -1) || "";
  handleTypedData();
});

process.on("SIGSEGV", () => {
  printf("Segmentation fault. Killing process.\n");
  process.exit(7);
});

process.on("SIGINT", () => {
  printfErr("\n");
  promptShell("~", ExitCodes.CTLR_C);
});
