---
title: elementUI的使用注意事项
tags:
  - elementUI
  - Vue
categories: Vue
date: 2020-09-16 11:17:23
cnblogs:
  postid: "15392419"
hash: c5513eb6c9b40f7ddf47f62fc1663d6ac3df15680f7ce903eb638f96af1d085c
---


>这篇文章是我在工作中使用elementUi遇到的问题做的简单汇总，希望能对看到这篇文章的你有所帮助

## el-table

### 如何修改el-table展开树的三角图标

只需要给定before的content即可

```css
 // 隐藏展开箭头
  .el-table__expand-icon {
    // 修改展开箭头的样式
    .el-icon-arrow-right::before {
      content: "\e791";
      font-size: 18px;
    }
  }
}
```

参考网址：<https://blog.csdn.net/m0_37378152/article/details/102628860>

### elementUI的table 的每一项的min-width不要使用百分比

> elementUI的table 的每一项的min-width不要使用百分比 ,不然会出现这种情况

![image-20200227163411930](https://gitee.com/bitbw/my-gallery/raw/master/img/image-20200227163411930.png)

> 固定的序号和checkbox 会掉下来

### 修改el-table表头高度的坑

> el-table 固定列的table，在dom上是有两个thead的所以要修改表头高度就一定要两个都修改 ，不然会导致固定列表头高度与正常表头高度不一致现象 ，在薪酬项目的代码示例

```scss
 //处理表头高度
    .el-table__header-wrapper th .cell .edit-table-header > p > span,
    .el-table__fixed-header-wrapper th .cell .edit-table-header > p > span {
        padding: 5px 0;
    }
```

### 在dialog中使用table的问题

> 在dialog中使用table发现无论怎样设置表头都会出现表头高度不正常现象 和数据不正常现象
>
> 这时可以使用dialog的destroy-on-close属性 （关闭时销毁 Dialog 中的元素）

### el-table自定义动态表头：更新数据之后表头不更新

在开发中 表头但是多级表头并且是动态遍历的 ，遍历的数据发生改变表头数据却没有更新

#### 问题出现原因：

```html
 <el-table-column v-for="item in columnData" :key="item.id">
     <!--一级表头文字-->
     <template slot="header" slot-scope="scope">
         <div class="table-head">{{item.name }}</div>
     </template>
     <!--.........战略性省略业务代码.........-->
 </el-table-column>
```

排查了很久，后发现：在自定义表头的时候，由于是用的v-for循环生成的，因此会给每个循环体一个固定的key，导致数据频繁更新时，因为这个key没有变，所以el-table觉得表头数据是没有变化的，因此就只更新了整体表格数据、key值有变化的列的表头。

```html
<!--表头的v-for中的key 使用 id + index 组合的形式使key变成动态的-->
<el-table-column v-for="(item,index) in tableData" :key="item.id + index">
  .....
</el-table-column>
```

## el-form

### elementUI的form表单数据resetFields重置方法注意事项

this.$refs.form["resetFields"]();

form无法重置表单项的原因有以下四点：

1. el-form-item的prop属性缺失或属性值 不等于 字段名称
2. 表单项本身就有默认值
3. 表单数据绑定时未使用$nextTick函数（resetFields 重置到挂载前的数据）
4. 未显示的表单项无法重置

### form 的坑  element ui form表单只有一个输入框获取焦点的时候回车会触发表单的submit事件，导致页面刷新

**解决方法：**

> 当一个 form 元素中只有一个输入框时，在该输入框中按下回车应提交该表单。如果希望阻止这一默认行为，可以在 标签上添加 @submit.native.prevent。

## tree

### elementUI的tree的loadData()从新加载节点方法使用

```js
// 更新节点数据
this.currentNode.loaded = false;  //需要配合node.loaded = false 使用
this.currentNode.loadData();
```

### elementUI tree未展开的子节点数据改变却不更新的bug

不采用懒加载方式直接改变tree的data数据发现为展开的子节点数据改变，展开后展示的数据却未变，

查看文档发现有个属性`render-after-expand`是否在第一次展开某个树节点后才渲染其子节点,

设置为`false`就可以解决了

### element 的tree的懒加载使用方法

#### load属性

懒加载子树数据的方法，需要配合lazy 属性为true 时生效，点开当前节点时就会触发；  类型：function(node, resolve)

**node：**

- id: 26
- text: null
- checked: false
- indeterminate: false
- data: Object  当前绑定的data
- expanded: true
- parent: Node  父节点
- visible: true
- isCurrent: false
- store: TreeStore
- level: 4      当前在第几级
- loaded: true
- childNodes: Array(5) 子节点
- loading: false
- isLeaf: false
- label: "中非莱基" 绑定显示的文字
- key: undefined
- disabled: ""
- nextSibling: Node
- previousSibling: Node

**resolve:**接收子节点的data 自动绑定到树上

#### props属性

定义data中的绑定项的key

| 参数     | 说明                                                     | 类型                          | 可选值 | 默认值 |
| :