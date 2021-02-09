## App完整更新流程

1. 项目启动进入main.js 进行 本地数据更新 (iconfig内文件更新)
2. 进入updater.vue 首先检查sysDB更新
3. updater.vue 接下来检查App更新

### App完整更新流程图

![img](https://gitee.com/zhangbowen-1/my-gallery/raw/master/img/wps5.jpg)



## 本地数据更新 (iconfig内文件更新)

### 流程

app重启后

1. 判断本地是否有iConfig  (测试版iConfig_TEST )文件夹， 如果没有就创建并将file/init中的文件在本地释放。

2. 对比app版本号 （如果是测试版带哈希值的版本号回去请求回正常显示的版本号） 和 本地文件夹下的 userDB中的版本号，如app的版本号高则，更新本地文件夹中的数据，并执行src\update\index.js。

> Tip ： 如果需要对本地userDB执行SQL 则在src\update\index.js中写入对应SQL即可，file/init/userDB最好保持最新的，因为本地没有userDB就回释放这个文件，file/init /sysDB 联网后会被线上最新的sysDB替换所以不改也可以



## sysDB更新

### 流程

1. 项目启动后进入到updater.vue中
2. 获取本地 sysDB  和 远程 sysDB 的 部件版本 和 价格版本
3. 如本地版本号没有直接使用远程sys地址更新本地sysDB的文件
4. 如本地 不等于 远程 sysDB 中任何一个版本号 也更新
5. 如本地 各个本吧号均等于 远程 sysDB 则不更新 往下判断APP的更新



## APP更新

### 流程

1. 打包  npm run product  测试版会生成带git-sha1的版本号

iConfig_ADMIN_TEST Setup 1.5.0-e7a4bfb4.exe 中 e7a4bfb4 就是对应的git-sha1（哈希）

2. 上传后台管理系统

- 新建一个版本

![image-20210209094035729](https://gitee.com/zhangbowen-1/my-gallery/raw/master/img/image-20210209094035729.png)



![image-20210209094357765](https://gitee.com/zhangbowen-1/my-gallery/raw/master/img/image-20210209094357765.png)

- 上传对应的yml 和exe文件

![image-20210209095045603](https://gitee.com/zhangbowen-1/my-gallery/raw/master/img/image-20210209095045603.png) 



![image-20210209094839126](https://gitee.com/zhangbowen-1/my-gallery/raw/master/img/image-20210209094839126.png)

- 确认发版

3.  客户端重启后 向服务器请求 并发送版本号和APP - name（iConfig 或者iConfig_ADMIN ）
4.  由服务器判断是否可以更新 
5.  可以更新 服务的地址和更新信息器返回对应更新
6.  客户端根据更新地址请求yml  并展示更新提示![image-20210209093350136](https://gitee.com/zhangbowen-1/my-gallery/raw/master/img/image-20210209093350136.png)
7.  用户点击确认更新开始下载，下载完成后提示用户退出并更新


​      ![image-20210209093605372](https://gitee.com/zhangbowen-1/my-gallery/raw/master/img/image-20210209093605372.png)

 

### App版本更新流程图

![img](https://gitee.com/zhangbowen-1/my-gallery/raw/master/img/wps6.jpg) 

### electron自动更新插件实现流程图

![img](https://gitee.com/zhangbowen-1/my-gallery/raw/master/img/wps7.jpg) 

 

