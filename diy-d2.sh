#/bin/bash
echo 当前时间:$(date "+%Y-%m%d-%H%M ")
echo '修改网关地址'
sed -i 's/192.168.1.1/192.168.2.1/g' package/base-files/files/bin/config_generate
echo '修改时区'
sed -i "s/'UTC'/'CST-8'\n        set system.@system[-1].zonename='Asia\/Shanghai'/g" package/base-files/files/bin/config_generate

echo '修改机器名称'
sed -i 's/OpenWrt/Newifi/g' package/base-files/files/bin/config_generate

echo '修改banner'
cp -f diy/hong0980/banner package/base-files/files/etc/

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

echo '添加软件包'
#git clone https://github.com/hong0980/diy package/lean/hong0980
git clone https://github.com/hong0980/build package/ipk
#svn co https://github.com/linkease/nas-packages/trunk/network/services/ddnsto package/lean/ddnsto
#svn co https://github.com/linkease/nas-packages/trunk/luci/luci-app-ddnsto package/lean/luci-app-ddnsto
#sed -i 's/ddnsto.\$(PKG_ARCH_DDNSTO)/ddnsto.mipsel/g' package/lean/luci-app-ddnsto/Makefile
sed -i 's/ddnsto.\$(PKG_ARCH_DDNSTO)/ddnsto.mipsel/g' package/ipk/luci-app-ddnsto/Makefile
git clone https://github.com/jerrykuku/luci-app-jd-dailybonus package/lean/luci-app-jd-dailybonus
svn co https://github.com/Lienol/openwrt/trunk/package/lean/libtorrent-rasterbar package/lean/libtorrent-rasterbar
git clone https://github.com/xiaorouji/openwrt-passwall package/lean/xiaorouji
sed -i '296,315d' package/ipk/luci-app-Network-settings/luasrc/model/cbi/advanced.lua  #删除指定296-315行
sed -i '9,35d' package/ipk/luci-app-Network-settings/luasrc/model/cbi/advanced.lua  #删除指定9—35行
sed -i '$a\chdbits.co\n\www.cnscg.club\n\pt.btschool.club\n\et8.org\n\www.nicept.net\n\pthome.net\n\ourbits.club\n\pt.m-team.cc\n\hdsky.me\n\ccfbits.org' package/lean/xiaorouji/luci-app-passwall/root/usr/share/passwall/rules/direct_host
sed -i '$a\docker.com\n\docker.io' package/lean/xiaorouji/luci-app-passwall/root/usr/share/passwall/rules/proxy_host
sed -i 's/.*auto_update.*/	option auto_update 1\n	option week_update 0\n	option time_update 5/g' package/lean/xiaorouji/luci-app-passwall/root/etc/config/passwall
sed -i '/global_subscribe/a	option subscribe_proxy 0\noption auto_update_subscribe 1\noption week_update_subscribe 7\noption time_update_subscribe 5\noption filter_keyword_discarded 1\noption allowInsecure 1' package/lean/xiaorouji/luci-app-passwall/root/etc/config/passwall

git clone https://github.com/destan19/OpenAppFilter package/lean/OpenAppFilter
git clone https://github.com/tty228/luci-app-serverchan package/lean/luci-app-serverchan && \
cp -f diy/hong0980/serverchan package/lean/luci-app-serverchan/root/etc/config/
git clone https://github.com/jefferymvp/luci-app-koolproxyR package/lean/luci-app-koolproxyR
git clone https://github.com/rufengsuixing/luci-app-autoipsetadder package/lean/luci-app-autoipsetadder

git clone https://github.com/fw876/helloworld package/lean/luci-app-ssr-plus
if [ -e package/lean/luci-app-openclash/luci-app-openclash/luasrc/view/openclash/myip.htm ]; then
	sed -i '/status/am:section(SimpleSection).template = "openclash/myip"' package/lean/luci-app-ssr-plus/luci-app-ssr-plus/luasrc/model/cbi/shadowsocksr/client.lua
	sed -i '/get("@global_other/i\m:section(SimpleSection).template = "openclash/myip"' package/lean/xiaorouji/luci-app-passwall/luasrc/model/cbi/passwall/client/global.lua
else
	cp -vr diy/hong0980/myip.htm package/lean/luci-app-ssr-plus/luci-app-ssr-plus/luasrc/view
	sed -i '/status/am:section(SimpleSection).template = "myip"' package/lean/luci-app-ssr-plus/luci-app-ssr-plus/luasrc/model/cbi/shadowsocksr/client.lua
	sed -i '/get("@global_other/i\m:section(SimpleSection).template = "myip"' package/lean/xiaorouji/luci-app-passwall/luasrc/model/cbi/passwall/client/global.lua
fi

echo '替换aria2'
rm -rf feeds/luci/applications/luci-app-aria2 && svn co https://github.com/hong0980/luci/trunk/applications/luci-app-aria2 package/lean/luci-app-aria2
rm -rf feeds/packages/net/aria2 && svn co https://github.com/hong0980/packages/trunk/net/aria2 package/lean/aria2
cp -Rf diy/hong0980/files/aria2/* package/lean/aria2/

echo '替换transmission'
rm -rf feeds/luci/applications/luci-app-transmission && \
svn co https://github.com/hong0980/luci/trunk/applications/luci-app-transmission package/lean/luci-app-transmission
rm -rf feeds/packages/net/transmission && \
svn co https://github.com/hong0980/packages/trunk/net/transmission package/lean/transmission
p=`awk -F= '/PKG_VERSION:/{print $2}' package/lean/transmission/Makefile`
[ -e diy/hong0980/files/transmission/tr$p.patch ] && cp -vRf diy/hong0980/files/transmission/tr$p.patch package/lean/transmission/patches/tr$p.patch
rm -rf feeds/packages/net/transmission-web-control && \
svn co https://github.com/hong0980/packages/trunk/net/transmission-web-control package/lean/transmission-web-control
rm -rf feeds/packages/net/ariang && \
svn co https://github.com/hong0980/packages/trunk/net/ariang package/lean/ariang
sed -i 's/IMG_PREFIX:=\$(VERSION_DIST_SANITIZED)/IMG_PREFIX:=\$(shell date +%Y-%m%d-%H%M -d +8hour)-\$(VERSION_DIST_SANITIZED)/g' include/image.mk
# sed -i '/ssid=OpenWrt/d' package/kernel/mac80211/files/lib/wifi/mac80211.sh
# sed -i "/devidx}.mode=ap/a\			set wireless.default_radio\${devidx}.ssid=OpenWrt-\$(cat /sys/class/ieee80211/\${dev}/macaddress | awk -F \":\" '{print \$5\"\"\$6}' | tr a-z A-Z\)" package/kernel/mac80211/files/lib/wifi/mac80211.sh
cp -vRf diy/hong0980/zzz-default-settings package/lean/default-settings/files/
aa=`grep DISTRIB_DESCRIPTION package/base-files/files/etc/openwrt_release | awk -F"'" '{print $2}'`
sed -i "s/${aa}/${aa}-$(TZ=UTC-8 date +%Y年%m月%d日)/g" package/base-files/files/etc/openwrt_release

echo 'qBittorrent'
cat package/lean/luci-app-qbittorrent/Makefile > package/ipk/luci-app-qbittorrent/Makefile
rm -rf package/lean/luci-app-qbittorrent
rm -rf package/lean/qBittorrent #4.3.5
rm -rf package/lean/qtbase #5.1.5
rm -rf package/lean/qttools #5.1.5
# rm -rf package/ipk/qbittorrent #4.3.1
# rm -rf diy/hong0980/qt5 #5.98
sed -i 's/+mdadm//g' package/ipk/luci-app-diskman/Makefile
sed -i "s/option enable '0'/option enable '1'/g" package/lean/luci-app-adbyby-plus/root/etc/config/adbyby
rm -rf package/ipk/Parted
rm -rf feeds/packages/lang/node && svn co https://github.com/Lienol/openwrt-packages/trunk/lang/node feeds/packages/lang/node

ln -s ../diy package/openwrt-packages

echo '当前路径'
