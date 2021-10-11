---
title: 运行electron-builder-install-app-deps-卡住不动的问题解决
tags:
  - Electron
  - Nodejs
  - npm
  - js
categories: Electron
date: 2020-12-13 11:15:36
cnblogs:
  postid: "15393048"
hash: fc451eddd18f8c9fcf790bcd643ab969d1d8abd59a420e6e4328b13c02699fb4
---

 背景：使用electron-builder 和 @journeyapps/sqlcipher 的项目 ，在新电脑上clone项目，npm 装包时遇到错误

一般electron-builder的项目下完包的最后，会调用electron-builder install-app-deps 命令重新构建本地依赖

![image-20201213112431054](https://gitee.com/bitbw/my-gallery/raw/master/img/image-20201213113529472-1607837076092-1607839721753.png)

换了电脑后就是在这里卡住，卡住几个小时都不动，也不报错，无奈尝试遍各种方法都不行，比如卸载node重新安装，卸载python和 visual studio,修改npm 配置改为淘宝镜像地址，使用 yarn，cnpm 安装，都是不行，百度上也没有对应的案例，就差祈祷了，感觉每次npm 下包都是看运气，哎，还是经验少啊。

最后因为是卡在@journeyapps/sqlcipher 这个sqlite加密版插件上，于是package.json中提高了@journeyapps/sqlcipher的版本改成5.0.0最新版本，并改用cnpm正经淘宝镜像来安装， 发现可以正常编译 ，最后的electron-builder install-app-deps 也过去了，但是运行项目的时候却 报错说缺编译@journeyapps/sqlcipher 的builder模块，说明electron-builder install-app-deps 没成功啊，继续找原因，灵光一闪看到：

![image-20201213113529472](https://gitee.com/bitbw/my-gallery/raw/master/img/image-20201213112431054-1607837073833-1607839720074.png)

node-pre-gyp，可以将存在网络上的作者根据不同平台预编译好的二进制文件下载下来

关于gyp与node-gyp与node-pre-gyp 可以看这篇文章https://zhuanlan.zhihu.com/p/330468774

原来 这个包的时候先去·` https://journeyapps-node-binary.s3.amazonaws.com/@journeyapps/sqlcipher/v4.1.0/node-v83-win32-x64.tar.gz`  找对应系统的对应node版本的二进制文件， 如果没有就会下载源码进行编译，之前在linux上下载这个包就出现过这个问题，

node-v83 表示当前node的NODE_MODULE_VERSION [官网](https://nodejs.org/zh-cn/download/releases/)可以查到,因为是新电脑所以下的是node的最新版本14，还是太年轻啊，以为最新的就是最好的，不知道好多插件都没有最新node版本的二进制文件，通过 [淘宝镜像](https://npm.taobao.org/mirrors?spm=a2c6h.14029880.0.0.735975d7WMqyIm ) （一般淘宝镜像上有的就一定是有了）看到最新的包是`node-v72-win32-x64.tar.gz `,也就是node的12版本，果断卸载14 安装 12 。

![image-20201213115738432](https://gitee.com/bitbw/my-gallery/raw/master/img/image-20201213115738432-1607837078098-1607839723068.png)

最后试了几次之后终于重新构建本地依赖成功



