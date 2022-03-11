---
title: TypeScript常见问题汇总
date: 2022-03-11 09:32:59
tags:
    - TypeScript
categories: TypeScript
---


## 理解 `type Record<K extends keyof any, T> = { [P in K]: T; }`

```ts
// type KEY = keyof any //即 string | number | symbol
type Record<K extends keyof any, T> = {
    // [P in K]的意思是对象的key可以取 string，number，symbol.
    [P in K]: T;
};
// 规定对象类型 key 为 string， value 为 boolean
type Classes = Record<string, boolean>
```
