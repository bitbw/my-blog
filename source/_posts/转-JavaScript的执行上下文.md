---
title: 'JavaScript的执行上下文，理解JavaScript的作用域链，JavaScript中的this'
date: 2021-01-15 10:00:59
tags:
	-js
categories: js
---




 > 学习了一篇 js 偏底层基础 的文章：JavaScript 的执行上下文 Execution context   
 >
 > 我将三篇文章放在一起 最后加了一些自己的总结 和 函数表达式的理解
 >
 > 原文地址：
 >
 > [JavaScript的执行上下文](https://www.cnblogs.com/wilber2013/p/4909430.html#_nav_0)
 >
 > [理解JavaScript的作用域链](https://www.cnblogs.com/wilber2013/p/4909459.html)
 >
 > [JavaScript中的this](https://www.cnblogs.com/wilber2013/p/4909505.html#_nav_3)



# JavaScript的执行上下文

在JavaScript的运行过程中，经常会遇到一些"奇怪"的行为，不理解为什么JavaScript会这么工作。

这时候可能就需要了解一下JavaScript执行过程中的相关内容了。

## 执行上下文

在JavaScript中有三种代码运行环境：

- Global Code
  - JavaScript代码开始运行的默认环境
- Function Code
  - 代码进入一个JavaScript函数
- Eval Code
  - 使用eval()执行代码

为了表示不同的运行环境，JavaScript中有一个**执行上下文（Execution context，EC）**的概念。也就是说，当JavaScript代码执行的时候，会进入不同的执行上下文，这些执行上下文就构成了一个**执行上下文栈（Execution context stack，ECS）**。

例如对如下面的JavaScript代码：


```
var a = "global var";

function foo(){
    console.log(a);
}

function outerFunc(){
    var b = "var in outerFunc";
    console.log(b);
    
    function innerFunc(){
        var c = "var in innerFunc";
        console.log(c);
        foo();
    }
    
    innerFunc();
}


outerFunc()
```


代码首先进入Global Execution Context，然后依次进入outerFunc，innerFunc和foo的执行上下文，执行上下文栈就可以表示为：

![img](https://raw.githubusercontent.com/zhangbowen-github/my-gallery/main/img/593627-20151025201151427-127726802.png)

当JavaScript代码执行的时候，第一个进入的总是默认的Global Execution Context，所以说它总是在ECS的最底部。

对于每个Execution Context都有三个重要的属性，变量对象（Variable object，VO），作用域链（Scope chain）和this。这三个属性跟代码运行的行为有很重要的关系，下面会一一介绍。

当然，除了这三个属性之外，根据实现的需要，Execution Context还可以有一些附加属性。

![img](https://raw.githubusercontent.com/zhangbowen-github/my-gallery/main/img/593627-20151025201152849-1821016303.png)

## VO和AO

从上面看到，在Execution Context中，会保存变量对象（Variable object，VO），下面就看看变量对象是什么。

### 变量对象（Variable object）

变量对象是与执行上下文相关的数据作用域。它是一个与上下文相关的特殊对象，其中存储了在上下文中定义的变量和函数声明。也就是说，一般VO中会包含以下信息：

- 变量 (var, Variable Declaration);
- 函数声明 (Function Declaration, FD);
- 函数的形参

当JavaScript代码运行中，如果试图寻找一个变量的时候，就会首先查找VO。对于前面例子中的代码，Global Execution Context中的VO就可以表示如下：

![img](https://raw.githubusercontent.com/zhangbowen-github/my-gallery/main/img/593627-20151025201154239-918576092.png)

**注意，**假如上面的例子代码中有下面两个语句，Global VO仍将不变。

```
(function bar(){}) // function expression, FE
baz = "property of global object"
```

也就是说，对于VO，是有下面两种特殊情况的：

- 函数表达式（与函数声明相对）不包含在VO之中
- 没有使用var声明的变量（这种变量是，"全局"的声明方式，只是给Global添加了一个属性，并不在VO中）

### 活动对象（Activation object）

只有全局上下文的变量对象允许通过VO的属性名称间接访问；在函数执行上下文中，VO是不能直接访问的，此时由激活对象(Activation Object,缩写为AO)扮演VO的角色。激活对象 是在进入函数上下文时刻被创建的，它通过函数的arguments属性初始化。

Arguments Objects 是函数上下文里的激活对象AO中的内部对象，它包括下列属性：

1. callee：指向当前函数的引用
2. length： 真正传递的参数的个数
3. properties-indexes：就是函数的参数值(按参数列表从左到右排列)

对于VO和AO的关系可以理解为，VO在不同的Execution Context中会有不同的表现：当在Global Execution Context中，可以直接使用VO；但是，在函数Execution Context中，AO就会被创建。

![img](https://images2015.cnblogs.com/blog/593627/201510/593627-20151025201155177-724394618.png)

当上面的例子开始执行outerFunc的时候，就会有一个outerFunc的AO被创建：

![img](https://raw.githubusercontent.com/zhangbowen-github/my-gallery/main/img/593627-20151025201156317-195051519.png)

通过上面的介绍，我们现在了解了VO和AO是什么，以及他们之间的关系了。下面就需要看看JavaScript解释器是怎么执行一段代码，以及设置VO和AO了。

## 细看Execution Context

当一段JavaScript代码执行的时候，JavaScript解释器会创建Execution Context，其实这里会有两个阶段：

- 创建阶段（当函数被调用，但是开始执行函数内部代码之前）
  - 创建Scope chain
  - 创建VO/AO（variables, functions and arguments）
  - 设置this的值
- 激活/代码执行阶段
  - 设置变量的值、函数的引用，然后解释/执行代码

这里想要详细介绍一下"创建VO/AO"中的一些细节，因为这些内容将直接影响代码运行的行为。

对于"创建VO/AO"这一步，JavaScript解释器主要做了下面的事情：

- 根据函数的参数，创建并初始化arguments object
- 扫描函数内部代码，查找函数声明（Function declaration）
  - 对于所有找到的函数声明，将函数名和函数引用存入VO/AO中
  - **如果VO/AO中已经有同名的函数，那么就进行覆盖**
- 扫描函数内部代码，查找变量声明（Variable declaration）
  - 对于所有找到的变量声明，将变量名存入VO/AO中，并初始化为"undefined"
  - 如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性

看下面的例子：


```
function foo(i) {
    var a = 'hello';
    var b = function privateB() {

    };
    function c() {

    }
}

foo(22);
```


对于上面的代码，在"创建阶段"，可以得到下面的Execution Context object：


```
fooExecutionContext = {
    scopeChain: { ... },
    variableObject: {
        arguments: {
            0: 22,
            length: 1
        },
        i: 22,
        c: pointer to function c()
        a: undefined,
        b: undefined
    },
    this: { ... }
}
```


在"激活/代码执行阶段"，Execution Context object就被更新为：


```
fooExecutionContext = {
    scopeChain: { ... },
    variableObject: {
        arguments: {
            0: 22,
            length: 1
        },
        i: 22,
        c: pointer to function c()
        a: 'hello',
        b: pointer to function privateB()
    },
    this: { ... }
}
```


## 例子分析

前面介绍了Execution Context，VO/AO等这么多的理论知识，当然是为了方便我们去分析代码中的一些行为。这里，就通过几个简单的例子，结合上面的概念来分析结果。

### Example 1

首先看第一个例子：


```
(function(){
    console.log(bar);
    console.log(baz);
    
    var bar = 20;
    
    function baz(){
        console.log("baz");
    }
    
})()
```


在Chrome中运行代码运行后将输出：

![img](https://images2015.cnblogs.com/blog/593627/201510/593627-20151025201157161-1227329780.png)

代码解释：匿名函数会首先进入"创建结果"，JavaScript解释器会创建一个"Function Execution Context"，然后创建Scope chain，VO/AO和this。根据前面的介绍，解释器会扫描函数和变量声明，如下的AO会被创建：

![img](https://raw.githubusercontent.com/zhangbowen-github/my-gallery/main/img/593627-20151025201158208-1634029739.png)

所以，对于bar，我们会得到"undefined"这个输出，表现的行为就是，我们在声明一个变量之前就访问了这个变量。这个就是JavaScript中"Hoisting"。

### Example 2

接着上面的例子，进行一些修改：


```
(function(){
    console.log(bar);
    console.log(baz);
    
    bar = 20;
    console.log(window.bar);
    console.log(bar);
    
    function baz(){
        console.log("baz");
    }
    
})()
```


运行这段代码会得到"bar is not defined(…)"错误。当代码执行到"console.log(bar);"的时候，会去AO中查找"bar"。但是，根据前面的解释，函数中的"bar"并没有通过var关键字声明，所有不会被存放在AO中，也就有了这个错误。

注释掉"console.log(bar);"，再次运行代码，可以得到下面结果。"bar"在"激活/代码执行阶段"被创建。

![img](https://images2015.cnblogs.com/blog/593627/201510/593627-20151025201158911-154792588.png)

### Example 3

现在来看最后一个例子：


```
(function(){
    console.log(foo);
    console.log(bar);
    console.log(baz);
    
    var foo = function(){};
    
    function bar(){
        console.log("bar");
    }
    
    var bar = 20;
    console.log(bar);
    
    function baz(){
        console.log("baz");
    }
    
})()
```


代码的运行结果为：

![img](%E8%BD%AC-JavaScript%E7%9A%84%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87/593627-20151025201159786-722939845.png)

代码中，最"奇怪"的地方应该就是"bar"的输出了，第一次是一个函数，第二次是"20"。

其实也很好解释，回到前面对"创建VO/AO"的介绍，在创建VO/AO过程中，解释器会先扫描函数声明，然后"foo: <function>"就被保存在了AO中；但解释器扫描变量声明的时候，虽然发现"var bar = 20;"，但是因为"foo"在AO中已经存在，所以就没有任何操作了。

但是，当代码执行到第二句"console.log(bar);"的时候，"激活/代码执行阶段"已经把AO中的"bar"重新设置了。

> 下面是自己理解的 函数内部上下文执行流程图

![JavaScript的执行上下文（函数内部的执行流程Execution Context）](https://raw.githubusercontent.com/zhangbowen-github/my-gallery/main/img/JavaScript的执行上下文（函数内部的执行流程Execution Context）.png)

## 总结

本文介绍了JavaScript中的执行上下文（Execution Context），以及VO/AO等概念，最后通过几个例子展示了这几个概念对我们了解JavaScript代码运行的重要性。

通过对VO/AO在"创建阶段"的具体细节，如何扫描函数声明和变量声明，就可以对JavaScript中的"Hoisting"有清晰的认识。所以说，了解JavaScript解释器的行为，以及相关的概念，对理解JavaScript代码的行为是很有帮助的。

后面会对Execution Context中的Scope chain和this进行介绍。



# 理解JavaScript的作用域链

上一篇文章中介绍了Execution Context中的三个重要部分：VO/AO，scope chain和this，并详细的介绍了VO/AO在JavaScript代码执行中的表现。

本文就看看Execution Context中的scope chain。

## 作用域

开始介绍作用域链之前，先看看JavaScript中的作用域（scope）。在很多语言中（C++，C#，Java），作用域都是通过代码块（由{}包起来的代码）来决定的，**但是，在JavaScript作用域是跟函数相关的，也可以说成是function-based。**

例如，当for循环这个代码块结束后，依然可以访问变量"i"。

```
for(var i = 0; i < 3; i++){
    console.log(i);
}

console.log(i); //3
```

对于作用域，又可以分为全局作用域（Global scope）和局部作用域（Local scpoe）。

**全局作用域**中的对象可以在代码的任何地方访问，一般来说，下面情况的对象会在全局作用域中：

- 最外层函数和在最外层函数外面定义的变量
- 没有通过关键字"var"声明的变量
- 浏览器中，window对象的属性

**局部作用域**又被称为函数作用域（Function scope），所有的变量和函数只能在作用域内部使用。


```
var foo = 1;
window.bar = 2;

function baz(){
    a = 3;
    var b = 4;
}
// Global scope: foo, bar, baz, a 
// Local scope: b
```


## 作用域链

通过前面一篇文章了解到，每一个Execution Context中都有一个VO，用来存放变量，函数和参数等信息。

在JavaScript代码运行中，所有用到的变量都需要去当前AO/VO中查找，当找不到的时候，就会继续查找上层Execution Context中的AO/VO。这样一级级向上查找的过程，就是所有Execution Context中的AO/VO组成了一个作用域链。

所以说，**作用域链**与一个执行上下文相关，是内部上下文所有变量对象（包括父变量对象）的列表，用于变量查询。

```
Scope = VO/AO + All Parent VO/AOs
```

看一个例子：


```
var x = 10;

function foo() {
    var y = 20;
    
    function bar() {
        var z = 30;
       
        console.log(x + y + z);
    };
    
    bar()
};

foo();
```


上面代码的输出结果为"60"，函数bar可以直接访问"z"，然后通过作用域链访问上层的"x"和"y"。

![img](https://raw.githubusercontent.com/zhangbowen-github/my-gallery/main/img/593627-20151025202341552-94941711.png)

- 绿色箭头指向VO/AO
- 蓝色箭头指向scope chain（VO/AO + All Parent VO/AOs）

再看一个比较典型的例子：


```
var data = [];
for(var i = 0 ; i < 3; i++){
    data[i]=function() {
        console.log(i);
    }
}

data[0]();// 3
data[1]();// 3
data[2]();// 3
```


第一感觉（错觉）这段代码会输出"0，1，2"。但是根据前面的介绍，变量"i"是存放在"Global VO"中的变量，循环结束后"i"的值就被设置为3，所以代码最后的三次函数调用访问的是相同的"Global VO"中已经被更新的"i"。

## 结合作用域链看闭包

在JavaScript中，闭包跟作用域链有紧密的关系。相信大家对下面的闭包例子一定非常熟悉，代码中通过闭包实现了一个简单的计数器。


```
function counter() {
    var x = 0;
    
    return {
        increase: function increase() { return ++x; },
        decrease: function decrease() { return --x; }
    };
}

var ctor = counter();

console.log(ctor.increase());
console.log(ctor.decrease());
```


下面我们就通过Execution Context和scope chain来看看在上面闭包代码执行中到底做了哪些事情。

\1. 当代码进入Global Context后，会创建Global VO

![img](https://raw.githubusercontent.com/zhangbowen-github/my-gallery/main/img/593627-20151025202343192-1736899039.png)

- 绿色箭头指向VO/AO
- 蓝色箭头指向scope chain（VO/AO + All Parent VO/AOs）

 

\2. 当代码执行到"var cter = counter();"语句的时候，进入counter Execution Context；根据上一篇文章的介绍，这里会创建counter AO，并设置counter Execution Context的scope chain

![img](https://raw.githubusercontent.com/zhangbowen-github/my-gallery/main/img/593627-20151025202345224-1059314508.png)

 

\3. 当counter函数执行的最后，并退出的时候，Global VO中的ctor就会被设置；这里需要注意的是，虽然counter Execution Context退出了执行上下文栈，但是因为ctor中的成员仍然引用counter AO（因为counter AO是increase和decrease函数的parent scope），所以counter AO依然在Scope中。

![img](https://raw.githubusercontent.com/zhangbowen-github/my-gallery/main/img/593627-20151025202347208-254025968.png)

 

\4. 当执行"ctor.increase()"代码的时候，代码将进入ctor.increase Execution Context，并为该执行上下文创建VO/AO，scope chain和设置this；这时，ctor.increase AO将指向counter AO。

![img](https://raw.githubusercontent.com/zhangbowen-github/my-gallery/main/img/593627-20151025202349224-1554337822.png)

- 绿色箭头指向VO/AO
- 蓝色箭头指向scope chain（VO/AO + All Parent VO/AOs）
- 红色箭头指向this
- 黑色箭头指向parent VO/AO

 

相信看到这些，一定会对JavaScript闭包有了比较清晰的认识，也了解为什么counter Execution Context退出了执行上下文栈，但是counter AO没有销毁，可以继续访问。

## 二维作用域链查找

通过上面了解到，作用域链（scope chain）的主要作用就是用来进行变量查找。但是，在JavaScript中还有原型链（prototype chain）的概念。

由于作用域链和原型链的相互作用，这样就形成了一个二维的查找。

对于这个二维查找可以总结为：**当代码需要查找一个属性（property）或者描述符（identifier）的时候，首先会通过作用域链（scope chain）来查找相关的对象；一旦对象被找到，就会根据对象的原型链（prototype chain）来查找属性（property）**。

下面通过一个例子来看看这个二维查找：


```
var foo = {}

function baz() {

    Object.prototype.a = 'Set foo.a from prototype';

    return function inner() {
        console.log(foo.a);
    }

}

baz()(); 
// Set bar.a from prototype
```


对于这个例子，可以通过下图进行解释，代码首先通过作用域链（scope chain）查找"foo"，最终在Global context中找到；然后因为"foo"中没有找到属性"a"，将继续沿着原型链（prototype chain）查找属性"a"。

![img](https://raw.githubusercontent.com/zhangbowen-github/my-gallery/main/img/593627-20151025202351395-1888858218.png)

- 蓝色箭头表示作用域链查找
- 橘色箭头表示原型链查找

## 总结

本文介绍了JavaScript中的作用域以及作用域链，通过作用域链分析了闭包的执行过程，进一步认识了JavaScript的闭包。

同时，结合原型链，演示了JavaScript中的描述符和属性的查找。

下一篇我们就看看Execution Context中的this属性。

# JavaScript中的this

前面两篇文章介绍了JavaScript执行上下文中两个重要属性：VO/AO和scope chain。本文就来看看执行上下文中的this。

首先看看下面两个对this的概括：

- **this是执行上下文（Execution Context）的一个重要属性**，是一个与执行上下文相关的特殊对象。因此，它可以叫作上下文对象（也就是用来指明执行上下文是在哪个上下文中被触发的对象）。
- **this不是变量对象（Variable Object）的一个属性**，所以跟变量不同，this从不会参与到标识符解析过程。也就是说，在代码中当访问this的时候，它的值是直接从执行上下文中获取的，并不需要任何作用域链查找。this的值只在进入上下文的时候进行一次确定。

关于this最困惑的应该是，同一个函数，当在不同的上下文进行调用的时候，this的值就可能会不同。也就是说，this的值是通过函数调用表达式（也就是函数被调用的方式）的caller所提供的。

下面就看看在不同场景中，this的值。

## 全局上下文

在全局上下文（Global Context）中，this总是global object，在浏览器中就是window对象。



```
console.log(this === window);

this.name = "Will";
this.age = 28;
this.getInfo = function(){
    console.log(this.name + " is " + this.age + " years old");
};
window.getInfo();
// true
// Will is 28 years old
```


## 函数上下文

在一个函数中，this的情况就比较多了，this的值直接受函数调用方式的影响。

### Invoke function as Function

当通过正常的方式调用一个函数的时候，this的值就会被设置为global object（浏览器中的window对象）。

但是，当使用"strict mode"执行下面代码的时候，this就会被设置为"undefined"。


```
function gFunc(){
    return this;
}

console.log(gFunc());
console.log(this === window.gFunc());
// window
// true
```


### Invoke function as Method

当函数作为一个对象方法来执行的时候，this的值就是该方法所属的对象。

在下面的例子中，创建了一个obj对象，并设置name属性的值为"obj"。所以但调用该对象的func方法的时候，方法中的this就表示obj这个对象。


```
var obj = {
    name: "obj",
    func: function () {
        console.log(this + ":" + this.name);
    }
};

obj.func();
// [object Object]:obj
```


为了验证"方法中的this代表方法所属的对象"这句话，再看下面一个例子。

在对象obj中，创建了一个内嵌对象nestedObj，当调用内嵌对象的方法的时候，方法中的this就代表nestedObj。


```
var obj = {
    name: "obj",
    nestedObj: {
        name:"nestedObj",
        func: function () {
            console.log(this + ":" + this.name);
        }
    }            
}

obj.nestedObj.func();
// [object Object]:nestedObj
```


对于上面例子中的方法，通常称为绑定方法，也就是说这些方法都是个特定的对象关联的。

但是，当我们进行下面操作的时候，temp将是一个全局作用里面的函数，并没有绑定到obj对象上。所以，temp中的this表示的是window对象。


```
var name = "Will";
var obj = {
    name: "obj",
    func: function () {
        console.log(this + ":" + this.name);
    }
};

temp = obj.func;
temp();
//  [object Window]:Will
```


### Invoke function as Constructor

在JavaScript中，函数可以作为构造器来直接创建对象，在这种情况下，this就代表了新建的对象。


```
function Staff(name, age){
    this.name = name;
    this.age = age;
    this.getInfo = function(){
        console.log(this.name + " is " + this.age + " years old");
    };
}

var will = new Staff("Will", 28);
will.getInfo();
// Will is 28 years old
```


### Invoke context-less function

对于有些没有上下文的函数，也就是说这些函数没有绑定到特定的对象上，那么这些上下文无关的函数将会被默认的绑定到global object上。

在这个例子中，函数f和匿名函数表达式在被调用的过程中并没有被关联到任何对象，所以他们的this都代表global object。


```
var context = "global";

var obj = {  
    context: "object",
    method: function () {  
        console.log(this + ":" +this.context);
        
        function f() {
            var context = "function";
            console.log(this + ":" +this.context); 
        };
        f(); 
        
        (function(){
            var context = "function";
            console.log(this + ":" +this.context); 
        })();
    }
};

obj.method();
// [object Object]:object
// [object Window]:global
// [object Window]:global
```


## call/apply/bind改变this

this本身是不可变的，但是 JavaScript中提供了call/apply/bind三个函数来在函数调用时设置this的值。

这三个函数的原型如下：

- fun.apply(obj1 [, argsArray])
  - Sets obj1 as the value of this inside fun() and calls fun() passing elements of argsArray as its arguments.
- fun.call(obj1 [, arg1 [, arg2 [,arg3 [, ...]]]])
  - Sets obj1 as the value of this inside fun() and calls fun() passing arg1, arg2, arg3, ... as its arguments.
- fun.bind(obj1 [, arg1 [, arg2 [,arg3 [, ...]]]])
  - Returns the reference to the function fun with this inside fun() bound to obj1 and parameters of fun bound to the parameters specified arg1, arg2, arg3, ....

下面看一个简单的例子：


```
function add(numA, numB){
    console.log( this.original + numA + numB);
}

add(1, 2);

var obj = {original: 10};
add.apply(obj, [1, 2]);
add.call(obj, 1, 2);

var f1 = add.bind(obj);
f1(2, 3);

var f2 = add.bind(obj, 2);
f2(3);
// NaN
// 13
// 13
// 15
// 15
```


当直接调用add函数的时候，this将代表window，当执行"this.original"的时候，由于window对象并没有"original"属性，所以会得到"undefined"。

通过call/apply/bind，达到的效果就是把add函数绑定到了obj对象上，当调用add的时候，this就代表了obj这个对象。

## DOM event handler

当一个函数被当作event handler的时候，this会被设置为触发事件的页面元素（element）。

```
var body = document.getElementsByTagName("body")[0];
body.addEventListener("click", function(){
    console.log(this);
});
// <body>…</body>
```

### In-line event handler

当代码通过in-line handler执行的时候，this同样指向拥有该handler的页面元素。

看下面的代码：

```
document.write('<button onclick="console.log(this)">Show this</button>');
// <button onclick="console.log(this)">Show this</button>
document.write('<button onclick="(function(){console.log(this);})()">Show this</button>');
// window
```

在第一行代码中，正如上面in-line handler所描述的，this将指向"button"这个element。但是，对于第二行代码中的匿名函数，是一个上下文无关（context-less）的函数，所以this会被默认的设置为window。

前面我们已经介绍过了bind函数，所以，通过下面的修改就能改变上面例子中第二行代码的行为：

```
document.write('<button onclick="((function(){console.log(this);}).bind(this))()">Show this</button>');
// <button onclick="((function(){console.log(this);}).bind(this))()">Show this</button>
```

## 保存this

在JavaScript代码中，同一个上下文中可能会出现多个this，为了使用外层的this，就需要对this进行暂存了。

看下面的例子，根据前面的介绍，在body元素的click handler中，this肯定是指向body这个元素，所以为了使用"greeting"这个方法，就是要对指向bar对象的this进行暂存，这里用了一个self变量。

有了self，我们就可以在click handler中使用bar对象的"greeting"方法了。

当阅读一些JavaScript库代码的时候，如果遇到类似self，me，that的时候，他们可能就是对this的暂存。


```
var bar = {
    name: "bar",
    body: document.getElementsByTagName("body")[0],
    
    greeting: function(){
        console.log("Hi there, I'm " + this + ":" + this.name);
    },
    
    anotherMethod: function () {
        var self = this;
        this.body.addEventListener("click", function(){
            self.greeting();
        });
    }
};
  
bar.anotherMethod();
// Hi there, I'm [object Object]:bar
```


同样，对于上面的例子，也可以使用bind来设置this达到相同的效果。


```
var bar = {
    name: "bar",
    body: document.getElementsByTagName("body")[0],
    
    greeting: function(){
        console.log("Hi there, I'm " + this + ":" + this.name);
    },
    
    anotherMethod: function () {
        this.body.addEventListener("click", (function(){
            this.greeting();
        }).bind(this));
    }
};
  
bar.anotherMethod();
// Hi there, I'm [object Object]:bar
```


## 总结

本文介绍了执行上下文中的this属性，this的值直接影响着代码的运行结果。

在函数调用中，this是由激活上下文代码的调用者（caller）来提供的，即调用函数的父上下文(parent context )，也就是说this取决于调用函数的方式，指向调用时所在函数所绑定的对象。

通过上面的介绍，相信对this有了一定的认识。

## 自己的话总体总结

- 执行上下文 Execution context   自己的理解就是作用域对象 ：全局作用域 和 局部作用域
  - 包含的重要属性：
    - 变量对象（Variable object，VO）
    - 作用域链（Scope chain）
    - this
  - 创建阶段（当函数被调用，但是开始执行函数内部代码之前）
    - 创建Scope chain
    - 创建VO/AO（variables, functions and arguments）
      - 扫描函数内部代码，查找函数声明（Function declaration）
      - 扫描函数内部代码，查找变量声明（Variable declaration）包含 函数的形参
    - 设置this的值
  - 激活/代码执行阶段
    - 设置变量的值、函数的引用，然后解释/执行代码

- 作用域链 scope chain  就是当前作用域的VO/AO没有的变量，就向上查找VO/AO一直到全局作用域Global scope的VO
- 闭包 是作用域链的应用 ：当有下级作用域使用当前作用域内的变量 ，当前作用域执行结束后变量不会被销毁

- this 是 当前执行上下文被哪个执行上下文调用  谁调用就指向谁
  - 函数直接调用  fn() 指向 全局对象 global 浏览器中是window
  - 对象调用 obj.fn() 哪个对象调用指向就指向谁
  - dom事件 onclick = fn 指向对应的dom
  - 构造函数  new Fn() 指向实例对象
  - call,bind,apply, fn.call(obj) 第一个参数是谁就指向谁



# JavaScript中的函数表达式

