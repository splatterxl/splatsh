# Splatsh
[![Tests](https://github.com/nearlySplat/splatsh/actions/workflows/test.yml/badge.svg?branch=development)](https://github.com/nearlySplat/splatsh/actions/workflows/test.yml) [![Dependencies](https://david-dm.org/nearlysplat/splatsh.svg)](https://github.com/nearlysplat/splatsh/blob/development/package.json)

> Archived, future development is over at Qshell [here](https://github.com/nearlySplat/qsh)

The [Node.js](https://nodejs.org)-based command-line shell for everyone!

## Why. Just why. Another shell?

Well, yes but actually no. This isn't meant to _replace_ any of your normal shells, like bash, zsh or fish. This is just a fun experiment. If you want to use it, then do, but beware of the risks.

These 'risks' include:

- Uncaught TypeError: Cannot read property 'splatsh' of undefined
- Brendan Eich appearing at your Bed at 3 AM telling you to install Brave
- being asked to contribute

## __**This is _NOT_ finished.**__

This is absolutely not fit for any normal day-to-day use. Check this spot in a few hundred years to see if it's ready yet.

## Cool, what do I need to install it?

In the future, you will be able to install splatsh via npm or from the AUR, but as of now, the only option is to clone the source code and install it yourself

### Building from Source

Well, first of all, you'll need [Node.js](https://nodejs.org), a [v8](https://v8.dev)-based JavaScript engine

Then, just run

```sh
# Install build dependencies
$ npm i

# Install to /usr/local/bin
$ sudo make install

# OR Install to ~/.local/bin
$ PREFIX=$HOME/.local make install
```

and splatsh will be installed and ready for use!

## Seems cool, how 2 contribute?

BE CRAZY!!!

Then simply open a pull request with the feature you want to add
