#/bin/bash
#=================================================
#   Description: DIY script
#   Lisence: MIT
#   Author: P3TERX
#   Blog: https://p3terx.com
#=================================================

#echo '修改feeds'
#sed -i '1,2s/coolsnowwolf/hong0980/g' ./feeds.conf.default

echo '修改网关地址'
sed -i 's/192.168.1.1/192.168.2.1/g' package/base-files/files/bin/config_generate

echo '修改时区'
sed -i "s/'UTC'/'CST-8'\n        set system.@system[-1].zonename='Asia\/Shanghai'/g" package/base-files/files/bin/config_generate

echo '修改机器名称'
sed -i 's/OpenWrt/ASUS/g' package/base-files/files/bin/config_generate

echo '修改banner'
cp -f diy/hong0980/banner package/base-files/files/etc/

echo '添加软件包'
#git clone https://github.com/hong0980/diy diy/hong0980
git clone https://github.com/hong0980/build diy/ipk
git clone https://github.com/Lienol/openwrt-package diy/Lienol
sed -i '256,270d'  diy/ipk/luci-app-Network-settings/luasrc/model/cbi/advanced.lua  #删除指定9—32行
sed -i '9,32d'  diy/ipk/luci-app-Network-settings/luasrc/model/cbi/advanced.lua  #删除指定9—32行
#sed -i '$a\chdbits.co\n\www.cnscg.club\n\pt.btschool.club\n\et8.org\n\www.nicept.net\n\pthome.net\n\ourbits.club\n\pt.m-team.cc\n\hdsky.me\n\ccfbits.org' diy/hong0980/luci-app-passwall/root/usr/share/passwall/rules/whitelist_host
#sed -i '$a\docker.com\n\docker.io' diy/hong0980/luci-app-passwall/root/usr/share/passwall/rules/blacklist_host
git clone https://github.com/destan19/OpenAppFilter diy/OpenAppFilter
git clone https://github.com/tty228/luci-app-serverchan diy/luci-app-serverchan
cp -f diy/hong0980/serverchan diy/luci-app-serverchan/root/etc/config/
git clone https://github.com/jefferymvp/luci-app-koolproxyR diy/luci-app-koolproxyR
git clone https://github.com/fw876/helloworld diy/luci-app-ssr-plus
#svn co https://github.com/project-openwrt/openwrt/trunk/package/lean/libtorrent-rasterbar diy/libtorrent-rasterbar
git clone https://github.com/rufengsuixing/luci-app-autoipsetadder diy/luci-app-autoipsetadder

echo '替换aria2'
cp -Rf diy/hong0980/files/aria2/* feeds/packages/net/aria2/
#mkdir -p files/usr && mv -f diy/hong0980/files/usr/* files/usr/
#sed -i '311,313d' feeds/packages/net/aria2/files/aria2.init
#git clone https://github.com/P3TERX/aria2.conf files/usr/share/aria2 && rm -f files/usr/share/aria2/*.md
#sed -i 's/root\/Download/data\/download\/aria2/g' files/usr/share/aria2/*
#sed -i 's/extra_setting\"/extra_settings\"/g' feeds/luci/applications/luci-app-aria2/luasrc/model/cbi/aria2/config.lua
#sed -i "s/sed '\/^$\/d' \"\$config_file_tmp\" >\"\$config_file\"/cd \/usr\/share\/aria2 \&\& sh .\/tracker.sh\ncat \/usr\/share\/aria2\/aria2.conf > \"\$config_file\"\n\
#echo '' >> \"\$config_file\"\nsed '\/^$\/d' \"\$config_file_tmp\" >> \"\$config_file\"/g" feeds/packages/net/aria2/files/aria2.init

ln -s ../diy package/openwrt-packages
sed -i 's/IMG_PREFIX:=\$(VERSION_DIST_SANITIZED)/IMG_PREFIX:=\$(shell date +%Y-%m%d-%H%M -d +8hour)-\$(VERSION_DIST_SANITIZED)/g' include/image.mk
sed -i '/ssid=OpenWrt/d' package/kernel/mac80211/files/lib/wifi/mac80211.sh
sed -i "/devidx}.mode=ap/a\			set wireless.default_radio\${devidx}.ssid=OpenWrt-\$(cat /sys/class/ieee80211/\${dev}/macaddress | awk -F \":\" '{print \$5\"\"\$6}' | tr a-z A-Z\)" package/kernel/mac80211/files/lib/wifi/mac80211.sh
cp -f diy/hong0980/zzz-default-settings package/lean/default-settings/files/
sed -i "s/OpenWrt /OpenWrt-$(TZ=UTC-8 date "+%Y-%m-%d")-/g" package/lean/default-settings/files/zzz-default-settings

echo 'qBittorrent'
rm -rf package/lean/qt5 #5.1.3
rm -rf package/lean/luci-app-qbittorrent
rm -rf package/lean/qBittorrent #4.2.3
rm -rf diy/ipk/qbittorrent #4.1.9
#rm -rf diy/hong0980/qbittorrent #4.2.5
#rm -rf diy/hong0980/qt5 #5.98
#sed -i 's/+qbittorrent/+qBittorrent-Enhanced-Edition/g' diy/ipk/luci-app-qbittorrent/Makefile #qBittorrent-Enhanced-Edition 4.2.3.10
#sed -i '33,36d' diy/ipk/luci-app-qbittorrent/luasrc/model/cbi/qbittorrent/config.lua
sed -i 's/ +python3//g' diy/hong0980/qBittorrent-Enhanced-Edition/Makefile
sed -i 's/+mdadm//g' diy/ipk/luci-app-diskman/Makefile
sed -i "s/option enable '0'/option enable '1'/g" package/lean/luci-app-adbyby-plus/root/etc/config/adbyby

echo '删除重复包'
rm -rf package/lean/luci-app-dockerman
rm -rf package/lean/luci-app-diskman
rm -rf package/lean/luci-lib-docker
rm -rf package/lean/parted
rm -rf package/lean/verysync
rm -rf package/lean/luci-app-kodexplorer
rm -rf package/lean/luci-app-pppoe-relay
rm -rf package/lean/luci-app-verysync
rm -rf package/lean/luci-app-pptp-server
rm -rf package/lean/luci-app-v2ray-server
rm -rf package/lean/luci-app-guest-wifi
rm -rf package/ipk/Parted
echo '当前路径'
pwd
