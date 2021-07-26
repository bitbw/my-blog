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

### 查看GIT未推送的提交记录

#### 1 查看到未传送到远程代码库的提交次数

```bash
git status
```

显示结果类似于这样：

```bash
On branch master

Your branch is ahead of 'origin/master' by 2 commits.
```



####  2 查看到未传送到远程代码库的提交描述/说明

```bash
git cherry -v
```

显示结果类似于这样：

```bash
b6568326134dc7d55073b289b07c4b3d64eff2e7 add default charset for table items_has_images

4cba858e87752363bd1ee8309c0048beef076c60 move Savant3 class into www/includes/class/
```

#### 3 查看到未传送到远程代码库的提交详情

```bash
git log master ^origin/master
```

这是一个git log命令的过滤，^origin/master可改成其它分支。
显示结果类似于这样：

```bash

```

总结
git status 只能查看未传送提交的次数
git cherry -v只能查看未传送提交的描述/说明
git log master ^origin/master则可以查看未传送提交的详细信息
