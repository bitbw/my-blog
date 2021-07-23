---
title: vue 移动端采坑
date: 2019-2-30 20:54:04
tags: vue
categories: Vue
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

![搜狗截图20191201171855](https://raw.githubusercontent.com/zhangbowen-github/my-gallery/main/img/搜狗截图20191201171855.jpg)

> 注意：**`JSON.parse(null)` 是返回 null 其他除了 string 类型的数据都会报错**
