---
title: js中的微观任务和宏观任务
tags: js
categories: js
date: 2020-09-14 10:35:43
---

# js中的微观任务和宏观任务

> 首先js是单线程的,代码执行都在执行栈中，io接口事件和dom事件都放在任务队列中，等到执行栈执行完毕再去任务队列中看有没有可执行的任务，这称之为事件循环
<!--more-->
事件循环示意

![bg2014100802](js%E4%B8%AD%E7%9A%84%E5%BE%AE%E8%A7%82%E4%BB%BB%E5%8A%A1%E5%92%8C%E5%AE%8F%E8%A7%82%E4%BB%BB%E5%8A%A1/bg2014100802.png)

### 注意点1

微观任务都是放在执行栈的最后来执行，还是在本轮事件循环中

宏观任务都是放在任务队列中执行，不在本轮事件循环之中

### 注意点2

asycn  的 await 下面的代码相当于都在promise的then里面都是本轮事件循环的最末执行，也就是说await下面的代码在等待await期间会被放到栈尾，而执行asnyc 函数下的代码

![微观任务和宏观任务](js%E4%B8%AD%E7%9A%84%E5%BE%AE%E8%A7%82%E4%BB%BB%E5%8A%A1%E5%92%8C%E5%AE%8F%E8%A7%82%E4%BB%BB%E5%8A%A1/%E5%BE%AE%E8%A7%82%E4%BB%BB%E5%8A%A1%E5%92%8C%E5%AE%8F%E8%A7%82%E4%BB%BB%E5%8A%A1.png)

总结：遇到setimeout 就放一边 ，遇到setImmediate也放 一边，遇到promise或者nextTick就放到本轮最后，等到本轮执行结束去找可以执行的settimeout或**setImmediate**
