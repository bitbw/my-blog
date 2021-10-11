---
title: Vue的使用注意事项
tags:
  - vue
categories: Vue
date: 2020-09-16 11:34:54
cnblogs:
  postid: "15393020"
hash: 9d7dbe77e51f41fe18a3f9705bff7517beaedc2a0206474fbe242a35264b5f2f
---


> 这篇文章是我在工作中使用vue遇到的问题做的简单汇总，希望能对看到这篇文章的你有所帮助

## vue中给数组中的对象,添加使vue监听的属性  

不能使用直接遍历设置的方法

```js
this.arr.forEach(item => {
  item.showEditBtn = true
})
```

要使用$set的方法

```js
this.arr.forEach(item => {
  this.$set(item, 'showEditBtn', true)
})
```

或者使用  splice+  **[Object.assign()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)** 方法  

>注意点：目标对象要使用一个新的空对象 ，将目标和原对象一起混入到新的对象中，这样新 property才会触发更新
>
>同时：数组要触发状态更新，不使用set的情况下要使用splice方法触发数组的更新

```js
this.arr.forEach((item , index) => {
 splice(index, 1, Object.assign({}, data, keyValue));
    //或者
    tableData.splice(index, 1, { ...data, ...keyValue });
})
//注意
//直接使用data= Object.assign({}, data, keyValue)
//会使数据在栈中引用的地址发生改变
//但是使数组中的引用地址还是原来的地址
//会导致数组不会发生任何改变 只是data这个变量的地址引用发生了改变

```

参考文档：[对于对象](https://cn.vuejs.org/v2/guide/reactivity.html#对于对象) [对于数组](https://cn.vuejs.org/v2/guide/reactivity.html#对于数组)

## v-if 使用时注意 vue会将一样的元素复用 需要加key解决

>在下面的案例中 即使渲染出返回按钮 因为下面的每个else元素都一样 但是返回依然不现实 因为复用了下面的元素样式display: none;   需要在不需要复用的元素上加key 解决

[vue原文链接]([https://cn.vuejs.org/v2/guide/conditional.html#%E7%94%A8-key-%E7%AE%A1%E7%90%86%E5%8F%AF%E5%A4%8D%E7%94%A8%E7%9A%84%E5%85%83%E7%B4%A0](https://cn.vuejs.org/v2/guide/conditional.html#用-key-管理可复用的元素))

```html
   <div class="top-button" v-if="isView">
    <el-button type="primary" plain @click="isView = false" icon="iconfont iconfont-hcm-back">返回</el-button>
   </div>
   <div class="top-button" v-else-if="isEdit === false">
    <el-button type="primary" plain @click="onNewPayment" icon="iconfont iconfont-hcm-add" v-btn:edit="$route.query"
     >新建</el-button
    >
    <el-button
     type="primary"
     icon="iconfont iconfont-xinchou-fabu"
     plain
     @click="onPublish(true)"
     v-btn:edit="$route.query"
     >发布</el-button
    >
    <el-button
     type="primary"
     icon="iconfont iconfont-xinchou-quxiaofabu"
     plain
     @click="onPublish(false)"
     v-btn:edit="$route.query"
     >取消发布</el-button
    >
    <el-button type="primary" plain @click="onClickCancelPublish" v-btn:edit="$route.query">设置启动时间</el-button>
    <el-button
     type="primary"
     plain
     @click="$refs.changeLogDialog.open(currentNode.data.id, false)"
     v-btn:view="$route.query"
     >查看变更记录</el-button
    >
   </div>

   <div class="top-button" v-else-if="isEdit">
    <el-button type="primary" plain @click="onEditSave" icon="iconfont iconfont-hcm-save">保存</el-button>
    <el-button type="primary" plain @click="onEditCancel" icon="iconfont iconfont-hcm-delete">取消</el-button>
   </div>
  </el-header>
```

## vue样式：scoped 使用

#### 深度作用选择器

如果你希望 `scoped` 样式中的一个选择器能够作用得“更深”，例如影响子组件，你可以使用 `>>>` 操作符：

```html
<style scoped>
.a >>> .b { /* ... */ }
</style>
```

上述代码将会编译成：

```css
.a[data-v-f3f3eg9] .b { /* ... */ }
```

有些像 Sass 之类的预处理器无法正确解析 `>>>`。这种情况下你可以使用 `/deep/` 或 `::v-deep` 操作符取而代之——两者都是 `>>>` 的别名，同样可以正常工作。

参考： [vue-loader官方文档-深度作用选择器]([https://vue-loader.vuejs.org/zh/guide/scoped-css.html#%E6%B7%B1%E5%BA%A6%E4%BD%9C%E7%94%A8%E9%80%89%E6%8B%A9%E5%99%A8](https://vue-loader.vuejs.org/zh/guide/scoped-css.html#深度作用选择器))

## Vue 中的v-bind 使用问题

> 在vue中使用v-bind 绑定对象时 需要注意 ：v-bind绑定值不会覆盖之前的属性

```html
<input type="text" class="test" :disabled="false" v-bind="{ disabled: true, class: 'test3' }" />
<!-- 上面的代码disabled显示的还是false 但是class可以进行合并 显示：class="test test3" -->
<input 
   type="text" 
   class="test" 
   :class="'test2'" 
   :disabled="false" 
   v-bind="{ disabled: true, class: 'test3' }"
   />
<!--注意： class 只能合并一次  最后显示 class="test test2"-->
```

#### 模板 v-bind绑定值的变量名为class 报  'v-bind' directives require an attribute value.eslint

>在模板中绑定的名称不要用class 作为命名 否则eslint会报'v-bind' directives require an attribute value.eslint 




$attrs 可以获取任何绑定在组件上的属性 但（ `porp`中的属性和  `class` 和 `style` 除外）

## vue-property-decorator  注意事项（ts项目中）

介绍链接[https://segmentfault.com/a/1190000019906321]

### 1.新建组件必须加@Component 否则组件会怎样都不现实

## router 传参 注意事项

>路由传参query 和 params 显示到地址栏形式的 注意 不要超长 ，否则浏览器会报413错误 ， 传参需要按需传送

## prop 中默认值返回空对象

prop 中 default 默认值 返回对象或数组需要使用工厂函数 ，一般我们都会用箭头函数简写 

```js
  props: {
    defaultText: {
      type: Array,
      default: ()=> []	   // 工厂函数返回空数组
    },
    // 错误写法
    defaultAttrs: {
      type: Object,
      default: ()=> {}    // 但是返回空对象就不能直接=>{} 这样就代表函数的块级作用域了 会报错
    },
    // 正确写法
     defaultAttrs: {
      type: Object,
      default: ()=> ({})    // 在{}外面包一层()即可
    },    
  },
```

>

