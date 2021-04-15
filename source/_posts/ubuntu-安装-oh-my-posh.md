---
title: ubuntu 安装 oh-my-posh
date: 2021-04-15 13:35:05
tags:
	- Linux
	- ubuntu
	- powerline
	- oh-my-posh
categories: Linux
---



## 前言

根据Windows Terminal 中powerline的教程发现 oh-my-posh 还可以安装到ubuntu系统下，于是尝试了一下

## 安装

官方教学：https://docs.microsoft.com/en-us/windows/terminal/tutorials/powerline-setup

### 安装oh-my-posh

```bash
wget https://github.com/JanDeDobbeleer/oh-my-posh/releases/latest/download/posh-linux-amd64 -O /usr/local/bin/oh-my-posh
chmod +x /usr/local/bin/oh-my-posh
```

### 配置

```bash
mkdir ~/.poshthemes
wget https://github.com/JanDeDobbeleer/oh-my-posh/releases/latest/download/themes.zip -O ~/.poshthemes/themes.zip
unzip ~/.poshthemes/themes.zip -d ~/.poshthemes
chmod u+rw ~/.poshthemes/*.json
rm ~/.poshthemes/themes.zip
```

如果您使用的是Ubuntu 18.04或16.04，则需要先安装正确版本的golang：

```bash
sudo add-apt-repository ppa:longsleep/golang-backports
sudo apt update
```

### 自定义您的Ubuntu提示

`~/.bashrc`使用`nano ~/.bashrc`或您选择的文本编辑器打开文件。这是一个bash脚本，每次bash启动时运行。添加以下内容（将主题更改为您喜欢的主题）：

```bash
eval "$(oh-my-posh --init --shell bash --config ~/.poshthemes/jandedobbeleer.omp.json)"
```

> 如果出现乱码注意安装字体 官方推荐字体 Cascadia Mono PL 使用上会有问题 ，推荐 [Meslo LGM NF](https://github.com/ryanoasis/nerd-fonts/releases/download/v2.1.0/Meslo.zip)

### 字体安装

官方推荐[Meslo LGM NF](https://github.com/ryanoasis/nerd-fonts/releases/download/v2.1.0/Meslo.zip)：https://ohmyposh.dev/docs/fonts

下载地址：https://github.com/ryanoasis/nerd-fonts/releases/download/v2.1.0/Meslo.zip

安装方法：https://www.cnblogs.com/yuqianwen/p/3715835.html

解压

```bash
unzip Meslo.zip -d Meslo
cd Meslo
```

安装

```bash
 sudo mkdir /usr/share/fonts/ttf
 sudo cp *.ttf /usr/share/fonts/ttf
 cd /usr/share/fonts/ttf
 sudo chmod 744 *
 sudo mkfontscale
 sudo mkfontdir
 sudo fc-cache -f -v
```

![image-01](https://gitee.com/zhangbowen-1/my-gallery/raw/master/img/image-20210415135918711.png)