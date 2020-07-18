import VueKeep from './vue-keep/Index.vue'

let _vue = null

VueKeep.install = Vue => {
  if (_vue) return

  _vue = Vue
  Vue.component('long-cache', VueKeep)
}

export default VueKeep
