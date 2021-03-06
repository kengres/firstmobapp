// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
// require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

// Uncomment the following lines if you need IE11/Edge support
// require(`quasar/dist/quasar.ie`)
// require(`quasar/dist/quasar.ie.${__THEME}.css`)

import Vue from 'vue'
import VueCordova from 'vue-cordova'
import Vuelidate from 'vuelidate'
import vuexI18n from 'vuex-i18n'
// import quasar and single components
import Quasar,
{
  GoBack,
  QBtn,
  QCard,
  QCardActions,
  QCardMain,
  QCardMedia,
  QCardSeparator,
  QCardTitle,
  QCarousel,
  QDatetime,
  QDatetimeRange,
  QFab,
  QFixedPosition,
  QField,
  QIcon,
  QInput,
  QItem,
  QItemTile,
  QItemSeparator,
  QItemSide,
  QItemMain,
  QLayout,
  QModal,
  QList,
  QListHeader,
  QPopover,
  QSelect,
  QToolbar,
  QToolbarTitle
} from 'quasar'

import { router } from './router'
import store from './store'
Vue.use(vuexI18n.plugin, store, {
  onTranslationNotFound: (locale, key) => {
    console.warn(`vuex-i18n :: Key '${key}' not found for locale '${locale}'`)
  }
})
import localeEn from './languages/local-en'
import localeFr from './languages/local-fr'

Vue.i18n.add('en', localeEn)
Vue.i18n.add('fr', localeFr)
Vue.i18n.fallback('en')
Vue.i18n.set('en')

import Auth from './auth'
Vue.config.productionTip = false
Vue.use(Quasar, {
  components: {
    QBtn,
    QCard,
    QCardActions,
    QCardMain,
    QCardMedia,
    QCardSeparator,
    QCardTitle,
    QCarousel,
    QDatetime,
    QDatetimeRange,
    QFab,
    QFixedPosition,
    QField,
    QIcon,
    QInput,
    QItem,
    QItemTile,
    QItemSeparator,
    QItemSide,
    QItemMain,
    QLayout,
    QList,
    QListHeader,
    QPopover,
    QSelect,
    QModal,
    QToolbar,
    QToolbarTitle
  },
  directives: {
    GoBack
  }
}) // Install Quasar Framework
Vue.use(VueCordova) // Vue cordova
Vue.use(Vuelidate) // validate
Vue.use(Auth)

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'
// import 'quasar-extras/ionicons'
// import 'quasar-extras/fontawesome'
import 'quasar-extras/animate'

Quasar.start(() => {
  /* eslint-disable no-new, no-undef */
  new Vue({
    el: '#q-app',
    store,
    router,
    render: h => h(require('./App').default),
    created () {
      console.log('app created...')
      this.$auth.firebaseInit()
      this.$auth.getUser()
        .then(user => {
          console.log('app getting user...: ', user)
          this.$store.dispatch('autoSignIn', user)
        })
        .catch(error => {
          console.log('app user error: ', error)
        })
    }
  })
})
