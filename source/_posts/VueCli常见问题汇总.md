---
title: VueCli常见问题汇总
date: 2021-11-12 12:07:26
tags:
  - vue
categories: Vue
hash: a37ce7e5d110d773733eee5a22d4cbcfd25069c6f9b121061d3b4c37ab7b5daf
cnblogs:
  postid: "15766342"
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

## ESlint

### ESlint 开启保存校验

vue.config.js

```js

module.exports = {
  ...
  lintOnSave: true,
  ...
}
```
### 关闭部分校验规则

.eslintrc.js

```js
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint",
  },
  // 关闭规则
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-unused-vars": process.env.NODE_ENV === "production" ? "warn" : "off",
    // vue相关加 vue/
    "vue/no-unused-components":
      process.env.NODE_ENV === "production" ? "warn" : "off",
  },
};


```
