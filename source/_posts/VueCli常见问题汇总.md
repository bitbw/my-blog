---
title: VueCli常见问题汇总
date: 2021-11-12 12:07:26
tags:
	- vue
categories: Vue
---



### 去除PWA插件

去除package.json中的PWA依赖 从新npm install

```json
 "devDependencies": {
 	 ...
-    "@vue/cli-plugin-pwa": "^4.4.0",
     ...
 }
```



