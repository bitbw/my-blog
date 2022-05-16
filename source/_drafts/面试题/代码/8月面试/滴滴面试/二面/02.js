let list = [
    {
        name: 'a',
        next: 'b'
    },
    {
        name: 'b',
        next: 'c'
    },
    {
        name: 'c',
        next: 'a'
    },
]
/**
 * @description: 循环队列的指针反转
 * @param {*} list
 * @return {*}
 */
function reverse(list) {
    // 从后向前遍历 使没一项的next都等于上一项的name ,没有上一项就使用最后一项
    for (let i = list.length - 1; i > 0; i--) {
        let item = list[i]
        let per = list[i - 1 < 0 ? i - 1 : list.length - 1]
        item.next = per.name
    }
}