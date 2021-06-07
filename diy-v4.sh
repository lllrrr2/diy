#!/usr/bin/env bash

if [ "$(ping -c 1 baidu.com | sed -n '/64 bytes from/p')" ]; then
	echo -e "\n网络正常：\n当前WAN的IP是：$(curl ip.sb)\n"
else
	echo -e "\n网络不通\n"
	exit 1
fi

ShellDir=${JD_DIR:-$(
	cd $(dirname $0)
	pwd
)}
LogDir=$ShellDir/log
panelDir=$ShellDir/panel
ConfigDir=$ShellDir/config
botDir=$ConfigDir/bot
ScriptsDir=$ShellDir/scripts
FileConf=$ConfigDir/config.sh
ListCron=$ConfigDir/crontab.list

[[ -e $ConfigDir/cookie.sh ]] && . $ConfigDir/cookie.sh
[[ -e $ConfigDir/config.sh ]] && . $ConfigDir/config.sh
[[ -d $ScriptsDir/sh ]] || mkdir -p $ScriptsDir/sh
[[ -d $ConfigDir/sh ]] || mkdir -p $ConfigDir/sh

dir_root=$ShellDir
[[ -f $ShellDir/jshare.sh ]] && . $ShellDir/jshare.sh

log() {
	#git log -p -3 --date=format:'%Y年%m月%d日 %H:%M:%S' | grep -Ev "Author|index|diff --git|^$" | sed -e "s/Date:  /更新日期：/;s/ file changed/个文件更改/;s/ insertion/次插入/;s/feature/特征/;s/ deletions/次删除/;s/commit/\ncommit/"
	git log --stat -3 --date=format:'%Y年%m月%d日 %H:%M:%S' | grep -Ev "Author|^$" | sed -e "s/Date:  /更新日期：/;s/ file changed/个文件更改/;s/ insertion/次插入/;s/feature/特征/;s/ deletions/次删除/;s/commit/\ncommit/"
}

# docker exec -it jd /bin/bash

cd $ShellDir
[[ -d $panelDir ]] || git clone https://ghproxy.com/https://github.com/hong0980/panel
[[ -s $ConfigDir/auth.json ]] || echo '{"user":"admin","password":"admin"}' > $ConfigDir/auth.json

if [[ $(ps | grep -v grep | grep -c "ttyd") -eq "0" ]]; then
	echo -e "======================== ###. 启动网页终端 ========================\n"
	# if [[ `which ttyd` = "" ]]; then # 系统ttyd
	# sed -i 's|mirrors.aliyun.com|mirrors.tuna.tsinghua.edu.cn|g' /etc/apk/repositories
	# apk update -f && apk upgrade && apk --no-cache add -f ttyd
	# apk update -f && apk upgrade && apk --no-cache add -f subversion ## 安装subversion,使用 svn co 命令
	# fi
	if [[ ! -x /usr/local/bin/ttyd ]]; then
		if [[ -e $panelDir/ttyd/ttyd.$(uname -m) ]]; then
			cp -f "$panelDir/ttyd/ttyd.$(uname -m)" /usr/local/bin/ttyd && \
			chmod +x /usr/local/bin/ttyd
		else
			echo -e "CPU架构暂不支持，无法正常使用网页终端！\n"
		fi
	fi

	if [[ -x /usr/local/bin/ttyd ]]; then
		export PS1="\u@\h:\w $ "
		if pm2 start ttyd --name="ttyd" -- -t fontSize=14 -t disableLeaveAlert=true -t rendererType=webgl bash; then
			echo -e "网页终端启动成功...\n"
		else
			echo -e "网页终端启动失败，但容器将继续启动...\n"
		fi
	fi
fi

if [[ $(ps | grep -v grep | grep -c "server.js") -eq "0" ]]; then
	echo -e "======================== ###. 启动控制面板 ========================\n"
	cd $panelDir
	if pm2 start ecosystem.config.js; then
		echo -e "控制面板启动成功...\n请访问 http://<ip>:5678 登陆并修改配置..."
		echo -e "如未修改用户名密码，则初始用户名为：admin，初始密码为：admin\n"
	else
		echo -e "控制面板启动失败，但容器将继续启动...\n"
	fi
	cd $ShellDir
fi

[[ "$(grep "TG_BOT=" $FileConf)" ]] || sed '/EnableExtraShell/a\\n## 启动bot，填 true 则开机启动\nTG_BOT=""' $FileConf -i
if [[ $TG_BOT == true ]]; then ## TG_BOT="true" 自定义变量
	wget -q -N -t2 -T3 https://raw.githubusercontent.com/SuMaiKaDe/jddockerbot/master/botV4.py
	[[ -d $botDir ]] || mkdir -p $botDir
	[[ -e $botDir/botV4.py ]] || cp -f $ShellDir/botV4.py $botDir/botV4.py
	change=$(diff $ShellDir/botV4.py $botDir/botV4.py)
	[[ -n "$change" ]] && cp -f $ConfigDir/botV4.py $botDir/botV4.py
	[[ -e $botDir/bot.json ]] || wget -q https://raw.githubusercontent.com/SuMaiKaDe/jddockerbot/master/config/bot.json -P $botDir
	[[ -e $botDir/rebotV4.sh ]] || wget -q https://raw.githubusercontent.com/SuMaiKaDe/jddockerbot/master/rebotV4.sh -P $botDir
	[[ -e $botDir/requirements.txt ]] || (
		cd $botDir && wget -q https://raw.githubusercontent.com/SuMaiKaDe/jddockerbot/master/requirements.txt && \
		pip3 install -r requirements.txt && pip3 install --upgrade pip 2>&1
	)
	[[ $(grep -E "你的USERID" $botDir/bot.json) ]] || pm2 start botV4.py --watch "$botDir/botV4.py" --watch-delay 10 --name=bot
	cd $ShellDir
fi

sed -i 's/\.log/\.txt/g' *.sh
# sed -i -e 's/\*.txt/\*/g' jlog.sh
# sed -i 's|url_scripts=.*|url_scripts=https://gitee.com/highdimen/clone_scripts|' $ShellDir/jup.sh

# [ "`grep server $ListCron`" ] || sed -i '/互助码清单/i*\/10 * * * * [[ $(pgrep server) ]] || bash /jd/config/diy.sh' $ListCron
[ "`grep diy $ShellDir/s6-overlay/etc/cont-init.d/20-jup`" ] || echo -e "\nbash /jd/config/diy.sh" >> $ShellDir/s6-overlay/etc/cont-init.d/20-jup
sed -i '/防止被贩卖等/d' $ScriptsDir/sendNotify.js
sed -i 's/ &>\/dev\/null//' $ListCron
sed -i 's/jup.log/jup.txt/' $ListCron
sed -i 's/Shell=.*/Shell="true"/' $FileConf

[ -e $ConfigDir/sh.patch ] && rm $ConfigDir/sh.patch
for ssh in *.sh; do
	[[ -e $ConfigDir/sh/$ssh ]] || cp -f $ShellDir/$ssh $ConfigDir/sh
	ln -sf $ShellDir/$ssh $ScriptsDir/sh/${ssh%%.*}
	r=$(diff -u $ConfigDir/sh/$ssh $ShellDir/$ssh)
	if [[ -n $r ]]; then
		echo -e "================== $ssh 更新了 ==================\n\n$r"
		echo -e "\n=====================================================\n\n"
		diff -u $ConfigDir/sh/$ssh $ShellDir/$ssh >> $ConfigDir/sh.patch
		cp -f $ShellDir/$ssh $ConfigDir/sh
		ok=0
	fi
done

for aa in $(grep jtask $ListCron | awk '{print $7}' | grep "^j[dx]_"); do
	bb=$(grep "new Env" $ScriptsDir/${aa}.js 2>/dev/null | awk -F "'|\"" '{print $2}' | head -1)
	cc=$(grep -w -n "jtask $aa" $ListCron | cut -d: -f1)
	[[ $bb ]] && [[ "$(grep "$aa" $ListCron | grep "\#\#")" ]] || \
	sed -i "$cc s/$/ now ## $bb/" $ListCron ##匹配行尾添加
done

wget -qN -t 2 --no-check-certificate https://ghproxy.com/https://raw.githubusercontent.com/hong0980/diy/master/git_diy.sh -P $ConfigDir || \
wget -qN -t 2 --no-check-certificate https://raw.fastgit.org/hong0980/diy/master/git_diy.sh -P $ConfigDir || \
wget -qN -t 2 --no-check-certificate https://cdn.jsdelivr.net/gh/hong0980/diy@master/git_diy.sh -P $ConfigDir

if [[ ! -x $ShellDir/git_diy.sh ]]; then
	cp -f $ConfigDir/git_diy.sh $ShellDir/git_diy.sh
	chmod +x $ShellDir/git_diy.sh
	ln -sf $ShellDir/git_diy.sh /usr/local/bin/diy
fi

cy=$(diff -u $ShellDir/git_diy.sh $ConfigDir/git_diy.sh)
if [[ -n "$cy" ]]; then
	cp -f $ConfigDir/git_diy.sh $ShellDir/git_diy.sh
	echo -e "\n$(date "+%Y-%m-%d-%H-%M-%S")\n更新git_diy.sh成功，内容如下"
	echo -e "\n========开始=======\n$cy\n========结束=======\n"
fi

if [[ $(ls $LogDir/*/*.log 2>/dev/null | wc -l) -gt "0" ]]; then
	for k in $(ls $LogDir/*/*.log); do
		c=$(echo $k | cut -d'.' -f1)
		mv -f $k ${c}.txt
	done
fi

if [[ $Cookie1 ]] && [[ $(ls $LogDir/jcode 2>/dev/null | wc -l) -ne "0" ]]; then
	[[ -d $LogDir/config_sh_bak ]] || mkdir -p $LogDir/config_sh_bak
	[[ "$(diff $ConfigDir/config.sh $LogDir/config_sh_bak/$(ls -r $LogDir/config_sh_bak | sed -n 1p))" ]] && cp $FileConf $LogDir/config_sh_bak/$(date "+%Y-%m-%d-%H-%M-%S").txt
	jcode >/dev/null 2>&1
	for p in $(awk -F"[0-9]" '/^My/{print $1}' $LogDir/jcode/$(ls -r $LogDir/jcode | sed -n 1p) | uniq | cut -b 3-); do
		Name=$(grep -B 1 "My${p}1=" $LogDir/jcode/$(ls -r $LogDir/jcode | sed -n 1p) | sed -n 1p)
		po=$(echo ${p} | tr "A-Z" "a-z")
		if [[ $(echo $Name | grep -c "##") -eq "0" ]]; then
			sed -r "/^ForOther${p}|^My${p}|^## ${Name}/d" $FileConf -i
			echo -e "## ${Name}jd_${po}" >> $FileConf
		else
			sed -r "/^ForOther${p}|^My${p}|^${Name}/d" $FileConf -i
			echo -e "${Name}jd_${po}" >> $FileConf
		fi
		grep "$p" $LogDir/jcode/$(ls -r $LogDir/jcode | sed -n 1p) | grep -vE "=\"\"|=\'\{\}\'|=\'\'" >> $FileConf
	done
fi

[[ "$ok" == "0" ]] && notify "sh脚本更新了" "$(grep -Ev "^$" config/sh.patch | sed "s/$/&\\\n/")"
# echo -e "截止 $(date "+%Y年%m月%d日 %H:%M:%S") 的最后3次更新 shell 的信息：$(cd $ShellDir && log)\n\n"
echo -e "截止 $(date "+%Y年%m月%d日 %H:%M:%S") 的最后3次更新 scripts 的信息：$(cd $ScriptsDir && log)\n\n"

update_crontab

echo "自定义脚本运行完成"