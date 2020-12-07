---
title: treer生成文件结构目录
date: 2020-05-22 14:48:29
tags: js
categories: js
---


参考资料：https://blog.csdn.net/weixin_43998681/article/details/88708847

## 安装

```js
$ npm install treer -g													
// 全局安装treer，如果只想安装在当前目录可以去掉-g
```

## 使用方法

```js
$ treer --help 					//输出treer的使用帮助信息
选项:
-V, --version          			//输出版本号信息
-d, --directory [dir]  			//指定一个目录来生成目录树
-i, --ignore [ig]      			//忽略特定的目录名
-e, --export [epath]   			//导出目录到一个文件中
```

## 具体示例

```js
treer -i "/node_modules|dist_electron|devtools|nouse|.git|.vscode/" -e "tree.md"
```





