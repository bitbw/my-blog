/* 函数式编程

实现一个组件，传入时间戳，
倒计时，格式化时间，1d 2h 3m 4s
倒计时结束 自动提示用户 已结束 */

const ONE_M = 1000;
const ONE_MINUTES = 60 * 1000;
const ONE_HOURS = 60 * ONE_MINUTES;
const ONE_DAY = ONE_HOURS * 24;

let timer = null;

function showDate(starNum, endNum) {
  const [intervalDate, setIntervalDate] = useState(endNum - starNum);

  timer = setInterval(() => {
    setIntervalDate(intervalDate - 1000);
  }, 1000);
  useEffect((intervalDate) => {
    if(intervalDate <= 1000){
        clearInterval(timer)
    }
    return () => {
        clearInterval(timer)
    }
  }, [intervalDate])

  return (
    <div> 还有{{ fromate(intervalDate) }} </div>
  )
}
/**
 * @description:
 * @param {*} intervalDate
 * @return {*}
 */
function fromate(intervalDate = 1000) {
  let str = "";
  const list = ["天", "小时", "分钟","秒"];
  [ONE_DAY , ONE_HOURS ,ONE_MINUTES,ONE_M].reduce((per, cur, index) => {
    if (per >= cur) {
      const x = Math.floor(per / cur);
      let res = per - x * cur;
      //  拼接字符串
      str += x + list[index];
      return res;
    } else {
      return per;
    }
      
  }, intervalDate);
  return str;
}
fromate(ONE_DAY + ONE_HOURS + ONE_MINUTES + 10000);
// 去假值
const arr = ['', false, 1, 21, 'bytedance', null, undefined];

function filer(arr = []){
  return arr.filter(item=>!!item)
} 