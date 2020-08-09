import { defaultTagRE } from './parse'
// <div id="app" style="color:red"> hello {{name}} <span>hello</span></div>
// 生成render函数
// render(){
//    return _c('div',{id:'app',style:{color:red},_v('hello'+_s(name)),_c('span',null,_v('hello')))
// }
export function generate(el) {
    let children = genChildren(el) //生成子元素
    let code = `_c('${el.tag}',${genProps(el.attrs)}${children ? `,${children}` : ''})`
    return code
}
function gen(node) {
    if (node.type === 1) {
        return generate(node) //生成元素节点字符串
    } else {     // hello{{name}} -->_v('hello'+_s(name))
        let text = node.text  //获取文本
        console.log(text)
        // 如果是普通文本 不带{{}}
        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`
        }
        let tokens = [] //存放每一段的代码
        let lastIndex = defaultTagRE.lastIndex = 0 // 如果正则是全局模式，需要将lastIndex每次使用前置为0
        let match, index //每次匹配到的结果

        while (match = defaultTagRE.exec(text)) {
            index = match.index //保存匹配到的索引
            if (index > lastIndex) {
                tokens.push(JSON.stringify(text.slice(lastIndex, index)))
            }
            tokens.push(`_s(${match[1].trim()})`)
            lastIndex = index + match[0].length
        }
        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }
        return `_v(${tokens.join('+')})`
    }
}

function genChildren(el) {
    const children = el.children
    if (children.length !== 0) {  // 将所有转化后的儿子用逗号拼接起来
        return children.map(child => gen(child)).join(',')
    }
    return children
}
function genProps(attrs) {
    if (!(attrs.length)) return undefined
    // console.log(attrs)
    let str = ''
    attrs.forEach(attr => {
        if (attr.name === 'style') {
            let obj = {}
            attr.value.split(';').forEach(item => {
                let [key, value] = item.split(':')
                obj[key] = value
            })
            attr.value = obj
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    });
    return `{${str.slice(0, -1)}}` // slice（0，-1） 去掉最后拼接的逗号
}