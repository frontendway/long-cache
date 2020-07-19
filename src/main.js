import LongCache from './long-cache/Index.vue'

let _vue = null

LongCache.install = Vue => {
  if (_vue) return

  _vue = Vue
  Vue.component('long-cache', LongCache)
}

export default LongCache
