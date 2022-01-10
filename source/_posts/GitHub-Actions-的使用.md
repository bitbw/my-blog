---
title: GitHub Actions 的使用
date: 2021-04-23 10:37:38
tags:
  - GitHub Actions
  - github
  - ci/cd
categories: Github
cnblogs:
  postid: "15392422"
hash: 2abd2f30548d72e205e157b49933fb40e147f1547d86dea60f03885fcb554c54
---

## 自动部署：GitHub Actions

阮一峰关于 GitHub Actions 的教程： http://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html

> 注意：因为部署插件不断更新需要根据新的插件改相应配置

### 生成 **token** 秘钥

> 官网：https://docs.github.com/en/actions/reference/encrypted-secrets
>
> 注意：github-pages-deploy-action V4 开始不需要添加 token

### 添加配置文件

- 在项目目录下新建`.github\workflows`
- 随便命名一个 yml 配置文件 我的命名`main.yml`
- 填写配置

### 填写配置

#### 关于 github-pages-deploy-action

注意：

- JamesIves/github-pages-deploy-action@master 无法使用，继续使用会报错

- github-pages-deploy-action V4 开始不需要添加 token ，如果添加会报 128 错误

- github 关于 128 错误的解答：https://github.com/JamesIves/github-pages-deploy-action/issues/624

#### github-pages-deploy-action@v2

```yaml
name: GitHub Actions Build and Deploy Demo
on:
  push:
    branches:
      - master
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Build and Deploy
        uses: JamesIves/github-pages-deploy-action@releases/v2
        env:
          ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
          BASE_BRANCH: master
          BRANCH: gh-pages
          FOLDER: public
          BUILD_SCRIPT: npm install && npm run build
```

#### github-pages-deploy-action@v4

```yaml
name: GitHub Actions Build and Deploy Demo
on:
  push:
    branches:
      - master
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Install and Build 🔧
        run: |
          npm install
          npm run build
      - name: Deploy
        # JamesIves/github-pages-deploy-action@4.1.1 not need token
        uses: JamesIves/github-pages-deploy-action@4.1.1
        with:
          branch: gh-pages
          folder: public
```

## GitHub Pages

### 创建

https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
