import { ExitCodes } from "./constants";

export type PotentialPromise<T> = Promise<T> | T;

export interface CommandResult {
  out: string;
  code: NodeJS.Signals | ExitCodes;
  err?: string;
}
