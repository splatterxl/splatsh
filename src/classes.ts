/*
 *  splatsh, a shell written in nodejs
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

import { CommandHandler } from "./handleCommand";
import { CommandResult, PotentialPromise } from "./types";
import { resolveVariable } from "./util";

export class Handler {
  public static invoke(..._args: any[]): PotentialPromise<void> {
    throw new Error("Not implemented");
  }
}

/* TODO: what should these types be? */
export abstract class InbuiltCommand<
  Flags extends Record<string, unknown> = Record<string, (...args: unknown[]) => unknown>
> {
  public abstract readonly usage: string;
  public flags: Flags;
  public variables: Record<string, string>;
  public flagAliases: Record<string, keyof Flags>;
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
