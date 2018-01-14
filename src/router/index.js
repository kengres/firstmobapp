import Vue from 'vue'
import Router from 'vue-router'
// landing page
import Landing from '@/Landing'
import Login from '@/Login'
import Register from '@/Register'
// components
import Layout from '@/Layout.vue'
// into account
import Home from '@/Account/AAHome'
import AddActivity from '@/Account/Activity/addActivity'
import SingleActivity from '@/Account/Activity/singleActivity'
import About from '@/Account/About'
import Profile from '@/Account/Profile'
import Error404 from '@/Error404.vue'

// nav routes
import { nav } from '../config'
Vue.use(Router)

export const routes = [
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
        component: Home,
        meta: {
          title: 'Work Time Manager'
        }
      },
      {
        path: nav.addActivityUrl,
        component: AddActivity,
        meta: {
          title: 'Add Activity'
        }
      },
      {
        path: `${nav.singleActivityUrl}/:id`,
        component: SingleActivity,
        meta: {
          title: 'Edit Activity'
        }
      },
      {
        path: nav.aboutUrl,
        component: About,
        meta: {
          title: 'About'
        }
      },
      {
        path: nav.profileUrl,
        component: Profile,
        meta: {
          title: 'Profile'
        }
      }
    ]
  },

  // Always leave this last one
  { path: '*', component: Error404 } // Not found
]

export const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: routes
})
