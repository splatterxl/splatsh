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

import { constants as FS_CONSTANTS } from "fs";
import { access, readdir } from "fs/promises";
import { type } from "os";
import path from "path";

export function exists(filepath: string, mode?: number) {
  return access(filepath, mode)
    .then(() => true)
    .catch(() => false);
}

export function isExecutable(filepath: string) {
  return exists(filepath, FS_CONSTANTS.X_OK);
}

export async function findInPath(command: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const { PATH } = process.env;
    if (!PATH) reject("No path specified");

    const paths = PATH!.split(type() === "nt" ? ";" : ":");

    Promise.all(paths.map(prefix => readdir(prefix).then(files => ({ prefix, files }))))
      .then(prefixes => {
        const match = prefixes.find(p => p.files.includes(command));
        resolve(match ? path.join(match.prefix, command) : null);
      })
      .catch(err => reject(`Invalid path ${err.path} in PATH variable`));
  });
}
