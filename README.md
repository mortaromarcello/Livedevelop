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
## Istruzioni per la creazione dell'imagine iso:
Entra nella directory 'Livedevelop/jessie/i386_iso-hybrid' ed esegui i seguenti comandi (se non hai installato o non sei abilitato a `sudo` devi cambiare lo user in root con il comando `su` e tralasciare il comando `sudo`):
```
sudo ./live-git.sh
```
Questo aggiornerà all'ultima versione i programmi del live system.
```
sudo ./build.sh
```
===========
## Elenco programmi che non fanno parte di Debian:
Eclipse for Android         (IDE Android)
Android ndk
bashdb                      (Debugger per fils bash)
biabconverter               (un  programma che converte i files di band-in-a-box in mma 'Musical Midi Accompaniment')
Glade-3                     (la vecchia versione di Glade per gnome 2 e Gtk 2)
IntelliJ IDEA 13            (IDE per java)
Linuxband                   (un programma che esegue files mma, simile ad band-in-a-box)
Musical Midi Accompaniment  (Generatore di accompagnamenti musicali)
Sakis3G                     (gestore di chiavette 3g)
Tor Browser                 (Fork di Firefox per navigare sotto reti Tor in anonimato)
WarZone 2001                (Gioco di ruolo spaziale)
Yad                         (Un fork di Zenity con molte funzioni avanzate)


