---
title: electron-builder常见问题汇总
date: 2022-07-29 16:38:07
tags:
  - electron-builder
  - Electron
categories: Electron
---

## electron-updater 下载无进度问题

突然某一次更新 download-progress 事件不触发了
下载进度显示了，直到下载结束 触发`update-downloaded`事件
开始以为是 electron-builder 和 electron-updater 版本问题，因为最近更新过`node_modules`
尝试将 electron-builder 和 electron-updater 更到最新， 还是不行 😖

开始将问题点转到 请求上，因为之前给 nginx 加了 gzip，考虑是不是 gzip 压缩后无法读取进度了

### 解决

nginx.conf

```yml
    gzip on; # 开启 gzip 压缩输出 
    gzip_min_length 1k; # 1k 以上开启 gzip
    gzip_types
        # ...
        # application/octet-stream 这里注释防止大文件（.exe）下载时读取不到进度
```

去除 nginx.conf 中`application/octet-stream` 二进制流类型的压缩，发现`update-downloaded`事件正常了

其实通过浏览器下载这个 exe 文件时也不显示进度, 估计 是压缩后是直接下载 .gz 文件（下载好以后直接写入文件）， 而未压缩使用流式下载（边下边写入文件）
