export function renderMixin(Vue) { // 用对象来描述dom结构
    Vue.prototype._c = function () { // 创建虚拟dom元素
        return createElement(...arguments)
    }
    Vue.prototype._s = function (val) { // stringify
        return val == null ? '' : (typeof val == 'object') ? JSON.stringify(val) : val
    }
    Vue.prototype._v = function (text) { // 创建虚拟dom文本元素
        return createTextVnode(text)
    }
    Vue.prototype._render = function () {
        const vm = this
        const render = vm.$options.render
        let vnode = render.call(vm)
        return vnode
    }
}
function createElement(tag, data = {}, ...children) {
    return vnode(tag, data, data.key, children, undefined)
}
function createTextVnode(text) {
    return vnode(undefined, undefined, undefined, undefined, text)
}
function vnode(tag, data, key, children, text) { //用来产生虚拟dom的,虚拟节点就是一个对象
    return { //还可以定义更多的自定义属性
        tag, data, key, children, text
    }
}