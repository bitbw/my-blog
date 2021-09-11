---
title: phpMyAdmin+XAMPP管理MySQL数据库
date: 2021-04-22 17:30:03
tags:
	- phpMyAdmin
	- MySQL
categories: SQL
---



## 安装XAMPP

下载地址https://www.apachefriends.org/download_success.html

模块全部安装

## 问题
### Apache shutdown unexpectedly启动错误解决方法

xampp启动时显示的错误为：

9:52:41  [Apache]  Attempting to start Apache app...

9:52:41  [Apache]  Status change detected: running
9:52:42  [Apache] Status change detected: stopped
9:52:42  [Apache] Error: Apache shutdown unexpectedly.
9:52:42  [Apache] This may be due to a blocked port, missing dependencies, 
9:52:42  [Apache] improper privileges, a crash, or a shutdown by another method.
9:52:42  [Apache] Check the "/xampp/apache/logs/error.log" file
9:52:42  [Apache]  and the Windows Event Viewer for more clues

一、最快的处理方法就是修改端口号：

1、443端口被占用，apache无法监听443端口，该如何解决呢？ 

在/xampp/apache/conf/extra/httpd-ssl.conf 

把Listen 443 修改为 444（可自定义）

2、80端口被占用，apache无法监听80端口，该如何解决呢？ 

在/xampp/apache/conf/extra/httpd.conf 

把Listen 80 修改为 88 （可自定义）

### 使用phpmyadmin http://localhost:88/phpmyadmin/

## XAMMP配置之Attempting to start MySQL service...问题

相信大家和我一样。刚接触到XAMPP，配置mysql的时候，一头雾水。在网上参考一些博客跟着配置还不行，接下来说一个我的配置。

使用设备
（1）windows10
（2）XAMPP

![在这里插入图片描述](https://gitee.com/bitbw/my-gallery/raw/master/img/20210826150603.png)

（3）mysql 8x版本

本机已经安装了mysql
第一步：明确问题
查看自己的XAMPP的问题

![在这里插入图片描述](https://gitee.com/bitbw/my-gallery/raw/master/img/20190727093444445.png)

可见mysql启动不了

第二步：关闭你已经安装的mysql服务
ctrl+R：输入services.msc

![在这里插入图片描述](https://gitee.com/bitbw/my-gallery/raw/master/img/20190727180514111.png)

关闭服务

![在这里插入图片描述](https://gitee.com/bitbw/my-gallery/raw/master/img/20190727180457156.png)

第三步：修改路径
（1）在上图服务中，找到MySQL80的属性

![img](https://gitee.com/bitbw/my-gallery/raw/master/img/20210826150253.png)

可以看到有一个可执行文件路径，对它进行修改
（2）找到注册表
ctrl+R：输入regedit.exe

在下面的路径中找到你的mysql

`计算机\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\MySQL`

这里我的mysql如图

（3）修改ImagePath路径

![image-20210826150445318](https://gitee.com/bitbw/my-gallery/raw/master/img/20210826150445.png)

把上图的路径修改到下图XAMPP中my.ini的路径上
注意：以防修改错误你可以把当前路径备份

操作如下
点击ImagePath把：“C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe” --defaults-file=“C:\ProgramData\MySQL\MySQL Server 8.0\my.ini” MySQL80
修改为一下的内容
“C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe” --defaults-file=“E:\XAMPP\XAMPP\mysql\bin\my.ini” MySQL80

第四步：回到XAMPP中启动mysql


## 关闭或修改信息时报错

Error: Cannot create file “D:xampp\xampp-controlin”.拒绝访问

### 解决办法：
右键该应用程序，在属性对话框选择"兼容性"–>“以管理员身份运行此程序”

![在这里插入图片描述](https://gitee.com/bitbw/my-gallery/raw/master/img/9295a630b3aa4adc87c09ffd991663a9.png)
