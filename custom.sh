#!/bin/sh

#Set your CustomScript on boot!              #在下方设置你需要开机启动的命令或脚本

touch /share/Download/Success.txt            #可以是命令行，也可以是脚本或程序
sleep 3                                      #多个命令行之间建议使用sleep间隔(默认3秒)
touch /share/Download/自启动成功.txt
sleep 3
cat > /share/Download/StartUp/reboot.sh <<-\REBOOT
#!/bin/sh
pp=`ping -c 1 "163.com" | grep -o -E "([0-9]|[1-9][0-9]|100)"% | awk -F '%' '{print $1}'`
if [ "$pp" -eq "100" ]; then
	sleep 300
	# /etc/init.d/tr-network.sh restart
	if [ "$pp" -eq "100" ]; then
		sleep 300
    	if [ "$pp" -eq "100" ]; then
    		reboot
			# /etc/init.d/tr-network.sh restart
    	fi
	fi
else
	exit 0
fi
REBOOT
sleep 3
chmod 755 /share/Download/StartUp/reboot.sh
sleep 3
echo "45 */2 * * * /bin/sh /share/Download/StartUp/reboot.sh" >> /etc/config/crontab
sleep 3
crontab /etc/config/crontab

#测试脚本可用性：程序在首次安装完成之后，会在默认共享目录Download下，
#生成“Success.txt”和“自启动成功.txt”两个空的文本文件，有则程序正常，反之则程序异常

exit 0