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

## webpack-cil 命令参考

https://webpack.js.org/api/cli/

## webpack 的打包过程

![](https://raw.githubusercontent.com/zhangbowen-github/my-gallery/main/img/web工作流程.png)

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

### 注意事项：

less 和 sass 不光要下对应的loader 还需要 less 或 sass 包  

ps：node-sass 安装起来比较麻烦 可以参照 https://www.cnblogs.com/zhishaofei/p/12712937.html



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
    publicPath: '', // webpack5 中html中导入image需要设置publicPath （升级html-webpack-plugin 到 5.xx可以不用）
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



## 打包其他资源（字体等）

```js
  {
    // 处理其他资源
    exclude: /\.(html|js|css|less|jpg|png|gif)/,
    loader: 'file-loader',
    options: {
      name: '[hash:10].[ext]',
      outputPath: 'font'
    }
  }
```



## devServer

webpack.config.js 中添加

```js
// 开发服务器 devServer：用来自动化（自动编译，自动打开浏览器，自动刷新浏览器~~）
// 特点：只会在内存中编译打包，不会有任何输出
devServer: {
    // 项目构建后路径
    contentBase: resolve(__dirname, 'build'),
    // 启动gzip压缩
    compress: true,
    // 端口号
    port: 3000,
    // 自动打开浏览器
    open: true
  }
```

**调用服务使用命令** 

如全局安装wabpack直接: `webpack serve`

没有全局安装webpack :`npx webpack serve`

启动服务后不会生成固定文件 devserver会在内存中进行编译

### 使用express作为开发服务器配置

https://webpack.docschina.org/guides/development/#using-webpack-dev-middleware



## 提取css文件为单独资源

> 用上面的方法打包出来的 css 都在js文件中  感觉加载时会闪一下  所以单独提炼出css (使用link标签)

#### 下载插件

```bash
npm install --save-dev mini-css-extract-plugin
```

#### 修改配置

```js
 module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 这个loader取代style-loader。作用：提取js中的css成单独文件
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    // 对输出的css文件进行重命名
    new MiniCssExtractPlugin({
      filename: "css/index.css"
    }),
  ]
```

## css兼容性处理

 基于：[postcss](https://www.postcss.com.cn/)

postcss 相当于一个启动器，里面可以装各种 插件 如 postcss-preset-env（预设环境） 和 autoprefixer(自动前缀)

#### 下载插件

```bash
npm install --save-dev postcss-loader postcss-preset-env
```

postcss-loader ：

>在所有css | sass | less  loader前使用   作用： 使用 postcss 来解析 css

postcss-preset-env :

>帮你将最新的 CSS 语法转换成大多数浏览器都能理解的语法，并根据你的目标浏览器或运行时环境来确定你需要的 polyfillss （postcss-preset-env 为 postcss 的 预设环境）

#### 修改配置

```js
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          /*
            css兼容性处理：postcss --> postcss-loader -postcsspreset-env

            帮postcss找到package.json中browserslist里面的配置，通过配置加载指定的css兼容性样式

            "browserslist": {
              // 开发环境 --> 设置node环境变量：process.env.NODE_ENV = development
              "development": [
                "last 1 chrome version",
                "last 1 firefox version",
                "last 1 safari version"
              ],
              // 生产环境：默认是看生产环境
              "production": [
                ">0.2%",
                "not dead",
                "not op_mini all"
              ]
            }
          */
          // 使用loader的默认配置
          // 'postcss-loader',
          // 修改loader的配置
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      // Options
                    },
                  ],
                  // 或者 require("postcss-preset-env")()
                ]
              }
            }
          }
        ]
      }
    ]
```

#### browserslist 

具体配置说明 https://github.com/browserslist/browserslist

在 package.json 中配置 browserslist 或添加 .browserslistrc文件

具体的环境是根据 process.env.NODE_ENV 确定， 所以需要设置 process.env.NODE_ENV ，光设置 mode: 'production' 无用

```json
"browserslist": {
    "development": [
      "last 1 chrome version",//兼容最近的谷歌浏览器
      "last 1 firefox version",
      "last 1 safari version"
    ],
    "production": [
      ">0.01%",//兼容>0.01%
      "not dead",//不用管弃用的浏览器
      "not op_mini all"//不用op
    ]
  }
```























## 每次打包清除打包文件

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
...
plugins:[
    new CleanWebpackPlugin(),
]
```



## 报错



Error: Automatic publicPath is not supported in this browser

设置 output 中 publicPath: ''  为空字符串

## tip ：node模块的搜索流程

> node在使用模块名来引入模块时,会首先在当前目录的node_modules中寻找是否有该模块
> 如果有则直接使用,如果没有则会一直向上一级目录的node_modules中寻找，直到磁盘的根目录