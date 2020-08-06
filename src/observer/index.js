import { arrayMethods } from "./array"

export function observe(data) {
    if (typeof data !== 'object' || data === null) {
        return data
    }
    if (data.__ob__) {
        return data
    }
    return new Observer(data)
}
class Observer {
    constructor(value) {
        Object.defineProperty(value, '__ob__', {
            enumerable: false,
            configurable: false,
            value: this
        })
        // 使用defineProperty重新定义属性
        if (Array.isArray(value)) {
            // 讲可以改变数组的方法统统劫持，push pop shift unshift splice sort recerse
            // 叫做函数劫持，或者叫做切片编程
            // Object.setPrototypeOf(value,arrayMethods)
            value.__proto__ = arrayMethods
            // 观测数组中的对象类型
            this.observeArray(value)
        } else {
            this.walk(value)
        }
    }
    observeArray(arr) {
        arr.forEach(item => observe(item))
    }
    walk(data) {
        let keys = Object.keys(data)
        keys.forEach(key => {
            defineReactive(data, key, data[key])
        })
    }
}
function defineReactive(data, key, value) {
    observe(value)
    Object.defineProperty(data, key, {
        get() {
            // console.log('获取值了')
            return value
        },
        set(newValue) {
            // console.log('设置值了')
            if (value === newValue) return
            //    判断一下新赋值的值是不是一个对象,如果是继续观测拦截
            observe(newValue)
            value = newValue
        }
    })
}