import Vue from 'vue'
import App from './App.vue'
import { ThreeJs_Composer } from './utils/ThreeJs_Composer'
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
