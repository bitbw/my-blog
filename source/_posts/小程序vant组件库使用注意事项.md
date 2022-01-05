---
title: 小程序vant组件库使用注意事项
date: 2021-11-04 15:29:06
tags:
	- 小程序
	- vant
categories: 小程序
---

## 在 page 中修改组件内部样式

wxml ` custom-class="van-search-custom-class"`

```html
<van-search
  custom-class="van-search-custom-class"
  value="{{ value }}"
  input-align="center"
  placeholder="请输入搜索关键词"
/>
```

wxss

```css
.van-search-custom-class {
  background-color: #f6f6f6 !important;
  .van-search__content {
    background-color: #fff !important;
  }
}
```

## IndexBar 索引栏

### 问题

在一个 page 中通过 if 或 hidden 显示 IndexBar 索引栏组件会导致组件显示有问题

### 解决

将组件放在单独 page 中通过 nav 跳转
