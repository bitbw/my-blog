var data = [
    { id: 1, name: "办公管理", pid: 0 },
    { id: 2, name: "请假申请", pid: 1 },
    { id: 3, name: "出差申请", pid: 1 },
    { id: 4, name: "请假记录", pid: 2 },
    { id: 5, name: "系统设置", pid: 0 },
    { id: 6, name: "权限管理", pid: 5 },
    { id: 7, name: "用户角色", pid: 6 },
    { id: 8, name: "菜单设置", pid: 6 },
];

/**
 * @description: 通过data 生成 tree
 * @param {*} arr  data
 * @param {*} pid 0
 * @param {*} tree 空数组
 */
function buildTree(arr, pid = 0, tree = []) {
    for (let i = 0; i < arr.length; i++) {
        const obj = arr[i];
        if (obj.pid === pid) {
            tree.push(obj)
            arr.splice(i, 1)
            i--
        }
    }
    if (!tree.length) {
        return
    }
    for (const item of tree) {
        item.children = []
        if (arr.length > 0) {
            buildTree(arr, item.id, item.children)
        }
    }
    return tree
}
let tree = buildTree(data)
console.log(tree)