---
title: MySQL忘记密码修改
date: 2021-04-22 17:30:03
tags:
  - MySQL
categories: SQL
cnblogs:
  postid: "15392585"
hash: c6456535f7072af75ab8639a00d8094989b6854d32dea0fe662c3c96e628a07f
---

## MySQL8.0

1.停止MySQL服务

打开命令窗口cmd，输入命令：net stop mysql，停止MySQL服务
或者
打开服务 找到MySQL 右键停止


2.开启跳过密码验证登录的MySQL服务
输入命令  
mysqld --console --skip-grant-tables --shared-memory

3.再打开一个新的cmd，无密码登录MySQL，输入登录命令：mysql -u root -p

无需输入密码直接回车

4.密码置为空，命令如下：
use mysql;  --进入mysql

update user set authentication_string='' where user='root';--将字段置为空

flush privileges;--刷新MySQL的系统权限相关表,否则会被拒绝

ALTER user 'root'@'localhost' IDENTIFIED BY '';--修改密码为空

5.再次进入 mysql -u root -p 试试修改后的密码是否生效，没问题重启MySQL即可
