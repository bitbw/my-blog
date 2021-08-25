

// 每个一段时间执行一次fn
/**
 * @description: 
 * @param {*} fn 需要执行的函数
 * @param {*} times 次数
 * @param {*} interval 间隔时间
 * @return {*}
 */
async function repeat(fn, times, interval) {
    for (let i = 0; i < times; i++) {
        await new Promise((resolve, reject) => setTimeout(() => {
            try {
                fn()
                resolve()
            } catch (error) {
                reject()
            }
        }, interval))
    }


}

/**
 * @description:  实现一个promise.all
 * @param {*}
 * @return {*}
 */

Promise._all = function (arr) {
    let resList = []
    return new Promise((resolve, reject) => {
        for (const promise of arr) {
            promise.then((res) => resList.push(res)).catch(e => reject(e))
        }

    })



}
