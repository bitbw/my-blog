---
title: ls项目问题记录
date: 2020-09-20 19:48:18
tags: 
categories:
---



#  项目 install的问题

> 注意：项目的所有路径中不允许出现中文，否则会导致构建后安装依赖报错

错误案例:

```
UnicodeDecodeError: 'ascii' codec can't decode byte 0xc5 in position 12: ordinal not in range(128)
```

因为安装需要Python环境和Visual Studio 可以直接使用 `npm install --global --production windows-build-tools` 直接安装

`npm install --global --production windows-build-tools`   

安装后，npm将自动执行此模块，该模块将下载并安装Visual C ++ Build Tools，Microsoft为大多数用户免费提供（作为Visual Studio Community的一部分，请查阅许可证以确定您是否符合条件） 。这些工具是[编译流行的本机模块](https://github.com/nodejs/node-gyp)所[必需的](https://github.com/nodejs/node-gyp)。如果尚未安装，它还将安装Python 2.7，并适当配置您的计算机和npm。

参考资料：https://www.npmjs.com/package/windows-build-tools

要是分别安装的话：

必须先装Visual Studio 因为插件基于C++开发 

然后添加c++组件  

> 如果报错 提示 无法找到 v140 的生成工具(平台工具集 =“v140”)  则需要在 Visual Studio 中添加 平台工具集V140 组件

