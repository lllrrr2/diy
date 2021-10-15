#/bin/bash

ansi_red="\033[1;31m";            # 红色字体
ansi_white="\033[1;37m";          # 白色字体
ansi_green="\033[1;32m";          # 绿色字体
ansi_yellow="\033[1;33m";         # 黄色字体
ansi_blue="\033[1;34m";           # 蓝色字体
ansi_bell="\007";                 # 响铃提示
ansi_blink="\033[5m";             # 半透明背景填充
ansi_std="\033[m";                # 常规无效果，作为后缀
ansi_rev="\033[7m";               # 白色背景填充
ansi_ul="\033[4m";                # 下划线

REPO_URL=https://github.com/immortalwrt/immortalwrt
REPO_BRANCH=openwrt-21.02
# REPO_BRANCH=openwrt-18.06
# REPO_BRANCH=openwrt-18.06-dev
# REPO_BRANCH=openwrt-18.06-k5.4

[[ $REPO_BRANCH ]] && cmd="-b $REPO_BRANCH"
git clone --depth 1 $REPO_URL $cmd openwrt
cd openwrt
./scripts/feeds update -a 1>/dev/null 2>&1
./scripts/feeds install -a 1>/dev/null 2>&1

cat >config_b <<-EOF
	## target
	CONFIG_TARGET_x86=y
	CONFIG_TARGET_x86_64=y
	CONFIG_TARGET_ROOTFS_PARTSIZE=900
	# CONFIG_TARGET_ramips=y
	# CONFIG_TARGET_ramips_mt7621=y
	# CONFIG_TARGET_ramips_mt7621_DEVICE_d-team_newifi-d2=y
	CONFIG_KERNEL_BUILD_USER="win3gp"
	CONFIG_KERNEL_BUILD_DOMAIN="OpenWrt"
	## luci app
	## luci theme
	CONFIG_PACKAGE_luci-theme-material=y
	## remove
	# CONFIG_VMDK_IMAGES is not set
	## CONFIG_GRUB_EFI_IMAGES is not set
	# Libraries
	CONFIG_TARGET_IMAGES_GZIP=y
	CONFIG_BRCMFMAC_SDIO=y
	CONFIG_LUCI_LANG_en=y
	CONFIG_LUCI_LANG_zh_Hans=y
	CONFIG_DEFAULT_SETTINGS_OPTIMIZE_FOR_CHINESE=y
EOF
TARGET=$(awk '/^CONFIG_TARGET/{print $1;exit;}' config_b | sed -r 's/.*TARGET_(.*)=y/\1/')

echo "FREE_UP_DISK=true" >> $GITHUB_ENV #增加容量
# echo "SSH_ACTIONS=true" >> $GITHUB_ENV #SSH后台
# echo "UPLOAD_PACKAGES=true" >> $GITHUB_ENV
# echo "UPLOAD_SYSUPGRADE=true" >> $GITHUB_ENV
# echo "UPLOAD_BIN_DIR=true" >> $GITHUB_ENV
# echo "UPLOAD_FIRMWARE=true" >> $GITHUB_ENV
echo "UPLOAD_COWTRANSFER=false" >> $GITHUB_ENV
# echo "UPLOAD_WETRANSFER=true" >> $GITHUB_ENV
[[ $TARGET == "x86" ]] && echo "FIRMWARE_TYPE=squashfs" >>$GITHUB_ENV

echo -e "${ansi_yellow}替换banner${ansi_std}"
wget -q -O package/base-files/files/etc/banner https://git.io/JoNK8

echo -e "${ansi_yellow}修改设置${ansi_std}"
sed -i "{
s/192.168.1.1/192.168.2.150/
s/ImmortalWrt/OpenWrt/
}" package/*/*/bin/config_generate
sed -i "/DISTRIB_DESCRIPTION/{s/'$/-$(date +%Y年%m月%d日)'/}" package/*/*/etc/openwrt_release
sed -i '/IMG_PREFIX:/ {s/=/=\$(shell date +%Y-%m%d-%H%M -d +8hour)-/}' include/image.mk
sed -i 's/ImmortalWrt/OpenWrt/' include/version.mk
# s,.*banner$,for p in \`ls /etc/init.d/*\`; do [ -x \$p ] || chmod +x \$p; done,
sed -i "{
s,.*banner$,chmod +x /etc/init.d/*,
/upnp/d
/99999/d
s/auto/zh_cn\nuci set luci.main.mediaurlbase=\/luci-static\/bootstrap/
}" package/*/*/*/zzz-default-settings

clone_url() {
	for x in $@; do
		x="$(echo $x | grep -v "^#")"
		if [ $x ]; then
			k="$(find feeds/ -maxdepth 4 -type d -name ${x##*/})"
			[[ -d $k && ${x##*/} != "build" ]] && rm -rf $k
			[[ $? -eq "0" ]] && p="1"
			[[ $(echo $x | grep -c "trunk|branches") -eq "0" ]] && {
				git clone $x package/${x##*/} 1>/dev/null 2>&1
				[[ $? -eq "0" ]] && f="1"
			} || {
				svn export --force $x package/${x##*/} 1>/dev/null 2>&1
				[[ $? -eq "0" ]] && f="1"
			}
			[[ $f -eq $p ]] && echo -e "${x##*/} ${ansi_green}替换完成 ${ansi_std}"
			[[ $f -gt $p ]] && echo -e "${x##*/} ${ansi_green}拉取完成 ${ansi_std}"
			[[ $f -lt $p ]] && echo -e "${x##*/} ${ansi_red}替换失败 ${ansi_std}"
			unset -v p f
		fi
	done
}

clone_url "
https://github.com/hong0980/build
https://github.com/jerrykuku/luci-app-vssr
#https://github.com/jerrykuku/luci-theme-argon
#https://github.com/jerrykuku/luci-app-argon-config
https://github.com/zzsj0928/luci-app-pushbot
https://github.com/small-5/luci-app-adblock-plus
https://github.com/fw876/helloworld/trunk/luci-app-ssr-plus
https://github.com/vernesong/OpenClash/trunk/luci-app-openclash
https://github.com/xiaorouji/openwrt-passwall/trunk/luci-app-passwall
https://github.com/coolsnowwolf/lede/trunk/package/lean/luci-app-adbyby-plus
https://github.com/zaiyuyishiyoudu/luci-app-kickass/trunk/luci-app-kickass
https://github.com/lisaac/luci-app-diskman/trunk/applications/luci-app-diskman
https://github.com/lisaac/luci-lib-docker/trunk/collections/luci-lib-docker
https://github.com/lisaac/luci-app-dockerman/trunk/applications/luci-app-dockerman
"
# https://github.com/immortalwrt/luci/branches/openwrt-21.02/applications/luci-app-ttyd ## 分支

rm -rf package/build/{luci-app-dockerman,luci-lib-docker,luci-app-diskman,luci-app-qbittorrent,luci-app-cpulimit}
rm -rf feeds/luci/*/{luci-app-filebrowser}

echo -e "${ansi_yellow}修改 target/linux/$TARGET/Makefile${ansi_std}"
packages="
default-settings autosamba kmod-rtl8187 kmod-rt2500-usb diffutils patch
luci-app-aria2
luci-app-transmission
luci-app-ssr-plus
luci-app-passwall
luci-app-adblock-plus
luci-app-bridge
luci-app-ddnsto
luci-app-cowbping
luci-app-rebootschedule
luci-app-network-settings
luci-app-filebrowser
luci-app-accesscontrol
luci-app-appfilter
luci-app-cpulimit
luci-app-diskman
luci-app-usb-printer
luci-app-cowb-speedlimit
luci-app-softwarecenter
luci-app-ttyd
luci-app-cifs-mount
luci-app-hd-idle
luci-app-filetransfer
luci-app-oaf
luci-app-smartinfo
luci-app-kickass
luci-app-upnp
luci-app-pushbot
luci-app-control-weburl
luci-app-qos-gargoyle
"
# packages=""
zz=target/linux/$TARGET/Makefile

for x in $packages; do
	[[ "$(grep -c $x $zz)" -eq "0" ]] && {
		[[ "$(grep DEFAULT_PACKAGES $zz | grep -c '\\')" -eq "0" ]] && {
			sed -i "/DEFAULT_PACKAGES/ {s/$/ $x/}" $zz
		} || {
			sed -i "/DEFAULT_PACKAGES/ {s/\\\/$x \\\/}" $zz
		}
	} || {
		echo -e "$x ${ansi_red}重复${ansi_std}"
	}
done

grep DEFAULT_PACKAGES $zz

if [[ $TARGET == "x86" ]]; then
	package="
luci-app-amule
luci-app-qbittorrent
luci-app-smartdns
luci-app-dockerman
luci-app-adbyby-plus
luci-app-openclash
luci-app-vssr
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

	for z in $package; do
		[ $(echo $z | grep "^\#") ] || echo "CONFIG_PACKAGE_$z=y" >>config_b
	done

	[ $(awk -F= '/PKG_VERSION:/{print $2}' feeds/*/*/netdata/Makefile) = "1.30.1" ] && {
		rm feeds/*/*/netdata/patches/*web*
		wget -q -O feeds/packages/admin/netdata/patches/009-web_gui_index.html.patch https://git.io/JoNoj
	}
else
	sed -i 's/192.168.2.150/192.168.2.1/' package/*/*/bin/config_generate
fi

if [[ "$REPO_BRANCH" == "openwrt-21.02" ]]; then
	sed -i 's/services/nas/' feeds/luci/*/*/*/usr/*/*/menu.d/*transmission.json
	sed -i 's/^ping/-- ping/g' package/*/*/*/model/*/bridge.lua
	sed -i "s/luci-app-smartinfo//" $zz
else
	clone_url "
https://github.com/hong0980/packages/trunk/net/aria2
https://github.com/hong0980/luci/trunk/applications/luci-app-aria2
https://github.com/hong0980/packages/trunk/net/ariang
https://github.com/hong0980/packages/trunk/net/transmission
https://github.com/hong0980/luci/trunk/applications/luci-app-transmission
https://github.com/hong0980/packages/trunk/net/transmission-web-control
"
	# echo -e "CONFIG_PACKAGE_luci-app-argon-config=y\nCONFIG_PACKAGE_luci-theme-argon=y" >>config_b
fi

if [ -d package/luci-app-dockerman ]; then
	for i in `find package/luci-app-dockerman -name "*.lua" -o -name "*.htm"`; do
		if [ $(egrep -c 'admin/docker|admin", "docker|admin","docker|admin\\/docker' $i 2>/dev/null) -ge "1" ]; then
			sed -e '{
			s|admin/docker|admin/services/docker|g
			s|admin\\/docker|admin\\/services\\/docker|g
			s|admin","docker|admin", "services", "docker|g
			s|admin", "docker|admin", "services", "docker|g
			}' $i -i
			# echo "修改了$i"
		fi
	done

	sed -i '{
	s|"config")|"overview")|
	s|Configuration"), 8|Configuration"), 2|
	s|Overview"), 2|Overview"), 1|
	}' package/*/*/controller/dockerman.lua

	sed -i 's/default_config.advance or //' package/*/*/*/*/dockerman/newcontainer.lua
fi

if [ -d package/luci-app-diskman ]; then
	for m in $(find package/luci-app-diskman -name "*.lua" -o -name "*.htm"); do
		if [ $(egrep -c '/system/|"system"' $m 2>/dev/null) -ge "1" ]; then
			sed -e '{
			s|/system/|/nas/|g
			s|"system"|"nas"|g
			}' $m -i
			echo "修改了$m"
		fi
	done
fi

for p in $(find package/ -maxdepth 4 -type d -name "po"); do
	[[ "$REPO_BRANCH" == "openwrt-21.02" ]] && {
		if [[ ! -d $p/zh_Hans && -d $p/zh-cn ]]; then
			ln -s zh-cn $p/zh_Hans 2>/dev/null
			echo -e "$p ${ansi_green}添加zh_Hans成功！${ansi_std}"
		fi
	} || {
		if [[ ! -d $p/zh-cn && -d $p/zh_Hans ]]; then
			ln -s zh_Hans $p/zh-cn 2>/dev/null
			echo -e "$p ${ansi_green}添加zh-cn成功！${ansi_std}"
		fi
	}
done
cat config_b >>.config
echo -e "${ansi_green}脚本运行完成${ansi_std}"
