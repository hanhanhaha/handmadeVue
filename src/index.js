import { initMixin } from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './vdom/index'
function Vue(options){
    this._init(options)
}
// Vue的渲染流程 => 先初始化数据 => 将模板进行编译 => 生成render函数 => 生成虚拟Dom => 生成真实Dom => 扔到页面

//写成一个个的插件进行对原型的扩展
initMixin(Vue)  //混入初始化的方法
lifecycleMixin(Vue)
renderMixin(Vue)
export default Vue