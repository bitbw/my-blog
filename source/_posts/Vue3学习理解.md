---
title: Vue3学习理解
date: 2020-12-24 14:35:01
tags: vue
categories: vue
---



vue3 新特性

## 组合式 API

vue3 中加入了组合式 ，这个功能的作用是将单个vue组件的，逻辑部分也能自由拆分组合，更深层次的实现解耦和高复用性

vue2 如果单个vue文件逻辑部分过大 ，我们往往 需要单独用一个js文件或ts文件存放 逻辑（函数）并且为了使用vue组件上的响应式属性不得不将vue实例传进这个函数中，总有一种怪怪的感觉；

```js
 // vue2  单独存放逻辑的文件
export default function handle(vue,xx){
    vue.yy = xx ;
    ....
}
```

 

## 响应式

- ref 用于创建简单数据类型的响应式数据
- reactive 只能用于创建对象数据类型的相应式数据