#!/usr/bin/env bash
# set -x

[[ x$REPO_FLODER = x ]] && \
(REPO_FLODER="openwrt" && echo "REPO_FLODER=openwrt" >>$GITHUB_ENV)
[[ $TARGET_DEVICE = phicomm_k2p ]] && VERSION=pure
[[ $VERSION ]] || VERSION=plus

color() {
	case $1 in
		cy)
		echo -e "\033[1;33m$2\033[0m"
		;;
		cr)
		echo -e "\033[1;31m$2\033[0m"
		;;
		cg)
		echo -e "\033[1;32m$2\033[0m"
		;;
		cb)
		echo -e "\033[1;34m$2\033[0m"
		;;
	esac
}

status() {
	CHECK=$?
	END_TIME=$(date '+%H:%M:%S')
	_date=" ==>用时 $(($(date +%s -d "$END_TIME") - $(date +%s -d "$BEGIN_TIME"))) 秒"
	[[ $_date =~ [0-9]+ ]] || _date=""
	if [ $CHECK = 0 ]; then
		printf "%35s %s %s %s %s %s %s\n" \
		`echo -e "[ $(color cg ✔)\033[0;39m ]${_date}"`
	else
		printf "%35s %s %s %s %s %s %s\n" \
		`echo -e "[ $(color cr ✕)\033[0;39m ]${_date}"`
	fi
}

_packages() {
	for z in $@; do
		[[ "$(grep -v '^#' <<<$z)" ]] && echo "CONFIG_PACKAGE_$z=y" >> .config
	done
}

_printf() {
	awk '{printf "%s %-40s %s %s %s\n" ,$1,$2,$3,$4,$5}'
}

clone_url() {
	for x in $@; do
		if [[ "$(grep "^https" <<<$x | grep -Ev "helloworld|pass|build")" ]]; then
			g=$(find package/ feeds/ -maxdepth 6 -type d -name ${x##*/} 2>/dev/null)
			if ([[ -d "$g" ]] && rm -rf $g); then
				p="1"; k="$g"
			else
				p="0"; k="package/A/${x##*/}"
			fi

			if [[ "$(grep -E "trunk|branches" <<<$x)" ]]; then
				if svn export -q --force $x $k; then
					f="1"
				fi
			else
				if git clone -q $x $k; then
					f="1"
				fi
			fi
			[[ x$f = x ]] && echo -e "$(color cr 拉取) ${x##*/} [ $(color cr ✕) ]" | _printf
			[[ $f -lt $p ]] && echo -e "$(color cr 替换) ${x##*/} [ $(color cr ✕) ]" | _printf
			[[ $f = $p ]] && \
				echo -e "$(color cg 替换) ${x##*/} [ $(color cg ✔) ]" | _printf || \
				echo -e "$(color cb 添加) ${x##*/} [ $(color cb ✔) ]" | _printf
			unset -v p f k
		else
			for w in $(grep "^https" <<<$x); do
				if git clone -q $w ../${w##*/}; then
					for x in `ls -l ../${w##*/} | awk '/^d/{print $NF}' | grep -Ev '*pulimit|*dump|*dtest|*Deny|*dog|*ding'`; do
						g=$(find package/ feeds/ -maxdepth 5 -type d -name $x 2>/dev/null)
						if ([[ -d "$g" ]] && rm -rf $g); then
							k="$g"
						else
							k="package/A"
						fi

						if mv -f ../${w##*/}/$x $k; then
							[[ $k = $g ]] && \
							echo -e "$(color cg 替换) ${x##*/} [ $(color cg ✔) ]" | _printf || \
							echo -e "$(color cb 添加) ${x##*/} [ $(color cb ✔) ]" | _printf
						fi
						unset -v p k
					done
				fi
				rm -rf ../${w##*/}
			done
		fi
	done
}

REPO_URL=https://github.com/immortalwrt/immortalwrt
[[ $REPO_BRANCH ]] && cmd="-b $REPO_BRANCH" || cmd="-b openwrt-18.06-k5.4"

echo -e "$(color cy 当前的机型) $(color cb ${REPO_BRANCH}-${TARGET_DEVICE}-${VERSION})"
echo -e "$(color cy '拉取源码....')\c"
BEGIN_TIME=$(date '+%H:%M:%S')
git clone -q $REPO_URL $cmd $REPO_FLODER
status

cd $REPO_FLODER || exit
echo -e "$(color cy '更新软件....')\c"
BEGIN_TIME=$(date '+%H:%M:%S')
./scripts/feeds update -a 1>/dev/null 2>&1
status

echo -e "$(color cy '安装软件....')\c"
BEGIN_TIME=$(date '+%H:%M:%S')
./scripts/feeds install -a 1>/dev/null 2>&1
status

: >.config
[ $PARTSIZE ] || PARTSIZE=900
case "$TARGET_DEVICE" in
	"x86_64")
		cat >.config<<-EOF
		CONFIG_TARGET_x86=y
		CONFIG_TARGET_x86_64=y
		CONFIG_TARGET_ROOTFS_PARTSIZE=$PARTSIZE
		CONFIG_BUILD_NLS=y
		CONFIG_BUILD_PATENTED=y
		EOF
	;;
	"r4s"|"r2c"|"r2r")
		cat<<-EOF >.config
		CONFIG_TARGET_rockchip=y
		CONFIG_TARGET_rockchip_armv8=y
		CONFIG_TARGET_rockchip_armv8_DEVICE_friendlyarm_nanopi-$TARGET_DEVICE=y
		CONFIG_TARGET_ROOTFS_PARTSIZE=$PARTSIZE
		CONFIG_BUILD_NLS=y
		CONFIG_BUILD_PATENTED=y
		EOF
	;;
	"r1-plus-lts"|"r1-plus")
		cat<<-EOF >.config
		CONFIG_TARGET_rockchip=y
		CONFIG_TARGET_rockchip_armv8=y
		CONFIG_TARGET_rockchip_armv8_DEVICE_xunlong_orangepi-$TARGET_DEVICE=y
		CONFIG_TARGET_ROOTFS_PARTSIZE=$PARTSIZE
		EOF
	;;
	"newifi-d2")
		cat >.config<<-EOF
		CONFIG_TARGET_ramips=y
		CONFIG_TARGET_ramips_mt7621=y
		CONFIG_TARGET_ramips_mt7621_DEVICE_d-team_newifi-d2=y
		EOF
	;;
	"phicomm_k2p")
		cat >.config<<-EOF
		CONFIG_TARGET_ramips=y
		CONFIG_TARGET_ramips_mt7621=y
		CONFIG_TARGET_ramips_mt7621_DEVICE_phicomm_k2p=y
		EOF
	;;
	"asus_rt-n16")
		if [[ "${REPO_BRANCH#*-}" = "18.06" || "${REPO_BRANCH#*-}" = "18.06-dev" ]]; then
			cat >.config<<-EOF
			CONFIG_TARGET_brcm47xx=y
			CONFIG_TARGET_brcm47xx_mips74k=y
			CONFIG_TARGET_brcm47xx_mips74k_DEVICE_asus_rt-n16=y
			EOF
		else
			cat >.config<<-EOF
			CONFIG_TARGET_bcm47xx=y
			CONFIG_TARGET_bcm47xx_mips74k=y
			CONFIG_TARGET_bcm47xx_mips74k_DEVICE_asus_rt-n16=y
			EOF
		fi
	;;
	"armvirt_64_Default")
		cat >.config<<-EOF
		CONFIG_TARGET_armvirt=y
		CONFIG_TARGET_armvirt_64=y
		CONFIG_TARGET_armvirt_64_Default=y
		EOF
	;;
esac

cat >>.config<<-EOF
	CONFIG_KERNEL_BUILD_USER="win3gp"
	CONFIG_KERNEL_BUILD_DOMAIN="OpenWrt"
	## luci app
	CONFIG_PACKAGE_luci-app-accesscontrol=y
	CONFIG_PACKAGE_luci-app-ikoolproxy=y
	CONFIG_PACKAGE_luci-app-bridge=y
	CONFIG_PACKAGE_luci-app-cowb-speedlimit=y
	CONFIG_PACKAGE_luci-app-cowbping=y
	CONFIG_PACKAGE_luci-app-cpulimit=y
	CONFIG_PACKAGE_luci-app-ddnsto=y
	CONFIG_PACKAGE_luci-app-filebrowser=y
	CONFIG_PACKAGE_luci-app-filetransfer=y
	CONFIG_PACKAGE_luci-app-network-settings=y
	CONFIG_PACKAGE_luci-app-oaf=y
	CONFIG_PACKAGE_luci-app-passwall=y
	CONFIG_PACKAGE_luci-app-rebootschedule=y
	CONFIG_PACKAGE_luci-app-ssr-plus=y
	CONFIG_PACKAGE_luci-app-ttyd=y
	CONFIG_PACKAGE_luci-app-upnp=y
	CONFIG_PACKAGE_luci-app-opkg=y
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

config_generate="package/base-files/files/bin/config_generate"
color cy "自定义设置.... "
wget -qO package/base-files/files/etc/banner git.io/JoNK8
sed -i "/DISTRIB_DESCRIPTION/ {s/'$/-immortalwrt-$(date +%Y年%m月%d日)'/}" package/*/*/*/openwrt_release
sed -i "/IMG_PREFIX:/ {s/=/=Immortal-\$(shell date +%m%d-%H%M -d +8hour)-/}" include/image.mk
sed -i 's/option enabled.*/option enabled 1/' feeds/*/*/*/*/upnpd.config
sed -i 's/option dports.*/option enabled 2/' feeds/*/*/*/*/upnpd.config
sed -i "s/ImmortalWrt/OpenWrt/" {$config_generate,include/version.mk}
sed -i "/listen_https/ {s/^/#/g}" package/*/*/*/files/uhttpd.config
sed -i "{
		/upnp/d;/banner/d
		s|auto|zh_cn\nuci set luci.main.mediaurlbase=/luci-static/bootstrap|
		s^.*shadow$^sed -i 's/root::0:0:99999:7:::/root:\$1\$RysBCijW\$wIxPNkj9Ht9WhglXAXo4w0:18206:0:99999:7:::/g' /etc/shadow^
		}" $(find package/ -type f -name "*-default-settings")

[[ -d "package/A" ]] || mkdir -m 755 -p package/A
rm -rf feeds/*/*/{luci-app-appfilter,open-app-filter}

clone_url "
	https://github.com/hong0980/build
	https://github.com/fw876/helloworld
	#https://github.com/kiddin9/openwrt-packages
	#https://github.com/xiaorouji/openwrt-passwall2
	https://github.com/xiaorouji/openwrt-passwall
	https://github.com/destan19/OpenAppFilter
	https://github.com/jerrykuku/luci-app-vssr #bash
	https://github.com/kiddin9/openwrt-bypass
	https://github.com/ntlf9t/luci-app-easymesh
	https://github.com/zzsj0928/luci-app-pushbot
	#https://github.com/small-5/luci-app-adblock-plus
	https://github.com/jerrykuku/luci-app-jd-dailybonus
	https://github.com/kiddin9/openwrt-packages/trunk/qtbase
	https://github.com/kiddin9/openwrt-packages/trunk/qttools
	https://github.com/kiddin9/openwrt-packages/trunk/luci-app-ikoolproxy
	https://github.com/kiddin9/openwrt-packages/trunk/luci-app-unblockneteasemusic
	https://github.com/coolsnowwolf/packages/trunk/net/qBittorrent
	https://github.com/ophub/luci-app-amlogic/trunk/luci-app-amlogic
	#https://github.com/coolsnowwolf/packages/trunk/utils/btrfs-progs
	#https://github.com/coolsnowwolf/packages/trunk/libs/rblibtorrent
	https://github.com/coolsnowwolf/packages/trunk/net/qBittorrent-static
	https://github.com/vernesong/OpenClash/trunk/luci-app-openclash #bash
	https://github.com/lisaac/luci-lib-docker/trunk/collections/luci-lib-docker
	https://github.com/coolsnowwolf/luci/trunk/applications/luci-app-adbyby-plus
	https://github.com/project-lede/luci-app-godproxy
	https://github.com/sundaqiang/openwrt-packages/trunk/luci-app-wolplus
	https://github.com/kuoruan/luci-app-frpc
	https://github.com/messense/aliyundrive-webdav/trunk/openwrt/aliyundrive-webdav
	https://github.com/messense/aliyundrive-webdav/trunk/openwrt/luci-app-aliyundrive-webdav
	"

# https://github.com/immortalwrt/luci/branches/openwrt-21.02/applications/luci-app-ttyd ## 分支
echo -e 'pthome.net\nchdbits.co\nhdsky.me\nwww.nicept.net\nourbits.club' | \
tee -a $(find package/A/ feeds/luci/applications/ -type f -name "white.list" -or -name "direct_host" | grep "ss") >/dev/null

# echo '<iframe src="https://ip.skk.moe/simple" style="width: 100%; border: 0"></iframe>' | \
# tee -a {$(find package/A/ feeds/luci/applications/ -type d -name "luci-app-vssr")/*/*/*/status_top.htm,$(find package/A/ feeds/luci/applications/ -type d -name "luci-app-ssr-plus")/*/*/*/status.htm,$(find package/A/ feeds/luci/applications/ -type d -name "luci-app-bypass")/*/*/*/status.htm,$(find package/A/ feeds/luci/applications/ -type d -name "luci-app-passwall")/*/*/*/global/status.htm} >/dev/null

[[ -e feeds/luci/applications/luci-app-openclash/luasrc/view/openclash/myip.htm ]] || {
	mkdir -p feeds/luci/modules/luci-mod-admin-full/luasrc/view/admin_status/openclash
	wget -qO feeds/luci/modules/luci-mod-admin-full/luasrc/view/admin_status/openclash/myip.htm \
	raw.githubusercontent.com/vernesong/OpenClash/master/luci-app-openclash/luasrc/view/openclash/myip.htm
}

[[ -e "$(find package/A/ feeds/luci/ -type d -name "luci-app-vssr")/luasrc/model/cbi/vssr/client.lua" ]] && {
	sed -i '/vssr\/status/am:section(SimpleSection).template  = "openclash\/myip"' \
	$(find package/A/ feeds/luci/ -type d -name "luci-app-vssr")/luasrc/model/cbi/vssr/client.lua
}
[[ -e "$(find package/A/ feeds/luci/ -type d -name "luci-app-ssr-plus")/luasrc/model/cbi/shadowsocksr/client.lua" ]] && {
	sed -i '/shadowsocksr\/status/am:section(SimpleSection).template  = "openclash\/myip"' \
	$(find package/A/ feeds/luci/ -type d -name "luci-app-ssr-plus")/luasrc/model/cbi/shadowsocksr/client.lua
}
[[ -e "$(find package/A/ feeds/luci/ -type d -name "luci-app-bypass")/luasrc/model/cbi/bypass/base.lua" ]] && {
	sed -i '/bypass\/status/am:section(SimpleSection).template  = "openclash\/myip"' \
	$(find package/A/ feeds/luci/ -type d -name "luci-app-bypass")/luasrc/model/cbi/bypass/base.lua
}
[[ -e "$(find package/A/ feeds/luci/ -type d -name "luci-app-passwall")/luasrc/model/cbi/passwall/client/global.lua" ]] && {
	sed -i '/global\/status/am:section(SimpleSection).template  = "openclash\/myip"' \
	$(find package/A/ feeds/luci/ -type d -name "luci-app-passwall")/luasrc/model/cbi/passwall/client/global.lua
}

cat <<-\EOF >feeds/packages/lang/python/python3/files/python3-package-uuid.mk
	define Package/python3-uuid
	$(call Package/python3/Default)
	  TITLE:=Python $(PYTHON3_VERSION) UUID module
	  DEPENDS:=+python3-light +libuuid
	endef

	$(eval $(call Py3BasePackage,python3-uuid, \
		/usr/lib/python$(PYTHON3_VERSION)/uuid.py \
		/usr/lib/python$(PYTHON3_VERSION)/lib-dynload/_uuid.$(PYTHON3_SO_SUFFIX) \
	))
EOF

sed -i 's/option dports.*/option dports 2/' feeds/luci/applications/luci-app-vssr/root/etc/config/vssr

[[ $TARGET_DEVICE = phicomm_k2p ]] || {
	_packages "
	automount autosamba axel kmod-rt2500-usb kmod-rtl8187
	luci-app-aria2
	luci-app-cifs-mount
	luci-app-control-weburl
	luci-app-diskman
	luci-app-hd-idle
	luci-app-pushbot
	luci-app-softwarecenter
	luci-app-transmission
	luci-app-usb-printer
	luci-app-vssr
	luci-app-bypass
	luci-app-openclash
	luci-theme-material
	"
	trv=`awk -F= '/PKG_VERSION:/{print $2}' feeds/packages/net/transmission/Makefile`
	wget -qO feeds/packages/net/transmission/patches/tr$trv.patch raw.githubusercontent.com/hong0980/diy/master/files/transmission/tr$trv.patch
	[[ -d package/A/qtbase ]] && rm -rf feeds/packages/libs/qt5
}

[[ "$REPO_BRANCH" == "openwrt-21.02" ]] && {
	# sed -i 's/services/nas/' feeds/luci/*/*/*/*/*/*/menu.d/*transmission.json
	sed -i 's/^ping/-- ping/g' package/*/*/*/*/*/bridge.lua
} || {
	[[ $TARGET_DEVICE == phicomm_k2p ]] || _packages "luci-app-smartinfo"
	for d in $(find feeds/ package/ -type f -name "index.htm"); do
		if grep -q "Kernel Version" $d; then
			sed -i 's|os.date(.*|os.date("%F %X") .. " " .. translate(os.date("%A")),|' $d
			sed -i '/<%+footer%>/i<fieldset class="cbi-section">\n\t<legend><%:天气%></legend>\n\t<table width="100%" cellspacing="10">\n\t\t<tr><td width="10%"><%:本地天气%></td><td > <iframe width="900" height="120" frameborder="0" scrolling="no" hspace="0" src="//i.tianqi.com/?c=code&a=getcode&id=22&py=xiaoshan&icon=1"></iframe>\n\t\t<tr><td width="10%"><%:柯桥天气%></td><td > <iframe width="900" height="120" frameborder="0" scrolling="no" hspace="0" src="//i.tianqi.com/?c=code&a=getcode&id=22&py=keqiaoqv&icon=1"></iframe>\n\t\t<tr><td width="10%"><%:指数%></td><td > <iframe width="400" height="270" frameborder="0" scrolling="no" hspace="0" src="https://i.tianqi.com/?c=code&a=getcode&id=27&py=xiaoshan&icon=1"></iframe><iframe width="400" height="270" frameborder="0" scrolling="no" hspace="0" src="https://i.tianqi.com/?c=code&a=getcode&id=27&py=keqiaoqv&icon=1"></iframe>\n\t</table>\n</fieldset>\n\n<%-\n\tlocal incdir = util.libpath() .. "/view/admin_status/index/"\n\tif fs.access(incdir) then\n\t\tlocal inc\n\t\tfor inc in fs.dir(incdir) do\n\t\t\tif inc:match("%.htm$") then\n\t\t\t\tinclude("admin_status/index/" .. inc:gsub("%.htm$", ""))\n\t\t\tend\n\t\tend\n\t\end\n-%>\n' $d
		fi
	done
}

for p in $(find package/A/ feeds/luci/applications/ -maxdepth 2 -type d -name "po" 2>/dev/null); do
	if [[ "${REPO_BRANCH#*-}" == "21.02" ]]; then
		if [[ ! -d $p/zh_Hans && -d $p/zh-cn ]]; then
			ln -s zh-cn $p/zh_Hans 2>/dev/null
			printf "%-13s %-33s %s %s %s\n" \
			$(echo -e "添加zh_Hans $(awk -F/ '{print $(NF-1)}' <<< $p) [ $(color cg ✔) ]")
		fi
	else
		if [[ ! -d $p/zh-cn && -d $p/zh_Hans ]]; then
			ln -s zh_Hans $p/zh-cn 2>/dev/null
			printf "%-13s %-33s %s %s %s\n" \
			`echo -e "添加zh-cn $(awk -F/ '{print $(NF-1)}' <<< $p) [ $(color cg ✔) ]"`
		fi
	fi
done

x=$(find package/A/ feeds/luci/applications/ -type d -name "luci-app-bypass" 2>/dev/null)
[[ -f $x/Makefile ]] && sed -i 's/default y/default n/g' "$x/Makefile"

case "$TARGET_DEVICE" in
"newifi-d2")
	DEVICE_NAME="Newifi-D2"
	_packages "luci-app-easymesh"
	FIRMWARE_TYPE="sysupgrade"
	sed -i '/openclash/d' .config
	[ $IP ] && \
	sed -i "s/192.168.1.1/$IP/" $config_generate || \
	sed -i "s/192.168.1.1/192.168.2.1/" $config_generate
	;;
"r4s"|"r2c"|"r2r"|"r1-plus-lts"|"r1-plus")
	DEVICE_NAME="$TARGET_DEVICE"
	FIRMWARE_TYPE="sysupgrade"
	[ $IP ] && \
	sed -i "s/192.168.1.1/$IP/" $config_generate || \
	sed -i "s/192.168.1.1/192.168.2.1/" $config_generate
	[[ $VERSION = plus ]] && {
	_packages "
	#luci-app-adbyby-plus
	#luci-app-adguardhome
	#luci-app-amule
	luci-app-dockerman
	luci-app-netdata
	#luci-app-jd-dailybonus
	luci-app-qbittorrent
	luci-app-smartdns
	luci-app-unblockmusic
	luci-app-cpufreq
	#luci-app-deluge
	#AmuleWebUI-Reloaded htop lscpu nano screen webui-aria2 zstd pv
	#subversion-server #unixodbc #git-http

	#USB3.0支持
	kmod-usb2 kmod-usb2-pci kmod-usb3
	kmod-fs-nfsd kmod-fs-nfs kmod-fs-nfs-v4

	#3G/4G_Support
	kmod-usb-acm kmod-usb-serial kmod-usb-ohci-pci kmod-sound-core

	#USB_net_driver
	kmod-mt76 kmod-mt76x2u kmod-rtl8821cu kmod-rtl8192cu kmod-rtl8812au-ac
	kmod-usb-net-asix-ax88179 kmod-usb-net-cdc-ether kmod-usb-net-rndis
	usb-modeswitch kmod-usb-net-rtl8152-vendor
	"
	clone_url "https://github.com/coolsnowwolf/luci/trunk/applications/luci-app-cpufreq"
	# sed -i 's/qbittorrent_dynamic:qbittorrent/qbittorrent_dynamic:qBittorrent-Enhanced-Edition/g' package/feeds/luci/luci-app-qbittorrent/Makefile
	sed -i 's/PKG_VERSION:=.*/PKG_VERSION:=4.4.1_v1.2.15/' $(find package/A/ feeds/ -type d -name "qBittorrent-static")/Makefile
		kk=$(find package/A/ feeds/luci/ -type d -name "luci-app-cpufreq")
		[[ -e "$kk/po/zh-cn/cpufreq.po" ]] && {
		sed -i '/"performance/d' $kk/po/*/cpufreq.po
		echo -e '
		msgid "powersave"
		msgstr "powersave 最低频率模式"

		msgid "performance"
		msgstr "performance 最高频率模式"

		msgid "schedutil"
		msgstr "schedutil 自动平衡模式"
		' | tee -a $kk/po/*/cpufreq.po >/dev/null
		sed -i '/governor/ s/ondemand/schedutil/' $kk/root/etc/config/cpufreq
		}
	}
	;;
"phicomm_k2p")
	DEVICE_NAME="Phicomm-K2P"
	_packages "luci-app-easymesh"
	FIRMWARE_TYPE="sysupgrade"
	[ $IP ] && \
	sed -i "s/192.168.1.1/$IP/" $config_generate || \
	sed -i "s/192.168.1.1/192.168.2.1/" $config_generate
	;;
"asus_rt-n16")
	DEVICE_NAME="Asus-RT-N16"
	FIRMWARE_TYPE="n16"
	[ $IP ] && \
	sed -i "s/192.168.1.1/$IP/" $config_generate || \
	sed -i "s/192.168.1.1/192.168.2.130/" $config_generate
	sed -i '/openclash/d' .config
	;;
"x86_64")
	DEVICE_NAME="x86_64"
	FIRMWARE_TYPE="squashfs-combined"
	[ $IP ] && \
	sed -i "s/192.168.1.1/$IP/" $config_generate || \
	sed -i "s/192.168.1.1/192.168.2.150/" $config_generate
	[[ $VERSION = plus ]] && {
	_packages "
	luci-app-adbyby-plus
	#luci-app-adguardhome
	#luci-app-amule
	luci-app-dockerman
	luci-app-netdata
	#luci-app-jd-dailybonus
	luci-app-poweroff
	luci-app-qbittorrent
	luci-app-smartdns
	luci-app-unblockneteasemusic
	luci-app-ikoolproxy
	luci-app-deluge	luci-app-godproxy
	luci-app-wolplus
	luci-app-frpc
	luci-app-aliyundrive-webdav
	#AmuleWebUI-Reloaded htop lscpu lsscsi lsusb nano pciutils screen webui-aria2 zstd tar pv
	#subversion-server #unixodbc #git-http

	#USB3.0支持
	kmod-usb2 kmod-usb2-pci kmod-usb3
	kmod-fs-nfsd kmod-fs-nfs kmod-fs-nfs-v4

	#3G/4G_Support
	kmod-usb-acm kmod-usb-serial kmod-usb-ohci-pci kmod-sound-core

	#USB_net_driver
	kmod-mt76 kmod-mt76x2u kmod-rtl8821cu kmod-rtl8192cu kmod-rtl8812au-ac
	kmod-usb-net-asix-ax88179 kmod-usb-net-cdc-ether kmod-usb-net-rndis
	usb-modeswitch kmod-usb-net-rtl8152-vendor

	#docker
	kmod-dm kmod-dummy kmod-ikconfig kmod-veth
	kmod-nf-conntrack-netlink kmod-nf-ipvs

	#x86
	acpid alsa-utils ath10k-firmware-qca9888
	ath10k-firmware-qca988x ath10k-firmware-qca9984
	brcmfmac-firmware-43602a1-pcie irqbalance
	kmod-alx kmod-ath10k kmod-bonding kmod-drm-ttm
	kmod-fs-ntfs kmod-igbvf kmod-iwlwifi kmod-ixgbevf
	kmod-mmc-spi kmod-r8168 kmod-rtl8xxxu kmod-sdhci
	kmod-tg3 lm-sensors-detect qemu-ga snmpd
	"
	# sed -i 's/||x86_64//g' feeds/luci/applications/luci-app-qbittorrent/Makefile
	sed -i 's/qbittorrent_dynamic:qbittorrent/qbittorrent_dynamic:qBittorrent-Enhanced-Edition/g' package/feeds/luci/luci-app-qbittorrent/Makefile
	sed -i 's/PKG_VERSION:=.*/PKG_VERSION:=4.4.1_v1.2.15/' $(find package/A/ feeds/ -type d -name "qBittorrent-static")/Makefile
	wget -qO package/base-files/files/bin/bpm git.io/bpm && chmod +x package/base-files/files/bin/bpm
	wget -qO package/base-files/files/bin/ansi git.io/ansi && chmod +x package/base-files/files/bin/ansi
	}
	;;
"armvirt_64_Default")
	DEVICE_NAME="armvirt-64-default"
	_packages "luci-app-easymesh"
	FIRMWARE_TYPE="armvirt-64-default-rootfs"
	sed -i '/easymesh/d' .config
	[ $IP ] && \
	sed -i "s/192.168.1.1/$IP/" $config_generate || \
	sed -i "s/192.168.1.1/192.168.2.110/" $config_generate
	[[ $VERSION = plus ]] && {
		_packages "attr bash blkid brcmfmac-firmware-43430-sdio brcmfmac-firmware-43455-sdio
		bsdtar btrfs-progs cfdisk chattr curl dosfstools e2fsprogs f2fs-tools f2fsck fdisk
		gawk getopt hostpad-common htop install-program iperf3 kmod-brcmfmac kmod-brcmutil
		kmod-cfg80211 kmod-fs-ext4 kmod-fs-vfat kmod-mac80211 kmod-rt2800-usb kmod-usb-net
		kmod-usb-net-asix-ax88179 kmod-usb-net-rtl8150 kmod-usb-net-rtl8152 kmod-usb-storage
		kmod-usb-storage-extras kmod-usb-storage-uas kmod-usb2 kmod-usb3 lm-sensors losetup
		lsattr lsblk lscpu lsscsi luci-app-adguardhome luci-app-amlogic luci-app-cpufreq
		luci-app-dockerman luci-app-ikoolproxy luci-app-qbittorrent mkf2fs ntfs-3g parted
		perl perl-http-date perlbase-getopt perlbase-time perlbase-unicode perlbase-utf8
		pigz pv python3 resize2fs tune2fs unzip uuidgen wpa-cli wpad wpad-basic xfs-fsck
		xfs-mkfs luci-app-easymesh"
		echo "CONFIG_PERL_NOCOMMENT=y" >>.config

		sed -i "s/default 160/default $PARTSIZE/" config/Config-images.in
		sed -i 's/@arm/@TARGET_armvirt_64/g' $(find package/A/ feeds/ -type d -name "luci-app-cpufreq")/Makefile
		sed -e 's/services/system/; s/00//' $(find package/A/ feeds/ -type d -name "luci-app-cpufreq")/luasrc/controller/cpufreq.lua -i
	}
	;;
esac

echo -e "$(color cy '更新配置....')\c"
BEGIN_TIME=$(date '+%H:%M:%S')
make defconfig 1>/dev/null 2>&1
status

# echo "SSH_ACTIONS=true" >>$GITHUB_ENV #SSH后台
# echo "UPLOAD_PACKAGES=false" >>$GITHUB_ENV
# echo "UPLOAD_SYSUPGRADE=false" >>$GITHUB_ENV
echo "UPLOAD_BIN_DIR=false" >>$GITHUB_ENV
# echo "UPLOAD_FIRMWARE=false" >>$GITHUB_ENV
echo "UPLOAD_COWTRANSFER=false" >>$GITHUB_ENV
# echo "UPLOAD_WETRANSFER=false" >> $GITHUB_ENV
echo "CACHE_ACTIONS=true" >> $GITHUB_ENV
echo "DEVICE_NAME=$DEVICE_NAME" >>$GITHUB_ENV
echo "FIRMWARE_TYPE=$FIRMWARE_TYPE" >>$GITHUB_ENV
echo "ARCH=`awk -F'"' '/^CONFIG_TARGET_ARCH_PACKAGES/{print $2}' .config`" >>$GITHUB_ENV

echo -e "\e[1;35m脚本运行完成！\e[0m"
