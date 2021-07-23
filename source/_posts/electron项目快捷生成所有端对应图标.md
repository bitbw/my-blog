---
title: electron项目快捷生成所有端对应图标
date: 2021-06-09 09:00:31
tags:
	- Electron
categories: Electron
---



## 使用electron-icon-builder可以一次性生成所有端对应的图标

github：https://github.com/safu9/electron-icon-builder

### 安装

```bash
npm install -g  electron-icon-builder
```

### 命令

```bash
electron-icon-builder --input=./build/icon.png --output=./build/icon --flatten
```

--input 为输入文件夹

--output 为输入文件夹

还可以在项目中安装使用

