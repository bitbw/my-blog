---
title: RegExp对象和string.replac方法
date: 2018-12-04 17:19:26
tags: js
categories: js
cnblogs:
  postid: "15392988"
hash: 3230e89376b358309efebce8facd04add0fd643194c9d1845eaca967c950267b
---

## RegExp 对象

RegExp 对象表示正则表达式，它是对字符串执行模式匹配的强大工具。

### 创建 RegExp 对象的语法

```js
new RegExp(pattern, attributes);
```

### 参数

参数 _pattern_ 是一个字符串，指定了正则表达式的模式或其他正则表达式。

参数 _attributes_ 是一个可选的字符串，包含属性 "g"、"i" 和 "m"，分别用于指定全局匹配、区分大小写的匹配和多行匹配。ECMAScript 标准化之前，不支持 m 属性。如果 _pattern_ 是正则表达式，而不是字符串，则必须省略该参数。

### 示例

```js
new RegExp("hello", "ig"); //全局匹配不区分大小写的hello字符串
```

### 返回值

一个新的 RegExp 对象，具有指定的模式和标志。如果参数 _pattern_ 是正则表达式而不是字符串，那么 RegExp() 构造函数将用与指定的 RegExp 相同的模式和标志创建一个新的 RegExp 对象。

如果不用 new 运算符，而将 RegExp() 作为函数调用，那么它的行为与用 new 运算符调用时一样，只是当 _pattern_ 是正则表达式时，它只返回 _pattern_，而不再创建一个新的 RegExp 对象。

### 抛出

SyntaxError - 如果 _pattern_ 不是合法的正则表达式，或 _attributes_ 含有 "g"、"i" 和 "m" 之外的字符，抛出该异常。

TypeError - 如果 _pattern_ 是 RegExp 对象，但没有省略 _attributes_ 参数，抛出该异常。

### 支持正则表达式的 String 对象的方法

|  [search](https://www.w3school.com.cn/jsref/jsref_search.asp)  |   检索与正则表达式相匹配的值。   |
| :