export function patch(oldVnode, vnode) { // 将虚拟节点转换为真实节点
    console.log(oldVnode, vnode)
    let el = createElm(vnode); // 创造新的真实节点
    let oldParentEl = oldVnode.parentNode // 获取到旧节点的父节点
    oldParentEl.insertBefore(el, oldVnode.nextSibling) // 通过父节点将新生成的节点插入到老的子节点的前面
    oldParentEl.removeChild(oldVnode) //通过父节点将原来的旧节点移除
}

function createElm(vnode) {
    let { tag, data, key, children, text } = vnode
    if (typeof tag === 'string') { // 如果是元素
        vnode.el = document.createElement(tag)
        children.forEach(child => {
            vnode.el.appendChild(createElm(child))
        })
    } else {
        vnode.el = document.createTextNode(text) //如果是文本
    }
    return vnode.el
}