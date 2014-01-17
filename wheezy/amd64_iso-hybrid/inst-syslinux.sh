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

#-----------------------------------------------------------------------
echo -e "Posso cancellare la pennetta e ricreare la partizione. Sei d'accordo (s/n)?"
read sn
if [ ${sn} = "s" ]; then
	echo "Sovrascrivo la tabella delle partizioni."
	parted -s ${1} mktable msdos
	echo "Creo la partizione primaria fat32 alla massima dimensione."
	echo -e "mkpart primary fat32 1 -1\nset 1 boot on\nq\n" | parted ${1}
	echo "Formatto la partizione."
	mkdosfs ${1}1
fi
#-----------------------------------------------------------------------

if [ -e /usr/bin/syslinux ]; then
	mount ${1}1 ${2} </dev/null
	if [ -z ${?} ]; then
		echo "Errore montando ${1}1 in ${2}"
		exit
	fi
	if [ ! -d ${2}/boot/syslinux ]; then
		echo "Creo la directory ${2}/boot/syslinux (premere Invio o Crtl-c per uscire)"
		read
		mkdir -p ${2}/boot/syslinux
	fi
	echo "Copio mbr in ${1} (premere Invio o Crtl-c per uscire)"
	read
	cat /usr/lib/syslinux/mbr.bin > ${1}
	echo "Installo syslinux in ${1}1 (premere Invio o Crtl-c per uscire)"
	read
	syslinux --directory /boot/syslinux/ --install ${1}1
	for i in chain.c32 config.c32 hdt.c32 libcom32.c32 libutil.c32 memdisk menu.c32 reboot.c32 vesamenu.c32 whichsys.c32; do
		cp /usr/lib/syslinux/$i ${2}/boot/syslinux/
	done
	if [ ! -d ${2}/menus/syslinux ]; then
		echo "Creo la directory ${2}/menus/syslinux (premere Invio o Crtl-c per uscire)"
		read
		mkdir -p ${2}/menus/syslinux
	fi
	cat >${2}/boot/syslinux/syslinux.cfg <<EOF
DEFAULT main

LABEL main
COM32 /boot/syslinux/menu.c32
APPEND /menus/syslinux/main.cfg
EOF
	cat >${2}/menus/syslinux/defaults.cfg <<EOF
MENU TITLE Title

MENU MARGIN 0
MENU ROWS -9
MENU TABMSG
MENU TABMSGROW -3
MENU CMDLINEROW -3
MENU HELPMSGROW -4
MENU HELPMSGENDROW -1

MENU COLOR SCREEN 37;40
MENU COLOR BORDER 34;40
MENU COLOR TITLE 1;33;40
MENU COLOR SCROLLBAR 34;46
MENU COLOR SEL 30;47
MENU COLOR UNSEL 36;40
MENU COLOR CMDMARK 37;40
MENU COLOR CMDLINE 37;40
MENU COLOR TABMSG 37;40
MENU COLOR DISABLED 37;40
MENU COLOR HELP 32;40
EOF
	cat >${2}/menus/syslinux/main.cfg <<EOF
MENU INCLUDE /menus/syslinux/defaults.cfg
UI /boot/syslinux/menu.c32

DEFAULT label

LABEL label
MENU LABEL label

MENU SEPARATOR

LABEL -
MENU LABEL Reboot
TEXT HELP
 Reboot the PC.
ENDTEXT
COM32 /boot/syslinux/reboot.c32
EOF
	umount $2
	echo "Fatto!"
else
	echo "syslinux non è installato sul tuo sistema. Esco."
fi
