import { readdir } from "fs/promises";
import path from "path";

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
