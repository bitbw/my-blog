/*
输入指定时间戳，输出类似于微博发帖时间，几秒前，几分钟前，几小时前，几天前，几个月前 
 */
// 常量
const ONE_M = 1000; // 秒
const ONE_MINUTES = ONE_M * 60; // 分钟
const ONE_HOURS = ONE_MINUTES * 60; // 小时
const ONE_DAY = ONE_HOURS * 24; // 天
const ONE_MOON = ONE_DAY * 30; // 月

/**
 * @description:
 * @param timespen
 * @return {*}
 */
function formateDate(timespen) {
  let interval = Date.now() - timespen;
  let str = "";
  const list = [ONE_MOON, ONE_DAY, ONE_HOURS, ONE_MINUTES, ONE_M];
  const nameList = ["月", "天", "小时", "分钟", "秒"];

  for (const [index, item] of list.entries()) {
    // 倍数
    let x = Math.floor(interval / item);
    if (x) {
      str = x + nameList[index];
      break;
    }
  }
  return str + "前";
}

let str = formateDate(Date.now() - (ONE_MINUTES + ONE_HOURS + ONE_DAY));
console.log("Bowen ~ file: test01.js ~ line 44 ~ str", str)
