---
title: 关于openAPI登陆的问题
date: 2020-09-14 10:44:36
tags: js
categories: js
---



# 铁建系统关于登陆的问题我的理解简单的记录一下

## 登陆顺序

>1.首先输入地址http://36.112.134.186:81/ -
>
>2.前端发起请求是否带token 
>
>没有token 后端返回403 无权限 
>
>前端判断403跳转login，
>
>login页面么判断是否有本地存储token 没有就跳到
>`/openid-service/openid_connect_login?identifier=https://g1openid.crcc.cn`
>
>3.在单点登陆页判断有没有登陆状态   
>
>没有登陆状态就跳单点登陆的login页面`https://g1openid.crcc.cn/login`  
>
>有登陆状态就跳正常的`http://36.112.134.186:81/login?toekn=xxxxx`页面
>
>接下来后端通过重定向 将页面进行跳转

>值得注意的一点因为是使用openAPI登陆 所以 项目的登陆页只是做获取用户信息跳转以及判断是否有token用
>真正的登陆是使用openAPI的登陆界面 再由openAPI定向到项目的login ,login页获取用户信息后跳转到首页或其他页

## 图示过程

跳转到`/openid-service/openid_connect_login?identifier=https://g1openid.crcc.cn`后的过程

1. ![image-20200803163300383](https://gitee.com/bitbw/my-gallery/raw/master/img/image-20200803163300383.png)

2. 如果登陆了就给token ，没登陆 ，就继续重定向到单点登陆的ogin页面  

   2.1 没有登陆

   ![image-20200803180837395](https://gitee.com/bitbw/my-gallery/raw/master/img/image-20200803180837395.png)

   2.2![image-20200803163758793](https://gitee.com/bitbw/my-gallery/raw/master/img/image-20200803163758793.png)

3. 

![image-20200803164020930](https://gitee.com/bitbw/my-gallery/raw/master/img/image-20200803164020930.png)

4.login页返回index.html  就是这样的 

```html
<!DOCTYPE html><html lang=en><head><meta charset=utf-8><meta http-equiv=X-UA-Compatible content="IE=edge"><meta name=viewport content="width=device-width,initial-scale=1"><link rel="shortcut icon" href=static/favicon.ico><title>【测试】香蕉苹果薪酬管理子系统V1.0</title><link href=/static/css/vendor.be1deb6300539c6eb0ef.css rel=stylesheet><link href=/static/css/pm.a6d7e17ba3b40ea1106a.css rel=stylesheet></head><body><noscript><strong>We're sorry but template doesn't work properly without JavaScript enabled. Please enable it to continue.</strong></noscript><div id=app></div><script type=text/javascript src=/static/js/0.efc020cf96e8304d3de8.js></script><script type=text/javascript src=/static/js/pm.508c6e69717100079c83.js></script></body></html>
```

然后找对应的压缩好的资源

![image-20200803164325452](C:%5CUsers%5CThinkPad%5CAppData%5CRoaming%5CTypora%5Ctypora-user-images%5Cimage-20200803164325452.png)

![image-20200803165308105](https://gitee.com/bitbw/my-gallery/raw/master/img/image-20200803165308105.png)

login页的主要代码

```js
mounted() {
    let token: string = $get(this.$route, 'query.token', '');  //判断？后面有没有query参数
    if (!isEmpty(token)) {
        sessionStorage.setItem('Authorization', token);  //存token 每次请求都会带着这个
        this.openFullScreen('欢迎登录香蕉苹果薪酬管理子系统V1.0');
        getUserInfo()//获取用户信息
            .then(res => {
                let data = res;
                if (data) {
                    this.SET_USER_INFO(data);
                    handleSalaryLoginInfo(data);  // 处理数据 判断有没有权限 没有权限跳转页面
                    let businessMenu = $get(data, 'businessMenu') || [];
                    let selfMenu = $get(data, 'selfMenu') || [];
                    if (businessMenu.length < 1) {
                        if (selfMenu.length > 0) {
                            this.$router.push({ name: 'SelfSystem' });
                        } else {
                            this.$router.push('/no-auth');
                        }
                    } else {
                        this.$router.push({ name: 'HomeIndex' });
                    }
                }
            })
            .catch(e => {
                console.log('e', e);
                this.$notify.error(`获取用户信息失败: ${e.message}`);
            })
            .finally(() => {
                this.closeFullScreen();
            });
    } else {
        if (isEmpty(sessionStorage.getItem('Authorization'))) {
            document.location.href = this.login_router;
            //调到openid-service/openid_connect_login?identifier=https://g1openid.crcc.cn
        } else {
            this.$router.push({ name: 'HomeIndex' });
        }
    }
}
```

