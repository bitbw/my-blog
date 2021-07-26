---
title: js常用冷知识
date: 2021-04-24 12:33:21
tags:
	- js
	- javascript
categories: js
---



## 函数对象+空字串 = 函数内容

```js
function add(...arg){
   return  arg.reduce((per,cur)=>per + cur, 0)
}

console.log(add + '')

//function add(...arg){
//   return  arg.reduce((per,cur)=>per + cur, 0)
//}
```

node.js中 查看CommonJS的模块

index.js

```js

exports.a = 1

console.log(arguments.callee + "")
```

使用 node运行

```bash
node index.js
```

打印

```js
function (exports, require, module, __filename, __dirname) {

exports.a = 1

console.log(arguments.callee + "")
}
```

exports 为 module 中的属性