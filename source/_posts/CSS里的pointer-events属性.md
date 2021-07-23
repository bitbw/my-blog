---
title: CSS里的pointer-events属性
date: 2020-12-30 09:57:22
tags: 
	- CSS
	- Vuetify 
categories: CSS
---



## 因为pointer-events出现的问题

在Vuetify项目中，因为在input中使用了tooltip ，意愿是文字溢出隐藏显示... , 

但input在disabled的状态内部文字的tooptip居然不显示了

在控制台发现了这个样式

```css
.v-input--is-disabled:not(.v-input--is-readonly) {
    pointer-events: none;
}
```

 pointer-events: none; 这个很不常用， 下面看下这个属性具体是干什么的   [原文](https://www.webhek.com/post/pointer-events.html)



## pointer-events

现代浏览器里CSS的职责范围和JavaScript的越来越模糊分不清。比如CSS里`-webkit-touch-callout`属性在iOS里能禁止当用户点击时弹出气泡框。而本文要说的`pointer-events`的风格更像JavaScript，它能够：

- 阻止用户的点击动作产生任何效果
- 阻止缺省鼠标指针的显示
- 阻止CSS里的`hover`和`active`状态的变化触发事件
- 阻止JavaScript点击动作触发的事件

一个CSS属性能做所有的这么多事情！



### The CSS

这个`pointer-events`属性有很多可以使用的属性值，但大部分都是针对SVG的：`auto`, `none`, `visiblePainted*`, `visibleFill*`, `visibleStroke*`, `visible*`, `painted*`, `fill*`, `stroke*`, `all*`, 以及 `inherit`。其中`none`值能阻止点击、状态变化和鼠标指针变化：

```css
.disabled { pointer-events: none; }
```

一些需要注意的关于`pointer-events`的事项：

- 子元素可以声明`pointer-events`来解禁父元素的阻止鼠标事件限制。
- 如果你对一个元素设置了click事件监听器，然后你移除了`pointer-events`样式声明，或把它的值改变为`auto`，监听器会重新生效。基本上，监听器会遵守`pointer-events`的设定。



## 处理问题

为了只让tooltip显示，而input的本身的禁用还在，可以直接在tooltip中的显示文字上添加 pointer-events: auto; 即可	

```scss
// 内容部分
.tooltip-default-text {
  pointer-events: auto;
}
```

