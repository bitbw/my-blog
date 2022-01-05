---
title: 使用 ubuntu 打造 NAS
date: 2021-06-03 09:08:36
tags:
  - ubuntu
  - Linux
categories: Linux
cnblogs:
  postid: "15393032"
hash: ff4cb5899fa53d0ab5e7e85f1eba19a0f6d2ca19499b49de6a502c1815bc2c90
---

## Ubuntu 的安装

参考： https://www.cnblogs.com/masbay/p/10745170.html

## 开启 ssh 服务

Ubuntu 默认不会开启 ssh 服务。所以我们无法对 Ubuntu 进行远程连接，这对 Ubuntu 的运维造成了很大不便。本文详细讲解如何在 Ubuntu18 下开启 ssh 服务。

_关键指令(root 用户下，非 root 用户所有指令前加 sudo)_

**\*ps -e | grep ssh（查看 ssh 服务是否开启）\***

**\*apt-get install openssh-client（安装 ssh 客户端程序）\***

**\*apt-get install openssh-server（安装 ssh 服务端程序）\***

**\*service ssh start 或者 /etc/init.d/ssh start（开启 ssh 服务）\***

**\*service ssh stop 或者 /etc/init.d/ssh stop（关闭 ssh 服务）\***

**\*指令 1：ps -e | grep ssh（ 查看 ssh 服务是否开启）\***

运行**_ps -e | grep ssh_**得出如图一的两行结果。ssh-agent 指的是 ubuntu 的 ssh 服务的客户端，用于该 ubuntu 远程连接其它 Linux 主机。sshd 指的是 ubuntu 的 ssh 服务的服务端，用于其它主机通过 ssh 服务连接该主机。

换句话说，如果没有 sshd 进程的话，别的系统是不能连接该 ubuntu 主机的，若是没有 ssh-agent 的话，该 ubuntu 主机也无法通过 ssh 连接其它主机。

**\*指令 2：apt-get install openssh-client（安装 ssh 客户端程序）\***

若是运行**\*ps -e | grep ssh\***没有查出 ssh-agent 服务，但是你又想通过 ssh 服务连接别的系统。那么就执行**\*apt-get install openssh-client\***安装 ssh 客户端。接着执行**_ssh 目标用户@目标 ip_**即可连接目标主机。正常情况 Ubuntu 默认开启 ssh-agent 服务。所以一般用不打指令 2。

**\*指令 3：apt-get install openssh-server（安装 ssh 服务端程序）\***

默认 ssh 的服务端是没有安装的，可用**\*ps -e | grep ssh\***查看。若是没有 sshd 的进程，则运行**_apt-get install openssh-server_**安装 ssh 服务端。接着重新执行 ps -e | grep ssh 便可发现 sshd 已启动。至此，其它主机便可通过 ssh 连接该主机。

sshd 和 ssh-agent 都已经启动。其它主机便可通过 ssh 连接该主机

**\*指令 4：service ssh start 或者 /etc/init.d/ssh start（开启 ssh 服务）\***

**\*指令 5：service ssh stop 或者 /etc/init.d/ssh stop（关闭 ssh 服务）\***

指令 4 和指令 5 便是开启和关闭 sshd 服务进程的。

以上便是 Ubuntu18 下安装开启 ssh 进程的所有流程。
来源：https://www.jianshu.com/p/4b50b55ebb4d

## Samba 共享文件服务

参考：https://www.linuxidc.com/Linux/2018-11/155466.htm

## FTP 文件传输服务

运行：sudo apt-get install vsftpd 命令，安装 VSFTP 工具

安装好了之后，使用如下命令启动 FTP 服务：

sudo systemctl start vsftpd
sudo systemctl enable vsftpd

查看是否开启

sudo ss -tunlp | grep -i ftp

## Gitlab 安装

gitlab 企业版 --> ee

gitlab 社区版 --> ce

官方社区版安装教程：https://docs.gitlab.com/ce/install/

推荐使用 docker 容器方式：https://docs.gitlab.com/omnibus/docker/

## 安装 ZeroTier One 内网穿透

官网：https://www.zerotier.com/

使用这行命令安装 ZeroTier One

curl -s https://install.zerotier.com/ | sudo bash

复制下面代码，将 NetWork ID 从 zerotier 官方网站中复制到下面代码中

sudo zerotier-cli join （NetWork ID）

若出现”200 join OK”则添加成功
