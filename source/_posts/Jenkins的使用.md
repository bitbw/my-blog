---
title: Jenkins的使用
date: 2021-07-02 10:24:03
tags:
	 - Jenkins
	 - ci/cd
categories: 工具使用
---



## 安装

### Docker

https://www.likecs.com/show-103109.html

### war包

> 前提：需要 java 环境

```bash
java -jar ./jenkins.war(jenkins.war文件的路径) --Port=8080（端口）
```

## 基于node 环境构建 react 或 vue项目

官方教程：https://www.jenkins.io/zh/doc/tutorials/build-a-node-js-and-react-app-with-npm/

### 问题

#### Docker在WSL，windows下出现:Cannot connect to the Docker daemon at unix:///var/run/docker.sock问题

https://blog.csdn.net/weixin_48031922/article/details/116529198

ps： 

-v /var/run/docker.sock:/var/run/docker.sock \

上面这条命令是使容器内系统，可以直接使用当前运行容器的系统的docker

也就是说 在容器内使用 `docker ps -a `可以看到当前系统中所有运行的容器，包括当前容器本身

> 最佳解决方案是直接在 ubutun 子系统中使用，docker run  ...
>
>  /var/run/docker.sock:/var/run/docker.sock  就不会出现错误 ，win上我实在不知道 /var/run/docker.sock 在哪



#### 出现WorkflowScript: 3: Invalid agent type "docker" specified

下载 `Docker Pipeline` 插件 即可解决

## 使用流水线语法实现构建后上传服务器

基于这篇文章：https://blog.csdn.net/wangzan18/article/details/105864373/

### 注意点：

#### **Publish over SSH** 插件 ，

配置 **Publish over SSH** 

系统管理->系统配置->Publish over SSH

![配置 **Publish over SSH** ](https://gitee.com/bitbw/my-gallery/raw/master/img/Publish%20over%20SSH%E9%85%8D%E7%BD%AE.png)

ps:

这里配置的私钥就是使用ssh免密登录时生成的私钥 

全部了解ssh见 我的文章 Linux命令入门 https://blog.bitbw.top/Linux/Linux%E5%91%BD%E4%BB%A4%E5%85%A5%E9%97%A8/

#### 免密码登录

##### 步骤

- 配置公钥
  - 执行 `ssh-keygen` 即可生成 SSH 钥匙，一路回车即可
- 上传公钥到服务器
  - 执行 `ssh-copy-id -p port user@remote`，可以让远程服务器记住我们的公钥
  - 上传后的公钥在远端用户家目录下`.ssh`文件夹 `authorized_keys` 中

执行`ssh-keygen`后会在当前用户家目录下生成`.ssh`文件夹 

```bash
 cd .ssh/
 ll
#total 20
#drwx------  2 bowen bowen 4096 Aug  2 14:34 ./
#drwxr-xr-x 13 bowen bowen 4096 Aug  4 09:24 ../
#-rw-------  1 bowen bowen 3243 Aug  2 14:32 id_rsa
#-rw-r--r--  1 bowen bowen  747 Aug  2 14:32 id_rsa.pub
#-rw-r--r--  1 bowen bowen  222 Aug  2 13:43 known_hosts
```

id_rsa 就是私钥 

```bash
cat id_rsa
```

全部复制放到key字段中

#### 问题

##### 测试连接报错：jenkins.plugins.publish_over.BapPublisherException: Failed to add SSH key

解决：http://www.wallcopper.com/linux/3689.htmljenkins

无密码ssh时报错:jenkins.plugins.publish_over.BapPublisherException: Failed to add SSH key. Message [invalid privatekey: [B@6a581993]
com.jcraft.jsch.JSchException: invalid privatekey, 部分库（如：JSch）不支持OPENSSH PRIVATE KEY格式的私钥

1、jenkins使用 `ssh-keygen -m PEM -t rsa -b 4096` 来生成key就可以用了。
-m 参数指定密钥的格式，PEM（也就是RSA格式）是之前使用的旧格式

##### ssh-copy-id上传时报：IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!

解决：https://blog.csdn.net/weixin_44545265/article/details/88362272

文件传输不过去，只需要删除.ssh目录下的known_hosts文件就能传输了
`[root@xx]# rm -rf ~/.ssh/known_hosts`

我的jenkinsfile

```
pipeline {
    agent {
        docker {
            image 'node:12-alpine' 
            args '-p 3000:3000' 
        }
    }
    stages {
        stage('Build') { 
            steps {
                sh 'npm install'
                sh 'npm run build'
                sh 'ls -lha' 
            }
        }
	stage('Deploy') {
            steps {
                sshPublisher(publishers: [sshPublisherDesc(configName: '线上服务器', transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: '''ls /home/ipsconfig/deployment/docker_vue/prod/dist_temp/
                rm -rf /home/ipsconfig/deployment/docker_vue/prod/dist/
                mkdir /home/ipsconfig/deployment/docker_vue/prod/dist/
                cp -r /home/ipsconfig/deployment/docker_vue/prod/dist_temp/.   /home/ipsconfig/deployment/docker_vue/prod/dist/
                ls /home/ipsconfig/deployment/docker_vue/prod/dist/
                rm -rf /home/ipsconfig/deployment/docker_vue/prod/dist_temp/
                docker rm -f manager-nginx-prod
                docker run --name manager-nginx-prod -v /home/ipsconfig/deployment/docker_vue/prod/dist:/usr/share/nginx/html:ro -v /home/ipsconfig/deployment/docker_vue/prod/nginx.conf:/etc/nginx/nginx.conf -p 3002:80 -d ppc64le/nginx
                ''', execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '/home/ipsconfig/deployment/docker_vue/prod/dist_temp/', remoteDirectorySDF: false, removePrefix: 'dist', sourceFiles: 'dist/**')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false)])
            }
        }
    }
}

```

