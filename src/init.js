import { initState } from './state'
import { compileToFunctions } from './compiler/index'
import { mountComponent } from './lifecycle'
export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this
        vm.$options = options
        initState(vm)

        //渲染逻辑开始
        // 如果当前有el属性，说明要渲染模板
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    Vue.prototype.$mount = function (el) {
        // 挂载操作
        const vm = this
        const options = vm.$options
        el = document.querySelector(el)
        vm.$el = el
        if (!options.render) {
            // 没有render函数的话，将template转换成render
            let template = options.template
            if (!template && options.el) { // 连template也没有
                template = el.outerHTML
            }
            // 将template（模板）编译成render函数
            const render = compileToFunctions(template)
            // 把render 放到options上面
            options.render = render
        }
        // 生成render函数后，开始挂载这个组件
        mountComponent(vm,el)
    } 
}