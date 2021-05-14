#!/bin/sh
shopt -s globstar
set -e

mode="$1"

installto() {
  dir="$1"
  if ! [ -d "$dir" ]; then 
    mkdir $dir
  fi
  if [ -d "$dir"/src ]; then
    echo -n ""
  else
    mkdir "$dir"/src
  fi
  cd "$dir/src"
  if (([ "$(find .)" = "." ]) && ([ "$mode" != override ])); then
    echo Directory not empty, aborting.
    return 1
  fi
  cd "$dir"
  if [ "$mode" = override ] && [ -d src ]; then
    rm -rf src
  fi
  set -x
  git clone https://github.com/nearlysplat/splatsh.git "$dir/src"
  cd "$dir"/src
  npm install
  sudo make install 
  rm -rf node_modules

}
uninstall() {
  dir="$1"
set -x
  rm -rf "$dir"/src
  sudo make uninstall
}
if [ -z "$1" ] || [ "$1" = "install" ] || [ "$1" = "override" ]; then
  if [ -z "$2" ]; then
    installdir="$HOME/.splatsh"
  else
    installdir="$2"
  fi
  installto "$installdir"
elif [ "$1" = "uninstall" ]; then
  if [ -z "$2" ]; then
    installdir="$HOME/.splatsh"
  else
    installdir=$2
  fi
  uninstall "$installdir"
elif [ "$1" = "help" ]; then
  echo Splatsh Installer
  echo ""
  echo "Usage: $0 [COMMAND] 
       $0 install [dir]"
  echo where command is one of: \
    help, install, uninstall, override
fi
