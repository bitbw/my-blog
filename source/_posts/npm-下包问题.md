---
title: npm 下包问题
date: 2020-12-12 18:40:51
tags: 
	- Nodejs
	- npm 
	- js
categories: Nodejs
---

## node 下包的过程

首先说下node  下包的过程 ：

-  node下包首先会在线上找对应本地node版本和操作系统的包  

- 有的无需系统支持就直接下 
- 有的需要根据系统下对应的tar.gz包 用到node-pre-gyp，如果找不到对应的node版本号和系统的包，node会下载源码进行编译
- node编译使用node-gyp ,而node-gyp 在不同的操作系统下需要不同的支持工具 ，win是python和 Visual Studio 2017（15），在linux下需要Python， make,  和GCC  ，这里有详细的描述  https://github.com/nodejs/node-gyp

node不同版本影响到是否能直接下对应的包所以装包前可以先看下https://developer.aliyun.com/mirror/NPM?from=tnpm 淘宝镜像上有没有对应node版本的包

> 以这个为例`node-v72-win32-x64.tar.gz   `代表node的NODE_MODULE_VERSION 版本号是72 的windows64位的包，NODE_MODULE_VERSION 对应的node版本可以在https://nodejs.org/zh-cn/download/releases/ node官网查询

cnpm 安装：https://developer.aliyun.com/mirror/NPM?from=tnpm

设置npm 下包地址 ： https://blog.csdn.net/weixin_40920953/article/details/86547291