---
title: express入门
date: 2022-03-07 17:09:09
tags:
    - express
categories: Nodejs
---


## Express 应用程序生成器

[官方地址](http://expressjs.com/zh-cn/starter/generator.html)

```bash
npx express-generator --git  -view=ejs  myapp

cd myapp

npm install

npm start

```

## 项目完善

### CORS

app.js

```js
//设置CORS
app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin','*'); //当允许携带cookies此处的白名单不能写’*’
  res.header('Access-Control-Allow-Headers','Accept-Ranges, Content-Encoding,  Content-Range, content-type,Content-Length, Authorization,Origin,Accept,X-Requested-With'); //允许的请求头
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT'); //允许的请求方法
  res.header('Access-Control-Allow-Credentials',true);  //允许携带cookies
  next();
});
```

### 解析 formdata

[使用 multiparty](https://www.npmjs.com/package/multiparty)

```bash
npm install multiparty
```

router

```js
const multiparty = require("multiparty");
outer.post("/xxx", async function (req, res, next) {
  // 获取form
  var form = new multiparty.Form();
  form.parse(req, async function (err, fields, files) {
        // fields  files -> formdata
      console.log(fields, files)
  }
})
```
