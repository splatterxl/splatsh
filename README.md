# Splatsh
[![Tests](https://github.com/nearlySplat/splatsh/actions/workflows/test.yml/badge.svg?branch=development)](https://github.com/nearlySplat/splatsh/actions/workflows/test.yml) [![Dependencies](https://david-dm.org/nearlysplat/splatsh.svg)](https://github.com/nearlysplat/splatsh/blob/development/package.json)

The [Node.js](https://nodejs.org)-based command-line shell for everyone!

## Why. Just why. Another shell?
Well, yes but actually no. This isn't meant to _replace_ any of your normal shells, like bash, zsh or fish. This is just a fun experiment. If you want to use it, then do, but beware of the risks.

These 'risks' include:
- no stdin pipe
- no `-c` flags
- being asked to contribute

## __**This is _NOT_ finished.**_
This is absolutely not fit for any normal day-to-day use. Check this spot in a few hundred years to see if it's ready yet.

## Cool, what do I need to install it?
### Building from Source
Well, first of all, you need [Node.js](https://nodejs.org), a [v8](https://v8.dev)-based JavaScript engine. Then, of course, you need [TypeScript](https://typescriptlang.org) to compile the project.

When you have all those, just 
```sh
$ sudo make install
```
and splatsh should be installed into your `PATH`.

### Binaries
You're out of luck. Check the Releases tab every year or so until you see `v1.0.0`. (Don't worry, we're working on it)

## Seems cool, how 2 contribute?
Simply open a pull request with the feature you want to add. Be careful though, things in [Issue #3](https://github.com/nearlysplat/splatsh/issues/3) _are **not** to be touched._
