#!/usr/bin/env bash
# set -x
[[ x$REPO_FLODER = x ]] && \
(REPO_FLODER="openwrt" && echo "REPO_FLODER=openwrt" >>$GITHUB_ENV)

# shopt -s extglob expand_aliases
# shopt -os emacs histexpand history monitor
# echo -E "1)字符后移70$(echo -en "\033[70G[ " && echo -e "ok ]")"
# echo -E "2)字符后移70$(printf "\033[70G[ ok ]\n")"

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

# status() {
  # local CHECK=$?
  # echo -en "\\033[70G[ "
  # if [ $CHECK = 0 ]; then
    # echo -en "\\033[1;33mOK"
  # else
    # echo -en "\\033[1;31mFailed"
  # fi
  # echo -e "\\033[0;39m ]"
# }

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
			g=$(find package/ feeds/ -maxdepth 3 -type d -name ${x##*/} 2>/dev/null)
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
			[[ $f = "" ]] && echo -e "$(color cr 拉取) ${x##*/} [ $(color cr ✕) ]" | _printf
			[[ $f -lt $p ]] && echo -e "$(color cr 替换) ${x##*/} [ $(color cr ✕) ]" | _printf
			[[ $f = $p ]] && \
				echo -e "$(color cg 替换) ${x##*/} [ $(color cg ✔) ]" | _printf || \
				echo -e "$(color cb 添加) ${x##*/} [ $(color cb ✔) ]" | _printf
			unset -v p f k
		else
			for w in $(grep "^https" <<<$x); do
				if git clone -q $w ../${w##*/}; then
					for x in `ls -l ../${w##*/} | awk '/^d/{print $NF}' | grep -Ev 'kernel|*pulimit|*dump|*dtest|*Deny|*dog|*cowbb*'`; do
						g=$(find package/ feeds/ -maxdepth 3 -type d -name $x 2>/dev/null)
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
# REPO_BRANCH="openwrt-21.02"
# REPO_BRANCH="openwrt-18.06"
# REPO_BRANCH="openwrt-18.06-dev"
REPO_BRANCH="openwrt-18.06-k5.4"
[[ $REPO_BRANCH ]] && cmd="-b $REPO_BRANCH"

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

case $TARGET_DEVICE in
	x86_64)
	cat >.config<<-EOF
	CONFIG_TARGET_x86=y
	CONFIG_TARGET_x86_64=y
	CONFIG_TARGET_ROOTFS_PARTSIZE=800
	EOF
	;;
	newifi-d2)
	cat >.config<<-EOF
	CONFIG_TARGET_ramips=y
	CONFIG_TARGET_ramips_mt7621=y
	CONFIG_TARGET_ramips_mt7621_DEVICE_d-team_newifi-d2=y
	EOF
	;;
	phicomm_k2p)
	cat >.config<<-EOF
	CONFIG_TARGET_ramips=y
	CONFIG_TARGET_ramips_mt7621=y
	CONFIG_TARGET_ramips_mt7621_DEVICE_phicomm_k2p=y
	EOF
	;;
	asus_rt-n16)
	cat >.config<<-EOF
	CONFIG_TARGET_brcm47xx=y
	CONFIG_TARGET_brcm47xx_mips74k=y
	CONFIG_TARGET_brcm47xx_mips74k_DEVICE_asus_rt-n16=y
	EOF
	;;
	armvirt_64_Default)
	cat >.config<<-EOF
	CONFIG_TARGET_armvirt=y
	CONFIG_TARGET_armvirt_64=y
	CONFIG_TARGET_armvirt_64_Default=y
	EOF
	;;
	*)
	cat >.config<<-EOF
	CONFIG_TARGET_x86=y
	CONFIG_TARGET_x86_64=y
	CONFIG_TARGET_ROOTFS_PARTSIZE=900
	EOF
	;;
esac

cat >>.config<<-EOF
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
	CONFIG_PACKAGE_luci-app-opkg=y
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

config_generate="package/base-files/files/bin/config_generate"
color cy "自定义设置.... "
wget -qO package/base-files/files/etc/banner git.io/JoNK8
sed -i "/DISTRIB_DESCRIPTION/ {s/'$/-immortalwrt-$(date +%Y年%m月%d日)'/}" package/*/*/*/openwrt_release
sed -i "/IMG_PREFIX:/ {s/=/=Immortal-\$(shell date +%m%d-%H%M -d +8hour)-/}" include/image.mk
sed -i 's/option enabled.*/option enabled 1/' feeds/*/*/*/*/upnpd.config
sed -i "s/ImmortalWrt/OpenWrt/" {$config_generate,include/version.mk}
sed -i "/listen_https/ {s/^/#/g}" package/*/*/*/files/uhttpd.config
sed -i "{
		/upnp/d
		/banner/d
		s|auto|zh_cn\nuci set luci.main.mediaurlbase=/luci-static/bootstrap|
		s^.*shadow$^sed -i 's/root::0:0:99999:7:::/root:\$1\$RysBCijW\$wIxPNkj9Ht9WhglXAXo4w0:18206:0:99999:7:::/g' /etc/shadow^
		}" $(find package/ -type f -name "*-default-settings")

[[ -d "package/A" ]] || mkdir -m 755 -p package/A
rm -rf feeds/*/*/{luci-app-appfilter,open-app-filter}

clone_url "
	https://github.com/hong0980/build
	https://github.com/fw876/helloworld
	#https://github.com/kiddin9/openwrt-packages
	https://github.com/xiaorouji/openwrt-passwall
	https://github.com/destan19/OpenAppFilter
	https://github.com/jerrykuku/luci-app-vssr
	https://github.com/kiddin9/openwrt-bypass
	https://github.com/ntlf9t/luci-app-easymesh
	https://github.com/zzsj0928/luci-app-pushbot
	https://github.com/small-5/luci-app-adblock-plus
	https://github.com/jerrykuku/luci-app-jd-dailybonus
	https://github.com/coolsnowwolf/lede/trunk/package/lean/qtbase
	https://github.com/coolsnowwolf/lede/trunk/package/lean/qttools
	https://github.com/coolsnowwolf/lede/trunk/package/lean/qBittorrent
	https://github.com/coolsnowwolf/lede/trunk/package/lean/rblibtorrent
	https://github.com/coolsnowwolf/lede/trunk/package/lean/qBittorrent-static
	https://github.com/vernesong/OpenClash/trunk/luci-app-openclash
	https://github.com/lisaac/luci-lib-docker/trunk/collections/luci-lib-docker
	https://github.com/coolsnowwolf/lede/trunk/package/lean/luci-app-adbyby-plus
"
# https://github.com/immortalwrt/luci/branches/openwrt-21.02/applications/luci-app-ttyd ## 分支
echo -e 'pthome.net\nchdbits.co\nhdsky.me\nwww.nicept.net\nourbits.club' | \
tee -a $(find package/A/ feeds/luci/applications/ -type f -name "white.list" -or -name "direct_host" | grep "ss") >/dev/null

echo '<iframe src="https://ip.skk.moe/simple" style="width: 100%; border: 0"></iframe>' | \
tee -a {$(find package/A/ feeds/luci/applications/ -type d -name "luci-app-vssr")/*/*/*/status_top.htm,$(find package/A/ feeds/luci/applications/ -type d -name "luci-app-ssr-plus")/*/*/*/status.htm,$(find package/A/ feeds/luci/applications/ -type d -name "luci-app-bypass")/*/*/*/status.htm,$(find package/A/ feeds/luci/applications/ -type d -name "luci-app-passwall")/*/*/*/global/{status.htm,status2.htm}} >/dev/null

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
	"
	trv=`awk -F= '/PKG_VERSION:/{print $2}' feeds/packages/net/transmission/Makefile`
	wget -qO feeds/packages/net/transmission/patches/tr$trv.patch raw.githubusercontent.com/hong0980/diy/master/files/transmission/tr$trv.patch
	[[ -d package/A/qtbase ]] && rm -rf feeds/packages/libs/qt5
}

[[ "$REPO_BRANCH" == "openwrt-21.02" ]] && {
	sed -i 's/services/nas/' feeds/luci/*/*/*/*/*/*/menu.d/*transmission.json
	sed -i 's/^ping/-- ping/g' package/*/*/*/*/*/bridge.lua
} || {
	# clone_url "https://github.com/openwrt/routing/branches/openwrt-19.07/batman-adv"
	[[ $TARGET_DEVICE == phicomm_k2p ]] || _packages "luci-app-smartinfo"
	for d in $(find feeds/ package/ -type f -name "index.htm"); do
		if grep -q "Kernel Version" $d; then
			sed -i 's|os.date(.*|os.date("%F %X") .. " " .. translate(os.date("%A")),|' $d
			if ! grep -q "admin_status/index/" $d; then
				sed -i '/<%+footer%>/i<fieldset class="cbi-section">\n\t<legend><%:天气%></legend>\n\t<table width="100%" cellspacing="10">\n\t\t<tr><td width="10%"><%:本地天气%></td><td > <iframe width="900" height="120" frameborder="0" scrolling="no" hspace="0" src="//i.tianqi.com/?c=code&a=getcode&id=22&py=xiaoshan&icon=1"></iframe>\n\t\t<tr><td width="10%"><%:柯桥天气%></td><td > <iframe width="900" height="120" frameborder="0" scrolling="no" hspace="0" src="//i.tianqi.com/?c=code&a=getcode&id=22&py=keqiaoqv&icon=1"></iframe>\n\t\t<tr><td width="10%"><%:指数%></td><td > <iframe width="400" height="270" frameborder="0" scrolling="no" hspace="0" src="https://i.tianqi.com/?c=code&a=getcode&id=27&py=xiaoshan&icon=1"></iframe><iframe width="400" height="270" frameborder="0" scrolling="no" hspace="0" src="https://i.tianqi.com/?c=code&a=getcode&id=27&py=keqiaoqv&icon=1"></iframe>\n\t</table>\n</fieldset>\n\n<%-\n\tlocal incdir = util.libpath() .. "/view/admin_status/index/"\n\tif fs.access(incdir) then\n\t\tlocal inc\n\t\tfor inc in fs.dir(incdir) do\n\t\t\tif inc:match("%.htm$") then\n\t\t\t\tinclude("admin_status/index/" .. inc:gsub("%.htm$", ""))\n\t\t\tend\n\t\tend\n\t\end\n-%>\n' $d
			fi
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

case $TARGET_DEVICE in
"newifi-d2")
	DEVICE_NAME="Newifi-D2"
	FIRMWARE_TYPE="sysupgrade"
	sed -i "s/192.168.1.1/192.168.2.1/" $config_generate
	;;
"phicomm_k2p")
	DEVICE_NAME="Phicomm-K2P"
	FIRMWARE_TYPE="sysupgrade"
	;;
"asus_rt-n16")
	DEVICE_NAME="Asus-RT-N16"
	FIRMWARE_TYPE="n16"
	sed -i "s/192.168.1.1/192.168.2.130/" $config_generate
	;;
"x86_64")
	DEVICE_NAME="x86_64"
	FIRMWARE_TYPE="combined"
	sed -i "s/192.168.1.1/192.168.2.150/" $config_generate
	_packages "
	luci-app-adbyby-plus
	#luci-app-adguardhome
	luci-app-amule
	luci-app-dockerman
	luci-app-netdata
	#luci-app-jd-dailybonus
	luci-app-poweroff
	luci-app-qbittorrent
	luci-app-smartdns
	luci-app-unblockmusic
	AmuleWebUI-Reloaded htop lscpu lsscsi lsusb nano pciutils screen webui-aria2 zstd tar pv
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
	# [[ $(awk -F= '/PKG_VERSION:/{print $2}' feeds/*/*/netdata/Makefile) == "1.30.1" ]] && {
		# rm feeds/*/*/netdata/patches/*web*
		# wget -qO feeds/packages/admin/netdata/patches/009-web_gui_index.html.patch git.io/JoNoj
	# }
	# wget -qO feeds/luci/applications/luci-app-qbittorrent/Makefile raw.githubusercontent.com/immortalwrt/luci/openwrt-18.06/applications/luci-app-qbittorrent/Makefile
	# sed -i 's/-Enhanced-Edition/-static/' feeds/luci/applications/luci-app-qbittorrent/Makefile
	sed -i 's/PKG_VERSION:=.*/PKG_VERSION:=4.3.9_v2.0.5/' $(find package/A/ feeds/ -type d -name "qBittorrent-static")/Makefile
	# wget -qO feeds/packages/lang/node-yarn/Makefile raw.githubusercontent.com/coolsnowwolf/packages/master/lang/node-yarn/Makefile
	;;
"armvirt_64_Default")
	DEVICE_NAME="armvirt-64-default"
	FIRMWARE_TYPE="armvirt-64-default"
	sed -i '/easymesh/d' .config
	sed -i "s/192.168.1.1/192.168.2.110/" $config_generate
	# clone_url "https://github.com/tuanqing/install-program" && rm -rf package/A/install-program/tools
	_packages "attr bash blkid brcmfmac-firmware-43430-sdio brcmfmac-firmware-43455-sdio
	btrfs-progs cfdisk chattr curl dosfstools e2fsprogs f2fs-tools f2fsck fdisk getopt
	hostpad-common htop install-program iperf3 kmod-brcmfmac kmod-brcmutil kmod-cfg80211
	kmod-fs-exfat kmod-fs-ext4 kmod-fs-vfat kmod-mac80211 kmod-rt2800-usb kmod-usb-net
	kmod-usb-net-asix-ax88179 kmod-usb-net-rtl8150 kmod-usb-net-rtl8152 kmod-usb-storage
	kmod-usb-storage-extras kmod-usb-storage-uas kmod-usb2 kmod-usb3 lm-sensors losetup
	lsattr lsblk lscpu lsscsi luci-app-adguardhome luci-app-cpufreq luci-app-dockerman
	luci-app-qbittorrent mkf2fs ntfs-3g parted pv python3 resize2fs tune2fs unzip
	uuidgen wpa-cli wpad wpad-basic xfs-fsck xfs-mkf"

	sed -i 's/default 160/default 600/' config/Config-images.in
	sed -i 's/@arm/@TARGET_armvirt_64/g' $(find  package/A/ feeds/ -type d -name "luci-app-cpufreq")/Makefile
	sed -e 's/services/system/; s/00//' $(find package/A/ feeds/ -type d -name "luci-app-cpufreq")/luasrc/controller/cpufreq.lua -i
	[ -d ../opt/openwrt_packit ] && {
		sed -i '{
		s|mv |mv -v |
		s|openwrt-armvirt-64-default-rootfs.tar.gz|$(ls *default-rootfs.tar.gz)|
		s|TGT_IMG=.*|TGT_IMG="${WORK_DIR}/unifreq-openwrt-${SOC}_${BOARD}_k${KERNEL_VERSION}${SUBVER}-$(date "+%Y-%m%d-%H%M").img"|
		}' ../opt/openwrt_packit/mk*.sh
		sed -i '/ KERNEL_VERSION.*flippy/ {s/KERNEL_VERSION.*/KERNEL_VERSION="5.15.4-flippy-67+"/}' ../opt/openwrt_packit/make.env
		# sed -e '/shadow/d; /BANNER=/d' ../opt/openwrt_packit/mk*.sh -i
		# cd ../opt/openwrt_packit
		# (
		# sed -i "s/#KERNEL_VERSION/KERNEL_VERSION/" make.env
		# #sed -i '2,10 s/\(#\)\(.*\)/\2/' make.env
		# OLD=$(grep \+o\" make.env)
		# NEW=$(grep \+\" make.env)
		# cp make.env makesfe.env
		# KV=$(find /opt/kernel/ -name "boot*+o.tar.gz" | awk -F '[-.]' '{print $2"."$3"."$4"-"$5"-"$6}')
		# KVS=$(find /opt/kernel/ -name "boot*+.tar.gz" | awk -F '[-.]' '{print $2"."$3"."$4"-"$5"-"$6}')
		# sed -i "s/$NEW/#$NEW/; s/^KERNEL_VERSION.*/KERNEL_VERSION=\"$KV\"/" make.env
		# sed -i "s/$OLD/#$OLD/; s/SFE_FLAG=.*/SFE_FLAG=1/; s/FLOWOFFLOAD_FLAG=.*/FLOWOFFLOAD_FLAG=0/" makesfe.env
		# sed -i "s/^KERNEL_VERSION.*/KERNEL_VERSION=\"$KVS\"/" makesfe.env
		# for F in *.sh; do cp $F ${F%.sh}_sfe.sh; done
		# find ./* -maxdepth 1 -path "*_sfe.sh" | xargs -i sed -i 's/make\.env/makesfe\.env/g' {}
		# )
		# cd -
	}
	;;
esac

echo -e "$(color cy 当前的机型) $(color cb ${REPO_BRANCH#*-}-${DEVICE_NAME})"
echo -e "$(color cy '更新配置....')\c"
BEGIN_TIME=$(date '+%H:%M:%S')
make defconfig 1>/dev/null 2>&1
status

echo "BUILD_NPROC=$(($(nproc)+2))" >>$GITHUB_ENV
# echo "FREE_UP_DISK=true" >>$GITHUB_ENV #增加容量
# echo "SSH_ACTIONS=true" >>$GITHUB_ENV #SSH后台
# echo "UPLOAD_PACKAGES=false" >>$GITHUB_ENV
# echo "UPLOAD_SYSUPGRADE=false" >>$GITHUB_ENV
# echo "UPLOAD_BIN_DIR=false" >>$GITHUB_ENV
# echo "UPLOAD_FIRMWARE=false" >>$GITHUB_ENV
echo "UPLOAD_COWTRANSFER=false" >>$GITHUB_ENV
# echo "UPLOAD_WETRANSFER=false" >> $GITHUB_ENV
echo "CACHE_ACTIONS=true" >> $GITHUB_ENV
echo "DEVICE_NAME=$DEVICE_NAME" >>$GITHUB_ENV
echo "FIRMWARE_TYPE=$FIRMWARE_TYPE" >>$GITHUB_ENV

echo -e "\e[1;35m脚本运行完成！\e[0m"
