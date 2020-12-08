---
title: 	parseInt+toString实现各个进制的转换
date: 2020-12-08 12:46:20
tags: js
categories: js
---


> parseInt:将任意进制的数字转化为十进制
>
> toString:将十进制的数字转化为任意进制

```js
parseInt(num,8);   //八进制转十进制
parseInt(num,16);   //十六进制转十进制
parseInt(num).toString(8)  //十进制转八进制
parseInt(num).toString(16)   //十进制转十六进制
parseInt(num,2).toString(8)   //二进制转八进制
parseInt(num,2).toString(16)  //二进制转十六进制
parseInt(num,8).toString(2)   //八进制转二进制
parseInt(num,8).toString(16)  //八进制转十六进制
parseInt(num,16).toString(2)  //十六进制转二进制
parseInt(num,16).toString(8)  //十六进制转八进制
```

>- 以 0X、0x 开头的表示为十六进制。 0xf //15
>- 以 0、0O、0o 开头的表示为八进制。0o12 //10
>- 以 0B、0b 开头的表示为二进制格式。 0b11//3

以上在js中可直接使用，可自动转化为对应的10进制