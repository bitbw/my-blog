// 写出一个函数trans，将数字转换成汉语的输出，输入为不超过10000亿的数字。
// 例如：trans(123456) —— 十二万三千四百五十六
// trans（100010001）—— 一亿零一万零一

function trans(num) {
    // 数字汉字对照表
    let numMap = {
        "0": "零",
        "1": "一",
        "2": "二",
        "3": "三",
        "4": "四",
        "5": "五",
        "6": "六",
        "7": "七",
        "8": "八",
        "9": "九",
    }
    // 基础单位 "十", "百", "千"
    let unitMapBase = ["十", "百", "千"]
    // "万", "亿", "兆" ...
    let unitMap = ["万", "亿", "兆"]
    // 转换字符串
    num += ""
    // 结果
    let resStr = ""
    // 从从后向前 比如 123456 的 1 对应的i就是6, 2对应的i就是5 用来计算单位: 6就是十,5就是万
    for (let i = num.length; i > 0; i--) {
        // 当前对应的下标
        let index = num.length - i
        let curNum = num[index]
        // 当前位的数字中文
        let chn = numMap[curNum]
        resStr += chn
        // 是零就不拼单位
        if (curNum == "0") {
            continue
        }
        let unit = ""
        let unitIndex = i - 1
        // 计算单位
        // i - 1 %4 !== 0 说明是 "十", "百", "千" 其中之一
        let subIndex = unitIndex % 4
        if (subIndex !== 0) {
            unit = unitMapBase[subIndex - 1]
            //  (i - 1 %4 == 0 ) && (i - 1 !== 0) 说明是 "万", "亿", "兆" 其中之一
        } else {
            if (unitIndex !== 0) {
                unit = unitMap[(unitIndex / 4) - 1]
            }
        }
        resStr += unit
    }
    // 去除多余的零
    return resStr.replace(/零+/g, "零")

}

let str = trans(100010001)
console.log("Bowen ~ file: 02.js ~ line 57 ~ str", str)
// 使用数组的方法实现堆栈 队列
// push shift 队列
// push pop   栈


