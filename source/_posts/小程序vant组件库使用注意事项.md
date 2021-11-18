---
title: 小程序vant组件库使用注意事项
date: 2021-11-04 15:29:06
tags:
	- 小程序
	- vant
categories: 小程序
---



## 在page中修改组件内部样式

 wxml  ` custom-class="van-search-custom-class"`

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
  .van-search__content{
    background-color: #fff !important;
  }
}
```

