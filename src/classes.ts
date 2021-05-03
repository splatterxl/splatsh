/*
 *  Splatsh, a Node.js-based shell.
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
import { resolveVariable } from "./util/session";
import { CommandResult, PotentialPromise } from "./util/types";

export class Handler {
  public static invoke(..._args: any[]): PotentialPromise<void> {
    throw new Error("Not implemented");
  }
}

/* TODO: what should these types be? */
export abstract class InbuiltCommand {
  public abstract readonly usage: string;
  public variables!: Record<string, string>;
  public args!: string[];
  public context!: typeof CommandHandler;

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
