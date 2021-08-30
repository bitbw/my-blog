---
title: vue-cli3+git-hook实现代码提交前自动eslint验证和格式化
date: 2021-04-22 17:30:03
tags:
	- vue-cli
categories: vue
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

```
⚠ Some of your tasks use `git add` command. Please remove it from the config since all modifications made by tasks will be automatically added to the git commit index.
```

意思是将`git add`删除 因为 lint-staged 会将格式化的后的代码自动添加到当前 commit 中
