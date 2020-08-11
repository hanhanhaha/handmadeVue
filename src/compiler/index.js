import { parseHTML } from "./parse"
import { generate } from "./generate"

export function compileToFunctions(template) {
    //HTML 模板 ==>render函数
    //HTML-->AST 可以用AST树来描述语言本身   (eslint、webpack都有使用ast)

    // 注意：虚拟DOM 使用对象来描述DOM节点,可以放一些逻辑，自定义对结构转译；而AST不只能描述DOM节点，还能描述JS、css等语言本身，对语法转译
    // 比如 const a = 1 ，使用AST可描述为 {indentifier:const,name:a,value:1}


    // 1、将html代码转换成ast语法树
    let ast = parseHTML(template)
    console.log(ast)
    // 2、优化静态节点，通过遍历树（略）
    
    // 3、通过AST 重新生成render函数代码
    let code = generate(ast)
    console.log(code)
    
    // 4、将字符串变成函数,限制取值范围，通过with来进行取值，稍后调用render函数就可以通过改变this，让这个函数内部取到结果,
    // 后续调用render函数时，可以通过render.call(vm)调用，render内部就可以拿到vm内的属性和方法
    let render = new Function(`with(this){return ${code}}`)
    return render
}