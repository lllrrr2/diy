#!/bin/sh
#Licensed under the BSD 3-Clause license
#Author: aswjh
#http://nicereader.net

[ `id -u` -ne 0 ] && echo "运行 deb2tcz.sh 需要root权限" && exit 1

[ -e "$1" ] && DEB="$1" || exit 1
if [ "$2" ]; then
    if [ "${2%.tcz}" != "$2" ]; then
        ZDIR="`dirname $2`"
        NAME="${2##*/}"
        NAME="${NAME%.tcz}"
    else
        ZDIR="$2"
    fi
else
    ZDIR="`pwd`"
fi
DEB="`realpath $DEB`"
FULLNAME="${DEB##*/}"
[ "$NAME" ] || NAME="${FULLNAME%.*}"
PID=$$

BUSYBOX=$(which busybox)
if [ "$BUSYBOX" ] && $BUSYBOX --list | grep -sq install; then
    install() { busybox install $@; }
    chown() { busybox chown $@; }
fi

rm -rf /tmp/dpz/$PID
install -g staff -o root -m 775 -d /tmp/dpz/$PID/data /tmp/dpz/$PID/control || exit 1
cd /tmp/dpz/$PID/ || exit 1

if [ -d "$DEB" ]; then
    { test -n "`ls $DEB`" && cp -af "$DEB"/* /tmp/dpz/$PID/data/; } || exit 1
else
    #unpack deb/tar
    if echo "$DEB" | grep -iq '\.deb$'; then
        ar t "$DEB" | awk '/\.(xz|lzma)$/{$2="J"}/\.gz$/{$2="z"}/\.bz2$/{$2="j"}/\.tar\./{print}' | while read P Z; do
            { ar p "$DEB" "$P" | tar "${Z}x" -C "${P%%.*}"; } || echo "$DEB $P ${Z}x" >> arerr
        done
    else
        (echo "$DEB" | grep -iq '\.tar') && tar xf "$DEB" -C data/
    fi
    { [ ! "`ls /tmp/dpz/$PID/data`" ] || [ -f arerr ]; } && exit 1
fi

#delete locale/doc/man
for d in usr usr/local; do
    find "data/$d"/share/locale -mindepth 1 -maxdepth 1 -type d ! -name "`echo $LANG | cut -f1 -d.`" -exec rm -rf {} \;
    rm -rf "data/$d"/share/doc
    rm -rf "data/$d"/share/man
done 2>/dev/null

#postinst/postrm
if [ -x control/postinst ]; then
    install -g staff -o root -m 775 -d data/usr/local/postinst
    install -g staff -o root -m 775 control/postinst data/usr/local/postinst/"$NAME"
    echo "[ \"\$NOPOSTINST\" ] || /usr/local/postinst/$NAME configure" >> "$NAME.sh"
fi

if [ -x control/postrm ]; then
    install -g staff -o root -m 775 -d data/usr/local/postrm
    install -g staff -o root -m 775 control/postrm data/usr/local/postrm/"$NAME"
fi

#desktop
ls data/usr/share/applications/*.desktop 2>/dev/null | while read x; do
    [ "$x" ] && mkdir -p data/usr/local/share/applications &&
    linkname=$(echo|awk 'END{n="'"$NAME"'"; x="'"$x"'"; sub(/^.*\//, "", x); s=n; sub(/_.*/, "", s); print index(x, s) && system("test ! -e data/usr/local/share/applications/"n".desktop")==0 ? n".desktop" : x}') &&
    [ "$linkname" != "$NAME".desktop ] && echo "$linkname" >> "$NAME.sh"
    icon_name=$(awk -v FS="=" '$1~"^Icon$"{n=$2} $1~"^X\\-FullPathIcon"{n="";exit}END{if (n) print n}' "$x")
    [ "$icon_name" ] && for dx in share/icons share/pixmaps local/share/icons local/share/pixmaps; do
        find "data/usr/$dx" ! -type d 2>/dev/null
    done | awk -v n="$icon_name" -v IGNORECASE=1 '
        /\.(png|xpm)$/ {
            x=$1; sub(/.*\//, "", x);
            print (x~"^"n"[^a-z0-9]" ? 1 : ($1~n ? 2 : 3))($1~"[0-9]+x[0-9]+" ? ($1~"4.x4." ? 1 :($1~"3.x3." ? 2 : 3)) : 1)" "$1
        }
    ' | sort | head -n 1 | while read num img; do
        sed -i "/^Icon=/s@=\(.*\)@=\1\nX-FullPathIcon=/${img#data/}@" "$x"
    done
    mv "$x" data/usr/local/share/applications/"$linkname" 2>/dev/null
done

#finish tce.installed script
if [ -f "$NAME.sh" ]; then
    install -g staff -o root -m 775 -d data/usr/local/tce.installed
    sed -i '1i\#!/bin/sh' "$NAME.sh"
    awk '
    {if ($1 ~ /\.desktop$/) {x=$1; sub(/\..*$/, "", x); a[++n]=x} else {print}}
    END {
        if (n) print "read USER < /etc/sysconfig/tcuser"
        for (i=1; i<=n; i++) {
            print "sudo su $USER -c \"desktop.sh "a[i]"\""
        }
    }
    ' "$NAME.sh" >> "$NAME"
    install -g staff -o root -m 775 "$NAME" data/usr/local/tce.installed/"$NAME"
fi

#convert to absolute link
find data -type l | while read F; do
    link=$(readlink "$F")
    if [ "${link#/}" = "$link" ]; then
        fn="${F#data}"
        rel="${fn%/*}/$link"
        [ ! -e "data/$rel" ] && rm -f "$F" && ln -s "$rel" "$F"
    fi
done

#pack tcz
USER=`cat /etc/sysconfig/tcuser 2>/dev/null`
[ "$USER" ] || USER=tc

TCZ="${NAME}.tcz"
rm -f "$ZDIR/$TCZ"

mkdir -p "$ZDIR" &&
chmod 755 /tmp/dpz/$PID/data &&
mksquashfs /tmp/dpz/$PID/data "$ZDIR/$TCZ" -noappend -no-fragments &&    #-b 4096  #slower and bigger
rm -rf /tmp/dpz/$PID &&
chown "$USER".staff "$ZDIR/$TCZ"

