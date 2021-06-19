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
sed -i 's/OpenWrt/k2p/g' package/base-files/files/bin/config_generate

echo '修改banner'
cp -f diy/hong0980/banner package/base-files/files/etc/

echo '添加软件包'
git clone https://github.com/hong0980/build diy/ipk
git clone https://github.com/xiaorouji/openwrt-package diy/xiaorouji
#sed -i '$a\chdbits.co\n\www.cnscg.club\n\pt.btschool.club\n\et8.org\n\www.nicept.net\n\pthome.net\n\ourbits.club\n\pt.m-team.cc\n\hdsky.me\n\ccfbits.org' diy/Lienol/lienol/luci-app-passwall/root/usr/share/passwall/rules/whitelist_host
#sed -i '$a\docker.com\n\docker.io' diy/Lienol/lienol/luci-app-passwall/root/usr/share/passwall/rules/blacklist_host
git clone https://github.com/destan19/OpenAppFilter diy/OpenAppFilter
git clone https://github.com/project-openwrt/luci-app-koolproxyR diy/luci-app-koolproxyR
git clone https://github.com/tty228/luci-app-serverchan diy/luci-app-serverchan
rm -rf diy/luci-app-serverchan/root/etc/config/serverchan
cp -f diy/hong0980/serverchan diy/luci-app-serverchan/root/etc/config/
sed -i 's/OpenWrt By tty228 路由状态/OpenWrt路由状态/g' diy/luci-app-serverchan/luasrc/model/cbi/serverchan/setting.lua
#git clone https://github.com/Leo-Jo-My/luci-app-vssr package/luci-app-vssr    
#git clone https://github.com/Leo-Jo-My/my diy/my      
#git clone https://github.com/Leo-Jo-My/luci-theme-Butterfly diy/luci-theme-Butterfly
#git clone https://github.com/Leo-Jo-My/luci-theme-opentomato diy/luci-theme-opentomato
#git clone https://github.com/Leo-Jo-My/luci-theme-opentomcat diy/luci-theme-opentomcat
#rm -rf diy/my/openwrt-v2ray-plugin
#rm -rf diy/my/openwrt-simple-obfs
#rm -rf diy/my/openwrt-dnsforwarder
ln -s ../diy package/openwrt-packages
sed -i 's/IMG_PREFIX:=\$(VERSION_DIST_SANITIZED)/IMG_PREFIX:=\$(shell date +%Y-%m%d-%H%M -d +8hour)-\$(VERSION_DIST_SANITIZED)/g' include/image.mk
sed -i '/ssid=OpenWrt/d' package/kernel/mac80211/files/lib/wifi/mac80211.sh
sed -i "/devidx}.mode=ap/a\			set wireless.default_radio\${devidx}.ssid=OpenWrt-\$(cat /sys/class/ieee80211/\${dev}/macaddress | awk -F \":\" '{print \$5\"\"\$6}' | tr a-z A-Z\)" package/kernel/mac80211/files/lib/wifi/mac80211.sh
cp -f diy/hong0980/zzz-default-settings package/lean/default-settings/files/
sed -i "s/OpenWrt /OpenWrt-$(TZ=UTC-8 date "+%Y-%m-%d")-/g" package/lean/default-settings/files/zzz-default-settings


echo '配置aria2'
git clone https://github.com/P3TERX/aria2.conf files/usr/share/aria2
sed -i 's/#rpc-secure/rpc-secure/g' files/usr/share/aria2/aria2.conf
sed -i 's/rpc-secret/#rpc-secret/g' files/usr/share/aria2/aria2.conf
sed -i 's/root\/.aria2/usr\/share\/aria2/g' files/usr/share/aria2/aria2.conf
sed -i 's/root\/Download/data\/download\/aria2/g' files/usr/share/aria2/*
#sed -i 's/extra_setting\"/extra_settings\"/g' feeds/luci/applications/luci-app-aria2/luasrc/model/cbi/aria2/config.lua
cp -Rf diy/hong0980/files/aria2/* feeds/packages/net/aria2/
sed -i "s/sed '\/^$\/d' \"\$config_file_tmp\" >\"\$config_file\"/cd \/usr\/share\/aria2 \&\& sh .\/tracker.sh\ncat \/usr\/share\/aria2\/aria2.conf > \"\$config_file\"\n\
echo '' >> \"\$config_file\"\nsed '\/^$\/d' \"\$config_file_tmp\" >> \"\$config_file\"/g" feeds/packages/net/aria2/files/aria2.init

echo '删除重复包'
rm -rf package/lean/luci-app-diskman
rm -rf package/lean/parted
rm -rf diy/xiaorouji/package/v2ray
rm -rf diy/xiaorouji/package/trojan
rm -rf diy/xiaorouji/package/ipt2socks
rm -rf diy/xiaorouji/package/shadowsocksr-libev
rm -rf diy/xiaorouji/package/pdnsd-alt
rm -rf diy/xiaorouji/package/verysync
rm -rf diy/xiaorouji/package/kcptun
rm -rf diy/xiaorouji/lienol/luci-app-kodexplorer
rm -rf diy/xiaorouji/lienol/luci-app-pppoe-relay
rm -rf diy/xiaorouji/others/luci-app-verysync
rm -rf diy/xiaorouji/lienol/luci-app-pptp-server
rm -rf diy/xiaorouji/lienol/luci-app-v2ray-server
rm -rf diy/xiaorouji/lienol/luci-app-guest-wifi
rm -rf package/ipk/Parted
echo '当前路径'
pwd
