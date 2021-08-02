#!/bin/sh

# Splatsh, a Node.js-based shell.
# Copyright (C) 2021 nearlySplat and Vendicated
#
# splatsh is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# splatsh is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with splatsh.  If not, see <https://www.gnu.org/licenses/>.

set -e

version="0.1.0"

SUDO=''
if [ "$(id -u)" -ne 0 ]; then
    if command -v sudo >/dev/null; then
      SUDO="sudo"
    elif command -v doas >/dev/null; then
      SUDO="doas"
    else
      _die "Neither sudo nor doas were found. Please run this script as root or install one of them"
    fi
fi

_die() {
  >&2 echo "$1"
  exit 1
}

_check_command() {
  command -v "$1" >/dev/null || _die "command $1 not found but needed for this script"
}

_check_command node
_check_command npm
_check_command git

_install() {
  trap 'cd $olddir' EXIT

  PREFIX="${1:-/usr/local}"
  olddir="$(pwd)"
  cd "$(mktemp -d)"

  set -x
  git clone https://github.com/nearlySplat/splatsh
  cd splatsh
  npm install
  tsc -p tsconfig.json

  $SUDO mkdir -p "$PREFIX/share/splatsh/node_modules"
  node -e 'console.log(JSON.stringify({ dependencies: require("./package.json").dependencies }))' | $SUDO tee "$PREFIX/share/splatsh/package.json"
  $SUDO npm i --only=production --prefix "$PREFIX/share/splatsh"
  $SUDO cp -r "build/"* "$PREFIX/share/splatsh"

  $SUDO mkdir -p "$PREFIX/bin"
  $SUDO install -m 0755 bin/splatsh "$PREFIX/bin/splatsh"
}

_uninstall() {
  PREFIX="${1:-/usr/local}"

  set -x
  $SUDO rm -rf "$PREFIX/share/splatsh"
  $SUDO rm -f "$PREFIX/bin/splatsh"
}

_print_help() {
  echo "Splatsh Installer v$version"
  echo "Copyright (C) 2021 nearlySplat and Vendicated"
  echo
  echo "Usage: $0 [help | install | uninstall] [INSTALL_DIR]"
} >&2

_check_dir() {
  [ -z "$1" ] && return 0
  [ -d "$1" ] && return 0
  [ ! -e "$1" ] && return 0
  _die "Not a directory: '$1'"
}

if [ -z "$1" ] || [ "$1" = "install" ]; then
  _check_dir "$2"
  _install "$2"
elif [ "$1" = "uninstall" ]; then
  _check_dir "$2"
  _uninstall "$2"
elif [ "$1" = "help" ]; then
  _print_help
else
  >&2 echo "Unknown command: '$1'"
  >&2 echo
  >&2 echo "To see a list of supported commands, run:"
  >&2 printf "\t%s %s\n" "$0" help
fi
