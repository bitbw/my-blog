---
title: Vue3学习理解
date: 2020-12-24 14:35:01
tags: vue
categories: Vue
cnblogs:
  postid: "15393014"
hash: 13322c4e0206f67c63496a3bf31c154bfc4cbf3baa7fcd492fd81df09fce551b
---



# vue3 新特性

> 整理的比较好的文档：https://www.jianshu.com/p/1fd73091e2e4

直接看代码可以直接看 [实践demo](#demo ( Vue3 + TypeScript ))

## 组合式 API

vue3 中加入了组合式 ，这个功能的作用是将单个vue组件的，逻辑部分也能自由拆分组合，更深层次的实现解耦和高复用性

vue2 如果单个vue文件逻辑部分过大 ，我们往往 需要单独用一个js文件或ts文件存放 逻辑（函数）并且为了使用 vue 组件上的响应式属性不得不将 vue 实例传进这个函数中，总有一种怪怪的感觉；

```js
// vue2  单独存放逻辑的文件
export default function handle(vue,xx){
    vue.yy = xx ;
    ....
}
```

## 响应式的改变

> 响应式转换是“深层”的——它影响所有嵌套 property。在基于 [ES2015 Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 的实现中，返回的 proxy 是**不**等于原始对象的。建议只使用响应式 proxy，避免依赖原始对象。

- ref  可以用于创建所有数据类型的响应式数据 需要.value 访问 （对象类型数据配合reactive使用）
- reactive 只能用于创建对象数据类型的相应式数据 不需要.value 就直接可以访问 深度响应
- toRefs  用于给prop添加响应数据，需要.value 访问

### 基础api

#### reactive

返回对象的响应式副本

使用: 

> 可以直接给对象添加任何属性都是响应式的 ，但不能直接赋值对象

```js
let person = reactive({
    name: "zhangshan",
    age: 18
  });
// 有效
person.sex = "男";
// 无效
person = {...person,...{sex :  "男"}}

```

#### isReactive 

检查对象是否是reactive 创建的响应式 proxy。

#### readonly

除了只读以外跟reactive一样，但只读也代表了响应式没有意义了

#### isReadonly

检查对象是否是由readonly 创建的只读 prox

#### shallowReactive和shallowReadonly

与上面的差别就是指对第一层属性响应，再深度的则不响应

#### isProxy

检查对象是否是由reactive 或 readonly 创建的 proxy。

### Refs

#### ref

> 接受一个内部值并返回一个响应式且可变的 ref 对象。ref 对象具有指向内部值的单个 property `.value`。
>
> 也就是相当于解决了reactive 只能作用对象类型，和只能添加属性不能直接修改对象的不足
>
> 对象类型数据配合reactive使用

```js
const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
// 对象类型
let person = ref(reactive({
    name: "zhangshan",
    age: 18
  }));
person.value = reactive({
    name: "lisi",
    age: 28
  })
```

#### unref

返回使用ref响应数据的value （不是原始数据）

```js
 const flag = ref(reactive({
    number:0,
    name:'flag'
  }));
flag.value.number++;
console.log(unref(flag),'unref(flag) === flag.value',unref(flag) === flag.value); // 1 true
```



### setup（组合式的核心）

#### 定义：

>个人理解 :setup 相当于一个盒子  （组合式的核心） ，将`methods`、`watch`、`computed`、`data`的数据都在这里进行组合
>
>而`methods`、`watch`、`computed`、`data` 的数据，可以分别用不同的js文件生成，再导入到vue当文件组件中，或setup所在文件中

> 在Vue3中，定义 `methods`、`watch`、`computed`、`data`数据 等都放在了 `setup()` 函数中 ，(实现了逻辑的拆分)
>
> [官网地址](https://v3.cn.vuejs.org/guide/composition-api-introduction.html#setup-%E7%BB%84%E4%BB%B6%E9%80%89%E9%A1%B9)

#### 使用

setup方法接收两个参数 ：

- prop
- context 上下文对象也就是 this （当前vue实例）

```js
import { ref, onMounted, watch, toRefs, computed } from 'vue'
export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  setup(props) {
     // 使用 `toRefs` 创建对 props 中的 `user` property 的响应式引用
    const { user } = toRefs(props)
    const repositories = ref([])
    console.log(props) // { user: '' }

    return {} // 这里返回的任何内容都可以用于组件的其余部分
  }
  // 组件的“其余部分”
}
```

更多用法详见：[setup.ts](###setup.ts)

### setup语法糖` <scritp setup>`

可以使用`<script setup>` 标签 代替  setup（）

```js
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const inc = () => count.value++

    return {
      count,
      inc,
    }
  },
}
```

以上代码可以写成下面的代码

```vue
<template>
  <button @click="inc">{{ count }}</button>
</template>

<script setup>
  import { ref } from 'vue'

  export const count = ref(0)
  export const inc = () => count.value++
</script>

```

#### 使用限制：

>由于模块执行语义的不同，内部代码`<script setup>`依赖于SFC的上下文。当移至外部`.js`或`.ts`文件中时，可能会给开发人员和工具带来混乱。因此，**`<script setup>`**不能与该`src`属性一起使用。

**个人感觉比较麻烦 还不如正常的使用setup**



## Global API 全局 API

### `createApp` 创建整个应用的实例

> 3.x添加`createApp` 方法用来创建应用的根 防止数据间的相互污染   [官方文档地址](https://v3.cn.vuejs.org/guide/migration/global-api.html#%E4%B8%80%E4%B8%AA%E6%96%B0%E7%9A%84%E5%85%A8%E5%B1%80-api-createapp)

应用实例暴露当前全局 API 的子集，经验法则是，任何全局改变 Vue 行为的 API 现在都会移动到应用实例上，以下是当前全局 API 及其相应实例 API 的表：

| 2.x 全局 API               | 3.x 实例 API (`app`)                                         |
| 