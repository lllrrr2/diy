#/bin/bash

echo '修改网关地址'
sed -i 's/192.168.1.1/192.168.2.150/g' package/base-files/files/bin/config_generate

echo '修改时区'
sed -i "s/'UTC'/'CST-8'\n        set system.@system[-1].zonename='Asia\/Shanghai'/g" package/base-files/files/bin/config_generate

echo '修改机器名称'
sed -i 's/OpenWrt/OpenWrt-x64/g' package/base-files/files/bin/config_generate

echo '修改banner'
cp -f diy/hong0980/banner package/base-files/files/etc/

echo '添加软件包'
git clone https://github.com/hong0980/build package/ipk

git clone https://github.com/xiaorouji/openwrt-passwall package/lean/xiaorouji
git clone https://github.com/vernesong/OpenClash package/lean/luci-app-openclash
git clone https://github.com/jerrykuku/luci-app-vssr package/lean/luci-app-vssr
git clone https://github.com/jerrykuku/lua-maxminddb package/lean/lua-maxminddb
git clone https://github.com/pymumu/luci-app-smartdns feeds/luci/applications/luci-app-smartdns
svn co https://github.com/Lienol/openwrt/trunk/package/diy/luci-app-adguardhome package/lean/luci-app-adguardhome
svn co https://github.com/py14551/openwrt/trunk/adguardhome package/lean/adguardhome
git clone https://github.com/destan19/OpenAppFilter package/lean/OpenAppFilter
git clone https://github.com/AlexZhuo/luci-app-bandwidthd package/lean/luci-app-bandwidthd
git clone https://github.com/tty228/luci-app-serverchan package/lean/luci-app-serverchan
cp -f diy/hong0980/serverchan package/lean/luci-app-serverchan/root/etc/config/
git clone https://github.com/jefferymvp/luci-app-koolproxyR package/lean/luci-app-koolproxyR
# sed -i 's?../../lang?$(TOPDIR)/feeds/packages/lang?g' feeds/packages/lang/*/Makefile
git clone https://github.com/fw876/helloworld package/lean/luci-app-ssr-plus

if [ -e package/lean/luci-app-openclash/luci-app-openclash/luasrc/view/openclash/myip.htm ]; then
	sed -i '/status/am:section(SimpleSection).template = "openclash/myip"' package/lean/luci-app-ssr-plus/luci-app-ssr-plus/luasrc/model/cbi/shadowsocksr/client.lua
	sed -i '/get("@global_other/i\m:section(SimpleSection).template = "openclash/myip"' package/lean/xiaorouji/luci-app-passwall/luasrc/model/cbi/passwall/client/global.lua
else
	cp -vr diy/hong0980/myip.htm package/lean/luci-app-ssr-plus/luci-app-ssr-plus/luasrc/view
	sed -i '/status/am:section(SimpleSection).template = "myip"' package/lean/luci-app-ssr-plus/luci-app-ssr-plus/luasrc/model/cbi/shadowsocksr/client.lua
	sed -i '/get("@global_other/i\m:section(SimpleSection).template = "myip"' package/lean/xiaorouji/luci-app-passwall/luasrc/model/cbi/passwall/client/global.lua
fi

echo '添加关机'
sed -i '/"action_reboot"/a\    entry({"admin","system","PowerOff"},template("admin_system/poweroff"),_("Power Off"),92)\n    entry({"admin","system","PowerOff","call"},post("PowerOff"))' \
feeds/luci/modules/luci-mod-admin-full/luasrc/controller/admin/system.lua
echo -e 'function PowerOff()\n  luci.util.exec("poweroff")\nend' >> \
feeds/luci/modules/luci-mod-admin-full/luasrc/controller/admin/system.lua

echo '替换aria2'
rm -rf feeds/luci/applications/luci-app-aria2 && \
svn co https://github.com/hong0980/luci/trunk/applications/luci-app-aria2 feeds/luci/applications/luci-app-aria2
rm -rf feeds/packages/net/aria2 && \
svn co https://github.com/hong0980/packages/trunk/net/aria2 feeds/packages/net/aria2
cp -Rf diy/hong0980/files/aria2/* feeds/packages/net/aria2/
rm -rf feeds/packages/net/ariang && \
svn co https://github.com/hong0980/packages/trunk/net/ariang package/lean/ariang

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

rm -rf package/lean/luci-app-adbyby-plus && \
git clone https://github.com/small-5/luci-app-adblock-plus  package/lean/luci-app-adblock-plus

mkdir -p feeds/package/lean/luci-app-netdata/root/etc/uci-defaults
cat >> "feeds/package/lean/luci-app-netdata/root/etc/uci-defaults/40_luci-app-netdata" <<-\EOF
#!/bin/sh
for x in ls /usr/share/netdata/webcn; do
	[ -f /usr/share/netdata/webcn/$x ] && mv -f /usr/share/netdata/webcn/$x /usr/share/netdata/web/$x
done
rm -rf /usr/share/netdata/webcn
rm -rf /tmp/luci-*
exit 0
EOF

sed -i 's/IMG_PREFIX:=\$(VERSION_DIST_SANITIZED)/IMG_PREFIX:=\$(shell date +%Y-%m%d-%H%M -d +8hour)-\$(VERSION_DIST_SANITIZED)/g' include/image.mk
sed -i '/ssid=OpenWrt/d' package/kernel/mac80211/files/lib/wifi/mac80211.sh
sed -i "/devidx}.mode=ap/a\			set wireless.default_radio\${devidx}.ssid=OpenWrt-\$(cat /sys/class/ieee80211/\${dev}/macaddress | awk -F \":\" '{print \$5\"\"\$6}' | tr a-z A-Z\)" package/kernel/mac80211/files/lib/wifi/mac80211.sh
cp -Rvf diy/hong0980/zzz-default-settings package/lean/default-settings/files/
aa=`grep DISTRIB_DESCRIPTION package/base-files/files/etc/openwrt_release | awk -F"'" '{print $2}'`
sed -i "s/${aa}/${aa}-$(TZ=UTC-8 date +%Y年%m月%d日)/g" package/base-files/files/etc/openwrt_release

git clone https://github.com/MatteoRagni/AmuleWebUI-Reloaded files/usr/share/amule/webserver/AmuleWebUI-Reloaded
sed -i 's/runasuser "$config_dir"/runasuser "$config_dir"\nwget -P "$config_dir" -O "$config_dir\/nodes.dat" http:\/\/upd.emule-security.org\/nodes.dat/g' package/lean/luci-app-amule/root/etc/init.d/amule
sed -i "s/tb.innerHTML = '<em>/tb.innerHTML = '<em><b><font color=red>/g" package/lean/luci-app-amule/luasrc/view/amule/overview_status.htm
sed -i "s/var links = '<em>/var links = '<em><b><font color=green>/g" package/lean/luci-app-amule/luasrc/view/amule/overview_status.htm
rm -rf package/lean/antileech/src/* && \
git clone https://github.com/persmule/amule-dlp.antiLeech package/lean/antileech/src

echo 'qBittorrent'
# cat package/lean/luci-app-qbittorrent/Makefile > package/ipk/luci-app-qbittorrent/Makefile
#sed -i 's/+qBittorrent/+qBittorrent +python3/g' package/ipk/luci-app-qbittorrent/Makefile
rm -rf package/lean/luci-app-qbittorrent
#rm -rf package/lean/qtbase #5.1.5
#rm -rf package/lean/qttools #5.1.5
#rm -rf package/lean/qBittorrent #4.2.3
rm -rf package/ipk/qbittorrent #4.1.9
rm -rf diy/hong0980/qbittorrent #4.2.5
rm -rf diy/hong0980/qt5 #5.9.8

if [ "`grep "^CONFIG_PACKAGE_deluge=y" .config`" ]; then
	git clone https://gitee.com/hong0980/deluge package/lean/deluge
	rm -rf feeds/packages/libs/boost && svn co https://github.com/openwrt/packages/trunk/libs/boost feeds/packages/libs/boost
#	sed -i '/package.mk/a include $(INCLUDE_DIR)/nls.mk' package/lean/qBittorrent/Makefile
#	sed -i '/CONFIGURE_VARS/i TARGET_LDFLAGS += $(if $(INTL_FULL),-liconv) $(if $(INTL_FULL),-lintl)' package/lean/qBittorrent/Makefile
#	sed -i 's/+rblibtorrent/+libtorrent-rasterbar $(ICONV_DEPENDS) $(INTL_DEPENDS)/' package/lean/qBittorrent/Makefile
	sed -i 's?../../devel?$(TOPDIR)/feeds/packages/devel?g' feeds/packages/devel/ninja/ninja-cmake.mk
	rm package/lean/qBittorrent/* && wget https://github.com/Entware/rtndev/raw/master/qbittorrent/Makefile -P package/lean/qBittorrent/ && \
	sed -i 's/opt/usr/g' package/lean/qBittorrent/Makefile
	sed -i '/ini/d' package/lean/qBittorrent/Makefile
fi

echo '删除重复包'
rm -rf package/lean/autocore
rm -rf package/lean/luci-app-docker
#svn co https://github.com/openwrt/packages/trunk/utils/docker package/lean/docker && sed -i 's/include ..\/..\/lang/include \$(TOPDIR)\/feeds\/packages\/lang/g' package/lean/docker/Makefile
rm -rf package/lean/luci-app-diskman
rm -rf package/lean/xiaorouji/luci-app-kodexplorer
rm -rf package/lean/xiaorouji/luci-app-pppoe-relay
rm -rf package/lean/xiaorouji/others/luci-app-verysync
rm -rf package/lean/xiaorouji/luci-app-pptp-server
rm -rf package/lean/xiaorouji/luci-app-v2ray-server
rm -rf package/lean/xiaorouji/luci-app-guest-wifi
rm -rf package/ipk/Parted
ln -s ../diy package/openwrt-packages
