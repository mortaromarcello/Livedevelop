#!/bin/bash
### ha bisogno di python 3.3 e di sisu-complete (installarli da debian testing) ###
TMP="/tmp/live"
DIR=$(pwd)
[[ ! -d ${TMP} ]] && mkdir -p ${TMP}; cd ${TMP}

git clone git://live.debian.net/git/live-build.git
git clone git://live.debian.net/git/live-boot.git
git clone git://live.debian.net/git/live-config.git
git clone git://live-systems.org/git/live-manual.git
git clone git://live-systems.org/git/live-tools.git
cd ${TMP}/live-build && dpkg-buildpackage -b -uc -us
cd ${TMP}/live-boot && dpkg-buildpackage -b -uc -us
cd ${TMP}/live-config && dpkg-buildpackage -b -uc -us
cd ${TMP}/live-manual && dpkg-buildpackage -b -uc -us
cd ${TMP}/live-tools && dpkg-buildpackage -b -uc -us
cd ${TMP}

dpkg -i live-build_*.deb
dpkg -i live-boot{_,-initramfs-tools,-doc}*.deb
dpkg -i live-config{_,-systemd,-sysvinit,-doc}*.deb
dpkg -i live-manual-html*.deb

rm -vf ${DIR}/config/packages.chroot/live-build_*.deb
rm -vf ${DIR}/config/packages.chroot/live-{boot,config,tools,manual}*.deb

cp -v live-build_*.deb ${DIR}/config/packages.chroot/
cp -v live-tools_*.deb ${DIR}/config/packages.chroot/
cp -v live-boot{_,-initramfs-tools,-doc}*.deb ${DIR}/config/packages.chroot/
cp -v live-config{_,-systemd,-sysvinit,-doc}*.deb  ${DIR}/config/packages.chroot/
cp -v live-manual-html*.deb ${DIR}/config/packages.chroot/

rm -R -f -v ${TMP}
