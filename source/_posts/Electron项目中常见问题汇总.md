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

## 使用ipcRenderer.sendSync后程序卡住（阻塞）问题

使用 ipcRenderer.sendSync 方法进行通信 ,对应的 ipcMain.on 中必须使用 event.returnValue 返回结果

否则 sendSync 会将阻塞整个渲染进程 ，导致程序卡住

官方文档中的警告

> ⚠️**警告**：发送同步消息会阻塞整个渲染器进程，直到收到回复，所以只能作为最后的手段使用此方法。使用异步版本要好得多，[`invoke()`](https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererinvokechannel-args).

所以尽量使用ipcRenderer. send 而非 sendSync 方法，或者再每个 ipcMain.on 中都添加返回值 event.returnValue

## electron+vue项目添加vue-devTools Unrecognized manifest key ‘browser_action‘. Permission ‘contextMenus‘

### 构建vue-devtools

手动clone项目`vue-devtools`
`git clone https://github.com/vuejs/vue-devtools.git`
然后切换到`add-remote-devtools`分支，默认的是`main`分支：
`git checkout add-remote-devtools`
进入`vue-devtools`根目录：

```bash
yarn
# ...
yarn run build
```

 run build

*这一步会出现一个特别恶心的webpack,webpack-cli互相依赖缺失的问题，提示没有webpack模块，然后全局安装webpack模块，npm install -g webpack，这时候运行webpack指令，会发现缺失webpack-cli，再次全局安装webpack-cli，npm install -g webpack-cli，这时候运行webpack-cli指令，又莫名其妙的提示缺失webpack模块。*

*原因就是webpack4.0的问题，解决办法就是安装指定版本的webpack：npm install -g webpack@3.6.0，而不是默认，默认会出现4以上版本，甚至5.1版本或者更高。*

*但是有的系统如果以前全局安装过webpack，还是会报这些相互依赖的问题，或者是环境变量导致的webpack,webpack-cli安装进了node目录，而以前有的webpack安装进了C:\Users\Administrator\AppData\Roaming\npm这个目录。解决办法就是删除C:\Users\Administrator\AppData\Roaming\npm目录下的webpack。*

### 修改代码

然后将build生成的shells目录中的chrome目录拷贝出来，这个就是build生成的vue-devtools插件
浏览器安装容易，直接打开插件管理，切换开发模式，加载已解压插件，选择刚刚的chrome目录就行了。但是electron项目中安装会有点麻烦：

找到background.js文件 (如果没有background.js 找到main/index.js)，找到这段代码：

```js

app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});
```

这个是默认安装`vue-devtools`部分，不过因为网络(墙)问题，安装不上：

```log
Failed to fetch extension, trying 4 more times
Failed to fetch extension, trying 3 more times
Failed to fetch extension, trying 2 more times
Failed to fetch extension, trying 1 more times
Failed to fetch extension, trying 0 more times
Vue Devtools failed to install: Error: net::ERR_CONNECTION_TIMED_OUT
```

所以要修改一下：

```js
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      // await installExtension(VUEJS_DEVTOOLS);
      // 新增的：安装vue-devtools
      const { session } = require("electron");
      const path = require("path");
      session.defaultSession.loadExtension(
        path.resolve(__dirname, "../../vue-devtools/chrome")  //这个是刚刚build好的插件目录
      ); 
    //这个是刚开始找的方法不行，换上边的方法
    // BrowserWindow.addDevToolsExtension(path.resolve(__dirname, "../../vue-devtools/chrome")  );
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

```

提示

```log
(node:9068) ExtensionLoadWarning: Warnings loading extension at ...\vue-devtools\chrome: Unrecognized manifest key 'browser_action'. Permission 'contextMenus' is unknown or URL pattern is malformed.
```

解决：
在vue-devtools/chrome/manifest.json 删掉相应的字段

![img](https://gitee.com/bitbw/my-gallery/raw/master/img/electron20201111130214278.png)

### 问题：

#### 报 Cannot read property ‘**VUE_DEVTOOLS_UID**’ of undefined

在 main.js中加入如下代码即可：

```bash
Vue.config.devtools = true;
```

#### 打包出来的vue-devtools 可能是最新版的外观可能不太适应

直接在github官方地址 https://github.com/vuejs/devtools/tags下载自己用的比较顺手的版本 

我比较喜欢v5.3.3

然后相同的方法 构建 复制 粘贴就行

