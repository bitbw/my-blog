---
title: picgo + typroa + github 实现自动上传图床
date: 2021-02-06 16:18:02
tags:
	- picgo
	- typora
	- github

categories: typora
---



## typora结合PicGo设置github图床

 详细教程：https://blog.csdn.net/beichuchuanyue/article/details/105493948

> 最近一直在用 ubuntu 所以直接使用 picgo-core （命令行） 实现上传图片 

## picgo-core 配置文件

> 如果配置好了picgo app 直接把iconfig 粘进来就行

```json
{
  "picBed": {
    "current": "github",
    "github": {
      "branch": "分支",
      "customUrl": "https://raw.githubusercontent.com/用户名/仓库/分支",
      "path": "img/", //具体文件夹
      "repo": "zhangbowen-github/my-gallery",
      "token": "5fcc67787af3d565841804d347043720e5d6fdf2" //Settings -> Developer settings -> Personal access tokens->创建 全选
    },
    "uploader": "github"
  },
  "settings": {
    "shortKey": {
      "picgo:upload": {
        "enable": true,
        "key": "CommandOrControl+Shift+P",
        "name": "upload",
        "label": "快捷上传"
      }
    },
    "server": {
      "enable": true,
      "host": "127.0.0.1",
      "port": 36677  //端口号不要改
    },
    "showUpdateTip": true,
    "pasteStyle": "markdown",
    "autoRename": true,
    "rename": false,
    "autoStart": true,
    "miniWindowOntop": false,
    "checkBetaUpdate": true
  },
  "picgoPlugins": {},
  "debug": true,
  "PICGO_ENV": "GUI",
  "needReload": false
}
```

>注意上传同名图片会导致失败

常见报错：https://blog.csdn.net/qq754772661/article/details/111385955