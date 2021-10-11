---
title: Data URI详细介绍
date: 2020-12-31 09:09:56
tags:
  - HTML
  - js
  - CSS
categories: HTML
cnblogs:
  postid: "15392411"
hash: 78168fdbf8051697f159665881738323aceb15f85b3a326136ba1a4d9ad27c7d
---



最近学习webpack遇到了Data URI 这种格式，觉得很有趣稍微学习一下，转载一篇别人写的比较好的文章；

原文地址：https://blog.csdn.net/qq_38128179/article/details/100663085

## 一、URI介绍

URI（统一资源标识符） 是 uniform resource identifier的缩写，它定义了接受内容的协议以及附带的相关内容，如果附带的相关内容是一个地址，那么此时的 URI 也是一个 URL （uniform resource locator` `)。

## 二、什么是 data URI scheme？

Data URI scheme 简称 Data URI，经常会被**错误**地写成 data URLs。即前缀为data：协议的的URL，其允许内容创建者向文档中嵌入小文件。

> 假设我们有一个图片需要显示在网页上
>
> 1、通常我们会使用http链接，这种取得资料的方法称为 **http URI scheme**：
>
> ```html
> // 从外部请求一张图片
> <img src="http://pic1.win4000.com/wallpaper/c/53cdd1f7c1f21.jpg" alt="">
> ```
>
>  2、使用 **data URI scheme** 获取资料可以写成：
>
> ```html
> // 在HTML中嵌入一个小红点的图片
> <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==" alt="">
> ```
>
> 通过data RUI scheme，我们把图像内容内置在HTML 中，节省了一个 HTTP 请求。

##  三、**Data URI scheme 的语法**

>  **data:①[<mime type>]②[;charset=<charset>]③[;<encoding>]④,<encoded data>⑤**

**【1】第①部分data：** 协议头，它标识这个内容为一个 data URI 资源。

**【2】第②部分MIME 类型（可选项）：**浏览器通常使用MIME类型（而不是文件扩展名）来确定如何处理文档；因此服务器设置正确以将正确的MIME类型附加到响应对象的头部是非常重要的。MIME类型对大小写不敏感，但是传统写法都是小写。

| **类型**    | **描述**                                         | **示例（语法：type/subtype 类型/子类型****）**               |
| 