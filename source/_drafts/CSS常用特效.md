---
title: CSS常用特效
date: 2020-10-19 16:07:54
tags:
	- CSS
	- sass
	- scss
	- less

categories: CSS
---

## 卡片效果

### 悬浮效果

- 谷歌卡片

  ![image-20210119161631244](https://bitbw.top/public/img/my_gallery/image-20210119161631244.png)

```css
.block-anchor[_ngcontent-iki-c34]:hover {
    box-shadow: 0px 1px 2px 0px rgba(60, 64, 67, 0.3), 0px 2px 6px 2px rgba(60, 64, 67, 0.15);
    transform: translateY(-1px);
}
```

- Vue3官网

  ![image-20210119161200747](https://raw.githubusercontent.com/zhangbowen-github/my-gallery/main/img/image-20210119161200747.png)

```css
.sub .cover[data-v-05f0c8b5]:hover {
    box-shadow: 0 18px 32px -18px #000!important;
    transform: translateY(-3px);
}
```

