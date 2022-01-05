---
title: npm 下包问题
date: 2020-12-12 18:40:51
tags:
  - Nodejs
  - npm
  - js
categories: Nodejs
cnblogs:
  postid: "15392980"
hash: d91bd70ac16bf494ce72aa029595117b985d5b79ec4d4034dbc3629de263172d
---

## node 下包的过程

首先说下 node 下包的过程 ：

- node 下包首先会在线上找对应本地 node 版本和操作系统的包

- 有的无需系统支持就直接下
- 有的需要根据系统下对应的 tar.gz 包 用到 node-pre-gyp，如果找不到对应的 node 版本号和系统的包，node 会下载源码进行编译
- node 编译使用 node-gyp ,而 node-gyp 在不同的操作系统下需要不同的支持工具 ，win 是 python 和 Visual Studio 2017（15），在 linux 下需要 Python， make, 和 GCC ，这里有详细的描述 https://github.com/nodejs/node-gyp

node 不同版本影响到是否能直接下对应的包所以装包前可以先看下https://developer.aliyun.com/mirror/NPM?from=tnpm 淘宝镜像上有没有对应 node 版本的包

> 以这个为例`node-v72-win32-x64.tar.gz `代表 node 的 NODE_MODULE_VERSION 版本号是 72 的 windows64 位的包，NODE_MODULE_VERSION 对应的 node 版本可以在https://nodejs.org/zh-cn/download/releases/ node 官网查询

cnpm 安装：https://developer.aliyun.com/mirror/NPM?from=tnpm

设置 npm 下包地址 ： https://blog.csdn.net/weixin_40920953/article/details/86547291
