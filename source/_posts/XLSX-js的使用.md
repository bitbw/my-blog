---
title: XLSX.js的使用
date: 2020-07-30 09:20:05
tags: excel
categories: excel
---

merges 的使用

```js
........
data["!merges"] = [{
    s: {//s为开始
        c: 1,//开始列
        r: 0//可以看成开始行,实际是取值范围
    },
    e: {//e结束
        c: 4,//结束列
        r: 0//结束行
    }
}];
........
```
