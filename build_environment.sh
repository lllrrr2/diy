#!/bin/bash
# SPDX-License-Identifier: GPL-2.0-only
#
# Copyright (C) ImmortalWrt.org

DEFAULT_COLOR="\033[0m"
BLUE_COLOR="\033[36m"
GREEN_COLOR="\033[32m"
RED_COLOR="\033[31m"
YELLOW_COLOR="\033[33m"

function __error_msg() {
	echo -e "${RED_COLOR}[ERROR]${DEFAULT_COLOR} $*"
}

function __info_msg() {
	echo -e "${BLUE_COLOR}[INFO]${DEFAULT_COLOR} $*"
}

function __success_msg() {
	echo -e "${GREEN_COLOR}[SUCCESS]${DEFAULT_COLOR} $*"
}

function __warning_msg() {
	echo -e "${YELLOW_COLOR}[WARNING]${DEFAULT_COLOR} $*"
}

function _pushd() {
	if ! pushd "$@" &> /dev/null; then
		__error_msg "$1该目录不存在。"
		exit 1
	fi
}

function _popd() {
	if ! popd &> /dev/null; then
		__error_msg "该目录不存在。"
		exit 1
	fi
}

function check_system(){
	__info_msg "正在检查系统信息..."

	VERSION_CODENAME="$(source /etc/os-release; echo "$VERSION_CODENAME")"
	VERSION_PACKAGE="lib32gcc-s1"

	case "$VERSION_CODENAME" in
	"bionic"|\
	"focal"|\
	"jammy")
		UBUNTU_CODENAME="$VERSION_CODENAME"
		;;
	"buster")
		UBUNTU_CODENAME="bionic"
		VERSION_PACKAGE="lib32gcc1"
		;;
	"bullseye")
		UBUNTU_CODENAME="focal"
		;;
	"bookworm")
		UBUNTU_CODENAME="jammy"
		;;
	*)
		__error_msg "操作系统不受支持，请改用 Ubuntu 20.04。"
		exit 1
		;;
	esac

	[ "$(uname -m)" == "x86_64" ] || { __error_msg "不支持的架构，请改用 AMD64。" && exit 1; }

	[ "$(whoami)" == "root" ] || { __error_msg "您必须以 root 身份运行此脚本。" && exit 1; }
}

function check_network(){
	__info_msg "正在检查网络..."
	curl -s "myip.ipip.net" | grep -qo "中国" && CHN_NET=1
	curl --connect-timeout 10 "baidu.com" > "/dev/null" 2>&1 || { __warning_msg "您的网络不适合编译OpenWrt！"; }
	curl --connect-timeout 10 "google.com" > "/dev/null" 2>&1 || { __warning_msg "您的网络不适合编译OpenWrt！"; }
}

function update_apt_source(){
	__info_msg "正在更新 apt 源列表..."
	# set -x
	apt-get -qq update
	apt-get -qq install apt-transport-https gnupg2 > /dev/null
	if [ -n "$CHN_NET" ]; then
		mv "/etc/apt/sources.list" "/etc/apt/sources.list.bak"
		if [ "$VERSION_CODENAME" == "$UBUNTU_CODENAME" ]; then
			cat <<-EOF >"/etc/apt/sources.list"
				deb https://repo.huaweicloud.com/ubuntu/ $VERSION_CODENAME main restricted universe multiverse
				deb-src https://repo.huaweicloud.com/ubuntu/ $VERSION_CODENAME main restricted universe multiverse

				deb https://repo.huaweicloud.com/ubuntu/ $VERSION_CODENAME-security main restricted universe multiverse
				deb-src https://repo.huaweicloud.com/ubuntu/ $VERSION_CODENAME-security main restricted universe multiverse

				deb https://repo.huaweicloud.com/ubuntu/ $VERSION_CODENAME-updates main restricted universe multiverse
				deb-src https://repo.huaweicloud.com/ubuntu/ $VERSION_CODENAME-updates main restricted universe multiverse

				# deb https://repo.huaweicloud.com/ubuntu/ $VERSION_CODENAME-proposed main restricted universe multiverse
				# deb-src https://repo.huaweicloud.com/ubuntu/ $VERSION_CODENAME-proposed main restricted universe multiverse

				deb https://repo.huaweicloud.com/ubuntu/ $VERSION_CODENAME-backports main restricted universe multiverse
				deb-src https://repo.huaweicloud.com/ubuntu/ $VERSION_CODENAME-backports main restricted universe multiverse
			EOF
		else
			cat <<-EOF > "/etc/apt/sources.list"
				deb https://repo.huaweicloud.com/debian/ $VERSION_CODENAME main contrib
				deb-src https://repo.huaweicloud.com/debian/ $VERSION_CODENAME main contrib

				deb https://repo.huaweicloud.com/debian-security $VERSION_CODENAME-security main contrib
				deb-src https://repo.huaweicloud.com/debian-security $VERSION_CODENAME-security main contrib

				deb https://repo.huaweicloud.com/debian/ $VERSION_CODENAME-updates main contrib
				deb-src https://repo.huaweicloud.com/debian/ $VERSION_CODENAME-updates main contrib

				deb https://repo.huaweicloud.com/debian/ $VERSION_CODENAME-backports main contrib
				deb-src https://repo.huaweicloud.com/debian/ $VERSION_CODENAME-backports main contrib
			EOF
		fi
	fi

	mkdir -p "/etc/apt/sources.list.d"

	cat <<-EOF >"/etc/apt/sources.list.d/nodesource.list"
		deb https://deb.nodesource.com/node_18.x $VERSION_CODENAME main
		deb-src https://deb.nodesource.com/node_18.x $VERSION_CODENAME main
	EOF
	curl -sL "https://deb.nodesource.com/gpgkey/nodesource.gpg.key" -o "/etc/apt/trusted.gpg.d/nodesource.asc"

	cat <<-EOF >"/etc/apt/sources.list.d/yarn.list"
		deb https://dl.yarnpkg.com/debian/ stable main
	EOF
	curl -sL "https://dl.yarnpkg.com/debian/pubkey.gpg" -o "/etc/apt/trusted.gpg.d/yarn.asc"

	if [ "$VERSION_CODENAME" == "$UBUNTU_CODENAME" ]; then
		cat <<-EOF >"/etc/apt/sources.list.d/gcc-toolchain.list"
			deb https://ppa.launchpadcontent.net/ubuntu-toolchain-r/test/ubuntu $UBUNTU_CODENAME main
			deb-src https://ppa.launchpadcontent.net/ubuntu-toolchain-r/test/ubuntu $UBUNTU_CODENAME main
		EOF
		curl -sL "https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x1e9377a2ba9ef27f" -o "/etc/apt/trusted.gpg.d/gcc-toolchain.asc"
	fi

	cat <<-EOF >"/etc/apt/sources.list.d/git-core-ubuntu-ppa.list"
		deb https://ppa.launchpadcontent.net/git-core/ppa/ubuntu $UBUNTU_CODENAME main
		deb-src https://ppa.launchpadcontent.net/git-core/ppa/ubuntu $UBUNTU_CODENAME main
	EOF
	curl -sL "https://keyserver.ubuntu.com/pks/lookup?op=get&search=0xe1dd270288b4e6030699e45fa1715d88e1df1f24" -o "/etc/apt/trusted.gpg.d/git-core-ubuntu-ppa.asc"

	cat <<-EOF >"/etc/apt/sources.list.d/llvm-toolchain.list"
		deb https://apt.llvm.org/$VERSION_CODENAME/ llvm-toolchain-$VERSION_CODENAME-15 main
		deb-src https://apt.llvm.org/$VERSION_CODENAME/ llvm-toolchain-$VERSION_CODENAME-15 main
	EOF
	curl -sL "https://apt.llvm.org/llvm-snapshot.gpg.key" -o "/etc/apt/trusted.gpg.d/llvm-toolchain.asc"

	cat <<-EOF >"/etc/apt/sources.list.d/longsleep-ubuntu-golang-backports-$UBUNTU_CODENAME.list"
		deb https://ppa.launchpadcontent.net/longsleep/golang-backports/ubuntu $UBUNTU_CODENAME main
		deb-src https://ppa.launchpadcontent.net/longsleep/golang-backports/ubuntu $UBUNTU_CODENAME main
	EOF
	curl -sL "https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x52b59b1571a79dbc054901c0f6bc817356a3d45e" -o "/etc/apt/trusted.gpg.d/longsleep-ubuntu-golang-backports-$UBUNTU_CODENAME.asc"

	if [ -n "$CHN_NET" ]; then
		sed -i -e "s,apt.llvm.org,mirrors.tuna.tsinghua.edu.cn/llvm-apt,g" -e "s,^deb-src,# deb-src,g" "/etc/apt/sources.list.d/llvm-toolchain.list"
		sed -i "s,ppa.launchpadcontent.net,launchpad.proxy.ustclug.org,g" "/etc/apt/sources.list.d"/*
	fi

	! grep -q "$VERSION_CODENAME-backports" "/etc/apt/sources.list" || BPO_FLAG="-t $VERSION_CODENAME-backports"
	apt-get -qq update -y $BPO_FLAG
	# set +x
}

function install_dependencies(){
	__info_msg "正在安装依赖项..."
	# set -x
	apt-get -qq full-upgrade $BPO_FLAG > /dev/null
	apt-get -qq install $BPO_FLAG ack antlr3 asciidoc autoconf automake autopoint \
		binutils bison build-essential bzip2 ccache cmake cpio curl device-tree-compiler ecj \
		fakeroot fastjar flex gawk gettext genisoimage git gnutls-dev gperf haveged help2man \
		intltool jq libc6-dev-i386 libelf-dev libglib2.0-dev libgmp3-dev libltdl-dev libmpc-dev \
		libmpfr-dev libncurses5-dev libncursesw5 libncursesw5-dev libreadline-dev libssl-dev \
		libtool libyaml-dev libz-dev lrzsz msmtp nano ninja-build p7zip p7zip-full patch pkgconf \
		python2 libpython3-dev python3 python3-pip python3-ply python3-docutils python3-pyelftools \
		qemu-utils quilt re2c rsync scons squashfs-tools subversion swig texinfo uglifyjs unzip \
		vim wget xmlto xxd zlib1g-dev $VERSION_PACKAGE > /dev/null

	if [ -n "$CHN_NET" ]; then
		pip3 config set global.index-url "https://mirrors.aliyun.com/pypi/simple/"
		pip3 config set install.trusted-host "https://mirrors.aliyun.com"
	fi

	apt-get -qq install $BPO_FLAG gcc-9 g++-9 gcc-9-multilib g++-9-multilib > /dev/null
	ln -sf "/usr/bin/gcc-9" "/usr/bin/gcc"
	ln -sf "/usr/bin/g++-9" "/usr/bin/g++"
	ln -sf "/usr/bin/gcc-ar-9" "/usr/bin/gcc-ar"
	ln -sf "/usr/bin/gcc-nm-9" "/usr/bin/gcc-nm"
	ln -sf "/usr/bin/gcc-ranlib-9" "/usr/bin/gcc-ranlib"
	ln -sf "/usr/bin/g++" "/usr/bin/c++"
	[ -e "/usr/include/asm" ] || ln -sf "/usr/include/$(gcc -dumpmachine)/asm" "/usr/include/asm"

	apt-get -qq install $BPO_FLAG clang-15 lld-15 libclang-15-dev > /dev/null
	ln -sf "/usr/bin/clang-15" "/usr/bin/clang"
	ln -sf "/usr/bin/clang++-15" "/usr/bin/clang++"
	ln -sf "/usr/bin/clang-cpp-15" "/usr/bin/clang-cpp"

	apt-get -qq install $BPO_FLAG llvm-15 > /dev/null
	for i in "/usr/bin"/llvm-*-15; do
		ln -sf "$i" "${i%-15}"
	done

	apt-get -qq install $BPO_FLAG nodejs yarn > /dev/null
	if [ -n "$CHN_NET" ]; then
		npm config set registry "https://registry.npmmirror.com" --global
		yarn config set registry "https://registry.npmmirror.com" --global
	fi

	apt-get -qq install $BPO_FLAG golang-1.20-go > /dev/null
	rm -rf "/usr/bin/go" "/usr/bin/gofmt"
	ln -sf "/usr/lib/go-1.20/bin/go" "/usr/bin/go"
	ln -sf "/usr/lib/go-1.20/bin/gofmt" "/usr/bin/gofmt"
	if [ -n "$CHN_NET" ]; then
		go env -w GOPROXY=https://goproxy.cn,direct
	fi

	apt-get clean -qq -y

	if TMP_DIR="$(mktemp -d)"; then
		_pushd "$TMP_DIR"
	else
		__error_msg "无法创建 tmp 目录。"
		exit 1
	fi

	UPX_REV="4.0.1"
	curl -fLO "https://github.com/upx/upx/releases/download/v${UPX_REV}/upx-$UPX_REV-amd64_linux.tar.xz"
	tar -Jxf "upx-$UPX_REV-amd64_linux.tar.xz"
	rm -rf "/usr/bin/upx" "/usr/bin/upx-ucl"
	cp -fp "upx-$UPX_REV-amd64_linux/upx" "/usr/bin/upx-ucl"
	chmod 0755 "/usr/bin/upx-ucl"
	ln -sf "/usr/bin/upx-ucl" "/usr/bin/upx"

	svn co -r161078 "https://github.com/openwrt/openwrt/trunk/tools/padjffs2/src" "padjffs2" --quiet
	_pushd "padjffs2"
	make
	rm -rf "/usr/bin/padjffs2"
	cp -fp "padjffs2" "/usr/bin/padjffs2"
	_popd

	svn co -r19250 "https://github.com/openwrt/luci/trunk/modules/luci-base/src" "po2lmo" --quiet
	_pushd "po2lmo"
	make po2lmo
	rm -rf "/usr/bin/po2lmo"
	cp -fp "po2lmo" "/usr/bin/po2lmo"
	_popd

	curl -fL "https://build-scripts.immortalwrt.eu.org/modify-firmware.sh" -o "/usr/bin/modify-firmware"
	chmod 0755 "/usr/bin/modify-firmware"

	_popd
	rm -rf "$TMP_DIR"
	apt-get -qq autoremove --purge
	# set +x
	__success_msg "所有依赖项均已安装。"
}

function main(){
	check_system
	check_network
	update_apt_source
	install_dependencies
}

main
