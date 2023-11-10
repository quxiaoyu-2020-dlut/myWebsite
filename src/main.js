import Vue from "vue"
import VueRouter from "vue-router"
import App from "./App.vue"
import routes from "./router/router"
// import { createRouter, createWebHistory } from "vue-router"

// const router = createRouter({
//   history: createWebHistory(),
//   routes: routes,
// })
Vue.use(VueRouter) // 使用VueRouter插件
Vue.config.productionTip = false
const router = new VueRouter({
  routes,
  mode: "hash",
})

new Vue({
  render: h => h(App),
  router,
}).$mount("#app")
