
/**
 * @description: 防抖
 * @param {*}
 * @return {*}
 */
function debounce(fn, wait = 1000) {
    // 返回一个函数 判断有没有 timer 没有就退出
    let timer
    return function () {
        if (!itemr) {
            return
        }
        const context = this
        const arg = arguments;
        timer = setTimeout(() => {
            timer = null
        }, wait)
        fn.apply(context, arg)
    }

}