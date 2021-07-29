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

## 查看GIT未推送的提交记录

#### 1 查看到未传送到远程代码库的提交次数

```bash
git status
```

显示结果类似于这样：

```bash
$ git status
On branch master
Your branch is ahead of 'origin/master' by 2 commits.
  (use "git push" to publish your local commits)     

nothing to commit, working tree clean
```

####  2 查看到未传送到远程代码库的提交描述/说明

```bash
git cherry -v
```

显示结果类似于这样：

```bash
+ afd5134be3bee5285d6c2ee2c82fc323012d74bb Update commit 1
+ 37a165ec0586f4af745bf538bc139fda6f1df672 Update commit 2
```

#### 3 查看到未传送到远程代码库的提交详情

```bash
git log master ^origin/master
```

这是一个git log命令的过滤，^origin/master可改成其它分支。
显示结果类似于这样：

```bash
commit 37a165ec0586f4af745bf538bc139fda6f1df672 (HEAD -> master)
Author: xxxx <xxxxx@163.com>
Date:   Mon Jul 26 17:46:34 2021 +0800

    Update commit 1

commit afd5134be3bee5285d6c2ee2c82fc323012d74bb
Author: xxx <xxxx@163.com>
Date:   Mon Jul 26 09:54:24 2021 +0800

    Update commit 2
```

总结
git status 只能查看未传送提交的次数
git cherry -v只能查看未传送提交的描述/说明
git log master ^origin/master则可以查看未传送提交的详细信息


## Github 相关

新建仓库
```bash
echo "# test111" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/bitbw/test111.git
git push -u origin main
```

已有仓库
```bash
git remote add origin https://github.com/bitbw/test111.git
git branch -M main
git push -u origin main
```