Promise._all = function (promiseList) {
    let count = 1;
    let resList = [];
    return new Promise((resolve, reject) => {
        for (const promise of promiseList) {
            promise.then((res) => {
                count++
                resList.push(res)
                if (count === promiseList.length) {
                    resolve(resList)
                }
            }).catch((err) => {
                reject(err)
            })
        }
    })

}