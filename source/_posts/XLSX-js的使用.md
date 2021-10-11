---
title: XLSX.js的使用
date: 2020-07-30 09:20:05
tags:
  - XLSX
  - 插件
categories: XLSX
cnblogs:
  postid: "15393029"
hash: 5638004f925ef5de9d2278245af4251bd8b0d2522416b8eb2f289e0eff3553b1
---

[SheetJS js-xlsx](http://sheetjs.com/) 中文文档： https://github.com/rockboom/SheetJS-docs-zh-CN

merges 的使用

```js
........
// 设置单元格合并
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

