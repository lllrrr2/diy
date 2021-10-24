#/bin/bash

ansi_red="\033[1;31m"    # 红色字体
ansi_white="\033[1;37m"  # 白色字体
ansi_green="\033[1;32m"  # 绿色字体
ansi_yellow="\033[1;33m" # 黄色字体
ansi_blue="\033[1;34m"   # 蓝色字体
ansi_bell="\007"         # 响铃提示
ansi_blink="\033[5m"     # 半透明背景填充
ansi_std="\033[m"        # 常规无效果，作为后缀
ansi_rev="\033[7m"       # 白色背景填充
ansi_ul="\033[4m"        # 下划线

# REPO_URL="https://github.com/coolsnowwolf/lede"
REPO_URL="https://github.com/Lienol/openwrt"
# REPO_URL="https://github.com/Lienol/openwrt -b 19.07"

git clone -q $REPO_URL openwrt
cd openwrt
./scripts/feeds update -a 1>/dev/null 2>&1
./scripts/feeds install -a 1>/dev/null 2>&1

cat > .config <<-EOF
	## target
	# CONFIG_TARGET_x86=y
	# CONFIG_TARGET_x86_64=y
	# CONFIG_TARGET_ROOTFS_PARTSIZE=850
	CONFIG_TARGET_ramips=y
	CONFIG_TARGET_ramips_mt7621=y
	CONFIG_TARGET_ramips_mt7621_DEVICE_d-team_newifi-d2=y
	# CONFIG_TARGET_ramips_mt7621_DEVICE_phicomm_k2p=y
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
	CONFIG_PACKAGE_luci-app-passwall=y
	CONFIG_PACKAGE_luci-app-rebootschedule=y
	CONFIG_PACKAGE_luci-app-ssr-plus=y
	CONFIG_PACKAGE_luci-app-ttyd=y
	CONFIG_PACKAGE_luci-app-upnp=y
	## luci theme
	CONFIG_PACKAGE_luci-theme-material=y
	## remove
	# CONFIG_VMDK_IMAGES is not set
	# CONFIG_PACKAGE_luci-app-unblockmusic is not set
	# CONFIG_PACKAGE_luci-app-xlnetacc is not set
	# CONFIG_PACKAGE_luci-app-uugamebooster is not set
	## CONFIG_GRUB_EFI_IMAGES is not set
	# Libraries
	CONFIG_PACKAGE_patch=y
	CONFIG_PACKAGE_diffutils=y
	CONFIG_PACKAGE_default-settings=y
	CONFIG_TARGET_IMAGES_GZIP=y
EOF
TARGET=$(awk '/^CONFIG_TARGET/{print $1;exit;}' .config | sed -r 's/.*TARGET_(.*)=y/\1/')
DEVICE_NAME=$(grep '^CONFIG_TARGET.*DEVICE.*=y' .config | sed -r 's/.*DEVICE_(.*)=y/\1/')
config_generate="package/base-files/files/bin/config_generate"

clone_url() {
	for x in $@; do
		if [[ "$(echo $x | grep "^http")" ]]; then
			k="$(find . -maxdepth 4 -type d -name ${x##*/})"
			for g in $k; do [[ -d $g && ${g##*/} != "build" ]] && rm -rf $g; [[ $? -eq "0" ]] && p="1"; done
			if [[ $(echo $x | egrep -c "trunk|branches") -eq "0" ]]; then
				git clone -q $x package/A/${x##*/}
				[[ $? -eq "0" ]] && f="1"
			else
				svn export -q --force $x package/A/${x##*/}
				[[ $? -eq "0" ]] && f="1"
			fi
			[[ $f -eq $p ]] && echo -e "${x##*/} ${ansi_blue}替换完成 ${ansi_std}"
			[[ $f -gt $p ]] && echo -e "${x##*/} ${ansi_green}拉取完成 ${ansi_std}"
			[[ $f -lt $p ]] && echo -e "${x##*/} ${ansi_red}替换失败 ${ansi_std}"
			unset -v p f
		fi
	done
}

_packages() {
	for z in $@; do
		[[ $(echo $z | grep -v "^#") ]] && echo "CONFIG_PACKAGE_$z=y" >> .config
	done
}

echo -e "${ansi_yellow}修改设置${ansi_std}"
wget -q -O package/base-files/files/etc/banner git.io/JoNK8
m=$(echo $REPO_URL | cut -d/ -f4)
[[ "$m" == "coolsnowwolf" ]] && m="lean"
sed -i "/DISTRIB_DESCRIPTION/{s/'$/-$(date +%Y年%m月%d日)'/}" package/*/*/*/openwrt_release
sed -i "/IMG_PREFIX:/ {s/=/=$m-\$(shell date +%m%d-%H%M -d +8hour)-/}" include/image.mk
sed -i "s/option enabled.*/option enabled 1/" feeds/*/*/*/*/upnpd.config
sed -i "{
		/upnp/d
		/banner/d
		/openwrt_release/d
		s|zh_cn|zh_cn\nuci set luci.main.mediaurlbase=/luci-static/bootstrap|
		s/V4UetPzk$CYXluq4wUazHjmCDBCqXF.:0/RysBCijW$wIxPNkj9Ht9WhglXAXo4w0:18206/
		s^.*shadow$^sed -i 's/root::0:0:99999:7:::/root:\$1\$RysBCijW\$wIxPNkj9Ht9WhglXAXo4w0:18206:0:99999:7:::/g' /etc/shadow\nsed -i 's/ Mod by Lienol//g' /usr/lib/lua/luci/version.lua\n[ -f '/bin/bash' ] \&\& sed -i 's|root:x:0:0:root:/root:/bin/ash|root:x:0:0:root:/root:/bin/bash|g' /etc/passwd^
		}" $(find package/ -type f -name "zzz-default-settings")

clone_url "
	https://github.com/fw876/helloworld
	https://github.com/xiaorouji/openwrt-passwall
	https://github.com/destan19/OpenAppFilter
	https://github.com/jerrykuku/luci-app-vssr
	https://github.com/jerrykuku/lua-maxminddb
	https://github.com/jerrykuku/luci-app-jd-dailybonus
	https://github.com/zzsj0928/luci-app-pushbot
	https://github.com/small-5/luci-app-adblock-plus
	https://github.com/hong0980/build/trunk/axel
	https://github.com/hong0980/build/trunk/luci-app-bridge
	https://github.com/hong0980/build/trunk/luci-app-cowb-speedlimit
	https://github.com/hong0980/build/trunk/luci-app-rebootschedule
	https://github.com/hong0980/build/trunk/luci-app-network-settings
	https://github.com/hong0980/build/trunk/luci-app-poweroff
	https://github.com/hong0980/build/trunk/luci-app-softwarecenter
	#https://github.com/hong0980/build/trunk/luci-app-diskman
	#https://github.com/hong0980/build/trunk/luci-app-dockerman
	https://github.com/hong0980/build/trunk/luci-app-filebrowser
	https://github.com/vernesong/OpenClash/trunk/luci-app-openclash
	#https://github.com/immortalwrt/packages/trunk/libs/libcryptopp
	https://github.com/lisaac/luci-app-diskman/trunk/applications/luci-app-diskman
	https://github.com/lisaac/luci-lib-docker/trunk/collections/luci-lib-docker
	https://github.com/lisaac/luci-app-dockerman/trunk/applications/luci-app-dockerman
	#https://github.com/zaiyuyishiyoudu/luci-app-kickass/trunk/luci-app-kickass
"
# https://github.com/immortalwrt/luci/branches/openwrt-21.02/applications/luci-app-ttyd ##使用分支

[[ "$(echo $REPO_URL | grep -c 'Lienol')" -eq "1" ]] && {
	clone_url "
	https://github.com/coolsnowwolf/lede/trunk/package/lean/redsocks2
	https://github.com/coolsnowwolf/lede/trunk/package/lean/luci-app-easymesh
	#https://github.com/openwrt/routing/branches/openwrt-19.07/batman-adv
	"
}

if [[ $TARGET == "x86" ]]; then
	_packages "
	luci-app-amule
	luci-app-qbittorrent
	luci-app-smartdns
	luci-app-dockerman
	luci-app-adbyby-plus
	luci-app-openclash
	luci-app-poweroff
	luci-app-netdata
	nano lsscsi pciutils lscpu lsusb screen bash htop ariang webui-aria2

	#USB3.0支持
	kmod-usb2
	kmod-usb2-pci
	kmod-usb3
	kmod-usb-audio
	kmod-usb-printer

	#nfs
	kmod-fs-nfsd
	kmod-fs-nfs
	kmod-fs-nfs-v4

	#3G/4G_Support
	kmod-usb-serial
	kmod-usb-serial-option
	kmod-usb-serial-wwan
	kmod-mii
	kmod-usb-acm

	#Sound_Support
	kmod-sound-core
	kmod-sound-hda-core
	kmod-sound-hda-codec-realtek
	kmod-sound-hda-codec-via
	kmod-sound-hda-intel
	kmod-sound-hda-codec-hdmi

	#USB_net_driver
	kmod-rtlwifi
	kmod-rtlwifi-btcoexist
	kmod-rtlwifi-usb
	kmod-rtl8812au-ac
	usb-modeswitch
	kmod-rtl8192cu
	kmod-rtl8821cu
	kmod-mt76
	kmod-mt76x2u
	kmod-usb-net-asix
	kmod-usb-net-asix-ax88179
	kmod-usb-net-rtl8152-vendor
	kmod-usb-net-rndis
	kmod-usb-net-cdc-ether

	#docker
	kmod-fs-btrfs
	kmod-dm
	kmod-br-netfilter
	kmod-ikconfig
	kmod-nf-conntrack-netlink
	kmod-nf-ipvs
	kmod-veth
	kmod-dummy

	#x86
	kmod-usb-hid
	qemu-ga
	lm-sensors-detect
	kmod-bonding
	kmod-mmc-spi
	kmod-sdhci
	kmod-vmxnet3
	kmod-igbvf
	kmod-ixgbevf
	kmod-ixgbe
	kmod-pcnet32
	kmod-r8125
	kmod-r8168
	kmod-8139cp
	kmod-8139too
	kmod-rtl8xxxu
	kmod-i40e
	kmod-i40evf
	kmod-ath10k
	kmod-rt2800-usb
	kmod-mlx4-core
	kmod-mlx5-core
	kmod-alx
	kmod-tulip
	kmod-tg3
	kmod-fs-ntfs
	ath10k-firmware-qca9888
	ath10k-firmware-qca988x
	ath10k-firmware-qca9984
	brcmfmac-firmware-43602a1-pcie
	kmod-sound-i8x0
	kmod-sound-via82xx
	alsa-utils
	kmod-iwlwifi
	snmpd
	acpid
	blkid
	smartmontools
	irqbalance
	kmod-drm-ttm
	"

	sed -i "s/192.168.1.1/192.168.2.150/" $config_generate

	if [[ $(awk -F= '/PKG_VERSION:/{print $2}' feeds/*/*/netdata/Makefile) == "1.30.1" ]]; then
		rm feeds/*/*/netdata/patches/*web*
		wget -q -O feeds/packages/admin/netdata/patches/009-web_gui_index.html.patch git.io/JoNoj
	fi
fi

if [[ "$DEVICE_NAME" == "phicomm_k2p" ]]; then
	sed -i "s/OpenWrt/PHICOMM_K2P/" $config_generate
else
	sed -i "s/192.168.1.1/192.168.2.1/" $config_generate
	[[ -n "$DEVICE_NAME" ]] && sed -i "s/OpenWrt/Newifi/" $config_generate
	clone_url "
	https://github.com/hong0980/packages/trunk/net/aria2
	https://github.com/hong0980/luci/trunk/applications/luci-app-aria2
	https://github.com/hong0980/packages/trunk/net/ariang
	https://github.com/hong0980/packages/trunk/net/transmission
	https://github.com/hong0980/luci/trunk/applications/luci-app-transmission
	https://github.com/hong0980/packages/trunk/net/transmission-web-control
	"
	_packages "
	autosamba automount kmod-rtl8187 kmod-rt2500-usb axel
	luci-app-aria2
	luci-app-transmission
	luci-app-vssr
	luci-app-diskman
	luci-app-usb-printer
	luci-app-softwarecenter
	luci-app-cifs-mount
	luci-app-hd-idle
	luci-app-smartinfo
	luci-app-kickass
	luci-app-pushbot
	luci-app-control-weburl
	"
fi

if [[ -d package/A/luci-app-dockerman ]]; then
	for i in $(find package/A/luci-app-dockerman -name "*.lua" -o -name "*.htm"); do
		if [[ $(egrep -c 'admin/docker|admin", "docker|admin","docker|admin\\/docker' $i) -ge "1" ]]; then
			sed -e '{
			s|admin/docker|admin/services/docker|g
			s|admin\\/docker|admin\\/services\\/docker|g
			s|admin","docker|admin", "services", "docker|g
			s|admin", "docker|admin", "services", "docker|g
			}' $i -i
		fi
	done
	sed -i '{
	s|"config")|"overview")|
	s|Configuration"), 8|Configuration"), 2|
	s|Overview"), 2|Overview"), 1|
	}' package/*/*/*/controller/dockerman.lua
	sed -i 's/default_config.advance or //' package/*/*/*/*/*/dockerman/newcontainer.lua
fi

if [[ -d package/A/luci-app-diskman ]]; then
	for m in $(find package/A/luci-app-diskman -name "*.lua" -o -name "*.htm"); do
		if [[ $(egrep -c '/system/|"system"' $m) -ge "1" ]]; then
			sed -e '{
			s|/system/|/nas/|g
			s|"system"|"nas"|g
			}' $m -i
		fi
	done
fi
# cat config_b >.config
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
[[ $TARGET == "x86" ]] && echo "FIRMWARE_TYPE=squashfs" >>$GITHUB_ENV
echo "BUILD_NPROC=6" >>$GITHUB_ENV

echo -e "${ansi_green}脚本运行完成${ansi_std}"
