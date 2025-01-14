#!/usr/bin/env bash
# sudo bash -c 'bash <(curl -s https://build-scripts.immortalwrt.eu.org/init_build_environment.sh)'
qb_version=$(curl -sL https://api.github.com/repos/userdocs/qbittorrent-nox-static/releases | grep -oP '(?<="browser_download_url": ").*?release-\K(.*?)(?=/)' | sort -Vr | uniq | awk 'NR==1')
curl -sL https://raw.githubusercontent.com/klever1988/nanopi-openwrt/zstd-bin/zstd | sudo tee /usr/bin/zstd > /dev/null
curl -sL "$GITHUB_API_URL/repos/$GITHUB_REPOSITORY/releases?page=1" | grep -oP '"browser_download_url": "\K[^"]*cache[^"]*' > xa
curl -sL "$GITHUB_API_URL/repos/$GITHUB_REPOSITORY/releases?page=2" | grep -oP '"browser_download_url": "\K[^"]*cache[^"]*' >> xa
curl -sL api.github.com/repos/hong0980/OpenWrt-Cache/releases | grep -oP '"browser_download_url": "\K[^"]*cache[^"]*' >xc

color() {
	case $1 in
		cr) echo -e "\e[1;31m$2\e[0m" ;;
		cg) echo -e "\e[1;32m$2\e[0m" ;;
		cy) echo -e "\e[1;33m$2\e[0m" ;;
		cb) echo -e "\e[1;34m$2\e[0m" ;;
		cm) echo -e "\e[1;35m$2\e[0m" ;;
		cc) echo -e "\e[1;36m$2\e[0m" ;;
	esac
}

status() {
	local check=$? end_time=$(date '+%H:%M:%S')
	_date=" ==>用时 $[$(date +%s -d "$end_time") - $(date +%s -d "$begin_time")] 秒"
	[[ $_date =~ [0-9]+ ]] || _date=""
	if [[ $check = 0 ]]; then
		printf "%35s %s %s %s %s %-6s %s\n" `echo -e "[ $(color cg ✔)\e[1;39m ]${_date}"`
	else
		printf "%35s %s %s %s %s %-6s %s\n" `echo -e "[ $(color cr ✕)\e[1;39m ]${_date}"`
	fi
}

_find() {
	find $1 -maxdepth 5 -type d -name "$2" -print -quit 2>/dev/null
}

create_directory() {
	for dir in $@; do
		mkdir -p "$dir" 2>/dev/null || return 1
	done
}

addpackage() {
	for z in $@; do
		[[ $z =~ ^# ]] || echo "CONFIG_PACKAGE_$z=y" >>.config
	done
}

delpackage() {
	for z in $@; do
		[[ $z =~ ^# ]] || echo "# CONFIG_PACKAGE_$z is not set" >> .config
		# [[ $z =~ ^# ]] || sed -iE "s/(CONFIG_PACKAGE_.*$z)=y/# \1 is not set/" .config
	done
}

safe_pushd() {
	pushd "$1" &> /dev/null || echo -e "$(color cr ${1} '该目录不存在。')"
}

safe_popd() {
	popd &> /dev/null || echo -e "$(color cr '该目录不存在。')"
}

_printf() {
	IFS=' ' read -r param1 param2 param3 param4 param5 <<< "$1"
	printf "%s %-40s %s %s %s\n" "$param1" "$param2" "$param3" "$param4" "$param5"
}

lan_ip() {
	sed -i '/lan) ipad/s/".*"/"'"${IP:-$1}"'"/' $config_generate
}

git_diff() {
	path="$1"
	[[ -d $path ]] && safe_pushd "$path" || return 1
	shift

	for i in $@; do
		[[ -d $i || -f $i ]] && \
			git diff -- "$i" > $GITHUB_WORKSPACE/firmware/${REPO_BRANCH}-${i##*/}.patch
	done
	safe_popd
}

git_apply() {
	[[ $1 =~ ^# ]] && return
	local patch_source=$1 path=$2
	[[ -n $path && -d $path ]] && safe_pushd "$path" || \
	{ echo -e "$(color cr '无法进入目录'): $path"; return 1; }

	if [[ $patch_source =~ ^http ]]; then
		wget -qO- "$patch_source" | git apply --ignore-whitespace > /dev/null 2>&1
	elif [[ -f $patch_source ]]; then
		git apply --ignore-whitespace < "$patch_source" > /dev/null 2>&1
	else
		echo -e "$(color cr '无效的补丁源：') $patch_source"
		safe_popd
		return 1
	fi

	[[ $? -eq 0 ]] \
		&& _printf "$(color cg 执行) ${patch_source##*/} [ $(color cg ✔) ]" \
		|| _printf "$(color cr 执行) ${patch_source##*/} [ $(color cr ✕) ]"

	[[ -n $path ]] && safe_popd
}

clone_dir() {
	create_directory "package/A"
	[[ $# -lt 1 ]] && return
	local repo_url branch temp_dir=$(mktemp -d)
	if [[ $1 == */* ]]; then
		repo_url="$1"
		shift
	else
		branch="-b $1 --single-branch"
		repo_url="$2"
		shift 2
	fi
	[[ $repo_url =~ ^https?:// ]] || repo_url="https://github.com/$repo_url"

	git clone -q $branch --depth 1 "$repo_url" $temp_dir 2>/dev/null || {
		_printf "$(color cr 拉取) $repo_url [ $(color cr ✕) ]"
		return 1
	}

	[[ $repo_url =~ openwrt_helloworld && $REPO_BRANCH =~ 21 ]] && set -- "$@" "luci-app-homeproxy"
	[[ $repo_url =~ coolsnowwolf/packages && $REPO_BRANCH =~ 23 ]] && set -- "$@" "golang" "bandwidthd"

	for target_dir in $@; do
		# [[ $target_dir =~ ^luci-app- ]] && create_directory "feeds/luci/applications/$target_dir"
		local source_dir current_dir destination_dir
		if [[ ${repo_url##*/} == ${target_dir} ]]; then
			mv -f ${temp_dir} ${target_dir}
			source_dir=${target_dir}
		else
			source_dir=$(_find "$temp_dir" "$target_dir")
		fi
		[[ -d "$source_dir" ]] || continue
		current_dir=$(_find "package/ feeds/ target/" "$target_dir")
		destination_dir="${current_dir:-package/A/$target_dir}"

		[[ -d "$current_dir" ]] && rm -rf "../$(basename "$current_dir")" && mv -f "$current_dir" ../
		if mv -f "$source_dir" "${destination_dir%/*}"; then
			if [[ -d "$current_dir" ]]; then
				_printf "$(color cg 替换) $target_dir [ $(color cg ✔) ]"
			else
				_printf "$(color cb 添加) $target_dir [ $(color cb ✔) ]"
			fi
		fi
	done
	rm -rf "$temp_dir"
}

clone_url() {
	create_directory "package/A"
	for url in $@; do
		name="${url##*/}"
		if grep "^https" <<<"$url" | egrep -qv "openwrt_helloworld$|helloworld$|build$|openwrt-passwall-packages$"; then
			local destination
			local existing_path=$(_find "package/ target/ feeds/" "$name" | grep "/${name}$")
			if [[ -d $existing_path ]]; then
				mv -f $existing_path ../ && destination="$existing_path"
			else
				destination="package/A/$name"
			fi

			if git clone -q --depth 1 "$url" "$destination"; then
				if [[ $destination = $existing_path ]]; then
					_printf "$(color cg 替换) $name [ $(color cg ✔) ]"
				else
					_printf "$(color cb 添加) $name [ $(color cb ✔) ]"
				fi
			else
				_printf "$(color cr 拉取) $name [ $(color cr ✕) ]"
				if [[ $destination = $existing_path ]]; then
					mv -f ../${existing_path##*/} ${existing_path%/*}/ && \
					_printf "$(color cy 回退) ${existing_path##*/} [ $(color cy ✔) ]"
				fi
			fi
		else
			grep "^https" <<< "$url" | while IFS= read -r single_url; do
				local temp_dir=$(mktemp -d) destination existing_sub_path
				git clone -q --depth 1 "$single_url" $temp_dir && {
					for sub_dir in $(ls -l $temp_dir | awk '/^d/{print $NF}' | grep -Ev 'dump$|dtest$'); do
						existing_sub_path=$(_find "package/ feeds/ target/" "$sub_dir")
						if [[ -d $existing_sub_path ]]; then
							rm -rf $existing_sub_path && destination="$existing_sub_path"
						else
							destination="package/A"
						fi
						if mv -f $temp_dir/$sub_dir $destination; then
							if [[ $destination = $existing_sub_path ]]; then
								_printf "$(color cg 替换) $sub_dir [ $(color cg ✔) ]"
							else
								_printf "$(color cb 添加) $sub_dir [ $(color cb ✔) ]"
							fi
						fi
					done
				}
				rm -rf $temp_dir
			done
		fi
	done
}

set_config (){
	case "$TARGET_DEVICE" in
		"x86_64")
			cat >.config<<-EOF
			CONFIG_TARGET_x86=y
			CONFIG_TARGET_x86_64=y
			CONFIG_TARGET_x86_64_DEVICE_generic=y
			CONFIG_TARGET_ROOTFS_PARTSIZE=$PARTSIZE
			CONFIG_TARGET_KERNEL_PARTSIZE=16
			CONFIG_BUILD_NLS=y
			CONFIG_BUILD_PATENTED=y
			CONFIG_TARGET_IMAGES_GZIP=y
			CONFIG_GRUB_IMAGES=y
			# CONFIG_GRUB_EFI_IMAGES is not set
			# CONFIG_VMDK_IMAGES is not set
			EOF
			lan_ip "192.168.2.1"
			export DEVICE_NAME="x86_64"
			echo "FIRMWARE_TYPE=squashfs-combined" >> $GITHUB_ENV
			addpackage "autosamba luci-app-diskman luci-app-qbittorrent luci-app-poweroff luci-app-cowbping luci-app-cowb-speedlimit luci-app-pushbot luci-app-dockerman luci-app-softwarecenter luci-app-usb-printer"
			;;
		r[124]*)
			cat >.config<<-EOF
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
				r1*) echo "CONFIG_TARGET_rockchip_armv8_DEVICE_xunlong_orangepi-$TARGET_DEVICE=y" >>.config ;;
				*) echo "CONFIG_TARGET_rockchip_armv8_DEVICE_friendlyarm_nanopi-$TARGET_DEVICE=y" >>.config ;;
			esac
			lan_ip "192.168.2.1"
			export DEVICE_NAME="$TARGET_DEVICE"
			echo "FIRMWARE_TYPE=sysupgrade" >> $GITHUB_ENV
			addpackage "autosamba luci-app-diskman luci-app-qbittorrent luci-app-poweroff luci-app-cowbping luci-app-cowb-speedlimit luci-app-pushbot luci-app-dockerman luci-app-softwarecenter luci-app-usb-printer"
			;;
		"newifi-d2")
			cat >.config<<-EOF
			CONFIG_TARGET_ramips=y
			CONFIG_TARGET_ramips_mt7621=y
			CONFIG_TARGET_ramips_mt7621_DEVICE_d-team_newifi-d2=y
			EOF
			lan_ip "192.168.2.1"
			export DEVICE_NAME="Newifi-D2"
			echo "FIRMWARE_TYPE=sysupgrade" >> $GITHUB_ENV
			;;
		"phicomm_k2p")
			cat >.config<<-EOF
			CONFIG_TARGET_ramips=y
			CONFIG_TARGET_ramips_mt7621=y
			CONFIG_TARGET_ramips_mt7621_DEVICE_phicomm_k2p=y
			EOF
			lan_ip "192.168.1.1"
			export DEVICE_NAME="Phicomm-K2P"
			echo "FIRMWARE_TYPE=sysupgrade" >> $GITHUB_ENV
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
			lan_ip "192.168.2.130"
			export DEVICE_NAME="Asus-RT-N16"
			echo "FIRMWARE_TYPE=n16" >> $GITHUB_ENV
			;;
		"armvirt-64-default")
			cat >.config<<-EOF
			CONFIG_TARGET_armvirt=y
			CONFIG_TARGET_armvirt_64=y
			CONFIG_TARGET_armvirt_64_Default=y
			EOF
			lan_ip "192.168.2.110"
			export DEVICE_NAME="$TARGET_DEVICE"
			echo "FIRMWARE_TYPE=$TARGET_DEVICE" >> $GITHUB_ENV
			;;
	esac
	echo -e 'CONFIG_KERNEL_BUILD_USER="win3gp"\nCONFIG_KERNEL_BUILD_DOMAIN="OpenWrt"' >> .config
	addpackage "luci-app-arpbind luci-app-ksmbd luci-app-nlbwmon luci-app-upnp luci-app-bypass luci-app-cowb-speedlimit luci-app-cowbping luci-app-ddnsto luci-app-filebrowser luci-app-openclash luci-app-passwall luci-app-passwall2 luci-app-simplenetwork luci-app-ssr-plus luci-app-timedtask luci-app-tinynote luci-app-ttyd luci-app-uhttpd luci-app-wizard luci-app-homeproxy"
}

deploy_cache() {
	local ARCH=$(sed -nr 's/CONFIG_ARCH="(.*)"/\1/p' .config)
	local TOOLS_HASH=$(git log --pretty=tformat:"%h" -n1 tools toolchain)
	export SOURCE_NAME=$(basename $(dirname $REPO_URL))
	CACHE_NAME="$SOURCE_NAME-${REPO_BRANCH#*-}-$TOOLS_HASH-$ARCH"
	echo "CACHE_NAME=$CACHE_NAME" >> $GITHUB_ENV
	if (grep -q "$CACHE_NAME-cache.tzst" ../xa ../xc); then
		ls ../$CACHE_NAME-cache.tzst > /dev/null 2>&1 || {
			echo -e "$(color cy '下载tz-cache')\c"
			begin_time=$(date '+%H:%M:%S')
			grep -q "$CACHE_NAME-cache.tzst" ../xa \
			&& wget -qc -t=3 -P ../ $(grep "$CACHE_NAME-cache.tzst" ../xa) \
			|| wget -qc -t=3 -P ../ $(grep "$CACHE_NAME-cache.tzst" ../xc)
			status
		}

		ls ../$CACHE_NAME-cache.tzst > /dev/null 2>&1 && {
			echo -e "$(color cy '部署tz-cache')\c"; begin_time=$(date '+%H:%M:%S')
			(tar -I unzstd -xf ../*.tzst || tar -xf ../*.tzst) && {
				if ! grep -q "$CACHE_NAME-cache.tzst" ../xa; then
					cp ../$CACHE_NAME-cache.tzst ../output
					echo "OUTPUT_RELEASE=true" >> $GITHUB_ENV
				fi
				sed -i 's/ $(tool.*\/stamp-compile)//' Makefile
			}
			[ -d staging_dir ]; status
		}
	else
		echo "CACHE_ACTIONS=true" >> $GITHUB_ENV
	fi
}

git_clone() {
	local cmd
	echo -e "$(color cy "拉取源码 $REPO ${REPO_BRANCH#*-}")\c"
	begin_time=$(date '+%H:%M:%S')
	[ "$REPO_BRANCH" ] && cmd="-b $REPO_BRANCH --single-branch"
	git clone -q $cmd $REPO_URL $REPO_FLODER # --depth 1
	status
	[[ -d $REPO_FLODER ]] && cd $REPO_FLODER || exit

	echo -e "$(color cy '更新软件....')\c"
	begin_time=$(date '+%H:%M:%S')
	./scripts/feeds update -a 1>/dev/null 2>&1
	./scripts/feeds install -a 1>/dev/null 2>&1
	status
	set_config
	wget -qO package/base-files/files/etc/banner git.io/JoNK8
	color cy "自定义设置.... "
	sed -i "s/ImmortalWrt/OpenWrt/g" {$config_generate,include/version.mk} || true
	sed -i "/DISTRIB_DESCRIPTION/ {s/'$/-$SOURCE_NAME-$(TZ=UTC-8 date +%Y年%m月%d日)'/}" package/*/*/*/openwrt_release || true
	sed -i "/VERSION_NUMBER/ s/if.*/if \$(VERSION_NUMBER),\$(VERSION_NUMBER),${REPO_BRANCH#*-}-SNAPSHOT)/" include/version.mk || true
	sed -i "\$i\uci -q set upnpd.config.enabled=\"1\"\nuci commit upnpd\nuci -q set system.@system[0].hostname=\"OpenWrt\"\nuci commit system\nuci -q set luci.main.mediaurlbase=\"/luci-static/bootstrap\"\nuci commit luci\nsed -i 's/root:.*/root:\$1\$pn1ABFaI\$vt5cmIjlr6M7Z79Eds2lV0:16821:0:99999:7:::/g' /etc/shadow" package/emortal/*/files/*default-settings
}

create_directory "firmware" "output"
REPO=${REPO:-immortalwrt}
REPO_URL="https://github.com/$REPO/$REPO"
config_generate="package/base-files/files/bin/config_generate"
git_clone

clone_dir vernesong/OpenClash luci-app-openclash
clone_dir xiaorouji/openwrt-passwall luci-app-passwall
clone_dir xiaorouji/openwrt-passwall2 luci-app-passwall2
clone_dir hong0980/build luci-app-cowb-speedlimit luci-app-cowbping luci-app-ddnsto \
	luci-app-diskman luci-app-dockerman luci-app-filebrowser luci-app-poweroff \
	luci-app-pwdHackDeny luci-app-qbittorrent luci-app-softwarecenter luci-app-timedtask \
	luci-app-tinynote luci-app-wizard luci-lib-docker

if [[ "$TARGET_DEVICE" =~ x86_64|r1-plus-lts && "$REPO_BRANCH" =~ master|23|24 ]]; then
	if [[ $REPO =~ openwrt ]]; then
		clone_dir openwrt-24.10 immortalwrt/immortalwrt emortal bcm27xx-utils
		delpackage "dnsmasq"
		[[ $REPO_BRANCH =~ 23.05 ]] && clone_dir openwrt/packages openwrt-24.10 golang
	fi
	[[ $REPO_BRANCH =~ 23 ]] && clone_dir coolsnowwolf/packages ""
	# git_diff "feeds/luci" "applications/luci-app-diskman" "applications/luci-app-passwall" "applications/luci-app-ssr-plus" "applications/luci-app-dockerman"
	clone_dir fw876/helloworld luci-app-ssr-plus shadow-tls
	addpackage "autosamba luci-app-diskman luci-app-qbittorrent luci-app-poweroff luci-app-cowbping luci-app-cowb-speedlimit luci-app-pushbot luci-app-dockerman luci-app-softwarecenter luci-app-usb-printer"
	[[ $REPO_BRANCH =~ master|24 ]] && sed -i '/store\|deluge/d' .config
else
	# git diff ./ >> ../output/t.patch || true
	clone_url "
		https://github.com/fw876/helloworld
		https://github.com/xiaorouji/openwrt-passwall-packages
	"
	create_directory "package/utils/ucode" "package/network/config/firewall4" "package/network/utils/fullconenat-nft"
	clone_dir coolsnowwolf/lede automount busybox dnsmasq f2fs-tools firewall \
		firewall4 fullconenat fullconenat-nft iproute2 iwinfo libnftnl \
		nftables openssl opkg parted ppp smartmontools sonfilter ucode
		#fstools odhcp6c iptables ipset dropbear usbmode
	clone_dir coolsnowwolf/packages bandwidthd bash bluez btrfs-progs containerd curl docker \
		dockerd gawk golang htop jq libwebsockets lua-openssl mwan3 nghttp3 \
		nginx-util ngtcp2 pciutils runc samba4 smartdns
		#miniupnpc miniupnpd
	cat <<-\EOF >>package/kernel/linux/modules/netfilter.mk
	define KernelPackage/nft-tproxy
	  SUBMENU:=$(NF_MENU)
	  TITLE:=Netfilter nf_tables tproxy support
	  DEPENDS:=+kmod-nft-core +kmod-nf-tproxy +kmod-nf-conntrack
	  FILES:=$(foreach mod,$(NFT_TPROXY-m),$(LINUX_DIR)/net/$(mod).ko)
	  AUTOLOAD:=$(call AutoProbe,$(notdir $(NFT_TPROXY-m)))
	  KCONFIG:=$(KCONFIG_NFT_TPROXY)
	endef
	$(eval $(call KernelPackage,nft-tproxy))
	define KernelPackage/nf-tproxy
	  SUBMENU:=$(NF_MENU)
	  TITLE:=Netfilter tproxy support
	  KCONFIG:= $(KCONFIG_NF_TPROXY)
	  FILES:=$(foreach mod,$(NF_TPROXY-m),$(LINUX_DIR)/net/$(mod).ko)
	  AUTOLOAD:=$(call AutoProbe,$(notdir $(NF_TPROXY-m)))
	endef
	$(eval $(call KernelPackage,nf-tproxy))
	define KernelPackage/nft-compat
	  SUBMENU:=$(NF_MENU)
	  TITLE:=Netfilter nf_tables compat support
	  DEPENDS:=+kmod-nft-core +kmod-nf-ipt
	  FILES:=$(foreach mod,$(NFT_COMPAT-m),$(LINUX_DIR)/net/$(mod).ko)
	  AUTOLOAD:=$(call AutoProbe,$(notdir $(NFT_COMPAT-m)))
	  KCONFIG:=$(KCONFIG_NFT_COMPAT)
	endef
	$(eval $(call KernelPackage,nft-compat))
	define KernelPackage/ipt-socket
	  TITLE:=Iptables socket matching support
	  DEPENDS+=+kmod-nf-socket +kmod-nf-conntrack
	  KCONFIG:=$(KCONFIG_IPT_SOCKET)
	  FILES:=$(foreach mod,$(IPT_SOCKET-m),$(LINUX_DIR)/net/$(mod).ko)
	  AUTOLOAD:=$(call AutoProbe,$(notdir $(IPT_SOCKET-m)))
	  $(call AddDepends/ipt)
	endef
	define KernelPackage/ipt-socket/description
	  Kernel modules for socket matching
	endef
	$(eval $(call KernelPackage,ipt-socket))
	define KernelPackage/nf-socket
	  SUBMENU:=$(NF_MENU)
	  TITLE:=Netfilter socket lookup support
	  KCONFIG:= $(KCONFIG_NF_SOCKET)
	  FILES:=$(foreach mod,$(NF_SOCKET-m),$(LINUX_DIR)/net/$(mod).ko)
	  AUTOLOAD:=$(call AutoProbe,$(notdir $(NF_SOCKET-m)))
	endef
	$(eval $(call KernelPackage,nf-socket))
	EOF
	curl -sSo include/openssl-module.mk https://raw.githubusercontent.com/immortalwrt/immortalwrt/master/include/openssl-module.mk

	# mv -f package/A/luci-app* feeds/luci/applications/
	# git diff -- feeds/luci/applications/luci-app-qbittorrent > ../firmware/$REPO_BRANCH-luci-app-qbittorrent.patch
	sed -i '/bridge\|vssr\|deluge/d' .config
fi

clone_dir kiddin9/kwrt-packages chinadns-ng geoview lua-maxminddb luci-app-bypass luci-app-nlbwmon \
	luci-app-pushbot luci-app-store luci-app-syncdial luci-app-wizard luci-lib-taskd luci-lib-xterm \
	qBittorrent-static sing-box taskd trojan-plus xray-core
clone_dir sbwml/openwrt_helloworld shadowsocks-rust

sed -i "/listen_https/ {s/^/#/g}" package/*/*/*/files/uhttpd.config
sed -i 's|/bin/login|/bin/login -f root|' feeds/packages/utils/ttyd/files/ttyd.config
sed -Ei "s/(PKG_VERSION:=).*/\1${qb_version:-4.5.2_v2.0.8}/" package/A/qBittorrent-static/Makefile
sed -iE \
	-e 's|../../luci.mk|$(TOPDIR)/feeds/luci/luci.mk|' \
	-e 's?include ../(lang|devel)?include $(TOPDIR)/feeds/packages/\1?' \
	-e "s/((^| |    )(PKG_HASH|PKG_MD5SUM|PKG_MIRROR_HASH|HASH):=).*/\1skip/" \
	package/A/*/Makefile 2>/dev/null
for p in package/A/luci-app*/po feeds/luci/applications/luci-app*/po; do
	[[ -L $p/zh_Hans || -L $p/zh-cn ]] || (ln -s zh-cn $p/zh_Hans 2>/dev/null || ln -s zh_Hans $p/zh-cn 2>/dev/null)
done

echo -e "$(color cy '更新配置....')\c"
begin_time=$(date '+%H:%M:%S')
make defconfig 1>/dev/null 2>&1
status
deploy_cache

LINUX_VERSION=$(sed -nr 's/CONFIG_LINUX_(.*)=y/\1/p' .config | tr '_' '.')
echo -e "$(color cy 当前机型) $(color cb $SOURCE_NAME-${REPO_BRANCH#*-}-$LINUX_VERSION-${DEVICE_NAME})"
sed -i "/IMG_PREFIX:/ {s/=/=$SOURCE_NAME-${REPO_BRANCH#*-}-$LINUX_VERSION-\$(shell TZ=UTC-8 date +%m%d-%H%M)-/}" include/image.mk
# sed -i -E 's/# (CONFIG_.*_COMPRESS_UPX) is not set/\1=y/' .config && make defconfig 1>/dev/null 2>&1

# echo "SSH_ACTIONS=true" >> $GITHUB_ENV #SSH后台
# echo "UPLOAD_PACKAGES=false" >> $GITHUB_ENV
# echo "UPLOAD_SYSUPGRADE=false" >> $GITHUB_ENV
echo "UPLOAD_BIN_DIR=false" >> $GITHUB_ENV
# echo "UPLOAD_FIRMWARE=false" >> $GITHUB_ENV
echo "UPLOAD_COWTRANSFER=false" >> $GITHUB_ENV
echo "UPLOAD_WETRANSFER=false" >> $GITHUB_ENV
echo "CLEAN=false" >> $GITHUB_ENV

echo -e "\e[1;35m脚本运行完成！\e[0m"
