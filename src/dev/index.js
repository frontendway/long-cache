import Vue from 'vue'
import App from './App.vue'
import LongCache from '../long-cache/Index.vue'
import router from './router/index.js'

Vue.component('long-cache', LongCache)

new Vue({
  el: '#app',
  router,
  render: c => c(App)
})
