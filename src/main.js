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
  QInput
} from 'quasar'

import * as firebase from 'firebase'
import router from './router'
import store from './store'

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
    QInput
  }
}) // Install Quasar Framework
Vue.use(Vuelidate) // validate

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
      firebase.initializeApp({
        apiKey: 'AIzaSyCNrNZbm97DWP4kFi_SQgp13hiz2xVrgqk',
        authDomain: 'time-spent-app.firebaseapp.com',
        databaseURL: 'https://time-spent-app.firebaseio.com',
        projectId: 'time-spent-app',
        storageBucket: 'time-spent-app.appspot.com'
      })
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.$store.dispatch('autoSignIn', user)
          this.$store.dispatch('fetchUserData')
        }
      })
    }
  })
})
