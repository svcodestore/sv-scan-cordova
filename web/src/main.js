import Vue from 'vue'
import App from './App.vue'
import { router } from './router'
import { VueAxios } from './utils/request'

Vue.config.productionTip = false

Vue.use(VueAxios)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

if (window.location.protocol === 'file:' || window.location.port === '8080') {
  var cordovaScript = document.createElement('script')
  cordovaScript.setAttribute('type', 'text/javascript')
  cordovaScript.setAttribute('src', 'cordova.js')
  document.body.appendChild(cordovaScript)
}
