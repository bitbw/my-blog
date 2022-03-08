---
title: Nodejs常用方法
date: 2022-03-07 17:09:09
tags:
    - Nodejs
categories: Nodejs
---


## 路径是否存在，不存在则创建

```js
const path = require("path");
const fs = require("fs").promises;
/**
 * 路径是否存在，不存在则创建
 * @param {string} dir 路径
 */
async function dirExists(dir) {
  //如果该路径且不是文件，返回true
  let isExists;
  try {
    isExists = await fs.stat(dir);
  } catch (error) {
    console.log("[log][dirExists] path is not exist");
    // 创建目录
  }
  if (isExists) {
    //如果该路径存在但是文件，返回false
    if (isExists.isFile()) {
      return false;
    }
    // 存在返回 true
    if (isExists.isDirectory()) {
      return true;
    }
  }

  //如果该路径不存在
  let pDir = path.parse(dir).dir; //拿到上级路径
  //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
  let status = await dirExists(pDir);
  let mkdirStatus;
  if (status) {
    try {
      mkdirStatus = await fs.mkdir(dir);
    } catch (error) {
      return false;
    }
  }
  console.log(`[log] ${dir} created`);
  return true;
}

```

## 删除文件夹和内部所有文件

```js
var fs = require("fs"); //引入fs模块
var path = require("path"); //引入path模块
/**
 * @description: 删除文件夹和内部所有文件
 * @param {*} dir
 * @return {*}
 */
function rmdirDeepSync(dir) {
  var files = fs.readdirSync(dir); //同步读取文件夹内容

  files.forEach(function (item, index) {
    //forEach循环
    let p = path.resolve(dir, item); //读取第二层的绝对路径
    let pathstat = fs.statSync(p); //独读取第二层文件状态
    if (!pathstat.isDirectory()) {
      //判断是否是文件夹
      fs.unlinkSync(p); //不是文件夹就删除
    } else {
      rmdirDeepSync(p); //是文件夹就递归
    }
  });
  fs.rmdirSync(dir); //删除已经为空的文件夹
}


```
