---
title: vue移动端采坑
date: 2019-11-30 20:54:04
tags: 
---

## 1.报错

```js

vue.esm.js?efeb:591 [Vue warn]: Unknown custom element: <el-container> - did you register the component correctly? For recursive components, make sure to provide the "name" option.
 
found in
 
---> <Container> at src/components/Container.vue
       <App> at src/App.vue
         <Root>
```



**以上错误 表示你没有注册这个组件 需要单独注册**