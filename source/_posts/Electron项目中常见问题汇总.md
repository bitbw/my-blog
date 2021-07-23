---
title: Electron项目中常见问题汇总
date: 2021-06-07 13:59:46
tags:
	- Electron
	- electron-builder
categories: Electron
---



## electron 更新到 12 后提示 Require is not defined

### 问题

将项目从electron 6 升级到electron 12 后，启动项目渲染进程控制台提示：Require is not defined

### 解决

项目使用vue-cli-plugin-electron-builder 搭建，在vue-cli-plugin-electron-builder的github问题上找到对应答案

问题地址：https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/1349

在new BrowserWindow 中添加nodeIntegration和contextIsolation的对应配置

```js
  const win = new BrowserWindow({
	// ...
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
      // ...
    }
  })
 
```

同时修改vue.config.js

官方说明：https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration

```js

module.exports = {
   //...
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
       //...
    }
  }
}
```

 fs.existsSync is not a function

## 使用vue-cli-plugin-electron-builder的项目修改主进程和渲染进程入口文件

修改vue.config.js

```js
module.exports = {
   //...
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/main/index.js',
      rendererProcessFile: 'src/renderer/index.js',
      mainProcessWatch: ['src/main'],
       //...
    }
  }
}
```

