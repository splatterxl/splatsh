import chalk from "chalk";
import { Lex } from "jvar";
import { CommandHandler } from "./handleCommand";
import { prompt } from "./util";

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
  const result = await CommandHandler.invoke(typing);
  printf(result.out);
  typing = "";
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

function printf(str: string) {
  process.stdout.write(str);
}
