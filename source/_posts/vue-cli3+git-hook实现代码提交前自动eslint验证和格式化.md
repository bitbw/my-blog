---
title: vue-cli3+git-hook实现代码提交前自动eslint验证和格式化
date: 2021-04-22 17:30:03
tags:
  - vue-cli
categories: vue
cnblogs:
  postid: "15393012"
hash: e7949838bbeb2a53fc38feb5582d8827448dfce9c23e6c8d47197785013d1c2b
---

## Git Hook

> 官方文档：https://cli.vuejs.org/zh/guide/cli-service.html#git-hook
> 在安装@vue/cli-service 之后, 也会安装 yorkie，它会让你在 package.json 的 gitHooks 字段中方便地指定 Git hook：

```json
{
  "gitHooks": {
    "pre-commit": "lint-staged"
  },
  "lint-staged": {
    "*.{js,vue}": ["vue-cli-service lint", "git add"]
  }
}
```

## 注意

> yorkie fork 自 husky 并且与后者不兼容。

### lint-staged 需要安装 否则会报找不到 lint-staged 命令

```bash
yarn add lint-staged --dev
```

再次 commit 时会看到这样的提示

```bash
git commit -m "Update"
 > running pre-commit hook: lint-staged
[STARTED] Preparing...
[SUCCESS] Preparing...
[STARTED] Running tasks...
[STARTED] Running tasks for *.{js,vue}
[STARTED] vue-cli-service lint
[SUCCESS] vue-cli-service lint
[SUCCESS] Running tasks for *.{js,vue}
[SUCCESS] Running tasks...
[STARTED] Applying modifications...
[SUCCESS] Applying modifications...
[STARTED] Cleaning up...
[SUCCESS] Cleaning up...
[dev 486fef8] Update
 2 files changed, 2 insertions(+), 2 deletions(-)
```

### `commit`时有警告

```bash
⚠ Some of your tasks use `git add` command. Please remove it from the config since all modifications made by tasks will be automatically added to the git commit index.
```

意思是将`git add`删除 因为 lint-staged 会将格式化的后的代码自动添加到当前 commit 中

## 使用 husky

因为 yorkie 无法向后兼容 所以建议直接使用 husky 做 git hook
自动安装配置 lint-staged 和 husky

```bash
npx mrm@2 lint-staged
```

修改 package.json

```json
"lint-staged": {
    "*.{js,vue}": ["vue-cli-service lint"]
  }
```

再次 commit 时会看到这样的提示

```bash
$ git commit -m "Update"
[STARTED] Preparing...
[SUCCESS] Preparing...
[STARTED] Running tasks...
[STARTED] Running tasks for *.{js,vue}
[STARTED] vue-cli-service lint
[SUCCESS] vue-cli-service lint
[SUCCESS] Running tasks for *.{js,vue}
[SUCCESS] Running tasks...
[STARTED] Applying modifications...
[SUCCESS] Applying modifications...
[STARTED] Cleaning up...
[SUCCESS] Cleaning up...
[master c33d119] Update
 1 file changed, 1 insertion(+), 1 deletion(-)
```

## 自动 eslint 验证和格式化

如果项目创建时没有 选择 linter / formatter config 需要设置一个标准让 eslint 执行格式化
正常有三种标准可以选择

```bash
ESLint + Airbnb config
ESLint + Standard config
ESLint + Prettier
```

简单的方法想使用哪个标准 使用 vue-cli 创建一个新项目选择对应的标准然后跟现在的项目对比看看缺了些什么
下面简单说下各个标准的配置和需要的插件

### Airbnb

下载插件

```bash
 npm install --save-dev @vue/eslint-config-airbnb
```

修改 eslintConfig

```json
"eslintConfig": {
    ...
    "extends": [
      ...
      "@vue/airbnb"
    ],
  },
```

### Standard

下载插件

```bash
 npm install --save-dev @vue/eslint-config-standard
```

修改 eslintConfig

```json
"eslintConfig": {
    ...
    "extends": [
      ...
      "@vue/standard"
    ],
  },
```

### Prettier

下载插件

```bash
 npm install --save-dev @vue/eslint-config-prettier
```

修改 eslintConfig

```json
"eslintConfig": {
    ...
    "extends": [
      ...
      "@vue/prettier"
    ],
  },
```
