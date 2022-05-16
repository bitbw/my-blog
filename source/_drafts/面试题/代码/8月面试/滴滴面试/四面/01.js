// 去除字符串中出现次数最少的字符，不改变原字符串的顺序
// 例：“ababac” —— “ababa”
// “aaabbbcceeff” —— “aaabbb”

function test(str) {
    let map = {}
    for (const char of str) {
        if (!map[char]) {
            map[char] = 1
        } else {
            map[char] += 1
        }
    }
    let keys = Object.keys(map)
    keys.sort((a, b) => map[a] - map[b])
    // 最少次数
    let minCunt = map[keys[0]]
    for (const key of keys) {
        // 将最少次数的字符 替换为 ""
        if (map[key] === minCunt) {
            let reg = new RegExp(key, "g")
            str = str.replace(reg, "")
        }
    }
    return str
}

let str = test("ababac")
console.log("Bowen ~ file: 01.js ~ line 29 ~ str", str)

