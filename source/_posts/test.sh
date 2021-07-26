#!/bin/bash
# 搜索文件名并使用typora打开
for line in `ls | grep -i vue`; do
typora $line
done
