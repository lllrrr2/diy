#!/usr/bin/env bash
ShellDir=${JD_DIR:-$(cd $(dirname $0); pwd)}
LogDir=${ShellDir}/log
ConfigDir=${ShellDir}/config
ScriptsDir=${ShellDir}/scripts
FileConf=${ConfigDir}/config.sh
ListCron=${ConfigDir}/crontab.list
PublicDir=${ShellDir}/panel/public

cd ${ShellDir}
sed -i 's/\.log/\.txt/g' ${ShellDir}/*.sh
sed -i -e 's/\*.txt/\*/g' ${ShellDir}/rm_log.sh
sed -i '/防止被贩卖等/d' ${ScriptsDir}/sendNotify.js
#sed -i 's/const bean = 500/const bean = 1/' ${ScriptsDir}/jd_beauty.js
# sed -i -e 's/jdNotify = true/jdNotify = false/g;s/helpAuthor = true/helpAuthor = false/g' ${ScriptsDir}/*.js
sed -i -e 's/.*bash git/51 9-23 \* \* \* bash git/;s/pull.log/pull.txt/' ${ListCron}
sed -i 's/.*jd_bookshop/\#12 8,12,18 \* \* \* bash jd jd_bookshop/g' ${ListCron}
sed -i 's/\} | awk -F/\} | grep -v v6 | awk -F/' ${ShellDir}/jd.sh
sed -i 's/drx\]_\"/drx\]_|z_\"/' ${ShellDir}/jd.sh
sed -i -e 's/ [bB]ook[sS]hop//g;s/ 口袋书店//g;s/ global/ carnivalcity/g;s/ 环球挑战赛/ 京东手机狂欢城/g;s/ Global/ Carni/g' ${ShellDir}/export_sharecodes.sh
sed -i 's/Shell=""/Shell="true"/' ${FileConf}

if [[ ! -e git_diy.sh ]]; then
		wget -N -t2 -T3 https://raw.githubusercontent.com/hong0980/diy/master/git_diy.sh || \
		wget -N -t2 -T3 https://cdn.jsdelivr.net/gh/hong0980/diy@master/git_diy.sh && \
		chmod +x git_diy.sh
		sed -i 's/jtask/bash jd/' ${JD_DIR}/git_diy.sh
	else
	[ `grep -c "whyour hundun" ${ListCron}` -eq "0" ] && \
		sed -i "/hangup/a29 5 * * * \${JD_DIR}\/git_diy.sh whyour hundun \"quanx\/jx|quanx\/jd\" tokens >> \${JD_DIR}\/log\/diy_pull.txt 2>&1\n30 5 * * * \${JD_DIR}\/git_diy.sh monk-coder dust i-chenzhe >> \${JD_DIR}\/log\/diy_pull.txt 2>&1" ${ListCron}
fi

crontab ${ListCron}
cp -rf ${ShellDir}/*.sh ${ScriptsDir}

if [[ `ls -A ${LogDir}/export_sharecodes | wc -l` -gt 0 ]]; then
	[[ -d ${LogDir}/config_sh_bak ]] || mkdir -p ${LogDir}/config_sh_bak
	cp ${FileConf} ${LogDir}/config_sh_bak/$(date "+%Y-%m-%d-%H-%M-%S").sh
	. export_sharecodes.sh 1>/dev/null 2>&1
	for p in $(awk -F"[0-9]" '/^My/{print $1}' ${LogDir}/export_sharecodes/$(ls -r ${LogDir}/export_sharecodes | sed -n 1p) | uniq | cut -b 3-); do
      po=`echo ${p} | tr "A-Z" "a-z"`
      Name=`grep -B 1 "My${p}1=" ${LogDir}/export_sharecodes/$(ls -r ${LogDir}/export_sharecodes | sed -n 1p) | sed -n 1p`
      sed -r "/^ForOther${p}|^My${p}|^## ${Name}/d" ${FileConf} -i
      echo -e "## ${Name}jd_${po}" >> ${FileConf}
      grep "$p" ${LogDir}/export_sharecodes/$(ls -r ${LogDir}/export_sharecodes | sed -n 1p) | grep -vE "My${p}[0-9]=''|ForOther${p}[0-9]=\"\"" >> ${FileConf}
	done
	# sed 'N;/^\n\n/D' ${FileConf}
fi

if [[ `grep -c "#diy" ${PublicDir}/run.html` -eq 0 ]]; then
	pp=$(($(grep -n "git_pull.sh 2>&1" ${PublicDir}/run.html | awk -F: '{print $1}') +3))
	sed -i '/>重置用户名密码/a\                <button id="diy" title="运行自定义脚本">运行自定义脚本<\/button>' ${PublicDir}/run.html
	sed -i 's/#ps,/#ps, #diy,/' ${PublicDir}/run.html
	sed -i "${pp} i\                    case 'diy':\n                        confirmTxt = '确认运行自定义脚本？';\n                        cmd = \`cd config && bash \${this.id}.sh\`;\n                        break;" ${PublicDir}/run.html
	cp -rf ${PublicDir}/*.html ${ScriptsDir}
fi

if [[ `grep -c "autoReplace" ${PublicDir}/home.html 2>/dev/null` -eq "0" ]]; then
	if [[ ! -e home.html ]]; then
		wget -N -t2 -T3 https://raw.githubusercontent.com/hong0980/diy/master/home.html || \
		wget -N -t2 -T3 https://cdn.jsdelivr.net/gh/hong0980/diy@master/home.html
	fi
	[[ -e home.html ]] && cp -f home.html ${PublicDir}/home.html
fi

echo "自定义脚本运行完成"