---
title: vue 移动端采坑
date: 2019-2-30 20:54:04
tags: vue
categories: Vue
cnblogs:
  postid: "15393021"
hash: f15a90306e9c7db308ff4169e6bbd1693fceb339c02ceae3d5c8e232278aa5e0
---

## 1.报错

### 组件没注册报错

```js

vue.esm.js?efeb:591 [Vue warn]: Unknown custom element: <el-container> - did you register the component correctly? For recursive components, make sure to provide the "name" option.

found in

---> <Container> at src/components/Container.vue
       <App> at src/App.vue
         <Root>
```

**以上错误 表示你没有注册这个组件 需要单独注册**

### `JSON.parse()`的使用

![搜狗截图20191201171855](https://gitee.com/bitbw/my-gallery/raw/master/img/搜狗截图20191201171855.jpg)

> 注意：**`JSON.parse(null)` 是返回 null 其他除了 string 类型的数据都会报错**
