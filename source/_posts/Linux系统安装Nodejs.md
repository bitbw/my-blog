---
title: Linux系统安装Nodejs和卸载Nodejs
date: 2020-12-13 09:57:32
tags:
  - Nodejs
  - Linux
categories: Nodejs
cnblogs:
  postid: "15392583"
hash: 3513c7419642cea6cbc0341ee78adf248a63e632db688cb849c8e1a00ef9d871
---

> 不推荐安装最新的node版本 好多包都没有对应的最新node版本的编译好的包

## 安装环境

- 本机系统：CentOS Linux release 7.5
- Node.js：v12.18.1

## 获取Node.js 安装包

- Node.js 安装包及源码下载地址为：https://nodejs.org/en/download/，你可以根据不同平台系统选择你需要的 Node.js 安装包，这里选择的是 [LTS] Linux Binaries (x64)。
- 官方下载地址  https://nodejs.org/dist/latest-v12.x/

## Linux 上安装 Node.js

```bash
wget https://nodejs.org/dist/v12.18.1/node-v12.18.1-linux-x64.tar.xz    // 下载
tar xf node-v12.18.1-linux-x64.tar.xz                                   // 解压
cd node-v12.18.1-linux-x64                                              // 进入解压目录
```

解压文件的 bin 目录底下包含了 node、npm 等命令（npm 全局安装的包），我们可以修改linux系统的环境变量（profile）来设置直接运行命令：

**老规矩先备份，养成修改重要文件之前先备份的好习惯。**

```bash
cp /etc/profile /etc/profile.bak
```

> /etc/profile 文件介绍： https://www.cnblogs.com/xiaoshuxiaoshu/p/4689447.html

然后 vim /etc/profile，在最下面添加 export PATH=$PATH: 后面跟上 node 下 bin 目录的路径

```html
export NODE_HOME=/root/node-v12.18.1-linux-x64
export PATH=NODE_HOME/bin:$PATH
```

如果profile不可修改 添加可写权

```bash
sudo chmod  a=rw  /etc/profile
```

立即生效

```bash
source /etc/profile
```

检查是否生效

```bash
env
```

建立软连接 （报已经存在错误： 先删除目标目录下的文件在操作）

```bash
 ln -s /root/node-v12.18.1-linux-x64/bin/node /usr/local/bin/node
 ln -s /root/node-v12.18.1-linux-x64/bin/npm /usr/local/bin/npm
```

添加sudo  （报已经存在错误： 先删除目标目录下的文件在操作）

```bash
sudo ln -s /root/node-v12.18.1-linux-x64/bin/node  /usr/bin/node
sudo ln -s /root/node-v12.18.1-linux-x64/lib/node  /usr/lib/node
sudo ln -s /root/node-v12.18.1-linux-x64/bin/npm  /usr/bin/npm
```

```bash
[root@localhost ~]# node -v
v12.18.1
```

OK！安装成功！

## 卸载

用上面步骤安装后可以直接删除  node-v12.18.1-linux-x64 文件夹

```bash
rm -rf /root/node-v12.18.1-linux-x64
```

 进入 /usr/local/lib 删除所有 node 和 node_modules文件夹

```bash
rm -rf /usr/lib/node  /usr/lib/node_modules
```

 进入 /usr/local/include 删除所有 node 和 node_modules 文件夹

```bash
rm -rf /usr/local/include/node  /usr/local/include/node_modules
```

 进入 /usr/local/bin 删除 node 的可执行文件

```bash
rm -rf /usr/local/bin/node 
```

接着找到上面建立的软连接 依次删除即可 

```bash
rm -rf /usr/bin/npm
```

卸载完成！

现在如果需要其他版本的node ，就可以按上面的步骤从新安装一个其他版本的node了