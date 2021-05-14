#!/bin/sh

installto() {
  dir="$1"
  if [ -d $dir/src ]; then
    echo -n ""
  else
    mkdir $dir/src
  fi
  if [ "$(ls -a $dir/src)" = ". .." ] && ! [ "$1" = "override" ]; then
    echo Directory not empty, aborting.
    return 1
  fi
  cd $PREFIX/tmp
  echo $ git clone https://github.com/nearlysplat/splatsh.git
  echo ""
  git clone https://github.com/nearlysplat/splatsh.git
  mv $PREFIX/tmp/splatsh/* $dir/src -f
  rm $PREFIX/tmp/splatsh -rf
  cd $dir/src
  echo ""
  echo $ npm install
  echo ""
  npm install
  echo ""
  echo $ sudo make install
  echo ""
  sudo make install 
  echo ""
  echo $ rm -rf node_modules
  echo ""
  rm -rf node_modules
  if ! [ $? = 0 ]; then
    return $?
  fi

}
uninstall() {
  dir=$1
  echo $ rm -rf $dir/src
  echo ""
  rm -rf $dir/src
  echo $ sudo make uninstall
  echo ""
  sudo make uninstall
}
if [ -z "$1" ] || [ "$1" = "install" ] || [ "$1" = "override" ]; then
  if [ -z "$2" ]; then
    installdir="$HOME/.splatsh"
  else
    installdir=$2
  fi
  installto $installdir
  exit $?
elif [ "$1" = "uninstall" ]; then
  if [ -z "$2" ]; then
    installdir="$HOME/.splatsh"
  else
    installdir=$2
  fi
  uninstall $installdir
  exit $?
elif [ "$1" = "help" ]; then
  echo Splatsh Installer
  echo ""
  echo "Usage: $0 [COMMAND] 
       $0 install [dir]"
  echo where command is one of: \
    help, install, uninstall, override
fi
