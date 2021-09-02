

/**
 * @description: 多个请求一次发出的时候，创建一个请求队列数量固定 ，等到一个返回后在向请求队列中添加一个请求
 * @param {*}
 * @return {*}
 */

async function requestQueue(requestList, n) {
    return new Promise((resolve, reject) => {
        // pointer 代表持续往后走的指针， pointer === requestList.length - 1 说明全部调用完成
        let pointer = n
        // 第一次使用循环n次 调用fetch方法
        for (let i = 0; i < n; i++) {
            let request = requestList[i]
            fetch(request, i)
        }
        let responseList = []
        // fetch方法发起请求 一个返回后就掉用n的下一个，直到全部调用完成 返回resolve结果
        function fetch(request, i) {
            request.then((res) => {
                pointer++
                responseList[i] = res
                if (pointer < requestList.length - 1) {
                    fetch(requestList[pointer], pointer)
                } else {
                    resolve(responseList)
                }
            }).catch((error) => {
                reject(error)
            })
        }
    })

}

// linkedList 链表
// stack    堆栈
// queue    队列