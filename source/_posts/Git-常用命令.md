---
title: Git 常用命令
date: 2021-06-24 09:50:14
tags:
	- Git
categories: Git
---


本地设置远程仓库

```bash
#  git remote add （添加远程仓库） origin（远程仓库名随便起） git@gitee.com:murrey-5/test.git （远程仓库地址）
git remote add origin git@gitee.com:murrey-5/test.git
#  git push 推送代码 -u 同时为当前推送设置上游分支  origin master （origin 就是上面起的远程仓库名 master 分支名）
git push -u origin master
```

