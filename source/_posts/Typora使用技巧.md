---
title: Typora使用技巧
date: 2021-04-25 16:36:24
tags:
	- typora
	- 工具使用
categories: 工具使用
---



typora，postman，vscode 都是使用 electron 构建而成的桌面应用

这篇文章主要记录下typora日常使用中的技巧

## 命令行添加typora直接打开md文档的方法

### 添加环境变量

```
C:\app\Typora\bin
```

## 通过修改注册表，在右键新建菜单中添加typora

1. win+R调出运行窗口，输入regedit，弹出注册表窗口
2. 在窗口的搜索栏中输入Computer\HKEY_CLASSES_ROOT .md（有的可能是 计算机\HKEY_CLASSES_ROOT .md）,按回车，找到.md项
3. 点击.md,双击右栏的默认项，弹出编辑框后在“数值数据”框中输入“Typora.md”,点击确定
4. OpenWithProgids 查看是否有 \Typora.exe
5. 点击.md，右键新建->项，取名“ShellNew”
6. 点击ShellNew，右键新建->字符串值，取名“NullFile”
   至此，完成所有步骤，回到桌面刷新一下，右键新建菜单查看结果。


总结：其实就是两步
（1）修改.md的默认值
（2）添加ShellNew，添加NullFile

![image-20210427142049929](https://gitee.com/zhangbowen-1/my-gallery/raw/master/img/image-20210427142049929.png)

> 原文：https://blog.csdn.net/m0_46588308/article/details/105919561