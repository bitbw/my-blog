---
title: jest单元测试入门
date: 2022-03-11 10:35:41
tags:
    - 单元测试
    - jest
categories: 前端测试
---


[官方文档](https://www.jestjs.cn/docs/getting-started)

## 安装

```bash
yarn add --dev jest
```

## DEMO

下面我们开始给一个假定的函数写测试，这个函数的功能是两数相加。首先创建 `sum.js` 文件：

```javascript
function sum(a, b) {
  return a + b;
}
module.exports = sum;
```

Copy

接下来，创建名为 `sum.test.js` 的文件。这个文件包含了实际测试内容：

```javascript
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

Copy

将如下代码添加到 `package.json` 中：

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

Copy

最后，运行 `yarn test` 或者 `npm run test` ，Jest 将输出如下信息：

```bash
PASS  ./sum.test.js
✓ adds 1 + 2 to equal 3 (5ms)
```

Copy

**你刚才使用 Jest 成功地写出了第一个测试！**

在此测试中，使用了 `expect` 和 `toBe` 来检测两个值是否完全相同。若要了解其它使用 Jest 可以测试的内容，请参阅[使用匹配器(Matcher)](https://www.jestjs.cn/docs/using-matchers)。

## [使用命令行](https://www.jestjs.cn/docs/getting-started#使用命令行)

你可以直接从 CLI 运行 Jest 并使用一系列有用的配置参数（前提是已经配置了环境变量 `PATH` 使其全局可用，例如通过 `yarn global add jest` 或者 `npm install jest --global` 来安装 Jest）。

这里演示了如何对于能够匹配到 `my-test` 的文件运行 Jest，以 `config.json` 作为配置文件，并在运行后显示一个基于原生操作系统的通知：

```bash
jest my-test --notify --config=config.json
```

Copy

如果想要了解更多在命令行中运行 `jest` 的内容，请参阅 [Jest CLI 配置项](https://www.jestjs.cn/docs/cli)页面.

## [更多配置项](https://www.jestjs.cn/docs/getting-started#更多配置项)

### [生成基础配置文件](https://www.jestjs.cn/docs/getting-started#生成基础配置文件)

Jest 将根据你的项目提出一系列问题，并且将创建一个基础配置文件。文件中的每一项都配有简短的说明：

```bash
jest --init
```

Copy

### 使用 [Babel](https://www.jestjs.cn/docs/getting-started#使用-babel)

要使用 [Babel](https://babeljs.io/)，请通过 `yarn` 来安装所需的依赖项：

```bash
yarn add --dev babel-jest @babel/core @babel/preset-env
```

Copy

在项目的根目录下创建 `babel.config.js` ，通过配置 Babel 使其能够兼容当前的 Node 版本。

babel.config.js

```javascript
module.exports = {
  presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
};
```

Copy

*Babel 理想的配置取决于项目本身。* 请查阅 [Babel 官方文档](https://babeljs.io/docs/en/) 来获得更多详细信息。

<details class="details_2tSt isBrowser_mvLw alert alert--info details_4nRH" data-collapsed="true" style="box-sizing: border-box; color: var(--ifm-alert-foreground-color); --ifm-alert-background-color:var(--ifm-color-info-contrast-background); --ifm-alert-background-color-highlight:rgba(84,199,236,0.15); --ifm-alert-foreground-color:var(--ifm-color-info-contrast-foreground); --ifm-alert-border-color:var(--ifm-color-info-dark); --ifm-code-background:var(--ifm-alert-background-color-highlight); --ifm-link-color:var(--ifm-alert-foreground-color); --ifm-link-hover-color:var(--ifm-alert-foreground-color); --ifm-link-decoration:underline; --ifm-tabs-color:var(--ifm-alert-foreground-color); --ifm-tabs-color-active:var(--ifm-alert-foreground-color); --ifm-tabs-color-active-border:var(--ifm-alert-border-color); background-color: var(--ifm-alert-background-color); border: 1px solid var(--ifm-alert-border-color); border-radius: var(--ifm-alert-border-radius); box-shadow: var(--ifm-alert-shadow); padding: var(--ifm-alert-padding-vertical) var(--ifm-alert-padding-horizontal); --docusaurus-details-summary-arrow-size:0.38rem; --docusaurus-details-transition:transform var(--ifm-transition-fast) ease; --docusaurus-details-decoration-color:var(--ifm-alert-border-color); margin: 0 0 var(--ifm-spacing-vertical); font-family: system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, Ubuntu, Cantarell, &quot;Noto Sans&quot;, sans-serif, BlinkMacSystemFont, &quot;Segoe UI&quot;, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><summary markdown="span" style="box-sizing: border-box; cursor: pointer; list-style: none; padding-left: 1rem; position: relative;"><strong style="box-sizing: border-box; font-weight: var(--ifm-font-weight-bold);">将 Babel 配置为 Jest 可感知的</strong></summary></details>

<details class="details_2tSt isBrowser_mvLw alert alert--info details_4nRH" data-collapsed="true" style="box-sizing: border-box; color: var(--ifm-alert-foreground-color); --ifm-alert-background-color:var(--ifm-color-info-contrast-background); --ifm-alert-background-color-highlight:rgba(84,199,236,0.15); --ifm-alert-foreground-color:var(--ifm-color-info-contrast-foreground); --ifm-alert-border-color:var(--ifm-color-info-dark); --ifm-code-background:var(--ifm-alert-background-color-highlight); --ifm-link-color:var(--ifm-alert-foreground-color); --ifm-link-hover-color:var(--ifm-alert-foreground-color); --ifm-link-decoration:underline; --ifm-tabs-color:var(--ifm-alert-foreground-color); --ifm-tabs-color-active:var(--ifm-alert-foreground-color); --ifm-tabs-color-active-border:var(--ifm-alert-border-color); background-color: var(--ifm-alert-background-color); border: 1px solid var(--ifm-alert-border-color); border-radius: var(--ifm-alert-border-radius); box-shadow: var(--ifm-alert-shadow); padding: var(--ifm-alert-padding-vertical) var(--ifm-alert-padding-horizontal); --docusaurus-details-summary-arrow-size:0.38rem; --docusaurus-details-transition:transform var(--ifm-transition-fast) ease; --docusaurus-details-decoration-color:var(--ifm-alert-border-color); margin: 0 0 var(--ifm-spacing-vertical); font-family: system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, Ubuntu, Cantarell, &quot;Noto Sans&quot;, sans-serif, BlinkMacSystemFont, &quot;Segoe UI&quot;, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><summary markdown="span" style="box-sizing: border-box; cursor: pointer; list-style: none; padding-left: 1rem; position: relative;"><strong style="box-sizing: border-box; font-weight: var(--ifm-font-weight-bold);">对 Babel 6 支持</strong></summary></details>

### 使用 [webpack](https://www.jestjs.cn/docs/getting-started#使用-webpack)

Jest 可以用于在使用 [webpack](https://webpack.js.org/) 管理资源、样式和编译方式的项目中。webpack 和其它工具相比的确多了一些独特的挑战。请参阅 [webpack 指南](https://www.jestjs.cn/docs/webpack) 快速上手。

###  显示测试报告

```bash
jest --coverage
```

### 动态监听文件改变进行测试

```bash
jest --watchAll
```

package.json

```json
"scripts": {
    "test": "jest --watchAll",
    "coverage": "jest --coverage"
  },
```

## 匹配器

[官方文档](https://www.jestjs.cn/docs/expect)

```js
// 用于.toBe比较原始值或检查对象实例的引用身份。它调用比较值，这比严格相等运算符Object.is更适合测试
  test("to be", () => {
    expect("a").toBe("a");
  });
  //  用于.toEqual递归比较对象实例的所有属性（也称为“深度”相等）。它调用比较原始值，这比严格相等运算符Object.is更适合测试。
  test(".toEqual()", () => {
    let a = { name: 1 };
    expect(a).toEqual({ name: 1 });
  });
  //   .toBeTruthy当您不关心值是什么并且希望确保值在布尔上下文中为真时使用。
  test(".toBeTruthy()", () => {
    let a = 22;
    expect(a).toBeTruthy();
  });
  //   .toBeFalsy当您不关心值是什么并且希望确保值在布尔上下文中为假时使用
  test(".toBeFalsy()", () => {
    let a = 0;
    expect(a).toBeFalsy();
  });
  //   用于.toBeUndefined检查变量是否未定义
  test(".toBeUndefined()", () => {
    let a;
    expect(a).toBeUndefined();
  });
  //   用于.toBeDefined检查变量是否未定义
  test(".toBeDefined()", () => {
    let a = 123;
    expect(a).toBeDefined();
  });
  //   toBeNull()是一样的，.toBe(null)但错误信息更好一点。所以.toBeNull()当你想检查某些东西是否为空时使用。
  test(".toBeNull()", () => {
    let a = null;
    // 期望（a）.为空（）;
    expect(a).toBeNull();
  });
  //   .toBeNaN检查值为 时使用NaN。
  test(".toBeNaN()", () => {
    let a = NaN;
    expect(a).toBeNaN();
  });
  //  大于
  test(".toBeGreaterThan()", () => {
    let a = 8;
    // 期望（a）大于（6）
    expect(a).toBeGreaterThan(6);
  });
  //   大于或等于
  test(".toBeGreaterThanOrEqual()", () => {
    let a = 8;
    // 期望（a）大于或等于（8）
    expect(a).toBeGreaterThanOrEqual(8);
  });
  //   小于
  test(".toBeLessThan()", () => {
    let a = 8;
    // 期望（a）小于（10）
    expect(a).toBeLessThan(10);
  });
  //   小于或等于
  test(".toBeLessThanOrEqual()", () => {
    let a = 8;
    // 期望（a）.小于或等于（8）
    expect(a).toBeLessThanOrEqual(8);
  });
  //   用于.toMatch检查字符串是否与正则表达式匹配
  test(".toMatch()", () => {
    let a = "jest-test, mock , api";
    expect(a).toMatch("api");
  });
  //   .toContain当您要检查项目是否在数组中时使用。为了测试数组中的项目，这使用===了严格的相等检查。.toContain还可以检查一个字符串是否是另一个字符串的子字符串
  test(".toContain()", () => {
    let a = ["react", "vue", "webpack", "node", "ts"];
    expect(a).toContain("webpack");
  });
  //   用于.toThrow测试函数在调用时是否抛出 错误
  test(".toThrow()", () => {
    let a = () => {
      //   throw Error("error");
      throw "error";
    };
    expect(a).toThrow("error");
  });
```

