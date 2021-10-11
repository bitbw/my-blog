---
title: windows系统下的环境变量
date: 2021-03-19 13:22:32
tags:
  - windows
categories: Windows
cnblogs:
  postid: "15393027"
hash: 82e3c10e236f1649f35ed0d85a86f37f468871cfe4efb8b0ec12b3c10e929299
---



windows系统下 如需要在命令行中执行某个程序  如：

```bash
typora xx.md
```

需要配置环境变量

找到用户环境变量配置 PATH 将typora的可执行文件的所在目录的路径添加进去 ,例如：

```bash
C:\app\Typora\bin
```

注意：只需要添加exe文件的目录即可 C:\app\Typora\bin，不需要要加上 typora.exe；

添加完后需要重启命令行工具 ，命令才可以正常执行

