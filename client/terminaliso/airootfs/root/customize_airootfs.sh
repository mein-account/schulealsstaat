#!/bin/bash

set -e -u

sed -i 's/#\(de_DE\.UTF-8\)/\1/' /etc/locale.gen
locale-gen

ln -sf /usr/share/zoneinfo/Europe/Berlin /etc/localtime

cp -aT /etc/skel/ /root/
chmod 700 /root

useradd -p "" -g users -G "adm,audio,network,rfkill,scanner,optical,power,wheel" sas

chmod 750 /etc/sudoers.d
chmod 440 /etc/sudoers.d/g_wheel

sed -i "s/#Server/Server/g" /etc/pacman.d/mirrorlist
sed -i 's/#\(Storage=\)auto/\1volatile/' /etc/systemd/journald.conf

systemctl enable pacman-init.service choose-mirror.service
systemctl set-default multi-user.target
