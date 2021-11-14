#!/usr/bin/env bash
cr="\e[31m" && clr="\e[91m" # [c]olor[r]ed		&& [c]olor[l]ight[r]ed
cg="\e[32m" && clg="\e[92m" # [c]olor[g]reen	&& [c]olor[l]ight[g]reen
cy="\e[33m" && cly="\e[93m" # [c]olor[y]ellow	&& [c]olor[l]ight[y]ellow
cb="\e[34m" && clb="\e[94m" # [c]olor[b]lue		&& [c]olor[l]ight[b]lue
cm="\e[35m" && clm="\e[95m" # [c]olor[m]agenta	&& [c]olor[l]ight[m]agenta
cc="\e[36m" && clc="\e[96m" # [c]olor[c]yan		&& [c]olor[l]ight[c]yan
tb="\e[1m"  && td="\e[2m"   # [t]ext[b]old		&& [t]ext[d]im
tn="\n"     && tu="\e[4m"   # [t]ext[n]ewline 	&& [t]ext[u]nderlined
ut="\e[32m\U2714\e[0m"	# [u]nicode][t]ick
up="\e[34m\U002b\e[0m"	# [u]nicode][p]lus
uc="\e[31m\U2715\e[0m"	# [u]nicode][c]ross
ce="\e[0m"				# [c]olor[e]nd
urc="\e[31m\U25cf\e[0m" && ulrc="\e[91m\U25cf\e[0m"    # [u]nicode[r]ed[c]ircle     && [u]nicode[l]ight[r]ed[c]ircle
ugc="\e[32m\U25cf\e[0m" && ulgc="\e[92m\U25cf\e[0m"    # [u]nicode[g]reen[c]ircle   && [u]nicode[l]ight[g]reen[c]ircle
uyc="\e[33m\U25cf\e[0m" && ulyc="\e[93m\U25cf\e[0m"    # [u]nicode[y]ellow[c]ircle  && [u]nicode[l]ight[y]ellow[c]ircle
ubc="\e[34m\U25cf\e[0m" && ulbc="\e[94m\U25cf\e[0m"    # [u]nicode[b]lue[c]ircle    && [u]nicode[l]ight[b]lue[c]ircle
umc="\e[35m\U25cf\e[0m" && ulmc="\e[95m\U25cf\e[0m"    # [u]nicode[m]agenta[c]ircle && [u]nicode[l]ight[m]agenta[c]ircle
ucc="\e[36m\U25cf\e[0m" && ulcc="\e[96m\U25cf\e[0m"    # [u]nicode[c]yan[c]ircle    && [u]nicode[l]ight[c]yan[c]ircle
ugrc="\e[37m\U25cf\e[0m" && ulgrcc="\e[97m\U25cf\e[0m" # [u]nicode[gr]ey[c]ircle    && [u]nicode[l]ight[gr]ey[c]ircle
cdef="\e[39m"			# [c]olor[def]ault

REPO_URL=https://github.com/immortalwrt/immortalwrt
# REPO_BRANCH="openwrt-21.02"
REPO_BRANCH="openwrt-18.06"
# REPO_BRANCH="openwrt-18.06-dev"
# REPO_BRANCH="openwrt-18.06-k5.4"

[[ $REPO_BRANCH ]] && cmd="-b $REPO_BRANCH"
echo -e "${cy}拉取源码中.... ${ce}"
git clone -q $REPO_URL $cmd openwrt
cd openwrt || exit
./scripts/feeds update -a 1>/dev/null 2>&1
./scripts/feeds install -a 1>/dev/null 2>&1

cat > .config <<-EOF
	## target
	# CONFIG_TARGET_x86=y
	# CONFIG_TARGET_x86_64=y
	# CONFIG_TARGET_ROOTFS_PARTSIZE=900
	CONFIG_TARGET_ramips=y
	CONFIG_TARGET_ramips_mt7621=y
	CONFIG_TARGET_ramips_mt7621_DEVICE_d-team_newifi-d2=y
	# CONFIG_TARGET_ramips_mt7621_DEVICE_phicomm_k2p=y
	# CONFIG_TARGET_armvirt=y
	# CONFIG_TARGET_armvirt_64=y
	# CONFIG_TARGET_armvirt_64_Default=y
	# CONFIG_TARGET_brcm47xx=y
	# CONFIG_TARGET_brcm47xx_mips74k=y
	# CONFIG_TARGET_brcm47xx_mips74k_DEVICE_asus_rt-n16=y
	CONFIG_KERNEL_BUILD_USER="win3gp"
	CONFIG_KERNEL_BUILD_DOMAIN="OpenWrt"
	## luci app
	CONFIG_PACKAGE_luci-app-accesscontrol=y
	CONFIG_PACKAGE_luci-app-adblock-plus=y
	CONFIG_PACKAGE_luci-app-bridge=y
	CONFIG_PACKAGE_luci-app-cowb-speedlimit=y
	CONFIG_PACKAGE_luci-app-cowbping=y
	CONFIG_PACKAGE_luci-app-cpulimit=y
	CONFIG_PACKAGE_luci-app-ddnsto=y
	CONFIG_PACKAGE_luci-app-easymesh=y
	CONFIG_PACKAGE_luci-app-filebrowser=y
	CONFIG_PACKAGE_luci-app-filetransfer=y
	CONFIG_PACKAGE_luci-app-network-settings=y
	CONFIG_PACKAGE_luci-app-oaf=y
	CONFIG_PACKAGE_luci-app-openclash=y
	CONFIG_PACKAGE_luci-app-passwall=y
	CONFIG_PACKAGE_luci-app-rebootschedule=y
	CONFIG_PACKAGE_luci-app-ssr-plus=y
	CONFIG_PACKAGE_luci-app-ttyd=y
	CONFIG_PACKAGE_luci-app-upnp=y
	## luci theme
	CONFIG_PACKAGE_luci-theme-material=y
	## remove
	# CONFIG_VMDK_IMAGES is not set
	## CONFIG_GRUB_EFI_IMAGES is not set
	# Libraries
	CONFIG_PACKAGE_patch=y
	CONFIG_PACKAGE_diffutils=y
	CONFIG_PACKAGE_default-settings=y
	CONFIG_TARGET_IMAGES_GZIP=y
	CONFIG_BRCMFMAC_SDIO=y
	CONFIG_LUCI_LANG_en=y
	CONFIG_LUCI_LANG_zh_Hans=y
	CONFIG_DEFAULT_SETTINGS_OPTIMIZE_FOR_CHINESE=y
EOF

m=$(echo $REPO_BRANCH | awk -F- '{print $NF}')
config_generate="package/base-files/files/bin/config_generate"
TARGET=$(awk '/^CONFIG_TARGET/{print $1;exit;}' .config | sed -r 's/.*TARGET_(.*)=y/\1/')
DEVICE_NAME=$(grep '^CONFIG_TARGET.*DEVICE.*=y' .config | sed -r 's/.*DEVICE_(.*)=y/\1/')

echo -e "${cy}修改设置${ce}"
wget -qO package/base-files/files/etc/banner git.io/JoNK8
sed -i "/DISTRIB_DESCRIPTION/ {s/'$/-immortalwrt-$(date +%Y年%m月%d日)'/}" package/*/*/*/openwrt_release
sed -i "/IMG_PREFIX:/ {s/=/=Immortal-$m-\$(shell date +%m%d-%H%M -d +8hour)-/}" include/image.mk
sed -i 's/option enabled.*/option enabled 1/' feeds/*/*/*/*/upnpd.config
sed -i "s/ImmortalWrt/OpenWrt/" {$config_generate,include/version.mk}
sed -i "/listen_https/ {s/^/#/g}" package/*/*/*/files/uhttpd.config
sed -i "{
		/upnp/d
		/banner/d
		s|auto|zh_cn\nuci set luci.main.mediaurlbase=/luci-static/bootstrap|
		s^.*shadow$^sed -i 's/root::0:0:99999:7:::/root:\$1\$RysBCijW\$wIxPNkj9Ht9WhglXAXo4w0:18206:0:99999:7:::/g' /etc/shadow^
		}" $(find package/ -type f -name "zzz-default-settings")
[[ "$m" == "18.06" ]] && \
sed -i 's|os.date(.*|os.date("%F %X") .. " " .. translate(os.date("%A")),|' package/emortal/*/*/*/index.htm

clone_url() {
	for x in $@; do
		if [[ "$(echo $x | grep -v "^#" | grep -Ev "helloworld|passwall|build")" ]]; then
			g=$(find . -maxdepth 4 -type d -name ${x##*/})
			if ([[ -d "$g" ]] && rm -rf $g); then
				p="1"; k="$g"
			else
				p="0"; k="package/A/${x##*/}"
			fi

			if [[ "$(echo $x | grep -E "trunk|branches")" ]]; then
				if (svn export -q --force $x $k); then f="1"; fi
			else
				if (git clone -q $x $k); then f="1"; fi
			fi
			[[ $f -eq $p ]] && echo -e "替换完成 ${ut} ${x##*/}"
			[[ $f -gt $p ]] && echo -e "拉取完成 ${up} ${x##*/}"
			[[ $f -lt $p ]] && echo -e "替换失败 ${uc} ${x##*/}"
			unset -v p f k
		elif [[ "$(echo $x | grep -v "^#" | grep -E "helloworld|passwall|build")" ]]; then
			for w in $x; do
				if git clone -q $w ../${w##*/}; then
					for x in `ls -F ../${w##*/} | grep "/$" | sed 's|/$||' | grep -Ev 'kernel|*rrent|*pulimit|*dump|*info|*dtest|*Deny|*dog|*cowbb*'`; do
						if [[ "$x" && -d ../${w##*/}/$x ]]; then
							g=$(find . -maxdepth 4 -type d -name $x)
							if ([[ -d "$g" ]] && rm -rf $g); then
								p="1"; k="$g"
							else
								p="0"; k="package/A"
								[[ -d "$k" ]] || mkdir -p $k
							fi

							if (mv -f ../${w##*/}/$x $k); then
								f="1"
							fi
						fi
						[[ $f -eq $p ]] && echo -e "替换完成 ${ut} ${x##*/}"
						[[ $f -gt $p ]] && echo -e "新加完成 ${up} ${x##*/}"
						unset -v p f k
					done
				fi
				rm -rf ../${w##*/}
			done
		fi
	done
}

_packages() {
	for z in $@; do
		[[ $(echo $z | grep -v "^#") ]] && echo "CONFIG_PACKAGE_$z=y" >> .config
	done
}
rm -rf feeds/*/*/{luci-app-appfilter,appfilter,open-app-filter}

clone_url "
	https://github.com/hong0980/build
	https://github.com/fw876/helloworld
	https://github.com/xiaorouji/openwrt-passwall
	https://github.com/destan19/OpenAppFilter
	https://github.com/jerrykuku/luci-app-vssr
	https://github.com/ntlf9t/luci-app-easymesh
	https://github.com/zzsj0928/luci-app-pushbot
	https://github.com/small-5/luci-app-adblock-plus
	https://github.com/jerrykuku/luci-app-jd-dailybonus
	https://github.com/vernesong/OpenClash/trunk/luci-app-openclash
	https://github.com/lisaac/luci-lib-docker/trunk/collections/luci-lib-docker
	https://github.com/coolsnowwolf/lede/trunk/package/lean/luci-app-adbyby-plus
	#https://github.com/zaiyuyishiyoudu/luci-app-kickass/trunk/luci-app-kickass
	#https://github.com/coolsnowwolf/lede/trunk/package/network/services/hostapd
	#https://github.com/lisaac/luci-app-diskman/trunk/applications/luci-app-diskman
	#https://github.com/lisaac/luci-app-dockerman/trunk/applications/luci-app-dockerman
"
# https://github.com/immortalwrt/luci/branches/openwrt-21.02/applications/luci-app-ttyd ## 分支
sed -e '$a\pthome.net\nchdbits.co\nhdsky.me\nwww.nicept.net\nourbits.club' feeds/luci/applications/{luci-app-ssr-plus/*/*/*/deny.list,luci-app-passwall/*/*/*/*/*/direct_host} -i

[[ "$TARGET" == "x86" ]] && {
	_packages "
	luci-app-adbyby-plus
	luci-app-amule
	luci-app-dockerman
	luci-app-netdata
	luci-app-openclash
	luci-app-poweroff
	luci-app-qbittorrent
	luci-app-jd-dailybonus
	luci-app-unblockmusic
	luci-app-smartdns
	ariang bash htop lscpu lsscsi lsusb nano pciutils screen webui-aria2
	#subversion-server #unixodbc #git-http

	#USB3.0支持
	kmod-usb-audio
	kmod-usb-printer
	kmod-usb2
	kmod-usb2-pci
	kmod-usb3

	#nfs
	kmod-fs-nfsd
	kmod-fs-nfs
	kmod-fs-nfs-v4

	#3G/4G_Support
	kmod-mii
	kmod-usb-acm
	kmod-usb-serial
	kmod-usb-serial-option
	kmod-usb-serial-wwan

	#Sound_Support
	kmod-sound-core
	kmod-sound-hda-codec-hdmi
	kmod-sound-hda-codec-realtek
	kmod-sound-hda-codec-via
	kmod-sound-hda-core
	kmod-sound-hda-intel

	#USB_net_driver
	kmod-mt76
	kmod-mt76x2u
	kmod-rtl8192cu
	kmod-rtl8812au-ac
	kmod-rtl8821cu
	kmod-rtlwifi
	kmod-rtlwifi-btcoexist
	kmod-rtlwifi-usb
	kmod-usb-net-asix
	kmod-usb-net-asix-ax88179
	kmod-usb-net-cdc-ether
	kmod-usb-net-rndis
	kmod-usb-net-rtl8152-vendor
	usb-modeswitch

	#docker
	kmod-br-netfilter
	kmod-dm
	kmod-dummy
	kmod-fs-btrfs
	kmod-ikconfig
	kmod-nf-conntrack-netlink
	kmod-nf-ipvs
	kmod-veth

	#x86
	acpid
	alsa-utils
	ath10k-firmware-qca9888
	ath10k-firmware-qca988x
	ath10k-firmware-qca9984
	blkid
	brcmfmac-firmware-43602a1-pcie
	irqbalance
	kmod-8139cp
	kmod-8139too
	kmod-alx
	kmod-ath10k
	kmod-bonding
	kmod-drm-ttm
	kmod-fs-ntfs
	kmod-i40e
	kmod-i40evf
	kmod-igbvf
	kmod-iwlwifi
	kmod-ixgbe
	kmod-ixgbevf
	kmod-mlx4-core
	kmod-mlx5-core
	kmod-mmc-spi
	kmod-pcnet32
	kmod-r8125
	kmod-r8168
	kmod-rt2800-usb
	kmod-rtl8xxxu
	kmod-sdhci
	kmod-sound-i8x0
	kmod-sound-via82xx
	kmod-tg3
	kmod-tulip
	kmod-usb-hid
	kmod-vmxnet3
	lm-sensors-detect
	qemu-ga
	smartmontools
	snmpd
	"

	sed -i "s/192.168.1.1/192.168.2.150/" $config_generate
	[[ $(awk -F= '/PKG_VERSION:/{print $2}' feeds/*/*/netdata/Makefile) == "1.30.1" ]] && {
		rm feeds/*/*/netdata/patches/*web*
		wget -qO feeds/packages/admin/netdata/patches/009-web_gui_index.html.patch git.io/JoNoj
	}

	clone_url "
	https://github.com/coolsnowwolf/lede/trunk/package/lean/qtbase
	https://github.com/coolsnowwolf/lede/trunk/package/lean/qttools
	https://github.com/coolsnowwolf/lede/trunk/package/lean/qBittorrent
	https://github.com/coolsnowwolf/lede/trunk/package/lean/rblibtorrent
	https://github.com/coolsnowwolf/lede/trunk/package/lean/luci-app-qbittorrent
	https://github.com/coolsnowwolf/lede/trunk/package/lean/qBittorrent-static
	"
	[[ -d package/A/qtbase ]] && rm -rf feeds/packages/libs/qt5
	# sed -i 's/qtbase/qt5/' package/A/qttools/Makefile
	# sed -i 's/Enhanced-Edition/static/g' feeds/luci/applications/luci-app-qbittorrent/Makefile 1>/dev/null 2>&1
}

[[ "$DEVICE_NAME" == "phicomm_k2p" ]] || {
	[[ "$DEVICE_NAME" == "d-team_newifi-d2" ]] && sed -i "s/192.168.1.1/192.168.2.1/" $config_generate
	[[ "$DEVICE_NAME" == "asus_rt-n16" ]] && {
	sed -i "s/192.168.1.1/192.168.2.130/" $config_generate
	}
	_packages "
	automount autosamba axel kmod-rt2500-usb kmod-rtl8187
	luci-app-aria2
	luci-app-cifs-mount
	luci-app-control-weburl
	luci-app-diskman
	luci-app-hd-idle
	luci-app-kickass
	luci-app-pushbot
	luci-app-smartinfo
	luci-app-softwarecenter
	luci-app-transmission
	luci-app-usb-printer
	luci-app-vssr
	#luci-app-unblockmusic
	"
}

[[ "$REPO_BRANCH" == "openwrt-21.02" ]] && {
	sed -i 's/services/nas/' feeds/luci/*/*/*/*/*/*/menu.d/*transmission.json
	sed -i 's/^ping/-- ping/g' package/*/*/*/*/*/bridge.lua
} || {
	clone_url "
	https://github.com/hong0980/luci/trunk/applications/luci-app-aria2
	https://github.com/hong0980/luci/trunk/applications/luci-app-transmission
	https://github.com/hong0980/packages/trunk/net/aria2
	https://github.com/hong0980/packages/trunk/net/ariang
	https://github.com/hong0980/packages/trunk/net/transmission
	https://github.com/hong0980/packages/trunk/net/transmission-web-control
	https://github.com/openwrt/routing/branches/openwrt-19.07/batman-adv
	"
}

for p in $(find . -maxdepth 5 -type d -name "po"); do
	[[ "$m" == "21.02" ]] && {
		if [[ ! -d $p/zh_Hans && -d $p/zh-cn ]]; then
			ln -s zh-cn $p/zh_Hans 2>/dev/null
			echo -e "添加zh_Hans ${up} $(echo $p | awk -F/ '{print $(NF-1)}')"
		fi
	} || {
		if [[ ! -d $p/zh-cn && -d $p/zh_Hans ]]; then
			ln -s zh_Hans $p/zh-cn 2>/dev/null
			echo -e "添加zh-cn ${up} $(echo $p | awk -F/ '{print $(NF-1)}')"
		fi
	}
done

make defconfig

DEVICE_NAME=$(grep '^CONFIG_TARGET.*DEVICE.*=y' .config | sed -r 's/.*DEVICE_(.*)=y/\1/')
# echo "FREE_UP_DISK=true" >>$GITHUB_ENV #增加容量
# echo "SSH_ACTIONS=true" >> $GITHUB_ENV #SSH后台
# echo "UPLOAD_PACKAGES=true" >> $GITHUB_ENV
# echo "UPLOAD_SYSUPGRADE=true" >> $GITHUB_ENV
# echo "UPLOAD_BIN_DIR=true" >> $GITHUB_ENV
# echo "UPLOAD_FIRMWARE=true" >> $GITHUB_ENV
echo "UPLOAD_COWTRANSFER=false" >>$GITHUB_ENV
# echo "UPLOAD_WETRANSFER=true" >> $GITHUB_ENV
echo "BUILD_NPROC=7" >>$GITHUB_ENV
[[ "$TARGET" == "ramips" ]] && echo "FIRMWARE_TYPE=sysupgrade" >>$GITHUB_ENV
[[ "$TARGET" == "brcm47xx" ]] && echo "FIRMWARE_TYPE=n16" >>$GITHUB_ENV && echo "DEVICE_NAME=Asus-RT-N16" >>$GITHUB_ENV
if [[ "$TARGET" == "x86" ]]; then
	echo "FIRMWARE_TYPE=squashfs" >>$GITHUB_ENV
	echo -e "当前的机型${cc} x86_64${ce}"
else
	echo -e "当前的机型${cc} $DEVICE_NAME${ce}"
fi

echo -e "${cg}脚本运行完成${ce}"
