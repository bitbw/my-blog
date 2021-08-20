/*
 * @Description: push sitemap for baidu
 * @Autor: Bowen
 * @Date: 2021-08-20 09:30:46
 * @LastEditors: Bowen
 * @LastEditTime: 2021-08-20 11:12:15
 */
const axios = require("axios");
async function pushBaidu() {
  axios({
    method: "post",
    url: "http://data.zz.baidu.com/urls?site=https://blog.bitbw.top&token=SQqfOYyQKNbs0xaf",
    data: "https://blog.bitbw.top/baidusitemap.xml"
  })
    .then(res => {
      console.log("pushBaidu -> res.data", res.data);
    })
    .catch(error => {
      console.log("pushBaidu -> error", error);
    });
}

pushBaidu();
