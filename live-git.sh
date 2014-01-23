#!/bin/bash
### ha bisogno di python 3.3 (installarlo da debian testing) ###
[[ ! -d /tmp/live ]] && mkdir -p /tmp/live; cd /tmp/live
LIVEDEVELOP="/mnt/sda7/livedevelop/testing/i386_iso-hybrid"
LIVEDEVELOP_GIT="/mnt/sda7/livedevelop-git/testing"
git clone git://live.debian.net/git/live-build.git
git clone git://live.debian.net/git/live-boot.git
git clone git://live.debian.net/git/live-config.git
#git clone git://live-systems.org/git/live-manual.git
git clone git://live-systems.org/git/live-tools.git
cd live-build && dpkg-buildpackage -b -uc -us && cd ..
cd live-boot && dpkg-buildpackage -b -uc -us && cd ..
cd live-config && dpkg-buildpackage -b -uc -us && cd ..
#cd live-manual && dpkg-buildpackage -b -uc -us && cd ..
cd live-tools && dpkg-buildpackage -b -uc -us && cd ..
dpkg -i live-build_*.deb
dpkg -i live-boot{_,-initramfs-tools,-doc}*.deb
dpkg -i live-config{_,-sysvinit,-doc}*.deb

rm -f ${LIVEDEVELOP}/config/packages.chroot/live-build_*.deb
rm -f ${LIVEDEVELOP}/config/packages.chroot/live-{boot,config,tools}*.deb
rm -f ${LIVEDEVELOP_GIT}/i386_iso-hybrid/config/packages.chroot/live-build_*.deb
rm -f ${LIVEDEVELOP_GIT}/i386_iso-hybrid/config/packages.chroot/live-{boot,config,tools}*.deb

cp live-build_*.deb ${LIVEDEVELOP}/config/packages.chroot/
cp live-tools_*.deb ${LIVEDEVELOP}/config/packages.chroot/
cp live-boot{_,-initramfs-tools,-doc}*.deb ${LIVEDEVELOP}/config/packages.chroot/
cp live-config{_,-sysvinit,-doc}*.deb  ${LIVEDEVELOP}/config/packages.chroot/

cp live-build_*.deb ${LIVEDEVELOP_GIT}/i386_iso-hybrid/config/packages.chroot/
cp live-tools_*.deb ${LIVEDEVELOP_GIT}/i386_iso-hybrid/config/packages.chroot/
cp live-boot{_,-initramfs-tools,-doc}*.deb  ${LIVEDEVELOP_GIT}/i386_iso-hybrid/config/packages.chroot/
cp live-config{_,-sysvinit,-doc}*.deb  ${LIVEDEVELOP_GIT}/i386_iso-hybrid/config/packages.chroot/

rm -R -f -v /tmp/live
