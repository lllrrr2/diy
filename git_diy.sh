#!/usr/bin/env bash

ShellDir=${JD_DIR:-$(
	cd $(dirname $0)
	pwd
)}
ListCron=$ShellDir/config/crontab.list
ScriptsDir=$ShellDir/scripts
ConfigDir=$ShellDir/config
dir_root=$ShellDir

[[ -f $ShellDir/jshare.sh ]] && . $ShellDir/jshare.sh
[[ -f $ConfigDir/cookie.sh ]] && . $ConfigDir/cookie.sh
[[ -f $ConfigDir/config.sh ]] && . $ConfigDir/config.sh

diyjs="$ShellDir/own"
[[ -d $diyjs ]] || mkdir -p $diyjs

declare -A BlackListDict
author=$1
repo=$2
path=$3
blackword=$4

if [[ "$author" == "delete" ]]; then
	delall=$2
	if [[ $delall ]]; then
		rm -rf $diyjs/${delall}*
		rm $ScriptsDir/${delall}*
		for i in $(grep -n "${delall}" $ListCron | cut -d: -f1 | sort -nr); do sed -i "$i d" $ListCron; done
		echo "已删除 ${delall} 相关的仓库文件和$ListCron的定时命令"
	else
		for del in $(ls $diyjs | cut -d_ -f1); do
			if [ -z $(grep -w "diy ${del}" $ListCron | egrep -v "delete|^#" | awk '{print $7}' | uniq) ]; then
				rm -rf $diyjs/${del}*
				for i in $(grep -n "${del}_" $ListCron | cut -d: -f1 | sort -nr); do sed -i "$i d" $ListCron; done
				rm $ScriptsDir/${del}*
				echo "已删除 ${del} 相关的仓库文件和$ListCron的定时命令"
			fi
		done
	fi
	[[ $(ls $diyjs | wc -l) -eq "0" ]] && sed -i -e "/diy delete/d;/diy脚本/d;/自定义添加/d" $ListCron
	exit 0
else
	if [[ $# -lt 2 ]] || [[ $# -gt 4 ]]; then
		echo -e '\n  ================拉取github指定用户仓库的js脚本================'
		echo '  用法:   diy <参数1> <参数2> <参数3> <参数4>'
		echo '  参数1 作者名 "https://github.com/aaaa/bbbb.git" 的 aaaa'
		echo '  参数2 仓库名 "https://github.com/aaaa/bbbb.git" 的 bbbb'
		echo '  参数3 添加仓库下的指定目录或仓库下指定脚本，多个名用|分割  "ccc|ddd"'
		echo '        可用没有重复关键字的目录名以及没有重复关键字的脚本名'
		echo '  参数4 排除指定脚本或目录，没有重复的关键字，多个名用|分割  "bbb|ccc"'
		echo '  样式 < diy monk-coder dust "i-chenzhe|normal|asus" "ans|detail" >'
		echo -e '  保留 delete 的第一参数，删除在crontab.list中删除的自定义脚本的文件: 用法 < diy delete >\n  或 < diy delete aaaa(作者名) > 可删除aaaa的仓库文件和定时命令\n'
		exit 0
	fi
fi

if [[ -d "$diyjs/${author}_${repo}" ]]; then
	cd ${diyjs}/${author}_${repo}
	branch=$(git symbolic-ref --short -q HEAD)
	git fetch --all
	git reset --hard origin/$branch
	git pull
	gitpullstatus=$?
# find ${diyjs}/${author}_${repo} -name "*.js" -exec rm {} \;
else
	echo -e "正在从https://github.com/$author/$repo的仓库拉取的源码..."
	cd ${diyjs} && git clone https://ghproxy.com/https://github.com/$author/$repo ${author}_${repo}
	gitpullstatus=$?
	[[ "$gitpullstatus" -eq "0" ]] && echo -e "$author 本地仓库拉取完毕\n"
	[[ "$gitpullstatus" -ne "0" ]] && echo -e "$author本地仓库拉取失败,请检查!" && exit 0
fi

rand() {
	min=$1
	max=$(($2 - $min + 1))
	num=$(cksum /proc/sys/kernel/random/uuid | cut -d' ' -f1)
	echo $(($num % $max + $min))
}

addnewcron() {
	addname=""
	cd ${diyjs}/${author}_${repo}
	express=$(find . -name "*.js")
	[[ -n $path ]] && express=$(find . -name "*.js" | egrep $path)
	[[ -n $blackword ]] && express=$(find . -name "*.js" | egrep -v $blackword | egrep $path)
	for js in $express; do
		base=$(basename $js)
		croname=$(echo "${author}_$base" | awk -F\. '{print $1}')
		local name=$(grep "new Env" $js | awk -F "'|\"" '{print $2}' | head -1)
		[[ -z ${name} ]] && local name="未识别出活动名称"
		if [[ -n $(grep "new Env" $js | awk -F "'|\"" '{print $2}' | head -1) ]]; then
			script_date=$(grep ^[0-9] $js | awk '{print $1,$2,$3,$4,$5}' | egrep -v "[a-zA-Z]|:|\." | sort | uniq 2>&1 | head -n 1 | grep " \*")
			if [[ -z "${script_date}" ]]; then
				script_date=$(grep -Eo "([0-9]+|\*|[0-9]+[,-].*) ([0-9]+|\*|[0-9]+[,-].*) ([0-9]+|\*|[0-9]+[,-].*) ([0-9]+|\*|[0-9]+[,-].*) ([0-9]+|\*|[0-9][,-].*)" $js | sort | uniq 2>&1 | head -n 1 | grep " \*")
				if [[ -z "${script_date}" ]]; then
					cron_min=$(rand 1 55)
					cron_hour=$(rand 7 15)
					script_date="${cron_min} ${cron_hour} * * *"
				fi
			fi

			if [[ -z $(grep -w "$croname" $ListCron) ]]; then
				[[ -z $(egrep "diy脚本" $ListCron) ]] && sed -i "/重启挂机程序/i30 23 \* \* \* diy delete ##定时检测已删除或已注释定时命令仓库脚本\n# diy脚本的定时更新。如直接添加运行 diy 查询用法，修改参数三和四到定时的时间会增减相应的文件和命令。\n# 以下是自定义添加的定时运行脚本区" $ListCron
				[[ -z $(grep -w "$author $repo" $ListCron) ]] && \
				sed -i "/diy脚本/a$(rand 30 50) 23 \* \* \* diy $author $repo \"${path}\" \"$blackword\" >> \${JD_DIR}\/log\/diy.txt 2>&1" $ListCron
				sed -i "/自定义添加/a${script_date}	jtask $croname ## $name" $ListCron
				addname="${croname}		<$name>"
				echo -e "新增 $author 的脚本 $croname <$name>"
			fi

			if [[ -f "${ScriptsDir}/${author}_$base" ]]; then
				change=$(diff $js ${ScriptsDir}/${author}_$base)
				if [[ -n "${change}" ]]; then
					cp -f $js ${ScriptsDir}/${author}_$base
					echo -e "${author}_$base 的脚本 '$name' 更新了"
				fi
				# [[ "$change" ]] && notify "更新 ${author}_$base 的js脚本" "$js"
			else
				cp -f $js ${ScriptsDir}/${author}_$base

			fi
		fi
	done
	[[ "$addname" ]] && notify "新增 $author 的js脚本" "$addname"
}

delcron() {
	delname=""
	cronfiles=$(grep "$author" $ListCron | egrep -v "^#|$repo" | awk '{print $7}' | awk -F"${author}_" '{print $2}')
	for filename in $cronfiles; do
		if [[ $blackword ]]; then
			ss=$(find $diyjs/${author}_${repo}/ -name "*.js" | egrep $path | egrep -v $blackword | grep $filename)
		else
			ss=$(find $diyjs/${author}_${repo}/ -name "*.js" | egrep $path | egrep $filename)
		fi

		if [[ -z "$ss" ]]; then
			local name=$(grep "$filename" $ListCron | awk '{print $9}')
			sed -i "/$filename/d" $ListCron && \
			th=$(grep -w "$author $repo" $ListCron | sed -r "s/.*$repo(.*)>>.*/\1/")
			[ $(egrep -cw ${path} $ListCron) -eq 0 ] && sed -i "s/$th/ \"${path}\" \"${blackword}\" /" $ListCron && echo "定时命令已修改"
			rm ${ScriptsDir}/${author}_${filename}.js && \
			echo -e "删除 ${author}_${filename}<$name>的脚本" && \
			delname="${author}_${filename}		<$name>"
		fi
	done
	[[ "$delname" ]] && notify "删除  $author 的js脚本" "${delname}"
}

if [[ "$gitpullstatus" -eq "0" ]]; then
	addnewcron
	delcron
else
	echo -e "$author 仓库更新失败了"
	notify "自定义仓库更新失败" "$author的仓库更新失败"
fi

update_crontab

exit 0
