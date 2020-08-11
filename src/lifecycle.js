import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {  // 把虚拟dom变成真实dom
        console.log(vnode, '------------------')
        const vm = this
        patch(vm.$el, vnode)
    }
}
export function mountComponent(vm, el) {
    //先调用render方法创建虚拟节点，再调用update方法将虚拟节点更新到真实节点并页面

    // 1、先调用render方法创建虚拟节点
    vm._update(vm._render())
}