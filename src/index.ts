import chalk from "chalk";
import { ExitCodes } from "./constants";
import { CommandHandler } from "./handleCommand";
import { sessionVariables } from "./sessionVariables";
import { parseArgs, printf, printfErr, prompt } from "./util";
import resolveBeforeContinuing from "./handleProcessArgs";

let occupied = true;
export function useOccupiedState(): [boolean, (val: boolean) => boolean] {
  function setOccupied(val: boolean) {
    return (occupied = val ?? !occupied);
  }
  return [occupied, setOccupied];
}

void resolveBeforeContinuing.then(() => {
  void CommandHandler.prepare().then(() => {
    printf(chalk`Welcome to {greenBright Splatsh}, the {green Node.js}-based terminal client for everyone!\n`);
    promptShell("~");
    occupied = false;
  });
});

let typing = "";

function promptShell(loc?: string, code?: number | NodeJS.Signals) {
  prompt(process.stdout.write.bind(process.stdout), `${loc ? "~" : loc}${code ? chalk` {red [${code}]}` : ""}` || "~ ");
}

async function handleTypedData() {
  if (occupied) return;
  else occupied = true;
  let args;
  try {
    args = parseArgs(typing);
  } catch (err) {
    printf(`${err}\n`);
    return promptShell("~", ExitCodes.ERROR);
  }

  typing = "";

  const commandVariables = {} as Record<string, string>;

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
  printf(result.err || "");
  occupied = false;
  promptShell("~", result.code);
}
process.stdin.on("data", data => {
  if (data.toString() === "\n") return promptShell("~", 0);
  typing = data.toString().slice(0, -1) || "";
  void handleTypedData();
});

process.on("SIGINT", () => {
  comment: {
    break comment;
  }
});
