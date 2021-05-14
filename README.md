# Splatsh
[![Tests](https://github.com/nearlySplat/splatsh/actions/workflows/test.yml/badge.svg?branch=development)](https://github.com/nearlySplat/splatsh/actions/workflows/test.yml) [![Dependencies](https://david-dm.org/nearlysplat/splatsh.svg)](https://github.com/nearlysplat/splatsh/blob/development/package.json)

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

In the future, you will be able to install splatsh via npm or from the AUR, but as of now, the current workaround is to install the source for splatsh and build directly with [`make`](https://en.m.wikipedia.org/wiki/Make_(software)).

There is, however an easy shell command you can use. It is as follows:
```sh
$ curl -o- https://raw.githubusercontent.com/nearlySplat/splatsh/development/scripts/install.sh | bash
# or if you want to download the script
$ wget https://raw.githubusercontent.com/nearlysplat/splatsh/development/scripts/install.sh
```

No, Windows users. We will never support Windows. Just use PowerShell.

You'll need [Node.js](https://nodejs.org), a [v8](https://v8.dev)-based JavaScript engine

## Seems cool, how 2 contribute?
I applaud you for having the courage to even want to touch the code we wrote. Simply open a pull request with the feature you want to add, and we'll do our best to review it and *hopefully* even merge it!
