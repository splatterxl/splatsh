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

/**
 * @returns [ParsedFlags, InvalidFlagParameter, UnrecognisedFlags, rest]
 */
export function parseFlags<F extends Record<string, FlagSchema>>(
  raw: string,
  schema: F
): [ParsedFlags<F>, Record<string, string | null>, string[], string] {
  const result: Record<string, boolean | string> = {};
  const unrecognisedFlags = [] as string[];
  const invalidFlags: Record<string, string | null> = {};
  let rest = "";

  let resolvingShortFlag = false;
  let resolvingLongFlag = false;
  let resolvingValue = false;
  let insideSingleQuotes = false;
  let insideDoubleQuotes = false;
  let escapeNext = false;
  let currentFlag = "";
  let currentValue = "";

  function putChar(char: string) {
    if (resolvingValue) currentValue += char;
    else if (resolvingLongFlag) currentFlag += char;
    else if (resolvingShortFlag) saveFlag(char);
    else rest += char;
  }

  function saveFlag(char?: string, lastSave = false) {
    let name = char || currentFlag;

    let flag: FlagSchema | null = null;
    if (Object.prototype.hasOwnProperty.call(schema, name)) {
      flag = schema[name];
    } else {
      for (const [key, value] of Object.entries(schema)) {
        if (value.aliases?.includes(name)) {
          name = key;
          flag = value;
        }
      }
    }

    if (!flag) unrecognisedFlags.push(`-${resolvingLongFlag ? "-" : ""}${name}`);
    else if (flag.type === "switch") result[name] = true;
    else if (currentValue) {
      if ((flag.validate && !flag.validate(currentValue)) || flag.choices?.indexOf(currentValue) === -1)
        invalidFlags[name] = currentValue;
      else if (flag.transform) result[name] = flag.transform(currentValue);
      else result[name] = currentValue;
    } else {
      if (!lastSave && !resolvingValue) return void (resolvingValue = true);
      else if (flag.optional) {
        result[name] = true;
      } else invalidFlags[name] = null;
    }

    currentFlag = "";
  }

  loop: for (let i = 0; i < raw.length; i++) {
    const char = raw[i];

    if (escapeNext) {
      escapeNext = false;
      putChar(char);
      continue;
    }

    switch (char) {
      case "-":
        if (resolvingShortFlag) {
          if (raw[i - 1] === "-") {
            resolvingShortFlag = false;
            resolvingLongFlag = true;
          } else {
            putChar("-");
          }
        } else if (resolvingLongFlag) {
          currentFlag += "-";
        } else {
          resolvingShortFlag = true;
        }
        break;
      case " ":
        if (resolvingValue) {
          if (insideDoubleQuotes || insideSingleQuotes) currentValue += " ";
          else {
            saveFlag();
            resolvingValue = false;
            currentValue = "";
          }
        } else if (resolvingLongFlag) {
          if (!currentFlag) {
            resolvingLongFlag = false;
            rest += raw.slice(i);
            break loop;
          }
          saveFlag();
          resolvingLongFlag = false;
        } else if (resolvingShortFlag) {
          resolvingShortFlag = false;
        } else putChar(" ");
        break;
      case `"`:
        insideDoubleQuotes = !insideDoubleQuotes;
        putChar(`"`);
        break;
      case `'`:
        insideSingleQuotes = !insideSingleQuotes;
        putChar(`"`);
        break;
      default:
        putChar(char);
    }
  }

  if (resolvingLongFlag || resolvingValue) saveFlag(void 0, true);

  return [result as ParsedFlags<F>, invalidFlags, unrecognisedFlags, rest.trim()];
}

function isArgFlag(flag: FlagSchema): flag is FlagSchema & FlagParam {
  return Object.prototype.hasOwnProperty.call(flag, "argument");
}

type FlagParam = {
  type: "parameter";
  /* this can be a standalone flag without parameter too, eg -o in set */
  optional?: boolean;
  choices?: readonly string[];
  validate?: (arg: string) => boolean;
  transform?: (arg: string) => string;
};

export type FlagSchema = {
  aliases?: readonly string[];
  description?: string;
} & (
  | FlagParam
  | {
      type: "switch";
      defaultValue?: boolean;
    }
);

/* This transforms a const Flag Object conforming Record<string, FlagParam> to a strongly typed Record<FlagKey, FlagValueType> object */
export type ParsedFlags<Flags extends Record<string, FlagSchema>> = {
  -readonly [key in keyof Flags]: Flags[key] extends FlagParam ? ParsedParameter<Flags[key]> : boolean;
};

type ParsedParameter<Param extends FlagParam> = Param["choices"] extends ReadonlyArray<infer T>
  ? PossiblyOptionalParam<Param, T>
  : Param["transform"] extends (param: string) => string
  ? PossiblyOptionalParam<Param, ReturnType<Param["transform"]>>
  : PossiblyOptionalParam<Param>;

type PossiblyOptionalParam<Param extends FlagParam, T = string> = Param["optional"] extends true ? T | true : T;
