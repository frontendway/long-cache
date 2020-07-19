import longCache from './long-cache/Index.vue'

export const LongCache = longCache

let _vue = null
export default {
  install: Vue => {
    if (_vue) return
  
    _vue = Vue
    Vue.component('long-cache', longCache)
  }
}
