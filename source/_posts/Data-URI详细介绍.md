---
title: Data URI详细介绍
date: 2020-12-31 09:09:56
tags:
  - HTML
  - js
  - CSS
categories: HTML
cnblogs:
  postid: "15392411"
hash: 3266c0ebe41135f532ebc72266760d8ed36d5285fd2e7b2e20aa9ed3ba8212f0
---

最近学习 webpack 遇到了 Data URI 这种格式，觉得很有趣稍微学习一下，转载一篇别人写的比较好的文章；

原文地址：https://blog.csdn.net/qq_38128179/article/details/100663085

## 一、URI 介绍

URI（统一资源标识符） 是 uniform resource identifier 的缩写，它定义了接受内容的协议以及附带的相关内容，如果附带的相关内容是一个地址，那么此时的 URI 也是一个 URL （uniform resource locator` `)。

## 二、什么是 data URI scheme？

Data URI scheme 简称 Data URI，经常会被**错误**地写成 data URLs。即前缀为 data：协议的的 URL，其允许内容创建者向文档中嵌入小文件。

> 假设我们有一个图片需要显示在网页上
>
> 1、通常我们会使用 http 链接，这种取得资料的方法称为 **http URI scheme**：
>
> ```html
> // 从外部请求一张图片
> <img src="http://pic1.win4000.com/wallpaper/c/53cdd1f7c1f21.jpg" alt="" />
> ```
>
> 2、使用 **data URI scheme** 获取资料可以写成：
>
> ```html
> // 在HTML中嵌入一个小红点的图片
> <img
>   src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
>   alt=""
> />
> ```
>
> 通过 data RUI scheme，我们把图像内容内置在 HTML 中，节省了一个 HTTP 请求。

## 三、**Data URI scheme 的语法**

> **data:①[<mime type>]②[;charset=<charset>]③[;<encoding>]④,<encoded data>⑤**

**【1】第 ① 部分 data：** 协议头，它标识这个内容为一个 data URI 资源。

**【2】第 ② 部分 MIME 类型（可选项）：**浏览器通常使用 MIME 类型（而不是文件扩展名）来确定如何处理文档；因此服务器设置正确以将正确的 MIME 类型附加到响应对象的头部是非常重要的。MIME 类型对大小写不敏感，但是传统写法都是小写。

| **类型**    | **描述**                                            | **示例（语法：type/subtype 类型/子类型\*\***）\*\*                                                                                      |
| ----------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| text        | 表明文件是普通文件，理论上是人类可读的              | **text/plain，text/html，text/css，text/javascript**                                                                                    |
| image       | 表明文件某种是图像文件，gif 动态图也属于 image 类型 | **image/gif，image/png，image/jpeg，image/bmp，image/webp，image/x-icon，image/vnd.microsoft.icon**                                     |
| audio       | 表明文件是某种音频文件                              | **audio/midi，audio/mpeg，audio/webm，audio/ogg，audio/wav**                                                                            |
| video       | 表明文件是某种视频文件                              | **video/webm，video/ogg**                                                                                                               |
| application | 表明文件是某种二进制数据                            | **application/octet-stream，application/pkcs12，application/vnd.mspowerpoint，application/xhtml+xml，application/xml，application/pdf** |

**【3】第 ③ 部分 [;charset=<charset>](可选项)：** 源文本的字符集编码方式，默认编码是 charset=US-ASCII, 即数据部分的每个字符都会自动编码为 %xx

**【4】第 ④ 部分 [;<encoding>] ：** 数据编码方式（默认 US-ASCII，BASE64 两种）

**【5】第 ⑤ 部分 ,<encoded data>** **：** 编码后的数据

> 关于 base64 可以参考阮一峰写的文章：http://www.ruanyifeng.com/blog/2008/06/base64.html

## 四、**Data URI scheme 的利弊**

> **利：**
>
> - 减少 HTTP 请求
> - 当访问外部资源很麻烦或受限时（比如服务器 ip 被墙）
> - 当图片是在服务器端用程序动态生成，每个访问用户显示的都不同时
> - 当图片的体积太小，占用一个 HTTP 会话不值得时
> - 没有图片更新要重新上传，还要清理缓存的问题
>
> **弊：**
>
> - Base64 编码的数据体积通常是原数据的体积 4/3，也就是 Data URL 形式的图片会比二进制格式的图片体积大 1/3
> - Data URL 形式的图片不会被浏览器缓存，这意味着每次访问页面时都被下载一次。
> - 增加了 CSS 文件的尺寸
> - IE678 兼容性
> - 不适合 lazy loading
> - 不利于维护
> - 移动端不宜使用 Data URI 技术（解码耗 CPU）

## 五、**Data URI scheme 的应用实例**

**【1】在 Html 的 Img 对象中使用**

```html
<img src="data:image/x-icon;base64,AAABAAEAEBAAAAAAAABoBQAAF..." />
```

**【2】在 Css 的 background-image 属性中使用**

```css
div.image {
  width: 100px;
  height: 100px;
  background-image: url(data:image/x-icon;base64,AAABAAEAEBAAAAAAAABoBQAAF...);
}
```

**【3】在 Html 的 css 链接处使用**

```html
<link
  rel="stylesheet"
  type="text/css"
  href="data:text/css;base64,LyogKioqKiogVGVtcGxhdGUgKioq..."
/>
```

**【4】在 Html 的 javaScript 链接处使用**

```html
<script
  src="data:text/javascript;base64,LyogKioqKiogVGVtcGxhdGUgKioq..."
  type="text/javascript"
></script>
```

**【5】data RUI scheme 也可以直接在浏览器的地址栏中输入进行访问**

**①**在浏览器中输入以下的 Url，会得到一个加粗的"Hello, world!"。也就是说，data:后面的数据直接用做网页的内容，而不是网页的地址。

```javascript
data: text / html,
  (
    <html>
      <body>
        <p>
          <b>Hello, world!</b>
        </p>
      </body>
    </html>
  );
```

**②**下面的例子会显示出 "你好，中文！"。

```javascript
data:text/plain;charset=UTF-8;base64,5L2g5aW977yM5Lit5paH77yB
```

## 六、兼容 IE678 - MHTML

MHTML 即 MIME HTML（Multipurpose Internet Mail Extensions HyperText Markup Language），就是将 Data URI 以附件的形式附加到页面页面上，具体示例如下：

```css
/** FilePath: http://example.com/test.css */
/*!@ignore
Content-Type: multipart/related; boundary="_ANY_SEPARATOR"
--_ANY_SEPARATOR
Content-Location:myidBackground
Content-Transfer-Encoding:base64
iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==
--_ANY_SEPARATOR--
*/
.myid {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==");
  *background-image: url(mhtml:http://example.com/test.css!myidBackground);
}
```

上面注释的部分就是一个附件， 这个附件的内容是一个名为 myidBackground 的 Base64 编码图片，然后在 class 为 myid 的 css 中使用。

注意：1、boundary 字段值可自定义；

​ 2、附件的末行必须为 boundary 字段值；

​ 3、附件内容不能被压缩工具擦写掉；

​ 4、由于高版本的 IE 在使用 IE8 兼容模式时能认识\*这个 css hack 符号，但却不支持 mhtml，所以会导致背景图片失效。应该采用 IE 的条件注释更为稳妥。

## 七、base64 转换工具

[Encode Data URL ](http://www.pjhome.net/web/html5/encodeDataUrl.htm)

[aTool 在线工具](http://www.atool9.com/img2base64.php)

[Duri.me](https://duri.me/)

[DATAURL](https://dataurl.sveinbjorn.org/#dataurlmaker)
