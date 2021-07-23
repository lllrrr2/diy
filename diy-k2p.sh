#/bin/bash
echo 当前时间:$(date "+%Y-%m%d-%H%M ")
echo '修改网关地址'
sed -i 's/192.168.1.1/192.168.2.140/g' package/base-files/files/bin/config_generate

echo '修改时区'
sed -i "s/'UTC'/'CST-8'\n        set system.@system[-1].zonename='Asia\/Shanghai'/g" package/base-files/files/bin/config_generate

echo '修改机器名称'
sed -i 's/OpenWrt/k2p/g' package/base-files/files/bin/config_generate

echo '修改banner'
cp -f diy/hong0980/banner package/base-files/files/etc/

echo '添加软件包'
git clone https://github.com/hong0980/build package/ipk
sed -i 's/ddnsto.\$(PKG_ARCH_DDNSTO)/ddnsto.mipsel/g' package/ipk/luci-app-ddnsto/Makefile
git clone https://github.com/xiaorouji/openwrt-passwall package/lean/xiaorouji
git clone https://github.com/destan19/OpenAppFilter package/lean/OpenAppFilter
git clone https://github.com/tty228/luci-app-serverchan package/lean/luci-app-serverchan && \
cp -f diy/hong0980/serverchan package/lean/luci-app-serverchan/root/etc/config/
#git clone https://github.com/Leo-Jo-My/luci-app-vssr package/luci-app-vssr    
#git clone https://github.com/Leo-Jo-My/my diy/my      
#git clone https://github.com/Leo-Jo-My/luci-theme-Butterfly diy/luci-theme-Butterfly
git clone https://github.com/fw876/helloworld package/lean/luci-app-ssr-plus
if [ -e package/lean/luci-app-openclash/luci-app-openclash/luasrc/view/openclash/myip.htm ]; then
	sed -i '/status/am:section(SimpleSection).template = "openclash/myip"' package/lean/luci-app-ssr-plus/luci-app-ssr-plus/luasrc/model/cbi/shadowsocksr/client.lua
	sed -i '/get("@global_other/i\m:section(SimpleSection).template = "openclash/myip"' package/lean/xiaorouji/luci-app-passwall/luasrc/model/cbi/passwall/client/global.lua
else
	cp -vr diy/hong0980/myip.htm package/lean/luci-app-ssr-plus/luci-app-ssr-plus/luasrc/view
	sed -i '/status/am:section(SimpleSection).template = "myip"' package/lean/luci-app-ssr-plus/luci-app-ssr-plus/luasrc/model/cbi/shadowsocksr/client.lua
	sed -i '/get("@global_other/i\m:section(SimpleSection).template = "myip"' package/lean/xiaorouji/luci-app-passwall/luasrc/model/cbi/passwall/client/global.lua
fi

#rm -rf diy/my/openwrt-simple-obfs
#rm -rf diy/my/openwrt-dnsforwarder
ln -s ../diy package/openwrt-packages
sed -i 's/IMG_PREFIX:=\$(VERSION_DIST_SANITIZED)/IMG_PREFIX:=\$(shell date +%Y-%m%d-%H%M -d +8hour)-\$(VERSION_DIST_SANITIZED)/g' include/image.mk
# sed -i '/ssid=OpenWrt/d' package/kernel/mac80211/files/lib/wifi/mac80211.sh
# sed -i "/devidx}.mode=ap/a\			set wireless.default_radio\${devidx}.ssid=OpenWrt-\$(cat /sys/class/ieee80211/\${dev}/macaddress | awk -F \":\" '{print \$5\"\"\$6}' | tr a-z A-Z\)" package/kernel/mac80211/files/lib/wifi/mac80211.sh
cp -vRf diy/hong0980/zzz-default-settings package/lean/default-settings/files/
aa=`grep DISTRIB_DESCRIPTION package/base-files/files/etc/openwrt_release | awk -F"'" '{print $2}'`
sed -i "s/${aa}/${aa}-$(TZ=UTC-8 date +%Y年%m月%d日)/g" package/base-files/files/etc/openwrt_release


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
sed -i "s/option enable '0'/option enable '1'/g" package/lean/luci-app-adbyby-plus/root/etc/config/adbyby
ln -s ../diy package/openwrt-packages

echo '当前路径'
