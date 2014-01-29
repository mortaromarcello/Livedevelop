Livedevelop
===========
Ho sviluppato questa distro per una mio bisogno personale, infatti contiene anche programmi e drivers adattati per le mie particolari esigenze. La distro è stata concepita per programmatori/musicisti/manutentori con i programmi più usati allo scopo. Ho inserito anche diversi programmi che la distro Debian non comprende mano a mano che ne vedevo l'utilità. La Live è basata su Debian jessie (testing). Per ora sto mantenendo solo questa versione. Chi volesse costruire la sua propria live deve seguire queste istruzioni:
## Pre-requisiti per live-build
Per costruire Livedevelop usando live-build bisogna prima avere questi pre-requisiti:
- Usare un sistema Debian testing aggiornato. 
- Avere installato il programma git: `apt-get install git`

## Clonare il repository
- Dalla directory in cui vuoi clonare il repository esegui il seguente comando:
```
git clone https://github.com/mortaromarcello/Livedevelop.git
```
- Aggiornare o installare il live system (se non hai installato o non sei abilitato a `sudo` devi cambiare lo user in root con il comando `su` e tralasciare il comando `sudo`):
```
sudo dpkg -i Livedevelop/jessie/i386_iso-hybrid/config/packages.chroot/live-build_*.deb
sudo dpkg -i Livedevelop/jessie/i386_iso-hybrid/config/packages.chroot/live-boot{_,-initramfs-tools,-doc}*.deb
sudo dpkg -i Livedevelop/jessie/i386_iso-hybrid/config/packages.chroot/live-config{_,-sysvinit,-doc}*.deb
sudo dpkg -i Livedevelop/jessie/i386_iso-hybrid/config/packages.chroot/live-manual-html*.deb
```
## Istruzioni per la creazione dell'imagine iso:
Entra nella directory:`cd Livedevelop/jessie/i386_iso-hybrid` ed esegui i seguenti comandi:
```
sudo ./build.sh
```
===========
## Elenco programmi che non fanno parte di Debian:
- Eclipse for Android         (IDE Android)
- Android ndk
- bashdb                      (Debugger per fils bash)
- biabconverter               (un  programma che converte i files di band-in-a-box in mma 'Musical Midi Accompaniment')
- Codelite                    (Dal repository ufficiale)
- Clonezilla                  (Dal repository ufficiale)
- Glade-3                     (la vecchia versione di Glade per gnome 2 e Gtk 2)
- Google Talk
- IntelliJ IDEA 13            (IDE per java versione Community)
- Linuxband                   (un programma che esegue files mma, simile ad band-in-a-box)
- Musical Midi Accompaniment  (Generatore di accompagnamenti musicali)
- Sakis3G                     (gestore di chiavette 3g)
- Tor Browser                 (Fork di Firefox per navigare sotto reti Tor in anonimato)
- WarZone 2001                (Gioco di ruolo spaziale)
- Yad                         (Un fork di Zenity con molte funzioni avanzate)
- WxCrafter

## Elenco programmi per lo sviluppo
- Codeblocks 
- Anjuta
- Lazarus
- Kdevelop
- QtCreator
- Geany
- Boa Contructor
- Eric
- Glade
- Gtranslator
- Leksah
- Meld
- MonoDevelop
- NetBeans
- Openjdk-7-Jdk
- Pida
- PoEdit
- Spe
- Spyder
- Virtaal
- Yasm

## elenco programmi multimediali
- Audacious
- Audacity
- Avidemux
- Gnome Subtitles
- Kaffeine
- Isomaster
- Me-Tv
- Mktoolnix-gui
- Ogmrip
- Openshot
- Smplayer2
- Vlc
- Winff
- Xbmc

## Elenco programmi musicali
- Hydrogen
- Musescore
- Rosegarden
- Qsynth
- QjackCtl

## Elenco utilità varie
- Apache2
- Aqemu
- Bleachbit
- Calibre
- Chromium
- Etherape
- Etherwake
- Filezilla
- Gparted
- Heimdall
- K3b
- Kpartx
- Ktorrent
- Midnight Commander
- Ophcrack
- Partclone
- PartitionManager
- PdfChain
- PdfSam
- Psensor
- Qemu
- Samba
- StarDict
- Unison-Gtk
- Virtualbox
- Wine
- Wireshark
