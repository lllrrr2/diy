#!/usr/bin/env bash
curl -sL https://raw.githubusercontent.com/klever1988/nanopi-openwrt/zstd-bin/zstd | sudo tee /usr/bin/zstd > /dev/null
curl -sL $GITHUB_API_URL/repos/$GITHUB_REPOSITORY/releases | awk -F'"' '/browser_download_url/{print $4}' | awk -F'/' '/cache/{print $(NF)}' >xa
curl -sL api.github.com/repos/hong0980/chinternet/releases | awk -F'"' '/browser_download_url/{print $4}' | awk -F'/' '/cache/{print $(NF)}' >xc
[[ $VERSION ]] || VERSION=plus
[[ $PARTSIZE ]] || PARTSIZE=900
[[ $TARGET_DEVICE == "phicomm_k2p" || $TARGET_DEVICE == "asus_rt-n16" ]] && VERSION=pure
mkdir firmware output

color() {
	case $1 in
		cy) echo -e "\033[1;33m$2\033[0m" ;;
		cr) echo -e "\033[1;31m$2\033[0m" ;;
		cg) echo -e "\033[1;32m$2\033[0m" ;;
		cb) echo -e "\033[1;34m$2\033[0m" ;;
	esac
}

status() {
	CHECK=$?
	END_TIME=$(date '+%H:%M:%S')
	_date=" ==>用时 $[$(date +%s -d "$END_TIME") - $(date +%s -d "$BEGIN_TIME")] 秒"
	[[ $_date =~ [0-9]+ ]] || _date=""
	if [ $CHECK = 0 ]; then
		printf "%35s %s %s %s %s %s %s\n" \
		`echo -e "[ $(color cg ✔)\033[0;39m ]${_date}"`
	else
		printf "%35s %s %s %s %s %s %s\n" \
		`echo -e "[ $(color cr ✕)\033[0;39m ]${_date}"`
	fi
}

git_apply() {
	for z in $@; do
		[[ $z =~ \# ]] || wget -qO- $z | git apply --reject --ignore-whitespace
	done
}

_packages() {
	for z in $@; do
		[[ $z =~ ^# ]] || echo "CONFIG_PACKAGE_$z=y" >>.config
	done
}

_delpackages() {
	for z in $@; do
		[[ $z =~ ^# ]] || sed -i "/^CONFIG.*$z=y$/ s/=y/ is not set/; s/^/# /" .config
	done
}

_printf() {
	awk '{printf "%s %-40s %s %s %s\n" ,$1,$2,$3,$4,$5}'
}

svn_co() {
	g=$(find package/ feeds/ target/ -maxdepth 5 -type d -name ${2##*/} 2>/dev/null)
	if [[ -d $g ]]; then
		k="$g"
		mv -f $g ../
	else
		k="package/A/${2##*/}"
	fi
	if svn export --force $1 $2 $k 1>/dev/null 2>&1; then
	# $1="-rxxx" $2="url" $k="path"
		if [[ $k = $g ]]; then
			echo -e "$(color cg 替换) ${2##*/} [ $(color cg ✔) ]" | _printf
		else
			echo -e "$(color cb 添加) ${2##*/} [ $(color cb ✔) ]" | _printf
		fi
	else
		echo -e "$(color cr 拉取) ${2##*/} [ $(color cr ✕) ]" | _printf
		[[ -d ../${g##*/} ]] && (mv -f ../${g##*/} ${g%/*}/ && \
			echo -e "$(color cy 回退) ${g##*/} [ $(color cy ✔) ]" | _printf)
	fi
	unset -v k g
}

clone_url() {
	for x in $@; do
		if [[ "$(grep "^https" <<<$x | grep -Ev "fw876|xiaorouji|hong")" ]]; then
			g=$(find package/ feeds/ target/ -maxdepth 5 -type d -name ${x##*/} 2>/dev/null)
			if [[ -d $g ]]; then
				mv -f $g ../ && k="$g"
			else
				k="package/A/${x##*/}"
			fi

			if [[ "$(egrep "trunk|branches" <<<$x)" ]]; then
				svn export $x $k 1>/dev/null 2>&1 && f="1"
			else
				git clone -q $x $k && f="1"
			fi

			if [[ x$f = x1 ]]; then
				if [[ $k = $g ]]; then
					echo -e "$(color cg 替换) ${x##*/} [ $(color cg ✔) ]" | _printf
				else
					echo -e "$(color cb 添加) ${x##*/} [ $(color cb ✔) ]" | _printf
				fi
			else
				echo -e "$(color cr 拉取) ${x##*/} [ $(color cr ✕) ]" | _printf
				if [[ $k = $g ]]; then
					mv -f ../${g##*/} ${g%/*}/ && \
					echo -e "$(color cy 回退) ${g##*/} [ $(color cy ✔) ]" | _printf
				fi
			fi
			unset -v f k g
		else
			for w in $(grep "^https" <<<$x); do
				git clone -q $w ../${w##*/} && {
					for x in `ls -l ../${w##*/} | awk '/^d/{print $NF}' | grep -Ev '*dump|*dtest'`; do
						g=$(find package/ feeds/ target/ -maxdepth 5 -type d -name $x 2>/dev/null)
						if [[ -d $g ]]; then
							rm -rf $g && k="$g"
						else
							k="package/A"
						fi
						if mv -f ../${w##*/}/$x $k; then
							if [[ $k = $g ]]; then
								echo -e "$(color cg 替换) ${x##*/} [ $(color cg ✔) ]" | _printf
							else
								echo -e "$(color cb 添加) ${x##*/} [ $(color cb ✔) ]" | _printf
							fi
						fi
						unset -v k g
					done
				} && rm -rf ../${w##*/}
			done
		fi
	done
}

REPO_URL="https://github.com/immortalwrt/immortalwrt"
echo -e "$(color cy '拉取源码....')\c"; BEGIN_TIME=$(date '+%H:%M:%S')
[[ $REPO_BRANCH ]] && cmd="-b $REPO_BRANCH"
# [ "$TARGET_DEVICE" = r1-plus-lts -a "$REPO_BRANCH" = master ] && git reset --hard b5193291bdde00e91c58e59029d5c68b0bc605db
git clone -q $cmd $REPO_URL $REPO_FLODER --single-branch
status
[[ -d $REPO_FLODER ]] && cd $REPO_FLODER || exit

export SOURCE_NAME=$(awk -F'/' '{print $(NF-1)}' <<<$REPO_URL)
export IMG_NAME="$SOURCE_NAME-${REPO_BRANCH#*-}-$TARGET_DEVICE"
export TOOLS_HASH=`git log --pretty=tformat:"%h" -n1 tools toolchain`
case "$TARGET_DEVICE" in
	"x86_64") export DEVICE_NAME="x86_64";;
	"asus_rt-n16") export DEVICE_NAME="bcm47xx_mips74k";;
	"armvirt_64_Default") export DEVICE_NAME="armvirt_64";;
	"newifi-d2"|"phicomm_k2p") export DEVICE_NAME="ramips_mt7621";;
	"r1-plus-lts"|"r1-plus"|"r4s"|"r2c"|"r2s") export DEVICE_NAME="rockchip_armv8";;
esac
export CACHE_NAME="$SOURCE_NAME-$DEVICE_NAME-$TOOLS_HASH"
echo "IMG_NAME=$IMG_NAME" >>$GITHUB_ENV
echo "CACHE_NAME=$CACHE_NAME" >>$GITHUB_ENV
echo "SOURCE_NAME=$SOURCE_NAME" >>$GITHUB_ENV
DOWNLOAD_URL_1="$GITHUB_SERVER_URL/$GITHUB_REPOSITORY/releases/download/$SOURCE_NAME-Cache"
DOWNLOAD_URL_2="$GITHUB_SERVER_URL/hong0980/chinternet/releases/download/Cache"

if (grep -q "$CACHE_NAME-cache.tzst" ../xa || \
	grep -q "$CACHE_NAME-cache.tzst" ../xc); then
	echo -e "$(color cy '下载tz-cache')\c"; BEGIN_TIME=$(date '+%H:%M:%S')
	grep -q "$CACHE_NAME-cache.tzst" ../xa && {
		wget -qc -t=3 $DOWNLOAD_URL_1/$CACHE_NAME-cache.tzst && xv=0
	} || {
		wget -qc -t=3 $DOWNLOAD_URL_2/$CACHE_NAME-cache.tzst && xv=1
	}
	[ -e *.tzst ]; status
	[ -e *.tzst ] && {
		echo -e "$(color cy '部署tz-cache')\c"; BEGIN_TIME=$(date '+%H:%M:%S')
		(tar -I unzstd -xf *.tzst || tar -I -xf *.tzst) && {
			[ "$xv" = 1 ] && {
				cp *.tzst ../output && \
				echo "OUTPUT_RELEASE=true" >>$GITHUB_ENV || true
				echo "CACHE_ACTIONS=true" >>$GITHUB_ENV
			} || {
				echo "CACHE_ACTIONS=" >>$GITHUB_ENV
				rm *.tzst
			}
			sed -i 's/ $(tool.*stamp-compile)//g' Makefile
		}
		[ -d staging_dir ]; status
	}
else
	echo "FETCH_CACHE=true" >>$GITHUB_ENV
	echo "CACHE_ACTIONS=true" >>$GITHUB_ENV
fi

# echo "FETCH_CACHE=true" >>$GITHUB_ENV
# echo "CACHE_ACTIONS=true" >>$GITHUB_ENV

# [[ "${REPO_BRANCH#*-}" == "21.02" ]] && sed -i '/luci.git/s/immortalwrt/openwrt/' feeds.conf.default
echo -e "$(color cy '更新软件....')\c"; BEGIN_TIME=$(date '+%H:%M:%S')
./scripts/feeds update -a 1>/dev/null 2>&1
./scripts/feeds install -a 1>/dev/null 2>&1
status

: >.config
case "$TARGET_DEVICE" in
	"x86_64")
		cat >.config<<-EOF
		CONFIG_TARGET_x86=y
		CONFIG_TARGET_x86_64=y
		CONFIG_TARGET_x86_64_DEVICE_generic=y
		CONFIG_TARGET_ROOTFS_PARTSIZE=$PARTSIZE
		CONFIG_BUILD_NLS=y
		CONFIG_BUILD_PATENTED=y
		CONFIG_TARGET_IMAGES_GZIP=y
		CONFIG_GRUB_IMAGES=y
		# CONFIG_GRUB_EFI_IMAGES is not set
		# CONFIG_VMDK_IMAGES is not set
		EOF
		;;
	"r1-plus-lts"|"r1-plus"|"r4s"|"r2c"|"r2s")
		cat<<-EOF >.config
		CONFIG_TARGET_rockchip=y
		CONFIG_TARGET_rockchip_armv8=y
		CONFIG_TARGET_ROOTFS_PARTSIZE=$PARTSIZE
		CONFIG_BUILD_NLS=y
		CONFIG_BUILD_PATENTED=y
		CONFIG_DRIVER_11AC_SUPPORT=y
		CONFIG_DRIVER_11N_SUPPORT=y
		CONFIG_DRIVER_11W_SUPPORT=y
		EOF
		case "$TARGET_DEVICE" in
		"r1-plus-lts"|"r1-plus")
		echo "CONFIG_TARGET_rockchip_armv8_DEVICE_xunlong_orangepi-$TARGET_DEVICE=y" >>.config ;;
		"r4s"|"r2c"|"r2s")
		echo "CONFIG_TARGET_rockchip_armv8_DEVICE_friendlyarm_nanopi-$TARGET_DEVICE=y" >>.config ;;
		esac
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
		if [[ "${REPO_BRANCH#*-}" = "18.06" ]]; then
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

cat >>.config <<-EOF
	CONFIG_KERNEL_BUILD_USER="win3gp"
	CONFIG_KERNEL_BUILD_DOMAIN="OpenWrt"
	CONFIG_PACKAGE_luci-app-ssr-plus=y
	CONFIG_PACKAGE_luci-app-ddnsto=y
	CONFIG_PACKAGE_luci-app-accesscontrol=y
	CONFIG_PACKAGE_luci-app-ikoolproxy=y
	CONFIG_PACKAGE_luci-app-wizard=y
	CONFIG_PACKAGE_luci-app-cowb-speedlimit=y
	CONFIG_PACKAGE_luci-app-diskman=y
	CONFIG_PACKAGE_luci-app-cowbping=y
	CONFIG_PACKAGE_luci-app-bridge=y
	CONFIG_PACKAGE_luci-app-cpulimit=y
	CONFIG_PACKAGE_luci-app-filebrowser=y
	CONFIG_PACKAGE_luci-app-filetransfer=y
	CONFIG_PACKAGE_luci-app-network-settings=y
	CONFIG_PACKAGE_luci-app-oaf=y
	CONFIG_PACKAGE_luci-app-appfilter=y
	CONFIG_PACKAGE_luci-app-passwall=y
	CONFIG_PACKAGE_luci-app-commands=y
	CONFIG_PACKAGE_luci-app-timedtask=y
	CONFIG_PACKAGE_luci-app-ttyd=y
	CONFIG_PACKAGE_luci-app-upnp=y
	CONFIG_PACKAGE_luci-app-opkg=y
	CONFIG_PACKAGE_luci-app-arpbind=y
	CONFIG_PACKAGE_luci-app-vlmcsd=y
	CONFIG_PACKAGE_luci-app-tinynote=y
	CONFIG_PACKAGE_automount=y
	CONFIG_PACKAGE_autosamba=y
	CONFIG_TARGET_IMAGES_GZIP=y
	CONFIG_BRCMFMAC_SDIO=y
	# CONFIG_VMDK_IMAGES is not set
	## CONFIG_GRUB_EFI_IMAGES is not set
	CONFIG_LUCI_LANG_zh_Hans=y
	CONFIG_DEFAULT_SETTINGS_OPTIMIZE_FOR_CHINESE=y
EOF

config_generate="package/base-files/files/bin/config_generate"
color cy "自定义设置.... "
wget -qO package/base-files/files/etc/banner git.io/JoNK8
sed -i "/DISTRIB_DESCRIPTION/ {s/'$/-$SOURCE_NAME-$(TZ=UTC-8 date +%Y年%m月%d日)'/}" package/*/*/*/openwrt_release
sed -i "/VERSION_NUMBER/ s/if.*/if \$(VERSION_NUMBER),\$(VERSION_NUMBER),${REPO_BRANCH#*-}-SNAPSHOT)/" include/version.mk
sed -i "s/ImmortalWrt/OpenWrt/g" {$config_generate,include/version.mk}
sed -i 's/option enabled.*/option enabled 1/' feeds/packages/*/*/files/upnpd.config
sed -i "/listen_https/ {s/^/#/g}" package/*/*/*/files/uhttpd.config
sed -i 's/UTC/UTC-8/' Makefile
sed -i "{
		/upnp/d;/banner/d
		s|auto|zh_cn\nuci set luci.main.mediaurlbase=/luci-static/bootstrap|
		\$i sed -i 's/root::.*:::/root:\$1\$pn1ABFaI\$vt5cmIjlr6M7Z79Eds2lV0:16821:0:99999:7:::/g' /etc/shadow
		}" $(find package/ -type f -name "*default-settings" 2>/dev/null)

# git diff ./ >> ../output/t.patch || true
clone_url "
	https://github.com/hong0980/build
	https://github.com/xiaorouji/openwrt-passwall2
	https://github.com/xiaorouji/openwrt-passwall
	https://github.com/fw876/helloworld
"
[ "$VERSION" = plus -a "$TARGET_DEVICE" != phicomm_k2p -a "$TARGET_DEVICE" != newifi-d2 ] && {
	_packages "
	attr axel bash blkid bsdtar btrfs-progs cfdisk chattr collectd-mod-ping
	collectd-mod-thermal curl diffutils dosfstools e2fsprogs f2fs-tools f2fsck
	fdisk gawk getopt hostpad-common htop install-program iperf3 lm-sensors
	losetup lsattr lsblk lscpu lsscsi patch
	rtl8188eu-firmware mt7601u-firmware rtl8723au-firmware rtl8723bu-firmware
	rtl8821ae-firmwarekmod-mt76x0u wpad-wolfssl brcmfmac-firmware-43430-sdio
	brcmfmac-firmware-43455-sdio kmod-brcmfmac kmod-brcmutil kmod-cfg80211
	kmod-fs-ext4 kmod-fs-vfat kmod-ipt-nat6 kmod-mac80211 kmod-mt7601u kmod-mt76x2u
	kmod-nf-nat6 kmod-r8125 kmod-rt2500-usb kmod-rt2800-usb kmod-rtl8187 kmod-rtl8188eu
	kmod-rtl8723bs kmod-rtl8812au-ac kmod-rtl8812au-ct kmod-rtl8821ae kmod-rtl8821cu
	kmod-rtl8xxxu kmod-usb-net kmod-usb-net-asix-ax88179 kmod-usb-net-rtl8150
	kmod-usb-net-rtl8152 kmod-usb-ohci kmod-usb-serial-option kmod-usb-storage kmod-usb-uhci
	kmod-usb-storage-extras kmod-usb-storage-uas kmod-usb-wdm kmod-usb2 kmod-usb3
	luci-app-aria2
	luci-app-bypass
	luci-app-cifs-mount
	luci-app-commands
	luci-app-hd-idle
	luci-app-cupsd
	luci-app-openclash
	luci-app-pushbot
	luci-app-softwarecenter
	luci-app-syncdial
	luci-app-transmission
	luci-app-usb-printer
	luci-app-vssr
	luci-app-wol
	luci-app-weburl
	luci-app-wrtbwmon
	luci-theme-material
	luci-theme-opentomato
	luci-app-pwdHackDeny
	luci-app-control-webrestriction
	luci-app-cowbbonding
	"
	trv=`awk -F= '/PKG_VERSION:/{print $2}' feeds/packages/net/transmission/Makefile`
	[[ $trv ]] && wget -qO feeds/packages/net/transmission/patches/tr$trv.patch \
	raw.githubusercontent.com/hong0980/diy/master/files/transmission/tr$trv.patch

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

	clone_url "
		https://github.com/destan19/OpenAppFilter
		https://github.com/messense/aliyundrive-webdav
		https://github.com/jerrykuku/luci-app-vssr
		https://github.com/jerrykuku/lua-maxminddb
		https://github.com/sirpdboy/luci-app-cupsd
		#https://github.com/ntlf9t/luci-app-easymesh
		https://github.com/yaof2/luci-app-ikoolproxy
		https://github.com/zzsj0928/luci-app-pushbot
		https://github.com/coolsnowwolf/packages/trunk/libs/qtbase
		https://github.com/coolsnowwolf/packages/trunk/libs/qttools
		https://github.com/coolsnowwolf/packages/trunk/net/qBittorrent
		https://github.com/coolsnowwolf/packages/trunk/net/qBittorrent-static
		https://github.com/vernesong/OpenClash/trunk/luci-app-openclash
		https://github.com/coolsnowwolf/luci/trunk/applications/luci-app-adbyby-plus
		https://github.com/kuoruan/luci-app-frpc
		#https://github.com/kiddin9/openwrt-packages/trunk/adguardhome
		#https://github.com/kiddin9/openwrt-packages/trunk/luci-app-adguardhome
		https://github.com/kiddin9/openwrt-packages/trunk/luci-app-bypass
		#https://github.com/sundaqiang/openwrt-packages/trunk/luci-app-easyupdate
		#https://github.com/sundaqiang/openwrt-packages/trunk/luci-app-supervisord
		#https://github.com/sundaqiang/openwrt-packages/trunk/luci-app-nginx-manager
		https://github.com/coolsnowwolf/packages/trunk/admin/netdata
		#https://github.com/sirpdboy/luci-app-netdata
		#https://github.com/coolsnowwolf/packages/trunk/lang/python
		#https://github.com/UnblockNeteaseMusic/luci-app-unblockneteasemusic
		#https://github.com/linkease/nas-packages-luci/trunk/luci/luci-app-ddnsto
	"
	rm -rf feeds/*/*/{luci-app-appfilter,open-app-filter}
	# [[ -e package/A/luci-app-ddnsto/root/etc/init.d/ddnsto ]] || \
	# svn export --force https://github.com/linkease/nas-packages/trunk/network/services/ddnsto package/A/ddnsto
	[[ -e feeds/luci/applications/luci-app-unblockneteasemusic/root/etc/init.d/unblockneteasemusic ]] && \
	sed -i '/log_check/s/^/#/' feeds/luci/applications/luci-app-unblockneteasemusic/root/etc/init.d/unblockneteasemusic
	# https://github.com/immortalwrt/luci/branches/openwrt-21.02/applications/luci-app-ttyd ## 分支
	# echo -e 'pthome.net\nchdbits.co\nhdsky.me\nourbits.club' | \
	# tee -a $(find package/A/luci-* feeds/luci/applications/luci-* -type f -name "white.list" -o -name "direct_host" 2>/dev/null | grep "ss") >/dev/null
	echo -e '\nwww.nicept.net' | \
	tee -a $(find package/A/luci-* feeds/luci/applications/luci-* -type f -name "black.list" -o -name "proxy_host" 2>/dev/null | grep "ss") >/dev/null

	[[ -f package/A/qBittorrent/Makefile ]] && grep -q "rblibtorrent" package/A/qBittorrent/Makefile && \
	sed -i 's/+rblibtorrent/+libtorrent-rasterbar/' package/A/qBittorrent/Makefile
	# if wget -qO feeds/luci/modules/luci-mod-admin-full/luasrc/view/myip.htm \
	# raw.githubusercontent.com/hong0980/diy/master/myip.htm; then
		# [[ -e "$(find package/A/ feeds/luci/ -type d -name "luci-app-vssr" 2>/dev/null)/luasrc/model/cbi/vssr/client.lua" ]] && {
			# sed -i '/vssr\/status_top/am:section(SimpleSection).template  = "myip"' \
			# $(find package/A/ feeds/luci/ -type d -name "luci-app-vssr" 2>/dev/null)/luasrc/model/cbi/vssr/client.lua
		# }
		# [[ -e "$(find package/A/ feeds/luci/ -type d -name "luci-app-ssr-plus" 2>/dev/null)/luasrc/model/cbi/shadowsocksr/client.lua" ]] && {
			# sed -i '/shadowsocksr\/status/am:section(SimpleSection).template  = "myip"' \
			# $(find package/A/ feeds/luci/ -type d -name "luci-app-ssr-plus" 2>/dev/null)/luasrc/model/cbi/shadowsocksr/client.lua
		# }
		# [[ -e "$(find package/A/ feeds/luci/ -type d -name "luci-app-bypass" 2>/dev/null)/luasrc/model/cbi/bypass/base.lua" ]] && {
			# sed -i '/bypass\/status"/am:section(SimpleSection).template  = "myip"' \
			# $(find package/A/ feeds/luci/ -type d -name "luci-app-bypass" 2>/dev/null)/luasrc/model/cbi/bypass/base.lua
		# }
		# [[ -e "$(find package/A/ feeds/luci/ -type d -name "luci-app-passwall" 2>/dev/null)/luasrc/model/cbi/passwall/client/global.lua" ]] && {
			# sed -i '/global\/status/am:section(SimpleSection).template  = "myip"' \
			# $(find package/A/ feeds/luci/ -type d -name "luci-app-passwall" 2>/dev/null)/luasrc/model/cbi/passwall/client/global.lua
		# }
	# fi

	[[ "${REPO_BRANCH#*-}" == "21.02" ]] && {
		sed -i 's/^ping/-- ping/g' package/*/*/*/*/*/bridge.lua
		# sed -i 's/services/nas/' feeds/luci/*/*/*/*/*/*/menu.d/*transmission.json
		clone_url "
		https://github.com/x-wrt/com.x-wrt/trunk/luci-app-simplenetwork
		https://github.com/brvphoenix/wrtbwmon/trunk/wrtbwmon
		https://github.com/brvphoenix/luci-app-wrtbwmon/trunk/luci-app-wrtbwmon
		"
	} || {
		_packages "luci-app-argon-config"
		clone_url "
		https://github.com/liuran001/openwrt-packages/trunk/luci-theme-argon
		https://github.com/liuran001/openwrt-packages/trunk/luci-app-argon-config
		https://github.com/brvphoenix/wrtbwmon
		https://github.com/firker/luci-app-wrtbwmon-zh/trunk/luci-app-wrtbwmon-zh"
		sed -i "s/argonv3/argon/" feeds/luci/applications/luci-app-argon-config/Makefile
		sed -i 's/option enabled.*/option enabled 1/' feeds/*/*/*/*/upnpd.config
		sed -i 's/option dports.*/option enabled 2/' feeds/*/*/*/*/upnpd.config
		for d in $(find feeds/ package/ -type f -name "index.htm" 2>/dev/null); do
			if grep -q "Kernel Version" $d; then
				echo $d
				sed -i 's|os.date(.*|os.date("%F %X") .. " " .. translate(os.date("%A")),|' $d
				sed -i '/<%+footer%>/i<%-\n\tlocal incdir = util.libpath() .. "/view/admin_status/index/"\n\tif fs.access(incdir) then\n\t\tlocal inc\n\t\tfor inc in fs.dir(incdir) do\n\t\t\tif inc:match("%.htm$") then\n\t\t\t\tinclude("admin_status/index/" .. inc:gsub("%.htm$", ""))\n\t\t\tend\n\t\tend\n\t\end\n-%>\n' $d
				# sed -i '/<%+footer%>/i<fieldset class="cbi-section">\n\t<legend><%:天气%></legend>\n\t<table width="100%" cellspacing="10">\n\t\t<tr><td width="10%"><%:本地天气%></td><td > <iframe width="900" height="120" frameborder="0" scrolling="no" hspace="0" src="//i.tianqi.com/?c=code&a=getcode&id=22&py=xiaoshan&icon=1"></iframe>\n\t\t<tr><td width="10%"><%:柯桥天气%></td><td > <iframe width="900" height="120" frameborder="0" scrolling="no" hspace="0" src="//i.tianqi.com/?c=code&a=getcode&id=22&py=keqiaoqv&icon=1"></iframe>\n\t\t<tr><td width="10%"><%:指数%></td><td > <iframe width="400" height="270" frameborder="0" scrolling="no" hspace="0" src="https://i.tianqi.com/?c=code&a=getcode&id=27&py=xiaoshan&icon=1"></iframe><iframe width="400" height="270" frameborder="0" scrolling="no" hspace="0" src="https://i.tianqi.com/?c=code&a=getcode&id=27&py=keqiaoqv&icon=1"></iframe>\n\t</table>\n</fieldset>\n' $d
			fi
		done
	}
	xa=$(find package/A/ feeds/luci/applications/ -type d -name "luci-app-vssr" 2>/dev/null)
	[[ -d $xa ]] && sed -i "/dports/s/1/2/;/ip_data_url/s|'.*'|'https://ispip.clang.cn/all_cn.txt'|" $xa/root/etc/config/vssr
	xb=$(find package/A/ feeds/luci/applications/ -type d -name "luci-app-bypass" 2>/dev/null)
	[[ -d $xb ]] && sed -i 's/default y/default n/g' $xb/Makefile
	#https://github.com/userdocs/qbittorrent-nox-static/releases
	xc=$(find package/A/ feeds/ -type d -name "qBittorrent-static" 2>/dev/null)
	[[ -d $xc ]] && sed -i 's/PKG_VERSION:=.*/PKG_VERSION:=4.4.5_v2.0.8/' $xc/Makefile
	xd=$(find package/A/ feeds/luci/applications/ -type d -name "luci-app-turboacc" 2>/dev/null)
	[[ -d $xd ]] && sed -i '/hw_flow/s/1/0/;/sfe_flow/s/1/0/;/sfe_bridge/s/1/0/' $xd/root/etc/config/turboacc
	xe=$(find package/A/ feeds/luci/applications/ -type d -name "luci-app-ikoolproxy" 2>/dev/null)
	[[ -d $xe ]] && sed -i '/echo.*root/ s/^/[[ $time =~ [0-9]+ ]] \&\&/' $xe/root/etc/init.d/koolproxy
	xg=$(find package/A/ feeds/luci/applications/ -type d -name "luci-app-pushbot" 2>/dev/null)
	[[ -d $xg ]] && {
		sed -i "s|-c pushbot|/usr/bin/pushbot/pushbot|" $xg/luasrc/controller/pushbot.lua
		sed -i '/start()/a[ "$(uci get pushbot.@pushbot[0].pushbot_enable)" -eq "0" ] && return 0' $xg/root/etc/init.d/pushbot
	}
}

# clone_url "https://github.com/immortalwrt/packages/branches/openwrt-21.02/libs/libtorrent-rasterbar" && {
	# rm -rf package/A/{luci-app-deluge,deluge}
	# sed -i 's/+rblibtorrent/+libtorrent-rasterbar/' package/A/qBittorrent/Makefile
	# sed -i 's/qBittorrent-static/qBittorrent-Enhanced-Edition/g' package/feeds/luci/luci-app-qbittorrent/Makefile
# }

# clone_url "https://github.com/coolsnowwolf/packages/trunk/libs/libtorrent-rasterbar" && {
	# rm -rf package/A/{luci-app-deluge,deluge}
	# sed -i 's/qBittorrent-static/qbittorrent/g' package/feeds/luci/luci-app-qbittorrent/Makefile
	# sed -i 's/+libtorrent-rasterbar/+rblibtorrent/' feeds/packages/net/qBittorrent-Enhanced-Edition/Makefile
# }

case "$TARGET_DEVICE" in
"r4s"|"r2c"|"r2s"|"r1-plus-lts"|"r1-plus")
	DEVICE_NAME="$TARGET_DEVICE"
	FIRMWARE_TYPE="sysupgrade"
	[[ $IP ]] && \
	sed -i '/n) ipad/s/".*"/"'"$IP"'"/' $config_generate || \
	sed -i '/n) ipad/s/".*"/"192.168.2.1"/' $config_generate
	[[ $VERSION = plus ]] && {
		_packages "
		luci-app-dockerman
		luci-app-turboacc
		luci-app-uhttpd
		luci-app-qbittorrent
		luci-app-passwall2
		luci-app-cpufreq
		#luci-app-adguardhome
		#luci-app-amule
		luci-app-deluge
		#luci-app-smartdns
		#luci-app-adbyby-plus
		#luci-app-unblockneteasemusic
		htop lscpu lsscsi nano screen zstd pv ethtool
		"
		[[ "${REPO_BRANCH#*-}" == "21.02" ]] && sed -i '/bridge/d' .config
		wget -qO package/base-files/files/bin/bpm git.io/bpm && chmod +x package/base-files/files/bin/bpm
		wget -qO package/base-files/files/bin/ansi git.io/ansi && chmod +x package/base-files/files/bin/ansi
	} || {
		_packages "kmod-rt2800-usb kmod-rtl8187 kmod-rtl8812au-ac kmod-rtl8812au-ct kmod-rtl8821ae
		kmod-rtl8821cu ethtool kmod-usb-wdm kmod-usb2 kmod-usb-ohci kmod-usb-uhci kmod-r8125 kmod-mt76x2u
		kmod-mt76x0u kmod-gpu-lima wpad-wolfssl iwinfo iw collectd-mod-ping collectd-mod-thermal
		luci-app-cpufreq luci-app-uhttpd luci-app-pushbot luci-app-wrtbwmon luci-app-vssr"
		echo -e "CONFIG_DRIVER_11AC_SUPPORT=y\nCONFIG_DRIVER_11N_SUPPORT=y\nCONFIG_DRIVER_11W_SUPPORT=y" >>.config
	}
	[[ $TARGET_DEVICE =~ r1-plus-lts ]] && sed -i "/lan_wan/s/'.*' '.*'/'eth0' 'eth1'/" target/*/rockchip/*/*/*/*/02_network
	;;
"newifi-d2")
	DEVICE_NAME="Newifi-D2"
	FIRMWARE_TYPE="sysupgrade"
	[[ $IP ]] && \
	sed -i '/n) ipad/s/".*"/"'"$IP"'"/' $config_generate || \
	sed -i '/n) ipad/s/".*"/"192.168.2.1"/' $config_generate
	;;
"phicomm_k2p")
	DEVICE_NAME="Phicomm-K2P"
	_packages "luci-app-wifischedule"
	FIRMWARE_TYPE="sysupgrade"
	sed -i '/diskman/d;/autom/d;/ikoolproxy/d;/autos/d' .config
	[[ $IP ]] && \
	sed -i '/n) ipad/s/".*"/"'"$IP"'"/' $config_generate || \
	sed -i '/n) ipad/s/".*"/"192.168.1.1"/' $config_generate
	;;
"asus_rt-n16")
	DEVICE_NAME="Asus-RT-N16"
	FIRMWARE_TYPE="n16"
	[[ $IP ]] && \
	sed -i '/n) ipad/s/".*"/"'"$IP"'"/' $config_generate || \
	sed -i '/n) ipad/s/".*"/"192.168.2.130"/' $config_generate
	;;
"x86_64")
	DEVICE_NAME="x86_64"
	FIRMWARE_TYPE="squashfs-combined"
	[[ $IP ]] && \
	sed -i '/n) ipad/s/".*"/"'"$IP"'"/' $config_generate || \
	sed -i '/n) ipad/s/".*"/"192.168.2.150"/' $config_generate
	[[ $VERSION = plus ]] && {
		_packages "
		luci-app-adbyby-plus
		#luci-app-adguardhome
		luci-app-passwall2
		#luci-app-amule
		luci-app-dockerman
		luci-app-netdata
		#luci-app-kodexplorer
		luci-app-poweroff
		luci-app-qbittorrent
		luci-app-smartdns
		#luci-app-unblockneteasemusic
		luci-app-ikoolproxy
		luci-app-deluge
		luci-app-godproxy
		luci-app-frpc
		luci-app-aliyundrive-webdav
		#AmuleWebUI-Reloaded htop lscpu lsscsi lsusb nano pciutils screen webui-aria2 zstd tar pv
		subversion-server #unixodbc git-http
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
		kmod-mmc-spi kmod-rtl8xxxu kmod-sdhci
		kmod-tg3 lm-sensors-detect qemu-ga snmpd
		"
		# [[ $REPO_BRANCH = "openwrt-18.06-k5.4" ]] && sed -i '/KERNEL_PATCHVER/s/=.*/=5.10/' target/linux/x86/Makefile
		wget -qO package/base-files/files/bin/bpm git.io/bpm && chmod +x package/base-files/files/bin/bpm
		wget -qO package/base-files/files/bin/ansi git.io/ansi && chmod +x package/base-files/files/bin/ansi
		[[ $REPO_BRANCH == master ]] && rm -rf package/kernel/rt*
	}
	;;
"armvirt_64_Default")
	DEVICE_NAME="armvirt-64-default"
	FIRMWARE_TYPE="armvirt-64-default-rootfs"
	[[ $IP ]] && \
	sed -i '/n) ipad/s/".*"/"'"$IP"'"/' $config_generate || \
	sed -i '/n) ipad/s/".*"/"192.168.2.110"/' $config_generate
	clone_url "https://github.com/ophub/luci-app-amlogic/trunk/luci-app-amlogic"
	[[ $VERSION = plus ]] && {
		_packages "attr bash blkid brcmfmac-firmware-43430-sdio brcmfmac-firmware-43455-sdio
		bsdtar btrfs-progs cfdisk chattr curl dosfstools e2fsprogs f2fs-tools f2fsck fdisk
		gawk getopt hostpad-common htop install-program iperf3 kmod-brcmfmac kmod-brcmutil
		kmod-cfg80211 kmod-fs-ext4 kmod-fs-vfat kmod-mac80211 kmod-rt2800-usb kmod-usb-net
		kmod-usb-net-asix-ax88179 kmod-usb-net-rtl8150 kmod-usb-net-rtl8152 kmod-usb-storage
		kmod-usb-storage-extras kmod-usb-storage-uas kmod-usb2 kmod-usb3 lm-sensors losetup
		lsattr lsblk lscpu lsscsi #luci-app-adguardhome luci-app-amlogic luci-app-cpufreq
		luci-app-dockerman luci-app-ikoolproxy luci-app-qbittorrent mkf2fs ntfs-3g parted
		perl perl-http-date perlbase-getopt perlbase-time perlbase-unicode perlbase-utf8
		pigz pv python3 resize2fs tune2fs unzip uuidgen wpa-cli wpad wpad-basic xfs-fsck
		xfs-mkfs"
		echo "CONFIG_PERL_NOCOMMENT=y" >>.config
		sed -i '/easymesh/d' .config
		sed -i "s/default 160/default $PARTSIZE/" config/Config-images.in
		sed -i 's/@arm/@TARGET_armvirt_64/g' $(find package/A/ feeds/ -type d -name "luci-app-cpufreq" 2>/dev/null)/Makefile
	}
	;;
esac

sed -i 's|\.\./\.\./luci.mk|$(TOPDIR)/feeds/luci/luci.mk|' package/A/*/Makefile 2>/dev/null
for p in $(find package/A/ feeds/luci/applications/ -type d -name "po" 2>/dev/null); do
	if [[ "${REPO_BRANCH#*-}" == "21.02" ]]; then
		if [[ ! -d $p/zh_Hans && -d $p/zh-cn ]]; then
			ln -s zh-cn $p/zh_Hans 2>/dev/null
			# printf "%-13s %-33s %s %s %s\n" \
			# $(echo -e "添加zh_Hans $(awk -F/ '{print $(NF-1)}' <<< $p) [ $(color cg ✔) ]")
		fi
	else
		if [[ ! -d $p/zh-cn && -d $p/zh_Hans ]]; then
			ln -s zh_Hans $p/zh-cn 2>/dev/null
			# printf "%-13s %-33s %s %s %s\n" \
			# `echo -e "添加zh-cn $(awk -F/ '{print $(NF-1)}' <<< $p) [ $(color cg ✔) ]"`
		fi
	fi
done

# cat >>.config <<-EOF
# CONFIG_DEVEL=y
# CONFIG_CCACHE=y
# CONFIG_NEED_TOOLCHAIN=y
# CONFIG_IB=y
# CONFIG_IB_STANDALONE=y
# CONFIG_DEVEL=y
# CONFIG_DROPBEAR_ECC_FULL=y
# CONFIG_DROPBEAR_ECC=y
# CONFIG_AUTOREMOVE=y
# CONFIG_MAKE_TOOLCHAIN=y
# EOF
echo -e "$(color cy '更新配置....')\c"; BEGIN_TIME=$(date '+%H:%M:%S')
make defconfig 1>/dev/null 2>&1
status

LINUX_VERSION=$(grep 'CONFIG_LINUX.*=y' .config | sed -r 's/CONFIG_LINUX_(.*)=y/\1/' | tr '_' '.')
DEVICE_NAME=`grep '^CONFIG_TARGET.*DEVICE.*=y' .config | sed -r 's/.*T_(.*)_DEVI.*/\1/'`-`grep '^CONFIG_TARGET.*DEVICE.*=y' .config | sed -r 's/.*DEVICE_(.*)=y/\1/'`
echo -e "$(color cy 当前机型) $(color cb $SOURCE_NAME-${REPO_BRANCH#*-}-$LINUX_VERSION-$DEVICE_NAME-$VERSION)"
sed -i "/IMG_PREFIX:/ {s/=/=$SOURCE_NAME-${REPO_BRANCH#*-}-$LINUX_VERSION-\$(shell TZ=UTC-8 date +%m%d-%H%M)-/}" include/image.mk
# sed -i -E 's/# (CONFIG_.*_COMPRESS_UPX) is not set/\1=y/' .config && make defconfig 1>/dev/null 2>&1

# echo "SSH_ACTIONS=true" >>$GITHUB_ENV #SSH后台
# echo "UPLOAD_PACKAGES=false" >>$GITHUB_ENV
# echo "UPLOAD_SYSUPGRADE=false" >>$GITHUB_ENV
echo "UPLOAD_BIN_DIR=false" >>$GITHUB_ENV
# echo "UPLOAD_FIRMWARE=false" >>$GITHUB_ENV
echo "UPLOAD_COWTRANSFER=false" >>$GITHUB_ENV
# echo "UPLOAD_WETRANSFER=false" >>$GITHUB_ENV
echo "CLEAN=false" >>$GITHUB_ENV
echo "DEVICE_NAME=$DEVICE_NAME" >>$GITHUB_ENV
echo "FIRMWARE_TYPE=$FIRMWARE_TYPE" >>$GITHUB_ENV
echo "VERSION=$VERSION" >>$GITHUB_ENV

# while true; do make package/download -j && break || true; done
echo -e "\e[1;35m脚本运行完成！\e[0m"
