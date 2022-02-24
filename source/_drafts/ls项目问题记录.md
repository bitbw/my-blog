---
title: ls项目问题记录
date: 2020-09-20 19:48:18
tags: 
categories:
---



##  eletron 项目 install 的问题

> 注意：项目的所有路径中不允许出现中文，否则会导致构建后安装依赖报错

错误案例:

```
UnicodeDecodeError: 'ascii' codec can't decode byte 0xc5 in position 12: ordinal not in range(128)
```

因为安装需要Python环境和Visual Studio 可以直接使用 `npm install --global --production windows-build-tools` 直接安装

`npm install --global --production windows-build-tools`   

安装后，npm将自动执行此模块，该模块将下载并安装Visual C ++ Build Tools，Microsoft为大多数用户免费提供（作为Visual Studio Community的一部分，请查阅许可证以确定您是否符合条件） 。这些工具是[编译流行的本机模块](https://github.com/nodejs/node-gyp)所[必需的](https://github.com/nodejs/node-gyp)。如果尚未安装，它还将安装Python 2.7，并适当配置您的计算机和npm。

参考资料：https://www.npmjs.com/package/windows-build-tools

要是分别安装的话：

必须先装Visual Studio 因为插件基于C++开发 

然后添加c++组件  

> 如果报错 提示 无法找到 v140 的生成工具(平台工具集 =“v140”)  则需要在 Visual Studio 中添加 平台工具集V140 组件

## 问题汇总

| 问题                                                         | 解决方案                                                     | 备注                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| vuetify升级后造成的样式问题                                  | 通过调试发现主要为  升级后的v-row的margin为-12px     解决：将所有样式有问题的v-row的margin调为0抵消vuefity自带的margin |                                                              |
| table组件的宽度自动适应问题                                  | table在所有列都不够撑满整个table的情况下，给每列都设置宽度是不生效的，解决方案：给需要给宽度的列宽度，不需要给的不给让其使用剩余宽度即可，如果所有列都需要给定宽度，这使用插槽将给定宽度,或者通过给的类名的方式 | {         text: "方案名称",         width: 300,         align: "start",         value:  "schemaName",        },        { text: "发货日期",  width: 220, value: "shipDate" },        { text: "订单备注",  value: "description", class:  "table-header-description",   }     <template v-slot:[`item.description`]="{ value }">             <div  style="width:100px">                <span>{{value}}</span>             </div>            </template> |
| electron中不可使用vue的histroy模式                           | [https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/commonIssues.html#blank-screen-on-builds-but-works-fine-on-serve](https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/commonIssues.html) |                                                              |
| 使用ipcRenderer.sendSync后程序卡住（阻塞）问题               | 使用 ipcRenderer.sendSync 方法进行通信  ,对应的 ipcMain.on 中必须使用 event.returnValue 返回结果          否则 sendSync 会将阻塞整个渲染进程 ，导致程序卡住 |                                                              |
| electron 9 以后 输入框出现红色波浪线                         | 对于 Electron 9  及以上，默认启用拼写检查器 ，需要在webPreferences 中设置spellcheck: false，禁用拼写检查器 |                                                              |
| electron 解决浏览器证书报错问题                              | app.commandLine.appendSwitch("ignore-certificate-errors");  加上这段即使证书有问题也不会报错 |                                                              |
| electron  使用installExtension(VUEJS_DEVTOOLS) 报错问题      | 改为使用session.defaultSession.loadExtension(         path.join(__dirname,  "../.vue-devtools") // __dirname : \app\dist_electron        ); |                                                              |
| 图片在浏览器缓存问题解决                                     | 图片地址后面添加随机参数例如：`http://xxxx.png?id=${Date.now()}` |                                                              |
| [vuetify@2.5.6   v-item-group change方法不好使](mailto:vuetify@2.5.6 v-item-group change方法不好使) | 只能使用watch value的方法判断选中哪个                        |                                                              |
| electron同时使用开发环境和生产环境会造成生产环境本地存储无数据 | 不同时使用生产模式和开发模式                                 |                                                              |
| sqlite insert写入数据中带有'  单引号导致报错问题             | keyWord = keyWord.replace(/'/g,  "''");   在SQL中需要将其替换为两个单引号（''），DBMS会将其解释为一个单引号的 |                                                              |
| vuetify按钮文字中的字母都是大写                              | 添加样式      .v-btn {       text-transform: none;      }    |                                                              |
| macos下macos版本更新后需要更新命令行开发者工具               | commenLineTool                                               |                                                              |
| vue多个组件下使用 同一方法和数据可以使用mixin                |                                                              |                                                              |
| bootcdn 不稳定 推荐使用 jsdelivr                             |                                                              |                                                              |
| vue自定义指令操作dom  最好在 inserted 生命周期中             |                                                              |                                                              |
| vue混入create中有异步操作 在组件中create无法等到混入的异步操作返回 |                                                              |                                                              |
