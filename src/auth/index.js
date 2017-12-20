import * as firebase from 'firebase/app'
import 'firebase/auth'
import { firebaseConfig } from '../config'

export default (Vue) => {
  Vue.auth = {
    firebaseInit () {
      if (firebase.apps.length === 0) {
        console.log('is production ', process.env.NODE_ENV === 'production')
        console.log('initializing the firebase...')
        firebase.initializeApp(firebaseConfig)
        return
      }
      console.log('already have firebase... returning')
    },
    getUser () {
      if (firebase.apps.length === 0) {
        console.log('no firebase in get user... initializing')
        this.firebaseInit()
      }
      console.log('getting a user')
      return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            console.log('got the user... resolving')
            resolve(user)
            return user
          }
          else {
            reject(new Error('No user'))
          }
        })
      })
    },
    logUserOut () {
      return new Promise((resolve, reject) => {
        firebase.auth().signOut()
          .then(resp => {
            console.log('sing out resp: ', resp)
            resolve('done')
          })
          .catch(error => {
            console.log('sing out error: ', error)
            reject(error)
          })
      })
    }
  }

  Object.defineProperties(Vue.prototype, {
    $auth: {
      get () {
        return Vue.auth
      }
    }
  })
}
