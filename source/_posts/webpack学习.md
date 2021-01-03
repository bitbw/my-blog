---
title: webpack学习
date: 2021-01-02 16:09:17
tags:
	- Webpack
	- webpakc-cli
categories:  Webpack
---



## 需要用到的包介绍

- webpack  - webpack 的核心包
- webpack-cli - webpack 的命令行工具
- webpack-dev-server - webpack 的开发服务器 （热更新）



### webpack-cil 命令参考

https://webpack.js.org/api/cli/

webpack 的打包过程

![](webpack%E5%AD%A6%E4%B9%A0/web%E5%B7%A5%E4%BD%9C%E6%B5%81%E7%A8%8B.png)

## webpack初体验

- webpack将ES6的模块化编译成浏览器能够识别的模块化
- webpack默认只能打包js 和json文件
- 生产环境和开发环境的区别 ，开发环境是经过压缩的代码

使用命令行设置打包入口出口和mode

```bash
webpack --entry  ./src/index.js -o ./dist --mode=development #开发模式

webpack --entry  ./src/index.js -o ./dist --mode=production #生产模式
```

## webpack.config.js

>指示webpack来干那些活 当运行 webpack指令时 会加载里面的配置

## 打包样式资源

### 普通css文件

```js
// webpack.config.js
const { resolve } = require("path");
module.exports = {
  //入口
  entry: "./src/index.js",
  //出口
  output: {
    filename: "bundle.js",
    path: resolve(__dirname, "dist")
  },
  //模式 development 、 production
  mode: "development",
  // loader
  module: {
    rules: [
      {
        test: /\.css$/,
        // 执行顺序由右到左
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  // plugins 插件 （数组）
  plugins: []
};
```

```js
//index.js 中引入样式 webpack 会通过import加载css 再通过 css-loader ->style-loader 转换为style标签放在head中
import "./index.css"
```

### 引入less 或sass 样式处理文件

```js
// rules 中 添加 less  或 sass 的处理规则
{
    test:/\.less$/,
    use:[
      //转化为style
      "style-loader",
      // 处理css
      "css-loader",
      // 转化为css
      "less-loader"
    ]
 }
```

### 注意：

less 和 sass 不光要下对应的loader 还需要 less 或 sass 包  

ps：node-sass 安装起来比较麻烦 可以参照 https://www.cnblogs.com/zhishaofei/p/12712937.html

## tip ：node模块的搜索流程

> node在使用模块名来引入模块时,会首先在当前目录的node_modules中寻找是否有该模块
> 如果有则直接使用,如果没有则会一直向上一级目录的node_modules中寻找，直到磁盘的根目录

## 打包HTML资源

tip: html-webpack-plugin 和 html-loader 的不同

-  html-loader  是用来解析入口文件中关联的html中的image图片的引入
- html-webpack-plugin  是用来自动生成最后dist目录下的index.html  (并自动导入打包好的js)

html-webpack-plugin  插件的更多配置见官网 ：https://github.com/jantimon/html-webpack-plugin

```js
// webpack.config.js
const { resolve }  = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry:'./src/index.js',
    output:{
        filename:'bundle.js',
        path:resolve(__dirname,'dist')
    },
    mode:'development',
    module:{
        rules:[]
    },
    plugins:[
        // HtmlWebpackPlugin 会自动在output目录下生成index.html
        // 并自动引入打包好的 bundle.js
        new HtmlWebpackPlugin({
            // 以./src/index.html 为模板 生成最后打包好的html
            template:'./src/index.html'
        })
    ]
}
```

## 打包图片资源

```js
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bunle.js",
    path: resolve(__dirname, "dist"),
    publicPath: '', // webpack5 中html中导入image需要设置publicPath
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"]
      },
      // 解析图标 将小图标直接转base64 url-loader 依赖 file-loader 需要一起下载
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              // 小于8kb的以base64位插入 data:image/jpeg;base64,/9j
              // 大于8kb的以改为hash值为名称的原文件插入 
              limit: 8 * 1024,
              esModule: false,
            }
          }
        ]
      },
      {
        // 处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
        test: /\.html$/,
        use: "html-loader"
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html"
    })
  ]
};
```





## 报错



Error: Automatic publicPath is not supported in this browser

设置 output 中 publicPath: ''  为空字符串