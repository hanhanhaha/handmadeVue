export function myProxy(vm, proxyKey, key){
    Object.defineProperty(vm, key, {
        get() {
            return vm[proxyKey][key]
        },
        set(newValue) {
            vm[proxyKey][key] = newValue
        }
    })
}