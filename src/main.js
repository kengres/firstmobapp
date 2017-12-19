// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

// Uncomment the following lines if you need IE11/Edge support
// require(`quasar/dist/quasar.ie`)
// require(`quasar/dist/quasar.ie.${__THEME}.css`)

import Vue from 'vue'
import Vuelidate from 'vuelidate'
// import quasar and single components
import Quasar,
{
  QBtn,
  QCard,
  QCardMain,
  QCardMedia,
  QCardSeparator,
  QCardTitle,
  QCarousel,
  QFixedPosition,
  QField,
  QLayout,
  QModal,
  QIcon,
  QInput,
  QItem,
  QItemTile,
  QItemSide,
  QItemMain,
  QToolbar,
  QToolbarTitle
} from 'quasar'

import { router } from './router'
import store from './store'

import Auth from './auth'
Vue.config.productionTip = false
Vue.use(Quasar, {
  components: {
    QBtn,
    QCard,
    QCardMain,
    QCardMedia,
    QCardSeparator,
    QCardTitle,
    QCarousel,
    QFixedPosition,
    QField,
    QLayout,
    QModal,
    QIcon,
    QInput,
    QItem,
    QItemTile,
    QItemSide,
    QItemMain,
    QToolbar,
    QToolbarTitle
  }
}) // Install Quasar Framework
Vue.use(Vuelidate) // validate
Vue.use(Auth)

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'
// import 'quasar-extras/ionicons'
// import 'quasar-extras/fontawesome'
// import 'quasar-extras/animate'

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    store,
    router,
    render: h => h(require('./App').default),
    created () {
      console.log('app created...')
      this.$auth.firebaseInit()
      this.$auth.getUser()
        .then(response => {
          console.log('app getting user...: ', response)
          this.$store.dispatch('autoSignIn', response)
          // this.$store.dispatch('fetchUserData')
        })
        .catch(error => {
          console.log('app user error: ', error)
        })
    }
  })
})
