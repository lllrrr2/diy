#!/bin/sh
#任务一：定时轮询（3分钟）检测三个子网IP设备是否在线。
#如时设备不在线，给指定的GPIO引脚发出高电平（或低电平）信号
#任务二：定时轮询（10分钟）路由器外网是否正常。
#如时设备不在线，给指定的GPIO引脚发出高电平（或低电平）信号

#脚本如下：
#共有4个被控制的GPIO：3分钟的3个gpio；10分钟的1个。其已在DTS里注册为LED设备。
#请自行进入/sys/class/leds里对应目录,使用echo 1 > value命令测试LED。然后修改下面脚本中echo的值。
#请把3分钟检测的3个gpio设备在/sys/class/leds里的目录名填写到下面的""内
3agpiodir=""
3bgpiodir=""
3cgpiodir=""
#请把10分钟检测的1个gpio设备在/sys/class/leds里的目录名填写到下面的""内
10gpiodir=""
#请修改下面列表(被检测的三个子网设备的IP地址)：
devip_list="192.168.1.10 192.168.1.11 192.168.1.12"

count=0
timecount=1
while true; do
	sleep $(expr 1 \* 60)
	timecount=$(expr $timecount + 1)
	if [ $(expr $timecount % 10) -ne 0 ]; then
		if [ $(expr $timecount % 3) = 0 ]; then
			for k in $devip_list; do
				# ping -c 2 $k >/dev/null 2>&1
				# if [ $? = 1 ]; then
				if ! ping -c 2 $k >/dev/null 2>&1; then
					if [ $(expr $count % 3) = 0 ]; then
						echo 1 > /sys/class/leds/$3agpiodir/value
					elif [ $(expr $count % 3) = 1 ]; then
						echo 1 > /sys/class/leds/$3bgpiodir/value
					elif [ $(expr $count % 3) = 2 ]; then
						echo 1 > /sys/class/leds/$3cgpiodir/value
					fi
				fi
				count=$(expr $count + 1)
			done
		fi
	elif [ $(expr $timecount % 10) = 0 ]; then
		# ping -c 2 223.5.5.5 >/dev/null 2>&1
		# if [ $? = 1 ]; then
		if ! ping -c 2 223.5.5.5 >/dev/null 2>&1; then
			echo 1 > /sys/class/leds/$10gpiodir/value
		fi
	fi
done
