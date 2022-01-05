---
title: VueCli常见问题汇总
date: 2021-11-12 12:07:26
tags:
	- vue
categories: Vue
---

### 去除 PWA 插件

去除 package.json 中的 PWA 依赖 从新 npm install

```json
 "devDependencies": {
 	 ...
-    "@vue/cli-plugin-pwa": "^4.4.0",
     ...
 }
```
