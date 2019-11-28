# Object.keys方法之详解

**一、语法**

`Object.keys(obj)`

参数：要返回其枚举自身属性的对象

返回值：一个表示给定对象的所有可枚举属性的字符串数组

**二、处理对象，返回可枚举的属性数组**

```js
let person = {name:"张三",age:25,address:"深圳",getName:function(){}}

Object.keys(person) // ["name", "age", "address","getName"]

```



![img](https://images2018.cnblogs.com/blog/1429393/201808/1429393-20180817143437674-441573117.png)

**三、处理数组，返回索引值数组**

```js
let arr = [1,2,3,4,5,6]

Object.keys(arr) // ["0", "1", "2", "3", "4", "5"]

```



![img](https://images2018.cnblogs.com/blog/1429393/201808/1429393-20180817143653313-839437368.png)

**四、处理字符串，返回索引值数组**

```js
let str = "saasd字符串"
Object.keys(str) // ["0", "1", "2", "3", "4", "5", "6", "7"]
```





![img](https://images2018.cnblogs.com/blog/1429393/201808/1429393-20180817143909770-1011253474.png)

**五、常用技巧**

```js
 let person = {name:"张三",age:25,address:"深圳",getName:function(){}}
 
 Object.keys(person).map((key)=>{

　　person[key] // 获取到属性对应的值，做一些处理

}) 

```



**六、`Object.values()`和`Object.keys()`是相反的操作，把一个对象的值转换为数组