import { observe } from "./observer/index"
import { myProxy } from "./util"

export function initState(vm) {
    const opts = vm.$options
    if (opts.data) {
        initData(vm)
    }
}
function initData(vm) { //数据的初始化操作
    let data = vm.$options.data
    vm._data = data = typeof data === 'function' ? data.call(vm) : data
    // 进行数据劫持
    // 数组单独处理
    Object.keys(data).forEach(key => myProxy(vm, '_data', key)) // 代理取值，取key对应的属性时，其实是去_data下取值
    observe(data)
}