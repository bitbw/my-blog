---
title: 使用 ubuntu 打造 NAS
date: 2021-06-03 09:08:36
tags:
	- ubuntu
	- Linux
categories: Linux
---



## Ubuntu的安装

参考： https://www.cnblogs.com/masbay/p/10745170.html

## 开启ssh服务

Ubuntu默认不会开启ssh服务。所以我们无法对Ubuntu进行远程连接，这对Ubuntu的运维造成了很大不便。本文详细讲解如何在Ubuntu18下开启ssh服务。

*关键指令(root用户下，非root用户所有指令前加sudo)*

***ps -e | grep ssh（查看ssh服务是否开启）\***

***apt-get install openssh-client（安装ssh客户端程序）\***

***apt-get install openssh-server（安装ssh服务端程序）\***

***service ssh start 或者 /etc/init.d/ssh start（开启ssh服务）\***

***service ssh stop 或者 /etc/init.d/ssh stop（关闭ssh服务）\***

***指令 1：ps -e | grep ssh（ 查看ssh服务是否开启）\***

运行***ps -e | grep ssh***得出如图一的两行结果。ssh-agent指的是ubuntu的ssh服务的客户端，用于该ubuntu远程连接其它Linux主机。sshd指的是ubuntu的ssh服务的服务端，用于其它主机通过ssh服务连接该主机。

换句话说，如果没有sshd进程的话，别的系统是不能连接该ubuntu主机的，若是没有ssh-agent的话，该ubuntu主机也无法通过ssh连接其它主机。

***指令 2：apt-get install openssh-client（安装ssh客户端程序）\***

若是运行***ps -e | grep ssh\***没有查出ssh-agent服务，但是你又想通过ssh服务连接别的系统。那么就执行***apt-get install openssh-client\***安装ssh客户端。接着执行***ssh 目标用户@目标ip***即可连接目标主机。正常情况Ubuntu默认开启ssh-agent服务。所以一般用不打指令2。

***指令 3：apt-get install openssh-server（安装ssh服务端程序）\***

默认ssh的服务端是没有安装的，可用***ps -e | grep ssh\***查看。若是没有sshd的进程，则运行***apt-get install openssh-server***安装ssh服务端。接着重新执行ps -e | grep ssh便可发现sshd已启动。至此，其它主机便可通过ssh连接该主机。

sshd和ssh-agent都已经启动。其它主机便可通过ssh连接该主机 

***指令 4：service ssh start 或者 /etc/init.d/ssh start（开启ssh服务）\***

***指令 5：service ssh stop 或者 /etc/init.d/ssh stop（关闭ssh服务）\***

指令4和指令5便是开启和关闭sshd服务进程的。

以上便是Ubuntu18下安装开启ssh进程的所有流程。
来源：https://www.jianshu.com/p/4b50b55ebb4d

## Samba 共享文件服务

参考：https://www.linuxidc.com/Linux/2018-11/155466.htm

## FTP 文件传输服务

运行：sudo apt-get install vsftpd命令，安装VSFTP工具

安装好了之后，使用如下命令启动FTP服务：

sudo systemctl start vsftpd
sudo systemctl enable vsftpd

查看是否开启

sudo ss -tunlp | grep -i ftp

## Gitlab 安装

gitlab企业版 --> ee

gitlab社区版 --> ce

官方社区版安装教程：https://docs.gitlab.com/ce/install/

推荐使用docker容器方式：https://docs.gitlab.com/omnibus/docker/

## 安装 ZeroTier One 内网穿透

官网：https://www.zerotier.com/

使用这行命令安装ZeroTier One

curl -s https://install.zerotier.com/ | sudo bash

复制下面代码，将NetWork ID从zerotier官方网站中复制到下面代码中

sudo zerotier-cli join （NetWork ID）

若出现”200 join OK”则添加成功