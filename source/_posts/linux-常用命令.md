---
title: linux 常用命令
date: 2021-01-03 11:11:15
tags:
	- Linux
	- ubuntu
categories: Linux
---



## 退出和进入root权限

进入

```bash
$ sudo -s
```

退出

```bash
$ su [用户名]
```

## Ubuntu 下几种软件安装的方法

### **1、tar.gz软件包的安装**

**1）解压tar.gz包**

```
tar -zxvf nginx-1.8.1.tar.gz -C /home/Desktop  # 将软件包名.tar.gz解压到指定的目录下 
```

**2）进入解压后的文件目录下**

   **执行“./configure”命令为编译做好准备；**

```
cd nginx
sudo ./configure --prefix=/opt/nginx  # 表示安装到/opt目录下
```

**3）执行“make”命令进行软件编译；**

**4）执行“make install”完成安装；**

**5）执行“make clean”删除安装时产生的临时文件。**

 

### 2、 apt-get 安装方法

ubuntu 默认的软件管理系统是apt。apt有很多国内软件源，推荐使用淘宝。

apt-get 的基本软件安装命令是:

**sudo apt-get install 软件名**

 

### **3、 deb 包的安装方式**

deb 是 debian 系 Linux 的包管理方式，ubuntu 是属于 debian 系的 Linux 发行版，所以默认支持这种软件安装方式。
当下载到一个 deb 格式的软件后,在终端输入这个命令就能安装：

**sudo dpkg -i \**软件名\**.deb**



### **4、二进制编译或者脚本安装方式**

github上一般都会提供二进制源码或者脚本安装方式。
这类软件,你会在软件安装目录下发现类似后缀名的文件，如： .sh .py .run 等等,有的甚至连后缀名都没有,直接只有一个 INSTALL 文件。或者是一个其他什么的可执行文件。
对于这种软件,可尝试以下几种方式安装：

*在软件目录下输入: ./软件名** **
或者 : sh 软件名.sh
或者: python 软件名.py**



## tar命令的用法

参考 https://blog.csdn.net/kkw1992/article/details/80000653

linux下最常用的打包程序就是tar了，使用tar程序打出来的包我们常称为tar包，tar包文件的命令通常都是以.tar结尾的。生成tar包后，就可以用其它的程序来进行压缩。

**1．命令格式：**

`tar [必要参数][选择参数][文件] `

**2．命令功能：**

用来压缩和解压文件。tar本身不具有压缩功能。他是调用压缩功能实现的 

**3．命令参数：**

必要参数有如下：

-A 新增压缩文件到已存在的压缩

-B 设置区块大小

-c 建立新的压缩文件

-d 记录文件的差别

-r 添加文件到已经压缩的文件

-u 添加改变了和现有的文件到已经存在的压缩文件

-x 从压缩的文件中提取文件

-t 显示压缩文件的内容

-z 支持gzip解压文件

-j 支持bzip2解压文件

-Z 支持compress解压文件

-v 显示操作过程

-l 文件系统边界设置

-k 保留原有文件不覆盖

-m 保留文件不被覆盖

-W 确认压缩文件的正确性

可选参数如下：

-b 设置区块数目

-C 切换到指定目录

-f 指定压缩文件

--help 显示帮助信息

--version 显示版本信息

**4．常见解压/压缩命令**

tar 
解包：tar xvf FileName.tar
打包：tar cvf FileName.tar DirName

（注：tar是打包，不是压缩！）

.gz
解压1：gunzip FileName.gz
解压2：gzip -d FileName.gz
压缩：gzip FileName

.tar.gz 和 .tgz
解压：tar zxvf FileName.tar.gz
压缩：tar zcvf FileName.tar.gz DirName
.bz2
解压1：bzip2 -d FileName.bz2
解压2：bunzip2 FileName.bz2
压缩： bzip2 -z FileName

.tar.bz2
解压：tar jxvf FileName.tar.bz2
压缩：tar jcvf FileName.tar.bz2 DirName
.bz
解压1：bzip2 -d FileName.bz
解压2：bunzip2 FileName.bz
压缩：未知

.tar.bz
解压：tar jxvf FileName.tar.bz
压缩：未知
.Z
解压：uncompress FileName.Z
压缩：compress FileName

.tar.Z
解压：tar Zxvf FileName.tar.Z
压缩：tar Zcvf FileName.tar.Z DirName

.zip
解压：unzip FileName.zip
压缩：zip FileName.zip DirName
.rar
解压：rar x FileName.rar
压缩：rar a FileName.rar DirName 

