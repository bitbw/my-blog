---
title: Ubuntu 解压文件后名称乱码问题
date: 2021-01-10 16:09:01
tags:
	- Linux
	- ubuntu
categories: Linux
---



由于中文的Windows使用的是GBK编码，而Linux默认使用UTF-8编码的，如果在Windows打包带中文文件的zip包，则这个zip包在Linux下面使用默认的归档管理器打开这个zip包的时候，中文文件名会显示乱码。

## 解决方法1：

使用GBK格式解压

```bash
unzip -O GBK *.zip
```

## 解决方法2:

安装p7zip-rar

```bash
sudo apt-get install p7zip-rar
export LANG=zh_CN.GBK  		# 临时在控制台修改环境为zh_CN.GBK，然后解压缩即可
7za  x  需要解压的文件.zip
export LANG=zh_CN.utf-8 	# 用完别忘了改回来
```