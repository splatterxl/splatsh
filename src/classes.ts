import { Lex } from "jvar";
import { CommandHandler } from "./handleCommand";
import { CommandResult, PotentialPromise } from "./types";
import { resolveVariable } from "./util";

export class Handler {
  static invoke(..._: any[]) {
    throw new Error("not implemented");
  }
}

export abstract class InbuiltCommand<T extends object = Record<string, Function>> {
  constructor() {}
  flags: T;
  variables: Record<string, string>;
  flagAliases: Record<string, keyof T>;
  usage?: string;
  args: string[];
  context: typeof CommandHandler;
  parsedFlags: Record<string, any>;
  getVariable(key: string) {
    return Object.prototype.hasOwnProperty.call(this.variables, key) ? this.variables[key] : resolveVariable(key);
  }
  prepare(handler = CommandHandler, args: string[], variables: Record<string, string>) {
    const lexer = new Lex(this.flags, this.flagAliases);
    const result = lexer.lex(args.join(" "));
    this.args = result.args;
    this.parsedFlags = result.flags;
    this.context = handler;
    this.variables = variables;
    return this;
  }
  abstract invoke(): PotentialPromise<CommandResult>;
}
