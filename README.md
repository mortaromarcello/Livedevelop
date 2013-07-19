Livedevelop
===========
This is a debian Live for developers with the addition of the repository deb-multimedia and google for the googletalk plugin.
Non-free software has been enabled for the installation of the Adobe flash player and for some media drivers.
The rest is pure 100% debian. The development tools are the most popular IDEs and languages:
Codeblocks, Eclipse, Anjuta, Lazarus, Kdevelop, QtCreator, Geany.
The localization is italian, sorry. The desktop is Gnome.
P.S.: I added the game warzone2100 compiled from the latest release source for the long time between a compilation and the other one!

## Prerequisites for live-build
In order to work with Livedevelop using live-build, you must first meet the following prerequesites:
- I would strongly suggest using a Debian 7.1 (wheezy) amd64 build system.  You may use an i386 system but you will not be able to build amd64 images.
- Install **git** and **live-build** packages installed:  `apt-get install git live-build`

## Cloning the repository
From the directory in which you want to clone the repository, execute the following command:
```
git clone https://github.com/mortaromarcello/Livedevelop.git
```

## Build Instructions
Make sure that you are in the repository directory (e.g. Livedevelop/i386_iso-hybrid) and then execute the following commands:
```
lb clean
lb config
lb build
```
There is also a build.sh script which will execute the above commands for you in the directory of each release.

## live-build Documentation
For further information on how to use live-build, see the live-build manual:  http://live.debian.net/manual/stable/index.en.html

Thanks to the team of overclockix (www.overclockix.com) from which I derived this live.
