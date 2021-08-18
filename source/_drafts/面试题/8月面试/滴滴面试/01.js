/**
 * @description: 深度克隆
 * @param {*} data
 * @return {*}
 */
function deepclone(data) {
    if (typeof data === 'string' || 'number' || 'boolean') {
        return data
    }

    if (Object.prototype.toString(data) === '[Object  Object]') {
        let obj = {}
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const element = data[key];
                obj[key] = deepclone(element)
            }
        }
        return obj
    }

    if (Object.prototype.toString(data) === '[Object  Array]') {
        let arr = []
        for (const item of data) {
            arr.push(deepclone(item))
        }
        return arr
    }
    if (Object.prototype.toString(data) === '[Object  Date]') {
        return new Date(data)
    }

    if (Object.prototype.toString(data) === '[Object  RegExp]') {
        return new RegExp(data)
    }
}