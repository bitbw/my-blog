---
title: element+sortablejs实现表格托拽
date: 2020-07-31 14:36:01
tags: 
	- elementUI 
	- vue  
	- sortablejs
categories: vue
---

最终实现效果：![el-table托拽](element-sortablejs%E5%AE%9E%E7%8E%B0%E8%A1%A8%E6%A0%BC%E6%89%98%E6%8B%BD/el-table%E6%89%98%E6%8B%BD.gif)

<!--more-->

js 部分实现

```js
import Sortable from 'sortablejs';//引入sortablejs


//1.请求数据后使用托拽方法
this.$nextTick(() => {
        this.setSort();
});
//2. 托拽方法
	// 初始化拖拽
	setSort() {
		console.log(this.$refs.rightTable);
		const el = this.$refs.rightTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0];
		let _this = this;
		this.sortable = Sortable.create(el, {
			animation: 150,  // ms, number 单位：ms，定义排序动画的时间
				//  指定父元素下可被拖拽的子元素
			draggable: '.el-table__row',
			onEnd({ newIndex, oldIndex }) {
				console.log('TabsTreeTable -> onEnd -> newIndex, oldIndex', newIndex, oldIndex);
				let rightTableData = cloneDeep(_this.rightTableData);
				const currRow = rightTableData.splice(oldIndex, 1)[0];
				rightTableData.splice(newIndex, 0, currRow);
				_this.rightTableData = rightTableData;
				_this.rightOriginData = cloneDeep(rightTableData);
			},
			ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
			setData: function(dataTransfer) {
				// to avoid Firefox bug
				// Detail see : https://github.com/RubaXa/Sortable/issues/1012
				dataTransfer.setData('Text', '');
			},
		});
	}
```

css 部分

```css
//针对固定列的table需要处理hover的样式
tr.hover-row {
	&,
	&.el-table__row--striped {
		&,
		&.current-row {
			> td {
				background-color: transparent;
			}
		}
	}
}
//托拽时的样式
.sortable-ghost {
	opacity: 0.8;
	color: #fff !important;
	background: #42b983 !important;
}
```

> 注意事项：el-table 需要指定 row-key 否则会发生不生效的现象，托拽时的样式不生效时，需要将 el-table 的 hover 样式去掉

## 两个 table 的相互托拽

![el-table相互托拽](element-sortablejs%E5%AE%9E%E7%8E%B0%E8%A1%A8%E6%A0%BC%E6%89%98%E6%8B%BD/el-table%E7%9B%B8%E4%BA%92%E6%89%98%E6%8B%BD.gif)

```js
// 初始化拖拽
	setSort() {
		console.log(this.$refs.rightTable);
		const el = this.$refs.rightTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0];
		const el2 = this.$refs.leftTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0];
		let _this = this;
		this.sortable = Sortable.create(el, {
			group: {
				name: 'shared',
				pull: data => {
					console.log('right: data', data);
				},
			},
			animation: 150, //动画效果
			//  指定父元素下可被拖拽的子元素
			draggable: '.el-table__row',
			onUpdate({ to, from, newIndex, oldIndex }) {
				const currRow = _this.rightTableData.splice(oldIndex, 1)[0];
				_this.rightTableData.splice(newIndex, 0, currRow);
				// console.log('onUpdate: onEnd -> to, from,', to, from);
				console.log('onUpdate-> onEnd -> newIndex, oldIndex', newIndex, oldIndex);
				console.log('列表单元在列表容器中的排序发生变化后的回调函数');
			},
			onRemove({ to, from, newIndex, oldIndex }) {
				const currRow = _this.rightTableData.splice(oldIndex, 1)[0];
				_this.leftTableData.splice(newIndex, 0, currRow);
				// console.log('onRemoveleft: onEnd -> to, from,', to, from);
				console.log('onRemove -> onEnd -> newIndex, oldIndex', newIndex, oldIndex);
				console.log('列表元素移到另一个列表容器的回调函数');
			},
			ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
			setData: function(dataTransfer) {
				// to avoid Firefox bug
				// Detail see : https://github.com/RubaXa/Sortable/issues/1012
				dataTransfer.setData('Text', '');
			},
		});
		this.sortable = Sortable.create(el2, {
			group: {
				name: 'shared',
				pull: data => {
					console.log('left: data', data);
				},
			},
			animation: 150, //动画效果
			//  指定父元素下可被拖拽的子元素
			draggable: '.el-table__row',
			onRemove({ to, from, newIndex, oldIndex }) {
				const currRow = _this.leftTableData.splice(oldIndex, 1)[0];
				_this.rightTableData.splice(newIndex, 0, currRow);
				// console.log('onRemoveleft: onEnd -> to, from,', to, from);
				// console.log('onRemove -> onEnd -> newIndex, oldIndex', newIndex, oldIndex);
				console.log('列表元素移到另一个列表容器的回调函数');
			},
			onChoose({ to, from, newIndex, oldIndex }) {
				// console.log('onChoose: onEnd -> to, from,', to, from);
				// console.log('onChoose-> onEnd -> newIndex, oldIndex', newIndex, oldIndex);
				console.log('function 列表单元被选中的回调函数');
			},
			onStart({ to, from, newIndex, oldIndex }) {
				// console.log('onStart: onEnd -> to, from,', to, from);
				// console.log('onStart -> onEnd -> newIndex, oldIndex', newIndex, oldIndex);
				console.log('function 列表单元拖动开始的回调函数');
			},

			onAdd({ to, from, newIndex, oldIndex }) {
				// console.log('onAdd: onEnd -> to, from,', to, from);
				// console.log('onAddve -> onEnd -> newIndex, oldIndex', newIndex, oldIndex);
				console.log('列表单元添加到本列表容器的回调函数');
			},
			onUpdate({ to, from, newIndex, oldIndex }) {
				const currRow = _this.leftTableData.splice(oldIndex, 1)[0];
				_this.leftTableData.splice(newIndex, 0, currRow);
				// console.log('onUpdate: onEnd -> to, from,', to, from);
				// console.log('onUpdate-> onEnd -> newIndex, oldIndex', newIndex, oldIndex);
				console.log('列表单元在列表容器中的排序发生变化后的回调函数');
			},
			onFilter({ to, from, newIndex, oldIndex }) {
				// console.log('onFilter: onEnd -> to, from,', to, from);
				// console.log('onFilter-> onEnd -> newIndex, oldIndex', newIndex, oldIndex);
				console.log(' 试图选中一个被filter过滤的列表单元的回调函数');
			},
			onMove({ to, from, newIndex, oldIndex }) {
				// console.log('onMove: onEnd -> to, from,', to, from);
				// console.log('onMovee -> onEnd -> newIndex, oldIndex', newIndex, oldIndex);
				console.log(' 当移动列表单元在一个列表容器中或者多个列表容器中的回调函数');
			},
			onClone({ to, from, newIndex, oldIndex }) {
				// console.log('onClone: onEnd -> to, from,', to, from);
				// console.log('onClone -> onEnd -> newIndex, oldIndex', newIndex, oldIndex);
				console.log(' 当创建一个列表单元副本的时候的回调函数');
			},
			ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
			setData: function(dataTransfer) {
				// to avoid Firefox bug
				// Detail see : https://github.com/RubaXa/Sortable/issues/1012
				dataTransfer.setData('Text', '');
			},
		});
	}
```
