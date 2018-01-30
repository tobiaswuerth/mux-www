// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMaterial from 'vue-material'

import App from './App'
import LoginPage from './pages/LoginPage'

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import 'material-design-icons/iconfont/material-icons.css'

Vue.use(VueRouter)
Vue.use(VueMaterial)

Vue.config.productionTip = false

const routes = [
  {
    path: '/login', component: LoginPage
  }
]
const router = new VueRouter({
  routes: routes,
  mode: 'history'
})

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
}).$mount('#app')
