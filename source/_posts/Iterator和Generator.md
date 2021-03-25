---
title: Iterator和Generator
date: 2021-03-25 16:27:30
tags:
	- es6
	- js
categories: js
---



Iterator和Generator

## Iterator

详细文档：[ECMAScript 6 入门-Iterator 和 for...of 循环](https://es6.ruanyifeng.com/#docs/iterator)

### Iterator（遍历器）的概念

Iterator 即遍历器对象

Generator 函数调用后可以返回一个遍历器对象 Iterator 

所有可以使用for of遍历的对象内部都实现时了Iterator 接口 比如：

通过`Arrary.prototype[Symbol.iterator]()`可以返回Iterator 

```js
{// Arrary 内部的遍历器对象
    __proto__: Array Iterator{
        next: ƒ next()			// 调用 next 方法将 指针指向下一个元素
        Symbol(Symbol.toStringTag): "Array Iterator"
        __proto__: Object
    }
}
```

当然也可直接实现一个遍历器对象

```js
var it = makeIterator(['a', 'b']);

it.next() // { value: "a", done: false }
it.next() // { value: "b", done: false }
it.next() // { value: undefined, done: true }

function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length ?
        {value: array[nextIndex++], done: false} :
        {value: undefined, done: true};
    }
  };
}
```

调用next方法， 返回`{ value: xxx, done: boolean }`,通过判断done是否为true，来判断遍历是否结束

### 调用 Iterator 接口的场合

有一些场合会默认调用 Iterator 接口（即`Symbol.iterator`方法），除了下文会介绍的`for...of`循环，还有几个别的场合。

**（1）解构赋值**

对数组和 Set 结构进行解构赋值时，会默认调用`Symbol.iterator`方法。

```javascript
let set = new Set().add('a').add('b').add('c');

let [x,y] = set;
// x='a'; y='b'

let [first, ...rest] = set;
// first='a'; rest=['b','c'];
```

**（2）扩展运算符**

扩展运算符（...）也会调用默认的 Iterator 接口。

```javascript
// 例一
var str = 'hello';
[...str] //  ['h','e','l','l','o']

// 例二
let arr = ['b', 'c'];
['a', ...arr, 'd']
// ['a', 'b', 'c', 'd']
```

上面代码的扩展运算符内部就调用 Iterator 接口。

实际上，这提供了一种简便机制，可以将任何部署了 Iterator 接口的数据结构，转为数组。也就是说，只要某个数据结构部署了 Iterator 接口，就可以对它使用扩展运算符，将其转为数组。

```javascript
let arr = [...iterable];
```

**（3）yield\***

`yield*`后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。

```javascript
let generator = function* () {
  yield 1;
  yield* [2,3,4];
  yield 5;
};

var iterator = generator();

iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: 4, done: false }
iterator.next() // { value: 5, done: false }
iterator.next() // { value: undefined, done: true }
```

**（4）其他场合**

由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口。下面是一些例子。

- for...of
- Array.from()
- Map(), Set(), WeakMap(), WeakSet()（比如`new Map([['a',1],['b',2]])`）
- Promise.all()
- Promise.race()

## Generator

详细文档：[ECMAScript 6 入门-Generator 函数的语法](https://es6.ruanyifeng.com/#docs/generator)

### 基本概念

Generator是一个状态机，封装了多个内部状态（本人的理解：是一个可以控制内部执行步骤的 函数）

Generator 函数调用后可以返回一个遍历器对象 Iterator 

### 控制内部执行步骤

yield 用来返回每一步的执行结果

Iterator.next() 用来将指针指向下一步

程序执行`yield`命令就暂停，等到Iterator.next() ，再从暂停的地方继续往后执行

```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();

hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```

