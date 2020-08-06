// 拿到数组原型上的方法
let oldArrayProtoMethod = Array.prototype
// export let arrayMethods = {}
// Object.setPrototypeOf(arrayMethods,oldArrayProtoMethod)
export let arrayMethods = Object.create(oldArrayProtoMethod)
let methods = ['pop', 'push', 'shift', 'unshift', 'sort', 'splice', 'reverse']
methods.forEach(method => {
    arrayMethods[method] = function (...args) {
        const result = oldArrayProtoMethod[method].apply(this, args)
        let inserted
        console.log(this)
        let ob = this.__ob__
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break;
            case 'splice':
                inserted = args.slice(2)  // arr.splice(0,2,99) args=[0,2,99]
            default:
                break;
        }
        if(inserted) {
           ob.observeArray(inserted)
        }
        return result
    }
})