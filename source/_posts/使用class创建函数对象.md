---
title: 使用class创建函数对象
date: 2022-04-15 16:14:27
tags:
categories: es6
---

使用class创建函数对象 ,可以在 constructor 中返回一个函数 并设置其原型 === this

```js

class Logger {
  constructor(tags) {
    this.tags = [].concat(tags);
    let _this = this;
    function fn(tags) {
      _this.tags = _this.tags.concat(tags);
      return fn;
    }
    Object.setPrototypeOf(Object.getPrototypeOf(fn), this);
    return fn;
  }
  info(info) {
    console.log(this.tags.map(tag=>`[${tag}]`).join(""), info);
  }
}
/**
 * @description: 日志 支持链式调用例如 logger("tag1")("tag2")("tag3").info("info") 和 logger(["tag1","tag2"]).info("info")
 * @param {*} tag  [tag1][tag2]
 * @return {*} 返回 函数
 */
 let logger = new Logger()

```
