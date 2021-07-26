---
title: Git 常用命令
date: 2021-06-24 09:50:14
tags:
	- Git
categories: Git
---



## remote

###  查看本地关联的远程仓库

```bash
git remote -v
# 远程仓库名  远程仓库地址 
# origin  https://github.com/xxx/my-blog.git (fetch)
# origin  https://github.com/xxx/my-blog.git (push)
```
### 本地设置远程仓库

```bash
#  git remote add （添加远程仓库） origin（远程仓库名随便起） https://github.com/xxx/my-blog.git （远程仓库地址）
git remote add origin https://github.com/xxx/my-blog.git
#  git push 推送代码 -u 同时为当前推送设置上游分支  origin master （origin 就是上面起的远程仓库名 master 分支名）
git push -u origin master
```
### 修改远程仓库地址

```bash
# git remote set-url origin（远程仓库名） https://github.com/xxx/my-blog1.git （远程仓库地址）
git remote set-url origin https://github.com/xxx/my-blog1.git

```

