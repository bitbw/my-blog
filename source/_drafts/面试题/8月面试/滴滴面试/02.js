
/**
 * @description: 判断是否为两边相对的 字符串  例如 aaddaa  ada  aacaa , 不是的类型 adadc
 * @param {*} str
 * @return {*}
 */
function isDoubleBack(str) {
    let mid = Math.ceil(str.length / 2)
    let a, b
    if (str.length % 2 !== 0) {
        // 单数就是 中间不看 对比两边 有一边需要反转
        a = str.slice(0, mid - 1)
        b = str.slice(mid).split("").reverse().join("")

    } else {
        // 双数就是 从中间切割 对比两边 有一边需要反转
        a = str.slice(0, mid)
        b = str.slice(mid).split("").reverse().join("")
    }
    return a === b

}
console.log("isDoubleBack: ", isDoubleBack("aadadaa"))
