---
title: JS中常见获取随机数的方法
date: 2021-07-02 13:58:11
tags:
  - js
categories: js
cnblogs:
  postid: "15392492"
hash: 5bab5631ce34886997da7504571a3b3a94e981e80496d8eabd524aaff98d6035
---

## JS 获取固定区间的随机数

```js
const min = 0;
const max = 20;
Math.round(Math.random() * (max - min)) + min;
```

## JS 简单生成由字母数字组合随机字符串示例

```js
/*
 ** randomWord 产生任意长度随机字母数字组合
 ** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位 , true 使用min - max  false 使用 min
 ** xuanfeng 2014-08-28
 */
function randomWord(randomFlag, min, max) {
  var str = "",
    range = min,
    arr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min;
  }
  for (var i = 0; i < range; i++) {
    pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
}
```
