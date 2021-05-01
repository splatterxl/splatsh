import { CommandHandler } from "./handleCommand";
import { CommandResult, PotentialPromise } from "./types";
import { resolveVariable } from "./util";

export class Handler {
  public static invoke(..._args: any[]): PotentialPromise<void> {
    throw new Error("Not implemented");
  }
}

/* TODO: what should these types be? */
export abstract class InbuiltCommand {
  public abstract readonly usage: string;
  public variables: Record<string, string>;
  public args: string[];
  public context: typeof CommandHandler;
  public parsedFlags: Record<string, any>;

  public getVariable(key: string) {
    return Object.prototype.hasOwnProperty.call(this.variables, key) ? this.variables[key] : resolveVariable(key);
  }

  public prepare(handler = CommandHandler, args: string[], variables: Record<string, string>) {
    this.args = args;
    this.context = handler;
    this.variables = variables;
    return this;
  }

  abstract invoke(): PotentialPromise<CommandResult>;
}
