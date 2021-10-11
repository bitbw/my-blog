---
title: 使用xlsx.js 实现隐藏工作簿
date: 2020-12-13 17:15:41
tags:
  - js
  - XLSX
  - 插件
categories: XLSX
cnblogs:
  postid: "15393034"
hash: 90b785470eecf9304b3ea6b745d06f1d4e394c5edf93b08f83e6b7dbf16177e9
---

[SheetJS js-xlsx](http://sheetjs.com/) 中文文档： https://github.com/rockboom/SheetJS-docs-zh-CN

下面是对工作簿能见度的描述文档

## 数据表能见度

Excel支持将表格隐藏在更低的标签栏。表格数据存储文件内，但是UI不容易让它可以使用。标准的隐藏表格会被显示在"Unhide"菜单内。Excel也有"very hidden"表格，这些表格不能被显示在菜单内。只可以通过Vb编辑器访问。

能见度的设置被存储在表格属性数组的`Hidden`属性当中。

| Value | Definition  |
| 