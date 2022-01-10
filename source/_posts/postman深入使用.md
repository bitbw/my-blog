---
title: postman 深入使用
date: 2018-11-28 16:56:05
tags:
  - 工具使用
  - postman
categories: 工具使用
cnblogs:
  postid: "15392985"
hash: aaa98fd48c8dcacd04e004d17aa1d1ba12822c583c4b63dd8618021454bac46f
---

## 设置变量 用于地址拼接

![1574931493737](https://gitee.com/bitbw/my-gallery/raw/master/img/1574931493737.png)

```js
// 使用时跟插值表达式一样用{{ }} 包裹 注意 /的拼接
```

![1574932590726](https://gitee.com/bitbw/my-gallery/raw/master/img/1574932590726.png)

## 设置环境变量

### 小技巧

> 可将不同环境的 baseurl 统一设置成一个变量名，然后只需要切换环境就可以请求不同 baseurl 的接口，在配合接口调试阶段很好用

![image-20210425165810147](https://gitee.com/bitbw/my-gallery/raw/master/img/image-20210425165810147.png)

## 拦截器：统一设置 token

![1574932641632](https://gitee.com/bitbw/my-gallery/raw/master/img/1574932641632.png)

## 导出自己的项目

![1574932698478](https://gitee.com/bitbw/my-gallery/raw/master/img/1574932698478.png)
