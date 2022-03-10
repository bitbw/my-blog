---
title: Vue常见问题汇总
tags:
  - vue
categories: Vue
date: 2020-09-16 11:34:54
cnblogs:
  postid: "15393020"
hash: 8988465956283ec59721365c374b6b39fdb125ca1a4c9d518c9f86f1111c6050
---

## Vue2

> 这篇文章是我在工作中使用 vue 遇到的问题做的简单汇总，希望能对看到这篇文章的你有所帮助

### 对象数组 响应式所引发的问题

#### 对于对象

[官方文档](https://cn.vuejs.org/v2/guide/reactivity.html#%E5%AF%B9%E4%BA%8E%E5%AF%B9%E8%B1%A1)

 Vue 无法检测 property 的添加或移除。由于 Vue 会在初始化实例时对 property 执行 getter/setter （defineProperty）转化，所以 property 必须在 data 对象上存在才能让 Vue 将它转换为响应式的

##### 解决

```js
vm.$set(obj,"key",value)
// 或者
vm.obj = {...vm.obj,key:value}
// 或者
vm.obj = Object.assgin({},vm.obj,{key:value})
```

#### 对于数组

Vue 将被侦听的数组的变更方法进行了包裹，所以它们也将会触发视图更新。这些被包裹过的方法包括：

push()
pop()
shift()
unshift()
splice()
sort()
reverse()

Vue 不能检测以下数组的变动：

当你利用索引直接设置一个数组项时，例如：vm.items[indexOfItem] = newValue
当你修改数组的长度时，例如：vm.items.length = newLength

##### 解决

修改数组某一项

```js
vm.$set(vm.items, indexOfItem, newValue)
// 或者
vm.items.splice(indexOfItem, 1, newValue)

```

修改数组长度

```js
vm.items.splice(newLength)
// 或者
vm.items = vm.items.slice(0,newLength)
```

#### vue 中给数组中的对象,添加新属性属性

不能使用直接遍历设置的方法

```js
this.items.forEach((item) => {
  item.key = value;
});
```

##### 解决

```js
this.items.forEach((item, index) => {
  this.$set(this.items, index, { ...item, ...{ key:value } });
  //或者
  this.items.splice(index, 1, { ...item, ...{ key:value } });
});

// 或者
this.items = this.items.map( item =>{
  return { ...item, ...{ key:value } }
})
```

> tip 修改数组中的属性 直接修改即可 数组中的对象同外层对象的响应方式

### v-if 使用时注意 vue 会将一样的元素复用 需要加 key 解决

> 在下面的案例中 即使渲染出返回按钮 因为下面的每个 else 元素都一样 但是返回依然不现实 因为复用了下面的元素样式 display: none; 需要在不需要复用的元素上加 key 解决

[vue 原文链接](<[https://cn.vuejs.org/v2/guide/conditional.html#%E7%94%A8-key-%E7%AE%A1%E7%90%86%E5%8F%AF%E5%A4%8D%E7%94%A8%E7%9A%84%E5%85%83%E7%B4%A0](https://cn.vuejs.org/v2/guide/conditional.html#用-key-管理可复用的元素)>)

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

### vue 样式：scoped 使用

#### 深度作用选择器

如果你希望 `scoped` 样式中的一个选择器能够作用得“更深”，例如影响子组件，你可以使用 `>>>` 操作符：

```html
<style scoped>
  .a >>> .b {
    /* ... */
  }
</style>
```

上述代码将会编译成：

```css
.a[data-v-f3f3eg9] .b {
  /* ... */
}
```

#### 注意点

> 注意点：如果子组件dom不在父组件内部 例如：dialog组件, 通过深度作用选择器也不会生效
> 这时需要通过 全局样式即去除 scoped  + 子组件calss  + 选择器 来实现

有些像 Sass 之类的预处理器无法正确解析 `>>>`。这种情况下你可以使用 `/deep/` 或 `::v-deep` 操作符取而代之——两者都是 `>>>` 的别名，同样可以正常工作。

参考： [vue-loader 官方文档-深度作用选择器](<[https://vue-loader.vuejs.org/zh/guide/scoped-css.html#%E6%B7%B1%E5%BA%A6%E4%BD%9C%E7%94%A8%E9%80%89%E6%8B%A9%E5%99%A8](https://vue-loader.vuejs.org/zh/guide/scoped-css.html#深度作用选择器)>)

### Vue 中的 v-bind 使用问题

> 在 vue 中使用 v-bind 绑定对象时 需要注意 ：v-bind 绑定值不会覆盖之前的属性

```html
<input
  type="text"
  class="test"
  :disabled="false"
  v-bind="{ disabled: true, class: 'test3' }"
/>
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

#### 模板 v-bind 绑定值的变量名为 class 报 'v-bind' directives require an attribute value.eslint

> 在模板中绑定的名称不要用 class 作为命名 否则 eslint 会报'v-bind' directives require an attribute value.eslint

$attrs 可以获取任何绑定在组件上的属性 但（ `porp`中的属性和 `class` 和 `style` 除外）

### vue-property-decorator 注意事项（ts 项目中）

介绍链接[https://segmentfault.com/a/1190000019906321]

#### 1.新建组件必须加@Component 否则组件会怎样都不现实

### router 传参 注意事项

> 路由传参 query 和 params 显示到地址栏形式的 注意 不要超长 ，否则浏览器会报 413 错误 ， 传参需要按需传送

### prop 中默认值返回空对象

prop 中 default 默认值 返回对象或数组需要使用工厂函数 ，一般我们都会用箭头函数简写

```js
  props: {
    defaultText: {
      type: Array,
      default: ()=> []    // 工厂函数返回空数组
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
