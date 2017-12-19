import Vue from 'vue'
import VueRouter from 'vue-router'
// landing page
import Landing from '@/Landing'
import Login from '@/Login'
import Register from '@/Register'
// components
// import Account from '@/Account.vue'
// import AddLog from '@/AddLog.vue'
import Layout from '@/Layout.vue'
import Home from '@/Home.vue'
import Error404 from '@/Error404.vue'

// nav routes
import { nav } from '../config'
Vue.use(VueRouter)

export default new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */

  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),

  routes: [
    {
      path: nav.landingUrl,
      component: Landing
    },
    {
      path: nav.loginUrl,
      component: Login
    },
    {
      path: nav.registerUrl,
      component: Register
    },
    {
      path: nav.homeUrl,
      component: Layout,
      children: [
        {
          path: nav.homeUrl,
          component: Home
        }
      ]
    },

    // Always leave this last one
    { path: '*', component: Error404 } // Not found
  ]
})
