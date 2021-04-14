---
title: vscode中jsconfig.json和tsconfig.json的配置
date: 2021-04-12 15:21:42
tags:
	- ts
	- vscode
categories: vscode
---







前言：在使用webpack打包的项目中一般都会设置路径别名，但vscode中使用路径别名导入模块后，想通过点击模块跳到对应文件就做不到了，这时需要用到 jsconfig.json 或  tsconfig.json 配置，

官方文档：https://code.visualstudio.com/docs/languages/jsconfig