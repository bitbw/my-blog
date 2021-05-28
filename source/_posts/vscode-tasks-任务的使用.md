---
title: vscode tasks 任务的使用
date: 2021-03-19 16:13:13
tags:
	- vscode
categories: 工具使用
---



### vscode tasks 任务的使用 

官网：https://code.visualstudio.com/docs/editor/tasks#_variable-substitution

### 预定义变量

官网：https://code.visualstudio.com/docs/editor/variables-reference#_predefined-variables

知乎：https://zhuanlan.zhihu.com/p/92175757

### tasks.json

>具体的配置文件

```json
{
    // See https://go.microsoft.com/fwlink/?LinkId=733558
    // for the documentation about the tasks.json format
    "version": "2.0.0",
    "options": {
        "cwd": "${fileDirname}" // 定义执行环境
    },
    "tasks": [
        {
            "label": "build",
            "type": "shell",
            "command": "ruler  -p  ${fileBasename}",
            "problemMatcher": {
                "fileLocation": [
                    "relative",
                    "${fileDirname}"
                ],
                "pattern": {	
                    // 提示文本进行分组 下面是具体的提示文本
                    // s920.rule:652:1: warning 规则Server,"软件预装","os"已在647行定义
                    "regexp": "^(.*):(\\d+):(\\d+):\\s+(warning|error)\\s+(.*)$",
                    "file": 1,			// 文件名所在组
                    "line": 2,			// 代码所在行
                    "column": 3,		// 代码所在列
                    "severity": 4,		// warning 还是 error
                    "message": 5		// 提示文本
                }
            },
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "shared",
                "showReuseMessage": false,
                "clear": true
            },
            "group": "build"
        },
    	{
            ...
        }
    ]
}
```

