const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` //标签名
// ?:  指匹配不捕获
const qnameCapture = `((?:${ncname}\\:)?${ncname})`  // 捕获形如 my:xx
const startTagOpen = new RegExp(`^<${qnameCapture}`) //标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的</div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/  //匹配属性
const startTagClose = /^\s*(\/?)>/  // 匹配标签结束的   <div></div>  <br/>
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g   // 匹配{{ }}


export function parseHTML(html) {
    // <div id="app">hello {{name}} <span>world</span></div>
    // 转换为：
    // {
    //     tag:'div',
    //     parent:null,
    //     type:1,
    //     attrs:[],
    //     children:[
    //         {tag:null,parent:父div,attrs:[],text:hello {{name}} },
    //         {tag:'span',parent:父div}
    //     ]
    // }

    function createASTElement(tagName, attrs) {  // 生成AST语法树
        return {
            tag: tagName,
            type: 1, //元素类型
            children: [],
            attrs,
            parent: null
        }
    }
    let root
    let currentParent
    let stack = []
    //  ** 判断一下 标签是否符合预期 采用入栈 出栈解决， 开始标签进来 压入栈中，
    //  ** 碰到结束标签时，拿出栈中最后一个元素，比对是否一致，如果一致，将最后一个元素出栈
    function start(tagName, attrs) {
        let element = createASTElement(tagName, attrs)
        if (!root) {
            root = element
        }
        currentParent = element // 当前解析的标签 保存起来
        stack.push(element)
    }
    function end(tagName) { //在结尾标签处，创建父子关系
        let element = stack.pop() //取出栈中最后一个元素,用于标签校验
        currentParent = stack[stack.length-1] //改变当前父元素为栈中最后一个元素
        if(currentParent){ // 在闭合时可以知道这个标签的父亲是谁
            element.parent = currentParent
            currentParent.children.push(element)
        }
    }
    function chars(text) {
        text = text.replace(/\s/g, '') //将文本的空格去掉
        if(text){
            currentParent.children.push({
                type:3, // 文本类型 type是3
                text
            })
        }
        console.log(text, '-------------文本标签---------------')
    }


    while (html) { //只要html不为空字符串就一直解析
        let textEnd = html.indexOf('<')
        if (textEnd == 0) {//肯定是标签
            const startTagMatch = parseStartTag() // 开始标签匹配的结果，处理开始
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }
            const endTagMatch = html.match(endTag)
            if (endTagMatch) { // 处理结束标签
                advance(endTagMatch[0].length)
                end(endTagMatch[1])  // 将结束标签传入
                continue
            }
        }
        let text
        if (textEnd > 0) { // 处理文本
            text = html.substring(0, textEnd)
        }
        if (text) {
            advance(text.length)
            chars(text)
        }
        // break
    }
    function advance(n) { // 传入截取的位置，向前进 ，截取字符串
        html = html.substring(n)  // 截取后 替换原有字符串
    }
    function parseStartTag() {
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length)  //删除开始标签
            // 如果直接是闭合标签了 说明没有属性
            let end
            let attr
            // 不是结尾标签，能匹配到属性
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
                console.log(match.attrs)
                advance(attr[0].length) // 去掉当前属性
            }
            if (end) { // 把 > 也删除
                advance(end[0].length)
                return match
            }
        }
        console.log(html)
    }
    return root
}