#!/usr/bin/env bash
#
# per distro debian. Il pacchetto syslinux deve essere già installato nel sistema.
#

if [ $UID != 0 ]; then
	echo "Devi essere root per eseguire questo script."
	exit
fi

if [ -z $1 ] & [ -z $2 ]; then
	echo -e "Uso: ${0} /dev/sd(x) /path/to/mount/\n\n \
/dev/sd(x): disco dove installare syslinux;\n \
/path/to/mount/: directory dove verrà montata la prima partizione fat32;\n \
Attenzione: il disco deve contenere la prima partizione come fat32!"
	exit
fi
if [ -e /usr/bin/syslinux ]; then
	mount ${1}1 $2 </dev/null
	if [ -z ${?} ]; then
		echo "Errore montando ${1}1 in ${2}"
		exit
	fi
	if [ ! -d ${2}/boot/syslinux ]; then
		echo "Creo la directory ${1}1/boot/syslinux (premere Invio o Crtl-c per uscire)"
		read
		mkdir -p ${2}/boot/syslinux
	fi
	echo "Copio mbr in ${1} (premere Invio o Crtl-c per uscire)"
	read
	cat /usr/lib/syslinux/mbr.bin > $1
	echo "Installo syslinux in ${1}1 (premere Invio o Crtl-c per uscire)"
	read
	syslinux --directory /boot/syslinux/ --install ${1}1
	umount $2
	echo "Fatto!"
else
	echo "syslinux non è installato sul tuo sistema. Esco."
fi
