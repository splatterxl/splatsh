import { readdir } from "fs/promises";
import path from "path";
import { sessionVariables } from "./sessionVariables";

export function printf(str: string, ...args: any[]) {
  if (str.includes("%s")) {
    let ind = 0;
    while (str.includes("%s")) {
      str.replace(/%s/, args[ind]);

      ind++;
    }
  }
  console.log(str);
  process.stdout.write(str);
}

export function prompt(hook: Function, context = "") {
  hook(context + "$> ");
}

export async function findInPath(command: string): Promise<string | null> {
  return new Promise(async (resolve, reject) => {
    const { PATH } = process.env;
    if (!PATH) reject("No path specified");

    const paths = PATH.split(":");

    Promise.all(paths.map(prefix => readdir(prefix).then(files => ({ prefix, files }))))
      .then(prefixes => {
        const match = prefixes.find(p => p.files.includes(command));
        resolve(match ? path.join(match.prefix, command) : null);
      })
      .catch(reject);
  });
}

// TODO: handle $()
export function parseArgs(str: string) {
  const args = [] as string[];
  let currentArg = "";
  let currentVariable = "";
  let insideDoubleQuotes = false;
  let insideSingleQuotes = false;
  let resolvingVariable = false;
  let escapingNext = false;

  function pushChar(char: string) {
    if (resolvingVariable) currentVariable += char;
    else currentArg += char;
  }

  function pushArg() {
    if (resolvingVariable) {
      currentArg += resolveVariable(currentVariable) ?? "";
      resolvingVariable = false;
      currentVariable = "";
    }
    args.push(currentArg);
    currentArg = "";
  }

  loop: for (const char of str) {
    if (escapingNext || (insideSingleQuotes && char !== "'")) {
      currentArg += char;
      continue;
    }

    switch (char) {
      case "\\":
        escapingNext = true;
        break;
      case "$":
        if (resolvingVariable) pushChar(char);
        else resolvingVariable = true;
        break;
      case "{":
        if (resolvingVariable) break;
        pushChar(char);
        break;
      case "}":
        if (resolvingVariable) {
          currentArg += resolveVariable(currentVariable);
          resolvingVariable = false;
          currentVariable = "";
        } else pushChar(char);
        break;
      case '"':
        insideDoubleQuotes = !insideDoubleQuotes;
        break;
      case "'":
        insideSingleQuotes = !insideSingleQuotes;
        break;
      case " ":
        if (insideDoubleQuotes || insideSingleQuotes) pushChar(char);
        else if (!resolvingVariable && !currentArg) break;
        else pushArg();
        break;
      case "\n":
        pushArg();
        break loop;
      default:
        pushChar(char);
    }
  }

  if (currentArg || currentVariable) pushArg();
  if (resolvingVariable) args.push("$");
  if (insideDoubleQuotes) throw 'Unmatched "';
  if (insideSingleQuotes) throw "Unmatched '";
  return args;
}

export function resolveVariable(key: string) {
  if (sessionVariables.has(key)) return sessionVariables.get(key);
  if (Object.prototype.hasOwnProperty.call(process.env, key)) return process.env[key];
  return null;
}
