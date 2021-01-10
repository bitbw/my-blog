---
title: Vue3学习理解
date: 2020-12-24 14:35:01
tags: vue
categories: vue
---



# vue3 新特性



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



## teleport

> teleport 可以将组件生成的dom节点 ，转移到其他dom下作为其子节点
>
> 让我们修改 `modal-button` 以使用 `<teleport>`，并告诉 Vue “**Teleport** 这个 HTML **到**该‘**body**’标签”。

```js
app.component('modal-button', {
  template: `
    <button @click="modalOpen = true">
        Open full screen modal! (With teleport!)
    </button>

    <teleport to="body">								// teleport 的 to属性就是作为哪个dom的字节的
      <div v-if="modalOpen" class="modal">
        <div>
          I'm a teleported modal! 
          (My parent is "body")
          <button @click="modalOpen = false">
            Close
          </button>
        </div>
      </div>
    </teleport>
  `,
  data() {
    return { 
      modalOpen: false
    }
  }
})
```

**Props：**

- `to` - `string`。需要 prop，必须是有效的查询选择器（独一无二的类名或id或属性）或 `HTMLElement` (如果在浏览器环境中使用)。指定将在其中移动 `<teleport>` 内容的目标元素

```html
<!-- 正确 -->
<teleport to="#some-id" />				
<teleport to=".some-class" />
<teleport to="[data-teleport]" />

<!-- 错误 -->
<teleport to="h1" />
<teleport to="some-string" />
```

- `disabled` - `boolean`。此可选属性可用于禁用 `<teleport>` 的功能，这意味着其插槽内容将不会移动到任何位置，而是在您在周围父组件中指定了 `<teleport>` 的位置渲染。

```html
<teleport to="#popup" :disabled="displayVideoInline">
  <video src="./my-movie.mp4">
</teleport>
```

请注意，这将移动实际的 DOM 节点，而不是被销毁和重新创建，并且它还将保持任何组件实例的活动状态。所有有状态的 HTML 元素 (即播放的视频) 都将保持其状态。



## 片段

Vue 3 现在正式支持了多根节点的组件，也就是片段！

在 3.x 中，组件可以包含多个根节点！但是，这要求开发者显式定义 attribute 应该分布在哪里。

```html
<!-- Layout.vue -->
<template>
  <header>...</header>
  <main v-bind="$attrs">...</main>
  <footer>...</footer>
</template>
```

> 因为2.x只有一个根节点 $attrs 就会绑定到根节点上，现在3.x会有多个根节点，所以需要定义$attrs需要绑定到到那个节点上



## `v-model` 

2.x 使用input + value 实现v-model , 3.x 里使用使用 `modelValue`（  自己定义字段名与update:后面的字段一致即可 ，默认值是`modelValue`） 作为 prop 和 `update:modelValue` 作为事件

```js
app.component('my-component', {
  props: {
    title: String
  },
  emits: ['update:title'],
  template: 
 `  <input 
      type="text"
      :value="title"
      @input="$emit('update:title', $event.target.value)">
  `
})
```

```html
<my-component v-model:title="bookTitle"></my-component>
```

> 注意点：v-model 后面需要加对应的update后的的字段名  习惯于2.x语法后 前几次会忘记加

并且可以使用多个v-model 只需要在v-model后面加上对应的prop字段名即可

### `v-model` 修饰符

在2.x中v-model的修饰符有.trim`、`.number` 和 `.lazy， 

在3.x中我们可以自定义修饰符，比如 `v-model:title.capitalize="bar"` 

 在子组件中 prop中 `titleModifiers`中可以接收到 `capitalize：ture `  再做对应处理后

prop中修饰符的属性名为 ： `arg + "Modifiers"`：（绑定value字段名 + "Modifiers"）

父组件

```html
   <HelloWorld v-model:title.capitalize="inputValue" />
```

子组件

```html
 <input type="text" :value="title" @input="handleCapitalize" />
```

```typescript
//prop
 props: {
    title: String,
    titleModifiers: { //使用title + Modifiers 获取修饰符对象 { capitalize:ture } 
      type: Object,			
      default: () => ({})
    }
  },
// mothods
handleCapitalize(event) {
  let value = event.target.value;
  if (this.titleModifiers.capitalize) { // capitalize:ture
    value = value.toLocaleUpperCase();
  }
  this.$emit("update:title", value);
}
```

>  如果`v-modle `使用默认值 `modelValue`   时，prop修饰符对象使用 `modelModifiers` 作为属性名



## 单文件组件状态驱动的 CSS 变量(实验性)

> `3.x` 单文件组件中style中可是使用当前`vue`实例的data数据
>
> 最新提议 https://github.com/vuejs/rfcs/pull/231

```vue
<template>
  <div class="text">hello</div>
</template>

<script>
  export default {
    data() {
      return {
        color: 'red',						  // data中的变量在style中都可以使用 使用v-bind （11月10日最新提议）
        font: {								  // 之前的提议是 var(--变量名)
          size: '2em'
        }
      }
    }
</script>

<style>
  .text {
    color: v-bind(color);

    /* 使用对象.属性 包在''引号中 */
    font-size: v-bind('font.size');
  }
</style>
```



## 单文件组件样式作用域的变化

```vue
<style lang="scss" scoped>
/* deep (css选择器)  */
::v-deep(.foo) {}
/*可以在（）里写,  在sass less scss 等预编译器中可以写在 {} 中*/
::v-deep() {
    .foo{
        ...
    }
}    
/* 简写 */
:deep(.foo) {}

/* 插槽 ：TODO:目前没发现怎么用 如果是父组件里写 直接加悬选择器就可以 子组件又怎么确定选择器呢 ？ */
::v-slotted(.foo) {}
/* 简写 */
:slotted(.foo) {}

/* 在 scoped 中作用全局的样式 功能就 跟不加scoped一样 感觉有点脱裤子放屁的感觉 */
::v-global(.foo) {}
/* 简写 */
:global(.foo) {}
</style>
```



## tip 名词含义

- `SFC`  -  单文件组件

